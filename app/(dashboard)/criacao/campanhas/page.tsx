'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Megaphone, Check, X, Pencil, Trash2, Zap } from 'lucide-react'
import Header from '@/components/layout/Header'
import { useClients } from '@/context/ClientsContext'

type Campaign = {
  id: string; name: string; clientId: string; clientName: string
  product: string; objective: string; offer: string; bonus: string
  startDate: string; endDate: string; tone: string; objections: string
  ctaMain: string; channels: string; notes: string; active: boolean
}

const empty: Omit<Campaign, 'id' | 'clientName'> = {
  clientId: '', name: '', product: '', objective: '', offer: '', bonus: '',
  startDate: '', endDate: '', tone: '', objections: '', ctaMain: '', channels: '', notes: '', active: false,
}

export default function CampanhasPage() {
  const router = useRouter()
  const { clients } = useClients()
  const font = "'Inter', system-ui, sans-serif"
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState(empty)

  useEffect(() => {
    const stored = localStorage.getItem('sm_content_campaigns')
    if (stored) try { setCampaigns(JSON.parse(stored)) } catch {}
  }, [])

  function save(updated: Campaign[]) {
    setCampaigns(updated)
    localStorage.setItem('sm_content_campaigns', JSON.stringify(updated))
  }

  function handleSubmit() {
    if (!form.name || !form.clientId) return
    const client = clients.find(c => c.id === form.clientId)
    if (editId) {
      save(campaigns.map(c => c.id === editId ? { ...form, id: editId, clientName: client?.name || '' } : c))
      setEditId(null)
    } else {
      save([...campaigns, { ...form, id: Date.now().toString(), clientName: client?.name || '' }])
    }
    setForm(empty); setShowForm(false)
  }

  function toggleActive(id: string) {
    save(campaigns.map(c => c.id === id ? { ...c, active: !c.active } : c))
  }

  function startEdit(c: Campaign) {
    setForm({ clientId: c.clientId, name: c.name, product: c.product, objective: c.objective, offer: c.offer, bonus: c.bonus, startDate: c.startDate, endDate: c.endDate, tone: c.tone, objections: c.objections, ctaMain: c.ctaMain, channels: c.channels, notes: c.notes, active: c.active })
    setEditId(c.id); setShowForm(true)
  }

  function deleteCampaign(id: string) {
    save(campaigns.filter(c => c.id !== id))
  }

  const inputStyle = { width: '100%', border: '1px solid var(--border-2)', borderRadius: 12, padding: '10px 14px', fontSize: 13, background: 'var(--bg-2)', color: 'var(--text)', outline: 'none', fontFamily: font, boxSizing: 'border-box' as const }
  const labelStyle = { fontSize: 11, fontWeight: 700 as const, color: 'var(--text-2)' as const, textTransform: 'uppercase' as const, letterSpacing: '0.07em', display: 'block' as const, marginBottom: 6 }

  const activeCampaigns = campaigns.filter(c => c.active)

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Header title="Campanhas" subtitle="Gerencie campanhas ativas e conecte ao contexto da IA" />
      <div className="page-pad" style={{ fontFamily: font }}>
        <button onClick={() => router.push('/criacao')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-2)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, padding: 0 }}>
          <ArrowLeft size={14} /> Voltar
        </button>

        {/* Active campaign banner */}
        {activeCampaigns.length > 0 && (
          <div style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.04))', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 14, padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Zap size={18} color="#fff" />
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>
                {activeCampaigns.length} campanha{activeCampaigns.length > 1 ? 's' : ''} ativa{activeCampaigns.length > 1 ? 's' : ''}
              </p>
              <p style={{ fontSize: 12, color: 'var(--text-2)' }}>
                {activeCampaigns.map(c => `${c.name} (${c.clientName})`).join(' · ')}
              </p>
            </div>
            <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 700, color: '#10B981', background: 'rgba(16,185,129,0.12)', padding: '4px 10px', borderRadius: 999 }}>
              Contexto ativo
            </span>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: showForm ? '1fr 420px' : '1fr', gap: 24 }}>
          {/* Campaign list */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>Todas as campanhas</h3>
              <button onClick={() => { setShowForm(true); setEditId(null); setForm(empty) }}
                style={{ background: '#10B981', color: '#fff', border: 'none', borderRadius: 999, padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: font }}>
                <Plus size={13} /> Nova campanha
              </button>
            </div>

            {campaigns.length === 0 ? (
              <div style={{ background: 'var(--bg-2)', borderRadius: 14, padding: 40, textAlign: 'center' }}>
                <Megaphone size={32} style={{ margin: '0 auto 12px', color: 'var(--text-4)' }} />
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>Nenhuma campanha cadastrada</p>
                <p style={{ fontSize: 13, color: 'var(--text-2)' }}>Crie uma campanha para conectar o contexto comercial ao gerador de conteúdo.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {campaigns.map(c => (
                  <div key={c.id} style={{ background: 'var(--bg)', border: `1.5px solid ${c.active ? 'rgba(16,185,129,0.4)' : 'var(--border)'}`, borderRadius: 14, padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <h4 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>{c.name}</h4>
                          {c.active && <span style={{ fontSize: 10, fontWeight: 700, color: '#10B981', background: 'rgba(16,185,129,0.12)', padding: '2px 8px', borderRadius: 999 }}>ATIVA</span>}
                        </div>
                        <p style={{ fontSize: 12, color: 'var(--text-2)' }}>{c.clientName} · {c.product}</p>
                      </div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => toggleActive(c.id)}
                          title={c.active ? 'Desativar contexto' : 'Ativar contexto'}
                          style={{ background: c.active ? 'rgba(16,185,129,0.1)' : 'var(--bg-2)', border: `1px solid ${c.active ? 'rgba(16,185,129,0.4)' : 'var(--border)'}`, borderRadius: 8, padding: '6px 10px', cursor: 'pointer', color: c.active ? '#10B981' : 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, fontFamily: font }}>
                          <Zap size={12} /> {c.active ? 'Ativa' : 'Ativar'}
                        </button>
                        <button onClick={() => startEdit(c)} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 8px', cursor: 'pointer', color: 'var(--text-2)', display: 'flex' }}><Pencil size={13} /></button>
                        <button onClick={() => deleteCampaign(c.id)} style={{ background: 'none', border: '1px solid rgba(238,53,40,0.2)', borderRadius: 8, padding: '6px 8px', cursor: 'pointer', color: '#EE3528', display: 'flex' }}><Trash2 size={13} /></button>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {[
                        { label: 'Objetivo', val: c.objective },
                        { label: 'Oferta', val: c.offer },
                        { label: 'CTA', val: c.ctaMain },
                        { label: 'Tom', val: c.tone },
                        { label: 'Período', val: c.startDate && c.endDate ? `${c.startDate} → ${c.endDate}` : '' },
                      ].filter(x => x.val).map(x => (
                        <span key={x.label} style={{ fontSize: 11, padding: '3px 8px', borderRadius: 999, background: 'var(--bg-2)', color: 'var(--text-2)', border: '1px solid var(--border)' }}>
                          <strong style={{ color: 'var(--text)' }}>{x.label}:</strong> {x.val}
                        </span>
                      ))}
                    </div>
                    {c.objections && (
                      <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 8, fontStyle: 'italic' }}>Objeções: {c.objections}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form */}
          {showForm && (
            <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, position: 'sticky', top: 24, maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>
                  {editId ? 'Editar' : 'Nova'} <span style={{ color: '#10B981' }}>campanha</span>
                </h3>
                <button onClick={() => { setShowForm(false); setEditId(null) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-4)', display: 'flex' }}><X size={18} /></button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Cliente *</label>
                  <select value={form.clientId} onChange={e => setForm(f => ({ ...f, clientId: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                    <option value="">Selecione...</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Nome da campanha *</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ex: Semana do Cuidado com a Tattoo" style={inputStyle} />
                </div>
                {[
                  { key: 'product', label: 'Produto foco', placeholder: 'Ex: Tattoo Balm e Balm Stick' },
                  { key: 'objective', label: 'Objetivo comercial', placeholder: 'Ex: Aumentar vendas do balm em 30%' },
                  { key: 'offer', label: 'Oferta', placeholder: 'Ex: Desconto progressivo de 10 a 20%' },
                  { key: 'bonus', label: 'Bônus', placeholder: 'Ex: Frete grátis acima de R$150' },
                  { key: 'tone', label: 'Tom da campanha', placeholder: 'Ex: Premium, direto e educativo' },
                  { key: 'ctaMain', label: 'CTA principal', placeholder: 'Ex: Acessar link da bio' },
                  { key: 'channels', label: 'Canais', placeholder: 'Ex: Instagram, Stories, Email' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={labelStyle}>{f.label}</label>
                    <input value={form[f.key as keyof typeof form] as string} onChange={e => setForm(fm => ({ ...fm, [f.key]: e.target.value }))} placeholder={f.placeholder} style={inputStyle} />
                  </div>
                ))}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={labelStyle}>Início</label>
                    <input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Fim</label>
                    <input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} style={inputStyle} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Objeções principais</label>
                  <textarea value={form.objections} onChange={e => setForm(f => ({ ...f, objections: e.target.value }))} placeholder="Ex: Já tenho hidratante comum, não preciso de produto específico..." rows={2} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
                </div>
                <div>
                  <label style={labelStyle}>Observações</label>
                  <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Informações adicionais..." rows={2} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--text)', fontWeight: 600 }}>
                  <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} style={{ accentColor: '#10B981', width: 16, height: 16 }} />
                  Ativar contexto imediatamente
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={handleSubmit}
                    style={{ flex: 2, background: '#10B981', color: '#fff', border: 'none', borderRadius: 999, padding: '11px', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: font }}>
                    <Check size={13} /> {editId ? 'Salvar' : 'Criar campanha'}
                  </button>
                  <button onClick={() => { setShowForm(false); setEditId(null) }}
                    style={{ flex: 1, background: 'var(--bg-2)', color: 'var(--text-2)', border: '1px solid var(--border)', borderRadius: 999, padding: '11px', fontSize: 13, cursor: 'pointer', fontFamily: font }}>
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
