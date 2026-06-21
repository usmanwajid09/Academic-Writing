import React, { useState, useEffect, useRef } from 'react';
import Calculator from '../components/Calculator';
import TiltCard from '../components/TiltCard';
import XRayCard from '../components/XRayCard';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star, ShieldCheck, Award, Check, Plus, Minus, ArrowRight, Clock, Users } from 'lucide-react';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function Home({ onOrderRedirect, setView }) {
  // FAQ toggles state
  const [openFaq, setOpenFaq] = useState(null);
  
  // Refs for ScrollTrigger animations
  const statsRef = useRef(null);
  const featuresRef = useRef(null);
  const aboutRef = useRef(null);
  const faqRef = useRef(null);
  const journeyWrapRef = useRef(null);
  const journeyContainerRef = useRef(null);

  const faqs = [
    {
      q: "Is it legal to use Academia Writing services?",
      a: "Yes, it is entirely legal. We hire professional academic writers who create unique, plagiarism-free papers from scratch. You can use these papers as model answers, study references, or sources of inspiration to better understand your subject and complete your assignments."
    },
    {
      q: "How safe is your payment and personal data?",
      a: "We prioritize security. We use state-of-the-art SSL encryption protocols to protect your personal details, and we do not store sensitive credit card information. Your personal data is never shared with third parties or writers."
    },
    {
      q: "What is the quickest turnaround time for an essay?",
      a: "Our expert writers can deliver high-quality essays in as little as 6 to 8 hours. For complex research papers or dissertations, we suggest planning in advance or contacting our support team via live chat for custom timelines."
    },
    {
      q: "Are the academic papers checked for plagiarism?",
      a: "Yes. Every single paper written by our experts is scanned through advanced plagiarism detection software before delivery. We guarantee 100% original, unique writing."
    },
    {
      q: "Can I communicate with my assigned writer?",
      a: "Absolutely! Once your order is assigned, you can chat directly with your writer via your client dashboard to request updates, share files, or clarify instructions."
    },
    {
      q: "Do you offer free revisions?",
      a: "Yes. We offer free unlimited revisions within 14-30 days of delivery, provided your revision request aligns with your original order instructions."
    }
  ];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // GSAP ScrollTrigger animations on mount
  useEffect(() => {
    // 1. Stats Section Scroll Animation
    if (statsRef.current) {
      gsap.fromTo(statsRef.current.children, 
        { opacity: 0, y: 40 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.6, 
          stagger: 0.15, 
          ease: 'power2.out',
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 85%",
            toggleActions: "play none none none"
          }
        }
      );
    }
    
    // 2. Features Grid Scroll Animation
    if (featuresRef.current) {
      gsap.fromTo(featuresRef.current.children, 
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          stagger: 0.2, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 80%",
            toggleActions: "play none none none"
          }
        }
      );
    }

    // 3. About Section Scroll Animation
    if (aboutRef.current) {
      gsap.fromTo(aboutRef.current.children,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: aboutRef.current,
            start: "top 80%",
            toggleActions: "play none none none"
          }
        }
      );
    }

    // 4. FAQ Section Scroll Animation
    if (faqRef.current) {
      gsap.fromTo(faqRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: faqRef.current,
            start: "top 85%",
            toggleActions: "play none none none"
          }
        }
      );
    }

    // 5. Scroll progress bar
    gsap.to('#top-scroll-progress', {
      width: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3
      }
    });

    // 6. Horizontal journey pin scroll
    if (journeyWrapRef.current && journeyContainerRef.current) {
      const scrollEl = journeyContainerRef.current.firstChild;
      const amountToScroll = scrollEl.scrollWidth - window.innerWidth;
      
      if (amountToScroll > 0) {
        gsap.to(scrollEl, {
          x: -amountToScroll,
          ease: 'none',
          scrollTrigger: {
            trigger: journeyWrapRef.current,
            pin: true,
            scrub: 0.5,
            start: 'top top',
            end: () => `+=${amountToScroll}`,
            invalidateOnRefresh: true
          }
        });
      }
    }

    // Cleanup triggers on unmount
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div>
      {/* Top scroll progress line */}
      <div className="scroll-progress-bar" id="top-scroll-progress"></div>

      {/* Hero Section */}
      <section style={styles.hero} className="gradient-bg-hero">
        <div className="container" style={styles.heroContainer}>
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={styles.heroContent}
          >
            <div style={styles.ratingBadge}>
              <div style={styles.stars}>
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#fbbf24" color="#fbbf24" />)}
              </div>
              <span>4.9/5 Rating by 12,000+ Students</span>
            </div>
            
            <h1 style={styles.heroTitle}>
              SKY Academic <br />
              <span className="gradient-text">Writing Service</span>
            </h1>
            
            <p style={styles.heroDesc}>
              Write Smart, Succeed fast. Get custom essays, research papers, and coursework written from scratch by expert academic writers. Trusted by students worldwide since 2012.
            </p>
            
            <div style={styles.badgeGrid}>
              <div style={styles.heroBadge}>
                <ShieldCheck size={20} color="var(--primary)" />
                <span>100% Originality Guarded</span>
              </div>
              <div style={styles.heroBadge}>
                <Award size={20} color="var(--primary)" />
                <span>Top 2% Native ENL Writers</span>
              </div>
            </div>
            
            <div style={styles.ctaRow}>
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary" 
                onClick={() => setView('order')}
              >
                Order Your Paper Now <ArrowRight size={16} />
              </motion.button>
              <button className="btn-secondary" onClick={() => {
                const el = document.getElementById('calculator-sec');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}>
                Calculate Price
              </button>
            </div>
          </motion.div>

          <div style={styles.heroCalc}>
            <Calculator onOrderRedirect={onOrderRedirect} />
          </div>
        </div>
      </section>

      {/* Trust Badges Stats with GSAP ScrollTrigger reveal */}
      <section style={styles.statsSec}>
        <div className="container responsive-grid-stats" ref={statsRef}>
          <div style={styles.statCard}>
            <span style={styles.statValue}>98.5%</span>
            <span style={styles.statLabel}>On-Time Delivery Rate</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statValue}>800+</span>
            <span style={styles.statLabel}>Active PhD & MA Writers</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statValue}>9.7/10</span>
            <span style={styles.statLabel}>Average Satisfaction Rating</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statValue}>14+ Years</span>
            <span style={styles.statLabel}>Supporting Academic Success</span>
          </div>
        </div>
      </section>

      {/* Why Choose Us with GSAP ScrollTrigger reveal */}
      <section style={styles.featuresSec} id="services-sec">
        <div className="container">
          <div style={styles.sectionHeader}>
            <span style={styles.sectionSubtitle}>WHAT MAKES US THE BEST</span>
            <h2>Why Students Choose Academia Writing</h2>
            <p style={{ maxWidth: '600px', margin: '12px auto 0 auto' }}>
              We deliver original papers tailored to your guidelines with the highest standards of confidentiality and client support.
            </p>
          </div>

          <div className="responsive-grid-features" ref={featuresRef}>
            <TiltCard style={styles.featureCard} className="glass-card">
              <div style={{ ...styles.iconBox, background: 'var(--primary-light)' }}>
                <Users color="var(--primary)" size={24} />
              </div>
              <h4 style={styles.featureTitle}>Premium Native Writers</h4>
              <p style={styles.featureDesc}>
                Our writers hold Master's and PhD degrees from top universities (US, UK, CA, AU) and are vetted through rigorous testing.
              </p>
            </TiltCard>

            <TiltCard style={styles.featureCard} className="glass-card">
              <div style={{ ...styles.iconBox, background: 'var(--accent-light)' }}>
                <Clock color="var(--accent)" size={24} />
              </div>
              <h4 style={styles.featureTitle}>Prompt On-Time Delivery</h4>
              <p style={styles.featureDesc}>
                Whether your paper is due in 8 hours or 14 days, we guarantee timely submissions so you never miss a deadline.
              </p>
            </TiltCard>

            <TiltCard style={styles.featureCard} className="glass-card">
              <div style={{ ...styles.iconBox, background: 'var(--primary-light)' }}>
                <ShieldCheck color="var(--primary)" size={24} />
              </div>
              <h4 style={styles.featureTitle}>Guaranteed Plagiarism-Free</h4>
              <p style={styles.featureDesc}>
                Every paper is written custom from scratch and rigorously cross-checked with plagiarism detection scanners.
              </p>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* GSAP Pinned Horizontal Journey Section */}
      <section style={styles.journeySec} ref={journeyWrapRef}>
        <div style={styles.journeySticky}>
          <div className="container" style={{ marginBottom: '40px', textAlign: 'center' }}>
            <span style={styles.sectionSubtitle}>TIMELINE PROCESS</span>
            <h2 style={{ fontSize: '2.5rem', color: '#0f172a' }}>How It Works: Your Academic Journey</h2>
            <p style={{ maxWidth: '600px', margin: '12px auto 0 auto' }}>
              From initial calculations to Turnitin verification, follow our 4-step collaborative model.
            </p>
          </div>
          
          <div className="horizontal-scroll-wrap" ref={journeyContainerRef}>
            <div className="horizontal-scroll-container">
              
              {/* Slide 1 */}
              <div className="horizontal-slide">
                <div className="glass-card" style={styles.journeyCard}>
                  <span style={styles.journeyStep}>01</span>
                  <h3 style={{ color: 'var(--primary)', fontWeight: '700' }}>Calculate & Place Order</h3>
                  <p style={{ fontSize: '0.92rem' }}>Use our reactive calculator to select page counts, spacing, and deadlines. Write detailed guidelines or upload document rubrics.</p>
                  <img src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=400&h=200&q=80" alt="Calculate price" style={styles.journeyCardImg} />
                </div>
              </div>

              {/* Slide 2 */}
              <div className="horizontal-slide">
                <div className="glass-card" style={styles.journeyCard}>
                  <span style={styles.journeyStep}>02</span>
                  <h3 style={{ color: 'var(--accent)', fontWeight: '700' }}>Expert Assignment</h3>
                  <p style={{ fontSize: '0.92rem' }}>Our coordinators review your research prompt and assign a verified native writer holding a Master's or PhD in your exact study discipline.</p>
                  <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=400&h=200&q=80" alt="Vetted writers" style={styles.journeyCardImg} />
                </div>
              </div>

              {/* Slide 3 */}
              <div className="horizontal-slide">
                <div className="glass-card" style={styles.journeyCard}>
                  <span style={styles.journeyStep}>03</span>
                  <h3 style={{ color: 'var(--primary)', fontWeight: '700' }}>Live Progress Chat</h3>
                  <p style={{ fontSize: '0.92rem' }}>Chat directly with your assigned writer within your client portal. Share sources, preview outlines, and upload additional materials.</p>
                  <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&h=200&q=80" alt="Live Chat" style={styles.journeyCardImg} />
                </div>
              </div>

              {/* Slide 4 */}
              <div className="horizontal-slide">
                <div className="glass-card" style={styles.journeyCard}>
                  <span style={styles.journeyStep}>04</span>
                  <h3 style={{ color: 'var(--accent)', fontWeight: '700' }}>Originality & Delivery</h3>
                  <p style={{ fontSize: '0.92rem' }}>Every paper undergoes editorial review and Turnitin checks. Download your high-quality, plagiarism-free paper from your dashboard.</p>
                  <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&h=200&q=80" alt="Delivery" style={styles.journeyCardImg} />
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Free Addons Section */}
      <section style={styles.freebiesSec}>
        <div className="container" style={styles.freebiesContainer}>
          <div style={styles.freebiesText}>
            <span style={styles.sectionSubtitle}>FREE PREMIUM EXTRAS</span>
            <h2 style={{ color: '#fff' }}>Get $65 Value Extras For Free With Every Order</h2>
            <p style={{ marginTop: '16px', color: '#cbd5e1' }}>
              We include all necessary formatting templates and revisions without extra costs, making our services extremely cost-effective.
            </p>
            <div className="responsive-grid-freebies">
              <div style={styles.freebieItem}><Check size={18} color="var(--accent)" /> <span><strong>FREE</strong> Title Page ($5.00 Value)</span></div>
              <div style={styles.freebieItem}><Check size={18} color="var(--accent)" /> <span><strong>FREE</strong> References & Bibliography ($15.00 Value)</span></div>
              <div style={styles.freebieItem}><Check size={18} color="var(--accent)" /> <span><strong>FREE</strong> Formatting: APA, MLA, Harvard ($10.00 Value)</span></div>
              <div style={styles.freebieItem}><Check size={18} color="var(--accent)" /> <span><strong>FREE</strong> Outline & Abstract ($15.00 Value)</span></div>
              <div style={styles.freebieItem}><Check size={18} color="var(--accent)" /> <span><strong>FREE</strong> Plagiarism Report ($10.00 Value)</span></div>
              <div style={styles.freebieItem}><Check size={18} color="var(--accent)" /> <span><strong>FREE</strong> Revisions within 14 Days ($10.00 Value)</span></div>
            </div>
          </div>
          <div style={styles.freebiesIllustration}>
            <motion.div 
              whileHover={{ scale: 1.04, rotate: 1 }}
              style={styles.freeCard}
            >
              <span style={styles.freeTag}>$0.00</span>
              <h3 style={{ color: '#fff' }}>Free Extras Bundle</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>Included with your purchase automatically</p>
              <hr style={{ border: 'none', borderTop: '1px solid rgba(255, 255, 255, 0.1)', margin: '16px 0' }} />
              <button className="btn-accent" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setView('order')}>
                Claim Your Free Extras
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Us Section with GSAP ScrollTrigger reveal */}
      <section style={styles.aboutSec} id="about-sec">
        <div className="container responsive-grid-about" ref={aboutRef}>
          <div style={{ flex: 1, minWidth: '320px' }}>
            <XRayCard 
              imageSrc="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800" 
              altText="Academic Writing Team"
            />
          </div>
          <div style={styles.aboutContent}>
            <span style={styles.sectionSubtitle}>ABOUT OUR SERVICES</span>
            <h2>Expert Essay & Coursework Help Across 110+ Disciplines</h2>
            <p style={{ marginTop: '20px' }}>
              Academia Writing has been a benchmark in academic writing since 2012. We support students from undergraduate classes to advanced doctoral programs. Whether you need a short argumentative essay, a business case study, a lab report, or a comprehensive PhD dissertation, we align our writers to match your subject.
            </p>
            <p style={{ marginTop: '16px' }}>
              We understand the stress that comes with tight deadlines, grading rubrics, and strict academic standards. Our processes are built around confidentiality, thorough editing, and seamless client communication.
            </p>
            <button className="btn-primary" style={{ marginTop: '24px' }} onClick={() => setView('order')}>
              Learn More & Order Now
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section with GSAP ScrollTrigger fade-in */}
      <section style={styles.faqSec} id="faq-sec">
        <div className="container" ref={faqRef}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionSubtitle}>ANSWERS TO YOUR QUESTIONS</span>
            <h2>Frequently Asked Questions</h2>
          </div>

          <div style={styles.faqList}>
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                style={openFaq === index ? styles.faqActiveItem : styles.faqItem}
                onClick={() => toggleFaq(index)}
              >
                <div style={styles.faqQuestionRow}>
                  <strong style={styles.faqQuestion}>{faq.q}</strong>
                  <div style={styles.faqIcon}>
                    {openFaq === index ? <Minus size={18} /> : <Plus size={18} />}
                  </div>
                </div>
                {openFaq === index && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    style={styles.faqAnswer}
                  >
                    <p style={{ margin: 0 }}>{faq.a}</p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const styles = {
  hero: {
    padding: '80px 0',
    overflow: 'hidden',
  },
  heroContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '40px',
    flexWrap: 'wrap',
  },
  heroContent: {
    flex: 1,
    minWidth: '320px',
  },
  ratingBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    background: '#ffffff',
    padding: '8px 16px',
    borderRadius: 'var(--radius-full)',
    boxShadow: 'var(--shadow-sm)',
    fontSize: '0.85rem',
    fontWeight: '600',
    marginBottom: '24px',
  },
  stars: {
    display: 'flex',
    gap: '2px',
  },
  heroTitle: {
    fontSize: '3.2rem',
    lineHeight: '1.1',
    marginBottom: '20px',
    color: '#0f172a',
  },
  heroDesc: {
    fontSize: '1.1rem',
    marginBottom: '32px',
    maxWidth: '520px',
  },
  badgeGrid: {
    display: 'flex',
    gap: '24px',
    marginBottom: '36px',
    flexWrap: 'wrap',
  },
  heroBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: 'var(--text-main)',
  },
  ctaRow: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
  },
  heroCalc: {
    flex: 1,
    minWidth: '320px',
  },
  statsSec: {
    background: '#ffffff',
    padding: '40px 0',
    borderBottom: '1px solid var(--border-light)',
  },
  statCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  statValue: {
    fontSize: '2.2rem',
    fontWeight: '800',
    color: 'var(--primary)',
  },
  statLabel: {
    fontSize: '0.88rem',
    fontWeight: '600',
    color: 'var(--text-muted)',
  },
  featuresSec: {
    padding: '100px 0',
    background: 'var(--bg-main)',
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '60px',
  },
  sectionSubtitle: {
    fontSize: '0.8rem',
    fontWeight: '800',
    color: 'var(--primary)',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: '8px',
  },
  featureCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    alignItems: 'flex-start',
    backgroundColor: '#ffffff',
    cursor: 'default',
  },
  iconBox: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: {
    fontSize: '1.15rem',
    fontWeight: '700',
    color: 'var(--text-main)',
  },
  featureDesc: {
    fontSize: '0.92rem',
    lineHeight: '1.6',
  },
  freebiesSec: {
    background: '#090d16',
    color: '#ffffff',
    padding: '80px 0',
  },
  freebiesContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '60px',
    flexWrap: 'wrap',
  },
  freebiesText: {
    flex: 1.2,
    minWidth: '320px',
  },
  freebieItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '0.92rem',
    color: '#cbd5e1',
  },
  freebiesIllustration: {
    flex: 0.8,
    minWidth: '280px',
    display: 'flex',
    justifyContent: 'center',
  },
  freeCard: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '24px',
    padding: '36px',
    width: '100%',
    maxWidth: '340px',
    position: 'relative',
    textAlign: 'center',
    boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
  },
  freeTag: {
    position: 'absolute',
    top: '-20px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'var(--accent)',
    color: '#fff',
    padding: '8px 24px',
    borderRadius: 'var(--radius-full)',
    fontWeight: '800',
    fontSize: '1.1rem',
    boxShadow: '0 8px 16px rgba(40,167,69,0.3)',
  },
  aboutSec: {
    padding: '100px 0',
    background: '#ffffff',
  },
  aboutImgWrapper: {
    position: 'relative',
    borderRadius: 'var(--radius-md)',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-lg)',
  },
  aboutImg: {
    width: '100%',
    height: '460px',
    objectFit: 'cover',
    display: 'block',
  },
  aboutBadge: {
    position: 'absolute',
    bottom: '24px',
    right: '24px',
    background: 'var(--primary)',
    color: '#ffffff',
    padding: '16px 24px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: 'var(--shadow-md)',
  },
  aboutContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  faqSec: {
    padding: '100px 0',
    background: 'var(--bg-main)',
  },
  faqList: {
    maxWidth: '800px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  faqItem: {
    background: '#ffffff',
    border: '1px solid var(--border-light)',
    borderRadius: '12px',
    padding: '20px 24px',
    cursor: 'pointer',
    transition: 'var(--transition)',
    ':hover': {
      borderColor: 'var(--primary)',
      boxShadow: 'var(--shadow-sm)',
    },
  },
  faqActiveItem: {
    background: '#ffffff',
    border: '1px solid var(--primary)',
    borderRadius: '12px',
    padding: '20px 24px',
    cursor: 'pointer',
    boxShadow: 'var(--shadow-md)',
  },
  faqQuestionRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
  },
  faqQuestion: {
    fontSize: '1rem',
    color: 'var(--text-main)',
  },
  faqIcon: {
    color: 'var(--text-muted)',
  },
  faqAnswer: {
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: '1px solid var(--border-light)',
    fontSize: '0.94rem',
    lineHeight: '1.6',
    color: 'var(--text-muted)',
    overflow: 'hidden',
  },
  journeySec: {
    position: 'relative',
    background: '#f8fafc',
    padding: '80px 0',
    overflow: 'hidden',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center'
  },
  journeySticky: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  journeyCard: {
    width: '100%',
    maxWidth: '450px',
    background: '#ffffff',
    padding: '32px',
    borderRadius: '16px',
    boxShadow: 'var(--shadow-md)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    position: 'relative',
    textAlign: 'left'
  },
  journeyStep: {
    position: 'absolute',
    top: '16px',
    right: '24px',
    fontSize: '3rem',
    fontWeight: '800',
    color: 'rgba(99, 102, 241, 0.08)',
    fontFamily: 'monospace'
  },
  journeyCardImg: {
    width: '100%',
    height: '160px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginTop: '8px'
  }
};
