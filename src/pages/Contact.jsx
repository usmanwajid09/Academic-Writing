import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, HelpCircle, MessageSquare, ShieldCheck, User } from 'lucide-react';

export default function Contact() {
  // Contact Form States
  const [formData, setFormData] = useState({ name: '', email: '', orderId: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Chat Widget Simulator States
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'agent', text: "Hello! My name is Emma from customer care. How can I help you today?" }
  ]);
  const [userMsg, setUserMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', orderId: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!userMsg.trim()) return;

    const newMsg = { id: Date.now(), sender: 'user', text: userMsg };
    setChatMessages(prev => [...prev, newMsg]);
    const inputMsg = userMsg;
    setUserMsg('');
    setIsTyping(true);

    // Simulate agent response logic based on keyword detection
    setTimeout(() => {
      let replyText = "Thank you for writing. An agent will review your inquiry shortly. If you need immediate assistance, please place an order or apply coupon **SAVE25** for your first paper.";
      
      const query = inputMsg.toLowerCase();
      if (query.includes('discount') || query.includes('coupon') || query.includes('promo')) {
        replyText = "We have an active 25% discount for first-time clients! Apply coupon code **SAVE25** in the invoice section of the order page.";
      } else if (query.includes('plagiarism') || query.includes('turnitin') || query.includes('original')) {
        replyText = "All essays are written **100% from scratch** by our human writers. We scan every file with **Turnitin-compatible** plagiarism scanners before release.";
      } else if (query.includes('refund') || query.includes('cancel')) {
        replyText = "Order cancellations are supported. A **100% refund** is issued if a writer has not yet been assigned to your project.";
      } else if (query.includes('writer') || query.includes('who writes')) {
        replyText = "Your papers are written by vetted native speakers holding **Master's and PhD degrees** matching your exact academic major.";
      } else if (query.includes('hi') || query.includes('hello')) {
        replyText = "Hello! Please let me know how I can help. You can ask about **pricing**, **discounts**, **revisions**, or **order statuses**.";
      }

      setChatMessages(prev => [...prev, { id: Date.now() + 1, sender: 'agent', text: replyText }]);
      setIsTyping(false);
    }, 1500);
  };

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
            GET IN TOUCH
          </span>
          <h1 style={{ fontSize: '3rem', marginTop: '12px', marginBottom: '20px', color: '#0f172a' }}>
            We're Here to <span className="gradient-text">Help 24/7</span>
          </h1>
          <p style={{ maxWidth: '650px', margin: '0 auto', fontSize: '1.1rem', color: 'var(--text-muted)' }}>
            Have questions about your order, formatting rules, or pricing details? Shoot us a message or chat with our live agents.
          </p>
        </motion.div>
      </section>

      {/* Grid: Form details & Live Chat Widget */}
      <section className="container" style={{ marginBottom: '80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'start' }}>
          
          {/* Left Column: Form & Contact details */}
          <div>
            <div className="glass-card" style={{ background: '#fff', border: '1px solid var(--border-light)', padding: '32px', marginBottom: '32px' }}>
              <h3 style={{ marginBottom: '20px', color: '#0f172a' }}>Support Request Form</h3>
              
              {submitted && (
                <div style={{ background: 'rgba(16,185,129,0.08)', color: '#065f46', border: '1px solid rgba(16,185,129,0.2)', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.88rem' }}>
                  Thank you! Your inquiry was successfully received. A coordinator will email you within 20 minutes.
                </div>
              )}

              <form onSubmit={handleFormSubmit}>
                <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: '600', marginBottom: '4px', display: 'block' }}>Name</label>
                    <input 
                      type="text" 
                      required 
                      className="form-input" 
                      style={{ padding: '10px' }}
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: '600', marginBottom: '4px', display: 'block' }}>Email</label>
                    <input 
                      type="email" 
                      required 
                      className="form-input" 
                      style={{ padding: '10px' }}
                      value={formData.email} 
                      onChange={(e) => setFormData({...formData, email: e.target.value})} 
                    />
                  </div>
                </div>

                <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: '600', marginBottom: '4px', display: 'block' }}>Order ID (optional)</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      style={{ padding: '10px' }}
                      placeholder="e.g. #1024"
                      value={formData.orderId} 
                      onChange={(e) => setFormData({...formData, orderId: e.target.value})} 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: '600', marginBottom: '4px', display: 'block' }}>Subject</label>
                    <select 
                      className="form-input" 
                      style={{ padding: '10px' }}
                      value={formData.subject} 
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    >
                      <option>General Question</option>
                      <option>Billing / Refund</option>
                      <option>Revision Request</option>
                      <option>Become a Writer</option>
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '20px', flexDirection: 'column', alignItems: 'stretch' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: '600', marginBottom: '4px' }}>Detailed Message</label>
                  <textarea 
                    required 
                    rows={4} 
                    className="form-input" 
                    style={{ padding: '10px', resize: 'vertical' }}
                    value={formData.message} 
                    onChange={(e) => setFormData({...formData, message: e.target.value})} 
                  />
                </div>

                <button type="submit" disabled={submitting} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  {submitting ? 'Submitting...' : 'Send Inquiry'} <Send size={16} />
                </button>
              </form>
            </div>

            {/* Support Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ background: 'var(--primary-light)', padding: '12px', borderRadius: '12px', color: 'var(--primary)' }}>
                  <Phone size={20} />
                </div>
                <div>
                  <h4 style={{ color: '#0f172a', margin: '0 0 2px 0', fontSize: '0.95rem' }}>Call Toll Free</h4>
                  <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: '600' }}>+1 (800) 555-WRITER</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ background: 'var(--accent-light)', padding: '12px', borderRadius: '12px', color: 'var(--accent)' }}>
                  <Mail size={20} />
                </div>
                <div>
                  <h4 style={{ color: '#0f172a', margin: '0 0 2px 0', fontSize: '0.95rem' }}>Support Email</h4>
                  <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: '600' }}>support@academiawriting.com</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ background: 'rgba(237, 233, 254, 0.7)', padding: '12px', borderRadius: '12px', color: '#6d28d9' }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 style={{ color: '#0f172a', margin: '0 0 2px 0', fontSize: '0.95rem' }}>Global Headquarters</h4>
                  <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-muted)' }}>100 Pine Street, Suite 1250, San Francisco, CA 94111</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Support Chat Simulator */}
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-12px', right: '12px', background: 'var(--accent)', color: 'white', padding: '4px 10px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: '700', zIndex: '5', boxShadow: 'var(--shadow-sm)' }}>
              LIVE CHAT ONLINE
            </div>
            
            <div className="support-chat-widget">
              <div className="chat-widget-header">
                <div className="chat-widget-status"></div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>Academia Support Bot</div>
                  <div style={{ fontSize: '0.72rem', opacity: 0.85 }}>Emma - Customer Specialist</div>
                </div>
              </div>

              <div className="chat-widget-body">
                {chatMessages.map(msg => (
                  <div 
                    key={msg.id} 
                    className={`chat-widget-msg ${msg.sender}`}
                    dangerouslySetInnerHTML={{
                      __html: msg.text
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\n/g, '<br />')
                    }}
                  />
                ))}
                {isTyping && (
                  <div className="chat-widget-msg agent" style={{ display: 'flex', gap: '4px', padding: '10px 18px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-muted)', animation: 'bounce 1.4s infinite' }}></div>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-muted)', animation: 'bounce 1.4s infinite 0.2s' }}></div>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-muted)', animation: 'bounce 1.4s infinite 0.4s' }}></div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <form onSubmit={handleSendChat} className="chat-widget-footer">
                <input 
                  type="text" 
                  className="chat-widget-input"
                  placeholder="Ask about discount, plagiarism, writers, refunds..."
                  value={userMsg}
                  onChange={(e) => setUserMsg(e.target.value)}
                />
                <button 
                  type="submit" 
                  disabled={!userMsg.trim()}
                  style={{ 
                    background: 'var(--primary)', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: 'var(--radius-sm)', 
                    padding: '8px 12px', 
                    cursor: userMsg.trim() ? 'pointer' : 'not-allowed',
                    opacity: userMsg.trim() ? 1 : 0.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Send size={14} />
                </button>
              </form>
            </div>
            
            {/* Quick Suggestions panel */}
            <div style={{ marginTop: '16px', background: 'white', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '16px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <HelpCircle size={14} /> CLICK TO AUTO-ASK EMMA
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {[
                  "Is there a discount code?",
                  "Are the papers free of plagiarism?",
                  "Who writes my assignment?",
                  "Can I cancel and refund my order?"
                ].map((suggest, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setUserMsg(suggest)}
                    style={{ background: '#f1f5f9', border: 'none', borderRadius: '20px', padding: '6px 12px', fontSize: '0.78rem', cursor: 'pointer', fontWeight: '500', color: '#475569', transition: 'var(--transition)' }}
                    className="btn-suggest-chat"
                  >
                    {suggest}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
