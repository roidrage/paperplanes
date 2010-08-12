---
title: "An Inconvenient Caveat about MongoDB's Replica Sets (updated)"
topics: mongodb replication
layout: post
---
Update: Read the comments and below. The issue is not as bad as it used to be in the documentation and the original
design, thankfully.

A lot has happened since I've first [written about MongoDB back in
February](/2010/2/25/notes_on_mongodb.html). Replica Pairs are going to be deprecated, being
replaced by Replica Sets, a working Auto-Sharding implementation, including rebalancing shards, and lots more, all
neatly wrapped into the [1.6 release](http://blog.mongodb.org/post/908172564/mongodb-1-6-released).

The initial draft on how they'd turn out sounded good, but something struck me as odd, and it is once again one of these
things that tend to be overlooked in all the excitement about the new features. Before we dive any deeper, make sure
you've read the [documentation](http://www.mongodb.org/display/DOCS/Replica+Sets), or check out this rather short
[introduction on setting up a Replica
Set](http://www.coffeepowered.net/2010/08/06/setting-up-replica-sets-with-mongodb-1-6/), I won't go into much detail on
Replica Sets in general, I just want to point out one major issue I've found with them. Part of the [documentation sheds
some light on the inner workings of Replica Sets](http://www.mongodb.org/display/DOCS/Replica+Set+Internals). It's not
exhaustive, but to me more interesting than the rest of the documentation.

One part struck me as odd, the paragraph on [resyncing data from a new
primary](http://www.mongodb.org/display/DOCS/Replica+Set+Internals#ReplicaSetInternals-Resync%28ConnectingtoaNewPrimary%29)
(as in master). It's two parts actually, but they pretty much describe the same caveat:

> When a secondary connects to a new primary, it must resynchronize its position. It is possible the secondary has
> operations that were never committed at the primary. In this case, we roll those operations back.

Also:

> When we become primary, we assume we have the latest data. Any data newer than the new primary's will be discarded.

Did you notice something? MongoDB rolls operations back that were never committed to the primary, discarding the updated
data, which is just a fancy term for [silently deleting data without further
notice](http://www.mongodb.org/display/DOCS/Replica+Set+Internals#ReplicaSetInternals-AssumptionofPrimary). Imagine a
situation where you just threw a bunch of new or updated data at your current master, and the data has not yet fully
replicated to all slaves, when suddenly your master crashes. According to [the
protocol](http://www.mongodb.org/display/DOCS/Replica+Set+Internals#ReplicaSetInternals-PickingPrimary) the node with
the most recent opslog entries takes over the primary's role automatically.

When the old master comes back up, it needs to resynchronize the changes from the current master, before it can play any
role in the set again, no matter if it becomes the new primary, or sticks to being a secondary, leaving the new master
in place. During that resync it discards data that has not been synchronized to the new master yet. If the opslog on the
new master was behind a couple of dozen entries before the old one went down, all that data is lost. I repeat: lost.
Think about that.

[There's ways to reduce the
pain](http://www.mongodb.org/display/DOCS/Replica+Set+Internals#ReplicaSetInternals-IncreasingDurability), and I
appreciate that they're mentioned appropriately in the documentation. You can tell MongoDB to consider a write
successful when it replicated to a certain number of secondaries. But you have to wait until that happened, [polling
`getLastError()` for the state of the last
operation](http://www.mongodb.org/display/DOCS/Verifying+Propagation+of+Writes+with+getLastError). Or you could set
`maxLag` accordingly, so that the master will fail or block a write until the secondaries catch up with the replication,
though I couldn't for the life of me figure out (using the Googles) where and how to set it.

But I don't approve of this behavior as a default, and the fact that you need to go through the internals to find out
about it. [Everything else suggests](http://www.mongodb.org/display/DOCS/Sharding+and+Failover) that there's no point of
failure in a MongoDB setup using sharding and Replica Sets, even comparing it to the Dynamo way of guaranteeing
consistency, which it simply isn't when the client has to poll for a successful write.

It's one of those things that make me reconsider my (already improved) opinions on MongoDB all over again, just when I
started to warm up with it. Yes, it's wicked fast, but I simply disagree with their take on durability and consistency.
The tradeoff (as in: losing data) is simply too big for me. You could argue that these situations will be quite rare,
and I would not disagree with you, but I'm not fond of potentially losing data when they do happen. If this works for
you, cool! Just thought you should know.

*Update*: There's been some helpful comments by the MongoDB folks, and there's good news. Data is not silently discarded
in 1.6 anymore, apparently it's stored in some flat file, fixed with [this
issue](http://jira.mongodb.org/browse/SERVER-1512), though it's hard for me to say from the commits what exactly
happens. The documentation does not at all reflect these changes, but improvements are on the way. I'm still not happy
about some of the design decision, but they're rooted in the way MongoDB currently works, and changing that is unlikely
to happen, but at least losing data doesn't seem to be an option anymore. If making a bit of a fool out of myself helped
to improve on the documentation front, so be it. I can live with that.
