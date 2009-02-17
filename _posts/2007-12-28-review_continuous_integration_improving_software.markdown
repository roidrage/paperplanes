---
layout: post
title: "Review: \"Continuous Integration: Improving Software Quality and Reducing Risks\""
topics: books continuousintegration
---
I've been a fan and user of continuous integration for quite a while now, yet I've been keen to pick up the book ["Continuous Integration: Improving Software Quality and Reducing Risk"](http://www.informit.com/title/0321336380) by Paul M. Duvall et. al. to see, if it can live up to be the first book dealing exclusively with the topic. They don't have to sell me on the idea anymore, but still, there's always something to learn.

The book is separated into two parts. The first one introduces the basic principles of continuous integration, and how it could/should work for you and your project. For me, this is the valuable part of the book. It introduces what CI can do for you, and the practices usually surrounding a project using CI are. If you didn't know that CI is more than just using CruiseControl or a similar CI server, I suggest you go out and pick up this book right away.

The second part describes five parts of a continuous integration system in detail. It deals with database integration, testing, inspection, deployment and feedback. A collection of recipes accompany each section to help you structure your project, code, configurations to make continuous integration a "non-event", as Martin Fowler put it.

Just as it should, the book emphasizes the importance of a good test suite to really find value in continuous integration. Without each other, continuous integration and testing can't unfold their full potential. The book is full of examples including configurations, code and build scripts, so you're not left standing in the rain, wondering how you can get that continuous integration magic to work for you.

Though I wouldn't say I'm the target audience for it, I still think there's a lot to learn from this book. Say, you just read Martin Fowler's [original essay on the topic](http://martinfowler.com/articles/continuousIntegration.html) (which you should, anyway), and want to get more into detail, this book is for you. You'll find a good reference that'll help you introduce continuous integration into your project step by step.

The book focuses a lot on Java and its tools for examples, but you can easily apply the techniques in similar ways for, say Ruby/Rails projects or any other language. Database integration luckily is a topic you don't have to worry about that much in Rails projects.

It ends with a nice collection of tools that can be used for or with continuous integration, and an evaluation of CI servers and automated build tools.
 
My main gripe with this books is that when it comes to whys the book falls short from time to time. For someone who can make her own conclusions this shouldn't be a problem, but I think there would've been more in it. Two examples:

 * The book uses short dialogues to explain how a specific technique would work in a team, or how a line of reasoning could come about. In my opinion they're too short. What they want to emphasize could've just as well been written in a paragraph and would've had the same result. They're missing a bigger picture, and personally, I never had conversations like that.

 * The book states on two occasions that continuous integration should happen on the baseline of your project, and seems to imply that using it on branches is not a good idea. Why that is the case it doesn't explain. That the mainline is always the integration point of a project is pretty clear, but why that doesn't mean you can't integrate important branches remains unclear.

What struck me as odd was the constant mentioning of code inspection as part of continuous integration. I value code metrics for what they are (in fact, I used to be a big fan of them), and for what they can tell you about your code base, especially code coverage, but I have mixed feelings about including all of them in an integration build, because I have seen what time waster code metrics can be. But that might just be a matter of personal experience.

All that said, I still think this book is well worth the money, if you want to see what continuous integration can do for you and your project, and how you can apply the principles to your team. Paul M. Duvall did a great job compiling his experiences of applying and using continuous integrations, most of which I also had in one way or the other. In any way, I suggest reading Fowler's article firsthand, since it will give you a big picture about continuous integration, and then you can delve into the glory details with Duvall's book.

The book also has an accompanying [website](http://www.integratebutton.com/), where you can find a growing stack of videos explaining a lot of the principles of continuous integration in practice. If you're living in Germany, the book is currently on sale at [Lehmanns](http://www.lob.de/cgi-bin/work/outputexpert?id=4774dd934fffb&frame=yes&flag=new&menupic=yes&stich1=0321336380).

Still a classic on the topic is Mike Clark's ["Pragmatic Project Automation"](http://www.pragprog.com/titles/auto), one of the first books by the Pragmatic Programmers and, though slightly outdated, still a good reference. This book got me hooked onto the ideas of continuous integration and push-button builds in the first place.