---
layout: post
title: "Continuous Integration for Ruby and Rails"
topics: rails ruby
---
Due to some developers not so keen about running the tests I got back to my trusty friend Continuous Integration for a project I'm currently working on. Being a big fan of CruiseControl I looked for similar solutions for the Rails and Ruby market. There are several tools you can use, and they have several ups and downs.

 * **The Slim Solution**: [Continuous Builder](http://dev.rubyonrails.org/browser/plugins/continuous_builder)  
 A small application disguised as a Rails plugin which you can hook into your Subversion post-commit. It's part of the Rails repository and, though it hasn't been cared for in a while, still fulfils its purpose. The commit hook runs checks out the source and runs the tests. Should one or (*gasp*) several of them fail, it will bug you with a nice email pointing out the abounding problems. It's the simplest solution, but it needs a separate environment in your Rails application. Ryan Daigle [suggests](http://www.ryandaigle.com/articles/2006/5/24/continuous-integration-w-rails) to use a separate `build` environment to keep the build away from the rest of your application. This sort of repelled me from Continuous Builder since it also needs a database to work this way.

 * **The Hell-Hound**: [Cerberus](http://cerberus.rubyforge.org/)  
 It's simple and easy to use, it comes as a RubyGem and is up and running in no time. Once installed, projects are added through the `cerberus` command.  
 `cerberus add http://some.server/with/my/svn/trunk`

 By default, it uses the last part of your Subversion URL to create a name for your project, so you might want to add the option `APPLICATION_NAME=<my_project>` to specify a nicer name than just trunk.

 When you're done you can easily build your project with `cerberus build <my_project>`. Cerberus will check for changes in your repository and only do its magic when there are changes. It supports notification through email (duh), Jabber, RSS, CampFire and IRC. It can be run as a commit hook or as a cron job.
 
 * **The Classic**: [CruiseControl.rb](http://cruisecontrolrb.thoughtworks.com/)  
 Of course I didn't discover it until Cerberus was up and running. CruiseControl.rb is the natural evolution that eventually had to come after CruiseControl, the bigger brother of the Java world. Both are products of ThoughtWorks.

 CruiseControl.rb is, of course, a Rails application. It doesn't need a database though. It's pretty easy to use. You just unpack it, add a project and start the required processes:

 `cruise add my_project http://some.server/with/my/svn/trunk`  
 `cruise start`

 That's about it. After that you can point your browser to the dashboard application and enjoy the magic of freshly made builds.

 Downsides include support for a wider variety of version control systems. For now, only Subversion is on the list.

All of the above are pretty neat and depending on your continuous integration needs, can be recommended. If you need a fancy web application, there's no way around CruiseControl.rb. Its clear advantage is also that it polls the repository without needing cron or a commit hook. Otherwise I'd recommend Cerberus over Continuous Builder because it's a little bit more flexible and offers more notification options. What I realised is that even in a Rails project where the tests are mainly the proof that code hasn't been broken with a change, it's necessary to check this automatically. No more "But it works on my machine" and that warm, fuzzy feeling of not getting email after you checked in.