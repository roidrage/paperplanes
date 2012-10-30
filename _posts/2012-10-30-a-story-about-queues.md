---
title: A Story About Queues in Four Acts
layout: post
topics: messaging queues
---
There are queues everywhere. This is the story of a few of them. The names of the
queues are made up, but their story is real nonetheless.

### First Act

The first queue, we'll call it Unicorn, handles requests for information,
rendering the result in a beautiful markup language that's easy to read. It sits
in front of the public library building, waits for people to come in and ask for
information.

Unicorn has a fixed number of peasants at its disposal to do work for it. When a
request comes in, it sends one of them into the library to fetch the
information. Peasants have access to a pretty big amount of data to choose from,
but they have to be quick.

If one of them takes too long to fetch the information, Unicorn denies the
request for information and strips the peasant of its duties on the spot,
putting a new one in its place.

Unicorn is not very fail-safe though. It trades off not being able to deliver
information in time for being swarmed by requests and not being able to handle
them.

It also isn't very good at determining that every new peasant takes to long and
to stop processing requests. It just keeps accepting them even if all of them
time out.

Maybe it'd be smarter if Unicorn could be more aware of an increased number of
information requests not returning the data in time and slow down processing or
halt it altogether to figure out what the problem is?

### Second Act

The second queue, we'll call it Octocat, handles requests from people to build
something, say, a house, or a shack or a shelter, sometimes even a blue
bikeshed.

To figure out what needs to be done, Octocat looks at the request's details, to
determine what materials are required and which builder needs to be allocated to
get the job done.

In some cases, Octocat sends a request to the warehouse to see if they have the
required material in stock. Because the warehouse doesn't have a means to send a
messenger back to Octocat, it's a fully automated system, it calls a hotline to
check the status. It listens to Rick Astley while it's on hold, waiting for the
system to get back to it.

Sometimes, there's a problem in the warehouse and Octocat is stuck for a long
time, and it can't process any other requests in the meantime. It doesn't want
to miss the system getting back to it, so all its focus is on this one build
request.

To speed things up a little, the Octocat hired a second person. But now both of
them are stuck in a waiting loop with the warehouse, not being able to process
more build requests. No matter how many people Octocat's companies would hire,
at some point all of them will be stuck on hold, all of them listening to Rick
Astley.

Wouldn't it be better if, when the Octocat is waiting for the warehouse, it
presses # to cancel the request, hangs up the phone and process another request
in the meantime? It could just retry five minutes later to see if the system is
now able to process the request.

As time passes, it can just increase the waiting time between calls, as it gets
less and less likely that the warehouse will be able to process the request this
time around.

Or it could put the current request to the end of the queue, and come back to it
later, trying to go through the process again at a later point in the day. Maybe
the warehouse just has a problems finding information on this particular
material, and other requests that don't require it will work out just fine.

If the warehouse is unable to process an increased number of requests, maybe
Octocat should just cease calls altogether to give the warehouses' employees
time to clear things up and to process what has piled up in their inbox.

### Third Act

The third queue processes long texts that were, for efficiency reasons, split up
into smaller chunks. They're usually send in Morse code for bandwidth
efficiency, ready to be turned back into texts.

We'll call it Logger. Logger has strict requirements to process the chunks. He
needs to put them back together very quickly, otherwise the readers on the other
side will be unhappy, waiting for new text to appear. They're fast readers, so
Logger has to make sure he delivers in a timely fashion.

The queue has to go through a lot of text, and it has to make sure that it
processes it in the correct order. Otherwise the text wouldn't make sense
anymore, things putting context out of.

Logger relies on strict ordering of the messages it processes. It relies on
several minions to put the texts back together after they were processed. To
make sure ordering is properly applied, one minion always processes chunks from
a specific text.

Logger uses the text's title to figure out which minion is responsible. This has
the advantage that Logger can call in more minions as more texts are coming in.
As titles vary pretty wildly, Logger can just assume that work will be
distributed efficiently enough. Of course there's still the chance that one
minion gets a lot of longer texts, compared to the others, but overall, it
should be fine.

There is one downside to this system. Logger has to know the exact number of
minions upfront. If one of them calls in sick, he has to find a replacement
quickly, so that work on this minion's desk doesn't pile up.

If he can't find a replacement quickly, he has to reassign all the numbers and
redistribute the work on their desks, which is a very dreadful process.

What if Logger could group minions so that they form subdivisions, each
controlled by a supervisor of their own, who in turn distributes the work on his
team of minions.

With little groups, he can rely on the supervisor to increase and decrease the
number of minions as needed. Logger would be oblivious to their shift schedule.

To split up the work more efficiently, Logger could also rely on the first
letter of the title, splitting the alphabet into smaller sub-alphabets, e.g.
A-E, F-M, and so on. He assigns the ranges directly to groups, and he can, as
groups come and go for their shifts, quickly reallocate ranges of letters to new
groups. That still means that work has to be distributed, but Logger adds a
group of messengers to the process that can shift stacks of texts quickly from
one group to the other.

If one group for some reason becomes unavailable, Logger could just adapt the
way he schedules work and burden another team with its range. That might overall
be a bit slower, but work would still be spread out evenly across the remaining
groups.

Logger still has to make sure that all groups are on the same floor though, so
that the messengers don't have to climb stairs to lengthen the latency of
redistributing the texts.

If Logger wasn't bound to having to process texts with very low latency, he
could even consider placing groups in different buildings. If a fire breaks out
in one of them, the other groups could still continue processing.

### Fourth Act

The fourth queue is a builder, we'll call it Bob. Bob builds garages, houses and
lots other things.

Bob is a sloppy builder though. He breaks things a lot, leaving windows broken,
plaster with holes and floors uncleaned. Sometimes he even forgets to put a tile
in, so that it leaves an empty area on the wall. Or he drops one of his tools on
the floor, leaving a dent in the wood.

He tends to not be too careful and just assumes that everything he does turns
out right. He pours concrete when it's raining, he leaves

Bob needs to get a grip and make sure his tasks are processed correctly. How
could he do that?

Instead of ignoring mistakes, he could learn to accept them and take the
appropriate measures to make sure he cleans up. If he notices that he breaks
things to often, he could slow down his work and make sure he gets it right. Or
he could go out for a coffee and come back when he's a bit more confident that
he'll get the job right.

If things are really bad, he can even start from scratch, to make sure the end
result is good. That might mean that processing can slow down, but that Bob is
aware of his own failures. His mindset would change to making sure he gets the
task right instead of leaving a mess everywhere he goes.

Bob's customers would be a lot happier if he did. It'd cost him more resources
but he'd make a lot of people much happier, leaving every place he's worked on
clean.

### Queues, queues everywhere!

What have all the queues in this story in common? They fail to exponentially back
off when they encounter errors in processing requests. They fail to make sure to
not lose messages when processing them failed. They fail to retry when
delivering a message has failed. They fail to make sure their processing is
idempotent. They assume that the resources required for processing the messages
are always available.

There are queues everywhere. They have a tendency to cause problems when being
used. We just assume they work all the time, and we just assume that we're able
to process everything they throw at us in a timely fashion?

We do have the best of intentions, but they usually turn out wrong. When a queue
starts to become the central backbone of a system, careful steps need to be
taken that the system can handle backpressure, increased failure rates, and the
queue itself being unavailable.

Maybe we should start building our queues and the processes around it with the
worst in mind and adjust our thinking accordingly? It's not queues, queues
everywhere. It's failures, failures everywhere! Queues have a tendency to
intensify failures by adding a less predictable element to our infrastructure.
As [Rick Branson put
it](https://twitter.com/rbranson/statuses/261139185694568449):

> "Keeping distributed systems running smoothly seems to be mostly about
> figuring out ways to not DDoS yourself."

A queue is a lot of fun until you're unable to keep up with what it's throwing
at you, until your database's capacity doesn't match that of the queue, until
you drop messages on the floor just because something broke in the backend, or
until it floods your system with so many messages it can't process anything else
in the meantime.

Maybe you already knew all of that, but I sure as heck had to learn all of these
lessons above [the hard
way](http://about.travis-ci.org/blog/2012-09-05-on-yesterdays-log-outage/), in a
[very small amount of
time](http://about.travis-ci.org/blog/2012-09-24-post-mortem-pull-request-unavailability/),
within a [matter of
weeks](http://about.travis-ci.org/blog/2012-09-13-an-update-on-the-sites-availability/),
to be exact.

We're still working on picking up the pieces and cleaning up. There'll be less
queues in the future, just as there will be a lot more of them. More on this
soon!

The queue is dead, long live the queue!
