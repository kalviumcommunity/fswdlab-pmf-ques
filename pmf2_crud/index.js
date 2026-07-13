/**
 * index.js — the ONLY file you edit.
 *
 * TaskSlate tracks short tasks in an in-memory tray. Everything lives here:
 * the array, the route handlers, and the Express wiring.
 *
 * A task looks like: { id, title, status, assignee }
 *
 * THE CONTRACT
 *   Status codes: 201 create · 200 read/update · 400 bad input · 404 missing · 204 delete.
 *   Success  ->  { data: <payload> }
 *   Error    ->  { error: "<safe string>" }
 *
 * VALIDATION RULES
 *   - title must be a non-empty string after trimming
 *   - status must be one of: 'todo', 'doing', 'done'
 *   - assignee must be a non-empty string after trimming
 *
 * Each unfinished part has a FIX note. Replace each placeholder with the real
 * logic. Do not change route paths, resetState, or exports.
 */

const express = require('express');
const app = express();
app.use(express.json());

const tasks = [];
let nextId = 1;

function resetState() {
  tasks.length = 0;
  nextId = 1;
  tasks.push(
    { id: 1, title: 'Prepare deck', status: 'todo', assignee: 'Asha' },
    { id: 2, title: 'Review API contract', status: 'doing', assignee: 'Kabir' }
  );
  nextId = 3;
}
resetState();

// FIX 1: GET /tasks -> return every task.
app.get('/tasks', (req, res) => {
  res.status(501).json({ error: 'Not implemented' }); // TODO: replace
});

// FIX 2: Validate task creation input.
// FIX 3: POST /tasks -> create and store a new task.
app.post('/tasks', (req, res) => {
  res.status(501).json({ error: 'Not implemented' }); // TODO: replace
});

// FIX 4: GET /tasks/:id -> return the matching task.
// FIX 5: If the task does not exist, return a safe 404 error.
app.get('/tasks/:id', (req, res) => {
  res.status(501).json({ error: 'Not implemented' }); // TODO: replace
});

// FIX 6: PUT /tasks/:id -> fully replace title, status, and assignee.
// FIX 7: If the input is invalid or the task does not exist, return the correct safe error.
app.put('/tasks/:id', (req, res) => {
  res.status(501).json({ error: 'Not implemented' }); // TODO: replace
});

// FIX 8: PATCH /tasks/:id -> partially update only the provided valid fields.
app.patch('/tasks/:id', (req, res) => {
  res.status(501).json({ error: 'Not implemented' }); // TODO: replace
});

// FIX 9: DELETE /tasks/:id -> remove the task and return 204 with no body.
// FIX 10: If the task does not exist, return a safe 404 error.
app.delete('/tasks/:id', (req, res) => {
  res.status(501).json({ error: 'Not implemented' }); // TODO: replace
});

module.exports = { app, tasks, resetState };
