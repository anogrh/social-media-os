import { clients as defaultClients } from './mock-data'
import type { Client } from './types'

const KEY = 'rhania_clients_v1'

export function loadClients(): Client[] {
  if (typeof window === 'undefined') return defaultClients
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as Client[]
  } catch {}
  return defaultClients
}

export function persistClients(list: Client[]): void {
  try { localStorage.setItem(KEY, JSON.stringify(list)) } catch {}
}

export function genId(): string {
  return 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5)
}
