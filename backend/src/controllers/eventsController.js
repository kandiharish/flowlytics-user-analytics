const eventService = require('../services/eventService');

class EventsController {
  async createEvent(req, res, next) {
    try {
      const events = Array.isArray(req.body) ? req.body : [req.body];
      
      for (const eventData of events) {
        await eventService.processEvent(eventData);
      }

      res.status(201).json({ message: 'Event(s) logged successfully' });
    } catch (error) {
      if (error.message === 'Missing required fields') {
        return res.status(400).json({ error: error.message });
      }
      next(error);
    }
  }
}

module.exports = new EventsController();
