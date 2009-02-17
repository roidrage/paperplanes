---
layout: post
title: "Migrating a Project to use Rails UTC-based Migrations"
topics: rails
---
A confusing title, I know. But I recently upgraded a rather big project to use Rails 2.1. Everything went pretty smoothly, but one thing bugged me, since it's not really documented anywhere: What happens if you migrate from the old numbered migration scheme to the new one using UTC timestamps?

The new migration system dumps every migration ever run into a new table called `schema_migration`. That of course includes your old migrations, at least those that exist in db/migrate at the time you first run `rake db:migrate` on a Rails 2.1 project. It will silently drop the old and trusty `schema_info` table, and from then on you're good to go to use the new naming scheme for migrations.

So migrating a project to use the new migration scheme is as simple as running `rake db:migrate` once. Check that the table `schema_migrations` hasn't been created accidentally though. That will just fail inserting the existing migrations.

There, that was easy.