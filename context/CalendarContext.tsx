'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { ContentCalendarItem } from '@/lib/types'

function rowToCalendarItem(row: Record<string, unknown>): ContentCalendarItem {
  return {
    id: row.id as string,
    clientId: row.client_id as string,
    clientName: row.client_name as string,
    clientColor: row.client_color as string,
    date: row.date as string,
    format: row.format as ContentCalendarItem['format'],
    caption: row.caption as string | undefined,
    status: row.status as ContentCalendarItem['status'],
    assignee: row.assignee as string | undefined,
    tags: (row.tags as string[]) || [],
    instagramPostId: row.instagram_post_id as string | undefined,
    scheduledTime: row.scheduled_time as string | undefined,
    description: row.description as string | undefined,
    content: row.content as string | undefined,
    deliveryDate: row.delivery_date as string | undefined,
    attachments: (row.attachments as string[]) || [],
  }
}

function calendarItemToRow(item: Partial<ContentCalendarItem>) {
  return {
    ...(item.clientId !== undefined && { client_id: item.clientId }),
    ...(item.clientName !== undefined && { client_name: item.clientName }),
    ...(item.clientColor !== undefined && { client_color: item.clientColor }),
    ...(item.date !== undefined && { date: item.date }),
    ...(item.format !== undefined && { format: item.format }),
    ...(item.caption !== undefined && { caption: item.caption }),
    ...(item.status !== undefined && { status: item.status }),
    ...(item.assignee !== undefined && { assignee: item.assignee }),
    ...(item.tags !== undefined && { tags: item.tags }),
    ...(item.instagramPostId !== undefined && { instagram_post_id: item.instagramPostId }),
    ...(item.scheduledTime !== undefined && { scheduled_time: item.scheduledTime }),
    ...(item.description !== undefined && { description: item.description }),
    ...(item.content !== undefined && { content: item.content }),
    ...(item.deliveryDate !== undefined && { delivery_date: item.deliveryDate }),
    ...(item.attachments !== undefined && { attachments: item.attachments }),
  }
}

type CalendarContextValue = {
  items: ContentCalendarItem[]
  isReady: boolean
  addItem: (data: Omit<ContentCalendarItem, 'id'>) => Promise<ContentCalendarItem | null>
  updateItem: (id: string, updates: Partial<ContentCalendarItem>) => Promise<void>
  deleteItem: (id: string) => Promise<void>
  reload: () => Promise<void>
}

const CalendarContext = createContext<CalendarContextValue | null>(null)

export function CalendarProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ContentCalendarItem[]>([])
  const [isReady, setIsReady] = useState(false)

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from('calendar_items')
      .select('*')
      .order('date', { ascending: true })

    if (!error && data) {
      setItems(data.map(rowToCalendarItem))
    }
    setIsReady(true)
  }, [])

  useEffect(() => { load() }, [load])

  const addItem = useCallback(async (data: Omit<ContentCalendarItem, 'id'>): Promise<ContentCalendarItem | null> => {
    const { data: row, error } = await supabase
      .from('calendar_items')
      .insert(calendarItemToRow(data as Partial<ContentCalendarItem>))
      .select()
      .single()

    if (error || !row) { console.error(error); return null }
    const newItem = rowToCalendarItem(row as Record<string, unknown>)
    setItems(prev => [...prev, newItem].sort((a, b) => a.date.localeCompare(b.date)))
    return newItem
  }, [])

  const updateItem = useCallback(async (id: string, updates: Partial<ContentCalendarItem>) => {
    const { error } = await supabase
      .from('calendar_items')
      .update({ ...calendarItemToRow(updates), updated_at: new Date().toISOString() })
      .eq('id', id)

    if (!error) {
      setItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item))
    } else {
      console.error(error)
    }
  }, [])

  const deleteItem = useCallback(async (id: string) => {
    const { error } = await supabase.from('calendar_items').delete().eq('id', id)
    if (!error) {
      setItems(prev => prev.filter(item => item.id !== id))
    } else {
      console.error(error)
    }
  }, [])

  return (
    <CalendarContext.Provider value={{ items, isReady, addItem, updateItem, deleteItem, reload: load }}>
      {children}
    </CalendarContext.Provider>
  )
}

export function useCalendar(): CalendarContextValue {
  const ctx = useContext(CalendarContext)
  if (!ctx) throw new Error('useCalendar must be used within CalendarProvider')
  return ctx
}
