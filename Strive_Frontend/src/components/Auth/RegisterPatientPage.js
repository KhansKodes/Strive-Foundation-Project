import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { ROLES } from "../../utils/constants";

export default function RegisterPatientPage() {
  const [f, setF] = useState({ username: "", password: "" }); // role is hidden/preset
  const { register } = useAuth();
  const nav = useNavigate();

  const handleChange = (e) => setF({ ...f, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(f.username, f.password, ROLES.PATIENT); // fixed role
    nav("/login");
  };

  return (
    <AuthLayout page="register">
      <h2 className="auth-form-title">Register (SMA Patient)</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <label>
          Username <span>*</span>
        </label>
        <input
          name="username"
          value={f.username}
          onChange={handleChange}
          required
        />

        <label>
          Password <span>*</span>
        </label>
        <input
          type="password"
          name="password"
          value={f.password}
          onChange={handleChange}
          required
        />

        {/* Hidden, but keeping for clarity */}
        <input type="hidden" name="role" value={ROLES.PATIENT} />

        <button type="submit" className="auth-form-btn">Register</button>
      </form>
    </AuthLayout>
  );
}
