---
title: On Notifications, Log Subscribers, and Bringing Sanity to Rails' Logging
topics: rails logging
layout: post
---
Wherein I write about Rails' current implementation of logging and ActiveSupport's
greatest feature that was added in 3.0.

I've been thinking a lot about logging lately. I'm a big fan of logging. I also
spent some quality time with a Rails app again recently. I'm not a big fan of
Rails' logging. Something needs to change, either me or Rails' logging. I opted
for the latter.

After some digging in I found that Rails 3 has improved quite significantly on
the logging front. The output is still the same unparsable mess it used to be,
but the way logging is implemented has changed quite drastically, and much for
the better, I'd argue.

With Rails 3, one important thing was added, that drives parts of the both
logging and benchmarking (e.g. for ActiveRecord's query measurements).
Everything is now built around notifications and instrumentation. When
ActiveRecord fires a query, it measure the time required and then triggers an
event with the recorded time. Whether someone picks up the event is not of its
concern. Which is exactly what the new notifications are about: separation of
concern.

I was surprised to find that not a lot of people seemed to know about them.
Let's have a short look at what it allows you to do.

### ActiveSupport::Notifications

The idea is far from new. The Pragmatic Programmer talked about blackboards, a
similar mechanism,
[Cocoa](https://developer.apple.com/library/ios/documentation/Cocoa/Reference/Foundation/Classes/NSNotificationCenter_Class/Reference/Reference.html)
has had something similar for ages, and now Rails has something like it too.

The basic idea is that you have a centralized repository where you can subscribe
to events, for example to the event ActionController triggers when it process an
action. Here's the code to extract the path that was requested by a user.

    ActionSupport::Notifications.subscribe('process_action.action_controller') do |event|
      puts event.payload[:path]
    end

Any number of subscribers can be attached to a message, they'll get notified.
The default implementation is synchronous, but nothing could and should keep you
from adding an implementation that uses a message queue instead.

This is pretty cool. I started using it to track metrics and not clutter the
code with the specifics. When something of interest happens, an event is
triggered. If someone listens, cool, if they don't we'll keep going. I could
have one subscriber that collects metrics and another one for tracer logging.

Rails uses these notifications all over the place, in particular for logging. To
avoid having lots of manual subscriptions to specific events, Rails also added a
mechanism to subscribe to events for the sole purpose of logging them and
without adding subscriptions manually for all of them. The LogSubscriber was
born.

### ActiveSupport::LogSubscriber

LogSubscribers are exactly that: easy ways to subscribe to events whose purpose
is logging. Of course what you do with the events is up to you, but that's their
main purpose. Every Rails component uses them, and every component has its own
implementation of a LogSubscriber. Here's an excerpt of the one used by
ActionController.

<script src="https://gist.github.com/2038889.js?file=action_controller_log_subscriber.rb"></script>

Every public method defined, except for `logger`, will be attached to an event
of the same name. So the three relevant events for this subscriber are
`start_processing` and `process_action`.

To make the improvement of notifications and log subscribers more visible,
[here's the
code](https://github.com/rails/rails/blob/2-3-stable/actionpack/lib/action_controller/benchmarking.rb#L44-105)
that did the same in Rails 2.3. You decide which you like better. I certainly
enjoy the decoupled-ness of the log subscriber a lot more.

When you defined your LogSubscriber, you can attach it to a namespace:

    ActionSupport::LogSubscriber.attach_to :action_view

This creates a new instance of the LogSubscriber and attaches all methods to
their corresponding events. The event names are along the same lines as the
example with `process_action.action_controller`. First the event's name, then
the component's name.

### Rails' Logging

The example above nicely brings me to Rails' logging. First up: I like Rails'
idea of logging everything, for development purposes it's awesome and pretty
helpful. When things are moved into production the fun stops for me though. The
logging out put is hard to parse, and it's hard to make sense of because it's
usually multiple lines per request.

Rails 3.2 recently added tagged logging and a request identifier to work around
that. But that still doesn't solve the problem of the output in general being
too noisy and hard to parse for a centralized logging service, or any logging
service. If you don't care about your logs then I'm sure you're fine, but I care
a great deal about my logs. When things break, they're the sole source of truth,
and I like to make sure they're valuable enough to fulfill that premise. Rails'
request logging gets in the way of that for the reasons outlined above.

To remind you of what we're talking about, here's an example log output for a
single request:

    Started GET "/" for 127.0.0.1 at 2012-03-10 14:28:14 +0100
    Processing by HomeController#index as HTML
      Rendered text template within layouts/application (0.0ms)
      Rendered layouts/_assets.html.erb (2.0ms)
      Rendered layouts/_top.html.erb (2.6ms)
      Rendered layouts/_about.html.erb (0.3ms)
      Rendered layouts/_google_analytics.html.erb (0.4ms)
    Completed 200 OK in 79ms (Views: 78.8ms | ActiveRecord: 0.0ms)

It reads pretty nicely for sure, but as soon as you add more processes that dump
their output in the same log, things get mingled and some of the information is,
in my opinion just not necessary in production.

So we have a pretty centralized approach to logging, and me wanting to do
something to improve the logging. Clearly the two could be made to work
together.

### Towards a Better Logging (in Production)

My ideal request logging is a single line per request, nothing more. That's
clearly at odds with the output above, but thanks to the fact that (almost)
everything is wrapped in log subscribers. Here's a line of something that would
fit my purpose pretty nicely:

    GET / format=html action=home#index status=200 duration=58.33 view=40.43 db=15.26

It's one line, it contains all the relevant information, it's pretty easy to
parse for a machine, and it's easy to read for the human eye. Some told me the
latter shouldn't be necessary, and I'm certainly not hung up on it, but I like
to be able to skim logs.

The message is pretty clear: the HTTP method, the URL and an slew of optional
parameters. If there's an exception that too should end up as single line. You
can log the stacktrace of course, but it's much harder to make sense of for the
same reason multiple lines of log output are hard to make sense of. They drown
in a river of log output from multiple sources. I thought about only storing
relations to an exception in the logs instead, e.g. an identifier or an error
code. Throw in a request identifier as metadata stored with the exception, and
you've got yourself a nice way to correlate exceptions and log lines.

How can we get to the output above? It turns out, it's actually pretty simple.
We need to unhook the log subscribers for ActionView and ActionController events
and hook in our own. The result is
[Lograge](https://github.com/roidrage/lograge), a logging experiment I extracted
into a library from the [Travis CI](http://travis-ci.org/) source code, where I
first started playing with the ideas I had around logging.

It adds its own log subscriber, discarding all irrelevant events, only accepting
two events instead of the whole bunch included by default. The result is a
single log line. Easy on the eyes, easy on the machine.

### An Experiment in Logging

My main goal is to eventually have a saner way of logging requests in Rails (or
any web framework, for that matter). Lograge is the beginning of that. I already
got great feedback on the general idea and on specifics like the log output.

I have also yet to solve how to properly log request parameters, so this is only
the beginning. I care a great deal about logging and I'd like to see that
eventually improve in Rails so that other people start caring for their logs
too, if only in production mode or as an optional feature. If not, Lograge
will be here for you. I also have Rails 2.3 on my radar if you're still using
that. It's a lot messier to implement, but not impossible.

If you want to know a bit more about the internals, the
[README](https://github.com/roidrage/lograge/blob/master/README.md) is a good place
to start. If you have any input on the ideas implemented in Lograge, the log
output or anything else, feel free to [open an
issue](https://github.com/roidrage/lograge/issues).  Let's talk about logging,
and let's make it better.
