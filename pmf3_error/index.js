/**
 * index.js — the ONLY file you edit.
 *
 * ParcelPad needs one safe error pipeline. Everything for this PMF lives here:
 * a custom error type and three reusable middleware utilities.
 *
 * THE CONTRACT
 *   Operational AppError -> use its own statusCode and message.
 *   Any other Error      -> 500 { error: 'Internal Server Error' }
 *   Error body           -> { error: '<safe string>' }
 *
 * Each unfinished part has a FIX note. Replace each placeholder with the real
 * logic. Do not change the export names.
 */

// FIX 1: Complete the custom AppError class setup.
// FIX 2: Store the statusCode on AppError instances.
// FIX 3: Mark AppError instances as operational.
class AppError extends Error {
  constructor(message, statusCode) {
    // TODO: replace
  }
}

// FIX 4: Return middleware from asyncHandler.
// FIX 5: Forward rejected async work to next.
function asyncHandler(fn) {
  // TODO: replace
}

// FIX 6: Create a not-found AppError.
// FIX 7: Build the message using req.originalUrl.
function notFoundHandler(req, res, next) {
  // TODO: replace
}

// FIX 8: Handle operational AppError cases.
// FIX 9: Handle unknown errors with a safe 500 fallback.
// FIX 10: Return only the safe { error } response body.
function errorHandler(err, req, res, next) {
  // TODO: replace
}

module.exports = { AppError, asyncHandler, notFoundHandler, errorHandler };
