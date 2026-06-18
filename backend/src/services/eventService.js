const eventRepository = require('../repositories/eventRepository');

class EventService {
  async processEvent(eventData) {
    if (!eventData.sessionId || !eventData.eventType || !eventData.pageUrl) {
      throw new Error('Missing required fields');
    }
    return await eventRepository.create(eventData);
  }

  async getSessions() {
    return await eventRepository.findSessions();
  }

  async getSessionEvents(sessionId) {
    return await eventRepository.findEventsBySessionId(sessionId);
  }

  async getHeatmapData(pageUrl) {
    const events = await eventRepository.findClickEventsByPageUrl(pageUrl);
    
    // Aggregate coordinates
    const heatmapData = {};
    events.forEach(event => {
      if (event.metadata && event.metadata.x !== undefined && event.metadata.y !== undefined) {
        // Quantize coordinates slightly if desired, using exact for now
        const key = `${Math.round(event.metadata.x)},${Math.round(event.metadata.y)}`;
        if (!heatmapData[key]) {
          heatmapData[key] = { x: Math.round(event.metadata.x), y: Math.round(event.metadata.y), count: 0 };
        }
        heatmapData[key].count += 1;
      }
    });

    return Object.values(heatmapData);
  }
}

module.exports = new EventService();
