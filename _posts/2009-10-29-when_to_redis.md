---
layout: post
title: When To Redis
tags: nosql redis
---
A very valid question is: What's a good use case for [Redis](http://code.google.com/p/redis)? There's quite a few, as Redis isn't your every day key-value store, it allows you to keeps lists and sets in your datastore, and to run atomic operations on them, like pushing and popping elements. All that stuff is incredibly fast, as obviously your data is held in memory and only persisted to the hard disk if necessary and to top it off, asynchronously, while not reducing the throughput of the server itself.

The simplest and most obvious use case is a cache. Redis clocks in at almost the speed of Memcached, with a couple of features sprinkled on top. If you need a cache, but maybe have a use case where you want also want to store data you in it that you want to be persisted, Redis is a decent tool for your caching needs. If you already have a Memcached instance in place I'd look at my options before adding a new component to my infrastructure though.

Pushing and popping elements atomically, does that ring a bell? Correct, that's what you want from a worker queue. Look at [delayed\_job](http://github.com/tobi/delayed_job), you'll find that it uses a locking column in your jobs table. Some people argue that a database should not be the place where you keep your worker jobs. Up to a certain amount of work I disagree, but at some point the performance costs outweigh the benefits, and it's time to move on. Redis is a perfect fit here. No locking needed, just push on the list of jobs and pop back off it in your workers, simple like that. It's the GitHub way, and the more I think about it, the more sense it makes.

For Redis 1.1 Salvatore has been working on a proposal by [Ezra](http://twitter.com/ezmobius) from Engine Yard to implement a command that would move items from one list to another in one step, atomically. The idea is to mark a job as in progress, while not removing it entirely from the data storage. Reliable messaging anyone? It's such a simple yet genius idea, and Redis has most of the functionality already in place. There's heaps more planned for future Redis releases, I'd highly recommend keeping an eye on the mailing list and on Salvatore's [Twitter stream](http://twitter.com/antirez).

As I'm sure you noticed Redis is used for data storage in [hurl](http://hurl.it), a neat little app to debug HTTP calls. Redis is simply used to store your personalized list of URLs you checked. Should some data be lost in between database dumps, it's not a big deal, it's not great sure, but not a big deal.

The simple answer for when to use Redis is: Whenever you want to store data fast that doesn't need to be 100% consistent. In the past projects I've worked on that includes classic examples of web application data, especially when there's social stuff sprinkled on top: ratings, comments, views, clicks, all the social stuff you could think of. With Redis, some of it is just a simple increment command or pushing something onto a list. Here's a nice example of [affiliate click tracking using Rack and Redis](http://www.mrkris.com/2009/10/28/affiliate-click-tracking-with-rack-and-redis-because-i-care/).

Why is that a good match? Because if some of that data is lost, it doesn't make much of a difference. Throw in all the statistical or historial data you can think of that's accumulated in some way through your application, and could be recalculated if necessary. That data usually just keeps clogging up your database, and is harder and harder to get rid of as it grows.

Same is true for activity streams, logging history, all that stuff that is nonvolatile yet doesn't need to be fully consistent, where some data loss is acceptable. You'd be surprised how much of your data that includes. It does not, and let me be perfectly clear on that, include data that involves any sort of business transaction, be it for a shopping platform or for data involved in transactions for software as a service applications. While I don't insist you store that data in a relational database, at least it needs to go into a reliable and fully recoverable datastore.

One last example, the one that brought me and Redis together is [Nanite](http://github.com/ezmobius/nanite), a self-assembling fabric of Ruby daemons. The mapper layer in Nanite keeps track of the state of the daemons in the cluster. That state can be kept on each mapper redundantly, but better yet, it should be stored in Redis. I've written a post about that a while back, but it's still another prime use for Redis. State that, should it or part of it get lost, will recover all by itself and automatically (best case scenario, but that's how it works in Nanite).

One thing to be careful though is that Redis can only take as much data as it has memory available. Especially for data that has the potential to grow exponential with users and their actions in your application, it's good to keep an eye on it and to do some basic calculations, but you should even do that when using something like MySQL. When in doubt, throw more memory at it. With Redis and its master-slave replication it's very easy to add a new machine with more memory, do one sync and promoto the slave to the new master within a matter of minutes. Try doing that with MySQL.

For me, this stuff is not about just being awesome. I've had countless situation where I had data that could've been handled more elegantly using something like Redis, or a fully persistent key-value store like Tokyo Tyrant. Now there's really no excuse to get that pesky data clogging up your database out of there. These are just some examples.

By the way, if you want to know what your Redis server is doing, telnet to your Redis instance on port 6379, and just enter "monitor". Watch in awe as all the commands coming in from other clients appear on your screen.

In the next post we'll dig into how you can store data from your objects conveniently into Redis.

Redis, consider us for your next project.