---
layout: post
title: A Collection Of Redis Use Cases
tags: nosql redis
---
_Interested in Redis? You might be interested in the [Redis Handbook](http://redishandbook.com) I'm currently working on._

I'm gonna eat [my own dog food](http://www.paperplanes.de/2010/2/15/nosql_and_you_finding_the_right_partner.html) here, and start you off with a collection of links and ideas of people using [Redis](http://code.google.com/p/redis/). Redis' particular way of treating data requires some rethinking how to store your data to benefit from speed, atomicity and its data types. I've already written about [Redis](http://www.paperplanes.de/2009/10/27/theres_something_about_redis.html) [in](http://www.paperplanes.de/2009/10/30/how_to_redis.html) [abundance](http://www.paperplanes.de/2009/10/29/when_to_redis.html), this post's purpose is to compliment them with real-world scenarios. Maybe you can gather some ideas on how to deal with things.

There's a couple of well-known use cases already, the most popular of them being [Resque](http://github.com/defunkt/resque/), a worker queue. [RestMQ](http://github.com/gleicon/restmq), an HTTP-based worker queue using Redis, was just recently released too. Both don't make use yet of the rather new blocking pop commands like [Redactor](http://github.com/ezmobius/redactor) does, so there's still room for improvement, and to make them even more reliable.

[Ohm](http://ohm.keyvalue.org/) is a library to store objects in Redis. While I'm not sure I'd put this layer of abstraction on top of it, it's well worth looking at the code to get inspiration. Same is true for [redis-types](http://github.com/BrianTheCoder/redis-types).

* [A Twitter Clone using Redis](http://code.google.com/p/redis/wiki/TwitterAlikeExample)

    This should be the first one to check out, very detailed example on how you could implement a Twitter clone using Redis and PHP. Twitter clones using Redis are all the rage these days, there's also a [clone of the original clone written in Ruby](http://github.com/danlucraft/retwis-rb).

* [Sort in Redis](http://ozmm.org/posts/sort_in_redis.html)

    An instant classic. Some examples on how to use sorting in Redis.

* [Redis in Practice: Who's Online?](http://www.lukemelia.com/blog/archives/2010/01/17/redis-in-practice-whos-online/)

    Great and distilled example of how to utilize set intersections and unions to find out which people are online at a given minute.

* [Building a Twitter Filter with Sinatra, Redis, and Tweetstream](http://www.digitalhobbit.com/2009/11/08/building-a-twitter-filter-with-sinatra-redis-and-tweetstream/)

    Exactly what the title says. Examples of using lists to store tweets marshalled using JSON.

* [Where's Waldo: Track user locations with Node.js and Redis](http://techno-weenie.net/2010/2/3/where-s-waldo-track-user-locations-with-node-js-and-redis)

    Redis and Node.js seem to be a great match, be sure to check out the [source](http://github.com/technoweenie/wheres-waldo) too. Similar to the one above, different implementation. Be sure to read the prequel ["Node.js For My Tiny Ruby Brain"](http://techno-weenie.net/2010/1/15/node-js-for-my-tiny-ruby-brain) too, some more code in there.

* [Sikwamic: Simple Key-Value With Comet](http://www.dorkalev.com/2010/02/sikwamic-simple-key-value-with-comet.html)

    Comet and Redis, sitting in a tree.

Redis' simplicity, atomicity and speed make it an excellent tool when tracking things directly from the web, e.g. through WebSockets or Comet. If you can use it asynchronously, all the better.

* [Affiliate Click Tracking with Rack and Redis](http://www.mrkris.com/2009/10/28/affiliate-click-tracking-with-rack-and-redis-because-i-care/).

    Simple approach to tracking clicks, I probably wouldn't use a list for all clicks, but instead have one for each path, but there's always several ways to get to your goal with Redis. Not exactly the same, but [Almaz](http://github.com/jpoz/almaz) can track URLs visited by users in Rails applications.
    
    Update: Turns out that the affiliate click tracking code above, the list is only used to push clicks into a queue, where they're popped off and handled by a worker, as pointed out by Kris in the comments.


* [Building a NLTK FreqDist on Redis](http://streamhacker.com/2009/05/20/building-a-nltk-freqdist-on-redis/)

    Calculation of frequency distribution, with data stored in Redis.

* [Gemcutter: Download Statistics](http://gist.github.com/296921)

    The RubyGems resource par excellence is going to use Redis's sorted sets to track daily download statistics. While just a proposals, the ideas are well applicable to all sorts of statistics being tracked in today's web applications.

* [Usage stats and Redis](http://oxfordrepo.blogspot.com/2010/01/usage-stats-and-redis.html)

    More on tracking views statistics with Redis.

* [Vanity - Experiment Driven Development](http://vanity.labnotes.org/)

    Split testing tool based on Redis to integrate in your Rails application. Another kind of tracking statistics. If you didn't realize it up to now, Redis is an excellent tool for this kind of application. Data that you wouldn't want to load off to your main database, because let's face it, it's got enough crap to do already.

* [Flow Analysis & Time-based Bloom Filters](http://www.igvita.com/2010/01/06/flow-analysis-time-based-bloom-filters/)

    Streaming data analysis for the masses.

* [Crowdsourced document analysis and MP expenses](http://simonwillison.net/2009/Dec/20/crowdsourcing/)

    While being more prose than code, it still shows areas where Redis is a much better choice than e.g. MySQL.

Using Redis to store any suitable kind of statistics is pretty much an immediate use case for a lot of web applications. I could think of several projects I've work on that could gain something from using certain parts of their application to Redis. It's the kind of data you just don't want to clutter your database with. Clicks, view, history and all that stuff puts an unnecessary amount of data and load on it. The more data it accumulates, the harder it will be to get rid off, especially in MySQL.

* [Simple Note Keeping with Redis](http://gist.github.com/86714)

    A code snippet that's actually a fully working Sinatra app to jot down notes.

* [URL Shortener Service using Redis](http://sunilarora.org/url-shortener-service-using-redis)

    Personal URL shortening is the new black, that's why I've written [my own service](http://github.com/mattmatt/relink).

It's not hard to tell that we're still far from having heaps of inspiration and real-life use cases to choose from, but these should give you an idea. If you want it can get a lot simpler too. When you're using Redis already, it makes sense to use it for storing Rails sessions.

Redis is a great way to share data between different processes, be it Ruby or something else. The atomic access to lists, strings and sets, together with speedy access ensures that you don't even need to worry about concurrency issues when reading and writing data. On [Scalarium](http://scalarium.com), we're using it mostly for sharing data between processes.

E.g., all communication between our system and clients on the instances we boot for our users is encrypted and signed. To ensure that all processes have access to the keys, they're stored conveniently in Redis. Even though that means the data is duplicated from our main database (which is CouchDB if you must know), access to Redis is a lot faster. We keep statistics about the instances in Redis too, because CouchDB is just not made for writing heaps and heaps of data quickly. Redis also tracks a request token that is used to authenticate internal requests in our asynchronous messaging system, to make sure that they can't be compromised from some external source. Each request gets assigned a unique token. The token is stored in Redis before the message is published and checked before the message is consumed. That way we turned Redis into a trusted source for shared data between web and worker processes.

The library [memodis](http://github.com/levicook/memodis) makes sharing data incredibly easy, it offers Redis-based memoization. When you assign a memodis'd attribute in your code, it'll be stored in Redis and therefore can be easily read from other processes.

Redis is incredibly versatile, and if you have a real-life Redis story or usage scenario to share, please do.
