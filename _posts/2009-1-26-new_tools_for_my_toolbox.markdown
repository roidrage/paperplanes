---
layout: post
title: "New Tools For My Toolbox"
topics: miscellany ruby testing
---
For a new project I wanted to try some new things, the moment just seemed right, so let me just give you a quick round-up.

* [Machinist](http://github.com/notahat/machinist/tree/master) - Now I liked [factory_girl](http://github.com/thoughtbot/factory_girl/tree/master), but after looking into Machinist it still seemed too tedious. It took me a while to replace the fixtures with Machinist, but it was totally worth it.

* [resource_controller](http://github.com/giraffesoft/resource_controller/tree/master) -  Way to DRY out your controllers. It abstracts away a lot of the tasks you repeat in RESTful controllers, but in a way that doesn't feel like it's totally out of your hand. Just the right amount of abstraction.

* [Cucumber](http://cukes.info/) - When I first saw the PeepCode on [RSpec user stories](https://peepcode.com/products/rspec-user-stories) I was a little bummed, but that was mainly because the PeepCode itself didn't really show the power of stories for integration tests. Quite the opposite, it used the stories to directly work with the model, and to test validations. Not really what I fancied, I already had a tool for that.

  But Cucumber, where have you been all my life? I started working with it today, and just after a few hours it already felt so natural to put the things you expect from your application on the user level into sentences, and to write or reuse the according steps. If you haven't already, do give it a go. It's been the missing tool for integration testing in my toolbox, and I'm in love with it already.

 It integrates nicely with a lot of things, for me right now, Webrat is sufficient, but if you fancy it, use Selenium, Celerity, Mechanize or whatnot.

In other news, I gave [acts_as_solr](http://mattmatt.github.com/acts_as_solr) a new home, it's not fancy yet, but at least there's an up-to-date [RDoc](http://mattmatt.github.com/acts_as_solr/rdoc/) available.