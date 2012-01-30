---
title: A Tour of Amazon's DynamoDB
topics: nosql dynamo amazon
layout: post
comments_disabled: true
---
Amazon's [recent
release](http://www.allthingsdistributed.com/2012/01/amazon-dynamodb.html) of
DynamoDB, a database whose name is inspired by [Dynamo, the key-value
database](http://www.allthingsdistributed.com/2007/10/amazons_dynamo.html) the
distributed datastore they've been running in production for a good five to six
years now. I think it's great they've finally done it, though from my
obverservations, there's little resemblance of what the original Dynamo paper
describes, but I'm getting ahead of myself. Traditionally Amazon hasn't been
very open about how they implement their services, so some of what I'm stating
here may be nothing more than an educated guess. Either way, the result is
pretty neat.

Time to take a good look at what it has to offer, how that works out in code,
and to make some wild guesses as to what's happening under the covers. I'm using
[fog](http://github.com/fog/fog)'s master to talk to DynamoDB in the examples
below, but the [official Ruby SDK](http://aws.amazon.com/sdkforruby/) also
works. Fog is closer to the bare API metal though, which works out well for our
purposes.

My goal is not to outline the entire API and its full set of options, but to dig
into the bits most interesting to me and to show some examples. A lot of the
focus in other posts is on performance, scalability and operational ease.  I
think that's a great feature of DynamoDB, but it's pretty much the same with all
of their web services. So instead I'm focusing on the effects DynamoDB has on
you, the user. We'll look at API, general usage, data model and what DynamoDB's
feature generally entails.

### The Basics

DynamoDB is a distributed database in the cloud, no surprises, it's not the
first such thing Amazon has in its portfolio. [S3](http://aws.amazon.com/s3/),
[SimpleDB](http://aws.amazon.com/simpledb/), [RDS](http://aws.amazon.com/rds/)
and [DynamoDB](http://aws.amazon.com/dynamodb/) all provide redudant ways to
store different types of data in Amazon's datacenters. Currently, DynamoDB
only supports the us-east region.

An important difference is that data stored in DynamoDB is officially stored on
SSDs, which has (or at least should have) the benefit of offering predictable
performance and greatly reduced latency across the board. The question that
remains is, of course: when can I hook up SSDs to my EC2 instances?

The other big deal is that the read and write capacity available to you is
configurable. You can tell Amazon how much capacity, in read and write units per
second, you expect for your application, and they make sure that capacity is
available to you as long as you need it (and pay for it).

### Data Model

[Data in DynamoDB](http://docs.amazonwebservices.com/amazondynamodb/latest/developerguide/DataModel.html)
is stored in tables, a logical separation of data if you will. Table names are
only unique on a per-user basis, not globally like S3 buckets.

Tables store items, think rows of data or documents. Items have attributes and
values, similar to SimpleDB. Think of it as a JSON document where you can read
and write attributes independent of the entire document. Every row can have
different attributes and values, but every item needs to have a uniquely
identifying key whose name you decide on upfront, when you create the table.

Let's create a table first, but make sure you wear protection, as this is yet
another of Amazon's gross-looking APIs. The relevant API action is
[`CreateTable`](http://docs.amazonwebservices.com/amazondynamodb/latest/developerguide/API_CreateTable.html).

    dynamo = Fog::AWS::DynamoDB.new(aws_access_key_id: "YOUR KEY",
      aws_secret_access_key: "YOUR SECRET")

    dynamo.create_table("people",
      {HashKeyElement: {AttributeName: "username", AttributeType: "S"}},
      {ReadCapacityUnits: 5, WriteCapacityUnits: 5})

This creates a table called `"people"` with an attribute `"username"` as the
indexing key. This is the key you're using to reference a row, sorry, an item,
in a table. The key is of type string, hence the S, you can alternatively
specify an N for numeric values. This pattern will come up with every attribute
and value pair you store, you always need to tell DynamoDB if it's a string or a
number. You also specify initial values for expected read and write capacity,
where 5 is the minimum.

You have to provide a proper value for a key, DynamoDB doesn't offer any
automatic generation of keys for you, so choose them wisely to ensure a good
distribution. A key, that has a lot of data behind it, and that's accessed much
more frequently than others will not benefit you. Keep your data simple and
store it with multiple keys if you can.

Anyhoo, to insert an item, you can use the
[`PutItem`](http://docs.amazonwebservices.com/amazondynamodb/latest/developerguide/API_PutItem.html)
API action, to which you issue a HTTP POST (go figure). The DynamoDB API already
gives me headache, but more on that later. Thankfully, a good client library
hides the terrible interface from us, only leaving us with the hash structures
sent to DynamoDB.

    dynamo.put_item("people", {username: {"S" => "roidrage"}})

Specify multiple attributes as separate hash entries, each pointing to a
separate hash specifying data type and value. I'll leave it to you to think
about how backwards this is, though it must be said that JavaScript is also to
blame here, not handling 64 bit integers very well.

You can store lists (or rather sets of data) too, using SS as the datatype.

    dynamo.put_item("people", {username: {S: "roidrage"},
                                   tags: {SS: ["nosql", "cloud"]}})

Note that you can use `PutItem` on existing items, but you'll always replace all
existing attributes and values.

### Conflicts and Conditional Writes

All writes can include optional conditions to check before updating an item.
That way you can ensure the item you're writing is still in the same state as
your local copy of the data. Think: read, update some attribute, then write,
expecting and ensuring to not have any conflicting updates from other clients in
between.

This is a pretty neat feature, you can base updates on one attributes based on
whether another attribute exists or has a certain value.

    dynamo.put_item("people",
        {username: {S: "roidrage"}, fullname: {S: "Mathias Meyer"}},
        {Expected: {fullname: {Exists: false}}})

This operation is only executed if the item as currently stored in DynamoDB
doesn't have the attribute the attribute `fullname` yet. On a subsequent
`PutItem` call, you could also check if the item's `fullname` attribute still
has the same value, e.g. when updating the full name of user "roidrage".

    dynamo.put_item("people",
        {username: {S: "roidrage"}, fullname: {S: "Mathias Meyer"}},
        {Expected: {fullname: {Value: {S: "Mathias Meyer"}}}})

It's not the greatest syntax for sure, but it does the job. Which brings me to
some musings about consistency. If the condition fails, Amazon returns a 400
response, just like with every other possible error you could cause.

To make proper use of conditional updates in your application and to actually
prevent conflicting writes and lost updates, you should use the `UpdateItem`
action instead and only update single attributes, as `PutItem` always replaces
the entire item in the database. But even then, make sure to always reference
the right attributes in an update. You could even implement some sort of
versioning scheme on top of this, for instance to emulate multi-version
concurrency control.

Updating single or multiple attributes is done with the
[`UpdateItem`](http://docs.amazonwebservices.com/amazondynamodb/latest/developerguide/API_UpdateItem.html) action.
You can update attributes without affecting others and add new attributes as you
see fit. To add a new attribute `street`, here's the slightly more verbose code.

    dynamo.update_item("people", {HashKeyElement: {S: "roidrage"}},
        {street: {Value: {S: "Gabriel-Max-Str. 3"}}})

There are more options involved than with `PutItem`, and there are several more
available for `UpdateItem`. But they'll have to wait for just a couple of
sentences.

### Consistency on Writes

Conditional updates are the first hint that DynamoDB is not like Dynamo at all,
as they assume some sort of semi-transactional semantics. Wherein a set of nodes
agree on a state (the conditional expression) and then all apply the update. The
same is true for atomic counters, which we'll look at in just a minute.

From the documentation it's not fully clear how writes without a condition or
without an atomic counter increment are handled, or what happens when two
clients update the same attribute at the same time, and who wins based on which
condition. Facing the user, there is no mechanism to detect conflicting writes.
So I can only assume DynamoDB either lets the last write win or has a scheme
similar to BigTable, using timestamps for each attribute.

Writes don't allow you to specify something like a quorum, telling DynamoDB how
consistent you'd like the write to be, it seems to be up to the system to decide
when and how quickly replication to other datacenters is done. [Alex Popescu's
summary](http://nosql.mypopescu.com/post/16064274863/notes-about-amazon-dynamodb)
on DynamoDB and [Werner Vogels' introduction](http://www.allthingsdistributed.com/2012/01/amazon-dynamodb.html)
suggest that writes are replicated across data centers synchronously, but
doesn't say to how many. On a wild guess, two data centers would make the write
durable enough, leaving the others to asynchronous replication.

### Consistency on Reads

For reads on the other hand, you can tell DynamoDB if stale data is acceptable
to you, resulting in an eventually consistent read. If you prefer strongly
consistent reads, you can specify that on a per-operation basis. What works out
well for Amazon is the fact that strongly consistent reads cost twice as much as
eventually consistent reads, as more coordination and more I/O are involved.
From a strictly calculating view, strongly consistent write take up twice as
much capacity as eventually consistent writes.

From this I can only assume that writes, unless conditional will usually be at
least partially eventually consistent or at least not immediately spread out to
all replicas. On reads on the other hand, you can tell DynamoDB to involve more
than just one or two nodes and reconcile outdated replicas before returning it
to you.

### Reading Data

There's not much to reading single items. The action
[`GetItem`](http://docs.amazonwebservices.com/amazondynamodb/latest/developerguide/API_GetItem.html) allows you to
read entire items or select single attributes to read.

    dynamo.get_item("people", {HashKeyElement: {S: "roidrage"}})

Optionally, add the consistency option to get strong consistency, with eventual
consistency being the default.

    dynamo.get_item("people", {HashKeyElement: {S: "roidrage"}},
                              {ConsistentRead: true})

A read without any more options always returns all data, but you can select
specific attributes.

    dynamo.get_item("people", {HashKeyElement: {S: "roidrage"}},
                              {AttributesToGet: ["street"]})

### Atomic Counters

Atomic counters are a pretty big deal. This is what users want out of pretty
much every distributed database. Some say they're using it wrong, but I think
they're right to ask for it. Distributed counters are hard, but not impossible.

Counters need to be numerical fields, and you can increment and decrement them
using the `UpdateItem` action. To increment a field by a value, specify a numerical
attribute, the value to be incremented by, and use the action `ADD`. Note that
the increment value needs to be a string.

    dynamo.update_item("people", {HashKeyElement: {S: "roidrage"}},
                                 {logins: {Value: {N: "1"}, Action: "ADD"}})

When the counter attribute doesn't exist yet, it's created for you and set to 1.
You can also decrement values by specifying a negative value.

    dynamo.update_item("people", {HashKeyElement: {S: "roidrage"}},
                                 {logins: {Value: {N: "-1"}, Action: "ADD"}})

Can't tell you how cool I think this feature is. Even though we keep telling
people that atomic counters in distributed system are hard, as they involve
coordination and increase vulnerability to failure of a node involved in an
operation, systems like Cassandra and HBase show that it's possible to do.

### Storing Data in Sets

Other than numerical (which need to be specified as strings nonetheless) and
string data types, you can store sets of both too. One member can only exist
once in an attribute set. The neat part is that you can atomically add new
members to sets using the `UpdateItem` action. In the JSON format sent to the
server, you always reference even just single members to add as a list of items.
Here's an example:

    dynamo.update_item("people", {HashKeyElement: {S: "roidrage"}},
                                 {tags: {Value: {SS: ["nosql"]}}})

That always replaces the existing attribute though. To add a member you need to
specify an action. If the member already exists, nothing happens, but the
request still succeeds.

    dynamo.update_item("people", {HashKeyElement: {S: "roidrage"}},
                                 {tags: {Value: {SS: ["cloud"]}, Action: "ADD"}})

You can delete elements in a similar fashion, by using the action `DELETE`.

    dynamo.update_item("people", {HashKeyElement: {S: "roidrage"}},
                                 {tags: {Value: {SS: ["cloud"]}, Action: "DELETE"}})

The default action is `PUT`, which replaces the listed attributes with the
values specified. If you run `PUT` or `ADD` on a key that doesn't exist yet, the
item will be automatically created. This little feature and handling of sets and
counters in general sounds a lot like things that made MongoDB so popular, as
you can atomically push items onto lists and increment counters.

This is another feature that's got me thinking about whether DynamoDB even
includes the tiniest bit of the original Dynamo. You could model counters and
sets based on something like Dynamo for sure, based on the ideas behind
[Commutative Replicated Data
Types](http://hal.inria.fr/docs/00/55/55/88/PDF/techreport.pdf). But I do wonder
if Amazon actually did go through all the trouble building that system on top of
the traditional Dynamo, or if they implemented something entirely new for this
purpose. There is no doubt that operations like these is what a lot of
users want even from distributed databases, so either way, they've clearly hit a
nerve.

### Column Store in Disguise?

The fact that you can fetch and update single attributes with consistency
guarantees makes me think that DynamoDB is actually more like a wide column
store like Cassandra, HBase or, gasp, Google's BigTable. There doesn't seem to
be anything left from the original, content-agnostic idea of the Dynamo data
store, whose name DynamoDB so nicely piggybacks on.

The bottom line is there's always a schema of attributes and values for a
particular item you store. What you store in an attribute is up to you, but
there's a limit of 64KB per item.

DynamoDB assumes there's always some structure in the data you're storing. If
you need something content-agnostic to store data but with similar benefits
(replication, redundancy, fault-tolerance), use S3 and CloudFront. Nothing's
keeping you from using several services obviously. If I used DynamoDB for
something it'd probably not be my main datastore, but an add-on for data I need
to have highly available and stored in a fault-tolerant fashion, but that's a
matter of taste.

### A Word on Throughput Capacity

Whereas you had to dynamically add capacity in self-hosting database systems,
always keeping an eye on current capacity limits, you can add more capacity to
handle more DynamoDB request per second simply by issuing an API call.

Higher capacity means paying more. To save money, You could even adjust the
capacity for a specific time of day basis, growing up and down with your
traffic. If you go beyond your configured throughput capacity, operations may be
throttled.

Throughput capacity is based on size of items you read and the number of reads
and writes per second. Reading one item with a size of 1 KB corresponds to one
read capacity unit. Add more required capacity units with increased size and
number of operations per second.

This is the metric you always need to keep an eye on and constantly measure from
your app, not just to validate invoice Amazon sends you at the end of the month,
but also to track your capacity needs at all times. Luckily you can track this
using CloudWatch and trigger alerts. Amazon can trigger predefined alerts when
capacity crosses a certain threshold. Plus, every response to a read includes
the consumed read capacity, and the same is true for writes.

Throughput capacity pricing is pretty ingenious on Amazon's end. You pay for
what you reserve, not for what you actually use. As you always have to have more
capacity available as you currently need, you always need to reserve more in
DynamoDB. But if you think about it, this is exactly how you'd work with your
own hosted, distributed database. You'll never want to work very close to
capacity, unless you're some crazy person.

Of course you can only scale down throughput capacity once per day, but scale up
as much as you like, and increases need to be done at least 10%. I applaud you
for exploiting every possible opportunity to make money, Amazon!

### Data Partitioning

[Amazon's
documentation](http://docs.amazonwebservices.com/amazondynamodb/latest/developerguide/BestPractices.html)
suggests that Amazon doesn't use random partitioning to spread data across
partitions, partitioning is instead done per table. Partitions are created as
you add data and as you increase capacity, suggesting either some sort of
composite key scheme or a tablet like partitioning scheme, again, similar to
what HBase or BigTable do. This is more fiction than fact, it's an assumption on
my part. A tablet-like approach certainly would make distributing and splitting
up partitions easier than having a fixed partitioning scheme upfront like in
Dynamo.

The odd part is that Amazon actually makes you worry about partitions but
doesn't seem to offer any way of telling you about them or how your data is
partitioned. Amazon seems to handle partitioning mostly automatically and
increases capacity by spreading out your data across more partitions as you
scale capacity demand up.

### Range Keys

Keys can be single values or based on a key-attribute combination. This is a
pretty big deal as it effectively gives you composite keys in a distributed
database, think Cassandra's data model. This effectively gives you a time series
database in the cloud, allowing you to store sorted data.

You can specify a secondary key on which you can query by a range, and which
Amazon automatically indexes for you. This is yet another feature that makes
DynamoDB closer to a wide column store than the traditional Dynamo data store.

The value of the range key could be an increasing counter (though you'd have to
take care of this yourself), a timestamp, or a time based UUID. Of course it
could be anything else and unique entirely, but time series data is just a nice
example for range keys. The neat part is that this way you can extract data for
specific time ranges, e.g. for logging or activity feeds.

We already looked at how you define a normal hash key, let's look at an example
with a more complex key combining a hash key and a range key, using a numerical
type to denote a timestamp.

    dynamo.create_table("activities", {
          HashKeyElement: {AttributeName: "username", AttributeType: "S"},
          RangeKeyElement: {AttributeName: "created_at", AttributeType: "N"}},
        {ReadCapacityUnits: 5, WriteCapacityUnits: 5})

Now you can insert new items based on both the hash key and a range key. Just
specify at least both attributes in a request.

    dynamo.put_item("activities", {
        username: {S: "roidrage"}, 
        created_at: {N: Time.now.tv_sec.to_s},
        activity: {S: "Logged in"}})

The idea is simple, it's a timestamp-based activity feed per user, indexed by
the time of the activity. Using the
[`Query`](http://docs.amazonwebservices.com/amazondynamodb/latest/developerguide/API_Query.html) action, we can fetch a range of
activities, e.g. for the last 24 hours. Just using `get_item`, you always have
to specify a specific combination of hash and range key.

To fetch a range, I'll have to resort to using Amazon's Ruby SDK, as fog hasn't
implemented the `Query` action yet. That way you won't see the dirty API stuff
for now, but maybe that's a good thing.

    dynamo = AWS::DynamoDB.new(access_key_id: "YOUR KEY",
                               secret_access_key: "YOUR SECRET")
    activites = dynamo["activities"]

    items = activities.items.query(
        hash_key: "roidrage",
        range_greater_than: (Time.now - 85600).tv_sec)

This fetches all activity items for the last 24 hours. You can also fetch more
historic items by specifying ranges. This example fetches all items for the last
seven days.

    items = activities.items.query(
        hash_key: "roidrage",
        range_greater_than: (Time.now - 7.days.ago).tv_sec,
        range_less_than: Time.now.tv_sec)

Note that the `Query` action is only available for tables with composite keys. If
you don't specify a range key, DynamoDB will return all items matching the hash
key.

### Queries using Filters

The only things that's missing now is a way to do richer queries, which DynamoDB
offers by way of the
[`Scan`](http://docs.amazonwebservices.com/amazondynamodb/latest/developerguide/API_Scan.html)
action. fog doesn't have an implementation for this yet, so we once again turn
to the AWS Ruby SDK.

Scanning allows you to specify a filter, which can be an arbitrary number of
attribute and value matches. Once again the Ruby SDK abstracts the ugliness of
the API underneath into something more readable.

    activities.items.where(:activity).begins_with("Logged").each do |item|
      p item.attributes.to_h
    end

You can include more than one attribute and build arbitrarily complex queries,
in this example to fetch only items related to the user "roidrage" and him
logging in.

    activities.items.where(:activity).equals("Logged in").
              and(:username).equals("roidrage").each do |item|
      p item.attributes.to_h
    end

You can query for ranges as well, combining the above with getting only items
for the last seven days.

    activities.items.where(:activity).equals("Logged in").
        and(:username).equals("mathias").
        and(:created_at).between(7.days.ago.tv_sec, Time.now.tv_sec).each {|item|
      p item.attributes.to_h
    end

Filters fetch a maximum of 1 MB of data. As soon as that's accumulated, the scan
returns, but also includes the last item evaluated, so you can continue where
the query left off. Interestingly, you also get the number of items remaining.
Something like paginating results dynamically comes to mind. Running a filter is
very similar to running a full table scan, though it's rather efficient thanks
to SSDs. But don't expect single digit millisecond responses here. As scans
heavily affect your capacity throughput, you're better off resorting to their
use only for ad-hoc queries, not as a general part of your application's
workflow.

Unlike `Query` and `GetItem`, the `Scan` action doesn't guarantee strong
consistency, and there's no flag to explicitly request it.

### The API

DynamoDB's HTTP API has got to be the worst ever built at Amazon, you could even
think it's the first API every designed at Amazon. You do POST requests even to
GET data. The request and response can include conditions and validations and
their respective errors, the proper Java class name of an error and other crap.
Not to mention that every error caused by any kind of input on your end always
causes a 400.

Here's an example of a simplified request header:

    POST / HTTP/1.1
    Content-Type: application/x-amz-json-1.0
    x-amz-target: DynamoDB_20111205.GetItem

And here's a response body from an erroneous request:

    {"__type":"com.amazon.coral.validate#ValidationException",
    "message":"One or more parameter values were invalid:
    The provided key size does not match with that of the schema"}

Lovely! At least there's a proper error message, though it's not always telling
you what the real error is. Given that Amazon's documentation is still filled with
syntactical errors, this is a bit inconvenient.

The API is some bastard child of SOAP, but with JSON instead of XML. Even using
a pretty low level library like fog doesn't hide all the crap from you. Which
worked out well in this case, as you see enough of the API to get an idea about
its basic workings.

The code examples above don't read very Ruby like as I'm sure you'll agree.
Though I gotta say, the Ruby SDK provided by AWS feels a lot more like Ruby in
its
[interface](http://docs.amazonwebservices.com/AWSRubySDK/latest/frames.html).

I don't have very high hopes to see improvements on Amazon's end, but who knows.
S3, for example, got a pretty decent REST API eventually. 

### Pricing

Pricing is done (aside from throughput capacity) per GB stored. If you store
millions of items, and they all exceed size of just a few KB, expect to pay
Amazon a ton of money, storage pricing trumps throughput pricing by a lot. Keep
data stored in an item small. If you only store a few large items, it works too,
but you may end up being better off choosing one of Amazon's other storage
options. You do the math. Pricing for storage and the maximum size for a single
item always includes attribute names, just like with SimpleDB.

To give you an idea how pricing works out, here's a simple calculation. 100 GB
of data, 1000 reads per second, 200 writes per second, item size is 4 KB on
average. That's $1253.15 every month, not including traffic. Add 10 GB of data the
second month and you're at $1263.15. You get the idea. Pricing is much more
affected by read and write operations vs. item size. Make your items 6 KB in
size, and you're already at $1827.68.

### Bottom Line

Though Amazon is doing a pretty good job at squeezing the last drop of money out
of their customers using DynamoDB, think about what you're getting in return. No
operations, no hosting facilities, let alone in three different datacenters,
conditional writes and atomic counters, and a database that (I assume) has years
of experience in production forged into it.

As usually the case with Amazon's Web Services, using something like DynamoDB is
a financial tradeoff. You get a data store that scales up and down with your
demand without you having to worry about the details of hardware, operations,
replication and data performance. In turn you pay for every aspect of the
system. The price for storage is likely to go down eventually, making it a more
attractive alternative to hosting an open source NoSQL database system yourself.
Whether this is an option for your specific use case, only you're able to make
that decision.

If you store terrabytes of data, and that data is worth tens of thousands of
dollars per month in return for not having to care about hosting, by all means,
go for DynamoDB. But at that size, just one or two months of hosting on Amazon
pays off buying servers and SSDs for several data centers. That obviously
doesn't cover operational costs and personell, but it's just something to think
about.

### Closing Thoughts

Sorted range keys, conditional updates, atomic counters, structured data and
multi-valued data types, fetching and updating single attributes, strong
consistency, and no explicit way to handle and resolve conflicts other than
conditions. A lot of features DynamoDB has to offer remind me of everything
that's great about wide column stores like Cassandra, but even more so of HBase.
This is great in my opinion, as Dynamo would probably not be well-suited for a
customer-facing system. And indeed, Werner Vogel's post on DynamoDB seems to suggest
DynamoDB is a bastard child of Dynamo and SimpleDB, though with lots of sugar
sprinkled on top.

Note that it's certainly possible and may actually be the case that Amazon has
built all of the above on top of the basic Dynamo ingredients, Cassandra living
proof that it's possible. But if Amazon did reuse a lot of the existing Dynamo
code base, they hid it really well. All the evidence points to at least heavy
usage of a sorted storage system under the covers, which works very well with
SSDs, as they make sequential writes and reads nice and fast.

No matter what it is, Amazon has done something pretty great here. They hide
most of the complexity of a distributed system from the user. The only option
you as a user worry about is whether or not you prefer strong consistency.
No quorum, no thinking about just how consistent you want a specific write
or read operation to be.

I'm looking forward to seeing how DynamoDB evolves. Only time will tell how big
of an impact Amazon's entering the NoSQL market is going to have. Give it [a
whirl](http://aws.amazon.com/dynamodb/) to find out more about it.

Want to know how the original Dynamo system works? Have a look at the [Riak
Handbook](http://riakhandbook.com/?pp), a comprehensive guide to Riak a
distributed database that implements the ideas of Dynamo and adds lots of sugar
on top.

I'm happy to be proven wrong or told otherwise about some of my assumptions
here, so feel free to get in [touch](mailto:meyer@paperplanes.de)!

### Resources

Be sure to read [Werner Vogels' announcement](http://www.allthingsdistributed.com/2012/01/amazon-dynamodb.html) of DynamoDB, and
[Adrian Cockcroft's comments](http://perfcap.blogspot.com/2012/01/thoughts-on-simpledb-dynamodb-and.html)
have some good insights on the evolution of data storage at Netflix and how
Cassandra, SimpleDB and DynamoDB compare.

* [DynamoDB](http://aws.amazon.com/dynamodb/)
* [DynamoDB FAQs](http://aws.amazon.com/dynamodb/faqs/)
* [Werner Vogels: Amazon DynamoDB - A Fast and Scalable NoSQL Database](http://www.allthingsdistributed.com/2012/01/amazon-dynamodb.html)
* [Amazon DynamoDB - Internet-Scale Data Storage the NoSQL Way](http://aws.typepad.com/aws/2012/01/amazon-dynamodb-internet-scale-data-storage-the-nosql-way.html)
* [Adrian Cockcroft: Thoughts on SimpleDB, DynamoDB and Cassandra](http://perfcap.blogspot.com/2012/01/thoughts-on-simpledb-dynamodb-and.html)
* [AWS SDK for Ruby](http://aws.amazon.com/sdkforruby/)
* [Alex Popescu: Notes about Amazon DynamoDB](http://nosql.mypopescu.com/post/16064274863/notes-about-amazon-dynamodb)
* [DynamoDB Developer Guide](http://docs.amazonwebservices.com/amazondynamodb/latest/developerguide/)
* [Dynamo, a Node.js library for DynamoDB](https://github.com/jed/dynamo)
* [dinerl, an Erlang client for DynamoDB](https://github.com/SemanticSugar/dinerl)
