---
layout: post
title: "Merb's run_later Coming to a Thread-safe Rails Near You"
tags: rails ruby
---
At RailsConf Europe, Yehuda Katz showed off a small yet totally useful feature of Merb. A method called `run_later` that does nothing more than queue the block it receives as an argument to be executed after the request is done.

After the announcement that Rails 2.2 would be thread-safe, and after seeing Nick Sieger's work on a connection pool for ActiveRecord I thought that this feature should be usable with Rails as well.

So without further ado, `run_later` is now available as a [plugin for Rails](http://github.com/mattmatt/run_later/tree/master). It simply fires of a separate thread when your application starts and will work through whatever you put in its queue.

The worker thread will be on a per-process basis due to Ruby's in-process threading. So each Mongrel you start will have its own worker thread. It's not the place to put long running tasks that need some kind of separation or need to run in the order they arrive in the queue. For that, turn to tools like [Starling](http://rubyforge.org/projects/starling/)/[Workling](http://github.com/purzelrakete/workling/tree) or [ActiveMessaging](http://code.google.com/p/activemessaging/). Also, it doesn't use a persistent queue, so if you have important messages to deliver, again, turn to more advanced tools.

But for smaller tasks that don't need to run within the context of the request or would potentially block it, `run_later` is pretty much all you need.

Integrating it in your controller is simple:

<script src="http://gist.github.com/13783.js"></script>

The only requirement: Rails 2.2, the current edge version works fine. With any version lower than that especially the behavior of ActiveRecord will be unpredictable. But if you're using Rails 2.2, give it a go, and let me know about your results. Mind you, I haven't put this into production myself, so some stability testing is still on my list.

I'm planning to throw in some kind of scheduling so that you can say something like `run_later :in => 10.minutes`.

Credit where credit is due: To Ezra for adding the code to Merb, for Yehuda to mention the feature at the BoF session and giving me the idea to port it. Not to forget the effort to make Rails thread-safe in the first place. I merely adapted their code to work with Rails, and threw in some tests as well.