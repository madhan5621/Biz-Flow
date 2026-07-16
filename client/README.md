# BizFlow — Client

React 19 + Vite frontend for the BizFlow Business Management System.

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Design System

The UI is built on a custom design token system defined in `tailwind.config.js`:

- **Primary:** `#2563EB` (blue-600)
- **Success:** `#22C55E` (green-500)
- **Warning:** `#F59E0B` (amber-500)
- **Danger:** `#EF4444` (red-500)
- **Surface:** Slate scale (50–950)
- **Font:** Inter

## Reusable Components

All UI primitives live in `src/components/ui/` and are exported via a barrel file:

```jsx
import { Button, Input, Modal, Card, Badge, DataTable } from './components/ui';
```

| Component | Variants |
|-----------|----------|
| `Button` | primary, secondary, danger, success, warning, ghost, outline |
| `Input` | Label, error, helper text, left/right icons |
| `Select` | Custom chevron, `{value, label}` options |
| `Badge` | default, primary, success, warning, danger |
| `Card` | Compound: Header, Title, Description, Content, Footer |
| `Modal` | sm, md, lg, xl, full — animated with Framer Motion |
| `DataTable` | Sorting, pagination, loading skeleton, empty state |
| `FileUpload` | Drag & drop, image preview, size validation |
| `Avatar` | Image with initials fallback |
| `Toast` | success, error, warning, info — via `useToast()` hook |

## Folder Structure

```
src/
├── components/
│   ├── ui/          # Reusable primitives
│   └── layout/      # Sidebar, Navbar, Layouts
├── features/        # Feature modules (one per page)
├── hooks/           # Custom React hooks
├── lib/             # Axios, utils, constants
├── providers/       # Auth, Theme, Toast contexts
├── routes/          # Router config + guards
├── App.jsx
└── main.jsx
```

## Environment Variables

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=BizFlow
```

See the root [README.md](../README.md) for full documentation.
