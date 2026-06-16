import React from 'react';
import { BookOpen, Copy, Check } from 'lucide-react';

export default function CitationGenerator() {
  const [sourceType, setSourceType] = React.useState('book');
  const [author, setAuthor] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [publisher, setPublisher] = React.useState('');
  const [year, setYear] = React.useState('');
  const [url, setUrl] = React.useState('');
  
  const [activeStyle, setActiveStyle] = React.useState('APA');
  const [copied, setCopied] = React.useState(false);

  const formatAuthorName = (name) => {
    if (!name) return 'Author, A. N.';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0];
    const lastName = parts[parts.length - 1];
    const firstInitial = parts[0].charAt(0).toUpperCase();
    const middleInitial = parts.length > 2 ? ` ${parts[1].charAt(0).toUpperCase()}.` : '';
    return `${lastName}, ${firstInitial}.${middleInitial}`;
  };

  const getCitation = () => {
    const auth = formatAuthorName(author);
    const t = title.trim() || 'Untitled Source';
    const pub = publisher.trim() || 'Unknown Publisher';
    const y = year.trim() || new Date().getFullYear().toString();
    const link = url.trim() || 'https://example.com';

    switch (activeStyle) {
      case 'APA':
        if (sourceType === 'website') {
          return `${auth} (${y}). ${t}. Retrieved from ${link}`;
        }
        return `${auth} (${y}). *${t}*. ${pub}.`;
      case 'MLA':
        if (sourceType === 'website') {
          return `${auth} "${t}." ${pub || 'Web'}, ${y}, ${link}.`;
        }
        return `${auth} *${t}*. ${pub}, ${y}.`;
      case 'Harvard':
        if (sourceType === 'website') {
          return `${auth}, ${y}. ${t}. Available at: <${link}> [Accessed ${new Date().toLocaleDateString()}].`;
        }
        return `${auth}, ${y}. *${t}*. ${pub}.`;
      case 'Chicago':
        if (sourceType === 'website') {
          return `${auth} "${t}." ${pub}, ${y}. ${link}.`;
        }
        return `${auth} *${t}*. ${pub}, ${y}.`;
      default:
        return '';
    }
  };

  const handleCopy = () => {
    const text = getCitation().replace(/\*/g, ''); // strip markdown italics for raw copy
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="citation-box glass-card" style={{ maxWidth: '650px', margin: '40px auto' }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', color: 'var(--text-main)' }}>
        <BookOpen size={24} color="var(--primary)" />
        Academic Bibliography & Citation Generator
      </h3>
      <p style={{ fontSize: '0.9rem', marginBottom: '20px', color: 'var(--text-muted)' }}>
        Quickly format references for your essays, papers, and dissertations. Select your style and copy the result.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div className="form-group">
          <label>Source Type</label>
          <select 
            className="form-input"
            value={sourceType}
            onChange={(e) => setSourceType(e.target.value)}
            style={{ padding: '10px 12px' }}
          >
            <option value="book">Book / Monograph</option>
            <option value="journal">Journal / Article</option>
            <option value="website">Website / Web Article</option>
          </select>
        </div>

        <div className="form-group">
          <label>Author Full Name</label>
          <input 
            type="text"
            className="form-input"
            placeholder="e.g. John Albert Smith"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>
      </div>

      <div className="form-group" style={{ marginBottom: '16px' }}>
        <label>Title</label>
        <input 
          type="text"
          className="form-input"
          placeholder="e.g. Clean Code and Academic Writing"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '20px' }}>
        <div className="form-group">
          <label>{sourceType === 'website' ? 'Website / Publisher' : 'Publisher / Journal Name'}</label>
          <input 
            type="text"
            className="form-input"
            placeholder="e.g. Oxford University Press"
            value={publisher}
            onChange={(e) => setPublisher(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Year</label>
          <input 
            type="text"
            className="form-input"
            placeholder="e.g. 2026"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </div>
      </div>

      {sourceType === 'website' && (
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label>Website URL</label>
          <input 
            type="text"
            className="form-input"
            placeholder="e.g. https://academia.edu/paper"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
      )}

      <div className="citation-tabs">
        {['APA', 'MLA', 'Harvard', 'Chicago'].map((style) => (
          <button
            key={style}
            className={`citation-tab-btn ${activeStyle === style ? 'active' : ''}`}
            onClick={() => setActiveStyle(style)}
          >
            {style} 7th
          </button>
        ))}
      </div>

      <div className="citation-output-wrapper">
        <div 
          className="citation-output"
          dangerouslySetInnerHTML={{ 
            __html: getCitation().replace(/\*(.*?)\*/g, '<em>$1</em>') 
          }} 
        />
        <button 
          className="citation-copy-btn"
          onClick={handleCopy}
          title="Copy to Clipboard"
        >
          {copied ? <Check size={16} color="var(--accent)" /> : <Copy size={16} />}
        </button>
      </div>
    </div>
  );
}
