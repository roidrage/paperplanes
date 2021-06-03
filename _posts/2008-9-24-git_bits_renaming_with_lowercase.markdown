---
layout: post
title: "Git Bits: Renaming with Lowercase and Uppercase"
tags: git
---
There's a small pitfall when using git-svn. I just recently had the problem that someone renamed a file from lowercase to uppercase in our Subversion repository. Why should that bother me, when I'm using Git, you ask? Well, I'm using git-svn, and it didn't really like that kind of change. The default on Mac OS X file systems is that they are case-insensitive. FFFFFF.gif is the same as ffffff.gif.

Speaking of which, that was exactly the file that has been renamed. Doing a `git svn rebase` failed miserably with the error that ffffff.gif would be overwritten by the merge of the commit in question. Gah!

It took me a while to find a way around it. If you delete the file in question, just from the file system, not from the Git index, mind you, you can merge the branch in question, and have it restore the file as if nothing happened.

The steps are pretty simple:

    $ rm file/in/question.gif
    $ git merge trunk

The file should be restored in all its renamed glory. It works because all the stuff from the Subversion repository sleeps quietly in a branch called trunk, together with all the metadata git-svn requires.

You won't have that problem when using plain Git, though to rename the file you have to use `git mv -f`, but git-svn apparently can't handle that situation.