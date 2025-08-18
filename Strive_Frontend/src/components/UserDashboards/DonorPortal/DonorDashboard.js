import React, { useEffect, useState } from "react";
import { getDonations } from "../../../services/donorService";
import DonationSummary from "./DonationSummary";
import PortalLayout from "../PortalLayout/PortalLayout";
import { donorMenu } from "../PortalLayout/menuConfig";

export default function DonorDashboard() {
  const [dons, setDons] = useState([]);
  useEffect(() => {
    getDonations().then(setDons);
  }, []);

  return (
    <PortalLayout title="Donor Portal" menu={donorMenu} initialActiveKey="overview">
      {(active) => {
        if (active === "donations") {
          return (
            <>
              <h2>Your Donations</h2>
              {dons.length === 0 ? (
                <div className="portal-card">No donations yet.</div>
              ) : (
                dons.map((d) => <DonationSummary key={d.id} donation={d} />)
              )}
            </>
          );
        }
        if (active === "receipts") {
          return <div className="portal-card">Download receipts — (placeholder).</div>;
        }
        if (active === "impact") {
          return <div className="portal-card">Your impact metrics — (placeholder).</div>;
        }
        if (active === "settings") {
          return <div className="portal-card">Donor settings — (placeholder).</div>;
        }
        // overview
        return (
          <div className="portal-card">
            <h2>Overview</h2>
            <p>See a snapshot of your giving history and latest updates.</p>
          </div>
        );
      }}
    </PortalLayout>
  );
}
