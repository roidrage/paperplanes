---
layout: post
title: "Keep It Simple"
tags: kiss scaling performance
---
It seems to be common sense these days to throw a search engine, a database slave or an external cache at your application in even the earliest stages of a project. Let me just give you my two cents on the issue, and why I think that's a bad idea.

It all starts with the angst that the application won't scale when it's hit by whatever effect the cool kids use these days. Even having only several thousand records already seem to be an indication that there's not enough room to scale the database itself.

Let me just go ahead and say it: Your way of thinking about scaling is wrong. You're raising the bar of complexity without having a problem. With every service introduced to the project, a new error source needs to be handled. Your code needs to deal with potential MySQL slave replication lags, cache expiration, constant search index updates, and of course the administrative overhead.

Let's look at all three in a little more detail.

### MySQL Slave/Sharding

The load on your database has reached levels you think aren't manageable without introducing a reading slave into your setup anymore. Most of the time, you're wrong.

Is your load too high? Find statements that require too much IO and make them fast. Does your database touch the hard drives too much? Increase the cache size and add more RAM. The more data and indexes you can store in-memory, the less hard drive activity is required. Caching sure is king, but you're winning the most when you can let the database do most, if not all of it.

Do inserts/updates take too long? Check your indexes, you might have too many of them. Increase the interval that InnoDB will flush transactions to the log in. Unless you have a really, really critical application, you can live with the prospect of losing one second worth of data.

Adding a slave looks easy. You dump the master, load the dump on the slave, enable replication, and you're golden. But what if your slave goes down? What if the replication lacks so far behind that it would impact what the user sees? Does your application handle the issue that data written to the master might not be visible on the slave immediately?

In the end, it's the same as with an external cache, you still need to tune your database. You'll gain a lot more by trying to find some of the big resource-hogging queries in your application, setting some indexes or fine-tuning one or two database parameters. What's that you're gaining, you ask? Why, it's simplicity.

Adding RAM and increasing the database's cache is a lot cheaper than trying to improve performance in other parts of your application. Calculate the cost of say 8 GB of RAM against the cost of one person working for a whole week on trying to tweak things in your application that could easily be improved with just a little bit more RAM. Whether you like it or not, the database is your bottleneck, but tuning it is not rocket science. Some solutions to common database problems (which you have, unless you're Big Company) are so simple it still hurts my brain how uncommon the knowledge of them is.

Don't believe me? Have a look at [this recent post](http://www.mysqlperformanceblog.com/2009/03/01/kiss-kiss-kiss/) on the [MySQL Performance Blog](http://www.mysqlperformanceblog.com/).

Sharding might eventually make sense when splitting up your application is the only way out. When you have [five billion visits per months](http://www.jurriaanpersyn.com/archives/2009/02/12/database-sharding-at-netlog-with-mysql-and-php/), then you can go ahead and shard your databases. But right from the start? Meh, throw RAM at it as long as you can, saves a lot of trouble.

### Memcache

Your queries are becoming slow, and therefore your website's response time decreases. One thing that pops up will be to cache the hell out of your website. After all, Rails has neat support for caching.

That's all great, but you need to be aware of two things. First, caching is hard. Getting the data in and out is the easy part, knowing when to expire the data is what will break your neck, it not just might, it will.

Second, it will not spare you from tuning your database. Imagine your cache goes down. Sure, your application handles the missing cache gracefully, but all those slow queries you wanted to get rid of, they're in full effect. Caching is not the solution to slow database queries. You still need to invest time in fine-tuning slow statements and your database.

Memcache is awesome, and it's a great way to reduce your application's response time, but it's a level of complexity that needs to be understood, handled and tested correctly and gracefully.

All that said, I prefer turning to Memcached before I consider replication or sharding anytime.

### Full Text Search

A common meme seems to be that you don't want to do full-text search using your database. Throw a separate full-text search engine at your application instead. But hold on, isn't the purpose of a database to find data easily? Yeah, I vaguely remember that. So why not use it? Because it's slow? Oh, come on. You have like what, some ten thousand records in your database? Are all of them using a largetext column? No? Good, then why not use a simple select using like? It's not horribly wrong, you know. Worry about setting up full text search when you hit a wall with that. But unless you have hundreds of thousands of rows or larger documents you want to query on, you'll be fine.

Don't get me wrong, I love me a good full-text search, but I don't throw it at every application just because I want to search for something, even in text. If you use PostgreSQL, look into [tsearch2](http://www.postgresql.org/docs/current/static/tsearch2.html), using MySQL, maybe the included [full-text search](http://dev.mysql.com/doc/refman/5.1/en/fulltext-search.html) will do.

The bottom line is simple: Don't throw complex solutions at problems that can be solved either by using simple tweaks, or just because other solutions using the tools you already have might require some more thinking and analysis. The more detail you know about a specific problem, the better your judgement on the solution will be, and usually, the solution can be as simple as tweaking your database. That's your biggest bottleneck, so tune the heck out of it.