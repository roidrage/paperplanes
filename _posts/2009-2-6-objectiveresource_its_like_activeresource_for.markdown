---
layout: post
title: "ObjectiveResource: It's Like ActiveResource For Cocoa"
tags: objective-c cocoa iphone
---
The guys at [Y|Factorial](http://www.yfactorial.com) put it in a lot of effort in a new framework for Cocoa which mimics the functionality of ActiveResource. It's ingeniusly called [ObjectiveResource](http://github.com/yfactorial/objectiveresource/tree/master), and acts as (having a worst Rails plugin names flashback while writing this) a bridge between your Cocoa (yes, that includes iPhone) applications and RESTful Rails applications.

Below are the two versions compared, one using good old ActiveResource, and one using ObjectiveResource.

<script src="http://gist.github.com/59322.js"></script>

In ObjectiveResource it's not all that easy due to the nature of Objective-C and multiple declaration of classes, their properties and interface and implementation, it's still easy enough to use.

I played with it for a couple of hours yesterday, and it was really easy to work with. Sure, it still has some quirks, but the code is an easy read. As a matter of fact, you should really have a good look at it, it's well-tested, well-structured and a nice introduction into things you can do with Cocoa without using the UI features.

Nested resources are still sort of a pain though, they're just not as simple as the ActiveResource version, but I'm thinking there might be room for improvements.

<script src="http://gist.github.com/59330.js"></script>

<img src="http://img.skitch.com/20090206-p7rm638qh4sjjxusisu8gradty.jpg" alt="Picture 1" style="float:right; margin-left: 10px"/>

Of course I used everyone's favorite deployment tool [Webistrano](http://labs.peritor.com/webistrano) as a base for my playground project, because let's face it, you want to be able to run deployments from the comfort of your seat in the subway, just before you head into a no-reception zone.

The fruits of my labors are available for your forking pleasure on the [GitHubs](http://github.com/mattmatt/imacistrano/tree/master), and basically makes use of the UITableViewControllers which are a real pleasure to work with.

I love it when two communities merge their ideas of simple-enough programming, and stuff like ObjectiveResource pops out at the end. Another sign that learning new programming languages every once in a while will benefit the ways you program in the languages you already know.

ObjectiveResource won't be the only project that brings together ideas from Ruby and Rails with Objective-C and Cocoa, so they set up camp at a [new website](http://www.iphoneonrails.com/).