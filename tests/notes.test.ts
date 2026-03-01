import test from 'node:test';
import assert from 'node:assert/strict';
import { createNote, listNotes, resetNotes } from '../src/index.js';
import { server } from '../src/server.js';

test('createNote creates a note', () => {
  resetNotes();
  const note = createNote({ title: 'Idea', body: 'Ship faster', tags: ['build'] });
  assert.equal(note.title, 'Idea');
  assert.equal(note.body, 'Ship faster');
  assert.deepEqual(note.tags, ['build']);
});

test('listNotes returns newest first', async () => {
  resetNotes();
  const first = createNote({ title: 'First', body: 'A', tags: ['x'] });
  await new Promise((r) => setTimeout(r, 5));
  const second = createNote({ title: 'Second', body: 'B', tags: ['y'] });

  const listed = listNotes();
  assert.equal(listed[0].id, second.id);
  assert.equal(listed[1].id, first.id);
});

test('listNotes filters by tag', () => {
  resetNotes();
  createNote({ title: 'One', body: 'A', tags: ['idea'] });
  createNote({ title: 'Two', body: 'B', tags: ['ops'] });

  const ideaNotes = listNotes('idea');
  assert.equal(ideaNotes.length, 1);
  assert.equal(ideaNotes[0].title, 'One');
});

test('Integration tests', async (t) => {
  let baseUrl: string;

  t.before(() => {
    return new Promise((resolve) => {
      server.listen(0, () => {
        const address = server.address();
        if (address && typeof address === 'object') {
          baseUrl = `http://localhost:${address.port}`;
        }
        resolve();
      });
    });
  });

  t.after(() => {
    return new Promise((resolve) => {
      server.close(() => resolve());
    });
  });

  await t.test('GET /health returns 200 OK', async () => {
    const res = await fetch(`${baseUrl}/health`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.deepEqual(body, { ok: true });
  });

  await t.test('POST /_reset clears notes', async () => {
    createNote({ title: 'To be cleared', body: '...' });
    const resetRes = await fetch(`${baseUrl}/_reset`, { method: 'POST' });
    assert.equal(resetRes.status, 200);
    const resetBody = await resetRes.json();
    assert.deepEqual(resetBody, { ok: true });

    const notesRes = await fetch(`${baseUrl}/notes`);
    const notesBody = await notesRes.json();
    assert.equal(notesBody.notes.length, 0);
  });

  await t.test('POST /_reset forbidden in production', async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    try {
      const resetRes = await fetch(`${baseUrl}/_reset`, { method: 'POST' });
      assert.equal(resetRes.status, 403);
      const resetBody = await resetRes.json();
      assert.deepEqual(resetBody, { error: 'forbidden in production' });
    } finally {
      process.env.NODE_ENV = originalEnv;
    }
  });

  await t.test('POST /notes handles valid payload', async () => {
    await fetch(`${baseUrl}/_reset`, { method: 'POST' });
    const res = await fetch(`${baseUrl}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Integration', body: 'Test body', tags: ['testing'] })
    });
    assert.equal(res.status, 201);
    const body = await res.json();
    assert.equal(body.note.title, 'Integration');
    assert.equal(body.note.body, 'Test body');
    assert.deepEqual(body.note.tags, ['testing']);
  });

  await t.test('GET /notes returns 200 and notes', async () => {
    const res = await fetch(`${baseUrl}/notes`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.notes.length, 1);
    assert.equal(body.notes[0].title, 'Integration');
  });

  await t.test('POST /notes handles bad JSON payload', async () => {
    const res = await fetch(`${baseUrl}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{ bad json'
    });
    assert.equal(res.status, 400);
    const body = await res.json();
    assert.deepEqual(body, { error: 'Invalid JSON payload' });
  });

  await t.test('POST /notes handles invalid object payload', async () => {
    const res = await fetch(`${baseUrl}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(['array not object'])
    });
    assert.equal(res.status, 400);
    const body = await res.json();
    assert.deepEqual(body, { error: 'Payload must be a JSON object' });
  });

  await t.test('POST /notes handles validation error (missing title)', async () => {
    const res = await fetch(`${baseUrl}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: 'Test body' })
    });
    assert.equal(res.status, 400);
    const body = await res.json();
    assert.deepEqual(body, { error: 'title is required' });
  });

  await t.test('Unknown route returns 404', async () => {
    const res = await fetch(`${baseUrl}/unknown`);
    assert.equal(res.status, 404);
    const body = await res.json();
    assert.deepEqual(body, { error: 'not found' });
  });
});
