import React, { useState } from 'react';
import { useNotes } from '../../hooks/useNotes';
import './Notes.css';

const NotesSidebar = () => {
  const { notes, addNote, updateNote, deleteNote } = useNotes();
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ title: '', content: '', tag: '' });
  
  // State to track which note is being edited
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ title: '', content: '', tag: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.content.trim()) return;
    addNote(formData.title, formData.content, formData.tag);
    setFormData({ title: '', content: '', tag: '' });
  };

  const handleStartEdit = (note) => {
    setEditingId(note.id);
    setEditData({ title: note.title, content: note.content, tag: note.tag });
  };

  const handleSaveEdit = (id) => {
    updateNote(id, editData);
    setEditingId(null);
  };

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="module-card note-strict-container">
      <h2 className="st-title">Reflection: Notes</h2>
      
      <input 
        className="st-search-bar" 
        placeholder="🔍 Search notes or #tags..." 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <form className="st-note-form" onSubmit={handleSubmit}>
        <input className="st-input" placeholder="Note Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
        <textarea className="st-area" placeholder="Capture your thoughts..." value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} />
        <input className="st-input-tag" placeholder="Category Tag (e.g. #Work)" value={formData.tag} onChange={e => setFormData({...formData, tag: e.target.value})} />
        <button type="submit" className="st-btn-save">Save Reflection</button>
      </form>

      <div className="st-notes-list">
        {filteredNotes.map(note => (
          <div key={note.id} className="note-card-item">
            {editingId === note.id ? (
              /* EDIT MODE UI */
              <div className="edit-mode-container">
                <input className="st-input" value={editData.title} onChange={e => setEditData({...editData, title: e.target.value})} />
                <textarea className="st-area" value={editData.content} onChange={e => setEditData({...editData, content: e.target.value})} />
                <div className="edit-actions">
                  <button onClick={() => handleSaveEdit(note.id)} className="btn-save-sm">Update</button>
                  <button onClick={() => setEditingId(null)} className="btn-cancel-sm">Cancel</button>
                </div>
              </div>
            ) : (
              /* VIEW MODE UI */
              <>
                <div className="note-card-header">
                  <h4>{note.title} <span className="category-pill">{note.tag}</span></h4>
                  <div className="note-control-icons">
                    <button onClick={() => handleStartEdit(note)} className="btn-icon">✎</button>
                    <button onClick={() => deleteNote(note.id)} className="btn-icon del">×</button>
                  </div>
                </div>
                <p className="note-body-text">{note.content}</p>
                <small className="note-date">{new Date(note.timestamp).toLocaleDateString()}</small>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesSidebar;