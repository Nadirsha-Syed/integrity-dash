import React, { useState, useEffect } from 'react';
import './Quote.css';

const QuoteHeader = () => {
  const [quote, setQuote] = useState("Focus on the process, not the outcome.");
  const [isEditing, setIsEditing] = useState(false);
  const [tempQuote, setTempQuote] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchApiQuote = async () => {
    setLoading(true);
    try {
      // Fetching motivational quotes specifically
      const response = await fetch('https://api.quotable.io/random?tags=motivational|wisdom');
      if (!response.ok) throw new Error('API limit reached');
      const data = await response.json();
      const formattedQuote = `${data.content} — ${data.author}`;
      setQuote(formattedQuote);
      localStorage.setItem('quote_date', new Date().toDateString());
    } catch (error) {
      // Fallback if API fails
      setQuote("Discipline is choosing between what you want now and what you want most.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedQuote = localStorage.getItem('user_quote');
    const lastDate = localStorage.getItem('quote_date');
    const today = new Date().toDateString();

    // 1. If user has a custom manual quote, use it.
    if (savedQuote) {
      setQuote(savedQuote);
    } 
    // 2. If it's a new day and no manual quote is set, fetch from API.
    else if (today !== lastDate) {
      fetchApiQuote();
    }
  }, []);

  const handleSave = () => {
    setQuote(tempQuote);
    localStorage.setItem('user_quote', tempQuote);
    setIsEditing(false);
  };

  const clearManualOverride = () => {
    localStorage.removeItem('user_quote');
    fetchApiQuote();
  };

  return (
    <div className="quote-container">
      {isEditing ? (
        <div className="quote-edit-group">
          <input 
            className="quote-input" 
            value={tempQuote} 
            onChange={(e) => setTempQuote(e.target.value)}
            autoFocus 
          />
          <button onClick={handleSave} className="btn-quote-save">Save</button>
          <button onClick={() => setIsEditing(false)} className="btn-quote-cancel">×</button>
        </div>
      ) : (
        <div className="quote-display-group">
          <h1 className={`main-quote ${loading ? 'blur' : ''}`}>
            “{quote}”
          </h1>
          <div className="quote-controls">
            <button 
              className="btn-edit-quote" 
              onClick={() => { setTempQuote(quote); setIsEditing(true); }}
              title="Edit Quote"
            >
              ✎
            </button>
            <button 
              className="btn-edit-quote" 
              onClick={clearManualOverride}
              title="Reset to Daily API Quote"
            >
              ⟳
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuoteHeader;