# BuildFlow AI — Information Architecture

## Global Application Structure

```text
Workspace
├── Overview
├── Projects
│   ├── All Projects
│   └── Project Workspace
│       ├── Overview
│       ├── Tasks
│       ├── Timeline
│       ├── BOQ
│       ├── Costs
│       ├── Procurement
│       ├── Documents
│       ├── Site Diary
│       ├── Issues
│       ├── Reports
│       └── AI Assistant
├── Team
├── Documents
├── Vendors
├── Notifications
└── Settings
    ├── Organization
    ├── Members & Roles
    ├── Billing
    ├── Notifications
    └── Security
```

## Primary Navigation

The sidebar should prioritize daily workflows:

1. Overview
2. Projects
3. Documents
4. Team
5. Vendors

Project-specific navigation appears after entering a project.

## Project Navigation

```text
Project
├── Overview
├── Tasks
├── Timeline
├── BOQ
├── Costs
├── Procurement
├── Documents
├── Site Diary
├── Issues
├── Reports
└── AI Assistant
```

## Information Hierarchy

### Level 1 — Workspace
Organization-wide information.

### Level 2 — Project
Project-specific information.

### Level 3 — Module
A project workflow such as BOQ or procurement.

### Level 4 — Record
A task, BOQ item, purchase order, document, diary entry, etc.

### Level 5 — Activity
Comments, changes, approvals, notifications, and audit events.

## URL Convention

Use predictable resource-oriented routes:

```text
/dashboard
/projects
/projects/[projectId]
/projects/[projectId]/tasks
/projects/[projectId]/boq
/projects/[projectId]/costs
/projects/[projectId]/procurement
/projects/[projectId]/documents
/projects/[projectId]/site-diary
/projects/[projectId]/reports
/projects/[projectId]/ai
/settings
/settings/members
```

Avoid URLs that encode UI implementation details.

## Responsive Strategy

Desktop:
- Persistent sidebar
- Dense tables
- Multi-column dashboards

Tablet:
- Collapsible sidebar
- Reduced table columns
- Adaptive cards

Mobile:
- Bottom/compact navigation where appropriate
- Stacked dashboards
- Mobile-friendly forms
- Field workflows optimized for Site Diary and quick updates
