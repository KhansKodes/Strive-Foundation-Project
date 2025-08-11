export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString();
}


const isValidName = (s) => /^[A-Za-zÀ-ÖØ-öø-ÿ'’\-.\s]{2,60}$/.test(s.trim()); // letters, spaces, '-
const isValidEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
const isStrongPassword = (s) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(s);
const isValidPhone = (s) => /^\+\d{6,15}$/.test(s); // full intl format like +92XXXXXXXXXX
