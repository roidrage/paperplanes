---
layout: post
title: XRay Goggles For Your Ruby Processes
topics: ruby monitoring
---
The guys over at [Pivotal Labs](http://pivotallabs.com/) wrote a [small piece](http://pivotallabs.com/users/steve/blog/articles/746-inspect-running-ruby-processes-using-xray-and-kill-3) on a neat tool called [XRay](http://xray.rubyforge.org/). It hooks into your Ruby code to provide Java-like signal handlers which dump the current stack trace into whatever log file seems fit. Using Passenger that'll be your Apache's error log file.

Say what you want about Java and it's enterprisey bloated-ness, but some features of it come in quite handy, especially when they allow looking into your processes without immediately having to turn to tools like NewRelic or FiveRuns.

Just add the following line to your application.

    require "xray/thread_dump_signal_handler"

From then on you can use `kill -QUIT <pid>` to get a trace dump in your log file. Neat! The website says you need to patch Ruby, but for me it worked with the Ruby that comes with Leopard, and Ruby Enterprise Edition.