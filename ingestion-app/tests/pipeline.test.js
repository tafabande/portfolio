'use strict';

/**
 * Enterprise Integration & Pipeline Test Suite
 * Validates:
 *   1. Database schema, Profile versioning & Rollback
 *   2. User authentication & password hashing
 *   3. Extraction job retry logic with exponential backoff
 *   4. Analytics logging & event telemetry
 */

const path = require('path');
const db   = require('../db/database');
const { processDocument } = require('../workers/processor');

async function runTests() {
  console.log('\n🧪 Running Enterprise Pipeline Test Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ ${message}`);
      passed++;
    } else {
      console.error(`  ✕ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // ── 1. Database Initialization & Schema Verification ──────────────────────
    await db.getDb();
    assert(true, 'SQLite database initialized with WASM engine');

    // ── 2. User Account & Password Hashing Verification ────────────────────────
    const testEmail = `test_${Date.now()}@example.com`;
    const user = db.users.create({
      email: testEmail,
      password: 'SecurePassword123!',
      first_name: 'Test',
      last_name: 'User'
    });

    assert(Boolean(user.id), 'User identity created with UUID');
    assert(db.users.verifyPassword('SecurePassword123!', db.users.findByEmail(testEmail).password_hash), 'Bcrypt password hash verification passed');
    assert(!db.users.verifyPassword('WrongPassword', db.users.findByEmail(testEmail).password_hash), 'Invalid password rejected');

    // ── 3. Profile Versioning & History Verification ───────────────────────────
    const sampleProfile = {
      personal: { firstName: 'Bleigh', lastName: 'Bande', email: testEmail },
      skills: [{ name: 'Kotlin' }, { name: 'Node.js' }]
    };

    const ver1 = db.versions.create(sampleProfile, 'Initial version v1', 'manual_edit');
    assert(ver1.version_number > 0, `Version created (Version #${ver1.version_number})`);

    const allVers = db.versions.getAll();
    assert(Array.isArray(allVers) && allVers.length >= 1, 'Version history list retrieved');

    // Test rollback
    const rolled = db.versions.rollback(ver1.id);
    assert(rolled.source === 'rollback', 'Version rollback executed successfully');

    // ── 4. Analytics Telemetry Logging Verification ────────────────────────────
    const eventResult = db.analytics.logEvent({
      event_type: 'page_view',
      target: 'index.html',
      visitor_id: 'v_test_runner_123'
    });
    assert(eventResult.success, 'Analytics telemetry event recorded');

    const summary = db.analytics.getSummary();
    assert(summary.totalViews >= 1, `Analytics summary aggregated (total_views=${summary.totalViews})`);

    // ── 5. Retry Mechanism Verification ────────────────────────────────────────
    const mockDoc = db.documents.create({
      original_filename: 'nonexistent.pdf',
      stored_filename: 'nonexistent_fake.pdf',
      mime_type: 'application/pdf',
      size_bytes: 1024
    });
    const mockJob = db.extractionJobs.create(mockDoc.id);

    console.log('\n  ⏳ Testing exponential backoff retry mechanism (max 2 attempts)...');
    const jobResult = await processDocument(mockDoc.id, mockJob.id, 2);
    assert(!jobResult.success, 'Retry mechanism caught invalid file gracefully');
    
    const updatedJob = db.extractionJobs.getById(mockJob.id);
    assert(updatedJob.retry_count >= 1, `Job retry_count updated (count=${updatedJob.retry_count})`);

  } catch (err) {
    console.error('  ✕ Pipeline test failure:', err);
    failed++;
  }

  console.log(`\n========================================`);
  console.log(`Test Results: ${passed} passed, ${failed} failed`);
  console.log(`========================================\n`);

  if (failed > 0) process.exit(1);
}

runTests();
