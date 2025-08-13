import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { ROLES } from "../../utils/constants";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";

const NAME_RE  = /^[A-Za-zÀ-ÖØ-öø-ÿ'’\-.\s]{2,60}$/;
const PASS_RE  = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
const PHONE_RE = /^[0-9]{7,15}$/;

export default function RegisterPatientPage() {
  const [f, setF] = useState({
    fullName: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPwd, setShowPwd] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);
  const [errors, setErrors] = useState({});
  const { register } = useAuth();
  const nav = useNavigate();

  const setField = (name, value) => setF((prev) => ({ ...prev, [name]: value }));

  const validate = () => {
    const e = {};
    if (!NAME_RE.test(f.fullName.trim())) e.fullName = "Enter a valid name (letters only).";
    if (!PHONE_RE.test(f.phone)) e.phone = "Enter digits only (7–15).";
    if (!PASS_RE.test(f.password)) e.password = "Min 8 chars with upper, lower and a number.";
    if (f.confirmPassword !== f.password) e.confirmPassword = "Passwords do not match.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await register(f.phone, f.password, ROLES.PATIENT, { fullName: f.fullName.trim() });
      await Swal.fire({
        icon: "success",
        title: "Patient registered",
        text: "Please verify your account via OTP.",
        confirmButtonColor: "#553CDA",
      });
      nav("/login");
    } catch (err) {
      setErrors({ form: err?.message || "Registration failed. Try again." });
    }
  };

  return (
    <AuthLayout page="register">
      <h2 className="auth-form-title">Register (SMA Patient)</h2>
      {errors.form && <p className="auth-form-error">{errors.form}</p>}

      <form onSubmit={handleSubmit} className="auth-form">
        <label>Full Name <span>*</span></label>
        <input
          className={errors.fullName ? "is-invalid" : ""}
          name="fullName"
          value={f.fullName}
          onChange={(e) => setField("fullName", e.target.value)}
          autoComplete="name"
          required
        />
        {errors.fullName && <div className="auth-field-error">{errors.fullName}</div>}

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
          <button type="button" className="auth-eye" onClick={() => setShowPwd(s => !s)}>
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
          <button type="button" className="auth-eye" onClick={() => setShowPwd2(s => !s)}>
            {showPwd2 ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {errors.confirmPassword && <div className="auth-field-error">{errors.confirmPassword}</div>}

        <input type="hidden" name="role" value={ROLES.PATIENT} />

        <button type="submit" className="auth-form-btn">Register</button>
      </form>
    </AuthLayout>
  );
}
