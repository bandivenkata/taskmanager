import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Search, LogOut, ChevronLeft, ChevronRight, Pencil, Trash2, CheckSquare } from 'lucide-react'
import { fetchTasks, fetchUsers, deleteTask } from '../api/tasks'
import { useAuth } from '../context/AuthContext'
import type { Task, TaskFilters } from '../types'
import { Button, StatusBadge, PriorityBadge, Spinner, Select } from '../components/ui'
import TaskFormModal from '../components/TaskFormModal'
import { format } from 'date-fns'

const DEFAULT_FILTERS: TaskFilters = {
  status: '', assignedTo: '', search: '',
  page: 0, size: 10, sortBy: 'createdAt', sortDir: 'desc',
}

export default function TasksPage() {
  const { user, signOut }   = useAuth()
  const qc                  = useQueryClient()
  const [filters, setFilters] = useState<TaskFilters>(DEFAULT_FILTERS)
  const [search,  setSearch]  = useState('')
  const [modal,   setModal]   = useState<{ open: boolean; task?: Task | null }>({ open: false })
  const [delId,   setDelId]   = useState<number | null>(null)

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['tasks', filters],
    queryFn:  () => fetchTasks(filters),
    placeholderData: prev => prev,
  })

  const { data: users = [] } = useQuery({ queryKey: ['users'], queryFn: fetchUsers })

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess:  () => { qc.invalidateQueries({ queryKey: ['tasks'] }); setDelId(null) },
  })

  const applySearch = () => setFilters(f => ({ ...f, search, page: 0 }))

  const patch = (partial: Partial<TaskFilters>) =>
    setFilters(f => ({ ...f, ...partial, page: 0 }))

  const tasks       = data?.content ?? []
  const totalPages  = data?.totalPages ?? 1
  const totalEl     = data?.totalElements ?? 0

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <header style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        padding: '0 24px',
        height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            background: 'var(--accent)', borderRadius: 8,
            width: 30, height: 30,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <CheckSquare size={16} color="#fff" />
          </div>
          <span style={{ fontFamily: 'var(--font-head)', fontSize: 18, letterSpacing: '-0.5px' }}>
            Task Manager
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>
            {user?.fullName}
          </span>
          <Button variant="ghost" size="sm" onClick={signOut} style={{ gap: 6 }}>
            <LogOut size={14} />
            Sign Out
          </Button>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 24px' }}>
        {/* Page title + create */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 26, letterSpacing: '-0.8px' }}>Tasks</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 2 }}>
              {totalEl} task{totalEl !== 1 ? 's' : ''} total
            </p>
          </div>
          <Button onClick={() => setModal({ open: true, task: null })}>
            <Plus size={16} />
            New Task
          </Button>
        </div>

        {/* Filters */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: '16px 20px',
          marginBottom: 20,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          alignItems: 'flex-end',
        }}>
          {/* Search */}
          <div style={{ flex: '1 1 220px', position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && applySearch()}
              placeholder="Search tasks…"
              style={{
                background: 'var(--surface2)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '8px 12px 8px 32px',
                color: 'var(--text)',
                outline: 'none',
                width: '100%',
                fontSize: 14,
              }}
            />
          </div>
          <div style={{ flex: '0 0 140px' }}>
            <Select
              value={filters.status ?? ''}
              onChange={e => patch({ status: e.target.value as TaskFilters['status'] })}
            >
              <option value="">All Statuses</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </Select>
          </div>
          <div style={{ flex: '0 0 160px' }}>
            <Select
              value={filters.assignedTo ?? ''}
              onChange={e => patch({ assignedTo: e.target.value ? Number(e.target.value) : '' })}
            >
              <option value="">All Assignees</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.fullName}</option>)}
            </Select>
          </div>
          <Button size="sm" onClick={applySearch}>Search</Button>
          <Button size="sm" variant="ghost" onClick={() => { setSearch(''); setFilters(DEFAULT_FILTERS) }}>
            Reset
          </Button>
        </div>

        {/* Table */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          overflow: 'hidden',
        }}>
          {(isLoading || isFetching) && (
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, height: 3,
              background: 'linear-gradient(90deg, var(--accent), transparent)',
              animation: 'fadeIn .3s ease',
            }} />
          )}

          {isLoading ? (
            <div style={{ padding: 60, display: 'flex', justifyContent: 'center' }}>
              <Spinner size={32} />
            </div>
          ) : tasks.length === 0 ? (
            <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>
              <CheckSquare size={40} style={{ margin: '0 auto 12px', opacity: .3 }} />
              <p>No tasks found</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['Title', 'Status', 'Priority', 'Assigned To', 'Due Date', 'Actions'].map(h => (
                      <th key={h} style={{
                        padding: '12px 16px', textAlign: 'left',
                        fontSize: 12, fontWeight: 600,
                        color: 'var(--text-muted)', letterSpacing: '.5px',
                        textTransform: 'uppercase',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task, i) => (
                    <tr
                      key={task.id}
                      className="fade-in"
                      style={{
                        borderBottom: i < tasks.length - 1 ? '1px solid var(--border)' : 'none',
                        transition: 'background .15s',
                        animationDelay: `${i * 30}ms`,
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface2)')}
                      onMouseLeave={e => (e.currentTarget.style.background = '')}
                    >
                      <td style={{ padding: '14px 16px', maxWidth: 280 }}>
                        <div style={{ fontWeight: 500, marginBottom: 2 }}>{task.title}</div>
                        {task.description && (
                          <div style={{
                            color: 'var(--text-muted)', fontSize: 12,
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 260,
                          }}>
                            {task.description}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '14px 16px' }}><StatusBadge status={task.status} /></td>
                      <td style={{ padding: '14px 16px' }}><PriorityBadge priority={task.priority} /></td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontSize: 13 }}>
                        {task.assignedTo?.fullName ?? <span style={{ opacity: .5 }}>—</span>}
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontSize: 13, whiteSpace: 'nowrap' }}>
                        {task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : <span style={{ opacity: .5 }}>—</span>}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            onClick={() => setModal({ open: true, task })}
                            title="Edit"
                            style={{
                              background: 'var(--surface2)', border: '1px solid var(--border)',
                              borderRadius: 7, padding: '5px 8px',
                              color: 'var(--text-muted)', cursor: 'pointer',
                              display: 'flex', alignItems: 'center',
                            }}
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={() => setDelId(task.id)}
                            title="Delete"
                            style={{
                              background: '#ef444411', border: '1px solid #ef444433',
                              borderRadius: 7, padding: '5px 8px',
                              color: 'var(--danger)', cursor: 'pointer',
                              display: 'flex', alignItems: 'center',
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginTop: 16, flexWrap: 'wrap', gap: 10,
          }}>
            <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>
              Page {filters.page + 1} of {totalPages}
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              <Button variant="ghost" size="sm"
                disabled={filters.page === 0}
                onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}>
                <ChevronLeft size={14} /> Prev
              </Button>
              <Button variant="ghost" size="sm"
                disabled={data?.last}
                onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}>
                Next <ChevronRight size={14} />
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Task form modal */}
      {modal.open && (
        <TaskFormModal task={modal.task} onClose={() => setModal({ open: false })} />
      )}

      {/* Delete confirm */}
      {delId !== null && (
        <div
          onClick={() => setDelId(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,.65)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="fade-in"
            style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 14, padding: 28, maxWidth: 380, width: '100%',
              boxShadow: 'var(--shadow)',
            }}
          >
            <h3 style={{ fontFamily: 'var(--font-head)', marginBottom: 10 }}>Delete Task?</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>
              This action cannot be undone. The task will be permanently removed.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <Button variant="ghost" onClick={() => setDelId(null)}>Cancel</Button>
              <Button
                variant="danger"
                loading={deleteMutation.isPending}
                onClick={() => deleteMutation.mutate(delId)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
