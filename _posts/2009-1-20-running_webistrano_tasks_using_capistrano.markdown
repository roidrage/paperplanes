---
layout: post
title: "Running Webistrano Tasks Using Capistrano"
tags: ruby
---
It's no secret that I totally dig [Webistrano](http://labs.peritor.com/webistrano). It's superior to just using Capistrano in so many ways. Although I'm still working on [Macistrano](http://github.com/mattmatt/macistrano) (it's bound to be released soon as well, I promise), some people I told Webistrano about asked me if they still could use a simple `cap deploy` to fire off a deployment.

Obviously I told them "No", but I thought about the problem, and it turns out it shouldn't be that hard. Basically you need to hook into Capistrano and hijack all the defined tasks and callbacks. Turns out that this is not too hard, so I gave it a shot, and the result is a simple gem called `cap-ext-webistrano`.

It's a drop-in replacement which hooks into Capistrano and replaces all tasks with one that sends the task to Webistrano. Neat, huh? So if you want to take advantage of Webistrano, but are still attached to your command line, this is the tool for you.

Integration is easy. Install the gem using `gem source -s https://gems.github.com` and `gem install mattmatt-cap-ext-webistrano`.

You'll still need Capistrano's default configuration files. You'll need to add two lines to your Capfile. Also you can use Capistrano's way of setting variables to configure the plugin. Patch your deploy.rb file according to the example below, and you're all set.

<script src="http://gist.github.com/49553.js"></script>

The gem is up on [GitHub](http://github.com/mattmatt/cap-ext-webistrano), so feel free to fork and send patches.