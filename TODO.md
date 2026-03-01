# TODO (next 24h)

1. [x] Wire HTTP server routes to note store functions (`POST /notes`, `GET /notes`, `GET /health`).
2. [x] Add request validation + clear 400 responses for bad payloads.
3. [x] Add integration tests for route behavior (status codes + JSON payloads).
4. Add lightweight in-memory reset utility for test isolation.
5. Add npm script for `npm run dev` with live reload.
6. Add OpenAPI-ish endpoint docs in README examples.
7. Add simple pagination support (`limit`, `offset`) for `GET /notes`.
8. Add tag normalization (trim/lowercase/dedupe).
9. Add smoke test script for Docker container startup.
