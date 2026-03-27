# Task Manager – Full Stack (Microchip Exercise)

A full-stack task management system built with **React (Vite) + Spring Boot + PostgreSQL**.

---

## Architecture

```
taskmanager/
├── backend/ (Spring Boot 3)
│   ├── src/main/java/com/taskmanager/
│   │   ├── controller/
│   │   │   ├── AuthController
│   │   │   └── TaskController 
│   │   │
│   │   ├── service/
│   │   │   ├── AuthService
│   │   │   └── TaskService 
│   │   │
│   │   ├── repository/
│   │   │   ├── UserRepository
│   │   │   └── TaskRepository
│   │   │
│   │   ├── security/
│   │   │   ├── JwtAuthFilter
│   │   │   ├── JwtUtils
│   │   │   └── SecurityConfig
│   │   │
│   │   ├── entity/
│   │   │   ├── User (ADMIN / USER)
│   │   │   └── Task
│   │   │
│   │   ├── dto/
│   │   ├── exception/
│   │   └── config/
│   │
│   └── src/main/resources/
│       ├── application.properties
│       └── db/migration/   ⭐ ( DB layer)
│           ├── V1__init_schema.sql
│           └── V2__seed_data.sql
│
├── frontend/ (React + Vite)
│   ├── pages/
│   ├── components/
│   ├── context/ (AuthContext)
│   └── api/ (Axios client)
## Tech Stack

| Layer    | Technology                                      |
|----------|-------------------------------------------------|
| Frontend | React 18, Vite, TypeScript, TanStack Query, React Hook Form |
| Backend  | Java 17, Spring Boot 3, Spring Security, JWT   |
| Database | PostgreSQL 15, Flyway migrations                |
| Docs     | SpringDoc OpenAPI (Swagger UI)                  |

---

## Prerequisites

- Java 17+
- Maven 3.9+
- Node.js 18+
- PostgreSQL 15+

---

## Database Setup

```sql
CREATE DATABASE taskmanager;
-- Default credentials: postgres / postgres
-- Update backend/src/main/resources/application.properties if different
```

Flyway runs migrations automatically on startup:
- `V1__init_schema.sql` – creates `users` and `tasks` tables with indexes
- `V2__seed_data.sql`   – seeds 4 users and 10 sample tasks

---

## Backend Setup

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Server starts on **http://localhost:8080**

Swagger UI: **http://localhost:8080/swagger-ui.html**

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

App starts on **http://localhost:5173**

The Vite dev server proxies `/api` requests to `http://localhost:8080`.

---

## Demo Credentials

| Username | Password    | Role  |
|----------|-------------|-------|
| admin    | password123 | ADMIN |
| satya    | password123 | USER  |
| varun    | password123 | USER  |
| bandi    | password123 | USER  |

---

## API Overview

All task/user endpoints require `Authorization: Bearer <token>`.

| Method | Endpoint               | Description                            |
|--------|------------------------|----------------------------------------|
| POST   | /api/auth/login        | Authenticate, returns JWT              |
| GET    | /api/tasks             | List tasks (filters + pagination)      |
| GET    | /api/tasks/{id}        | Get single task                        |
| POST   | /api/tasks             | Create task                            |
| PATCH  | /api/tasks/{id}        | Update task (partial)                  |
| DELETE | /api/tasks/{id}        | Soft delete task                       |
| GET    | /api/users             | List active users (assignee dropdown)  |

**Task filters (query params):**
- `status`      – `TODO` | `IN_PROGRESS` | `DONE`
- `assignedTo`  – user ID
- `search`      – title/description substring
- `page`, `size`, `sortBy`, `sortDir`

---

## Features

### Frontend
- JWT login with token persisted in localStorage
- Protected routes (redirect to /login if unauthenticated)
- Paginated task list with status/assignee/search filters
- Create & edit task modal (React Hook Form + validation)
- Soft delete with confirmation dialog
- Status and priority badges
- Loading indicators (spinner, fetch overlay)
- Responsive layout (mobile-friendly)
- Auto sign-out on 401

### Backend
- Stateless JWT authentication (Spring Security)
- Controller → Service → Repository layering
- Soft delete (deleted_at timestamp)
- Paginated filtered queries with JPQL
- Bean validation on all request bodies
- Global exception handler with structured error responses
- CORS configured for frontend origin
- Flyway database migrations
- Swagger/OpenAPI documentation

### Database
- Normalized schema: `users` ↔ `tasks` with FK relationships
- Indexes on `status`, `assigned_to`, `created_by`, `deleted_at`, `due_date`
- Soft delete on both tables
- Enum-backed status (`TODO`, `IN_PROGRESS`, `DONE`) and priority (`LOW`, `MEDIUM`, `HIGH`)
- Seed script with realistic sample data

---

## Security Notes

- Passwords hashed with BCrypt
- JWT secret configured via `application.properties` (use env var in production)
- SQL injection prevented via parameterized JPQL queries
- CORS restricted to frontend origin
- Input validation on all endpoints
