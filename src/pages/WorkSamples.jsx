import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Eye, ArrowRight, Download, Search, CheckCircle, Presentation } from 'lucide-react';
import TiltCard from '../components/TiltCard';
import { SAMPLE_DATA, SAMPLE_CATEGORIES } from '../data/samples';

// Open a hosted document. PDFs preview inline; Word docs open in the Microsoft Office viewer.
function viewerUrl(sample) {
  const abs = `${window.location.origin}/${sample.file}`;
  if (sample.ext === 'pdf') return abs;
  return `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(abs)}`;
}

export default function WorkSamples({ setView, onOrderRedirect }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePreviewSample, setActivePreviewSample] = useState(null);

  const filteredSamples = SAMPLE_DATA.filter(sample => {
    const matchesCategory = selectedCategory === 'All' || sample.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch = sample.title.toLowerCase().includes(q) ||
                          sample.category.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const handleOrderRedirectWithCategory = (category) => {
    onOrderRedirect({ discipline: category });
  };

  return (
    <div style={{ padding: '60px 0', background: 'var(--bg-main)', minHeight: '80vh' }}>
      <div className="container">
        {/* Page Title Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: '800', letterSpacing: '2px', color: 'var(--primary)', textTransform: 'uppercase' }}>
            Academic Excellence Showcase
          </span>
          <h1 style={{ fontSize: '2.8rem', marginTop: '12px', marginBottom: '20px', color: 'var(--text-main)' }}>
            Real Academic <span className="gradient-text">Work Samples</span>
          </h1>
          <p style={{ maxWidth: '650px', margin: '0 auto', fontSize: '1.08rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            Browse genuine papers, dissertations, reports, and presentations completed by our writers.
            Preview any sample in your browser or download the full document.
          </p>
        </div>

        {/* Filter and Search Bar Row */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-light)',
          padding: '20px',
          borderRadius: '16px',
          marginBottom: '40px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search samples by topic or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 46px',
                borderRadius: '10px',
                border: '1px solid var(--border-light)',
                background: 'var(--bg-main)',
                color: 'var(--text-main)',
                fontSize: '0.95rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {SAMPLE_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: selectedCategory === cat ? 'var(--primary)' : 'var(--border-light)',
                  background: selectedCategory === cat ? 'var(--primary)' : 'var(--bg-main)',
                  color: selectedCategory === cat ? '#ffffff' : 'var(--text-main)',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Samples Grid */}
        {filteredSamples.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '30px'
          }}>
            {filteredSamples.map(sample => (
              <TiltCard
                key={sample.id}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-light)',
                  borderRadius: '16px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                  boxSizing: 'border-box'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span style={{
                      background: 'var(--accent-light)',
                      color: 'var(--accent)',
                      fontSize: '0.72rem',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontWeight: '700'
                    }}>
                      {sample.category}
                    </span>
                    <span style={{
                      color: '#10b981',
                      fontSize: '0.8rem',
                      fontWeight: '800',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <CheckCircle size={14} /> Verified
                    </span>
                  </div>

                  {/* Document icon + Title */}
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '10px', padding: '10px', display: 'flex', flexShrink: 0 }}>
                      {sample.type === 'Presentation' ? <Presentation size={20} /> : <FileText size={20} />}
                    </div>
                    <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--text-main)', lineHeight: '1.4' }}>
                      {sample.title}
                    </h3>
                  </div>

                  <div style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
                    <span>Type: <strong>{sample.type}</strong></span>
                    <span>Format: <strong>{sample.ext.toUpperCase()}</strong></span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
                  <button
                    onClick={() => setActivePreviewSample(sample)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-light)',
                      background: 'var(--bg-main)',
                      color: 'var(--text-main)',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Eye size={16} /> Preview
                  </button>
                  <a
                    href={`/${sample.file}`}
                    download
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'var(--accent)',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Download size={15} /> Download
                  </a>
                </div>
              </TiltCard>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 0', background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '16px' }}>
            <FileText size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
            <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-main)' }}>No Samples Found</h3>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Try modifying your search or selecting another discipline tab.</p>
          </div>
        )}
      </div>

      {/* Preview Modal Overlay */}
      <AnimatePresence>
        {activePreviewSample && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(9, 13, 22, 0.75)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1100,
              padding: '20px'
            }}
            onClick={() => setActivePreviewSample(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-light)',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '900px',
                height: '88vh',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 'var(--shadow-lg)',
                overflow: 'hidden'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                <div style={{ minWidth: 0 }}>
                  <span style={{ background: 'var(--primary-light)', color: 'var(--primary)', fontSize: '0.72rem', padding: '3px 8px', borderRadius: '4px', fontWeight: '700' }}>
                    {activePreviewSample.category}
                  </span>
                  <h2 style={{ fontSize: '1.2rem', margin: '8px 0 0 0', color: 'var(--text-main)', lineHeight: '1.3', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {activePreviewSample.title}
                  </h2>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexShrink: 0 }}>
                  <a
                    href={`/${activePreviewSample.file}`}
                    download
                    className="btn-accent"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', padding: '8px 14px', borderRadius: '8px', textDecoration: 'none' }}
                  >
                    <Download size={15} /> Download
                  </a>
                  <button
                    onClick={() => setActivePreviewSample(null)}
                    style={{ background: 'none', border: 'none', fontSize: '1.6rem', color: 'var(--text-muted)', cursor: 'pointer', lineHeight: 1 }}
                  >
                    &times;
                  </button>
                </div>
              </div>

              {/* Modal Body: embedded document viewer */}
              <div style={{ flex: 1, background: '#525659', position: 'relative' }}>
                <iframe
                  title={activePreviewSample.title}
                  src={viewerUrl(activePreviewSample)}
                  style={{ width: '100%', height: '100%', border: 'none' }}
                />
              </div>

              {/* Modal Footer Actions */}
              <div style={{ padding: '14px 24px', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', background: 'var(--bg-main)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Need something similar? Our writers can produce an original paper on this topic.
                </span>
                <button
                  onClick={() => {
                    setActivePreviewSample(null);
                    handleOrderRedirectWithCategory(activePreviewSample.category);
                  }}
                  className="btn-accent"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', padding: '10px 20px', borderRadius: '8px', flexShrink: 0 }}
                >
                  Order Similar Paper <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
