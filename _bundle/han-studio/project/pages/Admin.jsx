// Admin pages — Schedule, OpenSlots, Students, StudentDetail

function AdminSchedulePage() {
  const app = useApp();
  const { slots, studentsList, settings, displayName } = app;
  const { fmtDate, fmt12, groupSlotsByDate, todayISO } = window.HS;
  const today = todayISO();

  const upcoming = slots.filter(s => s.slot_date >= today);
  const groups = groupSlotsByDate(upcoming);
  const dates = Object.keys(groups).sort();

  const active = studentsList.filter(s => !s.archived);
  const totalBooked = upcoming.filter(s => s.booked_by).length;
  const totalOpen = upcoming.filter(s => !s.booked_by).length;
  const uniqueStudents = new Set(upcoming.filter(s => s.booked_by).map(s => s.booked_by)).size;

  const [announceDraft, setAnnounceDraft] = React.useState(settings.announcement || '');
  const saveAnnouncement = () => {
    app.updateSetting('announcement', announceDraft);
    app.showToast ? null : null;
  };

  return (
    <>
      <PageHeader eyebrow="This week" title="Studio schedule"
        subtitle="All upcoming lessons across the studio. Click a slot to edit or delete it."
        actions={<Button round size="sm" onClick={() => app.nav('/open-slots')} title="Publish slots"><Icon.plus size={14}/></Button>} />

      <div style={{ display:'flex', gap: 48, paddingBottom: 28, marginBottom: 32, borderBottom: '0.5px solid var(--rule)', flexWrap:'wrap' }}>
        <Stat label="Active students" value={active.length} />
        <Stat label="Booked" value={totalBooked} />
        <Stat label="Open" value={totalOpen} muted />
        <Stat label="Students this week" value={uniqueStudents} />
      </div>

      {/* Announcement editor */}
      <section style={{ marginBottom: 40 }}>
        <div style={{display:'flex', alignItems:'baseline', gap:12, marginBottom:12}}>
          <Eyebrow mb={0}>Studio banner</Eyebrow>
          <span style={{fontSize:11, color:'var(--ink-mute)'}}>shown to students on Book a lesson</span>
        </div>
        <textarea value={announceDraft} onChange={e=>setAnnounceDraft(e.target.value)} rows={3}
          placeholder="e.g. No lessons next Mon — conference travel."
          style={{
            width:'100%', padding:12, fontSize:13.5, lineHeight:1.55,
            border:'1px solid var(--rule)', borderRadius: 12, background:'var(--paper)',
            fontFamily:'inherit', resize:'vertical',
          }} />
        <div style={{marginTop:8, display:'flex', justifyContent:'flex-end'}}>
          <Button round size="sm" variant="secondary" onClick={saveAnnouncement} title="Save banner"><Icon.check size={13}/></Button>
        </div>
      </section>

      {dates.length === 0 ? (
        <Muted>No upcoming slots. Publish some from the Open slots page.</Muted>
      ) : dates.map(date => {
        const daySlots = groups[date];
        const booked = daySlots.filter(s => s.booked_by).length;
        const restriction = daySlots[0].restricted_to;
        return (
          <section key={date} style={{marginBottom: 36}}>
            <div style={{display:'flex', alignItems:'baseline', gap:14, marginBottom: 14, flexWrap:'wrap'}}>
              <h2 className="font-serif nowrap" style={{ fontSize: 22, fontStyle:'italic', fontWeight:400, margin:0 }}>
                {fmtDate(date)}
              </h2>
              <span style={{fontSize:11, color:'var(--ink-mute)'}}>
                {booked}/{daySlots.length} booked
                {restriction?.length ? (
                  <> · limited to{' '}
                    {restriction.map((id, i) => (
                      <React.Fragment key={id}>
                        {i > 0 && ', '}
                        <span style={{ color: 'var(--ink-soft)' }}>{displayName(id)}</span>
                      </React.Fragment>
                    ))}
                  </>
                ) : ''}
              </span>
              <div style={{marginLeft:'auto'}}>
                <button onClick={()=>{ if(confirm('Delete all slots on '+fmtDate(date)+'?')) app.deleteDay(date); }}
                  style={textBtn}>Delete day</button>
              </div>
            </div>
            <div style={{ border: '1px solid var(--rule-soft)', borderRadius: 20, overflow: 'hidden', boxShadow: 'var(--shadow-xs)' }}>
              {daySlots.map((s, i) => (
                <AdminSlotRow key={s.id} slot={s} idx={i} displayName={displayName}
                  onCancelBooking={() => app.cancelSlot(s.id)}
                  onDelete={() => app.deleteSlot(s.id)} />
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}

function AdminSlotRow({ slot, idx, displayName, onCancelBooking, onDelete }) {
  const app = useApp();
  const { fmt12 } = window.HS;
  const taken = !!slot.booked_by;
  const [editing, setEditing] = React.useState(false);
  const [timeDraft, setTimeDraft] = React.useState(slot.slot_time.slice(0, 5));
  const [assignDraft, setAssignDraft] = React.useState(slot.booked_by || '');

  React.useEffect(() => {
    setTimeDraft(slot.slot_time.slice(0, 5));
    setAssignDraft(slot.booked_by || '');
  }, [slot.id, editing]);

  const active = app.studentsList.filter(s => !s.archived);

  const save = () => {
    const patch = {};
    if (timeDraft + ':00' !== slot.slot_time) patch.slot_time = timeDraft + ':00';
    if ((assignDraft || null) !== (slot.booked_by || null)) patch.booked_by = assignDraft || null;
    if (Object.keys(patch).length > 0) app.updateSlot(slot.id, patch);
    setEditing(false);
  };

  if (editing) {
    return (
      <div style={{
        background: 'var(--paper-soft)', padding: '12px 18px',
        display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
        borderTop: idx > 0 ? '0.5px solid var(--rule-soft)' : 'none',
      }}>
        <input type="time" value={timeDraft} onChange={e => setTimeDraft(e.target.value)}
          style={{ ...miniInput, width: 110, fontSize: 12.5, padding: '6px 8px' }} />
        <select value={assignDraft} onChange={e => setAssignDraft(e.target.value)}
          style={{ ...miniInput, flex: '1 1 180px', fontSize: 12.5, padding: '6px 8px' }}>
          <option value="">— Unassigned (open) —</option>
          {active.map(s => <option key={s.id} value={s.id}>{s.full_name}</option>)}
        </select>
        <div style={{ display: 'flex', gap: 6, marginLeft: 'auto' }}>
          <Button size="sm" onClick={save}>Save</Button>
          <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'var(--paper)', padding:'14px 18px',
      display:'flex', alignItems:'center', gap: 18,
      borderTop: idx>0 ? '0.5px solid var(--rule-soft)' : 'none',
    }}>
      <div className="font-mono" style={{ fontSize: 13, fontWeight:500, width: 68, flexShrink:0 }}>{fmt12(slot.slot_time)}</div>
      <div style={{flex:1, minWidth:0}}>
        {taken ? (
          <div style={{fontSize:13.5}}>{displayName(slot.booked_by)}</div>
        ) : (
          <span className="font-serif" style={{fontSize:13, fontStyle:'italic', color:'var(--ink-soft)'}}>Available</span>
        )}
      </div>
      <div style={{display:'flex', gap:6, flexShrink:0, alignItems:'center'}}>
        <Button round size="sm" variant="secondary" onClick={() => setEditing(true)} title="Edit time or assignee">
          <Icon.pencil size={13} />
        </Button>
        {taken && (
          <Button round size="sm" variant="ghost" onClick={onCancelBooking} title="Unbook — free this slot">
            <Icon.undo size={13} />
          </Button>
        )}
        <Button round size="sm" variant="danger" onClick={onDelete} title="Delete slot">
          <Icon.trash size={13} />
        </Button>
      </div>
    </div>
  );
}

// ============================================================================
// Open Slots — publish form
// ============================================================================
function OpenSlotsPage() {
  const app = useApp();
  const { studentsList } = app;
  const active = studentsList.filter(s => !s.archived);
  const { fmt12 } = window.HS;

  const [date, setDate] = React.useState('2026-04-27');
  const [times, setTimes] = React.useState(['13:20','14:20','15:20','16:20']);
  const [newTime, setNewTime] = React.useState('17:20');
  const [restricted, setRestricted] = React.useState(false);
  const [selected, setSelected] = React.useState([]);

  const addTime = () => {
    if (!newTime) return;
    if (times.includes(newTime)) return;
    setTimes(t => [...t, newTime].sort());
  };
  const removeTime = (t) => setTimes(ts => ts.filter(x => x !== t));
  const toggleStudent = (id) => setSelected(sel => sel.includes(id) ? sel.filter(x => x !== id) : [...sel, id]);

  const publish = () => {
    const rows = times.map((t, i) => ({
      id: 'n'+Date.now()+'_'+i,
      slot_date: date,
      slot_time: t + ':00',
      booked_by: null,
      restricted_to: restricted && selected.length > 0 ? [...selected] : null,
    }));
    app.publishSlots(rows);
    // reset times
    setTimes([]);
  };

  return (
    <>
      <PageHeader eyebrow="Publish availability" title="Open slots"
        subtitle="Post a day's lesson times. Slots become instantly visible to students (or just the subset you pick)." />

      <div style={{display:'grid', gridTemplateColumns:'minmax(0,1fr) minmax(0,1fr)', gap: 48}} className="grid-2col">
        <div>
          <Eyebrow>1 · Date</Eyebrow>
          <input type="date" value={date} onChange={e=>setDate(e.target.value)}
            style={{ ...miniInput, width:'100%', fontSize:15, padding:'10px 12px' }} />

          <div style={{height: 32}} />

          <Eyebrow>2 · Times</Eyebrow>
          <div style={{display:'flex', flexWrap:'wrap', gap:8, marginBottom: 14, minHeight: 36}}>
            {times.length === 0 && <span className="font-serif" style={{fontSize:13, fontStyle:'italic', color:'var(--ink-mute)'}}>No times yet.</span>}
            {times.map(t => (
              <div key={t} style={{
                display:'inline-flex', alignItems:'center', gap:8, padding:'6px 10px',
                border:'0.5px solid var(--rule)', background:'var(--paper-soft)',
                fontSize:12.5, borderRadius: 999, fontFamily:"'JetBrains Mono',monospace",
              }}>
                {fmt12(t + ':00')}
                <button onClick={()=>removeTime(t)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--ink-mute)', padding:0 }}>
                  <Icon.x size={11} />
                </button>
              </div>
            ))}
          </div>
          <div style={{display:'flex', gap:8}}>
            <input type="time" value={newTime} onChange={e=>setNewTime(e.target.value)}
              style={{ ...miniInput, flex:1 }} />
            <Button size="sm" variant="secondary" onClick={addTime}>+ Add time</Button>
          </div>
          <div style={{fontSize: 11, color: 'var(--ink-mute)', marginTop:8}}>
            Each slot is one hour.
          </div>
        </div>

        <div>
          <Eyebrow>3 · Who can see these slots</Eyebrow>
          <div style={{display:'flex', gap:10, marginBottom: 16}}>
            <label style={radioLabel}>
              <input type="radio" name="aud" checked={!restricted} onChange={()=>setRestricted(false)} />
              <span>All students</span>
            </label>
            <label style={radioLabel}>
              <input type="radio" name="aud" checked={restricted} onChange={()=>setRestricted(true)} />
              <span>Only certain students</span>
            </label>
          </div>

          {restricted && (
            <div style={{ border: '0.5px solid var(--rule)', borderRadius: 12, maxHeight: 280, overflowY: 'auto' }}>
              {active.map(s => (
                <label key={s.id} style={{
                  display:'flex', alignItems:'center', gap:10, padding:'8px 12px',
                  borderBottom:'0.5px solid var(--rule-soft)', fontSize: 13, cursor: 'pointer',
                  background: selected.includes(s.id) ? 'var(--paper-soft)' : 'transparent',
                }}>
                  <input type="checkbox" checked={selected.includes(s.id)} onChange={()=>toggleStudent(s.id)} />
                  <span>{s.full_name}</span>
                </label>
              ))}
            </div>
          )}

          <div style={{height: 28}} />
          <div style={{
            padding:'14px 16px', background:'var(--paper-soft)',
            border: '0.5px solid var(--rule)', borderRadius: 12,
            fontSize: 12.5, color:'var(--ink-soft)', marginBottom: 16,
          }}>
            Publishing <strong>{times.length}</strong> slot{times.length!==1?'s':''}
            {restricted && selected.length > 0 && <> for <strong>{selected.length}</strong> student{selected.length!==1?'s':''}</>}.
          </div>
          <Button round onClick={publish} disabled={times.length===0 || (restricted && selected.length===0)} title="Publish slots">
            <Icon.check size={14}/>
          </Button>
        </div>
      </div>
    </>
  );
}

// ============================================================================
// Students roster
// ============================================================================
function StudentsPage() {
  const app = useApp();
  const { studentsList, invited, slots } = app;
  const { todayISO } = window.HS;
  const today = todayISO();
  const [query, setQuery] = React.useState('');
  const [showArchived, setShowArchived] = React.useState(false);

  const filtered = studentsList.filter(s => showArchived ? s.archived : !s.archived)
    .filter(s => !query || s.full_name.toLowerCase().includes(query.toLowerCase()));

  const [invEmail, setInvEmail] = React.useState('');
  const [invName, setInvName] = React.useState('');

  const countsById = React.useMemo(() => {
    const m = {};
    slots.forEach(s => {
      if (!s.booked_by) return;
      m[s.booked_by] = m[s.booked_by] || { total: 0, upcoming: 0 };
      m[s.booked_by].total++;
      if (s.slot_date >= today) m[s.booked_by].upcoming++;
    });
    return m;
  }, [slots, today]);

  return (
    <>
      <PageHeader eyebrow="Roster" title="Students"
        subtitle="Everyone in your studio. Invite new students by email — they'll get a magic-link invite when they sign up." />

      {/* Invite */}
      <section style={{ marginBottom: 40, padding: 20, background: 'var(--paper-soft)', border: '0.5px solid var(--rule)', borderRadius: 12 }}>
        <Eyebrow>Invite a new student</Eyebrow>
        <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
          <input placeholder="email@iu.edu" value={invEmail} onChange={e=>setInvEmail(e.target.value)}
            style={{ ...miniInput, flex: '1 1 180px' }} />
          <input placeholder="Full name (optional)" value={invName} onChange={e=>setInvName(e.target.value)}
            style={{ ...miniInput, flex: '1 1 180px' }} />
          <Button round size="sm" onClick={() => { if(invEmail) { app.addInvite(invEmail, invName); setInvEmail(''); setInvName(''); } }} title="Send invite"><Icon.mail size={13}/></Button>
        </div>
        {invited.length > 0 && (
          <div style={{marginTop: 14}}>
            <div style={{fontSize: 11, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--ink-mute)', marginBottom: 8}}>
              Pending invites
            </div>
            {invited.map(inv => (
              <div key={inv.email} style={{
                display:'flex', alignItems:'center', gap:10, padding:'8px 0',
                borderTop: '0.5px solid var(--rule-soft)', fontSize: 12.5,
              }}>
                <Icon.mail size={12} />
                <span>{inv.full_name || <em className="font-serif" style={{color:'var(--ink-mute)'}}>No name</em>}</span>
                <span style={{color:'var(--ink-mute)'}}>· {inv.email}</span>
                <span style={{marginLeft:'auto'}}>
                  <button onClick={() => app.removeInvite(inv.email)} style={textBtn}>Remove</button>
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Search / archived toggle */}
      <div style={{display:'flex', gap:12, alignItems:'center', marginBottom: 16, flexWrap:'wrap'}}>
        <div style={{position:'relative', flex:'1 1 240px'}}>
          <div style={{position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'var(--ink-mute)'}}>
            <Icon.search size={13} />
          </div>
          <input placeholder="Search students" value={query} onChange={e=>setQuery(e.target.value)}
            style={{ ...miniInput, width:'100%', paddingLeft: 32 }} />
        </div>
        <label style={{display:'inline-flex', alignItems:'center', gap:6, fontSize: 12}}>
          <input type="checkbox" checked={showArchived} onChange={e=>setShowArchived(e.target.checked)} />
          Show archived
        </label>
      </div>

      <div style={{ border: '1px solid var(--rule-soft)', borderRadius: 20, overflow: 'hidden', boxShadow: 'var(--shadow-xs)' }}>
        {filtered.length === 0 ? (
          <div style={{padding: 24}}><Muted>No students match.</Muted></div>
        ) : filtered.map((s, i) => {
          const c = countsById[s.id] || { total: 0, upcoming: 0 };
          return (
            <div key={s.id} onClick={() => app.nav('/students/'+s.id)}
              style={{
                padding: '14px 18px', display:'flex', alignItems:'center', gap: 16,
                borderTop: i>0 ? '0.5px solid var(--rule-soft)' : 'none', cursor:'pointer',
                background: 'var(--paper)',
              }}
              onMouseEnter={e=>e.currentTarget.style.background='var(--paper-soft)'}
              onMouseLeave={e=>e.currentTarget.style.background='var(--paper)'}>
              <div style={{
                width: 36, height: 36, borderRadius:'50%',
                background: 'var(--paper-soft)', border: '0.5px solid var(--rule)',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize: 12.5, fontWeight: 500, color: 'var(--ink-soft)', flexShrink:0,
              }}>{s.full_name.split(' ').map(n=>n[0]).slice(0,2).join('')}</div>
              <div style={{flex:1, minWidth:0}}>
                <div style={{fontSize: 14, marginBottom: 2}}>{s.full_name}</div>
                <div style={{fontSize: 11, color:'var(--ink-mute)'}}>{s.email}</div>
              </div>
              <div className="font-mono" style={{fontSize: 12, color:'var(--ink-mute)', textAlign:'right', flexShrink:0}}>
                {c.total} total · {c.upcoming} upcoming
              </div>
              <Icon.chev size={13} />
            </div>
          );
        })}
      </div>
    </>
  );
}

// ============================================================================
// Student detail
// ============================================================================
function StudentDetailPage({ id }) {
  const app = useApp();
  const { studentsList, slots, studioClass, settings } = app;
  const { fmtDate, fmt12, todayISO } = window.HS;
  const today = todayISO();
  const student = studentsList.find(s => s.id === id);

  if (!student) {
    return <>
      <button onClick={()=>app.nav('/students')} style={textBtn}><Icon.arrowL size={12}/> Back</button>
      <p style={{marginTop:20}}>Student not found.</p>
    </>;
  }
  const mySlots = slots.filter(s => s.booked_by === id);
  const upcoming = mySlots.filter(s => s.slot_date >= today).sort((a,b) => (a.slot_date+a.slot_time).localeCompare(b.slot_date+b.slot_time));
  const past = mySlots.filter(s => s.slot_date < today).sort((a,b) => (b.slot_date+b.slot_time).localeCompare(a.slot_date+a.slot_time));
  const total = mySlots.length;
  const perSem = parseInt(settings.lessons_per_semester || '14', 10);
  const progressPct = Math.min(100, Math.round((total / perSem) * 100));

  const myPieces = studioClass.flatMap(sc => sc.pieces.filter(p => p.student_id === id).map(p => ({ ...p, date: sc.session_date })))
    .sort((a,b) => b.date.localeCompare(a.date));

  return (
    <>
      <button onClick={()=>app.nav('/students')} style={{...textBtn, marginBottom: 24, fontSize: 12}}>
        <Icon.arrowL size={12}/> All students
      </button>
      <PageHeader eyebrow={student.archived ? 'Archived' : 'Student'} title={student.full_name}
        subtitle={student.email}
        actions={<>
          {student.archived
            ? <Button size="sm" variant="secondary" onClick={()=>app.archiveStudent(id, false)}><Icon.rotate size={12}/> Restore</Button>
            : <Button size="sm" variant="ghost" onClick={()=>{ if(confirm('Archive '+student.full_name+'? They will no longer appear in rosters.')) app.archiveStudent(id, true); }}>
                <Icon.archive size={12}/> Archive
              </Button>
          }
        </>} />

      <div style={{display:'flex', gap:48, paddingBottom:28, marginBottom: 32, borderBottom:'0.5px solid var(--rule)', flexWrap:'wrap'}}>
        <Stat label="Lessons total" value={total} />
        <Stat label="Upcoming" value={upcoming.length} />
        <Stat label="Completed" value={past.length} />
        <div>
          <Eyebrow>Semester progress</Eyebrow>
          <div style={{display:'flex', alignItems:'center', gap: 10, marginTop: 4}}>
            <div style={{ width: 160, height: 8, background:'var(--rule)', position:'relative', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ position:'absolute', left:0, top:0, bottom:0, width: progressPct+'%', background:'var(--accent)', borderRadius: 12 }} />
            </div>
            <span className="font-mono" style={{fontSize: 11.5, color:'var(--ink-soft)'}}>{total} / {perSem}</span>
          </div>
        </div>
      </div>

      <section style={{marginBottom: 40}}>
        <SectionH>Upcoming</SectionH>
        {upcoming.length === 0 ? <Muted>No upcoming lessons.</Muted> : upcoming.map(s => (
          <div key={s.id} style={lessonRowStyle}>
            <div className="font-mono" style={{fontSize: 13, width: 72}}>{fmt12(s.slot_time)}</div>
            <div style={{flex:1}}>{fmtDate(s.slot_date)}</div>
            <Pill color="green">Confirmed</Pill>
          </div>
        ))}
      </section>

      <section style={{marginBottom: 40}}>
        <SectionH>Lesson history</SectionH>
        {past.length === 0 ? <Muted>No past lessons yet.</Muted> : past.map(s => (
          <div key={s.id} style={{...lessonRowStyle, color:'var(--ink-soft)', fontSize: 13}}>
            <div className="font-mono" style={{fontSize: 12.5, width:72, color:'var(--ink-mute)'}}>{fmt12(s.slot_time)}</div>
            <div style={{flex:1}}>{fmtDate(s.slot_date)}</div>
            <span style={{fontSize: 11, color:'var(--ink-faint)'}}>Completed</span>
          </div>
        ))}
      </section>

      <section>
        <SectionH>Pieces performed</SectionH>
        {myPieces.length === 0 ? <Muted>None yet.</Muted> : (
          <div style={{border:'0.5px solid var(--rule)', borderRadius: 12}}>
            {myPieces.map((p, i) => (
              <div key={p.id} style={{
                padding:'12px 16px', display:'flex', gap:14, alignItems:'baseline',
                borderTop: i>0?'0.5px solid var(--rule-soft)':'none', fontSize: 13.5,
              }}>
                <div style={{fontSize: 11, color:'var(--ink-mute)', width: 100}} className="font-mono">{p.date}</div>
                <div className="font-serif" style={{flex:1, fontStyle:'italic'}}>{p.piece}</div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

const lessonRowStyle = {
  display:'flex', alignItems:'center', padding:'13px 0',
  borderBottom:'0.5px solid var(--rule-soft)', gap: 18, fontSize: 14,
};
const textBtn = {
  background:'transparent', border:'none', cursor:'pointer',
  color:'var(--ink-mute)', fontSize: 11.5, padding:'4px 8px',
  display:'inline-flex', alignItems:'center', gap:5,
};
const radioLabel = {
  display:'inline-flex', alignItems:'center', gap:6, fontSize: 13, cursor:'pointer',
  padding:'6px 10px', border:'0.5px solid var(--rule)', borderRadius: 999,
};

Object.assign(window, { AdminSchedulePage, OpenSlotsPage, StudentsPage, StudentDetailPage });
