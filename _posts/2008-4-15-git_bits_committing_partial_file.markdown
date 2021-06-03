---
layout: post
title: "Git Bits: Committing Partial File Changes"
tags: git
---
As if there weren't enough reasons to love it, I came across a nice little article by [Ryan Tomayko](http://tomayko.com/) called ["The Thing About Git"](http://tomayko.com/writings/the-thing-about-git). He describes how to do partial commits of only some selected changes in specific files instead of having to commit the whole file. `git add --patch` to the rescue. Neat stuff. I still like `git stash`, but being able to commit specific changes while leaving others untouched in the local repository can come in handy from time to time.

I'm currently using Git as a [gateway drug](http://www.robbyonrails.com/articles/2008/04/10/git-svn-is-a-gateway-drug) on a Subversion repository, and I'm getting more and more fond of it every day.

Via [GitHub](http://github.com/blog/37-git-tricks).