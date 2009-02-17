---
layout: post
title: "Compiler and Typing Directives for Ruby?"
topics: ruby
---
Ola Bini [made an interesting yet somehow unappealing proposal](http://ola-bini.blogspot.com/2007/09/should-ruby-have-optional-typing-and.html) the other day. Ruby should support Lisp-like compiler and typing directives to allow for optimization. One example:

    def one_two_three(one, two, three)
      declare type: [Fixnum one, Array two, Hash three]
      declare return: Fixnum
      do_something
    end

I don't know about you, but this looks highly appalling to me. Imagine these declarations cluttered across your Rails application. Throw in more compiler directives and you got yourself some nicely unreadable code. What immediately popped up into my head was annotated Java code:

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="passport_fk")
    public Passport getPassport() {
        ...
    }

I know, I know, it's not the same, but that's what came to my mind. I'm not a big fan of Java annotations for purposes like this. In my opinion the code gets very unreadable through the overuse of annotations, but maybe that's just me.

Another thing about the typing directives is the loss of dynamic typing. Dynamic typing is one of the great things about scripting languages. I had several discussions about that matter, and I'm well aware that Java fans love static typing, even though it's not even used to the fullest extent in Java.

With the above code annotation I'd restrict my methods to accept only a Fixnum, an Array and a Hash. Why bother? To make it easier for the compiler and in return jeopardize readability? To answer Ola's question: No, I don't think we need directives, and please don't try to make Ruby more like Lisp. There are a lot of people who wouldn't see that as a step forward, I bet. I'm all up for change and for a language to improve evolutionarily, but it's not a good idea to extent a language with features it wasn't built for. That already happened to Java.

Static typing is way overrated.