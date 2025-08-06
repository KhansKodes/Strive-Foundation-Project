import React, { useState } from "react";
import "./StriveBeaconInitiativePage.css";
import { FaCalendarAlt, FaBullhorn, FaUsers, FaHandshake } from "react-icons/fa";

// Hero background image and overlay opacity
const HERO_BG = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80";
const OVERLAY_OPACITY = 0.48; // 0.0 (transparent) to 1.0 (solid black)

// Dummy images from Unsplash
const dummyImgs = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=300&q=80"
];

// EVENTS DATA (timeline)
const EVENTS = [
  {
    image: dummyImgs[0],
    title: "SMA Awareness Seminar",
    date: "July 2024",
    desc: "Seminar for healthcare professionals on SMA early diagnosis and management."
  },
  {
    image: dummyImgs[1],
    title: "Family Support Meetup",
    date: "June 2024",
    desc: "Bringing together SMA families for mutual support and awareness."
  },
  {
    image: dummyImgs[2],
    title: "School Outreach Program",
    date: "April 2024",
    desc: "Interactive awareness campaign at Islamabad Model School."
  }
];

// POLICY ADVOCACY DATA (horizontal card)
const POLICY_ADVOCACY = [
  {
    image: dummyImgs[3],
    date: "June 2024",
    content: "Meeting with Ministry of Health on SMA inclusion in Sehat Card"
  },
  {
    image: dummyImgs[4],
    date: "May 2024",
    content: "Consultation with DRAP on SMA treatment registration pathway"
  }
];

// CAMPAIGN DATA (card grid)
const CAMPAIGNS = [
  {
    image: dummyImgs[2],
    title: "SMA Awareness Month",
    desc: "A month-long national awareness drive on SMA, genetic risks, and support resources."
  },
  {
    image: dummyImgs[0],
    title: "Light Up for SMA",
    desc: "Landmark illumination and city-wide walks for SMA advocacy."
  },
  {
    image: dummyImgs[1],
    title: "Social Media Marathon",
    desc: "24-hour online campaign sharing patient stories and research updates."
  }
];

// COMMUNITY REACH (ZIG-ZAG)
const OUTREACH = [
  {
    image: dummyImgs[3],
    date: "May 2024",
    content: "Community screening camp in rural Sindh for early detection and education."
  },
  {
    image: dummyImgs[4],
    date: "April 2024",
    content: "Volunteer training for grassroots SMA awareness and first-aid."
  },
  {
    image: dummyImgs[2],
    date: "March 2024",
    content: "SMA info session at community center in Lahore."
  }
];

const TABS = [
  {
    key: "events",
    label: "Events",
    icon: <FaCalendarAlt />,
  },
  {
    key: "advocacy",
    label: "Policy Advocacy",
    icon: <FaHandshake />,
  },
  {
    key: "campaigns",
    label: "Campaigns",
    icon: <FaBullhorn />,
  },
  {
    key: "outreach",
    label: "Community Reach",
    icon: <FaUsers />,
  }
];

export default function StriveBeaconInitiativePage() {
  const [activeTab, setActiveTab] = useState("events");

  return (
    <div className="sbi-root">
      {/* HERO SECTION */}
      <div
        className="sbi-hero"
        style={{
          backgroundImage: `url(${HERO_BG})`,
        }}
      >
        <div
          className="sbi-hero-overlay"
          style={{ background: `rgba(0,0,0,${OVERLAY_OPACITY})` }}
        ></div>
        <div className="sbi-hero-content">
          <div className="sbi-hero-title-row">
            <span className="sbi-hero-icon">
              <FaBullhorn />
            </span>
            <h1 className="sbi-hero-title">STRIVE BEACON INITIATIVE</h1>
          </div>
          <div className="sbi-hero-subtitle">
            Advocacy. Awareness. Policy. <br />
            Lighting the way for SMA solutions in Pakistan.
          </div>
          <button className="button-73">Get Involved</button>
          <div className="sbi-hero-desc">
            <strong>Our Focus</strong>
            <br />
            Empowering families and building alliances for policy change, early intervention, and nationwide SMA awareness.
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sbi-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`sbi-tab-btn ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <span className="sbi-tab-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="sbi-tab-content">
        {/* EVENTS: Timeline vertical with circles */}
        {activeTab === "events" && (
          <div className="sbi-events-timeline">
            <div className="sbi-timeline-line" />
            {EVENTS.map((event, idx) => (
              <div className="sbi-timeline-item" key={idx}>
                <div className="sbi-timeline-circle-wrap">
                  <div className="sbi-timeline-circle">
                    <img src={event.image} alt={event.title} />
                  </div>
                  <div className="sbi-timeline-connector" />
                </div>
                <div className="sbi-timeline-content">
                  <div className="sbi-timeline-title">{event.title}</div>
                  <div className="sbi-timeline-date">
                    <FaCalendarAlt className="sbi-calendar-icon" />
                    {event.date}
                  </div>
                  <div className="sbi-timeline-desc">{event.desc}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* POLICY ADVOCACY: Horizontal card with image left, content right */}
        {activeTab === "advocacy" && (
          <div className="sbi-advocacy-list">
            {POLICY_ADVOCACY.map((item, idx) => (
              <div className="sbi-advocacy-item" key={idx}>
                <div className="sbi-advocacy-imgwrap">
                  <img src={item.image} alt={item.content} />
                </div>
                <div className="sbi-advocacy-details">
                  <div className="sbi-advocacy-date">
                    <FaCalendarAlt className="sbi-calendar-icon" />
                    {item.date}
                  </div>
                  <div className="sbi-advocacy-content">{item.content}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CAMPAIGNS: Responsive card grid */}
        {activeTab === "campaigns" && (
          <div className="sbi-campaigns-grid">
            {CAMPAIGNS.map((item, idx) => (
              <div className="sbi-campaign-card" key={idx}>
                <div className="sbi-campaign-imgwrap">
                  <img src={item.image} alt={item.title} />
                </div>
                <div className="sbi-campaign-title">{item.title}</div>
                <div className="sbi-campaign-desc">{item.desc}</div>
              </div>
            ))}
          </div>
        )}

        {/* COMMUNITY REACH: Zig-Zag alternating layout */}
        {activeTab === "outreach" && (
          <div className="sbi-outreach-zigzag-list">
            {OUTREACH.map((item, idx) => (
              <div
                className={`sbi-outreach-zigzag-item ${
                  idx % 2 === 0
                    ? "sbi-outreach-zigzag-item-left"
                    : "sbi-outreach-zigzag-item-right"
                }`}
                key={idx}
              >
                {idx % 2 === 0 ? (
                  <>
                    <div className="sbi-outreach-imgwrap">
                      <img src={item.image} alt={item.content} />
                    </div>
                    <div className="sbi-outreach-zigzag-details">
                      <div className="sbi-outreach-date">
                        <FaCalendarAlt className="sbi-calendar-icon" />
                        {item.date}
                      </div>
                      <div className="sbi-outreach-content">{item.content}</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="sbi-outreach-zigzag-details">
                      <div className="sbi-outreach-date">
                        <FaCalendarAlt className="sbi-calendar-icon" />
                        {item.date}
                      </div>
                      <div className="sbi-outreach-content">{item.content}</div>
                    </div>
                    <div className="sbi-outreach-imgwrap">
                      <img src={item.image} alt={item.content} />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
