import React from 'react';
import { motion } from 'framer-motion';
import { Award, Users, BookOpen, Star, ArrowRight, ShieldCheck, CheckCircle } from 'lucide-react';
import TiltCard from '../components/TiltCard';
import CircuCD from '../components/CircuCD';

const WRITERS = [
  {
    name: 'Ameenul Haq',
    degree: 'Senior Academic Consultant & Founder',
    university: 'Freelancer.com Gold Tier',
    rating: '5.00',
    orders: '250+',
    badge: 'Founder',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&h=400&q=80',
    specialties: ['Scientific Research', 'Technical Writing', 'Academic Consultation'],
    profileUrl: 'https://www.freelancer.com/u/ameenulhaq66'
  },
  {
    name: 'SK EXCELLENCY',
    degree: 'Premier Research Partner & Editor',
    university: 'Freelancer.com Elite Tier',
    rating: '4.99',
    orders: '163 Reviews',
    badge: 'Elite',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&h=400&q=80',
    specialties: ['Proofreading', 'Thesis Guidelines', 'Data Analysis'],
    profileUrl: 'https://www.freelancer.com/u/saminakiran2'
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

      {/* Testimonials Vinyl Player Section */}
      <section style={{ padding: '80px 0', background: '#ffffff', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: '800', letterSpacing: '2px', color: 'var(--primary)', textTransform: 'uppercase' }}>
              Student Vinyl Records
            </span>
            <h2 style={{ fontSize: '2.5rem', marginTop: '12px', marginBottom: '20px', color: '#0f172a' }}>
              Spin to Hear Client Success Audio logs
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '24px' }}>
              Click on the CD to slide it out from the sleeve, drop the needle arm, and click play to listen to verified student reviews from our economics, engineering, and literature client tracks.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(99,102,241,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 'bold' }}>
                HQ
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#475569' }}>Fully Verified client submissions &bull; Studio Grade playback</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <CircuCD />
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
                  <div className="writer-badge">{writer.badge || 'PhD'}</div>
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

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center', marginBottom: '16px' }}>
                  {writer.specialties.map((spec, i) => (
                    <span key={i} style={{ background: '#f1f5f9', color: '#475569', fontSize: '0.72rem', padding: '3px 8px', borderRadius: '4px', fontWeight: '500' }}>
                      {spec}
                    </span>
                  ))}
                </div>

                {writer.profileUrl ? (
                  <a 
                    href={writer.profileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-accent"
                    style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      gap: '6px', 
                      width: '100%', 
                      fontSize: '0.82rem', 
                      padding: '8px 12px', 
                      textDecoration: 'none',
                      background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))',
                      color: '#fff',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: '600'
                    }}
                  >
                    View Freelancer Profile
                  </a>
                ) : (
                  <button
                    className="btn-primary"
                    onClick={() => setView('order')}
                    style={{ 
                      width: '100%', 
                      fontSize: '0.82rem', 
                      padding: '8px 12px', 
                      borderRadius: 'var(--radius-sm)'
                    }}
                  >
                    Hire Writer
                  </button>
                )}
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA section */}
      <section className="container">
        <div style={{ 
          background: 'linear-gradient(135deg, var(--primary), var(--primary-hover))', 
          borderRadius: 'var(--radius-md)', 
          padding: '48px', 
          textAlign: 'center', 
          color: '#fff',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div className="glowing-mesh" style={{ top: '-100px', left: '-100px' }}></div>
          <div className="glowing-mesh" style={{ bottom: '-100px', right: '-100px', background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)' }}></div>
          
          <h2 style={{ color: '#fff', fontSize: '2.2rem', marginBottom: '16px', position: 'relative', zIndex: '2' }}>Ready to Secure Your Academic Success?</h2>
          <p style={{ color: '#cbd5e1', maxWidth: '600px', margin: '0 auto 32px auto', position: 'relative', zIndex: '2' }}>
            Create an order now and lock in a 25% discount with coupon code <strong>SAVE25</strong> on your first custom paper.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', position: 'relative', zIndex: '2' }}>
            <button className="btn-accent" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))' }} onClick={() => setView('order')}>
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
