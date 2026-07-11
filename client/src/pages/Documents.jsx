import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { 
  FileText, Plus, ChevronRight, ChevronDown, Edit2, 
  Trash2, Eye, FileCode, CheckCircle, List, Table, Link as LinkIcon
} from 'lucide-react';

const Documents = () => {
  const { user } = useAuth();
  const { documents, createDocument, updateDocument, deleteDocument, currentWorkspace } = useApp();
  const [activeDocId, setActiveDocId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Editor states
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [newDocParentId, setNewDocParentId] = useState(null);

  const workspaceDocs = documents.filter(d => d.workspaceId === currentWorkspace?.id);
  const rootDocs = workspaceDocs.filter(d => d.parentId === null);
  const activeDoc = workspaceDocs.find(d => d.id === activeDocId) || workspaceDocs[0] || null;

  // Sync editor with active doc
  React.useEffect(() => {
    if (activeDoc) {
      setActiveDocId(activeDoc.id);
      setEditTitle(activeDoc.title);
      setEditContent(activeDoc.content);
    } else {
      setActiveDocId(null);
      setEditTitle('');
      setEditContent('');
    }
  }, [activeDocId, documents]);

  const handleSave = () => {
    if (!editTitle.trim()) return;
    if (activeDoc) {
      updateDocument(activeDoc.id, editTitle, editContent);
    } else {
      const newDoc = createDocument(editTitle, editContent, newDocParentId);
      setActiveDocId(newDoc.id);
    }
    setIsEditing(false);
  };

  const handleCreateNew = (parentId = null) => {
    setNewDocParentId(parentId);
    setActiveDocId(null);
    setEditTitle('Untitled Document');
    setEditContent('# Untitled Document\n\nWrite content in markdown here...');
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this page and its subpages permanently?')) {
      deleteDocument(id);
      setActiveDocId(null);
    }
  };

  // Simple Markdown Parser
  const parseMarkdown = (md) => {
    if (!md) return '';
    const lines = md.split('\n');
    let html = [];
    let inCodeBlock = false;
    let codeContent = [];
    let inList = false;

    lines.forEach((line, index) => {
      // Code blocks
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          inCodeBlock = false;
          html.push(
            `<pre style="background-color: var(--bg-primary); border: 2px solid var(--border); padding: 1rem; margin-bottom: 1.5rem; overflow-x: auto;"><code style="color: var(--text-primary); font-family: monospace;">${codeContent.join('\n')}</code></pre>`
          );
          codeContent = [];
        } else {
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeContent.push(line.replace(/</g, '&lt;').replace(/>/g, '&gt;'));
        return;
      }

      // Headers
      if (line.startsWith('# ')) {
        html.push(`<h1 style="font-size: 2.2rem; border-bottom: 2px solid var(--border); padding-bottom: 0.5rem; margin-bottom: 1.5rem; margin-top: 1rem;">${line.substring(2)}</h1>`);
        return;
      }
      if (line.startsWith('## ')) {
        html.push(`<h2 style="font-size: 1.6rem; border-bottom: 1px solid var(--border); padding-bottom: 0.25rem; margin-bottom: 1.25rem; margin-top: 1.5rem;">${line.substring(3)}</h2>`);
        return;
      }
      if (line.startsWith('### ')) {
        html.push(`<h3 style="font-size: 1.25rem; margin-bottom: 1rem; margin-top: 1.25rem;">${line.substring(4)}</h3>`);
        return;
      }

      // Lists
      if (line.startsWith('- ') || line.startsWith('* ')) {
        if (!inList) {
          inList = true;
          html.push('<ul style="margin-left: 1.5rem; margin-bottom: 1.5rem; display: flex; flexDirection: column; gap: 0.5rem;">');
        }
        html.push(`<li>${line.substring(2)}</li>`);
        return;
      } else if (inList && !line.startsWith('- ') && !line.startsWith('* ')) {
        inList = false;
        html.push('</ul>');
      }

      // Empty line
      if (line.trim() === '') {
        html.push('<div style="height: 1rem;"></div>');
        return;
      }

      // Standard paragraphs (with inline formatting)
      let parsedLine = line
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code style="background-color: var(--border); padding: 2px 6px; font-family: monospace;">$1</code>');

      html.push(`<p style="margin-bottom: 1rem; color: var(--text-secondary); line-height: 1.6;">${parsedLine}</p>`);
    });

    if (inList) html.push('</ul>');
    return html.join('');
  };

  // Outline Subpages recursive drawer
  const renderDocOutline = (doc, depth = 0) => {
    const subpages = workspaceDocs.filter(d => d.parentId === doc.id);
    const hasSubpages = subpages.length > 0;
    const isActive = activeDocId === doc.id;

    return (
      <div key={doc.id} style={{ display: 'flex', flexDirection: 'column' }}>
        <div 
          onClick={() => {
            setActiveDocId(doc.id);
            setIsEditing(false);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 0.75rem',
            paddingLeft: `${depth * 1.25 + 0.75}rem`,
            cursor: 'pointer',
            backgroundColor: isActive ? 'var(--hover)' : 'transparent',
            borderLeft: isActive ? '3px solid var(--text-primary)' : '3px solid transparent'
          }}
          onMouseEnter={(e) => { if (!isActive) e.target.style.backgroundColor = 'var(--hover)'; }}
          onMouseLeave={(e) => { if (!isActive) e.target.style.backgroundColor = 'transparent'; }}
        >
          <FileText size={14} style={{ color: 'var(--text-secondary)' }} />
          <span style={{ fontSize: '13px', fontWeight: isActive ? 'bold' : 'normal', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {doc.title}
          </span>
          
          <button 
            onClick={(e) => { e.stopPropagation(); handleCreateNew(doc.id); }}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '2px' }}
            title="Create subpage"
          >
            <Plus size={12} />
          </button>
          
          <button 
            onClick={(e) => { e.stopPropagation(); handleDelete(doc.id); }}
            style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', padding: '2px' }}
            title="Delete page"
          >
            <Trash2 size={12} />
          </button>
        </div>

        {hasSubpages && subpages.map(sub => renderDocOutline(sub, depth + 1))}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 120px)', gap: '2rem' }}>
      
      {/* Left drawer: Page List */}
      <div style={{
        width: '260px',
        border: '2px solid var(--border)',
        backgroundColor: 'var(--card)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0
      }}>
        <div style={{ padding: '1rem', borderBottom: '2px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '0.05em' }}>DOC OUTLINES</span>
          <button onClick={() => handleCreateNew(null)} className="bauhaus-btn" style={{ padding: '0.25rem 0.5rem', fontSize: '10px' }}>
            <Plus size={12} />
            <span>Root</span>
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem 0' }}>
          {rootDocs.map(doc => renderDocOutline(doc, 0))}
          {rootDocs.length === 0 && (
            <div style={{ color: 'var(--text-secondary)', fontSize: '12px', textAlign: 'center', padding: '2rem 1rem' }}>
              No outline pages created.
            </div>
          )}
        </div>
      </div>

      {/* Right Canvas: Reader/Editor */}
      <div style={{ flex: 1, border: '2px solid var(--border)', backgroundColor: 'var(--card)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* Toolbar */}
        <div style={{ padding: '1rem', borderBottom: '2px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-primary)' }}>
          {isEditing ? (
            <div style={{ display: 'flex', gap: '0.75rem', marginLeft: 'auto' }}>
              <button onClick={handleSave} className="bauhaus-btn bauhaus-btn-success" style={{ padding: '0.4rem 1rem', fontSize: '12px' }}>
                <CheckCircle size={14} />
                <span>Save Page</span>
              </button>
              <button 
                onClick={() => {
                  if (activeDoc) {
                    setIsEditing(false);
                    setEditTitle(activeDoc.title);
                    setEditContent(activeDoc.content);
                  } else {
                    setActiveDocId(workspaceDocs[0]?.id || null);
                    setIsEditing(false);
                  }
                }} 
                className="bauhaus-btn" 
                style={{ padding: '0.4rem 1rem', fontSize: '12px' }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                Author: <strong>{activeDoc ? workspaceDocs.find(d => d.id === activeDoc.id)?.authorId || 'Arthur' : '-'}</strong> | Created: {activeDoc?.createdAt}
              </div>
              {activeDoc && (
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="bauhaus-btn" 
                  style={{ display: 'inline-flex', gap: '0.5rem', padding: '0.4rem 1rem', fontSize: '12px' }}
                >
                  <Edit2 size={14} />
                  <span>Modify Canvas</span>
                </button>
              )}
            </>
          )}
        </div>

        {/* Editor Area */}
        <div style={{ flex: 1, padding: '2.5rem', overflowY: 'auto' }}>
          {isEditing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
              <input 
                type="text" 
                className="bauhaus-input"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Page Title"
                style={{ fontSize: '2.2rem', fontWeight: 700, border: 'none', borderBottom: '2px solid var(--border)', backgroundColor: 'transparent', padding: '0.5rem 0' }}
              />
              
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <label className="bauhaus-label">Markdown Canvas Source</label>
                <textarea 
                  className="bauhaus-input"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="# Write Markdown here..."
                  style={{ flex: 1, resize: 'none', fontFamily: 'monospace', padding: '1rem', height: '100%', fontSize: '14px', lineHeight: 1.6 }}
                />
              </div>
            </div>
          ) : (
            <div>
              {activeDoc ? (
                <div dangerouslySetInnerHTML={{ __html: parseMarkdown(activeDoc.content) }} />
              ) : (
                <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
                  <FileText size={48} style={{ marginBottom: '1rem', color: 'var(--border)' }} />
                  <h2>Select or create an outline page to begin canvas drawing</h2>
                </div>
              )}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default Documents;
