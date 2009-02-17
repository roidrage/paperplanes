---
layout: post
title: "Stalled MySQL Logins"
topics: mysql
---
If you ever see a list like this in your MySQL process list, run!

    +---------+--------------------------------------------+--------------------------------+------------+-----------------+------------+-------------+------------+
    | Id  | User                 | Host           | db   | Command | Time | State | Info |
    +---------+--------------------------------------------+--------------------------------+------------+-----------------+------------+-------------+------------+
    | 442 | unauthenticated user | 10.1.1.2:55885 | NULL | Killed  | NULL | login | NULL | 
    | 443 | unauthenticated user | 10.1.1.1:48009 | NULL | Killed  | NULL | login | NULL | 
    .....
    | 444 | unauthenticated user | 10.1.1.1:58105 | NULL | Killed  | NULL | login | NULL | 
    | 445 | unauthenticated user | 10.1.1.2:60799 | NULL | Killed  | NULL | login | NULL | 
    +---------+--------------------------------------------+--------------------------------+------------+-----------------+------------+-------------+------------+

No seriously. Apparently it's something of a [known bug](http://bugs.mysql.com/bug.php?id=2814) which comes up at unpredictable points in time.

One proposed solution is to add all your internal hosts which can't be looked up through DNS to your /etc/hosts file:

    10.1.1.1    appserver1
    10.1.1.2    appserver2

Et voila. The exact same moment, all the users were authenticated. Scary? Yes. Weird? Yes. Problem solved? Yes.