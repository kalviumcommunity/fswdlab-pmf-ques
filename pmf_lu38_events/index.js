const { ActivityBus } = require('./src/events/activityBus');
const { wireActivityHandlers } = require('./src/handlers/activityHandlers');

module.exports = { ActivityBus, wireActivityHandlers };
