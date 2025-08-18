import React, { useState } from 'react';
import './ContactForm.css';
import api from '../../services/api';

export default function ContactForm() {
  const [f, setF] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e =>
    setF({ ...f, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/contact/', f);
      setSent(true);
      setF({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSent(false), 2500);
    } catch (err) {
      setError('Failed to send message. Please try again.');
    }
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
        <input
          name="subject"
          id="subject"
          value={f.subject}
          onChange={handleChange}
          required
          placeholder=" "
        />
        <label htmlFor="subject">Subject</label>
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
      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
      <button type="submit" className={sent ? "sent" : ""} disabled={sent}>
        {sent ? "Message Sent!" : "Send Message"}
      </button>
    </form>
  );
}
