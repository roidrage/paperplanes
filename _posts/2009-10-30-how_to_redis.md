---
layout: post
title: How To Redis
topics: redis
published: false
---
We've covered some good ground already, some blabber about Redis in general, and also some thoughts on when using it could be beneficial. The other big question is: How do I integrate that stuff in my application? No big surprise that I can only talk about the Ruby side of things.

The simplest way is to just use the [redis-rb](http://github.com/ezmobius/redis-rb) library and talk to Redis almost directly. That's quite low level compared what you're used to with ActiveRecord though. [Hurl](http://github.com/defunkt/hurl/) wraps most of the stuff you're used to into a neat class [Model](http://github.com/defunkt/hurl/blob/master/models/model.rb) that implements basic functionality like saving, validating and handling identifiers.

[Ohm](http://github.com/soveran/ohm) takes it the next level, adding more complex validations, integrating the Redis data types as top level class attributes, and even handling associations for you. It's serious awesomesauce, and the implementation is quite simple too. It even supports having indexes on attributes you want to query for, updating them transparently for you as you create new objects or update existing ones.

As for integrating these things alongside your existing application, basing on e.g. ActiveRecord, there is no really easy way to to that. You can't have both in the same class. Data stored in Redis referencing records in other data stores, usually by storing type and identifier, is obviously weakly coupled to them. You have to take care of cleaning up and of ensuring that the keys match. Associating them means you'll have to stuff some way to fetch the data from Redis into your existing model. Let's look at some means how you could store objects and associated data in Redis. The approaches are derived from Ruby code, but are easily applicable to other languages.

### Keys

Simple thing, add fully qualified class name, add a unique identifier, and you're done. The identifier can either be derived from a separate key generator attribute in Redis, using the atomic increment command to generate new ones, or by using something like a UUID. It could basically look like this:

    "User:ef12abc"

### Attributes

I can think of two ways to store your simple attribute data, and both are implemented in Ohm and in hurl respectively. The first one is to combine the key and the attribute name and store each attribute's value as a separate value. Ohm follows that approach, but I honestly can't think of a lot of valid reasons to do that. Resulting key-value pairs could look like this:

    "User:ef12abc:name" => "salvatore"

hurl uses a much nicer approach, it just serializes the hash of attributes into a JSON string, storing it with the generated key as mentioned above. I much prefer this approach as it doesn't create dozens of keys for each object stored in Redis. Data is serialized before storing and deserialized when loading, simple story, and not a new approach in the world of post-relational databases. You'd do the same with CouchDB.

    "User:ef12abc" => "{name: 'salvatore'}"

Of course an attribute can simply be a list or a set of values, no big deal with Redis. Ohm wraps that kind of functionality into simple proxy classes.

### Finding Things

With a key structure in place it's easy to fetch objects and their attributes, but what about querying by attribute values? Redis doesn't have any query mechanism as you know it from relational databases. You just can't do find\_by\_name('salvatore') and be done with it. Ohm has a neat approach that just seems logical applied to something like Redis. For attributes you wish to index it stores a reverse lookup list. So if you have users with different names, that list is basically a key for each name used with a reference to the object that has that attribute. Pretty neat if you ask me.

You could extend that for any combination of attributes you want to query for, but if detailed ad-hoc querying is what you're after, maybe Redis is not the right tool for this job. In Redis, it could look like this:

    "User:name:salvatore" => ['User:ef12abc']

Combine class name, attribute and the value with a list of objects having that value. It's up to you to just have a list of their identifiers or store the fully qualified key. Of course for arbitrary values the keys gets quite annoyingly long, so Ohm solves that problem by encoding the values with Base64.

If you didn't realize it until now, Ohm is pretty neat. It solves Redis usage for models quite elegantly.

### Associations

At this point you should get an idea how things can be solved with Redis. For associating objects the solution is pretty simple. Just keep a list of all the objects belonging to the current one. Say a user has a bunch of posts attached to them. Given that posts are also stored in Redis (and why wouldn't they?), it's just a list of keys:

    "User:ef12abc:posts" => ['Post:1', 'Post:2']

Each post gets its own attribute storing the reference back up, if you need it.

So how do you mix objects using ActiveRecords with objects stored in Redis? The answer is right there: with a lookup list similar to the one above, just using a different key according to the ActiveRecord model. It could just be as simple as class and primary key.

### Locking Objects

After my Redis talk someone raised the question of how Redis solves the problem of concurrent writes and their potential to overwrite each other's data. I was a bit caught off guard by this question, and while I think that this is not a problem solely related to Redis, but to relational databases in general, the answer is: It doesn't. Apart from the atomic operations you can do on sets and lists and incrementing counters there just is no way.

But if you still want to ensure that at least your write is successful, Ohm to the rescue. It uses a simple lock value to lock a specific object in Redis, at least for this very write. That a write waiting for the lock to be remove might overwrite the data just written is another issue. The code in Ohm to obtain the lock looks like this (I've replace one method call with a real value to give you an idea):

    def lock!
      lock = db.setnx('User'ef12abc:_lock', 1) until lock == 1
    end

`setnx` sets a value only if it hasn't been previously set. So it loops until it acquires the lock, and then performs the operation. Ohm utilizes this kind of mutex for several of its operation where Redis itself can't guarantee atomicity.

### So what now?

I can hear you think: Why would I go through all that trouble just to get my data into Redis? Isn't that too much work and not really worth the hassle? Let me tell you why, because in return you get blazing speed. All data is in memory and is accessed accordingly fast. As opposed to your database the data here doesn't clog up the whole system taking up precious memory that could be used for really important data and queries.

That's why you want to start getting data out of your database, into a key-value store. Redis is just one of your options, but the implementation ends being quite similar.