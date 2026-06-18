const express = require('express');
const cors = require('cors');
const eventsRoutes = require('./routes/eventsRoutes');
const sessionsRoutes = require('./routes/sessionsRoutes');
const heatmapRoutes = require('./routes/heatmapRoutes');
const path = require('path');

const app = express();

app.use(cors()); // Allow all origins for the initial version
app.use(express.json());

// Serve the tracker script statically
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/api/events', eventsRoutes);
app.use('/api/sessions', sessionsRoutes);
app.use('/api/heatmap', heatmapRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;
