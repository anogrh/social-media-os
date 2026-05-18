import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ClientStatus, PaymentStatus, TaskStatus, TaskPriority, ContentFormat, AlertSeverity } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatCurrencyFull(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

export function formatDateMonth(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
}

export function formatNumber(value: number): string {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`
  return value.toString()
}

export function getClientStatusColor(status: ClientStatus): string {
  switch (status) {
    case 'ativo': return 'bg-emerald-100 text-emerald-700'
    case 'pausado': return 'bg-amber-100 text-amber-700'
    case 'encerrado': return 'bg-gray-100 text-gray-600'
    case 'onboarding': return 'bg-blue-100 text-blue-700'
    default: return 'bg-gray-100 text-gray-600'
  }
}

export function getClientStatusDot(status: ClientStatus): string {
  switch (status) {
    case 'ativo': return 'bg-emerald-500'
    case 'pausado': return 'bg-amber-500'
    case 'encerrado': return 'bg-gray-400'
    case 'onboarding': return 'bg-blue-500'
    default: return 'bg-gray-400'
  }
}

export function getPaymentStatusColor(status: PaymentStatus): string {
  switch (status) {
    case 'pago': return 'bg-emerald-100 text-emerald-700'
    case 'pendente': return 'bg-amber-100 text-amber-700'
    case 'atrasado': return 'bg-red-100 text-red-700'
    case 'cancelado': return 'bg-gray-100 text-gray-600'
    default: return 'bg-gray-100 text-gray-600'
  }
}

export function getTaskStatusColor(status: TaskStatus): string {
  switch (status) {
    case 'pendente': return 'bg-gray-100 text-gray-700'
    case 'em_andamento': return 'bg-blue-100 text-blue-700'
    case 'em_revisao': return 'bg-amber-100 text-amber-700'
    case 'concluido': return 'bg-emerald-100 text-emerald-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

export function getTaskPriorityColor(priority: TaskPriority): string {
  switch (priority) {
    case 'baixa': return 'bg-gray-100 text-gray-600'
    case 'media': return 'bg-blue-100 text-blue-700'
    case 'alta': return 'bg-amber-100 text-amber-700'
    case 'urgente': return 'bg-red-100 text-red-700'
    default: return 'bg-gray-100 text-gray-600'
  }
}

export function getContentFormatColor(format: ContentFormat): string {
  switch (format) {
    case 'reels': return 'bg-[#FC75A0] text-white'
    case 'carrossel': return 'bg-[#F19877] text-white'
    case 'story': return 'bg-[#FBD0DA] text-[#1F1B1A]'
    case 'feed': return 'bg-[#F2F4A4] text-[#1F1B1A]'
    case 'blog': return 'bg-blue-100 text-blue-700'
    case 'tiktok': return 'bg-gray-900 text-white'
    default: return 'bg-gray-100 text-gray-700'
  }
}

export function getAlertSeverityColor(severity: AlertSeverity): string {
  switch (severity) {
    case 'info': return 'border-l-blue-500 bg-blue-50'
    case 'warning': return 'border-l-amber-500 bg-amber-50'
    case 'error': return 'border-l-red-500 bg-red-50'
    case 'success': return 'border-l-emerald-500 bg-emerald-50'
    default: return 'border-l-gray-300 bg-gray-50'
  }
}

export function getAlertIconColor(severity: AlertSeverity): string {
  switch (severity) {
    case 'info': return 'text-blue-500'
    case 'warning': return 'text-amber-500'
    case 'error': return 'text-red-500'
    case 'success': return 'text-emerald-500'
    default: return 'text-gray-400'
  }
}

export function getDaysUntil(dateStr: string): number {
  const target = new Date(dateStr + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diff = target.getTime() - today.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function isOverdue(dateStr: string): boolean {
  return getDaysUntil(dateStr) < 0
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('')
}
