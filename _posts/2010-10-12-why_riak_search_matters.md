---
title: Why Riak Search Matters...
topics: riak search fulltext
layout: post
---
The awesome dudes at [Basho](http://basho.com) released [Riak 0.13 and with it their first
version](http://blog.basho.com/2010/10/11/riak-0.13-released/) of [Riak
Search](http://wiki.basho.com/display/RIAK/Riak+Search) yesterday. This is all kinds of exciting, and I'll tell you why.
Riak Search is (way down below) based on Lucene, both the library and the query interface. It mimicks the Solr web API
for querying and indexing. Just like you'd expect something coming out of Basho, you can add and remove nodes at any
time, scaling up and down as you go. I've seen an introduction on the basics back at Berlin Buzzwords, and it was
already shaping up to be nothing but impressive. But enough with all the praise, why's this stuff exciting?

* The key/value model is quite restrictive when it comes to fetching data by, well anything else than a key. Keeping
  reverse lookup indexes was one way to do it, but the consistency model of Riak made it hard if not impossible to
  maintain a consistent list of interesting entries in an atomic way.

  Riak Search fills this gap (and not only for Riak, the key/value store, but for any key/value store if you will) by
  offering something that scales up and down in the same way as Riak, so you don't have to resort to e.g. Redis to
  maintain reverse lookup indexes.

    Run [queries in any way you can think of](http://wiki.basho.com/display/RIAK/Riak+Search+-+Querying), fetch ranges, groups,
  you name it, no need to do anything really. It even [integrates directly with Riak through pre-commit
  hooks.](http://wiki.basho.com/display/RIAK/Riak+Search+-+Indexing+and+Querying+Riak+KV+Data)

* It's based on proven technology (Lucene, that is). It doesn't compete with something entirely new, it takes what's
  been worked on and constantly improved for quite a while now, and raises it onto a new foundation to make it scale
  much nicer, [the foundation](http://wiki.basho.com/display/RIAK/Riak+Search#RiakSearch-MajorComponents) being Riak
  Core, Riak KV and Bitcasks, and some new components developed at Basho.

* It uses existing interfaces. Imagine just pointing your search indexing library to a new end point, and there you go.
  Just the thought of that makes me teary. Reindex data, reconfigure your clients to point to a new endpoint, boom,
  there's your nicely scalable search index.

* Scaling Solr used to be awkward. Version 1.5 will include some heavy improvements, but I believe the word [shard fell
  at some point.](http://www.lucidimagination.com/blog/2009/12/12/apache-solr-1-5-on-the-move-with-more-functionality/)
  Imagine a Solr search index where you can add and remove nodes at any time, the indexing rebalancing without requiring
  manual intervention.

  Sound good? Yeah, Riak Search can do that too.

Remember though, it's just a first release, which will be improved over time. I for one am just happy they finally
released it, I almost crapped my pants, it's that exciting to have something like Riak Search around. And I say that
with all honesty and no fanboyism whatsoever. Having used Solr quite a lot in the past I'm well aware of its strengths
and weaknesses and the sweet spot Riak Search hits.

I urge you to play with it. [Installing it](http://wiki.basho.com/display/RIAK/Riak+Search+-+Installation+and+Setup) and
[feeding it with data](http://wiki.basho.com/display/RIAK/Riak+Search+-+Indexing) could not be easier. Well done, Basho!

Update: From reading all this you may get the impression that Riak Search builds heavily on a Lucene foundation. That's
not the case. When I say that it builds on top of Lucene, I actually meant that it can and does reuse its analyzers and
query parsing. Both can be replaced with custom (Erlang) implementations. That's the only part of Lucene that is
actually used by Riak Search, because why reinvent the wheel?
