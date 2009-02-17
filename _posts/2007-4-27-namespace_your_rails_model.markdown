---
layout: post
title: "Namespace Your Rails Model"
topics: rails ruby
---
I had a nice revelation earlier this week, when I finally tested some code I wrote in the wild, the wild being BackgrounDRb. The code used some pretty common class and module names. I didn't expect many problems when I used something along the lines of Sync or Synchronizer. When running the code in test cases there wasn't any problem.

At first I got the error, that I couldn't include Sync (my module) with the `include` keyword into a class. I wondered why Ruby wanted to tell me that my module would be a class. I quickly found the answer. Ruby's standard library contains a class named Sync. As long as my code ran in a test case that class didn't come into play. But BackgrounDRb uses apparently uses it, therefore it got loaded before my module. That was the first name clash.

The second involved the class Synchronizer which is a class included in the package Slave used by BackgrounDRb. Slave's class even comes along with the same method I used, so you can imagine the look on my face, when I discovered that the code included there immediately started running when my BackgrounDRb worker ran.

That it took me some hours to find these issues because of a bug in BackgrounDRb is a totally different issue.

The moral of the story: namespace your model classes, and the code in `lib/`. The more classes you have, the bigger the chances that it clashes with a class in one of your installed gems. The best example is a class like `User`. The chances are pretty good that it's being used somewhere else. To avoid a clash choose a namespace corresponding to your business case or application (the project name would do).

Keep in mind that Rails expects a directory structure corresponding to your namespaces. So if you have a class `Bacon` in the module `Chunky`, be sure to put the class file `bacon.rb` into a subfolder named `chunky` in the `app/model` directory. The same goes for code in `lib/`.

For smaller projects this might not be necessary, but I learned the hard way that it can be a pretty good practice.