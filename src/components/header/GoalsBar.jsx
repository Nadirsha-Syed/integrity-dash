import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import './GoalsBar.css';

const GoalsBar = ({ user }) => {
  const [goals, setGoals] = useState({ yearly: [], monthly: [], weekly: [] });

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, 'goals', user.uid), (doc) => {
      if (doc.exists()) setGoals(doc.data());
    });
    return unsub;
  }, [user]);

  const toggleGoal = async (category, index) => {
    const updatedCategory = [...(goals[category] || [])];
    updatedCategory[index].completed = !updatedCategory[index].completed;
    const newGoals = { ...goals, [category]: updatedCategory };
    setGoals(newGoals);
    await setDoc(doc(db, 'goals', user.uid), newGoals);
  };

  const addGoal = async (category) => {
    const text = prompt(`Add a new ${category} focus:`);
    if (!text || text.trim() === "") return;
    const newGoals = { 
      ...goals, 
      [category]: [...(goals[category] || []), { text, completed: false }] 
    };
    setGoals(newGoals);
    await setDoc(doc(db, 'goals', user.uid), newGoals);
  };

  // NEW: Delete Function
  const deleteGoal = async (category, index) => {
    const updatedCategory = goals[category].filter((_, i) => i !== index);
    const newGoals = { ...goals, [category]: updatedCategory };
    setGoals(newGoals);
    await setDoc(doc(db, 'goals', user.uid), newGoals);
  };

  return (
    <div className="goals-container">
      {['yearly', 'monthly', 'weekly'].map((cat) => (
        <div key={cat} className="goal-card">
          <div className="goal-card-header">
            <span className="goal-label">{cat.toUpperCase()} FOCUS</span>
            <button onClick={() => addGoal(cat)} className="add-goal-btn">+</button>
          </div>
          <div className="goal-list">
            {(goals[cat] || []).map((goal, idx) => (
              <div key={idx} className={`goal-item ${goal.completed ? 'done' : ''}`}>
                <input 
                  type="checkbox" 
                  checked={goal.completed} 
                  onChange={() => toggleGoal(cat, idx)} 
                />
                <span className="goal-text">{goal.text}</span>
                {/* NEW: Trash icon appears on hover */}
                <button 
                  className="delete-goal-btn" 
                  onClick={() => deleteGoal(cat, idx)}
                  aria-label="Delete goal"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GoalsBar;