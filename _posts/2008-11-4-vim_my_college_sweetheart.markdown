---
layout: post
title: "Vim - My College Sweetheart"
topics: macosx rails thedailygrind
---
It's true, I did write my [diploma thesis](https://github.com/mattmatt/deception_toolkit/tree) using Vim. Old-school with LaTeX and C++. When I came to the Mac five years ago I was still using the now pretty much dead [Carbon version of MacVim](http://www.macvim.org). And well, it just didn't feel right. I'm very comfortable on the command line, but on the Mac I wanted something that integrated well with the rest of that system, that behave like a real Mac application.

Of course, like a lot of people, I found TextMate. Who could resist the cool stuff as seen on the first Rails screencasts? I sure couldn't. I've been using it a good three and a half years now, and I still like it.

But recently the new [Cocoa version of MacVim](http://code.google.com/p/macvim/) scratched my itch. It was Jamis Buck's [blog entry](http://weblog.jamisbuck.org/2008/10/10/coming-home-to-vim) that eventually pushed me over the edge, and had me trying out working with Vim for the last week or so. And holy crap, a lot has happened in the world of Vim since I left it for good. Omni completion, a really good Rails script package, and lots of other cool stuff.

So I gave it a go, and it was like Jamis said, it kinda felt like coming back home. I spent most of my university days with Vim, actually the first years using the old-school Solaris vi. So it basically felt like I never left.

I got pretty fluent with it pretty quickly, and started looking for a nice set of scripts that would fit my workflow. I found

 * [rails.vim](http://rails.vim.tpope.net/)
 * [NERD tree](http://www.vim.org/scripts/script.php?script_id=1658)
 * [taglist](http://www.vim.org/scripts/script.php?script_id=273)
 * [SuperTab](http://www.vim.org/scripts/script.php?script_id=1643)

It all felt pretty good in the beginning, especially rails.vim is an amazing package. But after using it for a week it made me realize one thing: That I haven't dived into the Rails bundles deep enough. There's a lot of things in rails.vim that the TextMate bundle also has. What is seriously cool in Vim is the completion, but I just don't use it that much, and it can be frickin slow if you're on a big project.

And that's mainly my main gripe, it all didn't feel very speedy. It took one to two seconds for a normal file to load, what with all the BufRead action going on for Ruby and Rails project files. I didn't mind it that much in the beginning, but it got really annoying. Plus, a lot of the plugins, like NERD tree, or taglist felt kinda bolted on. 

So here I am working in TextMate, still loving Vim for it's flexibility and simple effectiveness, promising myself to delve deeper into what the bundles offer. It was a great week, and I'm glad that Vim gets the love it deserves.

One issue that drove me back to Vim was the fact that there's no news on what's happening in TextMate development, and what will be in 2.0. What the week in Vim made me realize were that TextMate could use stuff like split-screen editing, the ability to handle bigger files without hogging memory and CPU, and maybe some real good SCM integration.

My biggest gripe though was that file types didn't stick, switching from Rails to RSpec and Shoulda and back just seemed to confuse TextMate. I was made aware that there actually is a ["fix"](http://blog.macromates.com/2007/file-type-detection-rspec-rails/) for that problem, but that just isn't a full solution. It helps right now, but I can only hope that TextMate 2 integrates something like [TabMate](http://konstochvanligasaker.se/tabmate/), just maybe not with modlines but with metadata.