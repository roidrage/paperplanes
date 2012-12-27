---
title: A Plea for Client Library Instrumentation
topics: monitoring
layout: post
---
The need to measure everything that moves in a distributed system or even simple
web apps is becoming the basis for thorough monitoring of an application.

However, there is one thing that's starting to get in the way of of getting good
measurements of all layers in a system: client libraries used to talk to network
services, be it the database, an API, a message bus, anything that's bound to
the intricate latency variances of the network stack.

Without full instrumentation of all parts of the application's stack, it's going
to be very hard to figure out where exactly a problems boils down to. Measuring
client access to a network service in addition to collecting data on the other
end, e.g. the slow query log, allows you to pinpoint issues to the network, to
increased latency, or to parsing responses.

If the other end is not under your control, it's just as important to have this
data available. Having good metrics on request latencies to an external service,
even a database hosted by a third party, gives you a minimum amount of
confidence that while you maybe can't fix the underlying problem, you at least
have the data to show where the problem is most likely to be. Useful data to
have when approaching the third party vendor or hosting company about the issue.

Rails has set a surprisingly good example, by way of
[ActiveSupport::Notifications](http://api.rubyonrails.org/classes/ActiveSupport/Notifications.html).
Controller requests are instrumented just as database queries of any kind.

You can subscribe to the notifications and start collecting them in your own
metrics tool. [StatsD](https://github.com/etsy/statsd),
[Graphite](http://graphite.wikidot.com) and [Librato
Metrics](http://metrics.librato.com) are pretty great tools for this purpose.

There's not much a client library needs to do to emit measurements of network
requests. The ones for Ruby could start by adding optional instrumentation based
on AS::Notifications. That'd ensure that ActiveSupport itself doesn't turn into
a direct dependency. I'd love to see the notifications bit being extracted into
a separate library that's easier to integrate than pulling in the entire
ActiveSupport ball of mud.

Node.js has
[EventEmitters](http://nodejs.org/api/events.html#events_class_events_eventemitter),
which are similar to AS::Notifications, and they lend themselves quite nicely
for this purpose.
  
I've dabbled with this for [riak-js](https://github.com/mostlyserious/riak-js),
the Node.js library for Riak. [There's an
example](https://github.com/mostlyserious/riak-js/blob/master/examples/metrics.js)
that shows how to register and collect the metrics from the events emitted. The
library itself just emits the events at the right spot, adds some timestamps so
that event listeners can reconstruct the trail of a request.

It worked out pretty well and is just as easy to plug into a metrics library or
to report measurements directly to StatsD.

The thing that matters is that any library for a network service you write or
maintain, should have some sort of instrumentation built in. Your users and I
will be forever grateful.

This goes both ways, too. Network servers need to be just as diligent in
collecting and exposing data as the client libraries talking to them.
Historically, though, a lot of servers already expose a lot of data, not always
in a convenient format, but at least it's there.

Build every layer of your application and library with instrumentation in mind.
Next time you have to tackle an issue in any part of the stack, you'll be glad
you did.

Now go and [measure
everything](http://codeascraft.etsy.com/2011/02/15/measure-anything-measure-everything/)!
