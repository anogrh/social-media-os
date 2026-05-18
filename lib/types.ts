export type ClientStatus = 'ativo' | 'pausado' | 'encerrado' | 'onboarding'

export type PaymentStatus = 'pago' | 'pendente' | 'atrasado' | 'cancelado'

export type TaskStatus = 'pendente' | 'em_andamento' | 'em_revisao' | 'concluido'

export type TaskPriority = 'baixa' | 'media' | 'alta' | 'urgente'

export type ContentFormat = 'reels' | 'carrossel' | 'story' | 'feed' | 'blog' | 'tiktok'

export type ContentStatus = 'ideia' | 'rascunho' | 'producao' | 'revisao' | 'aprovado' | 'agendado' | 'publicado'

export type AlertSeverity = 'info' | 'warning' | 'error' | 'success'

export type DocumentType = 'contrato' | 'comprovante' | 'briefing' | 'identidade_visual' | 'relatorio' | 'outro'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'admin' | 'gestor' | 'criativo' | 'financeiro'
}

export interface InstagramAccount {
  id: string
  clientId: string
  handle: string
  profileUrl?: string
  connected: boolean
  followers: number
  following: number
  posts: number
  reach30d: number
  impressions30d: number
  engagementRate: number
  profileVisits30d: number
  reelsViews30d: number
  storiesViews30d: number
  savedPosts30d: number
  newFollowers30d: number
}

export interface InstagramDailyMetric {
  date: string
  followers: number
  reach: number
  impressions: number
  engagement: number
  newFollowers: number
}

export interface Client {
  id: string
  name: string
  segment: string
  status: ClientStatus
  email: string
  phone?: string
  website?: string
  logoUrl?: string
  initials: string
  color: string
  instagramHandle?: string
  instagramAccountId?: string
  monthlyValue: number
  contractStart: string
  contractEnd?: string
  nextPaymentDate: string
  paymentStatus: PaymentStatus
  servicePackage: string
  postsPerMonth: number
  reelsPerMonth: number
  storiesPerWeek: number
  notes?: string
  brandVoice?: string
  persona?: string
  positioning?: string
  contentPillars?: string[]
  objectives?: string[]
  createdAt: string
}

export interface Payment {
  id: string
  clientId: string
  clientName: string
  value: number
  dueDate: string
  paidDate?: string
  status: PaymentStatus
  method?: string
  reference: string
  receiptUrl?: string
  notes?: string
}

export interface Contract {
  id: string
  clientId: string
  clientName: string
  type: string
  signedDate?: string
  startDate: string
  endDate?: string
  value: number
  status: 'ativo' | 'expirado' | 'pendente_assinatura' | 'cancelado'
  fileUrl?: string
  fileName: string
  fileSize?: string
}

export interface Document {
  id: string
  clientId?: string
  clientName?: string
  type: DocumentType
  name: string
  fileName: string
  fileSize: string
  uploadedAt: string
  uploadedBy: string
  fileUrl?: string
  tags?: string[]
}

export interface Task {
  id: string
  title: string
  description?: string
  clientId?: string
  clientName?: string
  clientColor?: string
  status: TaskStatus
  priority: TaskPriority
  assignee?: string
  dueDate: string
  createdAt: string
  tags?: string[]
}

export interface ContentCalendarItem {
  id: string
  clientId: string
  clientName: string
  clientColor: string
  date: string
  format: ContentFormat
  caption?: string
  status: ContentStatus
  assignee?: string
  tags?: string[]
  instagramPostId?: string
  scheduledTime?: string
}

export interface ContentIdea {
  id: string
  clientId: string
  clientName: string
  title: string
  description: string
  format: ContentFormat
  status: ContentStatus
  tags?: string[]
  createdAt: string
  reference?: string
}

export interface Alert {
  id: string
  type: 'payment_overdue' | 'performance_drop' | 'contract_expiring' | 'task_overdue' | 'client_inactive' | 'goal_reached'
  severity: AlertSeverity
  title: string
  message: string
  clientId?: string
  clientName?: string
  actionLabel?: string
  actionHref?: string
  createdAt: string
  read: boolean
}

export interface RevenueMonth {
  month: string
  previsto: number
  recebido: number
  pendente: number
}

export interface Prompt {
  id: string
  name: string
  category: string
  content: string
  tags?: string[]
  createdAt: string
}

export interface Reference {
  id: string
  title: string
  url: string
  category: string
  type: 'design' | 'copy' | 'video' | 'trend' | 'campanha'
  description?: string
  tags?: string[]
  addedAt: string
}
