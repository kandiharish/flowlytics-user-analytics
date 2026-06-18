const express = require('express');
const router = express.Router();
const sessionsController = require('../controllers/sessionsController');

router.get('/', sessionsController.getSessions);
router.get('/:sessionId', sessionsController.getSessionEvents);

module.exports = router;
