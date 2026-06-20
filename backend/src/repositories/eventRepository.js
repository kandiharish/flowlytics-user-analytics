const Event = require('../models/Event');

class EventRepository {
  async create(eventData) {
    const event = new Event(eventData);
    return await event.save();
  }

  async findSessions(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    
    // First, get the total count for pagination metadata
    const totalSessionsData = await Event.aggregate([
      { $group: { _id: '$sessionId' } },
      { $count: 'total' }
    ]);
    const totalSessions = totalSessionsData.length > 0 ? totalSessionsData[0].total : 0;

    const sessions = await Event.aggregate([
      {
        $group: {
          _id: '$sessionId',
          eventCount: { $sum: 1 },
          pageViews: { $sum: { $cond: [{ $eq: ['$eventType', 'page_view'] }, 1, 0] } },
          clicks: { $sum: { $cond: [{ $eq: ['$eventType', 'click'] }, 1, 0] } },
          firstEventAt: { $min: '$timestamp' },
          lastEventAt: { $max: '$timestamp' }
        }
      },
      {
        $project: {
          sessionId: '$_id',
          eventCount: 1,
          pageViews: 1,
          clicks: 1,
          firstEventAt: 1,
          lastEventAt: 1,
          durationMs: { $subtract: ['$lastEventAt', '$firstEventAt'] },
          _id: 0
        }
      },
      { $sort: { lastEventAt: -1 } },
      { $skip: skip },
      { $limit: parseInt(limit, 10) }
    ]);

    return { sessions, total: totalSessions, page: parseInt(page, 10), totalPages: Math.ceil(totalSessions / limit) };
  }

  async findEventsBySessionId(sessionId) {
    return await Event.find({ sessionId }).sort({ timestamp: 1 });
  }

  async findClickEventsByPageUrl(pageUrl) {
    // Instead of fetching all events to Node.js, we group by rounded coordinates directly in DB
    return await Event.aggregate([
      { $match: { pageUrl, eventType: 'click', 'metadata.x': { $exists: true }, 'metadata.y': { $exists: true } } },
      {
        $group: {
          _id: {
            x: { $round: ['$metadata.x', 0] },
            y: { $round: ['$metadata.y', 0] }
          },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          x: '$_id.x',
          y: '$_id.y',
          count: 1,
          _id: 0
        }
      }
    ]);
  }
}

module.exports = new EventRepository();
