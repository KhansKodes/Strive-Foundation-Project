import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { FiMenu, FiLogOut, FiUser } from "react-icons/fi";

export default function Topbar({ title, sidebarOpen, onToggleSidebar }) {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const fullName = user?.profile?.fullName || "User";

  const handleLogout = () => {
    logout();
    nav("/login");
  };

  return (
    <header className="portal-topbar">
      <button className="menu-toggle" onClick={onToggleSidebar} aria-label="Toggle sidebar">
        <FiMenu />
      </button>

      <div className="portal-title" aria-live="polite">{title}</div>

      <div className="topbar-right">
        <div className="user-chip">
          <FiUser />
          <span className="user-name">{fullName}</span>
        </div>
        <button className="logout-btn" onClick={handleLogout} aria-label="Logout">
          <FiLogOut />
          <span className="hide-sm">Logout</span>
        </button>
      </div>
    </header>
  );
}
