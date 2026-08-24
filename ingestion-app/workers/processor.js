'use strict';
/**
 * processor.js
 * Background pipeline runner.
 *
 * Full pipeline per document:
 *   upload → text extraction → OCR fallback → regex extraction
 *   → normalisation → confidence scoring → save to DB
 *
 * Called asynchronously after document upload.
 * Updates extraction_jobs and documents tables throughout.
 */

const path = require('path');
const { extractText } = require('../services/pdf-extract');
const { ocrFile }     = require('../services/ocr');
const { extractProfile } = require('../services/ai-extract');
const { normaliseProfile }  = require('../services/normalizer');
const db = require('../db/database');

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
const MIN_TEXT_CHARS = 50; // below this → OCR fallback

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function processDocumentWithRetry(documentId, jobId, maxRetries = 3) {
  let attempt = 0;
  let lastError = null;

  while (attempt < maxRetries) {
    attempt++;
    db.extractionJobs.update(jobId, { retry_count: attempt - 1 });

    try {
      return await processDocument(documentId, jobId);
    } catch (err) {
      lastError = err;
      console.warn(`[JOB ${jobId}] Attempt ${attempt}/${maxRetries} failed: ${err.message}`);
      if (attempt < maxRetries) {
        const backoffMs = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
        console.log(`[JOB ${jobId}] Retrying in ${backoffMs}ms...`);
        await delay(backoffMs);
      }
    }
  }

  console.error(`[JOB ${jobId}] All ${maxRetries} retries exhausted. Final error: ${lastError.message}`);
  db.extractionJobs.update(jobId, {
    status: 'failed',
    error_message: `Exhausted ${maxRetries} retries: ${lastError.message}`
  });
  db.documents.updateStatus(documentId, 'failed');
  return { success: false, jobId, error: lastError.message };
}

async function processDocument(documentId, jobId) {
  const log = (msg) => console.log(`[JOB ${jobId}] ${msg}`);

  const doc = db.documents.getById(documentId);
  if (!doc) throw new Error(`Document ${documentId} not found`);

  const filePath = path.join(UPLOADS_DIR, doc.stored_filename);

  // ── Stage 1: Text extraction ─────────────────────────────────────────────
  log('Starting text extraction');
  db.extractionJobs.update(jobId, { status: 'text_extracting' });
  db.documents.updateStatus(documentId, 'extracting');

  const { text: pdfText, error: pdfError } = await extractText(filePath);

  let rawText = pdfText;
  let method = 'regex';

  if (!rawText || rawText.replace(/\s/g, '').length < MIN_TEXT_CHARS) {
    log(`PDF text too short (${rawText?.length || 0} chars), falling back to OCR`);
    const { text: ocrText, error: ocrError } = await ocrFile(filePath);

    if (!ocrText || ocrText.replace(/\s/g, '').length < MIN_TEXT_CHARS) {
      throw new Error(
        `Could not extract readable text from PDF. ` +
        `PDF error: ${pdfError || 'none'}. OCR error: ${ocrError || 'none'}`
      );
    }
    rawText = ocrText;
    method = 'ocr+regex';
  }

  db.extractionJobs.update(jobId, { status: 'text_done', raw_text: rawText });
  log(`Text extraction complete (${rawText.length} chars, method=${method})`);

  // ── Stage 2: Information extraction ──────────────────────────────────────
  log('Starting information extraction');
  db.extractionJobs.update(jobId, { status: 'ai_extracting' });

  const { profile: rawProfile, confidence } = extractProfile(rawText);
  const normalisedProfile = normaliseProfile(rawProfile);

  db.extractionJobs.update(jobId, {
    status: 'needs_review',
    extracted_json: JSON.stringify(normalisedProfile),
    confidence_json: JSON.stringify(confidence),
    extraction_method: method
  });
  db.documents.updateStatus(documentId, 'needs_review');

  log('Extraction complete — awaiting human review');
  return { success: true, jobId, profile: normalisedProfile, confidence };
}

module.exports = { processDocument: processDocumentWithRetry };

