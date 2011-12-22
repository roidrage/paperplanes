---
title: Holiday Reading List
topics: reading
layout: post
comments_disabled: true
---
Here's a list of things I've been reading lately or that I'm about to read, and
that I found to be worth sharing.  If you're looking for something to read over
the holidays, I'm happy to give you some suggestions. Books, papers, articles,
and videos, something for everyone.

[**Scalability Rules**](http://scalabilityrules.com/)

A list of 50 rules related to scalability, in an easy to read recipe style.
They leave some stuff to the imagination, and I don't agree with every single
rule, especially not with the one that demands software should always be easy
to rollback, but they give you good food for thought for your own
applications. 

[**Time, Clocks, and the Ordering of Events in a Distributed System**](http://research.microsoft.com/en-us/um/people/lamport/pubs/time-clocks.pdf)

The earliest paper (1978!) to mention the notion of clocks as a means to track
ordering of events in distributed systems, the predecessor to vector clocks,
if you will. A must read.

[**Harvest, Yield, and Scalable Tolerant Systems**](http://radlab.cs.berkeley.edu/people/fox/static/pubs/pdf/c18.pdf)

A recap of CAP, making the whole notion of it a bit more flexible by adding
tuning knobs for graceful degradation. Hat tip to Coda Hale and his article
["You can't sacrifice partition tolerance"](http://codahale.com/you-cant-sacrifice-partition-tolerance/) for pointing me to this.

[**Problems with CAP, and Yahoo's little known NoSQL system**](http://dbmsmusings.blogspot.com/2010/04/problems-with-cap-and-yahoos-little.html)

Also related to CAP, this article introduces the notion of PACELC, which
basically adds latency to the CAP equation. CAP has been criticized quite a few
times for being too strict in this regard, and while the name PACELC is a bit
odd, the added notion of latency makes a lot of sense.

[**Replication and the latency-consistency tradeoff**](http://dbmsmusings.blogspot.com/2011/12/replication-and-latency-consistency.html)

Another one from Daniel Abadi, another one related to CAP, this time talking
about replication, consistency, and latency.

[**It's the latency, stupid!**](http://rescomp.stanford.edu/~cheshire/rants/Latency.html)

Going further back in time, this paper talks about latency in all its glory.
Sure, it talks about modem speed connections, but extrapolate that into today's
network bandwidth and you still have latency. Or you can read the next posts
too.

[**It's Still The Latency, Stupid...pt. 1**](http://www.edgeblog.net/2007/its-still-the-latency-stupid/) and [**It's Still The Latency, Stupid...pt. 2**](http://www.edgeblog.net/2007/its-still-the-latency-stupid-pt2/)

A more recent update on latency, because it still matters more than bandwidth.

[**Crash-only Software**](http://www.usenix.org/events/hotos03/tech/candea.html)

I've been pondering fault-tolerant and cloud-ready systems for a while now,
here's one related to the topic, software that crashes as a means to make it
more fault-tolerant.

[**Systems that Never Stop (video)**](http://www.infoq.com/presentations/Systems-that-Never-Stop-Joe-Armstrong)

Great talk by Joe Armstrong, inventor of Erlang, laying down six laws for
fault-tolerant systems. All laws lead to Erlang obviously, but it all makes a
lot of sense.

[**Why Do Computers Stop and What Can Be Done About It?**](http://www.hpl.hp.com/techreports/tandem/TR-85.7.html)

Related to Joe's talk, this paper discusses hardware reduncancy and reliable
storage by means of process pairs, modularity and transactions. Have yet to read
this one, but going to be interesting thinking about how these ideas, stemming
from hardware, apply to software and have been implemented by Erlang.

[**Working With Unix Processes**](http://workingwithunixprocesses.com/)

A little indie-published ebook on handling Unix processes. Code is focused on
Ruby, but most if not all of the book is easily applicable to any other language
or a basic Unix environment.

[**SEDA: An Architecture for Well-Conditioned, Scalable Internet Services**](http://www.eecs.harvard.edu/~mdw/papers/seda-sosp01.pdf)

SEDA was an idea for web and application server concurrency based on using
queues to condition and handle requests. While the idea has not exactly made it
through, I found the model to be strikingly similar to the actor model, in a
different way, but still very similar.

[**A Retrospective on SEDA**](http://matt-welsh.blogspot.com/2010/07/retrospective-on-seda.html)

SEDA, ten years later, by the author of the original paper. I gotta say, he
talks a lot what they got wrong, but I for one think SEDA had a pretty big
impact on the bigger picture of web application architecture. Probably something
worth discussing in a separate post.

[**Why Events Are A Bad Idea**](http://www.usenix.org/events/hotos03/tech/full_papers/vonbehren/vonbehren_html/index.html)

A paper comparing threads and events for highly concurrent servers. I'd
recommend taking this with a grain of salt. A lot has changed since this paper
was written, but what I like about reading papers like this is that it gives you
a historic perspective, same for SEDA.

[**Understanding Virtual Memory**](http://www.redhat.com/magazine/001nov04/features/vm/)

Nice summary of how virtual memory works on Linux.

[**The Declarative Imperative: Experiences and Conjectures in Distributed Logic**](http://www.eecs.berkeley.edu/Pubs/TechRpts/2010/EECS-2010-90.pdf)

To be honest, this is a slightly confusing paper. It starts out modeling things
in an oscure language called Datalog, but then dives into making some
conjectures about distributed logic, which was to me the more interesting part.

[**A brief history of Consensus, 2PC and Transaction Commit**](http://betathoughts.blogspot.com/2007/06/brief-history-of-consensus-2pc-and.html)

This article is full of gold. An extraordinarily compact view on the topic, but
with an abundance of links to papers to dive deeper.

Going to keep posting reading lists like this in the future. So much good stuff
to read out there. Lots of great knowledge collected in papers.

Last but not least, why not add the [Riak Handbook](http://riakhandbook.com/?pp)
to your reading list as well?
