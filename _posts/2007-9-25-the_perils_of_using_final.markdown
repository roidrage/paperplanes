---
layout: post
title: "The Perils of Using final"
topics: java thedailygrind
---
I'm currently working with a proprietary framework. Which is not bad per se. Compared to others I've worked with it's a nice framework to work with. It uses Spring heavily which is a plus and makes working with it quite flexible.

All that said there's one thing that bugs me about it, and that bugs me about Java in general. The overuse of final. Not for constants, mind you, but for methods and classes.

Why on earth would someone want to impose this restriction on developers? And by someone I don't especially mean the framework creator, but also the Java creators. Is it really worth it sacrificing flexibility and extensibility to ensure that nobody overwrites your methods or extends your classes to customize them? Do they really think that people are that stupid that they can't decide for themselves what to do with a framework? It's just beyond me. What are classes, inheritance and all that object-oriented mumbo jumbo for anyway.

If something is so important that it shouldn't be overwritten, then please, document it. Don't leave the developer asking why he has to go and reimplement everything himself just to have a certain part of your framework's functionality available to him.