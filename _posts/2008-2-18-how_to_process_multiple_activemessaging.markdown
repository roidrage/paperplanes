---
layout: post
title: "How to Process Multiple ActiveMessaging Queues Concurrently"
topics: activemessaging asynchronous rails ruby
---
The title totally overemphasizes the topic, but here we go. By default [ActiveMessaging](http://code.google.com/p/activemessaging/) will process all your queues in one thread. All messages from all queues will be processes sequentially. This isn't always what you want. Especially in scenarios where you have both long-running tasks being kicked off through messages, and rather short-lived tasks that you just fire and forget.

ActiveMessaging has a rather simple and not-so-obvious way of dealing with that: processor groups. There's some [documentation](http://code.google.com/p/activemessaging/wiki/Configuration) on them, but it doesn't bring out the real beauty of them.

Basically you split your processors in groups, how finely grained is up to you. A simple way would be to just separate long-running from short-lived tasks. You just have to define these in `config/messaging.rb`:

    ActiveMessaging::Gateway.define do |s|
      s.destination :index_update, '/queue/IndexUpdate'
      s.destination :giant_batch_job, '/queue/GiantBatchJob'
      s.processor_group :short, :index_update_processor
      s.processor_group :long, :giant_batch_job_processor
    end

Now that you have these, how do you get them to run in different threads? If you just use `script/poller start`, it will continue to work through all messages from all queues. You need to start each processor group individually:

    $ script/poller start ---- process-group=short
    $ script/poller start ---- process-group=long

Keep in mind though that you can't stop just one poller for one particular processor group. Running `script/poller stop` will tear them all down. Which comes in handy during deployments. That way you only have to ensure that all your process groups are started during the deployment, but not about stopping every one of them.

ActiveMessaging will run each group in a separate thread which all are monitored by the poller_monitor. The latter will only be started once, courtesy of the [daemons](http://daemons.rubyforge.org/) package.