'use client'

import { useState } from 'react'
import { Plus, X, Calendar, User, Tag, AlertCircle } from 'lucide-react'
import Header from '@/components/layout/Header'
import StatusBadge from '@/components/ui/StatusBadge'
import { useTasks } from '@/context/TasksContext'
import { useClients } from '@/context/ClientsContext'
import { formatDate } from '@/lib/utils'
import type { TaskStatus, Task, TaskPriority } from '@/lib/types'

const COLUMNS: { id: TaskStatus; label: string; color: string; bg: string }[] = [
  { id: 'pendente',    label: 'Pendente',     color: '#6b7280', bg: '#f3f4f6' },
  { id: 'em_andamento', label: 'Em andamento', color: '#3B82F6', bg: '#dbeafe' },
  { id: 'em_revisao',  label: 'Em revisão',   color: '#F59E0B', bg: '#fef3c7' },
  { id: 'concluido',   label: 'Concluído',    color: '#10B981', bg: '#d1fae5' },
]

const PRIORITY_STYLES: Record<TaskPriority, { bg: string; color: string; label: string }> = {
  baixa:   { bg: '#f3f4f6', color: '#4b5563', label: 'Baixa' },
  media:   { bg: '#dbeafe', color: '#1d4ed8', label: 'Média' },
  alta:    { bg: '#fef3c7', color: '#b45309', label: 'Alta'  },
  urgente: { bg: '#fee2e2', color: '#b91c1c', label: 'Urgente' },
}

const emptyForm = {
  title: '', clientId: '', priority: 'media' as TaskPriority,
  status: 'pendente' as TaskStatus, dueDate: '', assignee: '', tags: '',
}

export default function TarefasPage() {
  const { tasks: taskList, addTask, updateTask, isReady } = useTasks()
  const { clients } = useClients()
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)

  const font = "'Inter', system-ui, sans-serif"

  function byCol(status: TaskStatus) {
    return taskList.filter(t => t.status === status)
  }

  async function handleAdd() {
    if (!form.title.trim()) return
    const client = clients.find(c => c.id === form.clientId)
    await addTask({
      title: form.title,
      clientId: form.clientId || undefined,
      clientName: client?.name,
      clientColor: client?.color,
      priority: form.priority,
      status: form.status,
      dueDate: form.dueDate || new Date().toISOString().split('T')[0],
      assignee: form.assignee || undefined,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    })
    setForm(emptyForm)
    setShowModal(false)
  }

  async function moveTask(taskId: string, newStatus: TaskStatus) {
    await updateTask(taskId, { status: newStatus })
  }

  if (!isReady) {
    return (
      <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
        <Header title="Tarefas" subtitle="Kanban da operação" />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid #FC75A0', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Header title="Tarefas" subtitle="Kanban da operação" />

      <div className="page-pad" style={{ fontFamily: font }}>

        {/* Stats + action row */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24, alignItems: 'center', flexWrap: 'wrap' }}>
          {COLUMNS.map(col => {
            const count = byCol(col.id).length
            return (
              <div key={col.id} style={{ background: 'var(--bg-2)', borderRadius: 999, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: col.color, display: 'inline-block' }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{count}</span>
                <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{col.label}</span>
              </div>
            )
          })}
          <div style={{ flex: 1 }} />
          <button
            onClick={() => setShowModal(true)}
            style={{ background: '#FC75A0', color: '#FFFFFF', borderRadius: 999, padding: '10px 20px', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7 }}
          >
            <Plus size={15} /> Nova tarefa
          </button>
        </div>

        {/* Kanban */}
        <div className="rg-4" style={{ gap: 16, alignItems: 'start' }}>
          {COLUMNS.map(col => {
            const colTasks = byCol(col.id)
            return (
              <div key={col.id}>
                {/* Column header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, padding: '0 4px' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: col.color, display: 'inline-block' }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{col.label}</span>
                  <span style={{
                    fontSize: 11, color: col.color, background: col.bg,
                    borderRadius: 999, padding: '1px 8px', marginLeft: 'auto', fontWeight: 700,
                  }}>
                    {colTasks.length}
                  </span>
                </div>

                {/* Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {colTasks.map(task => {
                    const ps = PRIORITY_STYLES[task.priority]
                    return (
                      <div key={task.id} style={{
                        background: 'var(--bg)', border: '1px solid var(--border)',
                        borderRadius: 12, padding: 14, cursor: 'pointer',
                        boxShadow: '0 1px 4px var(--shadow)',
                        transition: 'box-shadow 0.15s',
                      }}>
                        {/* Client */}
                        {task.clientName && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: task.clientColor || '#ccc', flexShrink: 0, display: 'inline-block' }} />
                            <span style={{ fontSize: 11, color: 'var(--text-2)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {task.clientName}
                            </span>
                          </div>
                        )}

                        {/* Title */}
                        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', lineHeight: 1.45, marginBottom: 10 }}>
                          {task.title}
                        </p>

                        {/* Tags */}
                        {task.tags && task.tags.length > 0 && (
                          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
                            {task.tags.slice(0, 3).map(tag => (
                              <span key={tag} style={{ background: 'var(--bg-2)', color: 'var(--text-2)', fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 999 }}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Footer */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: 11, color: 'var(--text-4)' }}>
                            {task.dueDate ? `Vence ${formatDate(task.dueDate)}` : '—'}
                          </span>
                          <span style={{ ...ps, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999 }}>
                            {ps.label}
                          </span>
                        </div>

                        {/* Assignee + move */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border-3)' }}>
                          {task.assignee ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#FBD0DA', fontSize: 9, fontWeight: 700, color: 'var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {task.assignee.split(' ').map(w => w[0]).join('').slice(0, 2)}
                              </div>
                              <span style={{ fontSize: 11, color: 'var(--text-2)' }}>{task.assignee}</span>
                            </div>
                          ) : <span />}

                          {/* Quick move */}
                          <select
                            value={task.status}
                            onChange={e => moveTask(task.id, e.target.value as TaskStatus)}
                            onClick={e => e.stopPropagation()}
                            style={{ fontSize: 10, border: '1px solid var(--border)', borderRadius: 999, padding: '2px 6px', background: 'var(--bg-2)', color: 'var(--text)', outline: 'none', cursor: 'pointer' }}
                          >
                            {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                          </select>
                        </div>
                      </div>
                    )
                  })}

                  {colTasks.length === 0 && (
                    <div style={{ background: 'var(--bg-2)', borderRadius: 10, padding: '28px 14px', textAlign: 'center', border: '1px dashed var(--border)' }}>
                      <p style={{ fontSize: 12, color: 'var(--text-4)' }}>Nenhuma tarefa</p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── MODAL ───────────────────────────────────────────────── */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'var(--overlay)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50,
          backdropFilter: 'blur(2px)',
        }} onClick={() => setShowModal(false)}>
          <div style={{
            background: 'var(--bg)', borderRadius: 20, padding: 32, width: '100%', maxWidth: 520,
            boxShadow: '0 24px 64px var(--shadow)', fontFamily: font,
          }} onClick={e => e.stopPropagation()}>

            {/* Modal header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, fontWeight: 600, color: 'var(--text)' }}>
                Nova <span style={{ color: '#FC75A0' }}>tarefa</span>
              </h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-4)', display: 'flex' }}>
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Title */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>
                  Título da tarefa *
                </label>
                <input
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Ex: Criar grid de junho para Sinta Gummies"
                  style={{ width: '100%', border: '1px solid var(--border-2)', borderRadius: 12, padding: '10px 14px', fontSize: 13, background: 'var(--bg-2)', color: 'var(--text)', outline: 'none', fontFamily: font, boxSizing: 'border-box' }}
                />
              </div>

              {/* Client + Priority */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>
                    <User size={10} style={{ display: 'inline', marginRight: 4 }} /> Cliente
                  </label>
                  <select
                    value={form.clientId}
                    onChange={e => setForm(f => ({ ...f, clientId: e.target.value }))}
                    style={{ width: '100%', border: '1px solid var(--border-2)', borderRadius: 12, padding: '10px 14px', fontSize: 13, background: 'var(--bg-2)', color: 'var(--text)', outline: 'none', fontFamily: font }}
                  >
                    <option value="">Sem cliente</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>
                    <AlertCircle size={10} style={{ display: 'inline', marginRight: 4 }} /> Prioridade
                  </label>
                  <select
                    value={form.priority}
                    onChange={e => setForm(f => ({ ...f, priority: e.target.value as TaskPriority }))}
                    style={{ width: '100%', border: '1px solid var(--border-2)', borderRadius: 12, padding: '10px 14px', fontSize: 13, background: 'var(--bg-2)', color: 'var(--text)', outline: 'none', fontFamily: font }}
                  >
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                    <option value="urgente">Urgente</option>
                  </select>
                </div>
              </div>

              {/* Status + Due date */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>
                    Status inicial
                  </label>
                  <select
                    value={form.status}
                    onChange={e => setForm(f => ({ ...f, status: e.target.value as TaskStatus }))}
                    style={{ width: '100%', border: '1px solid var(--border-2)', borderRadius: 12, padding: '10px 14px', fontSize: 13, background: 'var(--bg-2)', color: 'var(--text)', outline: 'none', fontFamily: font }}
                  >
                    {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>
                    <Calendar size={10} style={{ display: 'inline', marginRight: 4 }} /> Prazo
                  </label>
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
                    style={{ width: '100%', border: '1px solid var(--border-2)', borderRadius: 12, padding: '10px 14px', fontSize: 13, background: 'var(--bg-2)', color: 'var(--text)', outline: 'none', fontFamily: font }}
                  />
                </div>
              </div>

              {/* Assignee + Tags */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>
                    Responsável
                  </label>
                  <input
                    value={form.assignee}
                    onChange={e => setForm(f => ({ ...f, assignee: e.target.value }))}
                    placeholder="Ex: Rhania N."
                    style={{ width: '100%', border: '1px solid var(--border-2)', borderRadius: 12, padding: '10px 14px', fontSize: 13, background: 'var(--bg-2)', color: 'var(--text)', outline: 'none', fontFamily: font }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>
                    <Tag size={10} style={{ display: 'inline', marginRight: 4 }} /> Tags (separadas por vírgula)
                  </label>
                  <input
                    value={form.tags}
                    onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                    placeholder="reels, copy, estrategia"
                    style={{ width: '100%', border: '1px solid var(--border-2)', borderRadius: 12, padding: '10px 14px', fontSize: 13, background: 'var(--bg-2)', color: 'var(--text)', outline: 'none', fontFamily: font }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button
                  onClick={() => { setShowModal(false); setForm(emptyForm) }}
                  style={{ flex: 1, border: '1px solid var(--border-2)', background: 'none', borderRadius: 999, padding: '11px', fontSize: 13, fontWeight: 700, cursor: 'pointer', color: 'var(--text-2)', fontFamily: font }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAdd}
                  disabled={!form.title.trim()}
                  style={{
                    flex: 2, background: form.title.trim() ? '#FC75A0' : 'var(--border)',
                    color: form.title.trim() ? '#FFFFFF' : 'var(--text-4)',
                    borderRadius: 999, border: 'none', padding: '11px', fontSize: 13, fontWeight: 700,
                    cursor: form.title.trim() ? 'pointer' : 'not-allowed', fontFamily: font,
                    transition: 'all 0.15s',
                  }}
                >
                  Criar tarefa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
