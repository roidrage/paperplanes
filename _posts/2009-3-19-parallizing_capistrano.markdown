---
layout: post
title: Parallelizing Capistrano
topics: capistrano deployment
---
On a recent project we ran into a situation where we needed a more advanced way of parallelizing Capistrano tasks than just using the parallel method it already sports. To jog your memory, parallel can run arbitrary shell commands in parallel on different servers. So if you wanted your webserver to already restart the processes while you restart your background processes, you can do it like this:

    parallel do |session|
      session.when 'in?(:web)', 'script/spin'
      session.when 'in?(:daemon)', 'script/daemons restart'
    end

You can even use it to run tasks in parallel on the same hosts, but it looks ugly, and it only works for shell commands. So we came up with a neat extension that lets you run arbitrary blocks of code in parallel. Obviously you'd usually call tasks in those blocks, but who knows. Let's just have a look at an example.

    parallelize do |session|
      session.run { deploy.restart }
      session.run { daemons.restart }
    end

Neat! We're aware that the name might not be perfect, suggestions welcome, but for now it'll do. What it does is run each block in a different thread. Due to some internal Capistrano limitations it also opens a new SSH session for each thread. That's a bit of a bummer, but we'd have to rework a lot of the command code of Capistrano to get that to work with multiple threads. It also means that you should usually limit the amount of tasks you run at any one time, but thankfully you can either do that by setting the `parallelize_thread_count` variable. It defaults to ten concurrent thread. parallelize will run all the blocks in chunks corresponding to that size, and will only run the next chunk when all blocks in the first finished successfully.

You can also hand in the chunk size directly, since it sometimes just doesn't make sense to run as many tasks in one go as possible, especially when they're run on just one host. It might just take longer to run them all in parallel than to ran two batches one after the other. So it's easy to specify the chunk size for specific tasks.

    parallelize(5) do
      session.run { deploy.restart }
      session.run { daemons.restart }
    end

If one of the tasks in the specified blocks causes a rollback or raises an error, then parallelize will run the rollback on all the other threads and on the main thread. Now, in general I wouldn't recommend running too many tasks in parallel that require big rollback procedures, but just in case you're into that sort of thing, knock yourself out.

We could see a considerable improvement in deployment speed, especially during the time-critical tasks. The project is up on [GitHub](http://github.com/mattmatt/cap-ext-parallelize), and it might just be moved into the capistrano-ext module in the future. Install using

    gem install mattmatt-cap-ext-parallelize -s http://gems.github.com

And then in your Capfile, insert this line

    require 'cap_ext_parallelize'

Let [us](mailto:capistrano@peritor.com) know if you have any problems.