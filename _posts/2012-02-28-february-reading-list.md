---
title: February Reading List
topics: reading
layout: post
comments_disabled: true
---
With February almost over, it's time to give you news things to read, or at
least to make a list of things I've been reading lately.

[**Continuous Delivery**](http://amzn.to/yB6NUE)

A rather wordy and very repetitive excursion into the ideas behind continuous
delivery, which involves continuous integration, continuous deployment and lots
of other things. While I'm all on board with the ideas in the book, it's simply
too long. Every chapter repeats a lot of the things from other chapters, mostly
with the purpose of being easily accessible on their own. I like the book in
general, but 500 pages for a book like this is simply too long.

[**The Architecture of Open Source Applications**](http://www.aosabook.org/en/index.html)

This is an incredible resource, and best of all, it's free. Several open source
projects are outlined from how their architecture evolved over time and how they
came about to begin with.

The chapters I've very much enjoyed so far are
[Graphite](http://www.aosabook.org/en/graphite.html),
[HDFS](http://www.aosabook.org/en/hdfs.html), [Erlang and
Riak](http://www.aosabook.org/en/riak.html),
[Sendmail](http://www.aosabook.org/en/sendmail.html). But the best chapter by
far is the one on BerkeleyDB, the key-value store you didn't know you'd find
everywhere. It's an exceptional read and should be mandatory for software
developers. It's a great story on how to evolve architecture of what started out
as a simple library over the course of 20 years.

While the book is free to read online, please consider buying if you like it.
It's for a good cause too. There's a second volume in the works, due in March.

[**Things Caches Do**](http://tomayko.com/writings/things-caches-do)

A short and simple read on what web caches do. If you build web apps, read this.
Also has links to more in-depth articles on HTTP and caching.

[**Probabilistically Bounded Staleness for Practical Partial Quorums**](http://www.eecs.berkeley.edu/Pubs/TechRpts/2012/EECS-2012-4.html)

An analysis of how eventual and consistent eventual consistency is. Relevant if
you're dealing with Dynamo-style databases, but an interesting read any way you
look at it. Accompanied by a
[website](http://www.eecs.berkeley.edu/~pbailis/projects/pbs/) that allows you
to calculate the probability that data in a quorum-replicated cluster is
consistent over time.

[**Design of Apache Kafka, a high-throughput distributed messaging system**](http://incubator.apache.org/kafka/design.html)

If you're into messaging, you should read this, especially if all you know is
RabbitMQ and Redis for queueing. Both don't scale well and they're not easy to
make fault-tolerant. Kafka, built at LinkedIn, follows a very different design
to allow being run fully distributed.

[**Notes on Varnish, from the Architect**](https://www.varnish-cache.org/trac/wiki/ArchitectNotes)

The ideas behind Varnish, why Squid's way is outdated, and a perspective on
great uses of memory-mapped files. Short and self-congratulatory read.

[**The LMAX Architecture**](http://martinfowler.com/articles/lmax.html)

After reading this, you'll have a different perspective on things when it comes
to building high-throughput systems. LMAX is a real-time trading site, and this
article describes how they built the service that manages millions of trades per
second. Other than your typical architecture description on
[highscalability.com](http://highscalability.com/), this is one has a lot of
great information.

[**ZooKeeper**](http://www.usenix.org/events/usenix10/tech/full_papers/Hunt.pdf)

A paper on [ZooKeeper](http://zookeeper.apache.org/), a system for coordinating process in distributed systems.
This is a surprisingly good read, and it also outlines several use cases for
ZooKeeper.

[**The Lean Startup**](http://amzn.to/AAApeq)

People raved about this book, and it was recommended to me from several folks.
After reading it, I'm rather meh on it. It felt like reading an over-glorified
handbook for a process that startups _must_ adopt to be successful. Overuse of
the words "disruptive", "pivot", "startup", and "entrepreneur" all but added to
the slightly weird taste the book left me with.

Still, I don't think of reading something as a waste. If anything, this book
helped me clarify my thoughts on the matter and gave me more perspective. That's
what reading to me is all about.

[**Why We Get Fat**](http://amzn.to/wlJQUw)

I got curiously interested in how the body works and, in particular, how
carbohydrates affect it. While this book should be taken with a spoon full of
salt, I learned quite a bit from it.

**Read, Read!**

If you want to read something really good like right now. Make it the
aforementioned chapter on BerkeleyDB and the ZooKeeper paper.
