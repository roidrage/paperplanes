---
layout: post
title: "Git Bits: Things you should know about git svn dcommit"
tags: git thedailygrind
---
While working with git-svn over the last week I ran into some minor things that weren't really problems, but still kept my mulling them over every time they happened.

After finishing work on a remote branch I did the usual chain of commands:

    $ git checkout master
    $ git svn rebase
    $ git merge my_branch
    $ git svn dcommit

Now, while this works beautifully I had two different experiences how `git svn dcommit` would put the changes from the branch into the Subversion repository. On one occasion it would just beautifully commit every single commit I did on my local branch. On the other it committed all the changes at once, in one single Subversion commit, using the message "Merged from 'my_branch'".

While it's all no big deal I couldn't put my finger on why it works that way. Either the man page isn't fully clear on the matter, or I just didn't fully understand it. I dug a little deeper through the internets and found out that it will only commit your merged changes as a whole when you did `git svn rebase` and there were actually changes pouring in from the Subversion repository.

If noone else submitted while you were working everything's fine. Knowing that difference can work out as an advantage, especially if not all of your local commits were clean.

Other than that you can just do the whole procedure from your branch.

    $ git checkout my_branch
    .....working....
    $ git svn rebase
    $ git svn dcommit
    $ git checkout master
    $ git svn rebase
    $ git branch -d my_branch

By the way, you can change the message "Merged from 'my_branch'" by calling git like so:

    $ git svn dcommit -e