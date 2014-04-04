---
title: On Assessing Risk in Socio-Technical Systems
topics: risk safety operations
layout: post
---
I gave a talk about risk and safety in engineering at the DevOps user group in Frankfurt recently.

I talked about practical drift, normalization of deviance and the general ideas of risk and how complex systems make it almost impossible to predict all possible outcomes for a system running in production. The idea of the unknown unknowns (thanks, Donnie Rumsfeld!) and Black Swans (courtesy of [Nassim Taleb][10]) also came up.

A black swan, or an unknown unknown, is an event that is not just unlikely, no one has ever seen or consider it before. It's an accumulation of events so unlikely, that them coming together is beyond the risks anyone would normally consider, 9/11 comes to mind.

I had a chat with one attendee, who suggested that, before you build a system, you look at its properties and look at the possible influences of each one, considering the possible risks of things, going further and further back the causal chain of possible events that could lead up to an incident in the system to be designed and built.

As engineers, this seems like a plausible idea to us. You sit down, you look at your system from all known angles, you measure things, you apply some math here and there.

We like to think of engineering as a predictable practice. Once something's built with the right measurements, with the right tools and with a touch of craftsmanship, it'll last.

As a German, this idea certainly appeals to me. If there's anything we enjoy doing, it's building machines or parts for machines, or build machines to build parts of other machines.

### The Boeing wing test

![](http://s3itch.paperplanes.de/787-20130111-114538.png)

Take this picture, for instance. It's a magnificent sight, and it's a testimony to predictive engineering. It's the infamous wing test for the Boeing 787 Dreamliner.

For the test, the plane's wings are attached to a pretty impressive contraption. They're slowly pulled upwards to find the breaking point.

This test is intended to go way beyond the circumstances commonly found during normal flight operations, up to 150% above normal levels.

There's a video from a similar stress test for the Boeing 767 too. The wings break spectacularly at 154% beyond normal levels.

The engineers are cheering. The wings were built to withstand this kind of pressure, so it's only understandable, especially for us fellow engineers, that these guys are beyond happy to see their predictions realized in this test.

Ideally, you will never see wings being bent to these extremes.

Wings are but one piece in the big, complex system that is a modern plane.

A plane operates in an environment full of uncertainty. While we like to think we can predict the weather pretty well, its behavior cannot be controlled and can change in unpredicted, maybe even unprecendented ways. It is a system in itself.

This is where we come back to the idea that risk in complex systems can be assessed upfront, when designing, before building it.

A plane, on its own already a complex system, interacts with more complex systems. The humans steering it are one of them, the organization the pilots participate in are another. The weather is yet another complex system.

The interaction points of all these systems are almost boundless.

Engineers can try to predict all the possible states of a plane's operating environment. After all, someone is programming these states and the plane's responses to them.

But they can't predict how a human operator will interpret whatever information the system is presenting to them. Operating manuals are a common means to give us much insight as possible, but they're bound to what is known to the designer of the system before it is put into production use. 

This is where socio-technical systems come into play. Technology rarely stands on its own, it interacts with human operators to get the job done. Together, they form a system that's shaped and driven both by technology and the social interactions in the organization operating it.

### Complex systems exist on the micro and the macro level

A plane's wing is bound to wind, jet stream, speed, the material used to build it, the flaps to adjust the planes altitude. But it doesn't end there. It's bound to the care that was used building it, designing it, attaching it to the plane, the care of maintaining it.

With these examples along, the wing is part of several feedback loops. In "Thinking in Systems", a feedback loop is how a system responds to changing conditions. The wing of a plane can respond to increasing pressure from upwards winds by simply bending. But as we've seen above, it can only bend so far until it snaps.

But the wing is able to balance the increasing pressure nonetheless, helping to reduce impact of increasing wind conditions on the plane.

The wing then interacts with the plane, with its wheels, with its speed, its jet engines, its weight. The plane interacts with the pilots, it interacts with the wind, with the overall weather, with everchanging conditions around it.

The wing is therefore resilient. As per ["Thinking in Systems"][9]: 

> Resilience is a measure of a system's ability to survive and persist within a variable environment. The opposite of resilience is brittleness and rigidity.

A wing is a complex system on the macro level, and it is constructed of much smaller complex systems at the micro level. It's a complex system constructed of more complex systems. It's part of even bigger complex systems (the plane), that are bound to even more complex systems (the pilot, weather conditions, jet stream, volcano ash).

These systems interact with each other through an endless amount of entry and exit points. One system feeds another system.

Quoting from ["Thinking in Systems"][9]: 

> Systems happen all at once. They are connected not just in one direction, but in many directions simultaneously.

["Thinking in Systems"][9] talks about **stock** and **flow**. A stock is a system's capacity  to fulfill its purpose. Flow is an input and output that the system is able to respond to.

Stock is the wing itself, the material it's made of, whereas flow is a number of inputs and outputs that affect the stock. For instance, a type of input for a wing is speed of air flowing around it, another one the pressure built on it from the jet stream. The wing responds in different ways to each possible input, at least as far as it's been knowingly constructed for them.

If pressure goes up, the wing bends. If the flow of air is fast enough, the wing will drift, keeping the plane in the air.

Once you add more systems surrounding it, you increase the number of possible inputs and outputs. Some the wing knows how to respond to, others he may not.

> As systems become complex, their behavior can become surprising.

The beauty of complex systems is, and this is a tough one to accept for engineers, the system can respond to certain inputs whether it was intended to do so or not.

> If pushed too far, systems may well fall apart or exhibit heretofore unobserved behavior. But, by and large, they manage quite well. And that is the beauty of systems: They can work so well. When systems work well, we see a kind of harmony in their functioning.

With so many complex systems involved, how can we possibly try and predict all events that could feed into any of the systems involved, and how they then play into the other complex systems?

Our human brains aren't exactly built to follow a nearly infinite number of input factors that could contribute to an infinite number of possible outcomes.

> It's easier to learn about a systems elements than about its interconnections.

### The Columbia disaster

Let's dwell on the topic of wings for a minute.

During the Columbia crash on February 1, 2003, one of the low-signal problems the crew and mission control experienced were the loss of a few sensors in the left wing.

Those sensors indicated an off-scale low reading, indicating that the sensors were offline.

Going back to the launch, the left wing was the impact zone of a piece of foam the size of a suitcase, the risk of which was assessed but eventually deemed not to be hazardous to life.

The [sensors went offline about five minutes before the shuttle disintegrated][5]. Around the same time, people watching the shuttle's reentry from the ground noticed that debris being shed.

The people at mission control didn't see these pictures, they were blind to what was going on with the shuttle.

Contact with the crew and the shuttle broke off five minutes later.

Mission control had no indication that the shuttle was going to crash. Their monitoring just showed the absense of some data, not all of it, at least initially.

A wing may just be one piece, but its connections to the bigger systems it's part of can go beyond what is deemed normal. Without any visuals, would you be able to assume that the shuttle is currently disintegrating, perishing the entire crew, just by seeing that a few sensors went offline?

### Constraints of building a system

When we set out to build something, we're bound by cost. Most things have a budget attached to them.

How we design and build the system is bound by these constraints, amongst others.

If we were to sit down and try to evaluate all possible outcomes, we will eventually exhaust our budget before we even started building something.

Should we manage to come up with an exhaustive catalog of possible risks, we then have to design the system in a way that protects it from all of them.

This, in turn, can have the curious outcome that our system loses resilience. Protecting itself from all possible risks could end up creating a rigid system, one that is unable to respond to emerging risks by any other means than failing.

Therein lies the crux of complex systems and their endless possibilities of interacting with each other. When we try to predict all possible interactions, there will still be even more at some point in the future.

The conditions a system was designed for are bound to change over time as it is put into production use. Increasing usage, changing infrastructure, different operations personell, to name a few.

Weather changes because of climate change, and it takes decades for the effect to have any possible impact on our plane's wings.

### How complex systems fail

With a sheer infinite amount of interactions and emerging inputs increasing them even further, the system can have an incredible amount of failure modes.

But, according to [Richard Cook's "How Complex Systems Fail"][2],

> Overt catastrophic failure occurs when small, apparently innocuous failures join to create opportunity for a systemic accident. Each of these small failures is necessary to cause catastrophe but only the combination is sufficient to permit failure.

It requires multiple failures coming together for the system to fail.

With so many systems interacting with each other, predicting how and when a combination of failures is coming together feels beyond our mental capacity.

### The human factor

What then holds our systems together when they're facing uncertainy in all directions?

Surprisingly, it's the human operator. Based on ever increasing exposure to and experience operating systems in production is a human the truly adaptable element in the system's equation.

> Recognizing hazard and successfully manipulating system operations to remain inside the tolerable performance boundaries requires intimate contact with failure.

What is important for any organization is that these experiences are openly shared to increase overall exposure to these systems, to bring issues to light, to improve the system as its inputs and the system's response to them change over time. Because, depending on their exposure, the knowledge of the system's behaviour under varying circumstances can be unevenly spread.

Again, quoting from [Cook][2]:

> Recognizing hazard and successfully manipulating system operations to remain inside the tolerable performance boundaries requires intimate contact with failure.

Following this, maybe **designing systems should focus more on building them with the human operator in mind** than trying to protect them from as many possible causes of failure as possible, including the human operator.

### Organization culture and risk

Assuming your organization has a good track record when it comes to safety and assessing risk. Is that an indicator that future projects are in good hands? Is a history of risk assessment and safety enough to warrant continuing safety?

According to [Cook][2]:

> People continuously create safety.

Subsequently, a good safety track record is no indication for the future. Safety is not a one-time purchase, it is a continuing process that shifts between production and monetary pressure, people's work load, and any activity at the sharp end, on the production system.

The Challenger incident is an interesting example here. On January 26, 1986, the Challenger shuttle lifted off the launchpad, only to be disintegrated in the atmosphere 73 seconds later. The flight's designation was [STS-51-L][1].

NASA, going back to the Apollo program, inarguably has a history of successfully finishing missions, even to the moon. They had good experience constructing and running hazardous equipment in production.

But, with the Shuttle program, the organization found itself in different circumstances. Stemming from the Vietnam war, budgets were cut significantly, staff shrank to about 1/3 of its original size as a consequence.

NASA relied a lot more on external contractors to work on specific parts of the Space Shuttle, just like the solid booster rockets propelling the shuttle into the atmosphere.

For budget reasons, the rockets' design was based on the Titan rocket, the booster rocket used in the Apollo program. Everyone at NASA assumed that the rockets were not only a good fit, but that there was sufficient experience with them in the organization.

Something else was different with the Shuttle program. NASA suddenly found itself under production pressure from potential customers. The program was aimed to be as economical as possible, with up to 50 launches per year to make sure that costs are fully covered by revenue. The US Army was very much interested in using the Shuttles as a means of transporting satellites and other gear into space.

Following the changes in production pressure and working with more external contractors, NASA introduced a bigger management structure. Four layers of managers and sub-managers eventually existed at NASA, with every sub-manager reporting up the stream, representing their own teams.

When the first Shuttles were launched, the team responsible for the booster rockets noticed behaviour that was different from their experience in the Apollo program.

The joints holding the parts of the rockets together were rotating, the O-rings sealing the joints of the parts either burnt through under certain circumstances, or they behaved in unexpected ways at very low temperatures. When rubber gets below certain temperatures, it stiffens up, making it unable to move an potentially fulfill its duty.

Most conditions were only seen in isolation rather than together affecting a single flight. For most of them, the team thought they understood their respective risks.

All these issues were known to the engineering teams involved, they were even considered critical to human life.

Before every launch, NASA held an assessment meeting where all critical issues were discussed. The issues found by the solid booster rockets were brought up regularly in the summaries given by their respective managers. There were slides showing notes on the issue, and the risk was discussed as well.

With every launch, the engineers learned a few new things about the behaviour of the solid booster rocket. Some of these things made it up the reporting chain, others didn't.

On the evening of the fatal Challenger launch, the teams came together to talk about the final go or no go.

A few of the engineers from the contracting companies had doubts about the launch, as the forecast for Cape Canneveral predicted very low temperatures, lower than during any previous launch of a Space Shuttle.

While the engineers voiced their concerns and initially suggested to delay the launch, management eventually overruled them and gave the go for launch.

Again from [Richard Cook][2]:

> All ambiguity is resolved by actions of practitioners at the sharp end of the system.

There were a lot of miscommunication issues involved in this meeting alone, but the issue goes much deeper. The layers of management within the organization added an unintended filtering mechanisms to safety issues and risks.

During presentations in assessment and pre-launch meetings, information was usually presented in slide form. In the Challenger days, they used overhead projectors, during later years, engineers and management resorted to using PowerPoint.

Regardless of the tool, the information was presented in a denser form (denser with every management layer), using bullet points, with several things compacted into a single slide.

This had the curios effect of losing salience for the relevant information, the data that possibly could have indicated real risks rather than intermingle them with other information.

The Columbia accident suffered from similar problems. From the [Columbia Accident Investigation Board's Report Vol. 1][6]:

> As information gets passed up an organization hierarchy, from people who do analysis to mid-level managers to high-level leadership, key explanations and supporting information is filtered out. In this context, it is easy to understand how a senior manager might read this PowerPoint slide and not realize that it addresses a life-threatening situation.

Edward Tufte has [written an excellent analysis][3] of the use of PowerPoint to assess the risk of the Columbia incident. Salience and losing detail in condensed information play a big part in it.

The bottom line is that even in the most risk-aware organizations and hazardous environments, assessing safety is an incredibly hard but continuous process. Your organization can drift into a state where a risky component or behaviour becomes the norm.

In ["The Challenger Launch Decision"][4], Diane Vaughan coined the term **"normalization of deviance."** What used to be considered a risk has now become a normal part of the system's accepted behaviour.

Scott Snook later improved it to [**"practical drift"**][7], _"the slow steady uncoupling of practice from written procedure."_

Sidney Dekker later made it even more concrate and coined the term [**"drift into failure"**][8], _"a gradual, incremental decline into disaster driven by environmental pressure, unruly technology and social processes that normalize growing."_

How do you prevent practical drift or drift into failure? Constant awareness, uncondensed sharing of information, open feedback loops, reducing procedural friction, loose layers, involved the people at the sharp end of the action as much as possible, written reports instead of slide decks as suggested by [Tufte][3]?

Maybe all of the above. I'd be very interested in your thoughts and experiences.

[1]: https://en.wikipedia.org/wiki/STS-51-L "Wikipedia: Shuttle Transportation System 51-L"

[2]: http://www.ctlab.org/documents/How%20Complex%20Systems%20Fail.pdf "Richard Cook, et. al.: How Complex Systems Fail"

[3]: http://www.edwardtufte.com/bboard/q-and-a-fetch-msg?msg_id=0001yB&topic_id=1 "Edward Tufte: PowerPoint Does Rocket Science"

[4]: http://amzn.to/1fEZykf "Diane Vaughan: The Challenger Launch Decision: Risky Technology, Culture, and Deviance at NASA"

[5]: https://en.wikipedia.org/wiki/Space_Shuttle_Columbia_disaster#Re-entry_timeline "Wikipedia: Space Shuttle Columbia disaster - Re-entry timeline"

[6]: http://spaceflight.nasa.gov/shuttle/archives/sts-107/investigation/CAIB_lowres_full.pdf "Columbia Accident Investigation Board: Report Vol. 1"

[7]: http://amzn.to/15bQMAj "Scott Snook: Friendly Fire - The Accidental Shootdown of U.S. Black Hawks over Northern Iraq"

[8]: http://amzn.to/1k0cLaf "Sidney Dekker: Drift into Failure"

[9]: http://amzn.to/1k09Iic "Donella Meadows: Thinking in Systems - A Primer"

[10]: http://amzn.to/19CvJvW "Nassim Taleb: The Black Swan - The Impact of the Highly Improbable"
