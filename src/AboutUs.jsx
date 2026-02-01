import React from 'react';
import './AboutUs.css';

export default function AboutUs({ onBack }) {
  return (
    <div className="about-us-page">
      <div className="about-us-container">
        <button className="back-to-map-btn" onClick={onBack}>
          Back To Map
        </button>
        
        <div className="about-us-logo">
          <img src="/emerald-path-logo.svg" alt="Emerald Path Logo" className="logo-image" />
        </div>

        <div className="about-us-content">
          <svg 
            id="yellow-path-svg"
            className="yellow-path" 
            viewBox="-15 -5 500 1320" 
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              id="yellow-path-curve"
              d="M246.813 2.1084C285.455 26.7281 448.241 70.286 363.633 280.5C279.025 490.715 -7.5638 603.239 2.77256 806.983C13.1089 1010.73 470.832 1283.59 466.469 1310.11"
              stroke="#FFD700"
              strokeWidth="22"
              fill="none"
              strokeLinecap="square"
              strokeLinejoin="miter"
              strokeDasharray="30 4"
            />
            <image
              href="/Untitled_Artwork_5_1-removebg-preview.png"
              x="146.813"
              y="-150"
              width="200"
              height="200"
              className="red-shoes"
            />
            <image
              href="/emerald-castle.svg"
              x="266.469"
              y="1130.11"
              width="400"
              height="400"
              className="emerald-castle"
            />
          </svg>

          <div className="section what-section">
            <h2 className="section-heading">WHAT</h2>
            <div className="section-content">
              <div className="text-box">
                <p>
                  For many, a sidewalk isn't just a path—it's a series of unpredictable obstacles. 
                  Currently, navigation tools <strong>lack the 'intelligence' to identify physical barriers 
                  like steep inclines or broken pavement</strong>, leaving users with mobility aids to navigate blindly.
                </p>
              </div>
              <div className="character character-scarecrow">
                <img src="/scarecrow-character.svg" alt="Scarecrow" />
              </div>
            </div>
          </div>

          <div className="section why-section">
            <h2 className="section-heading">WHY</h2>
            <div className="section-content">
              <div className="character character-tinman">
                <img src="/tinman-character.svg" alt="Tin Man" />
              </div>
              <div className="text-box">
                <p>
                  We believe that mobility is a fundamental right, not a privilege. Our web app <strong>'oils the joints' of Boston city transit by generating highly customizable routes powered by extensive, high-fidelity datasets of path conditions</strong>, ensuring that no one is left stranded due to a lack of accessible information.
                </p>
              </div>
            </div>
          </div>

          <div className="section who-section">
            <h2 className="section-heading">WHO</h2>
            <div className="section-content">
              <div className="text-box">
                <p>
                  We are empowering the <strong>75,000+ of citizens and elders with disabilities</strong> who often face 
                  'concrete anxiety' when navigating new routes. By providing a clear, accessible optimal route, 
                  <strong> we give users the courage to explore their campus and city without fear of the unknown.</strong>
                </p>
              </div>
              <div className="character character-lion">
                <img src="/lion-character.svg" alt="Cowardly Lion" />
              </div>
            </div>
          </div>

          <h1 className="about-us-title">ABOUT THE TEAM</h1>

          <div className="bottom-circles">
            <a href="https://linkedin.com/in/ellen-wang-571a47381/" target="_blank" rel="noopener noreferrer" className="team-member">
              <div className="circle">
                <img src="/ellen.svg" alt="Ellen" />
              </div>
              <img src="/ellen-text.svg" alt="Ellen Wang" className="member-text" />
            </a>
            <a href="https://www.linkedin.com/in/hannahsong12" target="_blank" rel="noopener noreferrer" className="team-member">
              <div className="circle">
                <img src="/hannah.svg" alt="Hannah" />
              </div>
              <img src="/hannah-text.svg" alt="Hannah Song" className="member-text" />
            </a>
            <a href="https://www.linkedin.com/in/emilyxjia/" target="_blank" rel="noopener noreferrer" className="team-member">
              <div className="circle">
                <img src="/emily.svg" alt="Emily" />
              </div>
              <img src="/emily-text.svg" alt="Emily Jia" className="member-text" />
            </a>
          </div>

          <div className="footer-text">Made with a touch of Oz :)</div>
        </div>
      </div>
    </div>
  );
}
