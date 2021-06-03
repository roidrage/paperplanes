---
layout: post
title: "Bootstrapping a Web Project with Java and Rails"
tags: java rails
---
For a current gig I had to set up a Java web project from scratch. The set-up isn't that unusual:
 * Spring 1.2 (yes, it's rather old, but the project uses a portlet framework which used to work with Spring 1.1, and I don't want to make the big jump just yet, the upgrade to Spring 1.2 went just fine though)
 * Hibernate 3.2 (hence the upgrade to Spring 1.2)
 * Tomcat 4.1.38 (again, the framework, and it's a very stable version)

What amazed me was the time I needed to set up the project and to get the first code running, including access to the database, mapping a simple class, deployment, deployment descriptors, the whole bunch. Although I used the skeleton of an existing project in a tidied-up version it took me a day until I had all the pieces together, including a 27 MB download just to get the MySQL JDBC connector (whose JAR file is smaller than 500 kB by the way). Granted, it's been a while since I set up my last project, but half a year isn't that long, so I'm not a total newbie at these things.

Here are the basic steps:
 * Set up a project
 * Collect the libraries - Downloads from several locations
 * Create a build file - I had one already from the existing project which just needed some cleaning up. It's an Ant file. "You could just use Maven" i hear you say. Yes I could, but therefore I'd have to get to know Maven which would cost even more time.
 * Create a Spring configuration - Again I could base this on the existing one, Hibernate needed some polishing
 * Write mapping files
 * Create deployment descriptors
 * Start writing code
 * Create the database
 * Deploy the project
 * Run Tomcat

Now, compare that to this:
 * `gem install rails --include-depdencies`
 * `rails my_app`
 * Create the database
 * Edit database.yml
 * Write a migration
 * Write code
 * Run `script/server` - No deployment descriptors needed

I didn't have to leave the command line once to do all these things. And if I need new libraries, `gem install` or `script/plugin install` are my friends.

It took me almost a day to get everything up and running in the Java project. It usually takes me five minutes to crank out the first features with Rails.

I'm left wondering why things ever got so complicated in the Java world. Things get even worse and more complicated if I'd want to set up a test environment. Are these things so much part of Java web development now that nobody's bothered by complicated set-ups or do people have their own project skeletons which include everything needed similar to the skeleton that Rails generates?