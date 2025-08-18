import React from "react";
import { FiHome, FiCalendar, FiFileText, FiMessageSquare, FiSettings, FiHeart, FiTrendingUp, FiClipboard, FiClock } from "react-icons/fi";

export const patientMenu = [
  { key: "overview",    label: "Overview",    icon: <FiHome /> },
  { key: "appointments",label: "Appointments",icon: <FiCalendar /> },
  { key: "records",     label: "Medical Records", icon: <FiFileText /> },
  { key: "messages",    label: "Messages",    icon: <FiMessageSquare /> },
  { key: "settings",    label: "Settings",    icon: <FiSettings /> },
];

export const donorMenu = [
  { key: "overview",  label: "Overview",  icon: <FiHome /> },
  { key: "donations", label: "Donations", icon: <FiHeart /> },
  { key: "receipts",  label: "Receipts",  icon: <FiFileText /> },
  { key: "impact",    label: "Impact",    icon: <FiTrendingUp /> },
  { key: "settings",  label: "Settings",  icon: <FiSettings /> },
];

export const volunteerMenu = [
  { key: "overview", label: "Overview",  icon: <FiHome /> },
  { key: "tasks",    label: "Tasks",     icon: <FiClipboard /> },
  { key: "schedule", label: "Schedule",  icon: <FiClock /> },
  { key: "messages", label: "Messages",  icon: <FiMessageSquare /> },
  { key: "settings", label: "Settings",  icon: <FiSettings /> },
];
