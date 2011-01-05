---
layout: post
comments_disabled: true
topics: infrastructure monitoring
title: The Virtues of Monitoring
---
Over the last year I haven't only grown [very fond of coffee](http://holgarific.net/?p=642), but also of infrastructure.
Working on [Scalarium](http://scalarium.com) has been a fun ride so far, for all kinds of reasons, one of them is
dealing so much with infrastructure. Being an infrastructure platform provider, what can you do, right?

As being responsible for deployment, performance tuning, monitoring, infrastructure has always been a part of many of my
job I thought it'd be about time to sprinkle some of my thoughts and daily ops thoughts on a couple of articles. The
simple reason being that no matter how much you try, no matter how far away from dealing with servers you go (think
Heroku), there will always be infrastructure, and it will always affect you and your application in some way.

On today's menu: monitoring. People have all kinds of different meanings for monitoring, and they're all right, because
there is no one way to monitor your applications and infrastructure. I just did a recount, and there are no less than
six levels of detail you can and probably should get. Note that these are my definitions, they don't necessarily have
to be officially named, they're solely based on my experiences. Let's start from the top, the outside view of your
application.

### Availability Level

Availability is a simple measure to the user, either your site is available or it's not. There is nothing in between.
When it's slow, it's not available. It's a beautifully binary measure really. From your point of view, any component or
layer in your infrastructure could be the problem. The art is to quickly find out which one it is.

So how do you notice when your site is not available? Waiting for your users to tell you is an option, but generally a
pretty embarrassing one. Instead you generally start polling some part of your site that's representative of it as a
whole. When that particular site is not available, your whole application may as well not be.

What that page should do is get a quick measure of the most important components of your site, check if they're
available (maybe even with a timeout involved so you get an idea if a specific component is broken) and return the
result. An external process can then monitor that page and notify you when it doesn't return the expected result. Make
sure the site does a bit more than just return "OK". If it doesn't hit any of the major components in your stack,
there's a chance you're not going to notice that e.g. your database is becoming unavailable.

You should run this process from a different host, but what do you do if that host is not available? Even as an
infrastructure provider I like outsourcing parts of my own infrastructure. Here's where [Pingdom](http://pingdom.com)
comes into play. They can monitor a specific URL, TCP ports and whatnot from some two dozen locations across the planet
and they randomly go through all of them, notifying you when your site is unavailable or the result doesn't
match the expectations.

![Pingdom](https://img.skitch.com/20110105-eb51gw3pqrqbfxd7cc5mj6i9eh.jpg)

### Business Level

These aren't necessarily metrics related to your application's or infrastructure's availability, they're more along the
lines of what your users are doing right now, or have done over the last month. Think number of new users per day,
number of sales in the last hour, or, in our case, number of EC2 instances running at any minute.  Stuff like Google
Analytics or click paths (using tools like [Hummingbird](http://projects.nuttnet.net/hummingbird/), for example) in
general also fall into this category.

These kind of metrics may be more important to your business than to your infrastructure, but they're important
nonetheless, and they could e.g. be integrated with another metrics collection tool, some of which we'll get to in a
minute. Depending on what kind of data you're gathering they're also useful to analyze spikes in your application's
performance.

This kind of data can be hard to track in a generic way. Usually it's up to your application to gather them and turn
them into a format that's acceptable to a different tool to collect them. They're also usually very specific to your
application and its business model.

### Application Level

Digging deeper from the outsider's view, you want to be able to track what's going on inside of your application right
now. What are the main entry points, what are the database queries involved, where are the hot spots, which queries are
slow, what kinds of errors are being caused by your application, to name a few.

This will give you an overview of the innards of your code, and it's simply invaluable to have that kind of insight. You
usually don't need much historical data in this area, just a couple of days worth will usually be enough to analyze
problems in retrospect. It can't hurt to keep them around though, because growth also shows trends in potential
application code hot spots or database queries getting slower over time.

To get an inside view of your application, services like [New Relic](http://newrelic.com/) exist. While their services
aren't exactly cheap (most monitoring services aren't, no surprise here), they're invaluable. You can dig down from the
Rails controller level to find the method calls and database queries that are slowest at a given moment in time (most
likely you'll be wanting to check the data for the last hours to analyze an incident), digging deeper into other metrics
from there. Here's an example of what it looks like.

![New Relic](https://img.skitch.com/20110105-n7fhy9ijt7g8rmbq1p6fp2gf5p.jpg)

You can also use the Rails log file and tools like
[Request-log-analyzer](https://github.com/wvanbergen/request-log-analyzer). They can help you get started for free, but
don't expect a similar, fine-grained level of detail like you get with New Relic. However, with Rails 3 it's become a
lot easier to instrument code that's interesting to you and gather data on runtimes of specific methods yourself.

Other means are e.g. JMX, one of the neat features you get when using a JVM-based language like JRuby. Your application
can contiuously collect and expose metrics through a defined interface to be inspected or gathered by other means. JMX
can even be used to call into your application from the outside, without having to go through a web interface.

Application level monitoring also includes exception reporting. Services like [Exceptional](http://getexceptional.com)
or [Hoptoad](http://hoptoadapp.com) are probably the most well known in that area, though in higher price regions New
Relic also includes exception reporting.

### Process Level

Going deeper (closer to inception than you think) from the application level we reach the processes that serve your
application. Application servers, databases, web servers, background processing, they all need a process to be
available.

But processes crash. It's a bitter and harsh truth, but they do, for whatever reason, maybe they consumed too many
resources, causing the machine to swap or the process to simply crash because the machine doesn't have any memory left
to allocate. Think of a memory leaking Rails application server process or the last time you used RMagick.

Someone must ensure that the processes keep running or that they don't consume more resources than they're allowed to,
to ensure availability on that level. These tools are called supervisors. Give them a pid file and a process, running or
not, and they'll make sure that it is. Whether a process is running can depend on multiple metrics, availability over
the network, a file size (think log files) or simply the existence of the process, while allowing you to send some sort
of grace period, so they'll retry a number of times with a timeout before actually restarting the process or giving up
monitoring it altogether.

A good supervisor will also let you alert someone when the expected conditions move outside or their acceptable
perimeter and a process had to be restarted. A classic in this area is [Monit](http://mmonit.com/monit/), but people
also like [God](http://god.rubyforge.org/) and [Bluepill](https://github.com/arya/bluepill). On a lower level you have
tools like [runit](http://smarden.org/runit/) or [upstart](http://upstart.ubuntu.com/), but their capabilities are
usually built around a pid file and a process, not allowing to go on a higher level of checking system resources.

While I find the syntax of Monit's configuration to not be very aesthetically pleasing, it's proven to be reliable and
has a very small footprint on the system, so it's our default on our own infrastructure, and we add it to most our
cookbooks for [Scalarium](http://scalarium.com), as it's installed on all managed instances anyway. It's a matter of
preference.

### Infrastructure/Server Level

Another step down from processes we reach the system itself. CPU and memory usage, load average, disk I/O, network
traffic, are all traditional metrics collected on this level. The tools (both commercial and open source) in this area
can't be counted. In the open source world, the main means to visualize these kinds of metrics is rrdtool. Many tools
use it to graph data and to keep an aggregated data history around, using averages for hours, days or weeks to store the
data efficiently.

This data is very important in several ways. For one, it will show you what your servers are doing right now, or in the
last couple of minutes, which is usually enough to notice a problem. Second, the data collected is very useful to
discover trends, e.g. memory usage increasing over time, swap usage increasing, or a partition running out of disk
space. Any value constantly increasing over time is a good sign that you'll hit a wall at some point. Noticing trends
will usually give you a good indication that something needs to be changed in your infrastructure or your application.

![Munin](https://img.skitch.com/20110105-9khif3pghuefyucbkb7ayn62t.jpg)

There's a countless number of tools in this area, [Munin](http://munin-monitoring.org/) (see screenshot),
[Nagios](http://www.nagios.org/), [Ganglia](http://ganglia.sourceforge.net/), [collectd](http://collectd.org/) on the
open source end, and [CloudKick](http://cloudkick.com/), [Circonus](http://circonus.com/), [Server
Density](http://www.serverdensity.com/) and [Scout](https://scoutapp.com/) on the paid service level, and an abundance
of commercial tools on the very expensive end of server monitoring. I never really bother with the commercial ones, because I
either resort to the open source tools or pay someone to take care of the monitoring and alerting for me on a service
basis. Most of these tools will run some sort of agent on every system, collecting data in a predefined cycle, delivering it to
a master process, or the master processing picking up the data from the agents.

Again, it's a matter of taste. Most of the open source tools available tend to look pretty ugly on the UI part, but if
the data and the graphs are all that matters to you, they'll do just fine. We do our own server monitoring using [Server
Density](http://serverdensity.com), but on [Scalarium](http://scalarium.com) we resort to using Ganglia as an integrated
default, because it's much more cost effective on our users, and given the elastic nature of EC2 it's much easier for us
to add and remove instances as they come and go. In general I'm also a fan of Munin.

Most of them come with some sort of alerting that allows you to define thresholds which trigger the alerts. You'll never
get the thresholds right the first time you configure them, constantly keep an eye on them to get a picture of what
thresholds are normal, and which are indeed problem areas and require an alert to be triggered.

The beauty about these tools is that you can throw any metric at them you can think of. They can even be used to collect
business level data, utilizing the existing graphing and even alerting capabilities.

### Log Files

The much dreaded log file won't go out of style for a long time, that's for sure. Your web server, your database, your
Rails application, your application server, your mail server, all of them dump more or less useful information into log
files. They're usually the most immediate and uptodate view of what's going on in your application, if you chose to
actually log something, Rails appliations traditionally seem to be less of a candidate here, but your background
services sure are, or any other service running on your servers. The log is the first to know when there's problems
delivering email or your web server is returning an unexpected amount of 500 errors.

The biggest problem however is aggregating the log data, centralized logging if you will. syslog and all the alternative
tools are traditionally sufficient, while on the larger scale end you have custom tools like Cloudera's
[Flume](https://github.com/cloudera/flume) or Facebook's [Scribe](https://github.com/facebook/scribe). There's also
a bunch of paid services specializing on logging, most noteworthy are [Splunk](http://www.splunk.com/) and
[Loggly](http://loggly.com). Loggly relies on syslog to collect and transmit data from your servers, but they also have
a custom API to transmit data. The data is indexed and can easily be searched, which is usually exactly what you want to
do with logs. Think about the last time you grepped for something in multiple log files, trying to narrow down the data
found to a specific time frame.

There's a couple of open source tools available too, [Graylog2](http://www.graylog2.org/) is a syslog server with a
MongoDB backend and a Java server to act as a syslog endpoint, and a web UI allowing nicer access to the log data. A bit
more kick-ass is [logstash](http://code.google.com/p/logstash/) which uses RabbitMQ and ElasticSearch for indexing and
searching log data. Almost like a self-hosted Loggly.

When properly aggregated log files can show trends too, but aggregating them gets much harder the more log data your
infrastructure accumulates. 

### ZOMG! So much monitoring, really?

Infrastructure purists would start by saying that there's a different between monitoring, metrics gathering and log
files. To me, they're a similar means to a similar end. It doesn't exactly matter what you call it, the important thing
is to collect and evaluate the data.

I'm not suggesting you need every single kind of logging, monitoring and metrics gathering mentioned here. There is
however one reason why eventually you'll want to have most if not all of them. At any incident in your application or
infrastructure, you can correlate all the available data to find the real reason for a downtime, a spike or slow
queries, or problems introduced by recent deployments.

For example, your site's performance is becoming sluggish in certain areas, users start complaining. Application level
monitoring indicates specific actions taking longer than usual, pointing to a specific query. Server monitoring
for your database master indicates an increased number of I/O waits, usually a sign that too much data is read from or
written to disk. Simplest reason could be an index missing or that your data doesn't fit into memory anymore and too
much of it is swapped out to disk. You'll finally be looking at MySQL's slow query log (or something similar for your
favorite database) to find out what query is causing the trouble, eventually (and hopefully) fixing it.

That's the power of monitoring, and you just can't put any price on a good setup that will give you all the data and
information you need to assess incidents or predict trends. And while you can set up a lot of this yourself, it doesn't
hurt to look into paid options. Managing monitoring yourself means managing more infrastructure. If you can afford to
pay someone else to do it for you, look at some of the mentioned services, which I have no affiliation with, I just
think they're incredibly useful.

Even being an infrastructure enthusiast myself, I'm not shy of outsourcing where it makes sense. Added features like SMS
alerts, iPhone push notifications should also be taken into account. Remember that it'd be up to you to implement all
this. It's not without irony that I mention [PagerDuty](http://www.pagerduty.com/). They sit on top of all the other
monitoring solutions you have implemented and just take care of the alerting, with the added benefit of on-call
schedules, alert escalation and more.
