import React, { useState } from 'react';
import { usePromises } from '../../hooks/usePromises';
import './Promises.css';

const PromiseList = () => {
  const { promises, addPromise, toggleDailyHabit, deleteHabit } = usePromises();
  const [text, setText] = useState('');
  const [reason, setReason] = useState('');

  // Standardized App Clock for consistency
  const todayStr = new Date().toDateString();

  const handleLock = () => {
    if (!text.trim()) return;
    addPromise(text, reason);
    setText(''); 
    setReason('');
  };

  return (
    <div className="module-card habit-container">
      <h2 className="st-title">Daily Commitments</h2>

      {/* YELLOW BOX: Optimized Entry Section */}
      <div className="habit-entry-card">
        <input 
          className="st-main-input" 
          placeholder="I promise to..." 
          value={text} 
          onChange={(e) => setText(e.target.value)} 
        />
        <textarea 
          className="st-reason-area" 
          placeholder="Why does this matter? (Deep reason)" 
          value={reason} 
          onChange={(e) => setReason(e.target.value)} 
        />
        <button className="st-btn-primary-full" onClick={handleLock}>
          Lock Daily Habit
        </button>
      </div>

      {/* GREEN BOX: Habit Rows with Persistent Integrity Records */}
      <div className="habit-list-scroll">
        {promises.map(p => {
          // Strict comparison using the standardized date string
          const isDone = p.lastCompletedDate === todayStr;
          
          return (
            <div key={p.id} className={`habit-card-item ${isDone ? 'habit-is-done' : ''}`}>
              <div className="habit-content">
                <label className="custom-checkbox">
                  <input 
                    type="checkbox" 
                    checked={isDone} 
                    onChange={() => toggleDailyHabit(p.id)} 
                  />
                  <span className="checkmark"></span>
                </label>
                <div className="habit-labels">
                  <h4 className={isDone ? 'strike-text' : ''}>{p.text}</h4>
                  <p className="reason-text">{p.reason}</p>
                  
                  {/* Permanent Accountability Record */}
                  <div className="broken-record-tag">
                    Promise broken: <span className="fail-val">{p.brokenCount || 0} times</span>
                  </div>
                </div>
              </div>

              <div className="habit-stats">
                <div className="streak-pill-box">
                  <span className="s-count">{p.streak}</span>
                  <span className="s-label">DAYS</span>
                </div>
                <button className="btn-close-dark" onClick={() => deleteHabit(p.id)}>×</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PromiseList;