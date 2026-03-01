export interface NoteInput {
  title: string;
  body: string;
  tags?: string[];
}

export interface Note {
  id: string;
  title: string;
  body: string;
  tags: string[];
  createdAt: string;
}

const notes: Note[] = [];

export function createNote(input: NoteInput): Note {
  if (!input.title) throw new Error('title is required');
  if (typeof input.title !== 'string') throw new Error('title must be a string');
  if (!input.title.trim()) throw new Error('title is required');
  
  if (!input.body) throw new Error('body is required');
  if (typeof input.body !== 'string') throw new Error('body must be a string');
  if (!input.body.trim()) throw new Error('body is required');

  if (input.tags !== undefined) {
    if (!Array.isArray(input.tags)) throw new Error('tags must be an array of strings');
    if (!input.tags.every(t => typeof t === 'string')) throw new Error('tags must be an array of strings');
  }

  const note: Note = {
    id: `note_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    title: input.title.trim(),
    body: input.body.trim(),
    tags: (input.tags ?? []).map((t) => t.trim()).filter(Boolean),
    createdAt: new Date().toISOString()
  };

  notes.unshift(note);
  return note;
}

export function listNotes(tag?: string, limit?: number, offset?: number): Note[] {
  let filteredNotes = notes;
  if (tag) {
    const normalized = tag.trim().toLowerCase();
    filteredNotes = notes.filter((n) => n.tags.some((t) => t.toLowerCase() === normalized));
  }
  
  const start = offset ?? 0;
  const end = limit !== undefined ? start + limit : undefined;
  
  return filteredNotes.slice(start, end);
}

export function resetNotes(): void {
  notes.length = 0;
}
