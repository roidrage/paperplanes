---
layout: post
title: Web Operations 101 For Developers
tags: operations
comments_disabled: true
---
This post is not about devops, it's not about lean startups, it's not about web
scale, it's not about the cloud, and it's not about continuous deployment. This
post is about you, the developer who's main purpose in life has always been to
build great web applications.  In a pretty traditional world you write code, you
write tests for it, you deploy, and you go home. Until now.

To tell you the truth, that world has never existed for me. In all of my
developer life I had to deal with all aspects of deployment, not just putting
build artifacts on servers, but dealing with network outages, faulty network
drivers, crashing hard disks, sudden latency spikes, analyzing errors coming
from those pesky crawling bots on that evil internet of yours. I take a lot of
this for granted, but working in infrastructure and closely with developers
trying to get applications and infrastructure up and running on EC2 has taught
me some valuable lessons to assume the worst. Not because developers are stupid, but
because they like to focus on code, not infrastructure.

But here's the deal: your code and all your full-stack and unit tests is worth
squat if they're not running out there on some server or infrastructure stack
like Google Apps or Heroku. Without running somewhere in production, your code
doesn't generate any business value, it's just a big pile of ASCII or UTF-8
characters that cost a lot of money to create, but didn't offer any return of
investment yet.

### Love Thy Infrastructure

Operations isn't hard, but necessary. You don't need to know everything about
operations to become fluent in it, you just have to know enough to start and
know how to use Google.

This is my collective dump from the last years of working both as a developer
and that guy who does deployments and manages servers too. Most are lessons I
learned the hard way, others just seemed logical to me when I learned about them
the first time around.

Between you and me, having this skill set at hand makes you a much more valuable
developer. Being able to analyze any problem in production and at least having a
basic skill set to deal with it makes you a great asset for companies and
clients to hold on to. Thought you should know, but I digress.

The most important lesson I can tell you right up front: love your
infrastructure, it's the muscles and bones of your application, whereas your
code running on it is nothing more than the skin.

### Without Infrastructure, No-one Will Use Your Application

Big surprise. For users to be able to enjoy your precious code, it needs to run
somewhere. It needs to run on some sort of infrastructure, and it doesn't matter
if you're managing it, or if you're paying another company to take care of it for
you.

### Everything Is Infrastructure

Every little piece of software and hardware that's necessary to make your
application available to users is infrastructure. The application server serving
and executing your code, the web server, your email delivery provider, the
service that tracks errors and application metrics, the servers or virtual
machines your services are running on.

Every little piece of it can break at any time, can stall at any time. The more
pieces you have in your application puzzle, the more breaking points you have.
And everything that can break, will break. Usually not all at once, but most
certainly when it's the least expected, or just when you really need your
application to be available.

### On Day One, You Build The Hardware

Everything starts with a bare metal server, even that cloud you've heard so much
about. Knowing your way around everything that's related to setting up a full
rack of servers on a single day, including network storage a fully configured
switch with two virtual LANs and a master-slave database setup using a RAID 10
a bunch of SAS drives might not be something you need every day, but it sure
comes in handy.

The good news is the internet is here for you. You don't need to know everything
about every piece of hardware out there, but you should be able to investigate
strengths and weaknesses, when an SSD is an appropriate tool to use, and when
SAS drives will kick butt.

Learn to distinguish the different levels of RAID, why having an additional file
system buffer on top of a RAID that doesn't have a backup battery for its own,
internal write buffer is a bad idea. That's a pretty good start, and will make
decisions much easier.

### The System

Do you know what swap space is? Do you know what happens when it's used by the
operating system, and why it's actually a terrible thing and gives a false sense
of security? Do you know what happens when all available memory is exhausted?

Let me tell you:

* When all available memory is allocated, the operating system starts swapping
  out memory pages to swap space, which is located on disk, a very slow disk,
  slow like a snail compared to fast memory.
* When lots of stuff is written to and read from swap space on disk, I/O wait
  goes through the roof, and processes start to pile up waiting for their memory
  pages to be swapped out to or read from disk, which in turn increases load
  average, and almost brings the system to a screeching halt, but only almost.
* Swap is terrible because it gives you a false sense of having additional
  resources beyond the available memory, while what it really does is slowing
  down performance in a way that makes it almost impossible for you to log into
  the affected system and properly analyze the problem.

This is basically operations level on the operating system level. It's not much
you need to know here, but in my opinion it's essential. Learn about the most
important aspects of a Unix or Linux system. You don't need to know everything,
you don't need to know the specifics of Linux' process scheduler or the
underlying datastructure used for virtual memory. But the more you know, the
more informed your decisions will be when the rubber hits the road.

And yes, I think enabling swap on servers is a terrible idea. Let processes
crash when they don't have any resources left. That at least will allow you to
analyze and fix.

### Production Problems Don't Solve Themselves

Granted, sometimes they do, but you shouldn't be happy about that. You should be
willing to dig into whatever data you have posthumous to find whatever went wrong,
whatever caused a strange latency spike in database queries, or caused an
unusually high amount of errors in your application.

When a problem doesn't solve itself though, which is certainly the common case,
someone needs to solve it. Someone needs to look at all the available data to
find out what's wrong with your application, your servers or the network.

This person is not the unlucky operations guy who's currently on call, because
let's face it, smaller startups just don't have an operations team.

That person is you.

### Solve Deployment First

When the first line of code is written, and the first piece of your application
is ready to be pushed on a server for someone to see, solve the problem of
deployment. This has never been easier than it is today, and being able to push
incremental updates from then on speeds up development and the customer feedback
cycle considerably.

As soon as you can, build that Capfile, Ant file, or whatever build and
deployment tools you're using, set up servers, or set up your project
on an infrastructure platform like [Scalarium](http://scalarium.com),
[Heroku](http://heroku.com), [Google Apps](http://www.google.com/apps/), or
[dotCloud](http://dotcloud.com). The sooner you solve this problem, the easier
it will be to finally push that code of yours into production for everyone to
use. I consider application deployment a solved problem. There's no reason why
you shouldn't have it in place even in the earliest stages of a project.

The more complex a project gets over even just its initial lifecycle the easier
it will be to add more functionality to an existing deployment setup instead of
having to build everything from scratch.

### Automate, Automate, Automate

Everything you do by hand, you should only be doing once. If there's any chance
that particular action will be repeated at some point, invest the time to turn
it into a script. It doesn't matter if it's a shell, a Ruby, a Perl, or a Python
script. Just make it reusable. Typing things into a shell manually, or updating
configuration files with an editor on every single server is tedious work, work
that you shouldn't be doing manually more than once.

When you automate something once, it not only greatly increases execution speed the
second and third time around, it reduces the chance of failure, of missing that one
important step.

There's an abundance of tools available to automate infrastructure, hand-written
script are only the simplest part of it. Once you go beyond managing just one or
two servers, tools like [Chef](http://www.opscode.com/chef/),
[Puppet](http://www.puppetlabs.com/) and
[MCollective](http://docs.puppetlabs.com/mcollective/) come in very handy to
automate everything from setting up bare servers to pushing out configuration
changes from a single point, to deploying code. Everything should be properly
automated with some tool. Ideally you only use one, but looking at Chef and
Puppet, both have their strength and weaknesses.

Changes in Chef aren't instant, unless you use the command line tool `knife`,
which assumes SSH access to all servers you're managing. The bigger your
organizations the less chance you'll have to be able to access all machines via
SSH. Instant tools like mCollective that work based on a push agent system, are
much better for these instant kinds of activities.

It's not important what kind of tool you use to automate, what's important is
that you do it in the first place.

By the way, if your operations team restricts SSH access to machines for
developers, fix that. Developers need to be able to analyze and fix incidents
just like the operations folks do. There's no valid point in denying SSH access
to developers. Period.

### Introduce New Infrastructure Carefully

Whenever you add a new component, a new feature to an application, you add a new
point of failure. Be it a background task scheduler, a messaging queue, an image
processing chain or asynchronous mail delivery, it can and it will fail.

It's always tempting to add shiny new tools to the mix. Developers are prone to
trying out new tools even though they've not yet fully proven themselves in
production, or experience running them is still sparse. It's a good thing in one
way, because without people daring to use new tools everyone else won't be able
to learn from their experiences (you do share those experiences, do you?).

But on the other hand, you'll live the curse of the early adopter. Instead of
benefiting from existing knowledge, you're the one bringing the knowledge into
existence. You'll experience all the bugs that are still lurking in the darker
corners of that shiny new database or message queue system. You'll spend time
developing tools and libraries to work with the new stuff, time you could just
as well be spending working on generating new business value by using existing
tools that do the job similarly well. If you do decide for a new tool, be
prepared to degrade back to other tools in the case of failure.

No matter if old or new, adding more infrastructure always has the potential for
more things to break. Whenever you add something, be sure to know what you're
getting yourself into, be sure to have fallback procedures in place, be sure
everyone knows about the risks and the benefits. When something that's still
pretty new breaks, you're usually on your own.

### Make Activities Repeatable

Every activity in your application that causes other, dependent activities to be
executed, needs to be repeatable, either by the user, or through some sort of
administrative interface, or automatically if feasible. Think user confirmation
emails, generating monthly reports, background tasks like processing uploads.
Every activity that's out of the normal cycle of fetching records from a
datasource and updating them is bound to fail. Heck, even that cycle will fail
at some point due to some odd error that only comes up every once in a blue
moon.

When an activity is repeatable, it's much easier to deal with outages of single
components. When it comes back up, simply re-execute the tasks that got stuck.

This, however, requires one important thing: every activity must be idempotent.
It must have the same outcome no matters how often it's being run. It must know
what steps were already taken before it broke the last time around. Whatever's
already been done, it shouldn't be done again. It should just pick up where it
left off.

Yes, this requires a lot of work and care for state in your application. But
trust me, it'll be worth it.

### Use Feature Flips

New features can cause joy and more headaches. Flickr was one of the first to
add something called feature flips, a simple way to enable and disable features
for all or only specific users. This way you can throw new features onto your
production systems without accidentally enabling it for all users, you can
simply allow a small set of users or just your customer to use it and to play
with it.

What's more important though, when a feature breaks in production for some
reason, you can simply switch it off, disabling traffic on the systems involved,
allowing you to take a breether and analyze the problem.

Feature flips come in many flavors, the simplest approach is to just use a
configuration file to enable or disable them. Other approaches use a centralized
database like Redis for that purpose, which has an added benefit for other parts
of your application, but also adds new infrastructure components and therefore,
more complexity and more points of failure.

### Fail And Degrade Gracefully

What happens when you unplug your database server? Does your application throw
in the towel by showing a 500 error, or is it able to deal with the situation
and show a temporary page informing the user of what's wrong? You should try it
and see what happens.

Whenever something non-critical breaks, your application should be able to deal
with it without anything else breaking. This sounds like an impossible thing to
do, but it's really not. It just requires care, care your standard unit tests
won't be able to deliver, and thinking about where you want a breakage to leak
to the user, or where you just ignore it, picking up work again as soon as the
failed component becomes available again.

Failing gracefully can mean a lot of things, there's things that directly affect
user experience, a database failure comes to mind, and things that the user will
notice only indirectly, e.g. through delays in delivering emails or fetching
data from an external service like Twitter, RSS feeds and so on.

When a major component in your application fails, a user will most likely be
unable to use your application at all. When your database latency increases
manifold, you have two options. Try to squeeze through as much as you can,
accepting long waits on your user's side, or you can let him know that it's
currently impossible to serve him in an acceptable time frame, and that you're
actively working on fixing or improving the situations. Which you should, either
way.

Delays in external services or asynchronous tasks are much harder for a user to
notice. If fetching data from an external source, like an API, directly affects
your site's latency, there's your problem.

Noticing problems in external services requires two things: monitoring and
metrics. Only by tracking queue sizes, latency for calls to external services,
mail queues and all things related to asynchronous tasks will you be able to
tell when your users are indirectly affected by a problem in your
infrastructure.

After all, knowing is half the battle.

### Monitoring Sucks, You Need It Anyway

I've written in [abundance on the virtues of monitoring, metrics and
alerting](http://www.paperplanes.de/2011/1/5/the_virtues_of_monitoring.html). I
can't say it enough how important having a proper monitoring and metrics gathering
system in place is. It should be by your side from day one of any testing deployment.

Set up alerts for thresholds that seem like a reasonable place to start to you.
Don't ignore alerting notifications, once you get into that habit, you'll miss
that one important notification that's real. Instead, learn about your system
and its thresholds over time.

You'll never get alerting and thresholds right the first time, you'll adapt over
time, identifying false negatives and false positives, but if you don't have a
system in place at all, you'll never know what hit your application or your
servers.

If you're not using a tool to gather metrics like
[Munin](http://munin-monitoring.org/),
[Ganglia](http://ganglia.sourceforge.net/), [New Relic](http://newrelic.com), or
[collectd](http://collectd.org/), you'll be in for a big surprise once your application becomes
unresponsive for some reason. You'll simply never find out what the reason was
in the first place.

While Munin has basic built-in alerting capabilities, chances are you'll add
something like [Nagios](http://www.nagios.org/) or
[PagerDuty](http://www.pagerduty.com/) to the mix for alerting.

Most monitoring tools suck, you'll need them anyway.

### Supervise Everything

Any process that's required to be running at any time needs to be supervised.
When something crashes be sure there's an automated procedure in place that will
either restart the process or notify you when it can't do so, degrading
gracefully. [Monit](http://mmonit.com/monit/),
[God](http://god.rubyforge.org/), [bluepill](https://github.com/arya/bluepill),
[supervisord](http://supervisord.org/), [RUnit](http://smarden.org/runit/), the
number of tools available to you is endless.

Micromanaging people is wrong, but processes need that extra set of eyes on them
at all times.

### Don't Guess, Measure!

Whatever directly affects your users' experience affects your business. When
your site is slow, users will shy away from using it, from generating revenue
and therefore (usually) profit. 

Whenever a user has to wait for anything, they're not willing to wait forever.
If an uploaded video takes hours to process, they'll go to the next video
hosting site. When a confirmation email takes hours to be delivered, they'll
check out your competitor, taking the money with them.

How do you know that users have to wait? Simple, you track how long things in
your application take, how many tasks are currently stuck in your processing
queue, how long it took to process an upload. You stick metrics on anything
that's directly or indirectly responsible for generating business value.

Without having a proper system to collect metrics in place, you'll be blind.
You'll have no idea what's going inside your application at any given time.
Since Coda Hale's talk ["Metrics
Everywhere"](http://codahale.com/codeconf-2011-04-09-metrics-metrics-everywhere.pdf)
at CodeConf and the release of [his metrics library for
Scala](https://github.com/codahale/metrics), an abundance of libraries for
different languages has popped up left and right. They make it easy to include
timers, counters, and other types of metrics into your application,
allowing you to instrument code where you see fit. Independently, Twitter has
lead the way by releasing [Ostrich](https://github.com/twitter/ostrich), their
own Scala library to collect metrics. The tools are here for you. Use them.

The most important metrics should be easily accessible on some sort of
dashboard. You don't need a big fancy screen in your office right away, a
canonical place, e.g. a website including the most important graphs and numbers,
where everyone can go and see what's going on with a glance is a good start.
Once you have that in place, the next step towards a company-visible dashboard
is simple buying a big-ass screen.

All metrics should be collected in a tool like Ganglia, Munin or something else.
These tools make analysis of historical data easy, they allow you to make
predictions or correlate the metrics gathered in your applications to other
statistics like CPU, memory usage, I/O waits, and so on.

The importance of monitoring and metrics cannot be stressed enough. There's no
reason why you shouldn't have it in place. Setting up Munin is easy enough,
setting up collection using an external service like New Relic or
[Scout](http://scoutapp.com) is usually even easier.

### Use Timeouts Everywhere

Latency is your biggest enemy in any networked environment. It creeps up on you
like the shadow of the setting sun. There's a whole bunch of reasons why, e.g.
database queries will suddenly see a spike in execution time, or external
services suddenly take forever to answer even the simplest requests.

If your code doesn't have appropriate timeouts, requests will pile up and maybe
never return, exhausting available resources (think connection pools) faster
than Vettel does a round in Monte Carlo.

Amazon for example has internal contracts. Going to their home page involves
dozens of requests to internal services. If any one of them doesn't respond in a
timely manner, say 300 ms, the application serving the page will render a static
piece snippet instead, but thereby decreasing the chance of selling something,
directly affecting business value.

You need to treat every call to an external resource as something that can take
forever, something that potentially blocks an application server process
forever. When an application server process or thread is blocked, it can't serve
any other client. When all processes and threads lock up waiting for a resource,
your website is dead.

Timeouts make sure that resources are freed and made available again after a
grace period. When a database query takes longer than usual, not only does your
application need to know how to handle that case, but your database needs to. If
your application has a timeout, but your database will happily keep sorting those
millions of records in a temp file on disk, you didn't gain a lot. If two
dependent resources are within your hands, both need to be aware of contracts
and timeouts, both need to properly free resources when the request couldn't be
served in a timely manner.

Use timeouts everywhere, but know how to handle them when they occur, know what
to tell the user when his request didn't return quickly enough. There is no
golden rule what to do with a timeout, it depends not just on your application,
but on the specific use case.

### Don't Rely on SLAs

The best service fails at some point. It will fail in the most epic way
possible, not allowing any user to do anything. This doesn't have to be your
service. It can be any service you directly or indirectly rely on.

Say, your code runs on Heroku. Heroku's infrastructure runs on Amazon's EC2.
Therefore Heroku is prone to problems with EC2. If a provider like Heroku tells
you they have a service level agreement in place that guarantees a minimum
amount of availability per month or per year, that's worth squat to you, because
they in turn rely on other external services, that may or may not offer
different SLAs. This is not specific to Heroku, it's just an obvious example.
Just because you outsourced infrastructure doesn't mean you're allowed to stop
caring.

If your application runs directly on EC2, you're bound by the same problem. The
same is true for any infrastructure provider you rely on, even a big hosting
company where your own server hardware is colocated.

They all have some sort of SLA in place, and they all will screw you over with
the terms of said SLA. When stuff breaks on their end, that SLA is not worth a
single dime to you, even when you were promised to get your money back. It will
never make up for lost revenue, for lost users and decreased uptime on your end.
You might as well stop thinking about them in the first place.

What matters is what procedures any provider you rely on has in place in case of
a failure. The important thing for you as one of their users is to not be left
standing in the rain when your hosting world is coming close to an end. A
communicative provider is more valuable than one that guarantees an impossible
amount of availability. Things will break, not just for you. SLAs give you that
false sense of security, the sense that you can blame an outage on someone else.

For more on this topic, Ben Black has written a
[two](http://blog.b3k.us/2009/07/15/service-level-disagreements.html)
[part](http://blog.b3k.us/2009/07/16/service-level-disagreements-2.html) series
aptly named "Service Level Disagreements".

### Know Your Database

You should know what happens inside your database when you execute any query.
Period. You should know where to look when a query takes too long, and you
should know what commands to use to analyze why it takes too long.

Do you know how an index is built? How and why your database picks one index over
another? Why selecting a random record based on the wrong criteria will kill
your database?

You should know these things. You should read "High Performance MySQL", or
"Oracle Internals", or "PostgreSQL 9.0 High Performance". Sorry, I didn't mean
to say you should, I meant you must read them.

### Love Your Log Files

In case of an emergency, a good set of log files will mean the world to you.
This doesn't just include the standard set of log files available on a Unix
system. It includes your application and all services involved too.

Your application should log important events, anything that may seem useful to
analyze an incident. Again, you'll never get this right the first time around,
you'll never know up front all the details you may be interested in later. Adapt
and improve, add more logging as needed. It should allow you to tune the log
verbosity at runtime, either by a using a feature switch or by accepting a Unix
signal.

Separate request logging from application logging. Data on HTTP requests is just
as important as application logs, but it's easier if you can sift through them
independently, they're also a lot easier to aggregate for services like Syslog
or Loggly when they're on their own.

For you Rails developers out there: using `Rails.logger` is not an acceptable
logging mechanism. All your logged statements will be intermingled with Rails
next to unusable request logging output. Use a separate log file for anything
that's important to your application.

Just like you should stick metrics on all things that are important to your
business, log additional information when things get out of hand. Correlating
log files with metrics gathered on your servers and in your application is an
incredibly powerful way of analyzing incidents, even long after they occurred.

### Learn the Unix Command Line

In case of a failure, the command line will be your best friend. Knowing the
right tools to quickly sift through a set of log files, being able to find and
set certain kernel parameters to adjust TCP settings, knowing how get the most
important system statistics with just a few commands, and knowing where to look
for a specific service's configuration. All these things are incredibly valuable
in case of a failure.

Knowing your way around a Unix or Linux system, even with just a basic toolset
is something that will make your life much easier, not just in operations, but
also as a developer. The more tools you have at your disposal, the easier it
will be for you to automate tasks, to not be scared of operations in general.

In times of an emergency, you can't afford to argue that your favorite editor is
not installed on a system, you use what's available.

### At Scale, Everything Breaks

Working at large scale is nothing anyone should strive for, it's a terrible
burden, but an incredibly fascinating one. The need for scalability evolves over
time, it's nothing you can easily predict or assume without knowing all the
details, parameters and the future. Out of all three, at least one is 100% guess
work.

The larger your infrastructure setup gets, the more things will break. The more
servers you have, the larger the number of servers being not available at any
time. That's nothing you need to respect right from the get go, it's something
to keep in mind.

No service that's working at a larger scale was originally designed for it. The
code and infrastructure were adapted, the services grew over time, and they
failed a lot. Something to think about when you reach for that awesome scalable
database before even having any running code.

### Embrace Failure

The bottom line of everything is, stuff breaks, everything breaks at different
scale. Embrace breakage and failure, it will help you learn and improve your
knowledge and skill set over time. Analyze incidents using the data available to
you, fix the problem, learn your lesson, and move on.

Don't embrace one thing though: never let a failure happen again if you know
what caused it the first time around.

Web operations is not solely related to servers and installing software
packages. Web operations involves everything required to keep an application
available, and your code needs to play along.

### Required Reading

As 101s go, this is a short overview of what I think makes up for a good starter
set of operations skills. If you don't believe or trust me (which is a good
thing), here's a list of further reading for you. By now, I consider most of
these required reading even. The list isn't long, mind you. The truth as of
today is still that you learn the most out of personal experience on production
systems. Both require one basic skill though: you have to want to learn.

* [Release It!](http://www.amazon.com/gp/product/0978739213/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&tag=javaddicts-20&linkCode=as2&camp=1789&creative=9325&creativeASIN=0978739213) - A must read, that's all I can say. It's an incredible resource stemming from years of production. A must read, no excuses.
* [Web Operations: Keeping the Data on Time](http://www.amazon.com/gp/product/1449377440/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&tag=javaddicts-20&linkCode=as2&camp=1789&creative=9325&creativeASIN=1449377440) - The best summary on all things operations available today. If
  you read one book, read this, and the previous one (that's two books, I know)
* [Pragmatic Project Automation](http://www.amazon.com/gp/product/0974514039/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&tag=javaddicts-20&linkCode=as2&camp=1789&creative=9325&creativeASIN=0974514039) (oldie, but goldie, this book was an eye-opener to me)
* [The Art of Capacity Planning](http://www.amazon.com/gp/product/0596518579/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&tag=javaddicts-20&linkCode=as2&camp=1789&creative=9325&creativeASIN=0596518579)
* [Building Scalable Websites](http://www.amazon.com/gp/product/0596102356/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&tag=javaddicts-20&linkCode=as2&camp=1789&creative=9325&creativeASIN=0596102356)
* [High Performance MySQL, 2nd. Edition](http://www.amazon.com/gp/product/B004PUIVLQ/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&tag=javaddicts-20&linkCode=as2&camp=1789&creative=9325&creativeASIN=B004PUIVLQ)
* [How Complex Systems Fail](http://www.ctlab.org/documents/How%20Complex%20Systems%20Fail.pdf)
* [On Designing and Deploying Internet-Scale Services](http://www.usenix.org/event/lisa07/tech/full_papers/hamilton/hamilton_html/)

<br/>
## Shameless Plug

If you liked this article, you may enjoy the book I'm currently working on: ["The NoSQL
Handbook"](http://nosqlhandbook.com/).
