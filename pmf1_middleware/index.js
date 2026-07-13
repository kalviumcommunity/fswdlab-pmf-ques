/**
 * index.js — the ONLY file you edit.
 *
 * SnapNote tracks notes and request traces. Everything lives here: the
 * in-memory stores, custom middleware, route handlers, and Express wiring.
 *
 * A note looks like: { id, text }
 *
 * THE CONTRACT
 *   Status codes: 201 create · 200 read · 401 unauthorized.
 *   Success  ->  { data: <payload> }
 *   Error    ->  { error: "<safe string>" }
 *
 * TRACE STORES
 *   requestLogs stores logger output.
 *   timingLogs  stores timing output.
 *
 * WRITE GUARD
 *   POST /notes requires the header x-write-key: allow-write.
 *
 * Each unfinished part has a FIX note. Replace each placeholder with the real
 * logic. Do not change route paths, helper names, resetState, or exports.
 */

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

// FIX 1: attachRequestId -> add a generated request id to req.
// FIX 2: also return the same id in the X-Request-Id response header.
function attachRequestId(req, res, next) {
  // TODO: replace
}

// FIX 3: logger -> record method, path, and final status code.
// FIX 4: include the request id at the start of the log line when available.
function logger(req, res, next) {
  // TODO: replace
}

// FIX 5: timing -> start measuring when the request enters.
// FIX 6: record the duration only after the response finish event fires.
function timing(req, res, next) {
  // TODO: replace
}

// FIX 7: requireWriteAccess -> block POST /notes unless x-write-key is allow-write.
function requireWriteAccess(req, res, next) {
  // TODO: replace
}

// FIX 8: register the global middleware in the correct order.
//         request id must be available before logger and timing use it.
// TODO: replace

app.get('/notes', (req, res) => {
  res.json({ data: notes });
});

// FIX 9: mount the write guard on this route so only valid write requests create notes.
app.post('/notes', (req, res) => {
  const text = typeof req.body.text === 'string' ? req.body.text.trim() : '';
  if (!text) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const note = { id: nextNoteId++, text };
  notes.push(note);
  res.status(201).json({ data: note });
});

// FIX 10: GET /traces -> return both requestLogs and timingLogs in one success response.
app.get('/traces', (req, res) => {
  res.status(501).json({ error: 'Not implemented' }); // TODO: replace
});

module.exports = { app, notes, requestLogs, timingLogs, attachRequestId, logger, timing, requireWriteAccess, generateRequestId, resetState };
