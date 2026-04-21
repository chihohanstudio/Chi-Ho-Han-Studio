// Mobile iOS frames — Book, Schedule, Studio Class
// Keeps the Han Studio design language but adapted to mobile (stacked lists, tap targets, bottom tab bar).

function MobilePage() {
  const { fmtDate, fmt12 } = window.HS;
  const students = window.MOCK.students;
  const slots = window.MOCK.slots;
  const sc = window.MOCK.studioClass;

  // Group a few upcoming days for display
  const today = window.MOCK.today;
  const upcoming = slots.filter(s => s.slot_date >= today && (!s.restricted_to || s.restricted_to.includes('s1')));
  const daysMap = {};
  upcoming.forEach(s => { (daysMap[s.slot_date] = daysMap[s.slot_date] || []).push(s); });
  const dates = Object.keys(daysMap).sort().slice(0, 3);
  const displayName = id => students.find(s => s.id === id)?.full_name || 'Someone';

  return (
    <div style={{ padding: '56px 40px 96px', background: 'var(--paper-soft)', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginBottom: 14 }}>
          Mobile prototype · iOS 26
        </div>
        <h1 className="font-serif" style={{ fontSize: 44, fontWeight: 400, fontStyle: 'italic', margin: '0 0 14px', letterSpacing: '-0.015em' }}>
          On your phone
        </h1>
        <p style={{ fontSize: 14.5, color: 'var(--ink-soft)', lineHeight: 1.65, maxWidth: 600, margin: '0 0 56px' }}>
          Most students will open this from their phone between classes. Three core flows shown below — Book, Schedule (faculty view), and Studio Class sign-up.
        </p>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(402px, 1fr))',
          gap: 48, justifyContent: 'center', justifyItems: 'center',
        }}>
          {/* --- Device 1: Book --- */}
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap: 16 }}>
            <IOSDevice>
              <MobileBookScreen dates={dates} daysMap={daysMap} displayName={displayName} />
              <MobileTabBar active="book" />
            </IOSDevice>
            <DeviceCaption title="Book" subtitle="Student · Ding Zhou" />
          </div>

          {/* --- Device 2: Schedule --- */}
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap: 16 }}>
            <IOSDevice>
              <MobileScheduleScreen dates={dates} daysMap={daysMap} displayName={displayName} />
              <MobileTabBar active="sched" />
            </IOSDevice>
            <DeviceCaption title="Schedule" subtitle="Faculty · Chi Ho" />
          </div>

          {/* --- Device 3: Studio Class --- */}
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap: 16 }}>
            <IOSDevice>
              <MobileStudioClassScreen sc={sc} displayName={displayName} />
              <MobileTabBar active="studio" />
            </IOSDevice>
            <DeviceCaption title="Studio class" subtitle="Shared · sign-up" />
          </div>
        </div>
      </div>
    </div>
  );
}

function DeviceCaption({ title, subtitle }) {
  return (
    <div style={{ textAlign:'center', marginTop: 8 }}>
      <div className="font-serif" style={{ fontSize: 18, fontStyle:'italic' }}>{title}</div>
      <div style={{ fontSize: 11, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--ink-mute)', marginTop: 4 }}>{subtitle}</div>
    </div>
  );
}

// --- Mobile screens --------------------------------------------------------
const mobileBg = { background: '#F8F5EF', minHeight: '100%' };

function MobileHeader({ eyebrow, title, subtitle }) {
  return (
    <div style={{ padding: '62px 20px 18px', background: '#F8F5EF' }}>
      <div style={{ fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#78756C', marginBottom: 8 }}>{eyebrow}</div>
      <h1 className="font-serif" style={{ fontSize: 30, fontWeight: 400, fontStyle: 'italic', margin: 0, color: '#1C1B18', letterSpacing: '-0.015em', lineHeight: 1.1 }}>{title}</h1>
      {subtitle && <p style={{ fontSize: 12.5, color: '#78756C', lineHeight: 1.55, margin: '8px 0 0' }}>{subtitle}</p>}
      <div style={{ height: 1, background: '#D8D2C4', marginTop: 16 }} />
    </div>
  );
}

function MobileBookScreen({ dates, daysMap, displayName }) {
  const { fmtDate, fmt12 } = window.HS;
  return (
    <div style={mobileBg}>
      <MobileHeader eyebrow="Book a lesson" title="Available" />
      {/* banner */}
      <div style={{ margin: '12px 16px 20px', padding:'14px 16px', background:'#EFEAE0', border:'1px solid #E5E0D2', borderLeft:'3px solid #B56A5A', borderRadius: 16 }}>
        <div style={{ fontSize: 9, letterSpacing:'0.16em', textTransform:'uppercase', color:'#9B2D1F', marginBottom: 4, fontWeight: 500 }}>From Chi Ho</div>
        <div style={{ fontSize: 12.5, lineHeight: 1.5, color:'#1C1B18' }}>
          Two lessons this week — Xiaoya, Xinyu, Seohyeong. Due to very limited time, not everyone can get two.
        </div>
      </div>

      <div style={{ padding: '0 16px 24px' }}>
        {dates.map(date => {
          const daySlots = daysMap[date];
          return (
            <div key={date} style={{ marginBottom: 22 }}>
              <h2 className="font-serif nowrap" style={{ fontSize: 16, fontWeight: 400, fontStyle:'italic', margin: '0 0 8px', color: '#1C1B18' }}>
                {fmtDate(date)}
              </h2>
              <div style={{ border:'1px solid #E5E0D2', borderRadius: 18, background:'#F8F5EF', overflow:'hidden', boxShadow:'0 1px 2px rgba(42,36,29,0.04)' }}>
                {daySlots.map((s, i) => {
                  const mine = s.booked_by === 's1';
                  const taken = s.booked_by && !mine;
                  return (
                    <div key={s.id} style={{
                      display:'flex', alignItems:'center', gap: 12,
                      padding:'12px 12px', borderTop: i>0 ? '0.5px solid #E5E0D2' : 'none',
                      background: mine ? '#DDE4DD' : 'transparent', minHeight: 48,
                    }}>
                      <div style={{ fontFamily:'JetBrains Mono, monospace', fontSize: 12.5, width: 52, color:'#1C1B18' }}>{fmt12(s.slot_time)}</div>
                      <div style={{ flex:1, minWidth: 0 }}>
                        {mine && <span style={{ fontSize: 9, letterSpacing:'0.08em', textTransform:'uppercase', color:'#4A6B54', fontWeight: 500 }}>Your lesson</span>}
                        {taken && <span style={{ fontSize: 12, color:'#78756C' }}>Booked — {displayName(s.booked_by).split(' ')[0]}</span>}
                        {!s.booked_by && <span className="font-serif" style={{ fontSize: 12.5, fontStyle:'italic', color:'#3B3A35' }}>Available</span>}
                      </div>
                      {!s.booked_by && (
                        <div style={{ fontSize: 11, padding:'6px 14px', background:'#1C1B18', color:'#F8F5EF', borderRadius: 12, fontWeight: 500 }}>Reserve</div>
                      )}
                      {mine && (
                        <div style={{ fontSize: 11, padding:'6px 12px', border:'0.5px solid #9B2D1F', color:'#9B2D1F', borderRadius: 12 }}>Cancel</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MobileScheduleScreen({ dates, daysMap, displayName }) {
  const { fmtDate, fmt12 } = window.HS;
  return (
    <div style={mobileBg}>
      <MobileHeader eyebrow="Studio · Chi Ho" title="Schedule" />
      {/* Stats */}
      <div style={{ display:'flex', gap: 28, padding:'4px 20px 20px', borderBottom:'0.5px solid #D8D2C4' }}>
        <MiniStat label="Booked" value="11" />
        <MiniStat label="Open" value="5" muted />
        <MiniStat label="Students" value="9" />
      </div>

      <div style={{ padding: '20px 16px 24px' }}>
        {dates.map(date => {
          const daySlots = daysMap[date];
          return (
            <div key={date} style={{ marginBottom: 22 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 8 }}>
                <h2 className="font-serif nowrap" style={{ fontSize: 16, fontWeight: 400, fontStyle:'italic', margin: 0, color: '#1C1B18' }}>
                  {fmtDate(date)}
                </h2>
                <span style={{ fontSize: 10, color:'#78756C' }}>{daySlots.filter(s=>s.booked_by).length}/{daySlots.length} booked</span>
              </div>
              <div style={{ border:'1px solid #E5E0D2', borderRadius: 18, background:'#F8F5EF', overflow:'hidden', boxShadow:'0 1px 2px rgba(42,36,29,0.04)' }}>
                {daySlots.map((s, i) => (
                  <div key={s.id} style={{
                    display:'flex', alignItems:'center', gap: 12,
                    padding:'12px 12px', borderTop: i>0 ? '0.5px solid #E5E0D2' : 'none', minHeight: 44,
                  }}>
                    <div style={{ fontFamily:'JetBrains Mono, monospace', fontSize: 12.5, width: 52, color: s.booked_by ? '#1C1B18' : '#78756C' }}>{fmt12(s.slot_time)}</div>
                    <div style={{ flex:1 }}>
                      {s.booked_by
                        ? <div style={{ fontSize: 13 }}>{displayName(s.booked_by)}</div>
                        : <span className="font-serif" style={{ fontSize: 12.5, fontStyle:'italic', color:'#78756C' }}>Available</span>}
                    </div>
                    <div style={{ fontSize: 10, color: '#B2AEA4' }}>›</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MiniStat({ label, value, muted }) {
  return (
    <div>
      <div style={{ fontSize: 9, letterSpacing:'0.14em', textTransform:'uppercase', color:'#78756C', marginBottom: 4 }}>{label}</div>
      <div className="font-serif" style={{ fontSize: 30, fontWeight: 400, color: muted ? '#B2AEA4' : '#1C1B18', lineHeight: 1 }}>{value}</div>
    </div>
  );
}

function MobileStudioClassScreen({ sc, displayName }) {
  const { fmtDate, fmt12 } = window.HS;
  const next = sc.find(s => s.session_date >= '2026-04-19' && !s.cancelled);
  return (
    <div style={mobileBg}>
      <MobileHeader eyebrow="Studio class" title="This week" />
      {next && (
        <div style={{ padding: '12px 16px 24px' }}>
          <div style={{ border:'1px solid #E5E0D2', background:'#F8F5EF', borderRadius: 18, overflow:'hidden', boxShadow:'0 1px 2px rgba(42,36,29,0.04)' }}>
            <div style={{ padding:'14px 14px 10px', borderBottom:'0.5px solid #E5E0D2' }}>
              <div className="font-serif nowrap" style={{ fontSize: 17, fontStyle:'italic', fontWeight: 400, color:'#1C1B18' }}>{fmtDate(next.session_date)}</div>
              <div style={{ fontFamily:'JetBrains Mono, monospace', fontSize: 11.5, color:'#78756C', marginTop: 2 }}>{fmt12(next.session_time)} · {next.location}</div>
            </div>
            {next.pieces.map((p, i) => (
              <div key={p.id} style={{ padding:'10px 14px', borderTop: i>0 ? '0.5px solid #E5E0D2' : 'none', display:'flex', gap: 10, alignItems:'baseline' }}>
                <div style={{ fontSize: 10.5, color:'#78756C', width: 64, flexShrink: 0 }}>{displayName(p.student_id).split(' ')[0]}</div>
                <div className="font-serif" style={{ flex:1, fontSize: 12.5, fontStyle:'italic', color:'#1C1B18', lineHeight: 1.5 }}>{p.piece}</div>
              </div>
            ))}
            <div style={{ padding: 14, borderTop:'0.5px solid #E5E0D2' }}>
              <div style={{
                padding:'10px 14px', background:'#1C1B18', color:'#F8F5EF', borderRadius: 12,
                fontSize: 12, fontWeight: 500, textAlign:'center', letterSpacing: 0.2,
              }}>Sign up to perform</div>
            </div>
          </div>

          <div style={{ fontSize: 10, letterSpacing:'0.22em', textTransform:'uppercase', color:'#78756C', margin: '28px 0 10px' }}>Last week</div>
          {sc.filter(s => s.session_date < '2026-04-19').slice(0, 1).map(past => (
            <div key={past.id} style={{ border:'1px solid #E5E0D2', background:'#F8F5EF', borderRadius: 16, padding:'14px 16px', opacity: 0.7 }}>
              <div className="font-serif nowrap" style={{ fontSize: 15, fontStyle:'italic', color:'#3B3A35' }}>{fmtDate(past.session_date)}</div>
              <div style={{ fontSize: 11, color:'#78756C', marginTop: 4 }}>{past.pieces.length} performed</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MobileTabBar({ active }) {
  const items = [
    { id: 'book', label: 'Book' },
    { id: 'sched', label: 'Schedule' },
    { id: 'studio', label: 'Studio' },
    { id: 'me', label: 'Me' },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      height: 82, background: 'rgba(248,245,239,0.86)',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      borderTop: '0.5px solid #D8D2C4',
      display: 'flex', alignItems: 'flex-start', paddingTop: 10,
      zIndex: 40,
    }}>
      {items.map(it => {
        const on = it.id === active;
        return (
          <div key={it.id} style={{
            flex: 1, display:'flex', flexDirection:'column', alignItems:'center', gap: 4,
            color: on ? '#1C1B18' : '#B2AEA4',
          }}>
            <div style={{
              width: 22, height: 22, border: '1.5px solid currentColor',
              borderRadius: 6, marginBottom: 2,
              background: on ? '#1C1B18' : 'transparent',
            }} />
            <div style={{ fontSize: 10, fontWeight: on ? 600 : 400, letterSpacing: 0.2 }}>{it.label}</div>
          </div>
        );
      })}
    </div>
  );
}

Object.assign(window, { MobilePage });
