---
layout: post
title: CouchDB Views The Definitive Guide
topics: couchdb
---
CouchDB is full of awesomeness all by itself, the offline replication kicks serious butt. But there is one part that is
so essential to it, with so much information scattered about and so much confusion about how they work and why. I'm
talking about CouchDB views. On first sight, they're a mere way to query data. But there's a whole lot more to them. In
this series, I want to go in depth on how they work, why they work, and what they can do.

**The Basics**

On a high level, a view is a design document, a JSON document like any other. What makes it special is

* The naming. View document names start with `_design`
