---
title: The New Technology Fallacy
layout: post
tags: smallbiz technology
---
When we set out to build our first product ([Scalarium](https://scalarium.com),
now better known as Amazon [OpsWorks](https://aws.amazon.com/opsworks/), we
started off with a rookie mistake.

Initially, we played with some ideas to test if we can fit them together. This
was mostly focussing on orchestration of servers and their provisioning. We
tried out a mix of RabbitMQ, Nanite and Chef (early adopters, yay!)

Back then, NoSQL databases just started appearing, and we thought, screw MySQL,
we're going to use something new and shiny. We started out using Amazon's
SimpleDB, but were soon hindered by its limitations.

We built Scalarium on Rails, so it was only natural that we started writing our
own ActiveRecord-like persistence layer. First, we wrote it to work with
SimpleDB, and it was aptly called SimplyStored.

Later, after some first exposure to CouchDB, we decided to use it instead. It
was gaining some traction, and we had good access to local community support.

After we hit a wall with our first attempt at using a custom storage layer, we
rewrote it to support CouchDB. Slightly different semantics made some things
harder to rewrite, and some things were quite awkward to handle, in particular
when trying to map an ActiveRecord-like query model on top of a database that
requires you to define your data queries upfront and store them as JavaScript or
Erlang views.

We spent a lot of time on SimplyStored, and for no good reason other than the
technical fascination with the idea of not using MySQL, a proven and fast
database, which would've been very sufficient for our purposes.

In the end, we still managed to build a good product, but shipping it was
extended unnecessary amounts of time by trying to start building our own stack
rather than use what's there and what's proven.

It's tempting to use new technologies when you're building something new. After
all, you've got a clean slate and can just play around.

But when you build a new product as a new company, [getting something up and
running, something to throw at users, is even more
important](http://www.paperplanes.de/2014/2/18/why-you-should-charge-for-your-beta-product.html).

It's okay to build up some technical debt along the way. Yes, you will spend
time later cleaning it up, but at least you can do that knowing that what you've
built initially was successful enough.

With a proven product that's bringing in revenue, you have more freedom to
gradually remove the technical debt built up in the beginning. Of course you'll
be adding new debt along the way, but that's just the circle of software
engineering life, isn't it?

At Travis CI, we also made some mistakes of where we focused our attention while
building a product. Some things were more focused on building something that's
technically sound rather than make sure we get a working product in front of
customers quickly.

Early on, Travis CI started out as a test balloon if you will, with a few simple
components to prove its technical viability as a continuous integration system.
Leaving [some challenges
aside](http://blog.travis-ci.com/2013-08-08-solving-the-puzzle-of-scalable-log-processing/),
we were able to scale it out quite nicely. We're still working on removing the
technical debt that we built up, but given that our customer base allows us to
do so, that's just fine.

With Scalarium, it took us almost a year to get something in front of customers,
an insanely long time. Looking back, the thing I would've done differently is
not building our own persistence layer, which has no relation at all to what we
were trying to build. It just took away precious time from building our first
version that could be used by customers.

When building something new, be careful to not fall into the trap of shiny new
technologies. They can be blessing and a burden, but the latter is all the more
likely when you step into the unknown.

Using proven technology can be incredibly boring, but they give you the room to
make sure that what you're trying to build and sell is sound as a product,
rather than a technical masterpiece.

**When building something new, simple and proven technology wins**. You can
always add more bells and whistles later.
