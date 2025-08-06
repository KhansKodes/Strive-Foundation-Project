import React, { useState } from "react";
import "./BeyondSMAPage.css";

const optionData = [
  {
    label: "Neurological disorders",
    image: "https://picsum.photos/id/237/430/340",
    content: (
      <div>
        <h2>Neurological Disorders</h2>
        <br></br>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris non bibendum purus. Pellentesque euismod, urna eu tincidunt consectetur, nisi nisl dictum erat, eget viverra massa nisi at velit.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris non bibendum purus. Pellentesque euismod, urna eu tincidunt consectetur, nisi nisl dictum erat, eget viverra massa nisi at velit.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris non bibendum purus. Pellentesque euismod, urna eu tincidunt consectetur, nisi nisl dictum erat, eget viverra massa nisi at velit.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris non bibendum purus. Pellentesque euismod, urna eu tincidunt consectetur, nisi nisl dictum erat, eget viverra massa nisi at velit.
          <br></br>
          <br></br>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris non bibendum purus. Pellentesque euismod, urna eu tincidunt consectetur, nisi nisl dictum erat, eget viverra massa nisi at velit.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris non bibendum purus. Pellentesque euismod, urna eu tincidunt consectetur, nisi nisl dictum erat, eget viverra massa nisi at velit.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris non bibendum purus. Pellentesque euismod, urna eu tincidunt consectetur, nisi nisl dictum erat, eget viverra massa nisi at velit.
        </p>
      </div>
    ),
  },
  {
    label: "Artificial Intelligence",
    image: "https://picsum.photos/id/1025/430/340",
    content: (
      <div>
        <h2>Artificial Intelligence</h2>
        <br></br>

        <p>
          AI is transforming lives for people with disabilities. Suspendisse potenti. Proin fermentum velit at metus porttitor laoreet.
          AI is transforming lives for people with disabilities. Suspendisse potenti. Proin fermentum velit at metus porttitor laoreet.
          AI is transforming lives for people with disabilities. Suspendisse potenti. Proin fermentum velit at metus porttitor laoreet.
          <br></br>
          <br></br>
          AI is transforming lives for people with disabilities. Suspendisse potenti. Proin fermentum velit at metus porttitor laoreet.
          AI is transforming lives for people with disabilities. Suspendisse potenti. Proin fermentum velit at metus porttitor laoreet.
          AI is transforming lives for people with disabilities. Suspendisse potenti. Proin fermentum velit at metus porttitor laoreet.
          AI is transforming lives for people with disabilities. Suspendisse potenti. Proin fermentum velit at metus porttitor laoreet.
        </p>
      </div>
    ),
  },
  {
    label: "VIS program",
    image: "https://picsum.photos/id/1005/430/340",
    content: (
      <div>
        <h2>Volunteers in Service Program</h2>
        <br></br>

        <p>
          Our volunteer network supports community outreach and program delivery. Quisque luctus sapien id risus pulvinar, at rutrum erat ultricies.
          Our volunteer network supports community outreach and program delivery. Quisque luctus sapien id risus pulvinar, at rutrum erat ultricies.
          Our volunteer network supports community outreach and program delivery. Quisque luctus sapien id risus pulvinar, at rutrum erat ultricies.
          Our volunteer network supports community outreach and program delivery. Quisque luctus sapien id risus pulvinar, at rutrum erat ultricies.
          <br></br>
          <br></br>
          Our volunteer network supports community outreach and program delivery. Quisque luctus sapien id risus pulvinar, at rutrum erat ultricies.
          Our volunteer network supports community outreach and program delivery. Quisque luctus sapien id risus pulvinar, at rutrum erat ultricies.
          Our volunteer network supports community outreach and program delivery. Quisque luctus sapien id risus pulvinar, at rutrum erat ultricies.
        </p>
      </div>
    ),
  },
];

export default function BeyondSMAPage() {
  const [selected, setSelected] = useState(0);

  return (
    <div className="beyond-sma-main">
        <div className="beyond-sma-root">
        {/* Background */}
        <div className="beyond-sma-hero-bg" />
        <div className="beyond-sma-hero-overlay" />

        {/* Main Hero Section */}
        <div className="beyond-sma-hero-container">
            <div className="beyond-sma-hero-flex">
            <div className="beyond-sma-image-box">
                <img src={optionData[selected].image} alt={optionData[selected].label} />
            </div>
            <div className="beyond-sma-options">
                {optionData.map((opt, idx) => (
                <button
                    key={opt.label}
                    className={`beyond-sma-menu-btn${selected === idx ? " active" : ""}`}
                    onClick={() => setSelected(idx)}
                    tabIndex={0}
                >
                    {opt.label}
                </button>
                ))}
            </div>
            </div>
        </div>
        </div>
    
        {/* Content Area BELOW hero section */}
        <div className="beyond-sma-content-container">
            <div className="beyond-sma-content">
            {optionData[selected].content}
            </div>
        </div>
    </div>
  );
}
