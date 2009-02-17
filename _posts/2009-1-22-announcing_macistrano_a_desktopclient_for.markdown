---
layout: post
title: "Announcing Macistrano: A Desktop-Client for Webistrano"
topics: macosx ruby
---
Personally, I'm a big fan of [Webistrano](http://labs.peritor.com/webistrano), a neat web app that sits on top of Capistrano, adds some nice features, and generally makes the deployment process a little bit easier.

But I didn't want to have to be in the web application all the time to monitor the deployment's progress. Plus, I wanted to have a project to play around with RubyCocoa. Webistrano comes with an XML-based REST-API. So why not throw all these together, and build a nice application around it?

I originally started working on it last April (I think), using plain Ruby APIs, but quickly discovered that they just don't match with Cocoa's view of the world, especially when it comes to asynchronous things. It's still not a perfect match, there are some glitches, but the current state works out pretty well.

![bla](http://img.skitch.com/20090122-fwre7cnre6gccfi4feu6mca9r.jpg)

Enough blabber, in the spirit of Getting Things Done, I'm officially announcing the first public release of [Macistrano](http://mattmatt.github.com/macistrano/). It allows you to run and monitor deployments from the comfort of your desktop. That's pretty much all it does, but the goal is to make it do that perfectly of course.

If you're using Webistrano (which you should, go and install it asap), give a Macistrano a whirl, and let me know how you like it. Head over to the [project's page](http://mattmatt.github.com/macistrano) for more information and download. Check the [GitHub project page](https://github.com/mattmatt/macistrano/tree/master) if you're interested in the source code.