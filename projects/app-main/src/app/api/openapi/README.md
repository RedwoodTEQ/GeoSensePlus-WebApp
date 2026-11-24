# OpenAPI spec — gsp-server.json

- Downloaded from the backend's swagger endpoint (needs the server running; see
  `docs/README.md`). 
  
  The highest openapi version that openapi-generator (7.x) can parse is `3.1`,
  so if the backend emits OpenAPI `3.2`, need to manually change the openapi version
  in `gsp-server.json` to `3.1.0`.

- The generated files are in folder `generated/`.

## Known wart

Integer path/query params are emitted as `"type": ["integer", "string"]` unions,
so the generator types them as one shared empty interface — `id`-style params
accept any non-null value. Runtime serialization is correct; the proper fix
belongs in the backend's spec export (`"type": "integer"`).
