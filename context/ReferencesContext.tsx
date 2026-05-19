'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Reference } from '@/lib/types'

function rowToReference(row: Record<string, unknown>): Reference {
  return {
    id: row.id as string,
    title: row.title as string,
    url: row.url as string,
    category: row.category as string,
    type: row.type as Reference['type'],
    description: row.description as string | undefined,
    tags: (row.tags as string[]) || [],
    addedAt: (row.added_at as string)?.slice(0, 10),
  }
}

function referenceToRow(r: Partial<Reference>) {
  return {
    ...(r.title !== undefined && { title: r.title }),
    ...(r.url !== undefined && { url: r.url }),
    ...(r.category !== undefined && { category: r.category }),
    ...(r.type !== undefined && { type: r.type }),
    ...(r.description !== undefined && { description: r.description }),
    ...(r.tags !== undefined && { tags: r.tags }),
  }
}

type ReferencesContextValue = {
  references: Reference[]
  isReady: boolean
  addReference: (data: Omit<Reference, 'id' | 'addedAt'>) => Promise<Reference | null>
  updateReference: (id: string, updates: Partial<Reference>) => Promise<void>
  deleteReference: (id: string) => Promise<void>
  reload: () => Promise<void>
}

const ReferencesContext = createContext<ReferencesContextValue | null>(null)

export function ReferencesProvider({ children }: { children: React.ReactNode }) {
  const [references, setReferences] = useState<Reference[]>([])
  const [isReady, setIsReady] = useState(false)

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from('references')
      .select('*')
      .order('added_at', { ascending: false })

    if (!error && data) {
      setReferences(data.map(rowToReference))
    }
    setIsReady(true)
  }, [])

  useEffect(() => { load() }, [load])

  const addReference = useCallback(async (data: Omit<Reference, 'id' | 'addedAt'>): Promise<Reference | null> => {
    const { data: row, error } = await supabase
      .from('references')
      .insert(referenceToRow(data as Partial<Reference>))
      .select()
      .single()

    if (error || !row) { console.error(error); return null }
    const newRef = rowToReference(row as Record<string, unknown>)
    setReferences(prev => [newRef, ...prev])
    return newRef
  }, [])

  const updateReference = useCallback(async (id: string, updates: Partial<Reference>) => {
    const { error } = await supabase
      .from('references')
      .update({ ...referenceToRow(updates), updated_at: new Date().toISOString() })
      .eq('id', id)

    if (!error) {
      setReferences(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r))
    } else {
      console.error(error)
    }
  }, [])

  const deleteReference = useCallback(async (id: string) => {
    const { error } = await supabase.from('references').delete().eq('id', id)
    if (!error) {
      setReferences(prev => prev.filter(r => r.id !== id))
    } else {
      console.error(error)
    }
  }, [])

  return (
    <ReferencesContext.Provider value={{ references, isReady, addReference, updateReference, deleteReference, reload: load }}>
      {children}
    </ReferencesContext.Provider>
  )
}

export function useReferences(): ReferencesContextValue {
  const ctx = useContext(ReferencesContext)
  if (!ctx) throw new Error('useReferences must be used within ReferencesProvider')
  return ctx
}
