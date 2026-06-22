import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, FileText, Star, Eye, ArrowRight, Download, Search, CheckCircle } from 'lucide-react';
import TiltCard from '../components/TiltCard';

const SAMPLE_DATA = [
  {
    id: 1,
    title: 'The Impact of Generative AI on Undergraduate Writing Curriculum',
    category: 'Creative Writing',
    grade: 'A+ (98%)',
    citations: 'APA 7th Edition',
    pages: 8,
    words: 2400,
    abstract: 'This paper examines the integration of generative AI models in higher education writing courses. It evaluates the shift from strict detection metrics to collaborative prompting strategies, offering a pedagogical framework for instructors to co-opt LLMs as brainstorming and developmental editing assistants while preserving student critical analysis and voice.',
    previewText: 'Introduction\nThe rapid emergence of large language models (LLMs) has disrupted traditional modes of assessment in higher education. Rather than enforcing strict surveillance and AI-detection tools, this study proposes a pedagogical evolution that integrates AI-prompting within the drafts process. By analyzing student cohorts, we demonstrate that when AI is utilized as a collaborative dialogue partner for outlines and citation structures, critical thinking and analysis scores increase by 14% compared to baseline essays.'
  },
  {
    id: 2,
    title: 'Corporate Financial Restructuring & Leverage Optimization',
    category: 'Accounting & Finance',
    grade: 'A (95%)',
    citations: 'Harvard Style',
    pages: 12,
    words: 3600,
    abstract: 'An empirical analysis of corporate restructuring strategies for mid-cap technology firms. The study evaluates the impact of changing leverage ratios, cost of capital adjustments, and debt-equity swaps on shareholder value maximization during periods of monetary tightening.',
    previewText: 'Research Hypothesis & Methodology\nUsing a sample of 45 publicly traded mid-cap technology firms, we model the weighted average cost of capital (WACC) against varying debt-to-equity targets. Results show that interest rate hikes alter the optimal capital structure, shifting leverage targets downward. Restructuring debt towards long-term bonds while maintaining cash reserves yields a statistically significant increase in market capitalization within 18 months.'
  },
  {
    id: 3,
    title: 'The Psychological Effects of Social Media Algorithms on Teenagers',
    category: 'Psychology',
    grade: 'A+ (97%)',
    citations: 'APA 7th Edition',
    pages: 6,
    words: 1800,
    abstract: 'This research paper synthesizes recent psychological literature surrounding algorithmic feed loops and adolescent reward systems. We map reinforcement learning loops against neurotransmitter release patterns, showing a direct correlation between screen-time exposure and anxiety metrics.',
    previewText: 'Neurochemical Feedback Loops\nAlgorithmic notification loops exploit human variable reward schedules. When content feeds are customized via predictive clustering algorithms, user engagement triggers periodic dopamine spikes followed by rapid drop-offs. Longitudinal surveys indicate that teens exposed to auto-play short-form video feeds report elevated cortisol levels, resulting in sleep disruptions and focus degradation.'
  },
  {
    id: 4,
    title: 'Post-Colonial Identity in Modern South Asian Literature',
    category: 'English Literature',
    grade: 'A (94%)',
    citations: 'MLA 9th Edition',
    pages: 10,
    words: 3000,
    abstract: 'A critical analysis of identity fragmentation, linguistic hybridity, and geographic dislocation in the works of Salman Rushdie and Arundhati Roy. The paper investigates how language is reclaimed as a vehicle for decolonizing historical narratives.',
    previewText: 'Literary Reclamation\nThe act of writing in the language of the former colonizer represents a dual subversion. Rushdie\'s linguistic hybridity operates not as a capitulation to colonial norms, but as a deliberate fracturing of English syntax to fit South Asian idioms. Roy similarly deconstructs narrative linearity, establishing a temporal fluidity that mirrors fragmented cultural memory.'
  },
  {
    id: 5,
    title: 'Machine Learning Models for Early Diagnosis of Cardio Pathology',
    category: 'Computer Sciences',
    grade: 'A+ (99%)',
    citations: 'IEEE Style',
    pages: 14,
    words: 4200,
    abstract: 'This technical study builds a convolutional neural network (CNN) model that processes ECG signals to identify early signs of myocardial ischemia. The paper demonstrates 94.2% test accuracy, highlighting the viability of real-time clinical monitoring deployments.',
    previewText: 'Neural Network Architecture & Training\nWe develop a 12-layer deep CNN model utilizing raw ECG signals. Noise reduction is handled via high-pass Butterworth filters. The network uses convolutional kernels to extract temporal feature vectors which are fed into dense layers with ReLU activation functions. Cross-entropy loss minimization indicates excellent generalized performance across multi-demographic testing sets.'
  },
  {
    id: 6,
    title: 'Supply Chain Resilience and Global Logistics Disruptions',
    category: 'Business & Management',
    grade: 'A (96%)',
    citations: 'Chicago Style',
    pages: 7,
    words: 2100,
    abstract: 'Investigating the efficacy of near-shoring and multi-sourcing supply strategies in mitigating logistics delays. Using case studies from automotive manufacturing, we compare cost overheads against risk premiums.',
    previewText: 'Risk Premium Modeling\nTraditional supply chain models prioritize just-in-time (JIT) efficiency, exposing companies to massive disruptions during maritime trade chokepoint delays. By modeling inventory buffer variables, this paper shows that maintaining a diversified 3-source supplier base (near-shore, mid-shore, off-shore) reduces recovery times by 68% while increasing unit costs by only 4.5%.'
  }
];

const CATEGORIES = ['All', 'Creative Writing', 'Accounting & Finance', 'Psychology', 'English Literature', 'Computer Sciences', 'Business & Management'];

export default function WorkSamples({ setView, onOrderRedirect }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePreviewSample, setActivePreviewSample] = useState(null);

  const filteredSamples = SAMPLE_DATA.filter(sample => {
    const matchesCategory = selectedCategory === 'All' || sample.category === selectedCategory;
    const matchesSearch = sample.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sample.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sample.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOrderRedirectWithCategory = (category) => {
    // Pass pre-filled discipline state
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
            Vetted Academic <span className="gradient-text">Work Samples</span>
          </h1>
          <p style={{ maxWidth: '650px', margin: '0 auto', fontSize: '1.08rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            Review high-grade mock papers and study references across multiple disciplines. Our writers produce original, perfectly formatted, and well-researched models.
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
          {/* Search Box */}
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search samples by topic, subject, or abstract keywords..." 
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

          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
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
                  {/* Card Header Tag & Score */}
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
                      fontSize: '0.85rem', 
                      fontWeight: '800',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <CheckCircle size={14} /> {sample.grade}
                    </span>
                  </div>

                  {/* Sample Title */}
                  <h3 style={{ fontSize: '1.18rem', margin: '0 0 12px 0', color: 'var(--text-main)', lineHeight: '1.4' }}>
                    {sample.title}
                  </h3>

                  {/* Metadata Row */}
                  <div style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
                    <span>Citations: <strong>{sample.citations}</strong></span>
                    <span>Length: <strong>{sample.pages} Pages</strong></span>
                  </div>

                  {/* Abstract Abstract */}
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 20px 0', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {sample.abstract}
                  </p>
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
                    <Eye size={16} /> Preview Paper
                  </button>
                  <button
                    onClick={() => handleOrderRedirectWithCategory(sample.category)}
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
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Order Similar <ArrowRight size={14} />
                  </button>
                </div>
              </TiltCard>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 0', background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '16px' }}>
            <FileText size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
            <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-main)' }}>No Samples Found</h3>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Try modifying your search queries or selecting another discipline tab.</p>
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
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
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
                maxWidth: '750px',
                maxHeight: '85vh',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 'var(--shadow-xl)',
                overflow: 'hidden'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div style={{ padding: '24px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ background: 'var(--primary-light)', color: 'var(--primary)', fontSize: '0.72rem', padding: '3px 8px', borderRadius: '4px', fontWeight: '700' }}>
                      {activePreviewSample.category}
                    </span>
                    <span style={{ color: '#10b981', fontSize: '0.78rem', fontWeight: '700' }}>
                      Score: {activePreviewSample.grade}
                    </span>
                  </div>
                  <h2 style={{ fontSize: '1.38rem', margin: 0, color: 'var(--text-main)', lineHeight: '1.4' }}>
                    {activePreviewSample.title}
                  </h2>
                </div>
                <button
                  onClick={() => setActivePreviewSample(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  &times;
                </button>
              </div>

              {/* Modal Body (Scrollable) */}
              <div style={{ padding: '24px', overflowY: 'auto', flex: 1, boxSizing: 'border-box' }}>
                {/* Abstract Section */}
                <h4 style={{ margin: '0 0 8px 0', fontSize: '0.95rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Abstract</h4>
                <p style={{ margin: '0 0 24px 0', fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: '1.6', background: 'var(--bg-main)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
                  {activePreviewSample.abstract}
                </p>

                {/* Excerpt Section */}
                <h4 style={{ margin: '0 0 8px 0', fontSize: '0.95rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px' }}>Excerpt / Preview</h4>
                <pre style={{ 
                  margin: 0, 
                  fontSize: '0.88rem', 
                  color: 'var(--text-muted)', 
                  lineHeight: '1.6', 
                  whiteSpace: 'pre-wrap', 
                  fontFamily: 'inherit',
                  background: 'var(--bg-main)',
                  padding: '16px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-light)'
                }}>
                  {activePreviewSample.previewText}
                </pre>
              </div>

              {/* Modal Footer Actions */}
              <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'flex-end', gap: '12px', background: 'var(--bg-main)' }}>
                <button
                  onClick={() => setActivePreviewSample(null)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-light)',
                    background: 'var(--bg-card)',
                    color: 'var(--text-main)',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Close Preview
                </button>
                <button
                  onClick={() => {
                    setActivePreviewSample(null);
                    handleOrderRedirectWithCategory(activePreviewSample.category);
                  }}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'var(--accent)',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer'
                  }}
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
