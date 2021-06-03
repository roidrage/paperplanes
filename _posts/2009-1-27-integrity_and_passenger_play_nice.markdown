---
layout: post
title: "Integrity And Passenger Play Nice"
tags: continuousintegration rails ruby
---
I wanted to play the field of continuous integration tools a little bit more, so I finally gave [Integrity](http://www.integrityapp.com/) a go. Its promise of being lightweight sure was tempting.

It's a small [Sinatra](http://sinatra.github.com/) app, and therefore should've been easy to set up using [Passenger](http://modrails.com). The Integrity team recommends using [nginx](http://nginx.net) and [Thin](http://code.macournoyer.com/thin/). Though I'm rather fond of nginx, I don't see any point using a different setup just for my CI system.

Getting it up and running is rather straight-forward. You create your local Integrity template directory using `integrity install /path`. For this to work with Passenger you also need a directory public in that directory, so if you create that you can just throw the [usual Passenger virtual host block](http://www.modrails.com/documentation/Users%20guide.html#_rack_specific_options) into your Apache configuration, the document root pointing to the freshly created public directory, and you're good to go. In the current master, there's already a fix for this issue, and running `integrity install` will create the public directory for you.

I have some gripes with Integrity though, one of them being that configuring notifiers for projects currently seems to be broken. It's sort of a big deal to me, because continuous integration lives from the team receiving notifications.

But otherwise, do give it a go, it's pretty slim and pretty slick too, though it doesn't yet have asynchronous building. It needs some sort a hook, e.g. a GitHub one to run automatically. There's also a [demo](http://builder.integrityapp.com/) available for your viewing pleasure.

Update: The issue with notification configuration not being saved seems to be resolved in the current master. It's not perfectly fixed, but at least now I can have Integrity notify me through Twitter. So if you need to, fetch the master, and build your own gem. Remember to rename it to 'foca-integrity' in the Rakefile's Jeweler configuration, otherwise it won't really catch on.