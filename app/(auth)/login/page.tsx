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
    <>
      <div className="login-root">

        {/* ── Banner (esquerda no desktop / topo no mobile) ── */}
        <div className="login-banner">
          {/* Blobs decorativos */}
          <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', background: '#F25BA5', opacity: 0.15 }} />
          <div style={{ position: 'absolute', bottom: 60, left: -60, width: 200, height: 200, borderRadius: '50%', background: '#F19877', opacity: 0.12 }} />
          <div style={{ position: 'absolute', top: '40%', left: '30%', width: 120, height: 120, borderRadius: '50%', background: '#FBD0DA', opacity: 0.08 }} />
          <div style={{ position: 'absolute', bottom: 200, right: 100, width: 80, height: 80, background: '#F2F4A4', opacity: 0.10, transform: 'rotate(20deg)' }} />

          {/* Logo */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ background: '#F25BA5', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Sparkles size={16} color="#FFFFFF" />
              </div>
              <div>
                <span style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#FFFFFF', fontWeight: 600, fontSize: 20 }}>rhania.</span>
                <span style={{ display: 'block', color: 'rgba(255,252,236,0.4)', fontSize: 11, letterSpacing: '0.08em' }}>araújo</span>
              </div>
            </div>
          </div>

          {/* Headline */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h1 className="login-headline">
              Sua operação.{' '}
              <span style={{ color: '#F25BA5', fontWeight: 700 }}>Centralizada.</span>
            </h1>
            <p className="login-sub">
              Gerencie todos os seus clientes, conteúdos, métricas e pagamentos em um único lugar.
            </p>
          </div>

          <p style={{ position: 'relative', zIndex: 1, color: 'rgba(255,252,236,0.25)', fontSize: 12 }}>
            Social Media OS · Rhania Araújo
          </p>
        </div>

        {/* ── Formulário (direita no desktop / baixo no mobile) ── */}
        <div className="login-form-col">
          <div className="login-form-inner">

            {/* Heading */}
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 30, fontWeight: 700, color: '#1F1B1A', lineHeight: 1.2, marginBottom: 8 }}>
                Bem-vinda de{' '}
                <span style={{ color: '#F25BA5', fontWeight: 700 }}>volta</span>
              </h2>
              <p style={{ color: 'rgba(31,27,26,0.5)', fontSize: 14 }}>Entre na sua conta para continuar</p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1F1B1A', marginBottom: 8, fontFamily: "'Inter', system-ui, sans-serif" }}>
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
                    fontFamily: "'Inter', system-ui, sans-serif",
                  }}
                  onFocus={e => (e.target.style.borderColor = '#F25BA5')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(31,27,26,0.15)')}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1F1B1A', marginBottom: 8, fontFamily: "'Inter', system-ui, sans-serif" }}>
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
                      fontFamily: "'Inter', system-ui, sans-serif",
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
                <p style={{ fontSize: 13, color: '#EE3528', background: '#fee2e2', borderRadius: 10, padding: '10px 14px', lineHeight: 1.5, fontFamily: "'Inter', system-ui, sans-serif" }}>
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
                  fontFamily: "'Inter', system-ui, sans-serif",
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
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Layout root ── */
        .login-root {
          min-height: 100vh;
          display: flex;
          flex-direction: row;
          background: #FFFFFF;
          font-family: 'Inter', system-ui, sans-serif;
        }

        /* ── Banner ── */
        .login-banner {
          flex: 1;
          background: #1F1B1A;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 48px;
        }

        .login-headline {
          font-family: 'Playfair Display', Georgia, serif;
          color: #FFFFFF;
          font-size: 56px;
          font-weight: 700;
          line-height: 1.15;
          margin-bottom: 20px;
        }

        .login-sub {
          color: rgba(255,252,236,0.6);
          font-size: 16px;
          line-height: 1.7;
          max-width: 380px;
        }

        /* ── Form column ── */
        .login-form-col {
          width: 460px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-height: 100vh;
          background: #FFFFFF;
        }

        .login-form-inner {
          padding: 48px 48px;
        }

        /* ── Mobile: empilha banner em cima, form embaixo ── */
        @media (max-width: 768px) {
          .login-root {
            flex-direction: column;
          }

          .login-banner {
            flex: none;
            min-height: 260px;
            padding: 36px 28px;
            justify-content: flex-end;
            gap: 20px;
          }

          .login-headline {
            font-size: 34px;
            margin-bottom: 12px;
          }

          .login-sub {
            font-size: 14px;
            max-width: 100%;
          }

          .login-form-col {
            width: 100%;
            min-height: unset;
            justify-content: flex-start;
          }

          .login-form-inner {
            padding: 36px 24px 48px;
          }
        }

        @media (max-width: 480px) {
          .login-banner {
            min-height: 220px;
            padding: 28px 20px;
          }

          .login-headline {
            font-size: 28px;
          }

          .login-form-inner {
            padding: 28px 20px 48px;
          }
        }
      `}</style>
    </>
  )
}
