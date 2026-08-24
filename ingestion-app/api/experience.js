'use strict';
const express = require('express');
const router = express.Router();
const db = require('../db/database');

router.get('/', (req, res) => res.json(db.experience.getAll()));

router.post('/', (req, res) => {
  const entry = db.experience.create(req.body);
  res.status(201).json(entry);
});

router.put('/:id', (req, res) => {
  const entry = db.experience.update(req.params.id, req.body);
  if (!entry) return res.status(404).json({ error: 'Not found' });
  res.json(entry);
});

router.delete('/:id', (req, res) => {
  db.experience.delete(req.params.id);
  res.status(204).end();
});

module.exports = router;
