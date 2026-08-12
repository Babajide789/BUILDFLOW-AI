# BuildFlow AI — Database Design

## Database Principles

- PostgreSQL is the source of truth for transactional data.
- Every organization-owned record must be scoped to an organization.
- Project-owned records must reference a project where appropriate.
- Use UUID primary keys.
- Store timestamps in UTC.
- Use enums for stable finite states.
- Use decimal/numeric values for money; never floating-point.
- Financial calculations are deterministic on the server.
- Soft deletion is preferred for important business records.
- Add indexes based on actual query patterns.

## Core Entity Model

```text
User
  └── Membership
        └── Organization
              ├── Projects
              │     ├── Tasks
              │     ├── Milestones
              │     ├── BOQ
              │     │    └── BOQ Items
              │     ├── Costs
              │     ├── Procurement
              │     ├── Documents
              │     ├── Site Diary
              │     └── Issues
              ├── Vendors
              └── Audit Logs
```

## Initial Entities

### User
Identity and account information.

### Organization
Company/workspace boundary.

### Membership
Maps users to organizations and roles.

### Project
Construction project metadata and commercial baseline.

### ProjectMember
Project-specific access and role override.

### Task
Work item assigned to a project member.

### Milestone
Project schedule checkpoint.

### BOQ
Versioned commercial document for a project.

### BOQItem
Quantity, unit, rate, amount and cost-code information.

### CostEntry
Actual project expenditure.

### Vendor
Supplier/subcontractor record.

### PurchaseOrder
Procurement transaction.

### PurchaseOrderItem
Line items on a purchase order.

### Document
Metadata for private files stored outside PostgreSQL.

### SiteDiaryEntry
Daily project record.

### Issue
Project problem/risk/blocker.

### Notification
User notification.

### AuditLog
Security and business audit trail.

## Authorization Model

Organization role controls baseline permissions.

Suggested roles:

- OWNER
- PROJECT_DIRECTOR
- PROJECT_MANAGER
- QUANTITY_SURVEYOR
- SITE_ENGINEER
- ARCHITECT
- PROCUREMENT_OFFICER
- FINANCE_OFFICER
- SAFETY_OFFICER
- CLIENT
- VENDOR
- FOREMAN

Project-level membership can narrow access further.

Never rely on frontend route protection alone. Authorization must execute server-side.

## Financial Rules

BOQ line amount:

`quantity × unitRate`

Project budget:

`sum of approved budget components`

Budget variance:

`budget - actual`

All money values use `Decimal`/PostgreSQL numeric semantics.

## AI Data Boundary

AI services must only retrieve records the current user is authorized to access.

AI-generated recommendations must not directly mutate financial records without an explicit user action and server-side validation.
