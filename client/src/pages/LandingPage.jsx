import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header Navigation */}
      <header className="appbar">
        <div style={{
          backgroundColor: 'var(--primary)',
          padding: '0.4rem 1.25rem',
          borderRadius: 'var(--radius-full)',
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h1 style={{ fontSize: '1.3rem', margin: 0, letterSpacing: '0.02em', color: '#FFFFFF', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>WATTKER</h1>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link to="/login" className="bauhaus-btn bauhaus-btn-secondary" style={{ fontSize: '13px', padding: '0.4rem 1.25rem' }}>Login</Link>
          <Link to="/signup" className="bauhaus-btn bauhaus-btn-primary" style={{ fontSize: '13px', padding: '0.4rem 1.25rem' }}>Sign Up</Link>
        </div>
      </header>

      {/* Hero Section */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '6rem 3rem', position: 'relative', overflow: 'hidden' }}>
        
        {/* Material You Ambient Glow Blur Shapes */}
        <div style={{
          position: 'absolute',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          backgroundColor: 'var(--primary)',
          top: '10%',
          right: '10%',
          filter: 'blur(90px)',
          zIndex: 0,
          opacity: 0.15,
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          backgroundColor: 'var(--secondary)',
          bottom: '12%',
          left: '8%',
          filter: 'blur(80px)',
          zIndex: 0,
          opacity: 0.12,
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          backgroundColor: 'var(--tertiary)',
          top: '40%',
          left: '12%',
          filter: 'blur(70px)',
          zIndex: 0,
          opacity: 0.15,
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
          <span style={{ 
            color: 'var(--primary)', 
            fontWeight: 500, 
            letterSpacing: '0.04em', 
            textTransform: 'uppercase', 
            fontSize: '12px',
            fontFamily: 'var(--font-heading)',
            backgroundColor: 'var(--secondary-container)',
            padding: '0.4rem 1.25rem',
            borderRadius: 'var(--radius-full)',
            display: 'inline-block',
            marginBottom: '1.5rem',
            boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)'
          }}>
            Wattker Collaborative Engine
          </span>
          
          <h1 style={{ 
            fontSize: '4.5rem', 
            marginTop: '0.5rem', 
            marginBottom: '2rem', 
            letterSpacing: '-0.02em', 
            lineHeight: 1.1,
            color: 'var(--foreground)',
            fontFamily: 'var(--font-heading)',
            fontWeight: 500
          }}>
            Elegant workspace for modern teams.
          </h1>
          
          <p style={{ color: 'var(--text-secondary)', fontSize: '18px', maxWidth: '650px', marginBottom: '2.5rem', lineHeight: '1.6', fontWeight: 400 }}>
            Wattker is a premium collaborative SaaS workspace for fast-moving teams. Create project dashboards, coordinate Kanban tasks, and edit markdown documents in real time.
          </p>
          
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/login" className="bauhaus-btn bauhaus-btn-primary" style={{ padding: '0.8rem 2.5rem', fontSize: '15px' }}>
              Launch Workspace
            </Link>
            <a href="#features" className="bauhaus-btn bauhaus-btn-secondary" style={{ padding: '0.8rem 2.5rem', fontSize: '15px' }}>
              Core Philosophy
            </a>
          </div>
        </div>
      </main>

      {/* Modular Grid Info Section */}
      <section id="features" style={{
        borderTop: '1px solid var(--border)',
        backgroundColor: 'var(--bg-primary)',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        minHeight: '320px',
        position: 'relative',
        zIndex: 5
      }}>
        {/* Card 1 */}
        <div style={{ padding: '3.5rem 3rem', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ 
            fontSize: '15px', 
            fontWeight: '500', 
            color: 'var(--on-secondary-container)',
            backgroundColor: 'var(--secondary-container)',
            padding: '0.4rem 1.25rem',
            borderRadius: 'var(--radius-full)',
            textAlign: 'center',
            fontFamily: 'var(--font-heading)',
            boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)'
          }}>
            01. BOARDS & TASKS
          </div>
          <div style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontWeight: 400, marginTop: '0.5rem' }}>
            Strict Kanban boards, checklist-based subtasks, and instant comment systems. Designed for zero friction and maximum cognitive throughput.
          </div>
        </div>

        {/* Card 2 */}
        <div style={{ padding: '3.5rem 3rem', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ 
            fontSize: '15px', 
            fontWeight: '500', 
            color: '#E65100',
            backgroundColor: '#FFE0B2',
            padding: '0.4rem 1.25rem',
            borderRadius: 'var(--radius-full)',
            textAlign: 'center',
            fontFamily: 'var(--font-heading)',
            boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)'
          }}>
            02. NOTION-LIKE DOCS
          </div>
          <div style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontWeight: 400, marginTop: '0.5rem' }}>
            Hierarchical outline document canvas with markdown text formatting, custom code blocks, tables, lists, and direct inline navigation.
          </div>
        </div>

        {/* Card 3 */}
        <div style={{ padding: '3.5rem 3rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ 
            fontSize: '15px', 
            fontWeight: '500', 
            color: '#2E7D32',
            backgroundColor: '#C8E6C9',
            padding: '0.4rem 1.25rem',
            borderRadius: 'var(--radius-full)',
            textAlign: 'center',
            fontFamily: 'var(--font-heading)',
            boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)'
          }}>
            03. REAL-TIME EVENT SYNC
          </div>
          <div style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontWeight: 400, marginTop: '0.5rem' }}>
            Instant board synchronization, active member presence indicators, and instant live notification streams handled over high-performance socket layers.
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '2rem 3rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '12px',
        color: 'var(--text-muted)',
        backgroundColor: 'var(--bg-primary)',
        position: 'relative',
        zIndex: 5,
        fontWeight: 500
      }}>
        <div>WATTKER CO. ALL RIGHTS RESERVED.</div>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <a href="#" style={{ color: 'var(--text-muted)' }}>MANIFESTO</a>
          <a href="#" style={{ color: 'var(--text-muted)' }}>SECURITY</a>
          <a href="#" style={{ color: 'var(--text-muted)' }}>API DOCS</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
