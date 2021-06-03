---
layout: post
title: Form Objects with ActiveModel
tags: rails web
---
When I built the billing process for [Travis CI](http://travis-ci.com)'s
commercial offering, I decided to try out some new things to avoid callbacks in
ActiveRecord models, including validations.

In 2010 I wrote about why callbacks and validations scattered about the
persistence layer bother me. I recommend [reading
it](/2010/5/7/activerecord_callbacks_ruined_my_life.html) to get the full background
on this.

What I went for this time was a mix of a service layer that handles all the
business logic and a layer of form objects that handle communications between
the controller and the services, including handling validations.

The goal was to have simple Ruby objects to take care of these things. No
special frameworks required. Inspiration in part stemmed from [Django's form
objects](https://docs.djangoproject.com/en/1.5/topics/forms/), though my
implementation lacks the part that talks directly to the model, for instance to
save data to the database. Quite intentionally so, as that part is up to the
services layer.

The last thing I wanted to avoid is having to use `attr_accessible` in the
persistence layer. In my view, that part is not something persistence should be
concerned with. It's a contract between the controller and the services it calls
into to make sure parameters are properly narrowed down to the set required for
any operation.

### Form Objects

For form objects, I looked at [Scrivener](http://soveran.github.com/scrivener/),
which was a great start. It's a very simple framework for form objects, [the
code could barely be
simpler](https://github.com/soveran/scrivener/blob/master/lib/scrivener.rb), but
it lacks some validations, as it implements its own set.

On top of that, it doesn't tie in with Rails' form handling that well, which
requires some parts of ActiveModel to work properly. Scrivener is great when you
integrate it with e.g. Sinatra and your own simple set of forms.

It's so simple that I decided to take its simple parts and merge it with
[ActiveModel's
validations](http://guides.rubyonrails.org/active_record_validations_callbacks.html#validation-helpers)
support. Thanks to Rails 3, that part has been extracted out of the ActiveRecord
code and [can be used for
anything](http://yehudakatz.com/2010/01/10/activemodel-make-any-ruby-object-feel-like-activerecord/).

The beauty of form objects is that they allow you to specify different views on
the same data. Every database record wrapped by ActiveRecord can have multiple
representations depending on which data is required by a specific form.

### ActiveModelSimpleForms

Here's the base code for the forms, which doesn't have a name, it's just a
snippet of code that's part of our Rails project:

<script src="https://gist.github.com/4223741.js?file=activemodelsimpleform.rb"></script>

It defines a few things that are required by Rails' `form_for`, but other than
that it's straight-forward. It can populate form attributes based on the model
handed in, which makes it suitable for re-use, for instance when editing an
existing object or when validations failed on update.

Here's a sample form object:

<script src="https://gist.github.com/4223741.js?file=edit_person_form.rb"></script>

It declares a few attributes and some validations. Thanks to ActiveModel you
could use anything provided by its validations package in a form object.

By declaring the attributes a form object brings a simple means of implementing
mass assignment protection without requiring any sort of sanitization and
without poisoning the model with `attr_accessible` and jumping through hoops in
tests to create valid objects to work with.

If an attribute assigned to the form doesn't exist, the assignment will fail.

### In the controller...

The interaction with the controller is rather simple, no added complexity:

<script src="https://gist.github.com/4223741.js?file=people_controller.rb"></script>

I'm liking this approach a lot, and it's been in use for a few months. There'll
be some refinements, but the simplicity of it all is what I find to be the best
part of it.

It's all just plain Ruby objects with some additional behaviours. Add a simple
service layer to this, and cluttered code in the ActiveRecord model is nicely
split up into lots of smaller chunks that deal with very specific concerns.
