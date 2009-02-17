---
layout: post
title: "Mocha and RSpec Don't Play Nice"
topics: mocks rails rspec ruby testing
---
[Mocking](http://www.mockobjects.com/) is a great part of [RSpec](http://rspec.rubyforge.org/), and from the [documentation](http://rspec.rubyforge.org/documentation/mocks/index.html) it looks insanely easy. What had me frustrated on a current project is the fact that the mocks and stubs wouldn't always do what I'd expect them to do. No errors when methods weren't invoked, and, the worst part, mocks wouldn't be cleaned up between examples which resulted in rather weird errors. They only occurred when run as a whole with `rake spec` but not when I ran the specs through TextMate.

I was going insane, because noone on the mailing list seemed to have any problems, same for friends working with RSpec. Then I had another look at the RSpec configuration.

Turns out, the reason for all of this is that Mocha was used for mocking. Switching the configuration back to use RSpec's internal mocking implementation, everything worked like a charme from then on.

So what you want to have in your `SpecHelper` isn't this:

    Spec::Runner.configure do |config|
      config.mock_with :mocha
    end

but rather

    Spec::Runner.configure do |config|
      config.mock_with :rspec
    end

or no mention at all of `mock_with` which will result in the default implementation being used which is, you guessed it, RSpec's own.