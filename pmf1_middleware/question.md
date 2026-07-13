# Question 1 — Node.js Express: Request Tracing Pipeline

## Problem Statement

You are building **SnapNote**, a small notes API. The route wiring exists, but the request pipeline is incomplete. Requests are not being traced consistently, logs do not capture enough information, timing data is missing, and the write route is not protected by the required guard.

Your job is to complete `index.js` so the API uses a clean middleware pipeline for tracing requests before they reach the route handlers.

This PMF is designed to test middleware structure, registration order, request enrichment, finish-event logging, timing, and short-circuiting on a protected write route.

---

## Files to Edit

- `index.js`: **This is the only file you need to modify.**

---

## Tasks

1. Complete the request-id middleware so every request gets a unique id.
2. Complete the response-header step so the request id is returned to the client.
3. Complete the logger middleware so it records method, path, and final status.
4. Complete the logger middleware so it includes the request id when available.
5. Complete the timing middleware so it measures request duration.
6. Complete the timing middleware so it records the result only after the response finishes.
7. Complete the guard middleware for protected write requests.
8. Complete the global middleware registration order.
9. Complete the write route so the guard runs only where required.
10. Complete the logs route so tracing output can be inspected in the required response shape.

---

## Input / Output Examples

```javascript
// A normal read request
// -> request id attached, logs recorded, timing recorded, successful response sent

// A protected write request with missing guard header
// -> short-circuits with a safe 401 error

// A protected write request with the correct guard header
// -> passes through the pipeline and creates the note
```

---

## How to Run

1. Open the terminal in this folder.
2. Run `npm install`.
3. Run `npm test`.
4. Complete the `FIX` markers in `index.js`.
5. Run `npm test` again until all tests pass.
