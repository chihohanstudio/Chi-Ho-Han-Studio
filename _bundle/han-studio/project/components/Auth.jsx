// Login page + Tweaks panel + main App router

function LoginPage() {
  const app = useApp();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [sent, setSent] = React.useState(false);
  const [useMagic, setUseMagic] = React.useState(false);
  const [mode, setMode] = React.useState('signin'); // 'signin' | 'signup'
  const [fullName, setFullName] = React.useState('');

  const submit = (e) => {
    e?.preventDefault();
    if (!email.trim()) return;
    if (useMagic) { setSent(true); return; }
    if (!password.trim()) return;
    // "log in"
    app.setRole('student'); app.setSignedIn(true); app.nav('/book');
  };
  const enter = (role) => {
    app.setRole(role);
    app.setSignedIn(true);
    app.nav(role === 'admin' ? '/schedule' : '/book');
  };

  return (
    <div style={{
      minHeight: '100%', background: 'var(--paper)',
      display: 'grid', gridTemplateColumns: '1.1fr 1fr',
    }} className="login-wrap">
      <div style={{
        padding: '56px 72px', display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between',
        background: 'linear-gradient(180deg, var(--paper) 0%, var(--paper-soft) 100%)',
        borderRight: '0.5px solid var(--rule)',
      }} className="login-left">
        <div>
          <div style={{ fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginBottom: 10 }}>
            Jacobs · Piano · Indiana University
          </div>
          <h1 className="font-serif" style={{ fontSize: 'clamp(56px, 7vw, 88px)', fontStyle: 'italic', fontWeight: 400, margin: 0, lineHeight: 0.95, letterSpacing: '-0.025em' }}>
            The Han<br/>Studio
          </h1>
          <p style={{ fontSize: 14.5, color: 'var(--ink-soft)', lineHeight: 1.6, marginTop: 32, maxWidth: 380 }}>
            A private scheduling book for Prof. Chi Ho Han's piano studio —
            for booking lessons, signing up for studio class, and keeping in touch with the week.
          </p>
        </div>
        <div style={{ fontSize: 11, color: 'var(--ink-mute)', maxWidth: 380, lineHeight: 1.6 }} className="font-serif" >
          <em>“If you can hear it, you can play it — eventually.”</em>
          <div style={{ fontStyle: 'normal', marginTop: 4 }}>— studio motto</div>
        </div>
      </div>

      <div style={{
        padding: '56px 72px', display: 'flex', flexDirection: 'column', justifyContent: 'center',
      }} className="login-right">
        <div style={{ maxWidth: 360 }}>
          <div style={{ display:'flex', gap: 4, borderBottom: '0.5px solid var(--rule)', marginBottom: 28 }}>
            {['signin','signup'].map(m => (
              <button key={m} onClick={()=>{ setMode(m); setSent(false); }} style={{
                padding: '10px 2px', marginRight: 24, fontSize: 12.5,
                color: mode === m ? 'var(--ink)' : 'var(--ink-mute)',
                background: 'transparent', border: 'none', cursor: 'pointer',
                borderBottom: mode === m ? '1px solid var(--ink)' : '1px solid transparent',
                marginBottom: -1, fontWeight: mode === m ? 500 : 400,
              }}>
                {m === 'signin' ? 'Sign in' : 'I have an invite'}
              </button>
            ))}
          </div>

          {sent ? (
            <div>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', background: 'var(--green-soft)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--green)', marginBottom: 16,
              }}><Icon.check size={16} w={2} /></div>
              <h2 className="font-serif" style={{ fontSize: 22, fontStyle: 'italic', fontWeight: 400, margin: '0 0 10px' }}>
                Check your inbox
              </h2>
              <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: 24 }}>
                We sent a magic link to <strong>{email}</strong>. Click the link to sign in — no password needed.
              </p>
              <div style={{
                fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase',
                color: 'var(--ink-mute)', marginBottom: 10,
              }}>Or continue as a demo user</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button size="sm" variant="secondary" onClick={() => enter('student')}>Enter as student</Button>
                <Button size="sm" variant="secondary" onClick={() => enter('admin')}>Enter as Chi Ho</Button>
              </div>
            </div>
          ) : (
            <form onSubmit={submit}>
              <h2 className="font-serif" style={{ fontSize: 28, fontStyle: 'italic', fontWeight: 400, margin: '0 0 8px' }}>
                {mode === 'signin' ? 'Welcome back' : 'Finish your invite'}
              </h2>
              <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', marginBottom: 28, lineHeight: 1.55 }}>
                {mode === 'signin'
                  ? "Sign in with your studio email and password."
                  : "Enter the email from your invite and choose a password."}
              </p>

              {mode === 'signup' && (
                <>
                  <label style={swapLabel}>Full name</label>
                  <input value={fullName} onChange={e=>setFullName(e.target.value)} placeholder="First Last"
                    style={{ ...miniInput, width:'100%', marginBottom: 16, fontSize: 14, padding: '10px 12px' }} />
                </>
              )}

              <label style={swapLabel}>Email</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@iu.edu" autoFocus
                style={{ ...miniInput, width:'100%', marginBottom: 16, fontSize: 14, padding: '10px 12px' }} />

              {!useMagic && (
                <>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 6}}>
                    <label style={{...swapLabel, marginBottom: 0}}>Password</label>
                    {mode === 'signin' && (
                      <button type="button" onClick={()=>setUseMagic(true)} style={{
                        fontSize: 10.5, letterSpacing:'0.08em', textTransform:'uppercase',
                        color:'var(--ink-mute)', background:'none', border:'none', cursor:'pointer', padding: 0,
                      }}>Forgot? Use magic link</button>
                    )}
                  </div>
                  <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••"
                    style={{ ...miniInput, width:'100%', marginBottom: 20, fontSize: 14, padding: '10px 12px' }} />
                </>
              )}
              {useMagic && (
                <div style={{
                  padding:'10px 12px', background:'var(--paper-soft)',
                  border:'0.5px solid var(--rule)', borderRadius: 12, marginBottom: 20,
                  fontSize: 12.5, color: 'var(--ink-soft)', display:'flex', justifyContent:'space-between', alignItems:'center', gap:8,
                }}>
                  <span>We'll email a one-time link to <strong>{email || 'your address'}</strong>.</span>
                  <button type="button" onClick={()=>setUseMagic(false)} style={{
                    fontSize: 10.5, letterSpacing:'0.08em', textTransform:'uppercase',
                    color:'var(--ink-mute)', background:'none', border:'none', cursor:'pointer', padding: 0, flexShrink: 0,
                  }}>Use password</button>
                </div>
              )}

              <Button type="submit" style={{ width: '100%' }}>
                {useMagic ? 'Send magic link' : (mode === 'signin' ? 'Sign in' : 'Create account')}
              </Button>

              <div style={{ marginTop: 36, paddingTop: 24, borderTop: '0.5px solid var(--rule)' }}>
                <div style={{
                  fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: 'var(--ink-mute)', marginBottom: 12,
                }}>Prototype demo</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button size="sm" variant="ghost" onClick={() => enter('student')}>
                    Student view →
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => enter('admin')}>
                    Chi Ho's view →
                  </Button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Tweaks panel
// ============================================================================
function TweaksPanel() {
  const app = useApp();
  const { tweaks, setTweaks, tweaksOpen, setTweaksOpen } = app;
  if (!tweaksOpen) return null;

  const accents = [
    { v: '#9B2D1F', n: 'Brick' },
    { v: '#1F3B6B', n: 'Indigo' },
    { v: '#1F4B3B', n: 'Forest' },
    { v: '#6B4226', n: 'Walnut' },
    { v: '#3D3D3D', n: 'Graphite' },
  ];
  const serifs = ['Fraunces', 'Playfair Display', 'DM Serif Display', 'EB Garamond'];
  const densities = ['comfortable', 'compact'];
  const variants = ['classical', 'modern', 'editorial'];

  const set = (k, v) => {
    setTweaks(t => ({ ...t, [k]: v }));
    window.parent?.postMessage({ type: '__edit_mode_set_keys', edits: { [k]: v } }, '*');
  };

  return (
    <div style={{
      position: 'fixed', bottom: 20, right: 20, width: 280, zIndex: 300,
      background: 'var(--paper)', border: '1px solid var(--rule-soft)',
      boxShadow: 'var(--shadow-lg)', borderRadius: 20,
      padding: 20, fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 14 }}>
        <div style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>
          Tweaks
        </div>
        <button onClick={()=>setTweaksOpen(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--ink-mute)'}}>
          <Icon.x size={13} />
        </button>
      </div>

      <TweakRow label="Accent">
        <div style={{display:'flex', gap: 6}}>
          {accents.map(a => (
            <button key={a.v} onClick={()=>set('accent', a.v)} title={a.n}
              style={{
                width: 22, height: 22, borderRadius: '50%', background: a.v, cursor:'pointer',
                border: tweaks.accent === a.v ? '2px solid var(--ink)' : '0.5px solid var(--rule)',
                padding: 0,
              }} />
          ))}
        </div>
      </TweakRow>

      <TweakRow label="Serif">
        <select value={tweaks.serif} onChange={e=>set('serif', e.target.value)}
          style={{ ...miniInput, width: '100%', fontSize: 12 }}>
          {serifs.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </TweakRow>

      <TweakRow label="Density">
        <div style={{display:'flex', gap: 6}}>
          {densities.map(d => (
            <button key={d} onClick={()=>set('density', d)}
              style={chipStyle(tweaks.density === d)}>{d}</button>
          ))}
        </div>
      </TweakRow>

      <TweakRow label="Variant" last>
        <div style={{display:'flex', gap: 6, flexWrap:'wrap'}}>
          {variants.map(v => (
            <button key={v} onClick={()=>set('variant', v)}
              style={chipStyle(tweaks.variant === v)}>{v}</button>
          ))}
        </div>
      </TweakRow>
    </div>
  );
}
function TweakRow({ label, children, last }) {
  return (
    <div style={{ marginBottom: last ? 0 : 14, paddingBottom: last ? 0 : 14, borderBottom: last ? 'none' : '0.5px solid var(--rule-soft)' }}>
      <div style={{ fontSize: 10.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginBottom: 8 }}>
        {label}
      </div>
      {children}
    </div>
  );
}
const chipStyle = (active) => ({
  fontSize: 11, padding: '4px 10px',
  border: '0.5px solid ' + (active ? 'var(--ink)' : 'var(--rule)'),
  background: active ? 'var(--ink)' : 'transparent',
  color: active ? 'var(--paper)' : 'var(--ink-soft)',
  cursor: 'pointer', borderRadius: 12, fontFamily: 'Inter, sans-serif',
});

Object.assign(window, { LoginPage, TweaksPanel });
