const express = require('express');

const app = express();
app.use(express.json());

const notes = [];
const requestLogs = [];
const timingLogs = [];
let nextNoteId = 1;
let nextRequestNumber = 1;

function generateRequestId() {
  return `req-${nextRequestNumber++}`;
}

function resetState() {
  notes.length = 0;
  requestLogs.length = 0;
  timingLogs.length = 0;
  nextNoteId = 1;
  nextRequestNumber = 1;
  notes.push(
    { id: 1, text: 'Pack charger' },
    { id: 2, text: 'Review routing notes' }
  );
  nextNoteId = 3;
}
resetState();

function attachRequestId(req, res, next) {
  req.id = generateRequestId();
  res.setHeader('X-Request-Id', req.id);
  next();
}

function logger(req, res, next) {
  res.on('finish', () => {
    const prefix = req.id ? `[${req.id}] ` : '';
    requestLogs.push(`${prefix}${req.method} ${req.path} ${res.statusCode}`);
  });
  next();
}

function timing(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {
    const prefix = req.id ? `[${req.id}] ` : '';
    const duration = Date.now() - start;
    timingLogs.push(`${prefix}${req.method} ${req.path} took ${duration}ms`);
  });
  next();
}

function requireWriteAccess(req, res, next) {
  if (req.header('x-write-key') !== 'allow-write') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

app.use(attachRequestId);
app.use(logger);
app.use(timing);

app.get('/notes', (req, res) => {
  res.json({ data: notes });
});

app.post('/notes', requireWriteAccess, (req, res) => {
  const text = typeof req.body.text === 'string' ? req.body.text.trim() : '';
  if (!text) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const note = { id: nextNoteId++, text };
  notes.push(note);
  res.status(201).json({ data: note });
});

app.get('/traces', (req, res) => {
  res.json({ data: { requestLogs, timingLogs } });
});

module.exports = { app, notes, requestLogs, timingLogs, attachRequestId, logger, timing, requireWriteAccess, generateRequestId, resetState };
