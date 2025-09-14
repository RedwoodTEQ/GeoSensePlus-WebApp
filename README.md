# GeoSensePlusWebApp
## Workspace/Project Generation

Angular version: v20.1.4.

Config choice when generating app-main:
- use zone.js
- use SCSS

Use angular's own workspace as monorepo approach.

## Projects

Current project list in the workspace:

- app-main: application for the core GeoSense+ functionalities, which include:
  - uns (aka. state directory)
  - position engine
- lib-ui: wrapper components for angular material
- lib-core: non-component, reusable frontend logics

There could be more apps in the future, some might be experimental and will be eventually
merged into app-main.

## Claude Code
### Slash Commands

- Use `/commands` to update the existing commands and propose new ones

  Example of /commands
  ```
  /commands I want /act to always pull context from PLAN.md.
  ```

- Develop with `/plan`, then `/act`, then `/review` and back to `/plan`