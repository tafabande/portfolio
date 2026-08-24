'use strict';
require('dotenv').config();
const express = require('express');
const path    = require('path');
const fs      = require('fs');
const helmet  = require('helmet');
const cors    = require('cors');
const rateLimit = require('express-rate-limit');

const app  = express();
const PORT = process.env.PORT || 3737;

// ── Security middleware ───────────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc:  ["'self'", "'unsafe-inline'"],
      styleSrc:   ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc:    ["'self'", 'https://fonts.gstatic.com'],
      imgSrc:     ["'self'", 'data:'],
    }
  }
}));

app.use(cors()); // Allow cross-origin requests for telemetry beacon & local testing

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Upload endpoint stricter limit
const uploadLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 20 });

// Body parsing
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// ── Static frontend ───────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname), {
  index: 'index.html',
  dotfiles: 'deny',
}));

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/profile',          require('./api/profile'));
app.use('/api/education',        require('./api/education'));
app.use('/api/experience',       require('./api/experience'));
app.use('/api/skills',           require('./api/skills'));
app.use('/api/projects',         require('./api/projects'));
app.use('/api/documents',        uploadLimiter, require('./api/documents'));
app.use('/api/extraction-jobs',  require('./api/extraction'));
app.use('/api/analytics',        require('./api/analytics'));


// ── Portfolio Sync ────────────────────────────────────────────────────────────
// POST /api/portfolio/sync — assembles full profile and writes profile.json
app.post('/api/portfolio/sync', async (req, res) => {
  try {
    const db = require('./db/database');

    const profileRow  = db.profile.get();
    const education   = db.education.getAll();
    const experience  = db.experience.getAll();
    const skills      = db.skills.getAll();
    const projects    = db.projects.getAll();

    const fullProfile = {
      personal: {
        firstName: profileRow.first_name,
        lastName:  profileRow.last_name,
        email:     profileRow.email,
        phone:     profileRow.phone,
        location:  profileRow.location,
        bio:       profileRow.bio,
      },
      education: education.map(e => ({
        institution:   e.institution,
        qualification: e.qualification,
        field:         e.field,
        startDate:     e.start_date,
        endDate:       e.end_date,
        description:   e.description,
      })),
      experience: experience.map(e => ({
        company:     e.company,
        position:    e.position,
        startDate:   e.start_date,
        endDate:     e.end_date,
        location:    e.location,
        description: e.description,
      })),
      skills: skills.map(s => ({
        name:        s.name,
        category:    s.category,
        proficiency: s.proficiency,
      })),
      projects: projects.map(p => ({
        name:         p.name,
        description:  p.description,
        technologies: (() => { try { return JSON.parse(p.technologies || '[]'); } catch { return []; } })(),
        url:          p.url,
      })),
      syncedAt: new Date().toISOString(),
    };

    // Save snapshot in DB
    db.snapshots.create(fullProfile, 'portfolio_sync');

    // Write profile.json to parent portfolio directory
    const outputPath = path.resolve(
      process.env.PROFILE_OUTPUT_PATH || path.join(__dirname, '..', 'profile.json')
    );
    fs.writeFileSync(outputPath, JSON.stringify(fullProfile, null, 2), 'utf8');

    console.log(`[SYNC] Profile written to ${outputPath}`);
    res.json({ success: true, outputPath, profile: fullProfile });

  } catch (err) {
    console.error('[SYNC] Failed:', err.message);
    res.status(500).json({ error: 'Sync failed', detail: err.message });
  }
});

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// ── 404 fallback ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Endpoint not found' });
  }
  // SPA fallback
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

// ── Start ─────────────────────────────────────────────────────────────────────
(async () => {
  try {
    const { getDb } = require('./db/database');
    await getDb();
    console.log('[DB] Database ready');
  } catch (err) {
    console.error('[DB] Init failed:', err.message);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`\n╔══════════════════════════════════════╗`);
    console.log(`║  CV Ingestion App                    ║`);
    console.log(`║  http://localhost:${PORT}              ║`);
    console.log(`╚══════════════════════════════════════╝\n`);
  });
})();


module.exports = app;
