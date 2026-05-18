'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Client } from '@/lib/types'

// Map Supabase snake_case row → Client camelCase
function rowToClient(row: Record<string, unknown>): Client {
  return {
    id: row.id as string,
    name: row.name as string,
    segment: row.segment as string,
    status: row.status as Client['status'],
    email: row.email as string,
    phone: row.phone as string | undefined,
    website: row.website as string | undefined,
    initials: row.initials as string,
    color: row.color as string,
    instagramHandle: row.instagram_handle as string | undefined,
    monthlyValue: Number(row.monthly_value),
    contractStart: row.contract_start as string,
    contractEnd: row.contract_end as string | undefined,
    nextPaymentDate: row.next_payment_date as string,
    paymentStatus: row.payment_status as Client['paymentStatus'],
    servicePackage: row.service_package as string,
    postsPerMonth: Number(row.posts_per_month),
    reelsPerMonth: Number(row.reels_per_month),
    storiesPerWeek: Number(row.stories_per_week),
    brandVoice: row.brand_voice as string | undefined,
    persona: row.persona as string | undefined,
    positioning: row.positioning as string | undefined,
    contentPillars: (row.content_pillars as string[]) || [],
    objectives: (row.objectives as string[]) || [],
    notes: row.internal_notes as string | undefined,
    createdAt: (row.created_at as string)?.slice(0, 10),
  }
}

// Map Client camelCase → Supabase snake_case
function clientToRow(c: Partial<Client>) {
  return {
    ...(c.name !== undefined && { name: c.name }),
    ...(c.segment !== undefined && { segment: c.segment }),
    ...(c.status !== undefined && { status: c.status }),
    ...(c.email !== undefined && { email: c.email }),
    ...(c.phone !== undefined && { phone: c.phone }),
    ...(c.website !== undefined && { website: c.website }),
    ...(c.initials !== undefined && { initials: c.initials }),
    ...(c.color !== undefined && { color: c.color }),
    ...(c.instagramHandle !== undefined && { instagram_handle: c.instagramHandle }),
    ...(c.monthlyValue !== undefined && { monthly_value: c.monthlyValue }),
    ...(c.contractStart !== undefined && { contract_start: c.contractStart }),
    ...(c.contractEnd !== undefined && { contract_end: c.contractEnd }),
    ...(c.nextPaymentDate !== undefined && { next_payment_date: c.nextPaymentDate }),
    ...(c.paymentStatus !== undefined && { payment_status: c.paymentStatus }),
    ...(c.servicePackage !== undefined && { service_package: c.servicePackage }),
    ...(c.postsPerMonth !== undefined && { posts_per_month: c.postsPerMonth }),
    ...(c.reelsPerMonth !== undefined && { reels_per_month: c.reelsPerMonth }),
    ...(c.storiesPerWeek !== undefined && { stories_per_week: c.storiesPerWeek }),
    ...(c.brandVoice !== undefined && { brand_voice: c.brandVoice }),
    ...(c.persona !== undefined && { persona: c.persona }),
    ...(c.positioning !== undefined && { positioning: c.positioning }),
    ...(c.contentPillars !== undefined && { content_pillars: c.contentPillars }),
    ...(c.objectives !== undefined && { objectives: c.objectives }),
    ...(c.notes !== undefined && { internal_notes: c.notes }),
  }
}

type ClientsContextValue = {
  clients: Client[]
  isReady: boolean
  getClientById: (id: string) => Client | undefined
  addClient: (data: Omit<Client, 'id' | 'createdAt'>) => Promise<Client | null>
  updateClient: (id: string, updates: Partial<Client>) => Promise<void>
  deleteClient: (id: string) => Promise<void>
  reload: () => Promise<void>
}

const ClientsContext = createContext<ClientsContextValue | null>(null)

export function ClientsProvider({ children }: { children: React.ReactNode }) {
  const [clients, setClients] = useState<Client[]>([])
  const [isReady, setIsReady] = useState(false)

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: true })

    if (!error && data) {
      setClients(data.map(rowToClient))
    }
    setIsReady(true)
  }, [])

  useEffect(() => { load() }, [load])

  const getClientById = useCallback(
    (id: string) => clients.find(c => c.id === id),
    [clients]
  )

  const addClient = useCallback(async (data: Omit<Client, 'id' | 'createdAt'>): Promise<Client | null> => {
    const { data: row, error } = await supabase
      .from('clients')
      .insert(clientToRow(data as Partial<Client>))
      .select()
      .single()

    if (error || !row) { console.error(error); return null }
    const newClient = rowToClient(row as Record<string, unknown>)
    setClients(prev => [...prev, newClient])
    return newClient
  }, [])

  const updateClient = useCallback(async (id: string, updates: Partial<Client>) => {
    const { error } = await supabase
      .from('clients')
      .update({ ...clientToRow(updates), updated_at: new Date().toISOString() })
      .eq('id', id)

    if (!error) {
      setClients(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c))
    } else {
      console.error(error)
    }
  }, [])

  const deleteClient = useCallback(async (id: string) => {
    const { error } = await supabase.from('clients').delete().eq('id', id)
    if (!error) {
      setClients(prev => prev.filter(c => c.id !== id))
    } else {
      console.error(error)
    }
  }, [])

  return (
    <ClientsContext.Provider value={{ clients, isReady, getClientById, addClient, updateClient, deleteClient, reload: load }}>
      {children}
    </ClientsContext.Provider>
  )
}

export function useClients(): ClientsContextValue {
  const ctx = useContext(ClientsContext)
  if (!ctx) throw new Error('useClients must be used within ClientsProvider')
  return ctx
}
