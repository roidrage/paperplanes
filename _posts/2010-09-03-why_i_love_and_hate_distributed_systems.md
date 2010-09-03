---
title: Why I Love and Hate Distributed Systems
topics: distributed databases algorithms
comments_disabled: true
layout: post
---
Let me go ahead and say it: I love distributed systems. Why? Simply because they bend my brain. Yesterday I tweeted
"Distributed databases are my happy place." One response I got was along the lines of: "then you're probably not running
a distributed database in production." Busted! But does it matter? We all love distributed stuff, we love thinking about
scaling. They seem like problems everyone wants to have and solve.

But the truth is, I don't, and I can assure you, you don't want to either, sometimes I doubt my brain is even capable
properly solving these problems, but that doesn't prevent me from trying. I prefer to work on as small a scale as
possible, you could even say I hate distributed systems. Scaling and distribution is a problem most of us don't have,
and are probably better of not having.

Truth be told, I'm not highly interested in running highly distributed systems in production, quite the opposite. I prefer
maxing out what I have as far up as possible. Sometimes I do take the plunge and just try something new in production,
but I'm happy prepared to replace it with something different, even something simpler, if that seems like the better
option in the end. Everyone should experiment at some point, but not all the time.

But why then do I love distributed systems? Simply because they make me think about how they could be put to use,
what algorithms and the problems involved are, and what implications they would have on a production system, both from
an operations and developer perspective. That's where the value is for me, it allows me to simply make informed
decisions when the time comes.

Take Riak, for example, on which [I gave a shortish talk](http://riak-rugb.heroku.com) at yesterday's meet-up of the
local Ruby brigade. Riak's distribution model is based on Amazon's Dynamo implementation, with some neat features
sprinkled on top. Riak is built by a bunch of really, really smart guys at [Basho](http://basho.com), whose work I have
nothing but respect for, but who also are sane and open enough to tell people when their database may or may not be a
good fit (something a certain other database is severly lacking).

Riak is exciting for me because it was the first database that really made me dive into Amazon's Dynamo, and once I
started grokking it, it blew my mind. If you haven't read it, [please
do](http://www.allthingsdistributed.com/2007/10/amazons_dynamo.html). It blew my mind simply because it introduced me to
a whole new thinking, to heavily distributed storage, with all the potential hot spots, downsides and business use cases
for specifics parts of it thrown in. The same is true for [Google's BigTable](http://labs.google.com/papers/bigtable.html).
The technologies involved with both are true mind-benders.

And there's my bottom line. Distributed systems aren't necessarily awesome just because they allow scaling to infinite
heights (exaggeration intended), but because they broaden your personal horizon. It's like learning new programming
languages. It's about getting new ideas in your head, ideas outside of your everyday working realm. Ideas you can maybe
even take back to what you're working on and start applying them where it makes sense, and only if it makes sense.
Learning about distributed systems is not just about learning how to use them, but when. Knowing is half the battle.

While you're at it, check out Evan Weaver's ["Distributed Systems
Primer"](http://blog.evanweaver.com/articles/2009/05/04/distributed-systems-primer/), a collection of papers on
distributed systems, or the [papers collection over at NoSQL Summer](http://nosqlsummer.org/papers). Get ready to have
your mind blown in whole new ways. Say what you will, that stuff is just fascinating. It appeals to the distributed
database lover in me.
