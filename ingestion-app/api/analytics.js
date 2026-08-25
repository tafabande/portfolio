'use strict';
const express = require('express');
const router = express.Router();
const db = require('../db/database');

// POST /ping or /event — track portfolio telemetry
const handleTelemetry = (req, res) => {
  const { event_type, target, visitor_id } = req.body || {};
  if (!event_type) return res.status(400).json({ error: 'event_type is required' });

  const result = db.analytics.logEvent({
    event_type,
    target,
    visitor_id: visitor_id || req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    user_agent: req.headers['user-agent'],
    referrer: req.headers['referer'] || req.headers['referrer']
  });

  res.status(201).json(result);
};

router.post('/ping', handleTelemetry);
router.post('/event', handleTelemetry);

// GET /api/analytics/summary — get aggregated metrics for control dashboard
router.get('/summary', (req, res) => {
  res.json(db.analytics.getSummary());
});

module.exports = router;
