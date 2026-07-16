# Graph Report - .  (2026-07-17)

## Corpus Check
- Corpus is ~15,521 words - fits in a single context window. You may not need a graph.

## Summary
- 300 nodes · 461 edges · 18 communities (16 shown, 2 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_UI Components & Utils|UI Components & Utils]]
- [[_COMMUNITY_Client Package Config|Client Package Config]]
- [[_COMMUNITY_Server Package Config|Server Package Config]]
- [[_COMMUNITY_Auth Pages & Providers|Auth Pages & Providers]]
- [[_COMMUNITY_Feature Pages|Feature Pages]]
- [[_COMMUNITY_Core Layout & Providers|Core Layout & Providers]]
- [[_COMMUNITY_Routes & Public Layout|Routes & Public Layout]]
- [[_COMMUNITY_Server Core & Errors|Server Core & Errors]]
- [[_COMMUNITY_Server App & Responses|Server App & Responses]]
- [[_COMMUNITY_Constants|Constants]]
- [[_COMMUNITY_Oxlint Config|Oxlint Config]]
- [[_COMMUNITY_Auth Validators|Auth Validators]]
- [[_COMMUNITY_Prisma Seed|Prisma Seed]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 35 edges
2. `PageWrapper()` - 14 edges
3. `useAuth()` - 12 edges
4. `Button` - 9 edges
5. `useToast()` - 9 edges
6. `scripts` - 8 edges
7. `ErrorBoundary` - 7 edges
8. `Avatar()` - 6 edges
9. `config` - 6 edges
10. `scripts` - 5 edges

## Surprising Connections (you probably didn't know these)
- `Toast()` --calls--> `cn()`  [EXTRACTED]
  client/src/providers/ToastProvider.jsx → client/src/lib/utils.js
- `Sidebar()` --calls--> `cn()`  [EXTRACTED]
  client/src/components/layout/Sidebar.jsx → client/src/lib/utils.js
- `Avatar()` --calls--> `cn()`  [EXTRACTED]
  client/src/components/ui/Avatar.jsx → client/src/lib/utils.js
- `Badge()` --calls--> `cn()`  [EXTRACTED]
  client/src/components/ui/Badge.jsx → client/src/lib/utils.js
- `Card()` --calls--> `cn()`  [EXTRACTED]
  client/src/components/ui/Card.jsx → client/src/lib/utils.js

## Import Cycles
- None detected.

## Communities (18 total, 2 thin omitted)

### Community 0 - "UI Components & Utils"
Cohesion: 0.08
Nodes (26): Breadcrumbs(), routeLabels, cn(), Badge(), badgeSizes, badgeVariants, Card(), CardContent() (+18 more)

### Community 1 - "Client Package Config"
Cohesion: 0.06
Nodes (32): dependencies, axios, clsx, date-fns, framer-motion, @hookform/resolvers, lucide-react, react (+24 more)

### Community 2 - "Server Package Config"
Cohesion: 0.06
Nodes (31): dependencies, bcryptjs, cloudinary, cookie-parser, cors, dotenv, express, express-rate-limit (+23 more)

### Community 3 - "Auth Pages & Providers"
Cohesion: 0.13
Nodes (20): ForgotPasswordPage(), forgotSchema, LoginPage(), loginSchema, RegisterPage(), registerSchema, ResetPasswordPage(), resetSchema (+12 more)

### Community 5 - "Core Layout & Providers"
Cohesion: 0.12
Nodes (19): Navbar(), ProtectedLayout(), navItems, Sidebar(), getAvatarColor(), getInitials(), AuthContext, AuthProvider() (+11 more)

### Community 6 - "Routes & Public Layout"
Cohesion: 0.08
Nodes (19): ErrorBoundary, NotFound(), PublicLayout(), ActivityLogs, Categories, Customers, Dashboard, Employees (+11 more)

### Community 7 - "Server Core & Errors"
Cohesion: 0.11
Nodes (7): prisma, AppError, ConflictError, ForbiddenError, NotFoundError, UnauthorizedError, ValidationError

### Community 8 - "Server App & Responses"
Cohesion: 0.15
Nodes (7): config, errorHandler(), validate(), app, apiLimiter, authLimiter, sendError()

### Community 9 - "Constants"
Cohesion: 0.25
Nodes (7): CURRENCY, DEPARTMENTS, EMPLOYEE_STATUS, EXPENSE_CATEGORIES, INVOICE_STATUS, PAGINATION, ROLES

### Community 10 - "Oxlint Config"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 11 - "Auth Validators"
Cohesion: 0.33
Nodes (5): forgotPasswordSchema, loginSchema, refreshTokenSchema, registerSchema, resetPasswordSchema

## Knowledge Gaps
- **114 isolated node(s):** `$schema`, `plugins`, `react/rules-of-hooks`, `react/only-export-components`, `name` (+109 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `UI Components & Utils` to `Auth Pages & Providers`, `Core Layout & Providers`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Why does `ErrorBoundary` connect `Routes & Public Layout` to `Auth Pages & Providers`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Why does `useAuth()` connect `Core Layout & Providers` to `Auth Pages & Providers`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **What connects `$schema`, `plugins`, `react/rules-of-hooks` to the rest of the system?**
  _114 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `UI Components & Utils` be split into smaller, more focused modules?**
  _Cohesion score 0.08067375886524823 - nodes in this community are weakly interconnected._
- **Should `Client Package Config` be split into smaller, more focused modules?**
  _Cohesion score 0.06060606060606061 - nodes in this community are weakly interconnected._
- **Should `Server Package Config` be split into smaller, more focused modules?**
  _Cohesion score 0.0625 - nodes in this community are weakly interconnected._