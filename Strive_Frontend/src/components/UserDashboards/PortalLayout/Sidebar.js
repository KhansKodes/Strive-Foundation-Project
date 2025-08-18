import React from "react";
import { FiX } from "react-icons/fi";

export default function Sidebar({ open, menu = [], activeKey, onChange, onClose }) {
  return (
    <aside className={`portal-sidebar ${open ? "open" : "closed"}`} aria-hidden={!open}>
      <div className="sidebar-head">
        <span className="brand">Strive</span>
        <button className="sidebar-close" onClick={onClose} aria-label="Close sidebar">
          <FiX />
        </button>
      </div>

      <nav className="sidebar-nav">
        {menu.map((m) => (
          <button
            key={m.key}
            className={`nav-item ${activeKey === m.key ? "active" : ""}`}
            onClick={() => onChange(m.key)}
          >
            {m.icon && <span className="nav-ico">{m.icon}</span>}
            <span>{m.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
