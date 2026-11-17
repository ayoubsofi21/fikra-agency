# FIKRA Agency

> **FIKRA** (Arabic for "idea") — a modern web agency website with an integrated Laravel
> backend: public catalogue, multilingual content, lead forms, admin dashboard API,
> media library and inbox management.

This repository is a **monorepo**:

- **Frontend** at the root — React 18 + Vite + Tailwind CSS v4
- **Backend** under [`backend/`](backend/) — Laravel 12 (PHP 8.2+)

The React app talks to the Laravel API through `src/services/api.js` and the
`src/hooks/useContent.js` hooks. Every list page, detail page and form is wired to
the backend; the bundled mock data is only a graceful fallback when the API is
unreachable (or a preview while `VITE_USE_MOCK=true`).

---

## ✨ Features

- **Multi-language** — English / French / Arabic with full RTL support
- **Dark mode** — system-aware, persisted in localStorage
- **Live content** — services, solutions, projects, team, testimonials, blog,
  FAQs, pricing and homepage stats come from the API
- **Lead capture** — multi-step quote form (with file attachments), solution
  request modal, newsletter subscribe/unsubscribe
- **Admin API** — Sanctum token auth, roles (`admin`, `editor`), content CRUD,
  media library, quote/message/newsletter inbox with CSV exports, settings,
  users and dashboard counters
- **Localized API** — translation bags `{ en, fr, ar }` negotiated with
  `Accept-Language` or `?lang=`
- **Public caching** — 10-minute content cache, invalidated automatically on
  any admin write
- **Docs & tooling** — OpenAPI at `/docs`, Postman collection, Pest test suite,
  Playwright audits, Pint formatting

---

## 🧰 Prerequisites

| Tool      | Version      | Used by   |
| --------- | ------------ | --------- |
| Node.js   | 18+          | frontend  |
| npm       | 9+           | frontend  |
| PHP       | 8.2+         | backend   |
| Composer  | 2.x          | backend   |
| SQLite    | built-in     | backend (local dev) |
| MySQL     | 8.x          | backend (production) |

PHP extensions used by the backend: `gd` **or** `imagick` (image thumbnails),
plus the usual Laravel requirements.

---

## 🚀 Quick start (local development)

### 1. Frontend

```bash
cd fikra-agency
npm install
cp .env.example .env          # defaults to /api/v1, mock disabled
```

### 2. Backend

```bash
# one-time: PHP dependencies
composer install --working-dir=backend

# environment + SQLite database + demo content
cd backend
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed
php artisan storage:link
```

> Or run everything at once from the root: `npm run api:setup`.

Seeded accounts (change before deploying):

| Role   | Email                | Password                   |
| ------ | -------------------- | -------------------------- |
| admin  | `admin@fikra.agency` | `change-me-strong-password` |
| editor | `editor@fikra.agency`| `change-me-strong-password` |

### 3. Run both

Two terminals:

```bash
npm run api:serve     # Laravel API on http://127.0.0.1:8000
npm run api:queue     # queued email + media conversions (optional in dev)
```

and

```bash
npm run dev           # Vite on http://localhost:3000
```

The Vite config proxies `/api` to `http://127.0.0.1:8000`, so the browser
requests `http://localhost:3000/api/v1/...` and no CORS setup is needed in
development.

Open [http://localhost:3000](http://localhost:3000).

---

## 🔌 Configuration

### Frontend (`.env`)

```dotenv
# Must include the version prefix. Dev default is proxied by Vite.
VITE_API_URL=/api/v1
# true = serve the bundled mock data with a simulated delay
VITE_USE_MOCK=false
```

Production example: `VITE_API_URL=https://api.fikra.agency/api/v1`.

### Backend (`backend/.env`)

The most important variables (full list in `backend/.env.example`):

| Variable                   | Purpose                                        |
| -------------------------- | ---------------------------------------------- |
| `APP_ENV` / `APP_DEBUG`    | `local` / `true` for development              |
| `APP_URL`                  | `http://localhost:8000`                        |
| `FRONTEND_URL`             | Allowed CORS origin(s), comma-separated        |
| `DB_CONNECTION`            | `sqlite` locally, `mysql` in production        |
| `QUEUE_CONNECTION`         | `database` — run `npm run api:queue`           |
| `CACHE_STORE`              | `database` or `redis` (public content cache)   |
| `SANCTUM_TOKEN_EXPIRATION` | Admin token lifetime in minutes (default 7 d)  |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seeded administrator                      |
| `MAIL_*`                   | SMTP settings (`log` is fine locally)          |

#### MySQL

```dotenv
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=fikra_agency
DB_USERNAME=your_user
DB_PASSWORD=your_password
```

Then `php backend/artisan migrate --seed`. Migrations, seeders, factories and
demo data are unchanged from the original API project.

### API URL contract

- The backend serves everything under `/api/v1` (`backend/routes/api.php`).
- Pagination accepts `?page=` and `?per_page=` (alias `limit`, capped at 50).
- Public lists return `{ data, meta: { pagination }, links }`; errors return
  `{ message, errors }`.
- Localized fields are `{ en, fr, ar }` bags; scalar localized fields resolve
  through `?lang=` or `Accept-Language`.

---

## 🧪 Testing & quality

```bash
# Backend — 41 Pest feature tests (in-memory SQLite)
npm run api:test
cd backend && ./vendor/bin/pint --test     # PHP formatting

# Frontend
npm run lint                                # ESLint (backend excluded)
npm run build                               # production build

# End-to-end audit (dev server must be running on :3000)
node final-audit.cjs                        # console errors, a11y, overflow, RTL
npx playwright test tests/                  # Playwright suites
```

Current backend suite: **41 tests, 294 assertions**.

---

## 📁 Repository structure

```
fikra-agency/
├─ src/                  # React application
│  ├─ hooks/             # useContent — API-backed content hooks
│  ├─ services/api.js    # axios client + mock fallback
│  ├─ pages/             # route pages
│  ├─ components/        # ui, layout, sections
│  ├─ i18n/              # en / fr / ar resources
│  └─ utils/             # constants, helpers
├─ backend/              # Laravel 12 API (complete, self-contained)
│  ├─ app/               # controllers, models, requests, resources
│  ├─ database/          # migrations, seeders, factories, seed_data
│  ├─ routes/            # api.php
│  ├─ docs/              # Postman collection + environment
│  └─ tests/             # Pest feature tests
├─ .env.example          # frontend env template
├─ vite.config.js        # dev server + /api proxy
└─ README.md
```

Backend documentation (endpoints, admin permissions, deployment checklist):
[`backend/README.md`](backend/README.md).

---

## 📦 Production deployment

**Backend**

1. `composer install --no-dev --optimize-autoloader`
2. Configure `.env`: production DB, `APP_ENV=production`, `APP_DEBUG=false`,
   real `APP_URL`, `FRONTEND_URL`, mail, queue and cache
3. `php artisan migrate --force` (seed only on first deploy)
4. `php artisan storage:link`
5. `php artisan config:cache && php artisan route:cache && php artisan view:cache`
6. Serve `backend/public` via nginx/Apache; run `php artisan queue:work` under
   Supervisor; install `gd`/`imagick` for image conversions
7. API docs are at `/docs` (OpenAPI at `/docs.json`); restrict the
   `viewApiDocs` gate outside `local`

**Frontend**

```bash
npm ci
cp .env.example .env      # set VITE_API_URL to the public API
npm run build             # outputs dist/
```

Serve `dist/` as a static site and set `FRONTEND_URL` on the API to the site's
origin (or an asset domain) so CORS matches.

**Useful scripts**

| Script             | Action                                     |
| ------------------ | ------------------------------------------ |
| `npm run dev`      | Vite dev server (port 3000)                |
| `npm run build`    | Production build with gzip                 |
| `npm run lint`     | ESLint                                     |
| `npm run preview`  | Preview the production build               |
| `npm run api:serve`| `php artisan serve` (port 8000)            |
| `npm run api:queue`| Queue worker (mail + media conversions)    |
| `npm run api:migrate` | Run migrations + seeders                |
| `npm run api:test` | Pest test suite                            |
| `npm run api:setup`| Install backend deps, create env, migrate  |

---

## 📮 Forms, rate limits & security

- Public forms (`POST /contact`, solution requests, newsletter) are limited to
  **5 requests/minute/IP** and protected by a honeypot field.
- Quote attachments are stored on a **private disk** and only downloadable via
  the authenticated admin endpoint; supported types: `pdf, doc, docx, png, jpg,
  jpeg`, 5 MB each, max 3 files.
- Admin routes require `Authorization: Bearer <token>`; login is throttled and
  tokens expire (default 7 days).
- No secrets are committed: `.env`, SQLite databases, `vendor/` and
  `public/storage` are ignored.

---

## 🪪 License

MIT
