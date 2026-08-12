# BuildFlow AI — Product Requirements Document

**Status:** Draft v1.0  
**Phase:** Sprint 0 — Product & Business  
**Owner:** Product / Engineering  
**Last Updated:** 2026-08-10

## 1. Purpose

BuildFlow AI is an AI-powered construction management SaaS that centralizes project delivery, cost management, quantity surveying, procurement, documents, collaboration, and project intelligence.

This PRD defines the first production-oriented scope and prevents uncontrolled feature growth.

## 2. MVP Objective

A construction company must be able to:

1. Create a company workspace.
2. Invite team members and assign roles.
3. Create and manage construction projects.
4. Track project tasks, milestones, progress, costs, and documents.
5. Build and manage a Bill of Quantities (BOQ).
6. Track procurement and suppliers.
7. Generate useful project reports.
8. Ask an AI assistant questions about project information.
9. View project and portfolio analytics.
10. Receive notifications for important events.

## 3. Functional Requirements

### Authentication & Identity
- Sign up, sign in, sign out.
- Email verification and password reset.
- Session management.
- Optional OAuth/MFA architecture.
- User profile management.

### Organizations
- Users belong to one or more organizations.
- Organization owners can invite members.
- Members have organization roles.
- Organization data is isolated from other organizations.

### Projects
- Create, edit, archive, and view projects.
- Project metadata: name, client, location, contract value, start date, target completion date, status.
- Project-level permissions.
- Project activity history.

### Tasks & Milestones
- Create tasks.
- Assign tasks to members.
- Priority and status.
- Due dates.
- Milestones.
- Comments and activity.
- Kanban and list views in MVP; timeline/Gantt is an incremental enhancement.

### Documents
- Upload and categorize documents.
- Project-level access control.
- Metadata and versioning foundation.
- Document activity.
- Search/filter.

### BOQ & Cost Management
- BOQ sections and line items.
- Item description, unit, quantity, rate, amount.
- Cost codes/categories.
- Budget versus actual tracking.
- Variation order foundation.
- Import/export architecture for spreadsheet workflows.

### Procurement
- Suppliers.
- Purchase requests.
- Purchase orders.
- Procurement status.
- Delivery tracking foundation.
- Link procurement costs to projects/BOQ items.

### AI Assistant
- Project-scoped AI assistant.
- Explain project metrics.
- Summarize selected project information.
- Generate draft site/project reports.
- Assist with BOQ review.
- Clearly label AI-generated output.
- Never silently modify financial/project records.

### Notifications
- In-app notifications.
- Read/unread state.
- Notification preferences.
- Architecture prepared for email notifications.

### Analytics
- Project budget versus actual.
- Progress indicators.
- Task completion.
- Procurement metrics.
- Portfolio overview.
- AI insight cards where data quality permits.

## 4. Non-Functional Requirements

### Performance
- Fast initial navigation.
- Server-first rendering where appropriate.
- Paginate large datasets.
- Avoid unnecessary client-side JavaScript.
- Use caching and query invalidation intentionally.

### Accessibility
- Target WCAG 2.2 AA.
- Keyboard navigation.
- Visible focus states.
- Semantic HTML.
- Accessible names and descriptions.
- Reduced-motion support.

### Security
- Server-side authorization for every protected mutation/query.
- Organization/project data isolation.
- Secure file access.
- Secrets only in environment variables.
- Audit important financial and permission changes.
- Validate all external input.

### Reliability
- Consistent error handling.
- Loading, empty, and failure states.
- Transactional writes for critical operations.
- Auditability of important changes.

### Maintainability
- TypeScript strictness.
- Feature-oriented architecture.
- Reusable UI primitives.
- Automated linting and testing.
- ADRs for major architectural decisions.

## 5. Out of Scope for MVP

Native mobile apps, BIM integrations, IoT, drone mapping, AR inspection, payroll, full accounting, public API, and marketplace capabilities are deferred.

## 6. MVP Acceptance Criteria

The MVP is considered functionally complete when a seeded demo company can:

- onboard a user;
- create a project;
- invite team members;
- create tasks and milestones;
- upload project documents;
- create a BOQ with calculated line-item amounts;
- record project costs;
- create procurement records;
- view project health metrics;
- receive notifications;
- ask the AI assistant questions using project context;
- pass critical automated tests;
- demonstrate organization-level data isolation.

## 7. Product Risks

| Risk | Mitigation |
| --- | --- |
| Scope creep | Maintain MVP boundary and backlog priorities |
| AI hallucination | Ground AI on retrieved project data and label generated content |
| Financial calculation errors | Deterministic server-side calculations and tests |
| Authorization bugs | Central authorization layer + integration tests |
| Large BOQs become slow | Pagination, virtualization, indexed queries |
| File security | Private storage and signed access |
| Over-engineering | Add infrastructure only when justified by a product requirement |
