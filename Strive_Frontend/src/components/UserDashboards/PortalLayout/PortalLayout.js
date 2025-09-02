import React, { useMemo, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import menuConfig from "./menuConfig";
import "./PortalLayout.css";

/**
 * PortalLayout
 * - Shared shell for all roles
 * - Pass `role` and `user` from your auth context/router
 * - Renders children or <Outlet/> for nested routes
 */
export default function PortalLayout({ role = "patient", user, title, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const menu = useMemo(() => menuConfig[role] || [], [role]);

  return (
    <div className="portal">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        menu={menu}
        brand="Strive Portal"
      />

      <div className="portal-main">
        <Topbar
          onToggleSidebar={() => setSidebarOpen((v) => !v)}
          user={user}
          role={role}
          title={title || "Dashboard"}
        />

        <main className="portal-content">
          {children ? children : <Outlet />}
        </main>
      </div>
    </div>
  );
}
