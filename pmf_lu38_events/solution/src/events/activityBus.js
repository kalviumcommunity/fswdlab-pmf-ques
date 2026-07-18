const { EventEmitter } = require('node:events');

class ActivityBus extends EventEmitter {
  publish(eventName, payload) {
    if (typeof eventName !== 'string' || eventName.trim() === '') {
      throw new Error('eventName must be a non-empty string');
    }
    if (payload === undefined) throw new Error('payload is required');
    return this.emit(eventName, { name: eventName, payload, occurredAt: Date.now() });
  }

  subscribe(eventName, listener) {
    this.on(eventName, listener);
    let active = true;
    return () => {
      if (active) { this.off(eventName, listener); active = false; }
    };
  }

  subscribeOnce(eventName, listener) {
    this.once(eventName, listener);
    let active = true;
    return () => {
      if (active) { this.off(eventName, listener); active = false; }
    };
  }
}

module.exports = { ActivityBus };
