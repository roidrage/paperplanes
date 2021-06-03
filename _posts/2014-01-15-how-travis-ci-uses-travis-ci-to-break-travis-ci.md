---
title: How Travis CI uses Travis CI to break Travis CI
tags: travisci smallbiz
layout: post
---
This is the essay version of a talk I gave at [Jimdo](http://jimdo.com).

### Out of Business

[Travis CI](https://travis-ci.org) started out as a small platform for Ruby
projects to run their tests on. Back in 2010 and 2011, there was a distinct lack
of hosted continuous integration platforms.

It was launched close to the day, three years ago, with a small announcement.

Some Ruby projects quickly adopted it, Rails started officially moving their
tests to Travis CI.

Later, in 2011, more language communities discovered the platform. We added
official support for PHP, for languages running on the JVM, for Erlang and for
Python.

We now also support Perl, Haskell, and anything you'd possibly want to run on a
Linux platform. Plus, you can build projects on OS X and for iOS.

### Unfinished Business

![](http://s3itch.paperplanes.de/travis_team.jpg_20140115_182717.jpg)

Initially, Travis CI only supported open source projects. But people and
companies kept asking us to use our platform for their private projects as well.

The idea was floated to found a company and turn this into a business, work on
Travis CI full time and get paid to do it.

By the end of 2011, a company was founded, and two more people joined the team.
We were five people trying to build a business, four of them developers.

In early 2012, we started a crowd-funding campaign to bootstrap our business and
allow some folks on the team to be paid for by the company. It allowed us to
keep the open source platform running and to improve our feature set.

One of the features coming out of that was pull request testing, which initially
was done by having a bot comment on pull requests, annoying the heck out of some
people.

### We Mean Business

We started working on [our product](https://travis-ci.com), and we tried to
figure out the hardest part about a product, [the
pricing](https://travis-ci.com/plans).

We started thinking about revenue, all the crazy things you have to do when
building and running a business.

We launched our product into private beta in July 2012 and started charging in
September 2012.

It was all rather hack-ish, and we didn't yet force everyone to sign up for a
paid subscription. All the work involved in getting people to sign up was
manual. We picked out a few customers and emailed them, encouraging them to sign
up and to give us feedback.

### Back in Business

This worked surprisingly well and by the end of 2012, we had more than 100
paying customers, allowing us to pay two on our team some sort of wage. Plus, we
could pay for our infrastructure.

While that didn't imply a raging success, the signs looked right.

Whilst trying to build up our business, we had to solve scaling puzzles already
on our open source platform. This was both blessing and curse.

We were running 7000 builds per day in 2012, compared to 700 in 2011.

In comparison, by the end of 2013, we were running a total of 65000 builds per
day.

Solving these issues upfront on the open source would mean we'd know how to
solve them when they'd come up on our commercial platform. On the downside, we'd
been distracted by these things, rather than being able to focus on the
business.

We were able to break Travis CI early on and see the potential affects of any
fixes before they'd become critical to our business.

As a challenge to ourselves, there's one special ticket that was opened in early 2013.
When our business was in a stable state, we'll be shaving off Sven's mustache.

![](http://s3itch.paperplanes.de/mustache.jpg_20140115_182418.jpg)

### Business Never Personal

For developers, though, business is tough. Figuring out how much to charge, how
to approach customers, how to do customer support (and to understand how
important it is), is something entirely new for most.

It posed a big challenge for us, and it took a while to get everyone behind the
idea that customer support is essential to our business. When it comes to code,
every customers' project is a unique snowflake.

Every project has its own interesting dependencies that can break in the most
curious ways. Complex test suites pose challenges for our platform and for our
infrastructure.

Solving these can be a tough challenge, but talking to customers about them
upfront is what makes them less painful to them.

We spent some time thinking about how we can make Travis CI, how we can surprise
our customers. A friend floated the idea of using coffee as an inspiration.

Initially, we wanted to send thank you notes. But we wanted to add an extra
twist. A friend suggested we could send out bags of coffees to our customers,
combining our passions, and doing something completely unexpected for our
customers.

So far, we only shipped some 300 bags, as we had to take a break to tackle some
issues, but we intend to pick this idea up again.

### Strictly Business

Rather than do strictly business, we wanted to run an open company.

When we have problems that affect our customers and users, we try to be as open
as possible about them. They're annoying, but when explained, people do
understand that scaling issues can pose unforeseen challenges that aren't easy
to solve.

Open operations an unintended marketing channel, if you will. Based on the
openness, people can decide whether they want to buy into the fact that we do
have outages, that we do have issues, or not.

Marketing is an interesting topic, as we technically didn't do any. None that is
directly measurable or where customer growth can be attributed to. Whether
that's a good thing or not, I don't know.

The one business-changing thing we did in 2013 was to finally put up a landing
page for our product and to actively let people try out our platform and allow
them to pay for it.

That's our secret to strictly business.

If you don't give people the opportunity to try out and pay for your product,
how and why would they?

### Business as Usual

When we finally solved our bigger technical challenges to scale out the
platform, we were faced with new challenges: people.

Something every company experiences at some point in its lifetime is to hire
people.

We started hiring a [few more people](https://travis-ci.com/team) in 2013,
people working remotely from the start.

We wanted them to feel like they're a part of the team, like their happiness is
what's most important to us.

This is a tough challenge, and we have yet to figure it out. I'd say we're doing
pretty okay, but there's always room for improvement.

One thing we're trying out currently is support rotation, with everyone on the
team involved, no matter their status. The more everyone on the team knows about
the product, the more eyes we have on ideas to improve it. The more everyone is
exposed to customer issues, the higher the incentive to fix them.

We give people on our team the freedom to do whatever they like, whenever they
like. A happy team with a focus on customer value leads to happy customers and a
healthy business.

That's our ideal.

At the beginning of 2014, we have 700 paying customers. That may not sound like
a lot, but it's close to infinity when you're starting a business from scratch.

We're running a bootstrapped business, we've turned down VC funding multiple
times, and proudly so.

Open source is still at the core of our business and our team.

We believe in the power of building good products with people who are passionate
about them.

Also, there was this:

![](http://s3itch.paperplanes.de/ticketclosed.jpg_20140115_182923.jpg)
