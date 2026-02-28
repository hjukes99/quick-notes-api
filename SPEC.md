# SPEC — Quick Notes API

## Idea
A tiny local-first API for capturing short notes with tags and listing/searching them quickly.

## User Story
As a solo builder, I want a dead-simple notes API I can run locally so I can save short snippets and fetch them by tag without opening a full notes app.

## MVP Features
1. Create note (`title`, `body`, optional `tags[]`) with generated id + timestamp.
2. List all notes in memory (newest first).
3. Filter notes by a tag query.
4. Health endpoint.
5. Unit tests for note creation, ordering, and tag filtering.

## Non-goals (today)
- Persistence/database
- Auth
- Deployment
- UI
