import React from 'react';
import './NewsSection.css';

export default function NewsSection() {
  const upcomingVideo = 'VIDEO_ID_1';   // ← swap in your real YouTube IDs
  const legacyVideo   = 'VIDEO_ID_2';

  const latestNewsParagraphs = [
    `Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur iste inventore a aliquam beatae, 
     molestiae voluptas quas velit eos, nisi officiis neque alias minima, consequuntur saepe maxime labore eligendi error delectus.`,
    `Voluptates ab suscipit laudantium tempore a, expedita ipsam officiis, veniam, corrupti in quidem omnis 
     beatae harum? Unde ipsam ab doloribus, atque labore laborum iusto nesciunt.Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur iste inventore a aliquam beatae, 
     molestiae voluptas quas velit eos, nisi officiis neque alias minima, consequuntur saepe maxime labore eligendi error delectus.`,
    `Voluptates ab suscipit laudantium tempore a, expedita ipsam officiis, veniam, corrupti in quidem omnis 
     beatae harum? Unde ipsam ab doloribus, atque labore laborum iusto nesciunt.Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur iste inventore a aliquam beatae, 
     molestiae voluptas quas velit `
  ];

  return (
    <section className="NewsSection">
      {/* LEFT SIDE: two rows */}
      <div className="NewsSection__left-col">
        {/* Top row: Upcoming + Legacy */}
        <div className="NewsSection__top-row">
          <article className="NewsSection__card NewsSection__upcoming-events">
            <div className="NewsSection__header">Success Story</div>
            <div className="NewsSection__content">
              <div className="NewsSection__video-wrapper">
                <iframe
                  src={`https://www.youtube.com/embed/${upcomingVideo}`}
                  title="Upcoming Events"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <p className='para1'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Numquam, odio omnis. Temporibus id
                aliquam officia voluptas consequatur reiciendis maxime facilis, at vero repudiandae accusantium.
              </p>
            </div>
          </article>

          <article className="NewsSection__card NewsSection__our-legacy">
            <div className="NewsSection__header">Our Legacy</div>
            <div className="NewsSection__content">
              <div className="NewsSection__video-wrapper">
                <iframe
                  src={`https://www.youtube.com/embed/${legacyVideo}`}
                  title="Our Legacy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <p>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Numquam, odio omnis. Temporibus id
                aliquam officia voluptas consequatur reiciendis maxime facilis, at vero repudiandae accusantium.
              </p>
            </div>
          </article>
        </div>

        {/* Bottom row: Success Story */}
        <div className="NewsSection__bottom-row">
          <article className="NewsSection__card NewsSection__success-story">
            <div className="NewsSection__header">CEO Video || Upcoming Events || What Needed</div>
            <div className="NewsSection__success-content">
              <img
                src="https://picsum.photos/seed/success/600/400"
                alt="Success Story"
              />
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae alias harum nobis
                assumenda unde quam repellat illum, ipsum doloribus molestiae magni.
              </p>
            </div>
          </article>
        </div>
      </div>

      {/* RIGHT SIDE: Latest News (tall) */}
      <div className="NewsSection__right-col">
        <article className="NewsSection__card NewsSection__latest-news">
          <div className="NewsSection__header">Latest News</div>
          <div className="NewsSection__content NewsSection__content-News">
            {/* {latestNewsParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))} */}
            <div className='content1'>
              <img src="https://picsum.photos/seed/news/100/100" alt="News" />
              <div className='content1-1'>
              <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Numquam, odio omnis. Temporibus id
                aliquam officia voluptas consequatur reiciendis maxime facilis,</p>
              </div>
            </div>
            <div className='content2'>
              <img src="https://picsum.photos/seed/news/100/100" alt="News" />
                            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Numquam, odio omnis. Temporibus id
                aliquam officia voluptas consequatur reiciendis maxime facilis,</p>
            </div>
            <div className='content3'>
              <img src="https://picsum.photos/seed/news/100/100" alt="News" />
                            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Numquam, odio omnis. Temporibus id
                aliquam officia voluptas consequatur reiciendis maxime facilis,</p>
            </div>
            <div className='content3'>
              <img src="https://picsum.photos/seed/news/100/100" alt="News" />
                            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Numquam, odio omnis. Temporibus id
                aliquam officia voluptas consequatur reiciendis maxime facilis,</p>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
