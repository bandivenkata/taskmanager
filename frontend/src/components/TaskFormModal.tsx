import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchUsers, createTask, updateTask } from '../api/tasks'
import type { Task } from '../types'
import { Modal, Button, Spinner } from '../components/ui'

interface FormData {
  title:        string
  description:  string
  status:       string
  priority:     string
  dueDate:      string
  assignedToId: string
}

interface Props { task?: Task | null; onClose: () => void }

const fieldStyle: React.CSSProperties = {
  background: 'var(--surface2)', border: '1px solid var(--border)',
  borderRadius: 'var(--radius)', padding: '8px 12px',
  color: 'var(--text)', outline: 'none', width: '100%',
  fontSize: 14, fontFamily: 'inherit', boxSizing: 'border-box',
}
const errStyle: React.CSSProperties = { fontSize: 12, color: 'var(--danger)' }
const labelStyle: React.CSSProperties = { fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }

export default function TaskFormModal({ task, onClose }: Props) {
  const qc = useQueryClient()

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['users'], queryFn: fetchUsers,
  })

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    defaultValues: {
      title:        task?.title       ?? '',
      description:  task?.description ?? '',
      status:       task?.status      ?? 'TODO',
      priority:     task?.priority    ?? 'MEDIUM',
      dueDate:      task?.dueDate     ?? '',
      assignedToId: task?.assignedTo ? String(task.assignedTo.id) : '',
    },
  })

  useEffect(() => {
    reset({
      title:        task?.title       ?? '',
      description:  task?.description ?? '',
      status:       task?.status      ?? 'TODO',
      priority:     task?.priority    ?? 'MEDIUM',
      dueDate:      task?.dueDate     ?? '',
      assignedToId: task?.assignedTo ? String(task.assignedTo.id) : '',
    })
  }, [task, reset])

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tasks'] }); onClose() },
  })
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Parameters<typeof updateTask>[1] }) => updateTask(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tasks'] }); onClose() },
  })

  const onSubmit = async (data: FormData) => {
    const payload = {
      title:        data.title,
      description:  data.description || undefined,
      status:       data.status,
      priority:     data.priority,
      dueDate:      data.dueDate || null,
      assignedToId: data.assignedToId ? Number(data.assignedToId) : null,
    }
    if (task) updateMutation.mutate({ id: task.id, data: payload })
    else      createMutation.mutate(payload)
  }

  const mutErr = (createMutation.error || updateMutation.error) as Error | null

  return (
    <Modal title={task ? 'Edit Task' : 'New Task'} onClose={onClose}>
      {usersLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}><Spinner /></div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Title */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={labelStyle}>Title *</label>
            <input placeholder="What needs to be done?" style={{ ...fieldStyle, borderColor: errors.title ? 'var(--danger)' : 'var(--border)' }}
              {...register('title', { required: 'Title is required', maxLength: { value: 200, message: 'Max 200 chars' } })} />
            {errors.title && <span style={errStyle}>{errors.title.message}</span>}
          </div>

          {/* Description */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={labelStyle}>Description</label>
            <textarea {...register('description')} rows={3} placeholder="Optional details..."
              style={{ ...fieldStyle, resize: 'vertical' }} />
          </div>

          {/* Status + Priority */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={labelStyle}>Status</label>
              <select style={fieldStyle} {...register('status')}>
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={labelStyle}>Priority</label>
              <select style={fieldStyle} {...register('priority')}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>

          {/* Due Date + Assignee */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={labelStyle}>Due Date</label>
              <input type="date" style={fieldStyle} {...register('dueDate')} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={labelStyle}>Assign To</label>
              <select style={fieldStyle} {...register('assignedToId')}>
                <option value="">Unassigned</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.fullName}</option>)}
              </select>
            </div>
          </div>

          {mutErr && (
            <div style={{ background: '#ef444422', border: '1px solid #ef444444', borderRadius: 8, padding: '10px 14px', color: 'var(--danger)', fontSize: 13 }}>
              {mutErr.message || 'Something went wrong'}
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" loading={isSubmitting || createMutation.isPending || updateMutation.isPending}>
              {task ? 'Save Changes' : 'Create Task'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  )
}
