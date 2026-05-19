'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Task, TaskStatus } from '@/lib/types'

function rowToTask(row: Record<string, unknown>): Task {
  return {
    id: row.id as string,
    title: row.title as string,
    description: row.description as string | undefined,
    clientId: row.client_id as string | undefined,
    clientName: row.client_name as string | undefined,
    clientColor: row.client_color as string | undefined,
    status: row.status as Task['status'],
    priority: row.priority as Task['priority'],
    assignee: row.assignee as string | undefined,
    dueDate: row.due_date as string,
    tags: (row.tags as string[]) || [],
    createdAt: (row.created_at as string)?.slice(0, 10),
  }
}

function taskToRow(t: Partial<Task>) {
  return {
    ...(t.title !== undefined && { title: t.title }),
    ...(t.description !== undefined && { description: t.description }),
    ...(t.clientId !== undefined && { client_id: t.clientId }),
    ...(t.clientName !== undefined && { client_name: t.clientName }),
    ...(t.clientColor !== undefined && { client_color: t.clientColor }),
    ...(t.status !== undefined && { status: t.status }),
    ...(t.priority !== undefined && { priority: t.priority }),
    ...(t.assignee !== undefined && { assignee: t.assignee }),
    ...(t.dueDate !== undefined && { due_date: t.dueDate }),
    ...(t.tags !== undefined && { tags: t.tags }),
  }
}

type TasksContextValue = {
  tasks: Task[]
  isReady: boolean
  addTask: (data: Omit<Task, 'id' | 'createdAt'>) => Promise<Task | null>
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  moveTask: (id: string, newStatus: TaskStatus) => Promise<void>
  reload: () => Promise<void>
}

const TasksContext = createContext<TasksContextValue | null>(null)

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isReady, setIsReady] = useState(false)

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: true })

    if (!error && data) {
      setTasks(data.map(rowToTask))
    }
    setIsReady(true)
  }, [])

  useEffect(() => { load() }, [load])

  const addTask = useCallback(async (data: Omit<Task, 'id' | 'createdAt'>): Promise<Task | null> => {
    const { data: row, error } = await supabase
      .from('tasks')
      .insert(taskToRow(data as Partial<Task>))
      .select()
      .single()

    if (error || !row) { console.error(error); return null }
    const newTask = rowToTask(row as Record<string, unknown>)
    setTasks(prev => [...prev, newTask])
    return newTask
  }, [])

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    const { error } = await supabase
      .from('tasks')
      .update({ ...taskToRow(updates), updated_at: new Date().toISOString() })
      .eq('id', id)

    if (!error) {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
    } else {
      console.error(error)
    }
  }, [])

  const deleteTask = useCallback(async (id: string) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id)
    if (!error) {
      setTasks(prev => prev.filter(t => t.id !== id))
    } else {
      console.error(error)
    }
  }, [])

  const moveTask = useCallback(async (id: string, newStatus: TaskStatus) => {
    await updateTask(id, { status: newStatus })
  }, [updateTask])

  return (
    <TasksContext.Provider value={{ tasks, isReady, addTask, updateTask, deleteTask, moveTask, reload: load }}>
      {children}
    </TasksContext.Provider>
  )
}

export function useTasks(): TasksContextValue {
  const ctx = useContext(TasksContext)
  if (!ctx) throw new Error('useTasks must be used within TasksProvider')
  return ctx
}
