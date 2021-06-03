---
layout: post
title: Hello From Jekyll
tags: blog miscellany
---
I got a little sick of having to maintain an unmaintained blog engine (I'm looking at you [SimpleLog](http://simplelog.net)), so I did what all the cool kids are doing, I switched the blog to using Tom Preston-Werner's excellent [Jekyll](http://github.com/mojombo/jekyll). I threw in a few tweaks of my [own](http://github.com/mattmatt/jekyll), and tweaked my Rakefile and Apache to support things that SimpleLog can do, but the static nature of Jekyll can't. Thankfully, the URL format of both is pretty similar, so it was pretty easy to set up redirects from the old URLs to the new ones.

For comments, I welcome [Disqus](http://disqus.com).

The full blog is on [GitHub](http://github.com/mattmatt/paperplanes), feel free to look at the deployment scripts and the build file. The latter uses Jekyll as a library to generate pages for all topics used in the posts. Nothing short of rocket science, I'm telling you.

Why you ask? Because a simple text file wins over a database system any day, and using cap deploy to update a blog entry is just outright cool.