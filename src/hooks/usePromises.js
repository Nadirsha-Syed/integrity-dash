import { useState, useEffect } from 'react';
import { db, auth } from '../firebase'; // Ensure this points to your firebase config
import { 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs 
} from 'firebase/firestore';

const getTodayStr = () => new Date().toDateString();

export const usePromises = () => {
  const [promises, setPromises] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser; // Detects which email is logged in

  useEffect(() => {
    if (!user) {
      setPromises([]);
      setLoading(false);
      return;
    }

    // CRITICAL: Scope data to the specific logged-in user UID
    const habitsRef = collection(db, 'users', user.uid, 'habits');
    const q = query(habitsRef);

    // Real-time listener for this specific user's habits
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const habitsData = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));
      setPromises(habitsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // AUTO-CHECK: Handles streak resets when a day is missed
  useEffect(() => {
    if (!user || promises.length === 0) return;

    const todayStr = getTodayStr();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    promises.forEach(async (p) => {
      const missedDeadline = p.lastCompletedDate !== todayStr && p.lastCompletedDate !== yesterdayStr;
      
      if (missedDeadline && p.streak > 0) {
        const habitRef = doc(db, 'users', user.uid, 'habits', p.id);
        await updateDoc(habitRef, {
          streak: 0,
          brokenCount: (p.brokenCount || 0) + 1
        });
      }
    });
  }, [user, promises.length]);

  const addPromise = async (text, reason) => {
    if (!user || !text.trim()) return;
    // Saves to private cloud collection
    await addDoc(collection(db, 'users', user.uid, 'habits'), {
      text,
      reason,
      streak: 0,
      brokenCount: 0,
      lastCompletedDate: null,
      createdAt: new Date().toISOString()
    });
  };

  const toggleDailyHabit = async (id) => {
    if (!user) return;
    const habit = promises.find(p => p.id === id);
    const todayStr = getTodayStr();
    const isDone = habit.lastCompletedDate === todayStr;

    const habitRef = doc(db, 'users', user.uid, 'habits', id);
    await updateDoc(habitRef, {
      lastCompletedDate: !isDone ? todayStr : null,
      streak: !isDone ? habit.streak + 1 : Math.max(0, habit.streak - 1)
    });
  };

  const deleteHabit = async (id) => {
    if (!user) return;
    await deleteDoc(doc(db, 'users', user.uid, 'habits', id));
  };

  return { promises, addPromise, toggleDailyHabit, deleteHabit, loading };
};