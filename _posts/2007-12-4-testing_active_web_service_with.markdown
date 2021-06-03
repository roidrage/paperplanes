---
layout: post
title: "Testing Active Web Service with RSpec"
tags: rspec testing
---
I recently started picking up RSpec for a current project. Not too far along the way I found myself wanting to test a SOAP web service written with Active Web Service with it.

Given that these map to controllers it's pretty easy to do that. You can basically use the same things that you can use in Rails' function tests. All you need to do is include the correct helper that defines the methods, in your specification.

    require 'action_web_service/test_invoke'

And that's it. From then on you can test your web services like controllers, given that you have an Service::SearchApi that uses the Service::SearchController, you can just do this:

    describe Service::SearchController do
      it "should find users with a valid input" do
        users = invoke :find_users, "quentin"
        users.should have(2).items
        users.first.should be_instance_of(User)
      end
    end

There. It's that easy.