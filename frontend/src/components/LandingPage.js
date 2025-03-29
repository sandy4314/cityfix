import React from 'react';
import { Link } from 'react-router-dom';
import cityBg from './assets/city-bg.jpg'; // Double-check this path
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div
      className="landingpage"
      style={{
        backgroundImage: `url(${cityBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#000000', // Explicit fallback
      }}
    >
      <nav className="nav-buttons">
        <Link to="/login">
          <button>Sign In</button>
        </Link>
        <Link to="/signup">
          <button>Sign Up</button>
        </Link>
      </nav>
      <div className="main">
        <div className="main-head">CityFix</div>
        <div className="subhead">
          <span>Report</span> <span>Resolve</span> <span>Relax!</span>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;