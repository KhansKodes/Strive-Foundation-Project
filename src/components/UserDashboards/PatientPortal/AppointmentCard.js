import React from 'react';

export default function AppointmentCard({ appointment }) {
  return (
    <div>
      <strong>{appointment.date}</strong>: {appointment.description}
    </div>
  );
}
