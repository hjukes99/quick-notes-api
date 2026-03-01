import { createServer } from 'node:http';
import { createNote, listNotes, resetNotes } from './index.js';

export const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost');

  const method = req.method;
  const pathname = url.pathname;

  if (method === 'GET' && pathname === '/health') {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  if (method === 'POST' && pathname === '/_reset') {
    if (process.env.NODE_ENV === 'production') {
      res.writeHead(403, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ error: 'forbidden in production' }));
      return;
    }
    resetNotes();
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  if (method === 'GET' && pathname === '/notes') {
    const tag = url.searchParams.get('tag') ?? undefined;
    const allNotes = listNotes(tag);
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ notes: allNotes }));
    return;
  }

  if (method === 'POST' && pathname === '/notes') {
    let body = '';
    for await (const chunk of req) {
      body += chunk;
    }

    let payload;
    try {
      payload = JSON.parse(body || '{}');
    } catch (error) {
      res.writeHead(400, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
      return;
    }

    if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
      res.writeHead(400, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ error: 'Payload must be a JSON object' }));
      return;
    }

    try {
      const newNote = createNote(payload);
      res.writeHead(201, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ note: newNote }));
    } catch (error) {
      res.writeHead(400, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ error: (error as Error).message }));
    }
    return;
  }

  res.writeHead(404, { 'content-type': 'application/json' });
  res.end(JSON.stringify({ error: 'not found' }));
});

if (import.meta.url === `file://${process.argv[1]}`) {
  const port = Number(process.env.PORT || 3000);
  server.listen(port, () => {
    console.log(`quick-notes-api listening on :${port}`);
  });
}
