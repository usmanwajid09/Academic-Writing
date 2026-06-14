import React from 'react';
import { motion } from 'framer-motion';
import { Award, Users, BookOpen, Star, ArrowRight, ShieldCheck, CheckCircle } from 'lucide-react';
import TiltCard from '../components/TiltCard';

const WRITERS = [
  {
    name: 'Dr. Sarah Jenkins',
    degree: 'PhD in English Literature',
    university: 'Oxford University',
    rating: '4.98',
    orders: '1,420+',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&h=400&q=80',
    specialties: ['Comparative Literature', 'Creative Writing', 'Shakespeare Studies']
  },
  {
    name: 'Prof. David Miller',
    degree: 'MA in Economics & Finance',
    university: 'Chicago Booth',
    rating: '4.95',
    orders: '980+',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&h=400&q=80',
    specialties: ['Econometrics', 'Macroeconomic Policy', 'Market Analysis']
  },
  {
    name: 'Dr. Elena Rostova',
    degree: 'PhD in Computer Science',
    university: 'MIT',
    rating: '4.99',
    orders: '1,120+',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&h=400&q=80',
    specialties: ['Machine Learning', 'Cybersecurity', 'Algorithm Design']
  },
  {
    name: 'James O\'Connor',
    degree: 'MSc in Modern History',
    university: 'Trinity College Dublin',
    rating: '4.92',
    orders: '750+',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=400&q=80',
    specialties: ['European History', 'Political Science', 'Historiography']
  }
];

export default function About({ setView }) {
  // Stagger animation container
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div style={{ padding: '60px 0', background: '#fafbfc' }}>
      {/* Intro Banner */}
      <section className="container" style={{ marginBottom: '80px', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span style={{ fontSize: '0.85rem', fontWeight: '800', letterSpacing: '2px', color: 'var(--primary)', textTransform: 'uppercase' }}>
            Who We Are
          </span>
          <h1 style={{ fontSize: '3rem', marginTop: '12px', marginBottom: '24px', color: '#0f172a' }}>
            Elevating Academic Standards <br/>
            <span className="gradient-text">Since 2012</span>
          </h1>
          <p style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.15rem', color: 'var(--text-muted)' }}>
            We connect ambitious students worldwide with vetted Master's and PhD level scholars to co-create premium academic papers, assignments, and structural guides.
          </p>
        </motion.div>
      </section>

      {/* Grid of Stats */}
      <section className="container" style={{ marginBottom: '85px' }}>
        <motion.div 
          className="responsive-grid-stats" 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}
        >
          {[
            { value: '14+ Years', label: 'Helping students succeed' },
            { value: '800+', label: 'PhD & MA writers on standby' },
            { value: '12,500+', label: 'Active returning clients' },
            { value: '100%', label: 'Confidentiality and originality' }
          ].map((stat, idx) => (
            <motion.div 
              key={idx} 
              variants={itemVariants}
              className="glass-card" 
              style={{ textAlign: 'center', background: '#fff' }}
            >
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '8px' }}>
                {stat.value}
              </div>
              <p style={{ margin: 0, fontWeight: '500' }}>{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Story Section */}
      <section style={{ padding: '80px 0', background: 'linear-gradient(180deg, #fff, #f1f5f9)', borderTop: '1px solid var(--border-light)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px', alignItems: 'center' }}>
          {/* Real Unsplash photo instead of AI */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=700&q=80" 
              alt="Students collaborating" 
              style={{ width: '100%', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', objectFit: 'cover', maxHeight: '400px' }}
            />
          </motion.div>
          
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--accent)', letterSpacing: '1px' }}>OUR MISSION</span>
            <h2 style={{ marginTop: '8px', marginBottom: '20px', color: '#0f172a' }}>Real Vetted Academics, Not Automations</h2>
            <p style={{ marginBottom: '16px' }}>
              Unlike generic AI tools that hallucinate data, copy-paste clichés, and lack logical structure, we believe that academic research is an art form. Our scholars read source materials, analyze actual spreadsheets, outline arguments, and structure documents from scratch.
            </p>
            <p style={{ marginBottom: '24px' }}>
              Every outline, bibliography, draft, and dissertation we deliver undergoes manual vetting by our Quality Control panel, ensuring it matches high-level grading criteria and custom formatting rubrics (APA, MLA, Chicago, Oxford, Harvard, etc.).
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
                <CheckCircle size={18} color="var(--primary)" />
                <span>Top 2% Native English Writers Vetted Rigorously</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
                <CheckCircle size={18} color="var(--primary)" />
                <span>Dual Plagiarism checks (Turnitin & PlagScan compatible)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
                <CheckCircle size={18} color="var(--primary)" />
                <span>Unlimited Free revisions for 14-30 days</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Writers Showcase Section */}
      <section className="container" style={{ padding: '80px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)', letterSpacing: '1px' }}>EXPERT AUTHORS</span>
          <h2 style={{ marginTop: '8px', marginBottom: '16px' }}>Meet Our Top Rated Academic Writers</h2>
          <p style={{ maxWidth: '600px', margin: '0 auto' }}>
            We only assign specialists who hold degrees matching your exact area of study. Here are some of our most requested native writers.
          </p>
        </div>

        <motion.div 
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '30px' }}
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
        >
          {WRITERS.map((writer, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <TiltCard className="writer-card" style={{ height: '100%' }}>
                <div className="writer-avatar-wrapper">
                  <img 
                    src={writer.avatar} 
                    alt={writer.name} 
                    className="writer-avatar" 
                  />
                  <div className="writer-badge">PhD</div>
                </div>
                
                <h4 style={{ fontSize: '1.2rem', marginBottom: '4px', color: '#0f172a' }}>{writer.name}</h4>
                <p style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--primary)', marginBottom: '12px' }}>{writer.degree}</p>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Graduated: {writer.university}</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-around', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)', padding: '10px 0', marginBottom: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', fontWeight: '700' }}>
                      <Star size={14} fill="#fbbf24" color="#fbbf24" /> {writer.rating}
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Rating</span>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a' }}>{writer.orders}</div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Completed</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center' }}>
                  {writer.specialties.map((spec, i) => (
                    <span key={i} style={{ background: '#f1f5f9', color: '#475569', fontSize: '0.72rem', padding: '3px 8px', borderRadius: '4px', fontWeight: '500' }}>
                      {spec}
                    </span>
                  ))}
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA section */}
      <section className="container">
        <div style={{ 
          background: 'linear-gradient(135deg, #1e1b4b, #311042)', 
          borderRadius: 'var(--radius-md)', 
          padding: '48px', 
          textAlign: 'center', 
          color: '#fff',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div className="glowing-mesh" style={{ top: '-100px', left: '-100px' }}></div>
          <div className="glowing-mesh" style={{ bottom: '-100px', right: '-100px', background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)' }}></div>
          
          <h2 style={{ color: '#fff', fontSize: '2.2rem', marginBottom: '16px', position: 'relative', zIndex: '2' }}>Ready to Secure Your Academic Success?</h2>
          <p style={{ color: '#cbd5e1', maxWidth: '600px', margin: '0 auto 32px auto', position: 'relative', zIndex: '2' }}>
            Create an order now and lock in a 25% discount with coupon code <strong>SAVE25</strong> on your first custom paper.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', position: 'relative', zIndex: '2' }}>
            <button className="btn-accent" style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)' }} onClick={() => setView('order')}>
              Order Now <ArrowRight size={16} />
            </button>
            <button className="btn-secondary" style={{ color: '#fff', borderColor: '#fff' }} onClick={() => setView('pricing')}>
              Calculate Price
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
