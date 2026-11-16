# Fikra Agency — Frontend

> **FIKRA** (Arabic for "idea") — a modern web agency that builds custom websites, reusable solutions, and SaaS-style tools for businesses worldwide.

## 🌟 Features

- **Multi-language**: Full English / French / Arabic support with **RTL** layouts
- **Dark mode**: System-aware theme toggle with localStorage persistence
- **Modern stack**: React 18 + Vite + Tailwind CSS v4 + Framer Motion + React Router v6
- **Mock API layer**: Axios-based API service with `USE_MOCK=true` flag — swap to a real backend without touching components
- **SEO-ready**: Per-page meta tags via `react-helmet-async`, sitemap, robots.txt, JSON-LD ready
- **Performance**: Code splitting, lazy-loaded routes, gzip compression, Lighthouse-optimized
- **Forms**: react-hook-form + zod validation, multi-step quote form, file upload, honeypot
- **Design**: Premium gradient UI, glassmorphism, scroll reveals, animated counters, marquee tech stack

## 📦 Prerequisites

- Node.js 18+
- npm or yarn

## 🚀 Install & Run

```bash
cd fikra-agency
npm install

# Copy environment file and configure
cp .env.example .env

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🏗️ Build

```bash
npm run build   # builds to dist/ with gzip compression
npm run preview # preview production build
```

## 🛠️ Folder Structure

```
src/
 ├─ assets/          # images, logos, fonts
 ├─ components/
 │   ├─ ui/          # reusable UI (Button, Card, Modal, etc.)
 │   ├─ layout/      # Navbar, Footer, MobileMenu, ScrollToTop
 │   └─ sections/    # Hero, Stats, Services, Projects, etc.
 ├─ pages/           # Route pages (Home, Services, Contact...)
 ├─ data/            # mock.js — simulates REST API responses
 ├─ services/        # api.js — axios instance + mock toggle
 ├─ hooks/           # useTheme, useLang, useScrollReveal
 ├─ i18n/            # en.json, fr.json, ar.json, config
 ├─ context/         # ThemeContext, LangContext
 ├─ utils/           # constants, helpers, theme, seo
 ├─ routes/          # AppRoutes with lazy loading
 └─ App.jsx, main.jsx
```

## 🔄 Switching from Mock to Real API

1. In `.env`, set `VITE_USE_MOCK=false` and `VITE_API_URL=https://your-api.com/api`
2. The `services/api.js` layer will now hit your real endpoints.
3. If needed, adjust the Axios endpoints and response parsing in `services/api.js` — **components never change**.

Alternatively, replace the mock data in `src/data/mock.js` or populate it from your backend's seed script.

## 🌐 Languages & RTL

All text is in translation JSON files (`src/i18n/locales/en.json`, `fr.json`, `ar.json`). No hardcoded strings. Switching to Arabic (`العربية`) automatically sets `dir="rtl"` and mirrors layouts via Tailwind logical properties (`ms-`, `me-`, `start-`, `end-`).

## 🧪 Scripts

| Command      | Description                          |
|--------------|--------------------------------------|
| `npm run dev`    | Start dev server (https://localhost:3000) |
| `npm run build`  | Production build to `dist/`          |
| `npm run preview`| Preview production build             |

## 📄 Licenses & Credits

- Fonts: Inter / Plus Jakarta Sans
- Images: Unsplash (placeholders)
- Icons: Lucide React
- License: Proprietary — Fikra Agency

---

Built with ❤️ by the Fikra team (Ayoub Sofi & friends) — remote-friendly, based in Morocco, serving clients worldwide.
