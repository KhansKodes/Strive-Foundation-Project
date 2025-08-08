import React from "react";
import { useParams, Link } from "react-router-dom";
import "./EventDetailPage.css";

// Dummy event data (add/adjust as needed)
const EVENTS = [
  {
    id: 1,
    title: "Events2",
    shortDesc: "A landmark event that empowered 300+ participants to take part in the disability inclusion movement.",
    date: "10 FEB 2011",
    heroImage: "https://picsum.photos/id/1018/1200/420", // background for hero
    images: [
      "https://picsum.photos/id/1018/600/340",
      "https://picsum.photos/id/1018/600/340",
      "https://picsum.photos/id/1018/600/340",
      "https://picsum.photos/id/1018/600/340",
    ],
    description: `This is the detailed description for Events2. 
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
      Vivamus scelerisque pharetra massa, eu efficitur lectus. 
      Duis pharetra, ex a dictum placerat, quam lacus posuere eros, a placerat purus eros eget elit.`,
    highlights: [
      "Over 300 participants",
      "Keynote by Dr. John Doe",
      "Major media coverage",
    ]
  },
  {
    id: 2,
    title: "Events3",
    shortDesc: "Launching a new wave of awareness across the country, this event brought together key leaders.",
    date: "12 JUN 2012",
    heroImage: "https://picsum.photos/id/1024/1200/420",
    images: [
      "https://picsum.photos/id/1018/600/340",
      "https://picsum.photos/id/1018/600/340",
      "https://picsum.photos/id/1018/600/340",
      "https://picsum.photos/id/1018/600/340",
    ],
    description: `Details for Events3 with some amazing outcomes. 
      Pellentesque euismod, nisi vel tincidunt porta, sapien quam egestas enim, nec cursus felis.`,
    highlights: [
      "Launched new disability awareness campaign",
      "Government officials attended",
    ]
  },
  {
    id: 3,
    title: "Events4",
    shortDesc: "A milestone collaboration event that helped scale the Strive vision.",
    date: "05 SEP 2013",
    heroImage: "https://picsum.photos/id/1025/1200/420",
    images: [
      "https://picsum.photos/id/1025/600/340",
      "https://picsum.photos/id/1032/550/330",
    ],
    description: `This is the story of Events4. 
      A wonderful experience with the Strive team and partners.`,
    highlights: [
      "Partnered with 4 local NGOs",
      "Featured in Dawn News",
    ]
  },
];

export default function EventDetailPage() {
  const { id } = useParams();
  const event = EVENTS.find(ev => ev.id === Number(id));
  const bgOpacity = 0.53; // <-- adjust this value for black filter opacity

  if (!event) return (
    <div className="EventDetailPage">
      <div className="EventDetailPage-inner">
        <h2>Event not found</h2>
        <Link to="/our-legacy" className="back-link">Back to Our Legacy</Link>
      </div>
    </div>
  );

  return (
    <div className="EventDetailPage">
      {/* HERO SECTION */}
      <section
        className="EventDetailPage-hero"
        style={{
          backgroundImage: `url(${event.heroImage})`,
          "--event-hero-opacity": bgOpacity
        }}
      >
        <div className="EventDetailPage-hero-filter" />
        <div className="EventDetailPage-hero-content">
          <div className="event-title-main">{event.title}</div>
          <div className="event-short-desc">{event.shortDesc}</div>
          <div className="event-date-main">{event.date}</div>
        </div>
      </section>
      
      {/* MAIN CONTENT */}
      <div className="EventDetailPage-inner">
        <Link to="/our-legacy" className="back-link">← Back to Our Legacy</Link>
        <div className="event-images">
          {event.images.map((img, i) => (
            <img key={i} src={img} alt={`event ${event.title}`} className="event-image" />
          ))}
        </div>
        <div className="event-description">
          <p>{event.description}</p>
          <ul>
            {event.highlights.map((hl, idx) => (
              <li key={idx}>{hl}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
