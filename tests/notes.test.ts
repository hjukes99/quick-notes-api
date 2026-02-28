import test from 'node:test';
import assert from 'node:assert/strict';
import { createNote, listNotes, resetNotes } from '../src/index.js';

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
