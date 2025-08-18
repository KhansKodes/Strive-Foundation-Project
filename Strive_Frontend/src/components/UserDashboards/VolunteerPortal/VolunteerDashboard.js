import React from "react";
import VolunteerOverview from "./VolunteerOverview";
import PortalLayout from "../PortalLayout/PortalLayout";
import { volunteerMenu } from "../PortalLayout/menuConfig";

export default function VolunteerDashboard() {
  return (
    <PortalLayout title="Volunteer Portal" menu={volunteerMenu} initialActiveKey="overview">
      {(active) => {
        if (active === "tasks") {
          return <div className="portal-card">Your assigned tasks — (placeholder).</div>;
        }
        if (active === "schedule") {
          return <div className="portal-card">Your volunteer schedule — (placeholder).</div>;
        }
        if (active === "messages") {
          return <div className="portal-card">Messages — (placeholder).</div>;
        }
        if (active === "settings") {
          return <div className="portal-card">Volunteer settings — (placeholder).</div>;
        }
        // overview
        return (
          <>
            <div className="portal-card" style={{ marginBottom: 16 }}>
              <h2>Overview</h2>
              <p>Welcome! Here’s what’s coming up and how you can help today.</p>
            </div>
            <VolunteerOverview />
          </>
        );
      }}
    </PortalLayout>
  );
}
