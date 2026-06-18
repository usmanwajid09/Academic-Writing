import React, { useState, useEffect, useRef } from 'react';
import { api } from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, MessageSquare, Download, UploadCloud, RefreshCw, Send, CheckCircle, 
  Clock, AlertCircle, Sparkles, User, Briefcase, PlusCircle, Paperclip, Wand2,
  ShieldCheck, Check
} from 'lucide-react';
import BoldTextAIPlugin from '../components/BoldTextAIPlugin';
import PlagiarismInspector from '../components/PlagiarismInspector';

const AI_PHRASES = [
  "Hi, could you please provide a status update on the draft?",
  "Hello, I've attached additional references. Please review them.",
  "Hi writer, please make sure to follow the grading rubric attached.",
  "Could you double check the citation formatting of the bibliography?",
  "Hello, I would like to request a revision for the introduction section."
];

const steps = ['pending', 'assigned', 'in_progress', 'review', 'completed'];
const stepLabels = {
  pending: 'Order Placed',
  assigned: 'Writer Hired',
  in_progress: 'Writing Phase',
  review: 'QA Review',
  completed: 'Completed'
};

function CountdownTimer({ createdAt, deadlineKey }) {
  const [timeLeft, setTimeLeft] = useState(null);

  const DEADLINE_DURATIONS = {
    '14d': 14 * 24 * 60 * 60 * 1000,
    '7d': 7 * 24 * 60 * 60 * 1000,
    '5d': 5 * 24 * 60 * 60 * 1000,
    '3d': 3 * 24 * 60 * 60 * 1000,
    '2d': 2 * 24 * 60 * 60 * 1000,
    '24h': 24 * 60 * 60 * 1000,
    '8h': 8 * 60 * 60 * 1000
  };

  const getTargetDate = () => {
    if (!createdAt) return new Date();
    let formatStr = createdAt;
    if (!createdAt.includes('T') && createdAt.includes(' ')) {
      formatStr = createdAt.replace(' ', 'T') + 'Z';
    }
    const createdDate = new Date(Date.parse(formatStr) || Date.parse(createdAt));
    const duration = DEADLINE_DURATIONS[deadlineKey] || 3 * 24 * 60 * 60 * 1000;
    return new Date(createdDate.getTime() + duration);
  };

  useEffect(() => {
    const targetDate = getTargetDate();
    const totalDuration = DEADLINE_DURATIONS[deadlineKey] || 3 * 24 * 60 * 60 * 1000;

    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, ms: 0, percent: 100, isOverdue: true });
        clearInterval(interval);
      } else {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        const ms = Math.floor((difference % 1000) / 10);
        
        const timeElapsed = totalDuration - difference;
        const percent = Math.min(100, Math.max(0, (timeElapsed / totalDuration) * 100));

        setTimeLeft({ hours, minutes, seconds, ms, percent, isOverdue: false });
      }
    }, 45);

    return () => clearInterval(interval);
  }, [createdAt, deadlineKey]);

  if (!timeLeft) return null;

  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timeLeft.percent / 100) * circumference;

  return (
    <div className="countdown-header-card no-print">
      <div className="countdown-flex">
        <div className="countdown-gauge">
          <svg width="86" height="86">
            <circle
              cx="43"
              cy="43"
              r={radius}
              fill="transparent"
              stroke="var(--border-light)"
              strokeWidth="5"
            />
            <circle
              cx="43"
              cy="43"
              r={radius}
              fill="transparent"
              stroke="var(--accent)"
              strokeWidth="5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="countdown-svg-circle"
            />
          </svg>
          <div style={{ position: 'absolute', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)' }}>
            {Math.round(timeLeft.percent)}%
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
            <span className="pulse-heartbeat" style={{ backgroundColor: timeLeft.isOverdue ? '#ef4444' : 'var(--accent)' }} />
            <strong style={{ fontSize: '0.92rem', color: 'var(--text-main)' }}>
              {timeLeft.isOverdue ? 'Linguistic Editing & Review' : 'Live Delivery Countdown'}
            </strong>
          </div>
          
          <div className="countdown-numerical">
            {timeLeft.hours.toString().padStart(2, '0')}h : {timeLeft.minutes.toString().padStart(2, '0')}m : {timeLeft.seconds.toString().padStart(2, '0')}s : <span className="countdown-ms">{timeLeft.ms.toString().padStart(2, '0')}ms</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {timeLeft.isOverdue ? 'Paper is being formatted and checked for Turnitin similarity.' : 'Vetted writer is actively drafting your academic solutions.'}
          </span>
        </div>
      </div>
    </div>
  );
}

const VOCAB_REPLACEMENTS = [
  { word: 'bad', options: ['detrimental', 'adverse', 'deleterious', 'suboptimal'] },
  { word: 'get', options: ['acquire', 'obtain', 'derive', 'procure'] },
  { word: 'important', options: ['paramount', 'significant', 'imperative', 'critical'] },
  { word: 'big', options: ['substantial', 'considerable', 'monumental', 'vast'] },
  { word: 'show', options: ['demonstrate', 'illustrate', 'exemplify', 'evince'] },
  { word: 'good', options: ['advantageous', 'exemplary', 'efficacious', 'propitious'] }
];

const MOCK_OUTLINES = [
  {
    title: 'I. Abstract & Introduction',
    desc: 'Formulate research problem, thesis statements, and methodology outline.',
    tasks: ['Draft academic abstract', 'State study objectives', 'Refine core thesis statement']
  },
  {
    title: 'II. Literature Review & Theory',
    desc: 'Evaluate peer-reviewed articles, synthesize gaps, outline academic framework.',
    tasks: ['Locate 3 high-impact journal references', 'Synthesize key literature arguments', 'Refine theoretical framework']
  },
  {
    title: 'III. Methodology & Data Analysis',
    desc: 'Outline research methodology, data collection, sample sizes, and limits.',
    tasks: ['Confirm quantitative sample limits', 'Explain logical methodology', 'Verify statistical tools']
  },
  {
    title: 'IV. Findings & Academic Review',
    desc: 'Interpret primary results, discuss academic limitations, verify formatting.',
    tasks: ['Verify APA/MLA bibliography formatting', 'Draft conclusion & policy impacts', 'Run Turnitin similarity checks']
  }
];

function WriterAIWorkspace({ order }) {
  const [outlineGenerated, setOutlineGenerated] = useState(false);
  const [outlineProgress, setOutlineProgress] = useState({});
  const [polisherWord, setPolisherWord] = useState('');
  const [polisherOptions, setPolisherOptions] = useState([]);
  const [polishingApplied, setPolishingApplied] = useState(false);

  const getTaskKey = (cardIdx, taskIdx) => `${order.id}-${cardIdx}-${taskIdx}`;

  const toggleTask = (cardIdx, taskIdx) => {
    const key = getTaskKey(cardIdx, taskIdx);
    setOutlineProgress(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getProgressStats = () => {
    if (!outlineGenerated) return 0;
    let total = 0;
    let checked = 0;
    MOCK_OUTLINES.forEach((card, cardIdx) => {
      card.tasks.forEach((_, taskIdx) => {
        total++;
        if (outlineProgress[getTaskKey(cardIdx, taskIdx)]) {
          checked++;
        }
      });
    });
    return Math.round((checked / total) * 100);
  };

  const handleWordPolish = (item) => {
    setPolisherWord(item.word);
    setPolisherOptions(item.options);
    setPolishingApplied(false);
  };

  const handleSynonymClick = (synonym) => {
    navigator.clipboard.writeText(synonym);
    setPolishingApplied(synonym);
  };

  const progress = getProgressStats();

  return (
    <div className="outline-workspace-box no-print">
      <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', margin: '0 0 4px 0', fontSize: '1rem' }}>
        <Sparkles size={20} color="var(--accent)" />
        Writer's AI Outline & Draft Architect
      </h4>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
        Generate structural essay blueprints and use academic vocabulary polishers.
      </p>

      {!outlineGenerated ? (
        <button 
          className="btn-accent" 
          onClick={() => setOutlineGenerated(true)}
          style={{ width: '100%', padding: '12px', justifyContent: 'center' }}
        >
          ⚡ Generate Structural Outline Blueprint
        </button>
      ) : (
        <div>
          <div style={{ background: 'var(--border-light)', height: '8px', borderRadius: '4px', position: 'relative', overflow: 'hidden', marginBottom: '20px' }}>
            <div 
              style={{ 
                width: `${progress}%`, 
                height: '100%', 
                background: 'linear-gradient(90deg, var(--primary) 0%, var(--accent) 100%)',
                transition: 'width 0.4s ease'
              }} 
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Outline Milestone Progress: <strong style={{ color: 'var(--text-main)' }}>{progress}%</strong>
            </span>
            {progress === 100 && (
              <span style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Check size={16} /> All milestones completed!
              </span>
            )}
          </div>

          <div className="outline-cards-grid">
            {MOCK_OUTLINES.map((card, cardIdx) => (
              <div key={cardIdx} className="outline-card-node">
                <h5 style={{ margin: '0 0 6px 0', fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: '700' }}>
                  {card.title}
                </h5>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0 0 12px 0', lineHeight: '1.4' }}>
                  {card.desc}
                </p>
                {card.tasks.map((task, taskIdx) => {
                  const key = getTaskKey(cardIdx, taskIdx);
                  const isChecked = !!outlineProgress[key];
                  return (
                    <label key={taskIdx} className="outline-checklist-item">
                      <input 
                        type="checkbox" 
                        className="outline-checkbox"
                        checked={isChecked}
                        onChange={() => toggleTask(cardIdx, taskIdx)}
                      />
                      <span style={{ textDecoration: isChecked ? 'line-through' : 'none', color: isChecked ? 'var(--text-muted)' : 'var(--text-main)' }}>
                        {task}
                      </span>
                    </label>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="vocab-polisher-box">
            <h5 style={{ margin: '0 0 4px 0', fontSize: '0.9rem', color: 'var(--primary)', fontWeight: '700' }}>
              🔬 Academic Vocabulary Polisher
            </h5>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
              Select a common word to view recommended formal, academic synonyms to elevate the paper's reading complexity.
            </p>

            <div className="vocab-tags-flex">
              {VOCAB_REPLACEMENTS.map(item => (
                <button 
                  key={item.word} 
                  className="vocab-tag-btn"
                  onClick={() => handleWordPolish(item)}
                  style={{ borderColor: polisherWord === item.word ? 'var(--primary)' : 'var(--border-light)' }}
                >
                  "{item.word}"
                </button>
              ))}
            </div>

            {polisherWord && (
              <div style={{ marginTop: '12px', background: 'var(--bg-card)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)', animation: 'slideUp 0.3s ease' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Synonyms for <strong style={{ color: 'var(--text-main)' }}>"{polisherWord}"</strong> (Click to copy):
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                  {polisherOptions.map(opt => (
                    <button 
                      key={opt}
                      onClick={() => handleSynonymClick(opt)}
                      className="vocab-tag-btn"
                      style={{ padding: '4px 10px', fontSize: '0.75rem', background: polishingApplied === opt ? 'var(--accent)' : 'var(--bg-card)', color: polishingApplied === opt ? 'white' : 'var(--text-main)', borderColor: polishingApplied === opt ? 'var(--accent)' : 'var(--border-light)' }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {polishingApplied && (
                  <p style={{ fontSize: '0.75rem', color: '#10b981', margin: '8px 0 0 0', fontWeight: '600' }}>
                    ✔ Copied "{polishingApplied}" to clipboard.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ManageOrders({ user, setView, onLoginSuccess }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // Auth Form States (when logged out)
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      if (authMode === 'login') {
        const data = await api.login(authEmail, authPassword);
        localStorage.setItem('token', data.token);
        onLoginSuccess(data.user);
        // Refresh page/component state
        loadOrders();
      } else {
        const data = await api.register(authEmail, authPassword, authName, authPhone);
        localStorage.setItem('token', data.token);
        onLoginSuccess(data.user);
        loadOrders();
      }
    } catch (err) {
      setAuthError(err.message || 'Authentication failed');
    } finally {
      setAuthLoading(false);
    }
  };
  
  // Available writers for Admin assignment
  const [writers, setWriters] = useState([]);
  const [assigneeId, setAssigneeId] = useState('');

  // Portal Detail Tabs
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'available' (for writer)
  const [detailTab, setDetailTab] = useState('info'); // 'info', 'files', 'chat'

  // Chat States
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);
  const chatInterval = useRef(null);

  // File Upload State
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadType, setUploadType] = useState('instruction');
  const [uploadLoading, setUploadLoading] = useState(false);
  const [orderFiles, setOrderFiles] = useState([]);

  // AI Chat helper popover
  const [showAIReplies, setShowAIReplies] = useState(false);
  const [boldtextPluginOpen, setBoldtextPluginOpen] = useState(false);

  // Load orders lists
  const loadOrders = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await api.getOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Pre-load writers for admin
  const loadWriters = async () => {
    if (!user || user.role !== 'admin') return;
    try {
      setWriters([
        { id: 2, name: 'John Writer (ENL)', email: 'writer@academic.com' }
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadOrders();
    loadWriters();
    return () => {
      if (chatInterval.current) clearInterval(chatInterval.current);
    };
  }, [user]);

  // Poll messages when chat tab is open
  useEffect(() => {
    if (selectedOrder && detailTab === 'chat') {
      loadMessages();
      chatInterval.current = setInterval(loadMessages, 4000);
    } else {
      if (chatInterval.current) {
        clearInterval(chatInterval.current);
        chatInterval.current = null;
      }
    }
    return () => {
      if (chatInterval.current) clearInterval(chatInterval.current);
    };
  }, [selectedOrder, detailTab]);

  const loadMessages = async () => {
    if (!selectedOrder) return;
    try {
      const msgs = await api.getMessages(selectedOrder.id);
      setMessages(msgs);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    } catch (err) {
      console.error(err);
    }
  };

  const loadFiles = async (orderId) => {
    try {
      const files = await api.getOrderFiles(orderId);
      setOrderFiles(files);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
    setDetailTab('info');
    loadFiles(order.id);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedOrder) return;

    try {
      const text = newMessage;
      setNewMessage('');
      await api.sendMessage(selectedOrder.id, text);
      loadMessages();
    } catch (err) {
      alert(err.message);
    }
  };

  // Claim Order (Writer Only)
  const handleClaimOrder = async (orderId) => {
    try {
      await api.assignOrder(orderId, user.id);
      alert('You have claimed this job successfully! It is now in your Assigned Orders list.');
      loadOrders();
      setSelectedOrder(null);
    } catch (err) {
      alert(err.message);
    }
  };

  // Hire Writer (Client Bidding Arena action)
  const handleHireWriter = async (writerName, writerTitle) => {
    if (!selectedOrder) return;
    try {
      // 1. Assign to default writer 2
      await api.assignOrder(selectedOrder.id, 2);
      // 2. Post welcome message from this writer
      await api.sendMessage(selectedOrder.id, `Hi there! I am ${writerName} (${writerTitle}). I am thrilled to accept your project. I will begin researching the literature and preparing the structural draft outline right away! 📚✨`);
      alert(`Success! You have hired ${writerName} for your project. They will begin work immediately.`);
      loadOrders();
      setSelectedOrder(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const mockBidders = selectedOrder ? [
    {
      id: 101,
      name: 'Dr. Sarah Jenkins',
      title: 'PhD in English Literature (Oxford)',
      rating: '4.9',
      ordersCount: 312,
      price: selectedOrder.total_price,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80',
      recommended: true
    },
    {
      id: 102,
      name: 'Prof. Robert Miller',
      title: 'Master of Economics & Stats (Harvard)',
      rating: '4.8',
      ordersCount: 245,
      price: selectedOrder.total_price * 1.05,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&h=200&q=80',
      recommended: false
    },
    {
      id: 103,
      name: 'Elena Rostova',
      title: 'PhD in Bio-Chemistry (Stanford)',
      rating: '4.95',
      ordersCount: 189,
      price: selectedOrder.total_price * 0.95,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&h=200&q=80',
      recommended: false
    }
  ] : [];

  // Assign Writer (Admin Only)
  const handleAssignWriter = async () => {
    if (!assigneeId || !selectedOrder) return;
    try {
      await api.assignOrder(selectedOrder.id, assigneeId);
      alert('Order assigned successfully!');
      loadOrders();
      setSelectedOrder(null);
    } catch (err) {
      alert(err.message);
    }
  };

  // Update Status (Writer/Admin)
  const handleStatusChange = async (newStatus) => {
    if (!selectedOrder) return;
    try {
      await api.updateOrderStatus(selectedOrder.id, newStatus);
      alert('Order status updated successfully.');
      loadOrders();
      setSelectedOrder(null);
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle File Upload
  const handleFileUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadFile || !selectedOrder) return;

    try {
      setUploadLoading(true);
      await api.uploadFile(selectedOrder.id, uploadFile, uploadType);
      setUploadFile(null);
      alert('File uploaded successfully!');
      loadFiles(selectedOrder.id);
    } catch (err) {
      alert(err.message);
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDownload = async (fileId, fileName) => {
    try {
      await api.downloadFile(fileId, fileName);
    } catch (err) {
      alert(err.message);
    }
  };

  if (!user) {
    return (
      <div className="container" style={{ padding: '60px 0', display: 'flex', justifyContent: 'center' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card" 
          style={{ maxWidth: '480px', width: '100%', padding: '40px', background: 'var(--bg-card)', borderColor: 'var(--border-light)' }}
        >
          <h2 style={{ textAlign: 'center', marginBottom: '8px', color: 'var(--text-main)' }}>
            {authMode === 'login' ? 'Sign In to Portal' : 'Create Client Account'}
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
            {authMode === 'login' 
              ? 'Access your academic order status, chat with writers, and download final papers.' 
              : 'Sign up to hire writers, place custom paper assignments, and track delivery progress.'}
          </p>

          {authError && (
            <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '8px', fontSize: '0.88rem', marginBottom: '16px', fontWeight: '500' }}>
              ⚠️ {authError}
            </div>
          )}

          <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {authMode === 'register' && (
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  required 
                  className="form-input" 
                  placeholder="e.g. John Doe"
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                />
              </div>
            )}

            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                required 
                className="form-input" 
                placeholder="email@example.com"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                required 
                className="form-input" 
                placeholder="••••••••"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
              />
            </div>

            {authMode === 'register' && (
              <div className="form-group">
                <label>Phone Number (Optional)</label>
                <input 
                  type="tel" 
                  className="form-input" 
                  placeholder="e.g. +1 (555) 019-2834"
                  value={authPhone}
                  onChange={(e) => setAuthPhone(e.target.value)}
                />
              </div>
            )}

            <button 
              type="submit" 
              className="btn-primary" 
              disabled={authLoading}
              style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}
            >
              {authLoading ? 'Verifying...' : (authMode === 'login' ? 'Sign In' : 'Sign Up')}
            </button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            {authMode === 'login' ? (
              <>
                Don't have an account?{' '}
                <span 
                  onClick={() => { setAuthMode('register'); setAuthError(''); }} 
                  style={{ color: 'var(--primary)', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Sign Up
                </span>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <span 
                  onClick={() => { setAuthMode('login'); setAuthError(''); }} 
                  style={{ color: 'var(--primary)', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Sign In
                </span>
              </>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // Split orders for writer: assigned vs available
  const assignedOrders = orders.filter(o => o.writer_id === user.id);
  const availableOrders = orders.filter(o => o.writer_id === null && o.status === 'pending');
  const displayedOrders = user.role === 'writer' 
    ? (activeTab === 'orders' ? assignedOrders : availableOrders)
    : orders;

  return (
    <div className="container" style={styles.container}>
      {/* Header Info */}
      <div style={styles.headerPanel} className="glass-card glow-card-primary">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={styles.avatar}>
            <User size={32} color="#ffffff" />
          </div>
          <div>
            <h2 style={{ color: '#ffffff', fontSize: '1.6rem' }}>Welcome Back, {user.name}!</h2>
            <span style={{ color: 'var(--dark-text-muted)', fontSize: '0.88rem' }}>
              Logged in as <strong style={{ color: 'var(--primary)' }}>{user.role}</strong> &bull; {user.email}
            </span>
          </div>
        </div>

        {user.role === 'client' && (
          <button className="btn-accent" onClick={() => setView('order')}>
            <PlusCircle size={16} /> Place New Order
          </button>
        )}
      </div>

      <div style={styles.workspace}>
        {/* Left column: Orders list */}
        <div style={styles.listCol}>
          {user.role === 'writer' && (
            <div style={styles.tabHeader}>
              <button 
                onClick={() => { setActiveTab('orders'); setSelectedOrder(null); }}
                style={activeTab === 'orders' ? styles.tabActiveBtn : styles.tabBtn}
              >
                Assigned Orders ({assignedOrders.length})
              </button>
              <button 
                onClick={() => { setActiveTab('available'); setSelectedOrder(null); }}
                style={activeTab === 'available' ? styles.tabActiveBtn : styles.tabBtn}
              >
                Available Jobs ({availableOrders.length})
              </button>
            </div>
          )}

          <div style={styles.listHeader}>
            <h3 style={{ color: 'var(--text-main)' }}>
              {user.role === 'writer' 
                ? (activeTab === 'orders' ? 'Your Assigned Orders' : 'Available Writing Jobs') 
                : 'All Portal Orders'}
            </h3>
            <button style={styles.refreshBtn} onClick={loadOrders} title="Refresh">
              <RefreshCw size={16} />
            </button>
          </div>

          {loading ? (
            <div style={styles.centeredMsg}>Loading portal workspace...</div>
          ) : displayedOrders.length === 0 ? (
            <div style={styles.centeredMsg}>No orders found.</div>
          ) : (
            <div style={styles.ordersList}>
              <AnimatePresence>
                {displayedOrders.map((order) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={order.id}
                    onClick={() => handleSelectOrder(order)}
                    style={selectedOrder?.id === order.id ? styles.orderCardActive : styles.orderCard}
                  >
                    <div style={styles.orderCardHeader}>
                      <span style={styles.orderId}>#ORD-{order.id}</span>
                      <span className={`badge badge-${order.status}`}>{order.status}</span>
                    </div>
                    <strong style={styles.orderTopic}>{order.topic}</strong>
                    <div style={styles.orderMeta}>
                      <span>{order.paper_type} &bull; {order.page_qty} pg</span>
                      <span style={{ color: 'var(--accent)', fontWeight: '700' }}>${order.total_price.toFixed(2)}</span>
                    </div>
                    <div style={styles.orderDeadline}>
                      <Clock size={12} />
                      <span>Deadline: {order.deadline_date}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Right column: Order Workspace Details */}
        <div style={styles.detailCol}>
          <AnimatePresence mode="wait">
            {selectedOrder ? (
              <motion.div 
                key={selectedOrder.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="glass-card" 
                style={styles.detailCard}
              >
                {/* Order Detail Header */}
                <div style={styles.detailHeader} className="no-print">
                  <div>
                    <span style={styles.detailOrderId}>Order #ORD-{selectedOrder.id}</span>
                    <h3 style={{ color: 'var(--text-main)', marginTop: '4px' }}>{selectedOrder.topic}</h3>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span className={`badge badge-${selectedOrder.status}`} style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>

                {/* Milestone Stepper */}
                {selectedOrder.status === 'cancelled' ? (
                  <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px 20px', borderRadius: '8px', fontWeight: 'bold', margin: '20px 0', display: 'flex', alignItems: 'center', gap: '10px' }} className="no-print">
                    <AlertCircle size={20} />
                    This order has been cancelled.
                  </div>
                ) : (
                  <div className="milestone-stepper no-print">
                    <div 
                      className="stepper-progress-line" 
                      style={{ 
                        width: `${selectedOrder.status === 'completed' ? 100 : (steps.indexOf(selectedOrder.status) / (steps.length - 1)) * 100}%` 
                      }} 
                    />
                    {steps.map((step, idx) => {
                      const activeStepIdx = steps.indexOf(selectedOrder.status);
                      const isCompleted = idx < activeStepIdx || selectedOrder.status === 'completed';
                      const isActive = idx === activeStepIdx;
                      return (
                        <div key={step} className={`step-node ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                          <div className="step-circle">
                            {isCompleted ? '✓' : idx + 1}
                          </div>
                          <span className="step-label">{stepLabels[step]}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Tabs navigation */}
                <div style={styles.detailNav} className="no-print">
                  <button 
                    onClick={() => setDetailTab('info')}
                    style={detailTab === 'info' ? styles.detailNavActive : styles.detailNavBtn}
                  >
                    General Info
                  </button>
                  <button 
                    onClick={() => setDetailTab('files')}
                    style={detailTab === 'files' ? styles.detailNavActive : styles.detailNavBtn}
                  >
                    Files & Deliveries ({orderFiles.length})
                  </button>
                  <button 
                    onClick={() => setDetailTab('chat')}
                    style={detailTab === 'chat' ? styles.detailNavActive : styles.detailNavBtn}
                  >
                    Live Discussion
                  </button>
                  <button 
                    onClick={() => setDetailTab('plagiarism')}
                    style={detailTab === 'plagiarism' ? styles.detailNavActive : styles.detailNavBtn}
                  >
                    Originality Inspector
                  </button>
                </div>

                {/* TAB CONTENT: GENERAL INFO */}
                {detailTab === 'info' && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    style={styles.tabPane}
                  >
                    {selectedOrder.status !== 'completed' && selectedOrder.status !== 'cancelled' && (
                      <CountdownTimer 
                        createdAt={selectedOrder.created_at} 
                        deadlineKey={selectedOrder.deadline_date} 
                      />
                    )}
                    <div style={styles.infoGrid} className="no-print">
                      <div style={styles.infoItem}><span>Paper Type</span><strong>{selectedOrder.paper_type}</strong></div>
                      <div style={styles.infoItem}><span>Academic Level</span><strong style={{ textTransform: 'capitalize' }}>{selectedOrder.academic_level}</strong></div>
                      <div style={styles.infoItem}><span>Subject Field</span><strong>{selectedOrder.discipline}</strong></div>
                      <div style={styles.infoItem}><span>Citation Format</span><strong>{selectedOrder.format}</strong></div>
                      <div style={styles.infoItem}><span>Pages Count</span><strong>{selectedOrder.page_qty} pages ({selectedOrder.spacing} spacing)</strong></div>
                      <div style={styles.infoItem}><span>Sources Cited</span><strong>{selectedOrder.sources_qty} source references</strong></div>
                      <div style={styles.infoItem}><span>PPT Slides</span><strong>{selectedOrder.slides_qty} slides</strong></div>
                      <div style={styles.infoItem}><span>Charts/Graphs</span><strong>{selectedOrder.charts_qty} charts</strong></div>
                      <div style={styles.infoItem}><span>Deadline</span><strong>{selectedOrder.deadline_date}</strong></div>
                      <div style={styles.infoItem}><span>Total Paid</span><strong style={{ color: 'var(--accent)' }}>${selectedOrder.total_price.toFixed(2)}</strong></div>
                    </div>

                    <div style={styles.descBlock} className="no-print">
                      <strong>Guidelines / Instructions:</strong>
                      <p style={{ marginTop: '8px', whiteSpace: 'pre-wrap' }}>
                        {selectedOrder.instructions || "No custom instructions provided."}
                      </p>
                    </div>

                    {/* Hired Writer Profile Section */}
                    {selectedOrder.writer_id && (
                      <div style={{ background: 'var(--primary-light)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(0, 122, 255, 0.1)', marginTop: '24px' }} className="no-print">
                        <h4 style={{ color: 'var(--primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <User size={18} /> Assigned Writer Profile
                        </h4>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', margin: 0 }}>
                          Your paper is being written by <strong>John Writer (PhD)</strong>. You can message them directly in the <strong>Live Discussion</strong> tab above.
                        </p>
                      </div>
                    )}

                    {/* Writer AI Workspace Outline Architect */}
                    {selectedOrder.writer_id && ((user.role === 'writer' && selectedOrder.writer_id === user.id) || user.role === 'admin') && (
                      <WriterAIWorkspace order={selectedOrder} />
                    )}

                    {/* Bidding Arena for client when order is pending */}
                    {selectedOrder.status === 'pending' && user.role === 'client' && (
                      <div style={{ marginTop: '32px', borderTop: '1px solid var(--border-light)', paddingTop: '24px' }} className="no-print">
                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', marginBottom: '6px' }}>
                          <Sparkles size={20} color="var(--accent)" />
                          Academic Writer Bidding Arena
                        </h4>
                        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                          These verified PhD academic authors are bidding on your assignment details. Hire a writer to start working instantly.
                        </p>
                        
                        <div className="bidding-grid">
                          {mockBidders.map(bid => (
                            <div key={bid.id} className={`bid-card ${bid.recommended ? 'recommended' : ''}`}>
                              <img src={bid.avatar} alt={bid.name} className="bid-avatar" />
                              <div className="bid-name">{bid.name}</div>
                              <div className="bid-title">{bid.title}</div>
                              <div className="bid-stats">
                                <div className="bid-stat">
                                  <span className="bid-stat-val">★ {bid.rating}</span>
                                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Rating</span>
                                </div>
                                <div className="bid-stat">
                                  <span className="bid-stat-val">{bid.ordersCount}</span>
                                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Papers Done</span>
                                </div>
                              </div>
                              <div className="bid-price">${bid.price.toFixed(2)}</div>
                              <button 
                                className="btn-accent" 
                                style={{ width: '100%', padding: '10px' }}
                                onClick={() => handleHireWriter(bid.name, bid.title)}
                              >
                                Hire Writer
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions panel */}
                    <div style={styles.actionsPanel} className="no-print">
                      {/* Admin assignment controls */}
                      {user.role === 'admin' && (
                        <div style={styles.adminAssignBlock}>
                          <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
                            <label>Assign to Writer</label>
                            <select 
                              value={assigneeId} 
                              onChange={(e) => setAssigneeId(e.target.value)}
                              className="form-input"
                            >
                              <option value="">-- Select Writer --</option>
                              {writers.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                            </select>
                          </div>
                          <button className="btn-primary" onClick={handleAssignWriter} disabled={!assigneeId} style={{ marginTop: '20px' }}>
                            Assign Writer
                          </button>
                        </div>
                      )}

                      {/* Writer Claim Option */}
                      {user.role === 'writer' && selectedOrder.writer_id === null && (
                        <button className="btn-accent" onClick={() => handleClaimOrder(selectedOrder.id)} style={{ width: '100%', justifyContent: 'center' }}>
                          Accept & Claim Writing Job
                        </button>
                      )}

                      {/* Status Modifiers */}
                      {((user.role === 'writer' && selectedOrder.writer_id === user.id) || user.role === 'admin') && (
                        <div style={styles.statusUpdateRow}>
                          <span style={{ fontWeight: '600' }}>Change Order Status:</span>
                          <div style={styles.statusBtns}>
                            {selectedOrder.status === 'assigned' && (
                              <button onClick={() => handleStatusChange('in_progress')} style={styles.statusInProgBtn}>
                                Start Writing (In Progress)
                              </button>
                            )}
                            {selectedOrder.status === 'in_progress' && (
                              <button onClick={() => handleStatusChange('review')} style={styles.statusReviewBtn}>
                                Submit for Client Review
                              </button>
                            )}
                            {user.role === 'admin' && selectedOrder.status === 'review' && (
                              <button onClick={() => handleStatusChange('completed')} style={styles.statusCompleteBtn}>
                                Approve & Mark Completed
                              </button>
                            )}
                            {user.role === 'admin' && selectedOrder.status !== 'completed' && (
                              <button onClick={() => handleStatusChange('cancelled')} style={styles.statusCancelBtn}>
                                Cancel Order
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Printable Invoice Actions */}
                      <div style={{ marginTop: '24px', display: 'flex', gap: '12px', width: '100%', justifyContent: 'flex-start', borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
                        <button 
                          className="btn-secondary" 
                          onClick={handlePrintReceipt}
                          style={{ padding: '8px 20px', fontSize: '0.85rem' }}
                        >
                          🖨️ Print Invoice Receipt
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* TAB CONTENT: FILES */}
                {detailTab === 'files' && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    style={styles.tabPane}
                  >
                    <h4 style={{ marginBottom: '16px' }}>Order Attachments & Deliveries</h4>
                    
                    {orderFiles.length === 0 ? (
                      <div style={styles.noFilesBox}>No files uploaded yet.</div>
                    ) : (
                      <div style={styles.filesList}>
                        {orderFiles.map(file => (
                          <div key={file.id} style={styles.fileRow}>
                            <FileText size={20} color="var(--primary)" />
                            <div style={{ flex: 1 }}>
                              <strong>{file.file_name}</strong>
                              <div style={styles.fileMeta}>
                                <span style={styles.fileTag}>{file.file_type}</span>
                                <span>Uploaded by {file.uploader_name} ({file.uploader_role})</span>
                              </div>
                            </div>
                            <button style={styles.downloadBtn} onClick={() => handleDownload(file.id, file.file_name)}>
                              <Download size={16} /> Download
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Upload new file form */}
                    <form onSubmit={handleFileUploadSubmit} style={styles.uploadForm}>
                      <strong style={{ display: 'block', marginBottom: '12px' }}>Upload New Attachment</strong>
                      
                      <div className="form-group" style={{ marginBottom: '16px' }}>
                        <label>File Type Classification</label>
                        <select 
                          value={uploadType} 
                          onChange={(e) => setUploadType(e.target.value)} 
                          className="form-input"
                        >
                          {user.role === 'client' && <option value="instruction">Instruction Document</option>}
                          {user.role === 'writer' && (
                            <>
                              <option value="draft">Draft Copy</option>
                              <option value="final">Final Essay Delivery</option>
                            </>
                          )}
                          {user.role === 'admin' && (
                            <>
                              <option value="instruction">Instruction Document</option>
                              <option value="draft">Draft Copy</option>
                              <option value="final">Final Essay Delivery</option>
                            </>
                          )}
                        </select>
                      </div>

                      <div className="upload-zone" onClick={() => document.getElementById('dashboard-file-upload').click()}>
                        <UploadCloud size={36} color="var(--primary)" style={{ marginBottom: '8px' }} />
                        <p style={{ fontWeight: '600', fontSize: '0.9rem', margin: '0 0 4px 0' }}>Click to select a document from your computer</p>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Supported formats: PDF, Word, Excel, ZIP (Max 10MB)</span>
                      </div>
                      <input 
                        type="file" 
                        id="dashboard-file-upload" 
                        required 
                        style={{ display: 'none' }}
                        onChange={(e) => setUploadFile(e.target.files[0])} 
                      />

                      {uploadFile && (
                        <div style={{ marginTop: '16px', background: 'var(--primary-light)', padding: '12px 16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--primary)' }}>Selected: {uploadFile.name}</span>
                          <button 
                            type="submit" 
                            className="btn-primary" 
                            disabled={uploadLoading}
                            style={{ padding: '8px 20px', fontSize: '0.85rem' }}
                          >
                            {uploadLoading ? 'Uploading...' : 'Confirm Upload'}
                          </button>
                        </div>
                      )}
                    </form>
                  </motion.div>
                )}

                {/* TAB CONTENT: DISCUSSION CHAT */}
                {detailTab === 'chat' && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    style={styles.chatPane}
                  >
                    <div style={styles.chatHeader}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <strong>Order Discussion Board</strong>
                        <button 
                          type="button" 
                          onClick={() => setShowAIReplies(!showAIReplies)} 
                          className="ai-helper-btn"
                        >
                          <Sparkles size={12} /> AI Quick Replies
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setBoldtextPluginOpen(true)} 
                          className="boldtext-trigger-btn"
                        >
                          <Sparkles size={12} /> BoldText AI
                        </button>
                      </div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Messages are confidential</span>
                    </div>

                    {/* AI Chat Helpers panel */}
                    <AnimatePresence>
                      {showAIReplies && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="ai-helper-panel"
                          style={{ margin: '10px 16px 0 16px' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                            <Wand2 size={14} color="#c084fc" />
                            <strong style={{ fontSize: '0.82rem' }}>AI Suggested Message Drafts</strong>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {AI_PHRASES.map((phrase, idx) => (
                              <div 
                                key={idx} 
                                onClick={() => { setNewMessage(phrase); setShowAIReplies(false); }}
                                className="ai-suggestion-item"
                                style={{ fontSize: '0.8rem', padding: '8px 12px', margin: 0 }}
                              >
                                {phrase}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div style={styles.chatMessagesList}>
                      {messages.length === 0 ? (
                        <div style={styles.noChatBox}>No discussion messages. Introduce yourself or clarify instructions!</div>
                      ) : (
                        messages.map(msg => {
                          const isSelf = msg.sender_id === user.id;
                          return (
                            <motion.div 
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              key={msg.id}
                              style={isSelf ? styles.msgRowSelf : styles.msgRow}
                            >
                              <div style={isSelf ? styles.msgBubbleSelf : styles.msgBubble}>
                                <div style={styles.msgUploader}>
                                  <strong>{msg.sender_name}</strong>
                                  <span style={styles.msgRole}>({msg.sender_role})</span>
                                </div>
                                <p style={{ margin: 0, fontSize: '0.92rem' }}>{msg.message_text}</p>
                                <span style={styles.msgTime}>
                                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </motion.div>
                          );
                        })
                      )}
                      <div ref={chatEndRef} />
                    </div>

                    <form onSubmit={handleSendMessage} style={styles.chatForm}>
                      <input 
                        type="text" 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message or use AI quick replies..."
                        style={styles.chatInput}
                      />
                      <button type="submit" style={styles.chatSendBtn}>
                        <Send size={16} /> Send
                      </button>
                    </form>
                  </motion.div>
                )}

                {/* TAB CONTENT: ORIGINALITY INSPECTOR */}
                {detailTab === 'plagiarism' && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    style={styles.tabPane}
                  >
                    <PlagiarismInspector defaultText={
`An Analysis of "${selectedOrder.topic}"

This paper examines the key structural elements of "${selectedOrder.topic}". The implications of generative AI tools on academic writing courses. Focus on both the challenges (plagiarism risks) and opportunities (brainstorming, grammar checking) for undergraduate students.

In modern higher education, the integration of these models has created a dual paradigm. While educators express concern over plagiarism, researchers note that brainstorming and grammatical polishing can substantially improve students' critical analysis. This study discusses both viewpoints.`
                    } />
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={styles.emptyDetail} 
                className="glass-card"
              >
                <Briefcase size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
                <h3>Select an Order</h3>
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', maxWidth: '320px', marginTop: '8px' }}>
                  Pick an order from the list on the left to view instructions, files, and chat with clients/writers.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Printable Invoice Receipt for window.print() */}
      {selectedOrder && (
        <div className="printable-invoice" style={{ display: 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #000', paddingBottom: '16px', marginBottom: '24px' }}>
            <div>
              <h1 style={{ fontSize: '2rem', margin: 0 }}>Academia Writing Services</h1>
              <p style={{ margin: '4px 0 0 0', color: '#555' }}>Premium Custom Academic Solutions</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <h2 style={{ margin: 0, color: '#333' }}>INVOICE RECEIPT</h2>
              <p style={{ margin: '4px 0 0 0' }}>Invoice #: <strong>INV-ORD-{selectedOrder.id}</strong></p>
              <p style={{ margin: '2px 0 0 0' }}>Date: {new Date(selectedOrder.created_at || Date.now()).toLocaleDateString()}</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '32px' }}>
            <div>
              <h4 style={{ margin: '0 0 8px 0', textTransform: 'uppercase', color: '#555' }}>Billed To:</h4>
              <strong>{user.name}</strong>
              <p style={{ margin: '4px 0 0 0' }}>{user.email}</p>
              {user.phone && <p style={{ margin: '2px 0 0 0' }}>Phone: {user.phone}</p>}
            </div>
            <div>
              <h4 style={{ margin: '0 0 8px 0', textTransform: 'uppercase', color: '#555' }}>Order Details:</h4>
              <p style={{ margin: '0' }}>Discipline: <strong>{selectedOrder.discipline}</strong></p>
              <p style={{ margin: '4px 0 0 0' }}>Academic Level: <strong>{selectedOrder.academic_level}</strong></p>
              <p style={{ margin: '4px 0 0 0' }}>Format style: <strong>{selectedOrder.format}</strong></p>
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '32px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #000' }}>
                <th style={{ textAlign: 'left', padding: '8px 0' }}>Description</th>
                <th style={{ textAlign: 'center', padding: '8px 0' }}>Quantity</th>
                <th style={{ textAlign: 'right', padding: '8px 0' }}>Unit Rate</th>
                <th style={{ textAlign: 'right', padding: '8px 0' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '12px 0' }}>
                  <strong>{selectedOrder.paper_type} Writing Service</strong><br />
                  Topic: "{selectedOrder.topic}"<br />
                  Spacing: {selectedOrder.spacing} spacing
                </td>
                <td style={{ textAlign: 'center', padding: '12px 0' }}>{selectedOrder.page_qty} Page(s)</td>
                <td style={{ textAlign: 'right', padding: '12px 0' }}>${(selectedOrder.total_price / selectedOrder.page_qty).toFixed(2)}</td>
                <td style={{ textAlign: 'right', padding: '12px 0' }}>${selectedOrder.total_price.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: '250px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #ddd' }}>
                <span>Subtotal:</span>
                <span>${selectedOrder.total_price.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #ddd' }}>
                <span>Tax / Fees:</span>
                <span>$0.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontWeight: 'bold', fontSize: '1.1rem' }}>
                <span>Total Paid:</span>
                <span>${selectedOrder.total_price.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #ccc', marginTop: '40px', paddingTop: '16px', textAlign: 'center', fontSize: '0.85rem', color: '#666' }}>
            Thank you for choosing Academia Writing. Your satisfaction is our top priority. For support, contact admin@academic.com.
          </div>
        </div>
      )}

      <BoldTextAIPlugin 
        isOpen={boldtextPluginOpen} 
        onClose={() => setBoldtextPluginOpen(false)} 
        initialText={newMessage} 
        onApply={(processedText) => setNewMessage(processedText)} 
        theme="dark"
      />
    </div>
  );
}

const styles = {
  container: {
    padding: '40px 0 80px 0',
  },
  headerPanel: {
    background: '#090d16',
    color: '#ffffff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 32px',
    marginBottom: '32px',
    boxShadow: 'var(--shadow-lg)',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  avatar: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: 'var(--primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px var(--primary-glow)',
  },
  workspace: {
    display: 'flex',
    gap: '30px',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  listCol: {
    flex: 1,
    minWidth: '300px',
  },
  detailCol: {
    flex: 2,
    minWidth: '320px',
  },
  tabHeader: {
    display: 'flex',
    background: 'rgba(0,0,0,0.03)',
    border: '1px solid var(--border-light)',
    borderRadius: '10px',
    overflow: 'hidden',
    marginBottom: '20px',
  },
  tabBtn: {
    flex: 1,
    background: 'none',
    border: 'none',
    padding: '12px',
    fontWeight: '600',
    color: 'var(--text-muted)',
    cursor: 'pointer',
  },
  tabActiveBtn: {
    flex: 1,
    background: '#ffffff',
    border: 'none',
    padding: '12px',
    fontWeight: '700',
    color: 'var(--primary)',
    boxShadow: 'var(--shadow-sm)',
  },
  listHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  refreshBtn: {
    background: 'none',
    border: '1px solid var(--border-light)',
    color: 'var(--text-muted)',
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'var(--transition)',
    ':hover': {
      color: 'var(--primary)',
      background: 'var(--primary-light)',
    }
  },
  ordersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  orderCard: {
    background: '#ffffff',
    border: '1px solid var(--border-light)',
    borderRadius: '12px',
    padding: '16px 20px',
    cursor: 'pointer',
    transition: 'var(--transition)',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: 'var(--shadow-md)',
    }
  },
  orderCardActive: {
    background: '#ffffff',
    border: '2px solid var(--primary)',
    borderRadius: '12px',
    padding: '15px 19px',
    cursor: 'pointer',
    boxShadow: 'var(--shadow-md)',
  },
  orderCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  orderId: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: 'var(--text-muted)',
  },
  orderTopic: {
    fontSize: '0.98rem',
    color: 'var(--text-main)',
    display: 'block',
    marginBottom: '8px',
  },
  orderMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    marginBottom: '8px',
  },
  orderDeadline: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.8rem',
    color: '#b54708',
    background: '#fef0c7',
    padding: '4px 8px',
    borderRadius: '4px',
    width: 'fit-content',
    fontWeight: '600',
  },
  centeredMsg: {
    textAlign: 'center',
    padding: '40px',
    color: 'var(--text-muted)',
  },
  detailCard: {
    background: '#ffffff',
    border: '1px solid var(--border-light)',
    padding: '32px',
    boxShadow: 'var(--shadow-lg)',
  },
  emptyDetail: {
    background: '#ffffff',
    border: '1px solid var(--border-light)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '80px 40px',
  },
  detailHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '20px',
    borderBottom: '1px solid var(--border-light)',
    paddingBottom: '20px',
    marginBottom: '20px',
  },
  detailOrderId: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: 'var(--primary)',
    letterSpacing: '0.05em',
  },
  detailNav: {
    display: 'flex',
    borderBottom: '1px solid var(--border-light)',
    marginBottom: '24px',
    gap: '20px',
  },
  detailNavBtn: {
    background: 'none',
    border: 'none',
    padding: '10px 4px',
    fontWeight: '600',
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    position: 'relative',
  },
  detailNavActive: {
    background: 'none',
    border: 'none',
    padding: '10px 4px',
    fontWeight: '700',
    fontSize: '0.9rem',
    color: 'var(--primary)',
    cursor: 'pointer',
    position: 'relative',
    borderBottom: '2px solid var(--primary)',
  },
  tabPane: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    background: 'var(--bg-main)',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid var(--border-light)',
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    fontSize: '0.88rem',
    span: {
      color: 'var(--text-muted)',
      fontWeight: '500',
      fontSize: '0.78rem',
    }
  },
  descBlock: {
    borderLeft: '4px solid var(--primary)',
    paddingLeft: '16px',
    fontSize: '0.92rem',
  },
  actionsPanel: {
    marginTop: '20px',
    borderTop: '1px solid var(--border-light)',
    paddingTop: '20px',
  },
  adminAssignBlock: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '16px',
    background: 'var(--bg-main)',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid var(--border-light)',
  },
  statusUpdateRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    background: 'var(--bg-main)',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid var(--border-light)',
  },
  statusBtns: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  statusInProgBtn: {
    background: 'var(--primary)',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  statusReviewBtn: {
    background: 'var(--accent)',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  statusCompleteBtn: {
    background: 'var(--accent)',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  statusCancelBtn: {
    background: '#dc2626',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  noFilesBox: {
    textAlign: 'center',
    padding: '30px',
    border: '1px dashed var(--border-light)',
    borderRadius: '8px',
    color: 'var(--text-muted)',
  },
  filesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  fileRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    background: 'var(--bg-main)',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid var(--border-light)',
  },
  fileMeta: {
    display: 'flex',
    gap: '10px',
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    marginTop: '4px',
    alignItems: 'center',
  },
  fileTag: {
    background: 'var(--primary-light)',
    color: 'var(--primary)',
    padding: '1px 6px',
    borderRadius: '4px',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  downloadBtn: {
    background: 'none',
    border: '1px solid var(--primary)',
    color: 'var(--primary)',
    padding: '6px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.8rem',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    ':hover': {
      background: 'var(--primary-light)',
    }
  },
  uploadForm: {
    marginTop: '24px',
    borderTop: '1px solid var(--border-light)',
    paddingTop: '24px',
  },
  uploadGrid: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
  },
  chatPane: {
    display: 'flex',
    flexDirection: 'column',
    height: '460px',
    border: '1px solid var(--border-light)',
    borderRadius: '12px',
    overflow: 'hidden',
    background: 'var(--bg-main)',
  },
  chatHeader: {
    background: '#ffffff',
    borderBottom: '1px solid var(--border-light)',
    padding: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatMessagesList: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  noChatBox: {
    textAlign: 'center',
    color: 'var(--text-muted)',
    margin: 'auto',
    maxWidth: '280px',
    fontSize: '0.88rem',
  },
  msgRow: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
  msgRowSelf: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  msgBubble: {
    background: '#ffffff',
    border: '1px solid var(--border-light)',
    padding: '12px 16px',
    borderRadius: '12px 12px 12px 0',
    maxWidth: '75%',
    boxShadow: 'var(--shadow-sm)',
  },
  msgBubbleSelf: {
    background: 'var(--primary-light)',
    border: '1px solid rgba(0, 122, 255, 0.15)',
    padding: '12px 16px',
    borderRadius: '12px 12px 0 12px',
    maxWidth: '75%',
    boxShadow: 'var(--shadow-sm)',
  },
  msgUploader: {
    display: 'flex',
    gap: '6px',
    fontSize: '0.78rem',
    marginBottom: '4px',
  },
  msgRole: {
    color: 'var(--text-muted)',
    textTransform: 'capitalize',
  },
  msgTime: {
    display: 'block',
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
    textAlign: 'right',
    marginTop: '6px',
  },
  chatForm: {
    background: '#ffffff',
    borderTop: '1px solid var(--border-light)',
    padding: '12px',
    display: 'flex',
    gap: '8px',
  },
  chatInput: {
    flex: 1,
    border: '1px solid var(--border-light)',
    borderRadius: '8px',
    padding: '10px 16px',
    fontSize: '0.9rem',
  },
  chatSendBtn: {
    background: 'var(--primary)',
    color: '#ffffff',
    border: 'none',
    padding: '0 16px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  }
};
