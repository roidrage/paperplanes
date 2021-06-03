---
title: June Reading List
tags: reading books
layout: post
---
I've been on vacation in France for most of June, and that means lots of time to
read. Originally I planned on reading more on distributed systems, but I had a
decent backlog of books on my Kindle, so this was just the right time to plow
through them. By the way, if you don't have a Kindle yet, you should get one.
It's a great little device. I've been reading so much more since I got it.
Anyhoo, here's the list of books I've been reading in June.

[**Java Concurrency in Practice**](http://amzn.to/MW3fhv) by Brian Goetz. This
is a classic on programming for concurrency in Java. While all the code examples
are Java, they're just as easy to understand, and should be easily applicable to
your programming language of choice. Given, of course, that there are libraries
offering similar data structures.

The book goes through great length discussing what's wrong with just using
threads and synchronizing access to data and how newer concurrent APIs in Java
can help you avoid the hassle. It covers a mind-boggling number of details and
data structures. Concurrent collections, designing thread-safe code, latches,
barriers, queues, atomic data types, locks, semaphores, deadlocks, thread
liveness, execution pools and so on. The part that really surprised me was the
insight on the JVM's memory model, and why you need to protect data structures
when it's shared across threads and multiple cores and processors.  A must-read
when it comes to programming for concurrency, and not just on the JVM. This book
is a true gem.

[**Designing With Data**](http://amzn.to/LN4qm3) by Brian Suda. A great, short
introduction to visualizing data. The book is for everyone new to the area of
graphing and exploring data. Don't expect a thorough introduction on statistics
and everything around the numbers. The book focuses more on introducing the
reader to the different types of graphs, why and when they work and also why
some of them don't work.

[**Scalable Internet Architectures**](http://amzn.to/KAog1y) by Theo
Schlossnagle. This book was written in 2007 and was way ahead of its time. Never
mind the examples being mostly in Perl, this book covers all the little details
on what it takes to build scalable web applications. Heck, it even shows you how
you can build your own cross-vendor database replicator. A highly recommended
read. It's right up there with [**Release It!**](http://amzn.to/MFlJVg) by
Micheal Nygard, which you should read too.

[**Small Is The New Big**](http://amzn.to/MW3Dge) by Seth Godin. I gotta admit,
I haven't read anything by Seth so far, but this was a great start. It's a
collection of 183 posts from his blog, carefully selected to represent little
stories on why big companies fail and how small companies can succeed. It's a
great read, I'm amazed how well Seth can take small examples like chucking a
large pile of jewel cases and extrapolate them into a big picture to examplify
why the music industry is doomed. Looking forward to reading more of his books.

[**Drive: The Surprising Truth About What Motivates Us**](http://amzn.to/KAoxBm)
by Daniel Pink. The title says it all, the book explores, through scientific
(but not at all boring) analysis, why money is not our sole motivator. We have
an inner drive to expand our personal horizons, to master what we do every day
and to work towards a purpose bigger than ourselves. Tom Preston-Werner (of
GitHub) recommended the book at a conference, and you can see how it reflects
the work culture at GitHub. Fits in very well with the aforementioned book.

[**Programming Concurrency on the JVM**](http://amzn.to/MW4E7M) by Venkat
Subramaniam. This book picks up where "Java Concurrency in Practice" left off. To
recap things in terms of more traditional synchronization and concurrency APIs
it builds on several simple examples that are being rebuilt constantly using new
tools as the book progresses. The interesting bits are the part that covers
software transactional memory and actors, both mostly focusing on
[Akka](http://akka.io).

As the title suggests this book is very code-heavy, which sometimes, at least on
the Kindle, is a bit unreadable. It takes you through all the details of using
STM and actors, both in Java and Scala, but also with examples in Groovy, JRuby
and Clojure. This is pretty neat, because you pick up some new things along the
way.  I'd wish for some more depth here and there but I feel much better
informed on STM and actors after reading it.

[**Knack**](http://amzn.to/MW4MnQ) by Norm Brodsky and Bo Burlingham. A book
focused around founding, running and growing a business, this one is full of
stories from the author's experiences with his businesses, beginning as
start-ups, growing into big yet still customer-focused and in their own right
still small companies.

Added to the mix are stories from people and companies the Norm has advised over
the years. You don't have to believe or take for granted everything he has to
say and recommends doing or not doing, but this one is a great read either way,
very much so because it is full of stories. If you read "Drive" and "Small Is
The New Big", you'll find similar patterns occurring in all of them.

As days go by this book keeps coming back to me. Lots of little details that I
want to apply to my own business practices. The more I think about it the more I
think you should read this book.

[**Clojure Programming**](http://amzn.to/LN5cj0) by Chas Emerick, Brian Carper
and Christophe Grande. Clojure pushes all the right buttons for me as a
language, and this book so far has helped me grasp more and more of it. While
some of the code examples aren't very practical and introduce new concepts
without discussing them here and there, the book is still a great introduction
to the language. I just wish it wasn't > 600 pages, but still, lots of contents
to plow through.

[**Pricing with Confidence**](http://amzn.to/QxutQq) by Reed Holden. I came
across this book by way of Amy Hoy's
[blog](http://unicornfree.com/2011/biz-book-friday-cost-plus-pricing-price-obsession/)
[posts](http://unicornfree.com/2011/will-low-prices-sell-more/) on
[pricing](http://unicornfree.com/2011/when-customers-bitch-about-your-price-biz-book-friday/).
The book deserved an emergency spot on my reading list because it's very
relevant for the product I'm currently working on. The book's focus is on basing
the price of a product on its value to the customer. Granted, I just started
reading it, but so far it reads well and the points make a lot of sense. If
you're looking to dive deeper into pricing your products, there's also [Don't
Just Roll The Dice](http://neildavidson.com/download/dont-just-roll-the-dice/),
whose PDF version is available as a free download.

Now go read!
