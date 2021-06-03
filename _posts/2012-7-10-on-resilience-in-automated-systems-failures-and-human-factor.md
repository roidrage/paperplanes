---
title: On Resilience in Automated Systems, Failures and the Human Factor
layout: post
tags:
  - failure
  - resilience
  - weboperations
---
Recently I've been reading several posts on how humans can be a deadly factor
when complex and automated systems fail. Several posts diving into the issue are
well worth reading, in particular ["Automated to
Death"](http://spectrum.ieee.org/computing/software/automated-to-death/0), ["Are
We Automating Ourselves Into a
Corner?"](http://spectrum.ieee.org/riskfactor/computing/it/are-we-automating-ourselves-into-a-corner)
, ["Cockpit Crisis"](http://www2.macleans.ca/2011/08/24/cockpit-crisis/), and
["People Make Poor Monitors for
Computers"](http://www.macroresilience.com/2011/12/29/people-make-poor-monitors-for-computers/).
Hot off the presses is [James Hamilton's analysis on the official report of the
Fukushima
accident](http://perspectives.mvdirona.com/2012/07/09/OfficialReportOfTheFukushimaNuclearAccidentIndependentInvestigationCommissionExecutive.aspx).

While these articles put failures in automated systems in a practical and
unfortunately, catastrophic perspective, they go back to a paper that was
written in 1983 and describes the ["Ironies of
Automation"](http://www.ise.ncsu.edu/nsf_itr/794B/papers/Bainbridge_1983_Automatica.pdf), the path and fallacies of humans becoming simple operators of automated systems.

All of them have in common that they discuss failures in airplanes or other
complex systems that lead to catastrophic consequences, with the effects of the
problems exacerbated by human intervention or lack thereof. Some of them go
back to humans making the wrong decisions due to lack of proper training,
because a series of events occur that were deemed too unlikely to ever occur,
others because the systems was hiding valuable information.

Does all that ring a bell? It certainly did for me. That sounds a lot like the
things we're dealing with every day, building and operating automated systems,
making decisions when system components fail. Only we call them web
applications.

The upshot is that we can learn from the problems that lead to catastrophes and
loss of life and apply them to the field of web operations, because the
similarities in the systems and their operations are striking. The rather sad
news is that only recently have these other fields and instrustries started to
openly discuss failures in complex systems and how to respond to them. They're
no different from us. What we have is the advantage that we can iterate quickly
and make changes to improve our application's resilience.

The good news is also that there are no lives depending on what most of us do.
During an outage, the worst we do is piss off users, lose money or cause
inconvenience to our customers. Think about that for a minute compared to being
an element in a catastrophic chain of events that leads to the death of hundreds
if not thousands of people. I keep telling that to myself every now and then to
put things in perspective, to calm myself down when I have to deal with an
outage.

From simple systems that use only a small number of components to systems that
rely on lots of components and external services, they all are supposed to run
independent of human intervention. Even if they're "just" web applications with
a background component, that still makes them somewhat of a distributed,
automated system, and therefore prone to failure on many levels.

### The Crux of Automated Systems

What happens when things go wrong? What happens when the system is hiding
information from us and we need to make a decision quickly, maybe one that
involves taking a component offline and even losing money by doing so? How can
you prevent human intervention from causing financial loss? Most of us are lucky
enough that lives don't depend on our work, which certainly takes a bit of
pressure out of the equation.

But it still leaves the question: when a complex system fails, are we sure to
have all the information we need at hand to make a fair judgement of a) the
severeness of the situation and b) what to do to handle it? Are we prepared to
not let a small error turn into a cascading failure that propagates throughout
the whole system?

There are several ways to make sure you can improve on all these things in your
application. Some of them are basics, others are hard and take time. For all of
them, the question boils down to: which is more relevant to your business,
avoiding the upfront cost of investing in good operations or the cost of
extended downtime, and therefore, lost business, when failures to happen?

When you break down the reasons why a combination of an unlikely chain of events
and untrained human interaction, you can dig into ways to improve the operations
side of web applications. Maybe you can even generalize to other industries
where complex systems are involved and apply the same lessons. What follows is
my interpretation of how the problems that caused air planes to crash, nuclear
power plants to explode and financial systems to lose millions of dollars of
investment money can be applied to the field of web operations, to make sure
they won't affect us and the systems we run in production.

### Visibility and System Feedback

In the catastrophic chain of events that lead to planes crashing, the systems
weren't providing enough information for the pilots to make an educated decision
on what to do. Or they weren't able to draw the right conclusions based on the
data presented to them. Heck, in some cases the pilots ignored the data provided
by the system!

When you look at web applications, the still very underutilized way to gain
visibility into the system is monitoring, writing logs and tracking metrics,
keeping track of the events at every layer of the system. Together they give a
great deal of visibility into what's happening in a distributed, automated
system. The systems we build need to be transparent about what they do, and only
we can help them do so.

But for that, your data needs to be reliable, which in turn is a process. You
need to figure out which data is important for every aspect of the system and
keep tuning until you have all the information you need in the event of a
failure. Ironically it's going to need failures to figure out what you really
need.

I wrote about the [means of
monitoring](/2011/1/5/the_virtues_of_monitoring.html) your application should
have a while ago.  Though the market has improved a lot in terms of tooling the
gist is still the same. It's impossible to reason about what a system is
currently doing without any means of transparency into the system's activities.

The same is true for programming languages and code in general, but that's a
whole different story. Simplicity and being able to reason about what the system
and a particular piece of code is doing while keeping the bigger picture in mind
is hard.

### Build Systems with Humans in Mind

If people make poor monitors for computers, the software we build needs to keep
that in mind. When human intervention is necessary the system should be able to
not only offer the means for an operator to interact, disable components (think:
[feature flips](http://code.flickr.com/blog/2009/12/02/flipping-out/) or analyse
the current state of the system. It should also be able to compensate for human
error.

There's a crux in this. Trying to prevent human error from causing more harm in
the system even when intervention is necessary leads to more complex systems.
You add more layers of complexity to safeguard the system from human
intervention.

To make systems more resilient to failure, replication is a common means. If you
have one or more replicas around, you can survive a number of outages until data
becomes completely unavailable. But replication has the tendency to require ways
to synchronize data across all of the replicas. Which leads you to eventual
consistency and the CAP theorem.

Another thing to think about is what happens when all replicas have become
unavailable? All you're left with is a stack of software waiting for data to be
available. An incredibly unlikely yet at the same time not impossible scenario.

Systems get harder and harder to reason about as you relax the consistency
requirements in your application. Building systems that are prepared to deal
with these situations and still leaving human operators well informed is a
tough challenge.

Going back to building applications with the human in mind, the challenge maybe
is not so much to be able to compensate errors but being able to quickly recover
from them. If an application can continue working after it's been recovered from
a human error that followed an error in the system, the harm induced by both
issues could be greatly reduced.

### Reduce Causes for Cascading Failures

If you can reduce or narrow the lines where failures propagate throughout the
system, you reduce the likelihood that a larger number of components is affected
by a single outage, leading to cascading failures.

Failures have the tendency to propagate through several layers of your system.
To work around that, you can split up the application into chunks for a specific
number of users, reducing the impact an outage has, while on another level you
can use mechanisms like a circuit breaker to block errors from bubbling up from
a lower-level component.

Partitioning an application into swimlanes, both on the data storage side of
things and other layers of the application, is a common technique to isolate
problems to a smaller number of users. The likelihood of failures propagating
across more than one swimlane, as long as they're fully isolated, is very small.
Compare that to a setup where all users share the same parts of the
infrastructure and are likely to all be affected by problems in only one of
them.

The circuit breaker on the other hand is a means to isolate layers, inside a
swimlane if you will, from each other. When a lower-level components causes an
increasing number of errors, the layer above trips the circuit, failing all
subsequent requests immediately until the sub-system has recovered. Netflix has
written a [great
deal](http://techblog.netflix.com/2011/12/making-netflix-api-more-resilient.html)
about how they're [applying circuit
breakers](http://techblog.netflix.com/2012/02/fault-tolerance-in-high-volume.html)
in their systems.

Both patterns come from Michael Nygard's great book ["Release
It!"](http://amzn.to/pwoDun). If there's one book that
I'd recommend every web application developer should read, this is it. Heck,
read it twice.

Reducing the potential of cascading or propagating failures has the added
advantage that an operator can focus on a single problem. The more problems
humans are faced with the more likely they're going to freak out and lose focus
on solving a particular problem. Instead of putting out one fire, you're trying
to use one or two buckets of water to put out dozens of fires, all of them
re-igniting after you poured a little bit of water over them.

Consider the example of an Airbus A380, which had one of its engines explode and
cause more than fifty (!!) other components of the plane to fail in one way or
the other and to bring up an incredible amount of warnings and errors (both
audible and visual) in the cockpit.

If worse comes to worse, all of these components are in a failure state, but the
system needs to be designed in a way that can guide operators towards the most
severe damage in the system first instead of throwing a slew of errors at him,
causing confusion as to what needs to be fixed most urgently. Anyone who's been
flooded by Nagios or PagerDuty alerts can certainly relate to this.

### Practice Failures in Production

A lot of the incidents were exacerbated by the fact that humans were reduced
to monitors and supervisors of automated systems. Pilots are used to flying
mostly in auto-pilot mode, and they rarely train flying a plane without the
restrictions of the normal flight mode, with all the warnings and safety
precautions enabled, let alone on a real place, not just a simulator.

They rarely train these situations because they're deemed so unlikely to ever
happen. Yet, from time to time they do. The common consent from the articles
above is that text book training is not useful when you're faced with a
situation that's deemed so rare that no one even gave it thought in the written
material.

To make sure this doesn't happen, two things are necessary. First up, there
needs to be a deep involvement of development and operations when it comes to
building, shipping and running software in production. If everyone is involved in
the process, knowledge of what the software does and how it works is spread wide
enough. Everyone involved can reason, to a certain degree, about what the system
does and why it's doing it.

On the flip side, failure scenarios need to be part of the regular working
schedule. In this great talk on ["Resilient Response in Complex
Systems"](http://www.infoq.com/presentations/Resilient-Response-In-Complex-Systems),
which sparked this outburst you're currently reading (thank you, John Allspaw,
you're inspiring!), John talks about Game Days at Etsy.

On Game Day, some component of the production system, I repeat, production
system, is intentionally caused to fail. The purpose is to get people into the
habit of dealing with failure, to get them out of the comfort zone of relying on
previous experiences or on text book responses. Instead they have to solve a
real problem that is actively affecting production users in a timely manner. I
repeat, this is in production, on purpose.

Netflix' Chaos Monkey is a tool to randomly kill production instances on EC2.
The purpose is to figure out how the system behaves when several components
fail. Just recently they added more tools to their so called ["Simian
Army"](http://techblog.netflix.com/2011/07/netflix-simian-army.html), one to
induce artifial latency, one to kill all instances in an entire EC2 availability
zone.

For humans, intuition tends to get into the way. Either it makes us ignore
advice from the outside, even a text book that's supposed to give us
instructions on how to respond to a particular situation, or to ignore the data
at hand entirely to still try and solve the problem in ways previously learned
even though they may not at all be appropriate for the failure at hand. Instead,
Game Days teach the people involved to improvise based on the situation and the
data at hand.

Lastly, humans need a purpose in what they do. If you're being reduced to a
monitor of a complex system, and all you have is a text book with instructions,
it's hard to cook up any passion to solve the problem at hand, to look at all
the data and make an intuitive decision. It's more likely that strictly
following instructions has an exacerbating effect on failure. This is starting
to move into the direction of company and team culture, which is a great topic
for a whole series of more posts, but you get the idea.

Again, go and [watch the
talk](http://www.infoq.com/presentations/Resilient-Response-In-Complex-Systems).
It's a great talk, as are all of John's. Once you're done, go read all the
articles above and think about how they apply to what you're working on. I'm
sure there's so much in there still that can be applied to web operations. The
list outlined here is only a beginning.

### Where Does This Leave Us?

We're left with two things. First, the realization that what we do is not that
different from other fields. We can learn from the military, from flying
aircrafts, running nuclear plants. I don't know about you, but that's pretty
mind-blowing to me. Even better: these fields can learn from us. Heck, we can
learn and improve what we do every day together! The interesting bit is: pilot
associations want to reshape training programs with recovery from dangerous,
potentially life-threatening situations in mind. We should spend a lot more
time thinking about recovery too.

Second, we're left with a list of things that we can do to improve how we run
and operate web applications, how we shape companies and teams around failures,
how we handle failures. This is going to take a while, the mindset of failure is
still not very entrenched in companies, in operations and development teams.
Companies tend to look at this at an upfront cost they're not willing to spend.

While that is true, this cost should always be weighed against the lost
costumers, business and opportunities caused by an outage that took hours or
even days to recover from. The size and scale of the web application is not
exactly what matters here. The smaller you are, the more flexibility you have in
applying the practices outlined here.

The secret third thing it leaves us is being public about our practices, about
how we're dealing with failures how we can build applications to deal with them.
It doesn't matter if they're running on EC2 or on dedicated hardware. The
essence is the same. I want to see more public talk and openness about operations.

I'll leave you with a paper that's only four pages long but summarizes
everything you need to know about [how complex systems
fail](http://www.ctlab.org/documents/How%20Complex%20Systems%20Fail.pdf).

Once again, I tip my hat to [John Allspaw](http://twitter.com/allspaw). He has
lots of great insight to share and is not afraid to share it.
