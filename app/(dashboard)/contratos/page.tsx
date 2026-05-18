'use client'

import { Upload, Download, FileText, FileImage, FileCheck, File } from 'lucide-react'
import Header from '@/components/layout/Header'
import StatusBadge from '@/components/ui/StatusBadge'
import { documents, contracts } from '@/lib/mock-data'
import { formatDate } from '@/lib/utils'

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

export default function ContratosPage() {
  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      <Header title="Contratos & documentos" subtitle="Todos os arquivos e contratos" />

      <div style={{ padding: '24px 28px', fontFamily: "'Inter', system-ui, sans-serif" }}>
        {/* Upload area */}
        <div style={{
          border: '2px dashed rgba(31,27,26,0.20)',
          background: '#FBD0DA',
          borderRadius: 16,
          padding: '32px',
          textAlign: 'center',
          marginBottom: 28,
          cursor: 'pointer',
        }}
          className="hover:border-[#F25BA5] transition-colors"
        >
          <Upload size={28} style={{ color: '#F25BA5', margin: '0 auto 10px' }} />
          <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 14, fontWeight: 600, color: '#1F1B1A', marginBottom: 4 }}>Arraste e solte arquivos aqui</p>
          <p style={{ fontSize: 12, color: 'rgba(31,27,26,0.6)', marginBottom: 14 }}>PDF, PNG, JPG, DOCX — máximo 50MB</p>
          <button style={{ background: '#F25BA5', color: '#FFFFFF', borderRadius: 999, padding: '8px 20px', border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
            Ou escolher arquivo
          </button>
        </div>

        {/* Contracts table */}
        <div style={{ background: '#FFFFFF', border: '1px solid rgba(31,27,26,0.10)', borderRadius: 12, overflow: 'hidden', marginBottom: 24 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(31,27,26,0.08)', background: '#F5F4F2' }}>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, fontWeight: 600, color: '#1F1B1A' }}>Contratos ativos</h3>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#F5F4F2' }}>
              <tr>
                {['Cliente', 'Arquivo', 'Início', 'Valor/mês', 'Status', ''].map(h => (
                  <th key={h} style={{ fontSize: 11, fontWeight: 700, color: 'rgba(31,27,26,0.5)', textAlign: 'left', padding: '10px 16px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {contracts.map(c => (
                <tr key={c.id} style={{ borderTop: '1px solid rgba(31,27,26,0.06)' }}>
                  <td style={{ fontSize: 13, fontWeight: 600, color: '#1F1B1A', padding: '12px 16px' }}>{c.clientName}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 30, height: 30, background: '#FBD0DA', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FileCheck size={14} style={{ color: '#F25BA5' }} />
                      </div>
                      <div>
                        <p style={{ fontSize: 12, fontWeight: 600, color: '#1F1B1A' }}>{c.fileName}</p>
                        {c.fileSize && <p style={{ fontSize: 11, color: 'rgba(31,27,26,0.4)' }}>{c.fileSize}</p>}
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: 13, color: '#1F1B1A', padding: '12px 16px' }}>{formatDate(c.startDate)}</td>
                  <td style={{ fontSize: 13, fontWeight: 700, color: '#1F1B1A', padding: '12px 16px' }}>R$ {c.value.toLocaleString('pt-BR')}</td>
                  <td style={{ padding: '12px 16px' }}><StatusBadge status={c.status} size="sm" /></td>
                  <td style={{ padding: '12px 16px' }}>
                    <button style={{ background: 'none', border: '1px solid rgba(31,27,26,0.12)', borderRadius: 999, padding: '5px 12px', fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: '#1F1B1A' }}>
                      <Download size={11} /> Baixar
                    </button>
                  </td>
                </tr>
              ))}
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
              <h4 style={{ fontSize: 13, fontWeight: 700, color: 'rgba(31,27,26,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                {group.label}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {groupDocs.map(doc => (
                  <div key={doc.id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#FFFFFF', border: '1px solid rgba(31,27,26,0.08)', borderRadius: 10, padding: '12px 16px' }}>
                    <div style={{ width: 36, height: 36, background: '#F5F4F2', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={16} style={{ color: '#F25BA5' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#1F1B1A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.name}</p>
                      <p style={{ fontSize: 11, color: 'rgba(31,27,26,0.45)', marginTop: 2 }}>
                        {doc.clientName && <span>{doc.clientName} · </span>}
                        {formatDate(doc.uploadedAt)} · {doc.fileSize}
                      </p>
                    </div>
                    <button style={{ background: 'none', border: '1px solid rgba(31,27,26,0.12)', borderRadius: 999, padding: '5px 14px', fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: '#1F1B1A', flexShrink: 0 }}>
                      <Download size={11} /> Baixar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
