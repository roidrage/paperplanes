---
title: What is Automation?
topics: operations
layout: post
---
In our circles, automation is most frequently associated with infrastructure,
tools like Puppet and Chef, automating away your server provisioning and
deployments.

While this is an important part and by now ingrained in our culture thanks to
DevOps, it's by far the only part that defines automation in distributed
systems.

The biggest challenge of a distributed system is to run reliably, without much
human intervention, and entirely on its own.

It has to handle network partition, increased error conditions in part of the
system, deal with scalability issues, provide good performance throughout.

It has to deal with failure constantly.

We'd like the impact of handling failures to be as little as possible, to
require as little human involvement as possible. The distributed system ideally
takes care of itself as much as possible.

We've introduced barriers, bulkheads, circuit breakers, exponential back-offs,
all to make sure our distributed system doesn't kill itself. Unfortunately they
have a tendency to do that, especially under conditions with increased load or
increased failure rates.

This is the part where automation gets interesting and incredibly hard. This is
the part where you decide how a system should behave when certain conditions
occur in production. This is the part where you consider how you want humans to
notice and interpret the unusual conditions and how they should respond to it.

According to ["Thinking in Systems"](http://amzn.to/18fCnpX), complex systems
are based on feedback loops. They continue to feed activity in the system, and
changes in the feedback loop affect the outcome with every pass.

In distributed system, the most common feedback loop you'll find is a
[reinforcing feedback loop](http://www.systems-thinking.org/theWay/sre/re.htm).
Instead of just feeding the loop, it increases or decreases its output to get to
the desired outcome in a way that affects other components in the system.

Slow request times caused requests to pile up and continue to hammer the system
more and more. Back-offs and retries hit the system more than once, causing an
increase in overall request volume. Slow disks affect all parts that read from
them, causing delays throughout. I'm sure you can think of lots of other
scenarios.

As we learned, [humans make poor
monitors](http://www.paperplanes.de/2012/7/10/on-resilience-in-automated-systems-failures-and-human-factor.html)
for automated systems, so they need to be as tightly integrated into the process
  as possible, allowing highest visibility into what the system is doing.

While the system should be able to defend itself against any production issues,
it shouldn't cut out the operator, quite the opposite. The operator should be an
integral part of the process of running it.

But everything the system is doing, what it has been tasked by its engineers to
do under specific circumstances, is automation.

What is automation?

What follows is the simplest definition I could think of that applies best to
the system we build. I'd love to hear your take on it.

**Automation is everything a complex system decides on doing in response to
ever-changing and emerging conditions.**
