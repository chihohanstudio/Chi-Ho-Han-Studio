// Top-level tab shell — wraps the entire prototype with Design System / Student / Admin / Mobile / Login tabs

function TopShell() {
  const TABS = [
    { id: 'ds', label: 'Design System' },
    { id: 'student', label: 'Student' },
    { id: 'admin', label: 'Admin' },
    { id: 'mobile', label: 'Mobile' },
    { id: 'login', label: 'Login' },
  ];
  const [tab, setTab] = React.useState(() => {
    try { return localStorage.getItem('hs_tab') || 'student'; } catch { return 'student'; }
  });
  React.useEffect(() => { try { localStorage.setItem('hs_tab', tab); } catch {} }, [tab]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper)', display:'flex', flexDirection:'column' }}>
      <header style={{
        position:'sticky', top: 0, zIndex: 100,
        display:'flex', alignItems:'center', gap: 32,
        padding: '14px 24px', background: 'rgba(248,245,239,0.92)',
        backdropFilter:'blur(10px)', WebkitBackdropFilter:'blur(10px)',
        borderBottom:'0.5px solid var(--rule)', flexWrap:'wrap',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
          <div className="font-serif" style={{
            width: 28, height: 28, border:'0.5px solid var(--ink)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize: 17, fontStyle:'italic',
          }}>H</div>
          <div>
            <div style={{ fontSize: 9, letterSpacing:'0.24em', textTransform:'uppercase', color:'var(--ink-mute)' }}>Jacobs · Piano</div>
            <div className="font-serif" style={{ fontSize: 14, fontStyle:'italic', lineHeight: 1 }}>Han Studio · prototype</div>
          </div>
        </div>
        <nav style={{ display:'flex', gap: 2, flex: 1 }}>
          {TABS.map(t => {
            const on = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                padding:'8px 14px', fontSize: 12.5,
                color: on ? 'var(--ink)' : 'var(--ink-mute)',
                fontWeight: on ? 500 : 400,
                borderBottom: on ? '1.5px solid var(--ink)' : '1.5px solid transparent',
                marginBottom: -14, borderRadius: 0, whiteSpace:'nowrap',
                fontFamily:'Inter, sans-serif',
              }}>{t.label}</button>
            );
          })}
        </nav>
        <div style={{ fontSize: 10, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--ink-mute)' }}>
          v0.1 · mock data
        </div>
      </header>

      <main style={{ flex: 1, minHeight: 0 }}>
        {tab === 'ds' && <DesignSystemPage />}
        {tab === 'student' && <AppProvider initialRoute="/book"><InnerApp forceRole="student" /></AppProvider>}
        {tab === 'admin'   && <AppProvider initialRoute="/schedule"><InnerApp forceRole="admin" /></AppProvider>}
        {tab === 'mobile'  && <MobilePage />}
        {tab === 'login'   && <AppProvider initialRoute="/book"><InnerApp forceSignedOut /></AppProvider>}
      </main>
    </div>
  );
}

// InnerApp: App wrapper that can force a starting role or signed-out state
function InnerApp({ forceRole, forceSignedOut }) {
  const app = useApp();
  const didInit = React.useRef(false);
  React.useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    if (forceRole) app.setRole(forceRole);
    if (forceSignedOut) app.setSignedIn(false);
  }, []);
  return <App />;
}

Object.assign(window, { TopShell, InnerApp });
