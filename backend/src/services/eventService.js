const eventRepository = require('../repositories/eventRepository');

class EventService {
  async processEvent(eventData) {
    if (!eventData.sessionId || !eventData.eventType || !eventData.pageUrl) {
      throw new Error('Missing required fields');
    }
    return await eventRepository.create(eventData);
  }

  async getSessions(page, limit) {
    return await eventRepository.findSessions(page, limit);
  }

  async getSessionEvents(sessionId) {
    return await eventRepository.findEventsBySessionId(sessionId);
  }

  async getHeatmapData(pageUrl) {
    // Data is already aggregated by the repository
    const aggregatedData = await eventRepository.findClickEventsByPageUrl(pageUrl);
    return aggregatedData;
  }
}

module.exports = new EventService();
