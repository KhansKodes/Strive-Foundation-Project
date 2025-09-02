import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import "./PortalLayout.css";

/** Small inline SVG icons */
const PowerIcon = (props) => (
  <svg
    width="16" height="16" viewBox="0 0 24 24" fill="none"
    xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" {...props}
  >
    <path d="M12 2v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M5.2 6.8a8 8 0 1 0 13.6 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export default function Topbar({ onToggleSidebar, user = {}, role = "user", title = "Dashboard" }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const initials = (user?.name || "User")
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true, state: { from: location.pathname } });
  };

  return (
    <header className="portal-topbar">
      <button className="portal-topbar__menu" onClick={onToggleSidebar} aria-label="Toggle menu">☰</button>

      <div className="portal-topbar__title">
        <h1>{title}</h1>
        <span className={`role-badge role-${role}`}>{role}</span>
      </div>

      {/* Actions are pushed fully to the right, and Logout is the last item */}
      <div className="portal-topbar__actions">
        <input className="portal-search" placeholder="Search…" aria-label="Search" />
        <button className="portal-icon-btn" title="Notifications" aria-label="Notifications">🔔</button>
        <div className="portal-avatar" title={user?.name || "User"} aria-label="User avatar">{initials}</div>

        <button
          type="button"
          className="portal-icon-btn danger"
          onClick={handleLogout}
          aria-label="Logout"
          title="Logout"
        >
          <PowerIcon style={{ marginRight: 6, display: "inline-block", verticalAlign: "-2px" }} />
          Logout
        </button>
      </div>
    </header>
  );
}
