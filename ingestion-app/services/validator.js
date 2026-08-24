'use strict';
/**
 * validator.js
 * Schema validation for extracted profile data.
 * Returns { valid: bool, errors: string[] }
 */

function validateEmail(str) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str || '');
}

function validateProfile(data) {
  const errors = [];

  if (data.personal) {
    const p = data.personal;
    if (p.email && !validateEmail(p.email)) errors.push('personal.email: invalid format');
    if (p.phone && !/^[\d\s\+\-\(\)]{6,20}$/.test(p.phone)) errors.push('personal.phone: unexpected format');
  }

  if (data.education && !Array.isArray(data.education)) {
    errors.push('education must be an array');
  }
  if (data.experience && !Array.isArray(data.experience)) {
    errors.push('experience must be an array');
  }
  if (data.skills && !Array.isArray(data.skills)) {
    errors.push('skills must be an array');
  }

  return { valid: errors.length === 0, errors };
}

module.exports = { validateProfile, validateEmail };
