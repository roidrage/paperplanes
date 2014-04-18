---
title: The Developer is Dead, Long Live the Developer
topics: devops
layout: post
---
I came across an article called ["How DevOps is Killing the Developer."](http://jeffknupp.com/blog/2014/04/15/how-devops-is-killing-the-developer/) It mourns the rise of DevOps and an ever increasing set of skills a developer has to have to work in the resource-constrained environment of a startup. The assumption is that a developer has to fill all these roles even though his position is at the top of the company's hierarchy and no one else can do what they can.

I can relate to mourning how things used to be. Writing code is fun, and it's understandable that a developer would want to work on it all day long.

I'm intrigued by this notion of DevOps and the assumption that no one else can do what developers can do, therefore they should be doing what they've specialized to do.

However, times for developers are a-changing and DevOps plays an important role in that.

This is my view of the situation, about what DevOps is about and the change developers are facing.

### DevOps is about shared responsibility

The author claims that DevOps stems from startups. Resource constraints and the need to quickly respond to an everchanging market require developers to fill roles that no one else can fill. I've done my fair share of that, and it's certainly a valid assumption.

However, DevOps has different goals than developers knowing all the infrastructure automation tools out there.

DevOps is about tearing down silos in more traditional companies, where there's a much stricter separation between development and operations.

It's a cultural shift that fosters people working together, towards a common goal, which ultimately leads to serving the customer.

The totem pole described in the article is the exact thing that DevOps is trying to improve. In a more traditional sense, it's described as the ivory tower of parts in an organization, whether that be operations, development or your quality assurance team. The tendency is to throw things over the wall, let them handle it, and not bother with whatever happens after the release anymore.

The ultimate beneficiary of whatever anyone in the company does should be the customer. The argument that developers are too expensive for any other tasks than writing code suggests they're too good to talk to customers, to fix their own code, to see where it breaks in production under their own responsibility, to see how it affects customers.

Customer support falls into the same reign. Traditionally, company's have a front line support team to weed out the unimportant support requests, best to be done by replying with canned responses. Everyone loves those, right?

The outcome is that developers shouldn't just sympathize with their operations team, the people who run their code in production, they should sympathize with their customers.

DevOps pushes the focus of everyone towards working together rather than a single person trying to wear as many hats as possible at the same time, which will inarguably lead to burnout.

The resource constraints of a startup are a natural cause, at least initially, for people having to do whatever it takes to make their product succeed. It doesn't have to be that way, of course, but improving the constraints is up to the company's entire team, at least in a world where people work together.

Ultimately, **DevOps is about empathy, with everyone on your team and with your customers.**

### You build it, you run it

In this world of silos, development threw releases at the ops or release team to run in production.

The ops team makes sure everything works, everything's monitored, everything's continuing to run smoothly.

When something breaks at night, the ops engineer can hope that enough documentation is in place for them to figure out the dial and knobs in the application to isolate and fix the problem. If it isn't, tough luck.

Putting developers in charge of not just building an app, but also running it in production, benefits everyone in the company, and it benefits the developer too.

It fosters thinking about the environment your code runs in and how you can make sure that when something breaks, the right dials and knobs, metrics and logs, are in place so that you yourself can investigate an issue late at night.

As Werner Vogels put it on how Amazon works: ["You build it, you run it."](https://queue.acm.org/detail.cfm?id=1142065)

The responsibility to maintaining your own code in production should encourage any developer to make sure that it breaks as little as possible, and that when it breaks you know what to do and where to look.

That's a good thing.

### The developer is dead, long live the developer

It's okay to mourn what we used to do as developers. Heck, I enjoyed writing code too, when I started out as a developer.

But the specialist developer is becoming a liability for any business that's competing in ever-changing markets (which are all of them).

This doesn't mean that a developer should be doing everything at the same time. But they should be ready to when the need arises. It benefits the entire team they're working in.

A developer probably doesn't need to know all the available automation stacks out there. Knowing one should be plenty. What really matters is the willingness to change, to learn a new stack when necessary.

**Having more wide-spread knowledge about the environment their code runs in gives a much better picture on how the code can be improved to run better, in production, to serve happy customers.**

Here are a few more noteworthy responses to the blog post above:

* [Confessions of a Full Stack DevOp](http://www.ansible.com/blog/confessions-of-a-full-stack-devop) by Michael DeHaan
* [DevOps and enterprise inertia](http://major.io/2014/04/17/devops-and-enterprise-inertia/) by Major Hayden
