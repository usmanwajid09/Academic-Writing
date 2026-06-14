import React, { useState, useEffect } from 'react';
import { Sparkles, Check, Copy, FileText, RefreshCw, X, Type } from 'lucide-react';

// Unicode character map converters for plain-text formatting
export const toUnicodeBold = (text, type = 'sans') => {
  // Serif Bold: A=0x1D400, a=0x1D41A, 0=0x1D7CE
  // Sans-Serif Bold: A=0x1D5D4, a=0x1D5EE, 0=0x1D7EC
  const serifA = 0x1D400;
  const serifa = 0x1D41A;
  const serif0 = 0x1D7CE;

  const sansA = 0x1D5D4;
  const sansa = 0x1D5EE;
  const sans0 = 0x1D7EC;

  let offsetA = type === 'serif' ? serifA : sansA;
  let offseta = type === 'serif' ? serifa : sansa;
  let offset0 = type === 'serif' ? serif0 : sans0;

  return text.split('').map(char => {
    const code = char.charCodeAt(0);
    if (code >= 65 && code <= 90) {
      return String.fromCodePoint(offsetA + (code - 65));
    }
    if (code >= 97 && code <= 122) {
      return String.fromCodePoint(offseta + (code - 97));
    }
    if (code >= 48 && code <= 57) {
      return String.fromCodePoint(offset0 + (code - 48));
    }
    return char;
  }).join('');
};

const ACADEMIC_KEYWORDS = [
  'apa', 'mla', 'harvard', 'chicago', 'deadline', 'pages', 'sources', 'citations',
  'bibliography', 'plagiarism', 'turnitin', 'grade', 'rubric', 'abstract', 'appendix',
  'thesis', 'dissertation', 'outline', 'proofread', 'writer', 'native enl', 'original'
];

const DIRECTIVE_VERBS = [
  'analyze', 'evaluate', 'synthesize', 'compare', 'contrast', 'investigate',
  'critique', 'formulate', 'examine', 'determine', 'validate', 'describe', 'explain'
];

export default function BoldTextAIPlugin({ isOpen, onClose, initialText, onApply, theme = 'light' }) {
  const [activeTab, setActiveTab] = useState('smart'); // 'smart', 'rewrite', 'unicode'
  const [text, setText] = useState(initialText || '');
  const [preview, setPreview] = useState('');
  const [copied, setCopied] = useState(false);
  const [unicodeType, setUnicodeType] = useState('sans'); // 'sans', 'serif'

  // Update text when initialText changes or plugin opens
  useEffect(() => {
    if (isOpen) {
      setText(initialText || '');
      setPreview('');
    }
  }, [isOpen, initialText]);

  // Run the current tab's conversion process
  useEffect(() => {
    if (!text.trim()) {
      setPreview('');
      return;
    }

    if (activeTab === 'smart') {
      // Bold core academic requirements using HTML strong tags
      let highlighted = text;
      ACADEMIC_KEYWORDS.forEach(keyword => {
        const regex = new RegExp(`\\b(${keyword}s?)\\b`, 'gi');
        highlighted = highlighted.replace(regex, '<strong>$1</strong>');
      });
      setPreview(highlighted);
    } else if (activeTab === 'rewrite') {
      // Simulate academic prompt rewrite with bolded directive verbs
      let lines = text.split('\n').map(line => line.trim()).filter(Boolean);
      if (lines.length === 0) return;

      let enhanced = `[Enhanced Academic Guidelines & Prompts]\n\n`;
      lines.forEach((line, index) => {
        let processedLine = line;
        
        // Bold directive verbs
        DIRECTIVE_VERBS.forEach(verb => {
          const regex = new RegExp(`\\b(${verb}s?)\\b`, 'gi');
          processedLine = processedLine.replace(regex, '<strong>$1</strong>');
        });

        // Add academic structure
        enhanced += `${index + 1}. **Objective**: ${processedLine}\n`;
      });
      
      enhanced += `\n*Note: Ensure rigorous **${toUnicodeBold('originality')}** checks and follow standard **${toUnicodeBold('academic format')}** references.*`;
      setPreview(enhanced);
    } else if (activeTab === 'unicode') {
      // Standard text to Unicode Bold
      setPreview(toUnicodeBold(text, unicodeType));
    }
  }, [text, activeTab, unicodeType]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(preview.replace(/<\/?strong>/g, '')); // Strip HTML if any
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyChange = () => {
    // If smart/rewrite contains HTML bold tags, we can either pass them directly or strip/replace
    onApply(preview);
    onClose();
  };

  return (
    <div className={`boldtext-overlay ${theme === 'dark' ? 'dark-theme-plugin' : ''}`}>
      <div className="boldtext-modal">
        {/* Header */}
        <div className="boldtext-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="#ec4899" />
            <h3 style={{ margin: 0, color: '#fff', fontSize: '1.2rem' }}>BoldText AI Editor Plugin</h3>
          </div>
          <button 
            onClick={onClose} 
            style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="boldtext-tabs">
          <button 
            className={`boldtext-tab ${activeTab === 'smart' ? 'active' : ''}`}
            onClick={() => setActiveTab('smart')}
          >
            Smart Highlight
          </button>
          <button 
            className={`boldtext-tab ${activeTab === 'rewrite' ? 'active' : ''}`}
            onClick={() => setActiveTab('rewrite')}
          >
            Academic Rewrite
          </button>
          <button 
            className={`boldtext-tab ${activeTab === 'unicode' ? 'active' : ''}`}
            onClick={() => setActiveTab('unicode')}
          >
            Unicode Bold
          </button>
        </div>

        {/* Content Body */}
        <div className="boldtext-body">
          <div className="form-group" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>Input Text</label>
            <textarea 
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={
                activeTab === 'smart' ? "Type instructions (e.g. write essay in APA format with 5 pages and 3 citations)" :
                activeTab === 'rewrite' ? "Type rough notes (e.g. analyze business strategies, compare tesla vs ford)" :
                "Type text to convert to 𝗕𝗼𝗹𝗱..."
              }
              style={{
                width: '100%',
                minHeight: '80px',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid var(--border-light)',
                fontSize: '0.9rem',
                resize: 'vertical',
                background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : '#fff',
                color: 'inherit'
              }}
            />
          </div>

          {activeTab === 'unicode' && (
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <label style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input 
                  type="radio" 
                  name="unicode-style" 
                  checked={unicodeType === 'sans'} 
                  onChange={() => setUnicodeType('sans')}
                />
                Sans-Serif (𝗕𝗼𝗹𝗱)
              </label>
              <label style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input 
                  type="radio" 
                  name="unicode-style" 
                  checked={unicodeType === 'serif'} 
                  onChange={() => setUnicodeType('serif')}
                />
                Serif (𝐁𝐨𝐥𝐝)
              </label>
            </div>
          )}

          {preview && (
            <div style={{ marginTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>AI Processed Preview:</span>
                <button 
                  type="button" 
                  onClick={handleCopy}
                  style={{ 
                    background: 'transparent', 
                    border: 'none', 
                    color: 'var(--primary)', 
                    fontSize: '0.78rem', 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? 'Copied plain text!' : 'Copy Plain'}
                </button>
              </div>

              {activeTab === 'unicode' ? (
                <div className="boldtext-preview-area">{preview}</div>
              ) : (
                <div 
                  className="boldtext-preview-area"
                  dangerouslySetInnerHTML={{ __html: preview.replace(/\n/g, '<br />') }}
                />
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="boldtext-footer">
          <button 
            onClick={onClose} 
            className="btn-secondary" 
            style={{ padding: '8px 18px', fontSize: '0.9rem', borderRadius: '8px' }}
          >
            Cancel
          </button>
          <button 
            onClick={handleApplyChange}
            disabled={!preview}
            className="btn-accent"
            style={{ 
              padding: '8px 20px', 
              fontSize: '0.9rem', 
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
              opacity: preview ? 1 : 0.5,
              cursor: preview ? 'pointer' : 'not-allowed'
            }}
          >
            Apply to Textbox
          </button>
        </div>
      </div>
    </div>
  );
}
