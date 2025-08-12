import React, { useEffect, useState } from 'react';
import { getAppointments } from '../../../services/patientService';
import AppointmentCard from './AppointmentCard';
import { useAuth } from '../../../hooks/useAuth';
import './PatientDashboard.css';

export default function PatientDashboard() {
  const [apps, setApps] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    getAppointments().then(setApps);
  }, []);

  const fullName = user?.profile?.fullName || "Patient";

  return (
    <div className='PatientDashboard'>
      <h1>Welcome, {fullName}!</h1>
      <h2>Your Appointments</h2>
      {apps.map(a => <AppointmentCard key={a.id} appointment={a} />)}
    </div>
  );
}
