---
layout: post
title: "Why Code Metrics Don't Matter"
topics: bestpractices
---
Code metrics are a nice tool, and they're starting to become popular in the Ruby community. They statically analyze your code, and tell you with the simple power of numbers what's wrong with your code. You can spend ages changing your code to make the numbers look good. Still that doesn't tell your customer anything. He doesn't care about those numbers, he wants to see a finished product.

Why do people come back to metrics then? Not an easy question, and there are many answers:

 * They need an excuse to waste time, to beautify their code so that the metrics approve.
 * Their company has a policy that code must fulfill the strict regiment of the measuring tools.
 * They just love numbers.
 * They need a tool to tell them that they're code looks nice.

That's pretty much it. I haven't found any other real use for them. They're just a waste of time. Everything they tell you is just based on a set of rules, not common sense.

Instead of trying to fix your code to satisfy the code metrics tools, work in pairs. Work together to find code that looks doubtful, that reduces readability, that may increase the risk of bugs.

It will do a lot more for the quality of your code than any tool will ever do. Relying on tools to ensure your code's quality will only cover some deeper-lying problems within your team or organisation.

One thing I explicitly except from this is code coverage. While it's not important to have exactly 100% of your code covered with tests, it's important to have a code coverage tool and your common sense at hand to find code that still requires testing, to get the code that matters under tests. Check out [this post](http://giantrobots.thoughtbot.com/2008/10/22/test-metrics-in-your-rails-app-and-what-they-mean) by the [Thoughtbot](http://www.thoughtbot.com/) guys (who write excellent [testing](http://www.thoughtbot.com/projects/shoulda) [tools](http://www.thoughtbot.com/projects/factory_girl), by the way) on test metrics. All you ever need in my book.

Other code metrics won't tell you anything a trained eye wouldn't see without them. So read code, write code, and try to make it look neat and readable. That's the experience you need.