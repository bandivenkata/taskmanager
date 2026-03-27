-- V2__seed_data.sql
-- Passwords are BCrypt hashes of "password123"
INSERT INTO users (username, email, password, full_name, role) VALUES
  ('admin',   'admin@example.com',   '$2a$10$oC5Y.CWl2sz/vV2t0qGw5enZ3O54XyHAXaigyzDbhlOQ2L1.9cfB.', 'Admin User',    'ADMIN'),
  ('satya',   'satya@example.com',   '$2a$10$oC5Y.CWl2sz/vV2t0qGw5enZ3O54XyHAXaigyzDbhlOQ2L1.9cfB.', 'Satya Bandi',  'USER'),
  ('varun',     'varun@example.com',     '$2a$10$oC5Y.CWl2sz/vV2t0qGw5enZ3O54XyHAXaigyzDbhlOQ2L1.9cfB.', 'Varun Bandi',      'USER'),
  ('bandi', 'bandi@example.com', '$2a$10$oC5Y.CWl2sz/vV2t0qGw5enZ3O54XyHAXaigyzDbhlOQ2L1.9cfB.', 'Bandi Varun',  'USER');

INSERT INTO tasks (title, description, status, priority, due_date, created_by, assigned_to) VALUES
  ('Set up CI/CD pipeline',      'Configure GitHub Actions for automated builds and deployments.',   'TODO',        'HIGH',   '2026-04-15', 1, 2),
  ('Design database schema',     'Finalize ERD and create Flyway migration scripts.',                'DONE',        'HIGH',   '2026-03-30', 1, 1),
  ('Implement JWT auth',         'Add login endpoint and secure all protected routes.',              'IN_PROGRESS', 'HIGH',   '2026-03-28', 1, 3),
  ('Build task list UI',         'Paginated task list with filters for status and assignee.',        'IN_PROGRESS', 'MEDIUM', '2026-04-01', 2, 2),
  ('Write API documentation',    'Document all REST endpoints using Swagger annotations.',           'TODO',        'MEDIUM', '2026-04-10', 1, 4),
  ('Add unit tests',             'Cover service layer with JUnit 5 and Mockito tests.',              'TODO',        'MEDIUM', '2026-04-20', 3, 3),
  ('Fix pagination bug',         'Page size is not respected when filtering by assignee.',           'TODO',        'LOW',    '2026-03-30', 2, 4),
  ('Responsive mobile layout',   'Ensure the dashboard works well on screens < 768px.',             'IN_PROGRESS', 'MEDIUM', '2026-04-05', 2, 2),
  ('Soft delete implementation', 'Replace hard deletes with deleted_at timestamps across all APIs.', 'DONE',        'LOW',    '2026-04-15', 1, 1),
  ('Performance review',         'Profile slow endpoints and add missing DB indexes.',               'TODO',        'LOW',    '2026-04-25', 1, 3);
