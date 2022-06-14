---
layout: page
permalink: /contact/
title: Contact Mathias
---
<div class="page-wrapper">
  <form name="contact" method="POST" data-netlify="true" class="basic-grey" netlify-honeypot="maverick">
    <p class="honey">
      <label>
        Don’t fill this out if you’re human: <input name="maverick" />
      </label>
    </p>
    <p>
      <label>
        <span>Your Name</span>
        <input type="text" name="name" />
       </label>   
    </p>
    <p>
      <label>
        <span>Your Email</span>
        <input type="email" name="email" />
      </label>
    </p>
    <p>
      <label>
        <span>Subject</span>
        <select name="subject">
          <option value="question">I'm looking for advice</option>
          <option value="coaching">I'm interested in Coaching</option>
          <option value="other">Just saying hi!</option>
        </select>
       </label>
    </p>
    <p>
      <label>
        <span>Message</span>
        <textarea name="message"></textarea>
      </label>
    </p>
    <p>
      <label>
        <span></span>
        <button class="button" type="submit">Send</button>
      </label>
    </p>
  </form>
</div>
