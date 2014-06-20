---
title: What Adopting Blameless Post-Mortems Has Taught Me About Culture
layout: post
topics: ops
---
A couple of years ago, I was introduced to the idea and practice of post-mortems
through a talk by [John Allspaw](http://kitchensoap.com). I do owe him a lot,
he's an inspiration.

Back then he talked about post-mortems as a company-internal means to triage
what lead to and happened during an outage or production incident.

A post-mortem is a meeting where all stakeholders can and should be present, and
where people should bring together their view of the situation and the facts
that were found during and after the incident. The purpose is to collect as much
data as possible and to figure out how the impact of a similar future incident
can be reduced.

One precondition for a useful post-mortem is that it must be blameless. The
purpose is not to put blame on anyone on the team, the purpose is to figure out
what happened and how to improve it.

This can have significant impact on a company's culture. Speaking for myself,
the idea of blameless post-mortems has changed the way how I think about
operations, how I think about working on a team, how I think about running a
company.

### Humans Have Good Intentions

The normal focus of any team is to deliver value, either to customers, to
stakeholders, to other teams in the same organization.

During an outage, this view can unfortunately change fast, and for the worse,
mostly unintentionally. Being under pressure, it's easy to put blame on someone.
Someone may have accidentally changed a configuration on a production system,
someone [accidentally dropped a database
table](/2013/6/17/a-short-story-on-human-error.html) on the production database.

But the most important idea of a blameless post-mortem is that humans are
generally well-intentioned. When someone does something wrong, the assumption
should be that it happened through circumstances beyond a single human.

Humans usually act in good faith, to the best of their knowledge, and within the
constraints and world view of an organization.

That's where you need to start looking for problems.

Disregard the notion of human error. It's not helpful to find out what's broken
and what you can fix. It assumes that what's broken and what needs to be fixed
are humans in an organization.

Humans work with and in complex systems. Whether it's your organization or the
production environment. Both feed into each other, both influence each other.
The humans acting in these systems are triggers for behaviours that no one has
foreseen, that no one can possibly foresee. But that makes humans mere actors,
parts of complex systems that can be influenced by an infinite amount of
factors.

That's where you need to start looking.

**It's complex systems all the way down. The people on your team and in your
company are trying their best to make sense of what they do, about how they
interact with each other.**

### Trust

With the idea that humans are generally well-intentioned working in an
organization, comes a different idea.

The idea of trust.

When you entrust a team with running your production systems, but you don't
trust them to make the right decisions when things go wrong, or even when things
go right, you're in deep cultural trouble.

**Trust means that mistakes aren't punishable acts, they're opportunities to
learn.**

Trust means that everyone on the team, especially the people working at the
sharp end of the action, can speak up, point out issues, work on improving them.

Trust means that everyone on the team will jump in to help rather than complain
when there's a production incident.

### Focus on Improvement

In the old world, we focused on mean time between failure (MBTF), on maximizing
the time between production incidents. We also focused on trying to figure out
who was at fault, who is to blame for an issue. Firing the person usually was
the most logical consequence.

In the new world, we focus on learning from incidents, on improving the
environment in an organization, the environment its people are working in. The
environment that contributes to how people working in it behave both during
normal work and during stressful situations.

**When systems are designed, no one can predict all the ways in which they
behave.** There are too many factors contributing to how a system runs in
production, to how your organization behaves as a whole. It's impossible to
foresee all of them.

Running a system in production, going through outages, doing post-mortems, all
these contribute to a continuous process of improving, of learning about those
systems.

### Bonus: Get Rid of the Root Cause

A common notion is still that there is this one single cause that you can blame
a failure on, the infamous root cause. Whether it's a human, whether it's a
component in your system, something can be blamed, and fixing it will make the
problem go away.

With the idea of complex systems, this notion is bogus. [There is no single root
cause.](http://www.kitchensoap.com/2012/02/10/each-necessary-but-only-jointly-sufficient/)

As Sidney Dekker put it:

> What you call root cause is simply the place where you stop looking any
> further.

With so many complex systems interacting with each other, your organization, the
teams and people in it, the production environment, other environment it
interacts with. Too much input from one of these systems can trigger an
unexpected behaviour in another part.

As Richard Cook put it in ["How Complex Systems
Fail"](http://www.ctlab.org/documents/How%20Complex%20Systems%20Fail.pdf):

> Overt catastrophic failure occurs when small, apparently innocuous failures
join to create opportunity for a systemic accident. Each of these small failures
is necessary to cause catastrophe but only the combination is sufficient to
permit failure.

**While they won't transform your organization overnight, accepting post-mortems
into your operational workflow can be a catalyst for long term change.**
