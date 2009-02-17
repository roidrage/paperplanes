---
layout: post
title: "acts_as_solr is Dead, Long Live acts_as_solr"
topics: rails
---
On a current project we recently switched from Ferret to using Solr as our search engine. That switch was more than necessary, but that's material for a different blog post. Let's just say, the switch was more than worth it, and Solr just rocks our socks off.

The decent choice to turn to was of course `acts_as_solr`. Unfortunately I soon realized that there was no real active development, except for a couple of forks on the GitHubs. [Luke Francl's](http://github.com/look/acts_as_solr/tree/master) was the most recent one at that time, so I forked it and started adding my own extensions and wrote a new unit test suite from scratch using Shoulda.

The project seemed to be missing an active maintainer, since Thiago stepped down a few months ago. Talking to Luke and the mailing list, a new plan was made, and without further ado I give you a fresh [`acts_as_solr` mainline](http://github.com/mattmatt/acts_as_solr/tree/master). I had weird feelings about picking up development, but I didn't want to let the plugin go to waste in the midst of a million forks. Of course Luke has commit rights to the repository as well.

Since the RubyForge project page is not up-to-date, I'll try to evolve most of the information and documentation on the project around the [wiki](http://github.com/mattmatt/acts_as_solr/wikis). An rdoc documentation site will follow.

Drop by the [mailing list](http://groups.google.com/group/acts_as_solr), there'll surely be someone to answer your questions. I'm open to patches, so if you have something to contribute, feel free to drop me a patch or a pull request.