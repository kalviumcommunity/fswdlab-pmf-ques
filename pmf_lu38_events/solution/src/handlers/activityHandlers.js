function wireActivityHandlers(bus, effects) {
  const stopAudit = bus.subscribe('post:created', event => {
    effects.push(`audit:${event.payload.id}`);
  });
  const stopNotify = bus.subscribe('post:created', event => {
    effects.push(`notify:${event.payload.authorId}`);
  });
  return () => { stopAudit(); stopNotify(); };
}

module.exports = { wireActivityHandlers };
