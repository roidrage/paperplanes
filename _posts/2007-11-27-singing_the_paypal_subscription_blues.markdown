---
layout: post
title: "Singing the Paypal Subscription Blues"
topics: paypal rails ruby thedailygrind
---
For a recent project I had the pleasure to work with Paypal, especially with the Instant Payment Notification API. I haven't heard a lot of things before I tried to marry it with Rails, but what I'd heard made me assume it wouldn't be a piece of cake. And I was right.

I'd love to share some code with you, but [Vasillis Dimos](http://fortytwo.gr/) beat me to it. He wrote two posts on Paypal IPN and Rails, one dealing with [the basics](http://fortytwo.gr/blog/14/Using-Paypal-with-Rails) and the other about [mocking IPN](http://fortytwo.gr/blog/17/Mock-testing-Paypal%27s-IPN-with-Rails), which you really need to do to test your code. Really.

Personally I did the testing a little differently, since all my payment handling logic was in the model. I didn't use [ActiveMerchant](http://www.activemerchant.org/) either, but just the [Paypal gem](http://dist.leetsoft.com/api/paypal/). But in general things are similar. Outside of the US and the UK you're pretty much out of choices for payments, since there's no Web Payments Pro available here, so IPN is (sadly) the way to go. It's a real PITA and here's why:

* Paypal needs to reach your development machine from the outside. For testing this is not an issue of course, but when you need to do testing with the Paypal sandbox (which is painfully slow) and, god forbid, the real Paypal, there's no way around that.
* The payment flow is unnatural. You have to handle the payment outside of the user's page flow. You have to rely solely on the stuff you get from Paypal, no session, no cookie, no user. It takes a lot of care to handle all that and there still might be a hole in your code that could be exploited.
* IPNs might come in late, sometimes only after the user already got back to your site. Now you want to present him with a nice success message, but that's not gonna happen then. That's a rare case though. The IPN come in slower from the sandbox, that's for sure. It's up to you how to handle that. You can act in the favor of the user, or you can just make him wait till everything fell into place.
* In rare cases you won't get an IPN from Paypal, for whatever reason. I've seen this happen. Be prepared to create the successful payment by hand or have something like a small GUI at hand to do it.
* For subscriptions six different notification types need to be handled. And their even spread out over two different fields in the notification.

Some advice on how to get it right:
* Log everything. Store the IPNs in the database, in the log files, wherever. Just log them. Their your proof of things that happened. Just storing them with their raw post data should do while leaving the most important fields separately in different columns.
* Use mocks. It's not hard. But it's totally worth it. When you want to test all events that Paypal might send you, which is a lot for subscriptions, it's a painful development cycle. And some events aren't even fully testable by hand.
* Decide on strategy to handle fraud. While your IPN URL is not really public (nothing should link here, and it's hopefully transmitted to Paypal encrypted) it's not exactly safe to just accept everything.
* Don't return errors in your IPN handler. Paypal will try it again.
* Store a pending payment and make it a full one when the corresponding IPN arrives.

All that said, it was an experience, and while not always pleasant, at least I learned something. But Paypal is far from being a pleasant way to handle payments, if you want to make it secure and protect your the integrity of your application and prevent fraudulent users from abusing your services, all of which should be your primary interests.