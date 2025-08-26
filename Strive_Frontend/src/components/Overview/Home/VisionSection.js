import React, { useEffect, useState } from 'react';
import './VisionSection.css';
import api from '../../../services/api'; // your existing axios instance

export default function VisionSection() {
  // keep your original copy as visual fallback (note the same “re-” hyphen)
  const [text, setText] = useState('Re-discovering a world where every ailment is curable');

  // Build an absolute URL that works whether api.defaults.baseURL has /api or not.
  const buildUrl = (path) => {
    const base = api.defaults?.baseURL;
    if (base) {
      const baseFixed = base.endsWith('/') ? base : `${base}/`;
      const cleanPath = path.startsWith('/') ? path.slice(1) : path;
      return new URL(cleanPath, baseFixed).toString(); // absolute
    }
    // no baseURL set → default to current origin + /api
    return new URL(`/api${path}`, window.location.origin).toString();
  };

  useEffect(() => {
    let mounted = true;

    (async () => {
      // 1) Preferred: /api/straplines/latest/ → { text: "..."}
      try {
        const urlLatest = buildUrl('/straplines/latest/');
        const { data } = await api.get(urlLatest);
        const latest =
          (typeof data === 'string' && data) ||
          (data && typeof data.text === 'string' && data.text);
        if (mounted && latest && latest.trim()) {
          setText(latest.trim());
          return;
        }
      } catch (e) {
        // console.debug('strapline latest failed', e);
      }

      // 2) Fallback: /api/straplines/ → array
      try {
        const urlList = buildUrl('/straplines/');
        const { data } = await api.get(urlList);
        const rows = Array.isArray(data) ? data : (data && data.results) ? data.results : [];
        if (rows.length) {
          const active = rows.filter((r) => r?.is_active);
          active.sort((a, b) => (a?.priority ?? 0) - (b?.priority ?? 0));
          const chosen = active[0] || rows[0];
          if (mounted && chosen?.text) {
            setText(String(chosen.text).trim());
          }
        }
      } catch (e) {
        // console.debug('strapline list failed', e);
      }
    })();

    return () => { mounted = false; };
  }, []); // run once

  return (
    <div className='vision-main'>
      {/* <div className='legs'>
        <div className='sub-leg'></div>
        <div className='sub-leg'></div>
      </div> */}
      <section className="VisionSection">
        <div className="marquee">
          <span>{text}</span>
        </div>
      </section>
      {/* <div className='legs'>
        <div className='sub-leg'></div>
        <div className='sub-leg'></div>
      </div> */}
    </div>
  );
}
