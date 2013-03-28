---
title: Monitoring for Humans
layout: post
topics: operations monitoring
---
Hi, I'm Mathias, and I'm a developer. Other than a lot of you at this
conference, I'm far from being a monitoring expert. If anything, I'm a user, a
tinkerer of all the great tools we're hearing about at this conference.

I help run a little continuous integration service called Travis CI. For that
purpose I built several home-baked things that help us collect metrics and
trigger alerts.

I want to start with a little story. I spend quality time at coffee shops and I
enjoy peeking over the shoulders of the guy who's roasting coffee beans. Next to
the big roasting machine they commonly have a laptop with pretty graphs showing
how the temperature in the roaster changes over time. On two occasions I found
myself telling them: "Hey cool, I like graphs too!"

On the first occasion I looked at the graph and noticed that it'd update itself
every 2-3 seconds. I mentioned that to the roaster and he said: "Yeah, I'd
really love it if it could update every second." In just two seconds the
temperature in the roaster can already drop by almost a degree (Celsius), so he
was lacking the granularity to get the best insight into his system.

The second roaster did have one second resolution, and I swooned. But I noticed
that every minute or so, he wrote down the current temperature on a sheet of
paper. The first guy had done that too. I was curious why they'd do that. He
told me that he took it as his reference sheet for the next roasting batch. I
asked why he didn't have the data stored in the system. He replied that he
didn't trust it enough, because if it lost the information he wouldn't have a
reference for his next roasting sheet.

He also keeps a set of coffee bean samples around from previous roasts, roasts
where the outcome is known to have resulted in a great roasting result. Even
coffee roasters have confirmation bias, though to be fully fair, when you're new
to the job, any sort of reference can help you move forward.

This was quite curious. They had the technology yet they didn't trust it enough
with their data. But heck, they had one-second resolution and they had the
technology to measure data from live sensors in real time.

During my first jobs as a developer touching infrastructure, five minute
collection intervals and RRDtool graphs were still very much en vogue. My alerts
basically came from Monit throwing unhelpful emails at me stating that some
process just changed from one state to another.

Since my days with Munin a lot has changed. We went through the era of
\#monitoringsucks, which fortunately, quickly turned into the era of
\#monitoringlove. It's been pretty incredible watching this progress as someone
who loves tinkering with new and shiny tools and visualization possibilities.
We've seen the emergence of crazy new visualization ideas, like the horizon
chart, and we've seen the steady rise of using modern web technologies to render
charts, while seeing RRDtool being taken to the next level to visualize time
series data.

New approaches providing incredibly detailed insight into network traffic and
providing stream analysis of time series data have emerged.

One second resolution is what we're all craving, looking at beautiful and
constantly updating charts of 95th percentile values.

And yet, how many of you are still using Nagios?

There are great advances in monitoring at the moment, and I enjoying watching
them as someone who greatly benefits from them.

Yet, I'm worried that all these advances still don't focus enough on the single
thing that's supposed to use them: humans.

There's lots of work going on to solve problems to make monitoring technology
more accessible, yet I feel like we haven't solved the first problem at hand: to
make monitoring something that's easy to get into for people new to the field.

Monitoring still involves a lot of looking at graphs, correlating several
different time series after the fact, and figuring out and checking for
thresholds to trigger alerts. In the end, you still find yourself looking at one
or more graphs trying to figure out what the hell it means.

Tracking metrics has become very popular, thanks to Coda Hale's metrics library,
which inspired a whole slew of libraries for all kinds of languages, and tools
like StatsD, which made it very easy to throw any kind of metric at them and
have it pop up in a system like Graphite, Librato Metrics, Ganglia, etc.

Yet the biggest question that I get every time I talk to someone about
monitoring, in particular people new to the idea, is: "what should I even
monitor?"

With all the tools we have at hand, helping people to find the data that matters
for their systems is still among the biggest hurdles that must be conquered to
  actually make sense of metrics.

Can we do a better job of educating people what they should track, what they
could track, and how they can figure out the most important metrics for their
system? It took us six months to find the single metric that best reflects the
current state of our system. I called it the soul metric, the one metric that
matters most to our users and customers.

We started tracking the time since the last build was started and since the last
build was finished.

On our commercial platform, where customers run builds for their own products
and customer projects, the weekend is very quiet. We only run one tenth of the
number of builds on a Sunday compared to a normal weekday. Sometimes we don't
run any build in 60 minutes. Suddenly checking when a build was last triggered
makes a lot less sense.

Suddenly we're confronted with the issue that we need to look at multiple
metrics in the same context to see if a build should even have been started, as
the fact itself is solely based on a customer pushing code. We're suddenly
looking at measuring the absence of data (no new commits) and correlate it with
data derived from several attributes of the system, like no running builds and
no build request being processed.

The only reasonable solution I could come up with, and it's mostly thanks to
talking to Eric from Papertrail, is if you need to measure something but it
require the existence of an activity, you have to make sure this activity is
generated on a regular basis.

In hindsight, it's so obvious, though it brings up a question: if the thing that
generates the activity fails, does that mean the system isn't working? Is this
worth an alert, is this worth waking someone up for? Certainly not.

This leads to another interesting question: if I need to create activity to
measure it, and if my monitoring system requires me to generate this activity to
be able to put a graph and an alert on it, isn't my monitoring system wrong? Are
all the monitoring systems wrong?

If a coffee roaster doesn't trust his tools enough to give him a consistent
insight into the current, past and future roasting batches, isn't that a weird
mismatch between humans and the system that's supposed to give them the
assurance that they're on the right path?

A roaster still trusts his instincts more than he trusts the data presented to
him. After all, it's all about the resulting coffee bean.

Where does that take us and the current state of monitoring?

We spend an eternity looking at graphs, right after an alert was triggered
because a certain threshold was crossed. Does that alert even mean anything, is
it important right now? It's where a human operator still has to decide if it's
worth the trouble or if they should just ignore the alert.

As much as I enjoy staring at graphs, I'd much rather do something more
important than that.

I'd love for my monitoring system to be able to tell me that something out of
the ordinary is currently happening. It has all the information at hand to make
that decision at least with a reasonable probability.

But much more than that, I'd like our monitoring system to be built for humans,
reducing the barrier of entry for adding monitoring and metrics to an
application and to infrastructure without much hassle. How we'll get there? 

Looking at the current state of monitoring, there's a strong focus on
technology, which is great, because it helps solves bigger issues like data
storage, visualization and presentation, and stream analysis. I'd love to see
this all converge on the single thing that has to make the call in the end: a
human. Helping them make a good decision and getting there should be very high
on our list.

There is a fallacy in this wish though. With more automation comes a cognitive
bias to trust what the system is telling me. Can the data presented to me be
fully trusted? Did the system actually make the right call in sending me an
alert? This is only something a human can figure, just as a coffee roaster needs
to trust his instincts even though the variables for every roast are slightly
different.

We want to avoid for our users having to have a piece of paper around that tells
them exactly what happened the last time this alert was triggered. We want to
make sure they don't have to look at samples of beans at different stages to
find confirmation for the problem at hand. If the end user always looks at
previous samples of data to compare it to the most recent one, the only thing
they'll look for is confirmation.

Lastly, the interfaces of the monitoring tools we work with every day are
designed to be efficient, they're designed to dazzle with visualization, yet
they're still far from being easy to use. If we want everyone in our company to
be able to participate in running a system in production, we have to make sure
the systems we provide them with interfaces that treat them as what they are:
people.

But most importantly, I'd like to see the word spread on monitoring and metrics,
making our user interfaces more accessible and tell the tale of how we monitor
our systems, how other people can monitor their systems. There's a lot to learn
from each other, and I love things like [hangops](http://hangops.com) and
[OpsSchool](http://opsschool.org), they're great starts to get the word out.

Because it's easier to write things down to realize where you are, to figure out
where you want to be.
