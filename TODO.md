# TODO (next 24h)

1. [x] Wire HTTP server routes to note store functions (`POST /notes`, `GET /notes`, `GET /health`).
2. [x] Add request validation + clear 400 responses for bad payloads.
3. [x] Add integration tests for route behavior (status codes + JSON payloads).
4. [x] Add lightweight in-memory reset utility for test isolation.
5. [x] Add npm script for `npm run dev` with live reload.
6. [x] Add OpenAPI-ish endpoint docs in README examples.
7. [x] Add simple pagination support (`limit`, `offset`) for `GET /notes`.
8. [x] Add tag normalization (trim/lowercase/dedupe).
9. [x] Add smoke test script for Docker container startup.
