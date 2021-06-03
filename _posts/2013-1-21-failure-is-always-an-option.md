---
title: Failure is Always an Option
layout: post
tags: operations culture
---
Failure is still one of the most undervalued things in our business, in most
businesses really. We still tend to point fingers elsewhere, blame the other
department, or try anything to cover our asses.

How about we do something else instead? We embrace failure openly, turn it into
our company's culture and do everything we can to make sure every failure is
turned into a learning experience, into an opportunity?

Let me start with some illustrating examples.

### Wings of Fury

In 2010, [Boeing tested the wings of a brand new 787
Dreamliner](http://www.wired.com/autopia/2010/03/boeing-787-passes-incredible-wing-flex-test/).
In a giant hangar, they set up a contraption that'd pull the wings of a 787 up,
with so much pull that the wings were bound to break.

![](http://s3itch.paperplanes.de/787-20130111-114538.png)

Eventually, and after they've been flexed upwards of 25 feet, [the wings broke
spectacularly.](http://www.youtube.com/watch?v=WRf395ioJRY)

The amazing bit: all the engineers watching it happen started to cheer and
applaud.

Why? Because they anticipated the failure at the exact circumstances where it
broke, at about 150% of what wings handle at normal operation.

They can break things loud and proud, they can predict when their engineering
work falls apart. Can we do the same?

### Safety first

I've been reading a great book, ["The Power of Habit"](http://amzn.to/Vkcn76),
and it outlines another story of failure and how tackling that was turned into
an opportunity to improve company culture.

When Paul O'Neill, later to become Secretary of the Treasury, took over
management of Alcoa, one of the United States' largest aluminum production
companies, he made it his first and foremost to tackle the safety issues in the
company's production plants.

He put rules in place that any accidents must be reported to him within just a few
hours, including remedies on how this kind of accident will be prevented in the
future.

While his main focus was to prevent failures, because they would harm or even
kill workers, what he eventually managed to do is to implement a company culture
where even the smallest suggestions to improve safety or to improve efficiency
from any worker would be considered and would be handed up the chain of
management.

This fostered a culture of highly increased communication between production
plants, between managers, between workers.

Failures and accidents still happened, but were in sharp decline, as every
single one was taken as an opportunity to learn and improve the situation to
prevent them from happening again.

It was a chain of post-mortems if you will. O'Neill's interest was to make
everyone part of improving the overall situation without having to fear blame.
Everyone was made felt like they're an important part of the company. By then,
15000 people worked at Alcoa.

This had an interesting effect on the company. In twelve years, O'Neill
managed to increase Alcoa's revenues from $1.5 to $23 billion dollars.

His policies became an integral part of the company's culture and ensured that
everyone working for it felt like an integral part of the production chain.

Floor worker's were given permission to shut down the production chain if they
deemed it necessary and were encouraged to whistle when they noticed even the
slightest risk in any activity in the company's facilities.

To be quite fair, competitors were pretty much in the dark about these
practices, which gave Alcoa a great advantage on the market.

But within a decade of running the company, he transformed it into a culture
that sounds strikingly similar to the ideas of DevOps. He managed to make
everyone feel responsible for delivering a great product and for everyone to be
enabled to take charge should something go wrong.

All that is based on the premise of trust. Trust that when someone speaks up,
they will be taken seriously.

### Three Habits of Failure

If you look at the examples above, some patterns come up. There are companies
outside of our field that have mastered or at least taken on an attitude of
accepting that failure is inevitable, anticipating failure and dealing with and
learning from failure.

Looking at some more examples it occurred to me that even doing one of these
things will improve your company's culture significantly.

### How do we fare?

We fail, a lot. It's in the nature of the hardware we use and the software we
build. Networks partition, hard drives fail, software bugs creep into system
that can lead to cascading failures.

But do we, as a community, take enough of advantage of what we learn from each
outage?

Does your company hold post-mortem meetings after a production outage? Do you
write public post-mortems for your customers?

If you don't, what's keeping you from doing so? Is it fear of giving your
competitors an advantage? Is it fear of giving away too many internal details?
Fear of admitting fault in public?

There's a great advantage in making this information public. Usually, it doesn't
really concern your customers what happened in all detail. What does concern
them is knowing that you're in control of the situation.

A post-mortem follows three Rs: regret, reason and remedy.

They're a means to say sorry to your customers, to tell them that you know what
caused the issues and how you're going to fix them.

On the other hand, post-mortems are a great learning opportunity for your peer
ops and development people.

### Web Operations

This learning is an important part of improving the awareness of web operations,
especially during development. There's a great deal to be learned from other
people's experiences.

Web operations is a field that is mostly learning by doing right now. Which is
an important part of the profession, without a doubt.

If you look at the available books, there are currently three books that give
insight into what it means to build and run reliable and scalable systems.

["Release It!"](http://amzn.to/pwoDun), ["Web
Operations"](http://amzn.to/rgI1J5) and ["Scalable Internet
Architectures"](http://amzn.to/KAog1y) are the ones that come to mind.

My personal favorite is "Release It!", because it raises developer awareness on
how to handle and prevent production issues in code.

It's great to see the [circuit
breaker](https://en.wikipedia.org/wiki/Circuit_breaker_design_pattern) and the
[bulkhead
pattern](http://johnragan.wordpress.com/2009/12/08/release-it-stability-patterns-and-best-practices/)
introduced in this book now being popularized by Netflix, who [openly write
about their experiences implementing
it](http://techblog.netflix.com/2012/11/hystrix.html).

Netflix is a great example here. They're very open about what they do, they
write detailed post-mortems when there's an outage. You should read their
[engineering blog](http://techblog.netflix.com), same for
[Etsy's](http://codeascraft.etsy.com).

Why? Because it attracts engineering talent.

If you're looking for a job, which company would you rather work for? One that
encourages taking risks while also taking responsibility for fixing issues when
failure does come up, and one that enables a culture of fixing and improving
issues as a whole rather than to put blame?

I'd certainly choose the former.

Over the last two years, Amazon has also realized how important this is. Their
post-mortems have gotten very valuable for anyone interest in things that can
happen in multi-tenant, distributed systems.

If you remember the most recent outage on Christmas Eve, they even had the guts
to come out and say that production data was deleted by accident.

Can you imagine the shame these developers must feel? But can you imagine a
culture where the issue itself is considered an opportunity to learn instead of
blaming or firing you? If only to learn that accessing production data needs
stricter policies.

It's a culture I'd love to see fostered in every company.

Regarding ops education, there have been some great things last year that are
worth mentioning. [hangops](http://hangops.com) is a nice little circle,
streamed live (mostly) every Friday, and available for anyone to watch on
YouTube afterwards.

[Ops School](http://www.opsschool.org) has started a great collection of
introductory material on operations topics. It's still very young, but it's a
great start, and you can help move it forward.

### Travis CI

At [Travis CI](https://travis-ci.org), we're learning from failure, a lot. As a continuous integration
platform, it started out as a hobby project and was built with a lot of positive
assumptions.

It used to be a distributed system that always assumed everything would work
correctly all the time.

As we grew and added more languages and more projects, this ideal fell apart
pretty quickly.

It is a symptom of a lot of projects that are developer-driven, because there's
just so little public information on how to do it right, on how distributed
systems are built and run at other companies for them to work reliably.

We decided to turn every failure into an opportunity to share our learnings.
We're an open source project, so it only makes sense to be open about our
problems too.

Our audience and customers, who are mostly developers themselves, seem to
appreciate that. I for one am convinced that we owe to them.

I encourage you to do the same, to share details on your development, on how you
run your systems. It'll be surprising how introducing these changes can affect
working as a team as a whole.

### Cultural evolution

This insight didn't come easy. We're a small team, and we were all on board with
the general idea of openness about our operational work and about the failures
in our system.

That openness brings with it the need to own your systems, to own your failures.
It took a while for us to get used to working together as a team to get these
issues out of the way as quickly as possible and to find a path for a fix.

In the beginning, it was still too easy to look elsewhere for the cause of the
problem. Blame is one side of the story, hindsight bias is the other. It's too
easy to point out that the issue has been brought up in the past, but that
doesn't contribute anything to fixing it.

The more helpful attitude than saying "I've been saying this has been broken for
months" is to say "Here's how I'll fix it." You own your failures.

The only thing that matters is delivering value to the customer. Putting aside
blame and admitting fault while doing everything you can to make sure the issue
is under control is, in my opinion, the only way how you can do that, with
everyone in your company on board.

Accepting this might just help transform your company's culture significantly.
