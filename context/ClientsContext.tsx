'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import type { Client } from '@/lib/types'
import { loadClients, persistClients, genId } from '@/lib/client-store'

interface ClientsContextValue {
  clients: Client[]
  isReady: boolean
  getClientById: (id: string) => Client | undefined
  addClient: (data: Omit<Client, 'id' | 'createdAt'>) => Client
  updateClient: (id: string, updates: Partial<Client>) => void
  deleteClient: (id: string) => void
}

const ClientsContext = createContext<ClientsContextValue | null>(null)

export function ClientsProvider({ children }: { children: React.ReactNode }) {
  const [clients, setClients] = useState<Client[]>([])
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setClients(loadClients())
    setIsReady(true)
  }, [])

  function getClientById(id: string): Client | undefined {
    return clients.find(c => c.id === id)
  }

  function addClient(data: Omit<Client, 'id' | 'createdAt'>): Client {
    const newClient: Client = {
      ...data,
      id: genId(),
      createdAt: new Date().toISOString().split('T')[0],
    }
    const updated = [...clients, newClient]
    setClients(updated)
    persistClients(updated)
    return newClient
  }

  function updateClient(id: string, updates: Partial<Client>): void {
    const updated = clients.map(c => c.id === id ? { ...c, ...updates } : c)
    setClients(updated)
    persistClients(updated)
  }

  function deleteClient(id: string): void {
    const updated = clients.filter(c => c.id !== id)
    setClients(updated)
    persistClients(updated)
  }

  return (
    <ClientsContext.Provider value={{ clients, isReady, getClientById, addClient, updateClient, deleteClient }}>
      {children}
    </ClientsContext.Provider>
  )
}

export function useClients(): ClientsContextValue {
  const ctx = useContext(ClientsContext)
  if (!ctx) throw new Error('useClients must be used within a ClientsProvider')
  return ctx
}
