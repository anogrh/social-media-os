import { cn } from '@/lib/utils'
import type { ClientStatus, PaymentStatus, TaskStatus } from '@/lib/types'

type StatusValue = ClientStatus | PaymentStatus | TaskStatus | string

const statusConfig: Record<string, { bg: string; color: string; label: string }> = {
  // Client
  ativo: { bg: '#dcfce7', color: '#16a34a', label: 'Ativo' },
  pausado: { bg: '#fef9c3', color: '#ca8a04', label: 'Pausado' },
  encerrado: { bg: '#f3f4f6', color: '#6b7280', label: 'Encerrado' },
  onboarding: { bg: '#dbeafe', color: '#2563eb', label: 'Onboarding' },
  // Payment
  pago: { bg: '#dcfce7', color: '#16a34a', label: 'Pago' },
  pendente: { bg: '#fef9c3', color: '#ca8a04', label: 'Pendente' },
  atrasado: { bg: '#fee2e2', color: '#dc2626', label: 'Atrasado' },
  cancelado: { bg: '#f3f4f6', color: '#6b7280', label: 'Cancelado' },
  // Task
  em_andamento: { bg: '#dbeafe', color: '#2563eb', label: 'Em andamento' },
  em_revisao: { bg: '#fef9c3', color: '#ca8a04', label: 'Em revisão' },
  concluido: { bg: '#dcfce7', color: '#16a34a', label: 'Concluído' },
  // Contract
  pendente_assinatura: { bg: '#fef3c7', color: '#d97706', label: 'Pendente assinatura' },
  expirado: { bg: '#fee2e2', color: '#dc2626', label: 'Expirado' },
  // Content
  ideia: { bg: '#f3f4f6', color: '#6b7280', label: 'Ideia' },
  rascunho: { bg: '#faf5ff', color: '#7c3aed', label: 'Rascunho' },
  producao: { bg: '#dbeafe', color: '#2563eb', label: 'Produção' },
  revisao: { bg: '#fef9c3', color: '#ca8a04', label: 'Revisão' },
  aprovado: { bg: '#dcfce7', color: '#16a34a', label: 'Aprovado' },
  agendado: { bg: '#ede9fe', color: '#7c3aed', label: 'Agendado' },
  publicado: { bg: '#d1fae5', color: '#059669', label: 'Publicado' },
}

interface StatusBadgeProps {
  status: StatusValue
  className?: string
  size?: 'sm' | 'md'
}

export default function StatusBadge({ status, className, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status] || { bg: '#f3f4f6', color: '#6b7280', label: status }

  return (
    <span
      style={{
        background: config.bg,
        color: config.color,
        fontFamily: "'Inter', system-ui, sans-serif",
        fontWeight: 600,
        fontSize: size === 'sm' ? 11 : 12,
        padding: size === 'sm' ? '2px 8px' : '3px 10px',
        borderRadius: 999,
        display: 'inline-flex',
        alignItems: 'center',
        whiteSpace: 'nowrap',
      }}
      className={cn('inline-flex items-center', className)}
    >
      {config.label}
    </span>
  )
}
