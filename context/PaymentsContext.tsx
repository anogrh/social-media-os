'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Payment } from '@/lib/types'

function rowToPayment(row: Record<string, unknown>): Payment {
  return {
    id: row.id as string,
    clientId: row.client_id as string,
    clientName: row.client_name as string,
    value: Number(row.value),
    dueDate: row.due_date as string,
    paidDate: row.paid_date as string | undefined,
    status: row.status as Payment['status'],
    method: row.method as string | undefined,
    reference: row.reference as string,
    receiptUrl: row.receipt_url as string | undefined,
    notes: row.notes as string | undefined,
  }
}

function paymentToRow(p: Partial<Payment>) {
  return {
    ...(p.clientId !== undefined && { client_id: p.clientId }),
    ...(p.clientName !== undefined && { client_name: p.clientName }),
    ...(p.value !== undefined && { value: p.value }),
    ...(p.dueDate !== undefined && { due_date: p.dueDate }),
    ...(p.paidDate !== undefined && { paid_date: p.paidDate }),
    ...(p.status !== undefined && { status: p.status }),
    ...(p.method !== undefined && { method: p.method }),
    ...(p.reference !== undefined && { reference: p.reference }),
    ...(p.receiptUrl !== undefined && { receipt_url: p.receiptUrl }),
    ...(p.notes !== undefined && { notes: p.notes }),
  }
}

type PaymentsContextValue = {
  payments: Payment[]
  isReady: boolean
  addPayment: (data: Omit<Payment, 'id'>) => Promise<Payment | null>
  updatePayment: (id: string, updates: Partial<Payment>) => Promise<void>
  deletePayment: (id: string) => Promise<void>
  reload: () => Promise<void>
}

const PaymentsContext = createContext<PaymentsContextValue | null>(null)

export function PaymentsProvider({ children }: { children: React.ReactNode }) {
  const [payments, setPayments] = useState<Payment[]>([])
  const [isReady, setIsReady] = useState(false)

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .order('due_date', { ascending: false })

    if (!error && data) {
      setPayments(data.map(rowToPayment))
    }
    setIsReady(true)
  }, [])

  useEffect(() => { load() }, [load])

  const addPayment = useCallback(async (data: Omit<Payment, 'id'>): Promise<Payment | null> => {
    const { data: row, error } = await supabase
      .from('payments')
      .insert(paymentToRow(data as Partial<Payment>))
      .select()
      .single()

    if (error || !row) { console.error(error); return null }
    const newPayment = rowToPayment(row as Record<string, unknown>)
    setPayments(prev => [newPayment, ...prev])
    return newPayment
  }, [])

  const updatePayment = useCallback(async (id: string, updates: Partial<Payment>) => {
    const { error } = await supabase
      .from('payments')
      .update({ ...paymentToRow(updates), updated_at: new Date().toISOString() })
      .eq('id', id)

    if (!error) {
      setPayments(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p))
    } else {
      console.error(error)
    }
  }, [])

  const deletePayment = useCallback(async (id: string) => {
    const { error } = await supabase.from('payments').delete().eq('id', id)
    if (!error) {
      setPayments(prev => prev.filter(p => p.id !== id))
    } else {
      console.error(error)
    }
  }, [])

  return (
    <PaymentsContext.Provider value={{ payments, isReady, addPayment, updatePayment, deletePayment, reload: load }}>
      {children}
    </PaymentsContext.Provider>
  )
}

export function usePayments(): PaymentsContextValue {
  const ctx = useContext(PaymentsContext)
  if (!ctx) throw new Error('usePayments must be used within PaymentsProvider')
  return ctx
}
