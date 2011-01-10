---
title: MongoDB, Data Durability and Improvements coming in 1.8
topics: mongodb databases nosql durability
comments_disabled: true
layout: post
---
Last weekend I [tweeted two links](http://twitter.com/#!/roidrage/status/23779182852968449) to
[two](http://twitter.com/#!/mikemaccana/status/23397112360206337)
[tweets](http://twitter.com/#!/mikemaccana/status/23703196522254337) by a poor guy who apparently got his MongoDB
database into an unrecoverable state during shutdown whilst upgrading to a newer version. That tweet quickly made the
rounds, and the next morning I saw myself staring at replies stating that it was all his fault, because he 1.) used kill
-9 to shut it down because apparently the process hung (my guess is it was in the middle of flushing all data to disk)
and 2.) didn't have a slave, just one database instance.

Others went as far as [indirectly calling him an
idiot](http://twitter.com/#!/MacYET/status/24029811332612096). Oh interwebs, you make me sad. If you check out the
[thread on the mailing list](http://groups.google.com/group/mongodb-user/t/d0111a47984cb688), you'll notice a similar
pattern in reasoning. The folks over at <http://learnmongo.com> seem to want to be [the wittiest of them
all](http://twitter.com/#!/LearnMongo/status/23917393143140352), recommending to always have a recent backup, a slave or
replica set and to never `kill -9` your database.

While you can argue that the guy should've known better, there's something very much at odds here, and it seems to
become a terrifying meme with fans of MongoDB, the idea that you need to do all of these things to get the insurance of
your data being durable. Don't have a replica? Your fault. `kill -9` on a database, any database? You mad? Should've
read the documentation first, dude. This whole issue goes a bit deeper than just reading documentation, it's the
fundamental design decision of how MongoDB treats your data, and it's been my biggest gripe from the get go. I can't
help but be horrified by these comments.

I've heard the same reasoning over and over again, and also that it just hasn't happened so far, noone's really lost any
considerable data. The problem is, most people never talk about it publicly, because it's embarrassing, best proof is
the poor guy above. This issue is not even related to MongoDB, it's a general problem.

### Memory-Mapped Persistence

But let me start at the beginning, MongoDB's persistence cycle, and then get to what's being done to improve its
reliability and your data's durability. At the very heart, MongoDB uses [memory-mapped
files](http://en.wikipedia.org/wiki/Memory-mapped_file) to store data. A memory-mapped file is a data structure that has
the same representation on disk as it has when loaded into memory. When you access a document in MongoDB, loading it
from disk is transparent to MongoDB itself, it can just go ahead and write to the address in memory, as every database
in MongoDB is mapped to a dynamically allocated set of files on disk. Note that memory-mapped files are something you
won't find in a lot of other databases, if any at all. Most do their own house-keeping and use custom data structures
for that purpose.

The memory mapping library (in MongoDB's case the POSIX functions, and whatever Windows offers in that area) will take
care of handling the flush back to disk every 60 seconds (configurable). Everything in between happens solely in memory.
Database crash one second before the flush strikes again? You just lost most of the data that was written in the last 59
seconds. Just to be clear, the flushing cycle is configurable, and you should consider choosing a better value depending
on what kind of data you're storing.

MongoDB's much praised insert speed? This is where it comes from. When you write stuff directly to local memory, they
better be fast. The persistence cycle is simple: accept writes for 60 seconds, then flush the whole thing to disk. Wait
for another 60 seconds, then flush again, and so on. Of course MongoDB also flushes the data when you shut it down. But,
and here's the kicker, of course that flush will fail when you kill it without mercy, using the KILL signal, just like
the poor guy above did apparently. When you kill something that writes a big set binary data to disk, all bets are off.
One bit landing on the wrong foot and the database can get corrupted.

### Database Crashes are Unavoidable

This scenario can and does happen in e.g. MySQL too, it even happens with CouchDB, but the difference is, that in MySQL
you usually only have a slightly damaged region, which can be fixed by deleting and re-inserting it. In CouchDB, all
that happens is that your last writes may be broken, but CouchDB simply walks all the way back to the last successful
write and runs happily ever after.

My point here is simple: even when killed using the KILL signal, a database should not be unrecoverable. It simply
shouldn't be allowed to happen. You can blame the guy all you want for using `kill -9`, but consider the fact that it's
the process equivalent of a server or even just the database process crashing hard. Which happens, believe it or not.

Yes, you can and probably will have a replica eventually, but it shouldn't be the sole precondition to get a durable
database. And this is what horrifies me, people seem to accept that this is simply one of MongoDB's trade-offs, and that
it should just be considered normal. They shouldn't, it needs more guys like the one causing all the stir bringing up
these isses, even though it's partly his fault, to show the world what can happen when worse comes to worst.

People need to ask more questions, and not just accept answers like: don't use kill -9, or always have a replica around.
Servers crash, and your database needs to be able to deal with it.

### Durability Improvements in MongoDB 1.7/1.8

Now, the MongoDB folks aren't completely deaf, and I'm happy to report they've been working on improvements in the area
of data durability for a while, and you can play with the new durability option [in the latest builds of the 1.7
branch](http://www.mongodb.org/downloads), and just a couple of hours ago, there [was activity in improving the repair
tools](https://github.com/mongodb/mongo/commit/6485f8b9f3092bfb2d520adbd54a7809a047cc22) to better deal with corrupted
databases. I welcome these changes, very much so. MongoDB has great traction, a pretty good feature set, and the speed
seems to blow peoples' minds. Data durability has not been one of its strengths though, so I'm glad there's been a lot
of activity in that area.

If you start the MongoDB server with the new `--dur` option, and it will start keeping a journal. When your database
crashed, the journal is simply replayed to restore all changes since the last successful flush. This is not a
particularly special idea, because it's how your favorite relation database has been working for ages, and not unsimilar
to the storage model of other databases in the NoSQL space. It's a good trade-off between keeping good write speed and
getting a much more durable dataset.

When you kill your database harshly in between flushes with a good pile of writes in between, you don't lose a lot of
data anymore, maybe a second's worth (just as you do with MySQL when you use InnoDB's delayed flushing), if any at all,
but not much more than that. Note that these are observation based on a build that's now already more than a month old.
Situation may have improved since then. Operations are put into a buffer in memory, from where they're both logged to
disk into the journal, and then applied to the dataset. When writing the data to memory, it has already been written to
the journal. Journals are rotated once they reach a certain size and it's ensured that all their data has been applied
to the dataset.

A recovery process applies all uncommitted changes from the log when the database crashes. This way it's ensured that
you only lose a minimum set of data, if none at all, when your database server crashes hard. In theory the journal could
be used to restore a corrupted in a scenario as outlined above, so it's pretty neat in my opinion. Either way, the risk
of losing data is now pretty low. In case your curious for code, the magic happens in [this
method](https://github.com/mongodb/mongo/blob/master/db/dur.cpp#L419-461).

I for one am glad to see improvements in this area of MongoDB, and I'm secretly hoping that durable will become the
default mode, though I don't see it happening for marketing reasons anytime soon. Also, be aware that durability brings
more overhead. In some initial tests however, the speed difference between non-durable and durable MongoDB was almost
not worth mentioning, though I wouldn't call them representative, but in general there's no excuse to not use it really.

It's not yet production ready, but nothing should keep you from playing with it to get an idea of what it does.

### Bottom Line

It's okay to accept trade-offs with whatever database you choose to your own liking. However, in my opinion, the
potential of losing all your data when you use `kill -9` to stop it should not be one of them, nor should accepting
that you always need a slave to achieve any level of durability. The problem is less with the fact that it's MongoDB's
current way of doing persistence, it's with people implying that it's a seemingly good choice. I don't accept it as
such. If you can live with that, which hopefully you don't have to for much longer anyway, that's fine with me, it's not
my data anyway. Or maybe I'm just too paranoid.
