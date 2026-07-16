# 🚀 BizFlow

### Manage your entire business from one intelligent dashboard.

BizFlow is a production-grade, full-stack **Business Management System** built for modern enterprises. Track revenue, manage employees, handle invoices, monitor expenses, and generate reports — all from a single, beautifully designed platform.

![License](https://img.shields.io/badge/license-MIT-blue)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![React](https://img.shields.io/badge/react-19-61DAFB)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [Authentication](#-authentication)
- [Seed Data](#-seed-data)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### Core Modules

| Module | Description |
|--------|-------------|
| **Dashboard** | Real-time revenue, profit, expenses, and KPI widgets with interactive charts |
| **Employees** | Full CRUD, photo upload, attendance tracking, performance ratings, CSV export |
| **Customers** | Customer profiles, GST numbers, purchase history, invoice tracking |
| **Products** | SKU/barcode management, stock alerts, category assignment, image upload |
| **Categories** | Organize products with slugified categories |
| **Suppliers** | Supplier directory with product associations and purchase history |
| **Invoices** | Professional invoice builder with auto-numbering, tax, discounts, PDF export |
| **Expenses** | Track and categorize business expenses with monthly breakdowns |
| **Reports** | Revenue, profit, expense, and product analytics with CSV/PDF export |
| **Notifications** | Low stock alerts, new invoices, payment received, and more |
| **Activity Logs** | Track every login, create, update, and delete action |
| **Settings** | Dark/light mode, security settings, notification preferences |
| **Profile** | Company logo, business info, GST, currency, timezone |

### Platform Features

- 🔐 **JWT Authentication** — Access + refresh token rotation
- 👥 **Role-Based Access** — Admin, Manager, Employee roles
- 🌗 **Dark / Light Mode** — System preference detection + manual toggle
- 📱 **Fully Responsive** — Mobile-first with collapsible sidebar
- ⚡ **Code Splitting** — Lazy-loaded routes with vendor/chart/animation chunks
- 🔍 **Search, Sort, Filter, Paginate** — On every data table
- 🎨 **Premium UI** — Subtle shadows, smooth animations, Framer Motion transitions
- 🔔 **Toast Notifications** — 4 types with auto-dismiss and animated entry/exit
- 📤 **Drag & Drop Upload** — Image upload with preview via Cloudinary
- 📊 **Interactive Charts** — Revenue, expense, and sales charts with Recharts
- 🛡️ **Enterprise Security** — Helmet, CORS, rate limiting, input validation, bcrypt

---

## 🛠 Tech Stack

### Frontend

| Technology | Purpose |
|-----------|---------|
| [React 19](https://react.dev) | UI framework |
| [Vite](https://vite.dev) | Build tool & dev server |
| [Tailwind CSS 3](https://tailwindcss.com) | Utility-first CSS |
| [React Router](https://reactrouter.com) | Client-side routing |
| [TanStack Query](https://tanstack.com/query) | Server state management |
| [React Hook Form](https://react-hook-form.com) | Form handling |
| [Zod](https://zod.dev) | Schema validation |
| [Axios](https://axios-http.com) | HTTP client |
| [Recharts](https://recharts.org) | Charts & data visualization |
| [Framer Motion](https://www.framer.com/motion) | Animations |
| [Lucide React](https://lucide.dev) | Icon library |

### Backend

| Technology | Purpose |
|-----------|---------|
| [Node.js](https://nodejs.org) | Runtime |
| [Express.js](https://expressjs.com) | Web framework |
| [Prisma ORM](https://www.prisma.io) | Database ORM |
| [PostgreSQL](https://www.postgresql.org) | Database |
| [JWT](https://jwt.io) | Authentication tokens |
| [bcrypt](https://github.com/dcodeIO/bcrypt.js) | Password hashing |
| [Cloudinary](https://cloudinary.com) | Image storage |
| [Zod](https://zod.dev) | Server-side validation |
| [Helmet](https://helmetjs.github.io) | HTTP security headers |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (React)                       │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐  ┌───────────┐ │
│  │  Pages   │  │Components│  │ Providers  │  │  Hooks    │ │
│  │(Features)│  │  (UI +   │  │(Auth,Theme │  │(Custom    │ │
│  │          │  │  Layout) │  │  Toast)    │  │ React)    │ │
│  └────┬─────┘  └──────────┘  └───────────┘  └───────────┘ │
│       │                                                     │
│  ┌────▼─────────────────────────────────────────────────┐  │
│  │           Axios Instance (JWT Interceptor)            │  │
│  └────┬──────────────────────────────────────────────────┘  │
└───────┼─────────────────────────────────────────────────────┘
        │ HTTP (REST API)
┌───────▼─────────────────────────────────────────────────────┐
│                       SERVER (Express)                       │
│                                                              │
│  ┌──────────┐  ┌────────────┐  ┌───────────┐  ┌──────────┐ │
│  │  Routes  │──│ Controllers│──│  Services  │──│  Prisma  │ │
│  └──────────┘  └────────────┘  └───────────┘  └────┬─────┘ │
│                                                     │       │
│  ┌──────────────────────────────────────────────────┤       │
│  │           Middleware Stack                       │       │
│  │  (Auth, Validation, Rate Limit, Error Handler)   │       │
│  └──────────────────────────────────────────────────┘       │
└─────────────────────────────────────┬───────────────────────┘
                                      │
                              ┌───────▼───────┐
                              │  PostgreSQL   │
                              │  (Supabase)   │
                              └───────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.0.0
- **npm** ≥ 9.0.0
- **PostgreSQL** database (or a [Supabase](https://supabase.com) project)
- **Cloudinary** account (for image uploads)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/bizflow.git
cd bizflow

# 2. Install server dependencies
cd server
npm install

# 3. Install client dependencies
cd ../client
npm install
```

### Running Locally

```bash
# Terminal 1 — Start the backend
cd server
npm run dev
# Server runs at http://localhost:5000

# Terminal 2 — Start the frontend
cd client
npm run dev
# Client runs at http://localhost:5173
```

---

## 🔐 Environment Variables

### Server (`server/.env`)

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/bizflow

# JWT
JWT_SECRET=your-jwt-secret-min-32-characters
JWT_REFRESH_SECRET=your-refresh-secret-min-32-characters
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# App
CLIENT_URL=http://localhost:5173
PORT=5000
NODE_ENV=development
```

### Client (`client/.env`)

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=BizFlow
```

> **Note:** Copy `.env.example` to `.env` in both directories and fill in your values.

---

## 🗄 Database Setup

### Using Supabase (Recommended)

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **Settings → Database → Connection string**
3. Copy the URI and paste into `DATABASE_URL` in `server/.env`

### Run Migrations & Seed

```bash
cd server

# Push schema to database
npx prisma db push

# Generate Prisma client
npx prisma generate

# Seed with demo data
npm run db:seed

# (Optional) Open Prisma Studio to browse data
npm run db:studio
```

### Database Schema

12 tables: `users`, `employees`, `customers`, `suppliers`, `categories`, `products`, `invoices`, `invoice_items`, `expenses`, `activity_logs`, `notifications`, `company_settings`

---

## 📁 Project Structure

```
bizflow/
├── client/                          # React 19 + Vite
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                  # Button, Input, Modal, Card, Badge, etc.
│   │   │   └── layout/             # Sidebar, Navbar, Breadcrumbs, Layouts
│   │   ├── features/               # Feature modules (auth, dashboard, etc.)
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── lib/                     # Axios, utils, constants
│   │   ├── providers/               # Auth, Theme, Toast contexts
│   │   ├── routes/                  # Router config + guards
│   │   ├── App.jsx                  # Root component
│   │   └── main.jsx                 # Entry point
│   ├── tailwind.config.js           # Design system tokens
│   └── vite.config.js               # Build config + API proxy
│
├── server/                          # Node.js + Express
│   ├── prisma/
│   │   ├── schema.prisma            # Database schema (12 models)
│   │   └── seed.js                  # Demo data seeder
│   ├── src/
│   │   ├── config/                  # DB, Cloudinary, JWT config
│   │   ├── controllers/             # Route handlers
│   │   ├── middleware/              # Auth, validation, error handler
│   │   ├── routes/                  # Express routes
│   │   ├── services/               # Business logic
│   │   ├── utils/                  # Response helpers, errors, pagination
│   │   ├── validators/             # Zod schemas
│   │   └── app.js                  # Express app setup
│   └── server.js                   # Entry point
│
├── .gitignore
└── README.md
```

---

## 📡 API Reference

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Create a new account |
| `POST` | `/api/auth/login` | Sign in with email/password |
| `POST` | `/api/auth/logout` | Sign out (invalidate refresh token) |
| `POST` | `/api/auth/forgot-password` | Send password reset email |
| `POST` | `/api/auth/reset-password` | Reset password with token |
| `POST` | `/api/auth/refresh-token` | Get new access token |
| `GET`  | `/api/auth/me` | Get current user profile |

### Resources (CRUD)

All resource endpoints follow REST conventions:

| Method | Pattern | Description |
|--------|---------|-------------|
| `GET` | `/api/{resource}` | List all (paginated, searchable, sortable) |
| `GET` | `/api/{resource}/:id` | Get single by ID |
| `POST` | `/api/{resource}` | Create new |
| `PUT` | `/api/{resource}/:id` | Update by ID |
| `DELETE` | `/api/{resource}/:id` | Delete by ID |

**Resources:** `employees`, `customers`, `suppliers`, `categories`, `products`, `invoices`, `expenses`

### Special Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/dashboard/stats` | Dashboard aggregations |
| `GET` | `/api/products/low-stock` | Products below minimum stock |
| `GET` | `/api/expenses/monthly` | Monthly expense breakdown |
| `GET` | `/api/reports/revenue` | Revenue analytics |
| `GET` | `/api/reports/export/csv` | Export report as CSV |
| `GET` | `/api/notifications` | User notifications |
| `GET` | `/api/activity-logs` | Activity log history |

---

## 🔑 Authentication

BizFlow uses a **JWT access + refresh token** strategy:

- **Access Token** — Short-lived (15 min), sent in `Authorization: Bearer <token>` header
- **Refresh Token** — Long-lived (7 days), used to obtain new access tokens
- **Auto-refresh** — Axios interceptor automatically refreshes expired tokens

### Roles

| Role | Permissions |
|------|-------------|
| **Admin** | Full access to all modules and settings |
| **Manager** | CRUD on all resources, view reports |
| **Employee** | View-only access, limited CRUD |

---

## 🌱 Seed Data

Run `npm run db:seed` to populate the database with demo data:

| Entity | Count | Details |
|--------|-------|---------|
| Users | 3 | Admin, Manager, Employee |
| Categories | 5 | Electronics, Office Supplies, Furniture, Software, Networking |
| Suppliers | 3 | TechWorld, Office Mart, FurniCraft |
| Employees | 5 | Various departments and positions |
| Customers | 4 | Acme Corp, Global Tech, Star Enterprises, Pinnacle |
| Products | 7 | Laptops, peripherals, office supplies, software |
| Expenses | 6 | Rent, internet, electricity, marketing, etc. |

### Demo Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@bizflow.com` | `admin123` |
| Manager | `manager@bizflow.com` | `admin123` |
| Employee | `employee@bizflow.com` | `admin123` |

---

## 🚢 Deployment

### Frontend → Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from client directory
cd client
vercel

# Set environment variables in Vercel dashboard:
# VITE_API_URL = https://your-api.onrender.com/api
# VITE_APP_NAME = BizFlow
```

### Backend → Render

1. Create a **Web Service** on [render.com](https://render.com)
2. Connect your GitHub repo
3. Set:
   - **Build Command:** `cd server && npm install && npx prisma generate`
   - **Start Command:** `cd server && node server.js`
4. Add all environment variables from `server/.env`

### Database → Supabase

Your Supabase database is already hosted. Just ensure the `DATABASE_URL` in Render points to your Supabase connection string.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- [React](https://react.dev) — UI library
- [Vite](https://vite.dev) — Build tooling
- [Tailwind CSS](https://tailwindcss.com) — Styling
- [Prisma](https://prisma.io) — Database ORM
- [Supabase](https://supabase.com) — PostgreSQL hosting
- [Lucide](https://lucide.dev) — Icons
- [Framer Motion](https://framer.com/motion) — Animations

---

<p align="center">
  Built with ❤️ by the BizFlow team
</p>
