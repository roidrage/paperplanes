---
layout: post
title: A Ruby Meta-Programming Riddle
tags: ruby metaprogramming
---
When we were at Scotland on Rails (excellent conference by the way, you should definitely go), and we sat in Dave Thomas' keynote, where he talked about the "Ruby Object Model", funnily enough we ran across a meta-programming wonder in that very session. It has been keeping me busy for a couple of hours, and I'd like to share my revelations. With some of them I'm not completely in the clear, but maybe they'll be a start for discussion. It's more a tale of one of my adventure through the Ruby object model than a fancy tutorial, so if you're up for that kind of thing, keep going. If not, just keep on reading.

It all started with a simple piece of code which a friend borrowed from the CouchFoo plugin. The code is from a longer [file](http://github.com/georgepalmer/couch_foo/blob/0f9317108cfdedbafecdcf1e97e35a2a5fcf30ad/lib/couch_foo/named_scope.rb), but the basic gist of the original code looks like this:

<script src="http://gist.github.com/97731.js"></script>

The method `named_scope` is available as a singleton method on the including class. But that's the boring part, line 13 is where the action is. It's obvious what the code does, it fetches the singleton class of the current object, and defines a new singleton method on it using `define_method`, all that whilst being called on the class. Pretty straight forward so far, the context is pretty clear. But I was wondering, why on earth do you need to get the singleton class? Why not use define_method directly? After all, you're in the class object already. When that didn't work, I tried using `instance_eval` directly, calling it on the implicit self, since that must be the class, right?

We played around with a statement a little bit, and since it only worked in the way used above, it scratched my itch, and I tried all different combinations of declaring methods on the class that includes the module, and I also tried to find out where the different methods were defined in the hierarchy of modules, classes and singleton classes. Now, in terms of a normal object you're using in your code, that hierarchy is straight forward, okay not always, but you can always turn to Dave Thomas' rule of going to the right and then up. But here we're talking about classes of classes, and that boggled my mind. It didn't even always help to go down the route Dave Thomas suggests, to ask yourself what self is in the context you're in.

There's different ways to get a singleton method onto the including class, not all of them suitable for dynamically creating methods, but still good to know where they go in the hierarchy.

Let me just go ahead and share the piece of code I ended up with to work through the problem:

<script src="http://gist.github.com/87194.js"></script>

As you can see I'm defining the method `speak` on the including class `Matt` in five different ways. I turned to my good friend `super` as one way to find out where methods go into the hierarchy, and which ways of declaring methods overwrite others. The other way is simply to comment out method definitions and see how the resulting code works. I've also added some basic tracing to see where the method is called from. You'd think the `puts` is enough to follow the trace, but either it was already too late, or I'm too stupid, but this way it just was easier for me to follow the method chain. It's been fun playing with this, and it still hurts my brain, so let's go through it as long as the pain's still there.

The principle is simple. The class `Matt` itself defines a singleton method called `speak`. Then it goes ahead and includes the module `Speech`. Don't worry about the two different modules `Speech` and `Speech::Support`, they're just for conciseness and could be easily removed, I just wanted to reproduce the way the code we were originally banging our heads on as good as possible. By extending the class with the module `ClassMethods` it puts that same module into the class hierarchy of the class `Matt`. That means, when the method `speak` is called Ruby will first look in the included module for the method. Since it finds it there it is simply executed. By calling `super` we can still reference the original method defined on the class, which also means that the method was not overwritten with this code. Simple enough.

When the code reaches `can_speak` the magic is about to unfold, and we're going through three different kinds of method definitions. Before we look at what happens in those, let's run this code and see what the output is:

    in 33 from /Volumes/Users/pom/Desktop/bla.rb:59
    say: class << self
    in 18 from /Volumes/Users/pom/Desktop/bla.rb:35:in `speak'
    say: module method
    in 41 from /Volumes/Users/pom/Desktop/bla.rb:20:in `speak'
    say: class.instance_eval

Okay, so only three of our five methods were actually called. Not too bad, but it still leaves questions unanswered. Commenting out some of the declarations will show you that all the definitions work on their own. That means that some declarations must overwrite others. Let's try and comment out the code in lines 24 to 29. You can believe me or try it yourself, but the output is still the same. What if we comment out lines 17 to 21:

    in 33 from /Volumes/Users/pom/Desktop/bla.rb:59
    say: class << self
    in 41 from /Volumes/Users/pom/Desktop/bla.rb:35:in `speak'
    say: class.instance_eval

What? One less method being called? But shouldn't it have called the method defined directly on the class in line 50? What if we comment out lines 31 to 37:

    say: class_eval
    in 18 from /Volumes/Users/pom/Desktop/bla.rb:27:in `speak'
    say: module method
    in 41 from /Volumes/Users/pom/Desktop/bla.rb:20:in `speak'
    say: class.instance_eval

Aha, we're starting to see some progress. You can play around with all of them, I sure did for a while. Change the order of the definitions, but the gist will be the same in the end, believe me.

Okay, enough playing, let's look at the details. In `can_speak` we define three different methods, one using `class_eval`, one using `instance_eval` on the singleton class, and one using `instance_eval` directly on the class object. As you can see in the first output, only three methods were being called, the method defined on the module, the one using the singleton class and the last one using the class object. At this point it dawned on me what's happening here.

When the module is inserted into the hierarchy, it's put before the original class (which was `Matt`, in case you've forgotten), the method `speak` in that class is not overwritten, but the module method will be found first during a lookup. But since we're defining a method on the singleton class of the class `Matt`, this one will be found before the module. The hierarchy order is singleton class, modules and then the original class, then the lookup continues through the superclasses. Fair enough, but where does that last method come in? It's the last in the chain which means that it's above the module's method.

I'm not exactly sure what happens here, I'm guessing that the code is being run directly on the class object, and not on its singleton class. If that's not the case that would basically mean that Ruby would insert another singleton class between the module and the class, but I don't think that's the case. If you have any pointer to clear things up, please add them as a comment.

The method definition using `class << self` on the other hand, definitely works its magic on the singleton class. It overwrites a method that might've been declared before which includes the method defined using `class_eval` in line 24. Both work below the level of the module which means that they must be working on the singleton class of class `Matt`. This is all based on a mixture of conjecture and output evaluation, so feel free to call bullshit on me, and correct me if I'm wrong.

Now, to get back to the original question, why doesn't just using `define_method` work? `define_method` is a tricky fella, it always works on the implicit self which is the class `Matt`, even if you use `instance_eval` or `class_eval` on the implicit self. The result will be the same in both cases: An instance method for objects of the class `Matt`. Thanks to Jay Fields for [writing about this](http://blog.jayfields.com/2007/03/ruby-instanceeval-and-classeval-method.html) (two years ago already, but still)

Also, why couldn't we just use `instance_eval` from within the context of the method `can_speak`? Did you just read the last paragraph? It answered the question already. But to go into a bit more detail, you need to call instance_eval on an explicit class object or its singleton class, and not within the context of the class itself. It's mind-boggling, but true.

The irony in all this? I banged my head on this for quite a while, but in the end the simple Dave Thomas example of looking at method lookups applies: Go one to the right, and then go up. It's harder to imagine this with just classes, but in they end it's the same, because everything in Ruby is an object, you didn't forget that, did you? You just need to figure out where the methods go when you go up. All this started when he was talking about the Ruby object model, and it ends with the very same. Funny like that.

Please, do yourself a favor and watch Dave Thomas' [screencasts on the Ruby Object Model]. I tend to avoid meta-programming magic as much as I can, but it's still an excellent way to learn more about Ruby's internal workings. The screencasts sure helped me a lot.