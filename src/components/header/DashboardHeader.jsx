import React, { useState, useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme'; 
import { auth } from '../../firebase'; 
import { signOut } from 'firebase/auth';
import GoalsBar from './GoalsBar'; 
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

  // Dynamic Greeting based on current hour
  const getGreeting = () => {
    const hour = time.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <header className="dashboard-header">
      {/* 1. Status Bar: Utility Controls */}
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

      {/* 2. Hero Section: The Large Clock */}
      <div className="hero-time">
        <h1 className="time-display">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </h1>
        <p className="time-period">
          {time.toLocaleTimeString([], { hour: '2-digit', hour12: true }).split(' ')[1]}
        </p>
      </div>

      {/* 3. Quote & Greeting Section */}
      <div className="inspiration-zone">
        <h2 className="greeting-text">{getGreeting()}, {user?.displayName?.split(' ')[0] || 'User'}</h2>
        <p className="daily-quote">"Integrity is doing the right thing, even when no one is watching."</p>
      </div>

      {/* 4. Strategic Section: Now positioned below the quote */}
      <GoalsBar user={user} />
    </header>
  );
};

export default DashboardHeader;