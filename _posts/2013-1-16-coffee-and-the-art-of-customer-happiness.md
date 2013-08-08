---
title: Coffee and the Art of Customer Happiness
topics: coffee customers
layout: post
---
This essay is an extended version of a talk I gave at [Paperless
Post](http://www.paperlesspost.com) about coffee and customer happiness. While
the talk was originally titled "Coffee and the Art of Software Maintenance", I
figured that customer happiness is overall a much more fitting for the topic.

For coffee, maintaining and improving your craft and making customers happy are
two means to the same end: to have loyal customers who tell their friends about
you.

### Geeks everywhere!

I'm a coffee geek, and I spent a lot of time in coffee shops. But rather than
spend it on my laptop, writing code, I spend the time watching and talking to
the fine people making my coffee, the baristas.

Baristas are geeks, just like we are. They love talking about the latest toys,
about which espresso machine is better than the other, they compare paper
filters with cloth, and they take detailed notes on the different aromas of
coffee when they’re cupping it.

The craft of coffee making is quite fascinating, both from the perspective of
precision and customer care. But let's start with a little story.

In June 2010 I had the pleasure of visiting a rather special coffee shop. The
London roaster [Square Mile](http://shop.squaremilecoffee.com) had opened a
popup shop that only served filter coffee. No milk beverages, not even espresso.
Just filter coffee.

It was called [Penny University](http://www.pennyuni.com).

<a href="http://www.flickr.com/photos/ipom/4763878828/" title="Penny University by Mathias*, on Flickr"><img src="http://farm5.staticflickr.com/4102/4763878828_c5b749d7fa.jpg" width="500" height="330" alt="Penny University"></a>

### The greatest coffee shop in the world

The shop consisted of a bar and six stools. It offered a very simple menu, with
three different kinds of coffee served at any time. Every coffee was brewed
using a different technique and served with a piece of chocolate matching the
taste of the coffee.

For instance, the Yirgacheffe from Ethiopia was brewed with a Hario V60, which
so happens to bring out its delicate and sometimes lemony flavours. It was
served with a piece of chocolate that also had a lemon flavor.

<a href="http://www.flickr.com/photos/ipom/4763879600/" title="Penny University by Mathias*, on Flickr"><img src="http://farm5.staticflickr.com/4075/4763879600_0fe2bc15d1.jpg" width="494" height="500" alt="Penny University"></a>

You could either choose to have just a single brew or to try all three varieties
in a three course menu. The latter would require you to sit in for 30 minutes
with the barista giving you his full attention, explaining flavors, origin and
the brewing technique.

It was one of the greatest coffee experiences I've had so far. The setting, the
barista, the attention to detail, the barista's focus on delivering the best
possible value, it all added up to something very special and unique.

As I later found out, I was served by the owner of Square Mile, 2007 World
Barista Champion James Hoffman.

Sadly, the shop closed after three months.

### Meanwhile, in Berlin

As if by coincidence, after that the coffee scene in Berlin started to take of.
Since then, I've had the pleasure of hanging out with a lot of fine baristas
from all over the world chatting about coffee, all in the comfort of my
hometown. Especially at [The Barn](http://thebarn.de), a shop that opened around
the same time, I learned to appreciate to precise finesse of making coffee. It's
a downward spiral.

At some point what I've learned started having affects in what I do for a
living, build and run software, and making customers happy by providing them
with the best possible value.

<a href="http://www.flickr.com/photos/ipom/5333463392/" title="Coffee time at The Barn by Mathias*, on Flickr"><img src="http://farm6.staticflickr.com/5164/5333463392_7dc0c1f5e1.jpg" width="495" height="500" alt="Coffee time at The Barn"></a>

### Each necessary, but only jointly sufficient

Let's look at precision and what makes a good cup of coffee.

While a good of coffee is a subjective experience, a barista strives for one
thing: to make every cup of coffee as great as the next.

To achieve that goal, every variance must be removed. Every step of the brew
process must be subject to the same conditions.

This is truly an art, though it sounds surprisingly boring, as the ultimate goal
is to have a process that's repeatable every single time. Consistency is a
barista’s prime directive.

The variables start with hardness of water, involve finding the right coffee
grind setting, which varies from coffee to coffee, to making sure the
temperature of the water is always the same.

Add to that water flow, circulation and agitation of coffee grounds during the
brew, measuring the water used to brew (water has a different weight when it's
hot compared to when it's cold), weighing the coffee beans and timing the whole
brew.

Of course every variable can be different depending on what brew method is used
for the coffee.

A barista has to make sure he can measure every single variable to make sure
the brewing conditions are the same every time. This is true both for espresso
and filter coffee. Plus, every variable can vary depending on the coffee bean,
the roast, and its origin.

If he needs to change something, he can only change one variable at a time to
make an informed decision on whether the change had a positive or a negative
impact on the resulting brew.

Changing only one variable can have terrible results, leading to a less
enjoyable result. Grind the coffee beans too coarse, and the coffee will have
less taste, it's under-extracted.

Use too little water, and the coffee will be over-extracted. Choose a
temperature that's too hot, and the coffee will be less enjoyable, and the
customer will have to wait for it to cool down. Use boiling water and you might
kill some of the flavors that make the coffee at hand so unique.

You'll find these conditions mostly in the really good coffee shops out there,
where people care about their craft. The Starbucks around the corner will make
you a latte that burns your tongue, which is unacceptable to what I'd consider a
professional barista.

Does all that sound familiar?

### Metrics, metrics everywhere!

Over the last two years or so we've seen the operational trend to measure
everything. Every variable that can change when code is running in production is
measured over time.

![](http://s3itch.paperplanes.de/graph-4-20130116-072659.png)

Only one variable changing at runtime can have catastrophic results on the whole
software, possibly leading to cascading failures or triggering other bugs in the
code that have remained undetected so far. Metrics and measuring give you the
insurance that if something goes wrong, if something goes off the normal flow,
you will notice it immediately.

The same is true for changing code. I find it particularly hard to change code
without knowing how it currently behaves in production. Just like with brewing
coffee, changing multiple parts of a certain feature at once can lead to
behavior that’s hard to reason about.

I prefer doing single changes at a time to see how they behaves in isolation.
Rather than seeing this as a restriction because of fear of breaking things, I
see that as a culture of introducing a single seam at a time to see if it breaks
or not. Breaking one thing at a time is much preferable to breaking many.

The important bit is that a company's culture needs to ensure that teams can
iterate around these smaller changes quickly, continuously monitoring how they
behave in production.

### Continuous Coffee Delivery

It's the equivalent of a barista shipping dozens if not hundreds of cups coffee
per day. It’s [continuous delivery](http://continuousdelivery.com), a culture
fully embraced by the barista at your favorite coffee shop. There can be tiny
variances in every single cup, but the barista focuses on keeping them as small
as possible and on changing only one thing at a time to be able to get
measurements on its effects quickly.

I’ve seen baristas taste my brew before serving it, always ready to chuck it and
make a fresh one from scratch, should the end result not satisfy their own
quality standards. A smoke test, if you will. It's a great little detail that
looks odd at first but makes a lot of sense when you know how many variables are
involved.

To round things off, a good barista practices every day. A few dry runs before
opening shop and after make sure that variations in the coffee bean are
continuously evened out by adapting the brewing process. As coffee beans
deteriorate over time (usually a few days to a few weeks) they get drier, and
they need a different grind setting.

Of course, this also involves learning new tools, new brewing techniques,
choosing the one best applied for a particular brewing method.

I've been surprised many times to how similar all this is to our own work, to
writing, shipping and running code.

### Talk that talk

<a href="http://www.flickr.com/photos/ipom/4489269938/" title="Blue Bottle by Mathias*, on Flickr"><img src="http://farm3.staticflickr.com/2712/4489269938_c4ec1cdcdd.jpg" width="491" height="500" alt="Blue Bottle"></a>

It’s fun and interesting to talk to baristas about their work. I've found a lot
of them to be happy to share details about what they're doing and why, and they
seem to be just as happy to know that there are people who are not just
interested in a good cup of joe, but also in how it came to be. They're
passionate about their work, just as you are about your code.

Talk to them long enough and they'll think you're working in coffee too. It's
pretty fun, it's the equivalent of your customer talking to you about the nuances
of concurrency in different programming languages.

It's something that's easy to forget when you spend most of your time with
people doing similar work as you do. Compared to a barista, you're just brewing
code instead of coffee.

It’s great to talk to other people who are passionate about their work and
providing the best value for their customers. It's reaffirming that you're on
the right track when you realize that other professions follow similar
philosophies.

There's another variable that I have yet to mention: the coffee bean itself. A
lot of coffee shops, unsatisfied with the coffee they got from other sources,
start looking into roasting their own. They want to take that last variable out
of the equation that's under someone else's control.

### Plan to throw one (hundred kilos) away

<a href="http://www.flickr.com/photos/ipom/6189441531/" title="Copenhagen II by Mathias*, on Flickr"><img src="http://farm7.staticflickr.com/6152/6189441531_ecea81fa28.jpg" width="500" height="330" alt="Copenhagen II"></a>

Unfortunately, roasting coffee opens a whole new can of worms. Just like it
takes time to find the right values for brewing coffee, you need to find the
right temperature and roasting time coffee for every single coffee bean.

To get there, lots of coffee gets thrown away. A coffee shop in Berlin recently
started roasting, and they went through several hundred kilos of green beans
before they came up with a satisfying end result. Let me tell you that the end
result is pretty spectacular.

What they basically apply here is rapid prototyping. They iterate around several
bags of coffee to find the right conditions to extract the best possibles aroma
from the bean.

It sounds insane to throw away all that coffee, but it has to be to make sure
the customer gets the best possible value when buying it.

This is why specialty coffee is more expensive than your bag of Starbucks or the
coffee you buy at the supermarket. The value for the person enjoying it is a lot
higher as there's a lot more to be experienced than just black coffee.

Unsurprisingly, even bad coffee is these days sold for a premium. When you
extrapolate K-cups to the volume of a single bag of Cafe Grumpy beans, you end
up paying the same or even more.

The value proposition is convenience. The overall experience is worse than when
controlling all the brewing steps yourself, but at least you can be sure to get
a cup of coffee quickly.

The craft of coffee has a lot of similarities to software development and
maintenance. It's a gradual process, with lots of learning and experience
involved.

When you run a coffee shop, there comes the time when roasting yourself is the
only option, because you want to have control over everything or because the
coffee you buys elsewhere is below your quality standards. Or simply because
it's more convenient to do everything in-house.

That's like eventually writing your own custom software components or starting
to own your infrastructure more and more over time. You need the control to
ensure the best possible service to your customers. It means more work on your
end, but if it can ensure that your customers are happy, it's well worth the
effort.

<a href="http://www.flickr.com/photos/ipom/8385652133/" title="Four Barrel by Mathias*, on Flickr"><img src="http://farm9.staticflickr.com/8365/8385652133_f47b9c7480.jpg" width="500" height="332" alt="Four Barrel"></a>

### Coffee is a personal experience

The one thing that I admire the most about baristas is that they're close to the
customer all the time. The customer can follow along every step her coffee takes
to get into her hands.

The customer is free to talk to the barista along the process, and most baristas
are more than willing to share their insight, what the coffee tastes like and
where it came from.

At some [Intelligentsia](http://www.intelligentsiacoffee.com) shops, you're even
assigned your personal barista that takes you to the entire process of making
your coffee. I'm very much in love with that idea. If you stretch that idea to
running an internet business it's similar to having a single support person
that's taking you through the lifetime of a ticket. As a customer you know that
the person on the other hand will know all the details about the issue at hand.
It makes the whole experience of customer service a lot more personal.

I went to a coffee shop in Toronto and asked the barista about their favorite
coffee, which I commonly do when I'm presented with a lot of choices I haven't
tried before. I ended up with a rather dark Sumatran brew from the Clover, one
of the greatest technical coffee inventions of all time, sadly they were bought
by Starbucks, and it was a bit too dark for my taste.

As a courtesy, she offered me to get another brew, on the house of course. She
took charge of her recommendation not meeting my taste and offered me something
else for free.

This face-to-face communication also makes it harder to be angry about
something. It's still possible, but it's also a lot easier to react to an angry
customer when he's right in front of you. If it happens, you offer a free
beverage.

### Customer experience trumps everything else

That's one of my biggest learnings of the last year, and I have my favorite
coffee shops to thank for the inspiration. Personal customer experience trumps
everything else, even for a business that's solely accessed through the
internet.

You could think that a barista telling you all about their secrets or how to
brew excellent coffee will make you stay at home and start making your own
coffee all the time.

And so you will. But you will keep coming back because the barista knows you by
name, because they learn your taste in coffee, because they give you free
samples, because they let you try new coffees first.

That kind of experience is priceless.

A lot of coffee shops have customer loyalty cards. You get a stamp for every
coffee and the next coffee is free. I think those loyalty cards are great, and
I'm contemplating how they could be applied to internet businesses.

But consider this: instead of knowing that your next coffee will be free, a
barista randomly gives you free drinks, new coffee blends, an extra shot of
espresso.

Without expecting that next coffee to be free, your happiness levels will be
infinitely higher. It's something that I found to make for even more loyal
customers and to give them an overall much more personal experience. The
surprise trumps every single stamp on your loyalty card.

It's one of the reasons why we send each of our customers a bag of coffee beans.
It seems so unrelated to our business, but all of us care about good coffee. And
what makes it for the customer is the surprise, them not expecting anything like
that from an internet business.

It's also why [MailChimp](http://mailchimp.com/2012/) sent out almost 30000
t-shirts last year. After you've successfully launched your first campaign, they
send an email to congratulate you and offer to send you a t-shirt. A great and
unexpected gesture of customer love. It's worth noting that the shirts are of a
great quality, which definitely adds to the surprise.

The similarities of running a coffee shop to running an online business and
maintaining software are pretty striking, and you'd think that's only natural,
as lots of crafts and running a business are very similar.

Yet the subtleties are what makes every single one of them special, and it's
worth looking at them in more detail to see if you can improve your own skills
based on the gained knowledge or if you can improve your business' customer
relationship efforts.

Both the precision and the customer experience of a good barista and a great
coffee shop are something that value one thing: the best possible value for a
customer, a great cup of coffee. If you can get one cup of coffee right and make
a customer happy, they'll come again, and again, and again.

Getting a customer to stick around, turning them into your most loyal customer,
that's the best thing any business, any developer building a customer-facing
product can ask for.
