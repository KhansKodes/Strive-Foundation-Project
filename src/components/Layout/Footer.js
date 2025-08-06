import React from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Quick Links */}
        <div className="footer-col">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/explore">Explore Further</a></li>
            <li><a href="/directors">Directors</a></li>
            <li><a href="/sma-registration">SMA Registration</a></li>
            <li><a href="/contribute">Contribute</a></li>
            <li><a href="/reach-us">Reach Us</a></li>
          </ul>
        </div>

        {/* Other Pages */}
        <div className="footer-col">
          <h3>Other Pages</h3>
          <ul>
            <li><a href="/ceo">CEO</a></li>
            <li><a href="/success-stories">Success Stories</a></li>
            <li><a href="/disclaimer">Disclaimer</a></li>
            <li><a href="/privacy">Privacy & Policy</a></li>
            <li><a href="/terms">Terms of Services</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-col">
          <h3>Contact Info</h3>
          <ul className="contact-info">
            <li><FaMapMarkerAlt /><span>G7, Islamabad Pakistan</span></li>
            <li><FaPhone /><span>(+51) 8899 452</span></li>
            <li><FaPhone /><span>(+92) 304 1115811</span></li>
            <li><FaEnvelope /><span>info@strivefoundation.org</span></li>
          </ul>
        </div>
      </div>

      {/* bottom bar */}
      <div className="footer-bottom">
        <p>© Strive-Foundation-{new Date().getFullYear()}. All rights reserved</p>
        <p>
          Design and develop by <a href="https://waqarhussain92670@gmail.com" target="_blank" rel="noopener noreferrer">
            Waqar Hussain
          </a>
        </p>
      </div>
    </footer>
  );
}
