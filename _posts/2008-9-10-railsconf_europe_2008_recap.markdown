---
layout: post
title: "RailsConf Europe 2008 Recap"
topics: rails railsconf ruby
---
RailsConf Europe 2008 is over (and has been for a few days now, I know), so it's time for a recap. In all it was much better than I expected, last year's conference was a bit of a disappointment, so my expectations were low enough to be positively surprised.

Bratwurst on Rails was, if not a huge success, a great event nonetheless. Probably because of the rain not as many people showed up. There werre around 200 guests, but I sure hope they had a good time. In the end most of the cupcakes were gone, and all the bratwursts. So it's all good.

Day 1 started with the tutorial sessions, including one I hosted with [Jonathan Weiss](http://blog.innerewut.de/) on deploying and monitoring Rails applications. Over the course of four hours we gave an introduction on deployment setups, doing the dirty-work with Capistrano, and doing basic monitoring. The slides are up on Slideshare, enjoy!

<div style="width:500px;text-align:center" id="__ss_581476"><a style="font:14px Helvetica,Arial,Sans-serif;display:block;margin:12px 0 3px 0;text-decoration:underline;" href="http://www.slideshare.net/jweiss/deploying-and-monitoring-rails-presentation?type=powerpoint" title="Deploying And Monitoring Rails">Deploying And Monitoring Rails</a><object style="margin:0px" width="425" height="355"><param name="movie" value="http://static.slideshare.net/swf/ssplayer2.swf?doc=deployingandmonitoringrails-1220476247140491-9&stripped_title=deploying-and-monitoring-rails-presentation" /><param name="allowFullScreen" value="true"/><param name="allowScriptAccess" value="always"/><embed src="http://static.slideshare.net/swf/ssplayer2.swf?doc=deployingandmonitoringrails-1220476247140491-9&stripped_title=deploying-and-monitoring-rails-presentation" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" width="425" height="355"></embed></object><div style="font-size:11px;font-family:tahoma,arial;height:26px;padding-top:2px;">View SlideShare <a style="text-decoration:underline;" href="http://www.slideshare.net/jweiss/deploying-and-monitoring-rails-presentation?type=powerpoint" title="View Deploying And Monitoring Rails on SlideShare">presentation</a> or <a style="text-decoration:underline;" href="http://www.slideshare.net/upload?type=powerpoint">Upload</a> your own. (tags: <a style="text-decoration:underline;" href="http://slideshare.net/tag/scaling">scaling</a> <a style="text-decoration:underline;" href="http://slideshare.net/tag/loadbalancing">loadbalancing</a>)</div></div>

The day ended with a panel consisting of David Heinemeier Hansson, Jeremy Kemper and Michael Koziarski. They talked pretty much with themselves for the lack of questions from the audience. Someone came up with the question (probably for the millionth time), if Rails is gonna switch to RSpec for testing.

RejectConf sure was a highlight in itself. Good fun, entertaining people and drinks in a pleasant environment. What more could you ask for?

Second day started off with David's keynote, and I gotta say, it was most excellent. He talked about legacy code. Still working on the oldest piece of Rails software he knows his fair share about it. Lots of programmers coming to Rails tend to forget that eventually every new project they work on will turn into legacy code, and needs to be maintained. So David's talk took the more inspirational approach, compared to his previous keynotes.

Quick summing up of the day's sessions:

 * Jon Dahl's talk gave a good introduction on MapReduce, not specific to a certain framework, but to how MapReduce works.

 * Yehuda Katz's talk on jQuery sure filled up the seats quickly. And it actually was a pretty good introduction. Favorite quote (more or less accurately): "Valid markup is when every browser can display it, not when the validator says it's valid."

 * Intellectual Scalability presented an approach on how to scale applications by separating them into different micro-applications running on different servers.

 * Wilson Bilkovich's talk on Rubinius gave some updates on the state of Rubinius, but was probably more interesting for people interested in building compilers (LLVM, if you must know).

 * Jonathan's talk on Security on Rails attracted a big crowd too, and rightly so. Hadn't seen it before, so I can safely say I learned some things as well.

The day ended with Jeremy Kemper's keynote, though I think that it'd have fit better into a normal session. It was a good talk on performance of Rails applications, but it wasn't exactly keynote material.

I attended the BoF sessions on MagLev and Merb, and both were pretty good. One thing I didn't understand is the heat some people gave the guy from GemStone. MagLev is still in its early stages, but I'm so looking forward to giving it a spin once it's ready for the public.

On to day two

 * It started off with with Matt Wood's talk on Genomes on Rails. He's working on an impressive project, involving an even more impressive amount of data.

 * Jay Fields talked about lessons learned from functional testing. Pretty good talk. I can't say it was all news to me, but still a good inspiration for people not yet into testing.

 * Justin Gehtland's talk on Small Things, Loosely Joined and Written Fast sure was one of the best of show. He's an excellent presenter, and introduced using ActiveMessaging and RubyCAS (welcome to my list of things to try out) to keep things loosely coupled.

 * For lack of anything more interesting I attended the talk on "Treading Rails with Ruby Shoes". Let's just say it was a different approach on presenting. And that's that.

 * Tammo Freese flashed the crowd with some serious Ruby meta magic afterwards. Tough stuff, but it still matters to people writing and/or using plugins.

 * I finished off the day with Adam Keys' talk on handling complexity in Rails applications. While nothing new to me (I'd used the things he mentioned in several projects already) it gave a pretty good overview on how to handle some of the complexity in Rails applications.

In all it was a pretty good conference, I met a lot of nice people and had a pretty good time. Sadly it won't be in Berlin next year, but let some other European city be the center of the Europe Rails community for a change.

If you're up for more details on the sessions, [Clemens Kofler](http://www.railway.at) has [excellent coverage](http://www.railway.at/articles/tag/railsconf).