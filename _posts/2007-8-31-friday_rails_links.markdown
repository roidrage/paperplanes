---
layout: post
title: "Friday Rails Links"
tags: links rails ruby
---
It's been a week full of Rails joy, and a little pain as well, but that's not to looked for in Rails itself, but just some code.

* Been working with [attachment_fu](http://svn.techno-weenie.net/projects/plugins/attachment_fu/) this week. Basically tried out its S3 storage capabilities when I switched from a custom implementation. Pretty neato. I'm starting to dig S3 itself more and more. [Mike Clark](http://clarkware.com/) [wrote a nice tutorial](http://clarkware.com/cgi/blosxom/2007/02/24#FileUploadFu) on the subject.

* In [his newest tutorial](http://www.ibm.com/developerworks/web/library/wa-rspec/index.html?ca=drs-) on [developerWorks](http://www.ibm.com/developerworks/), [Bruce Tate](http://blog.rapidred.com/) writes about using [RSpec](http://rspec.rubyforge.org/) for behaviour-driven testing. Good stuff, I'm looking forward to [the tutorial](http://www.railsconfeurope.com/cs/railseurope2007/view/e_sess/14221) at [RailsConf Europe](http://www.railsconfeurope.com/) about Behavious-Driven Development.
* Chris Wanstrath [introduces](http://errtheblog.com/post/10722) [Ambition](http://projects.require.errtheblog.com/browser/ambition/README), an ActiveRecord extension that makes finding objects more Ruby-like. Being able to write

        User.select { |u| u.email =~ /chris/ }.first

 instead of

        User.find(:first, :conditions => ["email = chris"])`  

 feels at least a little bit more Ruby-ish. Still pretty new, but it looks promising. The full, glorious joy of features can be read in the [README](http://projects.require.errtheblog.com/browser/ambition/README).

* Finally, the [Softies on Rails](http://www.softiesonrails.com/) talk about what you always knew deep in your ruby-red heart: [Hashes are Cool](http://www.softiesonrails.com/2007/8/27/ruby-101-hashes-are-cool)!