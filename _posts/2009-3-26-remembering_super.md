---
layout: post
title: Remembering super
tags: ruby
---
Yehuda Katz recently wrote a [post](http://yehudakatz.com/2009/03/06/alias_method_chain-in-models/) about good old `super`, probably one of the most underused keywords in Ruby, sadly enough. What can I say, it hit right home. It pretty much nailed what's wrong with `alias_method_chain`, and pretty much put in words how I felt about it too. It helped to explain why I get a weird feeling in my stomach when I see how plugins like authlogic implement some of their functionality. To sum up: it just feels wrong.

If you don't remember, super is what will call a previously overwritten method in the class chain. The cool thing is that this chain also includes any module that got included in another class or module.

So what does that mean? It means that e.g. ActiveRecord can through out its current approach of hooking things in using `alias_method_chain` and make life a lot easier by just using super. Neat, huh?

When I wrote the Capistrano extension to extend it to support parallel execution of arbitrary tasks, I started out re-opening the existing classes and modules of Capistrano, and with aliasing some of the existing methods. That was nice as long as I ran e.g. my tests from inside the Capistrano source. When I wanted to move it into a separate project, things got ugly, depending on the order in which my and Capistrano's source files were loaded. They just overwrote each other's methods. No surprise here, but it made me rethink the strategy.

I ended up moving the extension for each class into a separate module, using a different namespace called `Extensions`, and finally just included the modules in Capistrano's class `Configuration`, where all the magic happens. Where I referenced overwritten methods I just used `super`. The code in question now looks like this:

<script src="http://gist.github.com/83496.js"></script>

In my opinion a lot nicer to read than the previous version using `alias_method_chain`. But that's just me. Some libraries prefer to go overboard instead of using what's obvious. I would mention inherited\_resource again, but that would be two times in a row.

It's weird that after some time you pretty much rediscover what is still so natural in other object-oriented methods. Using aliases is cool, but I prefer to avoid them, especially when the other option is to use simple inheritance mechanism. After all, Ruby is an object-oriented language.