---
layout: post
title: "ActiveRecord and a custom method_missing"
topics: rails ruby
---
Don''t be tempted to overwrite `method_missing` in an ActiveRecord-based model class. It will open a can of worms that's hard to close without removing your custom version again.

A lot of stuff in ActiveRecord is based on it, for example all the beautiful finder methods like `find_all_by_this_field_and_that_field` or simply setting and getting of attribute values. While associations get their own methods, the plain attributes are routed through `method_missing`. So `@user.name` and `@user.name = "Average Joe"` all go through it. You can try that out by overwriting `method_missing`, strictly for educational purposes of course, and only if you promise to remove it afterwards.

    alias :original_method_missing :method_missing
    def method_missing(method_name, *args)
      puts method_name
      original_method_missing method_name, args
    end

You'd think that this code shouldn't break anything. I tried it, and the validations stopped working. Since there's a lo-hot going on in ActiveRecord, I haven't dug in yet to have a look why that's the case, again strictly for educational purposes. But I'm curious for sure.

If you want to bring dynamic code into your classes, for example generated methods, you're better off generating the code at runtime, just like ActiveRecord does it for associations.