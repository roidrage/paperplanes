---
layout: post
title: "Multi-Database Connectivity in Rails"
topics: rails ruby
---
Kudos to Dr. Nic for <a href="http://drnicwilliams.com/2007/04/12/magic-multi-connections-a-facility-in-rails-to-talk-to-more-than-one-database-at-a-time/">this one</a>. At least a discussion filled with <a href="http://www.loudthinking.com/arc/000610.html">arrogance</a> and <a href="http://www.loudthinking.com/arc/000608.html">finger-pointing</a> turned out something useful.

I worked on a similar problem two weeks ago and came up with a pretty similar solution, though without the fanciness of just defining new databases in database.yml and having the classes in corresponding modules automatically.

To sum up: no jealousy, I'm just glad other's have taken a very similar approach. I just wish, Alex Payne of <a href="http://www.twitter.com">Twitter</a> would've given <a href="http://www.radicalbehavior.com/5-question-interview-with-twitter-developer-alex-payne/">this interview</a> a little earlier.