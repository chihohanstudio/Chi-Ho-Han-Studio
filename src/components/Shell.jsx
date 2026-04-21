import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth.jsx';
import ErrorBoundary from './ErrorBoundary.jsx';

const studentTabs = [
  { to: '/book',         label: 'Book a lesson' },
  { to: '/my-lessons',   label: 'My lessons' },
  { to: '/studio-class', label: 'Studio class' },
  { to: '/policy',       label: 'Announcements' },
];

const adminTabs = [
  { to: '/schedule',     label: 'Schedule' },
  { to: '/open-slots',   label: 'Open slots' },
  { to: '/studio-class', label: 'Studio class' },
  { to: '/students',     label: 'Students' },
  { to: '/policy',       label: 'Announcements' },
];

export default function Shell({ children }) {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const tabs = profile?.role === 'admin' ? adminTabs : studentTabs;

  return (
    <div className="topnav-shell">
      <header className="topnav-header">
        <div className="topnav-brand-row">
          <div className="topnav-brand">
            <div>
              <div className="topnav-eyebrow">Jacobs · Piano</div>
              <div className="topnav-title">The Han Studio</div>
            </div>
          </div>

          <div className="topnav-userbox">
            <div style={{ textAlign: 'right', maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              <div style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 500 }}>
                {profile?.full_name || profile?.email?.split('@')[0]}
              </div>
              <div style={{
                fontSize: 10,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--ink-mute)',
              }}>
                {profile?.role === 'admin' ? 'Faculty' : 'Student'}
              </div>
            </div>
            <button
              onClick={signOut}
              style={{
                fontSize: 12,
                padding: '6px 12px',
                border: '0.5px solid var(--rule)',
                borderRadius: 'var(--r-sm)',
                color: 'var(--ink-soft)',
                background: 'var(--paper)',
                transition: 'background 120ms ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--paper-soft)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--paper)')}
            >
              Sign out
            </button>
          </div>
        </div>

        <nav className="topnav-tabs" aria-label="Main navigation">
          {tabs.map(t => (
            <NavLink
              key={t.to}
              to={t.to}
              className={({ isActive }) => 'topnav-tab' + (isActive ? ' active' : '')}
            >
              {t.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="topnav-main" key={location.pathname}>
        <ErrorBoundary>
          <div className="anim-fade">{children}</div>
        </ErrorBoundary>
      </main>
    </div>
  );
}
