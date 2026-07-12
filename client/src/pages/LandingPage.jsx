import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logoBlack from '../assets/logo-black.png';
import logoWhite from '../assets/logo-white.png';
import { FolderKanban, FileText, Activity } from 'lucide-react';

const LandingPage = () => {
  const { user } = useAuth();
  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header Navigation */}
      <header className="appbar">
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
            fontSize: '1.5rem', 
            fontWeight: 800, 
            color: '#1C1B1F', 
            letterSpacing: '0.02em',
            fontFamily: 'var(--font-heading)'
          }}>
            Doct.
          </span>
        </Link>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <a href="#download" className="bauhaus-btn" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            fontSize: '13px', 
            padding: '0.4rem 1.25rem', 
            backgroundColor: '#FFFFFF', 
            color: '#1C1B1F', 
            border: '1px solid #1C1B1F',
            textDecoration: 'none'
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M0 3.449L9.75 2.1v9.45H0V3.449zM0 12.45h9.75v9.45L0 20.551v-8.1zM11.25 1.899L24 0v11.55H11.25V1.899zM11.25 12.45H24v11.55l-12.75-1.899v-9.65z"/>
            </svg>
            <span>Download</span>
          </a>

          {user ? (
            <Link to="/dashboard" className="bauhaus-btn" style={{ fontSize: '13px', padding: '0.4rem 1.25rem', backgroundColor: '#1C1B1F', color: '#FFFFFF', border: '1px solid #1C1B1F' }}>Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="bauhaus-btn" style={{ fontSize: '13px', padding: '0.4rem 1.25rem', backgroundColor: '#FFFFFF', color: '#1C1B1F', border: '1px solid #1C1B1F' }}>Login</Link>
              <Link to="/signup" className="bauhaus-btn" style={{ fontSize: '13px', padding: '0.4rem 1.25rem', backgroundColor: '#1C1B1F', color: '#FFFFFF', border: '1px solid #1C1B1F' }}>Sign Up</Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="hero-container" style={{ 
        flex: 1, 
        display: 'grid', 
        gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)', 
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
              gap: 3rem !important;
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
              order: -1 !important; /* Move logo on top on mobile viewports */
              margin-top: 1rem !important;
            }
          }

          /* Features Showcase Layout */
          .features-showcase {
            padding: 6rem 3rem;
            max-width: 1200px;
            margin: 0 auto;
            width: 100%;
            box-sizing: border-box;
          }
          .features-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 2rem;
            width: 100%;
            margin-top: 2rem;
          }
          .feature-card {
            background-color: var(--surface-container) !important;
            border-radius: var(--radius-lg) !important;
            padding: 2.25rem 2rem !important;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.03), 0px 1px 3px rgba(0, 0, 0, 0.05) !important;
            cursor: pointer;
            overflow: hidden;
            position: relative;
            min-height: 420px;
          }
          .feature-icon-wrapper {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            background-color: #FFFFFF;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 1.5rem;
            box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.05);
            color: #1C1B1F;
          }
          
          /* Mini UI Previews */
          .mini-preview {
            background-color: rgba(255, 255, 255, 0.85);
            border-radius: var(--radius-md);
            padding: 1.25rem 1rem;
            margin-top: 1.5rem;
            border: 1px solid rgba(28, 27, 31, 0.1);
            min-height: 120px;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }
          
          /* Specific mini-UI components */
          .mini-task {
            background: #FFFFFF;
            border: 1px solid rgba(28, 27, 31, 0.08);
            border-radius: 8px;
            padding: 0.5rem 0.75rem;
            font-size: 11px;
            font-weight: 500;
            color: #1C1B1F;
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-shadow: 0px 1px 3px rgba(0,0,0,0.02);
          }
          
          .mini-tag {
            font-size: 8px;
            padding: 0.1rem 0.4rem;
            border-radius: 4px;
            font-weight: 600;
            text-transform: uppercase;
          }
          
          .doc-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 11px;
            color: #49454F;
            font-weight: 500;
          }
          
          .pulse-dot {
            width: 8px;
            height: 8px;
            background-color: #4CAF50;
            border-radius: 50%;
            display: inline-block;
            box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
            animation: pulse 1.6s infinite;
          }
          @keyframes pulse {
            0% {
              transform: scale(0.9);
              box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
            }
            70% {
              transform: scale(1);
              box-shadow: 0 0 0 6px rgba(76, 175, 80, 0);
            }
            100% {
              transform: scale(0.9);
              box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
            }
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
        


        {/* Left Column: Headline and Content */}
        <div className="hero-left" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', position: 'relative', zIndex: 1 }}>
          <span style={{ 
            color: 'var(--primary)', 
            fontWeight: 500, 
            letterSpacing: '0.04em', 
            textTransform: 'uppercase', 
            fontSize: '12px',
            fontFamily: 'var(--font-heading)',
            padding: '0.4rem 1.25rem',
            borderRadius: 'var(--radius-full)',
            display: 'inline-block',
            marginBottom: '1.5rem'
          }}>
          </span>
          
          <h1 style={{ 
            fontSize: '4rem', 
            marginTop: '0.5rem', 
            marginBottom: '2rem', 
            letterSpacing: '-0.02em', 
            lineHeight: 1.1,
            color: 'var(--foreground)',
            fontFamily: 'var(--font-heading)',
            fontWeight: 500
          }}>
            Elegant workspace for building projects.
          </h1>
          
          <p style={{ color: 'var(--text-secondary)', fontSize: '18px', maxWidth: '650px', marginBottom: '2.5rem', lineHeight: '1.6', fontWeight: 400 }}>
            Doct. is a collaborative SaaS workspace for fast-moving teams. Create project dashboards, coordinate Kanban tasks, and edit markdown documents in real time.
          </p>
          
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <Link to="/login" className="bauhaus-btn bauhaus-btn-primary" style={{ padding: '0.8rem 2.5rem', fontSize: '15px' }}>
              Launch Workspace
            </Link>
          </div>
        </div>

        {/* Right Column: Large Black Logo and Branding */}
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
            color: '#1C1B1F', 
            letterSpacing: '-0.03em', 
            fontFamily: 'var(--font-heading)',
            lineHeight: 1
          }}>
            Doct.
          </span>
        </div>
      </main>

      {/* Features Showcase Section */}
      <section id="features" className="features-showcase" style={{
        borderTop: '1px solid var(--border)',
        backgroundColor: 'var(--bg-primary)',
        position: 'relative',
        zIndex: 5
      }}>
        {/* Header Block */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: 'var(--foreground)',
            letterSpacing: '-0.02em',
            lineHeight: '1.2',
            marginBottom: '1rem',
            fontFamily: 'var(--font-heading)'
          }}>
            Built for focused execution.
          </h2>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '16px',
            maxWidth: '620px',
            lineHeight: '1.6',
            margin: '0 auto'
          }}>
            Ditch fragmented tabs. Doct combines Kanban, real-time rich document collaboration, team presence, and analytics in a single unified workspace.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="features-grid">
          {/* Card 1: Boards & Tasks */}
          <div className="feature-card">
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '0.75rem', fontFamily: 'var(--font-heading)' }}>
                Interactive Kanban
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                Plan and track sprints with zero friction. Drag-and-drop cards, set priorities, manage checklists, and comment on tasks instantly.
              </p>
            </div>
          </div>

          {/* Card 2: Notion-Like Docs */}
          <div className="feature-card">
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '0.75rem', fontFamily: 'var(--font-heading)' }}>
                Rich Canvas Docs
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                Create structured document outlines. Format content inline with Markdown, write clean code blocks, build tables, and organize thoughts.
              </p>
            </div>
          </div>

          {/* Card 3: Real-Time Event Sync */}
          <div className="feature-card">
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '0.75rem', fontFamily: 'var(--font-heading)' }}>
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
        borderTop: '1px solid #1C1B1F',
        padding: '2rem 3rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '12px',
        color: '#FFFFFF',
        backgroundColor: '#1C1B1F',
        position: 'relative',
        zIndex: 5,
        fontWeight: 500
      }}>
        <div>DOCT. CO. ALL RIGHTS RESERVED.</div>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <a href="#" style={{ color: '#FFFFFF', textDecoration: 'none' }}>MANIFESTO</a>
          <a href="#" style={{ color: '#FFFFFF', textDecoration: 'none' }}>SECURITY</a>
          <a href="#" style={{ color: '#FFFFFF', textDecoration: 'none' }}>API DOCS</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
