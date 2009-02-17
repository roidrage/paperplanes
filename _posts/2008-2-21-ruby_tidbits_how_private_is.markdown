---
layout: post
title: "Ruby Tidbits: How Private is Private?"
topics: ruby
---
Several of my friends are picking up Ruby these days. Just like me, they're coming mostly from the Java world. Good thing about that is that they're asking me questions about Ruby. Always a great opportunity to dig more into the language, and to write down some tidbits that came up.

When you're coming from Java you're used to private being private. When you declare a method as being such it's off limits as soon as you leave the class' scope. No way to reach it from subclasses or, god forbid, call it from another object. Well, you could use that really awkward reflection code and really ram it in, and eventually call it, but that's just tedious.

Different story in Ruby. Using the keyword `private` is more of a marker than a mechanism to enforce access restrictions to an object's methods. You can even call private methods from subclasses, no problem. There's just one caveat, a private method can't be called on an object. It must be a lonely method call. No `self` for you today.

    class Restricted
      private
      def secret_method
        puts "top secret!"
        # do something private
      end
    end

Now, you'd think the deal is sealed. What's secret, stays secret. And you'd be right:

    Restricted.new.secret_method
    # NoMethodError: private method `secret_method' called for #<Restricted:0x362eb4>

Oh noes! And this won't work either:

    class Freedom < Restricted
       def public_domain
         self.secret_method
       end
    end

Not to worry, the fix is right at hand:

    def public_domain
      secret_method # but this will!
    end

Huh? Did we just call a private method from a subclass? We sure did. Again, private restricts you in a way that you can only call the method from within the context of a class (subclass or not), but without calling it on an object. Of course there's a different way, you can just un-private the method, but that's just mean.

    class Freedom < Restricted
       public :secret_method

       def public_domain
         self.secret_method # free as a bird
       end
    end

And there's always good old `send` to rely on.

    class Freedom < Restricted
       def public_domain
         self.send(:secret_method) # free as a bird
       end
    end

In a world where you can change almost everything about a class, `private` is merely something to remind a developer using a class that calling this method out of context or from outside the class is probably not the way to go. But if he still wants to go ahead, it's his responsibility, including all the risks, possible internal changes in a future version and the like.