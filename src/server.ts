import { createServer } from 'node:http';
import { createNote, listNotes } from './index.js';

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost');

  if (req.method === 'GET' && url.pathname === '/health') {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  if (req.method === 'GET' && url.pathname === '/notes') {
    const tag = url.searchParams.get('tag') ?? undefined;
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ notes: listNotes(tag) }));
    return;
  }

  if (req.method === 'POST' && url.pathname === '/notes') {
    let body = '';
    for await (const chunk of req) body += chunk;

    try {
      const payload = JSON.parse(body || '{}');
      const note = createNote(payload);
      res.writeHead(201, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ note }));
    } catch (error) {
      res.writeHead(400, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ error: (error as Error).message }));
    }
    return;
  }

  res.writeHead(404, { 'content-type': 'application/json' });
  res.end(JSON.stringify({ error: 'not found' }));
});

const port = Number(process.env.PORT || 3000);
server.listen(port, () => {
  console.log(`quick-notes-api listening on :${port}`);
});
