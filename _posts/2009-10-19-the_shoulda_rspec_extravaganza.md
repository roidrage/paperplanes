---
layout: post
topics: rspec shoulda testing
title: The Shoulda RSpec Extravaganza
---
I don't use RSpec a lot any more these days. I much prefer Shoulda, heck I even started using Rails integration tests again (using Shoulda of course), because sometimes the additional abstraction of Cucumber is just too much. Any way, there's some things I liked about RSpec, and they were not related to the features of the testing DSL itself, but more to the tool RSpec. It has a neat formatter that'll output the ten slowest-running tests. I also found the colored list of full test names to be very helpful.

So I scratched my itch last weekend and brought that goodness to Shoulda. Our test suite is starting to get a bit slow, and it already served us well to find the slowest one. I like the approach of rinse and repeat to squeeze some valueable dozens of seconds out of a test suite with that technique.

So without further ado, I give you shoulda-addons, my little patch set to bring both test profiling and a colored list of full test names to you Shoulda test suite. I'm sure it'd work with normal Test::Unit or MiniTest without much effort, but for now it's made for Shoulda, and it looks like this:

<img src="http://img.skitch.com/20091019-m5wema3px8e7asmcqnjynq6ib.jpg" alt="Screen shot 2009-10-19 at 22.11.07" width="530"/>

While adding in the profiling was pretty straight forward, getting the colored output was pretty messy, and I'm not proud of it, especially considering that Test::Unit and MiniTest go different routes of outputting the little dots F's and E's.

The package is up on [GitHub](http://github.com/mattmatt/shoulda-addons), can be installed from [Gemcutter](http://www.gemcutter.org) via `gem install shoulda-addons`, and should work with Ruby 1.8 and 1.9. I also tested it with Mocha included, so let me know if something doesn't work for you.