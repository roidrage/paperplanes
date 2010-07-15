---
topics: nosql documents databases schema
title: Relational Data, Document Databases and Schema Design
layout: post
---
By now it should be obvious that I'm quite fond of alternatives data stores (call them NoSQL if you must). I've given
quite a [few talks](http://www.paperplanes.de/2010/6/22/june_a_month_of_conferences.html) on the subjects recently, and
had the honor of being a guest on the (German) [heise Developer Podcast on
NoSQL](http://www.heise.de/developer/artikel/Episode-22-NoSQL-Alternative-zu-relationalen-Datenbanken-1027769.html).

There's some comments and questions that pop up every time alternative databases are being talked about, especially by
people deeply rooted in relational thinking. I've been there, and I know it requires some rethinking, and also am quite
aware that there are some controversial things that basically are the exact opposite of everything you learned in
university.

I'd like to address a couple of those with some commentary and my personal experience (Disclaimer: my experience is not
the universal truth, it's simply that: my experience, your mileage may vary). When I speak of things done in practice,
I'm talking about how I witnessed things getting done in Real Life™, and how I've done them myself, both good and bad.
I'm focussing on document databases, but in general everything below holds true for any other kind of non-relational
database.

It's easy to say that all the nice features document databases offer are just aiming for one thing, to scale up. While
that may or may not be true, it just doesn't matter for a lot of people. Scaling is awesome, and it's a problem everyone
wants to solve, but in reality it's not the main issue, at least not for most people. Also, it's not an impossible thing
to do even with MySQL, I've had my fun doing so, and it sure was an experience, but it can be done.

It's about getting stuff done. There's a lot more to alternative databases in general, and document databases in
particular, that I like, not just the ability to scale up. They simply can make my life easier, if I let them. If I can
gain productivity while still being aware of the potential risks and pitfalls, it's a big win in my book.

What you'll find, when you really think about it, is that everything below holds true no matter what database you're
using. Depending on your use case, it can even apply to relational databases.

**Relational Databases are all about the Data**

Yes, they are. They are about trying to fit your data into a constrained schema, constrained in length, type, and other
things if you see fit. They're about building relationships between your data in a strongly coupled way, think foreign
key constraints. Whenever you need to add data, you need to migrate your schema. That's what they do. They're good at
enforcing a set of ground rules on your data.

See where I'm going with this? Even though relational databases tried to be a perfect fit for data, they ended up being
a pain once that data needed to evolve. If you haven't felt that pain yet, good for you. I certainly have. Tabular data
sounds nice in theory, and is pretty easy to handle in Excel, but in practice, it causes some pain. A lot of that pain
stemmed from people using MySQL, yes, but take that argument to the guy who wrote it and sold it to people as the nicest
and simplest SQL database out there.

It's easy to get your data into a schema once, but it gets a lot harder to change the schema and the data into a
different schema at a later point in time. While data sticks around, the schema evolves constantly. Something relational
databases aren't very good at supporting.

**Relational Databases Enforce Data Consistency**

They sure do, that's what they were built for. Constraints, foreign keys, all the magic tricks. Take Rails as a
counter-example. It fostered the idea that all that stuff is supposed to be part of the application, not the database.
Does it have trade-offs? Sure, but it's part of your application. In practice, that was correct, for the most part,
although I can hear a thousand Postgres users scream. There's always an area that requires constraints on the database
level, otherwise they wouldn't have been created in the first place.

But most web applications can live fine without it, they benefit from being free about their data, to shape it in
whichever way they like, adding consistency on the application level. The consistency suddenly lies in your hands, a
responsibility not everyone is comfortable with. You're suddenly forced to think more about edge cases. But you sure as
hell don't have to live without consistent data, quite the opposite. The difference is that you're taking care of the
consistency yourself, in terms of your use case, not using a generic one-fits-all solution.

Relationships between data aren't always strict. They can be loosely linked, what's the point of enforcing consistency
when you don't care if a piece of data still exists or not? You handle it gracefully in your application code if you do.

**SQL is a Standard**

The basics of SQL are similar, if not the same, but under the hood, there's subtle differences. Why? Because under
the hood, every relational database works differently. Which is exactly what document databases acknowledge. Every
database is different, trying to put a common language on top will only get you so far. If you want to get the best out
of it, you're going to specialize.

Thinking in Map/Reduce as CouchDB or Riak force you to is no piece of cake. It takes a while to get used to the ideas
around it and what implications it has for you and your data. It's worth it either way, but sometimes SQL is just a
must, no question. Business reporting can be a big issue, if your company relies on supporting standard tools, you're
out of luck.

While standards are important, in the end it's important what you need to do with your data. If a standard gets in your
way, how is that helpful? Don't expect a standard query language for document databases any time soon. They all solve
different types of problems in different ways, and they don't intend to hide that from you with a standard query
language. If on the other hand, all you need is a dynamic language for doing ad-hoc queries, check out
[MongoDB](http://www.mongodb.org).

**Normalized Data is a Myth**

I learned a lot in uni about all the different kinds of normalization. It just sounded so nice in theory. Model your
data upfront, then normalize the hell out of it, until it's as DRY as the desert.

So far so good. I noticed one thing in practice: Normalized data almost never worked out. Why? Because you need to
duplicate data, even in e-commerce applications, an area that's traditionally mentioned as an example where relational
databases are going strong.

Denormalizing data is simply a natural step. Going back to the e-commerce example, you need to store a lot of things
separately when someone places an order: Shipping and billing address, payment data used, product price and taxes, and
so on.  Should you do it all over the place? Of course not, not even in a document database. Even they encourage storing
similar data to a certain extent, and with some of them, it's simply a must. But you're free to make these decisions on
your own. They're not implying you need to stop normalizing, it still makes sense, even in a document database.

**Schemaless is not Schemaless**

But there's one important thing denormalization is not about, something that's being brought up quite frequently and
misunderstood easily. Denormalization doesn't mean you're not thinking about any kind of schema. While the word
schemaless is brought up regularly, schemaless is simply not schemaless.

Of course you'll end up with having documents of the same type, with a similar set of attributes. Some tools, for
instance MongoDB, even encourage (if not force) you to store different types of documents in different collections. But
here's the kicker, I deliberately used the word similar. They don't need to be all the same across all documents. One
document can have a specific attribute, the other doesn't. If it doesn't, just assume it's empty, it's that easy. If it
needs to be filled at some point, write data lazily, so that your schema eventually is complete again. It's evolving
naturally, which does sound easy, but in practice requires more logic in your application to catch these corner cases.

So instead of running migrations that add new tables and columns, and in the end pushing around your data, you migrate
the data on the next access, whether that's a read or a write is up to your particular use case. In the end you simply
migrate data, not your schema. The schema will evolve eventually, but first and foremost, it's about the data, not the
constraints they live in. The funny thing: In larger projects, I ended up doing the same thing with a relational
database. It's just easier to do and gentler on the load than running a huge batch job on a production database.

**No Joins, No Dice**

No document database supports joins, simple like that. If you need joins, you have two options: Use a database that
supports joins, or adapt your documents so that they remove the need for joins.

Documents have one powerful advantage: It's easy to embed other documents. If there's data you'd usually fetch using a
join, and that'd be suitable for embedding (and therefore oftentimes: denormalizing), there's your second option. Going
back to the e-commerce example: Whereas in a relational database you'd need a lot of extra tables to keep that data
around (unless you're serializing it into single column), in a document database you just add it as embedded data to the
order document. You have all the important data one in place, and you're able to fetch it in one go. Someone said that
relational databases are a perfect fit for e-commerce. Funny, I've worked on a market platform, and I've found that to be
a ludicrous statement. I'd have benefited from a loser data storage several times, joins be damned.

It's not always viable, sure, and it'd be foolish to stick with a document database if that's an important criterion for
your particular use case, then no dice. It's relational data storage or bust.

Of course there's secret option number three, which is to just ignore the problem until it's a problem, just by going
with a document database and see how you go, but obviously that doesn't come without risks. It's worth noticing though
that [Riak](https://wiki.basho.com/display/RIAK/Riak) supports [links between
documents](https://wiki.basho.com/display/RIAK/Links), and even fetching linked documents together with the parent in
one request. In CouchDB on the other hand, you can emit [linked
documents](http://wiki.apache.org/couchdb/Introduction_to_CouchDB_views#Keys_and_values) in views. You can't be fully
selective about the document data you're interested in, but if all you want is fetch linked documents, there is one or
two ways to do that. Also, graph databases have made it their main focus to make traversal of associated documents an
incredibly cheap operation. Something your relational database is pretty bad at.

**Documents killed my Model**

There's this myth that you just stop thinking about how to model your data with document databases or key-value storage.
That myth is downright wrong. Just because you're using schemaless storage doesn't mean you stop thinking about your
data, quite the opposite, you think even more about it, and in different ways, because you simply have more options to
model and store it. Embedding documents is a nice luxury to have, but isn't always the right way to go, just like
normalizing the crap out of a schema isn't always the way to go.

It's a matter of discipline, but so is relational modelling. You can make a mess of a document database just like you
can make a mess of a relational database. When you migrate data on the fly in a document database, there's more
responsibility in your hands, and it requires good care with regards to testing. The same is true for keeping track of
data consistency. It's been moved from the database into your application's code. Is that a bad thing? No, it's a sign
of the times. You're in charge of your data, it's not your database's task anymore to ensure it's correct and valid,
it's yours. With great power comes great responsibility, but I sure like that fact about document databases. It's
something I've been missing a lot when working with relational databases: The freedom to do whatever the heck I want
with my data.

**Read vs. Write Patterns**

I just like including this simply because it always holds true, no matter what kind of database you're using. If you're
not thinking about how you're going to access your data with both reads and writes, you should do something about that.
In the end, your schema should reflect your business use case, but what good is that when it's awkward to access the
data, when it takes joins across several tables to fetch the data you're interested in?

If you need to denormalize to improve read access, go for it, but be aware of the consequences. A schema is easy to
build up, migrating on the go, but if document databases force you to do one thing, and one thing only, it's to think
about how you're reading and writing your data. It's safe to say that you're not going to figure it all out upfront, but
you're encouraged to put as much effort into it as you can. When you find out you're wrong down the line, you might be
surprised to find that they make it even easier to change paths.

**Do your Homework**

Someone recently wrote a blog post on why he went back to MySQL from MongoDB, and one of his reasons was that it doesn't
support transactions. While this is a stupid argument to bring up in hindsight, it makes one thing clear: You need to do
research yourself, noone's going to do it for you. If you don't want to live up to that, use the tools you're familiar
with, no harm done.

It should be pretty clear up front what your business use case requires, and what tools may or may not support you in
fulfilling these requirements. Not all tool providers are upfront about all the downsides, but hey, neither was MySQL.
Read up, try and learn. That's the only thing you can do, and noone will do it for you. Nothing has changed here, it's
simply becoming more obvious, because you suddenly have a lot more options to work with.

**Polyglot Data Storage**

Which brings me to the most important part of them all: Document databases (and alternative, non-relational data stores
in general) are not here to replace relational databases. They're living alongside of them, with both sides hopefully
somewhat learning from each other. Your projects won't be about just one database any more, it's not unlikely you're
going to end up using two or more, for different use cases.

Polyglot persistence is the future. If there's one thing I'm certain of, this is it. Don't let anyone fool you into
thinking that their database is the only one you'll need, they all have their place.  The hard part is to figure out
what place that is. Again, that's up to you to find out. People ask me for particular use cases for non-relational
databases, but honestly, there is no real distinction. Without knowing the tools, you'll never find out what the use
cases are. Other people can just give you ideas, or talk about how they're using the tools, they can't draw the line
for you.

**Back to the Future**

You shouldn't think of it as something totally new, document databases just don't hide these things from you. Lots of
the things I mentioned here are things you should be doing anyway, no matter if you're using a relational or a
non-relational data store. They should be common sense really. We're not trying to repeat what went wrong in history,
we're learning from it.

If there's one thing you should do, it's to start playing with one of the new tools immediately. I shouldn't even be
telling you this, since you should hone your craft all the time, and that includes playing the field and broadening your
personal and professional horizon. Only then will you be able to judge what use case is a good fit for e.g. a document
database. I'd highly suggest starting to play with e.g. [CouchDB](http://couchdb.org),
[MongoDB](http://www.mongodb.org), [Riak](https://wiki.basho.com/display/RIAK/Riak) or
[Redis](http://code.google.com/p/redis).
