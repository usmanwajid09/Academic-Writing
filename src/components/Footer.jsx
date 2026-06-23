import React from 'react';
import { GraduationCap, Mail, Phone, MapPin, Shield, CheckCircle } from 'lucide-react';
import LogoImage from '../assets/image1.png';

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
            <img src={LogoImage} alt="GlobeAcademics Logo" style={{ height: '36px', objectFit: 'contain', marginBottom: '16px' }} />
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
            <li style={styles.listItem} onClick={() => handleNav('samples')}>Work Samples</li>
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
              <span>support@globeacademics.com</span>
            </li>
            <li style={styles.contactItem}>
              <Phone size={16} />
              <span>+13252024597 (Toll-Free)</span>
            </li>
            <li style={styles.contactItem}>
              <a 
                href="https://wa.me/923212309276?text=Hi,%20I%20need%20assistance%20with%20my%20academic%20assignment." 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'inherit', textDecoration: 'none' }}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ color: '#25d366' }}>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span>WhatsApp: +92 321 2309276</span>
              </a>
            </li>
            <li style={styles.contactItem}>
              <MapPin size={16} />
              <span>30 N Gould St Stee 44158. Sheridan Wyoming 82801</span>
            </li>
          </ul>
        </div>
      </div>

      <hr style={styles.divider} />

      <div className="container" style={styles.bottomRow}>
        <span>&copy; {new Date().getFullYear()} GlobeAcademics.com. All rights reserved.</span>
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
