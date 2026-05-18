import { AlertCircle, AlertTriangle, Info, CheckCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import type { Alert } from '@/lib/types'
import { getAlertSeverityColor, getAlertIconColor } from '@/lib/utils'

const severityIcons = {
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
  success: CheckCircle,
}

interface AlertItemProps {
  alert: Alert
}

export default function AlertItem({ alert }: AlertItemProps) {
  const Icon = severityIcons[alert.severity]

  return (
    <div
      style={{
        background: 'var(--bg)',
        border: '1px solid var(--border-3)',
        borderLeft: `3px solid ${
          alert.severity === 'error' ? '#EE3528' :
          alert.severity === 'warning' ? '#F59E0B' :
          alert.severity === 'success' ? '#10B981' : '#3B82F6'
        }`,
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
      className="rounded-xl p-4"
    >
      <div className="flex items-start gap-3">
        <Icon
          size={16}
          style={{
            flexShrink: 0,
            marginTop: 2,
            color:
              alert.severity === 'error' ? '#EE3528' :
              alert.severity === 'warning' ? '#F59E0B' :
              alert.severity === 'success' ? '#10B981' : '#3B82F6',
          }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{alert.title}</p>
            {alert.clientName && (
              <span style={{ fontSize: 11, color: 'var(--text-2)', whiteSpace: 'nowrap' }}>
                {alert.clientName}
              </span>
            )}
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 2, lineHeight: 1.5 }}>
            {alert.message}
          </p>
          {alert.actionLabel && alert.actionHref && (
            <Link
              href={alert.actionHref}
              style={{ color: '#F25BA5', fontSize: 12, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 3, marginTop: 6 }}
              className="hover:underline"
            >
              {alert.actionLabel} <ArrowRight size={11} />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
