# AGENTS.md – AI Agent Guide for VCC React

## Project Overview
Cricket club website (Create React App + TypeScript). A React SPA that communicates with an IIS/.NET backend via a REST API.  
Styling uses **Tailwind CSS** + **Bootstrap/react-bootstrap**. Data grids use **AG Grid**. Charts use **Chart.js/react-chartjs-2**. Rich text via **Tiptap**.

## Architecture

### Routing (`src/App.tsx`)
All routes are flat in `App.tsx`. Public pages (`/`, `/about`, `/fixtures`, etc.) and admin pages (`/admin/*`) live side-by-side – there is no auth guard in the frontend.

### API Layer (`src/api/`)
All backend calls go through a 3-layer stack:
1. **`src/api/http.ts`** – thin `fetch` wrappers: `getJson`, `postJson`, `putJson`, `deleteRequest`
2. **`src/api/config.ts`** – `apiUrl(path)` helper that prepends `REACT_APP_API_BASE_URL` in production; returns relative paths in dev/test
3. **`src/api/*Api.ts`** – one file per resource (e.g. `playersApi.ts`, `fixturesApi.ts`). Always import from these; never call `fetch` directly in components.

### DTO Types (`src/api/swaggerTypes.ts`)
All request/response types come from the OpenAPI spec (`cricketclub.json`). They are **generated** to `src/api/generated/openapi.ts` and re-exported as named aliases from `src/api/swaggerTypes.ts`.  
**Always import types from `src/api/swaggerTypes.ts`, never from `generated/openapi.ts` directly, and never write handmade duplicates.**

### Components (`src/components/`)
One file per page/feature. Admin components are prefixed `Admin`. AG Grid cell renderers live in `src/components/cellRenderers/`.

## Key Commands

| Task | Command |
|---|---|
| Start dev server | `npm start` (proxies `/api` → `http://localhost:5000` or `REACT_APP_API_URL`) |
| Run tests (CI mode) | `npm test -- --watchAll=false` |
| Build for production | `npm run build` |
| Fetch latest OpenAPI spec from backend | `npm run fetch:openapi` – backend is cold-start; allow **30–60 s** on first request |
| Fetch spec + regenerate types | `npm run generate:openapi:fresh` |
| Regenerate OpenAPI types (from local spec) | `npm run generate:openapi` |
| Full pre-commit check | `npm run verify` (generates types → checks imports → tests → build) |
| Check no domain DTO imports | `npm run check:no-domain-dto-imports` |

## Mandatory Pre-Completion Checklist

Before declaring any coding task complete, you **must** run a full production build and confirm it succeeds:

```
npm run build
```

- If the build **fails**, fix all errors before ending your turn.
- TypeScript type errors, missing imports, and invalid JSX props are **only caught at build time** — do not rely solely on IDE error checks or tests.
- Run the build after every file edit that touches TSX/TS source files.
- Warnings (e.g. ESLint, bundle size) are acceptable; **errors are not**.

## Dev Environment
- Backend URL defaults to `http://localhost:5000`; override via `.env.development` → `REACT_APP_API_URL=http://localhost:8080`
- Production static web app needs `REACT_APP_API_BASE_URL=https://<api-host>` set at build time (see `src/api/config.ts`)
- The proxy (`src/setupProxy.js`) rewrites `/api/*` → `<target>/api/*` (i.e. the prefix is preserved on the backend)
- The dev API at `https://api.dev.thevillagecc.org.uk` scales to zero. The `fetch:openapi` script uses `--retry 3` with a 2-minute timeout per attempt — just wait; do not cancel early.

## Enforced Conventions
- **No `domain/` imports**: `scripts/check-no-domain-dto-imports.js` (run in `verify`) blocks any import from a `domain/` path. DTO types must come from `swaggerTypes.ts`.
- **Refresh the API spec before any API-related changes**: before adding or modifying anything in `src/api/` (new endpoints, DTO types, Api files), always run `npm run generate:openapi:fresh` first to pull the latest spec from the backend and regenerate types. Do not rely on the checked-in `cricketclub.json` being up to date.
- **Regenerate types before editing**: if the backend schema changed, run `npm run generate:openapi` first so `swaggerTypes.ts` aliases stay accurate.
- **Jest transform**: `@tiptap` and several prosemirror packages are excluded from `transformIgnorePatterns` in `package.json` so they get transpiled in tests – keep this if adding new ESM-only deps.

## API Gap Protocol – When the Backend Can't Support a Feature

If, during implementation, you determine that the existing API endpoints **do not adequately support** the feature you are building (e.g. missing endpoints, insufficient data in responses, no filtering/sorting support, missing write operations), you **must stop frontend implementation** and instead produce a backend task specification. Do **not** work around the limitation (e.g. over-fetching and filtering client-side, hardcoding data, or making multiple calls to reconstruct data the API should provide).

### When to trigger this protocol
- The required data is not available from any existing endpoint.
- An existing endpoint returns data in a shape that cannot reasonably support the UI without significant client-side transformation that belongs in the API.
- A write operation (create/update/delete) has no corresponding endpoint.
- Pagination, filtering, or sorting needed for acceptable UX is absent from the API.

### What to produce
Stop and output a **Backend Task Spec** using the template below, then end your turn. Do not write partial frontend code that depends on the missing API capability.

---

**Backend Task Spec**

**Feature context:** _Brief description of the frontend feature being built._

**Gap identified:** _What the current API cannot do and why that blocks the frontend._

**Required backend changes:**
- [ ] _Endpoint / change 1 (method, route, description)_
- [ ] _Endpoint / change 2 …_

**Request shape (if applicable):**
```json
// example request body or query params
```

**Response shape (if applicable):**
```json
// example response body
```

**Acceptance criteria for frontend unblock:** _What the agent needs to be able to do once the backend changes are in place._

---

Once the backend changes have been delivered and the OpenAPI spec updated, re-run `npm run generate:openapi:fresh` and resume frontend implementation.

## Important Files
- `cricketclub.json` – OpenAPI spec (source of truth for all DTO shapes)
- `src/api/swaggerTypes.ts` – canonical DTO type imports for components
- `src/api/config.ts` – `apiUrl()` – always use this for endpoint paths
- `src/setupProxy.js` – dev proxy config
- `src/App.tsx` – all route definitions

