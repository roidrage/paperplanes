---
title: A Short Story on Human Error
layout: post
tags: operations humanerror
---
A few weeks back I came across a post that struck home in several ways. ["How I
Fired myself"](https://web.archive.org/web/20130302005214/http://edu.mkrecny.com/thoughts/how-i-fired-myself) (cached version) is a short
story of a developer who accidentally deleted the entire users table in
production while working on a new feature. You should read the whole thing, go
ahead, I'll wait for you.

What struck home was not just that he accidentally deleted data from the
production database. I certainly did similar things, accidentally removing data,
setting MySQL options at runtime that caused the whole process to crash, amongst
other things.

The thing that really struck me was the story that unfolded after the incident.
I came across the article just when I was reading Sidney Dekker's ["The Field
Guide to Human Error"](http://amzn.to/19IxbP4), a fascinating read, if I may
add.

If you look at what happened after the incident, it's clear that everyone blames
him, as if he had the malicious intent to just delete the whole table and cause
unhappiness. His boss accuses him of potentially having lost the company millions,
putting aside the possibility that he's helped make these millions too, and that
he very likely didn't come in to work that day and lose a few of the company's
millions.

This kind of reprimanding and the pressure from the team is what eventually
caused this poor guy to quit his job. Which is a shame, because there is a lot
more to this incident than meets the eye.

Nassim Taleb points out in ["The Black Swan"](http://amzn.to/19CvJvW): "we are
explanation-seeking animals who tend to think that everything has an
identifiable cause and grab the most apparent one as the explanation."

We're quick to blame the human who seemingly caused accidents or deleted data from
the production database. But that misses out on learning a bigger lesson,
learning and improving the organization around the human.

As Scott Snook put it in ["Friendly Fire"](http://amzn.to/15bQMAj), "look beyond
individual error by framing puzzling behavior in complex organizations as
individuals struggling to make sense."

There are two things that jump out when reading the text. The first is the fact
that he's testing his local code against the production database, with full
access to creating and removing data.

Add to that the fact that backups for the production database had been disabled
(by someone in the company) two months before the incident. Let's look at them
in more detail.

### Testing against the production database

You could start arguing right away that this developer has been irresponsible
testing his local code against the production database.

But if you reframe it to look at the bigger picture, the question emerges of why
an organization whose data is worth millions lets developers test their local
codes against the production database in the first place?

It is not uncommon for young startups to start out like this. It's just much
easier and during startup crunch time, any means is acceptable that helps the
team move and ship faster, even if there's a slight risk involved.

But, the longer the team continues to work in a mode like this, the more it gets
used to testing against production data, removing and recreating data as needed.
It becomes accepted practice. Every day that passes without any incident makes
people more confident that they can continue to do what they've done for months
or maybe even years.

In ["Friendly Fire"](http://amzn.to/15bQMAj), Snook introduces the concept of
practical drift, "the slow steady uncoupling of practice from written
procedure."

While there may not have been a written procedure that said to not develop
against the production database, I was still reminded of this story. The team
drifted into the conception that they can continue to do what they've done for a
while without any issues.

What's more interesting to ask for is why the organization didn't encourage for
developers to work in their own sandboxes or at least on a staging system where
they can't harm the valuable production data.

Asking for the why will very likely get you to more puzzle pieces that need to
be questioned. Pieces that just happened came together in this one occasion to
cause lots of harm to the business. While no one saw this coming, there was
always a non-zero chance that it could happen.

In this case, it's very likely the organization that hasn't allowed the
development or operations teams to set up proper environments for developers.
Just like the bosses reprimanded the poor guy, they possibly didn't feel there's
enough time or money around to invest in a proper development environment.

In a similar vein, another question could be why the developers had full access
to the production database. Why were there no procedures in place that were
required to delete data on the production database? You can keep going, and you
will uncover more details that all came together to help trigger this one
accident.

### Database backups disabled

Deleting data is not something that's done every day, but incidents where data
gets accidentally removed during a normal maintenance are not unheard of.
There's always a possibility for this to happen, even during normal operations.
Just think of the [Amazon Elastic Load Balancer outage last
Christmas](https://aws.amazon.com/message/680587/).

What really screamed out at me was that someone in the company had cancelled the
automated database backups, without any automated means set up to take their
place.

Think about it, data that's supposedly worth millions has not been backed up for
two months.

Was it this developer's fault that the normal safety net for any database
operation wasn't in place? Highly unlikely.

We're again looking at an issue in the wider organization this guy was working
in. The obvious question is: why was it cancelled in the first place? Was it
because it was deemed to expensive? Was operations working on a replacement that
was less costly but never got around to deploying it because there were more
pressing issues that needed to be handled?

I found all this utterly fascinating, and I wanted to sit down with everyone
involved to figure out why all these things were the way they were, and how they
could come together in this one occasion to cause harm to the entire
organization.

But most importantly, what this organization can learn to improve so that an
issue under similar circumstances can be made less likely. Note that I didn't
say to prevent these accidents from happening again. They will happen again, the
real question is how the entire organization will handle the next one.

### There is no single root cause

If you look at the things that came together to form this single incident,
you'll notice that it wasn't just one little thing that caused it. It wasn't the
developer who just so happened to delete the wrong table.

It was a number of causes that came together to strike hard, all of them very
likely to be bigger issues inside the organization rather than a problem with
the individual. Again, quoting from ["The Black Swan"](http://amzn.to/19CvJvW):
"a small input in a complex system can lead to nonrandom large results,
depending on very special conditions."

The further back you go in time, the more reasons you'll find that there's a
tangled web of lots of little causes, that again have their own causes, that
just so happened to come together seemingly random to form this event that no
one saw coming. But "while in theory randomness is an intrinsic property, in
practice, randomness is incomplete information, what I called opacity" (["The
Black Swan"](http://amzn.to/19CvJvW)).

The important take-away, which is framed nicely by this little story, [each
little thing is necessary, but only jointly are they
sufficient.](http://www.kitchensoap.com/2012/02/10/each-necessary-but-only-jointly-sufficient/).

Every failure is an opportunity to learn, to improve how you run your business.
Wouldn't it be a waste to ignore this invaluable insight?
