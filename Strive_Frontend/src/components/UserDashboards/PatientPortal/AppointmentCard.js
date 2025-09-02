import React from "react";
import "../PortalLayout/PortalLayout.css";

export default function AppointmentCard({ appt }) {
  const { date, time, clinician, location, status } = appt;
  return (
    <div className="portal-card">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <h4 className="portal-card__title">Appointment</h4>
        <span className="portal-sub">{status}</span>
      </div>
      <div className="portal-grid cols-2">
        <div>
          <div className="portal-sub">Date</div>
          <div>{date} at {time}</div>
        </div>
        <div>
          <div className="portal-sub">Clinician</div>
          <div>{clinician}</div>
        </div>
        <div>
          <div className="portal-sub">Location</div>
          <div>{location}</div>
        </div>
        <div>
          <button className="portal-icon-btn" style={{ width: "100%" }}>View Details</button>
        </div>
      </div>
    </div>
  );
}
