import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, Layers, FileText } from 'lucide-react';

export const PRICING_MATRIX = {
  highschool: { '14d': 10, '7d': 14, '5d': 16, '3d': 18, '2d': 20, '24h': 24, '8h': 26 },
  undergrad_1_2: { '14d': 18, '7d': 20, '5d': 21, '3d': 22, '2d': 23, '24h': 24, '8h': 27 },
  undergrad_3_4: { '14d': 20, '7d': 22, '5d': 23, '3d': 24, '2d': 25, '24h': 26, '8h': 28 },
  masters: { '14d': 24, '7d': 26, '5d': 27, '3d': 27.5, '2d': 28, '24h': 29, '8h': 30 },
  doctoral: { '14d': 26, '7d': 28, '5d': 29, '3d': 30, '2d': 31, '24h': 32, '8h': 34 }
};

export const DEADLINE_LABELS = {
  '14d': '14 Days',
  '7d': '7 Days',
  '5d': '5 Days',
  '3d': '3 Days',
  '2d': '2 Days',
  '24h': '24 Hours',
  '8h': '8 Hours'
};

export default function Calculator({ onOrderRedirect }) {
  const [level, setLevel] = useState('highschool');
  const [paperType, setPaperType] = useState('Essay (any type)');
  const [deadline, setDeadline] = useState('14d');
  const [pages, setPages] = useState(1);
  const [spacing, setSpacing] = useState('double'); // double or single
  const [pricePerPage, setPricePerPage] = useState(10);
  const [totalPrice, setTotalPrice] = useState(10);

  useEffect(() => {
    let rate = PRICING_MATRIX[level][deadline] || 10;
    
    // Single spacing doubles the price since it is double the word density (600 words vs 300 words per page)
    if (spacing === 'single') {
      rate = rate * 2;
    }
    
    setPricePerPage(rate);
    setTotalPrice(rate * pages);
  }, [level, deadline, pages, spacing]);

  const handleOrder = () => {
    onOrderRedirect({
      academic_level: level,
      paper_type: paperType,
      deadline_key: deadline,
      page_qty: pages,
      spacing: spacing,
      total_price: totalPrice
    });
  };

  return (
    <motion.div 
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={styles.container} 
      className="glass-card" 
      id="calculator-sec"
    >
      <div style={styles.cardHeader}>
        <Sparkles size={20} color="var(--primary)" />
        <h3 style={styles.cardTitle}>Calculate Order Price</h3>
        <span style={styles.discountBadge}>30% OFF First Order</span>
      </div>

      <div className="responsive-grid-calc">
        {/* Paper Type */}
        <div className="form-group">
          <label><FileText size={16} /> Type of Paper</label>
          <select 
            value={paperType} 
            onChange={(e) => setPaperType(e.target.value)}
            className="form-input"
            style={styles.select}
          >
            <option>Essay (any type)</option>
            <option>Admission Essay</option>
            <option>Research Paper</option>
            <option>Coursework</option>
            <option>Case Study</option>
            <option>Literature Review</option>
            <option>Dissertation</option>
            <option>Book/Movie Review</option>
          </select>
        </div>

        {/* Academic Level */}
        <div className="form-group">
          <label><Layers size={16} /> Academic Level</label>
          <select 
            value={level} 
            onChange={(e) => setLevel(e.target.value)}
            className="form-input"
            style={styles.select}
          >
            <option value="highschool">High School</option>
            <option value="undergrad_1_2">Undergrad (yrs 1-2)</option>
            <option value="undergrad_3_4">Undergrad (yrs 3-4)</option>
            <option value="masters">Master's</option>
            <option value="doctoral">Doctoral</option>
          </select>
        </div>

        {/* Deadline */}
        <div className="form-group">
          <label><Calendar size={16} /> Deadline</label>
          <select 
            value={deadline} 
            onChange={(e) => setDeadline(e.target.value)}
            className="form-input"
            style={styles.select}
          >
            {Object.entries(DEADLINE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        {/* Page quantity */}
        <div className="form-group">
          <label>Pages & Words</label>
          <div style={styles.counterRow}>
            <button 
              type="button" 
              onClick={() => setPages(p => Math.max(1, p - 1))}
              style={styles.counterBtn}
            >-</button>
            <span style={styles.counterValue}>{pages} Page{pages > 1 ? 's' : ''} ({pages * (spacing === 'single' ? 600 : 300)} words)</span>
            <button 
              type="button" 
              onClick={() => setPages(p => p + 1)}
              style={styles.counterBtn}
            >+</button>
          </div>
        </div>
      </div>

      {/* Spacing selector */}
      <div style={styles.spacingRow}>
        <span style={styles.spacingLabel}>Spacing:</span>
        <div style={styles.spacingGroup}>
          <button 
            type="button"
            onClick={() => setSpacing('double')}
            style={spacing === 'double' ? styles.spacingActiveBtn : styles.spacingBtn}
          >
            Double Spacing (300 words/page)
          </button>
          <button 
            type="button"
            onClick={() => setSpacing('single')}
            style={spacing === 'single' ? styles.spacingActiveBtn : styles.spacingBtn}
          >
            Single Spacing (600 words/page)
          </button>
        </div>
      </div>

      {/* Pricing Summary */}
      <div style={styles.pricingSection}>
        <div style={styles.rateCol}>
          <span style={styles.rateLabel}>Price per page:</span>
          <motion.span 
            key={pricePerPage}
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            style={styles.rateValue}
          >
            ${pricePerPage.toFixed(2)}
          </motion.span>
        </div>
        <div style={styles.totalCol}>
          <span style={styles.totalLabel}>Estimated Total:</span>
          <div style={styles.priceRow}>
            <motion.span 
              key={totalPrice}
              initial={{ scale: 0.8, y: -5, opacity: 0.5 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              style={styles.totalValue}
            >
              ${totalPrice.toFixed(2)}
            </motion.span>
            <span style={styles.discountText}>Save 25% with SAVE25</span>
          </div>
        </div>
        <motion.button 
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="btn-accent" 
          onClick={handleOrder} 
          style={styles.orderBtn}
        >
          Order Your Paper Now →
        </motion.button>
      </div>
    </motion.div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    boxShadow: 'var(--shadow-lg)',
    borderTop: '5px solid var(--primary)',
    backgroundColor: '#ffffff',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '24px',
    borderBottom: '1px solid var(--border-light)',
    paddingBottom: '16px',
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: 'var(--text-main)',
    flex: 1,
  },
  discountBadge: {
    background: 'var(--accent-light)',
    color: 'var(--accent)',
    fontSize: '0.8rem',
    fontWeight: '700',
    padding: '4px 12px',
    borderRadius: 'var(--radius-full)',
  },
  select: {
    cursor: 'pointer',
  },
  counterRow: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid var(--border-light)',
    borderRadius: 'var(--radius-sm)',
    overflow: 'hidden',
    height: '46px',
    background: 'var(--bg-main)',
  },
  counterBtn: {
    background: 'none',
    border: 'none',
    width: '46px',
    height: '100%',
    fontSize: '1.2rem',
    fontWeight: '600',
    cursor: 'pointer',
    color: 'var(--text-main)',
    transition: 'var(--transition)',
    ':hover': {
      background: 'var(--border-light)',
    },
  },
  counterValue: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: '0.9rem',
    color: 'var(--text-main)',
  },
  spacingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    margin: '24px 0',
    flexWrap: 'wrap',
  },
  spacingLabel: {
    fontWeight: '600',
    fontSize: '0.9rem',
    color: 'var(--text-main)',
  },
  spacingGroup: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  spacingBtn: {
    background: 'var(--bg-main)',
    border: '1px solid var(--border-light)',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
    color: 'var(--text-muted)',
    transition: 'var(--transition)',
  },
  spacingActiveBtn: {
    background: 'var(--primary-light)',
    border: '1px solid var(--primary)',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
    color: 'var(--primary)',
  },
  pricingSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'var(--primary-light)',
    border: '1px solid rgba(0, 122, 255, 0.1)',
    borderRadius: 'var(--radius-md)',
    padding: '20px 24px',
    marginTop: '28px',
    flexWrap: 'wrap',
    gap: '20px',
  },
  rateCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  rateLabel: {
    fontSize: '0.82rem',
    color: 'var(--text-muted)',
    fontWeight: '500',
  },
  rateValue: {
    fontSize: '1.4rem',
    fontWeight: '800',
    color: 'var(--text-main)',
    display: 'inline-block',
  },
  totalCol: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  totalLabel: {
    fontSize: '0.82rem',
    color: 'var(--text-muted)',
    fontWeight: '500',
  },
  priceRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px',
  },
  totalValue: {
    fontSize: '1.8rem',
    fontWeight: '800',
    color: 'var(--primary)',
    display: 'inline-block',
  },
  discountText: {
    fontSize: '0.78rem',
    color: 'var(--accent)',
    fontWeight: '700',
  },
  orderBtn: {
    padding: '14px 30px',
    fontSize: '0.95rem',
    boxShadow: '0 4px 18px var(--accent-glow)',
  }
};
