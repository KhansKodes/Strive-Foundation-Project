import React from "react";
import { NavLink } from "react-router-dom";
import "./PortalLayout.css";

/**
 * Sidebar
 * - Collapsible on mobile
 * - Highlights active route
 */
export default function Sidebar({ isOpen, onClose, menu = [], brand = "Strive Portal" }) {
  return (
    <aside className={`portal-sidebar ${isOpen ? "open" : ""}`}>
      <div className="portal-sidebar__brand">
        <span className="portal-brand__logo">⚕️</span>
        <span className="portal-brand__text">{brand}</span>
        <button className="portal-sidebar__close" onClick={onClose} aria-label="Close sidebar">×</button>
      </div>

      <nav className="portal-sidebar__nav">
        {menu.map((item) => (
          <NavLink
            key={item.key}
            to={item.to}
            className={({ isActive }) => "portal-nav__link" + (isActive ? " active" : "")}
            onClick={onClose}
          >
            <span className="bullet">•</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="portal-sidebar__footer">
        <small>© {new Date().getFullYear()} Strive</small>
      </div>
    </aside>
  );
}
