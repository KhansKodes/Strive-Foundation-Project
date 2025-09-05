// src/components/Patients/PatientDetailPage.js
import React, { useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import "./PatientDetailPage.css";

/* =========================================================
   Dummy Patients (kept in the SAME FILE as requested)
   ========================================================= */
const PATIENTS = [
  {
    id: "P-0001",
    slug: "ahmed-khan",
    name: "Ahmed Khan",
    age: "2 Years",
    gender: "Male",
    smaType: "Type 1",
    city: "Lahore",
    doctor: "Dr. Adeel",
    hospital: "Children’s Hospital Lahore",
    diagnosisDate: "Feb 14, 2024",
    caseManager: { name: "Sadia", email: "cases@strive.pk", phone: "+92 300 111 1111" },
    treatment: {
      status: "Awaiting: Spinraza",
      awaitingSince: "May 10, 2025",
      currentCycle: null,
      firstCycle: null,
      lastCycle: null,
    },
    funding: { goal: 3_500_000, raised: 800_000, family: 200_000 },
    images: [
      "https://picsum.photos/seed/patient1a/1400/900",
      "https://picsum.photos/seed/patient1b/1400/900",
      "https://picsum.photos/seed/patient1c/1400/900",
    ],
    video: "https://www.youtube.com/embed/ysz5S6PUM-U?rel=0&modestbranding=1&mute=1",
    bio: `Ahmed was diagnosed with SMA Type 1 at 9 months. His family traveled to Lahore for confirmatory tests. He is currently awaiting treatment while fundraising continues.`,
    updates: [
      { date: "Aug 05, 2025", text: "Diagnostic reports verified and uploaded." },
      { date: "Jul 20, 2025", text: "Case approved for fundraising." },
    ],
    faqs: [
      { q: "How will my donation be used?", a: "Medication, diagnostics, hospital costs, and essential support verified by Strive." },
      { q: "Can I get a receipt?", a: "Yes. An official receipt is emailed after each donation." },
      { q: "What if goal is exceeded?", a: "Excess goes to Strive’s Treatment Fund for other SMA patients (with family consent)." },
    ],
  },
  {
    id: "P-0002",
    slug: "fatima-noor",
    name: "Fatima Noor",
    age: "5 Years",
    gender: "Female",
    smaType: "Type 2",
    city: "Karachi",
    doctor: "Dr. Sana",
    hospital: "Karachi SMA Center",
    diagnosisDate: "Jan 22, 2024",
    caseManager: { name: "Ali Raza", email: "cases@strive.pk", phone: "+92 300 222 2222" },
    treatment: {
      status: "Receiving: Evrysdi",
      awaitingSince: null,
      currentCycle: 1,
      firstCycle: "Jul 10, 2025",
      lastCycle: null,
    },
    funding: { goal: 2_800_000, raised: 900_000, family: 150_000 },
    images: [
      "https://picsum.photos/seed/patient2a/1400/900",
      "https://picsum.photos/seed/patient2b/1400/900",
      "https://picsum.photos/seed/patient2c/1400/900",
    ],
    video: "https://www.youtube.com/embed/RSF8KL3xaIk?rel=0&modestbranding=1&mute=1",
    bio: `Fatima began Evrysdi in July 2025. She is responding well to therapy and requires continued support for medication and follow-ups.`,
    updates: [
      { date: "Aug 02, 2025", text: "First cycle completed successfully." },
      { date: "Jul 10, 2025", text: "Started Evrysdi therapy." },
    ],
    faqs: null, // will fall back to defaults below
  },
  {
    id: "P-0003",
    slug: "bilal-hussain",
    name: "Bilal Hussain",
    age: "8 Years",
    gender: "Male",
    smaType: "Type 3",
    city: "Peshawar",
    doctor: "Dr. Hina",
    hospital: "Peshawar Children’s Hospital",
    diagnosisDate: "Mar 03, 2024",
    caseManager: { name: "Saima", email: "cases@strive.pk", phone: "+92 300 333 3333" },
    treatment: {
      status: "Awaiting: Zolgensma",
      awaitingSince: "Jun 01, 2025",
      currentCycle: null,
      firstCycle: null,
      lastCycle: null,
    },
    funding: { goal: 2_000_000, raised: 400_000, family: 100_000 },
    images: [
      "https://picsum.photos/seed/patient3a/1400/900",
      "https://picsum.photos/seed/patient3b/1400/900",
      "https://picsum.photos/seed/patient3c/1400/900",
    ],
    video: "https://www.youtube.com/embed/X6Tsqg-tNU8?rel=0&modestbranding=1&mute=1",
    bio: `Bilal is a bright student who loves drawing. He is awaiting therapy while funds are being raised.`,
    updates: [
      { date: "Aug 01, 2025", text: "Community fundraiser launched in Peshawar." },
      { date: "Jul 15, 2025", text: "Case documents reviewed and verified." },
    ],
  },
];

/* =========================================================
   FAQ subcomponent (kept as-is)
   ========================================================= */
function FAQ({ items }) {
  const [open, setOpen] = useState(null);
  return (
    <section className="pd-faq" aria-labelledby="faq-heading">
      <h3 id="faq-heading">FAQs</h3>
      <ul className="pd-accordion">
        {items.map((it, i) => (
          <li key={i} className={open === i ? "open" : ""}>
            <button
              className="pd-accordion-head"
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
              aria-controls={`faq-panel-${i}`}
              id={`faq-button-${i}`}
            >
              <span>{it.q}</span>
              <span className="chev" aria-hidden>
                {open === i ? "−" : "+"}
              </span>
            </button>
            <div
              id={`faq-panel-${i}`}
              role="region"
              aria-labelledby={`faq-button-${i}`}
              className="pd-accordion-body"
            >
              <p>{it.a}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* =========================================================
   Page
   ========================================================= */
export default function PatientDetailPage() {
  const { slug } = useParams();          // supports /patients/:slug
  const location = useLocation();        // optionally use state.patientId

  // Optional id from <Link state={{ patientId: 'P-0002' }}>
  const stateId = location.state?.patientId;

  // Resolve patient by id (state) → by slug (URL) → fallback to first
  const patient = useMemo(() => {
    return (
      PATIENTS.find((p) => p.id === stateId) ||
      PATIENTS.find((p) => p.slug === slug) ||
      PATIENTS[0]
    );
  }, [slug, stateId]);

  // Images / slider
  const images = patient.images?.length ? patient.images : [ "https://picsum.photos/seed/fallback/1400/900" ];
  const [idx, setIdx] = useState(0);
  const next = () => setIdx((p) => (p + 1) % images.length);
  const prev = () => setIdx((p) => (p - 1 + images.length) % images.length);

  // Funding
  const pct = Math.min(
    100,
    Math.round(((patient.funding.raised + patient.funding.family) / patient.funding.goal) * 100)
  );
  const pk = (n) => `PKR ${Number(n).toLocaleString("en-PK")}`;

  // Docs (dummy)
  const [docModal, setDocModal] = useState(null);
  const docs = [
    { key: "Prescription", img: "https://picsum.photos/seed/pres/900/1200" },
    { key: "Gene Test Report", img: "https://picsum.photos/seed/gene/900/1200" },
    { key: "Clinical Notes", img: "https://picsum.photos/seed/clin/900/1200" },
  ];

  // Share
  const [copied, setCopied] = useState(false);
  const copyShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const donate = () => alert("Redirect to Donate flow for: " + patient.name);

  // Fallbacks for optional fields
  const updates = patient.updates?.length
    ? patient.updates
    : [
        { date: "Aug 02, 2025", text: "Cycle 2 completed. Child tolerated well." },
        { date: "Jun 10, 2025", text: "Funds disbursed for diagnostics and therapy support." },
        { date: "Apr 01, 2025", text: "First treatment cycle started." },
      ];

  const faqs =
    patient.faqs ||
    [
      {
        q: "How will my donation be used?",
        a: "Donations for this case are used for medication, diagnostics, hospital costs, and essential support verified by Strive’s case team.",
      },
      {
        q: "Can I get a receipt?",
        a: "Yes. You will receive an official receipt by email after a successful donation.",
      },
      {
        q: "What happens if the goal is exceeded?",
        a: "Any excess will go to Strive’s Treatment Fund to support other SMA patients with the family’s consent.",
      },
    ];

  const related = [
    { name: "Hassan Ali", city: "Islamabad", img: "https://picsum.photos/seed/r1/500/380", href: "/patients/hassan-ali" },
    { name: "Noor Fatima", city: "Karachi",   img: "https://picsum.photos/seed/r2/500/380", href: "/patients/noor-fatima" },
    { name: "Ahmad Raza",  city: "Peshawar",  img: "https://picsum.photos/seed/r3/500/380", href: "/patients/ahmad-raza" },
  ];

  return (
    <main className="patient-detail">
      {/* HERO */}
      <section className="pd-hero">
        <div className="pd-hero-box">
          <h1 className="pd-hero-title">
            Donate For:{" "}
            <a className="pd-hero-name" href={`/patients/${patient.slug}`}>
              {patient.name}
            </a>
          </h1>
        </div>

        <div className="pd-media">
          {/* Slider */}
          <div className="pd-slider">
            <button className="nav prev" onClick={prev} aria-label="Previous image">
              ‹
            </button>
            <img src={images[idx]} alt={`Photo ${idx + 1} of ${patient.name}`} />
            <button className="nav next" onClick={next} aria-label="Next image">
              ›
            </button>
            <div className="pd-dots" role="tablist" aria-label="Gallery selector">
              {images.map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === idx}
                  className={"dot" + (i === idx ? " active" : "")}
                  onClick={() => setIdx(i)}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Video */}
          <div className="pd-video">
            <div className="pd-video-wrap">
              <iframe
                src={patient.video}
                title={`${patient.name} story`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </div>
        </div>
      </section>

      {/* BELOW HERO */}
      <section className="pd-info">
        {/* Chips */}
        <ul className="pd-chips">
          <li>
            Case ID: <strong>{patient.id}</strong>
          </li>
          <li>
            Age: <strong>{patient.age}</strong>
          </li>
          <li>
            Gender: <strong>{patient.gender}</strong>
          </li>
          <li>
            SMA Type: <strong>{patient.smaType}</strong>
          </li>
          <li>
            <strong>{patient.city}</strong>
          </li>
        </ul>

        {/* Cards */}
        <div className="pd-cards">
          <article className="pd-card">
            <h3>Checked By Doctor</h3>
            <div className="pd-kv">
              <span>Doctor</span>
              <strong>{patient.doctor}</strong>
            </div>
            <div className="pd-kv">
              <span>Hospital/Clinic</span>
              <strong>{patient.hospital}</strong>
            </div>
            <div className="pd-kv">
              <span>Diagnosis Date</span>
              <strong>{patient.diagnosisDate}</strong>
            </div>
            <div className="pd-kv">
              <span>Case Manager</span>
              <strong>{patient.caseManager?.name}</strong>
            </div>
          </article>

          <article className="pd-card">
            <h3>Current Treatment Status</h3>
            <ul className="pd-list">
              <li>
                <span>Status:</span> <strong>{patient.treatment.status}</strong>
              </li>
              {patient.treatment.awaitingSince && (
                <li>
                  <span>If awaiting (since):</span>{" "}
                  <strong>{patient.treatment.awaitingSince}</strong>
                </li>
              )}
              {patient.treatment.currentCycle != null && (
                <li>
                  <span>Current Cycle No:</span>{" "}
                  <strong>{patient.treatment.currentCycle}</strong>
                </li>
              )}
              {patient.treatment.firstCycle && (
                <li>
                  <span>First cycle receiving date:</span>{" "}
                  <strong>{patient.treatment.firstCycle}</strong>
                </li>
              )}
              {patient.treatment.lastCycle && (
                <li>
                  <span>Last cycle receiving date:</span>{" "}
                  <strong>{patient.treatment.lastCycle}</strong>
                </li>
              )}
            </ul>
          </article>
        </div>

        {/* Funding */}
        <article className="pd-funding" aria-labelledby="funding-title">
          <header className="pd-funding-head">
            <h3 id="funding-title">Support / Funding</h3>
            <div className="pd-funding-right">
              <div className="pd-funding-pct">
                <strong>{pct}%</strong> <span>Target</span>
              </div>
              <div className="pd-funding-goal">{pk(patient.funding.goal)}</div>
            </div>
          </header>

          <div
            className="pd-progress"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pct}
          >
            <div className="pd-progress-bar" style={{ width: `${pct}%` }} />
          </div>

          <ul className="pd-funding-rows">
            <li>
              <span>Goal:</span> <strong>{pk(patient.funding.goal)}</strong>
            </li>
            <li>
              <span>Raised to date:</span>{" "}
              <strong>{pk(patient.funding.raised)}</strong>
            </li>
            <li>
              <span>Family contribution:</span>{" "}
              <strong>{pk(patient.funding.family)}</strong>
            </li>
          </ul>

          <div className="pd-funding-cta">
            <button className="btn primary" onClick={donate}>
              Donate Now
            </button>
            <button className="btn ghost" onClick={copyShare}>
              {copied ? "Link Copied!" : "Share Story"}
            </button>
          </div>
        </article>

        {/* Docs */}
        <div className="pd-docs" id="docs">
          <h3>MEDICAL DOCUMENT(S)</h3>
          <div className="pd-doc-pills">
            {docs.map((d) => (
              <button key={d.key} className="pill" onClick={() => setDocModal(d)}>
                {d.key}
              </button>
            ))}
          </div>
        </div>

        {/* Bio */}
        <div className="pd-bio">
          <h3>Message / detail / biography etc</h3>
          <p>
            {patient.bio ??
              `Ayesha was diagnosed with SMA Type 1 in early 2024. Her parents traveled
               from a remote village near Lahore to seek help. Through Strive’s network,
               the family received counselling, diagnostics, and is now on therapy.`}
          </p>
        </div>

        {/* Updates */}
        <section className="pd-updates">
          <h3>Recent Updates</h3>
          <ol className="pd-timeline">
            {updates.map((u, i) => (
              <li key={i}>
                <div className="dot" />
                <div className="content">
                  <div className="date">{u.date}</div>
                  <div className="text">{u.text}</div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* FAQ */}
        <FAQ items={faqs} />

        {/* Related */}
        <section className="pd-related">
          <h3>Similar Stories</h3>
          <div className="pd-related-grid">
            {related.map((r, i) => (
              <a key={i} className="rel-card" href={r.href}>
                <img src={r.img} alt={`${r.name} from ${r.city}`} />
                <div className="rel-meta">
                  <strong>{r.name}</strong>
                  <span>{r.city}</span>
                </div>
              </a>
            ))}
          </div>
        </section>
      </section>

      {/* Sticky donate (mobile) */}
      <div className="pd-sticky">
        <button className="btn primary" onClick={donate}>
          Donate for {patient.name}
        </button>
        <div className="pd-sticky-pct">{pct}%</div>
      </div>

      {/* Modal */}
      {docModal && (
        <div className="pd-modal" role="dialog" aria-modal="true" onClick={() => setDocModal(null)}>
          <div className="pd-modal-body" onClick={(e) => e.stopPropagation()}>
            <header className="pd-modal-head">
              <h4>{docModal.key}</h4>
              <button className="close" onClick={() => setDocModal(null)} aria-label="Close">
                ×
              </button>
            </header>
            <img src={docModal.img} alt={docModal.key} />
          </div>
        </div>
      )}
    </main>
  );
}
