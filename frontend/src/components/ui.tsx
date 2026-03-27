import { forwardRef, type ButtonHTMLAttributes, type InputHTMLAttributes, type SelectHTMLAttributes, type ReactNode } from 'react'

// ── Button ───────────────────────────────────────────────────────────────────
type BtnVariant = 'primary' | 'ghost' | 'danger'
interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant
  loading?: boolean
  size?: 'sm' | 'md'
}
export function Button({ variant = 'primary', loading, size = 'md', children, disabled, ...rest }: BtnProps) {
  const base: Record<BtnVariant, React.CSSProperties> = {
    primary: { background: 'var(--accent)', color: '#fff', border: 'none' },
    ghost:   { background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)' },
    danger:  { background: 'var(--danger)', color: '#fff', border: 'none' },
  }
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        borderRadius: 'var(--radius)', fontWeight: 500,
        padding: size === 'sm' ? '6px 12px' : '8px 16px',
        fontSize: size === 'sm' ? 13 : 14,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled || loading ? 0.5 : 1,
        fontFamily: 'inherit', transition: 'opacity .15s',
        ...base[variant], ...rest.style,
      }}
    >
      {loading && <Spinner size={14} />}
      {children}
    </button>
  )
}

// ── Input ────────────────────────────────────────────────────────────────────
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, ...rest }, ref) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {label && <label style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>{label}</label>}
      <input
        ref={ref}
        {...rest}
        style={{
          background: 'var(--surface2)',
          border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
          borderRadius: 'var(--radius)', padding: '8px 12px',
          color: 'var(--text)', outline: 'none', width: '100%', fontSize: 14,
          fontFamily: 'inherit', ...rest.style,
        }}
      />
      {error && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{error}</span>}
    </div>
  )
)
Input.displayName = 'Input'

// ── Select ───────────────────────────────────────────────────────────────────
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
}
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, children, ...rest }, ref) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {label && <label style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>{label}</label>}
      <select
        ref={ref}
        {...rest}
        style={{
          background: 'var(--surface2)',
          border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
          borderRadius: 'var(--radius)', padding: '8px 12px',
          color: 'var(--text)', outline: 'none', width: '100%', fontSize: 14,
          fontFamily: 'inherit', ...rest.style,
        }}
      >
        {children}
      </select>
      {error && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{error}</span>}
    </div>
  )
)
Select.displayName = 'Select'

// ── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20, ...style }}>
      {children}
    </div>
  )
}

// ── Badges ───────────────────────────────────────────────────────────────────
const STATUS_COLORS: Record<string, string> = { TODO: '#4f8ef7', IN_PROGRESS: '#f5a623', DONE: '#34c98b' }
const PRIORITY_COLORS: Record<string, string> = { LOW: '#7a8499', MEDIUM: '#f5a623', HIGH: '#ef4444' }

export function StatusBadge({ status }: { status: string }) {
  const c = STATUS_COLORS[status] ?? '#888'
  return <span style={{ background: c+'22', color: c, border: `1px solid ${c}44`, borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>{status.replace('_',' ')}</span>
}
export function PriorityBadge({ priority }: { priority: string }) {
  const c = PRIORITY_COLORS[priority] ?? '#888'
  return <span style={{ background: c+'22', color: c, border: `1px solid ${c}44`, borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 600 }}>{priority}</span>
}

// ── Spinner ───────────────────────────────────────────────────────────────────
export function Spinner({ size = 20 }: { size?: number }) {
  return <span style={{ display: 'inline-block', width: size, height: size, border: `2px solid var(--border)`, borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin .7s linear infinite', flexShrink: 0 }} />
}

// ── Modal ─────────────────────────────────────────────────────────────────────
export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 16 }}>
      <div onClick={e => e.stopPropagation()} className="fade-in" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 28, width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--shadow)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 20 }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 22, cursor: 'pointer' }}>×</button>
        </div>
        {children}
      </div>
    </div>
  )
}
