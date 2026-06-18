const Event = require('../models/Event');

class EventRepository {
  async create(eventData) {
    const event = new Event(eventData);
    return await event.save();
  }

  async findSessions() {
    return await Event.aggregate([
      {
        $group: {
          _id: '$sessionId',
          eventCount: { $sum: 1 },
          firstEventAt: { $min: '$timestamp' },
          lastEventAt: { $max: '$timestamp' }
        }
      },
      {
        $project: {
          sessionId: '$_id',
          eventCount: 1,
          firstEventAt: 1,
          lastEventAt: 1,
          durationMs: { $subtract: ['$lastEventAt', '$firstEventAt'] },
          _id: 0
        }
      },
      { $sort: { lastEventAt: -1 } }
    ]);
  }

  async findEventsBySessionId(sessionId) {
    return await Event.find({ sessionId }).sort({ timestamp: 1 });
  }

  async findClickEventsByPageUrl(pageUrl) {
    return await Event.find({ pageUrl, eventType: 'click' });
  }
}

module.exports = new EventRepository();
