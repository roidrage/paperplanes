---
layout: post
title: Making TextMate And rvm Play Nice
topics: ruby textmate
---
After being annoyed with running multiple versions of Ruby just by using MacPorts I finally gave in and tried out [rvm, the Ruby Version Manager](http://rvm.beginrescueend.com/). That stuff got even more annoying when I tried to make [Bundler](http://github.com/wycats/bundler/) behave well with multiple Ruby versions, because it just doesn't by default. It's not really a problem with normal gems, but Bundler falls apart with its defaults when you're trying to run gems with native extensions. Hint: Set bundle\_path to include RUBY_VERSION and make some links from one cache directory to another to not have every gem cached for every Ruby version.

The promise of being able to easily switch between different versions and still having just one ruby binary and not one called ruby1.9 with MacPorts is just neat. While installing them is straight forward, using them from e.g. TextMate is not great. The common solutions of [just launching it from the command line](http://groups.google.com/group/rubyversionmanager/browse_thread/thread/c40041fa44012117#) or [modifying the TextMate Ruby bundle](http://rvm.beginrescueend.com/faq/) (these changes will have to be made again with the next TextMate update) are not fully acceptable for me, because it still doesn't allow me to switch Ruby versions while TextMate is running. That's one "flaw" rvm has, at least for me. It switches the paths for the Ruby versions for the current shell, it doesn't offer anything to set links in ~/.rvm/bin to the currently active Ruby version, at least as far as I know. No big deal, if it's by design I can live with that, I do think it'd be a nice addition though.

Anyway, I wanted to switch Ruby versions from my shell and have it affect the version I'm using to run my tests from TextMate too. The way to go seems to be `rvm <version> --default` which will set the default for all other shells. Be aware that it will do what it says, but I could live with that. It's more important to me to be able to make that switch than just having several shells with different versions in each. First step was to shorten that command, because let's face it, that's a lot of text. I added a function to my .zshrc. It should work just as well with bash, but really, you're still using bash?
  
    rvmd() {rvm use $1 --default}

Now you can just `rvmd 1.9.1` in your shell prompt and be done with it. Much better.

The other part was telling TextMate what Ruby binary to use. The problem outlined above made that a bit of a pain, so I broke out my shell scripting fu and cranked out this amazing wrapper script, using what rvm already dumps in your rc files:

    #!/bin/zsh
    if [[ -s /Volumes/Users/pom/.rvm/scripts/rvm ]]
    then
      source /Volumes/Users/pom/.rvm/scripts/rvm
    fi
    `which ruby` $*

Impressive, eh? It just sources the rvm script and then calls the ruby binary that is currently set as default. Make it executable and set a shell variable in TextMate called TM\_RUBY and make it point to that script, and you're good to go.