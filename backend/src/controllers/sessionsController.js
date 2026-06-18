const eventService = require('../services/eventService');

class SessionsController {
  async getSessions(req, res, next) {
    try {
      const sessions = await eventService.getSessions();
      res.json(sessions);
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
