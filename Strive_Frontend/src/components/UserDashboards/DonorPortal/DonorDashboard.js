import React, { useMemo } from "react";
import PortalLayout from "../PortalLayout/PortalLayout";
import DonationSummary from "./DonationSummary";

const donor = { name: "Majid Qureshi" };

const donations = [
  { id: "DN-10045", date: "28 Aug 2025", amount: 250000, method: "Bank Transfer", designation: "Strive Life Club" },
  { id: "DN-10021", date: "12 Aug 2025", amount: 150000, method: "Card", designation: "SMA Endgame (General)" },
  { id: "DN-09988", date: "22 Jul 2025", amount: 100000, method: "Cheque", designation: "Strive Cure Lab" },
];
const pledges = [
  { id: "PL-2309", due: "30 Sep 2025", amount: 300000, designation: "Treatment Fund" },
  { id: "PL-2310", due: "30 Nov 2025", amount: 200000, designation: "Awareness & Policy" },
];

export default function DonorDashboard() {
  const totals = useMemo(() => {
    const allTime = donations.reduce((s, d) => s + d.amount, 0);
    const thisYear = allTime; // dummy
    const pledgesAmt = pledges.reduce((s, p) => s + p.amount, 0);
    const goal = 1200000;
    return { allTime, thisYear, pledges: pledgesAmt, goal };
  }, []);

  const money = (n) => `₨ ${n.toLocaleString()}`;

  return (
    <PortalLayout role="donor" user={{ name: donor.name }} title="Donor Dashboard">
      <DonationSummary totals={totals} />

      <section className="portal-grid cols-2">
        <div className="portal-card">
          <h4 className="portal-card__title">Recent Donations</h4>
          <table className="portal-table">
            <thead>
              <tr><th>ID</th><th>Date</th><th>Amount</th><th>Method</th><th>Designation</th><th>Receipt</th></tr>
            </thead>
            <tbody>
              {donations.map((d) => (
                <tr key={d.id}>
                  <td>{d.id}</td>
                  <td>{d.date}</td>
                  <td>{money(d.amount)}</td>
                  <td>{d.method}</td>
                  <td>{d.designation}</td>
                  <td><button className="portal-icon-btn">Download</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="portal-card">
          <h4 className="portal-card__title">Active Pledges</h4>
          <table className="portal-table">
            <thead><tr><th>ID</th><th>Due</th><th>Amount</th><th>Designation</th><th>Action</th></tr></thead>
            <tbody>
              {pledges.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.due}</td>
                  <td>{money(p.amount)}</td>
                  <td>{p.designation}</td>
                  <td><button className="portal-icon-btn">Fulfill</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="portal-card">
        <h4 className="portal-card__title">Impact Snapshot</h4>
        <div className="portal-grid cols-3">
          <div>
            <div className="portal-sub">Patients Supported</div>
            <div className="portal-metric">56</div>
          </div>
          <div>
            <div className="portal-sub">Therapy Cycles Funded</div>
            <div className="portal-metric">142</div>
          </div>
          <div>
            <div className="portal-sub">Regions Reached</div>
            <div className="portal-metric">23</div>
          </div>
        </div>
      </section>
    </PortalLayout>
  );
}
