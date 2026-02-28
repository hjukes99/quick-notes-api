# Quick Notes API

A tiny TypeScript + Node API scaffold for creating and listing short notes.

## Stack
- Node.js 20+
- TypeScript
- Native Node HTTP server
- Node test runner + tsx

## Setup
```bash
npm install
```

## Run
```bash
npm run dev
# or
npm run build && npm start
```

## Test
```bash
npm test
```

## Docker
```bash
docker build -t quick-notes-api .
docker run --rm -p 3000:3000 quick-notes-api
```

## API (current scaffold)
- `GET /health` → `{ ok: true }`
- `GET /notes?tag=idea` → list notes
- `POST /notes` with JSON body: `{ "title": "...", "body": "...", "tags": ["..."] }`
