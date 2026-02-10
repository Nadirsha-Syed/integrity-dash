import React, { useState, useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme'; 
import { auth } from '../../firebase'; 
import { signOut } from 'firebase/auth';
import './Header.css';

const DashboardHeader = ({ user }) => {
  const [time, setTime] = useState(new Date());
  const { theme, toggleTheme } = useTheme(); 

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="dashboard-header">
      {/* Top row for utility controls */}
      <div className="status-bar">
        <button onClick={toggleTheme} className="theme-toggle-pill">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        
        <div className="date-display">
          {time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase()}
        </div>

        <div className="user-controls">
          <span className="user-name">
            {user?.displayName?.split(' ')[0] || 'User'}
          </span>
          <button onClick={handleLogout} className="logout-pill">
            LOGOUT
          </button>
        </div>
      </div>

      {/* Hero Time Display - Centerpiece */}
      <div className="hero-time">
        <h1 className="time-display">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </h1>
        <p className="time-period">
          {time.toLocaleTimeString([], { hour: '2-digit', hour12: true }).split(' ')[1]}
        </p>
      </div>
    </header>
  );
};

export default DashboardHeader;