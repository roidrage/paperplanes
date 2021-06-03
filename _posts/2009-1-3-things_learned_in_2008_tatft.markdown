---
layout: post
title: "Things Learned in 2008: TATFT"
tags: miscellany
---
All right, so I didn't exactly learn that testing all the fucking time is effing important over the last 12 months, it's become clearer and clearer ever since I was first introduced to JUnit. But it did become crystal clear to me how important it really is. I've worked with a lot of legacy code, I've refactored a lot of it into more reasonable and manageable slices, and I've thrown a fresh set of tests at them. I swore at it, I cursed it, but in the end I was very satisfied with the result. The more code I worked with that wasn't covered by a decent test suite the clearer the picture of always testing became to me.

Testing is an art, and it takes a long time to master it, it's hard, it's fun, it's maddening, it's sometimes a time-consuming process, but in all, it's easy to start. Just write a test. For me there's nothing that was worth investing more time than testing.

It needs to hurt when you're touching code without tests, it needs to hurt when you're writing code without tests. When you get a funny feeling, and you find yourself writing a line of code without first writing a test for it, then you're on your way to testing-zen.

### Mocking

When you start looking deeper into RSpec, you're bound to come across mocking as a wicked tool for testing. I've had my fun with it, but my lesson at the end of the year is to avoid it as much as I can. Mocks are mocking you. I much prefer a simple setup of real objects instead of relying on mocks and stubs, even if they hit the database.

Mocks are making testing simple, but they also make life a little too easy. You're relying on something that's just not realistic. Your application needs to hit the database, whether you like it or not.

I'd highly recommend checking out ["Testing Heresies"](http://rubyconf2008.confreaks.com/testing-heresies.html) and ["Writing Code That Doesn't Suck"](http://rubyconf2008.confreaks.com/writing-code-that-doesnt-suck.html), both talks from last year's RubyConf. Maybe they'll help you understand why I changed my mind about mocks.

### Enterprisey Rails

Oh, how I love that E-word. For a while now the question whether Rails is ready for the Enterprise was not a question anymore, at least for me. The real question is: Is the Enterprise ready for Rails?

Anyway, I learned a lot about scaling a big Rails application with all nuts and bolts. It was both incredibly satisfying and frustrating. There's been so many things involved, the most important tools has become asynchronous processing. No better way to take some load of your application and to reduce response time when it comes to longer-running tasks.

I've played with ActiveMessaging, but these days I'm more up for writing my own background processes with either delayed_job or just simply the daemon gem.

### Clarity over Magic

I've learned more and more about the depths of Ruby meta-programming, and as much as I like it, I like to avoid it as much as I can. People tend to fall back to using them way too fast instead of just writing the code they originally intended to write. It's fun to play with, it's a nice tool to have, but it's like the light of E&auml;rendil. It's supposed to guide you to find a way out of the darkest corner of your code base.

I just like to write code that's concise and reveals what it does at first sight.

### Plugins are Evil

I'm amazed how quickly people crank out a plugin when they believe they're seeing something that'd be worth moving out of the application's code base. The unavoidable urge to abstract always seems to end in either meta-magic or a new plugin.

Ever heard of the folder `lib` in your application? Right, that's where you can put stuff too. It will be easier to test, therefore easier to integrate in your continuous integration system, and easier to find. Glad we got that out of the way.

Here's to more fun with Rails in 2009!