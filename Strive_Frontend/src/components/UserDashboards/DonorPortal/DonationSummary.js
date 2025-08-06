import React from 'react';

export default function DonationSummary({ donation }) {
  return (
    <div>
      <strong>{donation.date}</strong> — ${donation.amount}
    </div>
  );
}
