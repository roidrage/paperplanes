---
title: Building an Activity Feed with Cassandra
topics: cassandra nosql ruby
layout: single
---
In a [recent talk about Redis, Riak and Cassandra](http://nosql-railswaycon-2011.heroku.com/) I showed an example of how
Cassandra can be used to build an activity feed. After some more investigation it became obvious to me that it was not
an ideal approach for this particular use case. The original version won't scale up as nicely as it should due to a
[restriction in the way SuperColumnFamilies are deserialized](https://issues.apache.org/jira/browse/CASSANDRA-598).
Consider this an extended and improved version of said talk.

In a web application that has a social component an activity feed is becoming a standard requirement. There is no one
way to solve this, but due to the nature of Cassandra's data and storage model, it lends itself to the use case quite
nicely. But let's look at the requirements first.

* User Mathias follows a number of users
* Mathias wants to know about everything those users are doing
* The feed should be sorted by time of activities, in reverse order
* Activities are manifold and new types can be added at any time

We could easily model this with a relational database mind you, even in a very denormalized way and with one or two
nicely set indexes it'd work into the millions of events. Let this be your warning that you don't necessarily need to
add more complexity to your infrastructure. But after all, we're in it to learn, so what the heck. We'll look at how to
model this use case with Cassandra and what it does internally to allow for this use case to be implemented efficiently.

## Technicalities

Let's break down what we're going to build on the technology side:

* Events are only stored once, for each user we only store references with identifiers. That means we're first fetching
  the event feed snapshot we're interested in and then give all the identifiers to Cassandra to fetch the event data in
  one go.

  To keep this efficient, an event entry contains all data required to reconstruct it later, without having to go to a
  second data source for more information. This is not a fixed constraint, it's one valid approach to do that, we'll
  just keep it simple for this example.

* Every user has a separate event feed, not just logically, in terms of your application, but also physically in the
  database. That means data is store multiple times, throwing normalization out the window. Again, this is all for the
  purpose of being able to fetch the feed quickly and without hitting the database, and therefore the disks, multiple
  times.
  
  The clear disadvantage is the constant growth in disk space, but we'll rely on the fact that Cassandra allows
  us to add capacity at any time or to simply replace old nodes with newer, bigger ones with more disk space.

* Data is stored and indexed in a way that allows us to sort based on time efficiently.

  We want to be able to ask for specific ranges of time, e.g. fetching the activity items for the last 24 hours, and
  going further back in time from there. Think pagination, only by time, not just by an integer identifier as you'd
  you'd use with a relational database.

## Why Cassandra?

Here's why Cassandra is a good fit for this use case:

The data model is flexible (no, not schemaless). It's basically a sorted hash structure with no fixed constraint on
the number of key-value pairs (called columns in Cassandra language). A set of columns is identified by a row key and
is then stored in a column family.

The row key is a global identifier which determines on which node in a Cassandra cluster data is stored. Closest thing
to a column family is a table in a relational databases. Using the column family and the row key we can store any
number of attributes logically belonging together, e.g. activities. One row key can involve many column families.

The basic structure would look like this, using SocialFeed as the name for our application, which is stored inside a
keyspace in Cassandra, a way to logically separate groups of column families.

    SocialFeed["mathias"][:Activities] = {"steven" => "had a beer"}

This is the basic gist of a column family. We store activities with the user's name as key and the activity as the
value. Cassandra will take care of storing the columns efficiently and pre-sorted for us. This is far from what we want,
and only allows us to store one activity per user, but it should give you an idea of what your data looks like in
Cassandra.

This is where something called super column family comes in. It adds another level of nesting to our hash structure,
which again is sorted by the key. We'll just make that key a time-based component, and there's our presorting by time.
Cassandra supports a time-based UUID for this purpose, neatly allowing us to ignore timestamp clashes, as it combines a
unique identifier with the current time. Our data structure ends up looking something like this:

    SocialFeed["mathias"][:Activities] = {
      1.hour.ago => {"user" => "steven", "activity" => "having a beer", "type" => "current-status"}
      2.hour.ago => {"user" => "steven", "activity" => "having a beer", "type" => "current-status"}
      3.hour.ago => {"user" => "steven", "activity" => "having a beer", "type" => "current-status"}
      4.hour.ago => {"user" => "steven", "activity" => "having a beer", "type" => "current-status"}
    }

However, due to the bug mentioned above, this doesn't scale very well for feeds going into the tens of thousands of
columns in the super column family `Activities`. So we'll introduce an extra column family called `Events`, where we'll
store all the data for one particular event. Our `Activities` super column family will just be a regular column family
with a time based UUID as key and the event's identifier as value, like so

    SocialFeed["1"][:Events] = {
      "user" => "steven",
      "activity" => "having a beer",
      "type" => "current-status",
      "time" => 2.hours.ago
    }

    SocialFeed["mathias"][:Activities] = {
      UUID.new => {"event" => "1"}  
    }

The way column families are indexed allows us to efficiently fetch only a specific range of event identifiers. We could
model this nicely with a super column family too, but even to get a range of the 100 latest items, Cassandra would have
to deserialize all existing items. One way to work around this though would be to cut off the list of events so you
always have only a certain set of e.g. the 1000 latest entries in any particular row.

But given a specific time, we can ask for all entries from the last 24 hours by simply using a time-based UUID
reconstructed using the timestamp from 24 hours ago and using it as a starting point.

## Show me some code!

Let's go ahead and implement it. I'll assume you have the freshest Cassandra 0.8 release installed and the newest
version of the Cassandra Ruby gem too. First up we'll create our keyspace and the super column family using the
`cassandra-cli` console.

    $ cassandra-cli
    > connect 127.0.0.1/9160;
    > create keyspace SocialFeed;
    > use SocialFeed;
    > create column family Activities with comparator = 'TimeUUIDType';
    > create column family Events with comparator = 'LongType';

## Cassandra's Storage Model

The key used to store something in a column family is what you get for free from Cassandra. Everything else in terms of
indexing (e.g. to get secondary indexes) is up to you, or to the new secondary index facilities Cassandra 0.7
introduced, which basically keeps inverted indexes in somewhat hidden column families, so you don't have to do it
manually.

When you write a piece of data, in our case insert a new activity into a user's event feed, the data is first written to
a CommitLog and then applied to an in-memory structure called MemTable.
