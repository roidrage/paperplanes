---
layout: post
title: A Simple Redis Use Case for Sorted Sets
tags: redis
---
_Interested in Redis? You might be interested in the [Redis Handbook](http://redishandbook.com) I'm currently working on._

Over at [Scalarium](http://scalarium.com) we constantly find outselves adding new statistics to track specific parts of
the system. Thought it'd be a good idea to share some of them, and how we're using Redis to store them.

Yesterday I was looking for a way to track the time it takes for an EC2 instance to boot up. Booting up in this case
means, how long it takes for the instance to change from state "pending" to "running" on EC2. Depending on utilization
and availability zone this can take anywhere from 30 seconds to even 30 minutes (us-east, I'm looking at you). I want to
get a feel for how long it takes on average.

We poll the APIs every so many seconds, so we'll never get an exact number, but that's fine. It actually makes the
tracking easier, because the intervals are pretty fixed, and all I need to do is store the interval and increment a
number.

Sounds like a job for a sorted set. We could achieve similar results with a hash structure too, but let's look at the
sorted set nonetheless, because it's pre-sorted, which suits me well in this case. For every instance that's been booted
up I simply store the interval and increment the number of instances.

In terms of a sorted set, my interval will be the member in the sorted set and the number of instances falling into that
particular interval will be the score, the value determining the member's rank. Advantage here is that the set will
automatically be sorted by the number of instances in that particular interval, so that e.g. the interval with the most
instances always comes first.

We don't need anything to get started, we just have to increment the score for the particular interval (or member), in
this case 60 seconds, Redis will start from zero automatically, I'll use the Redis Ruby library for brevity.

    redis.zincrby('instance_startup_time', 1, 60)

Another instance took 120 seconds to boot up, so we'll increment the score for that interval too.

    redis.zincrby('instance_startup_time', 1, 120)

After some time we have added some good numbers to this sorted set, and we can start keeping an eye on the top five.

    redis.zrevrange('instance_startup_time', 0, 4, :with_scores => true)
    # => ["160", "22", "60", "21", "90", "10", "120", "10", "40", "5"]

The default sort order is ascending in a sorted set, hence we'll get a reverse range (using the `zrevrange` command) of
the five intervals with the highest score, i.e. where the most instances fall into.

To get the number of instances for a particular interval, we can use the `zscore` command.

    redis.zscore('instance_startup_time', 60)
    # => 21

To find the rank in the sorted set for a particular interval, e.g. to find out if it falls into the top five intervals,
use `zrevrank`.

    redis.zrank('instance_startup_time', 160)
    # => 0

Now we want to find the intervals where a particular number of instances fall into, say everything from 10 to 20
instances. We can use `zrangebyscore` for this purpose.

    redis.zrangebyscore('instance_startup_time', 10, 20, :with_scores => true)
    # => ["120", "10", "90", "10"] 

Note that Redis has some nifty operators where you can e.g. ask for every interval that has more than 10 instances,
using the `+inf` operator, useful when you don't know the highest score in the sorted set.

    redis.zrangebyscore('instance_startup_time', 10, '+inf', :with_scores => true)
    # => ["120", "10", "90", "10", "60", "21", "160", "22"]

Now you want to sort the sorted set by the interval, e.g. to display the numbers in a table. You can use the `sort`
command to sort the set by its elements, but unfortunately there doesn't seem to be a way to get the scores in the same
call.

    redis.sort('instance_startup_time')
    # => ["20", "40", "60", "90", "120", "160"]

To make up for this you could iterate over the results and fetch the results in one go using the `multi` command.

    members = redis.sort('instance_startup_time')
    redis.multi do
      members.each do |member|
        redis.zscore('instance_startup_time', member)
      end
    end

So far we've stored all numbers in one big sorted set, which will grow over time, making the statistical numbers very
broad and less informative. Suppose we want to store daily metrics and then run the numbers weekly and monthly. We just
used a different key derived from the current date.

    today = Date.today.strftime("%Y%m%d")
    redis.zincrby("instance_startup_time:#{today}", 1, 60)

Suppose we have collected data in the last two days. Thanks to `zunionstore` we can add the two sets together. Assume
you have data from all days of the week, then you can use `zunionstore` to accumulate that data and store it with a
different key.

    redis.zunionstore('instance_startup_time:week49',
                      ['instance_startup_time:20102911', 'instance_startup_time:20103011'])

This will create a union of the sorted sets for the two subsequent days. The neat part is that will aggregate the data
of the elements in the sets. So if on the one day 12 instances took 60 seconds to start and on the second 15, Redis will
create the sum of all the scores. Neat, huh? What you get is a weekly aggregate of the collected data, of course it's
easy to create monthly data as well.

Instead of summing up the scores you could also store the maximum or minimum across all the sets.

    redis.zunionstore('instance_startup_time:week49',
                      ['instance_startup_time:20102911', 'instance_startup_time:20103011'],
                      :aggregate => 'max')

Of course you could save the extra union and just create counters for days, weeks and months in one go, but that
wouldn't give me much material to highlight the awesomeness of sorted set unions now, wouldn't it?
    
You could achieve a similar data structure by using hashes, but you can do some neat things on sorted sets that you'd
have to implement manually with hashes. Sorted sets are pretty neat when you need a weighed counter, e.g. download
statistics, clicks, views, prelisted by the number of hits (scores) for the particular element.
