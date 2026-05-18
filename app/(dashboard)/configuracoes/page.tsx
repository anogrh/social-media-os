'use client'

import { useState, useEffect } from 'react'
import {
  Building2, Users, Key, Bell, Shield, Palette,
  Save, Eye, EyeOff, Plus, Trash2, Check, Pencil, X
} from 'lucide-react'
import Header from '@/components/layout/Header'

const TABS = ['Agência', 'Equipe', 'Integrações', 'Notificações', 'Segurança']

const tabIcons: Record<string, React.ElementType> = {
  'Agência': Building2, 'Equipe': Users, 'Integrações': Key,
  'Notificações': Bell, 'Segurança': Shield,
}

type TeamMember = {
  id: string
  name: string
  email: string
  role: string
  avatar: string
  active: boolean
}

const DEFAULT_TEAM: TeamMember[] = [
  { id: '1', name: 'Rhania Nogueira', email: 'rhania@rhaniaaraujo.com.br', role: 'Admin', avatar: 'RN', active: true },
]

const DEFAULT_AGENCY = {
  name: 'Rhania Araújo',
  email: 'contato@rhaniaaraujo.com.br',
  phone: '(11) 99999-0000',
  site: 'rhaniaaraujo.com.br',
  cnpj: '00.000.000/0001-00',
  address: 'São Paulo, SP',
  bio: 'Agência de social media e design especializada em marcas autênticas.',
}

const integrations = [
  { id: 'instagram', name: 'Instagram Graph API', desc: 'Conecta contas profissionais dos clientes.', status: 'configured', env: 'INSTAGRAM_APP_ID' },
  { id: 'openai', name: 'OpenAI API', desc: 'Gera análises, resumos e recomendações com IA.', status: 'pending', env: 'OPENAI_API_KEY' },
  { id: 'supabase', name: 'Supabase', desc: 'Banco de dados, autenticação e armazenamento.', status: 'configured', env: 'NEXT_PUBLIC_SUPABASE_URL' },
  { id: 'google', name: 'Google Drive', desc: 'Sincroniza arquivos e documentos dos clientes.', status: 'not_connected', env: 'GOOGLE_CLIENT_ID' },
  { id: 'whatsapp', name: 'WhatsApp Business API', desc: 'Envio de alertas e notificações via WhatsApp.', status: 'not_connected', env: 'WHATSAPP_TOKEN' },
]

const STATUS_PILL: Record<string, { bg: string; color: string; label: string }> = {
  configured:    { bg: '#d1fae5', color: '#065f46', label: 'Configurado' },
  pending:       { bg: '#fef3c7', color: '#92400e', label: 'Pendente' },
  not_connected: { bg: '#f3f4f6', color: '#6b7280', label: 'Não conectado' },
}

function getInitials(name: string) {
  return name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('')
}

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState('Agência')
  const [saved, setSaved] = useState(false)
  const [showKey, setShowKey] = useState<Record<string, boolean>>({})

  // ── Agency profile ───────────────────────────────────────────────────────────
  const [agency, setAgency] = useState(DEFAULT_AGENCY)

  useEffect(() => {
    const stored = localStorage.getItem('sm_agency_profile')
    if (stored) {
      try { setAgency(JSON.parse(stored)) } catch {}
    }
  }, [])

  function handleSaveAgency() {
    localStorage.setItem('sm_agency_profile', JSON.stringify(agency))
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  // ── Team members ─────────────────────────────────────────────────────────────
  const [team, setTeam] = useState<TeamMember[]>(DEFAULT_TEAM)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<TeamMember>>({})
  const [showAddForm, setShowAddForm] = useState(false)
  const [newMember, setNewMember] = useState({ name: '', email: '', role: 'Equipe' })

  useEffect(() => {
    const stored = localStorage.getItem('sm_team_members')
    if (stored) {
      try { setTeam(JSON.parse(stored)) } catch {}
    }
  }, [])

  function saveTeam(updated: TeamMember[]) {
    setTeam(updated)
    localStorage.setItem('sm_team_members', JSON.stringify(updated))
  }

  function startEdit(member: TeamMember) {
    setEditingId(member.id)
    setEditForm({ name: member.name, email: member.email, role: member.role, active: member.active })
  }

  function commitEdit() {
    if (!editingId) return
    const updated = team.map(m =>
      m.id === editingId
        ? { ...m, ...editForm, avatar: getInitials(editForm.name || m.name) }
        : m
    )
    saveTeam(updated)
    setEditingId(null)
    setEditForm({})
  }

  function cancelEdit() {
    setEditingId(null)
    setEditForm({})
  }

  function removeMember(id: string) {
    saveTeam(team.filter(m => m.id !== id))
  }

  function addMember() {
    if (!newMember.name.trim() || !newMember.email.trim()) return
    const member: TeamMember = {
      id: Date.now().toString(),
      name: newMember.name.trim(),
      email: newMember.email.trim(),
      role: newMember.role,
      avatar: getInitials(newMember.name),
      active: true,
    }
    saveTeam([...team, member])
    setNewMember({ name: '', email: '', role: 'Equipe' })
    setShowAddForm(false)
  }

  // ── Notifications ─────────────────────────────────────────────────────────────
  const [notifications, setNotifications] = useState({
    paymentOverdue: true, performanceDrop: true, contractExpiring: true,
    taskOverdue: true, weeklyReport: false, newClient: true,
  })

  const font = "'Inter', system-ui, sans-serif"

  function toggleKey(id: string) {
    setShowKey(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const inputStyle = {
    width: '100%', border: '1px solid rgba(31,27,26,0.15)', borderRadius: 12,
    padding: '10px 14px', fontSize: 13, background: '#F5F4F2', color: '#1F1B1A',
    outline: 'none', fontFamily: font, boxSizing: 'border-box' as const,
  }

  const labelStyle = {
    fontSize: 11, fontWeight: 700 as const, color: 'rgba(31,27,26,0.5)' as const,
    textTransform: 'uppercase' as const, letterSpacing: '0.07em', display: 'block' as const, marginBottom: 6,
  }

  const sectionTitle = (text: string) => (
    <h4 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, fontWeight: 600, color: '#1F1B1A', marginBottom: 18, borderBottom: '1px solid rgba(31,27,26,0.08)', paddingBottom: 12 }}>
      {text}
    </h4>
  )

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      <Header title="Configurações" subtitle="Gerencie sua agência, equipe e integrações" />

      <div style={{ padding: '24px 28px', fontFamily: font }}>
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24, alignItems: 'start' }}>

          {/* Sidebar nav */}
          <div style={{ background: '#F5F4F2', borderRadius: 16, padding: 8, position: 'sticky', top: 24 }}>
            {TABS.map(tab => {
              const Icon = tabIcons[tab]
              const active = activeTab === tab
              return (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  background: active ? '#F25BA5' : 'none',
                  color: active ? '#FFFFFF' : 'rgba(31,27,26,0.6)',
                  borderRadius: 10, border: 'none', padding: '10px 14px',
                  fontSize: 13, fontWeight: active ? 700 : 500,
                  cursor: 'pointer', marginBottom: 2, fontFamily: font,
                  transition: 'all 0.15s', textAlign: 'left',
                }}>
                  <Icon size={15} />
                  {tab}
                </button>
              )
            })}
          </div>

          {/* Content panel */}
          <div style={{ background: '#FFFFFF', border: '1px solid rgba(31,27,26,0.10)', borderRadius: 16, padding: 28 }}>

            {/* ── AGÊNCIA ─────────────────────────────── */}
            {activeTab === 'Agência' && (
              <div>
                {sectionTitle('Dados da agência')}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                  <div>
                    <label style={labelStyle}>Nome da agência</label>
                    <input value={agency.name} onChange={e => setAgency(a => ({ ...a, name: e.target.value }))} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>E-mail principal</label>
                    <input value={agency.email} onChange={e => setAgency(a => ({ ...a, email: e.target.value }))} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Telefone / WhatsApp</label>
                    <input value={agency.phone} onChange={e => setAgency(a => ({ ...a, phone: e.target.value }))} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Site</label>
                    <input value={agency.site} onChange={e => setAgency(a => ({ ...a, site: e.target.value }))} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>CNPJ</label>
                    <input value={agency.cnpj} onChange={e => setAgency(a => ({ ...a, cnpj: e.target.value }))} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Cidade / Estado</label>
                    <input value={agency.address} onChange={e => setAgency(a => ({ ...a, address: e.target.value }))} style={inputStyle} />
                  </div>
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label style={labelStyle}>Bio / Descrição</label>
                  <textarea
                    value={agency.bio}
                    onChange={e => setAgency(a => ({ ...a, bio: e.target.value }))}
                    rows={3}
                    style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                  />
                </div>

                {sectionTitle('Identidade visual do dashboard')}
                <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
                  {['#F25BA5', '#F19877', '#FBD0DA', '#F2F4A4', '#1F1B1A', '#EE3528'].map(color => (
                    <div key={color} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 999, background: color, border: color === '#F25BA5' ? '2px solid #1F1B1A' : '2px solid transparent', cursor: 'pointer' }} />
                      <span style={{ fontSize: 9, color: 'rgba(31,27,26,0.4)', fontFamily: "'JetBrains Mono', monospace" }}>{color}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'rgba(31,27,26,0.5)', marginLeft: 8 }}>
                    <Palette size={14} />
                    Cor de acento principal: <strong style={{ color: '#F25BA5' }}>#F25BA5</strong>
                  </div>
                </div>

                <button onClick={handleSaveAgency} style={{
                  background: '#F25BA5', color: '#FFFFFF', borderRadius: 999,
                  border: 'none', padding: '11px 28px', fontSize: 13, fontWeight: 700,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontFamily: font,
                }}>
                  {saved ? <><Check size={14} /> Salvo!</> : <><Save size={14} /> Salvar alterações</>}
                </button>
              </div>
            )}

            {/* ── EQUIPE ──────────────────────────────── */}
            {activeTab === 'Equipe' && (
              <div>
                {sectionTitle('Membros da equipe')}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                  {team.map(member => (
                    <div key={member.id}>
                      {editingId === member.id ? (
                        /* ── Edit mode ── */
                        <div style={{ background: '#FBD0DA22', border: '1.5px solid rgba(242,91,165,0.3)', borderRadius: 12, padding: '16px 18px' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                            <div>
                              <label style={labelStyle}>Nome</label>
                              <input value={editForm.name || ''} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} />
                            </div>
                            <div>
                              <label style={labelStyle}>E-mail</label>
                              <input value={editForm.email || ''} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} style={inputStyle} />
                            </div>
                            <div>
                              <label style={labelStyle}>Função</label>
                              <select value={editForm.role || 'Equipe'} onChange={e => setEditForm(f => ({ ...f, role: e.target.value }))}
                                style={{ ...inputStyle, cursor: 'pointer' }}>
                                <option>Admin</option>
                                <option>Equipe</option>
                                <option>Estagiário</option>
                                <option>Freelancer</option>
                              </select>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
                              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#1F1B1A' }}>
                                <input type="checkbox" checked={editForm.active ?? true} onChange={e => setEditForm(f => ({ ...f, active: e.target.checked }))}
                                  style={{ accentColor: '#F25BA5', width: 16, height: 16 }} />
                                Ativo
                              </label>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button onClick={commitEdit} style={{ background: '#F25BA5', color: '#FFFFFF', border: 'none', borderRadius: 999, padding: '8px 18px', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: font }}>
                              <Check size={13} /> Salvar
                            </button>
                            <button onClick={cancelEdit} style={{ background: '#F5F4F2', color: '#1F1B1A', border: '1px solid rgba(31,27,26,0.12)', borderRadius: 999, padding: '8px 18px', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: font }}>
                              <X size={13} /> Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* ── View mode ── */
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: '#F5F4F2', borderRadius: 12, padding: '14px 18px' }}>
                          <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#FBD0DA', fontFamily: "'Playfair Display', Georgia, serif", fontSize: 14, fontWeight: 600, color: '#1F1B1A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {member.avatar}
                          </div>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 14, fontWeight: 600, color: '#1F1B1A' }}>{member.name}</p>
                            <p style={{ fontSize: 12, color: 'rgba(31,27,26,0.5)', marginTop: 2 }}>{member.email}</p>
                          </div>
                          <span style={{
                            fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999,
                            background: member.role === 'Admin' ? '#F25BA5' : '#F5F4F2',
                            color: member.role === 'Admin' ? '#FFFFFF' : 'rgba(31,27,26,0.6)',
                            border: member.role === 'Admin' ? 'none' : '1px solid rgba(31,27,26,0.12)',
                          }}>
                            {member.role}
                          </span>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: member.active ? '#10B981' : '#6b7280' }} title={member.active ? 'Ativo' : 'Inativo'} />
                          <button onClick={() => startEdit(member)} title="Editar" style={{ background: 'none', border: '1px solid rgba(31,27,26,0.12)', borderRadius: 8, padding: '6px 8px', cursor: 'pointer', color: 'rgba(31,27,26,0.5)', display: 'flex' }}>
                            <Pencil size={13} />
                          </button>
                          {member.role !== 'Admin' && (
                            <button onClick={() => removeMember(member.id)} title="Remover" style={{ background: 'none', border: '1px solid rgba(238,53,40,0.2)', borderRadius: 8, padding: '6px 8px', cursor: 'pointer', color: '#EE3528', display: 'flex' }}>
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add member form */}
                {showAddForm ? (
                  <div style={{ background: '#F5F4F2', borderRadius: 14, padding: 20, marginBottom: 12 }}>
                    <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 14, fontWeight: 600, color: '#1F1B1A', marginBottom: 14 }}>Novo membro</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                      <div>
                        <label style={labelStyle}>Nome *</label>
                        <input value={newMember.name} onChange={e => setNewMember(m => ({ ...m, name: e.target.value }))} placeholder="Nome completo" style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>E-mail *</label>
                        <input value={newMember.email} onChange={e => setNewMember(m => ({ ...m, email: e.target.value }))} placeholder="email@agencia.com" style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Função</label>
                        <select value={newMember.role} onChange={e => setNewMember(m => ({ ...m, role: e.target.value }))}
                          style={{ ...inputStyle, cursor: 'pointer' }}>
                          <option>Equipe</option>
                          <option>Estagiário</option>
                          <option>Freelancer</option>
                          <option>Admin</option>
                        </select>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={addMember} style={{ background: '#F25BA5', color: '#FFFFFF', border: 'none', borderRadius: 999, padding: '9px 20px', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: font }}>
                        <Plus size={13} /> Adicionar membro
                      </button>
                      <button onClick={() => { setShowAddForm(false); setNewMember({ name: '', email: '', role: 'Equipe' }) }} style={{ background: 'transparent', color: 'rgba(31,27,26,0.5)', border: '1px solid rgba(31,27,26,0.12)', borderRadius: 999, padding: '9px 18px', fontSize: 12, cursor: 'pointer', fontFamily: font }}>
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setShowAddForm(true)} style={{
                    background: '#F5F4F2', color: '#1F1B1A', border: '1px dashed rgba(31,27,26,0.2)',
                    borderRadius: 12, padding: '12px 20px', fontSize: 13, fontWeight: 600,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, width: '100%', justifyContent: 'center', fontFamily: font,
                  }}>
                    <Plus size={14} /> Adicionar membro
                  </button>
                )}

                <div style={{ marginTop: 24, background: '#FBD0DA22', borderRadius: 12, padding: '16px 18px', border: '1px solid rgba(242,91,165,0.2)' }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#1F1B1A', marginBottom: 6 }}>Plano atual</p>
                  <p style={{ fontSize: 12, color: 'rgba(31,27,26,0.6)', lineHeight: 1.6 }}>
                    Você está no plano <strong>Pro</strong> — até 5 membros, acesso completo a todas as funcionalidades.
                    Clientes ilimitados, integrações ativas e relatórios avançados.
                  </p>
                </div>
              </div>
            )}

            {/* ── INTEGRAÇÕES ─────────────────────────── */}
            {activeTab === 'Integrações' && (
              <div>
                {sectionTitle('APIs e integrações')}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
                  {integrations.map(intg => {
                    const pill = STATUS_PILL[intg.status]
                    return (
                      <div key={intg.id} style={{ background: '#F5F4F2', borderRadius: 14, padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                          <div>
                            <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 14, fontWeight: 600, color: '#1F1B1A' }}>{intg.name}</p>
                            <p style={{ fontSize: 12, color: 'rgba(31,27,26,0.55)', marginTop: 4, lineHeight: 1.5 }}>{intg.desc}</p>
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: pill.bg, color: pill.color, flexShrink: 0, marginLeft: 16 }}>
                            {pill.label}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <code style={{ flex: 1, fontSize: 11, fontFamily: "'JetBrains Mono', monospace", background: 'rgba(31,27,26,0.06)', borderRadius: 8, padding: '6px 10px', color: '#1F1B1A' }}>
                            {showKey[intg.id] ? `sk-••••••••••••••••` : intg.env}
                          </code>
                          <button onClick={() => toggleKey(intg.id)} style={{ background: 'none', border: '1px solid rgba(31,27,26,0.12)', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', color: 'rgba(31,27,26,0.5)', display: 'flex' }}>
                            {showKey[intg.id] ? <EyeOff size={13} /> : <Eye size={13} />}
                          </button>
                          <button style={{
                            background: intg.status === 'not_connected' ? '#F25BA5' : '#F5F4F2',
                            color: intg.status === 'not_connected' ? '#FFFFFF' : 'rgba(31,27,26,0.7)',
                            border: intg.status === 'not_connected' ? 'none' : '1px solid rgba(31,27,26,0.12)',
                            borderRadius: 999, padding: '7px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: font,
                          }}>
                            {intg.status === 'not_connected' ? 'Conectar' : 'Configurar'}
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div style={{ background: '#F2F4A4', borderRadius: 12, padding: '14px 18px', fontSize: 12, color: 'rgba(31,27,26,0.7)', lineHeight: 1.6 }}>
                  <strong>⚠ Importante:</strong> Nunca exponha chaves de API no frontend. Todas as chaves sensíveis
                  devem ser configuradas como variáveis de ambiente no servidor (<code style={{ fontFamily: 'monospace', fontSize: 11 }}>.env.local</code>).
                </div>
              </div>
            )}

            {/* ── NOTIFICAÇÕES ────────────────────────── */}
            {activeTab === 'Notificações' && (
              <div>
                {sectionTitle('Alertas automáticos')}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {[
                    { key: 'paymentOverdue', label: 'Pagamento em atraso', desc: 'Alerta quando um cliente não paga na data.' },
                    { key: 'performanceDrop', label: 'Queda de performance', desc: 'Queda de alcance ou engajamento acima de 20%.' },
                    { key: 'contractExpiring', label: 'Contrato vencendo', desc: 'Aviso 15 dias antes do vencimento.' },
                    { key: 'taskOverdue', label: 'Tarefa atrasada', desc: 'Tarefa passou do prazo sem conclusão.' },
                    { key: 'weeklyReport', label: 'Relatório semanal automático', desc: 'Resumo de segunda-feira às 08h.' },
                    { key: 'newClient', label: 'Novo cliente cadastrado', desc: 'Notificação ao cadastrar um novo cliente.' },
                  ].map(n => (
                    <div key={n.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid rgba(31,27,26,0.07)' }}>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#1F1B1A' }}>{n.label}</p>
                        <p style={{ fontSize: 12, color: 'rgba(31,27,26,0.5)', marginTop: 2 }}>{n.desc}</p>
                      </div>
                      <button
                        onClick={() => setNotifications(prev => ({ ...prev, [n.key]: !prev[n.key as keyof typeof prev] }))}
                        style={{
                          width: 44, height: 24, borderRadius: 999, border: 'none', cursor: 'pointer',
                          background: notifications[n.key as keyof typeof notifications] ? '#F25BA5' : 'rgba(31,27,26,0.12)',
                          position: 'relative', transition: 'background 0.2s', flexShrink: 0,
                        }}
                      >
                        <div style={{
                          width: 18, height: 18, borderRadius: '50%', background: '#FFFFFF',
                          position: 'absolute', top: 3,
                          left: notifications[n.key as keyof typeof notifications] ? 23 : 3,
                          transition: 'left 0.2s',
                          boxShadow: '0 1px 4px rgba(31,27,26,0.2)',
                        }} />
                      </button>
                    </div>
                  ))}
                </div>

                <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2500) }} style={{
                  background: '#F25BA5', color: '#FFFFFF', borderRadius: 999,
                  border: 'none', padding: '11px 28px', fontSize: 13, fontWeight: 700,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontFamily: font, marginTop: 24,
                }}>
                  {saved ? <><Check size={14} /> Salvo!</> : <><Save size={14} /> Salvar preferências</>}
                </button>
              </div>
            )}

            {/* ── SEGURANÇA ───────────────────────────── */}
            {activeTab === 'Segurança' && (
              <div>
                {sectionTitle('Alterar senha')}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 420, marginBottom: 28 }}>
                  {['Senha atual', 'Nova senha', 'Confirmar nova senha'].map(lbl => (
                    <div key={lbl}>
                      <label style={labelStyle}>{lbl}</label>
                      <input type="password" placeholder="••••••••" style={inputStyle} />
                    </div>
                  ))}
                  <button style={{ background: '#F25BA5', color: '#FFFFFF', borderRadius: 999, border: 'none', padding: '11px 28px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: font, alignSelf: 'flex-start' }}>
                    Atualizar senha
                  </button>
                </div>

                {sectionTitle('Sessões ativas')}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                  {[
                    { device: 'Chrome · MacBook Pro', location: 'São Paulo, BR', current: true, time: 'Agora' },
                    { device: 'Safari · iPhone 15', location: 'São Paulo, BR', current: false, time: 'Há 2 horas' },
                  ].map((s, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#F5F4F2', borderRadius: 10, padding: '12px 16px' }}>
                      <Shield size={16} style={{ color: s.current ? '#F25BA5' : 'rgba(31,27,26,0.35)', flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#1F1B1A' }}>{s.device}</p>
                        <p style={{ fontSize: 11, color: 'rgba(31,27,26,0.5)' }}>{s.location} · {s.time}</p>
                      </div>
                      {s.current ? (
                        <span style={{ fontSize: 11, fontWeight: 700, background: '#d1fae5', color: '#065f46', borderRadius: 999, padding: '2px 8px' }}>Atual</span>
                      ) : (
                        <button style={{ background: 'none', border: '1px solid rgba(238,53,40,0.3)', color: '#EE3528', borderRadius: 999, padding: '4px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: font }}>
                          Encerrar
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {sectionTitle('LGPD e privacidade')}
                <div style={{ background: '#FBD0DA22', borderRadius: 12, padding: '16px 18px', fontSize: 13, color: 'rgba(31,27,26,0.7)', lineHeight: 1.7, border: '1px solid rgba(242,91,165,0.2)' }}>
                  <strong style={{ color: '#1F1B1A' }}>Conformidade com a LGPD.</strong> Todos os dados dos clientes são
                  armazenados com segurança e criptografados. Tokens do Instagram são salvos em variáveis de ambiente
                  seguras e nunca expostos no frontend. Para solicitar exclusão de dados, entre em contato com o suporte.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
