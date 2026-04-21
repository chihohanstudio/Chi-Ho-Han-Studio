// Shared primitives — Button, Pill, PageHeader, Stat, Icons (Lucide via unicode/SVG inline)
// Uses React from globals.

const { useState, useEffect, useRef, useMemo, createContext, useContext } = React;

// --- tiny inline SVG icons (stroke 1.5) -------------------------------------
const I = ({ d, size = 14, w = 1.5, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
    {children || <path d={d} />}
  </svg>
);
const Icon = {
  check:   (p)=><I size={p?.size||14} w={p?.w||2} d="M20 6L9 17l-5-5"/>,
  x:       (p)=><I size={p?.size||14} d="M18 6L6 18M6 6l12 12"/>,
  plus:    (p)=><I size={p?.size||14} d="M12 5v14M5 12h14"/>,
  minus:   (p)=><I size={p?.size||14} d="M5 12h14"/>,
  arrowL:  (p)=><I size={p?.size||14} d="M19 12H5M12 19l-7-7 7-7"/>,
  chev:    (p)=><I size={p?.size||14} d="M9 18l6-6-6-6"/>,
  chevDown:(p)=><I size={p?.size||14} d="M6 9l6 6 6-6"/>,
  swap:    (p)=><I size={p?.size||14}><path d="M8 3L4 7l4 4"/><path d="M4 7h16"/><path d="M16 21l4-4-4-4"/><path d="M20 17H4"/></I>,
  trash:   (p)=><I size={p?.size||14}><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0l-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"/></I>,
  pencil:  (p)=><I size={p?.size||14} d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>,
  archive: (p)=><I size={p?.size||14}><path d="M21 8v13H3V8M1 3h22v5H1zM10 12h4"/></I>,
  rotate:  (p)=><I size={p?.size||14}><path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/></I>,
  mail:    (p)=><I size={p?.size||14}><path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/><path d="M22 6l-10 7L2 6"/></I>,
  logout:  (p)=><I size={p?.size||14}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></I>,
  cal:     (p)=><I size={p?.size||14}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><path d="M16 2v4M8 2v4M3 10h18"/></I>,
  clock:   (p)=><I size={p?.size||14}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></I>,
  users:   (p)=><I size={p?.size||14}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></I>,
  book:    (p)=><I size={p?.size||14}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></I>,
  file:    (p)=><I size={p?.size||14}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></I>,
  ban:     (p)=><I size={p?.size||14}><circle cx="12" cy="12" r="10"/><path d="M4.93 4.93l14.14 14.14"/></I>,
  undo:    (p)=><I size={p?.size||14}><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-15-6.7L3 13"/></I>,
  bold:    (p)=><I size={p?.size||14}><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6zM6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></I>,
  underline:(p)=><I size={p?.size||14}><path d="M6 3v7a6 6 0 0 0 12 0V3M4 21h16"/></I>,
  link:    (p)=><I size={p?.size||14}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></I>,
  heading: (p)=><I size={p?.size||14}><path d="M6 4v16M18 4v16M6 12h12"/></I>,
  search:  (p)=><I size={p?.size||14}><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></I>,
  moon:    (p)=><I size={p?.size||14} d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>,
  sun:     (p)=><I size={p?.size||14}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></I>,
};

// --- Button ------------------------------------------------------------------
function Button({ children, onClick, variant = 'primary', size = 'md', disabled, style = {}, type, title, round }) {
  const base = {
    fontFamily: 'Inter, sans-serif', fontWeight: 500, letterSpacing: '-0.005em',
    borderRadius: round ? '50%' : 'var(--r-sm)',
    transition: 'all 160ms ease',
    cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.4 : 1,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    gap: 8, whiteSpace: 'nowrap',
  };
  const sizes = round ? {
    sm: { width: 30, height: 30, padding: 0, fontSize: 12 },
    md: { width: 38, height: 38, padding: 0, fontSize: 13 },
    lg: { width: 46, height: 46, padding: 0, fontSize: 14 },
  } : {
    sm: { padding: '7px 14px', fontSize: 12.5 },
    md: { padding: '10px 20px', fontSize: 13.5 },
    lg: { padding: '13px 28px', fontSize: 14.5 },
  };
  const variants = {
    primary:   { background: 'var(--ink)', color: 'var(--paper)', border: '1px solid var(--ink)', boxShadow: 'var(--shadow-xs)' },
    accent:    { background: 'var(--accent)', color: 'var(--paper)', border: '1px solid var(--accent)', boxShadow: 'var(--shadow-xs)' },
    outline:   { background: 'transparent', color: 'var(--ink)', border: '1px solid var(--ink)' },
    secondary: { background: 'var(--paper)', color: 'var(--ink)', border: '1px solid var(--ink)' },
    ghost:     { background: 'transparent', color: 'var(--ink-soft)', border: '1px solid transparent' },
    danger:    { background: 'transparent', color: 'var(--accent-strong)', border: '1px solid var(--accent)' },
  };
  return (
    <button type={type} disabled={disabled} onClick={onClick} title={title}
      style={{ ...base, ...sizes[size], ...variants[variant], ...style }}
      onMouseEnter={e => {
        if (disabled) return;
        e.currentTarget.style.transform = 'translateY(-1px)';
        if (variant === 'primary' || variant === 'accent') e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
        if (variant === 'ghost') e.currentTarget.style.background = 'var(--paper-soft)';
      }}
      onMouseLeave={e => {
        if (disabled) return;
        e.currentTarget.style.transform = 'translateY(0)';
        if (variant === 'primary' || variant === 'accent') e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
        if (variant === 'ghost') e.currentTarget.style.background = 'transparent';
      }}>
      {children}
    </button>
  );
}

// --- Pill --------------------------------------------------------------------
function Pill({ children, color = 'neutral', style = {} }) {
  const palettes = {
    neutral: { bg: 'var(--paper-soft)', fg: 'var(--ink-soft)', border: 'var(--rule)' },
    green:   { bg: 'var(--green-soft)', fg: 'var(--green)', border: '#B5C5BC' },
    accent:  { bg: '#F1DDD6', fg: 'var(--accent-strong)', border: '#E5C3B7' },
    dark:    { bg: 'var(--ink)', fg: 'var(--paper)', border: 'var(--ink)' },
  };
  const p = palettes[color];
  return (
    <span style={{
      fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500,
      padding: '4px 10px', background: p.bg, color: p.fg,
      border: `0.5px solid ${p.border}`, borderRadius: 'var(--r-xs)', fontFamily: 'Inter, sans-serif',
      display: 'inline-block', ...style,
    }}>{children}</span>
  );
}

// --- PageHeader --------------------------------------------------------------
function PageHeader({ eyebrow, title, subtitle, actions }) {
  return (
    <div style={{ marginBottom: 36 }}>
      {eyebrow && (
        <div style={{
          fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase',
          color: 'var(--ink-mute)', marginBottom: 10,
        }}>{eyebrow}</div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
        <h1 className="font-serif responsive-title" style={{
          fontWeight: 400, margin: 0, lineHeight: 1.1, letterSpacing: '-0.015em',
        }}>{title}</h1>
        {actions && <div>{actions}</div>}
      </div>
      {subtitle && (
        <p style={{ fontSize: 14, color: 'var(--ink-soft)', marginTop: 10, lineHeight: 1.55, maxWidth: 560 }}>
          {subtitle}
        </p>
      )}
      <div style={{ height: 1, background: 'var(--rule)', marginTop: 24 }} />
    </div>
  );
}

// --- Stat --------------------------------------------------------------------
function Stat({ label, value, muted, big = 42 }) {
  return (
    <div>
      <div style={{
        fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
        color: 'var(--ink-mute)', marginBottom: 8,
      }}>{label}</div>
      <div className="font-serif" style={{
        fontSize: big, fontWeight: 400, lineHeight: 1,
        color: muted ? 'var(--ink-mute)' : 'var(--ink)',
      }}>{value}</div>
    </div>
  );
}

// --- Empty state text --------------------------------------------------------
function Muted({ children }) {
  return <p style={{ fontSize: 13, color: 'var(--ink-mute)', fontStyle: 'italic' }} className="font-serif">{children}</p>;
}

// --- Eyebrow (small caps label) ---------------------------------------------
function Eyebrow({ children, color = 'mute', mb = 10, ls = '0.16em' }) {
  const c = color === 'accent' ? 'var(--accent)' : color === 'soft' ? 'var(--ink-soft)' : 'var(--ink-mute)';
  return (
    <div style={{
      fontSize: 10, letterSpacing: ls, textTransform: 'uppercase',
      color: c, marginBottom: mb, fontWeight: 500,
    }}>{children}</div>
  );
}

// --- Section heading --------------------------------------------------------
function SectionH({ children, size = 18, mb = 16, count }) {
  return (
    <h2 className="font-serif" style={{
      fontSize: size, fontStyle: 'italic', fontWeight: 400, margin: `0 0 ${mb}px`,
    }}>
      {children}
      {count != null && <span style={{ fontSize: 12, fontStyle: 'normal', color: 'var(--ink-mute)', marginLeft: 8 }}>({count})</span>}
    </h2>
  );
}

Object.assign(window, { Button, Pill, PageHeader, Stat, Muted, Eyebrow, SectionH, Icon });
