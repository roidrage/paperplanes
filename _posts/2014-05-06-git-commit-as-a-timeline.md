---
title: Git Commit Messages as a Timeline of Reasoning
topics: git development
layout: post
---
We're now more than two years into building, maintaining and growing the code
base for [Travis CI](https://travis-ci.org). A lot has happened in the code
base, especially in the first year of our existing as a company. Lots of code
was moved around, refactored, changed, improved, or written from scratch.

While Travis CI is overall simple, some part of the code relies on complex
logic, in particular handling everything in and around the state of a build.

The more the code's been touched, with new states being added, the harder it's
been to follow along why it was changed.

Most classes have some coverage with comments, but code comments have one
distinct flaw. **While code changes frequently, its comments rarely do.**

My first reflex when looking at a piece of code, wondering why it is the way it
is, is to look at the git history. While `git blame` has an unfortunately
negative connotation, it does provide the basic clues as to where to look for
the answers.

Thankfully, in Vim, `:Gblame` (courtesy of [fugitive](https://github.com/tpope/vim-fugitive)) 
provides a good way to start digging.

This is where I changed the way I write and commit code in the past couple of
month. I think about future me, future anyone who looks at my code, thinking
what the hell is going on here and why?

When they look at a commit message no longer than some 50 characters and a code
patch, will they be able to figure out what's going on, why I made this change?

Knowing present and past me, I know they don't. Things are easily forgotten, and
a year later no one will remember why something was changed.

For these future mes and someone else, **commit messages are the one true
history of why a piece of code has changed** and how, by way of the diff.

Nowadays, I add detailed commit messages to even the smallest changes. As soon
as they touch something that affects the bigger picture or has some reasoning
outside of what's visible in the code, the commit message should reflect that.

It turns into a diary of what you've been up to, and it's going to help yourself
and everyone else looking at your code.

**Write good, clear and detailed commit messages. Future you will thank present
you for it.**

Mislav has a [lot more detail on the commit
history](http://mislav.uniqpath.com/2014/02/hidden-documentation/) as the
ultimate truth for a code base's timeline, it's good stuff.
