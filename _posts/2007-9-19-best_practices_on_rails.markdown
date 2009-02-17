---
layout: post
title: "Best Practices on Rails"
topics: bestpractices rails railsconf ruby
---
This morning, on day two, Marcel Molina and Michael Koziarski did a little Best Practices session, a welcome change to the keynotes and sessions. It was very code-oriented. I did even take something out of it I didn't know before. Though I wish it would've gone into a little bit more detail (which I actually wish for a lot of the other sessions as well, but more on this in a later post), it was something that you could relate to on a practical level.

I took some notes, without code though, and here they are:

- Keep the controllers skinny, keep logic that&rsquo;s on the model's low level out of the controller
- All that logic in the model makes it the fat model
- The controller should not deal with that logic, because it&rsquo;s a different layer of abstraction
- Rough guide: 6 to 7 actions per controller, 6 to 7 lines per action
- Use association proxy methods. Add custom finders for associations to keep the association logic in the model and to represent the business logic more clearly
- Use explicit and short validation callbacks (e.g. `validate :make_sure_something_is_as_it_should_be`) instead of just long validate methods. It&rsquo;s easier to read and understand
- `with_scope` can make code harder to read and is (apparently) used in situations where it isn&rsquo;t necessary. It can be used to fake associations through proxies, e.g. to find objects that aren&rsquo;t associated with an object through the database, but through some conditions, e.g. a smart group or a smart folder

Short, but sweet.