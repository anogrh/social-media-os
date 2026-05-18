import { TrendingUp, TrendingDown, Minus, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  icon: LucideIcon
  label: string
  value: string
  change?: number
  changeLabel?: string
  accent?: string
  iconBg?: string
  className?: string
}

export default function MetricCard({
  icon: Icon,
  label,
  value,
  change,
  changeLabel,
  accent = '#FC75A0',
  iconBg = '#FBD0DA',
  className,
}: MetricCardProps) {
  const isPositive = change !== undefined && change > 0
  const isNegative = change !== undefined && change < 0

  return (
    <div
      style={{
        background: 'var(--bg)',
        border: '1px solid var(--border)',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
      className={cn('rounded-xl p-5', className)}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          style={{ background: iconBg, color: accent }}
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
        >
          <Icon size={18} />
        </div>
        {change !== undefined && (
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: isPositive ? '#16a34a' : isNegative ? '#dc2626' : 'var(--text-2)',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            {isPositive ? <TrendingUp size={12} /> : isNegative ? <TrendingDown size={12} /> : <Minus size={12} />}
            {isPositive ? '+' : ''}{change}%
          </span>
        )}
      </div>

      <p style={{ fontSize: 26, fontWeight: 700, color: 'var(--text)', lineHeight: 1.1 }}>
        {value}
      </p>
      <p style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 4 }}>{label}</p>

      {changeLabel && (
        <p style={{ fontSize: 11, color: 'var(--text-4)', marginTop: 6 }}>{changeLabel}</p>
      )}
    </div>
  )
}
