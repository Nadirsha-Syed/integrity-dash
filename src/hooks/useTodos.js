import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  orderBy 
} from 'firebase/firestore';

export const useTodos = () => {
  const [todos, setTodos] = useState([]);
  const user = auth.currentUser; // Identify which email is logged in

  useEffect(() => {
    if (!user) {
      setTodos([]);
      return;
    }

    // Point to a private sub-collection for this specific user
    const todosRef = collection(db, 'users', user.uid, 'todos');
    const q = query(todosRef, orderBy('createdAt', 'desc'));

    // Real-time listener: Updates your UI instantly when data changes
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const todosData = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));
      setTodos(todosData);
    });

    return () => unsubscribe();
  }, [user]);

  const addTodo = async (text, deadline) => {
    if (!user || !text.trim()) return;
    
    // Saves to the cloud under the user's private ID
    await addDoc(collection(db, 'users', user.uid, 'todos'), {
      text,
      deadline: deadline || null,
      completed: false,
      createdAt: new Date().toISOString()
    });
  };

  const toggleTodo = async (id) => {
    if (!user) return;
    const todo = todos.find(t => t.id === id);
    const todoRef = doc(db, 'users', user.uid, 'todos', id);
    
    await updateDoc(todoRef, {
      completed: !todo.completed
    });
  };

  const deleteTodo = async (id) => {
    if (!user) return;
    await deleteDoc(doc(db, 'users', user.uid, 'todos', id));
  };

  const markAsCompleted = async (id) => {
    if (!user) return;
    const todoRef = doc(db, 'users', user.uid, 'todos', id);
    await updateDoc(todoRef, { completed: true });
  };

  return { todos, addTodo, toggleTodo, deleteTodo, markAsCompleted };
};