import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "./PortalLayout.css";

/**
 * PortalLayout
 * Props:
 * - title: string ("Patient Portal" / "Donor Portal" / "Volunteer Portal")
 * - menu: [{ key, label, icon?: JSX.Element }]
 * - initialActiveKey?: string
 * - children: (activeKey: string) => React.ReactNode  (render-prop)
 */
export default function PortalLayout({ title, menu, initialActiveKey, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeKey, setActiveKey] = useState(initialActiveKey || (menu?.[0]?.key ?? ""));

  return (
    <div className={`portal-root ${sidebarOpen ? "with-sidebar" : "sidebar-collapsed"}`}>
      <Topbar
        title={title}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((s) => !s)}
      />

      <div className="portal-body">
        <Sidebar
          open={sidebarOpen}
          menu={menu}
          activeKey={activeKey}
          onChange={setActiveKey}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="portal-content" role="main" aria-live="polite">
          {typeof children === "function" ? children(activeKey) : children}
        </main>
      </div>
    </div>
  );
}
