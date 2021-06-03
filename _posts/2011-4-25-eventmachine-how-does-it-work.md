---
title: EventMachine, How Does It Work?
layout: post
tags: ruby eventmachine networking nodejs
comments_disabled: true
---
At this year's [Scottish Ruby Conference](http://scottishrubyconference.com/), I gave a talk about
[EventMachine](http://rubyeventmachine.com), [slides](http://eventmachine-scotrubyconf.heroku.com/) are available.
Amidst the hype around Node.js it's too easy to forget that Ruby has had evented I/O libraries for years.
[EventMachine](http://rubyeventmachine.com), [libebb](http://tinyclouds.org/libebb/), [rev](http://rev.rubyforge.org/),
[cool.io](http://coolio.github.com/), to name a few. As a general introduction I recommend reading [Dan Kegel's article
on the C10K problem](http://www.kegel.com/c10k.html), the problem of handling 10000 server connections on a single
machine. It introduces all the evented approaches that have been implemented in the different operating systems over the
last some 15 years.

In preparation for the talk I got curious about EventMachine's innards. So I thought it'd be nice to share my findings
with you. Node.js kids, pay attention, this concerns you as well. It may be JavaScript, but in the end Node.js works in
a similar fashion, though it builds on [libev](http://software.schmorp.de/pkg/libev.html), which does most of the
plumbing for the different operating system implementations of non-blocking I/O.

Most of the magic happens inside the C++ part of EventMachine, so now's as good a time as any to dig into it and find
out how it works. There'll be code in here, not assembler, but I'll be throwing constants, standard library functions
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
Other than initializing some things, it dives down into the C++ layer immediately, and it's where most of the magic
happens from now on.

Three C/C++ extension files are of importance,
[`ext/rubymain.cpp`](https://github.com/eventmachine/eventmachine/blob/6f7885166746e4dca124780432c8315cd57ca89d/ext/rubymain.cpp)
is the bridge between Ruby and the C code layer. It uses Ruby's C functions, mostly to convert datatypes for the later
below. It then calls into code defined in
[`ext/cmain.cpp`](https://github.com/eventmachine/eventmachine/blob/6f7885166746e4dca124780432c8315cd57ca89d/ext/cmain.cpp),
which in turn bridges the C and the C++ code.

When you call `EM.run` to start the event loop, it calls down into the C layer to `t_run_machine_without_threads`, which
is called as `run_machine`, and which in turn calls
[`EventMachine_t::Run()`](https://github.com/eventmachine/eventmachine/blob/6f7885166746e4dca124780432c8315cd57ca89d/ext/em.cpp#L427),
whose interesting bits are shown below.

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
  that should be fired in the current iteration a cheap operation.

  [`_RunTimers()`](https://github.com/eventmachine/eventmachine/blob/6f7885166746e4dca124780432c8315cd57ca89d/ext/em.cpp#L1008)
  iterates over the list of timers until it reaches one entry whose key (i.e. the time it's supposed to fire) is higher
  than the current time. Easy and efficient.

  On a side note, `_RunTimers` always returns true, so it's a bit weird that the return value is checked.

* Add new descriptors (line 6)

  Whenever you open a new server connection, EventMachine adds an object representing the connection and the associated
  callbacks to this list. All connections and descriptors created in the last iteration are handled, which basically
  includes setting additional options if applicable and add them to the list of active connections.

  On the operating system level a descriptor represents a file handle or a socket connection.  When you open a file,
  create a connection to another machine or create a server to listen for incoming connections, all of them are
  represented by descriptors, which are basically integers pointing into a list maintained by the operating system.

* Modify descriptors (line 7)

  Modify existing descriptors, if applicable. This only has any effect when you're using epoll, which we'll get to
  later.

* Run the event (line 9)

  Check all open file descriptors for new input. Read whatever's available, run the associated event callbacks. The
  heart of the event loop, worth taking a closer look below.

The event loop really is just an endless loop after all.

### Open a Socket

When you call `EM.connect` to open a connection to a remote server, the connection will be immediately created, but it
may not finish until later. The resulting connection will have a bunch of properties:

* The descriptor is configured to not block on input and output by setting the socket option `O_NONBLOCK`. This way
  reads will immediately return when there's no data instead of waiting for some to arrive, and writes don't necessarily
  write all the data they're given. It also means that a call to
  [`connect()`](http://www.kernel.org/doc/man-pages/online/pages/man2/connect.2.html) to create a new connection returns
  before it's fully created.

* The Nagle algorithm is disabled to prevent the TCP stack from delaying sending packets by setting `TCP_NODELAY` on the
  socket. The operating system wants to buffer output to send fewer packets. Disabling Nagle causes any writes to be
  sent immediately. As EventMachine does internal buffering, it's preferrable for the data to be really sent when it's
  eventually written to a socket.

* Reuse connections in `TIME_WAIT` state before they're fully removed from the networking stack. TCP keeps connections
  around for a while, even after they're closed to ensure that all data from the other side really, really made it to
  your end. Nice and all, but in environments with a high fluctuation of connnections, in the range of hundreds to
  thousands per second, you'll run out of file descriptors in no time.

Opening a socket is an immediate event, it happens as soon as you create a new connection. Running any callbacks on it
won't happen until the next iteration of the event loop. That's why it's safe to e.g. fire up a new HTTP request and
then attach callbacks to it. Even if that wouldn't be the case, EventMachine's
[Deferrables](https://github.com/eventmachine/eventmachine/blob/master/docs/DEFERRABLES) (not to be confused with
`EM.defer`) ensure that callbacks are fired even after the original event fired, when they're added at a later time.

What is immediately called, though, is the `post_init` method on the connection object.

Opening a network connection is just one thing you can do with EventMachine, but as it's the one thing you're most
likely to do when you're using it, let's leave it at that.

### Don't call us, we'll call you

Working with asynchronous code in EventMachine usually involves callbacks, unless you work with your own connection
class. Libraries like [`em-http-request`](https://github.com/igrigorik/em-http-request) rely on deferrables to
communicate with your application. They're fired when a HTTP request finished or failed. But how does a library keep
track of data that only comes in bit by bit?

The answer is simply buffering. Which brings us to the core of the event loop, checking sockets for input, which is done
from the ominous `_RunOnce()` method in the code snippet above. EventMachine can utilize three mechanisms to check
descriptors for new input.

### select(*)

The default is using [`select()`](http://www.kernel.org/doc/man-pages/online/pages/man2/select.2.html), a standard
system call to check a collection of file descriptors for input, by way of Ruby's implementation `rb_thread_select()`,
which wraps the call to `select()` with a bunch of code ensuring thread safety.

Using `select()` pretty much works everywhere, and is perfectly fine up to a certain number of file descriptors. If
you're simply serving an asynchronous web application or API using EventMachine, this may be totally acceptable.

Implementing this way of handling I/O is rather straight-forward, if you look at the
[implementation](https://github.com/eventmachine/eventmachine/blob/master/ext/em.cpp#L823-957). Collect all file
descriptors that may be of interest, feed them into select, read and/or write data when possible.

What makes using `select()` a bit cumbersome is that you always have to assemble a list of all file descriptors for
every call to `_RunOnce()`, so EventMachine iterates over all registered descriptors with every loop. After select ran,
it loops over all file descriptors again, checking to see if `select` marked them as ready for reads and/or writes.

When `select()` marks a descriptor as ready for read or write operations that means the socket will not block when data
is read from or written to it. In the case of reading that usually means the operating system has some data buffered
somewhere, and it's safe to read that data without having to wait for it to arrive, which in turn would block the call.

Instead of using `select()`, EventMachine could also use
[`poll()`](http://www.kernel.org/doc/man-pages/online/pages/man2/poll.2.html) instead, which just handles a bit nicer in
general, but is not available in the Ruby VM. 

### epoll

[epoll](https://github.com/eventmachine/eventmachine/blob/master/docs/EPOLL) is Linux' implementation for multiplexing
I/O across a large number of file descriptors.

The basic steps of using epoll are simple:

* Set up an epoll instance using
  [`epoll_create`](http://www.kernel.org/doc/man-pages/online/pages/man2/epoll_create.2.html), done initially when the
  event loop is created. This creates a virtual file descriptor pointing to a data structure that keeps track of all
  real file descriptors associated with it in the next step.

  You only need to reference this single file descriptor later, so there's no need to collect a list of all file
  descriptors, as is the case when `select()` is used.

* Register interest for events on a file descriptor using
  [`epoll_ctl`](http://www.kernel.org/doc/man-pages/online/pages/man2/epoll_ctl.2.html) on the epoll instance created
  above.

  This is used in `_AddNewDescriptors` and `_ModifyDescriptors` to register and update EventMachine's file descriptors
  with epoll. In fact, both methods only do anything noteworthy when epoll is used. Otherwise they just iterate over a
  list of descriptors, pretty much doing nothing with them.

* Wait for input with [`epoll_wait`](http://www.kernel.org/doc/man-pages/online/pages/man2/epoll_wait.2.html) for a
  specified duration. You can wait forever, return immediately if nothing happened, or wait for a specific amount of
  time.

  EventMachine seems to have chosen to return immediately if there's no activity. There's an alternative implementation
  calculating the time to wait based on the likelihood of a specific event (e.g a timer firing) to fire on the next
  event loop iteration, but it doesn't seem to ever be used. Seems to be a relict from the time it could also be used as
  a C++ library.

epoll events are registered for both reads and writes, with `epoll_wait` returning the number of file descriptors that
are ready for both events.

Using epoll has a big advantage, aside from being much more efficient than select in general for larger sets of file
descriptors. It spares code using it the burden of constantly iterating over a list of file descriptors. Instead you
just register them once, and then only iterate over the ones affected by the last call to `epoll_wait`.

So epoll requires a bit more work when you add or modify connections, but is a bit nicer on the eyes when it comes to
actually polling them for I/O availability.

Note that epoll support must be explicitly enabled using `EM.epoll`.

### kqueue

kqueue is the BSD equivalent of epoll, and is available on e.g. FreeBSD and Mac OS X. It works very similar to epoll. If
you want to know more details, I'd suggest [reading the paper on it by Jonathan
Lemon](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.79.3925&rep=rep1&type=pdf).

You can enable kqueue support using `EM.kqueue`, which is, just like `EM.epoll`, a noop on systems that don't support
it. Hopefully future EM versions will use whatever's available on a particular system as default.

### Call me already!

All three mechanisms used have one thing in common: when data is read, `receive_data` is called immediately, which
brings us back to the question of how a connection objects collects data coming in.

Whenever data is ready to be consumed from a socket, EventMachine calls `EventDescriptor::Read()`, which reads a bunch
of data from the socket, in turn calling [`read()`](http://www.kernel.org/doc/man-pages/online/pages/man2/read.2.html)
on the file descriptor, and then immediately executes the callback associated with the descriptor, which usually ends up
calling `receive_data` with the data that was just read. Note that the callback here refers to something defined on the
C++ level, not yet a Ruby block you'd normally use in an asynchronous programming model.

`receive_data` is where you will usually either buffer data or run some action immediately. em-http-request feeds the
data coming in directly into an HTTP parser. Whatever you do in here, make it quick, don't process the data for too
long. A common pattern in libraries built on EventMachine is to use a `Deferrable` object to keep track of a request's
state, firing callbacks when it either succeeded or failed.

Which brings me to the golden rule of programming with libraries like EventMachine and Node.js: DON'T BLOCK THE EVENT
LOOP!! Defer whatever work you can to a later run of the loop when it makes sense, or push it to another asynchronous
processing facility, e.g. a message queue like RabbitMQ or Redis' Pub/Sub.

In a similar fashion, whenever you write data to a connection using `send_data`, it's first buffered, and not actually
sent until the socket is ready for a non-blocking call to
[`write()`](http://www.kernel.org/doc/man-pages/online/pages/man2/write.2.html). Hence all three implementations check
for both read and write availability of a descriptor.

### Fibers vs. Spaghetti

Where do Ruby's Fibers come in here? Callbacks can easily lead to spaghetti code, especially when you have to nest them
to run multiple asynchronous actions in succession.

Fibers can stop execution of a process flow at any time and yield control to some other, controlling entity or another
Fiber. You could, for example, wrap a single HTTP request into a fiber and yield back control when all the callbacks
have been assigned.

In the callbacks you then resume the Fiber again, so that processing flow turns into a synchronous, procedural style
again.

      def get(url)
        Fiber.new do
          current_fiber = Fiber.current
          request = EM::HttpRequest.new(url).get
          request.callback { current_fiber.resume(request) }
          request.errback  { current_fiber.resume(request) }
          Fiber.yield
        end
      end

`Fiber.yield` returns whatever object it was handed in `Fiber.resume`. Wrap this in a method and boom, there's your
synchronous workflow. Now all you need to do is call `get('http://paperplanes.de')` and assign something with the return
value. Many props to [Xavier Shay for digging into the Goliath
source](http://rubysource.com/understanding-concurrent-programming-with-ruby-goliath/) to find out how that stuff works.
Helped me a lot to understand how that stuff works.  If you never had a proper use case for Fibers in real life, you do
now.

[`em-synchrony`](https://github.com/igrigorik/em-synchrony) is a library doing just that for a lot of existing EventMachine libraries, and
[Goliath](http://goliath.io) is an evented web server, wrapping a Rack-style API using Fibers.

### Things you should be reading

Here's a bunch of free reading tips for ya. These books are pretty old, but have gone through some revisions and
updates, and they're still the classics when it comes to lower level Unix (network) programming and understanding
TCP/IP, which I consider very important. TCP/IP Illustrated is one of the best books I've read so far, and I consider it
essential knowledge to be aware of what happens under the networking hood.

* [TCP/IP Illustrated Vol.  1](http://www.amazon.com/gp/product/0201633469/ref=as_li_tf_tl?ie=UTF8&tag=javaddicts-20&linkCode=as2&camp=217145&creative=399353&creativeASIN=0201633469)
* [Unix Network Programming](http://www.amazon.com/gp/product/0131411551/ref=as_li_tf_tl?ie=UTF8&tag=javaddicts-20&linkCode=as2&camp=217145&creative=399353&creativeASIN=0131411551)
* [Advanced Programming in the Unix
  Environment](http://www.amazon.com/gp/product/0321525949/ref=as_li_tf_tl?ie=UTF8&tag=javaddicts-20&linkCode=as2&camp=217145&creative=399353&creativeASIN=0321525949)

Also, read the fine man pages. There's a whole bunch of good documentation installed on every Unix-style system, and I
linked to a couple of them relevant to this post already. Read it.

### yield

This concludes today's whirlwind tour through some of EventMachine's internals. There's actually not too much magic
happening under the covers, it's just wrapped into a bit too much code layering for my taste. But you be the judge.

Play with EventMachine and/or Node.js if you haven't already, try to wrap your head around the asynchronous programming
model. But for the love of scaling, don't look at evented and asynchronous I/O as the sole means of scaling, because
it's not.
