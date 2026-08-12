# BuildFlow AI — Initial Architecture

## Architecture Goal

Build a modular SaaS that can begin as a single Next.js application but can evolve into multiple apps/services without forcing a rewrite.

## Repository Shape

```text
buildflow-ai/
├── apps/
│   └── web/
├── packages/
│   ├── ui/
│   ├── eslint-config/
│   └── typescript-config/
├── docs/
├── prisma/
├── .github/
└── package.json
```

## Web Application

Use Next.js App Router.

Recommended feature organization:

```text
apps/web/
└── src/
    ├── app/
    ├── components/
    ├── features/
    │   ├── auth/
    │   ├── organizations/
    │   ├── projects/
    │   ├── tasks/
    │   ├── boq/
    │   ├── costs/
    │   ├── procurement/
    │   ├── documents/
    │   ├── site-diary/
    │   ├── notifications/
    │   └── ai/
    ├── lib/
    ├── providers/
    ├── services/
    └── types/
```

## Layering

UI → feature hooks/actions → application services → database/external services.

Keep business rules out of presentational components.

## Data Fetching

Use server-side fetching for initial server-rendered data where practical.

Use TanStack Query for interactive client workflows, caching, mutations, and invalidation where it adds clear value.

Avoid introducing global client state for data that belongs in the server/cache layer.

## API Strategy

Use Next.js route handlers/server actions where appropriate.

Keep API contracts explicit and validated with Zod.

External integrations should live behind service modules.

## AI Architecture

```text
User Request
    ↓
Authorization
    ↓
Input Validation
    ↓
Project Context Retrieval
    ↓
Context Filtering
    ↓
AI Provider
    ↓
Structured Response
    ↓
Safety/Validation
    ↓
UI
```

The AI layer must never bypass authorization.

## Observability

Plan for:

- structured application errors
- request IDs/correlation IDs
- audit events
- error monitoring
- performance monitoring

## Architecture Principle

Do not prematurely split the system into microservices.

Start modular within the monorepo. Extract services only when scale, isolation, or operational requirements justify it.
