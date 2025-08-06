import React, { useState } from 'react';
import './ContactForm.css';

export default function ContactForm() {
  const [f, setF] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleChange = e =>
    setF({ ...f, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 2500);
    setF({ name: '', email: '', message: '' });
  };

  return (
    <form className="contactform" onSubmit={handleSubmit} autoComplete="off">
      <div className="form-row">
        <div className="form-group">
          <input
            name="name"
            id="name"
            value={f.name}
            onChange={handleChange}
            required
            placeholder=" "
          />
          <label htmlFor="name">Name</label>
        </div>
        <div className="form-group">
          <input
            name="email"
            id="email"
            type="email"
            value={f.email}
            onChange={handleChange}
            required
            placeholder=" "
          />
          <label htmlFor="email">Email</label>
        </div>
      </div>
      <div className="form-group">
        <textarea
          name="message"
          id="message"
          rows="5"
          value={f.message}
          onChange={handleChange}
          required
          placeholder=" "
        />
        <label htmlFor="message">Message</label>
      </div>
      <button type="submit" className={sent ? "sent" : ""} disabled={sent}>
        {sent ? "Message Sent!" : "Send Message"}
      </button>
    </form>
  );
}
