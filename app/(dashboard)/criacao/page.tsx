'use client'

import { useRouter } from 'next/navigation'
import { Video, LayoutGrid, BookImage, Search, Megaphone, TrendingUp, Sparkles, ArrowRight } from 'lucide-react'
import Header from '@/components/layout/Header'

const modules = [
  {
    href: '/criacao/reels',
    icon: Video,
    label: 'Reels',
    description: 'Roteiros completos com hook, desenvolvimento, CTA e direção visual.',
    color: '#FC75A0',
    bg: 'rgba(252,117,160,0.08)',
    badge: 'Alta performance',
  },
  {
    href: '/criacao/carrossel',
    icon: LayoutGrid,
    label: 'Carrossel',
    description: 'Carrosséis estratégicos com capa magnética, slides e legenda pronta.',
    color: '#F19877',
    bg: 'rgba(241,152,119,0.08)',
    badge: 'Salvamento',
  },
  {
    href: '/criacao/stories',
    icon: BookImage,
    label: 'Stories',
    description: 'Sequências de 4 a 6 stories com texto, fundo e ferramentas de engajamento.',
    color: '#8B5CF6',
    bg: 'rgba(139,92,246,0.08)',
    badge: 'Conversão',
  },
  {
    href: '/criacao/analise',
    icon: Search,
    label: 'Análise de Perfil',
    description: 'Diagnóstico completo: bio, pilares editoriais, pontos fracos e próximos conteúdos.',
    color: '#3B82F6',
    bg: 'rgba(59,130,246,0.08)',
    badge: 'Estratégia',
  },
  {
    href: '/criacao/campanhas',
    icon: Megaphone,
    label: 'Campanhas',
    description: 'Gerencie campanhas ativas e ative contexto para gerar conteúdo conectado.',
    color: '#10B981',
    bg: 'rgba(16,185,129,0.08)',
    badge: 'Comercial',
  },
  {
    href: '/criacao/aprendizado',
    icon: TrendingUp,
    label: 'Aprendizado',
    description: 'Registre resultados, o que funcionou e o que evitar. A IA aprende com cada cliente.',
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.08)',
    badge: 'Melhoria contínua',
  },
]

export default function CriacaoPage() {
  const router = useRouter()
  const font = "'Inter', system-ui, sans-serif"

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Header title="Criação com IA" subtitle="Central estratégica de criação de conteúdo" />

      <div className="page-pad" style={{ fontFamily: font }}>
        {/* Hero */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(252,117,160,0.1) 0%, rgba(241,152,119,0.06) 100%)',
          border: '1px solid rgba(252,117,160,0.2)',
          borderRadius: 20, padding: '32px 36px', marginBottom: 32,
          display: 'flex', alignItems: 'center', gap: 20,
        }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: '#FC75A0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Sparkles size={24} color="#FFFFFF" />
          </div>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
              Conteúdo com estratégia, não só com tema
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6, maxWidth: 640 }}>
              Antes de criar, a IA considera: cliente, objetivo de funil, campanha ativa, tom de voz e histórico de resultados.
              Cada peça entregue com texto pronto, direção visual e CTA coerente.
            </p>
          </div>
        </div>

        {/* Modules grid */}
        <div className="rg-3" style={{ gap: 16 }}>
          {modules.map(m => {
            const Icon = m.icon
            return (
              <button
                key={m.href}
                onClick={() => router.push(m.href)}
                style={{
                  background: 'var(--bg)', border: '1px solid var(--border)',
                  borderRadius: 16, padding: 24, cursor: 'pointer',
                  textAlign: 'left', transition: 'all 0.15s',
                  display: 'flex', flexDirection: 'column', gap: 16,
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget
                  el.style.borderColor = m.color
                  el.style.boxShadow = `0 4px 24px ${m.bg}`
                  el.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget
                  el.style.borderColor = 'var(--border)'
                  el.style.boxShadow = 'none'
                  el.style.transform = 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: m.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={20} color={m.color} />
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 999, background: m.bg, color: m.color, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    {m.badge}
                  </span>
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 17, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>
                    {m.label}
                  </h3>
                  <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>
                    {m.description}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: m.color, fontSize: 12, fontWeight: 700 }}>
                  Abrir módulo <ArrowRight size={13} />
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
