const { EventEmitter } = require('node:events');

class ActivityBus extends EventEmitter {
  publish(eventName, payload) {
    // TODO: reject blank/non-string eventName and missing payload.
    // Emit one object: { name: eventName, payload, occurredAt: Date.now() }.
    // Return EventEmitter.emit's boolean result.
  }

  subscribe(eventName, listener) {
    // TODO: register persistent listener.
    // Return idempotent unsubscribe fn removing exact listener.
  }

  subscribeOnce(eventName, listener) {
    // TODO: register listener for next matching event only.
    // Return idempotent unsubscribe fn.
  }
}

module.exports = { ActivityBus };
