---
title: On Pager Duty
tags: operations
layout: post
---
Over the last year, as we started turning [Travis CI](http://travis-ci.org) into
a [hosted product](http://travis-ci.com), we added a ton of metrics and
monitoring.  While we started out slow, we soon figured out which metrics are
key and which are necessary to monitor the overall behavior of the system.

I built us a custom collector that rakes in metrics from our database and from
the API exposed by RabbitMQ. It soon dawned on me that these are our core
metrics, and that they need not only graphs, we need to be alerted when they
cross thresholds.

The first iteration of that dumped alerts into Campfire. Given that we're a
small team and the room might be empty at times, that was just not sufficient
for an infrastructure platform that's used by customers and open source projects
around the world, at any time of the day.

So we added alerting, by way of [OpsGenie](http://opsgenie.com). It's set up to
trigger alerts via iPhone push notifications and escalations via SMS, should an
alert not have been acknowledged or closed within 10 minutes. Eventually,
escalation needs to be done via voice calls so that someone really picks up.
It's easy to miss a vibrating iPhone when you're sound asleep, but much harder
so when it keeps on vibrating until someone picks up.

### A Pager for every Developer

Just recently I read an [interview with Werner
Vogels](http://queue.acm.org/detail.cfm?id=1142065) on architecture and
operations at Amazon. He said something that struck with me: "You build it, you
run it."

That got me thinking. Should developers of platforms be fully involved in the
operations side of things?

A quick survey on Twitter showed that there are some companies where developers
are paged when there are production issues, others fully rely on their
operations team.

There's merit to both, but I could think of a few reasons why developers should
be carrying a pager just like operations does.

You stay connected to what your code does in production. When code is developed,
the common tool to manage expectations is to write tests. Unfortunately, no unit
test, no integration test will be fully able to reproduce circumstances of what
your code is doing in production.

You start thinking about your code running. Reasoning about what a particular
piece of code is doing under specific production circumstances is hard, but not
entirely impossible. When you're the one responsible for having it run smoothly
and serve your customers, this goes up to a whole new level.

Metrics, instrumentation, alerting, logging and error handling suddenly become a
natural part of your coding workflow. You start [making your software more
operable](http://omniti.com/seeds/instrumentation-and-observability), because you're the one who has to run it. While software should be
easy to operate in any circumstances, it commonly isn't. When you're the one
having to deal with production issues, that suddenly has a very different
appeal.

Code beauty is suddenly a bit less important than making sure your code can
treat errors, timeouts, increased latencies. Kind of an ironic twist like that.
Code that's resilient to production issues might not have a pretty DSL, it might
not be the most beautiful code, but it may be able to sustain whatever issue is
thrown at it.

Last, when you're responsible for running things in production, you're forced to
learn about the entire stack of an application, not just the code bits, but its
runtime, the host system, hardware, network. All that turns into something that
feels a lot more natural over time.

I consider that a good thing.

There'll always be situations where something needs to be escalated to the
operations team, with deeper knowledge of the hardware, network and the like.
But if code breaks in production, and it affects customers, developers should be
on the front of fixing it, just like the operations team.

Even more so for teams that don't have any operations people on board. At some
point, a simple exception tracker just doesn't cut it anymore, especially when
no one gets paged on critical errors.

### Being On Call

For small teams in particular, there's a pickle that needs to be solved: who
gets up in the middle of the night when an alert goes off?

When you have just a few people on the team, like your average bootstrapping
startup, does an on call schedule make sense? This is something I haven't fully
figured out yet.

We're currently in the fortunate position that one of our team members is in New
Zealand, but we have yet to find a good way to assign on call when he's out or
for when he's back on this side of the world.

The folks at dotCloud have [written about their
schedule](http://blog.dotcloud.com/organizing-a-24x7-bullet-proof-on-call-rotati),
thank you! Hey, you should share your pager and on-call experiences too!

Currently we have a first come first serve setup. When an alert comes in and
someone sees it, it gets acknowledged and looked into. If that involves everyone
coming online, that's okay for now.

However, it's not an ideal setup, because being able to handle an alert means
being able to log into remote systems, restart apps, inspect the database, look
at the monitoring charts. Thanks to iPhone and iPad most of that is already
possible today.

But to be fully equipped to handle any situation, it's good to have a laptop at
hand.

This brings up the question: who's carrying a laptop and when? Which in turns
means that some sort of on-call schedule is still required.

We're still struggling on this, so I'd love to read more about how other
companies and teams handle that.

### Playbooks

During a recent [hangops](http://hangops.com) discussion, there was a chat about
developers being on call.  It brought up an interesting idea, a playbook on how
to handle specific alerts.

It's a document explaining things to look into when an alert comes up. Ideally,
an alert already includes a link to the relevant section in the book. This is
something operations and developers should work on together to make sure all
fronts are covered.

It takes away some of the scare of being on call, as you can be sure there's
some guidance when an issue comes up.

It also helps refine monitoring and alerts and make sure there are appropriate
measures available to handle any of them. If there are not, that part needs
improving.

I'm planning on building a playbook for Travis as we go along and refine our
monitoring and alerts, it's a neat idea.

### Sleepless in Seattle

There's a psychological side to being on-call that needs a lot of getting used
to: the thought that an alert could go off at any time. While that's a natural
thing, as failures do happen all the time, it's easy to mess up your head. It
certainly did that for me.

Lying in bed, not being able to sleep, because your mind is waiting for an
alert, it's not a great feeling. It takes getting used to. It's also why having
an on-call schedule is preferable over an all hands scenario. When only one
person is on call, team mates can at least be sure to get a good night's sleep.
As the schedule should be rotating, everyone gets to have that luxury on a
regular basis.

It does one thing though: it pushes you to make sure alerts only go off for
relevant issues. Not everything needs to be fixed right away, some issues could
be taken care of by improving the code, others are only temporary fluxes because
of increased network latency and will resolve themselves after just a few
minutes. Alerting someone on every other exception raised doesn't cut it
anymore, alerts need to be concise and only be triggered when the error is
severe enough and affects customers directly. Getting this right is the hard
part, and it takes time.

All that urges you to constantly improve your monitoring setup, to increase
relevance of alerts, and to make sure that everyone on the team is aware of the
issues, how they can come up and how they can be fixed.

It's a good thing.
