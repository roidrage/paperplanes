---
title: Is Practical Drift Inevitable?
topics: ops humanfactors
layout: post
---
I've been reading ["Thinking, Fast and Slow"](http://amzn.to/1dktFuE), which is an interesting exploration of how the mind works. The book introduces two systems that make up how we think.

One is fast and intuitive, it's effortless to use. It monitors our surroundings, processes data, finds possible correlations, letting us draw quick conclusions.

The other is slow and requires effort to work with. It's the one that empathy requires us to use, for instance. When we need to really think about a problem, contemplate something another person tells us, this system is being used.

Two quotes in the book struck out at me:

> A reliable way to make people believe in falsehoods is frequent repetition, because familiarity is not easily distinguished from truth.

This one as well:

> When uncertain, System 1 bets on an answer, and the bets are guided by experience. The rules of the betting are intelligent: recent events and the current context have the most weight in determining an interpretation. When no recent event comes to mind, more distant memories govern.

Here's the last one:

> The confirmatory bias of System 1 favors uncritical acceptance of suggestions and exaggeration of the likelihood of extreme and improbable events.

I've been contemplating how this explains our behaviour in stressful situations in particular, during a production outage, for instance.

The three quotes play quite well together, and they do make sense if you're familiar with handling an outage situation.

When something is broken, we tend to look at metrics and logs first to find something that strikes out at us, unusual patterns. We look for patterns that match previous experiences, and if we see any of those patterns, we tend to be quick to draw conclusions based on the patterns and the previous experiences. 

Confirmation bias is the name for this phenomenon, presenting an interesting challenge for more than handling production outages. Given that System 1 is the one that drives our initial impressions of any situation, it seems impossible to overcome.

Another quote from the book:

> System 1 is highly adept in one form of thinking — it automatically and effortlessly identifies causal connections between events, sometimes even when the connection is spurious.

Sometimes we come across scenarios that we find an explanation for, but it may not even be the correct one. When we run into this scenario again, drawing the same conclusion requires less and less effort, as our system 1 is quick to recognize the pattern and give us a solution, even if it's the wrong one.

Repetition of events and our own conclusions, as false as they may be, only ends up to us believing the falsehood even more. 

> Your beliefs, and even your emotional attitude, may change (at least a little) when you learn that the risk of an activity you disliked is smaller than you thought.

When you put these things together, they can form a provoking thought. I've been writing about [practical drift](/2014/3/24/assessing-risk-in-socio-technical-systems.html) recently. According to Scott Snook in ["Friendly Fire"](http://amzn.to/1no5ySl), practical drift is *the slow steady uncoupling of practice from written procedure.*

Suppose you run into an incident you haven't seen before. It's been an unknown risk until then, and in turn, you didn't know what the potential consequences were, or you misjudged the risk of this particular scenario.

It did happen, the incident had a certain impact, and you learned some of the contributing factors and signals that helped you identify the problem. They're now your freshest memory of a recent incident.

The next incident with similar signals is sure to guide you into a similar direction, as that's the influence of the System 1.

As these issues continue to come up, possibly untreated, unfixed, you and your organization get used to the signals and the incident itself. There's now an unwritten procedure on how to handle this particular situation. In the worst case, someone gets an alert, ignores it, thinking "It'll clear."

This is where you slowly and collectively drift away from your initial assumption that this kind of incident is risky. System 1 continues to help you to identify the patterns and come up with the solution. It worked the last time, right?

It's fascinating that, when you look at practical drift from this perspective, it seems inevitable.
