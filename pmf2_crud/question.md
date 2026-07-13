# Question 2 — Node.js Express: Full CRUD Notes API

## Problem Statement

You are building **TaskSlate**, a small note-tracking API for a shared workspace. The route structure already exists, and the in-memory store is already seeded, but the handlers are incomplete. Right now the API cannot reliably list records, create new ones, fetch one by id, replace existing data, apply a partial update, or delete a record safely.

Your job is to complete `index.js` so the API supports a clean CRUD workflow using the required status codes and response shapes.

This PMF is designed to test request parsing, validation, list handling, resource lookup, full updates, partial updates, deletion, and consistent JSON responses.

---

## Files to Edit

- `index.js`: **This is the only file you need to modify.**

---

## Tasks

1. Complete the route that returns all tasks.
2. Complete the validation for task creation.
3. Complete the task-creation logic.
4. Complete the route that returns one task by id.
5. Complete the missing-task handling for read by id.
6. Complete the route that fully replaces a task.
7. Complete the validation and missing-task handling for full replace.
8. Complete the route that partially updates a task.
9. Complete the route that deletes a task.
10. Complete the missing-task handling for delete.

---

## Input / Output Examples

```javascript
// List tasks
// -> 200 with all tasks wrapped in { data }

// Create task with invalid input
// -> 400 with a safe error message

// Create task with valid input
// -> 201 with created task data

// Missing task id
// -> 404 with a safe error message

// Full replace of an existing task
// -> 200 with updated task data

// Partial update of an existing task
// -> 200 with updated task data

// Delete existing task
// -> 204 with no body
```

---

## How to Run

1. Open the terminal in this folder.
2. Run `npm install`.
3. Run `npm test`.
4. Complete the `FIX` markers in `index.js`.
5. Run `npm test` again until all tests pass.
