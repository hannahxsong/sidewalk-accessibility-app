import React from 'react';
import './AboutUs.css';

export default function AboutUs({ onBack }) {
  return (
    <div className="about-us-page">
      <div className="about-us-container">
        <button className="back-to-map-btn" onClick={onBack}>
          Back To Map
        </button>
        
        <h1 className="about-us-title">ABOUT US</h1>
        
        <div className="about-us-logo">
          <div className="logo-circle">
            <div className="logo-girl">👧</div>
            <div className="logo-flower">🌸</div>
          </div>
          <div className="logo-banner">EMERALD PATH</div>
        </div>

        <div className="about-us-content">
          <svg className="yellow-path" viewBox="0 0 1000 1000" preserveAspectRatio="none">
            <path
              d="M 100 150 Q 200 200 300 250 Q 400 300 500 350 Q 600 400 700 450 Q 800 500 850 550"
              stroke="#FFD700"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <div className="section what-section">
            <h2 className="section-heading">WHAT</h2>
            <div className="section-content">
              <div className="text-box">
                <p>
                  For many, a sidewalk isn't just a path—it's a series of unpredictable obstacles. 
                  Currently, navigation tools lack the 'intelligence' to identify physical barriers 
                  like steep inclines or broken pavement, leaving users with mobility aids to navigate blindly.
                </p>
              </div>
              <div className="character character-lion">🦁</div>
            </div>
          </div>

          <div className="section why-section">
            <h2 className="section-heading">WHY</h2>
            <div className="section-content">
              <div className="character character-tinman">🤖</div>
              <div className="text-box">
                <p>
                  We believe that mobility is a fundamental right, not a privilege. Our app 'oils the joints' 
                  of Boston city transit by providing real-time, user-vetted data on path conditions, ensuring 
                  that no one is left stranded due to a lack of accessible information.
                </p>
              </div>
            </div>
          </div>

          <div className="section who-section">
            <h2 className="section-heading">WHO</h2>
            <div className="section-content">
              <div className="text-box">
                <p>
                  We are empowering the 75,000+ of citizens and elders with disabilities who often face 
                  'concrete anxiety' when navigating new routes. By providing a clear, accessible optimal route, 
                  we give users the courage to explore their campus and city without fear of the unknown.
                </p>
              </div>
              <div className="character character-scarecrow">🧙</div>
            </div>
          </div>

          <div className="bottom-circles">
            <div className="circle"></div>
            <div className="circle"></div>
            <div className="circle"></div>
          </div>

          <div className="footer-text">Made with a touch of Oz :)</div>
        </div>
      </div>
    </div>
  );
}
