const { ActivityBus, wireActivityHandlers } = require('../index');

describe('PMF LU38 - Event-Driven Activity Bus', () => {
  it('1. publish rejects blank event names and missing payload', () => {
    const bus = new ActivityBus();
    expect(() => bus.publish('', { id: 'p1' })).toThrowError(/eventName/);
    expect(() => bus.publish('post:created')).toThrowError(/payload/);
  });

  it('2. publish sends event name', () => {
    const bus = new ActivityBus();
    let event;
    bus.on('post:created', (received) => { event = received; });
    bus.publish('post:created', { id: 'p1' });
    expect(event.name).toBe('post:created');
  });

  it('3. publish preserves payload exactly', () => {
    const bus = new ActivityBus();
    const payload = { id: 'p1', authorId: 'maya' };
    let event;
    bus.on('post:created', (received) => { event = received; });
    bus.publish('post:created', payload);
    expect(event.payload).toBe(payload);
  });

  it('4. publish adds numeric occurredAt timestamp', () => {
    const bus = new ActivityBus();
    let event;
    bus.on('post:created', (received) => { event = received; });
    bus.publish('post:created', { id: 'p1' });
    expect(typeof event.occurredAt).toBe('number');
  });

  it('5. persistent subscribers receive every matching event', () => {
    const bus = new ActivityBus();
    const ids = [];
    bus.subscribe('post:created', (event) => ids.push(event.payload.id));
    bus.publish('post:created', { id: 'p1' });
    bus.publish('post:created', { id: 'p2' });
    expect(ids).toEqual(['p1', 'p2']);
  });

  it('6. multiple subscribers run in registration order', () => {
    const bus = new ActivityBus();
    const order = [];
    bus.subscribe('post:created', () => order.push('audit'));
    bus.subscribe('post:created', () => order.push('notify'));
    bus.publish('post:created', { id: 'p1' });
    expect(order).toEqual(['audit', 'notify']);
  });

  it('7. unsubscribe removes exact listener and is safe twice', () => {
    const bus = new ActivityBus();
    let calls = 0;
    const stop = bus.subscribe('post:created', () => { calls += 1; });
    bus.publish('post:created', { id: 'p1' });
    stop();
    stop();
    bus.publish('post:created', { id: 'p2' });
    expect(calls).toBe(1);
  });

  it('8. once subscriber receives only first matching event', () => {
    const bus = new ActivityBus();
    const ids = [];
    bus.subscribeOnce('post:created', (event) => ids.push(event.payload.id));
    bus.publish('post:created', { id: 'p1' });
    bus.publish('post:created', { id: 'p2' });
    expect(ids).toEqual(['p1']);
  });

  it('9. event names are isolated', () => {
    const bus = new ActivityBus();
    let calls = 0;
    bus.subscribe('post:created', () => { calls += 1; });
    bus.publish('post:liked', { id: 'p1' });
    expect(calls).toBe(0);
  });

  it('10. handlers create ordered effects and cleanup stops both', () => {
    const bus = new ActivityBus();
    const effects = [];
    const cleanup = wireActivityHandlers(bus, effects);
    bus.publish('post:created', { id: 'p7', authorId: 'zo' });
    cleanup();
    bus.publish('post:created', { id: 'p8', authorId: 'li' });
    expect(effects).toEqual(['audit:p7', 'notify:zo']);
  });
});
