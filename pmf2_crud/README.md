## Problem Statement

TaskSlate keeps a list of tasks for a shared workspace. The route structure already exists and the in-memory store is already seeded, but the handlers are incomplete. The API cannot yet reliably list tasks, create a new task, fetch one by id, replace a task, partially update a task, or delete a task safely.

Make the API work by completing the single resource file. The data lives in a plain in-memory store that is re-seeded before every run.

## The Contract

Status codes: `201` create, `200` read or update, `400` bad input, `404` missing, `204` delete.

Success responds with `{ data: <payload> }` and errors respond with `{ error: "<safe string>" }`.

## Files to Edit

You change **one file only**:

1. `index.js` holds the in-memory tray and all five route handlers.

Do not edit `spec.js` or `package.json`.

## Routes

| Method | Path         | Behaviour |
|--------|--------------|-----------|
| GET    | `/tasks`     | `200 { data: [...] }` |
| POST   | `/tasks`     | validate → `201 { data }` / `400 { error }` |
| GET    | `/tasks/:id` | found `200` / missing `404` |
| PUT    | `/tasks/:id` | replace fields → `200 { data }` / `400` / `404` |
| PATCH  | `/tasks/:id` | partial update → `200 { data }` / `400` / `404` |
| DELETE | `/tasks/:id` | `204` no body / missing `404` |

## Input / Output Examples

```javascript
// POST /tasks    { "title": "Ship report", "status": "done", "assignee": "Nia" }
//   -> 201  { "data": { "id": 3, "title": "Ship report", "status": "done", "assignee": "Nia" } }

// GET /tasks/1
//   -> 200  { "data": { "id": 1, "title": "Prepare deck", "status": "todo", "assignee": "Asha" } }

// GET /tasks/999
//   -> 404  { "error": "Task not found" }

// DELETE /tasks/1
//   -> 204  (empty body)
```

## Test Cases and Marks Distribution

*(10 tests × 2 marks = 20 marks)*

1. **GET all tasks:** `200` with the seeded tasks inside `{ data }`.
2. **POST validation:** invalid create input returns `400 { error }`.
3. **POST create:** valid body returns `201 { data }` with a generated id.
4. **GET by id:** existing id returns `200 { data }`.
5. **GET missing → 404:** unknown id returns `404 { error }`.
6. **PUT replace:** full replacement returns `200 { data }`.
7. **PUT validation:** invalid replacement input returns `400 { error }`.
8. **PATCH partial update:** valid partial update returns `200 { data }`.
9. **DELETE existing:** existing id returns `204` and removes the task.
10. **DELETE missing:** unknown id returns `404 { error }`.

## How to Test Your Solution

1. Open the terminal.
2. Run `npm install`.
3. Run `npm test`.
4. All ten tests fail initially. Use the feedback to complete `index.js` until every test passes.
