---
title: Building an Infrastructure Service on Top of Infrastructure Services
topics: infrastructure, ops
layout: post
---
For the last two years, I've been working on [Travis CI](https://travis-ci.com),
a hosted continuous integration and deployment platform. It first started out as
a [free service for open source projects](https://travis-ci.org) on GitHub, but
has since then evolved into a [hosted product for private
projects](https://travis-ci.com) as well.

The fascinating bit for me was, right from the start, that the entire platform,
inarguably an infrastructure product, is built and runs on top of other
infrastructure products.

Travis CI, for the most part, runs on infrastructure managed and operated by
other people.

Most of the code runs on Heroku, our RabbitMQ is hosted by
[CloudAMQP](http://www.cloudamqp.com), our database is run by [Heroku
Postgres](https://postgres.heroku.com), our build servers are managed by [Blue
Box](http://bluebox.net), our logs go into
[Papertrail](https://papertrailapp.com), our metrics to
[Librato](https://www.librato.com), our alerts come from
[OpsGenie](http://www.opsgenie.com), our status page is hosted on
[StatusPage.io](http://statuspage.io), even our Chef server, the one bit that we
use to customize some of our servers, [is hosted](http://getchef.com).

In a recent [Hangops](http://www.youtube.com/watch?v=EU-D-8EBbCM), we talked
about buying vs. building infrastructure. I thought it's well worth elaborating
more on these things, why we went on to build Travis CI on top of other
infrastructure products rather than build and automate these things ourselves.

### Operation Expenses vs. Time Spent Building

The most obvious reason why you'd want to buy rather than build is to **save
time**.

In a young company trying to build out a product, anything that saves you time
but adds value is worth paying for.

You can build anything, if you have the time to do it.

This is an important trade-off. You're spending money, possibly on a monthly
basis to use a service rather than spend the time building it yourself.

A status page is a classic example. Surely it should be doable to build it
myself in just a few days, yes?

But then, to be really useful, your custom status page needs an API, for easy
interaction with your Hubot. Maybe you also want a way to integrate metrics from
external sources, and you want it to include things like scheduled maintenances.

On top of that, (hopefully) a pretty user interface.

That's the better of two weeks, if not more than that. On top of that, you need
to run it in production too. It's one more distraction from running your core
product.

Other people may be able to do this a lot better than you. They help you free up
time to work on things that are relevant to your products and your customers.

In return, you pay a monthly fee.

Surely, you say, building it yourself is practically free compared to a monthly
fee, isn't it?

**Your time is very valuable**. It's more valuable spent on your own product
rather than build other things around it.

The problem with time spent building things is that you can't put a number on
it. You're basically comparing a monthly fee to what looks like a big fat zero.
Because heck, you built it yourself, it didn't cost anything.

This is the classic tradeoff of using paid services. You could very well build
it yourself, but you could also spend your time on other things. You could also
use and run an open source solution, but that too needs to be maintained,
operated and upgraded.

If this sounds one-sided, that's unintentional. I have a history of building
things myself, racking my own servers, provisiong them myself.

But there are things to keep in mind when it comes to spending time building
things. There's a non-zero cost attached to this, it's just not visible as the
monthly invoice you're getting from a service. That cost is hard to fathom as
it's hard to put a numeric value on the time spent building it.

When you have the resources and can afford to, it makes sense to start pulling
things in-house.

For us, not having to take care of a big chunk of our infrastructure ourselves
is a big benefit, allowing us to focus on the more relevant bits.

But letting other folks run core parts of your infrastructure doesn't come
without risks either.

### Risks of Downtime and Maintenance

When you buy into the idea of someone else maintaining more or less vital parts
of your infrastructure, there's a risk involved.

**You're bound to any problems they might have** with their infrastructure, with
their code. In multi-tenant systems, any operational issues tend to ripple
through the system and affect several customers rather than just one.

You're also bound to their maintenance schedules. Amazon's RDS service, for this
particular scenario, allows you to specify a maintenance window through their
API for your database instances.

The full risk of how this affects your own application is hard, if not
impossible, to calculate.

A part of your infrastructure could go down at any time, and it's mostly out of
your hands to respond to it. What you can and should do, is harden your code to
work around them, if at all possible.

One question to ask is how vital this particular piece of infrastructure is to
your application and therefore, your business.

If it's in the critical path, if it affects your application significantly when
it goes down, there are options. Not all multi-tenant systems are automatically
multi-tenant. Some offer the ability to have dedicated but managed setups. Some
even offer high availability capabilities to reduce the impact of single nodes
going down.

Both our PostgreSQL database and our RabbitMQ setup are critical parts of Travis
CI. Without the database, we can't store or read any data. Without our message
queue, we can't push build logs and build jobs through the system, effectively
leaving the system unable to run any tests for our customers.

We started out on multi-tenant setups for both. On our PostgreSQL database, the
load was eventually way too high for the small size of the database setup.

For our RabbitMQ, we were easily impacted by other clients in the system.
RabbitMQ in particular can be gnarly to work with when lots of clients share the
same cluster. On client producing an unusual amount of messages can grind
everyone else in the system to a grinding halt.

Eventually, we ran both parts on dedicated infrastructure, but still fully
managed. There's still a chance of things going down, of course. But the impact
is less than if an entire multi-tenant cluster goes down.

Putting parts that were in the critical path on dedicated infrastructure has
been working well for us. The costs certainly went up, but we just couldn't
continue telling excuses on why Travis CI was down.

When it comes to buying into other people running your infrastructure, **don't
be afraid to ask how they manage it**. Do they have a status page that is
actively used? How do they handle downtimes?

**Operational openness is important when other people manage parts of your
infrastructure.**

It's inevitable that something bad will happen in their infrastructure that
affects you. How they deal with these scenarios is what's relevant.

### Security and Privacy

With multi-tenant infrastructure, you're confronted with curious challenges, and
they can affect you in ways that only studying your local laws and the
provider's terms of service will fully reveal.

Security and privacy are two big issues you need to think about when entrusting
your data to a third party. The [recent MongoHQ security
incident](http://security.mongohq.com/notice#security-breach) has brought up
this issue in an unprecendented way, and we've had our own [issues with security
in the past](http://blog.travis-ci.com/2013-01-31-post-mortem-build-outage/).

Note that these issues could come up just the same when you're running your own
infrastructure. But just like outages, security and privacy breaches can have
much wider ranging ripple effects on multi-tenant infrastructure.

How can you best handle this? Encrypting your data is one way to approach the
situation. Encrypt anything that's confidential, that you want to protect with
at least one small extra layer of security to reduce the attack surface on it.

We encrypt SSH keys and OAuth tokens, the most private data that's entrusted to
our systems. Of course, the keys aren't stored in the database.

When buying infrastructure rather than building it, keep a good eye on what your
providers do and how they handle security and your data. This is just as
important as handling outages, if not even more so.

Make sure that your privacy/security statements reflect which services you're
using and how you handle your customers' data with them. It may not sound like
much, but **transparency goes a long way.**

One unfortunate downside of infrastructure services, Heroku add-ons come to
mind, is the lack of fine-grained access privileges. Only some of the addons we
use allow us to create separate user accounts with separate permissions.

It's one of the downsides of the convenience of just having a URL added to your
application's environment and start using an add-on.

Judging the impact of the trade-off is, again, up to you. Sometimes convenience
trumps security, but other times (most times?), security is more important than
convenience.

**Your users' data is important to your users, so it should be just as important
to you.**

### Scaling up and out

We started out small, with just a few Heroku dynos and a small database setup, a
shared RabbitMQ setup to boot.

In fact, initially Travis CI ran on just one dyno, then two, then just a few
more when a second application was split out.

This worked up to a few thousand tests per day. But as we scaled up, that wasn't
sufficient.

I was sceptical at first whether we can scale up while remaining on managed
infrastructure rather than build our own. Almost two years later, it's still
working quite well.

Important bits have been moved to dedicated setups, the databases (we have four
clusters, eight database servers in total) and our RabbitMQ service, which we
[needed to move to a cluster
setup](http://blog.travis-ci.com/2013-08-08-solving-the-puzzle-of-scalable-log-processing/).

Most hosted services give you means to scale up. For Heroku apps, you add more
dynos, or you [increase the capacity of a single
dyno](https://devcenter.heroku.com/articles/dyno-size).

For their databases (or Amazon RDS, for that matter), upgrade the underlying
server, simple enough to do. For RabbitMQ, go for a bigger plan that gives more
dedicated resources, higher throughput, and the like.

Figuring out the limits of hosted infrastructure services is hard. If you send a
log service, even by mistake, thousands of messages per second, how do they
respond? Can they handle it?

Only one way to find out, ask them!

With most of the bits that we need to scale out, we're confident that hosted
services will give us the means to do so for quite some time. After that, we can
still talk to them and figure out what we can do beyond their normal offerings.

Scaling up is a challenge, as [Joe Ruscio](https://twitter.com/josephruscio) put
it on the aforementioned hangops episode: **"Scaling is always violent."**

It was violent on occasion for us as well.

We may need more dedicated bits in the future for specialized use, things like
ZooKeeper for distributed consensus. But most of our tools are still running
nicely on hosted infrastructure.

### Operational insight

One thing that's been bugging me about a few of our core services originally was
the lack of operational insight.

With infrastructure beyond your control, getting insight into what's happening
can be challenging.

We had to ask Heroku support quite a few times for insight into our database
host machine. For figuring out whether or not an upgrade to a larger plan or
instance is required, this can be essential. It certainly was for us. This
situation has been improving and it will be even more in the future from what
I've heard.

But for an infrastructure provider, offering this kind of insight can also be
challenging. Heroku's Postgres has improved quite a lot, and we get better
insight into what's happening in our database now thanks to
[datascope](https://github.com/will/datascope) and their means of [dumping
metrics into the
logs](https://devcenter.heroku.com/articles/heroku-postgres-metrics-logs), which
you can then aggregate with a service like [Librato](https://librato.com).

Most providers have great people working for them. When in doubt, ask them about
anything that's on your mind. The services we work with are usually very helpful
and insightful. The Heroku Postgres team is a knowledge goldmine in itself.
