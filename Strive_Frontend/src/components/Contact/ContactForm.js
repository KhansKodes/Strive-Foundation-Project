import React, { useState } from "react";
import api from "../../services/api";
import "./ContactForm.css";

export default function ContactForm() {
  const [f, setF] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => setF({ ...f, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/contact/", f); // backend contract unchanged
      setSent(true);
      setF({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSent(false), 2500);
    } catch {
      setError("Failed to send message. Please try again.");
    }
  };

  return (
    <form className="cpf" onSubmit={onSubmit} noValidate autoComplete="off">
      <div className="cpf-row">
        <div className="cpf-field">
          <input
            id="name"
            name="name"
            value={f.name}
            onChange={onChange}
            placeholder=" "
            required
          />
          <label htmlFor="name">Name</label>
        </div>

        <div className="cpf-field">
          <input
            id="email"
            name="email"
            type="email"
            value={f.email}
            onChange={onChange}
            placeholder=" "
            required
          />
          <label htmlFor="email">Email</label>
        </div>
      </div>

      <div className="cpf-field">
        <input
          id="subject"
          name="subject"
          value={f.subject}
          onChange={onChange}
          placeholder=" "
          required
        />
        <label htmlFor="subject">Subject</label>
      </div>

      <div className="cpf-field">
        <textarea
          id="message"
          name="message"
          rows="5"
          value={f.message}
          onChange={onChange}
          placeholder=" "
          required
        />
        <label htmlFor="message">Message</label>
      </div>

      {error && <p className="cpf-error" role="alert">{error}</p>}

      <button
        type="submit"
        className={`cpf-submit ${sent ? "is-sent" : ""}`}
        disabled={sent}
      >
        {sent ? "Message Sent!" : "Send Message"}
      </button>
    </form>
  );
}
