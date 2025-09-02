import React from "react";
import "../PortalLayout/PortalLayout.css";

export default function VolunteerOverview({ stats }) {
  return (
    <div className="portal-grid cols-3">
      <div className="portal-card">
        <h4 className="portal-card__title">Hours Logged</h4>
        <div className="portal-metric">{stats.hours}</div>
        <div className="portal-sub">This month</div>
      </div>
      <div className="portal-card">
        <h4 className="portal-card__title">Events Attended</h4>
        <div className="portal-metric">{stats.events}</div>
        <div className="portal-sub">Since joining</div>
      </div>
      <div className="portal-card">
        <h4 className="portal-card__title">Tasks Completed</h4>
        <div className="portal-metric">{stats.tasks}</div>
        <div className="portal-sub">All-time</div>
      </div>
    </div>
  );
}
