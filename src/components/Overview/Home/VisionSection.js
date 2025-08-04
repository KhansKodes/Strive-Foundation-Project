import React from 'react';
import './VisionSection.css';

export default function VisionSection() {
  const text = 'Re‑discovering a world where every ailment is curable';
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
