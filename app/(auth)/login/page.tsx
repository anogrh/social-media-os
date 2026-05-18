'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
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
    <>
      <div style={{
        minHeight: '100vh',
        background: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Inter', system-ui, sans-serif",
        position: 'relative',
      }}>

        {/* Logo — topo esquerdo */}
        <div style={{ position: 'absolute', top: 28, left: 32, zIndex: 10 }}>
          <img src="/logo.svg" alt="R." style={{ width: 48, height: 48, borderRadius: '50%' }} />
        </div>

        {/* Conteúdo central */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 24px 40px',
        }}>

          {/* Heading */}
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h1 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(52px, 8vw, 88px)',
              fontWeight: 700,
              color: '#292929',
              lineHeight: 1.05,
              margin: 0,
              letterSpacing: '-1px',
            }}>
              Bem-vinda
            </h1>
            <h1 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(52px, 8vw, 88px)',
              fontWeight: 700,
              fontStyle: 'italic',
              color: '#FC75A0',
              lineHeight: 1.05,
              margin: '0 0 16px',
              letterSpacing: '-1px',
            }}>
              de volta!
            </h1>
            <p style={{
              fontSize: 16,
              color: 'rgba(41,41,41,0.55)',
              margin: 0,
            }}>
              Entre na sua conta para continuar
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleLogin}
            style={{
              width: '100%',
              maxWidth: 360,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#292929', marginBottom: 8 }}>
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
                  border: '1.5px solid rgba(41,41,41,0.15)', borderRadius: 14,
                  padding: '14px 16px', fontSize: 15,
                  background: '#FFFFFF', color: '#292929',
                  outline: 'none', transition: 'border-color 0.15s',
                  fontFamily: "'Inter', system-ui, sans-serif",
                }}
                onFocus={e => (e.target.style.borderColor = '#FC75A0')}
                onBlur={e => (e.target.style.borderColor = 'rgba(41,41,41,0.15)')}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#292929', marginBottom: 8 }}>
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
                    border: '1.5px solid rgba(41,41,41,0.15)', borderRadius: 14,
                    padding: '14px 48px 14px 16px', fontSize: 15,
                    background: '#FFFFFF', color: '#292929',
                    outline: 'none', transition: 'border-color 0.15s',
                    fontFamily: "'Inter', system-ui, sans-serif",
                  }}
                  onFocus={e => (e.target.style.borderColor = '#FC75A0')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(41,41,41,0.15)')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                    color: 'rgba(41,41,41,0.35)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex',
                  }}
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
                background: loading ? 'rgba(252,117,160,0.6)' : '#FC75A0',
                color: '#FFFFFF', border: 'none', borderRadius: 999,
                padding: '16px 24px', fontSize: 13, fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                cursor: loading ? 'wait' : 'pointer', marginTop: 6,
                transition: 'background 0.15s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                width: '100%', fontFamily: "'Inter', system-ui, sans-serif",
              }}
            >
              {loading ? (
                <>
                  <span style={{ width: 15, height: 15, border: '2px solid rgba(255,255,255,0.4)', borderTop: '2px solid #FFFFFF', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                  Entrando...
                </>
              ) : 'Acesse agora'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div style={{ padding: '20px 32px' }}>
          <p style={{ fontSize: 12, color: '#FC75A0', margin: 0 }}>
            Social Media Os by Rhania Araújo
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  )
}
