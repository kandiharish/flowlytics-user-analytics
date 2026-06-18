const eventService = require('../services/eventService');

class HeatmapController {
  async getHeatmap(req, res, next) {
    try {
      const { pageUrl } = req.query;
      if (!pageUrl) {
        return res.status(400).json({ error: 'pageUrl query parameter is required' });
      }
      
      const heatmapData = await eventService.getHeatmapData(pageUrl);
      res.json(heatmapData);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new HeatmapController();
