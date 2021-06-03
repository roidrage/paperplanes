---
layout: post
title: "Paul Tuckfield on Scaling MySQL"
tags: mysql
---
Paul Tuckfield (YouTube's MySQL administrator) gave a nice talk on do's and don'ts when it comes to scaling MySQL. He held it at last year's MySQL Conference, so it's not that recent, but it's still very much worth it.

You can (and should) watch his [presentation](http://mefeedia.com/entry/5238551/), though unfortunately his slides don't seem to be available anywhere. Colin Charles took some [notes](http://www.bytebot.net/blog/archives/2007/04/26/extreme-makeover-database-or-mysqlyoutube) which sum it up quite nicely.

At the end of his talks, Paul mentions the oracle caching mechanism. On each of their replication slaves they have a script running that basically reads the relay log on the slaves a little bit ahead of the SQL thread and turns the statements into SELECTs. The data is fetched into the cache and will already be there when the slave wants to update the data, so that I/O is minimized at the point of the actual applying of the data in the relay log. Pretty neat stuff.

A tool called [MaatKit](http://www.xaprb.com/blog/category/maatkit/) now includes a command that does exactly that. The author of MaatKit also wrote a [nice article](http://www.xaprb.com/blog/2008/01/13/how-pre-fetching-relay-logs-speeds-up-mysql-replication-slaves/) on the issue.

Paul also says that Python is one of the factors that YouTube scales. A little something to think about.