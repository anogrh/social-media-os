'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Contract } from '@/lib/types'

function rowToContract(row: Record<string, unknown>): Contract {
  return {
    id: row.id as string,
    clientId: row.client_id as string,
    clientName: row.client_name as string,
    type: row.type as string,
    signedDate: row.signed_date as string | undefined,
    startDate: row.start_date as string,
    endDate: row.end_date as string | undefined,
    value: Number(row.value),
    status: row.status as Contract['status'],
    fileUrl: row.file_url as string | undefined,
    fileName: row.file_name as string,
    fileSize: row.file_size as string | undefined,
  }
}

function contractToRow(c: Partial<Contract>) {
  return {
    ...(c.clientId !== undefined && { client_id: c.clientId }),
    ...(c.clientName !== undefined && { client_name: c.clientName }),
    ...(c.type !== undefined && { type: c.type }),
    ...(c.signedDate !== undefined && { signed_date: c.signedDate }),
    ...(c.startDate !== undefined && { start_date: c.startDate }),
    ...(c.endDate !== undefined && { end_date: c.endDate }),
    ...(c.value !== undefined && { value: c.value }),
    ...(c.status !== undefined && { status: c.status }),
    ...(c.fileUrl !== undefined && { file_url: c.fileUrl }),
    ...(c.fileName !== undefined && { file_name: c.fileName }),
    ...(c.fileSize !== undefined && { file_size: c.fileSize }),
  }
}

type ContractsContextValue = {
  contracts: Contract[]
  isReady: boolean
  addContract: (data: Omit<Contract, 'id'>) => Promise<Contract | null>
  updateContract: (id: string, updates: Partial<Contract>) => Promise<void>
  deleteContract: (id: string) => Promise<void>
  reload: () => Promise<void>
}

const ContractsContext = createContext<ContractsContextValue | null>(null)

export function ContractsProvider({ children }: { children: React.ReactNode }) {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [isReady, setIsReady] = useState(false)

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setContracts(data.map(rowToContract))
    }
    setIsReady(true)
  }, [])

  useEffect(() => { load() }, [load])

  const addContract = useCallback(async (data: Omit<Contract, 'id'>): Promise<Contract | null> => {
    const { data: row, error } = await supabase
      .from('contracts')
      .insert(contractToRow(data as Partial<Contract>))
      .select()
      .single()

    if (error || !row) { console.error(error); return null }
    const newContract = rowToContract(row as Record<string, unknown>)
    setContracts(prev => [newContract, ...prev])
    return newContract
  }, [])

  const updateContract = useCallback(async (id: string, updates: Partial<Contract>) => {
    const { error } = await supabase
      .from('contracts')
      .update({ ...contractToRow(updates), updated_at: new Date().toISOString() })
      .eq('id', id)

    if (!error) {
      setContracts(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c))
    } else {
      console.error(error)
    }
  }, [])

  const deleteContract = useCallback(async (id: string) => {
    const { error } = await supabase.from('contracts').delete().eq('id', id)
    if (!error) {
      setContracts(prev => prev.filter(c => c.id !== id))
    } else {
      console.error(error)
    }
  }, [])

  return (
    <ContractsContext.Provider value={{ contracts, isReady, addContract, updateContract, deleteContract, reload: load }}>
      {children}
    </ContractsContext.Provider>
  )
}

export function useContracts(): ContractsContextValue {
  const ctx = useContext(ContractsContext)
  if (!ctx) throw new Error('useContracts must be used within ContractsProvider')
  return ctx
}
