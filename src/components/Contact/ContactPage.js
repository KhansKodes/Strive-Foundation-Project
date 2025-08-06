import React from 'react';
import ContactForm from './ContactForm';
import { FaWhatsapp, FaEnvelope, FaPhone } from 'react-icons/fa';
import './ContactPage.css';

export default function ContactPage() {
  return (
    <div className="contact-section">
      <div className="contact-container">
        <div className="contact-header">
          <h1>Contact Us</h1>
          <p>
            We'd love to hear from you! Reach out via form, WhatsApp, email, or call.
          </p>
        </div>
        
        <div className="contact-content">
          <ContactForm />

          <div className="contact-links">
            <a
              href="https://wa.me/923268318974"
              className="contact-link whatsapp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp /> <span>Have A Query Message On WhatsApp</span>
            </a>
            <a href="tel:+923481115811" className="contact-link phone">
              <FaPhone />Call Now:<span>(+92) 348 1115811</span>
            </a>
            <a href="mailto:info@strivefoundation.co" className="contact-link email">
              <FaEnvelope /> Email At:<span>info@strivefoundation.co</span>
            </a>
          </div>
        </div>

        <div className="map-wrapper">
          <iframe
            title="PHA Apartments Block 13, Islamabad"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1062.174027628975!2d73.06206170065258!3d33.6989044782921!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38dfbfd6fdc2ec05%3A0x308ad929a6dc1311!2sPHA%20Apartments%20Block%2013!5e1!3m2!1sen!2s!4v1752218349434!5m2!1sen!2s"
            className="contact-map"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}
