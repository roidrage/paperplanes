---
title: Storing User Timelines in Riak
tags: riak nosql
layout: post
---
The idea of building and storing user timelines (think Twitter) in Riak confused
me at first. It sounds like such a spot-on case for time series databases. Yet
[Yammer](http://basho.com/blog/technical/2011/03/28/Riak-and-Scala-at-Yammer/)
managed to make the idea pretty popular. The whole thing lacked implementation
though, because they kept their to themselves, which I don't blame them for at
all.

![Apple Mac Timeline](https://img.skitch.com/20111215-kyt2di6kbkwrb1trsquudhy7xa.png)

So let's have a look at how simple it is to build one. You can see a timeline of
all Apple Macintosh products above, but that's not what we want to build.

Instead we want to build something like the Twitter timeline. A user follows
many other users, and wants to look at a feed built from their activities, so
something like the timeline shown below.

![Twitter timeline](https://img.skitch.com/20111215-qwnywuamtahh356qi9ri3yt9ae.png)

### How do you model a timeline in Riak?

For every user we store one object in Riak. Every timeline contains a list of
tweet ids, or whatever activity you're referencing, or it can contain the whole
tweets. Something like this should work:

<script src="https://gist.github.com/1481859.js?file=timeline.json"></script>

If you want to store more data, turn the list into an array of hashes containing
whatever information is necessary to rebuild the timeline later. 

<script src="https://gist.github.com/1481859.js?file=complex_timeline.json"></script>

### Adding entries to the timeline

To add new entries to a timeline, prepend them to the existing list of
entries, here's some Ruby code to show how it's done.

<script src="https://gist.github.com/1481859.js?file=add_entry.rb"></script>

The code assumes you take care of followership somewhere else. You can store
that data in Riak too, but the code is oblivious to its whereabouts.

### Conflicts, siblings, oh my!

The fun starts when two clients update the same timeline, you get a conflict
and siblings. The strength of a simple data structure like the example above is
that they're easy to merge together while still keeping ordering based on the
ids. The ids are ordered only in this example, Twitter somewhat makes sure they
are.

When you get a conflict, a smart Riak library like
[Ripple](https://github.com/seancribbs/ripple) helps you find out about it. To
add on the earlier example, here's a version of `add` that detects conflicts.

<script src="https://gist.github.com/1481859.js?file=add_conflicts.rb"></script>

Suddenly you have two or more objects instead of one, each containing a different timeline. To
turn them into a single list, you merge all of them together, discard the
duplicates, and restore order based on the id. Here's some Ruby to do that.

<script src="https://gist.github.com/1481859.js?file=merge_timelines.rb"></script>

You iterate over all timeline objects and keep adding unique activities to a new
list, returning that when done.

### Sort, and done!

All that's left to do is sort the result.

<script src="https://gist.github.com/1481859.js?file=add_merge_sort.rb"></script>

<a href="http://riakhandbook.com"><img src="https://img.skitch.com/20111213-jks6gqhww79y172qcdsdwpgbgu.png" style="float:right; margin-left: 10px;"></a>

There's the whole code. To spare you the pain of having to write your own
library, all this is bundled into a gem called
[riaktivity](https://github.com/roidrage/riaktivity). If you're doing Python,
the Brett Hoerner has got you covered with
[timak](https://github.com/bretthoerner/timak). Be sure to watch the original
talk by
[Yammer](http://basho.com/blog/technical/2011/03/28/Riak-and-Scala-at-Yammer/),
it's well worth it.

There's ups and downs to this approach, and things that need to be taken care
of. More on that and modeling data for Riak in general is covered in the [Riak
Handbook](http://riakhandbook.com/), the definitive guide on Riak.
