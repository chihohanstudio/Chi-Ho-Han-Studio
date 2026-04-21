// Main App component — handles routing + shell composition
function App() {
  const app = useApp();
  const { route, signedIn, role } = app;

  // Not signed in → login
  if (!signedIn) return <><LoginPage /><TweaksPanel /></>;

  // Student detail path (dynamic)
  let page;
  if (route.startsWith('/students/')) {
    const id = route.split('/')[2];
    page = <StudentDetailPage id={id} />;
  } else if (route === '/book')              page = <BookPage />;
    else if (route === '/my-lessons')        page = <MyLessonsPage />;
    else if (route === '/studio-class')      page = <StudioClassPage />;
    else if (route === '/policy')            page = <PolicyPage />;
    else if (route === '/schedule')          page = <AdminSchedulePage />;
    else if (route === '/open-slots')        page = <OpenSlotsPage />;
    else if (route === '/students')          page = <StudentsPage />;
    else page = role === 'admin' ? <AdminSchedulePage /> : <BookPage />;

  // If role changed but route is mismatched, auto-redirect
  React.useEffect(() => {
    const studentRoutes = ['/book','/my-lessons','/studio-class','/policy'];
    const adminRoutes = ['/schedule','/open-slots','/studio-class','/policy','/students'];
    if (route.startsWith('/students/')) return;
    if (role === 'admin' && !adminRoutes.includes(route)) app.nav('/schedule');
    if (role === 'student' && !studentRoutes.includes(route)) app.nav('/book');
  }, [role]);

  return (
    <>
      <Shell>{page}</Shell>
      <TweaksPanel />
    </>
  );
}

function RoleSwitcher() {
  const app = useApp();
  const { role, setRole, nav, studentId, setStudentId, studentsList, tweaksOpen, setTweaksOpen } = app;
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{
      position:'fixed', bottom: 20, left: 20, zIndex: 260,
      display:'flex', gap: 6, alignItems:'flex-end',
    }}>
      {open && (
        <div style={{
          background:'var(--paper)', border:'0.5px solid var(--rule)',
          padding: 12, borderRadius: 12, boxShadow:'0 12px 40px rgba(28,27,24,0.18)',
          width: 240, marginBottom: 40, position:'absolute', bottom: 0, left: 0,
        }}>
          <div style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginBottom: 10 }}>
            Prototype controls
          </div>
          <div style={{ fontSize: 11, color:'var(--ink-mute)', marginBottom: 6 }}>View as</div>
          <div style={{display:'flex', gap:6, marginBottom: 14}}>
            <button onClick={()=>{ setRole('student'); nav('/book'); }} style={chipStyle(role==='student')}>Student</button>
            <button onClick={()=>{ setRole('admin'); nav('/schedule'); }} style={chipStyle(role==='admin')}>Chi Ho</button>
          </div>
          {role === 'student' && (
            <>
              <div style={{ fontSize: 11, color:'var(--ink-mute)', marginBottom: 6 }}>Student identity</div>
              <select value={studentId} onChange={e=>setStudentId(e.target.value)}
                style={{ ...miniInput, width: '100%', fontSize: 12 }}>
                {studentsList.filter(s=>!s.archived).map(s => <option key={s.id} value={s.id}>{s.full_name}</option>)}
              </select>
            </>
          )}
          <div style={{marginTop:14, paddingTop: 12, borderTop: '0.5px solid var(--rule-soft)'}}>
            <button onClick={()=>setTweaksOpen(!tweaksOpen)} style={{ ...textBtn, fontSize: 12 }}>
              {tweaksOpen ? 'Hide Tweaks panel' : 'Show Tweaks panel'}
            </button>
          </div>
        </div>
      )}
      <button onClick={()=>setOpen(!open)} style={{
        fontSize: 11, letterSpacing:'0.14em', textTransform:'uppercase',
        padding: '8px 14px', background: 'var(--ink)', color: 'var(--paper)',
        border:'none', borderRadius: 12, cursor:'pointer',
        fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap',
        display:'inline-flex', alignItems:'center', gap: 8,
      }}>
        <span style={{width: 6, height: 6, borderRadius:'50%', background: role==='admin'?'#E8C89C':'var(--green-soft)'}} />
        {role === 'admin' ? 'Chi Ho view' : 'Student view'}
      </button>
    </div>
  );
}

Object.assign(window, { App });
