const eventService = require('../services/eventService');

class SessionsController {
  async getSessions(req, res, next) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const result = await eventService.getSessions(page, limit);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getSessionEvents(req, res, next) {
    try {
      const { sessionId } = req.params;
      const events = await eventService.getSessionEvents(sessionId);
      res.json(events);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SessionsController();
