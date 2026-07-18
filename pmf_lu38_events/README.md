# Node.js: Event-Driven Systems — Pulseboard Activity Bus

Pulseboard creates a post, then audit logging and author notification react independently. Build an in-process event bus so post producer publishes one `post:created` fact instead of importing every follow-up service.

## Setup

```bash
npm test
```

## Files to Edit

```text
src/events/activityBus.js        # event contract + subscription lifecycle
src/handlers/activityHandlers.js # independent audit + notification consumers
```

Do not change `index.js` or `test/` files.

## Required Implementation

### `ActivityBus.publish(eventName, payload)`

- Reject blank/non-string event name with an `Error` mentioning `eventName`.
- Reject missing (`undefined`) payload with an `Error` mentioning `payload`.
- Emit one stable event object:

```javascript
{
  name: 'post:created',
  payload: { id: 'p7', authorId: 'zo' },
  occurredAt: Date.now()
}
```

- Return boolean result from `emit`.

### `subscribe(eventName, listener)`

- Register persistent listener using `on`.
- Return `unsubscribe()`.
- Cleanup removes exact listener using `off`.
- Calling cleanup twice must be safe.

### `subscribeOnce(eventName, listener)`

- Register one-time listener with `once`.
- Return safe cleanup function.

### `wireActivityHandlers(bus, effects)`

For `post:created`, register handlers in this order:

1. Audit: `effects.push('audit:' + event.payload.id)`
2. Notification: `effects.push('notify:' + event.payload.authorId)`

Return cleanup function removing both handlers.

## Example

```javascript
const bus = new ActivityBus();
const effects = [];
const cleanup = wireActivityHandlers(bus, effects);

bus.publish('post:created', { id: 'p7', authorId: 'zo' });
// effects: ['audit:p7', 'notify:zo']

cleanup();
bus.publish('post:created', { id: 'p8', authorId: 'li' });
// effects remain unchanged
```

## What Tests Check

10 tests cover validation, event name/payload/timestamp, persistent subscriptions, listener order, unsubscribe, `once`, event isolation, and handler cleanup.

## Tips

- `emit()` calls local listeners synchronously in registration order.
- `off()` needs same listener function reference passed to `on()`.
- `EventEmitter` decouples code within one Node process; it is not a durable cross-service queue.
- Node's `error` event is special: unhandled `error` can crash process.
