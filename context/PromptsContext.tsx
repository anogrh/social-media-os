'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Prompt } from '@/lib/types'

function rowToPrompt(row: Record<string, unknown>): Prompt {
  return {
    id: row.id as string,
    name: row.name as string,
    category: row.category as string,
    content: row.content as string,
    tags: (row.tags as string[]) || [],
    createdAt: (row.created_at as string)?.slice(0, 10),
  }
}

function promptToRow(p: Partial<Prompt>) {
  return {
    ...(p.name !== undefined && { name: p.name }),
    ...(p.category !== undefined && { category: p.category }),
    ...(p.content !== undefined && { content: p.content }),
    ...(p.tags !== undefined && { tags: p.tags }),
  }
}

type PromptsContextValue = {
  prompts: Prompt[]
  isReady: boolean
  addPrompt: (data: Omit<Prompt, 'id' | 'createdAt'>) => Promise<Prompt | null>
  updatePrompt: (id: string, updates: Partial<Prompt>) => Promise<void>
  deletePrompt: (id: string) => Promise<void>
  reload: () => Promise<void>
}

const PromptsContext = createContext<PromptsContextValue | null>(null)

export function PromptsProvider({ children }: { children: React.ReactNode }) {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [isReady, setIsReady] = useState(false)

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .order('created_at', { ascending: true })

    if (!error && data) {
      setPrompts(data.map(rowToPrompt))
    }
    setIsReady(true)
  }, [])

  useEffect(() => { load() }, [load])

  const addPrompt = useCallback(async (data: Omit<Prompt, 'id' | 'createdAt'>): Promise<Prompt | null> => {
    const { data: row, error } = await supabase
      .from('prompts')
      .insert(promptToRow(data as Partial<Prompt>))
      .select()
      .single()

    if (error || !row) { console.error(error); return null }
    const newPrompt = rowToPrompt(row as Record<string, unknown>)
    setPrompts(prev => [...prev, newPrompt])
    return newPrompt
  }, [])

  const updatePrompt = useCallback(async (id: string, updates: Partial<Prompt>) => {
    const { error } = await supabase
      .from('prompts')
      .update({ ...promptToRow(updates), updated_at: new Date().toISOString() })
      .eq('id', id)

    if (!error) {
      setPrompts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p))
    } else {
      console.error(error)
    }
  }, [])

  const deletePrompt = useCallback(async (id: string) => {
    const { error } = await supabase.from('prompts').delete().eq('id', id)
    if (!error) {
      setPrompts(prev => prev.filter(p => p.id !== id))
    } else {
      console.error(error)
    }
  }, [])

  return (
    <PromptsContext.Provider value={{ prompts, isReady, addPrompt, updatePrompt, deletePrompt, reload: load }}>
      {children}
    </PromptsContext.Provider>
  )
}

export function usePrompts(): PromptsContextValue {
  const ctx = useContext(PromptsContext)
  if (!ctx) throw new Error('usePrompts must be used within PromptsProvider')
  return ctx
}
