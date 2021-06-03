---
title: Playing with Riak and CRDTs - Counters
tags: riak crdt
layout: post
---
I recently spent some quality time with CRDTs, which is short for commutative
replicated data types. I've gotten curious about them when working on the [Riak
Handbook](http://riakhandbook.com) and I gave a talk about designing data
structures for Riak the other week at [NoSQL
matters](http://www.nosql-matters.org/cgn2012/#mathias_meyer), [slides are
available
too](https://speakerdeck.com/u/roidrage/p/designing-for-concurrency-with-riak)

What are commutative replicated data types? It's a fancy term for describing
data structures suitable for eventually consistent systems. You know what's an
eventually consistent system? Riak!

When working with Riak, your data needs to be designed in a way that allows
coping with its eventually consistent nature. This poses a problem for data
types like counters, sets, graphs, essentially all data structures that require
operations to be executed in a monotonic fashion.

For instance, with a counter, you don't want to lose a single increment when
multiple clients add values. But due to Riak's eventually consistent nature you
can't guarantee monotonic order of updates. Instead you need to make sure you
can restore a logical order of operations at any time given any number of
conflicting writes.

When multiple clients update the same object concurrently they cause siblings,
two objects with different values. If every sibling has a different value for
the counter, how do you make sure you can restore order and therefore the
final value? Let's look at a worst-case scenario of a data structure that won't
work well in this case. Two clients see an object already stored in Riak
representing a counter, currently having the value 1.

    {
      "value": 1
    }

Two clients now want to update the counter, incrementing its value by 1. They
both store the updated data back to Riak, causing a conflict. Now you have two
siblings, both having the value 2. You also have the original sibling around as
referenced by both clients when they wrote their data.

    {
      "value": 2
    }

It's unlikely you'll be able to restore the total sum of both values, because
you don't know what the previous value for both clients was. You can assume the
value was 1, but what if a client incremented by 2? In an eventually consistent
system it's hard to say how much has changed since the last time you've seen the
data unless you keep track specifically of what has changed.

Commutative replicated data types are data structures designed to help you here.
Let's look at an alternative for a counter. What if, instead of keeping a single
value, every client keeps its own value and only updates that number instead of
the total value?

We can assume that updates of a single client will happen in a monotonic
fashion. There shouldn't be more than one client with the same identifier in the
system.

Here's an example of our updated data structure:

    {
      "client-1": 2,
      "client-2": 2,
      "client-3": 3
    }

When a client wants to update a value he only updates its own value. It's a
contract between all clients to never touch any other client's data other than
merge it back together. When a client finds an object with siblings it can merge
them together simply by picking the highest value for every client. Part of the
contract is also that a client must merge the data when it finds an object with
siblings.

To get the total value for the counter, just calculate the sum of all values, et
voila! This surprisingly simple data structure is called G-counter.

Let's look at some code. I'm assuming your bucket has support for siblings
enabled.

The bits to generate a counter value are straight-forward. You just have to make
sure to assign unique but recurring client identifiers to your client objects.
Here we're using the Ruby client.

    require 'riak'

    riak = Riak::Client.new(client_id: 'client-1')
    counter = riak.bucket('g-counters').get_or_new('counter-1')

    counter.data ||= {}
    counter.data[riak.client_id] ||= 0
    counter.data[riak.client_id] += 1
    counter.store

After initializing the data structure we're assigning it a default, if
necessary and increment the counter. This code can nicely be hidden in a library
function somewhere. The interesting bit is merging the data structures back
together should the client find siblings. The Ruby client has a convenient way
to specify callbacks that should be called when more than one object is
returned.

We're writing code that iterates over all siblings, picking the highest value
for every client along the way.

    Riak::RObject.on_conflict do |robject|
      return nil if robject.bucket != 'g-counters'
      data = robject.siblings.each_with_object({}) do |sibling, data|
        (sibling.data || {}).each do |client_id, value|
          if (data[client_id] || 0) < value
            data[client_id] = value
          end
        end
      end
      robject.data = data
      robject
    end

The next time you fetch the data and the Ruby client detects a conflict the
callback will be run, merging the data back together into a single data
structure.

I'll leave the code to calculate the sum of all values as an exercise to the
reader.

All this assumes that you're enforcing a stronger consistency on your data. You
need to make sure that R + W > N, because even when one client only updates its
own values, he has little control over where its data is written. When you don't
make sure that consistency of data is enforced you can run into situations where
a client comes across two siblings caused by its own updates. This can happen
when a primary replica failed, a secondary replica took its place and the client
only uses a small read quorum. These scenarios deserve their own write-up.

If you want to know more about commutative replicated data types I highly
suggest reading [the relevant
paper](http://hal.inria.fr/docs/00/55/55/88/PDF/techreport.pdf) on them. It's
almost fifty pages long and required me several reads to get a good grasp of
them, but it's totally worth it. There are more specific implementations
available for CRDTs too, specifically [statebox for
Erlang](https://github.com/mochi/statebox), [knockbox for
Clojure](https://github.com/reiddraper/knockbox) and [a sample implementation in
Ruby](https://github.com/aphyr/meangirls). The latter comes with a handy README
that shows examples for the specific data types. All of them aren't specific to
Riak but can be used with it. Also fresh from the world of academic papers is
this one by Neil Conway et. al. on lattices in distributed computing by way of
[Bloom](http://bloom-lang.org/), a language for disorderly distributed computing.

There are some other caveats with CRDTs and Riak but we'll look at them in more
detail in another installment of this series, in particular regarding
consistency and garbage collection. There's a lot to be said about CRDTs and
there's a lot of brain matter to be spent on trying to understand them. The next
update for [Riak Handbook](http://riakhandbook.com) might even include a section
on them. The topic is certainly fascinating enough to warrant one, as it
addresses the issues people commonly encounter when designing data structures
for eventual consistency.
