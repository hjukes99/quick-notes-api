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

## API Documentation

### `GET /health`
Returns the health status of the API.

**Response**
- `200 OK`
  ```json
  {
    "ok": true
  }
  ```

### `GET /notes`
Retrieves a list of notes.

**Query Parameters**
- `tag` (string, optional): Filter notes by a specific tag.

**Response**
- `200 OK`
  ```json
  {
    "notes": [
      {
        "id": "note_1684343105000_abc123",
        "title": "My first note",
        "body": "This is the body of the note.",
        "tags": ["idea", "test"],
        "createdAt": "2023-05-17T17:05:05.000Z"
      }
    ]
  }
  ```

### `POST /notes`
Creates a new note.

**Request Body** (`application/json`)
- `title` (string, required): The title of the note.
- `body` (string, required): The content of the note.
- `tags` (array of strings, optional): Tags associated with the note.

**Example Request**
```json
{
  "title": "Meeting notes",
  "body": "Discussed the new architecture.",
  "tags": ["work", "meeting"]
}
```

**Responses**
- `201 Created`
  ```json
  {
    "note": {
      "id": "note_1684343105000_abc123",
      "title": "Meeting notes",
      "body": "Discussed the new architecture.",
      "tags": ["work", "meeting"],
      "createdAt": "2023-05-17T17:05:05.000Z"
    }
  }
  ```
- `400 Bad Request`: If the payload is invalid or missing required fields.
  ```json
  {
    "error": "title is required"
  }
  ```

### `POST /_reset`
Clears the in-memory datastore. Useful for test isolation. **Disabled in production.**

**Responses**
- `200 OK`
  ```json
  {
    "ok": true
  }
  ```
- `403 Forbidden`: If called in a production environment (`NODE_ENV=production`).
  ```json
  {
    "error": "forbidden in production"
  }
  ```
