'use strict';
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const db = require('../db/database');
const { processDocument } = require('../workers/processor');

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
const MAX_SIZE_MB = parseInt(process.env.MAX_FILE_SIZE_MB || '10', 10);
const MAGIC_PDF = Buffer.from([0x25, 0x50, 0x44, 0x46]); // %PDF

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// ── Multer config ─────────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: UPLOADS_DIR,
  filename(req, file, cb) {
    // Generate a random server-side filename — never trust client name
    cb(null, `${uuidv4()}.pdf`);
  }
});

function fileFilter(req, file, cb) {
  // Extension check
  if (!file.originalname.toLowerCase().endsWith('.pdf')) {
    return cb(new Error('Only PDF files are allowed'), false);
  }
  // MIME type check
  if (file.mimetype !== 'application/pdf') {
    return cb(new Error('MIME type must be application/pdf'), false);
  }
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE_MB * 1024 * 1024 }
});

// ── Magic byte validator ─────────────────────────────────────────────────────
function validateMagicBytes(filePath) {
  const fd = fs.openSync(filePath, 'r');
  const buf = Buffer.alloc(4);
  fs.readSync(fd, buf, 0, 4, 0);
  fs.closeSync(fd);
  return buf.equals(MAGIC_PDF);
}

// ── Routes ───────────────────────────────────────────────────────────────────

// POST /api/documents — upload + trigger processing job
router.post('/', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const filePath = req.file.path;

  // Magic byte validation
  if (!validateMagicBytes(filePath)) {
    fs.unlinkSync(filePath);
    return res.status(400).json({ error: 'File signature invalid — not a real PDF' });
  }

  // Save document record
  const doc = db.documents.create({
    original_filename: req.file.originalname,
    stored_filename: req.file.filename,
    mime_type: req.file.mimetype,
    size_bytes: req.file.size
  });

  // Create extraction job
  const job = db.extractionJobs.create(doc.id);

  // Fire-and-forget background processing
  processDocument(doc.id, job.id).catch(err => {
    console.error(`[PROCESSOR] Unhandled error for job ${job.id}:`, err);
  });

  res.status(202).json({
    documentId: doc.id,
    jobId: job.id,
    status: 'processing',
    message: 'Document uploaded and queued for processing'
  });
});

// GET /api/documents — list all
router.get('/', (req, res) => {
  res.json(db.documents.getAll());
});

// GET /api/documents/:id
router.get('/:id', (req, res) => {
  const doc = db.documents.getById(req.params.id);
  if (!doc) return res.status(404).json({ error: 'Not found' });
  res.json(doc);
});

// DELETE /api/documents/:id
router.delete('/:id', (req, res) => {
  const doc = db.documents.getById(req.params.id);
  if (!doc) return res.status(404).json({ error: 'Not found' });
  // Delete file from disk
  const filePath = path.join(UPLOADS_DIR, doc.stored_filename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  db.documents.delete(req.params.id);
  res.status(204).end();
});

// Multer error handler
router.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: `File too large — max ${MAX_SIZE_MB} MB` });
  }
  res.status(400).json({ error: err.message });
});

module.exports = router;
