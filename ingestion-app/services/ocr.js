'use strict';
/**
 * ocr.js
 * Fallback OCR using tesseract.js for scanned/image-based PDFs.
 * Triggered when pdf-parse returns < 50 meaningful characters.
 *
 * NOTE: First run downloads the language model (~30 MB). Subsequent runs are fast.
 */

async function ocrFile(filePath) {
  try {
    const { createWorker } = require('tesseract.js');
    const worker = await createWorker('eng', 1, {
      logger: () => {} // suppress verbose logging
    });
    const { data: { text } } = await worker.recognize(filePath);
    await worker.terminate();
    return { text: text || '', method: 'ocr' };
  } catch (err) {
    return { text: '', method: 'ocr', error: err.message };
  }
}

module.exports = { ocrFile };
