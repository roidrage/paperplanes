---
layout: post
title: run_later Gets Some Rails 2.3 Middleware Love
topics: run_later rails rack
---
Apart from the awesome new features for users of the framework, Rails 2.3 got a lot of love on the inside too. It's no secret it's running on Rack now, and that switch made some of the internal code a lot easier on the eyes. They also added a Rails-internal middleware stack, on which some of the framework's functionality builds already.

When you go to the console and enter

    ActionController::Dispatcher.middleware

you'll get of all the classes and blocks registered in the stack. Even ActiveRecord hooks into the stack to do minor connection cleanup after a request. Coming from the Java world it's pretty much comparable to the good old Servlet filter (I know they were gross, but still kinda cool), code that gets executed before and/or after each request. An application-wide around filter if you will.

If you look through the code of the classes listed here you'll see one common interface which stems from Rack. They all implement a method called `call` which gets only one parameter, and an `initialize` method which gets an application object.

The really cool thing about it is this: Where you had to resign to using the revolting `alias_method_chain` before, you can now just hook into the request chain wherever you want, without modifying the stack with awkward methods that make debugging a pain in the bum.

Now, where does that make run\_later any cooler? Well, it doesn't, but in earlier version I needed to do an awkward thing that only affected development mode, where Rails unloads all classes after each request. run_later runs code in a separate thread, and depending on how long that code runs the classes would be unloaded when they're still accessed from the worker.

In earlier version I turned to, drumroll, `alias_method_chain` for that, now it's nothing but a simple class that hooks into the internal middleware stack, and delays the request until the worker finishes, or until a certain amount of time has passed (default is 10 seconds). I would argue that you just shouldn't run code taking that long using run_later, so it shouldn't be a major issue. Longer-running tasks like these should be run using a slightly more advanced and reliable mechanism.

Anyway, let's have a look at the code:

<script src="http://gist.github.com/83137.js"></script>

The `middleware` is implemented using a simple stack, unsurprisingly called `MiddlewareStack`. There you can hook into the chain of classes pretty much wherever you want. I simply append my class at the end, because I definitely want to run the code before ActionController's Reloader class gets to run and unloads the classes. But you can also specify a specific class where you want to hook into the chain, you can even swap existing handlers with your own. Pretty neat stuff. I'd highly recommend playing with it, in some places providing a filter on  the middleware level makes more sense than putting the code into a controller-based filter.