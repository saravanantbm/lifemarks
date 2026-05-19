# Lifemarks — Mark what matters. Live what you love.

A personal life-experience platform that unifies goal-setting with cultural taste tracking — movies, music, restaurants, books, and more.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)](https://lifemarks.vercel.app)
[![Built with React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-5A0FC8?logo=pwa)](https://web.dev/progressive-web-apps/)

---

## Features

- **Goal Buckets** — Organise life goals by category (Life, Personal, Lifestyle, Finance, Family)
- **Roadmap Builder** — Break goals into milestones with due dates and progress tracking
- **Experience Tracker** — Maintain a want-list and done-list for movies, restaurants, music, and more
- **Lived It!** — A beautiful diary of completed experiences with star ratings and reviews
- **Celebration Overlay** — Confetti animation when you complete a goal
- **Real Auth + Database** — Supabase-powered login/signup; all data is private and synced per user
- **PWA** — Installable on Android and iOS, works offline
- **Responsive** — Mobile bottom nav + desktop sidebar

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI | React 18 + TypeScript |
| Styling | Tailwind CSS v3 |
| Routing | React Router v6 |
| State | Zustand v5 |
| Animations | Framer Motion |
| Auth + DB | Supabase (PostgreSQL + Row Level Security) |
| Build | Vite + vite-plugin-pwa |
| Deploy | Vercel |

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/saravanantbm/lifemarks.git
cd lifemarks
npm install
```

### 2. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. Open **SQL Editor** → paste the contents of [`supabase/schema.sql`](./supabase/schema.sql) → **Run**
3. Copy your project URL and anon key from **Project Settings → API**

### 3. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Deployment (Vercel)

1. Push to GitHub (already done)
2. Import repo in [vercel.com](https://vercel.com)
3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy — Vercel auto-handles SPA routing via `vercel.json`

---

## Database Schema

Three tables with Row Level Security (users only see their own data):

```
profiles     — id, name, joined_at
goals        — id, user_id, title, category, priority, milestones (jsonb), status, ...
experiences  — id, user_id, title, type, status, rating, review, ...
```

See [`supabase/schema.sql`](./supabase/schema.sql) for the full schema, RLS policies, and auto-profile trigger.

---

## Project Structure

```
src/
├── components/     # Shared UI components
├── hooks/          # useAuth (Supabase session)
├── lib/            # supabase.ts client, db.ts helpers
├── pages/          # Route-level page components
├── store/          # Zustand store with Supabase sync
└── types/          # TypeScript interfaces
supabase/
└── schema.sql      # Database schema + RLS policies
docs/
└── Lifemarks_PRD_v1.0.pdf   # Product Requirements Document
```

---

## Product Requirements

See [`docs/Lifemarks_PRD_v1.0.pdf`](./docs/Lifemarks_PRD_v1.0.pdf) for the full PRD.

---

## Install as App

### Android / iOS (PWA)
Open the deployed URL in Chrome (Android) or Safari (iOS) → **Add to Home Screen**.
The app runs fullscreen with offline support.

### Android (Native APK via Capacitor)
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init Lifemarks com.thrive.lifemarks --web-dir dist
npm run build
npx cap add android
npx cap sync
npx cap open android   # then Build → Generate Signed APK
```

---

## License

Private — © Thrive / Saravanan. All rights reserved.
