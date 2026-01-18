import React, { useState } from 'react';
import { useBuddy } from '../../hooks/useBuddy';
import './Coach.css';

const CoachCorner = ({ habits, notes, tasks }) => {
  const { advice, chatWithBuddy, loading } = useBuddy();
  const [userInput, setUserInput] = useState('');

  const handleAsk = () => {
    chatWithBuddy(userInput, habits, notes, tasks);
    setUserInput('');
  };

  return (
    <div className="module-card coach-card">
      <div className="coach-header">
        <div className={`status-dot ${loading ? 'pulse' : ''}`}></div>
        <h3>Integrity Buddy</h3>
      </div>
      
      <div className="coach-body">
        <p className="coach-advice">
          {loading ? "Analyzing..." : advice}
        </p>
      </div>

      <div className="buddy-input-row">
        <input 
          type="text" 
          className="st-buddy-input" 
          placeholder="Ask a question..." 
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
        />
        <button className="btn-send-buddy" onClick={handleAsk} disabled={loading}>
          {loading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default CoachCorner;