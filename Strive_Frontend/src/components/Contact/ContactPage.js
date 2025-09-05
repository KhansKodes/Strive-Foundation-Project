import React from "react";
import ContactForm from "./ContactForm";
import { FaWhatsapp, FaEnvelope, FaPhone } from "react-icons/fa";
import "./ContactPage.css";

// swap this with a local asset if you prefer:
// import kidsImg from "../../assets/images/contact-kids.jpg";

export default function ContactPage() {
  return (
    <main className="contact-page">
      {/* page background */}
      <div className="cp-bg" aria-hidden="true" />

      <section className="cp-container">
        {/* glass card */}
        <div className="cp-card" role="region" aria-label="Contact form">
          <header className="cp-header">
            <h1>Get In Touch</h1>
            <p>We’d love to hear from you. Send a message or reach us directly.</p>
          </header>

          <div className="cp-grid">
            {/* left: form + quick links */}
            <div className="cp-left">
              <ContactForm />

              <ul className="cp-links" aria-label="Quick contact options">
                <li>
                  <a
                    className="cp-link cp-link--whatsapp"
                    href="https://wa.me/923268318974"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaWhatsapp aria-hidden="true" />
                    <span>Have a query? Message on WhatsApp</span>
                  </a>
                </li>
                <li>
                  <a className="cp-link cp-link--phone" href="tel:+923481115811">
                    <FaPhone aria-hidden="true" />
                    <span>(+92) 348 1115811</span>
                  </a>
                </li>
                <li>
                  <a
                    className="cp-link cp-link--email"
                    href="mailto:info@strivefoundation.co"
                  >
                    <FaEnvelope aria-hidden="true" />
                    <span>info@strivefoundation.co</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* right: image */}
            <aside className="cp-image" aria-label="Community photo">
              <div
                className="cp-image-fill"
                style={{
                  backgroundImage:
                    'url("https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=1600&auto=format&fit=crop")',
                  // or if using local asset: backgroundImage: `url(${kidsImg})`
                }}
              />
              <div className="cp-image-veil" />
            </aside>
          </div>
        </div>

        {/* map */}
        <div className="cp-mapWrap">
          <iframe
            title="PHA Apartments Block 13, Islamabad"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1062.174027628975!2d73.06206170065258!3d33.6989044782921!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38dfbfd6fdc2ec05%3A0x308ad929a6dc1311!2sPHA%20Apartments%20Block%2013!5e1!3m2!1sen!2s!4v1752218349434!5m2!1sen!2s"
            className="cp-map"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </main>
  );
}
