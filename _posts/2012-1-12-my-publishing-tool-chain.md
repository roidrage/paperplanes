---
title: My Publishing Tool Chain
topics: writing publishing tools
layout: post
comments_disabled: true
---
Update: Added paragraph on the [e-commerce platform](#fulfillment) I'm using.

Several people have asked me about the publishing tool chain I'm using for the
[Riak Handbook](http://riakhandbook.com/?pp) and the [NoSQL
Handbook](http://nosqlhandbook.com/). As [Avdi just published
his](http://avdi.org/devblog/2012/01/12/my-authoring-tools/), now's as good a
good time as any to throw in mine too. After all, it's always nice to know all
the options you have.

All text is written in Markdown. I started out with Textile, but just didn't
like Textile's way of breaking down single lines into separate paragraphs, so I
switched to Markdown later on. Not a painless process, but sufficiently easy
thanks to Pandoc.

The Markdown files, one per chapter, are bundled together into a big file and
then fed into GitHub's [Redcarpet](https://github.com/tanoku/redcarpet) library.
I use [Albino](https://github.com/github/albino) and
[Pygments](http://pygments.org/) for syntax highlighting, embedded into a custom
renderer for Redcarpet. See the Redcarpet
[README](https://github.com/tanoku/redcarpet/blob/master/README.markdown) for an
example. Redcarpet also has some MultiMarkdown extensions for tables and other
things, so that comes in pretty handy.

To generate the PDF I'm using [Prince](http://princexml.com/), a neat little
tool that takes HTML and a bunch of CSS and generates a nice PDF. It's a
commercial tool, and costs some $500 for a single license. That was what threw
me off a tiny bit, but luckily there's a handy service called
[DocRaptor](http://docraptor.com/) which is basically a pretty API around Prince,
but much much cheaper.

You can use Prince locally to generate infinite test PDFs, and then use
DocRaptor to generate the final result. Which is what I do. Before generating
the PDF through DocRaptor I upload the generated HTML, which includes all the
CSS, to S3, to avoid some issues I've had with Unicode characters in the HTML,
and tell DocRaptor to fetch it from a URL instead.

You can use web fonts easily, I went for fonts from Google Web Fonts, which are
easily embeddable with Prince and DocRaptor. Prince also allows you to do some
customizations specific, stuff like page titles, page numbers, custom settings
for left and right pages, footnotes, and the like. See the
[documentation](http://princexml.com/doc/8.0/) for a full list.

For ePub generation I generate a stripped-down version of the HTML, not
including syntax highlighting, because iBooks doesn't like custom-styled `pre` or
`code` elements, if you style them iBooks chooses to ignore any font setting and
use the default font, which is usually not monospaced.

The HTML then goes through [Calibre](http://calibre-ebook.com/) to generate the
ePub file, and then I use
[kindlegen](http://www.amazon.com/gp/feature.html/ref=amb_link_357613502_1?ie=UTF8&docId=1000765211)
to generate a Kindle file from that. Calibre has a pretty ugly user interface,
but it comes with a set of command line tools you can use to automatically
convert ebooks from one format to another.

All of the above is wrapped into a Rakefile and some small Ruby classes. I'll be
sure to put it up for your perusal soon, but this list should get you started.

<a name="fulfillment"></a>

To make the book available for purchase I'm using
[FastSpring](http://www.fastspring.com/). They're not my favorite choice, as
they make things like customizing your shop fairly hard, but I chose them
because their way of payout (monthly or bi-monthly), and the fact that they take
care of VAT, were both reasons important to me, especially being in Europe,
where tax laws throw a lot of stones at you for wanting to try and sell things
internationally. Unfortunately FastSpring doesn't have any means of updating
products and allowing and notifying users of the updates being available, so I
built a small Sinatra app to capture orders and take care of sending out the
updates. Not pretty, but it's a small sacrifice compared to the tax hassle I'd
have with any other fulfillment provider.

Curious about the result? You should [buy the book](http://riakhandbook.com/?pp)!
