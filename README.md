# Homepage - Enterprise Platform

Full-stack enterprise platform built with React + Vite (frontend) and NestJS + TypeORM + PostgreSQL (backend). Includes JWT auth, AI integration (Google Gemini), user/contact CRUD, dashboards, notifications, dark/light theme, CSV export, password recovery, Nova agent and generator tools, and production-ready infrastructure.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite 8, React Router 7, react-helmet-async |
| **Backend** | NestJS 11, TypeORM, PostgreSQL |
| **Auth** | JWT (passport-jwt), bcrypt, role-based (user/admin) |
| **AI** | Google Generative AI (Gemini) with demo fallback |
| **Security** | Helmet, rate limiting (@nestjs/throttler), CORS, ValidationPipe |
| **Logging** | Winston (console + file rotation) |
| **Testing** | Vitest, Testing Library |
| **Infra** | Docker, docker-compose, CI/CD (GitHub Actions) |

---

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Docker (optional)

### Without Docker

```bash
# 1. Backend
cd backend
cp .env.example .env   # Configure DB credentials + JWT secret + Gemini key
npm install
npm run start:dev       # http://localhost:3000

# 2. Frontend (separate terminal)
npm install
npm run dev             # http://localhost:5173
```

### With Docker

```bash
docker compose up --build
# Frontend: http://localhost:80
# Backend:  http://localhost:3000
```

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_HOST` | PostgreSQL host | `localhost` |
| `DATABASE_PORT` | PostgreSQL port | `5432` |
| `DATABASE_USER` | PostgreSQL user | `postgres` |
| `DATABASE_PASSWORD` | PostgreSQL password | - |
| `DATABASE_NAME` | Database name | `homepage` |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRES_IN` | Token expiration | `7d` |
| `GEMINI_API_KEY` | Google Gemini API key | - |

---

## Features

### Landing Page
- **Hero carousel** — Auto-playing image carousel (6 Unsplash business/office photos) with fade transitions every 4s, floating badges ("99.9% uptime", "Secure cloud"), dot indicators, and high-resolution images
- **Gallery carousel** — "See Homepage in action" with 5 tech/software Unsplash photos, slide transitions, prev/next buttons, dot indicators, 520px height, object-fit cover
- **Hero stats** — 99.9% uptime, 10K+ clients, 150+ countries
- **Features grid** — Cloud Infrastructure, Data Analytics, Security, Collaboration
- **Solutions cards** — Fintech, Healthcare, E-commerce
- **Pricing tiers** — Starter $49, Professional $149, Enterprise custom
- **How It Works** — 3-step setup guide
- **Client logos** — 8 company names (trusted by section)
- **Animated stats bar** — 99.9% uptime, 150+ countries, 10K+ clients, <50ms latency
- **Testimonials** — 3 cards with star ratings and avatars
- **Security & Compliance** — 4 cards with icons (SOC 2, GDPR, Encryption, Uptime)
- **FAQ accordion** — 6 expandable questions
- **Newsletter signup** — Email input + subscribe button
- **Dark/light theme toggle** — In header (desktop + mobile menu), also in Profile settings
- **Smooth theme transitions** — All colors, backgrounds, and borders animate on toggle
- **Active nav tracking** — IntersectionObserver highlights current section in nav
- **Animated nav underlines** — Slide-in hover effect on desktop and mobile links
- **Responsive design** — Mobile/tablet/desktop optimized
- **Floating chatbot** — Nova, the AI-powered support widget (Gemini with demo fallback)
- **Book a demo modal** — Hero CTA opens a polished modal with icon, animated inputs, gradient submit button, and form submission to `/contact`

### Auth System
- Register with name, email, password
- Login with JWT token (7d expiry)
- Role-based access: `user` or `admin`
- Forgot / Reset password flow (dev mode: token shown on screen)
- Protected routes via JwtAuthGuard

### Dashboard (`/dashboard`)
- Real stats: total users, new users today, uptime, active projects, contacts
- AI-powered insights (Gemini or demo fallback)
- Activity table with recent contacts and notifications
- Sidebar navigation: Overview, Profile, Nova, Nova Generator, Users, Contact

### User Management (`/admin/users`)
- Table with inline edit (name, email, role, active status)
- Delete with confirmation
- CSV export
- Admin-only create via Nova

### Contact (`/contact`)
- Public form (name, email, message)
- Admin table with mark-as-read
- CSV export

### Profile (`/profile`)
- Edit name and email
- Change password with current password verification
- **Theme preference** — Toggle switch for dark/light mode
- Sidebar navigation to all tools
- Card hover effects with elevated shadow

### Nova (`/ai/agent`)
- Nova, the conversational agent that supports 8 actions:
  - Create user (admin only)
  - Send contact message
  - Get dashboard stats
  - Update profile
  - Change password
  - Send notification
  - Generate report
  - General Q&A
- Dynamic forms for each action type

### Nova Generator (`/ai/generate`)
- Generate reports, insights, and descriptions
- Type selector + prompt input

### Nova ChatBot (`ChatBot` component)
- Floating chat widget on landing page
- Powered by Gemini (falls back to demo responses on 429)

### Notifications
- Created on: register, password change
- Bell icon with unread count badge
- Dropdown panel with mark-read / dismiss
- Nova can create notifications

### Theme System
- **Dark/light mode** — Persisted in localStorage via `data-theme` attribute
- **ThemeToggle component** — Sun/moon SVG icon button in dashboard header, public header, and mobile menu
- **Profile setting** — Toggle switch in Profile → Preferences section
- **CSS variables** — `--header-bg`, `--card-bg`, `--primary-gradient` adapt to both themes
- **Smooth transitions** — 0.2s–0.3s transitions on all color, background, border, and shadow changes
- **Hero floating badges** — `var(--card-bg)` with backdrop-filter blur, adapt to theme
- **Active section tracking** — IntersectionObserver highlights current nav link

### Security & Production
- Helmet security headers
- Rate limiting — 60 req/min global, 10 req/min on auth (login/register), 5 req/min on forgot/reset password
- CORS with whitelist origins (function-based validator)
- ValidationPipe (whitelist + forbidNonWhitelisted)
- DTOs with class-validator for all endpoints (including auth, notifications)
- CSV export with formula injection protection (prefixes `= + - @` with `'`)
- Winston logging (console + error/combined log files)
- Code splitting (vendor, AI chunks)
- ErrorBoundary (global React error handler)
- 404 page
- Loading states (Suspense + spinner)
- SEO meta tags (react-helmet-async)
- TypeORM migrations support (synchronize disabled in production)
- Docker + docker-compose (PostgreSQL + backend + nginx frontend)
- CI/CD with GitHub Actions (lint + test + build)

---

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/register` | - | Register user |
| POST | `/auth/login` | - | Login |
| POST | `/auth/forgot-password` | - | Request password reset |
| POST | `/auth/reset-password` | - | Reset password |
| GET | `/auth/profile` | JWT | Get current user |
| PATCH | `/auth/profile` | JWT | Update profile / change password |
| POST | `/users` | JWT+Admin | Create user |
| GET | `/users` | JWT | List all users |
| GET | `/users/:id` | JWT | Get user by ID |
| PATCH | `/users/:id` | JWT | Update user |
| DELETE | `/users/:id` | JWT | Delete user |
| POST | `/contact` | - | Submit contact form |
| GET | `/contact` | JWT | List contacts |
| PATCH | `/contact/:id/read` | JWT | Mark contact as read |
| GET | `/dashboard/stats` | JWT | Dashboard statistics |
| GET | `/dashboard/insights` | JWT | AI-powered insights |
| POST | `/ai/chat` | JWT | AI chat |
| POST | `/ai/generate` | JWT | Generate content |
| POST | `/ai/agent` | JWT | AI agent actions |
| GET | `/export/users` | JWT | Export users as CSV |
| GET | `/export/contacts` | JWT | Export contacts as CSV |
| GET | `/notifications` | JWT | List notifications |
| POST | `/notifications` | JWT | Create notification |
| PATCH | `/notifications/:id/read` | JWT | Mark notification read |
| PATCH | `/notifications/read-all` | JWT | Mark all read |
| DELETE | `/notifications/:id` | JWT | Delete notification |

---

## Project Structure

```
homepage/
├── src/                    # Frontend (React)
│   ├── components/         # Reusable components
│   │   ├── BookDemo.jsx     # Book a demo modal component
│   │   ├── ErrorBoundary.jsx
│   │   ├── LoadingScreen.jsx
│   │   ├── NotificationBell.jsx
│   │   ├── Seo.jsx         # react-helmet-async meta tags
│   │   ├── ThemeToggle.jsx
│   │   └── Toast.jsx       # Toast notification system
│   ├── context/
│   │   └── ThemeContext.jsx # Dark/light mode provider
│   ├── pages/
│   │   ├── Home.jsx (in App.jsx)  # Landing page
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── ResetPassword.jsx
│   │   ├── Dashboard.jsx
│   │   ├── AdminUsers.jsx
│   │   ├── ContactPage.jsx
│   │   ├── Profile.jsx
│   │   ├── AIAgent.jsx     # Nova agent page
│   │   ├── ContentGenerator.jsx
│   │   └── NotFound.jsx
│   ├── test/               # Vitest tests
│   ├── App.jsx             # Routes + lazy loading + all landing sections
│   ├── App.css             # All styles (~2900 lines)
│   ├── index.css           # CSS variables + responsive breakpoints
│   ├── api.js              # Dynamic API URL detection
│   └── main.jsx            # Entry point
├── backend/
│   └── src/
│       ├── ai/             # Nova AI module (chat, generate, agent, insights)
│       ├── auth/           # JWT auth + guards (JwtAuthGuard, AdminGuard)
│       ├── config/         # Database + data-source config
│       ├── contact/        # Contact form module
│       ├── dashboard/      # Stats + insights
│       ├── export/         # CSV export
│       ├── migrations/     # TypeORM migrations
│       ├── notifications/  # Notification CRUD
│       └── users/          # User CRUD
├── docker-compose.yml
├── Dockerfile              # Frontend (nginx multi-stage)
├── nginx.conf
└── .github/workflows/ci.yml
```

---

## Scripts

### Frontend
| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build (code-split) |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |
| `npm run test` | Run Vitest tests |

### Backend
| Script | Description |
|--------|-------------|
| `npm run start:dev` | Watch mode dev server |
| `npm run build` | Compile NestJS |
| `npm run start:prod` | Run compiled production |
| `npm run lint` | ESLint |
| `npm test` | Jest tests |

---

## Nova Demo Mode

When the Gemini API key is missing or returns a 429 (free-tier quota exceeded), Nova gracefully falls back to demo responses with realistic content. No quota error messages are shown to the user. The demo mode supports chat conversations, content generation, agent actions (create user, contact, stats, notifications, reports), and business insights.

---

## Theme System Details

The theme is controlled via `ThemeContext` which sets a `data-theme` attribute on `<html>` (`"light"` or `"dark"`). All colors use CSS custom properties that switch smoothly with `transition: background 0.2s, color 0.2s`. The toggle is available from:
- **Public header** — Desktop nav bar
- **Mobile menu** — Hamburger menu on small screens
- **Dashboard header** — Next to notification bell
- **Profile page** — Preferences section with toggle switch

Dark mode overrides include `--primary-gradient`, `--header-bg`, `--card-bg`, and all surface/outline/shadow variables.

---

## Carousels

### Hero Carousel
- 6 high-resolution Unsplash images (business/office theme)
- Auto-advances every 4 seconds with 0.8s fade transition
- Floating badges always visible (z-index: 10)
- Clickable dot indicators at bottom
- `aspect-ratio: 4/3`, `object-fit: cover`
- `--card-bg` with `backdrop-filter: blur(8px)` for badges

### Gallery Carousel
- 5 high-resolution Unsplash images (tech/software theme)
- Slide transition with prev/next buttons
- 520px height (300px on mobile), `object-fit: cover` with `object-position: center`
- Caption overlay with gradient background
