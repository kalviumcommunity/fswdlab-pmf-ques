# Node.js: Event-Driven Systems — Pulseboard Activity Bus

## Problem Statement

You are building **Pulseboard**, a community app. Creating a post has two independent follow-up actions: write an audit record and notify its author. Calling both from post creation makes producer know every consumer. New consumer, analytics, search indexing, moderation, means changing producer again.

Build small in-process event bus. Producer publishes one fact: `post:created`. Consumers subscribe and react independently. This is publish-subscribe in Node using `EventEmitter`.

---

## Files to Edit

* `src/events/activityBus.js`: event contract and subscription lifecycle.
* `src/handlers/activityHandlers.js`: independent audit/notification consumers.

Do not edit `index.js` or files in `test/`.

---

## Tasks

### 1. Publish a named event

Implement `ActivityBus.publish(eventName, payload)`.

* Reject non-string/blank `eventName` with an `Error` mentioning `eventName`.
* Reject missing (`undefined`) `payload` with an `Error` mentioning `payload`.
* Emit one event object, not several positional arguments:

```javascript
{
  name: 'post:created',
  payload: { id: 'p7', authorId: 'zo' },
  occurredAt: 1710000000000
}
```

* Return the boolean returned by `this.emit(...)`.

### 2. Subscribe and clean up

Implement `subscribe(eventName, listener)`.

* Register persistent listener with `on`.
* Return `unsubscribe()`.
* `unsubscribe()` must remove **that exact listener** with `off`.
* Calling returned function twice must be safe.

### 3. Subscribe once

Implement `subscribeOnce(eventName, listener)`.

* Use `once` so listener receives only first matching event.
* Return safe cleanup function.

### 4. Wire independent consumers

Implement `wireActivityHandlers(bus, effects)`.

For `post:created`, register handlers in this order:

1. Audit handler pushes `audit:<event.payload.id>`.
2. Notification handler pushes `notify:<event.payload.authorId>`.

Return cleanup function removing both. Producer must not know either handler exists.

---

## Input Example

```javascript
const bus = new ActivityBus();
const effects = [];
const cleanup = wireActivityHandlers(bus, effects);

bus.publish('post:created', { id: 'p7', authorId: 'zo' });
// effects -> ['audit:p7', 'notify:zo']

cleanup();
bus.publish('post:created', { id: 'p8', authorId: 'li' });
// effects unchanged
```

## Expected Output Example

```javascript
{
  name: 'post:created',
  payload: { id: 'p7', authorId: 'zo' },
  occurredAt: 1710000000000
}
```

---

## Test Cases and Marks Distribution

*(10 tests × 1 mark = 10 marks)*

1. Blank event name and missing payload are rejected.
2. Published event contains correct `name`.
3. Published event preserves exact `payload`.
4. Published event includes numeric `occurredAt`.
5. Persistent subscriber receives every matching event.
6. Multiple subscribers run in registration order.
7. Unsubscribe removes exact listener; duplicate cleanup is safe.
8. `subscribeOnce` listener receives first matching event only.
9. Different event names are isolated.
10. Audit + notification handlers run in order; cleanup stops both.

> These map to LU behaviours: **emit named event** · **deliver payload** · **fan out to subscribers** · **preserve listener order** · **manage lifecycle with `off`/`once`** · **decouple producer from consumers**.

---

## Success Tips

* `emit()` calls listeners synchronously, in registration order.
* Store listener function reference. `off('x', () => {})` cannot remove different anonymous function.
* Keep event shape stable. Consumers should receive one event object.
* `error` is special in Node; emitting it without listener can crash process. This task uses `post:created`, not `error`.
* An in-process `EventEmitter` is useful inside one Node process. It is not a durable cross-service queue.

---

## How to Test Your Solution

1. Open terminal.
2. Run `npm test`.
3. All 10 tests should pass. Keep tests unchanged.
