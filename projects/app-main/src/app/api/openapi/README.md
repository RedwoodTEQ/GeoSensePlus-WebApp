# OpenAPI spec — gsp-server.json

- Downloaded from the backend's swagger endpoint (needs the server running; see
  `docs/README.md`). The backend emits OpenAPI **3.2.0**, which openapi-generator
  (7.x) cannot parse — the `openapi` field is downgraded to **3.1.0** in this
  file. JSON can't hold comments, hence this README.
- **After re-exporting the spec:** set `"openapi"` back to `"3.1.0"` (the spec
  uses nothing 3.2-specific), then regenerate: `pnpm run generate:api`.
- Output lands in `generated/` (checked in to git — don't hand-edit; usage notes
  live in `generated/README.md`).

## Known wart

Integer path/query params are emitted as `"type": ["integer", "string"]` unions,
so the generator types them as one shared empty interface — `id`-style params
accept any non-null value. Runtime serialization is correct; the proper fix
belongs in the backend's spec export (`"type": "integer"`).
