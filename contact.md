---
layout: page
permalink: /contact/
title: Contact Mathias
---
<form name="contact" method="POST" data-netlify="true">
  <p>
    <label>Your Name: <input type="text" name="name" /></label>   
  </p>
  <p>
    <label>Your Email: <input type="email" name="email" /></label>
  </p>
  <p>
    <label>How can I help?: <select name="reason">
      <option value="question">I've got a Question</option>
      <option value="coaching">I'm looking for Coaching</option>
      <option value="other">Neither</option>
    </select></label>
  </p>
  <p>
    <label>Message: <textarea name="message"></textarea></label>
  </p>
  <p>
    <button type="submit">Send</button>
  </p>
</form>