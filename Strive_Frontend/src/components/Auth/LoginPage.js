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

  const handleChange = (e) => {
    setF({ ...f, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (err) {
      setErr("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Don't clear error here - only clear when user types or on success
    try {
      // login now expects (phone, password)
      const user = await login(f.phone, f.password);
      if (user.role === "patient") nav("/patient");
      else if (user.role === "donor") nav("/donor");
      else if (user.role === "volunteer") nav("/volunteer");
      else nav("/");
    } catch (e2) {
      console.log("Login error:", e2); // Debug log
      console.log("Error response:", e2?.response); // Debug response
      console.log("Error status:", e2?.response?.status); // Debug status
      
      let errorMessage = "Login failed. Please try again.";
      
      // Check if it's an API error response (server responded with error)
      if (e2?.response && e2.response.status) {
        if (e2.response.status === 401) {
          errorMessage = "Invalid phone number or password. Please check your credentials and try again.";
        } else if (e2.response.status === 400) {
          errorMessage = "Please check your login information and try again.";
        } else if (e2.response.status >= 500) {
          errorMessage = "Server error. Please try again later.";
        } else {
          errorMessage = "Invalid phone number or password. Please check your credentials and try again.";
        }
      } else if (e2?.code === 'ERR_NETWORK' || e2?.message?.includes('Network Error')) {
        errorMessage = "Cannot connect to server. Please check if the backend is running.";
      } else if (e2?.code === 'ECONNREFUSED' || e2?.message?.includes('ECONNREFUSED')) {
        errorMessage = "Cannot connect to server. Please check if the backend is running.";
      } else {
        // If no response object, it might still be a credential error
        // Check if error message suggests authentication failure
        if (e2?.message?.includes('401') || e2?.message?.includes('Unauthorized')) {
          errorMessage = "Invalid phone number or password. Please check your credentials and try again.";
        } else {
          errorMessage = "Invalid phone number or password. Please check your credentials and try again.";
        }
      }
      
      setErr(errorMessage);
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
