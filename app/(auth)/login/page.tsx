'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Sparkles } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) {
      setError(authError.message)
      setLoading(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#FFFFFF', fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── Left — editorial (desktop only) ──────────────── */}
      <div
        style={{ flex: 1, background: '#1F1B1A', position: 'relative', overflow: 'hidden', flexDirection: 'column', justifyContent: 'space-between', padding: '48px' }}
        className="hidden lg:flex"
      >
        <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', background: '#F25BA5', opacity: 0.15 }} />
        <div style={{ position: 'absolute', bottom: 60, left: -60, width: 200, height: 200, borderRadius: '50%', background: '#F19877', opacity: 0.12 }} />
        <div style={{ position: 'absolute', top: '40%', left: '30%', width: 120, height: 120, borderRadius: '50%', background: '#FBD0DA', opacity: 0.08 }} />
        <div style={{ position: 'absolute', bottom: 200, right: 100, width: 80, height: 80, background: '#F2F4A4', opacity: 0.10, transform: 'rotate(20deg)' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ background: '#F25BA5', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={16} color="#FFFFFF" />
            </div>
            <div>
              <span style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#FFFFFF', fontWeight: 600, fontSize: 20 }}>rhania.</span>
              <span style={{ display: 'block', color: 'rgba(255,252,236,0.4)', fontSize: 11, letterSpacing: '0.08em' }}>araújo</span>
            </div>
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#FFFFFF', fontSize: 56, fontWeight: 700, lineHeight: 1.15, marginBottom: 24 }}>
            Sua operação.{' '}
            <span style={{ color: '#F25BA5', fontWeight: 700 }}>Centralizada.</span>
          </h1>
          <p style={{ color: 'rgba(255,252,236,0.6)', fontSize: 16, lineHeight: 1.7, maxWidth: 380 }}>
            Gerencie todos os seus clientes, conteúdos, métricas e pagamentos em um único lugar.
          </p>
        </div>

        <p style={{ position: 'relative', zIndex: 1, color: 'rgba(255,252,236,0.25)', fontSize: 12 }}>
          Social Media OS · Rhania Araújo
        </p>
      </div>

      {/* ── Right — form ─────────────────────────────────── */}
      <div style={{ width: '100%', maxWidth: 480, marginLeft: 'auto', marginRight: 'auto', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Scrollable inner wrapper */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px 40px' }} className="login-inner">

          {/* Mobile logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 36 }} className="lg:hidden">
            <div style={{ background: '#F25BA5', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={16} color="#FFFFFF" />
            </div>
            <div>
              <span style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#1F1B1A', fontWeight: 600, fontSize: 20 }}>rhania.</span>
              <span style={{ display: 'block', color: 'rgba(31,27,26,0.4)', fontSize: 11, letterSpacing: '0.08em' }}>araújo</span>
            </div>
          </div>

          {/* Heading */}
          <div style={{ marginBottom: 36 }}>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 32, fontWeight: 700, color: '#1F1B1A', lineHeight: 1.2, marginBottom: 8 }}>
              Bem-vinda de{' '}
              <span style={{ color: '#F25BA5', fontWeight: 700 }}>volta</span>
            </h2>
            <p style={{ color: 'rgba(31,27,26,0.5)', fontSize: 14 }}>Entre na sua conta para continuar</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1F1B1A', marginBottom: 8 }}>
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                autoComplete="email"
                style={{
                  width: '100%', boxSizing: 'border-box',
                  border: '1px solid rgba(31,27,26,0.15)', borderRadius: 16,
                  padding: '13px 16px', fontSize: 15,
                  background: '#F5F4F2', color: '#1F1B1A',
                  outline: 'none', transition: 'border-color 0.15s',
                }}
                onFocus={e => (e.target.style.borderColor = '#F25BA5')}
                onBlur={e => (e.target.style.borderColor = 'rgba(31,27,26,0.15)')}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1F1B1A', marginBottom: 8 }}>
                Senha
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    border: '1px solid rgba(31,27,26,0.15)', borderRadius: 16,
                    padding: '13px 48px 13px 16px', fontSize: 15,
                    background: '#F5F4F2', color: '#1F1B1A',
                    outline: 'none', transition: 'border-color 0.15s',
                  }}
                  onFocus={e => (e.target.style.borderColor = '#F25BA5')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(31,27,26,0.15)')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(31,27,26,0.4)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <p style={{ fontSize: 13, color: '#EE3528', background: '#fee2e2', borderRadius: 10, padding: '10px 14px', lineHeight: 1.5 }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading ? 'rgba(242,91,165,0.6)' : '#F25BA5',
                color: '#FFFFFF', border: 'none', borderRadius: 999,
                padding: '15px 24px', fontSize: 15, fontWeight: 700,
                cursor: loading ? 'wait' : 'pointer', marginTop: 4,
                transition: 'background 0.15s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                width: '100%',
              }}
            >
              {loading ? (
                <>
                  <span style={{ width: 16, height: 16, border: '2px solid rgba(255,252,236,0.4)', borderTop: '2px solid #FFFFFF', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                  Entrando...
                </>
              ) : 'Entrar na plataforma'}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .login-inner { padding: 40px; }
        @media (max-width: 480px) {
          .login-inner { padding: 32px 24px; justify-content: flex-start !important; padding-top: 48px; }
        }
      `}</style>
    </div>
  )
}
