---
title: List All of the Riak Keys
topics: riak nosql
comments_disabled: true
layout: post
---
![Key rack](https://img.skitch.com/20111213-tkydhksqa79dwhc5ikb9n9g14j.png)

One of the most common questions to ask about Riak is: how do I get a list of all
the keys in my bucket, in the cluster, or that have an attribute that matches my
query using MapReduce?

The motivation behind it is simple: you want to delete all the keys in a bucket,
count the amount of keys stored in your cluster entirely, you want to clear out your
cluster or you want to run ad-hoc queries on the data stored in a bucket.

All valid in their own right.

But things are not so simple with Riak. To understand why, let's take a quick
look under the covers.

### What's in a bucket?

A bucket is a namespace in Riak. It's not a physically distinctive entity like a
table in a relational database. You can set some properties on it, things like
replication levels, commit hooks, quorum, but that's it. Those are stored in the
cluster's configuration which is gossiped around the cluster just like the data
that identifies what partition goes on which machine.

In fact, when you specify a bucket and a key to fetch or write some data,
they're stuck together to find the location in the cluster. Consider a
bucket-key combination like `users/roidrage`. To find the location, Riak hashes
both, not just the key. Both bucket and key uniquely identify a piece of data,
allowing you to have multiple object with the same key, but in different
buckets.

When an object is stored in Riak's storage backends, it uses both bucket and key
name to identify it. What you get as a result are files that contain an
abundance of different bucket-key combinations and their respective objects,
sometimes not even in any order. The only physical distinction Riak has for data
on disk is the partition they belong to. Everything else is up to the storage
backend. There's no distinction between buckets on disk.

One reason for this is consistent hashing. If you remember the [last installment
of this series](/2011/12/9/the-magic-of-consistent-hashing.html), I mentioned
that consistent hashing's downside is that you lose key ordering. Keys are
randomly spread out through the cluster. Some ordering still exists depending on
the backend, but in general, ordering is lost.

### Listing all of the keys

So to list keys in a bucket, Riak has to go through all of the keys in every
partition, and I mean ALL OF THEM. Here's a picture of keys and an impersonation
of Riak, having to take care of all of them.

<img src="https://img.skitch.com/20111213-g2ju8pdeefu4ns5q6j7m8smdr1.png" width="540"/>

No big deal, right? Unless of course, you store millions and millions of them,
and want to find about all the keys from say, the bucket `users`, which may not
even have to be more than 1000. To do that, Riak goes through every partition,
every partition loads the keys either from memory (Bitcask) or disk (LevelDB)
and sifts through them, finding the ones belonging to the `users` bucket.

All that said, it's certainly not impossible to do, if you have some time to
wait, depending on the amount of data stored.

    $ curl 'localhost:8098/buckets/users/keys?keys=true'

But wait, don't do that. Do this instead, streaming the keys instead of waiting
for them all to arrive and then having them dumped at once.


    $ curl 'localhost:8098/buckets/users/keys?keys=stream'

That's much better.

Listing keys has an impact on your Riak nodes, so if you can avoid it, don't do
it!

### So how do I really get all of the keys?

If `select * from riak` is not a great option, then what is?

Instead of relying on Riak, build an index on the keys. Thanks to [Riak 2i
(Secondary Indexes)](http://wiki.basho.com/Secondary-Indexes.html), this is
easy. In fact, you get indexing of keys for free when using the LevelDB backend,
just use the index `$key`. This takes advantage of LevelDB's sorted file
structure. Neat!

But, and here's the kicker, you can only fetch ranges of keys. So instead of
asking for all the keys, you ask for a range large enough to fit all the keys.

    $ curl 'localhost:8098/buckets/users/index/$key/0/zzzz'

This finds all the keys that start with something lexicographically larger than
`0` and less than `zzzz` and returns them to you in a list. Now there's a slim
chance you'll get users with names like that, but I'll leave that exercise, or
proper validations, up to you.

Using that list, you can count the number of keys in that bucket, or you can
delete them one by one.

### Ideally...

<a href="http://riakhandbook.com"><img src="https://img.skitch.com/20111213-jks6gqhww79y172qcdsdwpgbgu.png" style="float:right; margin-left: 10px;"></a>

In an ideal world, listing keys in a bucket would be possible and not an
expensive operation. Riak could for example allow users to store buckets in
separate files. The downside is that with a lot of buckets, you'll hit the
limits of open file descriptors in no time, a bit of a bummer. But until
something better comes along, secondary indexes are a nice tool to at least
avoid resorting to listing all of the keys.

Curious about other ways to index and query data in Riak? You'll like the [Riak
Handbook](http://riakhandbook.com), which will be published later this
week. Covers Riak's secondary indexes and other strategies to query, inspect and
analyze data.

Check back in tomorrow for an introduction on storing timelines in Riak.
