---
layout: post
title: How To Redis
tags: redis
---
We've covered some good ground already, some blabber about Redis in general, and also some thoughts on when using it could be beneficial. The other big question is: How do I integrate that stuff in my application? How do I get my objects to be stored neatly in Redis?

The simplest way is to just use the [redis-rb](http://github.com/ezmobius/redis-rb) library and talk to Redis almost directly. That's quite low level compared what you're used to with ActiveRecord though. [Hurl](http://github.com/defunkt/hurl/) wraps most of the convenience stuff into a neat class [Model](http://github.com/defunkt/hurl/blob/master/models/model.rb) that implements basic functionality like saving, validating and handling identifiers.

[Ohm](http://github.com/soveran/ohm) takes it the next level, adding more complex validations, integrating the Redis data types as top level class attributes, and even handling associations for you. It's serious awesomesauce, and the implementation is quite simple too. It even supports having indexes on attributes you want to query for, updating them transparently for you as you create new objects or update existing ones.

As for integrating these things alongside your existing application, based e.g. on ActiveRecord, there is no really easy way to to that. You can't have both Ohm and AR in the same class. Data stored in Redis referencing records in other data stores, usually by storing type and identifier, is obviously weakly coupled to them. You have to take care of cleaning up and of ensuring that the keys match. Associating them means you'll have to stuff some way to fetch the data from Redis into your existing model. Let's look at some means how you could store objects and associated data in Redis. The approaches are derived from Ruby code, but are easily applicable to other languages. They're more general implementation ideas than specific pieces of code.

### Keys

Simple thing, use the fully qualified class name, add a unique identifier, and you're done. The identifier can either be derived from a separate key generator attribute in Redis, using the [atomic increment command](http://code.google.com/p/redis/wiki/IncrCommand) to generate new ones, or by using something like a UUID. It could basically look like this, the simple rule still applying that your keys need to be unique at least on a per-class basis:

    "User:ef12abc"

### Attributes

I can think of two ways to store your simple attribute data, and both are implemented in Ohm and in hurl respectively. The first one is to combine the key and the attribute name and store each attribute's value as a separate value. Ohm follows that approach, but I honestly can't think of any good reason to do it this way. Resulting key-value pairs could look like this:

    "User:ef12abc:name" => "salvatore"

hurl uses a much nicer approach, it just serializes the hash of attributes into a JSON string, storing it with the generated key as mentioned above. I much prefer this approach as it doesn't create dozens of keys for each object stored in Redis. Data is serialized before storing and deserialized when loading, simple story, and not a new approach in the world of post-relational databases. You'd do the same with CouchDB.

    "User:ef12abc" => "{name: 'salvatore'}"

Of course an attribute can simply be a list or a set of values, no big deal with Redis. Ohm wraps that kind of functionality into simple proxy classes.

### Finding Things

With a key structure in place it's easy to fetch objects and their attributes, but what about querying by attribute values? Redis doesn't have any query mechanism as you know it from relational databases. You just can't do find\_by\_name('salvatore') and be done with it. Ohm has a neat approach that just seems logical applied to something like Redis. For attributes you wish to index it stores a reverse lookup list. So if you have users with different names, that list is basically a key for each name used in any one object with a reference to objects having that very value.

You could extend that for any combination of attributes you want to query for, but if detailed ad-hoc querying is what you're after, maybe Redis is not the right tool for the job. The stored key-value combination could look like this:

    "User:name:salvatore" => ['User:ef12abc']

Combine class name, attribute and the value with a list of objects having that value. It's up to you to just have a list of their identifiers or store the fully qualified key. Of course for arbitrary values the keys can get quite long, so Ohm solves that problem by encoding the values with Base64 which does have the disadvantage of being less readable when debugging.

With that key-value combination in place a find on a particular value is merely fetching a single key in Redis. And if you didn't realize it until now, Ohm is pretty neat. It solves Redis usage for Ruby models quite elegantly.

### Associations

At this point you should get an idea how things can be solved with Redis. For associating objects the solution is pretty simple. Just keep a list of all the objects belonging to the current one. Say a user has a bunch of posts attached to them. Given that posts are also stored in Redis (and why wouldn't they?), it's just a list of keys, or a set, if you don't care for the ordering:

    "User:ef12abc:posts" => ['Post:1', 'Post:2']

Each post gets its own attribute storing the reference back up, but depending on how you usually navigate your objects, you can leave it out.

So how do you mix objects using ActiveRecord with objects stored in Redis? The answer is right there: with a lookup list similar to the one above, just using a different key according to the ActiveRecord model. It could just be as simple as class and primary key. 

### Locking Objects

After my Redis talk someone raised the question of how Redis solves the problem of concurrent writes and their potential to overwrite each other's data. I was a bit caught off guard by this question, and while I think that this is not a problem solely related to Redis, but to relational databases in general, the answer is: it doesn't. Apart from the atomic operations you can do on sets and lists and incrementing counters there just is no way.

But if you still want to ensure that at least your write is successful, Ohm to the rescue. It uses a simple lock value to lock a specific object in Redis, at least for this very write. That a write waiting for the lock to be remove might overwrite the data just written is another issue. The code in Ohm to obtain the lock looks like this (I've replaced one method call with a real value to give you an idea):

    def lock!
      lock = db.setnx('User'ef12abc:_lock', 1) until lock == 1
    end

[setnx](http://code.google.com/p/redis/wiki/SetnxCommand) sets a value only if it hasn't been previously set. So it loops until it acquires the lock, and then performs the operation. Ohm utilizes this kind of mutex for several of its operation where Redis itself can't guarantee atomicity.

There is some discussions going on to introduce some sort of batch command style syntax to the Redis protocol though. So while I don't want to see the full logic of complex transactions in Redis, having a command to have a whole batch of other commands either run all together or fail together is pretty neat.

### Select * from users

So how do you get all of your users for easy pagination? Easy, create a list for all your User objects. You can access specific ranges and always have the number of total objects at hand:

   "User:all" => ['User:12acf', 'User:f31ad']

Now you can use the [lrange](http://code.google.com/p/redis/wiki/LrangeCommand) to get to your objects or the [llen](http://code.google.com/p/redis/wiki/LlenCommand) command (`llen User:all`) to get the total number of objects of a particular type.

### Sorting

Now this is where it gets tricky. Sorting by an attribute would involve a list of attribute values somehow associated to the objects they belong to. I can't really think of a simple way to solve this in Redis 1.0, since there is no data structure that allows linking two values like that. For the record, sorting a simple list in Redis is easy as pie, check [Chris Wanstrath's post on sorting](http://ozmm.org/posts/sort_in_redis.html).

With Redis 1.1 however, sorted sets will be introduced. While they still don't solve the problem entirely, they're an acceptable solution. They work based on a score you specify when adding the attribute to the list. The score is really the kicker though, to fully work, it needs to be a number, a double precision floating point to be exact.

Since you're dealing mostly with strings, you'd need to run some sort of hashing on them. My first thought was to just put their numerical ASCII or UTF-8 codes together. But that falls apart considering that you'd need to pad the numbers depending on how many digits they have. Since the score itself is considered a number, at least padding of the first character code is lost.

But wait, did I say floating point earlier? I think I did. What if we add the generated string to e.g. a "1." and get a nice floating point number? That way padding is not lost and we still get a valid representation in terms of how Redis treats scores. I'd restrict the scoring to the first couple of characters though, the float could get quite long. You'd have the same problem with strings of arbitrary length though.

Using this simple method that's probably far from being of any scientific value, we can get a basic score for a string using it's ASCII value:

    def score(string)
      base = '1.'
      base.<< string.split("").collect{|c| '%03d' % c.unpack('c')}[0...6].join
    end

So "salvatore" would get you a score of 1.115097108118097116111. As you can see depending on the string this might break down pretty fast, so I'd restrict it to the first couple of characters in the string. My algorithm knowledge is embarrassingly rusty, so if you have good ideas how to solve that problem, please let me know. An elegant solution would be what I'm after, I'm not too happy with the one above, but it should give you an idea how you could solve the problem of sorting.

Now that you have a somewhat decent way of putting a score on an attribute value, all you need is to turn them into a sorted set saving score and the key and you're done.

    redis-cli zadd User:name:sorted 1.115097108118097116111 User:12acf
    redis-cli zadd User:name:sorted 1.109097116104105097115 User:f31ad

    redis-cli zrange User:name:sorted 0 1

    > 1. User:f31ad
    > 2. User:12acf

Update: There's a caveat (a good one) that Salvatore brought to my attention, and it's very much worth mentioning, although it doesn't help when referencing identifiers. When you specify the same scoring number for every attribute with zadd, Redis will start sorting lexicographically. How cool is that? So you could spread the same score across different attributes and still get sorting for strings. Neat stuff. [Salvatore explained this](http://groups.google.com/group/redis-db/browse_thread/thread/a3d9b4743017e90b/07585626443bd275?lnk=gst&q=radis-256#07585626443bd275) in good detail a while back on the mailing list.

### So what now?

I can hear you think: Why would I go through all that trouble just to get my data into Redis? Isn't that too much work and not really worth the hassle? Let me tell you why, because in return you get blazing speed. All data is in memory and is accessed accordingly fast. As opposed to your database the data here doesn't clog up the whole system taking up precious memory that could be used for really important data and queries.

That's why you want to start getting data out of your database, into a key-value store. Redis is just one of your options, but the implementation would usually end up being quite similar.

The inspiration for most of the ideas came from going through Ohm's source, but they're pretty similar to what I imagined they'd work, so I don't take full credit for them.

In other news, the video for last week's [N✮SQL Berlin](http://nosqlberlin.de/) meetup are available for your viewing pleasure. If you want to hear me use the the word awesome more than 30 times, [now's your chance](http://vimeo.com/7307342).