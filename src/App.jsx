import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import OrderNow from './pages/OrderNow';
import ManageOrders from './pages/ManageOrders';
import About from './pages/About';
import Services from './pages/Services';
import WorkSamples from './pages/WorkSamples';
import Pricing from './pages/Pricing';
import Faq from './pages/Faq';
import Contact from './pages/Contact';
import { api } from './api';
import { motion, AnimatePresence } from 'framer-motion';

const WHATSAPP_NUMBER = "923212309276";

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('home'); // 'home', 'about', 'services', 'pricing', 'faq', 'contact', 'order', 'portal', 'samples'
  const [initialCalc, setInitialCalc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [portalAuthMode, setPortalAuthMode] = useState('login'); // 'login' or 'register'

  // Authenticate user on page load if JWT exists
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const profile = await api.getCurrentUser();
          setUser(profile);
        } catch (err) {
          console.warn('Session expired or invalid token');
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setView('home');
  };

  const handleOrderRedirect = (calcState) => {
    setInitialCalc(calcState);
    setView('order');
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ height: '100vh', flexDirection: 'column', gap: '16px' }}>
        <div style={styles.spinner}></div>
        <span style={{ fontWeight: '600', color: 'var(--text-muted)' }}>Loading Academia Writing...</span>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
      <Header 
        user={user} 
        onLogout={handleLogout} 
        setView={setView} 
        activeView={view} 
        setPortalAuthMode={setPortalAuthMode}
      />

      <main style={{ flex: 1, position: 'relative' }}>
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.25 }}
            >
              <Home 
                onOrderRedirect={handleOrderRedirect} 
                setView={setView} 
              />
            </motion.div>
          )}
          {view === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.25 }}
            >
              <About setView={setView} />
            </motion.div>
          )}
          {view === 'services' && (
            <motion.div
              key="services"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.25 }}
            >
              <Services setView={setView} />
            </motion.div>
          )}
          {view === 'samples' && (
            <motion.div
              key="samples"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.25 }}
            >
              <WorkSamples setView={setView} onOrderRedirect={handleOrderRedirect} />
            </motion.div>
          )}
          {view === 'pricing' && (
            <motion.div
              key="pricing"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.25 }}
            >
              <Pricing onOrderRedirect={handleOrderRedirect} setView={setView} />
            </motion.div>
          )}
          {view === 'faq' && (
            <motion.div
              key="faq"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.25 }}
            >
              <Faq />
            </motion.div>
          )}
          {view === 'contact' && (
            <motion.div
              key="contact"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.25 }}
            >
              <Contact />
            </motion.div>
          )}
          {view === 'order' && (
            <motion.div
              key="order"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.25 }}
            >
              <OrderNow 
                initialCalcState={initialCalc} 
                user={user}
                onLoginSuccess={handleLoginSuccess}
                setView={setView} 
              />
            </motion.div>
          )}
          {view === 'portal' && (
            <motion.div
              key="portal"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.25 }}
            >
              <ManageOrders 
                user={user} 
                setView={setView} 
                onLoginSuccess={handleLoginSuccess}
                initialAuthMode={portalAuthMode}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer setView={setView} />

      {/* Floating WhatsApp Action Button */}
      <a 
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi,%20I%20need%20assistance%20with%20my%20academic%20assignment.`}
        target="_blank" 
        rel="noopener noreferrer"
        className="whatsapp-float-btn"
        title="Chat on WhatsApp"
      >
        <span className="whatsapp-tooltip">Need Help? Chat on WhatsApp</span>
        <div className="whatsapp-pulse-ring"></div>
        <svg 
          viewBox="0 0 24 24" 
          width="28" 
          height="28" 
          fill="currentColor"
          style={{ display: 'block' }}
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );
}

const styles = {
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid var(--border-light)',
    borderTop: '4px solid var(--primary)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  }
};

// Add standard spinner animation dynamically if needed
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}
