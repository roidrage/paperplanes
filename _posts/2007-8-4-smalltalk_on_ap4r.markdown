---
layout: post
title: "Smalltalk on AP4R"
topics: rails ruby
---
After playing around with [AP4R](http://ap4r.rubyforge.org/wiki/wiki.pl?HomePage), the new kid on the asynchronous Ruby block, for a little while, I held a small presentation at last week's meeting of the [Ruby User Group Berlin](http://www.rug-b.com). While it is more of an introduction than a field report I put up the [slides as PDF](http://www.paperplanes.de/files/AP4R.pdf) anyway.

One note on the load balancing though. That's the issue that brought up some questions I couldn't answer, so I had another look at the documentation (which is still rather sparse, by the way.

AP4R knows two kinds of balancing. The first one is the distribution of dispatching tasks over a number of threads. That way the messages in the server's queue can be handled in parallel. Since the threads only scale on one host this doesn't allow for load balancing on several hosts.

For this AP4R has an experimental feature called [carriers](http://viewvc.rubyforge.mmmultiworks.com/cgi/viewvc.cgi/trunk/ap4r/lib/ap4r/carrier.rb?root=ap4r&view=markup). These allow for the AP4R server to redistribute the messages to a bunch of servers exclusively dealing with the messages. It should be added though that these carriers use polling to fetch new messages from the master server's queue. This has the clear advantage that new carriers can be added without changing any configuration on the other servers. Carriers aren't considered stable yet, but they point in the right direction.

As for the client, let's say a Rails application, it can only handle exactly one AP4R server to transmit its messages to. So if you're balancing your application's load over several servers, you can either send all the messages to one server or have each application deliver them to its own AP4R server. The downside of this is that if one server fails, one or all of your server can't deliver asynchronous messages. So it's probably best to always rely on store-and-forward to ensure that your messages won't get lost.

For some further information I'd recommend checking out the website, the ["Getting Started"](http://ap4r.rubyforge.org/wiki/wiki.pl?GettingStarted#Monitoring) document, where they show how to set up the example application, and a [large set of slides](http://rubyforge.org/docman/view.php/1765/1257/AP4R_on_RubyKaigi2007_EN.pdf) from a presentation at this year's RubyKaigi.

I'm looking forward to seeing what's next for AP4R. It's a promising start.