## Problem Statement

ParcelPad needs one safe error pipeline. Known application errors, unexpected bugs, rejected async work, and missing routes should all be handled consistently. Right now that behavior is incomplete.

Make the shared error flow work by completing `index.js`. The tests call the exported pieces directly.

## The Contract

Status codes: an `AppError` uses its own status code; any other error becomes `500`.

Error responses must use `{ error: "<safe string>" }` only.

Operational `AppError` instances should preserve their safe message. Unexpected plain `Error` objects must be hidden behind `Internal Server Error`.

## Files to Edit

You change **one file only**:

1. `index.js` holds the custom error type and all three reusable middleware utilities.

Do not edit `spec.js` or `package.json`.

## Tasks

Complete the shared error flow in `index.js`:

1. Complete the custom `AppError` class setup.
2. Store the status code on `AppError` instances.
3. Mark `AppError` instances as operational.
4. Return middleware from `asyncHandler`.
5. Forward rejected async work to `next`.
6. Create a not-found `AppError`.
7. Build the not-found message using `req.originalUrl`.
8. Handle operational `AppError` cases in the error handler.
9. Handle unknown errors with a safe `500` fallback.
10. Return only the safe `{ error }` response body.

## Input and Output Examples

```javascript
// new AppError('Shipment not found', 404)
//   -> 404  { "error": "Shipment not found" }

// notFoundHandler on /missing
//   -> 404  { "error": "Route not found: /missing" }

// new Error('db password leaked')
//   -> 500  { "error": "Internal Server Error" }
```

## Test Cases and Marks Distribution

*(10 tests × 2 marks = 20 marks)*

1. **Message stored:** `AppError` stores the provided message.
2. **Status stored:** `AppError` stores the provided status code.
3. **Operational flag:** `AppError` marks itself as operational.
4. **Rejected async forwarding:** `asyncHandler` forwards rejected async errors to `next`.
5. **Successful async pass-through:** `asyncHandler` does not call `next` on success.
6. **404 forwarding:** `notFoundHandler` forwards a 404 `AppError`.
7. **Operational response:** `errorHandler` returns an `AppError` status and safe message.
8. **Safe fallback:** `errorHandler` hides plain `Error` messages behind a safe `500`.
9. **No leak:** `errorHandler` returns only the safe `error` field.
10. **End-to-end flow:** async throw → `next` → `errorHandler`.

## How to Test Your Solution

1. Open the terminal.
2. Run `npm install`.
3. Run `npm test`.
4. All ten tests fail initially. Use the feedback to complete `index.js` until every test passes.
