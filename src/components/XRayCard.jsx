import React, { useState, useRef } from 'react';
import { ShieldCheck, FileText, CheckCircle } from 'lucide-react';

export default function XRayCard({ imageSrc, altText }) {
  const containerRef = useRef(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCoords({ x, y });
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="xray-card-container"
      style={{
        '--mouse-x': `${coords.x}px`,
        '--mouse-y': `${coords.y}px`
      }}
    >
      {/* Grayscale base photograph */}
      <img 
        src={imageSrc || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800"} 
        alt={altText || "Academic Scanning"} 
        className="xray-base-layer"
      />

      {/* Dashed scope flashlight cursor */}
      <div 
        className="xray-cursor"
        style={{
          left: `${coords.x}px`,
          top: `${coords.y}px`
        }}
      />

      {/* Blueprint reveal layer (revealed via clip-path circle) */}
      <div className="xray-overlay-layer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: '#c084fc' }}>
          <FileText size={20} />
          <strong style={{ fontSize: '0.8rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Structure Blueprint</strong>
        </div>
        
        <h3 style={{ color: '#ffffff', fontSize: '1.4rem', marginBottom: '12px', fontWeight: '800' }}>Custom Paper Architecture</h3>
        <p style={{ color: '#a5b4fc', fontSize: '0.8rem', lineHeight: '1.4', marginBottom: '18px' }}>
          Scan to reveal the core structural nodes we build into every academic draft.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#38bdf8' }}>
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#38bdf8' }}></div>
            <span><strong>Margins & Format:</strong> APA 7/MLA 9 standard</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#38bdf8' }}>
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#38bdf8' }}></div>
            <span><strong>Outline:</strong> Logical thesis & evidence links</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#38bdf8' }}>
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#38bdf8' }}></div>
            <span><strong>Citations:</strong> In-text linked to references</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#38bdf8' }}>
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#38bdf8' }}></div>
            <span><strong>Originality:</strong> 0% Plagiarism blueprint</span>
          </div>
        </div>
      </div>
    </div>
  );
}
