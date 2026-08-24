'use strict';
const express = require('express');
const router = express.Router();
const db = require('../db/database');

router.get('/', (req, res) => res.json(db.projects.getAll()));

router.post('/', (req, res) => {
  const entry = db.projects.create(req.body);
  res.status(201).json(entry);
});

router.put('/:id', (req, res) => {
  const entry = db.projects.update(req.params.id, req.body);
  if (!entry) return res.status(404).json({ error: 'Not found' });
  res.json(entry);
});

router.delete('/:id', (req, res) => {
  db.projects.delete(req.params.id);
  res.status(204).end();
});

module.exports = router;
