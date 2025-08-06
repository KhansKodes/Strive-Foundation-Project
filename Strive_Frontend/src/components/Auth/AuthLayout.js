import React from "react";
import "./AuthLayout.css";
import logo from "../../assets/images/logo.png"; // update path if needed

// Update these to your actual finalized texts
const VISION = "Redefining the future of SMA in Pakistan: from missed chances to early intervention, from cost to care, from fear to cure.";
const DESCRIPTION = "Strive Eradication of Disability Foundation is Pakistan’s leading non-profit for SMA awareness, patient support, and advocacy.";

export default function AuthLayout({ children, page }) {
  return (
    <div className="auth-layout-root">
      <div className="auth-layout-card">
        {/* LEFT PANEL */}
        <div className="auth-layout-left">
          <div className="auth-layout-logo-box">
            <img src={logo} alt="Strive Logo" className="auth-layout-logo" />
          </div>
          <div className="auth-layout-desc">
            <h2>Welcome to Strive</h2>
            <p>{DESCRIPTION}</p>
            <div className="auth-layout-vision-title">Our Vision</div>
            <div className="auth-layout-vision">{VISION}</div>
          </div>
        </div>
        {/* RIGHT PANEL */}
        <div className="auth-layout-right">
          <div className="auth-layout-form">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
