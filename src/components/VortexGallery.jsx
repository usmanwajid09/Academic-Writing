import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';

const ITEMS = [
  { title: 'Academic Essay', icon: '📝', rate: '$10.00/pg', description: 'Argumentative, narrative, and analysis essays custom structured.' },
  { title: 'Research Paper', icon: '🔍', rate: '$18.00/pg', description: 'Deep qualitative or quantitative investigations with references.' },
  { title: 'Case Study', icon: '📊', rate: '$20.00/pg', description: 'Corporate breakdowns and SWOT strategizing reports.' },
  { title: 'Dissertation', icon: '🎓', rate: '$26.00/pg', description: 'Advanced chapters, outlines, and proposals written by PhDs.' },
  { title: 'Coursework', icon: '📚', rate: '$14.00/pg', description: 'Weekly assignments, reviews, and short problem solutions.' },
  { title: 'Admission Essay', icon: '🚀', rate: '$16.00/pg', description: 'High-impact personal statements to lock university spots.' },
  { title: 'Term Paper', icon: '📁', rate: '$18.00/pg', description: 'Semester-end research papers summarizing subject literature.' },
  { title: 'Book Report', icon: '📖', rate: '$12.00/pg', description: 'Detailed breakdowns, thematic analyzes, and character studies.' }
];

export default function VortexGallery({ onSelect }) {
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const currentRotation = useRef(0);

  // Auto rotate slowly when not dragging
  useEffect(() => {
    if (isDragging) return;
    const interval = setInterval(() => {
      setRotation(r => r - 0.2);
    }, 30);
    return () => clearInterval(interval);
  }, [isDragging]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    startX.current = e.clientX;
    currentRotation.current = rotation;
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX.current;
    // Map drag distance to Y rotation degrees (e.g. 0.5 deg per pixel)
    const nextRotation = currentRotation.current + deltaX * 0.4;
    setRotation(nextRotation);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    startX.current = e.touches[0].clientX;
    currentRotation.current = rotation;
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.touches[0].clientX - startX.current;
    const nextRotation = currentRotation.current + deltaX * 0.4;
    setRotation(nextRotation);
  };

  return (
    <div 
      className="vortex-viewport"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
    >
      {/* 3D Spinner cylinder */}
      <div 
        className="vortex-spinner"
        style={{
          transform: `rotateY(${rotation}deg)`
        }}
      >
        {ITEMS.map((item, idx) => {
          const angle = idx * 45; // 360 degrees / 8 items = 45 degrees step
          return (
            <div 
              key={idx}
              className="vortex-item"
              style={{
                transform: `rotateY(${angle}deg) translateZ(280px)`,
                cursor: isDragging ? 'grabbing' : 'grab'
              }}
            >
              <div>
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{item.icon}</div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '1.15rem', color: '#0f172a', fontWeight: '700' }}>
                  {item.title}
                </h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: '1.4', margin: 0 }}>
                  {item.description}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--primary)' }}>
                  {item.rate}
                </span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSelect) onSelect(item.title);
                  }}
                  style={{
                    background: 'var(--primary-light)',
                    color: 'var(--primary)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
