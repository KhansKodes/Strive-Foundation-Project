import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAppointments } from '../../../services/patientService';
import AppointmentCard from './AppointmentCard';
import { useAuth } from '../../../hooks/useAuth';
import './PatientDashboard.css';

export default function PatientDashboard() {
  const [apps, setApps] = useState([]);
  const { user, logout } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    getAppointments().then(setApps);
  }, []);

  const fullName = user?.profile?.fullName || "Patient";

  const handleLogout = () => {
    logout();
    nav('/login');
  };

  return (
    <div className='PatientDashboard'>
      <div className="dashboard-header">
        <h1>Welcome, {fullName}!</h1>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <h2>Your Appointments</h2>
      {apps.map(a => <AppointmentCard key={a.id} appointment={a} />)}
    </div>
  );
}
