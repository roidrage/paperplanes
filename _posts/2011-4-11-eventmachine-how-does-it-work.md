---
title: EventMachine, How Does It Work?
layout: post
topics: ruby eventmachine networking nodejs
---
At this year's Scottish Ruby Conference, I gave a talk about EventMachine,
[slides](http://eventmachine-scotrubyconf.heroku.com/) are available, if you're interested.  Amidst the hype around
Node.js it's too easy to forget that Ruby has had evented I/O libraries for years. EventMachine, libebb, rev, to name a
few. As a general introduction I highly recommend reading [Dan Kegel's article on the C10K
problem](http://www.kegel.com/c10k.html), the problem of handling 10000 server connections on a single machine. It
introduces all the evented approaches that have been implemented in the different operating systems over the last some
15 years.

In preparation for the talk I got curious about EventMachine's innards, as I have a tendency of wanting to find out
how things work internally, even if it sometimes involve going deeper. So I thought it'd be nice to share my findings
with you. Node.js kids, pay attention, this concerns you as well. It may be JavaScript, but in the end Node.js works in
a similar fashion, though it builds on [libev](http://software.schmorp.de/pkg/libev.html), which does most of the
plumbing for the different operating system implementations of non-blocking I/O.

Most of the magic happens inside the C++ part of EventMachine, so now's as good a time as any to dig into it and find
out how it works. There'll be code in here, not assembler, but I'll be throwing constants and standard library functions
and TCP networking bits (from C, not from Ruby) at you. There's no magic however, and when in doubt, consult the man
pages. You do know about man pages, right? They're awesome.

### while(true): The Event Loop

EventMachine is based on the idea of an event loop, which is basically nothing more than an endless loop. The standard
snippet of code you're wrapping all your evented code is this:

    EM.run do
      # go forth and handle events
    end

You can look at the details of what the method does in [its full
glory](https://github.com/eventmachine/eventmachine/blob/bd77b0503557de565d3cc9b629ab260b4055bc9d/lib/eventmachine.rb#L185-240).
On the Ruby level, this initializes a bunch of variables, fires callbacks that were already given to EventMachine using
`EM.next_tick` before the reactor was initialized, and goes into the C library immediately, where from now on, most of
the internal magic happens.

Three C/C++ extension files are of importance,
[`ext/rubymain.cpp`](https://github.com/eventmachine/eventmachine/blob/6f7885166746e4dca124780432c8315cd57ca89d/ext/rubymain.cpp)
is the bridge between Ruby and the C code layer. It uses Ruby's C functions, mostly to convert datatypes for the later
below. It then calls into code defined in
[`ext/cmain.cpp`](https://github.com/eventmachine/eventmachine/blob/6f7885166746e4dca124780432c8315cd57ca89d/ext/cmain.cpp),
which in turn bridges the C and the C++ code.

As an example, here's the C code of the method `t_run_machine_without_threads`, which is called as `run_machine` from
`EM.run`. EventMachine is basically a bunch of C++ class abstracting behaviour like handling file descriptors and other
things.  The real magic happens in
[`ext/em.cpp`](https://github.com/eventmachine/eventmachine/blob/6f7885166746e4dca124780432c8315cd57ca89d/ext/em.cpp),
where we find the method
[`EventMachine_t::Run()`](https://github.com/eventmachine/eventmachine/blob/6f7885166746e4dca124780432c8315cd57ca89d/ext/em.cpp#L427)
which basically controls the event loop, with the interesting bits (for now) shown below

     while (true) {
       _UpdateTime();
       if (!_RunTimers())
         break;

      _AddNewDescriptors();
      _ModifyDescriptors();

      if (!_RunOnce())
        break;
      if (bTerminateSignalReceived)
        break;
    }

There's your event loop, doesn't look that scary now, right? It basically does five things:

* Update the current time (line 2)
  Used in the next step to determine whether a timer should be fired

* Run configured timers (line 3)
  All the timers specified through either `add_timer` or `add_periodic_timer` are run here. When you add a timer,
  EventMachine stores it in a map indexed with the time it's supposed to fire. This makes checking the list for the ones
  that should be fired in the current iteration of the event loop doesn't require iterating over the full list every
  time. The time it's supposed to fire is calculated whenever you add a timer to the list leaving it to the map
  implemenation's sorting algorithm to keep the data as efficient as possible..

  [`_RunTimers()`](https://github.com/eventmachine/eventmachine/blob/6f7885166746e4dca124780432c8315cd57ca89d/ext/em.cpp#L1008)
  iterates over the list of timers until it reaches one entry whose key (i.e. the time it's supposed to fire) is higher
  than the current time. Easy and efficient.

  On a side note, `_RunTimers` always returns true, so it's a bit weird that the return value is checked.

* Add new descriptors (line 6)
  We're slowly getting to the interesting parts. Whenever you open a new server connection, EventMachine adds an object
  representing the connection and the associated callbacks to this list. All connections and descriptors created in the
  last iteration are handled, which basically includes setting additional options if applicable and add them to the list
  of active connections.

  In case you're not aware, on the operating system level a descriptor represents a file handle or a socket connection.
  So when you open a file, create a connection to another machine or create a server to listen for incoming connections,
  all of them are represented by descriptors, which are basically integers pointing into a list maintained by the
  operating system.

* Modify descriptors (line 7)
  Modify existing descriptors, if applicable. This only has any effect when you're using epoll, which we'll get to
  later.

**EventMachine Lesson #1**: It's just an endless loop.

### Open a Socket

Before we dive into the bowels of the EventMachine code where the magic happens, it's well worth investigating what
happens when you open a new connection to a server, which is done using `EM.connect`, which in turn calls
`EventMachine_t::ConnectToServer()` on the C++ level. You can enjoy the [code in all its
glory](https://github.com/eventmachine/eventmachine/blob/6f7885166746e4dca124780432c8315cd57ca89d/ext/em.cpp#L1008)
yourself, we'll go through the interesting bits below.

The code involves a small set of system calls to basically create the socket and open a connection. Initialization
starts with the following snippet, which sets up the basic data structures for use with the following system calls.

    int family, bind_size;
    struct sockaddr bind_as, *bind_as_ptr = name2address (server, port, &family, &bind_size);
    if (!bind_as_ptr)
      throw std::runtime_error ("unable to resolve server address");

The next bit opens our beloved socket.

    int sd = socket (family, SOCK_STREAM, 0);
    if (sd == INVALID_SOCKET) {
      char buf [200];
      snprintf (buf, sizeof(buf)-1, "unable to create new socket: %s", strerror(errno));
      throw std::runtime_error (buf);
    }

### Don't block the Socket!

The socket is marked as type `SOCK_STREAM`, which is a constant saying we want a TCP connection. No connection has been
made so far, we merely reserved a socket descriptor in the process' table.  Next, EventMachine sets a couple of options,
basically sprinkling the non-blocking awesome sauce on the file descriptor.

    if (!SetSocketNonblocking (sd)) {
      close (sd);
      throw std::runtime_error ("unable to set socket as non-blocking");
    }

The method `SetSocketNonblocking()` is a small abstraction around the `fcntl` system call, which is used to set the
`O_NONBLOCK` option on the descriptor. EventMachine uses it wherever any sort of descriptor is created. Setting a
descriptor to non-blocking means that you can call `read` and have it immediately return if no data is available, and
`write` will not block. Both will return the error `EAGAIN` to signal the process to try again later.

The next snippet disables the [Nagle algorithm](http://en.wikipedia.org/wiki/Nagle's_algorithm) that's in effect by
default for TCP connections. The Nagle algorithms buffers data before it's send to reduce the amount of TCP packages
required. This delays sending of packages, which is usually not what you want in a high throughput environment.

    int one = 1;
    setsockopt (sd, IPPROTO_TCP, TCP_NODELAY, (char*) &one, sizeof(one));
    setsockopt (sd, SOL_SOCKET, SO_REUSEADDR, (char*) &one, sizeof(one));

The second call to `setsockopt` is an additional speedup, allowing a server to reuse an address and port tuple (which
uniquely identifies a connection's endpoint on a machine), even when it's still waiting for the connection to fully
close. This state called [`TIME_WAIT`](http://developerweb.net/viewtopic.php?id=2941) and means that the connection
still allows for data to arrive even though it's been already closed. This way TCP makes sure all the data you've asked
for arrives eventually, even though your application may not even fully expect it.

Sockets in this state tend to stick around for a while, so
[`SO_REUSEADDR`](http://www.unixguide.net/network/socketfaq/4.11.shtml) lets you reuse them faster without waiting for
all the data that ain't going to come anyway. Imagine a web server opening and closing thousands of connections within
just seconds. If it wouldn't be able to reuse sockets in `TIME_WAIT` it'd have to wait for the sockets to fully close to
become available again, which would kill the web server's performance after a while.

**EventMachine Lesson #2**: Descriptors must be configured to not block on read and write operations.

**EventMachine Lesson #3**: Disable Nagle algorithm for immediate data delivery.

**EventMachine Lesson #4**: Reuse connections in `TIME_WAIT` to better handle thousands of concurrent connections that are
coming and going quickly.

### Bind to a local port

This is only relevant if you're starting a server, i.e. something that serves clients through a specific port they can
connect to. `ConnectToServer()` is indifferent on whether you're starting a server on that socket or using it as a
client. `bind_addr` is the method parameter used to check whether the process should be bound to this address and the
specified port. Both are method parameters, which `EM.connect` just conveniently sets to nil.

    if (bind_addr) {
      int bind_to_size, bind_to_family;
      struct sockaddr *bind_to = name2address (bind_addr, bind_port, &bind_to_family, &bind_to_size);
      if (!bind_to) {
        close (sd);
        throw std::runtime_error ("invalid bind address");
      }
      if (bind (sd, bind_to, bind_to_size) < 0) {
        close (sd);
        throw std::runtime_error ("couldn't bind to address");
      }
    }

In line 3 both address and port are parsed to create the socket structure required by `bind()`, with line 7 creating the
actual binding. Think of this as giving a name to this socket, which the rest of the world can then use to talk to it,
using the server's IP and the port it's bound to.

There's no real EventMachine going on here, so let's move right on to get this connection up and running.

### Connect (finally!)

We're getting to the meat of setting up a connection. Bear with me, this will all make sense eventually, I hope. We'll
be looking at the Unix part of this, because I honestly don't want to look at the Windows part.

The first line connects the socket to the outside world if you will. If this is a client connection the TCP handshake
will be initiated, and we're almost good to go.

    if (connect (sd, &bind_as, bind_size) == 0) {
      ..

Usually, `connect()` returns the `EINPROGRESS` error for non-blocking sockets, so flow will mostly end up in the code
below. `errno` is a static variable that contains the last error. `getsockopt` is consulted to check whether there was
an actual error when connecting the socket.

    else if (errno == EINPROGRESS) {
      int error = 0;
      socklen_t len;
      len = sizeof(error);
      int o = getsockopt (sd, SOL_SOCKET, SO_ERROR, &error, &len);
      if ((o == 0) && (error == 0)) {
        ConnectionDescriptor *cd = new ConnectionDescriptor (sd, this);
        if (!cd)
          throw std::runtime_error ("no connection allocated");
        cd->SetConnectPending (true);
        Add (cd);
        out = cd->GetBinding();
      } else {
        e = error;
      }
    }

If all goes well, EventMachine finally initializes a new `ConnectionDescriptor` object, which will, among other things,
fire the event that eventually calls `post_init` on a connection object, a method you can overwrite yourself to do
custom  Then it marks the connector as pending by calling `cd->SetConnectPending(true)` in line 10,

**EventMachine Lesson **: Connections are immediately created, but don't necessarily finish setting up until later.

**EventMachine Lesson **

### Things you should be reading

These books are pretty old, but have gone through some revisions and updates, and they're still the classics when it
comes to lower level Unix (network) programming and understanding TCP/IP, which I consider very important. TCP/IP
Illustrated is one of the best books I've read so far, and I consider it essential knowledge to be aware of what happens
under the networking hood.

* TCP/IP Illustrated Vol. 1
* Unix Network Programming
* Advanced Programming in the Unix Environment
