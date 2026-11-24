# GeoSensePlusWebApp
## TODOs

- Update tests in `state-directory.spec.ts`

## Workspace/Project Generation

Angular version: v20.1.4.

Config choice when generating app-main:
- use zone.js
- use SCSS

Use angular's own workspace as monorepo approach.

## Projects

All projects are managed by pnpm.

Current workspace includes the folllowing projects:

- app-main: application for the core GeoSense+ functionalities, which include:
  - uns (aka. state directory)
  - position engine
- lib-ui: wrapper components for angular material
- lib-core: non-component, reusable frontend logics

There could be more apps in the future, some might be experimental and will be eventually
merged into app-main.

## Development
### Proxy Configuration

- API requests to `/api/*` are proxied to `https://localhost:5001`
- Configuration file: `proxy.config.json`
- The configuration is specified in `angular.json`:
  ```json
  "serve": {
    "builder": "@angular/build:dev-server",
    "options": {
      "proxyConfig": "proxy.config.json"
    },
  ```
- Applied automatically when running `pnpm start` or `ng serve`

### OpenAPI Client Generation
**Json File:**
- The openapi json file is downloaded from https://localhost:5001/swagger/index.html
  (need to start the server first)
- Location of the downloaded file: `projects\app-main\src\app\api\openapi\gsp-server.json`
- Note: the current `openapi-generator-cli` can't support openapi v3.2, so need to manually
  change the version from `3.2` to `3.1` in the `gsp-server.json` file file.

**Client Generation:**

- Tool: `openapi-generator-cli` (devDependency, `typescript-angular` generator; needs a Java runtime)
- Regenerate: `pnpm run generate:api`
- Input: `projects/app-main/src/app/api/openapi/gsp-server.json` (must be at v3.1, see note above)
- Output: `projects/app-main/src/app/api/openapi/generated/` — checked in to git, never hand-edited
- Services are `providedIn: 'root'`; a `provideApi()` helper is also generated for `app.config.ts`
- No need to delete `generated/` before regenerating (files are overwritten in place); wipe it
  only when the backend removed endpoints/models, so stale files don't linger
- Details and known issues: `projects/app-main/src/app/api/openapi/README.md`

**Usage of Generated Code:**

Services are `providedIn: 'root'` — inject them directly:

```ts
import { inject } from '@angular/core';
import { DirectoryService } from './api/openapi/generated'; // adjust to your path

const directoryService = inject(DirectoryService);
directoryService.apiDirectoryGroupIdSubtreeGet({ id: 1 }).subscribe();
```

Services: `DirectoryService` · `InfluxService` · `MessageService` · `SystemService`

Without configuration, requests use relative URLs (`/api/...`), which the dev
server proxies to the .NET backend. To target another server or configure
credentials, add the generated helper to `app.config.ts`:

```ts
providers: [
    provideHttpClient(),
    provideApi('https://localhost:5001'), // or provideApi({ withCredentials: true })
]
```


### Backend Requirements
- .NET Core WebAPI should run on `https://localhost:5001`
- API endpoints should match the paths defined in the State Directory HTTP service
- SSL certificate should be trusted for local development

### Running the Application
- Start your .NET Core WebAPI backend on HTTPS port 5001
- Run `pnpm watch:ui` to watch ui lib's changes, then run `pnpm start` to start
  the Angular development server
- API requests will be automatically proxied to your backend

> **Note:**  
  The `secure: false` setting in the proxy configuration allows the
  development server to connect to HTTPS backends with self-signed certificates
  during local development.

## Claude Code
### Slash Commands

- Use `/commands` to update the existing commands and propose new ones

  Example of /commands
  ```
  /commands I want /act to always pull context from PLAN.md.
  ```

- Develop with `/plan`, then `/act`, then `/review` and back to `/plan`

