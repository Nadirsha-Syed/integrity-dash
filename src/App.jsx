import React, { useState, useEffect } from 'react';
import './styles/App.css';
import DashboardHeader from './components/header/DashboardHeader';
import QuoteHeader from './components/header/QuoteHeader';
import PromiseList from './components/promises/PromiseList';
import TodoList from './components/todo/TodoList';
import Stopwatch from './components/stopwatch/Stopwatch';
import NotesSidebar from './components/notes/NotesSidebar';
import CoachCorner from './components/coach/CoachCorner';

// Firebase & Auth
import { auth, signInWithGoogle } from './firebase'; 
import { onAuthStateChanged } from 'firebase/auth';

// Logic Hooks
import { usePromises } from './hooks/usePromises';
import { useTodos } from './hooks/useTodos';
import { useNotes } from './hooks/useNotes'; 

function App() {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true); // Prevents flash of login screen

  // Initialize data hooks
  const { promises } = usePromises();
  const { todos } = useTodos();
  const { notes } = useNotes();

  // Listen for Auth changes (Login/Logout)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // 1. Show Loading State
  if (loading) {
    return <div className="loading-screen">Authenticating Integrity Dash...</div>;
  }

  // 2. Show Login Screen if not authenticated
  if (!user) {
    return (
      <div className="login-screen">
        <div className="login-card">
          <h1>Midnight Dashboard</h1>
          <p>Sign in to sync your streaks across devices.</p>
          <button className="google-login-btn" onClick={handleLogin}>
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  // 3. Main Dashboard UI
  return (
    <div className="app-container">
      {/* Pass user to header for logout functionality */}
      <DashboardHeader user={user} /> 
      
      <QuoteHeader />

      <main className="dashboard-grid">
        <div className="grid-column">
          <PromiseList />
          <NotesSidebar />
        </div>

        <div className="grid-column">
          <CoachCorner 
            habits={promises} 
            notes={notes} 
            tasks={todos} 
          />
          <Stopwatch />
          <TodoList />
        </div>
      </main>
    </div>
  );
}

export default App;