# API Mocking with MSW

The front end can run without the .NET backend by mocking HTTP with
[MSW](https://mswjs.io/) (Mock Service Worker). MSW intercepts requests in the
browser, so the real `HttpClient` services run unchanged — turn it off and
requests fall through the dev-server proxy to the real backend with zero code
change.

## Toggling

Two ways, both with mocking **on by default** in dev:

- **Env flag (build-time):** `useMocks` in
  `projects/app-main/src/environments/environment.development.ts` (`true`).
  Production uses `environment.ts` (`false`). Swapped via `fileReplacements` in
  `angular.json`. Flip to `false` and restart `pnpm start` to hit the real server.
- **Runtime (no restart):** in the browser console —
  `await window.mockApi.stop()` / `await window.mockApi.start()`.

Un-handled endpoints use `onUnhandledRequest: 'bypass'`, so anything not mocked
always reaches the real server.

## Layout

- `projects/app-main/src/mocks/`
  - `mock-db.ts` — in-memory store, seeded with the placeholder tree; stateful
    (mutations persist within a page session).
  - `handlers.ts` — MSW handlers for every `/api/directory/*` endpoint.
  - `browser.ts` — `setupWorker`. Loaded lazily from `main.ts` only when
    mocking is on, so MSW is a separate lazy chunk and never ships in the
    initial / production bundle.
- `projects/app-main/public/mockServiceWorker.js` — the worker script (generated
  by `npx msw init`; committed).

Supporting changes: `provideHttpClient(withFetch())` in `app.config.ts`
(reliable interception); worker start + `window.mockApi` wired in `main.ts`.

## Usage

```bash
pnpm start            # mocked by default — no backend needed
```

To run against the real backend, either call `window.mockApi.stop()` in the
console, or set `useMocks: false` and restart.

## Extending

- **Mock a new endpoint:** add a handler in `mocks/handlers.ts`, backed by
  `mock-db.ts`. Use `import type` for API models so no Angular code is pulled
  into the mock bundle.
- **Add an API service:** put it under `app/api/<feature>/` and re-export from
  `app/api/index.ts`. This folder is the future SDK lift-out boundary
  (`lib-sdk`); feature business-logic services stay where they are and consume
  these services via DI.
