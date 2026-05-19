'use client'

import { useState } from 'react'
import { Upload, Download, FileText, FileImage, FileCheck, File, Plus, X } from 'lucide-react'
import Header from '@/components/layout/Header'
import StatusBadge from '@/components/ui/StatusBadge'
import { useContracts } from '@/context/ContractsContext'
import { useClients } from '@/context/ClientsContext'
import { documents } from '@/lib/mock-data'
import { formatDate } from '@/lib/utils'
import type { Contract } from '@/lib/types'

const docTypeIcon: Record<string, React.ElementType> = {
  contrato: FileCheck,
  comprovante: FileText,
  briefing: File,
  identidade_visual: FileImage,
  relatorio: FileText,
  outro: File,
}

const docTypeLabel: Record<string, string> = {
  contrato: 'Contrato',
  comprovante: 'Comprovante',
  briefing: 'Briefing',
  identidade_visual: 'Identidade visual',
  relatorio: 'Relatório',
  outro: 'Outro',
}

const docGroups = [
  { key: 'contrato', label: 'Contratos' },
  { key: 'comprovante', label: 'Comprovantes' },
  { key: 'briefing', label: 'Briefings' },
  { key: 'identidade_visual', label: 'Identidade visual' },
  { key: 'relatorio', label: 'Relatórios' },
  { key: 'outro', label: 'Outros' },
]

const emptyForm = {
  clientId: '',
  type: 'social_media',
  startDate: '',
  value: '',
  fileName: '',
  status: 'pendente_assinatura' as Contract['status'],
}

export default function ContratosPage() {
  const { contracts, addContract, isReady } = useContracts()
  const { clients } = useClients()
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)

  const font = "'Inter', system-ui, sans-serif"

  async function handleAdd() {
    if (!form.clientId || !form.startDate || !form.value || !form.fileName) return
    const client = clients.find(c => c.id === form.clientId)
    if (!client) return
    await addContract({
      clientId: form.clientId,
      clientName: client.name,
      type: form.type,
      startDate: form.startDate,
      value: Number(form.value),
      fileName: form.fileName,
      status: form.status,
    })
    setForm(emptyForm)
    setShowModal(false)
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Header title="Contratos & documentos" subtitle="Todos os arquivos e contratos" />

      <div style={{ padding: '24px 28px', fontFamily: font }}>
        {/* Upload area */}
        <div style={{
          border: '2px dashed var(--border-2)',
          background: '#FBD0DA',
          borderRadius: 16,
          padding: '32px',
          textAlign: 'center',
          marginBottom: 28,
          cursor: 'pointer',
        }}
          className="hover:border-[#FC75A0] transition-colors"
        >
          <Upload size={28} style={{ color: '#FC75A0', margin: '0 auto 10px' }} />
          <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Arraste e solte arquivos aqui</p>
          <p style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 14 }}>PDF, PNG, JPG, DOCX — máximo 50MB</p>
          <button style={{ background: '#FC75A0', color: '#FFFFFF', borderRadius: 999, padding: '8px 20px', border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
            Ou escolher arquivo
          </button>
        </div>

        {/* Contracts table */}
        <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', marginBottom: 24 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-3)', background: 'var(--bg-2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>Contratos ativos</h3>
            <button
              onClick={() => setShowModal(true)}
              style={{ background: '#FC75A0', color: '#FFFFFF', borderRadius: 999, padding: '7px 16px', border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Plus size={13} /> Novo contrato
            </button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: 'var(--bg-2)' }}>
              <tr>
                {['Cliente', 'Arquivo', 'Início', 'Valor/mês', 'Status', ''].map(h => (
                  <th key={h} style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)', textAlign: 'left', padding: '10px 16px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {contracts.map(c => (
                <tr key={c.id} style={{ borderTop: '1px solid var(--border-3)' }}>
                  <td style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', padding: '12px 16px' }}>{c.clientName}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 30, height: 30, background: '#FBD0DA', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FileCheck size={14} style={{ color: '#FC75A0' }} />
                      </div>
                      <div>
                        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{c.fileName}</p>
                        {c.fileSize && <p style={{ fontSize: 11, color: 'var(--text-4)' }}>{c.fileSize}</p>}
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--text)', padding: '12px 16px' }}>{formatDate(c.startDate)}</td>
                  <td style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', padding: '12px 16px' }}>R$ {c.value.toLocaleString('pt-BR')}</td>
                  <td style={{ padding: '12px 16px' }}><StatusBadge status={c.status} size="sm" /></td>
                  <td style={{ padding: '12px 16px' }}>
                    <button style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 999, padding: '5px 12px', fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text)' }}>
                      <Download size={11} /> Baixar
                    </button>
                  </td>
                </tr>
              ))}
              {contracts.length === 0 && !isReady && (
                <tr>
                  <td colSpan={6} style={{ padding: '28px 16px', textAlign: 'center', fontSize: 13, color: 'var(--text-4)' }}>Carregando...</td>
                </tr>
              )}
              {contracts.length === 0 && isReady && (
                <tr>
                  <td colSpan={6} style={{ padding: '28px 16px', textAlign: 'center', fontSize: 13, color: 'var(--text-4)' }}>Nenhum contrato cadastrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Document groups */}
        {docGroups.map(group => {
          const groupDocs = documents.filter(d => d.type === group.key)
          if (groupDocs.length === 0) return null
          const Icon = docTypeIcon[group.key] || File

          return (
            <div key={group.key} style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                {group.label}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {groupDocs.map(doc => (
                  <div key={doc.id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg)', border: '1px solid var(--border-3)', borderRadius: 10, padding: '12px 16px' }}>
                    <div style={{ width: 36, height: 36, background: 'var(--bg-2)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={16} style={{ color: '#FC75A0' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.name}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>
                        {doc.clientName && <span>{doc.clientName} · </span>}
                        {formatDate(doc.uploadedAt)} · {doc.fileSize}
                      </p>
                    </div>
                    <button style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 999, padding: '5px 14px', fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text)', flexShrink: 0 }}>
                      <Download size={11} /> Baixar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* ── MODAL NOVO CONTRATO ── */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'var(--overlay)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50,
          backdropFilter: 'blur(2px)',
        }} onClick={() => setShowModal(false)}>
          <div style={{
            background: 'var(--bg)', borderRadius: 20, padding: 32, width: '100%', maxWidth: 520,
            boxShadow: '0 24px 64px var(--shadow)', fontFamily: font,
          }} onClick={e => e.stopPropagation()}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, fontWeight: 600, color: 'var(--text)' }}>
                Novo <span style={{ color: '#FC75A0' }}>contrato</span>
              </h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-4)', display: 'flex' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>Cliente *</label>
                <select
                  value={form.clientId}
                  onChange={e => setForm(f => ({ ...f, clientId: e.target.value }))}
                  style={{ width: '100%', border: '1px solid var(--border-2)', borderRadius: 12, padding: '10px 14px', fontSize: 13, background: 'var(--bg-2)', color: 'var(--text)', outline: 'none', fontFamily: font }}
                >
                  <option value="">Selecione...</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>Tipo</label>
                  <input
                    value={form.type}
                    onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                    placeholder="Ex: social_media"
                    style={{ width: '100%', border: '1px solid var(--border-2)', borderRadius: 12, padding: '10px 14px', fontSize: 13, background: 'var(--bg-2)', color: 'var(--text)', outline: 'none', fontFamily: font, boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>Início *</label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                    style={{ width: '100%', border: '1px solid var(--border-2)', borderRadius: 12, padding: '10px 14px', fontSize: 13, background: 'var(--bg-2)', color: 'var(--text)', outline: 'none', fontFamily: font, boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>Valor (R$) *</label>
                  <input
                    type="number"
                    value={form.value}
                    onChange={e => setForm(f => ({ ...f, value: e.target.value }))}
                    placeholder="0,00"
                    style={{ width: '100%', border: '1px solid var(--border-2)', borderRadius: 12, padding: '10px 14px', fontSize: 13, background: 'var(--bg-2)', color: 'var(--text)', outline: 'none', fontFamily: font, boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>Status</label>
                  <select
                    value={form.status}
                    onChange={e => setForm(f => ({ ...f, status: e.target.value as Contract['status'] }))}
                    style={{ width: '100%', border: '1px solid var(--border-2)', borderRadius: 12, padding: '10px 14px', fontSize: 13, background: 'var(--bg-2)', color: 'var(--text)', outline: 'none', fontFamily: font }}
                  >
                    <option value="pendente_assinatura">Pendente assinatura</option>
                    <option value="ativo">Ativo</option>
                    <option value="expirado">Expirado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>Nome do arquivo *</label>
                <input
                  value={form.fileName}
                  onChange={e => setForm(f => ({ ...f, fileName: e.target.value }))}
                  placeholder="Ex: contrato-marca-junho-2025.pdf"
                  style={{ width: '100%', border: '1px solid var(--border-2)', borderRadius: 12, padding: '10px 14px', fontSize: 13, background: 'var(--bg-2)', color: 'var(--text)', outline: 'none', fontFamily: font, boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button
                  onClick={() => { setShowModal(false); setForm(emptyForm) }}
                  style={{ flex: 1, border: '1px solid var(--border-2)', background: 'none', borderRadius: 999, padding: '11px', fontSize: 13, fontWeight: 700, cursor: 'pointer', color: 'var(--text-2)', fontFamily: font }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAdd}
                  disabled={!form.clientId || !form.startDate || !form.value || !form.fileName}
                  style={{
                    flex: 2,
                    background: form.clientId && form.startDate && form.value && form.fileName ? '#FC75A0' : 'var(--border)',
                    color: form.clientId && form.startDate && form.value && form.fileName ? '#FFFFFF' : 'var(--text-4)',
                    borderRadius: 999, border: 'none', padding: '11px', fontSize: 13, fontWeight: 700,
                    cursor: form.clientId && form.startDate && form.value && form.fileName ? 'pointer' : 'not-allowed',
                    fontFamily: font, transition: 'all 0.15s',
                  }}
                >
                  Criar contrato
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
