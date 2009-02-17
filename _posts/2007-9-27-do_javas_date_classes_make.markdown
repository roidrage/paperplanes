---
layout: post
title: "Do Java's Date Classes Make Any Sense?"
topics: java thedailygrind
---
I just spent the last hour banging my head on my desk trying to get any kind of date type (whether `java.util.Date` or a simple timestamp) from the current time and a timezone identifier (something along the lines of Etc/GMT+12). You'd think this is an easy task. Obviously the `GregorianCalendar` takes a timezone as a constructor argument, so it really should be.

It is until you've called `getTime()` on the calendar object and wonder why you're still getting your local time. And on further inspection you realize that `GregorianCalendar` doesn't even care about the timezone object you've just given it. Only setting it through `setTimeZone()` makes it recognize that you actually want it to use a different timezone for date and time calculation.

This should work now, right? Of course it should, but `getTime()` and `getTimeMillis()` still returns the local time and doesn't mind that you don't want it to. Only if you use a date formatter like `SimpleDateFormat` will Java remotely start to understand what you really want. But it stays awefully quiet about the fact that then you can't get a simple timestamp anymore.

There's [an article on ONJava](http://www.onjava.com/pub/a/onjava/2003/06/05/java_calendar.html?page=1) with more detail on this.

And there I thought timezone handling in Rails would be complicated.