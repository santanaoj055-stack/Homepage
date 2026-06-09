import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, lazy, Suspense } from 'react'
import ErrorBoundary from './components/ErrorBoundary'
import LoadingScreen from './components/LoadingScreen'
import ChatBot from './components/ChatBot'
import Seo from './components/Seo'
import ThemeToggle from './components/ThemeToggle'
import { ToastProvider } from './components/Toast'
import { ThemeProvider } from './context/ThemeContext'
import BookDemo from './components/BookDemo'
import './App.css'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const AdminUsers = lazy(() => import('./pages/AdminUsers'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const Profile = lazy(() => import('./pages/Profile'))
const AIAgent = lazy(() => import('./pages/AIAgent'))
const ContentGenerator = lazy(() => import('./pages/ContentGenerator'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/ResetPassword'))
const NotFound = lazy(() => import('./pages/NotFound'))

function Home() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)
  const [slide, setSlide] = useState(0)
  const [activeSection, setActiveSection] = useState('')
  const [heroSlide, setHeroSlide] = useState(0)

  const sections = ['features', 'solutions', 'pricing', 'contact']

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) setActiveSection(e.target.id)
      })
    }, { rootMargin: '-40% 0px -50% 0px' })
    sections.forEach(id => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  const heroSlides = [
    { id: 'photo-1497366216548-37526070297c', alt: 'Modern office workspace' },
    { id: 'photo-1497366811353-6870744d04b2', alt: 'Office meeting room' },
    { id: 'photo-1504384308090-c894fdcc538d', alt: 'Workspace with laptop' },
    { id: 'photo-1519389950473-47ba0277781c', alt: 'Tech team working' },
    { id: 'photo-1573164713714-d95e436ab8d6', alt: 'Modern tech office' },
    { id: 'photo-1522071820081-009f0129c71c', alt: 'Team collaboration' },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSlide(s => (s + 1) % heroSlides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [heroSlides.length])

  const slides = [
    { img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&q=100', title: 'Analytics Dashboard', desc: 'Real-time insights at a glance.' },
    { img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=100', title: 'Software Development', desc: 'Built for modern engineering teams.' },
    { img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=100', title: 'Technology Stack', desc: 'Enterprise-grade infrastructure.' },
    { img: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=1920&q=100', title: 'Data Analytics', desc: 'Turn data into decisions.' },
    { img: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1920&q=100', title: 'Code & Deploy', desc: 'Streamlined CI/CD pipelines.' },
  ]

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  const user = JSON.parse(localStorage.getItem('user') || 'null')

  return (
    <>
      <Seo />
      <header className="header">
        <div className="header-inner">
          <Link to="/" className="logo">
            <svg viewBox="0 0 32 32" width="32" height="32">
              <rect width="32" height="32" rx="8" fill="url(#lg)" />
              <path d="M16 8l8 8-8 8-8-8z" fill="white" opacity="0.9" />
              <path d="M16 12l4 4-4 4-4-4z" fill="white" />
              <defs><linearGradient id="lg" x1="0" y1="0" x2="32" y2="32"><stop offset="0%" stopColor="#1a73e8"/><stop offset="100%" stopColor="#0d47a1"/></linearGradient></defs>
            </svg>
            <span className="logo-text">Homepage</span>
          </Link>

          <nav className="nav">
            <a href="#features" className={activeSection === 'features' ? 'active' : ''} onClick={(e) => { e.preventDefault(); scrollTo('features') }}>Features</a>
            <a href="#solutions" className={activeSection === 'solutions' ? 'active' : ''} onClick={(e) => { e.preventDefault(); scrollTo('solutions') }}>Solutions</a>
            <a href="#pricing" className={activeSection === 'pricing' ? 'active' : ''} onClick={(e) => { e.preventDefault(); scrollTo('pricing') }}>Pricing</a>
            <a href="#contact" className={activeSection === 'contact' ? 'active' : ''} onClick={(e) => { e.preventDefault(); scrollTo('contact') }}>Contact</a>
          </nav>

          <div className="header-actions">
            <ThemeToggle />
            {user ? (
              <Link to="/dashboard" className="user-badge">{user.name}</Link>
            ) : (
              <>
                <Link to="/login" className="btn-text">Sign in</Link>
                <Link to="/register" className="btn btn-primary">Get started</Link>
              </>
            )}
          </div>

          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span></span><span></span><span></span>
          </button>
        </div>

        {menuOpen && (
          <div className="mobile-menu">
            <a href="#features" onClick={(e) => { e.preventDefault(); scrollTo('features') }}>Features</a>
            <a href="#solutions" onClick={(e) => { e.preventDefault(); scrollTo('solutions') }}>Solutions</a>
            <a href="#pricing" onClick={(e) => { e.preventDefault(); scrollTo('pricing') }}>Pricing</a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo('contact') }}>Contact</a>
            <hr />
            <div className="mobile-menu-item"><ThemeToggle /><span>Theme</span></div>
            <hr />
            {user ? (
              <Link to="/dashboard" className="user-badge">{user.name}</Link>
            ) : (
              <>
                <Link to="/login">Sign in</Link>
                <Link to="/register" className="btn btn-primary">Get started</Link>
              </>
            )}
          </div>
        )}
      </header>

      <main>
        <section className="hero">
          <div className="hero-bg"></div>
          <div className="hero-layout">
            <div className="hero-content">
              <h1>Build the future of your<br />enterprise with <span className="gradient-text">Homepage</span></h1>
              <p className="hero-subtitle">
                The all-in-one platform to accelerate your digital transformation.
                Secure, scalable, and built for the modern enterprise.
              </p>
              <div className="hero-buttons">
                <Link to="/register" className="btn btn-primary btn-lg">Start free trial</Link>
                <BookDemo />
              </div>
              <div className="hero-stats">
                <div className="stat">
                  <span className="stat-number">99.9%</span>
                  <span className="stat-label">Uptime</span>
                </div>
                <div className="stat">
                  <span className="stat-number">10K+</span>
                  <span className="stat-label">Enterprise clients</span>
                </div>
                <div className="stat">
                  <span className="stat-number">150+</span>
                  <span className="stat-label">Countries</span>
                </div>
              </div>
            </div>
            <div className="hero-image">
              <div className="hero-carousel">
                {heroSlides.map((s, i) => (
                  <div key={s.id} className={`hero-carousel-slide ${i === heroSlide ? 'active' : ''}`}>
                    <img src={`https://images.unsplash.com/${s.id}?w=1920&q=100`} alt={s.alt} />
                  </div>
                ))}
              </div>
              <div className="hero-carousel-dots">
                {heroSlides.map((_, i) => (
                  <button key={i} className={`hero-carousel-dot ${i === heroSlide ? 'active' : ''}`} onClick={() => setHeroSlide(i)} aria-label={`Slide ${i + 1}`} />
                ))}
              </div>
              <div className="hero-img-card card-1">
                <svg viewBox="0 0 20 20" width="16" height="16" fill="#34a853"><circle cx="10" cy="10" r="6"/></svg>
                <span>99.9% uptime</span>
              </div>
              <div className="hero-img-card card-2">
                <svg viewBox="0 0 20 20" width="16" height="16" fill="#1a73e8"><path d="M10 2L2 7v6l8 5 8-5V7l-8-5z"/></svg>
                <span>Secure cloud</span>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="section features">
          <div className="section-header">
            <span className="section-tag">Features</span>
            <h2>Everything you need to scale</h2>
            <p>Powerful tools designed for enterprise-grade performance and reliability.</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-img">
                <img src="/images/feature-cloud.jpg" alt="Cloud Infrastructure" />
              </div>
              <div className="feature-body">
                <div className="feature-icon icon-blue"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg></div>
                <h3>Cloud Infrastructure</h3>
                <p>Deploy globally with automatic scaling, load balancing, and enterprise-grade security across 150+ regions.</p>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-img">
                <img src="/images/feature-analytics.jpg" alt="Data Analytics" />
              </div>
              <div className="feature-body">
                <div className="feature-icon icon-green"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg></div>
                <h3>Data Analytics</h3>
                <p>Real-time insights with AI-powered analytics. Make data-driven decisions with customizable dashboards.</p>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-img">
                <img src="/images/feature-security.jpg" alt="Enterprise Security" />
              </div>
              <div className="feature-body">
                <div className="feature-icon icon-purple"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
                <h3>Enterprise Security</h3>
                <p>SOC 2 Type II certified with end-to-end encryption, SSO, and advanced threat detection built-in.</p>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-img">
                <img src="/images/team-collab.jpg" alt="Team Collaboration" />
              </div>
              <div className="feature-body">
                <div className="feature-icon icon-orange"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
                <h3>Team Collaboration</h3>
                <p>Real-time collaboration with version control, comments, and role-based access for your entire team.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section how-it-works">
          <div className="section-header">
            <span className="section-tag">How It Works</span>
            <h2>Get started in 3 simple steps</h2>
            <p>From sign-up to full deployment in minutes.</p>
          </div>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-icon"><svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg></div>
              <h3>Create your account</h3>
              <p>Sign up for free with your email. No credit card required for the 14-day trial.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-icon"><svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg></div>
              <h3>Configure your workspace</h3>
              <p>Set up users, roles, and integrations. Import your data with one click.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-icon"><svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
              <h3>Go live & scale</h3>
              <p>Deploy instantly with enterprise-grade security. Scale as you grow.</p>
            </div>
          </div>
        </section>

        <section id="solutions" className="section solutions">
          <div className="section-header">
            <span className="section-tag">Solutions</span>
            <h2>Built for every industry</h2>
            <p>Tailored solutions that adapt to your business needs.</p>
          </div>
          <div className="solutions-grid">
            <div className="solution-card" style={{ '--accent': '#1a73e8' }}>
              <div className="solution-img"><img src="/images/hero-dashboard.jpg" alt="Fintech" /></div>
              <div className="solution-body">
                <h3>Fintech</h3>
                <p>Compliant infrastructure for financial services with real-time processing and fraud detection.</p>
                <a href="#" className="btn-text">Learn more &rarr;</a>
              </div>
            </div>
            <div className="solution-card" style={{ '--accent': '#0d47a1' }}>
              <div className="solution-img"><img src="/images/hero-meeting.jpg" alt="Healthcare" /></div>
              <div className="solution-body">
                <h3>Healthcare</h3>
                <p>HIPAA-compliant platform for patient data management, telehealth, and medical research.</p>
                <a href="#" className="btn-text">Learn more &rarr;</a>
              </div>
            </div>
            <div className="solution-card" style={{ '--accent': '#34a853' }}>
              <div className="solution-img"><img src="/images/hero-office.jpg" alt="E-commerce" /></div>
              <div className="solution-body">
                <h3>E-commerce</h3>
                <p>Scalable infrastructure for high-volume online stores with AI-powered personalization.</p>
                <a href="#" className="btn-text">Learn more &rarr;</a>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="section pricing">
          <div className="section-header">
            <span className="section-tag">Pricing</span>
            <h2>Simple, transparent pricing</h2>
            <p>No hidden fees. Scale as you grow.</p>
          </div>
          <div className="pricing-grid">
            <div className="pricing-card">
              <h3>Starter</h3>
              <div className="price"><span className="amount">$49</span><span className="period">/month</span></div>
              <p className="price-desc">For small teams getting started.</p>
              <ul className="price-features">
                <li>5 users included</li><li>10 GB storage</li><li>Basic analytics</li><li>Email support</li>
              </ul>
              <Link to="/register" className="btn btn-outline btn-full">Get started</Link>
            </div>
            <div className="pricing-card featured">
              <div className="popular-badge">Most popular</div>
              <h3>Professional</h3>
              <div className="price"><span className="amount">$149</span><span className="period">/month</span></div>
              <p className="price-desc">For growing businesses.</p>
              <ul className="price-features">
                <li>25 users included</li><li>100 GB storage</li><li>Advanced analytics</li><li>Priority support</li><li>Custom integrations</li>
              </ul>
              <Link to="/register" className="btn btn-primary btn-full">Get started</Link>
            </div>
            <div className="pricing-card">
              <h3>Enterprise</h3>
              <div className="price"><span className="amount">Custom</span></div>
              <p className="price-desc">For large organizations.</p>
              <ul className="price-features">
                <li>Unlimited users</li><li>Unlimited storage</li><li>Custom analytics</li><li>24/7 dedicated support</li><li>SSO & compliance</li><li>Custom SLA</li>
              </ul>
              <a href="#" className="btn btn-outline btn-full">Contact sales</a>
            </div>
          </div>
        </section>

        <section className="section cta">
          <div className="cta-card">
            <h2>Ready to transform your business?</h2>
            <p>Join thousands of enterprises already using Homepage to accelerate their growth.</p>
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-primary btn-lg">Start free trial</Link>
              <a href="#" className="btn btn-outline btn-light btn-lg">Talk to sales</a>
            </div>
          </div>
        </section>

        <section className="section clients">
          <div className="section-header">
            <span className="section-tag">Trusted By</span>
            <h2>10,000+ companies rely on Homepage</h2>
            <p>Industry leaders choose us for mission-critical infrastructure.</p>
          </div>
          <div className="clients-grid">
            {['TechCorp', 'DataFlow', 'CloudBase', 'NovaTech', 'Quantum', 'ApexSoft', 'GreenLeaf', 'StarLink'].map((name, i) => (
              <div key={i} className="client-logo">{name}</div>
            ))}
          </div>
        </section>

        <section className="section stats-section">
          <div className="stats-inner">
            <div className="stat-block"><span className="stat-number">99.9%</span><span className="stat-label">Uptime SLA</span></div>
            <div className="stat-block"><span className="stat-number">150+</span><span className="stat-label">Countries</span></div>
            <div className="stat-block"><span className="stat-number">10K+</span><span className="stat-label">Enterprise clients</span></div>
            <div className="stat-block"><span className="stat-number">&lt;50ms</span><span className="stat-label">Avg. latency</span></div>
          </div>
        </section>

        <section className="section carousel-section">
          <div className="section-header">
            <span className="section-tag">Gallery</span>
            <h2>See Homepage in action</h2>
            <p>A peek inside the platform.</p>
          </div>
          <div className="carousel">
            <div className="carousel-track" style={{ transform: `translateX(-${slide * 100}%)` }}>
              {slides.map((s, i) => (
                <div key={i} className="carousel-slide">
                  <img src={s.img} alt={s.title} />
                  <div className="carousel-caption"><h3>{s.title}</h3><p>{s.desc}</p></div>
                </div>
              ))}
            </div>
            <button className="carousel-btn carousel-prev" onClick={() => setSlide(s => (s === 0 ? slides.length - 1 : s - 1))}>&lsaquo;</button>
            <button className="carousel-btn carousel-next" onClick={() => setSlide(s => (s === slides.length - 1 ? 0 : s + 1))}>&rsaquo;</button>
            <div className="carousel-dots">
              {slides.map((_, i) => (
                <button key={i} className={`carousel-dot ${i === slide ? 'active' : ''}`} onClick={() => setSlide(i)} />
              ))}
            </div>
          </div>
        </section>

        <section className="section testimonials">
          <div className="section-header">
            <span className="section-tag">Testimonials</span>
            <h2>Loved by engineering teams</h2>
            <p>See what our customers have to say.</p>
          </div>
          <div className="testimonials-grid">
            {[
              { name: 'Sarah Chen', role: 'CTO, TechCorp', text: 'Homepage transformed our deployment pipeline. We went from 2-week release cycles to continuous delivery in days.', avatar: 'SC' },
              { name: 'Marcus Johnson', role: 'Engineering Lead, DataFlow', text: 'The AI-powered insights alone saved us countless hours of manual analysis. Game changer for our data team.', avatar: 'MJ' },
              { name: 'Elena Rodriguez', role: 'VP Product, CloudBase', text: 'We evaluated dozens of platforms. Homepage was the only one that checked every box for security, scale, and ease of use.', avatar: 'ER' },
            ].map((t, i) => (
              <div key={i} className="testimonial-card">
                <div className="testimonial-stars">{'★'.repeat(5)}</div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.avatar}</div>
                  <div><strong>{t.name}</strong><span>{t.role}</span></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="section security-section">
          <div className="section-header">
            <span className="section-tag">Security & Compliance</span>
            <h2>Enterprise-grade security built-in</h2>
            <p>Your data is protected by industry-leading standards.</p>
          </div>
          <div className="security-grid">
            <div className="security-card"><div className="security-icon"><svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div><h3>SOC 2 Type II</h3><p>Certified for security, availability, and confidentiality.</p></div>
            <div className="security-card"><div className="security-icon"><svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg></div><h3>GDPR Compliant</h3><p>Full compliance with European data protection regulations.</p></div>
            <div className="security-card"><div className="security-icon"><svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg></div><h3>End-to-End Encryption</h3><p>All data encrypted at rest and in transit with AES-256.</p></div>
            <div className="security-card"><div className="security-icon"><svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg></div><h3>99.99% Uptime</h3><p>Multi-region deployment with automatic failover and DR.</p></div>
          </div>
        </section>

        <section className="section faq">
          <div className="section-header">
            <span className="section-tag">FAQ</span>
            <h2>Frequently asked questions</h2>
            <p>Everything you need to know about Homepage.</p>
          </div>
          <div className="faq-list">
            {[
              { q: 'What is Homepage?', a: 'Homepage is an all-in-one enterprise platform that helps organizations accelerate their digital transformation. It includes user management, AI-powered tools, analytics dashboards, and secure infrastructure.' },
              { q: 'How does pricing work?', a: 'We offer three tiers: Starter ($49/mo), Professional ($149/mo), and Enterprise (custom pricing). Each tier includes different levels of users, storage, and support. You can upgrade or downgrade at any time.' },
              { q: 'Is my data secure?', a: 'Absolutely. We are SOC 2 Type II certified and GDPR compliant. All data is encrypted at rest (AES-256) and in transit (TLS 1.3). We also offer SSO, audit logs, and role-based access control.' },
              { q: 'Can I integrate with existing tools?', a: 'Yes. Homepage supports seamless integration with React, Node.js, PostgreSQL, Docker, AWS, GitHub, and many more through our REST API and GraphQL endpoints.' },
              { q: 'What kind of support do you offer?', a: 'Starter plans get email support. Professional plans include priority support. Enterprise plans include 24/7 dedicated support with a named account manager and custom SLA.' },
              { q: 'Is there a free trial?', a: 'Yes! We offer a 14-day free trial on all plans with no credit card required. You get full access to all features during the trial period.' },
            ].map((item, i) => (
              <div key={i} className={`faq-item ${openFaq === i ? 'open' : ''}`} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <div className="faq-question"><span>{item.q}</span><svg className="faq-arrow" viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 7l5 5 5-5"/></svg></div>
                <div className="faq-answer">{item.a}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="section newsletter">
          <div className="newsletter-card">
            <h2>Stay up to date</h2>
            <p>Get product updates, industry insights, and best practices delivered to your inbox.</p>
            <form className="newsletter-form" onSubmit={e => { e.preventDefault(); alert('Thanks for subscribing!') }}>
              <input type="email" placeholder="Enter your email" required />
              <button type="submit" className="btn btn-primary">Subscribe</button>
            </form>
          </div>
        </section>
      </main>

      <footer id="contact" className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <Link to="/" className="logo">
              <svg viewBox="0 0 32 32" width="28" height="28"><rect width="32" height="32" rx="8" fill="url(#lg2)"/><path d="M16 8l8 8-8 8-8-8z" fill="white" opacity="0.9"/><path d="M16 12l4 4-4 4-4-4z" fill="white"/><defs><linearGradient id="lg2" x1="0" y1="0" x2="32" y2="32"><stop offset="0%" stopColor="#1a73e8"/><stop offset="100%" stopColor="#0d47a1"/></linearGradient></defs></svg>
              <span className="logo-text">Homepage</span>
            </Link>
            <p className="footer-desc">The enterprise platform for modern digital transformation.</p>
            <div className="footer-social">
              <a href="#" aria-label="Twitter"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
              <a href="#" aria-label="LinkedIn"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>
              <a href="#" aria-label="GitHub"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg></a>
            </div>
          </div>
          <div className="footer-links">
            <div className="footer-col"><h4>Product</h4><a href="#">Features</a><a href="#">Solutions</a><a href="#">Pricing</a><a href="#">Integrations</a><a href="#">API</a></div>
            <div className="footer-col"><h4>Company</h4><a href="#">About</a><a href="#">Blog</a><a href="#">Careers</a><a href="#">Partners</a><a href="#">Press</a></div>
            <div className="footer-col"><h4>Support</h4><a href="#">Documentation</a><a href="#">Help center</a><a href="#">Contact</a><a href="#">Status</a></div>
            <div className="footer-col"><h4>Legal</h4><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Security</a><a href="#">Cookies</a></div>
          </div>
        </div>
        <div className="footer-bottom"><p>&copy; 2026 Homepage, Inc. All rights reserved.</p></div>
      </footer>
      <ChatBot />
    </>
  )
}

function AppRoutes() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/ai/agent" element={<AIAgent />} />
          <Route path="/ai/generate" element={<ContentGenerator />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </ThemeProvider>
  )
}
