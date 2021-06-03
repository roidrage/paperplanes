---
title: Fun with Ruby Block Parameters
tags: ruby blocks
layout: post
comments_disabled: true
---
I always forget what kinds of crazy things you can do with Ruby's blocks and
their parameters, so here's a little write-up on them. I regularly forget things
I've learned (must be an age thing), and I found that not even books on the Ruby
language fully cover all the gory details on block (and method) parameters. So
consider this my personal reference of crazy Ruby block syntax features for future use.

### The Basics

In its simplest form, a block parameter is a list of names, to which values
passed into the block are assigned. The following iterates over all elements in
the hash, emitting key and the corresponding value, printing both key and value.

    blk = ->(key, value) {puts key, value}
    {username: "roidrage", fullname: "Mathias Meyer"}.each &blk

Yes, that's the boring bit, bear with me.

### Splat Parameters

You can use splat parameters too, catching an array of all arguments.

    blk = ->(*args) {puts args}
    blk.(1, 2, 3) 
    # => [1, 2, 3]

Notice that crazy syntax for calling the block too, pretty wild. The fun starts
when you combine a splat parameter with one that's fixed.

    blk = ->(first, *tail) {puts first}
    blk.(1, 2, 3)
    # => 1

Why not put another fixed parameter at the end? That'll assign the first element of
the arguments to the variable `first`, the last element to `last`, and
everything in between to `middle`

    blk = ->(first, *middle, last) {puts last}
    blk.(1, 2, 3)
    # => 3

This can grow to an arbitrary complexity, adding more fixed parameters before
and after a splat. In this example, `middle` will just be an empty array, as the
fixed parameters are greedy and steal all the values they can match.

    blk = ->(first, *middle, second_last, last) {puts second_last}
    blk.(1, 2, 3)
    # => 2

Fortunately you can have only one splat parameter.

Just for fun, you can also just specify the splat operator and nothing else.

    blk = ->(*) {puts "lolwut?"}

### Default parameters

If you want to save some time, you can assign default values to block
parameters.

    blk = ->(list = [1, 2, 3]) {list.sample}
    blk.()

Again, you knew that already. Here's some craziness though, courtesy of
[Avdi](https://gist.github.com/1528785).

    blk = ->list = (default = true; [1, 2, 3]) {puts default}
    blk.()
    # => true
    blk.([4, 5, 6])
    # => nil
    
### Referencing Other Parameters

You can reference parameters previously defined in the list. Want to do an
impromptu mapping on the list above before even entering the block?

    blk = ->(list = [1, 2, 3], sum=list.inject(1) {|acc, value| acc*value})) {
      list.sample
    }

Don't do that, though. But good to know you can. Note that it only works for
parameters listed before the one you're assigning to. You can also shorten the
example above by quite a bit.

    blk = ->(list = [1, 2, 3], sum=list.inject(:*)) {
      list.sample
    }

### Block-local parameters

To add more character variety, you can declare variables local to the block by
adding a semicolon and another list of parameters. Helps when you want to make
sure variables used in the block don't accidentally overwrite or reference
variables outside the block's scope. Blocks are closures, so they reference
their environment, including variables declared outside the block.

    username = "roidrage"
    blk = ->(tags; username) {username = "mathias"}
    blk.(["nosql", "cloud"])
    puts username
    # => "roidrage"

You'll be pleased to hear that there's no craziness you can do with block local
parameters, like assigning defaults.

### Ignoring arguments

This one may look familiar to folks knowledgeable in Erlang. You can ignore
specific arguments using `_`. Combine that with the splat parameter and you can
extract the tail of a list while ignoring the first element. Then you can
recursively iterate through the tail, ignoring the first element.

    blk = ->(_, *tail) {blk.(tail) if tail.size > 0}

When is this useful? Ruby is not a pattern-matching language after all. For
instance, imagine an API that expects blocks handed to a method call to expect a
certain number of arguments. Ruby gives you warning if the block's arity doesn't
match the number it was called with. This way you can silently dump parameters
you're not interested in while still conforming to the API.

Okay, I lied to you, this is actually not an operator of sorts, this is a simple
variable assignment to a variable called `_`. It's a neat little trick though to
make it obvious that you're not interested in a certain parameter. Also note
that `_` in irb references the value returned by the last expression executed.

You'll find it used in several places in the [Rack source
code](https://github.com/rack/rack/blob/0fbb575c1983980f621319650280a4dc8ba2af6c/lib/rack/utils.rb#L192-203).

### Tuple arguments

This one blew my mind when I found it somewhere in the depths of Rack's source
(or somewhere else I don't remember). Think of a hash where each key points to
an array of things. Wouldn't it be nice if you could extract them all in one go
while iterating over them without having to first iterate over the hash and then
over the embedded arrays?

Turns out, the tuple operator is just what we need for this. This is an example
from a Chef cookbook I built a while back, specifying some thresholds for an
Apach configuration for Monit.

    apache_server_status = {
      waitlimit: ["<", "10%"],
      dnslimit: [">", "25%"]
    }

    apache_server_status.each do |name, (operator, limit)|
      puts "protocol apache-status #{name} #{operator} #{limit}" 
    end

Notice the definition of `(operator, limt)`. That little bead nicely extracts
the array with operator and a percentage in it into two parameters. Here's
another thing that blew my mind, chaining enumerators, collecting values and index
from a hash, for example. Note that hashes are sorted in Ruby 1.9, so this is a
perfectly valid thing to do.

    names = {username: "roidrage", fullname: "Mathias Meyer"}
    names.each.with_index do |(key, value), index|
      puts "##{index}: #{key}:#{value}"
    end
    
Hat tip to [Sam Elliott](http://twitter.com/Lenary) for blowing my mind with this.

### The end

Know what the best part is? All this works with method calls too. The tuple
assignment, using `_` to ignore values, the splats, referencing previous
parameters.

Some of them even work for multiple variable assigmnents.

    _, *tail = [1, 2, 3]
    name, (operator, limit) = [:waitlimit, ["<", "10%"]]

Crazy.
