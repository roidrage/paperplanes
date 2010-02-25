---
layout: post
title: Notes on MongoDB
topics: nosql mongodb
---
For an article in a German magazine I've been researching [MongoDB](http://mongodb.org) over the last week or so. While I didn't need a lot of the information I came across I collected some nicely distilled notes on some of its inner workings. You won't find information on how to get data out of or into MongoDB. The notes deal with the way MongoDB treats and handles your data, a high-low-level view if you will. I tried to keep them as objective as possible, but I added some commentary below.

Most of this is distilled knowledge I gathered from the [MongoDB documentation](http://www.mongodb.org/display/DOCS/Home), credit for making such a good resource available for us to read goes to the Mongo team. I added some of my own conclusion where it made sense. They're doing a great job documenting it, and I can highly recommend spending time to go through as much of it as possible to get a good overview of the whys and hows of MongoDB. Also, thanks to Mathias Stearn for hooking me up with some more details on future plans and inner workings in general. If you want to know more about its inner workings, there's a [webcast coming up](http://blog.mongodb.org/post/404909201/mongodb-how-it-works-webinar) where they're gonna explain how it works.

Basics

- Name stems from humongous, though (fun fact) mongo has some unfortunate meanings in other languages than English (German for example)
- Written in C++.
- Lots of language drivers available, pushed and backed by the MongoDB team. Good momentum here.
- According to The Changelog Show ([[1]](http://thechangelog.com/post/287597162)) MongoDB was originally part of a cloud web development platform, and at some point was extracted from the rest, open sourced and turned into what it is today.

Collections

- Data in MongoDB is stored in collections, which in turn is stored in databases. Collections are a way of storing related data (think relational tables, but sans the schema). Collections contain documents which have in turn keys, another name for attributes.
- Data is limited to around 2 GB on 32-bit systems, because MongoDB uses memory-mapped files, as they're tied to the available memory addressing. (see [[2]](http://blog.mongodb.org/post/137788967/32-bit-limitations))
- Documents in collections usually have a similar data structure, but any arbitrary kind of document could be stored, similarity is recommended for index efficiency. Document's can have a maximum size of 4MB.
- Collections can be namespaced, i.e. logically nested: db.blog.posts, but the collection is still flat as far as MongoDB is concerned, purely an organizational means. Indexes created on a namespaced collection only seem to apply to the namespace they were created on though.
- A collection is physically created as soon as the first document is created in it.
- Default limit on number of namespaces per database is 24000 (includes all collections as they're practically the top level namespace in a database), which also includes indexes, so with the maximum of 40 indexes applied to each collection you could have 585 collections in a database. The default can be changed of course, but requires repairing the database if changed on an active instance.
- While you can put all your data into one single collection, from a performance point of view, it seems to make sense to separate them into different collections, because it allows MongoDB to keep its indexes clean, as they won't index attributes for totally unrelated documents.

Capped Collections

- Capped collections are fixed-size collections that automatically remove aged entries by LRU. Sounds fancier than it probably is, I'm thinking that documents are just appended at the last writing index, which is reset to 0 when limit of the collection is reached. Preferrable for insert-only use cases, updates of existing documents fail when the data size is larger than before the update. This makes sense because moving an object would destroy the natural insertion order. Limited to ~1GB on 32-bit systems, sky's the limit on 64-bit.
- Capped collections seem like a good tool for logging data, well knowing that old data is purged automatically, being replaced with new data when the limit is reached. Documents can't be deleted, only the entire collection can be dropped. Capped collections have no indexes on the \_id by default, ensuring good write performance. Indexes generally not recommended to ensure high write performance. No index on \_id means that walking the collection is preferred over looking up by a key.
- Documents fetched from a capped collection are returned in the order of their insertion, newest first, think log tailing.

Data Format

- Data is stored and queried in BSON, think binary-serialized JSON-like data. Features are a superset of JSON, adding support for regular expressions, date, binary data, and their own object id type. All strings are stored in UTF-8 in BSON, sorting on the other hand does not (yet), it uses strcmp, so the order might be different from what you'd expect. There's a sort of specification for BSON, if you're into that kind of stuff: [[3]](http://www.mongodb.org/display/DOCS/BSON) and [[4]](http://bsonspec.org)
- Documents are not identified by a simple ID, but by an object identifier type, optimized for storage and indexing. Uses machine identifier, timestamp and process id to be reasonably unique. That's the default, and the user is free to assign any value he wishes as a document's ID.
- MongoDB has a "standard" way of storing references to other documents using the DBRef type, but it doesn't seem to have any advantages (e.g. fetch associated objects with parent) just yet. Some language drivers can take the DBRef object and dereference it.
- Binary data is serialized in little-endian.
- Being a binary format, MongoDB doesn't have to parse documents like with JSON, they're a valid in-memory presentation already when coming across the wire.

References

- Documents can embed a tree of associated data, e.g. tags, comments and the like instead of storing them in different MongoDB documents. This is not specific to MongoDB, but document databases in general (see [[5]](http://seancribbs.com/tech/2009/09/28/modeling-a-tree-in-a-document-database/)), but when using find you can dereference nested objects with the dot, e.g. blog.posts.comments.body, and index them with the same notation.
- It's mostly left to the language drivers to implement automatic dereferencing of associated documents.
- It's possible to reference documents in other databases.

Indexes

- Every document gets a default index on the \_id attribute, which also enforces uniqueness. It's recommended to index any attribute that's being queried or sorted on.
- Indexes can be set on any attribute or embedded attributes and documents. Indexes can also be created on multiple attributes, additionally specifying a sort order.
- If an array attribute is indexed, MongoDB will indexed all the values in it (Multikeys).
- Unique keys are possible, missing attributes are set to null to ensure a document with the same missing attribute can only be stored once.
- If it can, MongoDB will only update indexes on keys that changed when updating a document, only if the document hasn't changed in size so much that it must be moved.
- MongoDB up to 1.2 creates and updates synchronously, 1.3 has support to update indexes in the background

Updates

- Updates to documents are in-place, allowing for partial updates and atomic operations on attributes (set for all attributes, incr, decr on numbers, push, pop, pull et. al on arrays), also known as modifier operations. If an object grows out of the space originally allocated for it, it'll be moved, which is obviously a lot slower than updating in-place, since indexes need to be updated as well. MongoDB tries to adapt by allocating based on update history (see [[6]](http://blog.mongodb.org/post/248614779/fast-updates-with-mongodb-update-in-place)). Writes are lazy.
- Not using any modifier operation will result in the full document being updated.
- Updated can be done with criteria, so a whole bunch of matching documents. Think "update ... where" in SQL. This allows for updating objects based on a particular snapshot, i.e. update based on id and some value in the criteria will only update when the document still has that value. This kind of update is atomic. Reliably updating multiple documents atomically (think transaction) is not possible. There's also findAndModify in 1.3 (see [[7]](http://www.mongodb.org/display/DOCS/findandmodify+Command)) which allows atomically updating and returning a document.
- Upserts insert when a record with the given criteria doesn't exist, otherwise updates the found record. They're executed on the collection. A normal save() will do that automatically for any given document. Think find\_or\_create\_by in ActiveRecord.

Querying

- Results are returned as cursors, walking a collection as it advances. Which explains why you potentially get records that needed to be moved, it pops up in a space that's potentially after its current position, if there's space even in a spot before the current cursor's position. Cursors are fetched in batches of 100 documents or 4 MB of data, whichever's reached first.
- That's also why it's better to store similar data in a separate collection. Traversing similar data is cheaper than traversing over totally unrelated data, the bigger the size of documents compared to the documents that match your find, the more data will have to be fetched from the database and skipped if it doesn't match your criteria.
- Data is returned in natural order which doesn't necessarily relate to insertion order, as data can be moved if it doesn't fit into its old spot anymore when updated. For capped collections, natural order is always insertion order.

Durability

- By default, data in MongoDB is flushed to disk every 60 seconds. Writes to MongoDB (i.e. document creates, updates and deletes) are not stored on disk until the next sync. Tradeoff high write performance vs. durability. Need more durability, reduce sync delay. Closest comparison to the durability behaviour is MySQL's MyISAM.
- Data is not written transactional, so if the server is killed during a write operation, the data is likely to be inconsistent or even corrupted and needs repair. Think classic file systems like ext2 or MyISAM.
- In MongoDB 1.3 a database flush to disk can be enforced by sending the fsync command to the server.

Replication

- Replication is the recommended way of ensuring data durability and failover in MongoDB. A new (i.e. bare and dataless) instance can be hooked onto another at any time, doing an initial cloning of all data, fetching only updates after that.
- Replica pairs offers an auto-failover mechanism. Initially both settle on which is master and which is slave, the slave taking over should the master go down. Can be used e.g. in the Ruby driver using :left and :right options. There's an algorithm to handle changes when master and slave get out of sync, but it's not fully obvious to me (see [[8]](http://www.mongodb.org/display/DOCS/Pairing+Internals)). Replica Pairs will be replaced by Replica Sets, allowing for more than one slave. The slave with the most recent data will be promoted master in case of the master going down. The slaves agree which one of them is the new master, so a client could ask any one server in the set which one of them is the master.
- Replication is asynchronous, so updates won't propagate immediately to the slaves. There's ideas to require the right to be propagated to at least N slaves before returning the write to the client successfully (similar to the feature in MySQL 5.4). (see [[9]](http://blog.mongodb.org/post/381927266/what-about-durability))
- A master collects its writes in an opslog on which the slaves simply poll for changes. The opslog is a capped collection and therefore not a fully usable transaction log (not written to disk?) as old data is purged automatically, hence not reliable for restoring the database after a crash.
- After initial clone, slaves poll once on the full opslog, subsequent polls remember the position where the previous poll ended.
- Replication is not transactional, so the durability of the data on the slave is prone to the same durability conditions as the master, just in a different and still durability-increasing manner, since having a slave allows to decrease sync times on it, and therefore shortening the timespan of data not being written to disk across the setup.

Caching

- With the default storage engine, caching is basically handled by the operating system's virtual memory manager, since it uses memory-mapped files. File cache == Database cache
- Caching behaviour relies on the operating system, and can vary, not necessarily the same on every operating system.

Backup

- If you can live with a temporary write lock on your database, MongoDB 1.3 offers fsync with lock to take a reliable snapshot of the database's files.
- Otherwise, take the old school way of dumping the data using mongodump, or snapshotting/dumping from a slave database.

Storage

- Data is stored in subsequently numbered data files, each new one being larger than the former, 2GB being the maximum size a data file can have.
- Allocation of new datafiles doesn't seem to be exactly related to the amount of data currently being stored. E.g. storage size returned by MongoDB for a collection was 2874825392 bytes, but it had already created almost six gigabytes worth of database files. Maybe that's the result of padding space for records. I haven't found a clear documentation on this behaviour.
- When MongoDB moves data into a different spot or deletes documents, it keeps track of the free space to reuse in the future. The command repairDatabase() can be use to compact it, but that's a slow and blocking operation.

Concurrency

- MongoDB refrains from using any kind of locking on data, it has no notion of a transaction or isolation levels. Concurrent writes will simply overwrite each other's data, as they go straight to memory. Exceptions are modifier operations that are guaranteed to be atomic. As there is no way to update multiple records in some sort of transaction, optimistic locking is not possible, at least in a fully reliable way. Since writes are in-place and in-memory first, they're wicked fast.
- Reads from the database are usually done in cursors, fetching a batch of documents lazily while iterating through it. If records in the cursors are updated while the cursor is being read from, the updated data may or may not show up. There's no kind of isolation level (as there are no locks or snapshotting). Deleted records will be skipped. If a record is updated from another process so that the size increases and the object has to be moved to another spot there's a chance it's returned twice.
- There's snapshot queries, but even they may or may not return inserted and deleted records. They do ensure that even updated records will be returned only once, but are slower than normal queries.

Memory

- New data is allocated in memory first, increments seem to be fully related to the amount of data saved.
- MongoDB seems to be happy to hold on to whatever memory it can get, but at least during fsync it frees as much as possible. Sometimes it just went back to consuming about 512 MB real memory, other times it went down to just a couple of megs, I couldn't for the life of me make out a pattern.
- When a new database file needs to be created, it looks like MongoDB is forcing all data to be flushed to disk, freeing a dramatic amount of memory. On normal fsyncs, there's no real pattern as to how MongoDB frees memory.
- It's not obvious how a user can configure how much memory MongoDB can or should use, I guess it's not possible as of now. Memory-mapped files probably just use whatever's available, and be cleaned up automatically by the operating system's virtual memory system.
- The need to add an additional caching layer is reduced, as object and database representation is the same, and file system and memory cache can work together to speed up access, there's no data conversion involved, at least not on MongoDB's side, data will just be sent serialized and unparsed across the wire. Obviously it depends on the use case if this is really an advantage or a secondary caching layer is still needed.

GridFS

- Overcomes the 4MB limit on documents by chunking larger binary objects into smaller bits.
- Can store metadata alongside file data. Metadata can be specified by the user and be arbitrary, e.g. contain access control information, tags, etc.
- Chunks can be randomly access, so it's possible to fetch data easily whose position in the file is well-known. If random access is required, makes sense to keep chunks small. Default size is 256K.

Protocol Access

- MongoDB's protocol is binary and in its own right proprietary, hence they offer a lot of language drivers to take that pain away from developers, but also offer a full specification on both BSON and the protocol.

Sharding

- MongoDB has alpha support for sharding. Its functionality shouldn't be confused with Riak's way of partitioning, it's a whole different story. The current functionality is far from what is planned for production, so take everything listed here with a grain of salt, it merely presents the current state. The final sharding feature is supposed to be free of the restrictions listed here.
- A shard ideally (but not necessarily) consists of two servers which form a replica pair, or a replica set in the future.
- All shards are known to a number of config server instances that also know how and where data is partitioned to.
- Data can be sharded by a specific key. That key can't be changed afterwards, neither can the key's value.
- Keys chosen should be granular enough so that there's the potential of having too many records with the same key. Data is split into chunks of 50 MB so with big documents, it's probably better to store them in GridFS, as a chunk can contain a minimum of ~12 documents when all take up the available space of 4 MB.
- Sharding is handled by a number of mongos instances which are connected to the shards which in turn are all known to a number of mongod config server instances. These can run on the same machines as the data-handling mongod instances, with the risk that when the servers go down they also disappear. Having backup services seems to be appropriate in this scenario.
- Sharding is still in alpha, e.g. currently replicated shards aren't supported in alpha 2, so a reliable sharding setup is currently not possible. If a shard goes down, the data on it is simply unavailable until it's brought back up. Until that happens, all reads will raise an error, even when looking up data that's known to be on the still available shards.
- There's no auto-balancing to move chunks to new shards, but that can be done manually.

There you go. If you have something to add or to correct, feel free to leave a comment. I'm happy to stand corrected should I have drawn wrong conclusions anywhere.

As a user of CouchDB I gotta say, I was quite sceptical about some of MongoDB's approaches of handling data. Especially durability is something that I was worried about. But while I read through the documentation and played with MongoDB I realized that it's the same story as always: It depends. It's a problem when it's a problem. CouchDB and MongoDB don't necessarily cover the same set of use cases. There's enough use cases where the durability approach of MongoDB is acceptable compared to what you gain, e.g. in development speed, or speed when accessing data, because holy crap, that stuff is fast. There's a good reason for that, as I hope you'll agree after going through these notes. I'm glad I took the time to get to know it better, because the use cases kept popping up in my head where I would prefer it over CouchDB, which isn't always a sweet treat either.

If you haven't already, do give MongoDB a spin, go through their documentation, throw data at it. It's a fun database, and the entrance barrier couldn't be lower. It's a good combination of relational database technologies, with schemaless and JavaScript sprinkled on top.