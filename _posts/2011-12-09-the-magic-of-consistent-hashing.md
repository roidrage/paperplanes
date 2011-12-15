---
title: The Simple Magic of Consistent Hashing
topics: nosql riak
layout: post
comments_disabled: true
---
The simplicity of consistent hashing is pretty mind-blowing. Here you have a
number of nodes in a cluster of databases, or in a cluster of web caches. How do
you figure out where the data for a particular key goes in that cluster?

You apply a hash function to the key. That's it?  Yeah, that's the whole deal of
consistent hashing. It's in the name, isn't it?

The same key will always return the same hash code (hopefully), so once you've
figured out how you spread out a range of keys across the nodes available, you
can always find the right node by looking at the hash code for a key.

It's pretty ingenious, if you ask me. It was cooked up in the lab chambers at
Akamai, back in the late nineties. You should go and [read the original paper
right after we're done here][1].

Consistent hashing solves the problem people desperately tried to apply sharding
to pretty nicely and elegantly. I'm not going to bore you with the details on
how exactly consistent hashing works. [Mike Perham][2] does a pretty good job at
that already, and there are [many more blog posts][7] explaining
[implementations][8] and [theory behind it][9]. Also, that [little upcoming
book](http://twitter.com/riakhandbook) of mine has a full-length explanation
too. Here's a graphic showing the basic idea of consistent hashing, courtesy of
Basho.

![Consistent Hashing](http://paperplanes-assets.s3.amazonaws.com/consistent-hashing.png)

Instead I want to look at the practical implications of consistent hashing in
distributed databases and cache farms.

### Easier to Avoid Hotspots

When you put data on nodes based on a random result, which is what the hash
function calculates, a value that's a lot more random than the key it's based
on, it's easier to avoid hotspots. Why?

Assume a key based on an increasing value, or a simple range of keys, based on
the hour of the day, like `2011-12-11-13`. You add new hours and therefore new
data as time passes, and keys are stored based on the range they fall in. For
example, the keys `2011-12-11-18` until `2011-12-11-23` are stored on the same
node, with the rest of the keys stored on other nodes, just because the ranges
or the partitioning scheme happen to be set up this way.

For a consumer-facing site, the evening hours are usually the busiest time of
the day. They create more data, more writes, and possibly more reads too. For
the hours between 18:00 and 23:00, all the load goes to the single node that
carries all the relevant data.

But when you determine the location in the cluster based solely on the hash of
the key, chances are much higher that two keys lexicographically close to each
other end up on different nodes. Thus, the load is shared more evenly. The
disadvantage is that you lose the order of keys.

There are partitioning schemes that can work around this, even with a
range-based key location. HBase (and Google's BigTable, for that matter) stores
ranges of data in separate tablets. As tablets grow beyond their maximum size,
they're split up and the remaining parts re-distributed. The advantage of this
is that the original range is kept, even as you scale up.

### Consistent Hashing Enables Partitioning

When you have a consistent hash, everything looks like a partition. The idea is
simple. Consistent hashing forms a keyspace, which is also called continuum, as
presented in the illustration. As a node joins the cluster, it picks a random
number, and that number determines the data it's going to be responsible for.
Everything between this number and one that's next in the ring and that has
been picked by a different node previously, is now belong to this node. The
resulting partition could be of any size theoretically. It could be a tiny
slice, or a large one.

First implementations of consistent hashing still had the problem that a node
picking a random range of keys resulted in one node potentially carrying a
larger keyspace than others, therefore still creating hotspots.

But the improvement was as simple as it was ingenious. A hash function has a
maximum result set, a SHA-1 function has a bit space of 2^160. You do the
math. Instead of picking a random key, a node could choose from a fixed set of
partitions, like equally size pizza slices. But instead of picking the one with
the most cheese on, everyone gets an equally large slice. The number of
partitions is picked up front, and practically never changes over the lifetime
of the cluster.

For good measure, here's a picture of a sliced pizza.

![Consistent Pizza](http://paperplanes-assets.s3.amazonaws.com/consistent-pizza.jpg)

### Partitioning Makes Scaling Up and Down More Predictable

With a fixed number of partitions of the same size, adding new nodes becomes
even less of a burden than with just consistent hashing. With the former, it was
still unpredictable how much data had to be moved around to transfer ownership
of all the data in the range of the new node. One thing's for sure, it already
involved a lot less work than previous methods of sharding data.

With partitioning, a node simply claims partitions, and either explicitly or
implicitly asks the current owners to hand off the data to them. As a partition
can only contain so many keys, and randomness ensures a somewhat even spread of
data, there's a lot less unpredictability about the data that needs to be
transferred.

If that partitions just so happens to carry the largest object by far in you
whole cluster, that's something even consistent hashing can't solve. It only
cares for keys.

Going back to HBase, it cares for keys and the size of the tablet the data is
stored in, as it breaks up tablets once they reach a threshold.  Breaking up and
reassigning a tablet requires coordination, which is not an easy thing to do in
a distributed system.

### Consistent Hashing and Partitioning Enable Replication

Consistent hashing made one thing a lot easier: replicating data across several
nodes. The primary means for replication is to ensure data survives single or
multiple machine failures. The more replicas you have, the more likely is your
data to survive one or more hardware crashes. With three replicas, you can
afford to lose two nodes and still serve the data.

With a fixed set of partitions, a new node can just pick the ones it's
responsible for, and another stack of partitions it's going to be a replica for.
When you really think about it, both processes are actually the same. The beauty
of consistent hashing is that there doesn't need to be master for any piece of
data. Every node is simply a replica of a number of partitions.

But replication has another purpose besides ensuring data availability.

### Replication Reduces Hotspots (Even More!!!)

Having more than one replica of a single piece of data means you can spread out
the request load even more. With three replicas of that data, residing on three
different nodes, you can now load-balance between them. Neat!

With that, consistent hashing enables a pretty linear increase in capacity as you
add more nodes to a cluster.

### Consistent Hashing Enables Scalability and Availability

Consistent hashing allows you to scale up and down easier, and makes ensuring
availability easier. Easier ways to replicate data allows for better
availability and fault-tolerance. Easier ways to reshuffle data when nodes come
and go means simpler ways to scale up and down.

It's an ingenious invention, one that has had a great impact. Look at the likes
of [Memcached][3], [Amazon's Dynamo][4], [Cassandra][5], or [Riak][6]. They all
adopted consistent hashing in one way or the other to ensure scalability and
availability.

Want to know more about distributed databases in general and Riak in particular?
You'll like the [Riak Handbook](http://riakhandbook.com/), a hands-on
guide full of practical examples and advice on how to use Riak to ensure
scalability and availability for your data.

In the next installment we're looking at the consequences and implications of
losing key ordering in a Riak cluster.

[1]: http://www.akamai.com/dl/technical_publications/ConsistenHashingandRandomTreesDistributedCachingprotocolsforrelievingHotSpotsontheworldwideweb.pdf "Akamai - Consistent Hashing and Random Trees"
[2]: http://www.mikeperham.com/2009/01/14/consistent-hashing-in-memcache-client/ "Mike Perham - Consistent Hashing in memcache-client"
[3]: http://memcached.org/ "Memcached"
[4]: http://www.allthingsdistributed.com/2007/10/amazons_dynamo.html "Amazon Dynamo"
[5]: http://cassandra.apache.org/ "Cassandra"
[6]: http://basho.com/products/riak-overview/ "Riak"
[7]: http://www.tomkleinpeter.com/2008/03/17/programmers-toolbox-part-3-consistent-hashing/ "Tom Peter - Programmer’s Toolbox Part 3: Consistent Hashing"
[8]: http://www.lexemetech.com/2007/11/consistent-hashing.html "Tom White - Consistent Hashing"
[9]: http://michaelnielsen.org/blog/consistent-hashing/ "Michael Nielsen - Consistent Hashing"
