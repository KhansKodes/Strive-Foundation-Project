import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './EventDetailPage.css';
import api from '../../../services/api';
import { fetchEventDetail } from '../../../services/legacyService';

/* --- utilities that match your UI text format --- */
function FmtDate({ d }) {
  if (!d) return null;
  const date = new Date(d);
  const day = String(date.getDate()).padStart(2, '0');
  const mon = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  const yr = date.getFullYear();
  return <>{`${day} ${mon} ${yr}`}</>;
}

// Plain-text snippet for the hero subtitle
function htmlSnippet(html, n = 120) {
  if (!html) return '';
  const txt = String(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return txt.length > n ? `${txt.slice(0, n - 1)}…` : txt;
}

// Normalize backend to the shape this component renders
function normalizeDetail(raw) {
  if (!raw) return null;

  // If service already normalized, use as-is
  if ('title' in raw || 'hero_image_url' in raw || 'description_html' in raw) return raw;

  const gallery = Array.isArray(raw.gallery)
    ? raw.gallery
        .slice()
        .sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0))
        .map(g => g.image)
    : [];

  return {
    title: raw.event_title ?? raw.title ?? '',
    date: raw.event_date ?? raw.date ?? '',
    hero_image_url: raw.hero_image ?? raw.hero_image_url ?? null,
    description_html: raw.description ?? raw.description_html ?? '',
    gallery,
    external_url: raw.external_url ?? null,
  };
}

export default function EventDetailPage() {
  const { id, slug } = useParams(); // supports /our-legacy/event/:id and /our-legacy/event/slug/:slug
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        let res;
        if (slug) {
          const { data } = await api.get(`/legacy/events/slug/${slug}/detail/`);
          res = data;
        } else {
          res = await fetchEventDetail(id);
        }

        if (res && res.detail === 'No detail found for this event.') {
          if (mounted) { setData(null); setNotFound(true); }
        } else {
          const normalized = normalizeDetail(res);
          if (mounted) { setData(normalized); setNotFound(false); }
        }
      } catch (e) {
        console.error('Event detail error:', e);
        if (mounted) { setData(null); setNotFound(true); }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [id, slug]);

  // Values used by the hero area; match your CSS exactly
  const heroImage = data?.hero_image_url || 'https://placehold.co/1600x420?text=Event';
  const shortDesc = useMemo(() => htmlSnippet(data?.description_html, 120), [data]);
  const heroOverlayOpacity = 0.53; // matches --event-hero-opacity default in your CSS

  return (
    <div className="EventDetailPage">
      {/* ===== HERO (matches your CSS structure & classes) ===== */}
      <section
        className="EventDetailPage-hero"
        style={{ backgroundImage: `url(${loading || notFound ? 'https://placehold.co/1600x420?text=Loading' : heroImage})` }}
      >
        <div
          className="EventDetailPage-hero-filter"
          style={{ '--event-hero-opacity': heroOverlayOpacity }}
        />
        <div className="EventDetailPage-hero-content">
          <h1 className="event-title-main">
            {loading ? 'Loading…' : (notFound ? 'Event' : data?.title)}
          </h1>
          <div className="event-short-desc">
            {loading ? 'Please wait' : (notFound ? 'No detail found' : shortDesc)}
          </div>
          <div className="event-date-main">
            {loading || notFound ? '—' : <FmtDate d={data?.date} />}
          </div>
        </div>
      </section>

      {/* ===== WHITE CARD CONTENT (uses your classes exactly) ===== */}
      <div className="EventDetailPage-inner">
        <Link to="/legacy" className="back-link">← Back to Our Legacy</Link>

        {/* Content states */}
        {loading && <div className="event-description">Loading…</div>}

        {!loading && notFound && (
          <div className="event-description">Event not found.</div>
        )}

        {!loading && !notFound && data && (
          <>
            {/* Gallery row (flex wrap per your CSS) */}
            {Array.isArray(data.gallery) && data.gallery.length > 0 && (
              <div className="event-images">
                {data.gallery.map((src, i) => (
                  <img key={i} src={src} alt="" className="event-image" />
                ))}
              </div>
            )}

            {/* Rich description */}
            {data.description_html && (
              <div
                className="event-description"
                dangerouslySetInnerHTML={{ __html: data.description_html }}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
