# OpenAPI spec — gsp-server.json

- The highest openapi version that openapi-generator (7.x) can parse is `3.1`, so
  if the backend emits OpenAPI `3.2`, need to manually change the openapi version
  in `gsp-server.json` to `3.1.0`.

- The generated files are in folder `generated/`.

## Remark - openapi v3.0 is used

The server side has explicitly set the openapi to use version 3.0, otherwise swagger UI
will fail to validate an integer ID number.

## Known wart

For OpenAPI 3.0 and 3.1, integer path/query params are emitted as `"type": ["integer", "string"]`
unions, so `id`-style params accept any non-null value.

The proper fix should be in the backend's spec by exporting (`"type": "integer"`).
