---
layout: post
title: "Cocoa Lessons Learned #1: Threading is Hard"
tags: cocoa objective-c iphone
---
While working on iMacistrano (or iWebistrano if you fancy, either way my little iPhone toy project) I started moving things into background tasks and to use timers to fire off requests on a regular basis, specifically to create a deployment, and then to monitor its state.

I used an NSOperationQueue for the former, and initially an NSTimer for the latter. I sent notifications from the NSInvocationOperation object I stuffed into the queue to notify my controller when the event was finished. It doesn't really matter if you're using a notification or using direct method calls, one thing you have to make sure of: When you're updating GUI controls, pushing new controllers or whatnot, for the love of god, make sure you do all these things in the main thread.

I spent several hours trying to find out why on earth my UITextView wouldn't update, but other controls would. I started looking back at the changes that initially caused the problems, and eventually realized that I'm doing tasks in four different threads. Now that can't be good, especially considering that you're supposed to update the GUI from the main thread.

The simple solution is to use `performSelectorOnMainThread:` whenever you want to do just that. When you're in a different thread (which you will always be when you're using NSTimer, NSThread or NSOperationQueue), just call that method on whatever object you want to do stuff with the UI:

<script src="http://gist.github.com/63837.js"></script>

Easy as pie.

In other news, [is it 01234567890 yet](http://isit1234567890yet.com)?
