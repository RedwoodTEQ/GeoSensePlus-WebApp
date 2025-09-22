# GeoSensePlusWebApp
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

### Local Development with .NET Core WebAPI Backend

For local development, the application is configured to proxy API requests to a .NET Core WebAPI backend.

**Proxy Configuration:**
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

**Backend Requirements:**
- .NET Core WebAPI should run on `https://localhost:5001`
- API endpoints should match the paths defined in the State Directory HTTP service
- SSL certificate should be trusted for local development

**Running the Application:**
1. Start your .NET Core WebAPI backend on HTTPS port 5001
2. Run `pnpm start` to start the Angular development server
3. API requests will be automatically proxied to your backend

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

