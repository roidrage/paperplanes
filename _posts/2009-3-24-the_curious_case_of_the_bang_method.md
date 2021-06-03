---
layout: post
title: The Curious Case Of The Bang Method
tags: ruby
---
One of the cool things about Ruby is the possibility to make your method's intent more expressive using the question mark or the bang. There's no need to argue about the use of the question mark method, their intent is to ask something, whether it's the the status of an object or if the current weather is suitable for getting out your longboard. Their result will usually be true or false, including nil or not nil.

The other punctuation mark method on the other hand, the bang method, has lead to some confusion as to what its intent really should be. I'm guilty as charged here, a long time I was confused about the difference of using a bang at the end of your method name really means. I guess I should thank David Black for making me (and everyone else) aware of what the difference between a method with a bang and a method without a bang really is.

And here is where the confusion already starts, there being a difference would imply that there need to be two different methods, like in Rails, you have `save` and you have `save!`, `create` and `create!`, and so on. They usually differ in that the bang version will raise an error, and the normal version will return a value with which it will tell the caller that the call succeeded or failed.

A weird notion arose from that, and I have found in it lots of projects. The notion is that when a method calls save it changes the object, and therefore can have a bang at the end, because it's doing something potentially dangerous. Hold on, saving an object is something dangerous? If you're thinking about it this way, you might as well start banging your methods (pun intended) throughout your project.

A simple example:

    def publish!
      self.published_at = Time.now
      save
    end

Now, to use the method in your code, we could have something like this:

    if !publish!
      # ...do whatever you do in this case
    end

I don't know about you but that just looks confusing to me. You're abusing a method whose intent is to signalize that you're doing something potentially dangerous to simply make it "obvious" that your method also saves the object. If you're going down this road, then why not write the name using all uppercase?

    def PUBLISH!
      self.published_at = Time.now
      save
    end

There, that'll show 'em. If you really want, you can use `define_method` and give a method name like "PUBLISH!!!".

The Rails extension [inherited\_resource](http://github.com/josevalim/inherited_resources/tree/master) pushes this a little bit too far, and thank goodness you don't have to use the following way of implementing your RESTful actions:

    def destroy
      destroy! do |format|
        format.html { redirect_to projects_url }
      end
    end

Here `destroy!` is an alias for the method `destroy` in the superclass. The reasoning is that calling super is not readable, and using `destroy!` gives it a more DSL-like lookie. I just find this style of using bang methods extremely confusing, and the intention is far from being clear. You'd expect `destroy!` to do something "dangerous", but it's just an ugly way to call the `destroy` method in the superclass. But the story on super is a totally different story, and material for another blog post.

What you should be doing instead is something along the lines of this:

    def publish
      self.published = Time.now
      save
    end
    
    def publish!
       publish or raise "Couldn't publish"
    end

A bang method should exist together with a non-banged version, or to have a dangerous and a non-dangerous version of your method. Whatever dangerous means depends on the context of your method, but you get the idea.

No need to use if, when someone fancies the bang version, he can just go ahead and use it anywhere. This is how several state machine plugins implement their state changing methods, heck, this is how the Ruby standard library uses it, and this is how you should build your own methods. The bang is not a way to just express that the call will change something in your object, that's what methods on objects usually do, big surprise.

I recommend reading over David Black's [post on the issue](http://dablog.rubypal.com/2007/8/15/bang-methods-or-danger-will-rubyist), it sure gave me a clearer picture. I've written no new bang method since then, because if you think about it, you don't have the case very often where you actually need two versions of the same method. In a library sure, but in your application? Meh. Using non-banged methods in my opinion makes code a lot clearer, especially when you accept the notion that the bang method should only exist in the context of a non-banged version.