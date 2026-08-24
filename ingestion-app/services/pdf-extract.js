'use strict';
/**
 * pdf-extract.js
 * Stage 1: Extract raw text from a PDF file.
 * Returns the text string (may be empty if scanned/image-only PDF).
 */

const fs = require('fs');

async function extractText(filePath) {
  // pdf-parse does not support the Buffer constructor from require directly on
  // some Node versions — use the data buffer approach.
  try {
    const pdfParse = require('pdf-parse');
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return {
      text: data.text || '',
      pages: data.numpages || 1,
      info: data.info || {}
    };
  } catch (err) {
    // Return empty text so OCR fallback can kick in
    return { text: '', pages: 0, info: {}, error: err.message };
  }
}

module.exports = { extractText };
