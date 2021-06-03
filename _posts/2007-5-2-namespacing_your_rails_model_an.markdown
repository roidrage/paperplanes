---
layout: post
title: "Namespacing Your Rails Model - An Afterthought"
tags: rails ruby
---
In an earlier post I wrote about <a href="http://www.paperplanes.de/archives/2007/4/27/namespace_your_rails_model/">namespacing your Rails model</a>. There's an additional issue that must be thought of when doing so. Rails (of course) has conventions dealing with namespaces.

Normally, when you put classes in namespaces, like `Admin::User`, Rails normally expects this class to be in a folder `admin` in your `app/models` directory. Responsible for this is the method `load_missing_constant` in the module Dependencies, part of ActiveSupport. It also uses the namespace to build the table name. So `Admin::User` would result in `admin_users`. This isn't always a desirable outcome. Of course you could set a table name explicitly:

    class Admin::User < ActiveRecord::Base
      set_table_name "users"
    end

If you need to avoid namespace clashes, that's an acceptable option. But what if you only want to bring some order to your model directory? You want to create some subfolders to separate your model physically, if only to avoid having dozens of files in the model folder.

This is where `load_missing_constant` kicks in again. If you don't load the files in the subdirectories explicitly, it will assume that the files are in their according namespace. So having a class `User` in a file `user.rb` lying in the folder `app/models/admin/` will lead it to assume `User` exists in the module `Admin`. To avoid that you'll have to add your model subfolders as load paths. To do that you can add the following line to your environment.rb:

    config.load_paths += Dir["#{RAILS_ROOT}/app/models/[a-z]*"]

This will tell Rails to look for the the files in all subfolders of `app/models` on startup. This won't solve the issue yet, you'll still need to explicitly load the classes. So you put the following lines at the end of your `environment.rb`:

    [ "app/models" ].each do |path|
      Dir["#{RAILS_ROOT}/#{path}/**/*.rb"].each do |file|
        load file
      end
    end

That way you'll avoid the implicit call to `load_missing_constant`. You can add directories to the list, e.g. a subdirectory in `lib`. You could also explicitly require the classes you need, but who wants to do that, really?