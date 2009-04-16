---
layout: post
title: "Ruby 1.9 Upgrading Woes"
topics: ruby
---
Actually, not so much woes, as general musings. I just finished upgrading a project I've been maintaining for the last 15 months or so to Ruby 1.9, and I thought I'd share some of my experiences with the process. Looking back it wasn't so hard after all, but there were some pitfalls.

### General

In general the code base is not too big, and there were only some minor issues that needed to be taken care of, some syntactical changes were required, and that was pretty much it.

The biggest problems you're likely to run across are outdated libraries or gems you're using. A while ago mocha didn't fully support the new mini-test included in Ruby 1.9, but since version 0.9.5 it runs fine. I also had to upgrade Machinist, but these are just minor issues.

The site runs on Passenger, so the most recent version was in order, and it works like a charm.

I have yet to delve into potential encoding issues, since Ruby 1.9 complained about some characters in several strings, but the new encoding header should solve these no problem.

### MySQL

The biggest headscratcher, but just for a second. The official [MySQL gem](http://www.tmtm.org/en/mysql/ruby/) has received several updates, and the most recent version (2.8.1) runs just fine on Ruby 1.9, but unfortunately it's not available as a gem for convenient installation using the gem command. Thankfully Makoto Kuwata has stepped up and provides a nice gem on [GitHub](http://github.com/kwatch/mysql-ruby/tree/master). Install using `gem install kwatch-mysql-ruby -s http://gems.github.com`, and you're good to go.

Of course, for the future, the obvious choice should be to use the [MySQL Plus driver](http://github.com/espace/mysqlplus/tree/master) [powered by Neverblock](http://www.espace.com.eg/neverblock/blog/2008/08/28/neverblock-mysql-support/).

### RSpec

The specs didn't run at all for a starters, but that was due to the wrong test-unit gem being installed. Make sure you have version 1.2.3 installed, then the specs run no problem. Be sure to use the latest versions of the rspec and rspec-rails gems. RSpec has a [small wiki page](http://wiki.github.com/dchelimsky/rspec/ruby-191) dedicated to Ruby 1.9.1, so be sure to keep an eye on that.

### Cucumber

Cucumber had similar problems, it requires a class that only exists in the test-unit gem, so you definitely need to install that anyway. The features ran almost from the get-go, but there was on problem with date selects and webrat. When I didn't explicitly select a date, it would hand over weird array constructs to the controller, which in turn resulted in assignment errors from within ActiveRecord. The solution (for now) was to explicitly specify the date I wanted, but I'd much prefer being able to leave the defaults as they are.

### NewRelic

The RPM plugin references a method in Ruby's Thread class that are no longer available in Ruby 1.9. I had to manually remove the calls in the plugin to get it to work. All the changes are in `lib/new_relic/agent/instrumentation/dispatcher_instrumentation`. Look for `Thread.critical` and removed its usages. I have yet to find out if that in any way affects the plugin, but for now it'll have to do.

And yes, that was it for me. At least on that specific project. To sum up, I spent about two hours fixing the issues, and now, on Ruby 1.9, my full test suite is running about 30 seconds faster than on Ruby 1.8. Totally worth it, if you ask me.

The full results:

    1.8: rake spec features  68.72s user 4.03s system 91% cpu 1:19.89 total
    1.9: rake1.9 spec features  39.95s user 2.39s system 84% cpu 49.975 total

I'll be sure to try and use Ruby 1.9 for all upcoming projects. The speed gain alone justifies it for me.