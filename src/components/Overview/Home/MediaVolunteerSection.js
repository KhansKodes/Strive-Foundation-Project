import React from 'react';
import './MediaVolunteerSection.css';

export default function MediaVolunteerSection() {
  const mediaItems = [
    {
      id: 1,
      img: 'https://picsum.photos/id/1015/600/300',
      text: `Lorem ipsum dolor sit amet… Lorem ipsum dolor sit amet…Lorem ipsum dolor sit amet…Lorem ipsum dolor sit amet…`

    },
    {
      id: 2,
      img: 'https://picsum.photos/id/1011/600/300',
      text: `Lorem ipsum dolor sit amet… Lorem ipsum dolor sit amet…Lorem ipsum dolor sit amet…Lorem ipsum dolor sit amet…`
    }
  ];

  const volImgs = [
    'https://picsum.photos/id/1050/800/400',
    'https://picsum.photos/id/1024/800/400'
  ];

  const volText = `Lorem ipsum dolor sit amet… Lorem ipsum dolor sit amet…Lorem ipsum dolor sit amet…Lorem ipsum dolor sit amet… Lorem ipsum dolor sit amet… Lorem ipsum dolor sit amet…Lorem ipsum dolor sit amet…Lorem ipsum dolor sit amet…
  Lorem ipsum dolor sit amet… Lorem ipsum dolor sit amet…Lorem ipsum dolor si`;

  return (
    <section className="MVS">
      <div className="MVS__panel MVS__media">
        <h2 className="MVS__title">Media Coverage</h2>

        {/* top row: two images */}
        <div className="MVS__row MVS__row--images">
          {mediaItems.map(m => (
            <div key={m.id} className="MVS__card MVS__imgCard">
              <img src={m.img} alt="" />
            </div>
          ))}
        </div>

        {/* bottom row: two text cards */}
        <div className="MVS__row MVS__row--texts">
          {mediaItems.map(m => (
            <div key={m.id} className="MVS__card MVS__textCard">
              <p>{m.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="MVS__divider" />

      <div className="MVS__panel MVS__volunteer">
        <h2 className="MVS__title">Volunteers</h2>

        {/* top row: two images */}
        <div className="MVS__row MVS__row--images">
          {volImgs.map((src,i) => (
            <div key={i} className="MVS__card MVS__imgCard">
              <img src={src} alt="" />
            </div>
          ))}
        </div>

        {/* bottom row: one text card, pushed to bottom */}
        <div className="MVS__row MVS__row--texts MVS__row--volText">
          <div className="MVS__card MVS__textCard">
            <p>{volText}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
