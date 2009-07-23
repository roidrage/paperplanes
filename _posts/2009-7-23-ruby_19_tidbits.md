---
layout: post
title: Ruby 1.9 Tidbits
topics: ruby
---
Things that don't really justify their own separate posts.

* The method `instance\_methods` now returns an array of symbols instead of an array of strings. So do all the other methods that return methods, e.g. `singleton\_methods`, `public\_instance\_methods`, etc.

* There's now a method `define\_singleton\_method` that will remove the need of using `instance\_eval` when you want to define a singleton method. This is both true for classes and objects. Though if you're really picky, those actually are the same.

* `public\_send` is already an oldie, but goldie, but it can't hurt to mention it. It will fail when you're trying to dynamically call a non-public method. Good old send still works as advertised.

* `Enumerable#grep` can work on arrays of symbols. Add that to an array of methods, and you have a way of searching for methods that's still compatible with Ruby 1.8. As a matter of fact, and thanks for David Black for pointing that out, symbols seem to be more string-like in Ruby 1.9, so you can do `:symbol.match(/ymbol/)`.

* `instance\_exec` is a nicer way of calling a block in the context of an object when you need to access variables outside of the block. You can give the parameters you need in the block as parameters to `instance\_exec` which will in turn hand it to the block.

        m = User.new
        secret = "sssh!"
        m.instance_exec(secret) {|s| @secret = s}

  Now, this is a terrible example, I know, but honestly I'm not too sure how useful this is in practice. `instance\_exec` was also backported to Ruby 1.8.7, if you're up for that kind of thing.

* Blocks are now handled very similar to methods, at least when they're lambdas. Don't ask me why the good old proc method is still in there. You get ArgumentErrors when your argument list doesn't match the list of parameters specified for the block. So checking the arity is probably a good idea when you're working inside a library dealing with blocks handed to you.

  Don't get me started on the new way parameters are handled in both methods and blocks. You can have optional parameters, splat parameters, and another mandatory parameter, afterwards. It's crazy, but true. Ruby will match things from the outside in. To fully understand it, I can only recommend to play around with it.

* Fibers! Man, this stuff is neat. It's not really the place to explain everything around them, I've written a long-ish article on them for the [RailsWay Magazin](http://www.railsway.de) to fully understand what they actually do. Play with them, but not with the semi-coroutines version that's the default. `require 'fiber'` is where it's at. That gives you the full power of this neat little gem.

* The Enumerable methods in Hash will now return hashes where appropriate. This is kind of a big deal, because it can break compatibility when you're solely relying on it. When you're talking to code on the outside, it's probably a good idea to still convert any results to an array using `Hash#to\_a`

* Even though it's supposably still the same version, there's some differences in the code of WEBrick. It will simply fail on requests with request URIs longer than 1024 characters. That was a bit surprising to me, and since there was no reasonable way around it, I had to patch it to work with SimplerDB.

* String now has `start\_with?` and `end\_with?`, they're also in Ruby 1.8.7.

* In Ruby 1.9.2 there's now `Method#parameters`, which gives you a neat way to inspect parameters of a method (duh!):

        Date.method(:new).parameters
        => [[:opt, :y], [:opt, :m], [:opt, :d], [:opt, :sg]]

        def parameterize(name, options = {}, *args, &blk)
        end

        method(:parameterize).parameters
        => [[:req, :name], [:opt, :options], [:rest, :args], [:block, :blk]]
 
As much fun as Ruby 1.9 is, having to deal with unmaintained code that is not compatible yet is a real pain in the ass. But still, it's totally worth checking out, and if you have a vanilla project coming up on the horizon, consider doing it with Ruby 1.9.