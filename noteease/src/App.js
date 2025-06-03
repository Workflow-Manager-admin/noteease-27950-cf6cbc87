import React, { useState, useMemo } from 'react';
import './App.css';

/**
 * MAIN CONTAINER for NoteEase: This houses all CRUD and UI logic for note management.
 * Color scheme: primary (#1976D2), secondary (#FFFFFF), accent (#FFC107), light theme.
 */

// UTILITIES

// Generate a random ID for notes.
function genId() {
  return Math.random().toString(36).substr(2, 8);
}

// Default Categories
const DEFAULT_CATEGORIES = [
  'All',
  'Personal',
  'Work',
  'Ideas',
  'Lists',
  'Archive'
];

// PUBLIC_INTERFACE
function App() {
  // Notes Data and State
  const [notes, setNotes] = useState(() => [
    // Example note for first open
    {
      id: genId(),
      title: 'Welcome to NoteEase!',
      content: 'Start by creating your own note.',
      category: 'Personal',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);
  // Modal State
  const [editingNote, setEditingNote] = useState(null); // note object or null
  const [showModal, setShowModal] = useState(false);
  // UI Controls State
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Filtered notes based on search and category
  const filteredNotes = useMemo(() => {
    let result = notes;
    if (activeCategory !== 'All') {
      result = result.filter(n => n.category === activeCategory);
    }
    if (searchTerm.trim() !== '') {
      const st = searchTerm.toLowerCase();
      result = result.filter(n =>
        n.title.toLowerCase().includes(st) ||
        n.content.toLowerCase().includes(st)
      );
    }
    return result.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }, [notes, searchTerm, activeCategory]);

  // Helper: Get all categories with notes + preserve defaults
  const allCategories = useMemo(() => {
    const fromNotes = Array.from(new Set(notes.map(n => n.category))).filter(Boolean);
    // Show all categories, default first, then fromNotes that aren't default (except All)
    return [
      ...DEFAULT_CATEGORIES,
      ...fromNotes.filter(cat => !DEFAULT_CATEGORIES.includes(cat) && cat !== 'All')
    ];
  }, [notes]);

  // HANDLERS

  // PUBLIC_INTERFACE
  function openNewNoteModal() {
    setEditingNote(null);
    setShowModal(true);
  }
  // PUBLIC_INTERFACE
  function openEditNoteModal(note) {
    setEditingNote(note);
    setShowModal(true);
  }
  // PUBLIC_INTERFACE
  function closeModal() {
    setShowModal(false);
    setEditingNote(null);
  }

  // PUBLIC_INTERFACE
  function saveNote(noteInput) {
    // if editing existing note
    if (noteInput.id) {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === noteInput.id
            ? { ...n, ...noteInput, updatedAt: new Date().toISOString() }
            : n
        )
      );
    } else {
      // create new
      setNotes((prev) => [
        {
          ...noteInput,
          id: genId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        ...prev,
      ]);
    }
    closeModal();
  }

  // PUBLIC_INTERFACE
  function deleteNote(id) {
    // Simple delete confirmation
    if (window.confirm('Delete this note?')) {
      setNotes(notes.filter((n) => n.id !== id));
      // If deleting the note being edited
      if (editingNote && editingNote.id === id) closeModal();
    }
  }

  // Category Filter Handler
  function handleCategoryClick(category) {
    setActiveCategory(category);
  }

  // RENDER UI

  return (
    <div
      className="app"
      style={{ background: '#F8FAFB', minHeight: '100vh', color: '#283046' }}
    >
      <nav
        className="navbar"
        style={{
          background: '#1976D2',
          color: '#fff',
          boxShadow: '0px 2px 6px #00000014'
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="logo" style={{ color: '#fff', fontWeight: 700 }}>
            <span className="logo-symbol" style={{ color: '#FFC107' }}>📝</span> NoteEase
          </div>
          <div>
            <a href="https://github.com" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none', fontSize: '1rem' }}>
              {/* Placeholder for real navigation/action */}
            </a>
          </div>
        </div>
      </nav>

      <main>
        <div className="container" style={{ paddingTop: 90, paddingBottom: 60, maxWidth: 900 }}>
          {/* SEARCH BAR */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'stretch', marginBottom: 20 }}>
            <input
              aria-label="Search notes"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search notes..."
              style={{
                fontSize: 16,
                padding: "10px 14px",
                borderRadius: 8,
                border: '1.5px solid #e1e8ed',
                background: '#fff',
                color: '#1976D2',
                outline: "none",
              }}
            />
            {/* CATEGORY FILTER CHIPS */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              {allCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  style={{
                    background: activeCategory === cat ? '#1976D2' : '#fff',
                    color: activeCategory === cat ? '#fff' : '#1976D2',
                    border: '1px solid #1976D2',
                    borderRadius: 40,
                    padding: '6px 18px',
                    fontWeight: 500,
                    fontSize: 15,
                    cursor: 'pointer',
                    marginBottom: 2,
                    boxShadow: activeCategory === cat ? '0 2px 8px #1976D261' : ''
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* NOTES LIST */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 28, alignItems: 'flex-start', marginBottom: 70 }}>
            {filteredNotes.length > 0 ? (
              filteredNotes.map(note => (
                <div
                  key={note.id}
                  className="note-card"
                  onClick={() => openEditNoteModal(note)}
                  style={{
                    background: '#fff',
                    color: '#283046',
                    border: '1px solid #e1e8ed',
                    borderRadius: 12,
                    boxShadow: '0 2px 10px #0001',
                    padding: 20,
                    minWidth: 260,
                    maxWidth: 295,
                    flex: '1 0 260px',
                    marginTop: 0,
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'box-shadow 0.19s',
                  }}
                >
                  <div style={{
                    fontWeight: 700,
                    fontSize: 17,
                    color: '#1976D2',
                    marginBottom: 7,
                  }}>
                    {note.title}
                  </div>
                  <div style={{
                    fontSize: 15,
                    marginBottom: 13,
                    minHeight: 32,
                    color: '#2b2d42'
                  }}>
                    {note.content.length > 65 ? note.content.slice(0, 65) + '…' : note.content}
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 13,
                    color: '#646e85',
                  }}>
                    <span
                      style={{
                        background: '#E3F0FB',
                        color: '#1976D2',
                        borderRadius: 18,
                        padding: '2px 10px',
                        fontWeight: 500,
                        fontSize: 12,
                        marginBottom: 3,
                      }}
                    >{note.category}</span>
                    <span style={{ fontStyle: 'italic', marginLeft: 'auto', fontSize: 12 }}>
                      {new Date(note.updatedAt).toLocaleString()}
                    </span>
                    <button
                      title="Delete note"
                      onClick={e => {
                        e.stopPropagation();
                        deleteNote(note.id);
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#FFA726',
                        position: 'absolute',
                        right: 12,
                        bottom: 13,
                        fontSize: 17,
                        padding: 0,
                        opacity: 0.86
                      }}>🗑️</button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ color: '#c0c6cf', fontSize: 19, textAlign: 'center', padding: 32, width: '100%' }}>
                No notes found.
              </div>
            )}
          </div>

          {/* FLOATING ACTION BUTTON */}
          <button
            className="fab"
            aria-label="Add a new note"
            onClick={openNewNoteModal}
            style={{
              position: 'fixed',
              bottom: 38,
              right: 38,
              width: 64,
              height: 64,
              background: '#FFC107',
              color: '#fff',
              border: 'none',
              borderRadius: '50%',
              fontSize: 36,
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 6px 28px #FFC10780, 0 4px 16px #00000020',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 222,
              transition: "background 0.2s",
            }}
            data-testid="fab"
          >
            +
          </button>

          {/* MODAL for Add/Edit */}
          {showModal && (
            <NoteModal
              note={editingNote}
              onSave={saveNote}
              onClose={closeModal}
              categories={allCategories}
            />
          )}
        </div>
      </main>
    </div>
  );
}

// MODAL COMPONENT for Creating/Editing Notes
function NoteModal({ note, onSave, onClose, categories }) {
  // Form State
  const [title, setTitle] = useState(note ? note.title : '');
  const [content, setContent] = useState(note ? note.content : '');
  const [category, setCategory] = useState(note ? note.category : (categories.includes('Personal') ? 'Personal' : categories[0]));
  // Keyboard accessibility: focus title on open
  React.useEffect(() => {
    document.getElementById('note-title-input')?.focus();
    // Escape to close modal
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);
  // PUBLIC_INTERFACE
  function handleSave() {
    if (!title.trim()) {
      alert('Please enter a title.');
      return;
    }
    if (!content.trim()) {
      alert('Please enter note content.');
      return;
    }
    onSave({
      ...(note ? { id: note.id } : {}),
      title: title.trim(),
      content: content.trim(),
      category: category,
    });
  }

  return (
    <div
      className="modal-overlay"
      style={{
        position: 'fixed',
        zIndex: 99999,
        top: 0, left: 0, width: '100vw', height: '100vh',
        background: 'rgba(60,72,108,0.14)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={onClose}
      data-testid="modal-overlay"
    >
      <div
        className="modal-inner"
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff',
          padding: 30,
          borderRadius: 15,
          minWidth: 320,
          maxWidth: 410,
          width: "99vw",
          boxShadow: '0 8px 44px #1976D2bb, 0 1px 3px #0001',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <h2 style={{ margin: "2px 0 10px", color: "#1976D2", fontSize: "1.35rem" }}>
          {note ? 'Edit Note' : 'New Note'}
        </h2>
        <input
          id="note-title-input"
          aria-label="Note title"
          value={title}
          placeholder="Title"
          maxLength={60}
          onChange={e => setTitle(e.target.value)}
          style={{
            fontSize: 18,
            padding: "9px 12px",
            borderRadius: 6,
            border: '1.5px solid #E3F0FB',
            background: '#F8FAFB',
            color: '#1976D2',
            outline: "none",
            fontWeight: 500,
          }}
        />
        <textarea
          aria-label="Note content"
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Type your note here..."
          rows={6}
          style={{
            fontSize: 16,
            padding: "9px 12px",
            borderRadius: 6,
            border: '1.5px solid #E3F0FB',
            background: '#F8FAFB',
            color: '#1e1b1c',
            outline: "none",
            resize: 'vertical',
            marginBottom: 9,
          }}
          maxLength={2000}
        />
        <div style={{ display: "flex", alignItems: 'center', gap: 11, marginBottom: 6 }}>
          <label htmlFor="cat-select" style={{ color: "#283046", fontSize: 15, fontWeight: 400 }}>
            Category:
          </label>
          <select
            id="cat-select"
            value={category}
            onChange={e => setCategory(e.target.value)}
            style={{
              fontSize: 15,
              borderRadius: 5,
              padding: "6px 14px",
              border: '1.5px solid #E3F0FB',
              color: '#1976D2',
              fontWeight: 500,
              background: '#F8FAFB'
            }}
          >
            {categories.filter(c => c !== 'All' && c.trim()).map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
            <option value="(new)">+ New category</option>
          </select>
          {/* Add new category inline */}
          {category === '(new)' &&
            <input
              aria-label="New category"
              placeholder="Enter new category"
              autoFocus
              style={{
                border: '1px solid #FFD54F',
                background: '#FFECB3',
                color: "#2d328e",
                borderRadius: 5,
                padding: "5px 9px",
                marginLeft: 5,
                fontSize: 14,
                minWidth: 72,
              }}
              value=""
              onChange={e => {
                // category immediately set via blur or enter
                setCategory(e.target.value || 'Personal');
              }}
              onBlur={e => setCategory(e.target.value || 'Personal')}
              onKeyDown={e => {
                if (e.key === 'Enter') setCategory(e.target.value || 'Personal');
              }}
            />
          }
        </div>
        <div style={{ display: "flex", justifyContent: 'flex-end', alignItems: 'center', gap: 10 }}>
          <button
            className="btn"
            onClick={onClose}
            style={{
              background: '#E3F0FB',
              color: '#1976D2',
              padding: '8px 18px',
              borderRadius: 7,
              border: 'none',
              fontWeight: 500
            }}
          >
            Cancel
          </button>
          <button
            className="btn"
            onClick={handleSave}
            style={{
              background: '#1976D2',
              color: '#fff',
              padding: '8px 18px',
              borderRadius: 7,
              border: 'none',
              fontWeight: 600,
              boxShadow: '0 2px 8px #1976D2cc'
            }}
          >
            {note ? "Save" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;