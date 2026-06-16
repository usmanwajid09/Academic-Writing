import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Award, BookOpen, Layers, Edit3, ArrowRight, Shield, Zap } from 'lucide-react';
import VortexGallery from '../components/VortexGallery';
import CitationGenerator from '../components/CitationGenerator';

const SERVICES = [
  {
    icon: <FileText size={32} color="var(--primary)" />,
    title: 'Custom Essay Writing',
    description: 'From argumentative essays to admission statements, our writers craft structured, persuasive essays that follow proper thesis development and flow.',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&h=380&q=80',
    details: ['Admission & Application Essays', 'Narrative & Descriptive Essays', 'Analytical & Persuasive Papers', 'Scholarship Essays']
  },
  {
    icon: <BookOpen size={32} color="#a855f7" />,
    title: 'Research Papers & Literature Reviews',
    description: 'Deep qualitative or quantitative investigations complete with bibliography collections, empirical analysis, and standard citation mappings.',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&h=380&q=80',
    details: ['APA, MLA, Harvard, Chicago styles', 'Literature Review Synthesis', 'Methodology & Research Design', 'Data Analysis & Findings']
  },
  {
    icon: <Layers size={32} color="var(--accent)" />,
    title: 'Case Studies & Business Reports',
    description: 'Thorough real-world business analyzes, marketing breakdowns, and accounting evaluations focusing on critical bottlenecks and proposed implementations.',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&h=380&q=80',
    details: ['SWOT & PESTLE Analyzes', 'Corporate Financial Audits', 'Strategic Marketing Solutions', 'Executive Summary Writing']
  },
  {
    icon: <Award size={32} color="#ec4899" />,
    title: 'Dissertations & Thesis Guidelines',
    description: 'Exacting postgraduate, doctoral, and master-level works compiled section-by-section. We support outlines, proposals, and final defenses.',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&h=380&q=80',
    details: ['Thesis Proposals & Abstracts', 'Theoretical Framework Formulations', 'Statistical Data Processing', 'Discussion & Policy Outlines']
  },
  {
    icon: <Edit3 size={32} color="#f97316" />,
    title: 'Editing & Professional Proofreading',
    description: 'Enhance your drafted documents. Our native ENL editors correct grammar syntax, check bibliography linkages, adjust tone registers, and strip plagiarism.',
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=600&h=380&q=80',
    details: ['Grammar & Punctuation Cleanups', 'Academic Tone Alignment', 'Formatting & Citation Checks', 'AI Detector Plagiarism Scans']
  }
];

export default function Services({ setView }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80, damping: 15 } }
  };

  return (
    <div style={{ padding: '60px 0', background: '#fafbfc' }}>
      {/* Header Banner */}
      <section className="container" style={{ textAlign: 'center', marginBottom: '70px' }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span style={{ fontSize: '0.85rem', fontWeight: '800', letterSpacing: '2px', color: 'var(--primary)', textTransform: 'uppercase' }}>
            What We Offer
          </span>
          <h1 style={{ fontSize: '3rem', marginTop: '12px', marginBottom: '20px', color: '#0f172a' }}>
            Academic Services <span className="gradient-text">Designed to Excel</span>
          </h1>
          <p style={{ maxWidth: '650px', margin: '0 auto', fontSize: '1.1rem', color: 'var(--text-muted)' }}>
            We provide custom academic assistance in over 75 subjects. Each paper is tailored to your exact prompt requirements and academic level.
          </p>
        </motion.div>
      </section>

      {/* 3D Vortex Spin Gallery Showcase */}
      <section style={{ marginBottom: '80px', overflow: 'hidden' }}>
        <div className="container" style={{ textAlign: 'center', marginBottom: '24px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--accent)', letterSpacing: '1px', textTransform: 'uppercase' }}>
            3D Interactive Showcase
          </span>
          <h2 style={{ fontSize: '2rem', marginTop: '6px', color: '#0f172a' }}>
            Explore Popular Academic Formats
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Drag left/right to spin the vortex cylinder and discover our writing catalog.
          </p>
        </div>
        <VortexGallery onSelect={() => setView('order')} />
      </section>

      {/* Services Grid (Staggered Layouts) */}
      <section className="container" style={{ marginBottom: '80px' }}>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}
        >
          {SERVICES.map((service, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <motion.div 
                key={idx}
                variants={cardVariants}
                className="glass-card"
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                  gap: '40px',
                  padding: '40px',
                  alignItems: 'center',
                  background: '#fff',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-lg)'
                }}
              >
                {/* Photo Col */}
                <div style={{ order: isEven ? 1 : 2 }}>
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    style={{ 
                      width: '100%', 
                      maxHeight: '280px', 
                      objectFit: 'cover', 
                      borderRadius: 'var(--radius-md)',
                      boxShadow: 'var(--shadow-md)'
                    }} 
                  />
                </div>

                {/* Text Col */}
                <div style={{ order: isEven ? 2 : 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                    <div style={{ padding: '12px', background: 'rgba(99,102,241,0.06)', borderRadius: '12px' }}>
                      {service.icon}
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.6rem', color: '#0f172a' }}>{service.title}</h3>
                  </div>

                  <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
                    {service.description}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '30px' }}>
                    {service.details.map((detail, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', fontWeight: '500' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)' }}></div>
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>

                  <button 
                    className="btn-primary" 
                    onClick={() => setView('order')}
                    style={{ fontSize: '0.9rem', padding: '10px 24px' }}
                  >
                    Order {service.title.split(' ').slice(-1)} <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Citation Generator Section */}
      <section className="container" style={{ marginBottom: '80px' }}>
        <CitationGenerator />
      </section>

      {/* Feature stats summary */}
      <section style={{ background: 'linear-gradient(180deg, #fafbfc, #f1f5f9)', padding: '60px 0', borderTop: '1px solid var(--border-light)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ color: 'var(--primary)', padding: '8px', background: '#fff', borderRadius: '8px', height: 'fit-content', boxShadow: 'var(--shadow-sm)' }}>
              <Shield size={24} />
            </div>
            <div>
              <h4 style={{ marginBottom: '6px', color: '#0f172a' }}>100% Confidentiality</h4>
              <p style={{ fontSize: '0.9rem' }}>We encrypt all traffic and never share files or student registrations with third parties or writers.</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ color: 'var(--accent)', padding: '8px', background: '#fff', borderRadius: '8px', height: 'fit-content', boxShadow: 'var(--shadow-sm)' }}>
              <Zap size={24} />
            </div>
            <div>
              <h4 style={{ marginBottom: '6px', color: '#0f172a' }}>8-Hour Urgent Delivery</h4>
              <p style={{ fontSize: '0.9rem' }}>Tight deadlines are our specialty. Our writing team operates 24/7 to cover overnight deliverables.</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ color: '#ec4899', padding: '8px', background: '#fff', borderRadius: '8px', height: 'fit-content', boxShadow: 'var(--shadow-sm)' }}>
              <Layers size={24} />
            </div>
            <div>
              <h4 style={{ marginBottom: '6px', color: '#0f172a' }}>All Citation Formats</h4>
              <p style={{ fontSize: '0.9rem' }}>APA 7, MLA 9, Harvard, Oxford, Chicago. Our papers are fully standard aligned with reference lists.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
