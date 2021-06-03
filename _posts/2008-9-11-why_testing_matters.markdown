---
layout: post
title: "Why Testing Matters"
tags: testing
---
Sometimes it's easy to forget, just how important testing has become in the development lifecycle. I recently had to remind myself and others that there are no reasonable excuses not to write tests. I would go as far as saying you're jeopardizing the quality of your software, just because you had no time, were pushed by management, or were just plain lazy.

To some extent I blame Rails for the lack of proper testing in projects using it. It's just too easy to add a new feature here, a line of code there, and hit reload. Works, right? After all, lots of projects have been developed that way.

But for me, there are no excuses. Even though I didn't learn anything about testing at the university, the advantages became crystal clear as soon as I had first contact with JUnit. The ease of writing tests for your applications for me was the killer feature in Rails. It was what attracted me to it in the first place. Writing tests for model, controller, and the whole app? Come on, how painful was (is?) that in the Java world (where I came from, by the way)?

Fret not, I've been falling into the trap of not writing tests for an easy two, three lines of code every now and then. I pretty much agree with [Jay Fields](http://blog.jayfields.com/), when he says that 100% test coverage is just not something you should try to achieve under any circumstances. But when you find yourself writing action after action, method after method, without writing a single test, it's time to step back and look at the repercussions.

I recently wrote a method that required a slightly more complex setup of objects than usual. It took me a full day to test all the possibilities, and to write the code (about 10 lines). I used [factory_girl](http://giantrobots.thoughtbot.com/2008/6/6/waiting-for-a-factory-girl) to build the test setup (pretty awesome by the way), wrote down the required collaborators, and what the method was supposed to do.

One day might seem like a long time, and it usually doesn't take that long, but that piece of code was crucial to ensuring data consistency. Without data consistency, your application becomes fragile, you end up with a database full of dangling references, or your application just ends up in an invalid state and blows up. Worst case scenario of course, but depending on the part of your application, it might just happen.

I didn't want to take that risk, so I took the time, and I felt much better having these tests in place, when I finally finished it. I also got a taste of factory_girl's code and [Shoulda](http://www.thoughtbot.com/projects/shoulda), so it was worth it.

Ensuring your code works isn't the only benefit you get. Sooner or later, code needs to be refactored. In my experience, it's a lot harder with untested code. Not only because you don't know, if the code still works after you're done. But because untested code usually ends up being a tangled piece of code glued together bit by bit and over time into something that you just don't want to touch anymore. It just doesn't feel right to change something. And it shouldn't. That's what testing is about. It should make you feel uncomfortable to not have any tests in place for the code you're working on.

With tests in place, refactoring and taking care of legacy code is a piece of cake. You can focus on the task at hand, and stop worrying about if the code will still work. You'll know immediately.

Why should that matter to you? After all, you're building fresh and shiny Rails applications. The plain truth is, every line of code turns into legacy code as soon as you write it, check it in, and put it in production. Someone will have to take care of it at some point, if not you then someone else. If it's you, you're likely going to ask yourself "What the heck was I thinking writing that code?" Look at the tests, and you'll know. If you know a better way to do it, you can just rewrite it, and rest assured that it still works.

It's sometimes hard to explain the business benefit to someone in a management position. Sometimes it makes me wonder why there's still a need to argue about it. But there's still millions of projects working their way onto the surface without a decent test suite.

If you're working on one of them, I advise you to step back for a moment and ask yourself why you're not writing test cases. I bet you can't find any reasonable explanation, because there simply is none. I know, I know, there are always some parts which are harder to test, but there are always ways to get tests into place, and then untangle them. See Michael Feathers' most excellent ["Working Effectively with Legacy Code"](http://www.paperplanes.de/archives/2008/2/28/review_working_effectively_with_legacy/) for more detail on that topic.

It doesn't matter what framework you use. RSpec, Test::Unit, Shoulda, xUnit, anything works that will help you ensure your application is working as it should. As long as you don't use any of them there's a good chance it might just not work at all.