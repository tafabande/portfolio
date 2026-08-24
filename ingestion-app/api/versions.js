'use strict';
const express = require('express');
const router  = express.Router();
const db      = require('../db/database');

// GET /api/versions — list version history
router.get('/', (req, res) => {
  res.json(db.versions.getAll());
});

// GET /api/versions/:id — get specific version details
router.get('/:id', (req, res) => {
  const ver = db.versions.getById(req.params.id);
  if (!ver) return res.status(404).json({ error: 'Version not found' });
  res.json(ver);
});

// POST /api/versions/:id/rollback — rollback to version
router.post('/:id/rollback', (req, res) => {
  try {
    const rolled = db.versions.rollback(req.params.id);
    res.json({ success: true, version: rolled });
  } catch (err) {
    res.status(500).json({ error: 'Rollback failed', detail: err.message });
  }
});

module.exports = router;
