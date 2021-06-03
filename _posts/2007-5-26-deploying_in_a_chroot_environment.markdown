---
layout: post
title: "Deploying in a chroot Environment with Capistrano"
tags: rails ruby
---
A chroot environment seems to be rare these days. Everything is virtualized, load-balanced and what have you. I recently found myself trying to deploy into a chroot&rsquo;ed Lighttpd environment with Capistrano and immediately ran over several pitfalls. The biggest problem is that Capistrano uses absolute links for directories like `current` and the links to the `log` directory.

A base directory for your app could be `/var/www/rails` and your Lighttpd runs in a chroot environment in /srv/lighty. In the application directory Capistrano creates the directories `releases` and `shared`. After a successful deployment it also creates a symbolic link named `current` pointing to the latest release, and several links to directories in `system`.

In this scenario the link current would point to the directory
`/srv/lighty/var/www/rails/releases/20070506135654`. Now, since Lighttpd doesn&rsquo;t know the directory structure above /srv/lighty that&rsquo;s a bit of a problem and it won&rsquo;t find the path when you point it to the dispatcher in the directory `current`. This is true if you launch your Rails application through FastCGI. In a Mongrel scenario it would pretty much result in the same problems. Additionally, your Rails application won&rsquo;t find its `log` and other directories (if you&rsquo;re up for it, these are `public/system` and `tmp/pids`).

Apparently not many people seem to use an environment like this. It&rsquo;s pretty old-fashioned in this highly virtualized world, but you run across it from time to time. So what can you do?

### Hacking the Symbolic Links

This isn&rsquo;t going to be pretty. To get the thing to work somehow I created a filter for `after_update_code` and removed the links created by Capistrano to replace them with new ones, only this time they wouldn&rsquo;t use absolute paths, but relative ones.

I&rsquo;m not proud of this solution, but I had to come up with something pretty quickly, and it works for the moment, and was only supposed to do so. It will be replaced with a production-like deployment soon. I&rsquo;ve replaced the task `:symlink` with my own which looks like this:

    desc "Overwriting symlink task to 
    task :symlink do
      on_rollback {
        run "cd #{deploy_to} && ln -nfs releases/#{File.basename previous_release} current"
      }

      run "cd #{deploy_to} && ln -nfs releases/#{File.basename current_release} current"

      run <<-CMD
        cd #{deploy_to} &&
        rm -f current/log current/public/system &&
        ln -nfs ../../shared/log current/log &&
        ln -nfs ../../../shared/system current/public/system
      CMD
  
      run <<-CMD
        test -d #{shared_path}/pids && 
        rm -rf #{release_path}/tmp/pids && 
        cd #{deploy_to} &&
        ln -nfs ../../../#{File.basename shared_path}/pids current/tmp/pids; true
      CMD
    end

One remark: I remove some symlinks in the code, because Capistrano creates them in the `update_code` task.

As I said, it&rsquo;s not pretty but it works. Here&rsquo;s what it does: It removes the symbolic links created by Capistraon and replaces them with new ones using relative paths.

### Putting the user in a cage

The better solution is to directly deploy into your chroot environment. Create a user that&rsquo;s directly being send into it by SSH or by its login shell.

This scenario requires that all the tools needed for a deployment must be installed in the chroot environment, including Subversion. If that&rsquo;s not a problem, this might be the ideal situation.

One thing you can&rsquo;t do is restart your web server from here. A scenario like this would mean that you can only restart your FastCGI or Mongrel processes. This is a scenario I&rsquo;ll use in the long run.

So is this hassle worth it? I&rsquo;m not sure myself. It&rsquo;s questionable, if the little added security is worth the effort you have to put in to get your applications working. In the end it depends on what your client's environment looks like, and if you have any control over it. If guidelines require chroot&rsquo;ed services, then there&rsquo;s not much you can do. Other than that I&rsquo;d consider breaking the service out of the chroot and trying to find a better way of securing it. Xen and the like come to mind.