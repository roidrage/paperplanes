---
layout: post
title: The Case of OODBMS vs. NoSQL
topics: oodbms nosql databases
published: false
---
In the light of post-relational and document databases, one question comes up time and again: But what about object-oriented databases? Aren't they NoSQL too? Don't they already do what graph databases like Neo4J or MongoDB with it's linking documents features already do?

Object-oriented are definitely not a new thing, and some of their features do sound familiar when you look at what the new generation of databases has to offer, but to be honest, I don't see how they're similar in any way. I've had the doubtful pleasure of working with Versant's object database a couple of years ago, and it wasn't a great one. The flaws of the database by far outweighed the benefits, at least for me. Example? At that time, when you deleted an object, the space on the page it used to exist on never got freed. Fragmented database anyone? But yeah, they had a tool to fix that. A tool you could buy. They have a lot of tools for all kinds of purposes.

Need to migrate data? You're out of luck. Either use one of the tools or use good old serialization features of your programming language to get data out and back in in a new data structure. Need to do reports? Ad-hoc querying? I'm sure there's a tool for that. Before Versant jumped on the JDO train (which later crashed and became EJB3) there was only a very simple query language, of which I'm vaguely reminded by MongoDB's querying functionality, except I didn't have to put indexes on all attributes I wanted to query as I have to do in MongoDB.

So what's an object database actually good at? You'll usually hear two arguments, transparent persistency and object traversal. Both are true, and honestly I don't even care about the first one. Traversing an insanely large graph of objects really is where they really shine.

For me, that's it. Which leads me to the following question. If object databases existed for more than 20 years, how come they were never widely adopted?

My guess: The total lack of openness, not necessarily because they're not open source, but because of the way they work. I'm also not talking about inter-operatibility or open standards, just about how openly tools allow you to work or access your data. With object databases accessing your data means fetching them by their identifier and getting a deserialized object back, nothing more, nothing less.

With transparent persistency it's insanely easy to get data in, if you use the right programming language (did I mention with Versant it's C++ and Java?) It's almost too easy. It's easy to get careless about the data and object graphs you dump into your database.

But their interfaces are proprietary, and your data is tied to your objects, to the way your code is structured. The only way out is through objects. The only way to get to them is a proprietary protocol, a unified interface is an unknown term in the world of object databases. JSON? Never heard of, but we have objects.

Object databases usually mean total vendor lock-in, in every aspect. You're bound to their will, you're bound to their tools, to the way they structure their data. I don't know about you, but I find that scary. It's the very reason I'm staying away from object databases, and much prefer the new generation of document databases. They're not bound to objects or programming languages, their data format is interchangable, you can get it through common interfaces like HTTP, or an insanely simple text-based protocol like Redis has.

That openness is the real killer feature for me, it's what makes this new generation of databases so very exciting for me. I don't deny that there's good use cases for object databases, but it's a niche, a niche that may or may not be challenged by the new generation of databases. In any way, I'd like to see more openness in their world, not only complaining that they always used to do what NoSQL is doing now. That's not helping their case, it's just making it more obvious that they failed to push into the mass market.