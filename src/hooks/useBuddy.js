import { useState } from 'react';

export const useBuddy = () => {
  const [advice, setAdvice] = useState("Ask me about your streaks or focus sessions.");
  const [loading, setLoading] = useState(false);

  const chatWithBuddy = async (userQuestion, habits, notes, tasks) => {
    if (!userQuestion.trim()) return;
    setLoading(true);

    try {
      const prompt = `
        You are a helpful dashboard assistant. 
        Context:
        - Habits: ${habits.map(h => `${h.text} (${h.streak} days)`).join(", ")}
        - Recent Notes: ${notes.slice(0, 2).map(n => n.text).join(" | ")}
        - Tasks: ${tasks.length} active.
        
        Question: "${userQuestion}"
        Task: Provide a direct, helpful answer in 1-2 sentences.
      `;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDjsi1tnd1dUu5HBhW9U3S1MraERwYDVeA`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });

      const data = await response.json();
      setAdvice(data.candidates[0].content.parts[0].text);
    } catch (error) {
      setAdvice("I'm having trouble connecting right now. Try again shortly.");
    } finally {
      setLoading(false);
    }
  };

  return { advice, chatWithBuddy, loading };
};