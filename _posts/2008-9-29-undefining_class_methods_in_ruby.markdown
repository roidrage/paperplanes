---
layout: post
title: "Undefining Class Methods in Ruby"
topics: ruby
---
To get a weird RSpec mock error working again, I tried to look for a solution to dynamically add and remove methods on each spec run due to some odd ends in the current RSpec edge version. Sounds weird I know, but what are you gonna do. I went for a different solution in the end, but still this was good to know.

You need to get the class' singleton class to remove the method again. Everything else will fail miserably. But this works like a charme:

<script src="http://gist.github.com/11635.js"></script>