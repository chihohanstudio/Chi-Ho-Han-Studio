// Studio Class — shared page for both roles
// Students: sign up pieces; Admin: manage sessions, cancel, edit pieces.

const WEEKDAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

function StudioClassPage() {
  const app = useApp();
  const { studioClass, myId, role, displayName, settings } = app;
  const { fmtDate, fmt12, todayISO, mergeStudioSessions } = window.HS;
  const today = todayISO();
  const isAdmin = role === 'admin';

  // merged = real rows + virtual defaults for weeks with no real row
  const merged = mergeStudioSessions(studioClass, settings, today);

  const upcoming = merged.filter(s => s.session_date >= today);
  const past = [...studioClass].filter(s => s.session_date < today)
    .sort((a,b) => (b.session_date+b.session_time).localeCompare(a.session_date+a.session_time));

  const [signupFor, setSignupFor] = React.useState(null);
  const [pieceDrafts, setPieceDrafts] = React.useState(['']);
  const [editSession, setEditSession] = React.useState(null);
  const [creating, setCreating] = React.useState(false);
  const [editingDefaults, setEditingDefaults] = React.useState(false);

  const defaultDayLabel = WEEKDAY_NAMES[Number(settings.studio_default_weekday ?? 3)];

  const openSignup = (sc) => {
    setSignupFor(sc);
    setPieceDrafts(['']);
  };

  const updateDraft = (i, v) => {
    const next = [...pieceDrafts]; next[i] = v; setPieceDrafts(next);
  };
  const addDraft = () => setPieceDrafts([...pieceDrafts, '']);
  const removeDraft = (i) => {
    if (pieceDrafts.length === 1) { setPieceDrafts(['']); return; }
    setPieceDrafts(pieceDrafts.filter((_, idx) => idx !== i));
  };

  const submitPieces = () => {
    const clean = pieceDrafts.map(s => s.trim()).filter(Boolean);
    if (clean.length === 0) return;
    clean.forEach(p => app.addPiece(signupFor.id, p));
    setPieceDrafts(['']); setSignupFor(null);
  };

  return (
    <>
      <PageHeader eyebrow="Studio class" title="Studio performances"
        subtitle={`Weekly studio class — sign up to perform. Default schedule: ${defaultDayLabel}s at ${fmt12(settings.studio_default_time)} in ${settings.studio_default_location}.`}
        actions={isAdmin && (
          <div style={{display:'flex', gap: 8}}>
            <Button round size="sm" variant="secondary" onClick={() => setEditingDefaults(true)} title="Default schedule">
              <Icon.cal size={13}/>
            </Button>
            <Button round size="sm" onClick={() => setCreating(true)} title="Add a one-off session">
              <Icon.plus size={14}/>
            </Button>
          </div>
        )} />

      {editingDefaults && (
        <DefaultScheduleEditor settings={settings} onClose={() => setEditingDefaults(false)}
          onSave={(patch) => {
            Object.keys(patch).forEach(k => app.updateSetting(k, patch[k]));
            setEditingDefaults(false);
            app.showToast ? null : null;
          }}
        />
      )}

      {creating && (
        <SessionEditor session={null} onClose={() => setCreating(false)}
          onSave={(d) => { app.createSession(d); setCreating(false); }}
          settings={settings} />
      )}
      {editSession && (
        <SessionEditor session={editSession} onClose={() => setEditSession(null)}
          onSave={(d) => { app.updateSession(editSession.id, d); setEditSession(null); }}
          onDelete={() => { app.deleteSession(editSession.id); setEditSession(null); }}
          settings={settings} />
      )}
      {signupFor && (
        <div onClick={() => setSignupFor(null)} style={modalBackdrop}>
          <div onClick={e=>e.stopPropagation()} style={{...modalCard, maxWidth: 540}}>
            <Eyebrow>Sign up to perform</Eyebrow>
            <h3 className="font-serif" style={{ fontSize:22, fontStyle:'italic', fontWeight:400, margin:'0 0 6px' }}>
              {fmtDate(signupFor.session_date)}
            </h3>
            <p style={{ fontSize: 12.5, color:'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 18px' }}>
              Add one or more pieces you'd like to perform. Composer · work · movement.
            </p>

            <label style={swapLabel}>Pieces</label>
            <div style={{display:'flex', flexDirection:'column', gap: 8, marginBottom: 10}}>
              {pieceDrafts.map((draft, i) => (
                <div key={i} style={{display:'flex', gap: 8, alignItems:'center'}}>
                  <div style={{
                    width: 22, textAlign: 'center', fontSize: 11,
                    color:'var(--ink-mute)', fontFamily: 'JetBrains Mono, monospace',
                    flexShrink: 0,
                  }}>{i+1}.</div>
                  <input
                    autoFocus={i === pieceDrafts.length - 1}
                    value={draft}
                    onChange={e => updateDraft(i, e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (i === pieceDrafts.length - 1 && draft.trim()) addDraft();
                      }
                    }}
                    placeholder={i === 0
                      ? 'e.g. Chopin Ballade No. 4 in F minor, Op. 52'
                      : 'Another piece…'}
                    style={{ ...miniInput, flex: 1 }}
                  />
                  <Button
                    round size="sm" variant="ghost"
                    onClick={() => removeDraft(i)}
                    title="Remove piece"
                    disabled={pieceDrafts.length === 1 && !draft}
                  >
                    <Icon.x size={13} />
                  </Button>
                </div>
              ))}
            </div>

            <button
              onClick={addDraft}
              style={{
                fontSize: 12, color: 'var(--ink-soft)', background:'transparent',
                border: '1px dashed var(--rule)', borderRadius: 12,
                padding: '8px 12px', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontFamily: 'Inter, sans-serif', marginBottom: 20,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--paper-soft)'; e.currentTarget.style.borderStyle = 'solid'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderStyle = 'dashed'; }}
            >
              <Icon.plus size={12}/> Add another piece
            </button>

            <div style={{display:'flex', gap:8, justifyContent:'flex-end'}}>
              <Button variant="ghost" size="sm" onClick={()=>setSignupFor(null)}>Cancel</Button>
              <Button size="sm" onClick={submitPieces}
                disabled={pieceDrafts.every(d => !d.trim())}>
                Sign up {pieceDrafts.filter(d => d.trim()).length > 1 ? `(${pieceDrafts.filter(d => d.trim()).length} pieces)` : ''}
              </Button>
            </div>
          </div>
        </div>
      )}

      <section style={{ marginBottom: 48 }}>
        <SectionH>Upcoming</SectionH>
        {upcoming.length === 0 ? (
          <Muted>No sessions scheduled.</Muted>
        ) : upcoming.map(sc => (
          <SessionCard key={sc.id} sc={sc} myId={myId} isAdmin={isAdmin}
            displayName={displayName}
            onSignup={() => openSignup(sc)}
            onRemovePiece={(pid) => app.removePiece(sc.id, pid)}
            onToggleCancel={() => app.toggleCancelSession(sc.id)}
            onEdit={() => setEditSession(sc)}
          />
        ))}
      </section>

      <section>
        <SectionH>Past</SectionH>
        {past.length === 0 ? (
          <Muted>No past sessions.</Muted>
        ) : past.map(sc => (
          <SessionCard key={sc.id} sc={sc} myId={myId} isAdmin={isAdmin}
            displayName={displayName} isPast
            onEdit={isAdmin ? () => setEditSession(sc) : null}
          />
        ))}
      </section>
    </>
  );
}

function SessionCard({ sc, myId, isAdmin, displayName, isPast, onSignup, onRemovePiece, onToggleCancel, onEdit }) {
  const { fmtDate, fmt12 } = window.HS;
  const mySignedUp = sc.pieces.some(p => p.student_id === myId);

  return (
    <div style={{
      border: '1px solid var(--rule-soft)', borderRadius: 20, marginBottom: 16,
      background: sc.cancelled ? 'var(--paper-soft)' : 'var(--paper)',
      boxShadow: 'var(--shadow-xs)',
      opacity: isPast ? 0.72 : 1,
    }}>
      <div style={{
        padding: '16px 20px', borderBottom: sc.pieces.length ? '0.5px solid var(--rule-soft)' : 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap',
      }}>
        <div style={{ flex: 1, minWidth: 240 }}>
          <div style={{ display:'flex', alignItems:'baseline', gap:12, flexWrap:'wrap', marginBottom: 4 }}>
            <h3 className="font-serif nowrap" style={{
              fontSize: 18, fontStyle:'italic', fontWeight:400, margin:0,
              textDecoration: sc.cancelled ? 'line-through' : 'none',
            }}>{fmtDate(sc.session_date)}</h3>
            <span className="font-mono" style={{ fontSize: 12, color:'var(--ink-mute)' }}>
              {fmt12(sc.session_time)} · {sc.location}
            </span>
            {sc.cancelled && <Pill color="accent">Cancelled</Pill>}
            {sc.isDefault && !sc.cancelled && (
              <span style={{
                fontSize: 9.5, letterSpacing:'0.16em', textTransform:'uppercase',
                color:'var(--ink-mute)', border:'0.5px solid var(--rule)',
                padding:'2px 7px', borderRadius: 999,
              }}>Default</span>
            )}
          </div>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          {!isPast && !sc.cancelled && !isAdmin && (
            <Button size="sm" onClick={onSignup}>
              {mySignedUp ? '+ Add another' : 'Sign up'}
            </Button>
          )}
          {isAdmin && onEdit && (
            <Button round variant="secondary" size="sm" onClick={onEdit} title="Edit session">
              <Icon.pencil size={13} />
            </Button>
          )}
          {isAdmin && !isPast && (
            <Button round variant={sc.cancelled ? 'secondary' : 'danger'} size="sm" onClick={onToggleCancel} title={sc.cancelled ? 'Restore' : 'Cancel session'}>
              {sc.cancelled ? <Icon.undo size={13}/> : <Icon.ban size={13}/>}
            </Button>
          )}
        </div>
      </div>
      {sc.pieces.length > 0 && (
        <div>
          {sc.pieces.map(p => (
            <div key={p.id} style={{
              padding: '10px 20px', display:'flex', alignItems:'center',
              gap: 14, borderTop: '0.5px solid var(--rule-soft)', fontSize: 13,
            }}>
              <div style={{ width: 130, fontSize: 12, color: 'var(--ink-soft)', flexShrink:0 }}>
                {displayName(p.student_id)}
              </div>
              <div className="font-serif" style={{ flex:1, fontStyle:'italic' }}>{p.piece}</div>
              {(p.student_id === myId || isAdmin) && !isPast && !sc.cancelled && (
                <Button round size="sm" variant="ghost" onClick={() => onRemovePiece(p.id)} title="Remove piece">
                  <Icon.x size={12} />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
      {sc.pieces.length === 0 && !sc.cancelled && !isPast && (
        <div style={{ padding:'14px 20px', fontSize:12.5, color:'var(--ink-mute)', fontStyle:'italic', borderTop:'0.5px solid var(--rule-soft)' }} className="font-serif">
          No one signed up yet.
        </div>
      )}
    </div>
  );
}

function DefaultScheduleEditor({ settings, onClose, onSave }) {
  const { fmt12 } = window.HS;
  const [weekday, setWeekday] = React.useState(Number(settings.studio_default_weekday ?? 3));
  const [time, setTime] = React.useState(settings.studio_default_time || '19:30:00');
  const [loc, setLoc] = React.useState(settings.studio_default_location || 'MA 405');
  const [weeks, setWeeks] = React.useState(Number(settings.studio_default_weeks_ahead ?? 8));

  return (
    <div onClick={onClose} style={modalBackdrop}>
      <div onClick={e=>e.stopPropagation()} style={{...modalCard, maxWidth: 520}}>
        <Eyebrow>Default studio-class schedule</Eyebrow>
        <h3 className="font-serif" style={{ fontSize: 22, fontStyle:'italic', fontWeight:400, margin:'4px 0 6px' }}>
          Recurring session
        </h3>
        <p style={{ fontSize: 12.5, color:'var(--ink-soft)', lineHeight: 1.55, marginTop: 0, marginBottom: 18 }}>
          The studio class repeats every week on this day at this time. Change any individual week from the list — your edits stick while the rest stay on this default.
        </p>

        <div style={{display:'grid', gridTemplateColumns:'1.2fr 1fr', gap: 12, marginBottom: 14}}>
          <div>
            <label style={swapLabel}>Day of week</label>
            <select value={weekday} onChange={e=>setWeekday(Number(e.target.value))}
              style={{...miniInput, width:'100%'}}>
              {WEEKDAY_NAMES.map((n, i) => <option key={i} value={i}>{n}</option>)}
            </select>
          </div>
          <div>
            <label style={swapLabel}>Time</label>
            <input type="time" value={time.slice(0,5)} onChange={e=>setTime(e.target.value+':00')}
              style={{...miniInput, width:'100%'}} />
          </div>
        </div>

        <label style={swapLabel}>Location</label>
        <input value={loc} onChange={e=>setLoc(e.target.value)}
          style={{...miniInput, width:'100%', marginBottom: 14}} />

        <label style={swapLabel}>Show how many weeks ahead</label>
        <div style={{display:'flex', alignItems:'center', gap: 10, marginBottom: 20}}>
          <input type="number" min={1} max={52} value={weeks}
            onChange={e => {
              const v = parseInt(e.target.value, 10);
              if (!isNaN(v)) setWeeks(Math.max(1, Math.min(52, v)));
              else setWeeks('');
            }}
            style={{...miniInput, width: 90, textAlign:'center'}} />
          <span style={{fontSize: 12.5, color:'var(--ink-soft)'}}>
            weeks
          </span>
        </div>

        <div style={{
          padding: '12px 14px', background:'var(--paper-soft)', borderRadius: 12,
          border:'0.5px solid var(--rule)', marginBottom: 18,
          fontSize: 12.5, color:'var(--ink-soft)', lineHeight: 1.55,
        }}>
          <div style={{fontSize: 10, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--ink-mute)', marginBottom: 4}}>Preview</div>
          Every <strong>{WEEKDAY_NAMES[weekday]}</strong> at <strong className="font-mono">{fmt12(time)}</strong> in <strong>{loc}</strong>, for the next <strong>{weeks} weeks</strong>.
        </div>

        <div style={{display:'flex', gap:8, justifyContent:'flex-end'}}>
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={() => onSave({
            studio_default_weekday: weekday,
            studio_default_time: time,
            studio_default_location: loc,
            studio_default_weeks_ahead: weeks,
          })}>Save defaults</Button>
        </div>
      </div>
    </div>
  );
}

function SessionEditor({ session, onClose, onSave, onDelete, settings }) {
  const [date, setDate] = React.useState(session?.session_date || '2026-04-29');
  const [time, setTime] = React.useState(session?.session_time || settings.studio_default_time || '19:30:00');
  const [loc, setLoc] = React.useState(session?.location || settings.studio_default_location || 'MA 405');
  return (
    <div onClick={onClose} style={modalBackdrop}>
      <div onClick={e=>e.stopPropagation()} style={modalCard}>
        <Eyebrow>{session ? 'Edit session' : 'New studio class session'}</Eyebrow>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 12, marginTop: 10, marginBottom: 14}}>
          <div>
            <label style={swapLabel}>Date</label>
            <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{...miniInput, width:'100%'}} />
          </div>
          <div>
            <label style={swapLabel}>Time</label>
            <input type="time" value={time.slice(0,5)} onChange={e=>setTime(e.target.value+':00')} style={{...miniInput, width:'100%'}} />
          </div>
        </div>
        <label style={swapLabel}>Location</label>
        <input value={loc} onChange={e=>setLoc(e.target.value)} style={{...miniInput, width:'100%', marginBottom: 16}} />
        <div style={{display:'flex', gap:8, justifyContent:'space-between'}}>
          <div>
            {session && onDelete && (
              <Button variant="danger" size="sm" onClick={onDelete}><Icon.trash size={12}/> Delete</Button>
            )}
          </div>
          <div style={{display:'flex', gap:8}}>
            <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
            <Button size="sm" onClick={()=>onSave({ session_date:date, session_time:time, location:loc })}>Save</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

const modalBackdrop = {
  position:'fixed', inset:0, background:'rgba(28,27,24,0.32)',
  display:'flex', alignItems:'center', justifyContent:'center', zIndex: 50, padding: 20,
};
const modalCard = {
  background:'var(--paper)', border:'1px solid var(--rule)', borderRadius: 24,
  padding: 32, maxWidth: 460, width:'100%', boxShadow:'var(--shadow-lg)',
};
const iconBtn = {
  background:'transparent', border:'none', color:'var(--ink-mute)', cursor:'pointer', padding:4,
  display:'inline-flex', alignItems:'center',
};

Object.assign(window, { StudioClassPage });
