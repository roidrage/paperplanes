---
layout: post
title: "Refactoring Rails Controllers"
topics: bestpractices rails refactoring ruby testing
---
This post has been lying in my drafts folder for a while now, and since I'm trying out new approaches to shrink oversized controllers, it's about time to put this out, and get ready for describing alternatives.

One of the basic memes of Rails is "Skinny controller, fat model." And even though most examples, especially the ones using the newer REST features in Rails advertise it, there are still heaps of controllers out there that have grown too big, in both the sense of lines of code and the number of actions. I've had my fair share of super-sized controllers over the last months, and it's never a pleasant experience to work with them.

If you don&rsquo;t believe me, look at the Redmine code. Whether it's laziness or lack of knowing better doesn't really matter. Fact is, if it keeps growing you'll have a hard time adding new features or fixing bugs. Error handling will become more and more cumbersome the more code you stuff into a single action.

And if it's pretty big already, chances are that people will throw in more and more code over time. Why not? There's so much code in there already, what difference does it make? Broken windows are in full effect here. If the controller is full of garbled and untested code already, people will add more code like that. Why should they bother writing tests for it or refactoring it anyway? Sounds stupid, but that's just the way it is.

On a current project I refactored several (and by that, I mean a lot) of these actions to merely four to ten lines of code. The project is not using RESTful Rails, but it wouldn't make much of a difference anyway. I've made some experiences that worked out pretty well for me, which would very likely help to make a controller RESTful. But that wasn't really the main objective on my current project. If they're still up to par when fully using REST I'll leave up to you to decide or, even better, update.

I&rsquo;m not going to put code into this article, since most of the stuff is graspable without looking at code. If you see the sort of code I&rsquo;m talking about you&rsquo;ll understand.

It's actually just a few simple steps, but they can be both frustrating and exhausting, even when you take on step at a time (which you should, really).

### Understand what it does

It's too obvious, isn't it? But still, a beast consisting of 160 of code should be approached carefully. Understand what each line does, and more importantly, why it does it. In an ideal world you can just read the code, and understand what it does, but we both know that&rsquo;s wishful thinking. If you&rsquo;re lucky you can just ask someone who knows their way around. But oftentimes you&rsquo;re out of luck, and just have to gather as much information from the code as you can, or from playing around with the application itself.

Don't just look at the code, run it from the application, look at the parameters coming in from the views. Annotate the code if it helps you, it might help others as well.

Look at the view code too. This also isn't always a pleasant experience, but you will find hidden fields, parameters set and handed through in the weirdest ways for no apparent reason.

### Test the hell out of it

Most likely the action at hand does not have any tests available to ensure your refactoring will work out well, otherwise you very likely wouldn't be in your current position. If it does they might've been abandoned a long time ago, and it's not even safe to say if the tests are still testing the right thing. If you have a big controller with a good test suite in place, even better. Check if they're testing all aspects of the code about to be refactored.

If not, take this opportunity to write as much tests for it as possible. Test even the simplest features, with as much detail as you can or as the time available allows for. You don't want even those features to break, do you?

I easily end up with 50 new test cases for a bigger action during such a run. Resist the temptation to refactor while you write tests. Mark parts of the code if you get ideas what to do with them, and get back to them in the refactoring phase.

Avoid testing too much functionality at once in a single test case. Keep them small and focused on a single aspect of the code in question. It doesn't have to be tests with just one assertion, but keep it focussed on a specific aspect of the method in question.

Basically it's now or never. This is the chance to improve test coverage, so do it. You'll be happy you invested the time, it will give you a better understanding of the code, and will ensure that the code still works.

It&rsquo;s a painful process, but it also helps you to really understand what the code does.

### Avoid complex fixtures

I don't use a lot of fixtures anymore in my functional tests. They're not just a pain in the ass, they're hard to set up, especially for complex actions, and they kill test performance. Try to use mocks and stubs instead. If you test your action line by line you can easily identify the methods that need to be stubbed or mocked. If you prefer it the scenario way, use something like factory_girl to setup objects for your tests. I'm a fan of stubbing and mocking, but too much of it will clutter your test code. I've been using it heavily for a while, but it tends to become a sign for bad design when you're using too much of it. So I've returned to using scenarios based on the task at hand, even if they hit the database.

If you turn to mocking/stubbing initially, make sure you untangle the potential mess afterwards. Even though the database can make your tests slower, in the end you want to test the whole thing.

You also want to stub out external collaborators, like web services, Amazon's S3 and the like. They don't belong into your controllers anyway, but moving them somewhere else might just open another can of worms (think asynchronous messaging), and introducing that level of complexity is just not what you need right now. Though you might want to consider it eventually.

### Move blocks into methods

I'm not speaking of a block in terms of proc and lambda, but in the sense of conditional branching and the like. Longer if/else clauses usually are good candidates for getting code out of a long method into a new one, and you usually can go ahead and do just that. Once you've moved stuff out into methods, it's a lot easier to move them into modules or the model, but only if the blocks depend on parameters you can't or don't want to reach in your model.

Try to avoid the temptation to look for similar code to consolidate in the same or other controllers just yet. Make a note, and wait until you have tests in place for all the affected code. Then start to make the code DRYer by moving it into a place more common for all the classes that require it.

### Break out new controllers and new actions

The same rule that applies to adding new actions to controllers also applies to working on existing ones: Having lot of actions in one controller usually means that it's doing more than it's supposed to. More and more actions usually mean there's code that's not really the controller's responsibility, solely speaking in terms of concerns. If the controller responsible for logins also takes care of a user's messages, then it breaks the separation of concerns. Move that stuff out into a new controller.

But if you can, it's also feasible to break out new actions. That's a good option when you have an action that responds differently based on input parameters or depending on the HTTP method, an old Rails classic. It will have the advantage that stuff like error handling will get a lot simpler. Big actions that do different things all at once tend to have a complex setup for catching errors. Several variables are assigned along the process, and at the end there's a long statement that checks if somewhere along the way an error occurred. If you separate the different tasks into smaller actions, you'll end up with much simpler error handling code, since it can focus on one thing, and one thing only.

The same goes for all classes really. Although with a model it's not always easy to break out a new class. But what you can do is break out code into modules and just include them.

### Extract filters

Filters are a nice fit for parts of the code where objects are fetched and redirects are sent in case something isn't right, especially since the latter always require that you step out of your action as soon as possible, before doing any further logic. Moving that code out into methods, checking their return code and returning based upon that will make your code look pretty awkward. Filters are also nice to set pre-conditions for an action, pre-fetch data and the like. Whatever will help your controller actions do their thing with less code, and doesn&rsquo;t fit into the model, try fitting it into a filter.

Try to keep them small though. It's too easy to just break out filters instead of moving code into the model, and it will slightly improve the code for sure. But what you really want is a small and focussed controller with a couple of lines of code in each action, and a few supporting filters around them.

### Move code into the model

This is where it gets tricky, but now you can get all that business logic where it belongs. To get code out of the controller and into the model, you have to make sure it doesn't rely on things that's only available in it. params, session, cookies and the flash are the usual candidates here.

But there's always a way to work around that. Oftentimes you'll find code that assigns an error message or something similar to the flash. That kind of stuff is sometimes easier to handle in validations in the model, if it's dealing with error messages. I've seen that a lot, and it's just not the controllers responsibility to do all that work.

If your controller code is heavily dealing with stuff from the params hash, you can usually just hand that over to the model. Given of course that you properly cleaned it up first into a before_filter, or ensured that proper validations are in place.

You&rsquo;ll usually find lots of constructed finders in controllers. Go after those too. Either use named scopes if you can, or create new finders in the model. It's already a lot easier on the eye when all that hand-crafted finder code is out of the way, and tucked neatly into a model.

Code that checks model objects for errors, validity, etc. belongs into validations or callbacks in your model. Just like any other code that&rsquo;s none of the controllers&rsquo; business. Which basically is to mediate between the view and the model, and to do everything required to get that task done fast and without hassle. So that's the next step. A lot of times you'll find controllers setting arbitrary instance variables based on the state of the model. Rings a bell? Sure, why should the controller store the state of the model? It just should not. That's what the model is for, right?

When you&rsquo;re done moving code into the model, move the according test code from functional to unit tests. Tests that used to test the business logic from the controllers perspective can now do so from a unit test. That way your functional tests can solely focus on what your web layer does.

Over time you will get an eye for code that just belongs into the model, and code that could be moved into the view, or that needs to stay in the controller. It takes practice, but the more the better. Working with legacy code is oftentimes an opportunity, not a punishment.

### Know when to stop

Now that you have a skinny and tested controller, why not just keep going? It&rsquo;s easy to fall into the refactoring trap. It&rsquo;s just such a nice feeling of accomplishment. If you look at it that way, you could just keep refactoring your application&rsquo;s code forever. But who will build the new features? Who will fix the bugs?

Avoid refactoring for the sake of it. Refactoring is an important part of the development life-cycle, but you need to find a balance between your role as a programmer, where you add new features and write tests for them, and the refactoring part.

So I could say &ldquo;rinse and repeat&rdquo;, but when you&rsquo;re done with the controller at hand, leave it be. Get a coffee, and bask in the glorious feeling of just having done your code and the developers to come, a big favor. Unless of course, you have a lot of time. In that case, for the love of code, keep going. But that&rsquo;s usually a luxury. What you can do instead is plan in time for more refactorings when you&rsquo;re adding features on a controller that&rsquo;s another mess. Clean it up first, then get going with the new code. When you see code that could need a refactoring while working on something different make a note (and by note I don't mean TODO, FIXME, and the like, they will get lost in the code, and never be looked at again), and get cracking on it later.

This was just a beginning though. There's still things that surprise me when I work with legacy Rails code, and they want to be dealt with in their own specific ways. As I mentioned earlier, I'm still trying out new things, and I'm going to keep posting about them.

Please, share your experiences on the matter. I'm pretty sure I'm not alone with the pain of oversized controllers.