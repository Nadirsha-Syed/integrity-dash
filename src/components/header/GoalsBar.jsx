import React, { useState, useEffect } from 'react';
import { db } from '../../firebase'; // Fixed: Changed from '../../firebase/config'
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import './GoalsBar.css';

const GoalsBar = ({ user }) => {
  const [goals, setGoals] = useState({ yearly: '', monthly: '', weekly: '' });

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, 'goals', user.uid), (doc) => {
      if (doc.exists()) setGoals(doc.data());
    });
    return unsub;
  }, [user]);

  const handleChange = (type, value) => {
    const newGoals = { ...goals, [type]: value };
    setGoals(newGoals);
    setDoc(doc(db, 'goals', user.uid), newGoals); // Auto-saves as you type
  };

  return (
    <div className="goals-container">
      {['yearly', 'monthly', 'weekly'].map((type) => (
        <div key={type} className="goal-card">
          <label className="goal-label">{type.toUpperCase()} FOCUS</label>
          <input
            className="goal-input"
            placeholder={`Set ${type} goal...`}
            value={goals[type]}
            onChange={(e) => handleChange(type, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
};

export default GoalsBar;