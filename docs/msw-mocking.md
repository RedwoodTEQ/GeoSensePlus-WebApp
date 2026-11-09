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

## Main Files

- `projects/app-main/src/mocks/`
  - `mock-db.ts` — in-memory store, seeded with the placeholder tree; stateful
    (mutations persist within a page session).
  - `handlers.ts` — MSW handlers for every `/api/directory/*` endpoint.
  - `browser.ts` — `setupWorker`. Loaded lazily from `main.ts` only when
    mocking is on, so MSW is a separate lazy chunk and never ships in the
    initial / production bundle.
- `projects/app-main/public/mockServiceWorker.js` — the worker script (generated
  by `npx msw init`; committed). Its location is configured in `package.json`:

  ```json
  "msw": {
    "workerDirectory": [
      "projects\\app-main\\public"
    ]
  }
  ```

  This configuration is only used by `msw init` (so the CLI knows where to
  write the file), not by the app itself.

Because of the browser's security mechanism, a service worker script must be
served from the app's same origin (and registered by URL, not imported from
`node_modules` — the dev server doesn't serve that folder). That is why MSW
generates the file into the project instead of shipping it as an importable
npm module. The file contains no business logic: it only relays intercepted
requests to the in-page MSW runtime; all mocking lives in `src/mocks/`.

Supporting changes: `provideHttpClient(withFetch())` in `app.config.ts`;
worker start + `window.mockApi` wired in `main.ts`.

### Why `withFetch()`

Angular `HttpClient` does not use the browser fetch API by default — it sends
requests via XMLHttpRequest. `provideHttpClient(withFetch())` in
`app.config.ts` tells Angular to use the browser fetch API instead, so that
MSW's service worker can intercept the HTTP requests for mocking. (A service
worker can also see XHR requests, but it cannot read their request bodies, so
mocked POST/PUT/DELETE would break. With fetch, MSW gets a standard `Request`
object whose body it can read, making interception fully reliable.)

This applies to both `HttpClient` and `httpResource`: `httpResource` is built
on top of `HttpClient.request()` and sends through the same backend, so a
single `withFetch()` configures both APIs for reliable MSW interception.

## Wiring into the app

MSW is hooked in via the `enableMocking` function in `main.ts`: it calls
`mocks/browser.ts` (`setupWorker`), which registers the service worker defined
in `app-main/public/mockServiceWorker.js`. The import of `browser.ts` is
dynamic, so MSW is never bundled into production. Bootstrap waits for the
worker to start, guaranteeing mocks are active before the first HTTP request.

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
