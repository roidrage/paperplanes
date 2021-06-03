---
layout: post
title: Crumble - Breadcrumbs for Rails Applications
tags: rails plugin
---
I recently had to improve the breadcrumbs situation on one of my projects. Until now, breadcrumb definition were sprinkled across the controllers. While that was okay for a while, the current breadcrumbs have become a bit more complex, and I wanted to get them out of the controllers. One option would've been to put them into the model, but seriously, who does that? Plus, I have a lot of breadcrumbs that are not exactly related to a model, and if they are, it's not always an ActiveRecord model.

Instead I wanted a simple configuration file. I started out with a combination of arrays and hashes put into  global variables, but that turned out to be a mess. What I really wanted, was something like this:

<script src="http://gist.github.com/126325.js"></script>

There, much nicer. In the view, all I really wanted to do was, instead of manually assembling all the crumbs in place:

    <%= crumbs %>

What evolved naturally was a simple API and with a potential plugin, so there you go. It's called Crumble and lives on the [GitHubs](http://github.com/mattmatt/crumble). You can read all the glory details on its usage in the README. I'm sure to add some more stuff, but for the moment I wanted to keep it simple, and have it support the needs of the project. If you have something to add, fork away.