---
layout: post
tags: api development bestpractices
title: How Not To Design An API
---
I've had the dubious pleasure of working with a certain library. It's a layer to talk to most of the Amazon Web Services APIs. While working with web services usually is a particular awful experience, this library doesn't make much of an effort to hide their awkwardness, in fact, in some ways it even makes it worse. It's pretty old news that I enjoy bitching about code I don't like, but I also like to keep it positive in at least thinking about how it could be improved.

Let's take a moment and have a look at what part of their API is particularly nasty and how the situation could be improved. We actually wrote a micro-wrapper around that library to make things a bit less awful for us, and to at least keep their code out of ours.

I'm looking in particular at the EC2 part of the library. Here's the signature of the method that runs a new instance:

    run_instances(image_id, min_count, max_count, group_ids, key_name,
                  user_data='', addressing_type = nil, instance_type = nil,
                  kernel_id = nil, ramdisk_id = nil, availability_zone = nil,
                  block_device_mappings = nil)

Yes, that's 12 arguments you can hand over to the method, most of them being optional. Now, what's it look like calling it:

    run_instances('ami-123445', 1, 1, [], 'default')

So far so good. But what if you want to specify a different availability zone for e.g. the EU:

    run_instances('ami-123445', 1, 1, [], 'default', '', nil, nil, nil, nil, 'eu-west1b')

Nice, eh? It's starting to get really ugly. The important parameters are hidden by unnecessary noise. What's with `max_count` and `min_count` not having default values? I'd argue that you normally it'd be quite reasonable to assume that you only want to run one instance when calling the method without these two parameters.

Anyway, that's just one example, in general, there's only one important piece of information, and that's the AMI identifier. Let's look at what this method could look like when you sprinkle some very common Rubyisms on top, things that should be quite common sense when writing code in Ruby, but seem to have been lost here in favor of resembling the original API as close as possible, even if that means writing cumbersome code:

    run_instance('ami-123445', :availability_zone => 'eu-west1b', :ssh_key => 'default')

Now the method only takes one argument and a has of options. Is it more code to write? Yes. Are its intentions clearer? I'd argue that they are. Is it close to what the API underneath expects as arguments? Closer than before. Unnecessary information is left out, because either the method itself could send sensible defaults, or the web service itself does it. The EC2 API even has a default for the instance type, and it doesn't care if you leave out the RAM disk or specific kernel. It does what's necessary to ensure your instance is up.

Knowing that, it's not that hard to hide those details behind a slightly improved version of `run_instances`, in this case even called `run_instance`. Throw in a method `run_instances` to handle specifics of launching multiple instances at once. Is it more code to write? Sure. But it sure as hell makes for a nicer usage of the library itself. Instead of having to look up the order of the method's parameters and fill in blanks with nil, I only have to look what options the methods accepts.

In general I don't like giving a method more than three arguments. It simply means it's doing too much, or that the data it needs should be wrapped in a simple data structure, e.g. a hash (which is just called for in Ruby) or a simple struct. The more arguments you give a method, the harder it will be for users to figure out its usage, especially if you make a whole stash of them optional, because then the order of them starts to matter, and users have to dig through an endless line of documentation just to figure out where the argument most important to them needs to be placed among a pile of nils.

`run_instances` in said library returns an array of hashes. Those hashes contain the data returned by the web service, each entry in the array describing one instance. Apart from the fact that you always have to get the first entry of that array when you just launched one instance, it also does something weird. EC2 returns attributes in the hash using names like imageId, instanceId, keyName and so on. You could argue about the naming style, but the names sure are reasonable. What `run_instances` does is go ahead and prefix almost every attribute with `aws_`, but not all of them. Most methods in said library do the same, so at least there's some consistency, but it sure isn't great.

So while trying to resemble the API call, it makes you care about what's what instead of just giving you the attributes as it receives them from the API. The answer to this is simple, give me the damn attributes as you get them, simple like that. If you need to ensure that there are no naming clashes, put them in a subhash e.g. using the key `:ec2` if you must.

Another example is this really simple method:

    describe_instances(list=[])

It takes an array as an argument, but nothing more. Even if you just want to get the data for one instance, you have to call it like this:

    describe_instances(['i-123454'])

I don't know about you, but I think that looks just gross. We're using Ruby for chrissakes, there's a simple mechanism to ensure you get an array, but the library user doesn't need to specify it as such, it's called splat arguments. It's a simple fix, and has great effect.

    describe_instances('i-123454', 'i-213143')

There, much better. Again, I'd make the case for a convenience method for getting the data for just one instance, which in turn fetches the first element from the resulting array. If you must, generate the code for it, but it makes code using the library a lot easier on the eyes. Sure, it's more work for you as the library's author, but your users will be thankful, I'm sure.

Last example, the library's layer to access S3. Now, when I reach for my bucket, I can use this method:

    bucket(name, create=false, perms=nil, headers={})

The second parameter caught my eye, according to the RDoc it creates the bucket if it doesn't exist. Looking at the code it just doesn't even check if the bucket already exists, it just goes ahead and does a PUT request whenever you specify true. So to make the intention clearer you actually have to do the checking yourself and recall the method with `create` set to true to create the bucket on the second run. Because if it doesn't exist `bucket` will just return nil. You could end up with something like this.

    bucket('bucket-for-monsieur') or bucket('bucket-for-monsieur', true)

So the RDoc is actually lying to us, and we have to bend over and ruin one line of code just because our library is too lazy to do the job for us. If you ask me, the whole method signature looks a bit odd. Somehow it also calls for a little makeover with an options hash, and it obviously should do what it says and check the existence of the bucket for us if we ask it to, and maybe raise an error otherwise, but the latter is a matter of taste. Sometimes I'd rather like to have an error instead of having to check for nil, since in this case you could argue that it clearly is an exceptional situation.

    bucket('bucket-for-monsieur', :create => true, :permissions => 'public')

Designing a good API is hard, especially when you're hiding one that's already not great, though that's not an excuse. But sometimes it's well worth looking at how you think others would want to use your library, putting aside the fact that you need to do more work maybe to make it more usable. It's not too much to ask, and it'll sure make your users happy, because their code will look nicer too. The only failure I could add to the above is when the methods would have the real names of the API calls:

    DescribeInstances(['i-123454'])

Gross! You can laugh now, but some Ruby libraries for accessing Amazon's Web Services don't shy away from exposing you to these undoubtedly not Ruby-like method names.