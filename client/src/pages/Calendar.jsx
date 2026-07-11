import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';

const Calendar = () => {
  const { tasks, currentWorkspace } = useApp();
  const navigate = useNavigate();
  
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 11)); // Default to July 11, 2026 (matching system timestamp)
  const [viewMode, setViewMode] = useState('month'); // 'month', 'week', 'day'

  const workspaceTasks = tasks.filter(t => t.workspaceId === currentWorkspace?.id && t.dueDate);

  // Month details
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
  ];

  // Helper: Get tasks due on a specific date (YYYY-MM-DD)
  const getTasksForDate = (dateObj) => {
    const dateStr = dateObj.toISOString().split('T')[0];
    return workspaceTasks.filter(t => t.dueDate === dateStr);
  };

  // Monthly View generator
  const getDaysInMonthGrid = () => {
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
    const totalDays = new Date(year, month + 1, 0).getDate();
    
    const cells = [];
    
    // Fill padding cells for previous month
    const prevMonthTotalDays = new Date(year, month, 0).getDate();
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      cells.push({
        date: new Date(year, month - 1, prevMonthTotalDays - i),
        isCurrentMonth: false
      });
    }
    
    // Fill current month cells
    for (let i = 1; i <= totalDays; i++) {
      cells.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      });
    }
    
    // Fill trailing cells to make complete grid rows (multiples of 7)
    const totalCells = cells.length;
    const remaining = 42 - totalCells; // 6 rows * 7 days
    for (let i = 1; i <= remaining; i++) {
      cells.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      });
    }
    
    return cells;
  };

  const handlePrev = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(year, month - 1, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 7)));
    } else {
      setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 1)));
    }
  };

  const handleNext = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(year, month + 1, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 7)));
    } else {
      setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 1)));
    }
  };

  // Weekly View generator
  const getWeekDays = () => {
    const day = currentDate.getDay();
    const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1); // Start from Monday
    const monday = new Date(currentDate.setDate(diff));
    
    const week = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      week.push(d);
    }
    return week;
  };

  const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
      
      {/* Header toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexShrink: 0 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '2rem' }}>TASK CALENDAR</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '0.25rem' }}>
            Current Focus: <strong>{monthNames[month]} {year}</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          
          {/* Previous/Next */}
          <div style={{ display: 'flex', border: '2px solid var(--border)' }}>
            <button onClick={handlePrev} className="bauhaus-btn" style={{ padding: '0.4rem 0.75rem', border: 'none' }}>
              <ChevronLeft size={16} />
            </button>
            <button onClick={handleNext} className="bauhaus-btn" style={{ padding: '0.4rem 0.75rem', border: 'none', borderLeft: '1px solid var(--border)' }}>
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Mode Switcher */}
          <div style={{ display: 'flex', border: '2px solid var(--border)' }}>
            {['month', 'week', 'day'].map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                style={{
                  padding: '0.4rem 0.75rem',
                  border: 'none',
                  backgroundColor: viewMode === mode ? 'var(--border)' : 'transparent',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  borderLeft: mode !== 'month' ? '1px solid var(--border)' : 'none'
                }}
              >
                {mode}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Calendar Area */}
      <div style={{ flex: 1, backgroundColor: 'var(--card)', border: '2px solid var(--border)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* Month View Grid */}
        {viewMode === 'month' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            
            {/* Week headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '2px solid var(--border)', backgroundColor: 'var(--bg-primary)' }}>
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
                <div key={d} style={{ padding: '0.75rem', fontSize: '12px', fontWeight: 'bold', textAlign: 'center', letterSpacing: '0.05em' }}>
                  {d}
                </div>
              ))}
            </div>

            {/* Grid Cells */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridTemplateRows: 'repeat(6, 1fr)', flex: 1 }}>
              {getDaysInMonthGrid().map((cell, idx) => {
                const dayTasks = getTasksForDate(cell.date);
                const isToday = cell.date.toDateString() === new Date(2026, 6, 11).toDateString(); // Simulated current time July 11, 2026
                
                return (
                  <div 
                    key={idx}
                    style={{
                      borderBottom: '1px solid var(--border)',
                      borderRight: '1px solid var(--border)',
                      padding: '0.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      backgroundColor: cell.isCurrentMonth ? 'transparent' : 'var(--bg-primary)',
                      opacity: cell.isCurrentMonth ? 1 : 0.5,
                      overflow: 'hidden'
                    }}
                  >
                    <span style={{
                      alignSelf: 'flex-start',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      padding: '2px 6px',
                      backgroundColor: isToday ? 'var(--text-primary)' : 'transparent',
                      color: isToday ? 'var(--bg-primary)' : 'var(--text-primary)',
                    }}>
                      {cell.date.getDate()}
                    </span>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.25rem', overflowY: 'auto' }}>
                      {dayTasks.map(t => (
                        <div 
                          key={t.id}
                          onClick={() => navigate('/tasks')}
                          style={{
                            padding: '2px 4px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            border: '1px solid var(--border)',
                            backgroundColor: t.status === 'Completed' ? 'var(--success)' : 'var(--bg-primary)',
                            color: t.status === 'Completed' ? 'var(--bg-primary)' : 'var(--text-primary)',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                          title={t.title}
                        >
                          {t.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* Week View Grid */}
        {viewMode === 'week' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '2px solid var(--border)', backgroundColor: 'var(--bg-primary)' }}>
              {daysOfWeek.map((d, index) => {
                const weekDays = getWeekDays();
                const cellDate = weekDays[index];
                return (
                  <div key={d} style={{ padding: '0.75rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{d}</div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', marginTop: '0.25rem' }}>{cellDate ? cellDate.getDate() : ''}</div>
                  </div>
                );
              })}
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', flex: 1 }}>
              {getWeekDays().map((date, idx) => {
                const dayTasks = getTasksForDate(date);
                return (
                  <div key={idx} style={{ borderRight: '1px solid var(--border)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto' }}>
                    {dayTasks.map(t => (
                      <div 
                        key={t.id}
                        onClick={() => navigate('/tasks')}
                        style={{
                          padding: '0.5rem',
                          border: '2px solid var(--border)',
                          backgroundColor: 'var(--bg-primary)',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ fontWeight: 'bold' }}>{t.title}</div>
                        <div className={`bauhaus-badge badge-${t.priority.toLowerCase()}`} style={{ fontSize: '12px', marginTop: '0.5rem' }}>
                          {t.priority}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Day View Grid */}
        {viewMode === 'day' && (
          <div style={{ padding: '2rem', overflowY: 'auto', flex: 1 }}>
            <div style={{ borderBottom: '2px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <h3>Agenda for {currentDate.toDateString()}</h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {getTasksForDate(currentDate).map(t => (
                <div 
                  key={t.id}
                  onClick={() => navigate('/tasks')}
                  className="bauhaus-card"
                  style={{ margin: 0, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <div>
                    <h4 style={{ margin: 0 }}>{t.title}</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: '0.25rem' }}>{t.description}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span className={`bauhaus-badge badge-${t.priority.toLowerCase()}`}>{t.priority}</span>
                    <span className={`bauhaus-badge badge-${t.status.toLowerCase()}`}>{t.status}</span>
                  </div>
                </div>
              ))}
              
              {getTasksForDate(currentDate).length === 0 && (
                <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '3rem 0' }}>
                  No tasks scheduled for this day.
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Calendar;
