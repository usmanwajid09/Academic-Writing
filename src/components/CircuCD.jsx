import React, { useState, useEffect } from 'react';
import { Play, Pause, Disc, SkipForward, Star, Volume2 } from 'lucide-react';

const TRACKS = [
  {
    title: 'Econ Proposal review',
    student: 'Ryan M. (Master\'s candidate)',
    rating: 5,
    date: 'June 2026',
    comment: 'The PhD writer assigned to my macroeconomics proposal did an outstanding job. The data outline was mathematically sound and references were flawlessly formatted in APA. Direct chat helped immensely!'
  },
  {
    title: 'Dissertation outline track',
    student: 'Jessica L. (PhD candidate)',
    rating: 5,
    date: 'May 2026',
    comment: 'Managing chapters was stressful, but using their progressive delivery made it simple. Every chapter was plagiarism-scanned and delivered on-time. Worth every single penny.'
  },
  {
    title: 'Urgent essay single',
    student: 'Kevin T. (Undergrad sophomore)',
    rating: 5,
    date: 'April 2026',
    comment: 'I had an urgent literature review due in 8 hours. The writer delivered a brilliant 5-page paper in under 6 hours! Plagiarism checks came back clean. Highly recommended.'
  }
];

export default function CircuCD() {
  const [trackIdx, setTrackIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [slidOut, setSlidOut] = useState(false);

  // Auto slide out when isPlaying changes
  useEffect(() => {
    if (isPlaying) {
      setSlidOut(true);
    }
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setTrackIdx(prev => (prev + 1) % TRACKS.length);
    // Restart animation trigger
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 100);
  };

  const activeTrack = TRACKS[trackIdx];

  return (
    <div className={`circucd-container ${isPlaying ? 'playing' : ''}`}>
      {/* Vinyl Sleeve / Record Jacket */}
      <div className="circucd-sleeve">
        <div>
          <span style={{ fontSize: '0.62rem', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', color: '#c084fc', display: 'block' }}>
            TESTIMONIALS DISK
          </span>
          <h4 style={{ color: '#fff', fontSize: '1rem', marginTop: '4px', marginBottom: '8px', fontWeight: '700' }}>
            {activeTrack.title}
          </h4>
          <div style={{ display: 'flex', gap: '2px', marginBottom: '12px' }}>
            {[...Array(activeTrack.rating)].map((_, i) => (
              <Star key={i} size={10} fill="#fbbf24" color="#fbbf24" />
            ))}
          </div>
          
          <p style={{ color: '#cbd5e1', fontSize: '0.74rem', lineHeight: '1.4', fontStyle: 'italic', margin: 0, display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            "{activeTrack.comment}"
          </p>
        </div>

        <div>
          <span style={{ fontSize: '0.68rem', fontWeight: '600', color: '#a7b4fc', display: 'block' }}>
            {activeTrack.student}
          </span>
          <span style={{ fontSize: '0.62rem', color: '#64748b' }}>{activeTrack.date}</span>

          {/* Visualizer bars */}
          <div className="circucd-visualizer">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="visualizer-bar" />
            ))}
          </div>
        </div>
      </div>

      {/* Spinning Vinyl/CD Disk */}
      <div className="circucd-disk-wrapper" onClick={() => setSlidOut(!slidOut)}>
        <div className={`circucd-disk ${slidOut ? 'slid-out' : ''} ${isPlaying ? 'spinning' : ''}`}>
          <div className="circucd-center-label">
            <Volume2 size={12} color="#fff" style={{ marginBottom: '2px' }} />
            <span>TRACK {trackIdx + 1}</span>
          </div>
        </div>

        {/* Audio Playback needle */}
        <div className={`circucd-needle ${isPlaying ? 'active' : ''}`} />
      </div>

      {/* Tiny Playback Controls */}
      <div style={{
        position: 'absolute',
        bottom: '12px',
        right: '12px',
        display: 'flex',
        gap: '6px',
        zIndex: 5
      }}>
        <button 
          onClick={togglePlay}
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '50%',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#fff'
          }}
        >
          {isPlaying ? <Pause size={12} /> : <Play size={12} />}
        </button>
        <button 
          onClick={nextTrack}
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '50%',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#fff'
          }}
        >
          <SkipForward size={12} />
        </button>
      </div>
    </div>
  );
}
