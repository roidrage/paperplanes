---
layout: post
title: "MySQL No-Nos: ORDER BY RAND()"
topics: mysql thedailygrind
---
It's a classic. You want to return random rows from a table, say a collection of random users in your social network. Easy, MySQL's `ORDER BY RAND()` to the rescue. After all, everybody's doing it. At least on my last search on that topic, all the PHP kids did it.

    SELECT * FROM USERS ORDER BY RAND() LIMIT 20

There. Does what it's supposed to.

Your social network keeps growing and growing and after about a year and 50000 new users you realize a slow-down on the page where you show random users. You're thinking of caching it, but what's the point? It wouldn't be random.

You break it down with `EXPLAIN` and realize with horror that your fancy query doesn't use the nice index you placed on the table ages ago. And why would it? It's calling `RAND()` for every row in your table, there's just no way around it. So what to do?

One alternative is to fetch random IDs first and then join the IDs found with the `USERS` table to fetch the real data. How do we do that? Why, using `ORDER BY RAND()`, of course. Wait, didn't I just say you're not supposed to use it? Well, I did say that, but the difference is that we'll run the `ORDER BY RAND()` on the best-indexed column there is, the primary key. Let's break it down and get our hands dirty:

    SELECT USERS.* FROM (SELECT ID FROM USERS WHERE IS\_ACTIVE = 1
    ORDER BY RAND() LIMIT 20)  
    AS RANDOM\_USERS JOIN USERS ON USERS.ID = RANDOM\_USERS.ID

And with a little bit of thinking we got ourselves a nice and fast way to fetch random data. Most likely there are other ways out there (sometimes I do miss Oracle's ROWID), but this one worked fairly well for me. It probably won't scale forever though, so be prepared to get back to it every once in a while.