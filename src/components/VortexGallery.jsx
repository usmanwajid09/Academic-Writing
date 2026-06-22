import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

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
  const [isHovered, setIsHovered] = useState(false);
  const startX = useRef(0);
  const currentRotation = useRef(0);

  // Auto rotate slowly when not dragging or hovered
  useEffect(() => {
    if (isDragging || isHovered) return;
    const interval = setInterval(() => {
      setRotation(r => r - 0.2);
    }, 30);
    return () => clearInterval(interval);
  }, [isDragging, isHovered]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    startX.current = e.clientX;
    currentRotation.current = rotation;
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX.current;
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
          transform: `rotateY(${rotation}deg)`,
          transition: isDragging ? 'none' : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {ITEMS.map((item, idx) => {
          const angle = idx * 45; // 360 / 8 = 45 degrees
          
          // Calculate relative angle to center front (0deg)
          const relAngle = ((rotation + angle) % 360 + 540) % 360 - 180; // normalized to [-180, 180]
          const cosAngle = Math.cos((relAngle * Math.PI) / 180);
          
          // Dynamic depth cues
          const opacity = 0.25 + 0.75 * ((cosAngle + 1) / 2);
          const scale = 0.85 + 0.15 * ((cosAngle + 1) / 2);
          const zIndex = Math.round((cosAngle + 1) * 20);
          const blurValue = Math.max(0, (1 - cosAngle) * 3); // Blur up to 3px in the back
          const isFront = cosAngle > 0.92;

          return (
            <div 
              key={idx}
              className="vortex-item"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={() => {
                if (!isDragging) {
                  // Spin cylinder to bring this card directly to the front!
                  setRotation(-angle);
                }
              }}
              style={{
                transform: `rotateY(${angle}deg) translateZ(280px) scale(${scale})`,
                opacity: opacity,
                zIndex: zIndex,
                filter: `blur(${blurValue}px)`,
                cursor: isDragging ? 'grabbing' : 'grab',
                borderColor: isFront ? 'var(--accent)' : 'var(--border-light)',
                borderWidth: isFront ? '2px' : '1px',
                boxShadow: isFront ? '0 10px 30px var(--accent-glow)' : 'var(--shadow-md)',
                transformOrigin: 'center center'
              }}
            >
              <div>
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{item.icon}</div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '1.15rem', color: 'var(--text-main)', fontWeight: '700' }}>
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
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  className="vortex-action-btn"
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
