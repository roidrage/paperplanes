---
layout: post
title: "A Weird Ruby Bug"
topics: ruby thedailygrind
---
I ran across a weird bug the other day that seems to have been fixed in Ruby 1.8.5. It's nonetheless quite an interesting one. When you use a hash as a method parameter, and that hash happens to contain the key `:do` and you call the method without parentheses, like so:

    def my_method(opts)
    end

    method :do => "commit"

It works when you put parentheses around the parameter:

    method(:do => "commit")

Putting it in front of other entries doesn't work though. Ruby seems to think I want to start a block where it's not allowed. Putting the `do` into a string works just fine, of course.

Funny stuff. No mention in the Ruby changelogs, but it does work in later versions.