---
layout: post
topics: couchdb
title: "10 Annoying Things About CouchDB"
---
Hi, I'm Mathias, and I'm a [CouchDB](http://couchdb.apache.org/) user. I've been using it for almost a year now, and we
have a [project using it in production](http://scalarium.com), with a side of Redis. I think it's an awesome database,
some of its features are simply unrivaled. [Offline replication](http://wiki.apache.org/couchdb/Replication),
[CouchApps](http://couchapp.org/), to name a few. CouchDB just hit version 1.0.  It's been a long time coming, with
CouchDB having probably one of the longest histories in the non-relational database space. I've heard about it first
back in September 2008, when Jan Lehnardt talked about it at a local co-working space.  I still blame him for getting me
all excited about this whole NoSQL thing. Fun fact: I bookmarked the CouchDB website back in February 2008.

The features being added to it with every release are nothing short of exciting. CouchDB 0.11 got [filtered
replication](http://blog.couch.io/post/446015664/whats-new-in-apache-couchdb-0-11-part-two-views), support for [URL
rewriting and vhosts](http://blog.couch.io/post/443028592/whats-new-in-apache-couchdb-0-11-part-one-nice-urls), amongst
other things. But there's still some things that annoy me, that somewhat bug me in my daily work with it.

The following things are not incredible pet-peeves I have with CouchDB. I think CouchDB is pretty awesome, and I really
like using it. However, it doesn't come without the occasional odditity that will leave you scratching your head. These
probably aren't the only things to be aware of, they're just the most annoying to me. Your mileage may vary. They may or
may not be annoying to you, but they're things that are good to know working with CouchDB. Whether CouchDB should or
should not have what I'm listing here is a whole different story. It's my wishlist of improvements, if you will.

It's also stuff you're buying into when you move off the beaten path of relational databases. As always, some of these
are not hard to find out, some of them do only get really annoying once you're moving into production, or when you get a
deeper knowledge of the tool at hand. Nothing specific to CouchDB here, but some of the issues listed below stem from
actively using it. Take them with a grain of salt. While they may seem annoying at first, they're things you can live
with. Believe me, you can.

**Views are updated on read access**

You can dump in as many documents as you want, and you can create as many map/reduce views as you want. The truth is,
they'll only come all together to slow down your application when you're querying the view. Assume you have a good stash
of documents in your database, and you decide you need a new view on your data. Throw in the JavaScript functions and go
ahead and query the view. Calling it a slow-down may be a stretch at times though, it really depends on how often your
data is updated.

CouchDB will notice that the B-tree for the view doesn't exist yet, so it goes ahead and builds it on the first read.
Depending on how many documents you have in your database, that can take a while, putting a good work load on your
database.

On every subsequent read, CouchDB will check if documents have changed since the last write, and throw the changed
documents at the map and reduce function. So if you only query some views from time to time, but have lots of changes in
between, expect some delays on the next read. A way around this would of course be to keep your views warm by reading
them regularly, e.g. through a cron job.

When you add new views, be sure to [pre-warm](http://wiki.apache.org/couchdb/Regenerating_views_on_update) them before
you first access them in your application. One way would be to add the views at a time where you database isn't accessed
as much. It doesn't block all access to the documents, but it sure has a certain impact on your database's performance,
and of course the first requests that may time out because CouchDB is building the requested views in the background.

When it comes to just updating a view, and it might take too long, you can set the parameter `stale=ok`. That way, even
if the view data needs to be updated, CouchDB won't update it and just return the last known state of the view's B-tree.

That's all fun and giggles, but when on earth are you supposed to actually update your view? Always reading stale data
is not great? I've gotten some odd suggestions when I complained about this elsewhere, but in the end I just want to
tell the database that I'm okay with stale data, but that it should update the view in the background.

**No automatic compaction**

As your database grows and data gets updated, CouchDB leaves old and stale data untouched, appending new data (inserted
and updated documents are considered new data) to the end of its database files, a fact that's also true for view files.
That has the neat advantage that you can still access old revisions of your documents, but it will also leave your
database files growing constantly. Now, depending on the number of documents and updates on them, that might not be a
big deal, but it's a good idea to start regular compaction earlier than later.

[Riak's Bitcask file backend](http://downloads.basho.com/papers/bitcask-intro.pdf) has a neat way of automatically
compacting its files. It appends data in a similar manner as CouchDB, but can determine if a node in the cluster can run
compaction on its data, and do so automatically, without much need for human intervention. It'd be nice to have
something similar as part of CouchDB without having to run cron jobs to do that.

The append-only mechanism makes CouchDB bullet-proof, no doubt, you'll always have consistent data files on your hard
disk, backups are as simple as copying the files elsewhere, or take an EBS volume snapshot at any time. But that level
of data consistency comes with a price, and that's an ever-growing data file.

**No partial updates**

Whenever you update a document in CouchDB, you update it as a whole, there's nothing in between. That kind of makes
sense with the way CouchDB works, but as a user it annoys me from time to time. It seems so pointless fetching and
sending a whole document when I'm just updating one attribute. There's a [neat RFC for the PATCH command in
HTTP](http://tools.ietf.org/html/rfc5789) making the rounds, I'd love to see that end up in CouchDB at some point. No
idea how likely that is, the makers of CouchDB have a weird aversion to using diffs to update data.

Note that I'm not talking about the MongoDB way of setting attributes atomically. I don't need that, because it simply
doesn't scale well, especially not with the CouchDB storage model, and you're not updating data in-place like MongoDB.
It's more about just being able to send a diff or a minor update than a whole document.

You can somewhat fake this using [update handlers](http://wiki.apache.org/couchdb/Document_Update_Handlers) (look at the
view called "in-place") from CouchDB 0.10 on. It's pretty neat, but it's just not the same.

**No built-in way to scale up**

CouchDB's replication is unrivaled, no doubt. Being able to replicate any database with any other database at any point
in time makes CouchDB unique, some say it's the killer feature, and I concur. There's lot of argueing whether or not
that defines CouchDB as being distributed. In the most traditional sense, at least to me, it sure does, but I'm not here
to nitpick about that. It's easy to scale out by adding more nodes and setting them up to constantly replicate with
each other, make anyone a master or slave as you like. But there's no way to distribute write and read access across a
cluster of nodes.

[CouchDB-lounge](http://tilgovi.github.com/couchdb-lounge/) has been the traditional way to approaching that, but I
never really liked it, because it added more components to the infrastructure. Something like that should really be
built in.  The good news is that [Cloudant](http://cloudant) is planning on open-sourcing their clustering solution Open
Cloudant, which will then hopefully become part of CouchDB. A quorum based system for CouchDB would be neat, and it
doesn't seem too far away.

**Pagination is awkward**

CouchDB's B-tree is a leaky abstraction, that's the conclusion I came to at some point. It has a pretty big impact on
your application's code, and that's not necessarily a bad thing. Suddenly you deal with things like conflicts, or simply
updating views on reads. But no other part of your web application will make that as obvious as pagination, a pretty
common and natural part of a web application.

The path of least resistence to get pagination is to use the [skip and limit
parameters](http://books.couchdb.org/relax/reference/recipes#Pagination), but it's not recommended, as you'll still be
walking the whole B-tree to determine the number of documents that must be skipped before it can collect the ones you're
interested in.

The recommended way to do pagination is a bit awkward if you ask me. There's a good explanation in the [CouchDB
book](http://roidi.us/d6f6), so I'll spare you repeating it here. But be sure to read it, because understanding that
takes you half way to understanding the B-tree. It may be awkward, and very different from what you're used to, but
that's how the B-tree works. It's not always unicorns and rainbows, sometimes it kinda gets in your way. Trade-offs,
meh.

The simpler alternative would of course be to just use endless pagination, where you let the users just click a more
button instead of clicking through the pages, because you know the last document displayed in your list, and the key
that was used to fetch it. You simply use that key and the last document's id to step directly into the B-tree where you
left off. You need to remember to fetch one additional document, as CouchDB will return the last document too, or you
can just skip one document, which is acceptable, as skipping just one leaf in a tree is an operation of predictable
performance.

**Range queries are awkward**

To do a range, you have to specify a start and an end key. That's the simple part. It starts getting awkward when your
keys get slightly more complex, e.g. when your map function emits arrays. Assume you want to fetch all elements where
the first part of the array matches a particular key, and the second part doesn't matter, e.g. when you emitted a
timestamp as the second part to keep a natural (in terms of last update for example) order.

Assume your keys look like this: `['123', '2010/07/21']`, that's the key format
[SimplyStored](http://github.com/peritor/simply_stored) uses to manage associations between documents. To get the range that
only matches the first part of the key, your startkey has to look like this: `['123']`. This will match all documents
having the above key. If you don't specify an endkey, CouchDB will simply return all documents following that key, so
you need to specify an endkey. The recommended way to do that is to use the following format: `['123', {}]`. That way
you'll get all documents matching the first part of the key, because `{}` is considered to be greater than any string
you may have emitted. See the CouchDB wiki on more details on this technique called [view
collation](http://wiki.apache.org/couchdb/View_collation).

Obviously it's not impossible to do range queries in CouchDB, but it's slightly awkward. It all goes
[downhill](https://issues.apache.org/jira/browse/COUCHDB-834) as soon as you want to fetch only a particular subrange of
the original one, using startkey_docid or endkey_docid, say for pagination. With the above ranges, they simply don't
work. Both need a startkey and endkey that is an exact match. The whole point of the above range query is not to care
about the exact start and end key, isn't it?

**No CommonJS available in MapReduce functions**

With CouchDB 0.11, CommonJS and all its awesomeness became [available in view
functions](http://wiki.apache.org/couchdb/CommonJS_Modules). I was pretty excited about it, and I still am. However, map
and reduce functions were left out in the cold. Every time I have to write the same piece of JavaScript in a map or reduce
function that I've used elsewhere already, I get bitter about that. Sometimes it's just very basic stuff that I could
easily solve by throwing an existing library at it, but instead I'm cluttering my view code with it over and over again.
And yes, there's the `!code` placeholder, but it's not about throwing an undebuggable mess of code into my view
function, it's about not repeating myself. `!code` doesn't really solve that problem good enough for me.

Word is that it's got something to do with determining whether files have updated or not, but hey CouchDB, why don't you
let me worry about that and let me tell you when I think a file I've included through CommonJS has been updated? I would
very much appreciate that.

**No link-walking between documents**

With CouchDB 0.11, map functions got a way to [emit other
documents](http://blog.couch.io/post/446015664/whats-new-in-apache-couchdb-0-11-part-two-views) using `{_id:
doc.other_id}`, but that still doesn't allow full access to e.g. attributes of said documents. Sometimes that'd just be
handy to have. Sure, you could use embedded documents, but in that case it'd just be a dumb workaround, where I could
just have a way to fetch a document by its identifier and throw some of its attributes at the map function.

Say what you will though, just being able to emit other documents is still pretty cool. Makes querying and fetching
associated documents a bit easier.

**All reads go to disk**

CouchDB doesn't cache anything. It does delay commits if you want it to, so that it doesn't hit the disk on every
document update, but it sure as heck doesn't cache anything in memory. This is both curse and blessing. It keeps the
memory footprint of CouchDB incredibly small, no doubt. Considering they're targeting mobile devices it makes a lot of
sense, plus, accessing flash-based storage is a lot cheaper than spinning disks.

But, on the other hand, when I have the memory available, why not use it? I know caching is a hard problem to solve.
CouchDB is also made for high concurrency, no doubt, but my disks aren't necessarily. Sure, I could buy faster disks,
but if you really think about it, memory is the new disk, plus, tell Amazon to offer faster network storage for EC2,
please do, maybe that'd already help. CouchDB somewhat relies on the file system cache doing its magic to speed up
things, but I really don't want to rely on magic. You could put an HTTP-level reverse proxy like Varnish in front of
CouchDB though, that'd be a feasable option, but that adds another layer to your infrastructure.

In all seriousness, I'd love to see some caching introduced in CouchDB. I won't say it's an easy feature to implement,
because it sure isn't, but it doesn't need to be something fancy, I just would like to see CouchDB use some of my memory
for data that's read more often than it's written. But until then, Varnish to the rescue!

**Error messages are not helping**

I'm just gonna post the following snippet from my CouchDB log file, and leave you to it. You tell me how useful it is.
Suffice it to say, I just wish CouchDB would not dump all that Erlang trace into my log, but maybe a useful error
message for a change. It works in some cases, but a lot of times, when the problem usually is as simple as a permissions
problem, you're left scratching your head.

    {<0.84.0>,supervisor_report,
     [{supervisor,{local,couch_secondary_services}},
      {errorContext,start_error},
      {reason,
          {'EXIT',
              {undef,
                  [{couch_auth_cache,start_link,[]},
                   {supervisor,do_start_child,2},
                   {supervisor,start_children,3},
                   {supervisor,init_children,2},
                   {gen_server,init_it,6},
                   {proc_lib,init_p_do_apply,3}]}}},
      {offender,
          [{pid,undefined},
           {name,auth_cache},
           {mfa,{couch_auth_cache,start_link,[]}},
           {restart_type,permanent},
           {shutdown,brutal_kill},
           {child_type,worker}]}]}}

**The End**

There you go, some annoying things about CouchDB. They're annoying, but I still like CouchDB a lot. It's stuff I can
live it, it's stuff I can work around, it's stuff that doesn't have as big an effect in production as it may seem. The
bottom line is, as always, evaluate your tools. The above list is not to be taken as a list of arguments purely against
using CouchDB. Consider them a list of things you need to be aware of, that may or may not be acceptable compared to
what you gain.

In the end, and any way you look at it, CouchDB still kicks butt.
