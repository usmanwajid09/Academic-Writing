import React from 'react';
import { GraduationCap, Mail, Phone, MapPin, Shield, CheckCircle } from 'lucide-react';

export default function Footer({ setView }) {
  const handleNav = (view, elementId) => {
    setView(view);
    if (elementId) {
      setTimeout(() => {
        const el = document.getElementById(elementId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer style={styles.footer}>
      <div className="container responsive-grid-footer">
        {/* Brand Block */}
        <div style={styles.brandCol}>
          <div style={styles.logo} onClick={() => handleNav('home')}>
            <GraduationCap size={28} color="#ffffff" />
            <span style={styles.logoText}>Academia<span style={{ fontWeight: '400', color: '#cbd5e1' }}>Writing</span></span>
          </div>
          <p style={styles.brandDesc}>
            Providing premium, custom-tailored academic writing and research solutions since 2012. Our global team of expert writers is available around the clock to support your academic success.
          </p>
          <div style={styles.badgeRow}>
            <div style={styles.badge}>
              <Shield size={16} color="var(--accent)" />
              <span>100% Confidential</span>
            </div>
            <div style={styles.badge}>
              <CheckCircle size={16} color="var(--accent)" />
              <span>Plagiarism Free</span>
            </div>
          </div>
        </div>

        {/* Links Col 1 */}
        <div>
          <h4 style={styles.colTitle}>Our Services</h4>
          <ul style={styles.list}>
            <li style={styles.listItem} onClick={() => handleNav('order')}>Custom Essay Writing</li>
            <li style={styles.listItem} onClick={() => handleNav('order')}>Coursework Help</li>
            <li style={styles.listItem} onClick={() => handleNav('order')}>Research Papers</li>
            <li style={styles.listItem} onClick={() => handleNav('order')}>Dissertation Chapters</li>
            <li style={styles.listItem} onClick={() => handleNav('order')}>Admission Essays</li>
          </ul>
        </div>

        {/* Links Col 2 */}
        <div>
          <h4 style={styles.colTitle}>Support & Policies</h4>
          <ul style={styles.list}>
            <li style={styles.listItem} onClick={() => handleNav('about')}>About Us</li>
            <li style={styles.listItem} onClick={() => handleNav('services')}>Our Services</li>
            <li style={styles.listItem} onClick={() => handleNav('faq')}>Frequently Asked Questions</li>
            <li style={styles.listItem} onClick={() => handleNav('contact')}>Contact & Support</li>
          </ul>
        </div>

        {/* Links Col 3 */}
        <div>
          <h4 style={styles.colTitle}>Contact Info</h4>
          <ul style={styles.list}>
            <li style={styles.contactItem}>
              <Mail size={16} />
              <span>support@academiawriting.com</span>
            </li>
            <li style={styles.contactItem}>
              <Phone size={16} />
              <span>+1 (800) 555-0199 (Toll-Free)</span>
            </li>
            <li style={styles.contactItem}>
              <MapPin size={16} />
              <span>100 Pine St, San Francisco, CA 94111</span>
            </li>
          </ul>
        </div>
      </div>

      <hr style={styles.divider} />

      <div className="container" style={styles.bottomRow}>
        <span>&copy; {new Date().getFullYear()} Academia Writing. All rights reserved.</span>
        <div style={styles.legalLinks}>
          <span style={styles.legalLink}>Privacy Policy</span>
          <span style={styles.legalLink}>Cookie Settings</span>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    background: '#090d16',
    color: '#94a3b8',
    padding: '64px 0 32px 0',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
  },
  brandCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
  },
  logoText: {
    fontSize: '1.35rem',
    fontWeight: '800',
    color: '#ffffff',
  },
  brandDesc: {
    fontSize: '0.9rem',
    lineHeight: '1.6',
    color: '#64748b',
  },
  badgeRow: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    marginTop: '8px',
  },
  badge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.8rem',
    color: '#cbd5e1',
    background: 'rgba(255, 255, 255, 0.03)',
    padding: '6px 12px',
    borderRadius: '6px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  colTitle: {
    color: '#ffffff',
    fontSize: '0.95rem',
    fontWeight: '700',
    marginBottom: '20px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  list: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: 0,
  },
  listItem: {
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'var(--transition)',
    ':hover': {
      color: '#ffffff',
    },
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '0.9rem',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    margin: '48px 0 24px 0',
  },
  bottomRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.8rem',
    color: '#64748b',
    flexWrap: 'wrap',
    gap: '16px',
  },
  legalLinks: {
    display: 'flex',
    gap: '20px',
  },
  legalLink: {
    cursor: 'pointer',
    ':hover': {
      color: '#cbd5e1',
    },
  },
};
