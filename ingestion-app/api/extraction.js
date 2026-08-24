'use strict';
const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET /api/extraction-jobs/:id — poll job status
router.get('/:id', (req, res) => {
  const job = db.extractionJobs.getById(req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });

  const response = {
    id: job.id,
    documentId: job.document_id,
    status: job.status,
    method: job.extraction_method,
    retryCount: job.retry_count,
    createdAt: job.created_at,
    updatedAt: job.updated_at,
    errorMessage: job.error_message || null
  };

  // Include extracted data once available
  if (['needs_review','confirmed','synced'].includes(job.status)) {
    try {
      response.profile    = JSON.parse(job.extracted_json || '{}');
      response.confidence = JSON.parse(job.confidence_json || '{}');
    } catch {
      response.profile    = {};
      response.confidence = {};
    }
  }

  res.json(response);
});

// GET /api/extraction-jobs/document/:documentId — get job by document
router.get('/document/:documentId', (req, res) => {
  const job = db.extractionJobs.getByDocumentId(req.params.documentId);
  if (!job) return res.status(404).json({ error: 'No job found for this document' });
  res.redirect(`/api/extraction-jobs/${job.id}`);
});

// PUT /api/extraction-jobs/:id/profile — save user corrections to extracted profile
router.put('/:id/profile', (req, res) => {
  const job = db.extractionJobs.getById(req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });

  const corrected = req.body; // user-edited profile
  db.extractionJobs.update(job.id, {
    extracted_json: JSON.stringify(corrected),
    status: 'needs_review'
  });

  res.json({ success: true, message: 'Corrections saved' });
});

// POST /api/extraction-jobs/:id/confirm — user confirmed the extracted profile
router.post('/:id/confirm', (req, res) => {
  const job = db.extractionJobs.getById(req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });

  db.extractionJobs.update(job.id, { status: 'confirmed' });
  db.documents.updateStatus(job.document_id, 'confirmed');

  res.json({ success: true, message: 'Profile confirmed' });
});

// POST /api/extraction-jobs/:id/retry — retry a failed job
router.post('/:id/retry', async (req, res) => {
  const job = db.extractionJobs.getById(req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });

  const retryCount = (job.retry_count || 0) + 1;
  db.extractionJobs.update(job.id, { status: 'pending', retry_count: retryCount, error_message: null });

  const { processDocument } = require('../workers/processor');
  processDocument(job.document_id, job.id).catch(console.error);

  res.json({ success: true, jobId: job.id, retryCount, status: 'processing' });
});

module.exports = router;
