# BuildFlow AI — Design System

## Design Direction

BuildFlow AI should feel like premium enterprise software: calm, trustworthy, dense enough for professional workflows, but never visually overwhelming.

Reference qualities: Linear-like clarity, Stripe-like polish, modern construction software practicality.

## Design Tokens

### Typography
- Primary font: project-approved sans-serif.
- Use a consistent type scale.
- Body text should prioritize readability.
- Numeric data should use tabular numerals where appropriate.

### Spacing
Use a 4px base with an 8px rhythm for major layout spacing.

Common values:
`4, 8, 12, 16, 24, 32, 40, 48, 64`

### Radius
- Small controls: 6–8px
- Cards: 10–12px
- Large surfaces/dialogs: 12–16px
- Avoid excessive pill-shaped UI except statuses/tags.

### Color Roles
Use semantic tokens rather than hardcoded colors:
- background
- foreground
- muted
- border
- primary
- secondary
- success
- warning
- destructive
- info

Construction-specific status semantics should remain consistent:
- On track
- At risk
- Delayed
- Completed
- Pending
- Blocked

## Component Inventory

### Foundation
- Button
- IconButton
- Input
- Textarea
- Select
- Combobox
- Checkbox
- Radio
- Switch
- Label
- Tooltip
- Badge

### Navigation
- Sidebar
- Topbar
- Breadcrumbs
- Tabs
- Command palette
- Pagination

### Data
- Table
- Data grid
- KPI card
- Stat
- Chart container
- Filter bar
- Sort controls

### Feedback
- Alert
- Toast
- Dialog
- Drawer
- Confirmation dialog
- Skeleton
- Empty state
- Error state

### Construction-specific
- ProjectStatusBadge
- BudgetVariance
- ProgressIndicator
- BOQTable
- CostSummary
- ProcurementStatus
- ActivityTimeline
- ProjectHealthCard

## UX Rules

1. Destructive actions require confirmation.
2. Financial values must clearly display currency and precision.
3. Tables must support responsive strategies rather than simply overflowing.
4. Long operations need progress/loading feedback.
5. Empty states explain what the user can do next.
6. Errors explain recovery actions.
7. AI output is visually distinguishable and never presented as verified fact by default.
8. Never hide important project status behind hover-only interactions.
9. Use confirmation for irreversible actions.
10. Preserve user-entered form data when recoverable errors occur.

## Accessibility

- WCAG 2.2 AA target.
- Full keyboard support.
- Focus-visible states.
- Semantic landmarks.
- Dialog focus management.
- Form errors connected to inputs.
- Color is never the sole status indicator.
- Respect reduced-motion preferences.
