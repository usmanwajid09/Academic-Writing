import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Minus, HelpCircle, ShieldCheck } from 'lucide-react';

const FAQ_ITEMS = [
  {
    q: "Is it legal to use GlobeAcademics.com services?",
    a: "Yes, it is entirely legal. Our custom writing service provides model research papers, essays, guidelines, and reference bibliographies designed to assist your own learning. You can utilize our papers as study guides, sources of inspiration, or templates to format your own writing, just as you would use tutoring services or textbook samples."
  },
  {
    q: "Are the papers written by AI or human writers?",
    a: "Every paper we write is crafted 100% from scratch by human academic writers with Master's and PhD degrees. We enforce a zero-tolerance policy for automated AI generation. Every finished piece undergoes rigorous AI detection scans (compatible with Turnitin's AI detector and GPTZero) to verify authentic, human authorship."
  },
  {
    q: "How do you guarantee that a paper is plagiarism-free?",
    a: "We do not resell or recycle past papers. Every document is created from scratch matching your instructions. Prior to delivery, each order is scanned using proprietary plagiarism detection tools (such as PlagScan). A copy of the originality index report is made available to you free of charge."
  },
  {
    q: "Can I communicate directly with my assigned writer?",
    a: "Absolutely. Once your order has been assigned to a writer, a direct chat channel is initialized within your portal dashboard. You can ask for status updates, exchange research files, submit instructions, and clarify outline milestones at any time."
  },
  {
    q: "What are the qualifications of your writing team?",
    a: "Our team consists of over 800 active writers. They are vetted through subject tests, background credential verification, and sample writing audits. We require our writers to hold a Master's or PhD degree from accredited universities in the US, UK, Canada, or Australia. 100% of our active team are native English speakers."
  },
  {
    q: "What is your revision policy if I need changes?",
    a: "We provide unlimited free revisions within 14 days of order delivery (and up to 30 days for larger projects like dissertations). Revisions must align with your original instructions. Our portal makes requesting revisions simple: just select the order, click 'Request Revision', specify what needs editing, and your writer will address it promptly."
  },
  {
    q: "Are my personal details and payment information secure?",
    a: "Your security is our top priority. We use SSL encryption to safeguard all network traffic and customer data. We never store credit card numbers on our servers (we use PCI-compliant gateways like Stripe and PayPal). Your personal identity is kept fully anonymous: your writer never sees your name, email, or telephone number."
  },
  {
    q: "Can you meet very tight deadlines, like 8 hours?",
    a: "Yes. Our writers operate across different time zones worldwide, enabling us to handle urgent tasks 24/7. We can write and proofread essays in as little as 6 to 8 hours. We recommend uploading complete files and instructions immediately for urgent orders to avoid processing delays."
  },
  {
    q: "What formatting citation styles do you support?",
    a: "We support all standard formatting styles, including APA (7th ed.), MLA (9th ed.), Harvard, Chicago Manual of Style, Turabian, and Oxford Footnotes. Simply select your desired format in the order form, and your writer will configure margins, page headers, citation parentheses, and bibliographies accordingly."
  },
  {
    q: "What happens if I need to cancel my order?",
    a: "If you need to cancel your order, please contact our 24/7 support team immediately. If a writer has not yet been assigned, we will issue a 100% refund. If writing is already in progress, a partial refund will be calculated based on the completed sections of the paper."
  }
];

export default function Faq() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const filteredFaqs = FAQ_ITEMS.filter(
    item => 
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: '60px 0', background: '#fafbfc', minHeight: '80vh' }}>
      {/* Header */}
      <section className="container" style={{ textAlign: 'center', marginBottom: '50px' }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span style={{ fontSize: '0.85rem', fontWeight: '800', letterSpacing: '2px', color: 'var(--primary)', textTransform: 'uppercase' }}>
            QUESTIONS & ANSWERS
          </span>
          <h1 style={{ fontSize: '3rem', marginTop: '12px', marginBottom: '20px', color: '#0f172a' }}>
            Frequently Asked <span className="gradient-text">Questions</span>
          </h1>
          <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--text-muted)' }}>
            Search our comprehensive knowledge base for answers to common questions about safety, authors, revisions, and operations.
          </p>
        </motion.div>
      </section>

      {/* Search Bar */}
      <section className="container" style={{ marginBottom: '40px' }}>
        <div className="faq-search-box">
          <Search 
            size={18} 
            color="var(--text-muted)" 
            style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} 
          />
          <input 
            type="text" 
            placeholder="Search FAQs (e.g., plagiarism, AI, refund)..." 
            className="faq-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </section>

      {/* Accordion List */}
      <section className="container" style={{ maxWidth: '800px' }}>
        {filteredFaqs.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredFaqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div 
                  key={index} 
                  className="glass-card" 
                  style={{ 
                    background: '#fff', 
                    padding: '0', 
                    overflow: 'hidden', 
                    borderRadius: '12px',
                    border: '1px solid var(--border-light)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <button
                    onClick={() => toggleAccordion(index)}
                    style={{
                      width: '100%',
                      padding: '20px 24px',
                      background: isOpen ? 'rgba(99,102,241,0.03)' : '#fff',
                      border: 'none',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      textAlign: 'left',
                      cursor: 'pointer',
                      color: isOpen ? 'var(--primary)' : '#0f172a',
                      fontWeight: '600',
                      fontSize: '1.05rem',
                      transition: 'var(--transition)'
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <HelpCircle size={18} style={{ flexShrink: 0, opacity: 0.8 }} />
                      {faq.q}
                    </span>
                    {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div style={{ padding: '20px 24px 24px 24px', borderTop: '1px solid var(--border-light)', color: '#475569', lineHeight: '1.7', fontSize: '0.95rem', background: '#fcfcfd' }}>
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
            <p>No questions matched your search criteria. Try typing different keywords.</p>
          </div>
        )}
      </section>

      {/* Security note card */}
      <section className="container" style={{ maxWidth: '800px', marginTop: '60px' }}>
        <div style={{ display: 'flex', gap: '16px', padding: '24px', background: 'rgba(16,185,129,0.05)', border: '1px dashed rgba(16,185,129,0.25)', borderRadius: '12px', alignItems: 'center' }}>
          <ShieldCheck size={36} color="var(--accent)" style={{ flexShrink: 0 }} />
          <div>
            <h4 style={{ color: '#065f46', marginBottom: '4px', fontWeight: '700' }}>Did not find what you were looking for?</h4>
            <p style={{ color: '#047857', fontSize: '0.88rem', margin: 0 }}>
              Our customer care team is online 24 hours a day, 7 days a week. Drop us a message via the Contact page or initiate a chat.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
