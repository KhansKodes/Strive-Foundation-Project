// src/components/SmaRegistrationPage.js
import React, { useState, useEffect, useMemo } from 'react';
import './SmaRegistrationPage.css';

export default function SmaRegistrationPage() {
  const initialState = {
    registrationType: '',
    cgName: '',
    cgRelation: '',
    cgGender: '',
    cgPhone: '',
    cgWhatsapp: '',
    cgEmail: '',
    cgId: '',
    cgAddress: '',
    cgCity: '',
    cgProvince: '',
    cgCountry: '',

    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    phone: '',
    whatsapp: '',
    patientId: '',

    sameAsCaregiver: false,
    address: '',
    city: '',
    province: '',
    country: '',

    smaType: '',
    diagDate: '',
    consulted: 'no',
    doctorName: '',
    clinicName: '',

    familyHistory: 'no',
    affectedMembers: [],      // ← must be defined here
    otherMember: '',
    familyNotes: '',

    geneReport: null,
    prescriptionUpload: null,

    requestedAmount: '',
    contributionAmount: '',
    cycleNumber: '',
    financialDescription: '',
    supportDocs: [],

    confirmAccurate: false,
    acknowledgeOutcome: false
  };

  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialState);

  // calculate age from dob
  const age = useMemo(() => {
    if (!form.dob) return 0;
    const birth = new Date(form.dob);
    const today = new Date();
    let years = today.getFullYear() - birth.getFullYear();
    if (today < new Date(birth.getFullYear() + years, birth.getMonth(), birth.getDate())) {
      years--;
    }
    return years;
  }, [form.dob]);

  // if caregiver address sync is checked
  useEffect(() => {
    if (form.sameAsCaregiver && form.registrationType === 'caregiver') {
      setForm(f => ({
        ...f,
        address: f.cgAddress,
        city:    f.cgCity,
        province:f.cgProvince,
        country: f.cgCountry
      }));
    }
  }, [
    form.sameAsCaregiver,
    form.registrationType,
    form.cgAddress,
    form.cgCity,
    form.cgProvince,
    form.cgCountry
  ]);

  // generic change handler
  function handleChange(e) {
    const { name, type, value, checked, files } = e.target;

    if (type === 'checkbox') {
      if (['sameAsCaregiver','confirmAccurate','acknowledgeOutcome'].includes(name)) {
        setForm(f => ({ ...f, [name]: checked }));
      } else {
        // family-history checkboxes
        setForm(f => {
          const set = new Set(f.affectedMembers);
          checked ? set.add(value) : set.delete(value);
          return { ...f, affectedMembers: Array.from(set) };
        });
      }
    } 
    else if (type === 'file') {
      setForm(f => ({
        ...f,
        [name]: e.target.multiple ? Array.from(files) : files[0]
      }));
    } 
    else {
      setForm(f => ({ ...f, [name]: value }));
    }
  }

  const next = () => setStep(s => Math.min(s + 1, 3));
  const prev = () => setStep(s => Math.max(s - 1, 1));

  function handleSubmit(e) {
    e.preventDefault();
    alert('Registration submitted! Thank you.');
    setForm(initialState);
    setStep(1);
  }

  // conditional flags
  const showCg      = form.registrationType === 'caregiver';
  const showId      = age >= 18;
  const showConsult = form.consulted === 'yes';
  const showFam     = form.familyHistory === 'yes';
  const showOther   = (form.affectedMembers || []).includes('other');  // ← guarded

  const steps = [
    { key: 1, label: 'Registration' },
    { key: 2, label: 'Medical' },
    { key: 3, label: 'Financial' }
  ];

  return (
    <div className="SmaRegistrationPage">
      <h1>SMA Patient Registration</h1>

      <div className="progress-bar">
        {steps.map(s => (
          <div
            key={s.key}
            className={
              'progress-step ' +
              (step === s.key ? 'current' : step > s.key ? 'completed' : '')
            }
          >
            <div className="step-number">{s.key}</div>
            <div className="step-label">{s.label}</div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="registration-form">

        {/* STEP 1 */}
        <div className={`form-step-container ${step === 1 ? 'active' : ''}`}>
          <h2>1. Registration</h2>
          
          <div className="form-row">
            <label className="full-width">
              Are you a Patient or Caregiver? <span>*</span>
              <select
                name="registrationType"
                value={form.registrationType}
                onChange={handleChange}
                required
              >
                <option value="">— Select —</option>
                <option value="patient">Patient</option>
                <option value="caregiver">Caregiver</option>
              </select>
            </label>
          </div>

          {showCg && (
            <fieldset className="fieldset">
              <legend>Caregiver Info</legend>
              <div className="form-row">
                <label>Full Name <span>*</span>
                  <input
                    name="cgName"
                    value={form.cgName}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  Relationship <span>*</span>
                  <input
                    name="cgRelation"
                    value={form.cgRelation}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>
              <div className="form-row">
                <label>
                  Gender <span>*</span>
                  <select
                    name="cgGender"
                    value={form.cgGender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">— Select —</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </label>
                <label>
                  Phone <span>*</span>
                  <input
                    name="cgPhone"
                    type="tel"
                    value={form.cgPhone}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>
              <div className="form-row">
                <label>
                  Email
                  <input
                    name="cgEmail"
                    type="email"
                    value={form.cgEmail}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  WhatsApp
                  <input
                    name="cgWhatsapp"
                    type="tel"
                    value={form.cgWhatsapp}
                    onChange={handleChange}
                  />
                </label>
              </div>
              <div className="form-row">
                <label>
                  National ID <span>*</span>
                  <input
                    name="cgId"
                    value={form.cgId}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  Address <span>*</span>
                  <input
                    name="cgAddress"
                    value={form.cgAddress}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>
              <div className="form-row">
                <label>
                  City <span>*</span>
                  <input
                    name="cgCity"
                    value={form.cgCity}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  Province/State <span>*</span>
                  <input
                    name="cgProvince"
                    value={form.cgProvince}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>
              <label className="full-width">
                Country <span>*</span>
                <input
                  name="cgCountry"
                  value={form.cgCountry}
                  onChange={handleChange}
                  required
                />
              </label>
              {showId && (
                <label className="checkbox">
                  <input
                    type="checkbox"
                    name="sameAsCaregiver"
                    checked={form.sameAsCaregiver}
                    onChange={handleChange}
                  />
                  Use caregiver’s address
                </label>
              )}
            </fieldset>
          )}

          <fieldset className="fieldset">
            <legend>Patient Info</legend>
            <div className="form-row">
              <label>
                First Name <span>*</span>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Last Name <span>*</span>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
            <div className="form-row">
              <label>
                Date of Birth <span>*</span>
                <input
                  name="dob"
                  type="date"
                  value={form.dob}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Gender <span>*</span>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">— Select —</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </label>
            </div>
            <div className="form-row">
              <label>
                Phone <span>*</span>
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                WhatsApp
                <input
                  name="whatsapp"
                  type="tel"
                  value={form.whatsapp}
                  onChange={handleChange}
                />
              </label>
            </div>
            {showId && (
              <label className="full-width">
                Patient National ID (optional)
                <input
                  name="patientId"
                  value={form.patientId}
                  onChange={handleChange}
                />
              </label>
            )}
            <div className="form-row">
              <label>
                Address <span>*</span>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  disabled={form.sameAsCaregiver}
                  required
                />
              </label>
              <label>
                City <span>*</span>
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  disabled={form.sameAsCaregiver}
                  required
                />
              </label>
            </div>
            <label className="full-width">
              Province/State <span>*</span>
              <input
                name="province"
                value={form.province}
                onChange={handleChange}
                disabled={form.sameAsCaregiver}
                required
              />
            </label>
            <label className="full-width">Country <span>*</span>
              <input
                name="country"
                value={form.country}
                onChange={handleChange}
                disabled={form.sameAsCaregiver}
                required
              />
            </label>
          </fieldset>

          <div className="buttons">
            <button type="button" onClick={next}>Next →</button>
          </div>
        </div>

        {/* STEP 2 */}
        <div className={`form-step-container ${step === 2 ? 'active' : ''}`}>
          <h2>2. Medical Confirmation</h2>
          <div className="form-row">
            <label>
              SMA Type <span>*</span>
              <select name="smaType" value={form.smaType}
                      onChange={handleChange} required>
                <option value="">— Select —</option>
                <option value="type1">Type 1</option>
                <option value="type2">Type 2</option>
                <option value="type3">Type 3</option>
                <option value="unknown">Unknown</option>
              </select>
            </label>
            <label>
              Date of Diagnosis <span>*</span>
              <input name="diagDate" type="date"
                     value={form.diagDate} onChange={handleChange}
                     required />
            </label>
          </div>

          <fieldset className="fieldset">
            <legend>Examined by a doctor? <span>*</span></legend>
            <label><input type="radio" name="consulted" value="yes"
                          checked={form.consulted==='yes'}
                          onChange={handleChange} /> Yes</label>
            <label><input type="radio" name="consulted" value="no"
                          checked={form.consulted==='no'}
                          onChange={handleChange} /> No</label>
          </fieldset>

          {showConsult && (
            <div className="form-row">
              <label>
                Doctor’s Name
                <input name="doctorName"
                       value={form.doctorName}
                       onChange={handleChange} />
              </label>
              <label>
                Clinic/Hospital
                <input name="clinicName"
                       value={form.clinicName}
                       onChange={handleChange} />
              </label>
            </div>
          )}

          <fieldset className="fieldset">
            <legend>Family History? <span>*</span></legend>
            <label><input type="radio" name="familyHistory" value="yes"
                          checked={form.familyHistory==='yes'}
                          onChange={handleChange} /> Yes</label>
            <label><input type="radio" name="familyHistory" value="no"
                          checked={form.familyHistory==='no'}
                          onChange={handleChange} /> No</label>
          </fieldset>

          {showFam && (
            <>
              <fieldset className="fieldset">
                <legend>Who else? <span>*</span></legend>
                {['mother','father','brother','sister','other'].map(val => (
                  <label key={val}>
                    <input type="checkbox" name="affectedMembers"
                           value={val}
                           checked={form.affectedMembers.includes(val)}
                           onChange={handleChange} />
                    {val.charAt(0).toUpperCase() + val.slice(1)}
                  </label>
                ))}
              </fieldset>
              {showOther && (
                <label className="full-width">
                  Specify other
                  <input name="otherMember"
                         value={form.otherMember}
                         onChange={handleChange} />
                </label>
              )}
              <label className="full-width">
                Additional details
                <textarea name="familyNotes" rows="3"
                          value={form.familyNotes}
                          onChange={handleChange} />
              </label>
            </>
          )}

          <label className="full-width">
            Gene Test Report <span>*</span>
            <input name="geneReport" type="file"
                   accept=".pdf,.jpg,.jpeg,.png"
                   onChange={handleChange} required />
          </label>

          <div className="buttons">
            <button type="button" onClick={prev} className="back">← Back</button>
            <button type="button" onClick={next}>Next →</button>
          </div>
        </div>

        {/* STEP 3 */}
        <div className={`form-step-container ${step === 3 ? 'active' : ''}`}>
          <h2>3. Financial Assistance</h2>
          <label className="full-width">
            Doctor’s Prescription <span>*</span>
            <input name="prescriptionUpload" type="file"
                   accept=".pdf,.jpg,.jpeg,.png"
                   onChange={handleChange} required />
          </label>
          <div className="form-row">
            <label>
              Requested Amount (PKR) <span>*</span>
              <input name="requestedAmount" type="number"
                     min="0" step="0.01"
                     value={form.requestedAmount}
                     onChange={handleChange} required />
            </label>
            <label>
              Contribution Amount (PKR) <span>*</span>
              <input name="contributionAmount" type="number"
                     min="0" step="0.01"
                     value={form.contributionAmount}
                     onChange={handleChange} required />
            </label>
          </div>
          <label>
            Cycle Number <span>*</span>
            <input name="cycleNumber" type="number"
                   min="1"
                   value={form.cycleNumber}
                   onChange={handleChange} required />
          </label>
          <label className="full-width">
            Description & Additional Info <span>*</span>
            <textarea name="financialDescription" rows="3"
                      value={form.financialDescription}
                      onChange={handleChange} required />
          </label>
          <label className="full-width">
            Supporting Documents (optional)
            <input name="supportDocs" type="file"
                   accept=".pdf,.jpg,.jpeg,.png" multiple
                   onChange={handleChange} />
          </label>
          <label className="checkbox">
            <input type="checkbox" name="confirmAccurate"
                   checked={form.confirmAccurate}
                   onChange={handleChange} required />
            I confirm all information is accurate.
          </label>
          <label className="checkbox">
            <input type="checkbox" name="acknowledgeOutcome"
                   checked={form.acknowledgeOutcome}
                   onChange={handleChange} required />
            I understand the organization may accept or reject.
          </label>

          <div className="buttons">
            <button type="button" onClick={prev} className="back">← Back</button>
            <button type="submit">Submit</button>
          </div>
        </div>

      </form>
    </div>
  );
}
