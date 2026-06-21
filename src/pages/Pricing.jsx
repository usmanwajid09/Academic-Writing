import React from 'react';
import { motion } from 'framer-motion';
import Calculator, { PRICING_MATRIX, DEADLINE_LABELS } from '../components/Calculator';
import { Tag, Check, HelpCircle, ShieldAlert, Award } from 'lucide-react';

export default function Pricing({ onOrderRedirect, setView }) {
  const levels = [
    { key: 'highschool', name: 'High School' },
    { key: 'undergrad_1_2', name: 'Undergraduate (Yr 1-2)' },
    { key: 'undergrad_3_4', name: 'Undergraduate (Yr 3-4)' },
    { key: 'masters', name: "Master's Degree" },
    { key: 'doctoral', name: 'Doctoral / PhD' }
  ];

  const deadlines = ['14d', '7d', '5d', '3d', '24h', '8h'];

  return (
    <div style={{ padding: '60px 0', background: '#fafbfc' }}>
      {/* Page Header */}
      <section className="container" style={{ textAlign: 'center', marginBottom: '60px' }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span style={{ fontSize: '0.85rem', fontWeight: '800', letterSpacing: '2px', color: 'var(--primary)', textTransform: 'uppercase' }}>
            PRICING GUIDE
          </span>
          <h1 style={{ fontSize: '3rem', marginTop: '12px', marginBottom: '20px', color: '#0f172a' }}>
            Transparent, Student-Friendly <span className="gradient-text">Rates</span>
          </h1>
          <p style={{ maxWidth: '650px', margin: '0 auto', fontSize: '1.1rem', color: 'var(--text-muted)' }}>
            No hidden fees, no automatic subscriptions. Calculate your exact price page-by-page before placing your order.
          </p>
        </motion.div>
      </section>

      {/* Main Section: Grid of Calculator and Info */}
      <section className="container" style={{ marginBottom: '80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'start' }}>
          {/* Discount and calculator info */}
          <div>
            <div 
              style={{ 
                background: 'var(--accent-light)', 
                border: '1px solid var(--accent)',
                borderRadius: '16px',
                padding: '28px',
                marginBottom: '32px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent)', marginBottom: '12px' }}>
                <Tag size={20} />
                <h4 style={{ margin: 0, fontWeight: '700' }}>WELCOME DISCOUNT ACTIVE</h4>
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '8px', color: '#0f172a' }}>Get 25% Off First Order</h3>
              <p style={{ fontSize: '0.92rem', marginBottom: '16px' }}>
                Apply coupon code <strong style={{ color: 'var(--accent)' }}>SAVE25</strong> at checkout to slash 25% off your subtotal. Valid for all academic levels and subjects.
              </p>
              <button className="btn-accent" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))', padding: '10px 24px', fontSize: '0.88rem' }} onClick={() => setView('order')}>
                Order With 25% Off
              </button>
            </div>

            <h3 style={{ marginBottom: '16px', color: '#0f172a' }}>What Influences the Price?</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', marginTop: '8px' }}></div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', color: '#0f172a', marginBottom: '4px' }}>Deadline Urgency</h4>
                  <p style={{ fontSize: '0.88rem' }}>Orders placed with 14-day deadlines have our lowest rates. Urgent 8-hour delivery incurs additional surcharges due to expedited researcher assignment.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', marginTop: '8px' }}></div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', color: '#0f172a', marginBottom: '4px' }}>Page Spacing</h4>
                  <p style={{ fontSize: '0.88rem' }}>Double-spaced pages contain ~300 words. Single-spaced pages contain ~600 words. Opting for single-spacing double-pages the price but contains twice the analytical depth.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', marginTop: '8px' }}></div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', color: '#0f172a', marginBottom: '4px' }}>Writer Vetting Tier</h4>
                  <p style={{ fontSize: '0.88rem' }}>Select standard (top native writer), advanced (+25% fee for top-rated specialists), or ENL (+30% fee for elite university editors).</p>
                </div>
              </div>
            </div>
          </div>

          {/* Calculator Embed Container */}
          <div className="neon-border-card" id="pricing-calculator">
            <div className="neon-border-card-inner" style={{ padding: '8px' }}>
              <Calculator onOrderRedirect={onOrderRedirect} />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Rates Table Grid */}
      <section className="container" style={{ marginBottom: '80px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '32px', color: '#0f172a' }}>Standard Base Rates (USD / Page)</h2>
        <div style={{ overflowX: 'auto', border: '1px solid var(--border-light)', borderRadius: '12px', background: '#fff', boxShadow: 'var(--shadow-sm)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border-light)' }}>
                <th style={{ padding: '16px 20px', fontWeight: '700', color: '#475569' }}>Academic Level</th>
                {deadlines.map(d => (
                  <th key={d} style={{ padding: '16px 20px', fontWeight: '700', color: '#475569' }}>{DEADLINE_LABELS[d]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {levels.map((lvl, idx) => (
                <tr key={lvl.key} style={{ borderBottom: idx < levels.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
                  <td style={{ padding: '18px 20px', fontWeight: '600', color: '#0f172a' }}>{lvl.name}</td>
                  {deadlines.map(d => {
                    const price = PRICING_MATRIX[lvl.key][d] || '-';
                    return (
                      <td key={d} style={{ padding: '18px 20px', fontWeight: '500', color: 'var(--text-main)' }}>
                        ${price.toFixed(2)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ textAlign: 'center', fontSize: '0.82rem', marginTop: '16px', color: 'var(--text-muted)' }}>
          * Prices shown represent Double-Spaced formatting (~300 words/page) with a Standard level writer.
        </p>
      </section>

      {/* Free inclusions card list */}
      <section className="container">
        <div className="glass-card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', padding: '40px', background: '#fff' }}>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--accent)', letterSpacing: '1px' }}>FREE EXTRAS</span>
            <h3 style={{ marginTop: '6px', marginBottom: '12px' }}>Included Free With Every Order</h3>
            <p>Every paper comes loaded with standard structural inclusions that competitor services charge extra for.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Check size={18} color="var(--accent)" /> <span>APA/MLA Title Page ($5.00 Value)</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Check size={18} color="var(--accent)" /> <span>References & Works Cited list ($15.00 Value)</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Check size={18} color="var(--accent)" /> <span>Outlines & Abstract templates ($15.00 Value)</span></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Check size={18} color="var(--accent)" /> <span>Plagiarism Verification Report ($10.00 Value)</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Check size={18} color="var(--accent)" /> <span>Formatting & Margin adjustments ($10.00 Value)</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Check size={18} color="var(--accent)" /> <span>Revisions within 14-30 Days ($10.00 Value)</span></div>
          </div>
        </div>
      </section>
    </div>
  );
}
