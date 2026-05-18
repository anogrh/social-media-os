'use client'

import { useState } from 'react'
import {
  Building2, Users, Key, Bell, Shield, Palette,
  Save, Eye, EyeOff, Plus, Trash2, Check
} from 'lucide-react'
import Header from '@/components/layout/Header'

const TABS = ['Agência', 'Equipe', 'Integrações', 'Notificações', 'Segurança']

const tabIcons: Record<string, React.ElementType> = {
  'Agência': Building2, 'Equipe': Users, 'Integrações': Key,
  'Notificações': Bell, 'Segurança': Shield,
}

const mockTeam = [
  { id: '1', name: 'Rhania Nogueira', email: 'rhania@rhaniaaraujo.com.br', role: 'Admin', avatar: 'RN', active: true },
  { id: '2', name: 'Mariana Santos', email: 'mari@rhaniaaraujo.com.br', role: 'Equipe', avatar: 'MS', active: true },
]

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

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState('Agência')
  const [saved, setSaved] = useState(false)
  const [showKey, setShowKey] = useState<Record<string, boolean>>({})
  const [agency, setAgency] = useState({
    name: 'Rhania Araújo', email: 'contato@rhaniaaraujo.com.br',
    phone: '(11) 99999-0000', site: 'rhaniaaraujo.com.br',
    cnpj: '00.000.000/0001-00', address: 'São Paulo, SP',
    bio: 'Agência de social media e design especializada em marcas autênticas.',
  })
  const [notifications, setNotifications] = useState({
    paymentOverdue: true, performanceDrop: true, contractExpiring: true,
    taskOverdue: true, weeklyReport: false, newClient: true,
  })

  const font = "'Inter', system-ui, sans-serif"

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

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

                <button onClick={handleSave} style={{
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                  {mockTeam.map(member => (
                    <div key={member.id} style={{
                      display: 'flex', alignItems: 'center', gap: 16,
                      background: '#F5F4F2', borderRadius: 12, padding: '14px 18px',
                    }}>
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
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: member.active ? '#10B981' : '#6b7280' }} />
                      {member.role !== 'Admin' && (
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(31,27,26,0.3)', display: 'flex' }}>
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button style={{
                  background: '#F5F4F2', color: '#1F1B1A', border: '1px dashed rgba(31,27,26,0.2)',
                  borderRadius: 12, padding: '12px 20px', fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, width: '100%', justifyContent: 'center', fontFamily: font,
                }}>
                  <Plus size={14} /> Convidar membro
                </button>

                <div style={{ marginTop: 28, background: '#FBD0DA22', borderRadius: 12, padding: '16px 18px', border: '1px solid rgba(242,91,165,0.2)' }}>
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

                <button onClick={handleSave} style={{
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
