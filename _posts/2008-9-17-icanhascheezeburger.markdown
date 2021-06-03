---
layout: post
title: "\"i\".can.has?(\"cheezeburger\")"
tags: ruby
---
Today I wondered, why on earth doesn't Ruby have something where I can just say:

    if "some string".doesnt.include?("other string")

It's so unfair. It's such a flexible language, and doesn't allow me to do that? Instead I have to write

    unless "somestring".include?("other string")

No way, that just doesn't feel right. Worse, it feels unnatural. Why would you want to write that?

Instead I give you something really useful, a small extension that allows you to write just that. Or

    if "something".has?("thing")

Or even

    if "i".can.has?("cheezburger")

Taking it even further you could turn it into something really useful and have something like

   user.can.has_attribute?(:name)

Wouldn't that be awesome? I know!

Granted, I also needed a small distraction from the other task, but this was quick and fun.

Without much further ado, I give you some source to marvel at.

<script src="http://gist.github.com/11243.js"></script>

Simple, yet an enormous improvement. Enjoy!