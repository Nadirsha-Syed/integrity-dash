import React, { useState } from 'react';
import { useTimer } from '../../hooks/useTimer';
import { useTodos } from '../../hooks/useTodos';
import './Stopwatch.css';

const Stopwatch = () => {
  const { todos, toggleTodo } = useTodos();
  const [selectedId, setSelectedId] = useState('');

  // The logic that runs when timer hits 0
  const handleTimerEnd = () => {
    if (selectedId) {
      toggleTodo(selectedId); // This 'ticks' the task in your TodoList
      setSelectedId('');      // Clears selection
      alert("Session Complete! Task updated.");
    }
  };

  const { timeLeft, isActive, startTimer, pauseTimer, resetTimer } = useTimer(handleTimerEnd);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    /* This 'module-card' class gives it the separate tab/card look */
    <div className="module-card ft-card">
      <h2 className="st-title">Focus Timer</h2>

      <div className="ft-select-container">
        <select 
          className="ft-dropdown"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          disabled={isActive}
        >
          <option value="">Select task to work on...</option>
          {todos && todos.filter(t => !t.completed).map(t => (
            <option key={t.id} value={t.id}>{t.text}</option>
          ))}
        </select>
      </div>

      <div className="ft-presets">
        {[15, 30, 45, 60].map(mins => (
          <button key={mins} onClick={() => resetTimer(mins)} className="ft-pill">
            {mins}m
          </button>
        ))}
      </div>

      <div className="ft-time-display">{formatTime(timeLeft)}</div>

      <div className="ft-actions">
        <button 
          onClick={startTimer} 
          className="ft-btn-primary"
          disabled={isActive || !selectedId}
        >
          {selectedId ? (isActive ? "Running..." : "Start Focus") : "Select Task"}
        </button>
        <button onClick={pauseTimer} className="ft-btn-outline">Pause</button>
      </div>
    </div>
  );
};

export default Stopwatch;