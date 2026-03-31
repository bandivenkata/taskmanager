import api from './client'
import type { AuthResponse, Task, PagedResponse, TaskFilters, UserSummary } from '../types'

// ── Auth ──────────────────────────────────────────────────────────────────────
export const login = async (username: string, password: string): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/api/auth/login', { username, password })
  return data
}

// ── Tasks ─────────────────────────────────────────────────────────────────────
export const fetchTasks = async (filters: TaskFilters): Promise<PagedResponse<Task>> => {
  const params: Record<string, string | number> = {
    page:    filters.page,
    size:    filters.size,
    sortBy:  filters.sortBy,
    sortDir: filters.sortDir,
  }
  if (filters.status)     params.status     = filters.status
  if (filters.assignedTo) params.assignedTo = filters.assignedTo
  if (filters.search)     params.search     = filters.search

  const { data } = await api.get<PagedResponse<Task>>('/api/tasks', { params })
  return data
}

export const fetchTask = async (id: number): Promise<Task> => {
  const { data } = await api.get<Task>(`/api/tasks/${id}`)
  return data
}

export interface TaskPayload {
  title:        string
  description?: string
  status:       string
  priority:     string
  dueDate?:     string | null
  assignedToId?: number | null
}

export const createTask = async (payload: TaskPayload): Promise<Task> => {
  const { data } = await api.post<Task>('/api/tasks', payload)
  return data
}

export const updateTask = async (id: number, payload: Partial<TaskPayload>): Promise<Task> => {
  const { data } = await api.patch<Task>(`/api/tasks/${id}`, payload)
  return data
}

export const deleteTask = async (id: number): Promise<void> => {
  await api.delete(`/api/tasks/${id}`)
}

// ── Users ─────────────────────────────────────────────────────────────────────
export const fetchUsers = async (): Promise<UserSummary[]> => {
  const { data } = await api.get<UserSummary[]>('/api/users')
  return data
}
