import React from 'react';
import { GraduationCap, LogOut, User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header({ user, onLogout, setView, activeView }) {
  const [menuOpen, setMenuOpen] = React.useState(false);

  const handleNav = (view, elementId) => {
    setView(view);
    setMenuOpen(false);
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
            <GraduationCap size={32} color="var(--primary)" />
            <span style={styles.logoText}>Academia<span style={{ fontWeight: '400', color: 'var(--text-muted)' }}>Writing</span></span>
          </div>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            <span style={activeView === 'home' ? styles.activeLink : styles.navLink} onClick={() => handleNav('home')}>Home</span>
            <span style={activeView === 'about' ? styles.activeLink : styles.navLink} onClick={() => handleNav('about')}>About Us</span>
            <span style={activeView === 'services' ? styles.activeLink : styles.navLink} onClick={() => handleNav('services')}>Our Services</span>
            <span style={activeView === 'pricing' ? styles.activeLink : styles.navLink} onClick={() => handleNav('pricing')}>Pricing</span>
            <span style={activeView === 'faq' ? styles.activeLink : styles.navLink} onClick={() => handleNav('faq')}>FAQ</span>
            <span style={activeView === 'contact' ? styles.activeLink : styles.navLink} onClick={() => handleNav('contact')}>Contact</span>
          </nav>

          <div style={styles.authActions}>
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
                <button style={styles.loginBtn} onClick={() => handleNav('portal')}>
                  Sign In
                </button>
                <button className="btn-primary" onClick={() => handleNav('order')}>
                  Order Now
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <button className="mobile-menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer using Framer Motion */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={styles.mobileDrawer}
          >
            <span style={activeView === 'home' ? styles.mobileActiveLink : styles.mobileLink} onClick={() => handleNav('home')}>Home</span>
            <span style={activeView === 'about' ? styles.mobileActiveLink : styles.mobileLink} onClick={() => handleNav('about')}>About Us</span>
            <span style={activeView === 'services' ? styles.mobileActiveLink : styles.mobileLink} onClick={() => handleNav('services')}>Our Services</span>
            <span style={activeView === 'pricing' ? styles.mobileActiveLink : styles.mobileLink} onClick={() => handleNav('pricing')}>Pricing</span>
            <span style={activeView === 'faq' ? styles.mobileActiveLink : styles.mobileLink} onClick={() => handleNav('faq')}>FAQ</span>
            <span style={activeView === 'contact' ? styles.mobileActiveLink : styles.mobileLink} onClick={() => handleNav('contact')}>Contact</span>
            
            <hr style={styles.divider} />

            {user ? (
              <div style={styles.mobileUser}>
                <div style={styles.mobileUserInfo}>
                  <User size={20} />
                  <strong>{user.name} ({user.role})</strong>
                </div>
                <button style={styles.mobileDashboardBtn} onClick={() => handleNav('portal')}>
                  Manage Orders
                </button>
                <button style={styles.mobileLogoutBtn} onClick={onLogout}>
                  <LogOut size={16} /> Logout
                </button>
              </div>
            ) : (
              <div style={styles.mobileGuest}>
                <button style={styles.mobileLoginBtn} onClick={() => handleNav('portal')}>
                  Sign In
                </button>
                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => handleNav('order')}>
                  Order Now
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
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
    display: 'flex',
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
