---
layout: post
title: "Why Refactoring Matters"
topics: bestpractices refactoring
---
It's hard to believe, but for some people it still doesn't. I've heard something along the lines of "The refactoring is done, now we can code again" or "I can't refactor that code right now, I'll just add a little code here and be done with it" far too often over the last months and years. The irrational but persistent thought that refactoring is a once-in-a-product-lifecycle activity is an annoyingly sticky idiom. Refactoring is not a one time thing, it is (or at least should be) an important part of your development process, equally important as coding and testing.

Granted, it's not easy to sell a refactoring, and it very likely won't work to bring a project to a full stop every once in a while to clean up the mess that gathered over the last few months. And most of the time it's not the way to go. Refactoring is in iterative process, something that is constantly needed and should be done as needed. But it's still something that lots of people don't realize.

If it's not done, controllers will grow, replication will crawl in, code will become less and less readable, and therefore understandable. Hence it'll take more time to add features, to fix bugs, and to bring new team members up to speed. The worst thing of it all is that once code bloat creeps into your project, things will only get worse. If one part of it is broken or bloated, people will just start adding more code, introduce more bloat, more bugs, and more complexity. The code will smell really bad really quickly. Everyone will notice it, but most of the people just will get used to the smell and ignore it.

If you don't fix these [broken windows](http://en.wikipedia.org/wiki/Fixing_Broken_Windows) on a regular basis, soon your whole project will be full of them. And let me tell you looking at these broken windows, and being the one having to fix them is not a very satisfying job. It's an experience you can do once, but if you're constantly cleaning up after others, it's just frustrating.

The cost of not doing refactoring only becomes obvious after a while, but sometimes even not at all. Though the latter will very likely only happen when you actually make refactoring a part of your development lifecycle.

Only if you don't do it will it take longer to work with the code, and will in the end cost you more than a comparably (if not exactly squeaky) clean code base. Productivity of your development will decrease more and more over time.

But refactoring is not only something that's sometimes misunderstood by management, developers still forget the most important thing of it all, to clean up after themselves. Code a little, test a little, refactor a little. That should be the daily mantra. Never stop refactoring your code, otherwise you'll have to fix a lot of broken windows sooner than you think.