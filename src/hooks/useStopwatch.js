import { useState, useEffect, useRef } from 'react';

export const useStopwatch = () => {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const countRef = useRef(null);

  const handleStart = () => {
    setIsActive(true);
    countRef.current = setInterval(() => {
      setTime((time) => time + 1);
    }, 1000);
  };

  const handlePause = () => {
    clearInterval(countRef.current);
    setIsActive(false);
  };

  const handleReset = () => {
    clearInterval(countRef.current);
    setIsActive(false);
    setTime(0);
  };

  return { time, isActive, handleStart, handlePause, handleReset };
};