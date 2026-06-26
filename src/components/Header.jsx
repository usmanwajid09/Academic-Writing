import React from 'react';
import { GraduationCap, LogOut, User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LogoImage from '../assets/logo.png';

export default function Header({ user, onLogout, setView, activeView, setPortalAuthMode }) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [fullscreenOpen, setFullscreenOpen] = React.useState(false);

  React.useEffect(() => {
    document.documentElement.classList.remove('theme-dark');
    localStorage.removeItem('theme');
  }, []);

  const navItems = [
    { key: 'home', label: 'Home' },
    { key: 'about', label: 'About Us' },
    { key: 'services', label: 'Our Services' },
    { key: 'samples', label: 'Work Samples' },
    { key: 'pricing', label: 'Pricing Calculator' },
    { key: 'faq', label: 'FAQ Directory' },
    { key: 'contact', label: 'Contact Support' }
  ];

  const handleNav = (view, elementId) => {
    setView(view);
    setMenuOpen(false);
    setFullscreenOpen(false);
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
    <header style={styles.header}>
      {/* Top Banner Discount Coupon */}
      <div style={styles.topbar}>
        <div className="container" style={styles.topbarContainer}>
          <span style={styles.couponTag}>LIMITED TIME OFFER</span>
          <span>Use coupon code <strong style={styles.codeText}>SAVE25</strong> to get 25% OFF on your first order! 🎉</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div style={styles.navbar}>
        <div className="container" style={styles.navContainer}>
          <div style={styles.logo} onClick={() => handleNav('home')}>
            <img src={LogoImage} alt="GlobeAcademics Logo" style={{ height: '52px', objectFit: 'contain' }} />
          </div>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            <span style={activeView === 'home' ? styles.activeLink : styles.navLink} onClick={() => handleNav('home')}>Home</span>
            <span style={activeView === 'about' ? styles.activeLink : styles.navLink} onClick={() => handleNav('about')}>About Us</span>
            <span style={activeView === 'services' ? styles.activeLink : styles.navLink} onClick={() => handleNav('services')}>Our Services</span>
            <span style={activeView === 'samples' ? styles.activeLink : styles.navLink} onClick={() => handleNav('samples')}>Samples</span>
            <span style={activeView === 'pricing' ? styles.activeLink : styles.navLink} onClick={() => handleNav('pricing')}>Pricing</span>
            <span style={activeView === 'faq' ? styles.activeLink : styles.navLink} onClick={() => handleNav('faq')}>FAQ</span>
            <span style={activeView === 'contact' ? styles.activeLink : styles.navLink} onClick={() => handleNav('contact')}>Contact</span>
          </nav>

          <div className="desktop-auth-actions" style={styles.authActions}>
            {user ? (
              <div style={styles.userSection}>
                <div style={styles.userInfo} onClick={() => handleNav('portal')}>
                  <User size={18} />
                  <span>{user.name}</span>
                  <span style={styles.roleBadge}>{user.role}</span>
                </div>
                <button style={styles.dashboardBtn} onClick={() => handleNav('portal')}>
                  Manage Orders
                </button>
                <button style={styles.logoutBtn} onClick={onLogout} title="Log Out">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div style={styles.guestActions}>
                <button style={styles.loginBtn} onClick={() => { setPortalAuthMode('login'); handleNav('portal'); }}>
                  Sign In
                </button>
                <button style={styles.signupBtn} onClick={() => { setPortalAuthMode('register'); handleNav('portal'); }}>
                  Sign Up
                </button>
                <button className="btn-primary" onClick={() => handleNav('order')}>
                  Order Now
                </button>
              </div>
            )}
          </div>

          {/* Morphing Hamburger Menu Button */}
          <button 
            className="menu-burger-btn" 
            onClick={() => setFullscreenOpen(!fullscreenOpen)}
            style={{ marginLeft: '20px' }}
          >
            <div className={`burger-line line1 ${fullscreenOpen ? 'open' : ''}`} />
            <div className={`burger-line line2 ${fullscreenOpen ? 'open' : ''}`} />
            <div className={`burger-line line3 ${fullscreenOpen ? 'open' : ''}`} />
          </button>
        </div>
      </div>

      {/* Fullscreen Overlay Menu */}
      <div 
        className={`fullscreen-menu-overlay ${fullscreenOpen ? 'open' : ''}`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {navItems.map((item) => (
            <span 
              key={item.key}
              className="menu-link-item"
              onClick={() => handleNav(item.key)}
            >
              {item.label}
            </span>
          ))}
          <div style={{ marginTop: '24px', display: 'flex', gap: '20px' }}>
            {user ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', width: '100%' }}>
                <div style={{ color: '#fff', fontSize: '1.1rem', fontWeight: '600', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={18} /> {user.name} <span style={styles.roleBadge}>{user.role}</span>
                </div>
                <button className="btn-accent" style={{ width: '200px' }} onClick={() => handleNav('portal')}>Manage Orders</button>
                <button className="btn-secondary" style={{ width: '200px', color: '#fca5a5', borderColor: '#ef4444' }} onClick={onLogout}>Log Out</button>
              </div>
            ) : (
              <>
                <button className="btn-secondary" style={{ color: '#fff', borderColor: '#fff' }} onClick={() => { setPortalAuthMode('login'); handleNav('portal'); }}>Sign In</button>
                <button className="btn-secondary" style={{ color: '#fff', borderColor: '#fff' }} onClick={() => { setPortalAuthMode('register'); handleNav('portal'); }}>Sign Up</button>
                <button className="btn-primary" onClick={() => handleNav('order')}>Order Now</button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

const styles = {
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: 'var(--shadow-sm)',
    background: '#ffffff',
  },
  topbar: {
    background: '#0f172a',
    color: '#ffffff',
    fontSize: '0.82rem',
    padding: '8px 0',
    textAlign: 'center',
    fontWeight: '500',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  topbarContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  couponTag: {
    background: 'var(--accent)',
    color: '#fff',
    fontSize: '0.7rem',
    padding: '2px 8px',
    borderRadius: '4px',
    fontWeight: '700',
    letterSpacing: '0.05em',
  },
  codeText: {
    color: '#38bdf8',
    textDecoration: 'underline',
  },
  navbar: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid var(--border-light)',
    height: '76px',
    display: 'flex',
    alignItems: 'center',
  },
  navContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
  },
  logoText: {
    fontSize: '1.45rem',
    fontWeight: '800',
    color: 'var(--text-main)',
    letterSpacing: '-0.02em',
  },
  navLink: {
    cursor: 'pointer',
    transition: 'var(--transition)',
    position: 'relative',
    padding: '8px 0',
    ':hover': {
      color: 'var(--primary)',
    }
  },
  activeLink: {
    cursor: 'pointer',
    color: 'var(--primary)',
    fontWeight: '700',
    position: 'relative',
    padding: '8px 0',
  },
  authActions: {
    alignItems: 'center',
    gap: '16px',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: 'var(--text-main)',
    cursor: 'pointer',
    background: 'var(--bg-main)',
    padding: '6px 12px',
    borderRadius: '8px',
    border: '1px solid var(--border-light)',
  },
  roleBadge: {
    background: 'var(--primary)',
    color: '#fff',
    fontSize: '0.7rem',
    fontWeight: '700',
    padding: '1px 6px',
    borderRadius: '4px',
    textTransform: 'uppercase',
  },
  dashboardBtn: {
    background: 'var(--primary-light)',
    color: 'var(--primary)',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '0.85rem',
    transition: 'var(--transition)',
  },
  logoutBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    padding: '6px',
    borderRadius: '8px',
    transition: 'var(--transition)',
    ':hover': {
      background: '#fee2e2',
      color: '#dc2626',
    }
  },
  guestActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  loginBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-main)',
    fontWeight: '600',
    cursor: 'pointer',
    padding: '8px 16px',
    fontSize: '0.95rem',
    transition: 'var(--transition)',
    ':hover': {
      color: 'var(--primary)',
    }
  },
  signupBtn: {
    background: 'none',
    border: '1px solid var(--border-light)',
    borderRadius: '6px',
    color: 'var(--text-main)',
    fontWeight: '600',
    cursor: 'pointer',
    padding: '6px 14px',
    fontSize: '0.9rem',
    transition: 'var(--transition)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileDrawer: {
    display: 'flex',
    flexDirection: 'column',
    background: '#ffffff',
    borderTop: '1px solid var(--border-light)',
    borderBottom: '1px solid var(--border-light)',
    padding: '20px 24px',
    gap: '16px',
    boxShadow: 'var(--shadow-md)',
    overflow: 'hidden',
  },
  mobileLink: {
    fontSize: '1rem',
    fontWeight: '600',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '8px 0',
  },
  mobileActiveLink: {
    fontSize: '1rem',
    fontWeight: '700',
    color: 'var(--primary)',
    cursor: 'pointer',
    padding: '8px 0',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid var(--border-light)',
  },
  mobileUser: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  mobileUserInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: 'var(--text-main)',
  },
  mobileDashboardBtn: {
    background: 'var(--primary)',
    color: '#fff',
    border: 'none',
    padding: '12px',
    borderRadius: '8px',
    fontWeight: '600',
    textAlign: 'center',
    cursor: 'pointer',
  },
  mobileLogoutBtn: {
    background: '#fee2e2',
    color: '#dc2626',
    border: 'none',
    padding: '10px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
  },
  mobileGuest: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  mobileLoginBtn: {
    background: 'var(--bg-main)',
    border: '1px solid var(--border-light)',
    padding: '12px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
  }
};
