---
layout: post
title: "Write Tests for even the Smallest Projects"
topics: rails testing
---
For [Bratwurst on Rails](http://www.bratwurst-on-rails.com) I implemented a small application to allow for easy signup. We could've used something like upcoming or wevent, but first we wanted to give people an opportunity to tell us what they like to eat and second, we needed to have room for our sponsors.

As you might imagine the application doesn't do a lot, it comes along with a flashy design, two simple controllers and one model. Nonetheless I wouldn't have felt comfortable to put the application out in the open without some testing. While I'm sure I didn't test every aspect of it, it tests enough of the functionality to ensure it really works.

![Bratwurst Tests](http://myskitch.com/mattie/picture_1-20070911-111552.jpg)

Testing is the part of Rails that has really grown on me, and that drew me to Rails in the first place. The integration of the different types of tests, the fixtures, the ease of writing tests, all that should be enough reason to write tests even for the smallest projects.

If you're just getting started with Rails or haven't looked into testing yet, I suggest you do so soon. It can save a lot of trouble. I don't want to say time, because in the beginning that might not be true. It takes a while to get into testing and to get so comfortable with it that it's only natural to start writing a test for your controllers before you even think about opening the browser. But in the long run it's definitely worth it.

The funky [Growl](http://www.growl.info/) notification is courtesy of [autotest](http://www.zenspider.com/ZSS/Products/ZenTest/), by the way. A shame it took me so long, but I just started using it, and right now I can't remember how it was like without it. Notification icons and notification code can be found [on the blog](http://blog.internautdesign.com/2006/11/12/autotest-growl-goodness) of [internaut](http://internautdesign.com/)