// Student pages: Book, MyLessons, Policy (announcements)

function BookPage() {
  const app = useApp();
  const { slots, myId, displayName, settings, incoming, outgoing, tweaks } = app;
  const { fmtDate, fmtTime, fmt12, groupSlotsByDate, todayISO, hoursUntilSlot } = window.HS;

  const today = todayISO();
  const visibleSlots = slots.filter(s =>
    s.slot_date >= today &&
    (!s.restricted_to || s.restricted_to.length === 0 || s.restricted_to.includes(myId))
  );
  const groups = groupSlotsByDate(visibleSlots);
  const dates = Object.keys(groups).sort();
  const myCountThisView = visibleSlots.filter(s => s.booked_by === myId).length;
  const lessonsPerSemester = parseInt(settings.lessons_per_semester || '14', 10);
  const myIncoming = incoming.filter(r => r.target_id === myId);
  const myOutgoing = outgoing.filter(r => r.requester_id === myId);

  const slotById = (id) => slots.find(s => s.id === id);
  const mySwappableSlots = slots.filter(s => s.booked_by === myId && hoursUntilSlot(s.slot_date, s.slot_time) >= 24);

  const [swapFor, setSwapFor] = React.useState(null);
  const [swapMyId, setSwapMyId] = React.useState('');
  const [swapMsg, setSwapMsg] = React.useState('');

  const openSwap = (theirSlot) => {
    setSwapFor(theirSlot);
    setSwapMyId(mySwappableSlots[0]?.id || '');
    setSwapMsg('');
  };
  const submitSwap = () => {
    app.createSwap({
      requesterSlotId: swapMyId,
      targetId: swapFor.booked_by,
      targetSlotId: swapFor.id,
      message: swapMsg,
    });
    setSwapFor(null);
  };

  const announcement = settings.announcement;

  return (
    <>
      <PageHeader eyebrow="Book a lesson" title="Available slots"
        subtitle="Each slot is one hour. Click an open time to reserve it. Cancellations close 24 hours before the lesson." />

      {announcement && (
        <div style={{
          padding: '20px 24px', background: 'var(--paper-soft)',
          border: '1px solid var(--rule-soft)', borderLeft: '3px solid var(--accent)',
          marginBottom: 32, borderRadius: 18,
        }}>
          <Eyebrow color="accent">From Chi Ho</Eyebrow>
          <div style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--ink)', whiteSpace: 'pre-wrap' }}>
            {announcement}
          </div>
        </div>
      )}

      {(myIncoming.length > 0 || myOutgoing.length > 0) && (
        <section style={{ marginBottom: 32 }}>
          {myIncoming.length > 0 && (
            <div style={{ marginBottom: myOutgoing.length > 0 ? 18 : 0 }}>
              <Eyebrow color="accent">Swap requests for you ({myIncoming.length})</Eyebrow>
              {myIncoming.map(req => {
                const theirSlot = slotById(req.requester_slot_id);
                const mySlot = slotById(req.target_slot_id);
                return (
                  <div key={req.id} style={swapCard}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, marginBottom: 4 }}>
                        <strong>{displayName(req.requester_id)}</strong> wants to swap.
                      </div>
                      <div style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>
                        You take <em className="font-serif">{theirSlot ? `${fmtDate(theirSlot.slot_date)} at ${fmt12(theirSlot.slot_time)}` : '—'}</em>
                        {' '}· {displayName(req.requester_id)} takes{' '}
                        <em className="font-serif">{mySlot ? `${fmtDate(mySlot.slot_date)} at ${fmt12(mySlot.slot_time)}` : '—'}</em>
                      </div>
                      {req.message && (
                        <div className="font-serif" style={{ fontSize: 12.5, fontStyle: 'italic', color: 'var(--ink-mute)', marginTop: 6 }}>
                          “{req.message}”
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Button round size="sm" onClick={() => app.acceptSwap(req.id)} title="Accept swap">
                        <Icon.check size={13} />
                      </Button>
                      <Button round size="sm" variant="ghost" onClick={() => app.declineSwap(req.id)} title="Decline swap">
                        <Icon.x size={13} />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {myOutgoing.length > 0 && (
            <div>
              <Eyebrow>Pending swaps you've sent ({myOutgoing.length})</Eyebrow>
              {myOutgoing.map(req => {
                const mySlot = slotById(req.requester_slot_id);
                const theirSlot = slotById(req.target_slot_id);
                return (
                  <div key={req.id} style={swapCard}>
                    <div style={{ flex: 1, minWidth: 0, fontSize: 12.5, color: 'var(--ink-soft)' }}>
                      Offering{' '}
                      <em className="font-serif">{mySlot ? `${fmtDate(mySlot.slot_date)} at ${fmt12(mySlot.slot_time)}` : '—'}</em>
                      {' '}to <strong>{displayName(req.target_id)}</strong> for{' '}
                      <em className="font-serif">{theirSlot ? `${fmtDate(theirSlot.slot_date)} at ${fmt12(theirSlot.slot_time)}` : '—'}</em>
                      <span style={{ marginLeft: 8, color: 'var(--ink-mute)' }}>· awaiting reply</span>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => app.cancelSwap(req.id)}>Withdraw</Button>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {swapFor && (
        <SwapModal swapFor={swapFor} onClose={() => setSwapFor(null)}
          swapMyId={swapMyId} setSwapMyId={setSwapMyId}
          swapMsg={swapMsg} setSwapMsg={setSwapMsg}
          mySwappableSlots={mySwappableSlots}
          onSubmit={submitSwap} displayName={displayName} />
      )}

      {myCountThisView > 0 && (
        <div style={{
          fontSize: 12, color: 'var(--green)', marginBottom: 24,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <Icon.check size={13} w={2} />
          You have {myCountThisView} upcoming lesson{myCountThisView > 1 ? 's' : ''} booked.
          <span style={{ color: 'var(--ink-mute)', marginLeft: 6 }}>
            · reminder: {lessonsPerSemester} lessons per semester
          </span>
        </div>
      )}

      {dates.length === 0 ? (
        <Muted>No slots open right now. Check back soon — Chi Ho usually posts the week's availability a few days in advance.</Muted>
      ) : dates.map(date => {
        const daySlots = groups[date];
        const restriction = daySlots[0].restricted_to;
        const isRestricted = restriction && restriction.length > 0;

        return (
          <section key={date} style={{ marginBottom: 40 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 16, flexWrap: 'wrap' }}>
              <h2 className="font-serif nowrap" style={{ fontSize: 22, fontWeight: 400, margin: 0, fontStyle: 'italic' }}>
                {fmtDate(date)}
              </h2>
              {isRestricted && (
                <span style={{ fontSize: 11, color: 'var(--ink-mute)' }}>
                  · limited to{' '}
                  {restriction.map((id, i) => (
                    <React.Fragment key={id}>
                      {i > 0 && ', '}
                      <span style={{ color: 'var(--ink-soft)' }}>{displayName(id)}</span>
                    </React.Fragment>
                  ))}
                </span>
              )}
            </div>

            <div style={{ border: '1px solid var(--rule-soft)', borderRadius: 20, overflow: 'hidden', boxShadow: 'var(--shadow-xs)' }}>
              {daySlots.map((slot, i) => (
                <SlotRow key={slot.id} slot={slot} idx={i} myId={myId}
                  displayName={displayName}
                  myOutgoing={myOutgoing}
                  mySwappableSlots={mySwappableSlots}
                  onBook={() => app.bookSlot(slot.id)}
                  onCancel={() => app.cancelSlot(slot.id)}
                  onSwap={() => openSwap(slot)} />
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}

function SlotRow({ slot, idx, myId, displayName, myOutgoing, mySwappableSlots, onBook, onCancel, onSwap }) {
  const { fmtTime, fmt12, hoursUntilSlot } = window.HS;
  const isMine = slot.booked_by === myId;
  const isTaken = slot.booked_by && !isMine;
  const isFree = !slot.booked_by;
  const bookerName = isTaken ? displayName(slot.booked_by) : '';
  const hoursOut = hoursUntilSlot(slot.slot_date, slot.slot_time);
  const locked = isMine && hoursOut < 24;

  return (
    <div style={{
      background: isMine ? 'var(--green-soft)' : 'var(--paper)',
      padding: '14px 18px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: 16, borderTop: idx > 0 ? '0.5px solid var(--rule-soft)' : 'none',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, flex: 1, minWidth: 0 }}>
        <div className="font-mono" style={{
          fontSize: 13, fontWeight: 500, width: 68, flexShrink: 0,
          color: isTaken ? 'var(--ink-mute)' : 'var(--ink)',
        }}>{fmt12(slot.slot_time)}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          {isMine && <Pill color="green">Your lesson</Pill>}
          {isTaken && <span style={{ fontSize: 13, color: 'var(--ink-mute)' }}>Booked by {bookerName}</span>}
          {isFree && <span className="font-serif" style={{ fontSize: 13, color: 'var(--ink-soft)', fontStyle: 'italic' }}>Available</span>}
        </div>
      </div>
      <div style={{ flexShrink: 0 }}>
        {isFree && (
          <Button round size="sm" onClick={onBook} title="Reserve this slot">
            <Icon.plus size={14} />
          </Button>
        )}
        {isMine && !locked && (
          <Button round size="sm" variant="danger" onClick={onCancel} title="Cancel lesson">
            <Icon.x size={13} />
          </Button>
        )}
        {isMine && locked && (
          <span style={{ fontSize: 11, color: 'var(--ink-mute)', fontStyle: 'italic' }} className="font-serif">
            Within 24h · locked
          </span>
        )}
        {isTaken && hoursOut >= 24 && mySwappableSlots.length > 0 && (() => {
          const alreadySent = myOutgoing.some(r => r.target_slot_id === slot.id);
          if (alreadySent) return <span style={{ fontSize: 11, color: 'var(--ink-mute)', fontStyle: 'italic' }} className="font-serif">Swap pending</span>;
          return (
            <Button round size="sm" variant="secondary" onClick={onSwap} title="Request a swap">
              <Icon.swap size={13} />
            </Button>
          );
        })()}
        {isTaken && !(hoursOut >= 24 && mySwappableSlots.length > 0) && (
          <span style={{ fontSize: 11, color: 'var(--ink-faint)' }}>—</span>
        )}
      </div>
    </div>
  );
}

function SwapModal({ swapFor, onClose, swapMyId, setSwapMyId, swapMsg, setSwapMsg, mySwappableSlots, onSubmit, displayName }) {
  const { fmtDate, fmt12 } = window.HS;
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(28,27,24,0.32)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 20,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--paper)', border: '1px solid var(--rule)', borderRadius: 24,
        padding: 32, maxWidth: 460, width: '100%', boxShadow: 'var(--shadow-lg)',
      }}>
        <Eyebrow>Request a swap</Eyebrow>
        <h3 className="font-serif" style={{ fontSize: 22, fontStyle: 'italic', fontWeight: 400, margin: '0 0 14px' }}>
          with {displayName(swapFor.booked_by)}
        </h3>
        <p style={{ fontSize: 12.5, color: 'var(--ink-mute)', margin: '0 0 14px' }}>
          They keep your lesson; you keep theirs ({fmtDate(swapFor.slot_date)} at {fmt12(swapFor.slot_time)}).
          Please coordinate with them first — this only records the swap once they accept.
        </p>

        {mySwappableSlots.length === 0 ? (
          <Muted>You have no lessons at least 24 hours out to offer in a swap.</Muted>
        ) : (
          <>
            <label style={swapLabel}>Your lesson to offer</label>
            <select value={swapMyId} onChange={e => setSwapMyId(e.target.value)}
              style={{ ...miniInput, width: '100%', marginBottom: 14 }}>
              {mySwappableSlots.map(s => (
                <option key={s.id} value={s.id}>{fmtDate(s.slot_date)} · {fmt12(s.slot_time)}</option>
              ))}
            </select>
            <label style={swapLabel}>Note (optional)</label>
            <textarea value={swapMsg} onChange={e => setSwapMsg(e.target.value)} rows={3}
              placeholder="e.g. I have a recital that afternoon — thanks for swapping!"
              style={{ ...miniInput, width: '100%', marginBottom: 14, fontFamily: 'inherit' }} />
          </>
        )}

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={onSubmit} disabled={mySwappableSlots.length === 0}>Send request</Button>
        </div>
      </div>
    </div>
  );
}

const swapCard = {
  display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
  border: '0.5px solid var(--rule)', borderLeft: '2px solid var(--accent)',
  background: 'var(--paper-soft)', borderRadius: 12, marginBottom: 10,
};
const swapLabel = {
  display: 'block', fontSize: 10, letterSpacing: '0.14em',
  textTransform: 'uppercase', color: 'var(--ink-mute)', marginBottom: 6,
};
const miniInput = {
  padding: '8px 10px', fontSize: 13,
  border: '1px solid var(--rule)', borderRadius: 12,
  background: 'transparent', color: 'var(--ink)',
};

// ============================================================================
// MyLessons
// ============================================================================
function MyLessonsPage() {
  const app = useApp();
  const { slots, myId, settings } = app;
  const { fmtDate, fmt12, todayISO } = window.HS;

  const mySlots = slots.filter(s => s.booked_by === myId);
  const today = todayISO();
  const upcoming = mySlots.filter(s => s.slot_date >= today)
    .sort((a, b) => (a.slot_date + a.slot_time).localeCompare(b.slot_date + b.slot_time));
  const past = mySlots.filter(s => s.slot_date < today)
    .sort((a, b) => (b.slot_date + b.slot_time).localeCompare(a.slot_date + a.slot_time));
  const total = mySlots.length;
  const lessonsPerSemester = parseInt(settings.lessons_per_semester || '14', 10);

  return (
    <>
      <PageHeader eyebrow="Your record" title="My lessons"
        subtitle={`A running log of your lessons with Prof. Han. The studio runs ${lessonsPerSemester} lessons per semester.`} />

      <div style={{
        display: 'flex', gap: 48, paddingBottom: 32, marginBottom: 32,
        borderBottom: '0.5px solid var(--rule)', flexWrap: 'wrap',
      }}>
        <Stat label="Total lessons" value={total} />
        <Stat label="Upcoming" value={upcoming.length} />
        <Stat label="Completed" value={past.length} />
      </div>

      <section style={{ marginBottom: 40 }}>
        <SectionH>Upcoming</SectionH>
        {upcoming.length === 0 ? (
          <Muted>Nothing booked. Head to Book a lesson to reserve a slot.</Muted>
        ) : upcoming.map(s => (
          <div key={s.id} style={lessonRow}>
            <div className="font-mono" style={{ fontSize: 13, width: 72 }}>{fmt12(s.slot_time)}</div>
            <div style={{ flex: 1 }}>{fmtDate(s.slot_date)}</div>
            <Pill color="green">Confirmed</Pill>
          </div>
        ))}
      </section>

      <section style={{ marginBottom: 40 }}>
        <SectionH>History</SectionH>
        {past.length === 0 ? (
          <Muted>No completed lessons yet.</Muted>
        ) : past.map(s => (
          <div key={s.id} style={{...lessonRow, color: 'var(--ink-soft)', fontSize: 13}}>
            <div className="font-mono" style={{ fontSize: 12.5, width: 72, color: 'var(--ink-mute)' }}>{fmt12(s.slot_time)}</div>
            <div style={{ flex: 1 }}>{fmtDate(s.slot_date)}</div>
            <span style={{ fontSize: 11, color: 'var(--ink-faint)' }}>Completed</span>
          </div>
        ))}
      </section>
    </>
  );
}

const lessonRow = {
  display: 'flex', alignItems: 'center', padding: '13px 0',
  borderBottom: '0.5px solid var(--rule-soft)', gap: 18, fontSize: 14,
};

// ============================================================================
// Policy / Announcements (read-only for students; editable for admin)
// ============================================================================
function PolicyPage() {
  const app = useApp();
  const isAdmin = app.role === 'admin';
  const content = app.settings.announcements_page || '';

  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(content);

  React.useEffect(() => { if (!editing) setDraft(content); }, [content, editing]);

  const save = () => {
    app.updateSetting('announcements_page', draft);
    app.showToast ? app.showToast('Saved.') : null;
    setEditing(false);
  };

  return (
    <>
      <PageHeader eyebrow="Studio notices" title="Announcements"
        subtitle="Policy, concerto information, summer festivals, and anything else from Chi Ho." />

      {isAdmin && !editing && (
        <div style={{ marginBottom: 20 }}>
          <Button onClick={() => { setDraft(content); setEditing(true); }} variant="secondary" size="sm">
            Edit page
          </Button>
        </div>
      )}

      {editing ? (
        <div style={{ maxWidth: 720 }}>
          <textarea value={draft} onChange={e => setDraft(e.target.value)} rows={28}
            style={{
              width: '100%', padding: 14, fontSize: 13.5, lineHeight: 1.6,
              border: '1px solid var(--rule)', borderRadius: 12, background: 'var(--paper)',
              resize: 'vertical', fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            }} />
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <Button onClick={save} size="sm">Save</Button>
            <Button onClick={() => setEditing(false)} variant="ghost" size="sm">Cancel</Button>
          </div>
        </div>
      ) : (
        <Rendered content={content} />
      )}
    </>
  );
}

function Rendered({ content }) {
  if (!content.trim()) return <Muted>Nothing posted yet.</Muted>;
  const blocks = content.split(/\n\s*\n/);
  return (
    <div style={{ maxWidth: 640, fontSize: 14.5, lineHeight: 1.75, color: 'var(--ink-soft)' }}>
      {blocks.map((block, i) => {
        const t = block.trim();
        if (!t) return null;
        if (t.startsWith('## ')) {
          return (
            <h2 key={i} className="font-serif" style={{
              fontSize: 22, fontStyle: 'italic', fontWeight: 400, color: 'var(--ink)',
              margin: i === 0 ? '0 0 16px' : '40px 0 16px',
            }}>{renderInline(t.slice(3).trim())}</h2>
          );
        }
        if (t.startsWith('# ')) {
          return (
            <h1 key={i} className="font-serif" style={{
              fontSize: 28, fontStyle: 'italic', fontWeight: 400, color: 'var(--ink)',
              margin: i === 0 ? '0 0 20px' : '48px 0 20px',
            }}>{renderInline(t.slice(2).trim())}</h1>
          );
        }
        return <p key={i} style={{ margin: '0 0 18px' }}>{renderInline(t)}</p>;
      })}
    </div>
  );
}
function renderInline(text) {
  const nodes = []; let key = 0;
  let remaining = text;
  const linkRe = /\[([^\]]+)\]\(([^)]+)\)/;
  const boldRe = /\*\*([^*]+)\*\*/;
  const uRe = /__([^_]+)__/;
  while (remaining.length) {
    const candidates = [];
    const lm = remaining.match(linkRe); if (lm) candidates.push({ type: 'a', m: lm });
    const bm = remaining.match(boldRe); if (bm) candidates.push({ type: 'strong', m: bm });
    const um = remaining.match(uRe);    if (um) candidates.push({ type: 'u', m: um });
    if (candidates.length === 0) { nodes.push(<span key={key++}>{remaining}</span>); break; }
    candidates.sort((a, b) => a.m.index - b.m.index);
    const { type, m } = candidates[0];
    if (m.index > 0) nodes.push(<span key={key++}>{remaining.slice(0, m.index)}</span>);
    if (type === 'a') nodes.push(<a key={key++} href={m[2]} target="_blank" rel="noopener noreferrer"
      style={{ color: 'var(--accent)', textDecoration: 'underline', textUnderlineOffset: 2 }}>{m[1]}</a>);
    else if (type === 'strong') nodes.push(<strong key={key++} style={{ color: 'var(--ink)', fontWeight: 600 }}>{m[1]}</strong>);
    else nodes.push(<span key={key++} style={{ textDecoration: 'underline', textUnderlineOffset: 2 }}>{m[1]}</span>);
    remaining = remaining.slice(m.index + m[0].length);
  }
  return nodes;
}

Object.assign(window, { BookPage, MyLessonsPage, PolicyPage });
