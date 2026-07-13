# Question 3 — Node.js Express: Safe Error Flow

## Problem Statement

You are building **ParcelPad**, a small shipment API. The route handlers already perform basic work, but the error flow is badly designed. Known errors and unexpected bugs are mixed together, missing routes are not handled cleanly, asynchronous failures do not reliably reach the shared pipeline, and some responses expose internal details that should never reach the client.

Your job is to complete `index.js` so known failures, unknown failures, and missing routes all pass through one safe and predictable error flow.

This PMF is designed to test custom error design, async forwarding, safe fallbacks, and centralised Express error responses.

---

## Files to Edit

- `index.js`: **This is the only file you need to modify.**

---

## Tasks

1. Complete the custom error class setup.
2. Store the status code for known application errors.
3. Mark known application errors as operational.
4. Complete the wrapper that returns middleware.
5. Complete the logic that forwards rejected async work.
6. Complete the creation of the not-found application error.
7. Complete the not-found message so it uses the requested URL.
8. Complete the branch for operational application errors.
9. Complete the generic safe fallback for unexpected failures.
10. Complete the final response shape so no internal details leak.

---

## Input / Output Examples

```javascript
// Known application error
// -> preserve intended status and safe message

// Missing route
// -> becomes a 404 through the shared error pipeline

// Unexpected internal failure
// -> becomes a safe 500 response without leaking internals
```

---

## How to Run

1. Open the terminal in this folder.
2. Run `npm install`.
3. Run `npm test`.
4. Complete the `FIX` markers in `index.js`.
5. Run `npm test` again until all tests pass.
