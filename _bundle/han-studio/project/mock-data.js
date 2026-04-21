// Mock data for Han Studio prototype — using real names from CONTEXT.md
// (David, Philippe, Shiohn, Ding, Yeunsu, Xiaoya, Xinyu, Seohyeong)

(function () {
  const students = [
    { id: 's1', full_name: 'Ding Zhou', email: 'ding.zhou@iu.edu', archived: false },
    { id: 's2', full_name: 'David Lin', email: 'david.lin@iu.edu', archived: false },
    { id: 's3', full_name: 'Philippe Marchand', email: 'philippe.m@iu.edu', archived: false },
    { id: 's4', full_name: 'Shiohn Kim', email: 'shiohn.kim@iu.edu', archived: false },
    { id: 's5', full_name: 'Yeunsu Park', email: 'yeunsu.park@iu.edu', archived: false },
    { id: 's6', full_name: 'Xiaoya Chen', email: 'xiaoya.chen@iu.edu', archived: false },
    { id: 's7', full_name: 'Xinyu Wang', email: 'xinyu.wang@iu.edu', archived: false },
    { id: 's8', full_name: 'Seohyeong Lee', email: 'seohyeong.lee@iu.edu', archived: false },
    { id: 's9', full_name: 'Mateo Alvarez', email: 'mateo.a@iu.edu', archived: false },
    { id: 's10', full_name: 'Hana Takeda', email: 'hana.takeda@iu.edu', archived: false },
    { id: 'sa1', full_name: 'Alexei Volkov', email: 'alexei.v@iu.edu', archived: true },
    { id: 'sa2', full_name: 'Maria Johansson', email: 'maria.j@iu.edu', archived: true },
  ];

  const admin = { id: 'admin', full_name: 'Chi Ho Han', email: 'chiho.han@indiana.edu', role: 'admin' };

  // "today" for the prototype: April 19, 2026 (Sunday)
  // Build a week of slots with Chi Ho's characteristic irregular times
  // Mon Apr 20, Tue Apr 21 (restricted), Wed Apr 22, Thu Apr 23, Sat Apr 25
  // Plus next week for variety

  const slots = [
    // Mon Apr 20 — open to all
    { id: 'sl1',  slot_date: '2026-04-20', slot_time: '13:20:00', booked_by: 's2',  restricted_to: null },
    { id: 'sl2',  slot_date: '2026-04-20', slot_time: '14:20:00', booked_by: null,  restricted_to: null },
    { id: 'sl3',  slot_date: '2026-04-20', slot_time: '15:20:00', booked_by: 's6',  restricted_to: null },
    { id: 'sl4',  slot_date: '2026-04-20', slot_time: '16:20:00', booked_by: 's7',  restricted_to: null },
    { id: 'sl5',  slot_date: '2026-04-20', slot_time: '17:20:00', booked_by: null,  restricted_to: null },

    // Tue Apr 21 — restricted to David, Philippe, Shiohn, Ding, Yeunsu
    { id: 'sl6',  slot_date: '2026-04-21', slot_time: '14:00:00', booked_by: 's3',  restricted_to: ['s2','s3','s4','s1','s5'] },
    { id: 'sl7',  slot_date: '2026-04-21', slot_time: '15:00:00', booked_by: 's4',  restricted_to: ['s2','s3','s4','s1','s5'] },
    { id: 'sl8',  slot_date: '2026-04-21', slot_time: '16:00:00', booked_by: null,  restricted_to: ['s2','s3','s4','s1','s5'] },
    { id: 'sl9',  slot_date: '2026-04-21', slot_time: '17:00:00', booked_by: 's1',  restricted_to: ['s2','s3','s4','s1','s5'] },

    // Thu Apr 23
    { id: 'sl10', slot_date: '2026-04-23', slot_time: '10:00:00', booked_by: 's8',  restricted_to: null },
    { id: 'sl11', slot_date: '2026-04-23', slot_time: '11:00:00', booked_by: null,  restricted_to: null },
    { id: 'sl12', slot_date: '2026-04-23', slot_time: '13:00:00', booked_by: 's9',  restricted_to: null },
    { id: 'sl13', slot_date: '2026-04-23', slot_time: '14:00:00', booked_by: null,  restricted_to: null },

    // Sat Apr 25 — 7pm irregular
    { id: 'sl14', slot_date: '2026-04-25', slot_time: '19:00:00', booked_by: 's10', restricted_to: null },
    { id: 'sl15', slot_date: '2026-04-25', slot_time: '20:00:00', booked_by: null,  restricted_to: null },

    // Next week — Mon Apr 27
    { id: 'sl16', slot_date: '2026-04-27', slot_time: '13:20:00', booked_by: null,  restricted_to: null },
    { id: 'sl17', slot_date: '2026-04-27', slot_time: '14:20:00', booked_by: 's1',  restricted_to: null },
    { id: 'sl18', slot_date: '2026-04-27', slot_time: '15:20:00', booked_by: null,  restricted_to: null },
    { id: 'sl19', slot_date: '2026-04-27', slot_time: '16:20:00', booked_by: null,  restricted_to: null },

    // Past lessons for history (Ding's)
    { id: 'p1', slot_date: '2026-04-13', slot_time: '17:00:00', booked_by: 's1', restricted_to: null },
    { id: 'p2', slot_date: '2026-04-06', slot_time: '17:00:00', booked_by: 's1', restricted_to: null },
    { id: 'p3', slot_date: '2026-03-30', slot_time: '16:00:00', booked_by: 's1', restricted_to: null },
    { id: 'p4', slot_date: '2026-03-23', slot_time: '17:00:00', booked_by: 's1', restricted_to: null },
    { id: 'p5', slot_date: '2026-03-16', slot_time: '17:00:00', booked_by: 's1', restricted_to: null },
    { id: 'p6', slot_date: '2026-03-02', slot_time: '14:00:00', booked_by: 's1', restricted_to: null },
    { id: 'p7', slot_date: '2026-02-23', slot_time: '14:00:00', booked_by: 's1', restricted_to: null },
    { id: 'p8', slot_date: '2026-02-16', slot_time: '15:00:00', booked_by: 's1', restricted_to: null },

    // Past lessons for other students (for admin student detail)
    { id: 'p9',  slot_date: '2026-04-13', slot_time: '14:00:00', booked_by: 's2', restricted_to: null },
    { id: 'p10', slot_date: '2026-04-13', slot_time: '15:00:00', booked_by: 's3', restricted_to: null },
    { id: 'p11', slot_date: '2026-04-13', slot_time: '16:00:00', booked_by: 's4', restricted_to: null },
  ];

  const studioClass = [
    {
      id: 'sc1',
      session_date: '2026-04-22',
      session_time: '19:30:00',
      location: 'MA 405',
      cancelled: false,
      pieces: [
        { id: 'pc1', student_id: 's1', piece: 'Chopin Ballade No. 4 in F minor, Op. 52' },
        { id: 'pc2', student_id: 's2', piece: 'Brahms Piano Sonata No. 3 in F minor — I. Allegro maestoso' },
        { id: 'pc3', student_id: 's3', piece: 'Debussy Images, Book I' },
        { id: 'pc4', student_id: 's6', piece: 'Liszt Transcendental Étude No. 10 in F minor' },
        { id: 'pc5', student_id: 's4', piece: 'Beethoven Piano Sonata Op. 110 in A♭ major' },
      ],
    },
    {
      id: 'sc2',
      session_date: '2026-04-15',
      session_time: '19:30:00',
      location: 'MA 405',
      cancelled: false,
      pieces: [
        { id: 'pc6',  student_id: 's1', piece: 'Schumann Fantasie in C major, Op. 17 — I.' },
        { id: 'pc7',  student_id: 's7', piece: 'Ravel Gaspard de la nuit — Ondine' },
        { id: 'pc8',  student_id: 's8', piece: 'Bach Partita No. 6 in E minor — Toccata' },
        { id: 'pc9',  student_id: 's5', piece: 'Rachmaninoff Études-Tableaux Op. 39 No. 5' },
      ],
    },
    {
      id: 'sc3',
      session_date: '2026-04-08',
      session_time: '19:30:00',
      location: 'MA 405',
      cancelled: true,
      pieces: [],
    },
    {
      id: 'sc4',
      session_date: '2026-04-01',
      session_time: '19:30:00',
      location: 'MA 405',
      cancelled: false,
      pieces: [
        { id: 'pc10', student_id: 's1', piece: 'Schubert Impromptu Op. 90 No. 3 in G♭ major' },
        { id: 'pc11', student_id: 's9', piece: 'Prokofiev Sonata No. 7 in B♭ major — I. Allegro inquieto' },
        { id: 'pc12', student_id: 's10', piece: 'Mozart Sonata K. 576 in D major' },
      ],
    },
  ];

  const announcement = "Two lessons this week — Xiaoya, Xinyu, Seohyeong. Due to very limited time, not everyone who requested can get two lessons. Studio class Wed Apr 22 as usual, 7:30pm MA 405. Bring your own copies of the score.";

  const announcementsPage = `## Cancellation policy

Lessons can be cancelled up to **24 hours** before the start time. Within 24 hours, the slot is locked — if you have a genuine emergency, text me directly and I'll do my best to reschedule.

## 14 lessons per semester

The studio runs **14 lessons per semester** as a guideline. This is soft — I sometimes offer makeup lessons for legitimate conflicts (competitions, recitals, travel for auditions). Don't stress about the exact count, but if you're tracking below 10 at the midpoint, come talk to me.

## Summer festivals 2026

If you're applying to festivals this summer, the deadlines below are what I'm aware of. If you need rec letters, please give me **three weeks** notice — I want to write something worth reading, not a rushed form letter.

- **Aspen** — February 15 (passed)
- **Tanglewood** — January 12 (passed)
- **Ravinia Steans** — March 1 (passed)
- **PianoTexas** — rolling, priority by April 30
- **Music Academy of the West** — December 1 (fall deadline)

## Concerto competition

The Jacobs concerto competition is the **first week of November**. If you're planning to enter, let me know by mid-September so we can pick repertoire and build a runway. First round is a 20-min audition; finalists play with orchestra in February.

## Score submissions

Before every lesson, please send me your most recent recording (audio or video is fine — phone quality is fine). I listen before you walk in, so we spend the hour on what matters, not on me reading through the piece for the first time.`;

  const incomingSwap = [
    {
      id: 'sw1',
      requester_id: 's4',   // Shiohn wants
      requester_slot_id: 'sl7',  // their Tue 3pm
      target_id: 's1',
      target_slot_id: 'sl9',     // Ding's Tue 5pm
      message: 'I have chamber masterclass at 5 next Tuesday — would you mind taking 3pm?',
    },
  ];

  const outgoingSwap = [];

  const invitedEmails = [
    { email: 'pending.one@iu.edu', full_name: 'Elena Petrova' },
    { email: 'pending.two@iu.edu', full_name: '' },
  ];

  const settings = {
    announcement,
    announcements_page: announcementsPage,
    lessons_per_semester: '14',
    studio_default_weekday: 3,           // 0=Sun … 3=Wed
    studio_default_time: '19:30:00',
    studio_default_location: 'MA 405',
    studio_default_weeks_ahead: 8,       // how far out to auto-generate
  };

  window.MOCK = {
    students, admin,
    allProfiles: [...students, admin],
    slots, studioClass, settings,
    incomingSwap, outgoingSwap,
    invitedEmails,
    today: '2026-04-19',
  };
})();
