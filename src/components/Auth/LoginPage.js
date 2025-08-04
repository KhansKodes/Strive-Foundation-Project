import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout"; // Adjust path as needed

export default function LoginPage() {
  const [f, setF] = useState({ username: "", password: "" });
  const [err, setErr] = useState("");
  const { login } = useAuth();
  const nav = useNavigate();

  const handleChange = (e) => setF({ ...f, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(f.username, f.password);
      if (user.role === "patient") nav("/patient");
      else if (user.role === "donor") nav("/donor");
      else if (user.role === "volunteer") nav("/volunteer");
    } catch (e) {
      setErr(e.message || String(e));
    }
  };

  return (
    <AuthLayout page="login">
      <h2 className="auth-form-title">Login</h2>
      {err && <p className="auth-form-error">{err}</p>}
      <form onSubmit={handleSubmit} className="auth-form">
        <label>
          Username <span>*</span>
        </label>
          <input name="username" value={f.username} onChange={handleChange} required />
        <label>
          Password <span>*</span>
        </label>
          <input type="password" name="password" value={f.password} onChange={handleChange} required />
        <button type="submit" className="auth-form-btn">Login</button>
      </form>
    </AuthLayout>
  );
}
