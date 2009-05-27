---
layout: post
title: RailsWayCon Slides
---
I'm having a great time at RailsWayCon in Berlin. The line-up of speakers is pretty neat, and even though the venue has some flaws, it's still a cool conference. I'm glad it's also in Berlin.

I gave a talk on "The Current State of Asynchronous Processing in Ruby" on day one, so without further ado, here are the slides for the talk:

<div style="width:520px;text-align:left" id="__ss_1490166"><a style="font:14px Helvetica,Arial,Sans-serif;display:block;margin:12px 0 3px 0;text-decoration:underline;" href="http://www.slideshare.net/mattmatt/the-current-state-of-asynchronous-processing-with-ruby?type=powerpoint" title="The Current State of Asynchronous Processing With Ruby">The Current State of Asynchronous Processing With Ruby</a><object style="margin:0px" width="520" height="430"><param name="movie" value="http://static.slidesharecdn.com/swf/ssplayer2.swf?doc=asynchronousprocessingwithruby-090526093247-phpapp02&stripped_title=the-current-state-of-asynchronous-processing-with-ruby" /><param name="allowFullScreen" value="true"/><param name="allowScriptAccess" value="always"/><embed src="http://static.slidesharecdn.com/swf/ssplayer2.swf?doc=asynchronousprocessingwithruby-090526093247-phpapp02&stripped_title=the-current-state-of-asynchronous-processing-with-ruby" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" width="520" height="430"></embed></object></div>

Here's a link list of tools I mentioned in the talk:

* [run_later](http://github.com/mattmatt/run_later/tree/master)
* [delayed_job](http://github.com/tobi/delayed_job/tree/master)
* [ActiveMessaging](http://code.google.com/p/activemessaging/), though I wouldn't recommend using it anymore, development has ceased
* [ActiveMQ](http://activemq.apache.org/)
* [RabbitMQ](http://www.rabbitmq.com/)
* [Nanite](http://github.com/ezmobius/nanite/tree/master/)
* [Amazon SQS](http://aws.amazon.com/sqs/)
* [Daemons](http://daemons.rubyforge.org/)
* [BackgrounDRb](http://backgroundrb.rubyforge.org/)
* [job_fu](http://github.com/jnstq/job_fu/tree/master)
* [AP4R](http://ap4r.rubyforge.org/wiki/wiki.pl?HomePage)
* [rufus-scheduler](http://rufus.rubyforge.org/rufus-scheduler/)

Here's also the code for my little, hand-made job poller. Use it at your own risk.

<script src="http://gist.github.com/118536.js"></script>