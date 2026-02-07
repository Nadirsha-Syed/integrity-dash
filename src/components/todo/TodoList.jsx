import React, { useState } from 'react';
import { useTodos } from '../../hooks/useTodos';
import { formatRelativeDate } from '../../utils/dateUtils';
import './Todo.css';

const TodoList = () => {
  const { todos, addTodo, toggleTodo, deleteTodo } = useTodos();
  const [text, setText] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    addTodo(text, deadline);
    setText('');
    setDeadline('');
  };

  return (
    <div className="module-card">
      <div className="module-header">
        <h2>Execution: Tasks</h2>
      </div>

      <form className="todo-form" onSubmit={handleSubmit}>
        <input 
          className="main-input"
          type="text"
          placeholder="What needs to be done?" 
          value={text} 
          onChange={e => setText(e.target.value)} 
        />
        <div className="input-group-row">
          {/* CRITICAL FIX: Adding onClick to ensure the picker opens on all browsers */}
          <input 
            type="datetime-local" 
            className="date-input"
            value={deadline} 
            onChange={e => setDeadline(e.target.value)}
            onClick={(e) => e.target.showPicker && e.target.showPicker()} // Programmatically triggers the calendar
          />
          <button type="submit" className="btn-add">Add Task</button>
        </div>
      </form>

      <div className="scroll-section">
        {todos.map(t => (
          <div key={t.id} className="todo-row">
            <div className="todo-left">
              <label className="custom-checkbox">
                <input 
                  type="checkbox" 
                  checked={t.completed} 
                  onChange={() => toggleTodo(t.id)} 
                />
                <span className="checkmark"></span>
              </label>
              <div className="todo-info">
                <span className={`todo-text ${t.completed ? 'completed' : ''}`}>
                  {t.text}
                </span>
                {t.deadline && (
                  <span className="todo-date-tag">
                    {formatRelativeDate(t.deadline)}
                  </span>
                )}
              </div>
            </div>
            <button className="delete-icon-btn" onClick={() => deleteTodo(t.id)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoList;