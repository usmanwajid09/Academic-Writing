import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { PRICING_MATRIX, DEADLINE_LABELS } from '../components/Calculator';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, FileText, UserPlus, Info, CheckCircle2, FileUp, Plus, Minus, Tag, ShieldCheck, Sparkles, Wand2 } from 'lucide-react';
import BoldTextAIPlugin from '../components/BoldTextAIPlugin';

const DISCIPLINES = [
  'English Literature', 'History', 'Business & Management', 'Marketing', 'Accounting & Finance',
  'Economics', 'Psychology', 'Sociology', 'Political Science', 'Law', 'Nursing & Health',
  'Biology', 'Chemistry', 'Physics', 'Computer Sciences', 'Engineering', 'Creative Writing'
];

const MOCK_AI_TOPICS = {
  'Business & Management': [
    "Corporate Social Responsibility and Brand Trust in Generation Z",
    "Sustainable Supply Chain Strategies in Modern E-commerce Retail",
    "Evaluating Hybrid Workspace Productivity and Employee Well-being"
  ],
  'Accounting & Finance': [
    "Financial Risk Assessment of Decoupling in Global Trade Markets",
    "Tesla's Valuation Model in the Transition to Sustainable Energy",
    "Cryptocurrency Integration and Regulatory Hurdles for Commercial Banks"
  ],
  'Psychology': [
    "Cognitive Dissonance and Self-Identity inside Virtual Social Spaces",
    "Impact of Sleep Deprivation on Working Memory and Executive Function",
    "Psychological Resilience and Coping Mechanisms in Remote Tech Workforces"
  ],
  'Computer Sciences': [
    "Security Analysis of Decentralized Identity Protocols in Web3",
    "Optimizing Edge Computing Networks for Real-time IoT Applications",
    "Ethical Boundaries and Bias Mitigation in Generative AI Large Language Models"
  ],
  'default': [
    "A Comparative Analysis of Policy Frameworks in Modern Education",
    "Addressing Global Health Disparities in Urban Healthcare Systems",
    "Technological Innovation and the Future of Labor in Automated Sectors"
  ]
};

const MOCK_AI_OUTLINES = {
  'Essay (any type)': `I. Introduction
   A. Hook: Introduce the core concept
   B. Background Context
   C. Thesis Statement: Clear central argument
II. Body Paragraph 1: Primary Argument
   A. Main Point & Topic Sentence
   B. Evidence / Citations
   C. Analysis: How it supports thesis
III. Body Paragraph 2: Secondary Supporting Argument
   A. Main Point & Supporting Evidence
   B. Counter-argument acknowledgement
   C. Rebuttal & Integration
IV. Conclusion
   A. Restatement of Thesis in new words
   B. Summary of main points
   C. Final thoughts / Call to action`,

  'Research Paper': `I. Abstract (Overview of research questions & methodology)
II. Introduction
   A. Problem Statement
   B. Research Objectives & Scope
III. Literature Review
   A. Historical Theories & Current Scholarly Debates
   B. Gaps in existing academic literature
IV. Methodology
   A. Research Design (Qualitative/Quantitative)
   B. Sample Selection & Data Collection tools
V. Results & Discussion
   A. Analysis of findings
   B. Limitations of study
VI. Conclusion & Policy Recommendations`,

  'Case Study': `I. Executive Summary
II. Background & Case Description
   A. Profile of the Subject (Organization/Individual)
   B. Chronological timeline of events
III. Analysis of Core Issues
   A. Identification of primary problem
   B. Root causes and systemic issues
IV. Proposed Solutions & Alternatives
   A. Option 1: Implementation cost & risks
   B. Option 2: Feasibility & projected outcomes
V. Recommended Action Plan & Timeline`
};

export default function OrderNow({ initialCalcState, user, onLoginSuccess, setView }) {
  // --- Form States ---
  const [level, setLevel] = useState(initialCalcState?.academic_level || 'highschool');
  const [paperType, setPaperType] = useState(initialCalcState?.paper_type || 'Essay (any type)');
  const [discipline, setDiscipline] = useState(initialCalcState?.discipline || 'Business & Management');
  const [topic, setTopic] = useState('');
  const [instructions, setInstructions] = useState('');
  const [format, setFormat] = useState('APA');
  const [deadline, setDeadline] = useState(initialCalcState?.deadline_key || '14d');
  const [pages, setPages] = useState(initialCalcState?.page_qty || 1);
  const [spacing, setSpacing] = useState(initialCalcState?.spacing || 'double');
  const [sources, setSources] = useState(0);
  const [charts, setCharts] = useState(0);
  const [slides, setSlides] = useState(0);
  
  // Advanced settings
  const [writerCategory, setWriterCategory] = useState('standard'); // standard, advanced (+25%), enl (+30%)
  const [copySources, setCopySources] = useState(false); // +$12.95
  const [progressiveDelivery, setProgressiveDelivery] = useState(false); // +10%
  
  // Coupon
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0); // in percent
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');

  // Files
  const [uploadedFile, setUploadedFile] = useState(null);

  // Authentication mode in Step 2
  const [authMode, setAuthMode] = useState('signup'); // signup or login
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Payment Simulator States
  const [paymentMethod, setPaymentMethod] = useState('easypaisa'); // easypaisa, jazzcash, card, bank
  const [paymentPhone, setPaymentPhone] = useState('');
  const [paymentCardName, setPaymentCardName] = useState('');
  const [paymentCardNum, setPaymentCardNum] = useState('');
  const [paymentCardExpiry, setPaymentCardExpiry] = useState('');
  const [paymentCardCVC, setPaymentCardCVC] = useState('');
  const [paymentTxnId, setPaymentTxnId] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentOTP, setPaymentOTP] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // --- AI Writing Helper States ---
  const [showAITopics, setShowAITopics] = useState(false);
  const [aiTopicsList, setAiTopicsList] = useState([]);
  const [aiOutlineGenerating, setAiOutlineGenerating] = useState(false);
  const [boldtextPluginOpen, setBoldtextPluginOpen] = useState(false);

  // --- Dynamic Pricing Logic ---
  const [pricing, setPricing] = useState({
    base: 0,
    slides: 0,
    charts: 0,
    writerAdd: 0,
    progressiveAdd: 0,
    copySourcesAdd: 0,
    discountAdd: 0,
    subtotal: 0,
    total: 0
  });

  useEffect(() => {
    // 1. Get base page price from matrix
    let pageRate = PRICING_MATRIX[level][deadline] || 10;
    if (spacing === 'single') {
      pageRate = pageRate * 2;
    }
    const basePrice = pageRate * pages;

    // 2. Slides and Charts rates
    const slidesPrice = slides * 5.00; // $5 per slide
    const chartsPrice = charts * 10.00; // $10 per chart

    // 3. Subtotal before multiplier-based calculations
    const primaryCost = basePrice + slidesPrice + chartsPrice;

    // 4. Writer rank surcharge
    let writerCategoryRate = 0;
    if (writerCategory === 'advanced') writerCategoryRate = 0.25; // +25%
    if (writerCategory === 'enl') writerCategoryRate = 0.30; // +30%
    const writerSurcharge = primaryCost * writerCategoryRate;

    // 5. Additional services
    const copySourcesCost = copySources ? 12.95 : 0;
    const progressiveCost = progressiveDelivery ? (primaryCost * 0.10) : 0; // +10%

    // 6. Subtotal before coupon
    const subtotal = primaryCost + writerSurcharge + copySourcesCost + progressiveCost;

    // 7. Coupon discount deduction
    const discountAmount = subtotal * (couponDiscount / 100);
    const finalTotal = subtotal - discountAmount;

    setPricing({
      base: basePrice,
      slides: slidesPrice,
      charts: chartsPrice,
      writerAdd: writerSurcharge,
      progressiveAdd: progressiveCost,
      copySourcesAdd: copySourcesCost,
      discountAdd: discountAmount,
      subtotal: subtotal,
      total: finalTotal
    });
  }, [level, deadline, pages, spacing, slides, charts, writerCategory, copySources, progressiveDelivery, couponDiscount]);

  // --- Coupon verification ---
  const handleApplyCoupon = () => {
    setCouponError('');
    if (couponCode.trim().toUpperCase() === 'SAVE25') {
      setCouponDiscount(25);
      setCouponApplied(true);
    } else {
      setCouponError('Invalid coupon code. Try SAVE25');
      setCouponDiscount(0);
      setCouponApplied(false);
    }
  };

  // --- File input ---
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  // --- Final Checkout Placement ---
  const executeCheckout = async (currentUser) => {
    try {
      const orderData = {
        academic_level: level,
        paper_type: paperType,
        discipline: discipline,
        topic: topic || "Writer's Choice",
        instructions: instructions,
        format: format,
        deadline_date: deadline,
        page_qty: pages,
        spacing: spacing,
        sources_qty: sources,
        charts_qty: charts,
        slides_qty: slides,
        writer_category: writerCategory,
        addons: {
          copy_sources: copySources,
          progressive_delivery: progressiveDelivery,
          coupon_code: couponApplied ? 'SAVE25' : null
        },
        total_price: pricing.total
      };

      const res = await api.createOrder(orderData);

      if (uploadedFile) {
        await api.uploadFile(res.id, uploadedFile, 'instruction');
      }

      setView('portal');
    } catch (err) {
      alert('Error placing order: ' + err.message);
    }
  };

  // --- Authentication Handler ---
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      let loggedInUser = null;
      if (authMode === 'signup') {
        const data = await api.register(authEmail, authPassword, authName, authPhone);
        localStorage.setItem('token', data.token);
        loggedInUser = data.user;
        onLoginSuccess(data.user);
      } else {
        const data = await api.login(authEmail, authPassword);
        localStorage.setItem('token', data.token);
        loggedInUser = data.user;
        onLoginSuccess(data.user);
      }

      if (loggedInUser) {
        setTimeout(() => {
          const el = document.getElementById('step-payment-sec');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 150);
      }
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      const el = document.getElementById('step-account-sec');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        setAuthError('Please login or create an account to complete your checkout.');
      }
      return;
    }

    // Validate payment fields
    if (paymentMethod === 'easypaisa' || paymentMethod === 'jazzcash') {
      if (!paymentPhone.trim()) {
        alert('Please enter your mobile wallet account number.');
        return;
      }
    } else if (paymentMethod === 'card') {
      if (!paymentCardName.trim() || !paymentCardNum.trim() || !paymentCardExpiry.trim() || !paymentCardCVC.trim()) {
        alert('Please fill in all credit card details.');
        return;
      }
    } else if (paymentMethod === 'bank') {
      if (!paymentTxnId.trim()) {
        alert('Please enter your bank transfer Transaction ID (TXN ID).');
        return;
      }
    }

    // Open simulated payment gateway modal
    setShowPaymentModal(true);
    setPaymentProcessing(true);
    setPaymentSuccess(false);
    setPaymentOTP('');

    // Simulate payment authorization processing
    setTimeout(() => {
      setPaymentProcessing(false);
    }, 1500);
  };

  // --- Simulated AI Topic Improver ---
  const handleAITopicImprover = () => {
    const list = MOCK_AI_TOPICS[discipline] || MOCK_AI_TOPICS['default'];
    setAiTopicsList(list);
    setShowAITopics(!showAITopics);
  };

  const handleSelectAITopic = (selectedTopic) => {
    setTopic(selectedTopic);
    setShowAITopics(false);
  };

  // --- Simulated AI Outline Generator ---
  const handleAIOutlineGenerator = () => {
    setAiOutlineGenerating(true);
    let outlineTemplate = MOCK_AI_OUTLINES[paperType] || MOCK_AI_OUTLINES['Essay (any type)'];
    
    // Simulate typing delay
    setTimeout(() => {
      setInstructions(prev => {
        const prepend = prev ? prev + '\n\n' : '';
        return prepend + `[AI Generated Structured Outline]:\n${outlineTemplate}`;
      });
      setAiOutlineGenerating(false);
    }, 1200);
  };

  return (
    <div className="container" style={styles.container}>
      <div className="responsive-grid-order">
        {/* Form Details Area */}
        <div style={styles.formCol}>
          <h2 style={{ marginBottom: '8px', color: '#0f172a' }}>Place Your Order</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
            It only takes 2 minutes to secure a qualified academic writer. Completely confidential.
          </p>

          {/* STEP 1: PAPER DETAILS */}
          <div className="glass-card glow-card-primary" style={styles.stepCard}>
            <div style={styles.stepHeader}>
              <span style={styles.stepNum}>1</span>
              <h3>Paper Specifications</h3>
            </div>

            {/* Academic Level */}
            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label>Academic Level</label>
              <div style={styles.btnGroup}>
                {['highschool', 'undergrad_1_2', 'undergrad_3_4', 'masters', 'doctoral'].map((key) => {
                  const labelMap = {
                    highschool: 'High School',
                    undergrad_1_2: 'Undergrad (1-2)',
                    undergrad_3_4: 'Undergrad (3-4)',
                    masters: "Master's",
                    doctoral: 'Doctoral'
                  };
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setLevel(key)}
                      style={level === key ? styles.btnGroupActive : styles.btnGroupBtn}
                    >
                      {labelMap[key]}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={styles.formRow}>
              {/* Paper Type */}
              <div className="form-group" style={{ flex: 1 }}>
                <label>Type of Paper</label>
                <select value={paperType} onChange={(e) => setPaperType(e.target.value)} className="form-input">
                  <option>Essay (any type)</option>
                  <option>Admission Essay</option>
                  <option>Research Paper</option>
                  <option>Coursework</option>
                  <option>Case Study</option>
                  <option>Literature Review</option>
                  <option>Dissertation</option>
                  <option>Book Report</option>
                  <option>Thesis Proposal</option>
                </select>
              </div>

              {/* Discipline */}
              <div className="form-group" style={{ flex: 1 }}>
                <label>Discipline / Subject</label>
                <select value={discipline} onChange={(e) => setDiscipline(e.target.value)} className="form-input">
                  {DISCIPLINES.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            {/* Topic with AI Topic Helper */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label>Paper Topic</label>
                <button 
                  type="button" 
                  onClick={handleAITopicImprover} 
                  className="ai-helper-btn"
                >
                  <Sparkles size={14} /> AI Topic Improver
                </button>
              </div>
              <input 
                type="text" 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Impact of Social Media on Mental Health (Leave blank for Writer's Choice)"
                className="form-input"
              />

              {/* AI Topic Helper Panel */}
              <AnimatePresence>
                {showAITopics && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="ai-helper-panel"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <Wand2 size={16} color="var(--accent)" />
                      <strong style={{ fontSize: '0.88rem' }}>AI Topic Suggestions for {discipline}</strong>
                    </div>
                    {aiTopicsList.map((t, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => handleSelectAITopic(t)}
                        className="ai-suggestion-item"
                      >
                        {t}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Instructions with AI Outline Generator */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <label>Detailed Guidelines & Instructions</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    type="button" 
                    onClick={handleAIOutlineGenerator} 
                    className="ai-helper-btn"
                    disabled={aiOutlineGenerating}
                  >
                    <Sparkles size={14} /> {aiOutlineGenerating ? 'Generating...' : 'Outline Gen'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setBoldtextPluginOpen(true)} 
                    className="boldtext-trigger-btn"
                  >
                    <Sparkles size={14} /> BoldText AI
                  </button>
                </div>
              </div>
              <textarea 
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Enter structure, outlines, formatting expectations, reference guides, grading scales, or other specific details..."
                className="form-input"
                style={{ height: '120px', resize: 'vertical' }}
              />
            </div>

            {/* File Upload */}
            <div className="form-group">
              <label>Additional Materials (Upload attachments)</label>
              <div style={styles.uploadBox}>
                <FileUp size={24} color="var(--text-muted)" />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {uploadedFile ? uploadedFile.name : 'Drag & drop or click to upload instructions, drafts, or syllabus files'}
                </span>
                <input 
                  type="file" 
                  onChange={handleFileChange}
                  style={styles.fileInput} 
                />
              </div>
            </div>

            <div style={styles.formRow}>
              {/* Format */}
              <div className="form-group" style={{ flex: 1 }}>
                <label>Format Style</label>
                <select value={format} onChange={(e) => setFormat(e.target.value)} className="form-input">
                  <option>APA</option>
                  <option>MLA</option>
                  <option>Chicago / Turabian</option>
                  <option>Harvard</option>
                  <option>Other / Not Applicable</option>
                </select>
              </div>

              {/* Deadline */}
              <div className="form-group" style={{ flex: 1 }}>
                <label>Deadline</label>
                <select value={deadline} onChange={(e) => setDeadline(e.target.value)} className="form-input">
                  {Object.entries(DEADLINE_LABELS).map(([key, lbl]) => (
                    <option key={key} value={key}>{lbl}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Counter metrics (Pages, Sources, Slides, Charts) */}
            <div className="responsive-grid-counters">
              {/* Pages */}
              <div style={styles.counterCard}>
                <span style={styles.counterLabel}>Pages Quantity</span>
                <div style={styles.counterControl}>
                  <button type="button" onClick={() => setPages(p => Math.max(1, p - 1))} style={styles.cBtn}>-</button>
                  <span style={styles.cVal}>{pages}</span>
                  <button type="button" onClick={() => setPages(p => p + 1)} style={styles.cBtn}>+</button>
                </div>
              </div>

              {/* Spacing */}
              <div style={styles.counterCard}>
                <span style={styles.counterLabel}>Spacing Options</span>
                <div style={styles.spacingBtnGroup}>
                  <button 
                    type="button" 
                    onClick={() => setSpacing('double')} 
                    style={spacing === 'double' ? styles.sActiveBtn : styles.sBtn}
                  >Double</button>
                  <button 
                    type="button" 
                    onClick={() => setSpacing('single')} 
                    style={spacing === 'single' ? styles.sActiveBtn : styles.sBtn}
                  >Single</button>
                </div>
              </div>

              {/* Sources */}
              <div style={styles.counterCard}>
                <span style={styles.counterLabel}>Sources Cited</span>
                <div style={styles.counterControl}>
                  <button type="button" onClick={() => setSources(s => Math.max(0, s - 1))} style={styles.cBtn}>-</button>
                  <span style={styles.cVal}>{sources}</span>
                  <button type="button" onClick={() => setSources(s => s + 1)} style={styles.cBtn}>+</button>
                </div>
              </div>

              {/* Slides */}
              <div style={styles.counterCard}>
                <span style={styles.counterLabel}>PPT Slides (+$5.00/ea)</span>
                <div style={styles.counterControl}>
                  <button type="button" onClick={() => setSlides(sl => Math.max(0, sl - 1))} style={styles.cBtn}>-</button>
                  <span style={styles.cVal}>{slides}</span>
                  <button type="button" onClick={() => setSlides(sl => sl + 1)} style={styles.cBtn}>+</button>
                </div>
              </div>

              {/* Charts */}
              <div style={styles.counterCard}>
                <span style={styles.counterLabel}>Charts & Graphs (+$10.00/ea)</span>
                <div style={styles.counterControl}>
                  <button type="button" onClick={() => setCharts(ch => Math.max(0, ch - 1))} style={styles.cBtn}>-</button>
                  <span style={styles.cVal}>{charts}</span>
                  <button type="button" onClick={() => setCharts(ch => ch + 1)} style={styles.cBtn}>+</button>
                </div>
              </div>
            </div>

            {/* Writer Quality Category selection */}
            <div style={{ marginTop: '30px' }}>
              <label style={{ fontWeight: '600', display: 'block', marginBottom: '12px' }}>Choose Writer Quality</label>
              <div className="responsive-grid-writer">
                {/* Standard */}
                <motion.div 
                  whileHover={{ y: -4 }}
                  onClick={() => setWriterCategory('standard')}
                  style={writerCategory === 'standard' ? styles.writerCardActive : styles.writerCard}
                >
                  <div style={styles.writerHeader}>
                    <strong>Best Available</strong>
                    <span style={styles.priceTag}>Standard Rate</span>
                  </div>
                  <p style={styles.writerDesc}>Qualified writer matching your specific discipline requirements.</p>
                </motion.div>

                {/* Advanced */}
                <motion.div 
                  whileHover={{ y: -4 }}
                  onClick={() => setWriterCategory('advanced')}
                  style={writerCategory === 'advanced' ? styles.writerCardActive : styles.writerCard}
                >
                  <div style={styles.writerHeader}>
                    <strong>Advanced Rank</strong>
                    <span style={styles.priceTag}>+25% Surcharge</span>
                  </div>
                  <p style={styles.writerDesc}>High-ranked writer with top customer feedback and specialization.</p>
                </motion.div>

                {/* ENL */}
                <motion.div 
                  whileHover={{ y: -4 }}
                  onClick={() => setWriterCategory('enl')}
                  style={writerCategory === 'enl' ? styles.writerCardActive : styles.writerCard}
                >
                  <div style={styles.writerHeader}>
                    <strong>Native ENL</strong>
                    <span style={styles.priceTag}>+30% Surcharge</span>
                  </div>
                  <p style={styles.writerDesc}>English as a Native Language writer based in USA, UK, Canada, or Australia.</p>
                </motion.div>
              </div>
            </div>

            {/* Additional Services Addons */}
            <div style={{ marginTop: '30px' }}>
              <label style={{ fontWeight: '600', display: 'block', marginBottom: '12px' }}>Extra Add-on Features</label>
              <div style={styles.addonCol}>
                <label style={styles.addonLabel}>
                  <input 
                    type="checkbox" 
                    checked={copySources} 
                    onChange={(e) => setCopySources(e.target.checked)} 
                    style={styles.checkbox}
                  />
                  <div>
                    <strong>Get Copy of Sources ($12.95)</strong>
                    <span style={styles.addonSub}>Download PDF files or URL references cited in the paper.</span>
                  </div>
                </label>

                <label style={styles.addonLabel}>
                  <input 
                    type="checkbox" 
                    checked={progressiveDelivery} 
                    onChange={(e) => setProgressiveDelivery(e.target.checked)} 
                    style={styles.checkbox}
                  />
                  <div>
                    <strong>Progressive Delivery (+10%)</strong>
                    <span style={styles.addonSub}>Receive sections step-by-step for feedback. Only for double spacing orders exceeding 5 pages.</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* STEP 2: USER ACCOUNT SIGNUP / LOGIN */}
          <div className="glass-card" style={styles.stepCard} id="step-account-sec">
            <div style={styles.stepHeader}>
              <span style={styles.stepNum}>2</span>
              <h3>Client Account Registration</h3>
            </div>

            {user ? (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={styles.successAccount}
              >
                <CheckCircle2 size={32} color="var(--accent)" />
                <div>
                  <strong>Successfully Logged In!</strong>
                  <p style={{ margin: 0, fontSize: '0.88rem' }}>Secure checkout will be credited to: <strong>{user.email}</strong></p>
                </div>
              </motion.div>
            ) : (
              <div>
                <div style={styles.authToggler}>
                  <button 
                    type="button" 
                    onClick={() => { setAuthMode('signup'); setAuthError(''); }}
                    style={authMode === 'signup' ? styles.authTogglerActive : styles.authTogglerBtn}
                  >
                    New Customer Account
                  </button>
                  <button 
                    type="button" 
                    onClick={() => { setAuthMode('login'); setAuthError(''); }}
                    style={authMode === 'login' ? styles.authTogglerActive : styles.authTogglerBtn}
                  >
                    Returning Customer Login
                  </button>
                </div>

                <form onSubmit={handleAuthSubmit} style={styles.authForm}>
                  {authError && <div style={styles.authError}>{authError}</div>}
                  
                  <AnimatePresence mode="wait">
                    {authMode === 'signup' ? (
                      <motion.div
                        key="signup-fields"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div style={styles.formRow}>
                          <div className="form-group" style={{ flex: 1 }}>
                            <label>Full Name*</label>
                            <input 
                              type="text" 
                              required 
                              value={authName} 
                              onChange={(e) => setAuthName(e.target.value)} 
                              className="form-input" 
                            />
                          </div>
                          <div className="form-group" style={{ flex: 1 }}>
                            <label>Phone Number (Optional)</label>
                            <input 
                              type="text" 
                              value={authPhone} 
                              onChange={(e) => setAuthPhone(e.target.value)} 
                              className="form-input" 
                            />
                          </div>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>

                  <div style={styles.formRow}>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label>Email Address*</label>
                      <input 
                        type="email" 
                        required 
                        value={authEmail} 
                        onChange={(e) => setAuthEmail(e.target.value)} 
                        className="form-input" 
                      />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label>Password*</label>
                      <input 
                        type="password" 
                        required 
                        value={authPassword} 
                        onChange={(e) => setAuthPassword(e.target.value)} 
                        className="form-input" 
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="btn-primary" 
                    disabled={authLoading}
                    style={{ width: '220px', justifyContent: 'center', marginTop: '12px' }}
                  >
                    {authLoading ? 'Please Wait...' : authMode === 'signup' ? 'Create Account' : 'Log In'}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* STEP 3: SECURE PAYMENT DETAILS */}
          {user && (
            <div className="glass-card glow-card-primary" style={styles.stepCard} id="step-payment-sec">
              <div style={styles.stepHeader}>
                <span style={styles.stepNum}>3</span>
                <h3>Secure Payment Details</h3>
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontWeight: '600', display: 'block', marginBottom: '12px' }}>Select Payment Method</label>
                <div style={styles.paymentGrid}>
                  {/* EasyPaisa */}
                  <div 
                    onClick={() => setPaymentMethod('easypaisa')}
                    style={paymentMethod === 'easypaisa' ? styles.payOptionActive : styles.payOption}
                  >
                    <div style={{ ...styles.payIconCircle, background: '#10b981' }}>EP</div>
                    <div style={styles.payTextContainer}>
                      <span style={styles.payTitle}>EasyPaisa Wallet</span>
                      <span style={styles.paySub}>Simulated Gateway</span>
                    </div>
                  </div>

                  {/* JazzCash */}
                  <div 
                    onClick={() => setPaymentMethod('jazzcash')}
                    style={paymentMethod === 'jazzcash' ? styles.payOptionActive : styles.payOption}
                  >
                    <div style={{ ...styles.payIconCircle, background: '#f59e0b' }}>JC</div>
                    <div style={styles.payTextContainer}>
                      <span style={styles.payTitle}>JazzCash Wallet</span>
                      <span style={styles.paySub}>Simulated Gateway</span>
                    </div>
                  </div>

                  {/* Credit Card */}
                  <div 
                    onClick={() => setPaymentMethod('card')}
                    style={paymentMethod === 'card' ? styles.payOptionActive : styles.payOption}
                  >
                    <div style={{ ...styles.payIconCircle, background: 'var(--primary)' }}>CC</div>
                    <div style={styles.payTextContainer}>
                      <span style={styles.payTitle}>Credit / Debit Card</span>
                      <span style={styles.paySub}>Secure Payment</span>
                    </div>
                  </div>

                  {/* Bank Transfer */}
                  <div 
                    onClick={() => setPaymentMethod('bank')}
                    style={paymentMethod === 'bank' ? styles.payOptionActive : styles.payOption}
                  >
                    <div style={{ ...styles.payIconCircle, background: 'var(--accent)' }}>BT</div>
                    <div style={styles.payTextContainer}>
                      <span style={styles.payTitle}>Bank Transfer</span>
                      <span style={styles.paySub}>Manual Reference</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic inputs based on method */}
              <AnimatePresence mode="wait">
                {paymentMethod === 'easypaisa' && (
                  <motion.div 
                    key="easypaisa-fields"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="form-group">
                      <label>EasyPaisa Account Number (Mobile Phone)*</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 03211234567" 
                        value={paymentPhone}
                        onChange={(e) => setPaymentPhone(e.target.value)}
                        className="form-input"
                      />
                      <span style={styles.conversionHint}>
                        PKR Conversion Rate: $1.00 = Rs. 280. Total: <strong>Rs. {(pricing.total * 280).toLocaleString()}</strong>
                      </span>
                    </div>
                  </motion.div>
                )}

                {paymentMethod === 'jazzcash' && (
                  <motion.div 
                    key="jazzcash-fields"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="form-group">
                      <label>JazzCash Account Number (Mobile Phone)*</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 03211234567" 
                        value={paymentPhone}
                        onChange={(e) => setPaymentPhone(e.target.value)}
                        className="form-input"
                      />
                      <span style={styles.conversionHint}>
                        PKR Conversion Rate: $1.00 = Rs. 280. Total: <strong>Rs. {(pricing.total * 280).toLocaleString()}</strong>
                      </span>
                    </div>
                  </motion.div>
                )}

                {paymentMethod === 'card' && (
                  <motion.div 
                    key="card-fields"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={styles.formRow}>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label>Cardholder Name*</label>
                        <input 
                          type="text" 
                          placeholder="Usman Wajid" 
                          value={paymentCardName}
                          onChange={(e) => setPaymentCardName(e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label>Card Number*</label>
                        <input 
                          type="text" 
                          placeholder="4242 4242 4242 4242" 
                          value={paymentCardNum}
                          onChange={(e) => setPaymentCardNum(e.target.value)}
                          className="form-input"
                        />
                      </div>
                    </div>
                    <div style={styles.formRow}>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label>Expiry Date*</label>
                        <input 
                          type="text" 
                          placeholder="MM/YY" 
                          value={paymentCardExpiry}
                          onChange={(e) => setPaymentCardExpiry(e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label>CVC / CVV*</label>
                        <input 
                          type="password" 
                          placeholder="123" 
                          value={paymentCardCVC}
                          onChange={(e) => setPaymentCardCVC(e.target.value)}
                          className="form-input"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {paymentMethod === 'bank' && (
                  <motion.div 
                    key="bank-fields"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={styles.bankInstructionBox}>
                      <p style={{ margin: '0 0 10px 0', fontSize: '0.85rem' }}>
                        Please transfer the total amount of <strong>${pricing.total.toFixed(2)}</strong> (or equivalent <strong>Rs. {(pricing.total * 280).toLocaleString()}</strong>) to the bank account below:
                      </p>
                      <div style={styles.bankDetailCard}>
                        <strong>Bank:</strong> Faysal Bank Limited<br />
                        <strong>Account Title:</strong> SKY Academic Services<br />
                        <strong>IBAN:</strong> PK86 FAYS 0123 4567 8901 2345
                      </div>
                      <div className="form-group" style={{ marginTop: '16px' }}>
                        <label>Transaction ID / Receipt Reference*</label>
                        <input 
                          type="text" 
                          placeholder="e.g. TID9823901" 
                          value={paymentTxnId}
                          onChange={(e) => setPaymentTxnId(e.target.value)}
                          className="form-input"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Button inside Step 3 Card (Essential for Mobile/Viewport clarity) */}
              <div style={{ marginTop: '24px' }}>
                <motion.button 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="button" 
                  onClick={handleCheckout} 
                  className="btn-accent" 
                  style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem', fontWeight: '700' }}
                >
                  {paymentMethod === 'bank' ? 'Confirm Bank Transfer & Place Order' : 'Proceed to Secure Payment'}
                </motion.button>
              </div>
            </div>
          )}
        </div>

        {/* Invoice Summary Area */}
        <div style={styles.invoiceCol}>
          <div style={styles.invoiceSticky} className="invoice-col-sticky">
            <div style={styles.invoiceHeader}>
              <Lock size={18} color="#ffffff" />
              <h4 style={{ color: '#ffffff', margin: 0, fontWeight: '700' }}>Order Summary</h4>
            </div>

            <div style={styles.invoiceBody}>
              <div style={styles.invoiceDetails}>
                <h5 style={{ fontWeight: '700', fontSize: '1.05rem', color: 'var(--text-main)' }}>{paperType}</h5>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{discipline} &bull; {format} Style</span>
              </div>

              <hr style={styles.invoiceDivider} />

              {/* Items Breakdown */}
              <div style={styles.invoiceItems}>
                <div style={styles.invoiceItem}>
                  <span>{pages} Page{pages > 1 ? 's' : ''} ({spacing} Spacing)</span>
                  <strong>${pricing.base.toFixed(2)}</strong>
                </div>

                {slides > 0 && (
                  <div style={styles.invoiceItem}>
                    <span>{slides} PPT Slide{slides > 1 ? 's' : ''}</span>
                    <strong>${pricing.slides.toFixed(2)}</strong>
                  </div>
                )}

                {charts > 0 && (
                  <div style={styles.invoiceItem}>
                    <span>{charts} Chart{charts > 1 ? 's' : ''}</span>
                    <strong>${pricing.charts.toFixed(2)}</strong>
                  </div>
                )}

                {writerCategory !== 'standard' && (
                  <div style={styles.invoiceItem}>
                    <span>Writer Quality Surcharge</span>
                    <strong>+${pricing.writerAdd.toFixed(2)}</strong>
                  </div>
                )}

                {copySources && (
                  <div style={styles.invoiceItem}>
                    <span>Copy of Cited Sources Add-on</span>
                    <strong>+${pricing.copySourcesAdd.toFixed(2)}</strong>
                  </div>
                )}

                {progressiveDelivery && (
                  <div style={styles.invoiceItem}>
                    <span>Progressive Delivery Surcharge</span>
                    <strong>+${pricing.progressiveAdd.toFixed(2)}</strong>
                  </div>
                )}

                {couponApplied && (
                  <div style={styles.invoiceItem} style={{ ...styles.invoiceItem, color: 'var(--accent)' }}>
                    <span>Coupon SAVE25 (25% OFF)</span>
                    <strong>-${pricing.discountAdd.toFixed(2)}</strong>
                  </div>
                )}
              </div>

              <hr style={styles.invoiceDivider} />

              {/* Coupon input */}
              <div style={styles.couponBlock}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="text" 
                    placeholder="Enter Coupon Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    style={styles.couponInput}
                    disabled={couponApplied}
                  />
                  <button 
                    type="button" 
                    onClick={handleApplyCoupon}
                    style={styles.couponBtn}
                    disabled={couponApplied}
                  >
                    Apply
                  </button>
                </div>
                {couponError && <span style={styles.couponErrorText}>{couponError}</span>}
                {couponApplied && <span style={styles.couponSuccessText}>SAVE25 applied successfully!</span>}
              </div>

              <hr style={styles.invoiceDivider} />

              {/* Final Total */}
              <div style={styles.totalRow}>
                <span>Final Total Price:</span>
                <motion.span 
                  key={pricing.total}
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{ scale: 1, opacity: 1 }}
                  style={styles.finalPrice}
                >
                  ${pricing.total.toFixed(2)}
                </motion.span>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button" 
                onClick={handleCheckout} 
                className="btn-accent" 
                style={styles.checkoutBtn}
              >
                Secure Checkout & Order Now
              </motion.button>

              <div style={styles.securitySeal}>
                <ShieldCheck size={14} color="var(--text-muted)" />
                <span>256-Bit SSL Encrypted Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BoldTextAIPlugin 
        isOpen={boldtextPluginOpen} 
        onClose={() => setBoldtextPluginOpen(false)} 
        initialText={instructions} 
        onApply={(processedText) => setInstructions(processedText)} 
        theme="light"
      />

      {/* SIMULATED PAYMENT GATEWAY MODAL */}
      <AnimatePresence>
        {showPaymentModal && (
          <div className="payment-modal-overlay">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="payment-modal-card"
            >
              <div className="payment-modal-header">
                <h3>SKY Pay Secure Gateway</h3>
                <span className="payment-modal-method">
                  {paymentMethod === 'easypaisa' ? 'EasyPaisa Wallet' :
                   paymentMethod === 'jazzcash' ? 'JazzCash Wallet' :
                   paymentMethod === 'card' ? '3D Secure Card Verification' :
                   'Bank Transfer Reference'}
                </span>
              </div>

              <div className="payment-modal-body">
                {paymentProcessing ? (
                  <div style={styles.modalStatusBox}>
                    <div className="gateway-spinner"></div>
                    <p style={{ marginTop: '16px', fontWeight: '600' }}>Contacting Secure Payment Provider...</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Please do not close or refresh this page.</p>
                  </div>
                ) : paymentSuccess ? (
                  <div style={styles.modalStatusBox}>
                    <div style={styles.successCheckmarkWrapper}>
                      <CheckCircle2 size={64} color="#10b981" />
                    </div>
                    <h4 style={{ marginTop: '16px', color: '#10b981', fontWeight: '700' }}>Payment Authorized!</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Your order is being processed and placed automatically.</p>
                  </div>
                ) : (
                  <div>
                    {/* OTP / PIN Entry */}
                    <p style={{ fontSize: '0.9rem', marginBottom: '16px', lineHeight: '1.5' }}>
                      {paymentMethod === 'easypaisa' || paymentMethod === 'jazzcash' ? (
                        <span>
                          A push notification or OTP has been sent to your phone number <strong>{paymentPhone}</strong>. Please enter your <strong>5-digit wallet PIN</strong> below to authorize the payment of <strong>Rs. {(pricing.total * 280).toLocaleString()}</strong>.
                        </span>
                      ) : paymentMethod === 'card' ? (
                        <span>
                          To secure your card purchase of <strong>${pricing.total.toFixed(2)}</strong>, a one-time <strong>6-digit OTP code</strong> has been sent to your phone. Please enter it below.
                        </span>
                      ) : (
                        <span>
                          Please confirm details for Bank Transfer Reference <strong>{paymentTxnId}</strong> of <strong>${pricing.total.toFixed(2)}</strong>.
                        </span>
                      )}
                    </p>

                    {paymentMethod !== 'bank' ? (
                      <div className="form-group" style={{ textAlign: 'center' }}>
                        <label style={{ display: 'block', marginBottom: '12px', fontWeight: '700' }}>
                          {paymentMethod === 'card' ? 'Enter 6-Digit OTP' : 'Enter 5-Digit PIN'}
                        </label>
                        <input 
                          type="password" 
                          maxLength={paymentMethod === 'card' ? 6 : 5}
                          value={paymentOTP}
                          onChange={(e) => setPaymentOTP(e.target.value)}
                          style={styles.otpInputStyle}
                          placeholder={paymentMethod === 'card' ? '••••••' : '•••••'}
                        />
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '8px' }}>
                          Simulated code. You can enter any digits (e.g. 12345 or 123456) to proceed.
                        </p>
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '10px 0' }}>
                        <p style={{ fontWeight: '600' }}>Reference TXN ID: {paymentTxnId}</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Our finance team will verify the payment against this Transaction ID.</p>
                      </div>
                    )}

                    <div style={styles.modalActions}>
                      <button 
                        type="button" 
                        onClick={() => setShowPaymentModal(false)} 
                        className="btn-primary"
                        style={{ background: 'var(--bg-main)', color: 'var(--text-main)', border: '1px solid var(--border-light)' }}
                      >
                        Cancel Transaction
                      </button>
                      <button 
                        type="button" 
                        onClick={async () => {
                          // Validate OTP length
                          if (paymentMethod !== 'bank') {
                            const reqLen = paymentMethod === 'card' ? 6 : 5;
                            if (paymentOTP.length !== reqLen) {
                              alert(`Please enter a valid ${reqLen}-digit code.`);
                              return;
                            }
                          }
                          
                          // Set success state
                          setPaymentSuccess(true);
                          
                          // Execute checkout after success checkmark animation (1.5s delay)
                          setTimeout(async () => {
                            setShowPaymentModal(false);
                            await executeCheckout(user);
                          }, 1500);
                        }} 
                        className="btn-accent"
                      >
                        {paymentMethod === 'bank' ? 'Confirm Payment' : 'Authorize & Pay'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

const styles = {
  container: {
    padding: '40px 0 80px 0',
  },
  formCol: {
    flex: 1.8,
    minWidth: '320px',
  },
  invoiceCol: {
    flex: 1,
    minWidth: '300px',
  },
  stepCard: {
    background: '#ffffff',
    border: '1px solid var(--border-light)',
    padding: '32px',
    marginBottom: '24px',
    boxShadow: 'var(--shadow-md)',
  },
  stepHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '28px',
    borderBottom: '1px solid var(--border-light)',
    paddingBottom: '16px',
  },
  stepNum: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'var(--primary)',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '0.95rem',
  },
  btnGroup: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  btnGroupBtn: {
    background: 'var(--bg-main)',
    border: '1px solid var(--border-light)',
    padding: '10px 18px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'var(--text-muted)',
    transition: 'var(--transition)',
  },
  btnGroupActive: {
    background: 'var(--primary-light)',
    border: '1px solid var(--primary)',
    color: 'var(--primary)',
    padding: '10px 18px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '700',
  },
  formRow: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    marginBottom: '16px',
  },
  uploadBox: {
    border: '2px dashed var(--border-light)',
    background: 'var(--bg-main)',
    padding: '24px',
    borderRadius: '8px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    position: 'relative',
    transition: 'var(--transition)',
    ':hover': {
      borderColor: 'var(--primary)',
    }
  },
  fileInput: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0,
    cursor: 'pointer',
  },
  counterCard: {
    background: 'var(--bg-main)',
    border: '1px solid var(--border-light)',
    borderRadius: '8px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  counterLabel: {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: 'var(--text-muted)',
  },
  counterControl: {
    display: 'flex',
    alignItems: 'center',
    background: '#ffffff',
    border: '1px solid var(--border-light)',
    borderRadius: '6px',
    overflow: 'hidden',
  },
  cBtn: {
    background: 'none',
    border: 'none',
    width: '32px',
    height: '32px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    fontWeight: '600',
  },
  cVal: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: '0.9rem',
  },
  spacingBtnGroup: {
    display: 'flex',
    background: '#ffffff',
    border: '1px solid var(--border-light)',
    borderRadius: '6px',
    overflow: 'hidden',
    height: '32px',
  },
  sBtn: {
    flex: 1,
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: '600',
    color: 'var(--text-muted)',
  },
  sActiveBtn: {
    flex: 1,
    border: 'none',
    background: 'var(--primary-light)',
    color: 'var(--primary)',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: '700',
  },
  writerCard: {
    border: '1px solid var(--border-light)',
    borderRadius: '8px',
    padding: '16px',
    cursor: 'pointer',
    background: 'var(--bg-main)',
    transition: 'var(--transition)',
  },
  writerCardActive: {
    border: '2px solid var(--primary)',
    borderRadius: '8px',
    padding: '15px',
    cursor: 'pointer',
    background: 'var(--primary-light)',
  },
  writerHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
    marginBottom: '8px',
  },
  priceTag: {
    fontSize: '0.72rem',
    fontWeight: '700',
    color: 'var(--primary)',
  },
  writerDesc: {
    fontSize: '0.78rem',
    margin: 0,
    lineHeight: '1.4',
  },
  addonCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  addonLabel: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    background: 'var(--bg-main)',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid var(--border-light)',
    cursor: 'pointer',
  },
  addonSub: {
    display: 'block',
    fontSize: '0.78rem',
    color: 'var(--text-muted)',
    marginTop: '2px',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
    marginTop: '3px',
  },
  successAccount: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    background: 'var(--accent-light)',
    border: '1px solid rgba(40,167,69,0.2)',
    padding: '16px 20px',
    borderRadius: '12px',
    color: 'var(--accent)',
  },
  authToggler: {
    display: 'flex',
    background: 'var(--bg-main)',
    border: '1px solid var(--border-light)',
    borderRadius: '10px',
    overflow: 'hidden',
    marginBottom: '24px',
  },
  authTogglerBtn: {
    flex: 1,
    background: 'none',
    border: 'none',
    padding: '12px',
    fontWeight: '600',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  authTogglerActive: {
    flex: 1,
    background: '#ffffff',
    border: 'none',
    padding: '12px',
    fontWeight: '700',
    color: 'var(--primary)',
    boxShadow: 'var(--shadow-sm)',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  authForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  authError: {
    background: '#fee2e2',
    color: '#dc2626',
    padding: '12px',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: '600',
    marginBottom: '12px',
  },
  invoiceSticky: {
    position: 'sticky',
    top: '100px',
    background: '#ffffff',
    border: '1px solid var(--border-light)',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-lg)',
  },
  invoiceHeader: {
    background: '#0f172a',
    padding: '18px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  invoiceBody: {
    padding: '24px',
  },
  invoiceDetails: {
    marginBottom: '16px',
  },
  invoiceDivider: {
    border: 'none',
    borderTop: '1px solid var(--border-light)',
    margin: '16px 0',
  },
  invoiceItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  invoiceItem: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.88rem',
    color: 'var(--text-muted)',
  },
  couponBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  couponInput: {
    flex: 1,
    border: '1px solid var(--border-light)',
    borderRadius: '6px',
    padding: '8px 12px',
    fontSize: '0.88rem',
    textTransform: 'uppercase',
  },
  couponBtn: {
    background: 'var(--primary)',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '0 16px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '0.88rem',
  },
  couponErrorText: {
    color: '#dc2626',
    fontSize: '0.75rem',
    fontWeight: '600',
  },
  couponSuccessText: {
    color: 'var(--accent)',
    fontSize: '0.75rem',
    fontWeight: '600',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontWeight: '700',
    fontSize: '1rem',
    color: 'var(--text-main)',
  },
  finalPrice: {
    fontSize: '1.8rem',
    color: 'var(--accent)',
    fontWeight: '800',
    display: 'inline-block',
  },
  checkoutBtn: {
    width: '100%',
    justifyContent: 'center',
    marginTop: '20px',
    padding: '14px',
    fontSize: '0.98rem',
  },
  securitySeal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    marginTop: '12px',
  },
  paymentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
    gap: '12px',
    marginBottom: '20px',
  },
  payOption: {
    border: '1px solid var(--border-light)',
    borderRadius: '10px',
    padding: '16px',
    cursor: 'pointer',
    background: 'var(--bg-main)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '10px',
    transition: 'var(--transition)',
  },
  payOptionActive: {
    border: '2px solid var(--accent)',
    borderRadius: '10px',
    padding: '15px',
    cursor: 'pointer',
    background: 'var(--accent-light)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '10px',
  },
  payIconCircle: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '0.9rem',
  },
  payTextContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  payTitle: {
    fontSize: '0.82rem',
    fontWeight: '700',
    color: 'var(--text-main)',
  },
  paySub: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
  },
  conversionHint: {
    display: 'block',
    fontSize: '0.8rem',
    color: 'var(--primary)',
    marginTop: '6px',
    fontWeight: '500',
  },
  bankInstructionBox: {
    background: 'var(--bg-main)',
    border: '1px solid var(--border-light)',
    padding: '16px',
    borderRadius: '8px',
  },
  bankDetailCard: {
    background: '#ffffff',
    border: '1px solid var(--border-light)',
    padding: '12px',
    borderRadius: '6px',
    fontFamily: 'monospace',
    fontSize: '0.82rem',
    lineHeight: '1.5',
  },
  otpInputStyle: {
    width: '160px',
    letterSpacing: '8px',
    textAlign: 'center',
    fontSize: '1.5rem',
    fontWeight: '700',
    padding: '10px',
    border: '2px solid var(--border-light)',
    borderRadius: '8px',
    margin: '0 auto',
    display: 'block',
    outline: 'none',
  },
  modalStatusBox: {
    textAlign: 'center',
    padding: '30px 10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '24px',
  },
  successCheckmarkWrapper: {
    animation: 'scaleUp 0.4s ease-out forwards',
  }
};
