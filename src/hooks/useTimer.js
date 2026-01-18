import { useState, useEffect } from 'react';

export const useTimer = (onTimeUp) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      clearInterval(interval);
      // This only triggers if a task was selected
      if (onTimeUp) onTimeUp(); 
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, onTimeUp]);

  const startTimer = () => setIsActive(true);
  const pauseTimer = () => setIsActive(false);
  const resetTimer = (mins = 25) => {
    setIsActive(false);
    setTimeLeft(mins * 60);
  };

  return { timeLeft, isActive, startTimer, pauseTimer, resetTimer };
};