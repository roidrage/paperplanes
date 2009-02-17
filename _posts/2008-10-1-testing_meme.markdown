---
layout: post
title: "Testing Meme"
topics: bestpractices testing
---
I'm not religious about anything, but if there's one thing I adopted and applied rigorously over the last years it's testing. Out of that habit I've developed using some principles that drive my writing of tests.

 * **You don't have to avoid stubbing and mocking everything, but you can try**

    Reducing the number of collaborators will result in smaller methods which are in turn easier to test. In the end stubbing things out is better than having to have complex dependencies in place to run a test suite.

 * **Test everything that's important**

   And if it's not important, why not just throw it out? If you can't throw it out, then it's probably important. So make sure you write tests for it. Simple as that.

 * **If you don't know what else to do, write a test**

    Stop thinking about how the code should look, start thinking what you want it to do. Some people call it working test-first, I just use it to find out how I want the code to work from the outside. When you put every aspect of the method in question into test cases, the way it should work will take shape naturally.

 * **The testing framework is not your biggest problem**

    While I prefer the style of RSpec and Shoulda for writing tests, it's usually not the problem of which of them you actually use. The point is to write tests, choose whichever framework will make that the easiest for you. You can write tests with all of them.

 * **Don't DRY out your tests**

    Tests are about readability. They're supposed to tell the reader what the code is supposed to do, without having to browse up and down in the test file to find methods that are used to create objects, or worse yet, through fixtures. Don't try too hard to put common code to setup scenarios into separate methods. It's just not important in tests. Create your scenarios where you need them, or use tools like factory_girl, where you collect object scenarios in a single file.

     Don't put too much code into separate methods for reuse in multiple test cases. If you do, make sure you name them in a way that will ensure readability, and think twice before you move code away from the point where other developers will look first.

 * **Keep your tests small**

   Instead of testing everything in one test method, create a separate test for every aspect of the method under test. The tests are easier to read and errors are easier to find.

Writing good tests is an art in itself, but trying your best to learn and constantly improve it is the best thing you can do for yourself in my opinion.