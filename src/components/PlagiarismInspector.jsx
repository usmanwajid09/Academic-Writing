import React, { useState, useEffect } from 'react';
import { ShieldCheck, Play, Sparkles, FileText, AlertTriangle, ChevronRight, Check } from 'lucide-react';

const MOCK_SOURCES = [
  {
    id: 'src-1',
    name: 'Wikipedia: Artificial Intelligence in Education',
    url: 'https://en.wikipedia.org/wiki/AI_in_education',
    percentage: 12,
    snippet: 'the implications of generative AI tools on academic writing courses. Focus on both the challenges...',
    matchType: 'high'
  },
  {
    id: 'src-2',
    name: 'Oxford Academic: Higher Education Review (2025)',
    url: 'https://academic.oup.com/her/article/92/4/312',
    percentage: 6,
    snippet: 'challenges (plagiarism risks) and opportunities (brainstorming, grammar checking) for undergraduate students...',
    matchType: 'med'
  }
];

export default function PlagiarismInspector({ defaultText = '' }) {
  const [text, setText] = useState(defaultText);
  const [scanning, setScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [selectedSourceId, setSelectedSourceId] = useState(null);
  const [similarityScore, setSimilarityScore] = useState(0);

  useEffect(() => {
    if (defaultText) {
      setText(defaultText);
    }
  }, [defaultText]);

  const handleScan = () => {
    if (!text.trim()) {
      alert('Please enter or paste some text to inspect first!');
      return;
    }
    setScanning(true);
    setHasScanned(false);
    setSelectedSourceId(null);

    // Simulate database lookup animation
    setTimeout(() => {
      setScanning(false);
      setHasScanned(true);
      setSimilarityScore(18); // 12% + 6% mock match
    }, 2800);
  };

  const getHighlightedText = () => {
    // We will find key phrases and wrap them in highlighted span tags
    const phraseHigh = "the implications of generative AI tools on academic writing courses. Focus on both the challenges";
    const phraseMed = "challenges (plagiarism risks) and opportunities (brainstorming, grammar checking)";

    let highlighted = text;
    
    // Safety check/escape html
    const div = document.createElement('div');
    div.innerText = text;
    highlighted = div.innerHTML;

    if (highlighted.includes(phraseHigh)) {
      highlighted = highlighted.replace(
        phraseHigh, 
        `<span class="match-high ${selectedSourceId === 'src-1' ? 'selected' : ''}" id="match-src-1">${phraseHigh}</span>`
      );
    }
    if (highlighted.includes(phraseMed)) {
      highlighted = highlighted.replace(
        phraseMed, 
        `<span class="match-med ${selectedSourceId === 'src-2' ? 'selected' : ''}" id="match-src-2">${phraseMed}</span>`
      );
    }

    return highlighted;
  };

  return (
    <div className="plagiarism-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px', marginBottom: '8px' }}>
        <div>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', margin: 0, fontSize: '1.2rem' }}>
            <ShieldCheck size={24} color="var(--primary)" /> Originality & Similarity Inspector
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            Verify draft originality against 80+ billion web indexes and academic publication databases.
          </p>
        </div>
        {!scanning && !hasScanned && (
          <button onClick={handleScan} className="btn-primary" style={{ gap: '6px' }}>
            <Play size={16} fill="white" /> Scan Originality
          </button>
        )}
        {hasScanned && (
          <button onClick={handleScan} className="btn-secondary" style={{ gap: '6px', fontSize: '0.85rem', padding: '8px 16px' }}>
            Re-Scan Document
          </button>
        )}
      </div>

      {/* 1. Editor input / textarea */}
      {!scanning && !hasScanned && (
        <div className="form-group">
          <label style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px' }}>Draft / Paper Text Content</label>
          <textarea
            className="form-input"
            style={{ minHeight: '260px', fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.92rem', lineHeight: '1.6', padding: '16px' }}
            placeholder="Paste your essay draft text here or write standard paragraphs to begin the Turnitin-style database comparison lookup..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
      )}

      {/* 2. Scanning / Radar Animation state */}
      {scanning && (
        <div className="radar-wrapper">
          <div className="radar-circle">
            <div className="radar-sweep" />
            <div className="radar-pulse-dot" style={{ top: '30%', left: '45%' }} />
            <div className="radar-pulse-dot" style={{ top: '65%', left: '70%', animationDelay: '0.5s' }} />
            <div className="radar-pulse-dot" style={{ top: '50%', left: '20%', animationDelay: '1s' }} />
            <FileText size={40} color="var(--primary)" style={{ opacity: 0.8 }} />
          </div>
          <h4 style={{ color: 'var(--text-main)', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} className="animate-spin" color="var(--accent)" />
            Analyzing Linguistic Sequences...
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', maxWidth: '420px', margin: 0 }}>
            Checking matched strings against dissertation repositories, ProQuest databases, and internet journals. Please hold.
          </p>
        </div>
      )}

      {/* 3. Has Scanned Results state */}
      {hasScanned && (
        <div className="plagi-split">
          {/* Heatmap highlights */}
          <div className="heatmap-editor">
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px', marginBottom: '14px', fontSize: '0.95rem' }}>
              <FileText size={16} /> Draft Heatmap Preview
            </h4>
            <div 
              style={{ fontSize: '0.92rem', lineHeight: '1.7', whiteSpace: 'pre-wrap', color: 'var(--text-main)' }}
              dangerouslySetInnerHTML={{ __html: getHighlightedText() }}
              onClick={(e) => {
                // Determine if they clicked on a highlight matched span
                if (e.target.className && e.target.className.includes('match-high')) {
                  setSelectedSourceId('src-1');
                } else if (e.target.className && e.target.className.includes('match-med')) {
                  setSelectedSourceId('src-2');
                }
              }}
            />
          </div>

          {/* Similarity score & Sources */}
          <div className="similarity-sources">
            {/* Score Ring Card */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ 
                width: '64px', 
                height: '64px', 
                borderRadius: '50%', 
                background: similarityScore > 10 ? 'rgba(239, 68, 68, 0.08)' : 'rgba(16, 185, 129, 0.08)',
                border: `3px solid ${similarityScore > 10 ? '#ef4444' : '#10b981'}`,
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontWeight: '800',
                color: similarityScore > 10 ? '#ef4444' : '#10b981',
                fontSize: '1.2rem'
              }}>
                {similarityScore}%
              </div>
              <div>
                <h5 style={{ margin: 0, color: 'var(--text-main)', fontSize: '0.9rem' }}>
                  {similarityScore > 10 ? 'Action Recommended' : 'Excellent Originality'}
                </h5>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {similarityScore > 10 ? 'Matched sequences require citations or rephrasing.' : 'Very low similarity matches found.'}
                </span>
              </div>
            </div>

            {/* Sources list */}
            <div style={{ fontWeight: '600', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Source Database Matches ({MOCK_SOURCES.length})
            </div>

            {MOCK_SOURCES.map((source) => (
              <div 
                key={source.id} 
                className={`source-card ${selectedSourceId === source.id ? 'active' : ''}`}
                onClick={() => setSelectedSourceId(source.id)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontWeight: '700', fontSize: '0.86rem', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                    {source.name}
                  </span>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    fontWeight: '800',
                    color: source.matchType === 'high' ? '#ef4444' : '#f59e0b',
                    background: source.matchType === 'high' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(245, 158, 11, 0.08)',
                    padding: '2px 8px',
                    borderRadius: '12px'
                  }}>
                    {source.percentage}% Match
                  </span>
                </div>
                
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0 0 8px 0', lineHeight: '1.4', background: 'var(--primary-light)', padding: '8px', borderRadius: '6px', borderLeft: `3px solid ${source.matchType === 'high' ? '#ef4444' : '#f59e0b'}` }}>
                  "... {source.snippet} ..."
                </p>

                <a 
                  href={source.url} 
                  target="_blank" 
                  rel="noreferrer" 
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  Inspect Source URL <ChevronRight size={12} />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
