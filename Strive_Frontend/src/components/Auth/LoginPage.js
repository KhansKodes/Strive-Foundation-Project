import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginPage() {
  const [f, setF] = useState({ phone: "", password: "" });
  const [err, setErr] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  const handleChange = (e) => setF({ ...f, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      // login now expects (phone, password)
      const user = await login(f.phone, f.password);
      if (user.role === "patient") nav("/patient");
      else if (user.role === "donor") nav("/donor");
      else if (user.role === "volunteer") nav("/volunteer");
      else nav("/");
    } catch (e2) {
      setErr(e2?.message || String(e2));
    }
  };

  return (
    <AuthLayout page="login">
      <h2 className="auth-form-title">Login</h2>
      {err && <p className="auth-form-error">{err}</p>}

      <form onSubmit={handleSubmit} className="auth-form">
        <label>Phone No <span>*</span></label>
        <input
          name="phone"
          value={f.phone}
          onChange={handleChange}
          placeholder="e.g. 3001234567"
          inputMode="numeric"
          autoComplete="tel"
          required
        />

        <label>Password <span>*</span></label>
        <div className="auth-password-wrap">
          <input
            type={showPwd ? "text" : "password"}
            name="password"
            value={f.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
          />
          <button
            type="button"
            className="auth-eye"
            onClick={() => setShowPwd((s) => !s)}
            aria-label="Toggle password"
          >
            {showPwd ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <button type="submit" className="auth-form-btn">Login</button>
      </form>
    </AuthLayout>
  );
}
