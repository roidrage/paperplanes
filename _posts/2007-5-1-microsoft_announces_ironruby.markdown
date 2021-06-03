---
layout: post
title: "Microsoft announces IronRuby"
tags: ruby
---
Now that's something. Microsoft announced IronRuby at their MIX07 conference. IronPython developer Jim Hugunin <a href="http://blogs.msdn.com/hugunin/archive/2007/04/30/a-dynamic-language-runtime-dlr.aspx">provides some details</a> about extensions to the .NET CLR made to improve support for scripting languages. The extension is called Dynamic Language Routine.

The name IronRuby is of course an homage to IronPython, the Python implementation running on .NET. Considering the IronPython is famous for its speed, I'm excited to see what Microsoft's developers are able to squeeze out of Ruby on the CLR. If IronRuby turns out well, it might become _the_ way to run Rails on the .NET (and hence Windows) platform.

I'm always up for competition, even coming from Redmond. With other Ruby implementations (including, of course <a href="http://jruby.sourceforge.net/">JRuby</a>, fully backed by Sun in case you missed it) gaining a wider audience there's more pressure on the <a href="http://www.ruby-lang.org/en/">original version</a>. With <a href="http://www.atdot.net/yarv/">YARV</a> coming to Ruby, it too will run on a virtual machine. The speed improvements look quite impressive so far.

Here's to an interesting race.

Of course the DLR shines a new light on <a href="http://silverlight.net/Default.aspx">Silverlight</a>, whose Technology Preview for <a href="http://silverlight.net/GetStarted/">version 1.1</a> includes support for scripting rich browser applications with Python, Ruby, VB or C#.

(Via <a href="http://www.infoq.com/news/2007/04/ms-ironruby">InfoQ</a>)