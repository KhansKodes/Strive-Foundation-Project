import React, { useEffect, useState } from "react";
import { getAppointments } from "../../../services/patientService";
import AppointmentCard from "./AppointmentCard";
import PortalLayout from "../PortalLayout/PortalLayout";
import { patientMenu } from "../PortalLayout/menuConfig";

export default function PatientDashboard() {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    getAppointments().then(setApps);
  }, []);

  return (
    <PortalLayout title="Patient Portal" menu={patientMenu} initialActiveKey="overview">
      {(active) => {
        if (active === "appointments") {
          return (
            <>
              <h2>Upcoming Appointments</h2>
              {apps.length === 0 ? (
                <div className="portal-card">No appointments yet.</div>
              ) : (
                apps.map((a) => <AppointmentCard key={a.id} appointment={a} />)
              )}
            </>
          );
        }
        if (active === "records") {
          return <div className="portal-card">Medical records area — (placeholder).</div>;
        }
        if (active === "messages") {
          return <div className="portal-card">Secure messages — (placeholder).</div>;
        }
        if (active === "settings") {
          return <div className="portal-card">Patient settings — (placeholder).</div>;
        }
        // overview
        return (
          <div className="portal-card">
            <h2>Overview</h2>
            <p>Quick glance at your health info, recent messages and next appointment.</p>
          </div>
        );
      }}
    </PortalLayout>
  );
}
