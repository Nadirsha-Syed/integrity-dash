import React, { useState, useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme'; 
import { auth } from '../../firebase'; 
import { signOut } from 'firebase/auth';
import './header.css';

const DashboardHeader = ({ user }) => {
  const [time, setTime] = useState(new Date());
  const { theme, toggleTheme } = useTheme(); 

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth); // This triggers onAuthStateChanged in App.jsx
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="dashboard-header">
      <div className="status-bar">
        <button onClick={toggleTheme} className="theme-toggle-pill">
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        
        <div className="time-display">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        
        <div className="date-display">
          {time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase()}
        </div>

        {/* Safe User Display with Optional Chaining */}
        <div className="user-controls">
          <span className="user-name">
            {user?.displayName?.split(' ')[0] || 'User'}
          </span>
          <button onClick={handleLogout} className="logout-pill">
            LOGOUT
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;