import { useState, useEffect } from 'react';
import { db, auth } from '../firebase'; // Ensure your firebase config is correctly imported
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

export const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const user = auth.currentUser; // Identify the logged-in user

  useEffect(() => {
    if (!user) {
      setNotes([]);
      return;
    }

    // Reference to the user's private notes collection
    const notesRef = collection(db, 'users', user.uid, 'notes');
    const q = query(notesRef, orderBy('timestamp', 'desc'));

    // Real-time listener for cloud changes
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notesData = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));
      setNotes(notesData);
    });

    return () => unsubscribe();
  }, [user]);

  const addNote = async (title, content, tag) => {
    if (!user) return;
    
    // Saves to private UID folder in Firestore
    await addDoc(collection(db, 'users', user.uid, 'notes'), {
      title: title || 'Untitled',
      content,
      tag: tag || 'General',
      timestamp: new Date().toISOString()
    });
  };

  const updateNote = async (id, updatedFields) => {
    if (!user) return;
    
    const noteRef = doc(db, 'users', user.uid, 'notes', id);
    await updateDoc(noteRef, { 
      ...updatedFields, 
      timestamp: new Date().toISOString() 
    });
  };

  const deleteNote = async (id) => {
    if (!user) return;
    
    const noteRef = doc(db, 'users', user.uid, 'notes', id);
    await deleteDoc(noteRef);
  };

  return { notes, addNote, updateNote, deleteNote };
};