import { useMemo, useState } from 'react';
import { Plus, Pencil, X, Calendar, Check } from 'lucide-react';
import { useAuth } from '../lib/auth.jsx';
import { useStudioClass } from '../hooks/useStudioClass.js';
import { useSettings } from '../hooks/useSettings.js';
import { useProfiles } from '../hooks/useProfiles.js';
import { supabase } from '../lib/supabase.js';
import { fmtDate, fmtTime, todayISO } from '../lib/dateUtils.js';
import PageHeader from '../components/PageHeader.jsx';
import Button from '../components/Button.jsx';
import Pill from '../components/Pill.jsx';

const DOW = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

// Compute the next N occurrences of a given weekday (0-6) from today.
function nextWeekdayDates(weekday, weeks) {
  const out = [];
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  const diff = (weekday - d.getDay() + 7) % 7;
  d.setDate(d.getDate() + diff);
  for (let i = 0; i < weeks; i++) {
    out.push(d.toISOString().slice(0, 10));
    d.setDate(d.getDate() + 7);
  }
  return out;
}

// Merge real sessions with virtual "default" sessions generated from settings.
function mergeSessions(realSessions, settings) {
  const weekday = parseInt(settings.studio_default_weekday ?? '3', 10);
  const time = settings.studio_default_time || '19:30';
  const location = settings.studio_default_location || 'MA 405';
  const weeks = parseInt(settings.studio_default_weeks_ahead ?? '8', 10);
  const skip = (() => { try { return JSON.parse(settings.studio_skip_dates || '[]'); } catch { return []; } })();

  const today = todayISO();
  const upcomingReal = realSessions.filter(s => s.session_date >= today);
  const realDates = new Set(upcomingReal.map(s => s.session_date));

  const defaultDates = nextWeekdayDates(weekday, weeks).filter(d =>
    !realDates.has(d) && !skip.includes(d)
  );
  const virtual = defaultDates.map(d => ({
    id: `default:${d}`,
    session_date: d,
    session_time: time,
    location,
    cancelled: false,
    is_default: true,
  }));

  return [...upcomingReal, ...virtual].sort((a, b) =>
    (a.session_date + (a.session_time || '')).localeCompare(b.session_date + (b.session_time || ''))
  );
}

export default function StudioClass() {
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'admin';
  const { sessions, piecesFor, loading } = useStudioClass();
  const { settings, update } = useSettings();
  const { displayName } = useProfiles();

  const [showDefaults, setShowDefaults] = useState(false);
  const [showOneOff, setShowOneOff] = useState(false);
  const [signUpFor, setSignUpFor] = useState(null);

  const upcoming = useMemo(() => mergeSessions(sessions, settings), [sessions, settings]);

  // Materialize a virtual default session into a real studio_class row.
  const materialize = async (virtual) => {
    const { data, error } = await supabase
      .from('studio_class')
      .insert({
        session_date: virtual.session_date,
        session_time: virtual.session_time,
        location: virtual.location,
        cancelled: false,
      })
      .select()
      .single();
    if (error) { alert(error.message); return null; }
    return data;
  };

  const cancelSession = async (s) => {
    if (!confirm('Cancel this session? Students will see a cancelled badge.')) return;
    if (s.is_default) {
      // Add to skip list
      let skip = [];
      try { skip = JSON.parse(settings.studio_skip_dates || '[]'); } catch {}
      skip = Array.from(new Set([...skip, s.session_date]));
      await update('studio_skip_dates', JSON.stringify(skip));
    } else {
      await supabase.from('studio_class').update({ cancelled: true }).eq('id', s.id);
    }
  };

  const removePiece = async (id) => {
    await supabase.from('studio_pieces').delete().eq('id', id);
  };

  return (
    <>
      <PageHeader
        eyebrow="Studio class"
        title="Performance sessions"
        subtitle={`Default schedule: ${DOW[parseInt(settings.studio_default_weekday ?? '3', 10)]} at ${fmtTime(settings.studio_default_time || '19:30')} · ${settings.studio_default_location || 'MA 405'}. Edits and cancellations override the default for that week only.`}
        actions={isAdmin && (
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="secondary" size="sm" onClick={() => setShowDefaults(true)} title="Default schedule">
              <Calendar size={13} strokeWidth={1.5} /> Default schedule
            </Button>
            <Button size="sm" onClick={() => setShowOneOff(true)} title="One-off session">
              <Plus size={13} strokeWidth={1.5} /> One-off
            </Button>
          </div>
        )}
      />

      {loading ? (
        <p className="font-serif" style={{ fontSize: 13, fontStyle: 'italic', color: 'var(--ink-mute)' }}>Loading…</p>
      ) : upcoming.length === 0 ? (
        <p className="font-serif" style={{ fontSize: 13, fontStyle: 'italic', color: 'var(--ink-mute)' }}>
          No sessions scheduled.
        </p>
      ) : upcoming.map(session => (
        <SessionCard
          key={session.id}
          session={session}
          pieces={session.is_default ? [] : piecesFor(session.id)}
          isAdmin={isAdmin}
          onSignUp={() => setSignUpFor(session)}
          onCancel={() => cancelSession(session)}
          onRemovePiece={removePiece}
          displayName={displayName}
          currentUserId={profile?.id}
        />
      ))}

      {showDefaults && (
        <DefaultScheduleEditor
          settings={settings}
          onClose={() => setShowDefaults(false)}
          onSave={async (patch) => {
            for (const [k, v] of Object.entries(patch)) await update(k, v);
            setShowDefaults(false);
          }}
        />
      )}

      {showOneOff && (
        <OneOffEditor onClose={() => setShowOneOff(false)} />
      )}

      {signUpFor && (
        <SignUpModal
          session={signUpFor}
          profile={profile}
          onClose={() => setSignUpFor(null)}
          materialize={materialize}
        />
      )}
    </>
  );
}

// -----------------------------------------------------------------------------

function SessionCard({ session, pieces, isAdmin, onSignUp, onCancel, onRemovePiece, displayName, currentUserId }) {
  const mine = pieces.filter(p => p.student_id === currentUserId);
  const canSignUp = !session.cancelled && !session.is_default ? true : !session.cancelled; // both allowed

  return (
    <section style={{
      border: '1px solid var(--rule-soft)',
      borderRadius: 'var(--r-lg)',
      padding: 24,
      marginBottom: 20,
      background: session.cancelled ? 'var(--paper-soft)' : 'var(--paper)',
      boxShadow: 'var(--shadow-xs)',
      opacity: session.cancelled ? 0.7 : 1,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start', marginBottom: 14 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
            <h2 className="font-serif" style={{ fontSize: 22, fontStyle: 'italic', fontWeight: 400, margin: 0 }}>
              {fmtDate(session.session_date)}
            </h2>
            {session.is_default && <Pill>Default</Pill>}
            {session.cancelled && <Pill color="accent">Cancelled</Pill>}
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--ink-mute)' }}>
            {fmtTime(session.session_time)} · {session.location || 'TBA'}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          {!session.cancelled && (
            <Button size="sm" onClick={onSignUp} title={mine.length ? 'Add another piece' : 'Sign up to perform'}>
              <Plus size={13} strokeWidth={1.5} /> {mine.length ? 'Add' : 'Sign up'}
            </Button>
          )}
          {isAdmin && !session.cancelled && (
            <Button round size="sm" variant="danger" onClick={onCancel} title="Cancel session">
              <span style={{ fontSize: 14, lineHeight: 1 }}>×</span>
            </Button>
          )}
        </div>
      </div>

      {pieces.length > 0 && (
        <div style={{ borderTop: '0.5px solid var(--rule-soft)', paddingTop: 14 }}>
          <div style={{
            fontSize: 10,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--ink-mute)',
            marginBottom: 10,
          }}>
            Program ({pieces.length})
          </div>
          {pieces.map(p => (
            <div key={p.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '8px 0',
              borderTop: '0.5px solid var(--rule-soft)',
              fontSize: 13,
            }}>
              <span style={{ width: 120, flexShrink: 0, color: 'var(--ink-soft)', fontWeight: 500 }}>
                {displayName(p.student_id)}
              </span>
              <span className="font-serif" style={{ fontStyle: 'italic', flex: 1, color: 'var(--ink)' }}>
                {p.piece}
              </span>
              {(isAdmin || p.student_id === currentUserId) && (
                <Button round size="sm" variant="ghost" onClick={() => onRemovePiece(p.id)} title="Remove piece">
                  <span style={{ fontSize: 14, lineHeight: 1 }}>×</span>
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// -----------------------------------------------------------------------------

function SignUpModal({ session, profile, onClose, materialize }) {
  const [pieces, setPieces] = useState(['']);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  const submit = async () => {
    const cleaned = pieces.map(p => p.trim()).filter(Boolean);
    if (cleaned.length === 0) { setErr('Add at least one piece.'); return; }
    setBusy(true);
    let sessionId = session.id;
    if (session.is_default) {
      const real = await materialize(session);
      if (!real) { setBusy(false); return; }
      sessionId = real.id;
    }
    const rows = cleaned.map(piece => ({
      session_id: sessionId,
      student_id: profile.id,
      piece,
    }));
    const { error } = await supabase.from('studio_pieces').insert(rows);
    setBusy(false);
    if (error) { setErr(error.message); return; }
    onClose();
  };

  return (
    <div onClick={onClose} style={modalOverlay}>
      <div onClick={e => e.stopPropagation()} style={modalCard}>
        <div style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginBottom: 6 }}>
          Sign up to perform
        </div>
        <h3 className="font-serif" style={{ fontSize: 22, fontStyle: 'italic', fontWeight: 400, margin: '0 0 18px' }}>
          {fmtDate(session.session_date)}
        </h3>

        {pieces.map((p, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 10, alignItems: 'center' }}>
            <span className="font-mono" style={{ fontSize: 12, color: 'var(--ink-mute)', width: 20 }}>{i + 1}.</span>
            <input
              value={p}
              onChange={e => { const c = [...pieces]; c[i] = e.target.value; setPieces(c); }}
              onKeyDown={e => {
                if (e.key === 'Enter' && i === pieces.length - 1 && p.trim()) {
                  e.preventDefault();
                  setPieces([...pieces, '']);
                }
              }}
              placeholder="Piece (composer · work)"
              style={{ ...miniInput, flex: 1 }}
            />
            {pieces.length > 1 && (
              <Button round size="sm" variant="ghost" onClick={() => setPieces(pieces.filter((_, j) => j !== i))} title="Remove">
                <span style={{ fontSize: 14, lineHeight: 1 }}>×</span>
              </Button>
            )}
          </div>
        ))}

        <button
          onClick={() => setPieces([...pieces, ''])}
          style={{
            fontSize: 12,
            color: 'var(--ink-mute)',
            padding: '8px 12px',
            border: '1px dashed var(--rule)',
            borderRadius: 'var(--r-sm)',
            width: '100%',
            marginBottom: 14,
            background: 'transparent',
          }}
        >
          + Add another piece
        </button>

        {err && <div style={{ fontSize: 12, color: 'var(--accent)', marginBottom: 10 }}>{err}</div>}

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={submit} disabled={busy}>
            {busy ? 'Signing up…' : `Sign up${pieces.filter(p => p.trim()).length > 1 ? ` (${pieces.filter(p => p.trim()).length} pieces)` : ''}`}
          </Button>
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------

function DefaultScheduleEditor({ settings, onClose, onSave }) {
  const [weekday, setWeekday] = useState(settings.studio_default_weekday ?? '3');
  const [time, setTime] = useState(settings.studio_default_time || '19:30');
  const [location, setLocation] = useState(settings.studio_default_location || 'MA 405');
  const [weeks, setWeeks] = useState(settings.studio_default_weeks_ahead ?? '8');
  const [busy, setBusy] = useState(false);

  const save = async () => {
    setBusy(true);
    await onSave({
      studio_default_weekday: String(weekday),
      studio_default_time: time,
      studio_default_location: location,
      studio_default_weeks_ahead: String(weeks),
    });
    setBusy(false);
  };

  return (
    <div onClick={onClose} style={modalOverlay}>
      <div onClick={e => e.stopPropagation()} style={modalCard}>
        <div style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginBottom: 6 }}>
          Default schedule
        </div>
        <h3 className="font-serif" style={{ fontSize: 22, fontStyle: 'italic', fontWeight: 400, margin: '0 0 6px' }}>
          When does studio class usually meet?
        </h3>
        <p style={{ fontSize: 12.5, color: 'var(--ink-mute)', margin: '0 0 18px' }}>
          The app auto-generates future sessions from this rule. Editing or cancelling a specific week overrides just that week.
        </p>

        <Field label="Weekday">
          <select value={weekday} onChange={e => setWeekday(e.target.value)} style={miniInput}>
            {DOW.map((d, i) => <option key={i} value={i}>{d}</option>)}
          </select>
        </Field>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Time">
            <input type="time" value={time} onChange={e => setTime(e.target.value)} style={miniInput} />
          </Field>
          <Field label="Weeks ahead">
            <input type="number" min={1} max={52} value={weeks} onChange={e => setWeeks(e.target.value)} style={miniInput} />
          </Field>
        </div>

        <Field label="Location">
          <input value={location} onChange={e => setLocation(e.target.value)} style={miniInput} />
        </Field>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 14 }}>
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={save} disabled={busy}>
            <Check size={13} strokeWidth={1.5} /> {busy ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------

function OneOffEditor({ onClose }) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('19:30');
  const [location, setLocation] = useState('MA 405');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  const save = async () => {
    if (!date) { setErr('Date required.'); return; }
    setBusy(true);
    const { error } = await supabase.from('studio_class').insert({
      session_date: date,
      session_time: time,
      location,
      cancelled: false,
    });
    setBusy(false);
    if (error) { setErr(error.message); return; }
    onClose();
  };

  return (
    <div onClick={onClose} style={modalOverlay}>
      <div onClick={e => e.stopPropagation()} style={modalCard}>
        <div style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginBottom: 6 }}>
          One-off session
        </div>
        <h3 className="font-serif" style={{ fontSize: 22, fontStyle: 'italic', fontWeight: 400, margin: '0 0 18px' }}>
          Add a session outside the default
        </h3>

        <Field label="Date">
          <input type="date" value={date} onChange={e => setDate(e.target.value)} style={miniInput} />
        </Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12 }}>
          <Field label="Time">
            <input type="time" value={time} onChange={e => setTime(e.target.value)} style={miniInput} />
          </Field>
          <Field label="Location">
            <input value={location} onChange={e => setLocation(e.target.value)} style={miniInput} />
          </Field>
        </div>

        {err && <div style={{ fontSize: 12, color: 'var(--accent)', marginBottom: 10 }}>{err}</div>}

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={save} disabled={busy}>
            {busy ? 'Saving…' : 'Create'}
          </Button>
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{
        display: 'block',
        fontSize: 10,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: 'var(--ink-soft)',
        marginBottom: 6,
      }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const miniInput = {
  width: '100%',
  padding: '9px 12px',
  fontSize: 13.5,
  border: '1px solid var(--rule)',
  borderRadius: 'var(--r-sm)',
  background: 'var(--paper)',
  color: 'var(--ink)',
};

const modalOverlay = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(28,27,24,0.32)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 50,
  padding: 20,
};

const modalCard = {
  background: 'var(--paper)',
  border: '1px solid var(--rule)',
  borderRadius: 'var(--r-xl)',
  padding: 32,
  maxWidth: 480,
  width: '100%',
  boxShadow: 'var(--shadow-lg)',
};
