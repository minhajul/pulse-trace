# PulseTrace

A modern feed of writing from independent authors, served straight from the PulseTrace backend.

PulseTrace is a small full-stack monorepo with two services that talk to each other over HTTP:

- **`backend/`** — a [NestJS](https://nestjs.com) (Express) API on port `5001` that serves stories.
- **`frontend/`** — a [Next.js 16](https://nextjs.org) (App Router, React 19) app on port `3000` that renders the feed.

The two are wired together for local development and for production on [Vercel](https://vercel.com) using the project's `vercel.json` (service bindings + path rewrites).

---

## Repository layout

```
.
├── backend/      # NestJS API (TypeScript)
├── frontend/     # Next.js app (TypeScript, Tailwind CSS v4)
├── vercel.json   # Vercel services + rewrites (used in production)
└── README.md     # ← you are here
```

Each subdirectory is a standalone Node.js project with its own `package.json`, dependencies, and tests. See:

- [`backend/README.md`](./backend/README.md) — NestJS-specific commands (start, build, test).
- [`frontend/README.md`](./frontend/README.md) — Next.js-specific commands (dev, build, start).

---

## How the two services talk

A single endpoint powers the home page:

```
GET /api/stories
```

The Next.js server component (`frontend/src/app/page.tsx`) calls this via `fetchStories()` in `frontend/src/app/api.ts`, which fetches from the backend using a base URL resolved at request time:

1. **Production (Vercel):** `BACKEND_URL` is injected via the service binding declared in `vercel.json` (`services.frontend.bindings[0]`). The top-level rewrite (`/api/* → backend`) forwards the path unchanged to the Nest controller mounted at `@Controller('api/stories')`.
2. **Local development:** `BACKEND_URL` is unset, so the frontend falls back to `process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:5001'` — the NestJS dev server.

### Response envelope

`GET /api/stories` returns:

```json
{
  "status": "success",
  "count": 5,
  "data": [
    {
      "id": 1,
      "title": "The Last Lighthouse Keeper",
      "author": "Elena Marsh",
      "content": "For thirty years, Thomas watched the sea from his glass tower. Tonight, the light finally answered back."
    }
  ],
  "timestamp": "2026-07-02T12:34:56.000Z"
}
```

The `Story` type is duplicated in both `backend/src/stories/stories.service.ts` and `frontend/src/app/api.ts` — they must stay in sync. If you change one, change the other.

The frontend's `fetchStories()` also normalizes the response at runtime so it tolerates a bare array `Story[]` or envelopes whose list lives under `stories` / `items` / `results`, and throws a descriptive error otherwise — so a contract drift surfaces as a real error rather than a silent empty feed.

---

## Prerequisites

- **Node.js ≥ 20** (matches `backend/package.json` → `engines.node`).
- **npm** (the lockfile is `package-lock.json` in each subdirectory).

---

## Local development

You need both services running at the same time, in separate terminals.

### 1. Backend

```bash
cd backend
npm install
npm run start:dev     # nest start --watch, http://localhost:5001
```

Sanity check:

```bash
curl http://localhost:5001/api/stories
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev           # next dev, http://localhost:3000
```

By default the frontend talks to `http://localhost:5001`. To override (e.g. point at a deployed staging backend), set `NEXT_PUBLIC_API_BASE` in `frontend/.env.local`:

```bash
NEXT_PUBLIC_API_BASE=https://my-backend.example.com
```

---

## Running tests

Each project has its own test setup:

```bash
# Backend (Jest, unit + e2e)
cd backend
npm run test          # unit
npm run test:e2e      # e2e (supertest)

# Frontend (Next.js / ESLint)
cd frontend
npm run lint
```

---

## Project structure in detail

### Backend

```
backend/src
├── main.ts                       # bootstrap (NestFactory + port 5001)
├── app.module.ts
├── app.factory.ts                # cached Nest app factory for serverless
└── stories/
    ├── stories.module.ts
    ├── stories.controller.ts     # GET /api/stories
    └── stories.service.ts        # Story data + StoriesListResponse type
```

The five demo stories are inlined in `stories.service.ts` — no database is required to run the app.

### Frontend

```
frontend/src
└── app/
    ├── layout.tsx                # root layout: <html> + <body class="min-h-full flex flex-col">
    ├── page.tsx                  # home: server-fetches + renders stories
    ├── globals.css               # Tailwind v4 entry
    └── api.ts                    # Story / StoriesListResponse types + fetchStories()
```

Styling is Tailwind CSS v4 via PostCSS (`@tailwindcss/postcss`). The home page reads `response.data` and renders each story as a card inside a responsive `sm:grid-cols-2` grid.

---

## Deployment (Vercel)

`vercel.json` declares two Vercel microservices:

- **`backend`** — framework `express`, entrypoint `dist/main.js`, dev command `node dist/main.js`.
- **`frontend`** — framework `nextjs`, with a service binding that exposes the backend's URL as the `BACKEND_URL` env var on the frontend.

Rewrites:

```json
{ "source": "/api/(.*)",  "destination": { "service": "backend" } }
{ "source": "/(.*)",      "destination": { "service": "frontend" } }
```

So `/api/stories` from the browser is forwarded to the Nest controller at `/api/stories`, and everything else is served by the Next.js app.

To deploy:

1. Make sure `backend/dist/main.js` exists (run `npm run build` in `backend/`). Vercel will rebuild on push, but you can pre-build to verify locally.
2. Push to the connected Git provider.
3. Vercel reads `vercel.json` and provisions both services + the binding.

---

## Adding a story

Right now the stories are hard-coded in `backend/src/stories/stories.service.ts`. To add one, append a new `Story` object to the `stories` array:

```ts
{
  id: 6,
  title: '...',
  author: '...',
  content: '...',
}
```

The list is re-rendered on every request because `fetchStories()` is called with `cache: 'no-store'`.

---

## Tech stack

| Layer    | Tech                                                     |
| -------- | -------------------------------------------------------- |
| API      | NestJS 11, Express, TypeScript 5                         |
| Web      | Next.js 16 (App Router, Turbopack), React 19             |
| Styling  | Tailwind CSS v4                                          |
| Runtime  | Node.js ≥ 20                                             |
| Deploy   | Vercel (microservices + binding + rewrites)              |

---

## License

UNLICENSED — private project.
