export default function Button({ children, onClick, variant = 'primary', size = 'md', disabled, style = {}, type, title, round }) {
  const base = {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 500,
    letterSpacing: '-0.005em',
    borderRadius: round ? '50%' : 'var(--r-sm)',
    transition: 'all 160ms ease',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    whiteSpace: 'nowrap',
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
    primary: { background: 'var(--ink)', color: 'var(--paper)', border: '1px solid var(--ink)', boxShadow: 'var(--shadow-xs)' },
    secondary: { background: 'var(--paper)', color: 'var(--ink)', border: '1px solid var(--ink)' },
    ghost: { background: 'transparent', color: 'var(--ink-soft)', border: '1px solid transparent' },
    danger: { background: 'transparent', color: 'var(--accent-strong)', border: '1px solid var(--accent)' },
  };
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      title={title}
      style={{ ...base, ...sizes[size], ...variants[variant], ...style }}
      onMouseEnter={e => !disabled && (e.currentTarget.style.transform = 'translateY(-1px)')}
      onMouseLeave={e => !disabled && (e.currentTarget.style.transform = 'translateY(0)')}
    >
      {children}
    </button>
  );
}
