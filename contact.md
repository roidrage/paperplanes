---
layout: page
permalink: /contact/
title: Contact Mathias
---
<form name="contact" method="POST" data-netlify="true" class="basic-grey">
  <p>
    <label>
      <span>Your Name:</span>
      <input type="text" name="name" />
     </label>   
  </p>
  <p>
    <label>
      <span>Your Email:</span>
      <input type="email" name="email" />
    </label>
  </p>
  <p>
    <label>
      <span>How can I help?:</span>
      <select name="reason">
        <option value="question">Question/Advice</option>
        <option value="coaching">Interested in Coaching</option>
        <option value="other">Neither</option>
      </select>
     </label>
  </p>
  <p>
    <label>
      <span>Message:</span>
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