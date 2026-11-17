# FIKRA Agency — API

Laravel 12 REST API behind the FIKRA Agency website and admin dashboard. It serves the public
catalogue in the exact shapes the React frontend's mock layer uses, and a token-authenticated
admin API for content, media, inbox management, settings and users.

- **Framework:** Laravel 12 (PHP 8.2+)
- **Database:** MySQL 8 in production, SQLite for local development
- **Auth:** Laravel Sanctum personal access tokens
- **Translations:** `spatie/laravel-translatable` (JSON `en` / `fr` / `ar`)
- **Roles:** `spatie/laravel-permission` (`admin`, `editor`)
- **Media:** `spatie/laravel-medialibrary` (thumb + webp conversions)
- **Slugs:** `spatie/laravel-sluggable`
- **Docs:** [Scramble](https://scramble.dedoc.co/) at `/docs`
- **Tests:** Pest 3 (feature tests)

---

## Quick start

```bash
# 1. Install PHP dependencies
composer install

# 2. Environment
cp .env.example .env
php artisan key:generate

# 3. SQLite for local development (skip for MySQL)
touch database/database.sqlite
# then edit .env: DB_CONNECTION=sqlite  (and remove DB_HOST/DB_PORT/DB_DATABASE/DB_USERNAME)

# 4. Schema + demo content
php artisan migrate --seed

# 5. Public storage for uploaded media (avatars, covers, galleries)
php artisan storage:link

# 6. Run
php artisan serve          # http://localhost:8000
php artisan queue:work     # second terminal: emails + media conversions
```

Seeded accounts (change them before deploying):

| Role   | Email                | Password                   |
| ------ | -------------------- | -------------------------- |
| admin  | `admin@fikra.agency` | `change-me-strong-password` |
| editor | `editor@fikra.agency`| `change-me-strong-password` |

Override with `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `EDITOR_EMAIL`, `EDITOR_PASSWORD`
in `.env` before running `migrate --seed`.

### MySQL

Create the database, then set:

```dotenv
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=fikra_agency
DB_USERNAME=your_user
DB_PASSWORD=your_password
```

```bash
php artisan migrate --seed
```

---

## Connecting the React frontend

The frontend lives in a separate repository. Its API layer is toggled by two Vite variables:

```dotenv
# frontend .env.local
VITE_USE_MOCK=false
VITE_API_URL=http://localhost:8000/api/v1
```

`VITE_API_URL` must include the `/api/v1` prefix. The frontend's axios client sends `limit`
instead of `per_page`; the API accepts both.

CORS is configured from this side:

```dotenv
# backend .env
FRONTEND_URL=http://localhost:3000
# multiple origins: http://localhost:3000,https://fikra.agency
```

If the frontend is served from a different port (`5173` for raw Vite, `3000` for Docker), add
that origin to `FRONTEND_URL`. No frontend code changes are needed — the resource shapes match
`src/data/mock.js` one-to-one.

---

## API conventions

### Envelopes

```jsonc
// single resource
{ "data": { /* ... */ } }

// list
{
  "data": [ /* ... */ ],
  "meta": { "pagination": { "current_page": 1, "per_page": 15, "total": 42, "last_page": 3, "from": 1, "to": 15 } },
  "links": { "first": "…", "last": "…", "prev": null, "next": "…" }
}

// error (401/403/404/422/429/500)
{ "message": "The given data was invalid.", "errors": { "email": ["…"] } }
```

Pagination accepts `?page=` and `?per_page=` (alias `limit`), capped at **50**, default **15**.

### Localisation

Public text fields are returned as translation bags so the frontend can switch languages
instantly:

```json
{ "title": { "en": "Custom Web Development", "fr": "Développement web sur mesure", "ar": "تطوير ويب مخصص" } }
```

Locale-dependent list fields (`deliverables`, solution `features`) and scalar fields
(`service.timeline`) resolve to the **active locale**. Pick it with either:

```http
GET /api/v1/services?lang=fr
GET /api/v1/services
Accept-Language: ar
```

Supported locales are `en` (default/fallback), `fr`, `ar`.

### Public caching

Every public `GET` is cached for **10 minutes** (`App\Services\ContentCache`). Any successful
admin mutation bumps a cache version and invalidates every public response immediately, so the
website always reflects dashboard edits.

### Public forms

`POST /contact`, `POST /solution-requests`, `POST /solutions/{slug}/request` and
`POST /newsletter` are:

- limited to **5 requests per minute per IP** (HTTP 429 beyond that),
- protected by a honeypot (`honeypot`, `_hp`, `website_url` — filling one returns 422),
- validated with localized messages in `en` / `fr` / `ar`.

`POST /contact` is a single endpoint for both flows: send `description` for a quote request
(stored privately, two queued emails) or `message` for a contact message (one queued email).
Quote attachments accept `pdf`, `doc`, `docx`, `png`, `jpg`/`jpeg`, up to **5 MB** each and
**3 files**, and are stored on a **private disk** — they are only reachable through the admin
download endpoint.

All outbound mail is queued (`QUEUE_CONNECTION=database` by default). Run a worker, or the
mail and media conversions never process.

---

## Admin API

### Authentication

```http
POST /api/v1/admin/auth/login
{ "email": "admin@fikra.agency", "password": "change-me-strong-password" }

200 { "data": { "token": "1|…", "token_type": "Bearer", "expires_at": "…", "abilities": ["*"], "user": { … } } }
```

Send `Authorization: Bearer <token>` on every admin request. Tokens expire after
`SANCTUM_TOKEN_EXPIRATION` minutes (default 7 days). Relevant endpoints:

| Method | Path                              | Notes                                        |
| ------ | --------------------------------- | -------------------------------------------- |
| POST   | `/admin/auth/login`               | 5 attempts/minute; returns a token           |
| GET    | `/admin/auth/me`                  | Current user + abilities                     |
| POST   | `/admin/auth/logout`              | Revokes the current token                    |
| POST   | `/admin/auth/forgot-password`     | Always generic (no account enumeration)      |
| POST   | `/admin/auth/reset-password`      | Revokes all tokens on success                |

### Roles and permissions

| Permission        | admin | editor |
| ----------------- | :---: | :----: |
| `manage-content`  |  ✅   |   ✅   |
| `manage-media`    |  ✅   |   ✅   |
| `manage-inbox`    |  ✅   |   ✅   |
| `manage-users`    |  ✅   |   ❌   |
| `manage-settings` |  ✅   |   ❌   |

Authenticated staff without a spatie role get **403** on management endpoints. Guests get
**401**. Admin tokens carry `["*"]`; editor tokens carry their explicit permissions.

### Content CRUD

`apiResource` routes under `/admin` for:

`services`, `solutions` (+ nested `solutions/{solution}/features`), `solution-categories`,
`projects`, `team`, `testimonials`, `posts`, `post-categories`, `faqs`, `pricing`.

- `PUT`/`PATCH` take the **full payload** (English is required for localized fields; French and
  Arabic can be filled in progressively).
- `PATCH /admin/{resource}/{id}/toggle` flips `is_active` (posts use publish/unpublish semantics).
- `PATCH /admin/{resource}/reorder` takes `{ "ids": [3, 1, 2] }`.
- Projects, posts and solutions are soft-deleted; `?trashed=only|with` lists them and
  `POST /admin/{resource}/{id}/restore` restores.
- Admin resources return **all translations**, plus media URLs.

### Media library

Generic endpoints keyed by resource type:

| Method | Path                          | Purpose                                  |
| ------ | ----------------------------- | ---------------------------------------- |
| GET    | `/admin/media/{type}/{id}`    | List media for a record                  |
| POST   | `/admin/media/{type}/{id}`    | Upload 1–10 files into a collection      |
| PATCH  | `/admin/media/{media}`        | Rename (`name`) / set `alt`              |
| DELETE | `/admin/media/{media}`        | Delete a file                            |

`{type}`: `projects` (`cover`, `gallery`), `posts` (`cover`), `team` (`photo`),
`testimonials` (`avatar`), `users` (`avatar`). Unknown types return 404, wrong collections 422.

Uploads produce a `thumb` (400×300 center crop) and `webp` variant. Conversions are queued:
run a worker, and make sure PHP has **gd** or **imagick** installed. Without them uploads still
succeed but `thumb`/`webp` stay `null`.

### Inbox

| Method | Path                                          | Purpose                              |
| ------ | --------------------------------------------- | ------------------------------------ |
| GET    | `/admin/quotes`                               | `?status=new|in_progress|won|lost`, `?search=` |
| GET    | `/admin/quotes/{quote}`                       | Detail + attachment metadata          |
| PUT    | `/admin/quotes/{quote}`                       | `status`, `internal_notes`            |
| GET    | `/admin/quotes/{quote}/attachments/{index}`   | Private attachment download (0-based)|
| GET    | `/admin/quotes/export`                        | Streamed CSV                         |
| GET    | `/admin/contact-messages`                     | `?is_read=0|1`, `?search=`            |
| PATCH  | `/admin/contact-messages/{message}`           | Mark read/unread (`is_read`)          |
| GET    | `/admin/contact-messages/export`              | Streamed CSV                         |
| GET    | `/admin/newsletter`                           | Subscribers (token included)          |
| GET    | `/admin/newsletter/export`                    | Streamed CSV                         |
| DELETE | `/admin/quotes/{quote}`, `/admin/contact-messages/{message}`, `/admin/newsletter/{subscriber}` | Delete |

CSV exports are UTF-8 with a BOM so Excel opens Arabic and French correctly.

### Settings, users, dashboard

| Method | Path             | Notes                                              |
| ------ | ---------------- | -------------------------------------------------- |
| GET    | `/admin/settings`| `{ site, social, whatsapp, stats }`                |
| PUT    | `/admin/settings`| Partial updates; object groups merge, lists replace |
| GET    | `/admin/users`   | `?role=`, `?search=`                               |
| POST   | `/admin/users`   | `name`, `email`, `password`, `role`                |
| PUT    | `/admin/users/{user}` | Role/password/name updates; role stays in sync with spatie |
| DELETE | `/admin/users/{user}` | Revokes the user's tokens                      |
| GET    | `/admin/dashboard` | Quote/message/subscriber counters, content totals, recent activity |

Safety rules: you cannot delete your own account or change your own role, and the last
administrator cannot be demoted or deleted (422 with a localized message).

Dashboard access needs at least one management permission. `recent_quotes` / `recent_messages`
are only returned to users with `manage-inbox`.

---

## API documentation

With the app running:

- **Interactive docs (Scramble):** <http://localhost:8000/docs>
- **OpenAPI 3.1 JSON:** <http://localhost:8000/docs.json>

Docs are public in `local`. In every other environment they require the `viewApiDocs` gate to
allow the request — define it (for example, admin-only) when deploying.

---

## Postman

Import both files from `docs/`:

- `docs/FIKRA-Agency-API.postman_collection.json`
- `docs/FIKRA-Agency-API.postman_environment.json`

Select the **Local** environment, then run **Admin auth → Login**: the test script stores the
token in the collection variable `token`, and every admin folder uses it. Fill the `*Id` /
`*Slug` variables from list responses as you go.

---

## Testing

```bash
php artisan test            # or: ./vendor/bin/pest
php artisan test --filter=AdminAuthTest
```

The suite uses SQLite `:memory:`, `array` cache, `sync` queue and fake mail/storage. It covers:

- public listing envelopes, pagination caps and locale negotiation (`PublicContentTest`)
- quote/contact/solution/newsletter flows, validation, honeypot, throttling and queued mail
  (`PublicFormsTest`)
- admin login, token revocation, throttling and password reset (`AdminAuthTest`)
- content CRUD, nested features, reorder/toggle, soft delete and cache invalidation
  (`AdminContentTest`)
- media uploads/validation, inbox filters, CSV exports, attachment download/cleanup and
  role permissions (`AdminMediaInboxTest`)
- settings merge/cache flush, user management guards and dashboard counters
  (`AdminUsersSettingsTest`)

Current status: **41 tests, 294 assertions**.

---

## Environment reference

See `.env.example` for the full list. The variables that matter most:

| Variable                    | Purpose                                                   |
| --------------------------- | --------------------------------------------------------- |
| `FRONTEND_URL`              | Allowed CORS origin(s), comma-separated                    |
| `APP_SUPPORTED_LOCALES`     | `en,fr,ar`                                                 |
| `DB_CONNECTION`             | `mysql` in production, `sqlite` locally                    |
| `QUEUE_CONNECTION`          | `database` — run `php artisan queue:work`                  |
| `MAIL_*`                    | SMTP credentials; `log` locally                            |
| `QUOTE_ATTACHMENTS_DISK`    | Private disk for quote uploads (`local` by default)        |
| `CACHE_STORE`               | `database` or `redis`; drives the 10-minute public cache   |
| `SANCTUM_TOKEN_EXPIRATION`  | Admin token lifetime in minutes (default 10080 = 7 days)   |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seeded administrator and the inbox recipient          |
| `TEAM_NOTIFICATION_EMAIL`   | Extra recipient for form notifications                     |
| `API_VERSION`               | Version shown in the OpenAPI document                      |

---

## Deployment checklist

1. `composer install --no-dev --optimize-autoloader`
2. Set `.env` (production DB, `APP_ENV=production`, `APP_DEBUG=false`, real `APP_URL`, `FRONTEND_URL`, mail, cache, queue)
3. `php artisan key:generate` (once per environment)
4. `php artisan migrate --force` (seed only on the first deploy, or provision the admin user manually)
5. `php artisan storage:link`
6. `php artisan config:cache && php artisan route:cache && php artisan view:cache`
7. Serve `public/` through nginx/Apache; PHP 8.2+ with `gd` or `imagick` for image conversions
8. Run `php artisan queue:work --tries=3` under Supervisor (mail + media conversions)
9. Point the frontend at `https://api.example.com/api/v1` with `VITE_USE_MOCK=false`
10. Define the `viewApiDocs` gate if `/docs` should be restricted, or block it at the proxy
11. Verify `GET /api/v1/health` returns `{"status":"ok"}` and rotate the seeded passwords

No scheduler entries are required; the public cache invalidates itself on writes and expires
after 10 minutes.
