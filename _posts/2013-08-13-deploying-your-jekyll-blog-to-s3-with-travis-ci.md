---
title: Deploying your Jekyll Site to S3 with Travis CI
layout: post
tags: s3 jekyll continuousdeployment
---
I admit it, I got stung by the urge of not having to maintain my own servers
anymore. For simple websites like this one, it's become a dreadful task.

This site is built using [Jekyll](http://jekyllrb.com), I started using it very
early on, even had my custom fork with some fixes and improvements. That part
started to get annoying.  My fork was very outdated, and I really just had a
couple of patches around that, in the meantime and in one way or the other, had
made it into Jekyll's releases.

So I decided to take the plunge and stop hosting this site myself and put it on
[S3](https://aws.amazon.com/s3). Why Mathias, you'll ask, why didn't you just
use GitHub Pages?

I have some custom plugins and custom patches in place, for instance to create
pages for single tags, and I didn't want to rip out all that. GitHub Pages
unfortunately doesn't allow you to install custom plugin, which is of course
understandable from a security perspective.
[wordpress.com](http://wordpress.com) imposes the same restriction on you.

Another option is to deploy generated content to GitHub Pages by adding and
committing to git, but I haven't been happy with the increasing delays imposed
by the CDN in front of GitHub Pages lately.

So I turned to my old friend S3. It's gotten some neat features to simplify
using it as a hosting platform over the years, like root document support,
redirects, built-in content delivery network, lots of good stuff.

### Local host is local most?

One options is to deploy directly from my own machine, but that'd deploy all
the local changes I have (and I do have some occasionally), so it'd never really
be a clean slate.

[Travis CI](http://travis-ci.org) to the rescue! This little feat also makes me
eat my own dog food, working on Travis CI myself.

Even with a Jekyll site, deploying the content follows the simple pattern of
installing dependencies and building the site.

With the code always coming from GitHub, I could be sure that the deployed state
would always correspond to what's currently checked in.

First order of business: activate the repository on [Travis
CI](http://travis-ci.org), login required.

<img src="http://s3itch.paperplanes.de/traviscihook_20130813_105140.jpg" width="550"/>

Go to your profile, and turn on the repository. This enables the service hook on
GitHub, and all subsequent commits will be sent to Travis CI for instant
building.

### Continuous Synchronization

To deploy your site, you'll need a few libraries, most importantly, jekyll.
There's a nice little tool called
["s3_website"](https://github.com/laurilehmijoki/s3_website), which synchronizes
a static site with S3. It even supports Jekyll and its static content in the
`_site` directory, neat!

Here's the Gemfile:

    source "https://rubygems.org"

    gem 'jekyll'
    gem 's3_website'
    gem 'redcarpet'

I've added Redcarpet too, as it's currently the best Markdown engine available
for Ruby. It's been serving me well for the [Riak Handbook](http://riakhandbook.com) too!

`s3_website` needs a configuration file. You can create a default using
`s3_website cfg create`.

Here's the [one I use to deploy this very
site](https://github.com/roidrage/paperplanes/blob/master/s3_website.yml):

    s3_id: <%= ENV['S3_ACCESS_KEY_ID'] %>
    s3_secret: <%= ENV['S3_SECRET_KEY'] %>
    s3_bucket: www.paperplanes.de

    max_age:
      "public/*": 6000
      "*": 300

    s3_endpoint: us-east-1
    s3_reduced_redundancy: true

    concurrency_level: 100

Note that the bucket needs to exist before you're getting started. I recommend
naming it after your website, based on the domain people use to access it.

As you can then configure CNAME entries for site that points it to the bucket,
and S3 does automatic resolution of the right bucket for you.

### The build and deployment process

The .travis.yml required to tell Travis CI is succinct and simple:

    language: ruby
    rvm:
      - 1.9.3
    script: bundle exec jekyll build
    install: bundle install
    after_success: bundle exec s3_website push --headless

The language used is Ruby, and we're sticking to 1.9.3.

The `script` section defines the command to run to build the code, in this case
`jekyll build` which builds the site and generates the static result in the
`_site` folder.

The `install` section is customized to prevent Bundler from running with the
`--deployment` flag, which is the default for projects with a Gemfile.lock.
Unfortunately it leads to strange errors generating the site.

The last and most important bit is the code that ships the site to S3.
`s3_website push` synchronizes the static output with S3, only uploading files
that have changed. This last bit is very neat, as it keeps the whole sync
process nice and short.

### Secure credentials

The last puzzle piece is the question of how to get those S3 credentials
securely into Travis CI without exposing them to the public.

The access keys are defined as environment variables in the configuration, so we
just need a way to have them set up for our build on Travis CI.

For this bit, you need the `travis` gem installed. Best to add it to your
Gemfile. Travis CI has a feature called ["secure environment
variables"](http://about.travis-ci.org/docs/user/build-configuration/#Secure-environment-variables),
that allow you to encrypt sensitive data in your .travis.yml to avoid exposing
it to the public.

I'd recommend creating a separate user on Amazon IAM for this purpose, with
restricted permissions only for the bucket you're deploying too. You'll need
most permissions available, including listing, fetching and deleting objects.

When you have the credentials, run the following commands in your project's
directory. The `travis` tool will automatically look up the encryption keys for
you on Travis CI.

    $ travis encrypt S3_ACCESS_KEY_ID=ASASK... --add env.global
    $ travis encrypt S3_SECRET_KEY=sshhhhh... --add env.global

These commands add the environment variables to your .travis.yml. Add the file
to git, and push the changes to GitHub.

Now watch your blog be automatically deployed while also making sure the content
builds correctly.

### Fin

This article about deploying your Jekyll site to S3 with Travis CI was
automatically deployed to S3 with Travis CI. Did that just blow your mind?
