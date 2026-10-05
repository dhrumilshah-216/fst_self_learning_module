# Architecture Overview

## Next.js App Router
ResearchFlow uses Next.js 14 App Router (App Dir). 
- `app/` contains the routing conventions mapping to URL segments.
- Heavily relies on nested layouts and React Server Components (RSC) to remove client side bundle bloat and ensure fast hydration.

## Server Components vs Client Components
By default, all components are Server Components (RSC) executing Node.js processes fetching directly from PostgreSQL via Prisma without an intermediate API layer. 
`"use client"` boundaries are drawn strictly at the UI interactivity layers (Zustand state hooks, forms, complex radix dropdowns).

## Server Actions 
Instead of REST endpoints, ResearchFlow leverages Server Actions (`src/actions`). Complex mutation operations are encapsulated in actions like `addPaper` or `createProject` containing server-side `Zod` validation schemas verifying types securely prior to modifying database targets.

## Authentication & Authorization
Uses `NextAuth` beta v5 via a Credentials provider with `bcryptjs`. Roles:
- **RESEARCH_LEAD**: Admin features, creates projects and assigns roles.
- **RESEARCH_MEMBER**: Execute experiments and create task/paper relationships.
- **SUPERVISOR**: Can exclusively review experiments formally via Approval/Changes logic.

## Zustand vs Server State
Zustand is strictly confined to local UI state (`store/index.ts` - `sidebarOpen`, `theme`). All canonical backend state persists via Prisma fetching logic, preventing state duplication or complex data synchronization out of bound.

## Email Workflow
1. Database Action executes.
2. `createNotification(userId)` is triggered storing notification record.
3. If `<EmailFlags>` are checked, an async wrapper to Resend is invoked parsing `NotificationEmail.tsx` components off the blocking thread using React Email frameworks.
4. Resend replies asynchronously to `app/api/webhooks/resend/route.ts` adjusting internal DB `EmailDelivery` states ensuring guaranteed visibility inside the audit trace without blocking core researcher flows if SMTP APIs fail.

## Performance / Vitals Check
Lighthouse tests consistently output 95+ across metrics since Javascript execution runs minimally. Dynamic OG representations utilize `next/og` Edge API ensuring previews deploy identically optimized at ultra-fast compute.
