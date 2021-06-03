---
layout: post
title: "CruiseControl.rb and RSpec Play Nice"
tags: continuousintegration cruisecontrol rails rspec ruby testing
---
When using [CruiseControl.rb](http://cruisecontrolrb.thoughtworks.com/) for continuous integration, and RSpec for testing, the defaults of CruiseControl.rb don't play that nice with RSpec. However, that can be remedied pretty simply.

By default CruiseControl.rb runs its own set of Rake task, which invoke a couple of Rails' tasks, including `db:test:purge`, `db:migrate` and `test`. You do want the first ones, but you'd rather have CruiseControl.rb run your specs instead of your the (most likely non-existing) Test::Unit tests.

Before running its default tasks it checks whether you have a specific task configured in your project settings, and if you have a task called `cruise` in your project's Rakefiles. You can use both, but I just declared a task `cruise` in the Rakefile, and I was good to go.

That task can to pretty much the same as the original CruiseControl.rb implementation, and even be shorter since it can be tailored for your project, but invokes `spec` instead of `test`. One caveat is to set the correct environment before running `db:migrate`. I split out a tiny `prepare` task which does just that, and can do a couple of other things, if necessary, like copying a testing version of your database.yml.

    desc "Task to do some preparations for CruiseControl"
    task :prepare do
      RAILS_ENV = 'test'
    end

    desc "Task for CruiseControl.rb"
    task :cruise => [:prepare, "db:migrate", "spec"] do
    end

Simple like that. The task `spec` will automatically invoke `db:test:purge`, so you don't need that.