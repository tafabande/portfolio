'use strict';
const express = require('express');
const router = express.Router();
const db = require('../db/database');

router.get('/', (req, res) => res.json(db.skills.getAll()));

router.post('/', (req, res) => {
  if (!req.body.name) return res.status(400).json({ error: 'name required' });
  const entry = db.skills.create(req.body);
  res.status(201).json(entry);
});

router.delete('/:id', (req, res) => {
  db.skills.delete(req.params.id);
  res.status(204).end();
});

module.exports = router;
