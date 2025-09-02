import React from "react";
import "../PortalLayout/PortalLayout.css";

export default function DonationSummary({ totals }) {
  const { allTime, thisYear, pledges, goal } = totals;
  const progress = Math.min(100, Math.round((thisYear / goal) * 100));
  const money = (n) => `₨ ${n.toLocaleString()}`;

  return (
    <div className="portal-grid cols-3">
      <div className="portal-card">
        <h4 className="portal-card__title">All-time Giving</h4>
        <div className="portal-metric">{money(allTime)}</div>
        <div className="portal-sub">Thank you for your continued support</div>
      </div>

      <div className="portal-card">
        <h4 className="portal-card__title">This Year</h4>
        <div className="portal-metric">{money(thisYear)}</div>
        <div className="portal-sub">2025 YTD</div>
        <div className="progress" style={{ marginTop: 8 }}>
          <span style={{ width: `${progress}%` }} />
        </div>
        <div className="portal-sub" style={{ marginTop: 6 }}>
          {progress}% of annual goal ({money(goal)})
        </div>
      </div>

      <div className="portal-card">
        <h4 className="portal-card__title">Active Pledges</h4>
        <div className="portal-metric">{money(pledges)}</div>
        <div className="portal-sub">Pledges scheduled</div>
      </div>
    </div>
  );
}
