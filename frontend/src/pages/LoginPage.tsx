import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { LogIn, CheckSquare } from 'lucide-react'
import { login } from '../api/tasks'
import { useAuth } from '../context/AuthContext'
import { Button, Spinner } from '../components/ui'

interface FormData { username: string; password: string }

export default function LoginPage() {
  const { signIn }    = useAuth()
  const navigate      = useNavigate()
  const [err, setErr] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    setErr('')
    try {
      const res = await login(data.username, data.password)
      signIn(res.token, res.user)
      navigate('/')
    } catch {
      setErr('Invalid username or password')
    }
  }

  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    background: 'var(--surface2)',
    border: `1px solid ${hasError ? 'var(--danger)' : 'var(--border)'}`,
    borderRadius: 'var(--radius)',
    padding: '10px 14px',
    color: 'var(--text)',
    outline: 'none',
    width: '100%',
    fontSize: 14,
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  })

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }}>
      {/* Glow blobs */}
      <div style={{ position: 'fixed', top: '-10%', right: '-10%', width: 500, height: 500, background: 'radial-gradient(circle, #4f8ef722 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-10%', left: '-10%', width: 400, height: 400, background: 'radial-gradient(circle, #34c98b11 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div className="fade-in" style={{ width: '100%', maxWidth: 420, position: 'relative' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56, background: 'var(--accent)', borderRadius: 16, marginBottom: 16 }}>
            <CheckSquare size={28} color="#fff" />
          </div>
          <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 30, letterSpacing: '-1px' }}>Task Manager</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>Sign in to manage your work</p>
        </div>

        {/* Card */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 32, boxShadow: 'var(--shadow)' }}>
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* Username */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>Username</label>
              <input
                placeholder="e.g. admin"
                autoFocus
                style={inputStyle(!!errors.username)}
                {...register('username', { required: 'Username is required' })}
              />
              {errors.username && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{errors.username.message}</span>}
            </div>

            {/* Password */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                style={inputStyle(!!errors.password)}
                {...register('password', { required: 'Password is required' })}
              />
              {errors.password && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{errors.password.message}</span>}
            </div>

            {/* API error */}
            {err && (
              <div style={{ background: '#ef444422', border: '1px solid #ef444444', borderRadius: 8, padding: '10px 14px', color: 'var(--danger)', fontSize: 13 }}>
                {err}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                background: 'var(--accent)', color: '#fff', border: 'none',
                borderRadius: 'var(--radius)', padding: '10px 16px', fontSize: 15,
                fontWeight: 600, fontFamily: 'inherit',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1, marginTop: 4,
              }}
            >
              {isSubmitting ? <Spinner size={16} /> : <LogIn size={16} />}
              Sign In
            </button>
          </form>

          <p style={{ marginTop: 20, color: 'var(--text-muted)', fontSize: 12, textAlign: 'center' }}>
            Demo credentials: <strong style={{ color: 'var(--text)' }}>admin</strong> / <strong style={{ color: 'var(--text)' }}>password123</strong>
          </p>
        </div>
      </div>
    </div>
  )
}
