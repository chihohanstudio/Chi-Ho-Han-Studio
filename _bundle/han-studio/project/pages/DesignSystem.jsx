// Design System documentation page
function DesignSystemPage() {
  return (
    <div style={{ maxWidth: 980, margin: '0 auto', padding: '48px 56px 96px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginBottom: 14 }}>
        Jacobs · Piano · Design System v0.1
      </div>
      <h1 className="font-serif" style={{ fontSize: 64, fontWeight: 400, fontStyle: 'italic', letterSpacing: '-0.02em', lineHeight: 1, margin: '0 0 20px' }}>
        The Han Studio
      </h1>
      <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.65, maxWidth: 600, margin: 0 }}>
        A quiet, warm, paper-and-ink design language for a classical piano studio. Informed
        by concert programmes and score publications: serif italic headings, narrow rules,
        one deep accent, restrained density.
      </p>
      <div style={{ height: 1, background: 'var(--rule)', margin: '56px 0' }} />

      {/* --- COLOR --- */}
      <Section title="Color">
        <p style={prose}>
          The palette is warm ink on ivory paper with a soft terracotta accent.
          Whites carry an ivory cast (saturation under 2%); accent is desaturated, closer to clay than brick.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px,1fr))', gap: 2, marginTop: 20, border: '0.5px solid var(--rule)' }}>
          {[
            ['--paper','#F8F5EF','paper'],
            ['--paper-soft','#EFEAE0','paper-soft'],
            ['--paper-warm','#E8E0D0','paper-warm'],
            ['--ink','#2A241D','ink'],
            ['--ink-soft','#4A4239','ink-soft'],
            ['--ink-mute','#857F74','ink-mute'],
            ['--ink-faint','#B8B2A6','ink-faint'],
            ['--rule','#D8D2C4','rule'],
            ['--rule-soft','#E5E0D2','rule-soft'],
            ['--accent','#B56A5A','accent — terracotta'],
            ['--accent-strong','#9B4B3B','accent-strong'],
            ['--green','#4A6B54','green'],
            ['--green-soft','#DDE4DD','green-soft'],
          ].map(([k,h,n]) => (
            <div key={k} style={{ padding: 14, borderRight: '0.5px solid var(--rule)', borderBottom: '0.5px solid var(--rule)', background: 'var(--paper)' }}>
              <div style={{ width: '100%', height: 64, background: h, border: '0.5px solid var(--rule-soft)', marginBottom: 10 }} />
              <div style={{ fontSize: 11.5, fontWeight: 500 }}>{n}</div>
              <div className="font-mono" style={{ fontSize: 10.5, color: 'var(--ink-mute)', letterSpacing: 0 }}>{h}</div>
              <div className="font-mono" style={{ fontSize: 10, color: 'var(--ink-faint)' }}>{k}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* --- TYPE --- */}
      <Section title="Typography">
        <p style={prose}>
          Three families: <em className="font-serif">Fraunces</em> for display,{' '}
          <strong>Inter</strong> for UI body, <span className="font-mono">JetBrains Mono</span> for times &amp; metadata.
          Italic is used freely on the serif for dates, piece titles, and decorative headings — a classical programme convention.
        </p>

        <TypeSpec name="Display · Serif Italic" tag="h1" size={56} family="Fraunces"
          style={{ fontFamily:'Fraunces', fontSize: 56, fontStyle:'italic', fontWeight: 400, letterSpacing:'-0.02em', lineHeight: 1 }}>
          The Han Studio
        </TypeSpec>
        <TypeSpec name="Page title" tag="h1" size={36} family="Fraunces"
          style={{ fontFamily:'Fraunces', fontSize: 36, fontWeight: 400, letterSpacing:'-0.015em', lineHeight: 1.1 }}>
          Available slots
        </TypeSpec>
        <TypeSpec name="Section heading · italic" tag="h2" size={22} family="Fraunces"
          style={{ fontFamily:'Fraunces', fontSize: 22, fontWeight: 400, fontStyle: 'italic' }}>
          Monday, April 20
        </TypeSpec>
        <TypeSpec name="Body" tag="p" size={14} family="Inter"
          style={{ fontFamily:'Inter', fontSize: 14, lineHeight: 1.55 }}>
          Click an open time to reserve it. Cancellations close 24 hours before the lesson.
        </TypeSpec>
        <TypeSpec name="Caption" tag="small" size={12.5} family="Inter"
          style={{ fontFamily:'Inter', fontSize: 12.5, color:'var(--ink-soft)' }}>
          Booked by Ding Zhou
        </TypeSpec>
        <TypeSpec name="Eyebrow · tracked caps" tag="label" size={10} family="Inter"
          style={{ fontFamily:'Inter', fontSize: 10, letterSpacing:'0.24em', textTransform:'uppercase', color:'var(--ink-mute)' }}>
          Book a lesson
        </TypeSpec>
        <TypeSpec name="Time · mono" tag="span" size={13} family="JetBrains Mono"
          style={{ fontFamily:'JetBrains Mono', fontSize: 13 }}>
          2:20pm
        </TypeSpec>
      </Section>

      {/* --- COMPONENTS --- */}
      <Section title="Components">
        <DSGrid>
          <DSCard label="Buttons">
            <div style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginBottom: 8 }}>Text · actions with copy</div>
            <div style={{ display:'flex', gap: 10, flexWrap:'wrap' }}>
              <Button>Reserve</Button>
              <Button variant="accent">Publish</Button>
              <Button variant="secondary">Edit</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Cancel</Button>
              <Button variant="danger">Delete</Button>
            </div>
            <div style={{ display:'flex', gap: 10, marginTop: 10, flexWrap:'wrap' }}>
              <Button size="sm">Small</Button>
              <Button size="sm" variant="accent">Small accent</Button>
              <Button size="sm" variant="outline">Small outline</Button>
              <Button size="sm" variant="secondary">Small 2°</Button>
            </div>
            <div style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-mute)', margin: '18px 0 8px' }}>Round · icon-only, in rows & toolbars</div>
            <div style={{ display:'flex', gap: 10, flexWrap:'wrap', alignItems:'center' }}>
              <Button round title="Reserve"><Icon.plus size={18} /></Button>
              <Button round variant="accent" title="Publish"><Icon.check size={18} /></Button>
              <Button round variant="secondary" title="Edit"><Icon.pencil size={18} /></Button>
              <Button round variant="outline" title="More"><Icon.chevDown size={18} /></Button>
              <Button round variant="ghost" title="Swap"><Icon.swap size={18} /></Button>
              <Button round variant="danger" title="Delete"><Icon.trash size={18} /></Button>
              <Button round variant="secondary" title="Close"><Icon.x size={18} /></Button>
            </div>
          </DSCard>

          <DSCard label="Pills">
            <div style={{ display:'flex', gap: 10, flexWrap:'wrap' }}>
              <Pill>Neutral</Pill>
              <Pill color="green">Confirmed</Pill>
              <Pill color="accent">Cancelled</Pill>
              <Pill color="dark">Your lesson</Pill>
            </div>
          </DSCard>

          <DSCard label="Stats">
            <div style={{display:'flex', gap: 32}}>
              <Stat label="Total lessons" value={14} />
              <Stat label="Upcoming" value={2} />
              <Stat label="Completed" value={12} />
            </div>
          </DSCard>

          <DSCard label="Slot row — open">
            <SlotRowDemo kind="free" />
          </DSCard>
          <DSCard label="Slot row — yours">
            <SlotRowDemo kind="mine" />
          </DSCard>
          <DSCard label="Slot row — taken">
            <SlotRowDemo kind="taken" />
          </DSCard>

          <DSCard label="Form field">
            <label style={{ display:'block', fontSize:10, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--ink-mute)', marginBottom: 6 }}>Email</label>
            <input placeholder="you@iu.edu" style={{ padding:'10px 14px', fontSize:14, width:'100%', border:'1px solid var(--rule)', borderRadius: 12, background:'var(--paper)' }} />
          </DSCard>

          <DSCard label="Banner / callout">
            <div style={{
              padding: '16px 18px', background: 'var(--paper-soft)',
              border: '1px solid var(--rule-soft)', borderLeft: '3px solid var(--accent)',
              borderRadius: 18,
            }}>
              <Eyebrow color="accent" mb={6}>From Chi Ho</Eyebrow>
              <div style={{fontSize: 13, lineHeight: 1.55}}>Studio class Wed 7:30pm MA 405 — bring your scores.</div>
            </div>
          </DSCard>

          <DSCard label="Progress · semester">
            <div style={{display:'flex', alignItems:'center', gap: 10}}>
              <div style={{ width: 160, height: 8, background:'var(--rule)', position:'relative', borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ position:'absolute', left:0, top:0, bottom:0, width: '71%', background:'var(--accent)', borderRadius: 12 }} />
              </div>
              <span className="font-mono" style={{fontSize: 11.5, color:'var(--ink-soft)'}}>10 / 14</span>
            </div>
          </DSCard>
        </DSGrid>
      </Section>

      {/* --- RADIUS --- */}
      <Section title="Radius">
        <p style={prose}>
          A nested rounding system — outer containers round generously; their children round less.
          The effect reads as softened and therapeutic without becoming bubbly. Badges and buttons use the full pill.
        </p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(160px,1fr))', gap: 2, marginTop: 20, border: '0.5px solid var(--rule)' }}>
          {[
            ['--r-xs', 8, 'xs · chips, badges in card'],
            ['--r-sm', 12, 'sm · inputs, small items'],
            ['--r-md', 16, 'md · nested content'],
            ['--r-lg', 24, 'lg · outer cards, modals'],
            ['--r-xl', 28, 'xl · hero containers'],
            ['--r-pill', 999, 'pill · buttons, tags'],
          ].map(([k, v, n]) => (
            <div key={k} style={{ padding: 16, borderRight:'0.5px solid var(--rule)', borderBottom:'0.5px solid var(--rule)', background:'var(--paper)' }}>
              <div style={{ width: 72, height: 72, borderRadius: v, background:'var(--paper-warm)', border:'0.5px solid var(--rule)', marginBottom: 10 }} />
              <div style={{ fontSize: 11.5, fontWeight: 500 }}>{n}</div>
              <div className="font-mono" style={{ fontSize: 10.5, color:'var(--ink-mute)' }}>{v === 999 ? '999px' : `${v}px`}</div>
              <div className="font-mono" style={{ fontSize: 10, color:'var(--ink-faint)' }}>{k}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* --- SHADOWS --- */}
      <Section title="Elevation">
        <p style={prose}>
          Shadows are warm (based on the ink hue, not black) and very soft. Cards rest at xs; hover lifts to sm;
          modals use lg. Avoid anything heavier — the page should feel like paper, not glass.
        </p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px,1fr))', gap: 24, marginTop: 24 }}>
          {[
            ['--shadow-xs', 'xs · resting cards'],
            ['--shadow-sm', 'sm · hover lift'],
            ['--shadow-md', 'md · toasts, popovers'],
            ['--shadow-lg', 'lg · modals, overlays'],
          ].map(([k, n]) => (
            <div key={k} style={{ padding: 24, background:'var(--paper-soft)', display:'flex', flexDirection:'column', alignItems:'center', gap: 14 }}>
              <div style={{ width: 110, height: 80, background:'var(--paper)', borderRadius: 16, boxShadow: `var(${k})`, border: '1px solid var(--rule-soft)' }} />
              <div style={{ fontSize: 11.5, fontWeight: 500, textAlign:'center' }}>{n}</div>
              <div className="font-mono" style={{ fontSize: 10, color:'var(--ink-faint)' }}>{k}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* --- SPACING & RULES --- */}
      <Section title="Rules, spacing, motion">
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px,1fr))', gap: 28 }}>
          <div>
            <Eyebrow>Hairlines</Eyebrow>
            <div style={{ height: 1, background: 'var(--rule)', margin: '10px 0' }} />
            <div style={{ height: 1, background: 'var(--rule-soft)', margin: '10px 0' }} />
            <div style={{ fontSize: 12, color: 'var(--ink-mute)' }}>0.5–1px · var(--rule) for structure · var(--rule-soft) for row dividers inside cards</div>
          </div>
          <div>
            <Eyebrow>Space scale</Eyebrow>
            <div style={{display:'flex', gap: 4, marginTop: 8, alignItems:'flex-end'}}>
              {[4,8,14,18,24,32,48].map(s => (
                <div key={s} style={{width: 10, height: s, background:'var(--ink)'}} />
              ))}
            </div>
            <div className="font-mono" style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 8 }}>4 · 8 · 14 · 18 · 24 · 32 · 48</div>
          </div>
          <div>
            <Eyebrow>Motion</Eyebrow>
            <div style={{ fontSize: 12.5, color:'var(--ink-soft)', lineHeight: 1.7, marginTop: 8 }}>
              160ms ease for UI transitions. Hover lifts 1px and steps the shadow one level. No bounces or springs.
            </div>
          </div>
        </div>
      </Section>

      {/* --- USAGE --- */}
      <Section title="Voice & usage">
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 28}} className="grid-2col">
          <div style={usageCard('do')}>
            <Eyebrow color="accent">Do</Eyebrow>
            <ul style={ul}>
              <li>Use italic serif for dates and piece titles.</li>
              <li>Plain-prose language — “Cancellations close 24 hours before.”</li>
              <li>One accent per view. Empty states are italic serif, muted.</li>
              <li>Monospace for times (2:20pm), dates in metadata, counts.</li>
            </ul>
          </div>
          <div style={usageCard('dont')}>
            <Eyebrow>Don't</Eyebrow>
            <ul style={ul}>
              <li>No gradients, no drop shadows on cards, no icons-as-decoration.</li>
              <li>No emoji. No exclamation points.</li>
              <li>Don't mix serif styles — pick italic OR roman per region.</li>
              <li>Never force “Submit”, “Confirm OK” — use verbs (“Reserve”, “Publish”).</li>
            </ul>
          </div>
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section style={{ marginBottom: 72 }}>
      <div style={{ display:'flex', alignItems:'baseline', gap: 16, marginBottom: 24 }}>
        <div className="font-mono" style={{ fontSize: 11, color:'var(--ink-mute)' }}>§</div>
        <h2 className="font-serif" style={{ fontSize: 32, fontStyle:'italic', fontWeight: 400, margin: 0, letterSpacing:'-0.01em' }}>
          {title}
        </h2>
        <div style={{ flex:1, height: 1, background: 'var(--rule)', position:'relative', top: -6 }} />
      </div>
      {children}
    </section>
  );
}
function TypeSpec({ name, size, family, children, style }) {
  return (
    <div style={{
      display:'grid', gridTemplateColumns: '180px 1fr 160px', gap: 20,
      padding: '18px 0', borderBottom: '0.5px solid var(--rule-soft)', alignItems:'baseline',
    }}>
      <div style={{ fontSize: 11, color:'var(--ink-mute)' }}>{name}</div>
      <div style={style}>{children}</div>
      <div className="font-mono" style={{ fontSize: 10.5, color:'var(--ink-mute)', textAlign:'right' }}>
        {family} · {size}px
      </div>
    </div>
  );
}
function DSGrid({ children }) {
  return <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap: 18 }}>{children}</div>;
}
function DSCard({ label, children }) {
  return (
    <div style={{ border:'1px solid var(--rule-soft)', background:'var(--paper)', padding: 20, minHeight: 120, display:'flex', flexDirection:'column', gap: 12, borderRadius: 20, boxShadow:'var(--shadow-xs)' }}>
      <div style={{ fontSize: 10, letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--ink-mute)' }}>{label}</div>
      <div style={{ flex:1 }}>{children}</div>
    </div>
  );
}
function SlotRowDemo({ kind }) {
  return (
    <div style={{ background: kind==='mine' ? 'var(--green-soft)' : 'var(--paper)', padding:'12px 14px', display:'flex', alignItems:'center', gap: 14, border:'0.5px solid var(--rule-soft)', borderRadius: 12 }}>
      <div className="font-mono" style={{ fontSize: 13, width: 60 }}>2:20pm</div>
      <div style={{flex:1}}>
        {kind==='free' && <span className="font-serif" style={{fontSize:13, fontStyle:'italic', color:'var(--ink-soft)'}}>Available</span>}
        {kind==='mine' && <Pill color="green">Your lesson</Pill>}
        {kind==='taken' && <span style={{fontSize:13, color:'var(--ink-mute)'}}>Booked by Ding Zhou</span>}
      </div>
      {kind==='free' && <Button size="sm">Reserve</Button>}
      {kind==='mine' && <Button size="sm" variant="danger">Cancel</Button>}
      {kind==='taken' && <span style={{fontSize:11, color:'var(--ink-mute)'}}>Swap</span>}
    </div>
  );
}
const prose = { fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.65, maxWidth: 640, margin: 0 };
const ul = { fontSize: 13, lineHeight: 1.75, color:'var(--ink-soft)', margin: '8px 0 0 0', paddingLeft: 16 };
const usageCard = (kind) => ({
  padding: 22, border: '1px solid var(--rule-soft)',
  borderLeft: `3px solid ${kind==='do' ? 'var(--green)' : 'var(--accent)'}`,
  background: 'var(--paper)', borderRadius: 18, boxShadow:'var(--shadow-xs)',
});

Object.assign(window, { DesignSystemPage });
