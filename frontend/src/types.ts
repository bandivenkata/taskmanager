export type TaskStatus   = 'TODO' | 'IN_PROGRESS' | 'DONE'
export type TaskPriority = 'LOW'  | 'MEDIUM'      | 'HIGH'

export interface UserSummary {
  id:       number
  username: string
  fullName: string
  email:    string
  role:     string
}

export interface Task {
  id:          number
  title:       string
  description: string | null
  status:      TaskStatus
  priority:    TaskPriority
  dueDate:     string | null
  createdBy:   UserSummary
  assignedTo:  UserSummary | null
  createdAt:   string
  updatedAt:   string
}

export interface PagedResponse<T> {
  content:       T[]
  page:          number
  size:          number
  totalElements: number
  totalPages:    number
  last:          boolean
}

export interface AuthResponse {
  token: string
  user:  UserSummary
}

export interface TaskFilters {
  status?:     TaskStatus | ''
  assignedTo?: number | ''
  search?:     string
  page:        number
  size:        number
  sortBy:      string
  sortDir:     'asc' | 'desc'
}
