import React, { useState, useEffect } from 'react';
import { BookMarked, Copy, Trash2, Check, RefreshCw } from 'lucide-react';

export default function ReferenceShelf({ refreshTrigger, onRemoveRef }) {
  const [references, setReferences] = useState([]);
  const [activeBookId, setActiveBookId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Load references from localStorage
  const loadReferences = () => {
    try {
      const stored = localStorage.getItem('academic_references');
      if (stored) {
        setReferences(JSON.parse(stored));
      } else {
        setReferences([]);
      }
    } catch (err) {
      console.error('Failed to load references', err);
    }
  };

  useEffect(() => {
    loadReferences();
  }, [refreshTrigger]);

  const handleCopy = (id, text) => {
    // Strip markdown formatting like '*'
    const cleanText = text.replace(/\*/g, '');
    navigator.clipboard.writeText(cleanText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id) => {
    try {
      const stored = localStorage.getItem('academic_references');
      if (stored) {
        const parsed = JSON.parse(stored);
        const filtered = parsed.filter(item => item.id !== id);
        localStorage.setItem('academic_references', JSON.stringify(filtered));
        setReferences(filtered);
        if (activeBookId === id) {
          setActiveBookId(null);
        }
        if (onRemoveRef) {
          onRemoveRef();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearShelf = () => {
    if (window.confirm('Are you sure you want to empty your reference shelf?')) {
      localStorage.removeItem('academic_references');
      setReferences([]);
      setActiveBookId(null);
      if (onRemoveRef) onRemoveRef();
    }
  };

  const getStyleClass = (style) => {
    switch (style?.toUpperCase()) {
      case 'APA': return 'book-spine-apa';
      case 'MLA': return 'book-spine-mla';
      case 'HARVARD': return 'book-spine-harvard';
      case 'CHICAGO': return 'book-spine-chicago';
      default: return 'book-spine-apa';
    }
  };

  const activeBook = references.find(r => r.id === activeBookId);

  return (
    <div className="bookshelf-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', width: '100%' }}>
        <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', margin: 0, fontSize: '1rem' }}>
          <BookMarked size={20} color="var(--primary)" />
          Your Active Reference Shelf ({references.length})
        </h4>
        {references.length > 0 && (
          <button 
            onClick={handleClearShelf}
            style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.82rem', cursor: 'pointer', fontWeight: '600' }}
          >
            Clear Shelf
          </button>
        )}
      </div>

      <div className="bookshelf-3d">
        {references.length === 0 ? (
          <div style={{ 
            position: 'absolute', 
            top: '40%', 
            left: 0, 
            right: 0, 
            textAlign: 'center', 
            color: 'var(--text-muted)', 
            fontSize: '0.88rem',
            padding: '0 20px',
            transform: 'translateZ(10px)'
          }}>
            🎓 <em>Your shelf is empty. Generate a citation above and click "Add to Shelf" to stack your books.</em>
          </div>
        ) : (
          references.map((ref) => {
            const shortAuthor = ref.author 
              ? ref.author.trim().split(' ').pop()
              : 'Unknown';
            const yearStr = ref.year || 'N.D.';
            
            return (
              <div 
                key={ref.id}
                className={`book-spine-3d ${getStyleClass(ref.style)} ${activeBookId === ref.id ? 'active' : ''}`}
                onClick={() => setActiveBookId(activeBookId === ref.id ? null : ref.id)}
                title={`${ref.author} (${ref.year}) - Click to inspect`}
              >
                <div className="book-label">
                  <span className="book-style-tag">{ref.style}</span>
                  <span style={{ flex: 1, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', width: '130px', textAlign: 'center' }}>
                    {shortAuthor}
                  </span>
                  <span style={{ fontSize: '0.65rem', opacity: 0.9 }}>{yearStr}</span>
                </div>
              </div>
            );
          })
        )}
        <div className="shelf-plank" />
      </div>

      {activeBook && (
        <div className="book-detail-popup">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ 
                  background: activeBook.style === 'APA' ? '#10b981' : activeBook.style === 'MLA' ? '#8b5cf6' : activeBook.style === 'Harvard' ? '#3b82f6' : '#f43f5e', 
                  color: 'white', 
                  fontSize: '0.68rem', 
                  padding: '2px 6px', 
                  borderRadius: '4px',
                  fontWeight: '800'
                }}>
                  {activeBook.style} 7th
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Source Type: <strong style={{ textTransform: 'capitalize' }}>{activeBook.sourceType || 'book'}</strong>
                </span>
              </div>
              <div 
                style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.5', background: 'var(--primary-light)', padding: '12px', borderRadius: '8px', border: '1px dashed var(--border-light)' }}
                dangerouslySetInnerHTML={{ 
                  __html: activeBook.formatted.replace(/\*(.*?)\*/g, '<em>$1</em>') 
                }} 
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button 
                onClick={() => handleCopy(activeBook.id, activeBook.formatted)}
                className="btn-primary"
                style={{ padding: '8px', borderRadius: '8px' }}
                title="Copy Citation"
              >
                {copiedId === activeBook.id ? <Check size={16} /> : <Copy size={16} />}
              </button>
              <button 
                onClick={() => handleDelete(activeBook.id)}
                className="btn-secondary"
                style={{ padding: '8px', borderRadius: '8px', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                title="Remove Book"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
