---
layout: post
title: "CruiseControl in your Menu Bar"
topics: continuousintegration cruisecontrol macosx
---
Now here's a little gem I've been waiting for a long time, and that I just discovered today. Usually i just implemented custom scripts that would check the build status in CruiseControl and use Growl to notify me of build errors. I don't like having my email client open all the time just to see if the build failed, so this is a god-given.

CCMenu wants to remedy that, and comes along with support for all the CruiseControls out there, sitting in your menu bar, and checking your dashboards for the build status. It also signalizes, if a build is currently running.

> ![CCMenu](http://myskitch.com/mattie/picture_4-20071218-210722.jpg)

Just as you'd expect it to, in good pragmatic automation fashion, it'll notify via Growl of the build status.

> ![CCMenu Growl Notification](http://myskitch.com/mattie/picture_1-20071218-211017.jpg)

Apparently the tool has been written by ThoughtWorks people, no surprise here. Well done is all I can say. It still has some rough edges, but it's open source, so no need to complain, just more reasons to dig in.

Been using it with CruiseControl.rb all day, and it's working neatly.