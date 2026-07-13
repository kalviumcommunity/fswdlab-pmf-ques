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

function normalizeTaskInput(body) {
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const assignee = typeof body.assignee === 'string' ? body.assignee.trim() : '';
  const status = body.status;
  const validStatuses = ['todo', 'doing', 'done'];
  return {
    title,
    assignee,
    status,
    isValid: !!title && !!assignee && validStatuses.includes(status),
    validStatuses,
  };
}

app.get('/tasks', (req, res) => {
  res.json({ data: tasks });
});

app.post('/tasks', (req, res) => {
  const parsed = normalizeTaskInput(req.body);
  if (!parsed.isValid) {
    return res.status(400).json({ error: 'valid title, status, and assignee are required' });
  }
  const task = { id: nextId++, title: parsed.title, status: parsed.status, assignee: parsed.assignee };
  tasks.push(task);
  res.status(201).json({ data: task });
});

app.get('/tasks/:id', (req, res) => {
  const task = tasks.find((t) => t.id === parseInt(req.params.id, 10));
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json({ data: task });
});

app.put('/tasks/:id', (req, res) => {
  const task = tasks.find((t) => t.id === parseInt(req.params.id, 10));
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  const parsed = normalizeTaskInput(req.body);
  if (!parsed.isValid) {
    return res.status(400).json({ error: 'valid title, status, and assignee are required' });
  }
  task.title = parsed.title;
  task.status = parsed.status;
  task.assignee = parsed.assignee;
  res.json({ data: task });
});

app.patch('/tasks/:id', (req, res) => {
  const task = tasks.find((t) => t.id === parseInt(req.params.id, 10));
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  const validStatuses = ['todo', 'doing', 'done'];
  if ('title' in req.body) {
    const title = typeof req.body.title === 'string' ? req.body.title.trim() : '';
    if (!title) return res.status(400).json({ error: 'invalid partial update' });
    task.title = title;
  }
  if ('assignee' in req.body) {
    const assignee = typeof req.body.assignee === 'string' ? req.body.assignee.trim() : '';
    if (!assignee) return res.status(400).json({ error: 'invalid partial update' });
    task.assignee = assignee;
  }
  if ('status' in req.body) {
    if (!validStatuses.includes(req.body.status)) {
      return res.status(400).json({ error: 'invalid partial update' });
    }
    task.status = req.body.status;
  }
  res.json({ data: task });
});

app.delete('/tasks/:id', (req, res) => {
  const index = tasks.findIndex((t) => t.id === parseInt(req.params.id, 10));
  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  tasks.splice(index, 1);
  res.status(204).end();
});

module.exports = { app, tasks, resetState };
