# SnapNote: Request Tracing Pipeline

## Difficulty

Medium.

## Problem Statement

SnapNote tracks notes and request traces. Every request should receive a unique request id, request logs should record the method, path, and final status, timing logs should record how long each request took, and the write route should be protected by a header-based guard.

The route wiring exists, but the tracing pipeline is incomplete. Make the API work by completing the single source file. The data lives in plain in-memory stores that are re-seeded before every run.

## The Contract

Status codes: `201` create, `200` read, `401` unauthorized.

Success responds with `{ data: <payload> }` and errors respond with `{ error: "<safe string>" }`.

Every request must receive an `X-Request-Id` response header. The global middleware must run in the correct order so later middleware can read the request id. The write route should allow creation only when the required header is present.

## Files to Edit

You change **one file only**:

1. `index.js` holds the in-memory stores, the tracing middleware, and the route handlers.

Do not edit `spec.js` or `package.json`.

## Routes

| Method | Path      | Behaviour |
|--------|-----------|-----------|
| GET    | `/notes`  | `200 { data: [...] }` |
| POST   | `/notes`  | guarded create → `201 { data }` / `401 { error }` |
| GET    | `/traces` | `200 { data: { requestLogs, timingLogs } }` |

## Input / Output Examples

```javascript
// GET /notes
//   -> 200  { "data": [ { "id": 1, "text": "Pack charger" }, ... ] }

// POST /notes with x-write-key: allow-write and { "text": "New note" }
//   -> 201  { "data": { "id": 3, "text": "New note" } }

// POST /notes without the required header
//   -> 401  { "error": "Unauthorized" }

// GET /traces
//   -> 200  { "data": { "requestLogs": [ ... ], "timingLogs": [ ... ] } }
```

## Test Cases and Marks Distribution

*(10 tests × 2 marks = 20 marks)*

1. **Request id on req:** a generated id is attached to the request object.
2. **Request id header:** the same id is returned in `X-Request-Id`.
3. **Logger status line:** logger records method, path, and final status.
4. **Logger request id:** logger includes the request id in the log line.
5. **Timing finish hook:** timing records a duration entry after the response finishes.
6. **Timing request id:** timing includes the request id in the timing line.
7. **Guard failure:** missing or wrong write header blocks create requests with `401`.
8. **Global pipeline order:** normal read requests are traced correctly through the full pipeline.
9. **Guarded create success:** an authorized write request creates a note successfully.
10. **Trace readout:** `GET /traces` returns both trace stores together.

## How to Test Your Solution

1. Open the terminal.
2. Run `npm install`.
3. Run `npm test`.
4. All ten tests fail initially. Use the feedback to complete `index.js` until every test passes.
