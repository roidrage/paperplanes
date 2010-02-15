---
layout: post
title: NoSQL And You - Thoughts On Finding Right Partner In Chrime
topics: nosql
---
The NoSQL landscape is a fickle thing, new tools popping up every week, broadening a spectrum that's already close to being ungraspable, especially when you're totally new to the whole thing. There's a couple of common misconceptions and wrong-doings that people who've been playing with the tools already tend to tell newbies in the landscape.

I'm guilty as charged too, I tend to tell people about the tools I already know. Being a good thing per se, because the recommendation is based more or less on experience, it leaves out one thing that I find to be the most important philosophy about post-relational (much nicer term than NoSQL) databases: It's all about your data, about its needs and how your application needs to access them. The times of generic, one-size-fits-all tools like MySQL, PostgreSQL and the like are over, it's well worth knowing how they're different, and what tool would be the best partner in chrime to get stuff done.

### No Size Fits All

While you could throw MySQL at a lot of problems, it was far from being the optimal choice in a lot of cases, but you could somehow bend it to your will. The new generation of tools tends to avoid having to be bent, instead they give you a freedom of choice. The freedom to analyse what your data is like, and what the right tool for your specific use case is.

Does that mean more work on your end? It sure does, but for the love of your data, it will be worth it. If you find the right partner, and it makes your life easier, it's a win on both ends. You'll be a happy developer (well, most of the time), and your data will be able to roam free, running naked across a meadow, hand in hand with the tool you chose.

Now I'm well aware that this sounds all bloomy, but that's what it boils down to. The choice is now up to you, that's why it's important to know what's out there, to play with the tools available, to know how and why they're different from each other.

To get you started, have a look at Vineet Gupta's [excellent overview of the NoSQL landscape](http://www.vineetgupta.com/2010/01/nosql-databases-part-1-landscape.html).

### Don't Believe Everything You Hear

If someone tells you that you should try a specific tool, ask him why. If the answer is speed, or because it's written in Erlang and scales insanely well, it's time to call bullshit on him. MySQL can be fast too, that's not an issue. It's nice to be able to have a database that you can scale up to hundreds of nodes easily, but while the technology behind it is very interesting, and sometimes mind-blowing, it doesn't help if it's a pain to work with, or if there's no library support yet. Sure you could write your own, but if you're totally new to the field, you usually just want to play and learn. Hard thing to do if all you get is just an API and a very limited language support.

If someone tells you that e.g. MongoDB is fast, then there's reason for that, and it's good to be well aware of it and [what consequences it has for operating your application](http://blog.mongodb.org/post/381927266/what-about-durability). If someone tells you that CouchDB is awesome for building web applications, because it's built of the web, they're leaving out that a common use case like pagination [is still an awful thing to implement with it](http://nosql.mypopescu.com/post/383815292/paginating-with-couchdb). If someone tells you that Cassandra scales easily because it was built at Facebook, they're leaving out that [its peculiar way of storing and accessing data](http://wiki.apache.org/cassandra/DataModel) is very specific to how sites like Facebook need to access their data. I could go on and on about it, but there's always two side of a story.

Before judging a tool based on just the one side, look at the other side too. It might not be as big of a problem as you thought it would, either way, you know why things are the way they are. Look for tools with sites describing particular use cases, or areas where they're just not a good fit. If the tool builders aren't aware of use cases, strengths and weaknesses, how will you be?

In the end, even though they can be problems for others, they don't necessarily are problems for you. Your particular use case might be just fine with the downsides, but on the other hand gaining high profit from the upsides. If it's not, at least you're more than free to go look somewhere else. At least now you have the (free) options to do so.

There's misconceptions out there being close to urban myths, and we're only two years or so into working with the new generation of tools. The only way you can avoid falling into a trap is to play with what's out there, to know their weaknesses and strengths. The only thing we can do to avoid having people fall into the trap is to better educate them, to give them real-world examples, use cases other than tagging and blog posts. Just saying that it scales better than xyz is not an argument, it's educating people on the wrong end.

### It's Not About Speed And Scaling

If speed and scaling were our only problems, we'd be left in a big world of pain. As beautiful as these words are, I'm gonna go out on a limb and say that it's not a problem until it's a problem. Unless you're already Facebook or LinkedIn, you don't need to have that as a main factor when choosing the right tool. Sure, it's better if there's an easy way to scale up in the future, but what's the point if you needs days to get a good set up before having written a single line of code?

Most NoSQL tools were built with some sort of scaling in mind, although people tend to easily confuse scaling, distribution, sharding and partitioning, so you're safe in most cases when it comes to the point where your application needs to handle more traffic.

I'm gonna go ahead and venture the guess that if you're deciding solely based on speed and scalability, you're doing it wrong. And I rarely use that phrase. You should be deciding based on the core feature set, why it does the things it does, and what consequences it'd have on your life as a developer.

### Don't Compare Apples And Oranges

No tool is like the other. Just comparing e.g. MongoDB, Redis and MySQL is the wrong way to approach your problem, especially if you just look at speed and comparing their feature set. Feature sets and speed are usually different for a reason. Instead you should be comparing every tool with your data. How much do you need to bend the data to store and access it easily. Is it even possible to store it efficiently and or your particular use case? Are potential trade-offs (e.g. data duplication to gain speedier access) worth risking? Is it the right fit in the way it handles updates, associations, writes, reads and queries in terms of your data and application? Then go right ahead and use it.

But don't just compare tools with each other whose only feature they have in common is the fact that they can store data, or things that are mostly depending on an application's specific needs. To give you an idea, this guy compares [Redis](http://masonoise.wordpress.com/2010/01/30/comparing-mongodb-and-redis-part-1/) and [MongoDB](http://masonoise.wordpress.com/2010/01/30/comparing-mongodb-and-redis-part-1/) by implementing a particular use case with both of them. That's the way you should be comparing tools.

### The Heat Is On

We're going to see more tools popping up left and right, making it harder to keep up, and to make an informed decision. What I consider the best thing about most of them is that they're free. You can grab the source code, improve it or just look at how it handles your data. That's what makes them so awesome, their incentive is not to constrain your data, they're as open as possible about it, some tools even going as far as building solely on open standards to implement their whole stack (that'd be CouchDB if you're curious).

The whole point of this post is that it's up to you to find the perfect tool to hand your data to. I don't know about you, but me being able to find the right fit instead of squeezing my data into a database that tries to solve all problems at once, that's the most exciting prospect of post-relational databases for me. Our common goal should be to help people make that decision without getting too passionate about any particular tool. They all exist to fulfill some purpose, and we should be telling people about them.

There's a couple of sites to keep an eye on, e.g. [MyNoSQL](http://nosql.mypopescu.com/) by Alex Popescu, he's keen on keeping up-to-date with what's going on in the NoSQL community. Another site with a growing collection of links to articles is [nosql-databases.org](http://nosql-database.org/links.html). EngineYard published a series of blog posts on [key-value stores](http://www.engineyard.com/blog/2009/key-value-stores-in-ruby/) in Ruby, in particular [Cassandra](http://www.engineyard.com/blog/2009/cassandra-and-ruby-a-love-affair/), [Redis](http://www.engineyard.com/blog/2009/key-value-stores-for-ruby-part-4-to-redis-or-not-to-redis/), [MongoDB](http://www.engineyard.com/blog/2009/mongodb-a-light-in-the-darkness-key-value-stores-part-5/), [CouchDB](http://www.engineyard.com/blog/2009/key-value-stores-in-ruby-the-wrap-up/), [LDAP](http://www.engineyard.com/blog/2009/ldap-directories-the-forgotten-nosql/) that's well worth checking out to get an idea of what's out there.