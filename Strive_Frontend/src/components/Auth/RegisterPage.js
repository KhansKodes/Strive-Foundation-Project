import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { ROLES } from "../../utils/constants";
import AuthLayout from "./AuthLayout";

export default function RegisterPage() {
  const [f, setF] = useState({ username: "", password: "", role: "" });
  const { register } = useAuth();
  const nav = useNavigate();

  const handleChange = (e) => setF({ ...f, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(f.username, f.password, f.role);
    nav("/login");
  };

  return (
    <AuthLayout page="register">
      <h2 className="auth-form-title">Register</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <label>
          Username <span>*</span>
        </label>
        <input name="username" value={f.username} onChange={handleChange} required />

        <label>
          Password <span>*</span>
        </label>
        <input type="password" name="password" value={f.password} onChange={handleChange} required />

        <label>
          Role <span>*</span>
        </label>
        <select name="role" value={f.role} onChange={handleChange} required>
          <option value="">Select</option>
          <option value={ROLES.DONOR}>Donor</option>
          <option value={ROLES.VOLUNTEER}>Volunteer</option>
        </select>

        <button type="submit" className="auth-form-btn">Register</button>
      </form>
    </AuthLayout>
  );
}
