// Date / time helpers + shared primitives for the Han Studio prototype
(function () {
  const fmtDate = (isoDate, format = 'long') => {
    if (!isoDate) return '';
    const d = new Date(isoDate + 'T12:00:00');
    const day = d.toLocaleDateString('en-US', { weekday: 'long' });
    const dayShort = d.toLocaleDateString('en-US', { weekday: 'short' });
    const monthShort = d.toLocaleDateString('en-US', { month: 'short' });
    const month = d.toLocaleDateString('en-US', { month: 'long' });
    const date = d.getDate();
    if (format === 'long') return `${day}, ${month} ${date}`;
    if (format === 'short') return `${dayShort} ${monthShort} ${date}`;
    if (format === 'day') return day;
    if (format === 'num') return date;
    return isoDate;
  };
  const fmtTime = (time) => {
    if (!time) return '';
    return time.slice(0, 5);
  };
  // 24h → "2:20pm"
  const fmt12 = (time) => {
    if (!time) return '';
    const [h, m] = time.slice(0, 5).split(':').map(Number);
    const suffix = h >= 12 ? 'pm' : 'am';
    const hh = h % 12 === 0 ? 12 : h % 12;
    return `${hh}:${String(m).padStart(2, '0')}${suffix}`;
  };
  const groupSlotsByDate = (slots) => {
    const groups = {};
    slots.forEach(s => {
      if (!groups[s.slot_date]) groups[s.slot_date] = [];
      groups[s.slot_date].push(s);
    });
    Object.keys(groups).forEach(k => groups[k].sort((a, b) => a.slot_time.localeCompare(b.slot_time)));
    return groups;
  };
  const todayISO = () => (window.MOCK?.today || '2026-04-19');
  const hoursUntilSlot = (slotDate, slotTime) => {
    if (!slotDate || !slotTime) return Infinity;
    const today = todayISO();
    const d1 = new Date(today + 'T08:00:00').getTime();
    const d2 = new Date(slotDate + 'T' + slotTime).getTime();
    return (d2 - d1) / (1000 * 60 * 60);
  };

  // Add N days to an ISO date (yyyy-mm-dd), return new ISO.
  const addDays = (iso, n) => {
    const d = new Date(iso + 'T12:00:00');
    d.setDate(d.getDate() + n);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  // Weekday of an ISO date (0=Sun .. 6=Sat)
  const weekdayOf = (iso) => new Date(iso + 'T12:00:00').getDay();

  // Given today and a target weekday, return the ISO date of that weekday this week (or today if match).
  const firstOnOrAfter = (fromISO, targetWeekday) => {
    let d = fromISO;
    for (let i = 0; i < 7; i++) {
      if (weekdayOf(d) === targetWeekday) return d;
      d = addDays(d, 1);
    }
    return fromISO;
  };

  // Merge materialized studioClass rows with virtual default sessions.
  // Returns an array sorted by date, each row has: id, session_date, session_time,
  // location, cancelled, pieces, isDefault (true if virtual / not yet materialized).
  // - weeksAhead: how many future weeks of defaults to show
  // - A materialized row with the same date as a default replaces that default.
  const mergeStudioSessions = (real, settings, todayIso, weeksAhead) => {
    const wd = Number(settings.studio_default_weekday ?? 3);
    const time = settings.studio_default_time || '19:30:00';
    const loc = settings.studio_default_location || 'MA 405';
    const weeks = weeksAhead ?? Number(settings.studio_default_weeks_ahead ?? 8);

    const realByDate = {};
    real.forEach(s => { realByDate[s.session_date] = s; });

    const defaults = [];
    let d = firstOnOrAfter(todayIso, wd);
    for (let i = 0; i < weeks; i++) {
      if (!realByDate[d]) {
        defaults.push({
          id: 'default:' + d,
          session_date: d,
          session_time: time,
          location: loc,
          cancelled: false,
          pieces: [],
          isDefault: true,
        });
      }
      d = addDays(d, 7);
    }

    return [...real, ...defaults].sort((a, b) =>
      (a.session_date + a.session_time).localeCompare(b.session_date + b.session_time)
    );
  };

  window.HS = { fmtDate, fmtTime, fmt12, groupSlotsByDate, todayISO, hoursUntilSlot,
    addDays, weekdayOf, firstOnOrAfter, mergeStudioSessions };
})();
