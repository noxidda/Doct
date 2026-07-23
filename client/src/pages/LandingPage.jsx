import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Download } from 'lucide-react';
import logoBlack from '../assets/logo-black.png';
import logoWhite from '../assets/logo-white.png';

const LandingPage = () => {
  const { user } = useAuth();
  React.useEffect(() => {
    document.documentElement.classList.remove('dark-theme');
  }, []);

  const DOWNLOAD_URL = "https://github.com/noxidda/Doct-NWA/releases/download/Application/Doct_0.1.0_x64-setup.exe";

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header Navigation */}
      <header className="appbar" style={{ borderBottom: '4px solid var(--border)' }}>
        <Link to="/" style={{
          textDecoration: 'none',
          padding: '0.2rem 0',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          cursor: 'pointer'
        }}>
          <img src={logoBlack} alt="Doct Logo" style={{ height: '32px', width: 'auto', display: 'block' }} />
          <span style={{ 
            fontSize: '1.6rem', 
            fontWeight: 900, 
            color: 'var(--foreground)', 
            letterSpacing: '-0.02em',
            fontFamily: 'var(--font-heading)',
            textTransform: 'uppercase'
          }}>
            Doct.
          </span>
        </Link>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <a 
            href={DOWNLOAD_URL}
            download
            className="bauhaus-btn btn-press btn-download" 
            style={{ fontSize: '12px', padding: '0.4rem 1.25rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Download size={14} />
            <span>Download App</span>
          </a>

          {user ? (
            <Link 
              to="/dashboard" 
              className="bauhaus-btn bauhaus-btn-primary btn-press landing-dashboard-btn" 
              style={{ fontSize: '12px', padding: '0.4rem 1.25rem' }}
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link 
                to="/login" 
                className="bauhaus-btn" 
                style={{ fontSize: '12px', padding: '0.4rem 1.25rem', backgroundColor: 'var(--bg-primary)' }}
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="bauhaus-btn bauhaus-btn-primary" 
                style={{ fontSize: '12px', padding: '0.4rem 1.25rem' }}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="hero-container" style={{ 
        flex: 1, 
        display: 'grid', 
        gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 0.9fr)', 
        gap: '4rem', 
        alignItems: 'center', 
        padding: '6rem 3rem', 
        position: 'relative', 
        overflow: 'hidden',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%'
      }}>
        <style>{`
          @media (max-width: 900px) {
            main.hero-container {
              grid-template-columns: 1fr !important;
              gap: 4rem !important;
              text-align: center !important;
              padding: 4rem 1.5rem !important;
            }
            .hero-left {
              align-items: center !important;
              text-align: center !important;
            }
            .hero-left p {
              margin-left: auto !important;
              margin-right: auto !important;
            }
            .hero-right {
              order: -1 !important;
              margin-top: 1rem !important;
            }
          }

          /* Showcase Section Style */
          .features-showcase {
            padding: 6rem 3rem;
            max-width: 1200px;
            margin: 0 auto;
            width: 100%;
            box-sizing: border-box;
            border-top: 4px solid var(--border);
          }
          .features-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 2rem;
            width: 100%;
            margin-top: 3rem;
          }
          @media (max-width: 900px) {
            .features-grid {
              grid-template-columns: 1fr !important;
              gap: 1.5rem !important;
            }
            .features-showcase {
              padding: 4rem 1.5rem !important;
            }
          }
        `}</style>

        {/* Left Column: Constructivist Headline & Content */}
        <div className="hero-left" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', position: 'relative', zIndex: 1 }}>
          
          <h1 style={{ 
            fontSize: '4.5rem', 
            marginTop: '0.5rem', 
            marginBottom: '2rem', 
            letterSpacing: '-0.04em', 
            lineHeight: '0.95',
            color: 'var(--foreground)',
            fontFamily: 'var(--font-heading)',
            fontWeight: 900,
            textTransform: 'uppercase'
          }}>
            Elegant workspace for building projects.
          </h1>
          
          <p style={{ color: 'var(--text-secondary)', fontSize: '18px', maxWidth: '600px', marginBottom: '2.5rem', lineHeight: '1.6', fontWeight: 500 }}>
            Doct. is a collaborative constructivist workspace for modern teams. Create project dashboards, coordinate Kanban tasks, and edit documents in real time.
          </p>
          
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link 
              to="/login" 
              className="bauhaus-btn bauhaus-btn-primary btn-press" 
              style={{ padding: '0.8rem 2.5rem', fontSize: '15px', border: '3px solid var(--border)' }}
            >
              Launch Workspace
            </Link>
            <a 
              href={DOWNLOAD_URL}
              download
              className="bauhaus-btn btn-press btn-download" 
              style={{ 
                padding: '0.8rem 2rem', 
                fontSize: '15px', 
                border: '3px solid var(--border)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                textDecoration: 'none'
              }}
            >
              <Download size={18} />
              <span>Download Windows App</span>
            </a>
          </div>
        </div>

        {/* Right Column: Large Logo and Branding */}
        <div className="hero-right" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', zIndex: 1 }}>
          <img 
            src={logoBlack} 
            alt="Doct Logo" 
            style={{ 
              height: '140px', 
              width: 'auto', 
              display: 'block'
            }} 
          />
          <span style={{ 
            fontSize: '5rem', 
            fontWeight: 900, 
            color: 'var(--foreground)', 
            letterSpacing: '-0.04em', 
            fontFamily: 'var(--font-heading)',
            lineHeight: 1,
            textTransform: 'uppercase'
          }}>
            Doct.
          </span>
        </div>
      </main>

      {/* Features Showcase Section */}
      <section id="features" className="features-showcase" style={{
        backgroundColor: 'var(--bg-primary)',
        position: 'relative',
        zIndex: 5
      }}>
        {/* Header Block */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '900',
            color: 'var(--foreground)',
            letterSpacing: '-0.03em',
            lineHeight: '1.1',
            marginBottom: '1rem',
            fontFamily: 'var(--font-heading)',
            textTransform: 'uppercase'
          }}>
            Built for focused execution.
          </h2>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '16px',
            maxWidth: '620px',
            lineHeight: '1.6',
            margin: '0 auto',
            fontWeight: 500
          }}>
            Ditch fragmented layouts. Doct combines Kanban boards, document editing, and real-time state synchronization into a singular constructivist grid.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="features-grid">
          {/* Card 1: Interactive Kanban */}
          <div className="bauhaus-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '260px' }}>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--foreground)', marginBottom: '0.75rem', fontFamily: 'var(--font-heading)' }}>
                Interactive Kanban
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                Plan and track sprints with zero friction. Drag-and-drop cards, set priorities, manage checklists, and comment on tasks instantly.
              </p>
            </div>
          </div>

          {/* Card 2: Rich Canvas Docs */}
          <div className="bauhaus-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '260px' }}>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--foreground)', marginBottom: '0.75rem', fontFamily: 'var(--font-heading)' }}>
                Rich Canvas Docs
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                Create structured document outlines. Format content inline with Markdown, write clean code blocks, build tables, and organize thoughts.
              </p>
            </div>
          </div>

          {/* Card 3: Real-Time Sync */}
          <div className="bauhaus-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '260px' }}>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--foreground)', marginBottom: '0.75rem', fontFamily: 'var(--font-heading)' }}>
                Real-Time Sync
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                Collaborate together instantly. View active user presence markers, real-time board updates, and live document state synchronization.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '4px solid var(--border)',
        padding: '2rem 3rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '12px',
        color: 'var(--bg-primary)',
        backgroundColor: 'var(--foreground)',
        position: 'relative',
        zIndex: 5,
        fontWeight: 700
      }}>
        <div style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>made by Aditya Pandit</div>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <a href="https://github.com/noxidda" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--bg-primary)', textDecoration: 'none', letterSpacing: '0.05em' }}>Github</a>
          <a href="https://linkedin.com/in/adityapandit098" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--bg-primary)', textDecoration: 'none', letterSpacing: '0.05em' }}>Linkedin</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
