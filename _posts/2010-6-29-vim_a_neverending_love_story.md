---
layout: post
tags: vim
title: Vim - A Never-ending Love Story
---
About eighteen months ago [I wrote about going back to Vim as my daily text
editor](/2008/11/4/vim_my_college_sweetheart.html). It was a bust, and I went back to TextMate after about a week.

Suddenly it's the year 2010, and I'm typing this in [Vim](http://www.vim.org). What happened? My itch was re-scratched
if you will. I was wary of some of TextMate's perceived shortcomings, and honestly I missed having a command and insert
mode. It may sound stupid, but I really prefer that way of working with text and code. TextMate is still a nice
editor, but seeing its development coming to a perceived halt made me realize that Vim is simply forever, not being
developed by just one guy, but a community.

It's also worth mentioning that I simply started from scratch. Last time I built upon a configuration that grew over the
years, and that included things about whose purpose I just had no idea. I watched the [Smash Into Vim
PeepCode](http://peepcode.com/products/smash-into-vim-i) too, and started with the clean slate configuration set that
comes with it. If you're thinking of getting (back) into Vim, it's highly recommended, it's sure to wet your appetite.
There's also a [collection of screencasts](http://vimcasts.org/) and a [free book on Vim
7](http://www.swaroopch.com/notes/Vim) available on the interwebs. I have some useful links in [my bookmark collection
too](http://delicious.com/pombsd/vim).

There's been a lot of developments around scripts for Vim that bring TextMate-like functionality, or that support things
like Cucumber, smart quotes and [auto-closing braces](http://townk.github.com/vim-autoclose/), or even the most awesome
[Git integration](http://www.vim.org/scripts/script.php?script_id=2975) you'll find. But the nicest of them all is
[Pathogen](http://www.vim.org/scripts/script.php?script_id=2332), a script that allows you to keep all your other
scripts in separate places, not losing overview of what's installed where, and in which version.

Coming from TextMate, you're gonna miss the "Go To File" dialog, I'm sure. Check out
[Command-T](http://www.vim.org/scripts/script.php?script_id=3025), which does exactly that, only with path-matching
sprinkled on top. It's not as fast unfortunately, but a lot faster to use than the annoying fuzzy thing I used the last
time I tried to live on Vim. There's also [PeepOpen](http://peepcode.com/products/peepopen), but it always opens files
in new tabs, and that can get quite annoying, as new Vim tabs are quite different from Vim buffers. For project views I
use [NERDtree](http://www.vim.org/scripts/script.php?script_id=1658), though
[LustyExplorer](http://www.vim.org/scripts/script.php?script_id=1890) also seems acceptable.

As I said, I started from scratch, with a clean slate. So the decent thing to do was to put all my [Vim configuration
files on GitHub](http://github.com/mattmatt/dotvim). They include all the scripts I'm using, and my configuration, all
neatly separated into different bundles thanks to Pathogen. There's a couple of things that are still a bit wonky.
[Lusty Juggler](http://www.vim.org/scripts/script.php?script_id=2050) doesn't work as advertised all the time, though
it's a neat tool, allowing you to quickly select one of a list of the latest open buffers. RubyTest is quite weird, and
I'm thinking of dumping it completely, and simply rolling my own commands to run tests based on it. The
[rails.vim](http://rails.vim.tpope.net/) script package does include some support to run tests too, but not to execute a
single test case.

In general, I haven't found anything that works in TextMate that you can't somehow get to work in Vim. Yes, I've used
the word somehow. It's not easy as pie all of the time, and it can be different, heck it's a different editor. But I
willingly accept that, because as a text editor, I find Vim to be a lot better than TextMate.

I've been back on Vim for a month now, and I'm not looking back at all. It's like coming back to an old friend and
learning what awesome things he's been up to. It's pretty much as exciting as playing with new technologies at the
moment. Learning new things can be pretty exciting, even if it's just another text editor. But it's not all fun and
giggles. I have some annoyances still, but no editor is perfect. I'm more willing to accept Vim's for the increased text
surgeon skills than TextMate's, to be frank. TextMate is still a nice editor, don't get me wrong, my heart just always
belonged to Vim.

Honestly, I'm more willing to invest my learning time in an editor that I know I can use everywhere than one I can only
use on the Mac with a running user interface. I'm using Vim on every server I'm managing, so why not on my local
machine? Vim makes me think about how I can edit text in the most efficient way possible, and I like that very much. It
even made me map my caps-lock key to control, finally!

*Update*: Was just [tipped off](http://twitter.com/mutle/status/17356649155) that PeepOpen can be made to behave
properly and open files in the current MacVim tab.  When you set your MacVim options like in the picture below (notice
the part "Open files from applications"), it works a treat. Thanks, Mutwin!

![MacVim Options](http://img.skitch.com/20100629-p871pr9ky2fjb7xiubxtt2i2np.jpg)
