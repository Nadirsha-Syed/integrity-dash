import React, { useState, useEffect } from 'react';
import { db } from '../../firebase'; 
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

  const handleChange = async (type, value) => {
    // Update local state immediately for smooth typing
    const newGoals = { ...goals, [type]: value };
    setGoals(newGoals);

    // Save to Firestore
    try {
      await setDoc(doc(db, 'goals', user.uid), newGoals);
    } catch (error) {
      console.error("Firestore Save Error:", error);
    }
  };

  return (
    <div className="goals-container">
      {['yearly', 'monthly', 'weekly'].map((type) => (
        <div key={type} className="goal-card">
          <label className="goal-label">{type.toUpperCase()} FOCUS</label>
          <textarea
            className="goal-input list-mode"
            placeholder={`• Goal 1\n• Goal 2...`}
            value={goals[type] || ''}
            onChange={(e) => handleChange(type, e.target.value)}
            spellCheck="false"
          />
        </div>
      ))}
    </div>
  );
};

export default GoalsBar;