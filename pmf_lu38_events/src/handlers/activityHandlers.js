function wireActivityHandlers(bus, effects) {
  // TODO: subscribe, in this order, to 'post:created'.
  // audit handler -> effects.push(`audit:${event.payload.id}`)
  // notify handler -> effects.push(`notify:${event.payload.authorId}`)
  // Return cleanup fn that unsubscribes both handlers.
}

module.exports = { wireActivityHandlers };
