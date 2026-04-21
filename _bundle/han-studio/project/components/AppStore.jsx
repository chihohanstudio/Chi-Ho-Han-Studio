// AppStore: central React state (route, session, role, slots, studio class, settings, tweaks)
// Exposes useApp hook.

const AppCtx = React.createContext(null);

function AppProvider({ children, initialRoute = '/book' }) {
  // route = path string
  const [route, setRoute] = React.useState(initialRoute);
  const [role, setRole] = React.useState('student');  // 'student' | 'admin'
  const [studentId, setStudentId] = React.useState('s1');  // who "I" am as a student (Ding)
  const [signedIn, setSignedIn] = React.useState(true);

  // Editable copies of mock data so prototype actions actually change UI
  const [slots, setSlots] = React.useState(() => window.MOCK.slots.map(s => ({...s})));
  const [studioClass, setStudioClass] = React.useState(() => window.MOCK.studioClass.map(s => ({...s, pieces: s.pieces.map(p => ({...p}))})));
  const [settings, setSettings] = React.useState(() => ({...window.MOCK.settings}));
  const [incoming, setIncoming] = React.useState(() => window.MOCK.incomingSwap.map(r => ({...r})));
  const [outgoing, setOutgoing] = React.useState(() => window.MOCK.outgoingSwap.map(r => ({...r})));
  const [invited, setInvited] = React.useState(() => window.MOCK.invitedEmails.map(r => ({...r})));
  const [studentsList, setStudentsList] = React.useState(() => window.MOCK.students.map(s => ({...s})));
  const [toast, setToast] = React.useState(null);

  // TWEAKS
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "accent": "#9B2D1F",
    "serif": "Fraunces",
    "density": "comfortable",
    "variant": "classical"
  }/*EDITMODE-END*/;
  const [tweaks, setTweaks] = React.useState(TWEAK_DEFAULTS);
  const [tweaksOpen, setTweaksOpen] = React.useState(false);
  React.useEffect(() => { window.__setTweaksOpen = setTweaksOpen; }, []);

  // Apply tweaks to CSS vars
  React.useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--accent', tweaks.accent);
    root.setAttribute('data-serif', tweaks.serif);
    root.setAttribute('data-density', tweaks.density);
    root.setAttribute('data-variant', tweaks.variant);
  }, [tweaks]);

  const nav = (p) => setRoute(p);

  const profile = role === 'admin' ? window.MOCK.admin : studentsList.find(s => s.id === studentId);
  const myId = role === 'admin' ? 'admin' : studentId;

  const profiles = React.useMemo(() => {
    return [...studentsList, window.MOCK.admin];
  }, [studentsList]);

  const displayName = (id) => {
    if (!id) return '—';
    const p = profiles.find(x => x.id === id);
    if (!p) return 'Someone';
    return p.full_name || (p.email ? p.email.split('@')[0] : 'Someone');
  };

  const showToast = (text, kind = 'success') => {
    setToast({ text, kind, id: Date.now() });
    setTimeout(() => setToast(t => (t && t.text === text ? null : t)), 2400);
  };

  // --- Actions --------------------------------------------------------------
  const bookSlot = (slotId) => {
    setSlots(sl => sl.map(s => s.id === slotId ? { ...s, booked_by: myId } : s));
    showToast('Lesson reserved.');
  };
  const cancelSlot = (slotId) => {
    setSlots(sl => sl.map(s => s.id === slotId ? { ...s, booked_by: null } : s));
    showToast('Lesson cancelled.');
  };
  const deleteSlot = (slotId) => {
    setSlots(sl => sl.filter(s => s.id !== slotId));
    showToast('Slot deleted.');
  };
  const deleteDay = (date) => {
    setSlots(sl => sl.filter(s => s.slot_date !== date));
    showToast('Day deleted.');
  };
  const updateSlot = (slotId, patch) => {
    setSlots(sl => sl.map(s => s.id === slotId ? { ...s, ...patch } : s));
  };
  const publishSlots = (rows) => {
    setSlots(sl => [...sl, ...rows]);
    showToast(`Published ${rows.length} slot${rows.length>1?'s':''}.`);
  };

  const updateSetting = (k, v) => setSettings(s => ({ ...s, [k]: v }));

  // Materialize a default (virtual) session into studioClass so it can be edited.
  // Returns the new real session (from current settings) — caller then applies extra patches.
  const materializeDefault = (virtualId, basePatch = {}) => {
    // virtualId is 'default:YYYY-MM-DD'
    const date = virtualId.replace(/^default:/, '');
    const base = {
      id: 'sc' + Date.now() + Math.floor(Math.random() * 999),
      session_date: date,
      session_time: settings.studio_default_time || '19:30:00',
      location: settings.studio_default_location || 'MA 405',
      cancelled: false,
      pieces: [],
      ...basePatch,
    };
    setStudioClass(scs => {
      // guard against race/double-add for same date
      if (scs.some(s => s.session_date === date)) return scs;
      return [...scs, base];
    });
    return base;
  };

  // Given an id that might be 'default:...', return a real id — materializing first.
  const ensureReal = (id, patch) => {
    if (!id?.startsWith('default:')) return id;
    const real = materializeDefault(id, patch);
    return real.id;
  };

  const addPiece = (sessionId, piece) => {
    if (sessionId.startsWith('default:')) {
      const real = materializeDefault(sessionId, {
        pieces: [{ id: 'pc' + Date.now(), student_id: myId, piece }],
      });
      showToast('Piece signed up.');
      return;
    }
    setStudioClass(scs => scs.map(sc => sc.id === sessionId
      ? { ...sc, pieces: [...sc.pieces, { id: 'pc'+Date.now(), student_id: myId, piece }] }
      : sc));
    showToast('Piece signed up.');
  };
  const removePiece = (sessionId, pieceId) => {
    setStudioClass(scs => scs.map(sc => sc.id === sessionId
      ? { ...sc, pieces: sc.pieces.filter(p => p.id !== pieceId) }
      : sc));
  };
  const toggleCancelSession = (sessionId) => {
    if (sessionId.startsWith('default:')) {
      materializeDefault(sessionId, { cancelled: true });
      showToast('Session cancelled.');
      return;
    }
    setStudioClass(scs => scs.map(sc => sc.id === sessionId
      ? { ...sc, cancelled: !sc.cancelled }
      : sc));
  };
  const updateSession = (sessionId, patch) => {
    if (sessionId.startsWith('default:')) {
      materializeDefault(sessionId, patch);
      return;
    }
    setStudioClass(scs => scs.map(sc => sc.id === sessionId ? { ...sc, ...patch } : sc));
  };
  const deleteSession = (sessionId) => {
    setStudioClass(scs => scs.filter(sc => sc.id !== sessionId));
  };
  const createSession = (data) => {
    setStudioClass(scs => [...scs, { id: 'sc'+Date.now(), ...data, cancelled: false, pieces: [] }]);
    showToast('Session created.');
  };

  const acceptSwap = (reqId) => {
    const req = incoming.find(r => r.id === reqId);
    if (!req) return;
    // swap booked_by on the two slots
    setSlots(sl => sl.map(s => {
      if (s.id === req.requester_slot_id) return { ...s, booked_by: req.target_id };
      if (s.id === req.target_slot_id) return { ...s, booked_by: req.requester_id };
      return s;
    }));
    setIncoming(i => i.filter(r => r.id !== reqId));
    showToast('Swap accepted.');
  };
  const declineSwap = (reqId) => {
    setIncoming(i => i.filter(r => r.id !== reqId));
    showToast('Swap declined.');
  };
  const cancelSwap = (reqId) => setOutgoing(o => o.filter(r => r.id !== reqId));
  const createSwap = ({ requesterSlotId, targetId, targetSlotId, message }) => {
    setOutgoing(o => [...o, {
      id: 'sw'+Date.now(),
      requester_id: myId,
      requester_slot_id: requesterSlotId,
      target_id: targetId,
      target_slot_id: targetSlotId,
      message,
    }]);
    showToast('Swap request sent.');
  };

  const archiveStudent = (id, archived) => {
    setStudentsList(list => list.map(s => s.id === id ? { ...s, archived } : s));
  };

  const addInvite = (email, full_name) => {
    setInvited(i => [...i, { email, full_name }]);
    showToast('Invite added.');
  };
  const removeInvite = (email) => {
    setInvited(i => i.filter(r => r.email !== email));
  };

  const value = {
    route, nav,
    role, setRole,
    studentId, setStudentId,
    signedIn, setSignedIn,
    profile, myId,
    profiles, studentsList, displayName,
    slots, studioClass, settings, incoming, outgoing, invited,
    tweaks, setTweaks, tweaksOpen, setTweaksOpen,
    toast,
    // actions
    bookSlot, cancelSlot, deleteSlot, deleteDay, updateSlot, publishSlots,
    updateSetting,
    addPiece, removePiece, toggleCancelSession, updateSession, deleteSession, createSession,
    acceptSwap, declineSwap, cancelSwap, createSwap,
    archiveStudent, addInvite, removeInvite,
  };

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

const useApp = () => React.useContext(AppCtx);

Object.assign(window, { AppProvider, useApp });
