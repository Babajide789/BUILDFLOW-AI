# BUILDFLOW AI — Master Project Roadmap & Handoff Plan

> **Document purpose:** This is the single source of truth for the BuildFlow AI implementation roadmap. It maps the project from the completed application shell through the production-ready construction-management SaaS, including sprint order, task IDs, milestones, acceptance criteria, handoff points, validation gates, and the definition of done for the overall product.
>
> **Last updated:** September 1, 2026
>
> **Current project state:** BF-101 complete, BF-102 complete, ready to begin BF-103.

---

# 1. Project North Star

## Product

**BuildFlow AI** is a production-oriented, AI-powered construction management SaaS designed to bring construction project administration, commercial management, procurement, collaboration, reporting, and intelligence into one system.

The long-term product vision is to reduce dependence on fragmented workflows involving:

- Excel spreadsheets
- WhatsApp
- Email
- Trello
- Google Drive
- Separate accounting tools
- Manually maintained BOQs
- Scattered project documents
- Manual progress reporting
- Disconnected cost/procurement records

The product should become a structured system where project data is captured once and reused throughout the construction lifecycle.

## Core domain

BuildFlow must eventually support workflows around:

- Organizations and teams
- Projects
- Users and memberships
- Roles and permissions
- BOQs
- Cost planning
- Budget control
- Variations
- Interim valuations
- Procurement
- Suppliers
- Materials
- Progress tracking
- Project reporting
- Cash-flow forecasting
- Documents
- Communication/collaboration
- AI-assisted construction intelligence
- Auditability
- Notifications
- Dashboards
- Analytics
- Integrations

---

# 2. Product & Engineering Principles

These principles apply to every sprint.

## 2.1 Production-first

BuildFlow is not a demo application. Every feature should be designed as if another team will maintain and extend it.

## 2.2 Domain-first architecture

Construction-management concepts must have clear domain boundaries.

Do not allow UI components to become the place where business logic lives.

## 2.3 Multi-tenant by design

The **Organization** is the primary tenant boundary.

Users belong to organizations through **Memberships**.

Every organization-scoped query and mutation must enforce the tenant boundary server-side.

## 2.4 Server-side authorization

Never rely only on hidden UI elements for security.

The backend must verify:

1. authenticated user
2. organization membership
3. role/permission
4. resource ownership/access
5. requested operation

## 2.5 Reusable UI system

Use:

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Radix primitives
- Lucide icons

Avoid introducing a second competing UI framework.

## 2.6 Explicit state handling

Every important asynchronous interface should consider:

- loading
- success
- error
- empty
- disabled
- permission-denied
- not-found
- optimistic/pending states where appropriate

## 2.7 Accessible by default

Interactive components must support:

- keyboard navigation
- focus states
- semantic HTML
- accessible labels
- appropriate ARIA only when necessary
- sufficient contrast
- screen-reader usability

## 2.8 Validate continuously

Our working loop remains:

**Understand → Implement → Test → Validate → Commit → Move on**

A task is not complete simply because the UI looks correct.

---

# 3. Technology Direction

## Frontend

- Next.js 16+
- App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Radix
- Lucide icons

## Backend / data direction

- Next.js server capabilities / route handlers as appropriate
- Prisma
- PostgreSQL
- Organization-based multi-tenancy
- Server-side authorization

## Repository direction

The project architecture should maintain a clear separation between:

- route/page concerns
- reusable UI
- domain/business logic
- data access
- validation
- authentication/authorization
- configuration
- utilities

---

# 4. Current Project Status

| ID | Task | Status | Handoff |
|---|---|---|---|
| BF-101 | Application Shell | ✅ COMPLETE | BF-102 |
| BF-102 | Sidebar Navigation | ✅ COMPLETE | BF-103 |
| BF-103 | Topbar | 🔵 NEXT | BF-104 |
| BF-104 | Theme System | ⏳ | BF-105 |
| BF-105 | Shared UI Foundation | ⏳ | BF-106 |
| BF-106 | Loading/Error/Empty States | ⏳ | BF-107 |
| BF-107 | Authentication | ⏳ | BF-108 |
| BF-108 | Organization Onboarding | ⏳ | BF-109 |
| BF-109 | Authorization | ⏳ | BF-110 |
| BF-110 | CI / Engineering Quality | ⏳ | Phase 2 |

### Current handoff

**BF-102 is considered green and complete.**

The next implementation task is:

> **BF-103 — Topbar**

We do not restart BF-101 or BF-102.

---

# 5. Overall Delivery Architecture

The project is intentionally divided into phases.

```text
PHASE 0
Product Definition & Architecture
        ↓
PHASE 1
Application Foundation
        ↓
PHASE 2
Identity, Organizations & Access
        ↓
PHASE 3
Project Management Core
        ↓
PHASE 4
Construction Commercial Core
        ↓
PHASE 5
Procurement & Materials
        ↓
PHASE 6
Progress, Reporting & Documents
        ↓
PHASE 7
Collaboration & Notifications
        ↓
PHASE 8
AI Construction Intelligence
        ↓
PHASE 9
Analytics, Integrations & Automation
        ↓
PHASE 10
Security, QA, Performance & Production
        ↓
PHASE 11
Launch, Monitoring & Continuous Improvement
```

---

# 6. PHASE 0 — Product Definition & Architecture

## Status

**Previously completed / baseline established.**

This phase should not be restarted unless a major architectural decision changes.

## Objectives

Establish:

- product vision
- product scope
- construction domain
- information architecture
- design direction
- database direction
- tenant model
- backlog
- development conventions

## Existing decisions to preserve

- BuildFlow AI is a construction-management SaaS.
- Organization is the tenant boundary.
- Users connect to organizations through Memberships.
- Server-side authorization is required.
- Next.js App Router is the application foundation.
- TypeScript is mandatory.
- Tailwind + shadcn/ui is the UI direction.
- Prisma/PostgreSQL is the data direction.

## Exit criteria

- Product vision documented
- Architecture established
- Repository established
- Sprint structure established
- Initial design system direction established
- Database direction established

---

# 7. PHASE 1 — APPLICATION FOUNDATION

This is the phase currently being completed.

---

## BF-101 — Application Shell

### Status

**✅ COMPLETE**

### Objective

Create the global application structure on which all authenticated BuildFlow pages will eventually live.

### Scope

- application layout
- dashboard shell
- sidebar region
- topbar region
- main content region
- responsive foundation
- reusable layout components
- route structure

### Completion state

BF-101 has already been completed and validated.

---

# 8. BF-102 — Sidebar Navigation

## Status

**✅ COMPLETE**

### Objective

Create a production-quality responsive navigation system.

### Work completed

The BF-102 work established the sidebar navigation foundation, including:

- navigation configuration
- reusable sidebar structure
- responsive behavior
- active route handling
- expanded/collapsed behavior
- mobile navigation behavior
- hamburger/mobile drawer behavior
- icon handling
- styling refinement

### Important final validation

The implementation was brought to a green state.

Validation included:

- lint
- build
- UI behavior
- route behavior
- responsive behavior

### Handoff

**BF-102 → BF-103**

Do not revisit BF-102 unless BF-103 exposes a genuine dependency or regression.

---

# 9. BF-103 — Topbar

## Status

**🔵 NEXT**

### Objective

Build the global application topbar.

The topbar should become the persistent command/navigation surface above the application content.

### Scope

1. Topbar layout
2. Responsive behavior
3. Page/context title
4. Mobile menu trigger integration
5. Search affordance
6. Notifications entry
7. User/account menu entry
8. Organization/context area where appropriate
9. Consistent spacing and visual hierarchy
10. Keyboard/accessibility behavior

### Implementation sequence

#### Step 1 — Inspect current shell

Confirm BF-101 and BF-102 interfaces.

#### Step 2 — Define topbar responsibilities

Avoid turning the topbar into a dumping ground for unrelated controls.

#### Step 3 — Build static structure

Create the component and establish layout.

#### Step 4 — Connect mobile navigation

The hamburger trigger should control the existing mobile drawer rather than duplicating navigation logic.

#### Step 5 — Add contextual controls

Introduce placeholders/initial UI for:

- search
- notifications
- profile/account

Do not implement full backend behavior yet unless required by the current sprint.

#### Step 6 — Accessibility

Validate:

- buttons
- labels
- focus
- keyboard navigation
- mobile interaction

#### Step 7 — Responsive QA

Check:

- desktop
- tablet
- mobile
- narrow mobile

#### Step 8 — Validation

Run:

```bash
npm run lint
npm run build
```

Then manually inspect the UI.

### Definition of Done

- Topbar is visually consistent with shell
- Responsive
- Accessible
- No duplicated navigation logic
- No lint errors
- No build errors
- Existing sidebar behavior remains intact
- Changes committed

### Handoff

**BF-103 → BF-104**

---

# 10. BF-104 — Theme System

## Objective

Establish BuildFlow's visual theme infrastructure before the shared UI grows.

### Scope

- light theme
- dark theme
- design tokens
- background tokens
- foreground tokens
- border tokens
- muted tokens
- primary/accent tokens
- destructive/error tokens
- component state tokens
- theme persistence
- system preference where appropriate

### Steps

1. Audit current colors.
2. Replace hard-coded values with semantic tokens.
3. Define light theme.
4. Define dark theme.
5. Add theme switching.
6. Persist user preference.
7. Validate all shell components.
8. Check contrast.
9. Check icons and interactive states.
10. Validate build/lint.

### Definition of Done

- Theme system is centralized.
- Components consume semantic tokens.
- Light/dark modes are coherent.
- No widespread hard-coded theme colors remain.
- Existing shell remains visually stable.

### Handoff

**BF-104 → BF-105**

---

# 11. BF-105 — Shared UI Foundation

## Objective

Build reusable UI primitives before feature development accelerates.

### Initial component inventory

- Button
- Input
- Textarea
- Label
- Select
- Checkbox
- Radio
- Switch
- Badge
- Avatar
- Card
- Separator
- Tooltip
- Dropdown menu
- Dialog
- Sheet
- Popover
- Tabs
- Breadcrumb
- Command/search
- Table
- Pagination
- Skeleton
- Alert
- Toast
- Form primitives

### Important rule

Do not build every possible component upfront.

Build components when there is a real product requirement, while maintaining consistent primitives.

### Definition of Done

- Shared components have consistent API conventions.
- Variants are documented.
- Accessibility works.
- Components are reusable.
- Feature code does not duplicate common UI.

### Handoff

**BF-105 → BF-106**

---

# 12. BF-106 — Loading / Error / Empty States

## Objective

Make application state handling consistent before feature complexity increases.

### Scope

Define reusable patterns for:

- page loading
- section loading
- table loading
- skeletons
- empty state
- API failure
- unauthorized state
- forbidden state
- not-found state
- retry
- destructive operation feedback

### Definition of Done

A developer should be able to implement a new data-driven screen without inventing its loading/error/empty behavior from scratch.

### Handoff

**BF-106 → BF-107**

---

# 13. BF-107 — Authentication

## Objective

Establish secure user identity.

### Scope

- sign up
- sign in
- sign out
- password handling
- session handling
- protected routes
- authentication middleware/guards
- authentication errors
- account verification strategy
- password reset strategy

### Security principles

- Never trust client identity.
- Never expose secrets.
- Validate all inputs server-side.
- Use secure session handling.
- Protect private routes.
- Do not place authorization logic only in React components.

### Definition of Done

A user can securely authenticate and access protected application surfaces.

### Handoff

**BF-107 → BF-108**

---

# 14. BF-108 — Organization Onboarding

## Objective

Turn an authenticated user into a meaningful BuildFlow tenant member.

### Organization model

The system should support:

```text
User
  ↓
Membership
  ↓
Organization
  ↓
Projects
```

### Onboarding flow

1. User signs up/logs in.
2. User creates an organization or accepts an invitation.
3. Organization profile is created.
4. User receives initial membership/role.
5. User reaches the organization dashboard.
6. Organization context becomes available throughout the application.

### Scope

- organization creation
- organization details
- initial owner/admin membership
- organization context
- onboarding completion
- onboarding persistence

### Definition of Done

A new user can create or join an organization and enter a valid tenant context.

### Handoff

**BF-108 → BF-109**

---

# 15. BF-109 — Authorization

## Objective

Implement server-side access control.

### Core concepts

- Organization
- Membership
- Role
- Permission
- Resource ownership/access
- Organization boundary

### Initial permission model

Example conceptual roles:

- Organization Owner
- Organization Admin
- Project Manager
- Quantity Surveyor
- Commercial/Cost Manager
- Procurement
- Site/Project Staff
- Viewer

The exact final role matrix should be established against actual product requirements before implementation.

### Authorization layers

```text
Authentication
      ↓
Organization Membership
      ↓
Role
      ↓
Permission
      ↓
Resource Scope
      ↓
Action
```

### Definition of Done

Unauthorized users cannot access protected resources even if they manually call an endpoint.

### Handoff

**BF-109 → BF-110**

---

# 16. BF-110 — CI & Engineering Quality

## Objective

Automate quality gates so regressions do not enter the main branch.

### CI checks

At minimum:

- install
- type checking
- lint
- build
- tests when available

### Branch strategy

Use feature branches for work such as:

```text
feat/sidebarNav
feat/topbar
feat/theme
feat/auth
feat/organization
...
```

### Pull request expectations

Every feature should provide:

- clear scope
- implementation
- validation
- screenshots when UI changes
- no unrelated changes
- passing checks

### Definition of Done

A pull request cannot be considered green if the required automated checks fail.

### Handoff

**PHASE 1 → PHASE 2**

---

# 17. PHASE 2 — IDENTITY, ORGANIZATION & ACCESS

The BF-107–BF-110 work technically begins this phase, but the outcome is a complete tenant-aware application foundation.

## Milestone M2 — Secure Multi-Tenant Foundation

### Success criteria

A real user can:

1. create an account
2. authenticate
3. create/join an organization
4. receive membership
5. operate inside an organization
6. be assigned permissions
7. access only permitted resources
8. sign out securely

### Additional hardening tasks

- session expiration
- account lifecycle
- invitation system
- membership management
- role assignment
- audit events
- organization switching if multiple organizations are supported

---

# 18. PHASE 3 — PROJECT MANAGEMENT CORE

After identity and tenancy are stable, BuildFlow can begin managing actual construction projects.

## Proposed task sequence

| ID | Task | Purpose |
|---|---|---|
| BF-201 | Project Data Model | Project entity and organization relationship |
| BF-202 | Project Creation | Create projects |
| BF-203 | Project List | Organization project overview |
| BF-204 | Project Overview | Project dashboard |
| BF-205 | Project Settings | Project configuration |
| BF-206 | Project Team | Assign organization members |
| BF-207 | Project Roles | Project-level responsibilities |
| BF-208 | Project Status | Planned/active/on-hold/completed |
| BF-209 | Project Metadata | Client, contractor, dates, location, value |
| BF-210 | Project Audit Trail | Track critical project changes |

## Project object

Conceptually:

```text
Organization
   └── Project
       ├── Team
       ├── BOQ
       ├── Budget
       ├── Variations
       ├── Procurement
       ├── Progress
       ├── Documents
       ├── Reports
       └── AI Context
```

## Milestone M3

A user can create and operate a complete construction project workspace.

---

# 19. PHASE 4 — CONSTRUCTION COMMERCIAL CORE

This is one of the most important product phases because commercial/project-cost workflows are central to BuildFlow's construction domain.

## BF-301 — BOQ Foundation

### Scope

- BOQ creation
- sections
- items
- descriptions
- units
- quantities
- rates
- amounts
- notes

## BF-302 — BOQ Calculation Engine

### Scope

- quantity × rate
- section totals
- project totals
- rounding rules
- calculation consistency
- recalculation

## BF-303 — BOQ Import

Potential sources:

- spreadsheet import
- structured CSV
- template-based import

## BF-304 — BOQ Editing

- add item
- edit item
- duplicate item
- delete item
- reorder
- bulk operations

## BF-305 — Cost Plan

- budget
- committed cost
- actual cost
- forecast cost
- variance

## BF-306 — Variations

- variation creation
- reason
- instruction/reference
- valuation
- approval
- status
- impact on contract value

## BF-307 — Interim Valuations

- valuation period
- work completed
- valuation amount
- deductions
- certification workflow
- status

## BF-308 — Cash Flow

- planned cash flow
- forecast
- actuals
- variance
- period-based analysis

## BF-309 — Commercial Dashboard

Display:

- contract value
- original budget
- approved variations
- current contract value
- committed cost
- actual cost
- forecast
- variance
- cash-flow position

## Milestone M4

A construction project can be commercially managed from BOQ through cost planning, variations, valuations, and cash-flow forecasting.

---

# 20. PHASE 5 — PROCUREMENT & MATERIALS

## BF-401 — Supplier Management

- supplier records
- contacts
- categories
- status
- organization relationship

## BF-402 — Material Catalog

- material
- unit
- category
- supplier
- historical cost
- current cost

## BF-403 — Procurement Requests

- request
- requester
- project
- required date
- items
- status

## BF-404 — Purchase Orders

- supplier
- items
- quantities
- rates
- totals
- delivery information
- status

## BF-405 — Goods/Delivery Tracking

- delivery
- received quantity
- outstanding quantity
- delivery status

## BF-406 — Procurement Dashboard

Track:

- open requests
- pending approvals
- purchase orders
- delivery status
- cost exposure

## Milestone M5

BuildFlow can track the procurement lifecycle from request through supplier/order/delivery.

---

# 21. PHASE 6 — PROJECT PROGRESS, REPORTING & DOCUMENTS

## BF-501 — Progress Tracking

- activities
- progress percentage
- planned progress
- actual progress
- dates
- status

## BF-502 — Site Updates

- daily/periodic updates
- notes
- progress evidence
- issues
- actions

## BF-503 — Progress Dashboard

Compare:

- planned vs actual
- schedule progress
- commercial progress
- project health

## BF-504 — Documents

- upload
- folders/categories
- project association
- metadata
- access control
- version strategy

## BF-505 — Document Search

- filename
- metadata
- project
- category
- uploader
- date

## BF-506 — Project Reports

Generate structured reports for:

- project progress
- commercial position
- procurement
- variations
- cash flow
- management summaries

## BF-507 — Report Export

Potential outputs:

- PDF
- spreadsheet
- CSV where appropriate

## Milestone M6

Project teams can track progress and generate useful project documentation and management reports.

---

# 22. PHASE 7 — COLLABORATION & NOTIFICATIONS

## BF-601 — Activity Feed

Track meaningful project activity.

Examples:

- BOQ updated
- variation submitted
- purchase order created
- document uploaded
- progress updated

## BF-602 — Comments

Allow contextual comments on relevant records.

## BF-603 — Mentions

Allow users to mention project members where appropriate.

## BF-604 — Notifications

Notification categories:

- approvals
- assignments
- mentions
- deadlines
- system events

## BF-605 — Notification Preferences

Users control non-critical notification preferences.

## BF-606 — Approval Workflows

Introduce structured approval processes for:

- variations
- procurement
- valuations
- selected project changes

## Milestone M7

Teams can collaborate inside BuildFlow without relying on external chat/email for every workflow.

---

# 23. PHASE 8 — AI CONSTRUCTION INTELLIGENCE

AI should be introduced after the underlying structured data foundation is reliable.

**Important principle:**

> Do not build an AI layer on top of unreliable or poorly structured project data.

## BF-701 — AI Foundation

Establish:

- AI service boundary
- prompt/version management
- context retrieval strategy
- usage tracking
- error handling
- safety controls
- cost controls

## BF-702 — Project AI Context

Provide AI with controlled access to relevant:

- project data
- BOQ data
- variations
- procurement records
- reports
- documents
- progress data

## BF-703 — AI Project Assistant

Initial capabilities:

- explain project status
- summarize project information
- answer questions about project records
- surface relevant information

## BF-704 — BOQ Intelligence

Potential capabilities:

- identify unusual rates
- detect inconsistencies
- summarize quantities
- explain cost changes
- assist with BOQ review

## BF-705 — Cost Intelligence

Potential capabilities:

- explain cost variance
- identify cost drivers
- summarize budget exposure
- flag unusual movements

## BF-706 — Procurement Intelligence

Potential capabilities:

- summarize outstanding procurement
- identify delayed items
- highlight cost changes
- summarize supplier activity

## BF-707 — Report Intelligence

- automated management summaries
- project health summaries
- period summaries
- action-item extraction

## BF-708 — AI Recommendations

Potential capabilities:

- risk signals
- cost warnings
- schedule warnings
- procurement warnings

Recommendations must be presented as assistance, not unquestionable truth.

## Milestone M8

BuildFlow's AI becomes a useful layer over trusted construction data rather than a standalone chatbot.

---

# 24. PHASE 9 — ANALYTICS, INTEGRATIONS & AUTOMATION

## BF-801 — Executive Dashboard

Organization-level view of:

- projects
- project health
- financial exposure
- procurement
- risks
- activity

## BF-802 — Advanced Analytics

- project trends
- cost trends
- procurement trends
- variation trends
- cash-flow trends

## BF-803 — Spreadsheet Integration

Improve structured spreadsheet import/export.

## BF-804 — Accounting Integration Strategy

Connect BuildFlow with appropriate accounting systems where product requirements justify it.

## BF-805 — Communication Integrations

Potential integrations should be evaluated carefully rather than added merely because they are popular.

## BF-806 — Calendar / Deadline Automation

- project milestones
- due dates
- reminders
- approval deadlines

## BF-807 — Automated Workflows

Examples:

```text
Event
  ↓
Condition
  ↓
Action
  ↓
Notification / Record Update
```

## Milestone M9

BuildFlow becomes an operational platform that can connect project information with external business workflows.

---

# 25. PHASE 10 — SECURITY, QUALITY, PERFORMANCE & PRODUCTION

This phase is not optional.

## BF-901 — Security Audit

Review:

- authentication
- authorization
- tenant isolation
- API security
- input validation
- file access
- secrets
- session management
- sensitive data exposure

## BF-902 — Database Review

Review:

- indexes
- relations
- constraints
- query efficiency
- migration safety
- data integrity

## BF-903 — Frontend Performance

Review:

- bundle size
- unnecessary renders
- image loading
- route performance
- caching
- server/client boundaries

## BF-904 — Accessibility Audit

Review major flows against accessibility expectations.

## BF-905 — Automated Testing

Testing layers:

```text
Unit
  ↓
Integration
  ↓
Component
  ↓
End-to-End
  ↓
Production Smoke Tests
```

## BF-906 — Error Monitoring

Establish production visibility for:

- runtime errors
- failed requests
- important workflow failures

## BF-907 — Logging & Auditability

Critical business actions should be traceable.

## BF-908 — Backup & Recovery

Establish:

- database backup strategy
- recovery process
- disaster recovery expectations

## BF-909 — Production Environment

Separate:

- development
- staging
- production

## BF-910 — Release Process

Define:

- versioning
- migrations
- deployment
- rollback
- smoke testing

## Milestone M10

BuildFlow is technically ready for real production usage.

---

# 26. PHASE 11 — LAUNCH & CONTINUOUS IMPROVEMENT

## BF-1001 — Production Launch

- production deployment
- domain
- environment variables
- database
- monitoring
- analytics
- onboarding

## BF-1002 — Launch Checklist

Verify:

- authentication
- organization creation
- project creation
- permissions
- BOQ
- commercial workflows
- procurement
- documents
- reports
- AI
- notifications
- mobile/responsive behavior

## BF-1003 — User Feedback Loop

Create a structured process for:

- feedback
- bugs
- feature requests
- workflow friction
- AI quality issues

## BF-1004 — Product Analytics

Track meaningful product usage without collecting unnecessary data.

## BF-1005 — Iteration Roadmap

Use actual user behavior to prioritize:

- improvements
- missing workflows
- performance
- usability
- automation
- AI capabilities

---

# 27. Master Milestone Map

| Milestone | Phase | Outcome | Status |
|---|---|---|---|
| M0 | Product Foundation | Product architecture & scope | ✅ |
| M1 | Application Foundation | Shell + navigation + UI foundation | 🟡 Current |
| M2 | Identity & Access | Auth + organization + permissions | ⏳ |
| M3 | Project Core | Construction project workspace | ⏳ |
| M4 | Commercial Core | BOQ + cost + variations + valuations + cash flow | ⏳ |
| M5 | Procurement | Suppliers + materials + procurement | ⏳ |
| M6 | Progress & Reporting | Progress + documents + reports | ⏳ |
| M7 | Collaboration | Activity + comments + notifications + approvals | ⏳ |
| M8 | AI | Construction intelligence | ⏳ |
| M9 | Integrations | Analytics + integrations + automation | ⏳ |
| M10 | Production Readiness | Security + QA + performance + reliability | ⏳ |
| M11 | Launch | Production release + feedback loop | ⏳ |

---

# 28. Master Task Sequence

## Foundation

```text
BF-101 → BF-102 → BF-103 → BF-104 → BF-105 → BF-106
```

## Identity

```text
BF-107 → BF-108 → BF-109 → BF-110
```

## Projects

```text
BF-201 → BF-202 → BF-203 → BF-204 → BF-205
→ BF-206 → BF-207 → BF-208 → BF-209 → BF-210
```

## Commercial

```text
BF-301 → BF-302 → BF-303 → BF-304 → BF-305
→ BF-306 → BF-307 → BF-308 → BF-309
```

## Procurement

```text
BF-401 → BF-402 → BF-403 → BF-404 → BF-405 → BF-406
```

## Progress / Reporting

```text
BF-501 → BF-502 → BF-503 → BF-504 → BF-505 → BF-506 → BF-507
```

## Collaboration

```text
BF-601 → BF-602 → BF-603 → BF-604 → BF-605 → BF-606
```

## AI

```text
BF-701 → BF-702 → BF-703 → BF-704
→ BF-705 → BF-706 → BF-707 → BF-708
```

## Analytics / Integrations

```text
BF-801 → BF-802 → BF-803 → BF-804
→ BF-805 → BF-806 → BF-807
```

## Production

```text
BF-901 → BF-902 → BF-903 → BF-904 → BF-905
→ BF-906 → BF-907 → BF-908 → BF-909 → BF-910
```

## Launch

```text
BF-1001 → BF-1002 → BF-1003 → BF-1004 → BF-1005
```

---

# 29. The Standard Sprint Execution Protocol

Every BF task should follow the same workflow.

## Step 1 — Understand

Before writing code:

- identify the purpose
- inspect existing implementation
- identify dependencies
- identify affected routes/components
- identify data requirements
- identify acceptance criteria

## Step 2 — Plan

Break the task into small implementation steps.

Do not jump directly into a large code change.

## Step 3 — Implement

Make the smallest clean change that satisfies the requirement.

Avoid unrelated refactoring.

## Step 4 — Test

Run the relevant tests.

For frontend foundation work:

```bash
npm run lint
npm run build
```

For data/business features, add appropriate automated tests.

## Step 5 — Validate visually

For UI tasks check:

- desktop
- tablet
- mobile
- keyboard
- interaction states
- empty/loading/error states

## Step 6 — Review

Ask:

- Is the architecture clean?
- Is logic in the correct layer?
- Is the component reusable?
- Is tenant isolation preserved?
- Is authorization enforced server-side?
- Did this introduce duplication?
- Did this break an earlier feature?

## Step 7 — Commit

Use a focused commit.

Example:

```text
feat(topbar): build responsive application topbar
```

## Step 8 — Handoff

Record:

- completed work
- files/components affected
- validation performed
- known issues
- next task
- dependencies for next task

---

# 30. Definition of Done — Universal Standard

A BuildFlow task is only **DONE** when all applicable requirements below are satisfied.

### Functional

- [ ] Requirement implemented
- [ ] Happy path works
- [ ] Failure paths considered
- [ ] Edge cases considered

### UI

- [ ] Desktop validated
- [ ] Mobile validated
- [ ] Responsive behavior correct
- [ ] Loading state considered
- [ ] Empty state considered
- [ ] Error state considered
- [ ] Disabled state considered

### Accessibility

- [ ] Keyboard usable
- [ ] Focus visible
- [ ] Labels present
- [ ] Semantic structure correct

### Architecture

- [ ] Reusable logic extracted where appropriate
- [ ] No unnecessary duplication
- [ ] Business logic not trapped in presentation
- [ ] Existing architecture respected

### Security

For data/auth features:

- [ ] Server-side validation
- [ ] Server-side authorization
- [ ] Tenant boundary enforced
- [ ] Sensitive information protected

### Quality

- [ ] TypeScript passes
- [ ] ESLint passes
- [ ] Build passes
- [ ] Relevant tests pass

### Git

- [ ] Focused changes
- [ ] Clean commit
- [ ] No accidental files
- [ ] Handoff documented

---

# 31. Sprint Handoff Template

Use this exact structure at the end of every BF task.

```md
# BF-XXX Handoff

## Status
✅ COMPLETE

## Objective
[What this task was supposed to accomplish.]

## Completed
- [item]
- [item]
- [item]

## Files / Areas Changed
- [file]
- [component]
- [route]

## Validation
- npm run lint: ✅
- npm run build: ✅
- Manual UI validation: ✅
- Responsive validation: ✅
- Tests: ✅ / N/A

## Known Issues
- None / [issue]

## Architectural Notes
[Anything the next task needs to know.]

## Next Task
BF-XXX — [name]

## Next Objective
[What the next task will accomplish.]
```

---

# 32. Current Handoff — BF-102 → BF-103

## Completed

### BF-101

Application shell is complete.

### BF-102

Sidebar navigation is complete.

The navigation system has been validated and the project is green.

## Current next task

**BF-103 — Topbar**

## Immediate objective

Build the global topbar without destabilizing the shell/sidebar.

## First action in the next working session

Inspect the current:

- application shell
- sidebar
- topbar placeholder/current implementation
- layout composition
- navigation configuration
- responsive state handling

Then implement BF-103 step-by-step.

## First validation gate

Before declaring BF-103 complete:

```bash
npm run lint
npm run build
```

Then manually verify:

- sidebar still works
- mobile drawer still works
- topbar aligns correctly
- no overlay/transparency regression
- responsive behavior is correct
- keyboard interaction works

---

# 33. What We Should NOT Do

To keep BuildFlow healthy, avoid these patterns.

## Do not restart completed work

If BF-101/BF-102 is green, move forward.

## Do not build features before their foundation

For example:

Do not build complex commercial dashboards before:

- organization context
- project model
- authorization
- core data models

are stable.

## Do not make UI the database layer

React components should not become the source of truth for business rules.

## Do not trust client-side permissions

Hidden buttons are not authorization.

## Do not introduce random libraries

Every dependency should solve a real problem and fit the architecture.

## Do not over-engineer prematurely

Build the smallest architecture capable of supporting the next meaningful requirement.

## Do not build AI before data quality

AI depends on reliable structured project data.

## Do not declare a task complete from visual appearance alone

BuildFlow uses automated validation and manual QA.

---

# 34. Critical Dependencies

The following dependency chain is important.

```text
Authentication
      ↓
Organization
      ↓
Membership
      ↓
Authorization
      ↓
Project
      ↓
Project Team
      ↓
BOQ / Commercial Data
      ↓
Procurement / Progress / Documents
      ↓
Reporting
      ↓
AI
      ↓
Analytics / Automation
```

Breaking this dependency order unnecessarily will create technical debt.

---

# 35. Data Ownership Model

The conceptual ownership hierarchy should remain clear.

```text
User
 │
 └── Membership
      │
      └── Organization
           │
           ├── Projects
           │    ├── BOQ
           │    ├── Cost Plan
           │    ├── Variations
           │    ├── Valuations
           │    ├── Procurement
           │    ├── Progress
           │    ├── Documents
           │    └── Reports
           │
           ├── Suppliers
           ├── Materials
           └── Organization Settings
```

This hierarchy should inform both Prisma schema design and server-side authorization.

---

# 36. Product Success Criteria

BuildFlow is successful when it can reliably support a real construction organization through a meaningful portion of its operational lifecycle.

## Minimum platform success

A user can:

- create an account
- create an organization
- invite team members
- assign permissions
- create a project
- manage project information
- work with BOQs
- track project costs
- manage variations
- manage valuations
- track procurement
- track progress
- store project documents
- generate reports
- receive notifications
- understand project health

## AI success

AI should:

- use BuildFlow project context
- answer useful project questions
- summarize information accurately
- surface relevant risks/signals
- assist rather than replace professional judgment
- expose uncertainty when information is incomplete

## Technical success

The application should be:

- secure
- maintainable
- accessible
- responsive
- observable
- testable
- performant
- deployable
- recoverable

---

# 37. Release Strategy

Do not wait until every imaginable feature is finished before releasing.

Use staged releases.

## Release 0 — Internal Foundation

Includes:

- shell
- navigation
- theme
- UI foundation
- auth
- organizations
- authorization
- CI

## Release 1 — Project MVP

Includes:

- projects
- teams
- project overview
- basic BOQ
- basic cost management
- basic documents
- basic reporting

## Release 2 — Commercial MVP

Includes:

- advanced BOQ
- cost planning
- variations
- valuations
- cash flow

## Release 3 — Operations MVP

Includes:

- procurement
- materials
- progress
- reporting
- collaboration
- notifications

## Release 4 — AI

Includes:

- project assistant
- project summaries
- commercial intelligence
- procurement intelligence
- reporting assistance

## Release 5 — Production Scale

Includes:

- integrations
- advanced analytics
- automation
- performance hardening
- security hardening
- production observability

---

# 38. The Golden Rule for Future Chats

Whenever we open a new BuildFlow conversation, use this roadmap as the baseline.

The conversation should begin from:

1. current completed BF task
2. current branch/worktree state
3. next BF task
4. task objective
5. implementation steps
6. validation criteria
7. handoff to the following BF task

We should never need to reconstruct the entire roadmap from memory again.

---

# 39. Current Project Position

```text
SPRINT / PHASE 0
Product Definition
        ✅

SPRINT / PHASE 1
Application Foundation
        │
        ├── BF-101 Application Shell
        │       ✅
        │
        ├── BF-102 Sidebar Navigation
        │       ✅
        │
        ├── BF-103 Topbar
        │       🔵 NEXT
        │
        ├── BF-104 Theme System
        │       ⏳
        │
        ├── BF-105 Shared UI
        │       ⏳
        │
        ├── BF-106 State System
        │       ⏳
        │
        ├── BF-107 Authentication
        │       ⏳
        │
        ├── BF-108 Organization
        │       ⏳
        │
        ├── BF-109 Authorization
        │       ⏳
        │
        └── BF-110 CI
                ⏳
                    ↓
            PHASE 2
        Identity & Access
                    ↓
            PHASE 3
        Project Management
                    ↓
            PHASE 4
        Commercial Management
                    ↓
            PHASE 5
        Procurement
                    ↓
            PHASE 6
        Progress & Reporting
                    ↓
            PHASE 7
        Collaboration
                    ↓
            PHASE 8
        AI Intelligence
                    ↓
            PHASE 9
        Analytics & Integrations
                    ↓
            PHASE 10
        Production Hardening
                    ↓
            PHASE 11
        Launch & Iteration
```

---

# 40. Final Working Agreement

BuildFlow AI should be developed as a serious product, not as a sequence of disconnected screens.

For every milestone:

**We understand the domain → define the architecture → implement the smallest correct slice → validate it → secure it → test it → document it → commit it → hand it off.**

The roadmap gives us the **what**.

Each individual BF task will define the **how**.

The handoff document for each completed task will define the **where we are**.

The validation gate defines **whether we are actually done**.

That means when BF-103 is complete, we do not ask:

> "What should we build next?"

We look here:

> **BF-103 → BF-104 Theme System**

And continue.

When BF-104 is complete:

> **BF-104 → BF-105 Shared UI**

When BF-110 is complete:

> **Phase 1 → Phase 2**

And the same pattern continues until BuildFlow reaches production.

---

# 41. Immediate Next Step

## 🚀 BF-103 — Topbar

**Current status:** NEXT

**Previous:** BF-102 Sidebar Navigation ✅

**Next after BF-103:** BF-104 Theme System

**Working protocol:**

```text
Inspect current implementation
        ↓
Understand BF-103 requirements
        ↓
Plan implementation
        ↓
Implement
        ↓
Lint
        ↓
Build
        ↓
Manual UI/Responsive QA
        ↓
Fix issues
        ↓
Final green validation
        ↓
Commit
        ↓
Handoff
        ↓
BF-104
```

This is the official continuation point for the next BuildFlow AI development session.
