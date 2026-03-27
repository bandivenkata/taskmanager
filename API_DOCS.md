# Task Manager – API Documentation

Base URL: `http://localhost:8080/api`

All protected endpoints require:
```
Authorization: Bearer <JWT token>
```

---

## Authentication

### POST /auth/login

Authenticate a user and receive a JWT token.

**Request Body**
```json
{ "username": "admin", "password": "password123" }
```

**Response 200**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "fullName": "Admin User",
    "email": "admin@example.com",
    "role": "ADMIN"
  }
}
```

**Error 401** – Invalid credentials
```json
{ "status": 401, "error": "Unauthorized", "message": "Invalid username or password", "timestamp": "..." }
```

---

## Tasks

### GET /tasks

Fetch a paginated, filtered list of tasks.

**Query Parameters**

| Param       | Type    | Required | Default    | Description                          |
|-------------|---------|----------|------------|--------------------------------------|
| status      | string  | No       | –          | `TODO` \| `IN_PROGRESS` \| `DONE`    |
| assignedTo  | number  | No       | –          | User ID                              |
| search      | string  | No       | –          | Title/description substring          |
| page        | number  | No       | 0          | Zero-based page index                |
| size        | number  | No       | 10         | Page size                            |
| sortBy      | string  | No       | createdAt  | Field to sort by                     |
| sortDir     | string  | No       | desc       | `asc` \| `desc`                      |

**Response 200**
```json
{
  "content": [
    {
      "id": 1,
      "title": "Set up CI/CD pipeline",
      "description": "Configure GitHub Actions...",
      "status": "TODO",
      "priority": "HIGH",
      "dueDate": "2025-04-15",
      "createdBy":  { "id": 1, "username": "admin", "fullName": "Admin User", "email": "...", "role": "ADMIN" },
      "assignedTo": { "id": 2, "username": "satya", "fullName": "Satya Varun", "email": "...", "role": "USER" },
      "createdAt": "2025-03-01T10:00:00",
      "updatedAt": "2025-03-01T10:00:00"
    }
  ],
  "page": 0,
  "size": 10,
  "totalElements": 10,
  "totalPages": 1,
  "last": true
}
```

---

### GET /tasks/{id}

Get a single task by ID.

**Response 200** – Task object (same shape as above)

**Error 404** – Task not found
```json
{ "status": 404, "error": "Not Found", "message": "Task not found: 99", "timestamp": "..." }
```

---

### POST /tasks

Create a new task. The authenticated user becomes `createdBy`.

**Request Body**
```json
{
  "title":        "New feature",
  "description":  "Implement dark mode toggle",
  "status":       "TODO",
  "priority":     "MEDIUM",
  "dueDate":      "2025-05-01",
  "assignedToId": 2
}
```

| Field        | Type   | Required | Constraints         |
|--------------|--------|----------|---------------------|
| title        | string | Yes      | max 200 chars       |
| description  | string | No       | –                   |
| status       | enum   | Yes      | TODO/IN_PROGRESS/DONE |
| priority     | enum   | Yes      | LOW/MEDIUM/HIGH     |
| dueDate      | date   | No       | ISO 8601 (YYYY-MM-DD) |
| assignedToId | number | No       | Must be valid user ID |

**Response 201** – Created task object

**Error 400** – Validation failure
```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "fields": { "title": "must not be blank", "status": "must not be null" }
}
```

---

### PATCH /tasks/{id}

Partially update a task. All fields are optional.

**Request Body** (any subset of create fields)
```json
{ "status": "IN_PROGRESS", "assignedToId": 3 }
```

**Response 200** – Updated task object

---

### DELETE /tasks/{id}

Soft-delete a task (sets `deleted_at` timestamp).

**Response 204** – No content

---

## Users

### GET /users

Get all active (non-deleted) users. Used to populate the assignee dropdown.

**Response 200**
```json
[
  { "id": 1, "username": "admin",   "fullName": "Admin User",    "email": "admin@example.com",   "role": "ADMIN" },
  { "id": 2, "username": "satya",   "fullName": "Satya Varun",  "email": "satya@example.com",   "role": "USER"  },
  { "id": 3, "username": "varun",     "fullName": "Varun Bandi",      "email": "varun@example.com",     "role": "USER"  },
  { "id": 4, "username": "bandi", "fullName": "Bandi Varun",  "email": "bandi@example.com", "role": "USER"  }
]
```

---

## Error Format

All errors follow this structure:
```json
{
  "status":    400,
  "error":     "Bad Request",
  "message":   "Validation failed",
  "timestamp": "2025-03-25T10:30:00",
  "fields":    { "fieldName": "error message" }
}
```

| HTTP Status | Meaning                             |
|-------------|-------------------------------------|
| 400         | Validation / bad input              |
| 401         | Missing or invalid JWT              |
| 404         | Resource not found                  |
| 500         | Unexpected server error             |
