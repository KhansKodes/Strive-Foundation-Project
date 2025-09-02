import React from "react";
import PortalLayout from "../PortalLayout/PortalLayout";
import VolunteerOverview from "./VolunteerOverview";

const volunteer = { name: "CUST Volunteer" };

const stats = { hours: 18, events: 7, tasks: 34 };

const tasks = [
  { id: "T-101", title: "Distribute SMA awareness flyers", due: "07 Sep 2025", status: "Open" },
  { id: "T-099", title: "Assist at clinic day", due: "12 Sep 2025", status: "Open" },
  { id: "T-092", title: "Social media caption draft", due: "31 Aug 2025", status: "Done" },
];

const events = [
  { id: "E-221", title: "SMA Awareness Session – Allied School PWD", date: "09 Sep 2025", location: "Rawalpindi" },
  { id: "E-212", title: "Volunteer Orientation – Batch 04", date: "15 Sep 2025", location: "Islamabad" },
];

export default function VolunteerDashboard() {
  return (
    <PortalLayout role="volunteer" user={{ name: volunteer.name }} title="Volunteer Dashboard">
      <VolunteerOverview stats={stats} />

      <section className="portal-grid cols-2">
        <div className="portal-card">
          <h4 className="portal-card__title">My Tasks</h4>
          <table className="portal-table">
            <thead><tr><th>ID</th><th>Task</th><th>Due</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {tasks.map((t) => (
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td>{t.title}</td>
                  <td>{t.due}</td>
                  <td>{t.status}</td>
                  <td>
                    {t.status === "Open" ? (
                      <button className="portal-icon-btn">Mark Done</button>
                    ) : (
                      <button className="portal-icon-btn">Undo</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="portal-card">
          <h4 className="portal-card__title">Upcoming Events</h4>
          <table className="portal-table">
            <thead><tr><th>ID</th><th>Title</th><th>Date</th><th>Location</th><th>Join</th></tr></thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.id}>
                  <td>{e.id}</td>
                  <td>{e.title}</td>
                  <td>{e.date}</td>
                  <td>{e.location}</td>
                  <td><button className="portal-icon-btn">RSVP</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </PortalLayout>
  );
}
