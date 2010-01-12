---
layout: post
title: Redis and Rails sitting on the Couch
topics: rails redis couchdb
---
I've been spending some quality time with two of my new favorite tools lately ([CouchDB](http://couchdb.apache.org/) and [Redis](http://code.google.com/p/redis), duh!), and while integrating them into [Scalarium](http://scalarium.com) some needs and as a result some smaller hacks emerged. I don't want to deprive the world of their joy, so here they are.

First one is a tiny gem that will allow you to use Redis as a session store. What's so special about it, there's [redis-store](http://github.com/jodosha/redis-store), right? Sure, but I couldn't for the life of me get to work reliably. Seems that's due to some oddity in Rack or something, at least that's where my interest of further investigating the issues faded, and I decided to just rip the code off MemCacheStore, and there you have it, [redis-session-store](http://github.com/mattmatt/redis-session-store). Rails-only and proud of it.

While working on it I constantly kept a monitor process open on Redis. Great feature by the way, if not awesome. I used telnet, and somehow I constantly managed to hit Ctrl-C in the terminal I had the telnet session open in. Reconnecting manually is tedious, so I give you my little redis-monitor script:

<script src="http://gist.github.com/267149.js?file=redis-monitor.rb"></script>

Incredibly simple, but saves those precious moments you'd waste typing everything by hand.

Last but not least, here's a hack-ish patch to make [CouchPotato](http://github.com/langalex/couch_potato/) (great CouchDB Ruby library by the way) dump view queries into the log file. The ugly part at the end is me trying to get the log that's output at the end of each request to include the DB time for CouchDB queries.

<script src="http://gist.github.com/272912.js?file=snippet.rb"></script>

It's not great, but works for now. We'll very likely include something decent into CouchPotato without hacking into ActionController like that. Unfortunately to get this far, there's really no other way. I tried faking ActiveRecord, but you open a whole other can of worm doing that, because a lot of code in Rails seems to rely on the existance on the ActiveRecord constant, assuming you're using the full AR stack when the constant is defined. Here's hoping that stuff is out the door in Rails 3. Haven't checked to be honest.

Dump that file into an initializer, and you're good to go (for the moment). 