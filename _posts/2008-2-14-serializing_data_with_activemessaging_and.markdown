---
layout: post
title: "Serializing Data with ActiveMessaging and Filters"
topics: activemessaging asynchronous rails ruby
---
I've been playing around with [ActiveMessaging](http://code.google.com/p/activemessaging/) recently. Well, actually more than that. I integrated it into a project for asynchronous processing. It's a pretty neat plugin. We're using [StompServer](http://stompserver.rubyforge.org/) as a message broker, and therefore the [Stomp](http://stomp.codehaus.org/) protocol to publish and poll the messages.

Now Stomp is a pretty simple protocol and breaks down when you're trying to deliver "complex" data structures like hashes, arrays or ****gasp**** objects. That's not a bad thing per se, since we can serialize them with YAML. Of course you could just always do that by hand before publishing a message, but let's face it, that's just tedious.

The author of ActiveMessaging [recently added support for filters](http://groups.google.com/group/activemessaging-discuss/browse_thread/thread/e68fddae16a965c6). They can be run after publishing a message and/or before processing it on the polling side. I hear it clicking on your end, why not use filters to do the serializing work for us? Right on!

Here's a simple filter to serialize the message when it's sent:

    class SerializeToYamlFilter < ActiveMessaging::Filter
      attr_accessor :options
  
      def initialize(options={})
        @options = options
      end

      def process(message, routing)
        if message.body.respond_to?(:to_yaml)
          message.body = message.body.to_yaml
        else
          message.body = YAML::dump(message.body)
        end
      end
    end

It uses the `to_yaml` method mixed in by Rails, if it's available. Otherwise it just dumps the object with the `YAML::dump` method.

The receiving end is even easier.

    class DeserializeYamlFilter < ActiveMessaging::Filter
      attr_accessor :options
  
      def initialize(options={})
        @options = options
      end

      def process(message, routing)
        message.body = YAML::load(message.body) rescue message.body
      end
    end

The filter respects potential deserializing errors and just returns the message body in that case. Otherwise it just loads the objects from the message body. And that's the whole story.

Now you need to configure it in `config/messaging.rb` and you're good to go:

    ActiveMessaging::Gateway.define do |s|
      s.filter :deserialize_yaml_filter, :direction => :incoming
      s.filter :serialize_to_yaml_filter, :direction => :outgoing
    end

The benefit? This way you can send more complex data structures (as opposed to just strings) through the broker:

    publish :my_queue, :action => 'do_stuff', :with => 'User', :id => 1

But remember to keep it simple. Don't try to stuff large objects through there. Sending over the user itself is very likely not a good idea, even more so when it's an ActiveRecord object.

More to come on a13g and Stomp.