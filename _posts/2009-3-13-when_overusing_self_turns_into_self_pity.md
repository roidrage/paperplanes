---
layout: post
title: When Overusing self Turns Into self.pity
topics: ruby
---
There's something I see in lots of projects is an overuse of `self`. Sure, it looks a lot nicer than `this`, but its overuse can clutter code quite easily. Here's a rather simple example.

    def published?
     !self.deleted_at? && self.published_at?
    end

Others use self even for just calling a method from another method. Why's that again? I just don't get it, it feels unnecessary, and is just five characters too much for every usage.

Sometimes I think that the programmer who wrote the code either doesn't understand the concept of the current scope of self and when using it is necessary, or is coming from Python (no offense Python, I still like you, but I'm not so fond of your usage of self). Let's remedy that, shall we?

Some also claim that it improves clarity, for the courtesy of other programmers working on the code, and to make it clearer in what context the method is called. If you need to make that clear, your method is simply too long.

The biggest confusion surrounding the usage of self from within a method stems from the different handling of local variables and method lookup. Consider the following code:

    def publish
      self.published_at = Time.now
      save
    end

It's a totally valid piece of code, and one I can totally get on board with, because it does what it's supposed to do. In my early days with Ruby, I used to write the code like this:

    def publish
      published_at = Time.now
      save
    end
    
Then I wondered why the instance variable `published_at` wasn't saved. The answer is simple. When you have something that looks like local variable, and you assign to it, Ruby will obey and create a new local variable called `published_at`, no matter if you have a write accessor defined that looks exactly like it. It will go out of scope as soon as the program's flow leaves the method.

But what about `save`? Ruby will first look for a local variable. Now, I'm not arguing that you shouldn't have a local variable called `save` anywhere in your program, and if you do you might want to rethink that. But since, for now, there is no local variable with that name, Ruby will turn to its method lookup mechanism to resolve the identifier in question. If it can't find anything you'll get the much loved error `NoMethodError`.

If clarity is what you're longing for, learn Ruby's rules of resolving local variables and methods. Will make your life much easier.

So what is Ruby doing in the former version of the method body? You're pretty much forcing it to go directly to the method lookup. With the accessor magic it will find a method `published_at=(published_at)` and call it. Easy.

I've also seen modifications of this one:

    def publish
      self.published_at = Time.now
      self.save
    end

Or how about this one:

    def publish
      self.published_at = Time.now
      self.publisher = self.user
      self.save
    end

What's up with that? Pretty self-involved if you ask me. It's like using self just for the sake of it. Using self when assigning to instance variables, so might as well use it everywhere in the method for consistency, right?

Now, imagine that piece of code also having a call to a private or protected method in it. Of course you can't call those directly on an object, only on an implicit `self`:

    def publish
      self.published_at = Time.now
      update_trackbacks
      self.save
    end

Gross! The code looks more and more confusing, and I don't appreciated confusing looking code.

Of course, if you're using ActiveRecord, why not save a full line?

    def publish
      update_attribute(:published_at, Time.now)
    end

So let's review the initial example. We're only doing method calls, and Ruby will figure out our intention all by itself. So how about the simple version:

    def published?
     !deleted_at? && published_at?
    end

Wow, so simple. Much easier on the eyes, and the intention is clear right from the start. My rule is simple: When assigning to an instance variable, use self, calling a method on the other hand should stand all by itself. Now, you could argue, that assigning to an instance variable using its accessor is also a method call, but if you really want to argue about that, you should really read this blog entry again.