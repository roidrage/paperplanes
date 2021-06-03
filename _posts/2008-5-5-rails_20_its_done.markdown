---
layout: post
title: "Rails 2.0: It's Done"
tags: rails ruby thedailygrind
---
After more than two days of removing deprecation warnings, adding plugins, fixing some custom additions, going through the whole application, it's finally done. We're running Rails 2.0. Nothing more gratifying than seeing this, well except for the application running without problems:

<img src="http://img.skitch.com/20080421-1qxtnd66agwxxs1g3f2kii5wxn.jpg" alt="Picture 1"/>

There were some minor annoyances, but in all it was straight-forward work. One thing was that acts_as_ferret 0.4.0 does not work with Rails 2.0.2, but the upgrade to 0.4.3 doesn't go without any pain either. In 0.4.1 index versioning was introduced which will happily start indexing your data when you first access the index.

Be sure to have the [exception notifier plugin](http://agilewebdevelopment.com/plugins/exception_notifier) ready, that will help you find some of the bugs you might have overlooked.

Rails 2.1, we're ready for you!