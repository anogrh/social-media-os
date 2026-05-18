'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import { useClients } from '@/context/ClientsContext'
import type { ClientStatus, PaymentStatus } from '@/lib/types'

const SECTION_STYLE = { background: '#F5F4F2', borderRadius: 16, padding: 24, marginBottom: 20 }
const LABEL_STYLE: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: '#1F1B1A', display: 'block', marginBottom: 8 }
const INPUT_STYLE: React.CSSProperties = {
  width: '100%', border: '1px solid rgba(31,27,26,0.15)', borderRadius: 12,
  padding: '10px 14px', fontSize: 13, background: '#FFFFFF', color: '#1F1B1A', outline: 'none',
  fontFamily: "'Inter', system-ui, sans-serif",
}
const SECTION_TITLE = {
  fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 600, color: '#1F1B1A', marginBottom: 16,
}

export default function NovoClientePage() {
  const router = useRouter()
  const { addClient } = useClients()
  const [loading, setLoading] = useState(false)

  // Dados básicos
  const [name, setName] = useState('')
  const [segment, setSegment] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [website, setWebsite] = useState('')
  const [status, setStatus] = useState<ClientStatus>('onboarding')

  // Redes sociais
  const [instagramHandle, setInstagramHandle] = useState('')

  // Contrato
  const [monthlyValue, setMonthlyValue] = useState('')
  const [contractStart, setContractStart] = useState('')
  const [servicePackage, setServicePackage] = useState('Gestão Essencial')
  const [postsPerMonth, setPostsPerMonth] = useState('16')
  const [reelsPerMonth, setReelsPerMonth] = useState('8')
  const [storiesPerWeek, setStoriesPerWeek] = useState('5')

  // Identidade da marca
  const [positioning, setPositioning] = useState('')
  const [brandVoice, setBrandVoice] = useState('')
  const [persona, setPersona] = useState('')
  const [contentPillarsRaw, setContentPillarsRaw] = useState('')
  const [notes, setNotes] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const today = new Date().toISOString().split('T')[0]
    const nextPaymentDate = contractStart || today

    addClient({
      name,
      segment,
      email,
      phone: phone || undefined,
      website: website || undefined,
      status,
      initials: name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() || 'XX',
      color: '#F25BA5',
      instagramHandle: instagramHandle || undefined,
      monthlyValue: Number(monthlyValue) || 0,
      contractStart: contractStart || today,
      nextPaymentDate,
      paymentStatus: 'pendente' as PaymentStatus,
      servicePackage,
      postsPerMonth: Number(postsPerMonth) || 16,
      reelsPerMonth: Number(reelsPerMonth) || 8,
      storiesPerWeek: Number(storiesPerWeek) || 5,
      positioning: positioning || undefined,
      brandVoice: brandVoice || undefined,
      persona: persona || undefined,
      contentPillars: contentPillarsRaw ? contentPillarsRaw.split(',').map(s => s.trim()).filter(Boolean) : undefined,
      notes: notes || undefined,
    })

    router.push('/clientes')
  }

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      <Header title="Novo cliente" subtitle="Preencha os dados do novo cliente" />

      <div style={{ padding: '24px 28px', maxWidth: 860, fontFamily: "'Inter', system-ui, sans-serif" }}>
        <Link href="/clientes" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(31,27,26,0.5)', marginBottom: 24, textDecoration: 'none' }}
          className="hover:text-[#F25BA5]">
          <ArrowLeft size={14} /> Voltar para clientes
        </Link>

        <form onSubmit={handleSubmit}>

          {/* Dados básicos */}
          <div style={SECTION_STYLE}>
            <h2 style={SECTION_TITLE}>Dados básicos</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={LABEL_STYLE}>Nome do cliente *</label>
                <input required style={INPUT_STYLE} placeholder="Ex: Sinta Gummies" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div>
                <label style={LABEL_STYLE}>Segmento *</label>
                <input required style={INPUT_STYLE} placeholder="Ex: Bem-estar & Saúde" value={segment} onChange={e => setSegment(e.target.value)} />
              </div>
              <div>
                <label style={LABEL_STYLE}>E-mail *</label>
                <input required type="email" style={INPUT_STYLE} placeholder="contato@empresa.com.br" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div>
                <label style={LABEL_STYLE}>Telefone</label>
                <input style={INPUT_STYLE} placeholder="(11) 99999-0000" value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
              <div>
                <label style={LABEL_STYLE}>Website</label>
                <input style={INPUT_STYLE} placeholder="www.empresa.com.br" value={website} onChange={e => setWebsite(e.target.value)} />
              </div>
              <div>
                <label style={LABEL_STYLE}>Status *</label>
                <select required style={{ ...INPUT_STYLE }} value={status} onChange={e => setStatus(e.target.value as ClientStatus)}>
                  <option value="onboarding">Onboarding</option>
                  <option value="ativo">Ativo</option>
                  <option value="pausado">Pausado</option>
                  <option value="encerrado">Encerrado</option>
                </select>
              </div>
            </div>
          </div>

          {/* Redes sociais */}
          <div style={SECTION_STYLE}>
            <h2 style={SECTION_TITLE}>Redes sociais</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={LABEL_STYLE}>Instagram</label>
                <input style={INPUT_STYLE} placeholder="@handle" value={instagramHandle} onChange={e => setInstagramHandle(e.target.value)} />
              </div>
              <div>
                <label style={LABEL_STYLE}>TikTok</label>
                <input style={INPUT_STYLE} placeholder="@handle" />
              </div>
              <div>
                <label style={LABEL_STYLE}>LinkedIn</label>
                <input style={INPUT_STYLE} placeholder="linkedin.com/company/..." />
              </div>
              <div>
                <label style={LABEL_STYLE}>YouTube</label>
                <input style={INPUT_STYLE} placeholder="youtube.com/@..." />
              </div>
            </div>
          </div>

          {/* Contrato */}
          <div style={SECTION_STYLE}>
            <h2 style={SECTION_TITLE}>Contrato</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              <div>
                <label style={LABEL_STYLE}>Valor mensal (R$) *</label>
                <input required type="number" style={INPUT_STYLE} placeholder="2800" value={monthlyValue} onChange={e => setMonthlyValue(e.target.value)} />
              </div>
              <div>
                <label style={LABEL_STYLE}>Data de início *</label>
                <input required type="date" style={INPUT_STYLE} value={contractStart} onChange={e => setContractStart(e.target.value)} />
              </div>
              <div>
                <label style={LABEL_STYLE}>Pacote de serviço *</label>
                <select required style={{ ...INPUT_STYLE }} value={servicePackage} onChange={e => setServicePackage(e.target.value)}>
                  <option>Gestão Essencial</option>
                  <option>Gestão Full</option>
                  <option>Gestão Premium</option>
                  <option>Personalizado</option>
                </select>
              </div>
              <div>
                <label style={LABEL_STYLE}>Posts/mês</label>
                <input type="number" style={INPUT_STYLE} placeholder="16" value={postsPerMonth} onChange={e => setPostsPerMonth(e.target.value)} />
              </div>
              <div>
                <label style={LABEL_STYLE}>Reels/mês</label>
                <input type="number" style={INPUT_STYLE} placeholder="8" value={reelsPerMonth} onChange={e => setReelsPerMonth(e.target.value)} />
              </div>
              <div>
                <label style={LABEL_STYLE}>Stories/semana</label>
                <input type="number" style={INPUT_STYLE} placeholder="5" value={storiesPerWeek} onChange={e => setStoriesPerWeek(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Identidade da marca */}
          <div style={SECTION_STYLE}>
            <h2 style={SECTION_TITLE}>Identidade da marca</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={LABEL_STYLE}>Posicionamento</label>
                <textarea style={{ ...INPUT_STYLE, minHeight: 80, resize: 'vertical' }} placeholder="Como a marca se posiciona no mercado?" value={positioning} onChange={e => setPositioning(e.target.value)} />
              </div>
              <div>
                <label style={LABEL_STYLE}>Tom de voz</label>
                <textarea style={{ ...INPUT_STYLE, minHeight: 80, resize: 'vertical' }} placeholder="Como a marca se comunica? Quais adjetivos definem a voz?" value={brandVoice} onChange={e => setBrandVoice(e.target.value)} />
              </div>
              <div>
                <label style={LABEL_STYLE}>Persona</label>
                <textarea style={{ ...INPUT_STYLE, minHeight: 80, resize: 'vertical' }} placeholder="Quem é o cliente ideal? Descreva." value={persona} onChange={e => setPersona(e.target.value)} />
              </div>
              <div>
                <label style={LABEL_STYLE}>Pilares de conteúdo</label>
                <input style={INPUT_STYLE} placeholder="Separados por vírgula: Educação, Estilo de vida, Depoimentos..." value={contentPillarsRaw} onChange={e => setContentPillarsRaw(e.target.value)} />
              </div>
              <div>
                <label style={LABEL_STYLE}>Observações internas</label>
                <textarea style={{ ...INPUT_STYLE, minHeight: 80, resize: 'vertical' }} placeholder="Notas internas sobre este cliente..." value={notes} onChange={e => setNotes(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <Link href="/clientes" style={{
              background: 'transparent', color: '#1F1B1A', border: '1px solid rgba(31,27,26,0.15)',
              borderRadius: 999, padding: '11px 24px', fontSize: 13, fontWeight: 600, textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center',
            }}>
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              style={{
                background: '#F25BA5', color: '#FFFFFF', borderRadius: 999, padding: '11px 28px',
                border: 'none', fontSize: 13, fontWeight: 700, cursor: loading ? 'wait' : 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 8, opacity: loading ? 0.7 : 1,
                fontFamily: "'Inter', system-ui, sans-serif",
              }}
            >
              {loading ? 'Salvando...' : 'Criar cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
