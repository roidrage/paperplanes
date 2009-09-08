---
topics: nosql databases
title: The NoSQL Dilemma (with a Happy Ending)
layout: post
---
Call it [NoSQL](http://voodootikigod.com/nosql-a-modest-proposal), call it [post-relational](http://therealadam.com/archive/2009/08/31/its-not-nosql-its-post-relational/), call it what you like, but it's hard to ignore that hings are happening in the database world. A paradigm shift is not too far ahead, and it's a big one, and I for one am welcoming our post-relational overlords. Whatever you call them, [CouchDB](http://couchdb.apache.org/), [MongoDB](http://www.mongodb.org/) (although you really shouldn't call a database MongoDB), [Cassandra](http://incubator.apache.org/cassandra/), [Redis](http://code.google.com/p/redis/), [Tokyo Cabinet](http://1978th.net/tokyocabinet/), etc. I'm well aware that they're not necessarily all the same, but they do try to fill similar gaps. Making data storage easy as pie, offering data storage fitting with the kind of evolving data we usually find on the web.

The web is slowly moving away from relational databases and with that, SQL. Let me just say it upfront: I hate SQL. I physically hate it. It doesn't fit with my way of thinking about problems, and it doesn't fit with the web. That's my opinion anyway, but I'm sure I'm not alone with it.

There is however one area where object-oriented databases failed, and where the new generation of document databases will have similar problems. You could argue that object-oriented databases are in some way a predecessor to modern post-relational databases, they made storing objects insanely easy, no matter how complex they were, and they made navigating through objects trees even easier and insanely fast. Which made them applicable to some problems, but they weren't flexible enough in my opinion. But they still laid some groundwork.

<div style="width:100%; text-align:center">
<img src="http://img.skitch.com/20090908-cmhe5mk953kst1je4kji3qub2p.jpg" alt="skitched-20090908-165230.jpg"/>
</div>

It's mainly concerning The Enterprise and their giant collection of reporting tools. Everybody loves tools, and The Enterprise especially loves them. The more expensive, the better. Reporting tools are the base for those awesome pie charts they just love to fill entire PowerPoint presentations with. They work on "standardized" interfaces and languages and therefore, with SQL.

I've worked on a project were we switched from an object-oriented to a relational database just because of that. Sure, there's proprietary query languages, or there's JQL when you're into JDO, EJB3 and the like. But they're nowhere as powerful as SQL is. They're also not as brain-twisting. That should be a good thing really, but there you have it.

NoSQL databases are facing a similar dilemma. Just like object-oriented databases they're awesome for just dumping data in it, more or less structured. It's easy to get them out too, and it's usually easy to aggregate the data in some way. Is it a big deal? Of course not, at least not in my opinion. But if it is some sort of deal, what can you do to work around that?

* Ignore it. Simple, isn't it? The reporting requirement can usually be solved in a different way. Sure, it can be more work, but usually reporting is less of a killer than some might think. Give the client some way to express a query and let him at it. Give him a spare instance of your replicated database, and let him work off that data. Best thing you could do is pre-aggregate it as much as possible so there's less work for the client.

* If you really need structured data in a relational database, consider replicating the data into one from your post-relational database of choice. I can hear you say: That guy's crazy, that'd involve so much work keeping the two in sync! No, it wouldn't. Create a fresh dump every time you need a current dataset, and dump it into your SQL database. Simple like that.

* Put an interface in front of the new database. Yes, it's insane, but I've done it, and it works. It doesn't have to be an SQL interface, just a common interface that works with one set of reporting tools. Yes, it's not ideal, but it's an option.

* Don't ignore it, keep using a relational database. Yep, not all of us are lucky enough, someone still has to serve the market demands. Legacy projects or clients are forcing us to stick with the old and the dusty model of storing and retrieving data. Quite a lot of people are happy with that, but I'm not.

I'm sure there's other options, these are just off the top of my head, and I can say that I've practiced all of them with more or less good results.. I for one am sick of still having to use MySQL on new projects. I've had my fun with it, and sure there's a whole bunch of patches that make it a bit more fun, but it's still MySQL. Yes, I am aware that there's PostgreSQL, but it's the same story. Old, old and old.

Should you still try to get a new generation database into new projects? Yes, yes and yes, you definitely should. Consider yourself lucky if you succeed, because you're still an early awesome adopter. Even use SimpleDB if you must, but maybe reconsider before you really use it, it's not great. But don't lie to your clients, they should be aware what they're getting into. It's no big deal, but the bigger they are the more likely they have administrators not yet familiar with the new tools. But the more people start using them now, the better they'll get before they hit the mainstream. Which they will eventually, rest assured. I'm ready, the web is ready, and the tools are ready. What about you?