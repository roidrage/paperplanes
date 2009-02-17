---
layout: post
title: "A Fix for Rails 1.2"
topics: rails ruby
---
While setting up a new project with Rails 1.2.3 I ran across a weird issue in my tests. Somewhere from the CGI class (belonging to Ruby's core lib and extended by Rails) a nil object was used and threw an error. Turns out this was introduced in 1.2.2 with a fix that was supposed to improve CGI handling on Windows.

The <a href="http://dev.rubyonrails.org/ticket/7581">issue</a> has been fixed in the <a href="http://dev.rubyonrails.org/changeset/6448">stable branch of Rails 1.2</a>, but if you're stuck with 1.2.3 or 1.2.2 you can do what I do: use a plugin. I took this opportunity to write my first, so <a href="/files/rails12x_cgi_fix.zip">here</a> it is.

Sorry I don't have a fancy SVN set up for your plugin-script-using pleasure, but this is a tiny fix anyway.

Though this was a rather annoying bug the fix emphasizes the beauty of Rails and Ruby: It's easy to extend and even to fix.