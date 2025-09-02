// Role-based menu configuration for the sidebar

const menuConfig = {
  patient: [
    { key: "overview", label: "Overview", to: "/portal/patient" },
    { key: "appointments", label: "Appointments", to: "/portal/patient/appointments" },
    { key: "treatment", label: "Treatment Plan", to: "/portal/patient/treatment" },
    { key: "documents", label: "Documents", to: "/portal/patient/documents" },
    { key: "support", label: "Support", to: "/portal/patient/support" },
  ],
  donor: [
    { key: "overview", label: "Overview", to: "/portal/donor" },
    { key: "donations", label: "Donations", to: "/portal/donor/donations" },
    { key: "pledges", label: "Pledges", to: "/portal/donor/pledges" },
    { key: "impact", label: "Impact Reports", to: "/portal/donor/impact" },
    { key: "settings", label: "Settings", to: "/portal/donor/settings" },
  ],
  volunteer: [
    { key: "overview", label: "Overview", to: "/portal/volunteer" },
    { key: "tasks", label: "Tasks", to: "/portal/volunteer/tasks" },
    { key: "events", label: "Events", to: "/portal/volunteer/events" },
    { key: "hours", label: "My Hours", to: "/portal/volunteer/hours" },
    { key: "resources", label: "Resources", to: "/portal/volunteer/resources" },
  ],
};

export default menuConfig;
