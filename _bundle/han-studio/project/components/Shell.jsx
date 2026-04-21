// Shell — top nav + main column (was sidebar; converted to horizontal header per feedback).

function Shell({ children }) {
  const app = useApp();
  const { route, nav, role, profile } = app;
  const isAdmin = role === 'admin';

  const studentNav = [
    { to: '/book',         label: 'Book a lesson', icon: Icon.cal },
    { to: '/my-lessons',   label: 'My lessons',    icon: Icon.clock },
    { to: '/studio-class', label: 'Studio class',  icon: Icon.users },
    { to: '/policy',       label: 'Announcements', icon: Icon.file },
  ];
  const adminNav = [
    { to: '/schedule',     label: 'Schedule',      icon: Icon.cal },
    { to: '/open-slots',   label: 'Open slots',    icon: Icon.plus },
    { to: '/studio-class', label: 'Studio class',  icon: Icon.users },
    { to: '/students',     label: 'Students',      icon: Icon.book },
    { to: '/policy',       label: 'Announcements', icon: Icon.file },
  ];
  const navItems = isAdmin ? adminNav : studentNav;

  return (
    <div style={{ minHeight: '100%', background: 'var(--paper)', display:'flex', flexDirection:'column' }}>
      {/* Top nav */}
      <header className="hs-topnav" style={{
        borderBottom: '0.5px solid var(--rule)',
        background: 'var(--paper)',
        padding: '0 40px',
      }}>
        {/* Row 1 — wordmark + signed-in chip */}
        <div className="hs-topnav-row1" style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          padding: '22px 0 16px', gap: 24, flexWrap: 'wrap',
        }}>
          <div>
            <div style={{
              fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase',
              color: 'var(--ink-mute)', marginBottom: 6,
            }}>Jacobs · Piano · Indiana University</div>
            <div className="font-serif" style={{
              fontSize: 'clamp(34px, 5vw, 44px)', fontStyle: 'italic', lineHeight: 0.95,
              fontWeight: 400, letterSpacing: '-0.02em', whiteSpace: 'nowrap',
            }}>The Han Studio</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase',
                color: 'var(--ink-mute)', marginBottom: 2,
              }}>Signed in</div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>
                {profile?.full_name || profile?.email?.split('@')[0]}
              </div>
              <div style={{ fontSize: 10.5, color: 'var(--ink-mute)' }}>
                {isAdmin ? 'Studio faculty' : profile?.email}
              </div>
            </div>
            <button onClick={() => app.setSignedIn(false)}
              style={{
                fontSize: 11, color: 'var(--ink-mute)',
                padding: '8px 12px', border: '0.5px solid var(--rule)', borderRadius: 12,
                display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
                background: 'transparent',
              }}
              onMouseEnter={e => e.currentTarget.style.background='var(--paper-soft)'}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}
              title="Sign out">
              <Icon.logout size={12} />
              Sign out
            </button>
          </div>
        </div>

        {/* Row 2 — tabs */}
        <nav style={{
          display: 'flex', gap: 0, overflowX: 'auto',
        }}>
          {navItems.map(item => {
            const active = route === item.to || (item.to === '/students' && route.startsWith('/students/'));
            const IconC = item.icon;
            return (
              <button key={item.to} onClick={() => nav(item.to)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '12px 16px 14px', marginRight: 4, fontSize: 13,
                  color: active ? 'var(--ink)' : 'var(--ink-soft)',
                  fontWeight: active ? 500 : 400,
                  borderBottom: active ? '1.5px solid var(--ink)' : '1.5px solid transparent',
                  marginBottom: -1,
                  background: 'transparent', cursor: 'pointer', whiteSpace: 'nowrap',
                  fontFamily: 'Inter, sans-serif',
                  transition: 'color 120ms ease',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'var(--ink)'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'var(--ink-soft)'; }}>
                <IconC size={14} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </header>

      <main className="hs-mainwrap" style={{ flex: 1, padding: '48px 40px 80px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          {children}
        </div>
      </main>

      {/* Toast */}
      {app.toast && (
        <div key={app.toast.id} style={{
          position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          padding: '10px 18px',
          background: app.toast.kind === 'error' ? '#F5E1DC' : 'var(--green-soft)',
          border: `0.5px solid ${app.toast.kind === 'error' ? '#E0BAB0' : '#B5C5BC'}`,
          color: app.toast.kind === 'error' ? 'var(--accent)' : 'var(--green)',
          fontSize: 13, borderRadius: 999, zIndex: 200,
          boxShadow: 'var(--shadow-md)',
          animation: 'fadeSlide 0.25s ease-out',
        }}>{app.toast.text}</div>
      )}
    </div>
  );
}

Object.assign(window, { Shell });
