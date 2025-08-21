import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './EventDetailPage.css';
import { fetchEventDetail } from '../../../services/legacyService';

function FmtDate({ d }) {
  if (!d) return null;
  const date = new Date(d);
  const day = String(date.getDate()).padStart(2, '0');
  const mon = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  const yr  = date.getFullYear();
  return <>{`${day} ${mon} ${yr}`}</>;
}

export default function EventDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetchEventDetail(id);
        if (mounted) setData(res);
      } catch (e) {
        console.error('Event detail error:', e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  return (
    <div className="EventDetailPage">
      <div className="event-detail-container">
        <Link to="/our-legacy" className="back-link">← Back to Our Legacy</Link>

        {loading && <div className="event-skeleton">Loading…</div>}

        {!loading && data && (
          <>
            <h1 className="event-title">{data.title}</h1>
            <div className="event-date"><FmtDate d={data.date} /></div>

            {data.hero_image_url && (
              <div className="event-hero">
                <img src={data.hero_image_url} alt="" />
              </div>
            )}

            {data.description_html && (
              <div
                className="event-description"
                dangerouslySetInnerHTML={{ __html: data.description_html }}
              />
            )}

            {Array.isArray(data.gallery) && data.gallery.length > 0 && (
              <div className="event-gallery">
                {data.gallery.map((src, i) => (
                  <img key={i} src={src} alt="" className="event-gallery-img" />
                ))}
              </div>
            )}

            {data.external_url && (
              <a className="event-external-link" href={data.external_url} target="_blank" rel="noreferrer">
                View External Link
              </a>
            )}
          </>
        )}

        {!loading && !data && (
          <div className="event-error">Event not found.</div>
        )}
      </div>
    </div>
  );
}
