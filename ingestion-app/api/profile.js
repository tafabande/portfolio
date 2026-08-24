'use strict';
const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET /api/profile
router.get('/', (req, res) => {
  res.json(db.profile.get());
});

// PUT /api/profile
router.put('/', (req, res) => {
  const { first_name, last_name, email, phone, location, bio } = req.body;
  const updated = db.profile.update({ first_name, last_name, email, phone, location, bio });
  res.json(updated);
});

module.exports = router;
