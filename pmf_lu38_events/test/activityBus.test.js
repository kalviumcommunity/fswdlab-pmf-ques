const test = require('node:test');
const assert = require('node:assert/strict');
const { ActivityBus, wireActivityHandlers } = require('../index');

test('1. publish rejects blank event names and missing payload', () => {
  const bus = new ActivityBus();
  assert.throws(() => bus.publish('', { id: 'p1' }), /eventName/);
  assert.throws(() => bus.publish('post:created'), /payload/);
});

test('2. publish sends event name', () => {
  const bus = new ActivityBus(); let event;
  bus.on('post:created', received => { event = received; });
  bus.publish('post:created', { id: 'p1' });
  assert.equal(event.name, 'post:created');
});

test('3. publish preserves payload exactly', () => {
  const bus = new ActivityBus(); const payload = { id: 'p1', authorId: 'maya' }; let event;
  bus.on('post:created', received => { event = received; });
  bus.publish('post:created', payload);
  assert.equal(event.payload, payload);
});

test('4. publish adds numeric occurredAt timestamp', () => {
  const bus = new ActivityBus(); let event;
  bus.on('post:created', received => { event = received; });
  bus.publish('post:created', { id: 'p1' });
  assert.equal(typeof event.occurredAt, 'number');
});

test('5. persistent subscribers receive every matching event', () => {
  const bus = new ActivityBus(); const ids = [];
  bus.subscribe('post:created', event => ids.push(event.payload.id));
  bus.publish('post:created', { id: 'p1' }); bus.publish('post:created', { id: 'p2' });
  assert.deepEqual(ids, ['p1', 'p2']);
});

test('6. multiple subscribers run in registration order', () => {
  const bus = new ActivityBus(); const order = [];
  bus.subscribe('post:created', () => order.push('audit'));
  bus.subscribe('post:created', () => order.push('notify'));
  bus.publish('post:created', { id: 'p1' });
  assert.deepEqual(order, ['audit', 'notify']);
});

test('7. unsubscribe removes exact listener and is safe twice', () => {
  const bus = new ActivityBus(); let calls = 0;
  const stop = bus.subscribe('post:created', () => { calls += 1; });
  bus.publish('post:created', { id: 'p1' }); stop(); stop(); bus.publish('post:created', { id: 'p2' });
  assert.equal(calls, 1);
});

test('8. once subscriber receives only first matching event', () => {
  const bus = new ActivityBus(); const ids = [];
  bus.subscribeOnce('post:created', event => ids.push(event.payload.id));
  bus.publish('post:created', { id: 'p1' }); bus.publish('post:created', { id: 'p2' });
  assert.deepEqual(ids, ['p1']);
});

test('9. event names are isolated', () => {
  const bus = new ActivityBus(); let calls = 0;
  bus.subscribe('post:created', () => { calls += 1; });
  bus.publish('post:liked', { id: 'p1' });
  assert.equal(calls, 0);
});

test('10. handlers create ordered effects and cleanup stops both', () => {
  const bus = new ActivityBus(); const effects = []; const cleanup = wireActivityHandlers(bus, effects);
  bus.publish('post:created', { id: 'p7', authorId: 'zo' }); cleanup();
  bus.publish('post:created', { id: 'p8', authorId: 'li' });
  assert.deepEqual(effects, ['audit:p7', 'notify:zo']);
});
