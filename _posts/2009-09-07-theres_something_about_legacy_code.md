---
layout: post
tags: legacy code
title: There's Something About Legacy Code
---
While [preparing my talk](http://www.slideshare.net/mattmatt/mein-freund-der-legacy-code-1947495) for the [German Rails-Konferenz](http://www.rails-konferenz.de) on legacy code I thought about why we still have to deal with bad code. Why do people still write code that sucks, code that's close to being unmaintainable, code that's so insanely tangled, code that's untested?

The answer might be obvious or not. There's some simple reasons, which is to say that I couldn't come up with any reason that seems like a fair one:

* They just don't care (gasp!)
* They claim they don't have the time to write clean code or to clean up after themselves
* They claim that management forces them to work on new features all the time

I'm sure you'll agree that number one is the worst. Not caring about your code is similar to doing a number two in other people's bathrooms and not flush the toilet. Yes, it's that bad. The other two are just excuses. It's not impossible to argue that tests are necessary or that refactoring is necessary. It's up to you to do your planning accordingly. Don't blame the management, work on it, improve the situation. It's in your hands.

We all wrote our fair share of bad code, I'm sure. I know I did. It's what we do with it, what we learn from it, that's important. We can look at our code a year later to see what we'd do differently today. At least I like doing that. Not so much with really old code, especially with the stuff written in those older, rather nasty languages, though even that can be quite fun. But it's refreshing to come back to what you wrote a while back to either rework it, or just to think about how you'd do it differently some months later, if at all. Maybe your code is perfect, maybe it could need some improvement.

I like that exercise because it fosters rethinking your current code. Maybe you followed a pattern that leads to unclear intentions in your code. There's always a time to rectify that, to clean up, to make the intentions of your code clearer. If you keep doing that exercise over and over again, and not only look at code that's six months old, but code you just wrote, you're halfway there. If you look at if after implementing a new feature as opposed to just looking back at old code, it's not too hard to write good code. Instead you'll notice that it gets hard to write bad code.

You might end up with a similar behaviour as mine. You'll notice a slight sting in the neck whenever you leave a code smell be, whenever you write a line of code without writing a test for it, when you leave a TODO in the code instead of putting the task in your backlog or fixing it right away. I never leave TODOs in the code, they just end up staying there for years. When you have a pair to point out problems, even better, but even practicing the look back at your code will improve its quality over time. You just need to stick to it, keep practicing over and over again until it becomes a mantra. It's sure to make you a better person too, if you need more motivation.

I'm not much of a fan of mantras, and I don't like telling people what to do, but there's things so simple, they should be common sense. Leaving code in a way that its intentions are as clear as possible should be one of them, writing tests with every line of production could should be another. It's up to you.