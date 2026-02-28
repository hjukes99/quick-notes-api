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
  if (!input.title?.trim()) throw new Error('title is required');
  if (!input.body?.trim()) throw new Error('body is required');

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

export function listNotes(tag?: string): Note[] {
  if (!tag) return [...notes];
  const normalized = tag.trim().toLowerCase();
  return notes.filter((n) => n.tags.some((t) => t.toLowerCase() === normalized));
}

export function resetNotes(): void {
  notes.length = 0;
}
