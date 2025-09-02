import React, { useMemo } from "react";
import PortalLayout from "../PortalLayout/PortalLayout";
import AppointmentCard from "./AppointmentCard";

/**
 * Dummy data
 */
const patient = {
  name: "Ayesha Khan",
  mrn: "STR-PT-00123",
  type: "SMA Type 2",
  nextAppt: { date: "14 Sep 2025", time: "10:30 AM", clinician: "Dr. Ahmed", location: "Strive Clinic (Islamabad)", status: "Scheduled" },
};
const appointments = [
  { date: "14 Sep 2025", time: "10:30 AM", clinician: "Dr. Ahmed", location: "Strive Clinic (Islamabad)", status: "Scheduled" },
  { date: "20 Aug 2025", time: "11:00 AM", clinician: "Physio Team", location: "Telehealth", status: "Completed" },
  { date: "08 Aug 2025", time: "09:45 AM", clinician: "Nutritionist", location: "Strive Clinic (Islamabad)", status: "Completed" },
];
const documents = [
  { name: "Genetic Report (SMN1)", date: "05 Aug 2025" },
  { name: "Physio Plan (Q3 2025)", date: "10 Aug 2025" },
  { name: "Medication Summary", date: "12 Aug 2025" },
];

export default function PatientDashboard() {
  const treatmentProgress = useMemo(() => 62, []);

  return (
    <PortalLayout role="patient" user={{ name: patient.name }} title="Patient Dashboard">
      {/* Header cards */}
      <section className="portal-grid cols-3">
        <div className="portal-card">
          <h4 className="portal-card__title">Patient</h4>
          <div className="portal-metric">{patient.name}</div>
          <div className="portal-sub">MRN: {patient.mrn} • {patient.type}</div>
        </div>

        <div className="portal-card">
          <h4 className="portal-card__title">Next Appointment</h4>
          <div className="portal-metric">{patient.nextAppt.date}</div>
          <div className="portal-sub">{patient.nextAppt.time} • {patient.nextAppt.clinician}</div>
        </div>

        <div className="portal-card">
          <h4 className="portal-card__title">Treatment Progress</h4>
          <div className="progress" aria-label="treatment progress">
            <span style={{ width: `${treatmentProgress}%` }} />
          </div>
          <div className="portal-sub" style={{ marginTop: 8 }}>{treatmentProgress}% completed</div>
        </div>
      </section>

      {/* Appointments */}
      <section className="portal-grid cols-2">
        <div className="portal-card">
          <h4 className="portal-card__title">Upcoming & Recent Appointments</h4>
          <div className="portal-grid">
            {appointments.map((a, i) => <AppointmentCard key={i} appt={a} />)}
          </div>
        </div>

        {/* Documents */}
        <div className="portal-card">
          <h4 className="portal-card__title">Documents</h4>
          <table className="portal-table" role="table">
            <thead><tr><th>Name</th><th>Date</th><th>Action</th></tr></thead>
            <tbody>
              {documents.map((d, i) => (
                <tr key={i}>
                  <td>{d.name}</td>
                  <td>{d.date}</td>
                  <td><button className="portal-icon-btn">Download</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </PortalLayout>
  );
}
