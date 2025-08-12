import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import './Header.css';
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaYoutube,
  FaEnvelope,
  FaMapMarkerAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import NAV_LINKS from './navLinks'; // Adjust path as needed

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const location = useLocation();

  // Mobile dropdown open/close handler
  const handleDropdownClick = (idx) => {
    setDropdownOpen(dropdownOpen === idx ? null : idx);
  };

  // Utility: Only show dropdown arrow button on mobile for main items with dropdown
  const isMobile = () => typeof window !== "undefined" && window.innerWidth <= 950;

  return (
    <header className="header">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="header-box top-bar-inner">
          <div className="social" aria-label="Social Media">
            <a href="#" aria-label="Facebook"><FaFacebookF /></a>
            <a href="#" aria-label="Twitter"><FaTwitter /></a>
            <a href="#" aria-label="LinkedIn"><FaLinkedinIn /></a>
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" aria-label="YouTube"><FaYoutube /></a>
          </div>
          <div className="top-auth">
            <Link
              to="/login"
              className={`auth-link${location.pathname === "/login" ? " active" : ""}`}
              tabIndex={0}
            >
              Login
            </Link>
            <span className="divider">|</span>
            <Link
              to="/register"
              className={`auth-link${location.pathname === "/register" ? " active" : ""}`}
              tabIndex={0}
            >
              Register
            </Link>
          </div>
        </div>
      </div>
      {/* Middle Bar */}
      <div className="middle-bar">
        <div className="header-box middle-content">
          <div className="logo">
            <Link to="/"><img src={logo} alt="Strive Logo" /></Link>
          </div>
          <div className="contact-group">
            <div className="contact">
              <FaEnvelope className="contact-icon" />
              <div>
                <div className="contact-label">Get In Touch</div>
                <div className="contact-info">0304 1115811 || 051 8899452</div>
              </div>
            </div>
            <div className="contact">
              <FaMapMarkerAlt className="contact-icon" />
              <div>
                <div className="contact-label">Office Address</div>
                <div className="contact-info">Block 13, PHA Apartment, G7/1, Islamabad</div>
              </div>
            </div>
            <div className="contact">
              <FaEnvelope className="contact-icon" />
              <div>
                <div className="contact-label">Email</div>
                <a className="contact-info" href="mailto:info@strivefoundation.com">
                  info@strivefoundation.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom Bar (Navigation) */}
      <div className="bottom-bar">
        <div className="header-box nav-row">
          <div className="nav-left">
            <button
              className="nav-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close Menu" : "Open Menu"}
              aria-expanded={menuOpen}
              aria-controls="main-nav"
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
            <nav className={`main-nav ${menuOpen ? "open" : ""}`} id="main-nav">
              {NAV_LINKS.map((link, idx) => {
                const isActive = location.pathname === link.to || (link.dropdown && link.dropdown.some(sub => sub.to === location.pathname));
                const hasDropdown = !!link.dropdown;
                return (
                  <div
                    key={link.to}
                    className={`nav-link-wrapper${hasDropdown ? " has-dropdown" : ""}${isActive ? " active" : ""}`}
                    onMouseEnter={() => !isMobile() && hasDropdown && setDropdownOpen(idx)}
                    onMouseLeave={() => !isMobile() && hasDropdown && setDropdownOpen(null)}
                  >
                    <Link
                      to={link.to}
                      className={`nav-link${isActive ? " active" : ""}`}
                      onClick={() => {
                        setMenuOpen(false);
                        setDropdownOpen(null);
                      }}
                    >
                      {link.name}
                      {/* Only show dropdown arrow on desktop */}
                      {hasDropdown && !isMobile() && <span className="dropdown-arrow">&#9662;</span>}
                    </Link>
                    {/* Only show dropdown toggle arrow button on mobile */}
                    {hasDropdown && isMobile() && (
                      <button
                        className="dropdown-mobile-toggle"
                        onClick={() => handleDropdownClick(idx)}
                        tabIndex={0}
                        aria-label="Toggle submenu"
                        type="button"
                      >
                        <span>&#9662;</span>
                      </button>
                    )}
                    {hasDropdown && (
                      <div
                        className={`dropdown-menu${
                          (!isMobile() && dropdownOpen === idx) ||
                          (isMobile() && dropdownOpen === idx && menuOpen)
                            ? " show"
                            : ""
                        }`}
                      >
                        {link.dropdown.map((sublink) => (
                          <Link
                            key={sublink.to}
                            to={sublink.to}
                            className={`dropdown-item${location.pathname === sublink.to ? " active" : ""}`}
                            onClick={() => {
                              setMenuOpen(false);
                              setDropdownOpen(null);
                            }}
                          >
                            {sublink.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
          {/* Register SMA Patient Button, right-aligned */}
          <div className="register-btn-wrap">
            <Link
              to="/register-sma"
              className="register-patient-btn"
            >
              Register SMA Patient
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
