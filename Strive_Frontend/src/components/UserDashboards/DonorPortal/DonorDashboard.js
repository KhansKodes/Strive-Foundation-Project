import React, { useEffect, useState } from 'react';
import { getDonations } from '../../../services/donorService';
import DonationSummary from './DonationSummary';
import { useAuth } from '../../../hooks/useAuth';
import './DonorDashboard.css';

export default function DonorDashboard() {
  const [dons, setDons] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    getDonations().then(setDons);
  }, []);

  const fullName = user?.profile?.fullName || "Donor";

  return (
    <div className='DonorDashboard'>
      <h1>Welcome, {fullName}!</h1>
      <h2>Your Donations</h2>
      {dons.map(d => <DonationSummary key={d.id} donation={d} />)}
    </div>
  );
}
