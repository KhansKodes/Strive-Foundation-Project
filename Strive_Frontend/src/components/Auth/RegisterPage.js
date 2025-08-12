import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { ROLES } from "../../utils/constants";
import AuthLayout from "./AuthLayout";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";

const NAME_RE  = /^[A-Za-zÀ-ÖØ-öø-ÿ'’\-.\s]{2,60}$/;   // letters, spaces, - . ’
const PASS_RE  = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/; // upper, lower, number, 8+
const PHONE_RE = /^[0-9]{7,15}$/;                         // digits only, 7–15

export default function RegisterPage() {
  const [f, setF] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [showPwd, setShowPwd] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);
  const [errors, setErrors] = useState({});
  const { register } = useAuth();
  const nav = useNavigate();

  const setField = (name, value) => setF((prev) => ({ ...prev, [name]: value }));

  const validate = () => {
    const e = {};
    if (!NAME_RE.test(f.firstName.trim())) e.firstName = "Enter a valid first name (letters only).";
    if (f.lastName && !NAME_RE.test(f.lastName.trim())) e.lastName = "Last name must be letters only.";
    if (!PHONE_RE.test(f.phone)) e.phone = "Enter digits only (7–15).";
    if (!PASS_RE.test(f.password)) e.password = "Min 8 chars with upper, lower and a number.";
    if (f.confirmPassword !== f.password) e.confirmPassword = "Passwords do not match.";
    if (![ROLES.DONOR, ROLES.VOLUNTEER].includes(f.role)) e.role = "Select Donor or Volunteer.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await register(f.phone, f.password, f.role, {
        firstName: f.firstName.trim(),
        lastName: f.lastName.trim(),
      });
      await Swal.fire({
        icon: "success",
        title: "Registration successful",
        text: "You can now login with your phone number.",
        confirmButtonColor: "#553CDA",
      });
      nav("/login");
    } catch (err) {
      setErrors({ form: err?.message || "Registration failed. Try again." });
    }
  };

  return (
    <AuthLayout page="register">
      <h2 className="auth-form-title">Register</h2>
      {errors.form && <p className="auth-form-error">{errors.form}</p>}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="auth-grid-2">
          <div>
            <label>First Name <span>*</span></label>
            <input
              className={errors.firstName ? "is-invalid" : ""}
              name="firstName"
              value={f.firstName}
              onChange={(e) => setField("firstName", e.target.value)}
              autoComplete="given-name"
              required
            />
            {errors.firstName && <div className="auth-field-error">{errors.firstName}</div>}
          </div>

          <div>
            <label>Last Name <small>(optional)</small></label>
            <input
              className={errors.lastName ? "is-invalid" : ""}
              name="lastName"
              value={f.lastName}
              onChange={(e) => setField("lastName", e.target.value)}
              autoComplete="family-name"
            />
            {errors.lastName && <div className="auth-field-error">{errors.lastName}</div>}
          </div>
        </div>

        <label>Phone No <span>*</span></label>
        <input
          className={errors.phone ? "is-invalid" : ""}
          name="phone"
          value={f.phone}
          onChange={(e) => setField("phone", e.target.value.replace(/\D/g, ""))}
          placeholder="e.g. 3001234567"
          inputMode="numeric"
          autoComplete="tel"
          required
        />
        {errors.phone && <div className="auth-field-error">{errors.phone}</div>}

        <label>Password <span>*</span></label>
        <div className="auth-password-wrap">
          <input
            className={errors.password ? "is-invalid" : ""}
            type={showPwd ? "text" : "password"}
            name="password"
            value={f.password}
            onChange={(e) => setField("password", e.target.value)}
            autoComplete="new-password"
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
        {errors.password && <div className="auth-field-error">{errors.password}</div>}

        <label>Confirm Password <span>*</span></label>
        <div className="auth-password-wrap">
          <input
            className={errors.confirmPassword ? "is-invalid" : ""}
            type={showPwd2 ? "text" : "password"}
            name="confirmPassword"
            value={f.confirmPassword}
            onChange={(e) => setField("confirmPassword", e.target.value)}
            autoComplete="new-password"
            required
          />
          <button
            type="button"
            className="auth-eye"
            onClick={() => setShowPwd2((s) => !s)}
            aria-label="Toggle confirm password"
          >
            {showPwd2 ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {errors.confirmPassword && <div className="auth-field-error">{errors.confirmPassword}</div>}

        <label>Role <span>*</span></label>
        <select
          className={errors.role ? "is-invalid" : ""}
          name="role"
          value={f.role}
          onChange={(e) => setField("role", e.target.value)}
          required
        >
          <option value="">Select</option>
          <option value={ROLES.DONOR}>Donor</option>
          <option value={ROLES.VOLUNTEER}>Volunteer</option>
        </select>
        {errors.role && <div className="auth-field-error">{errors.role}</div>}

        <button type="submit" className="auth-form-btn">Register</button>
      </form>
    </AuthLayout>
  );
}
