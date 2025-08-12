import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginPage() {
  const [f, setF] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  const handleChange = (e) => setF({ ...f, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // login now expects (email, password)
      const user = await login(f.email, f.password);
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
        <label>Email <span>*</span></label>
        <input
          type="email"
          name="email"
          value={f.email}
          onChange={handleChange}
          autoComplete="email"
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
            onClick={() => setShowPwd(s => !s)}
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
