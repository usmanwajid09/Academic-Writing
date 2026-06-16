import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import OrderNow from './pages/OrderNow';
import ManageOrders from './pages/ManageOrders';
import About from './pages/About';
import Services from './pages/Services';
import Pricing from './pages/Pricing';
import Faq from './pages/Faq';
import Contact from './pages/Contact';
import { api } from './api';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('home'); // 'home', 'about', 'services', 'pricing', 'faq', 'contact', 'order', 'portal'
  const [initialCalc, setInitialCalc] = useState(null);
  const [loading, setLoading] = useState(true);

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
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer setView={setView} />
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
