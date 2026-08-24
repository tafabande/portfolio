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

// Specific Rate Limiters
const uploadLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 20 });
const authLimiter   = rateLimit({ windowMs: 15 * 60 * 1000, max: 15, message: { error: 'Too many authentication attempts. Please try again later.' } });
const syncLimiter   = rateLimit({ windowMs: 15 * 60 * 1000, max: 15, message: { error: 'Sync rate limit reached.' } });

// Request Timeout Handling Middleware (30s timeout)
app.use((req, res, next) => {
  res.setTimeout(30000, () => {
    if (!res.headersSent) {
      res.status(504).json({ error: 'Request timeout — operation took longer than 30 seconds' });
    }
  });
  next();
});

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
app.use('/api/auth',             authLimiter, require('./api/auth'));
app.use('/api/versions',         require('./api/versions'));

// ── Portfolio Sync & GitHub Auto-Publishing ─────────────────────────────────
app.post('/api/portfolio/sync', syncLimiter, async (req, res) => {

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

    // Save snapshot & immutable version history entry
    db.snapshots.create(fullProfile, 'portfolio_sync');
    db.versions.create(fullProfile, `Portfolio sync (${new Date().toLocaleTimeString()})`, 'sync');


    // 1. Write profile.json to local filesystem
    const outputPath = path.resolve(
      process.env.PROFILE_OUTPUT_PATH || path.join(__dirname, '..', 'profile.json')
    );
    fs.writeFileSync(outputPath, JSON.stringify(fullProfile, null, 2), 'utf8');
    console.log(`[SYNC] Profile written to ${outputPath}`);

    // 2. Publish directly to GitHub repository if account is linked
    const auth = db.githubAuth.get();
    const token = auth.access_token || process.env.GITHUB_PERSONAL_TOKEN;
    let githubPublishResult = null;

    if (token) {
      const owner = auth.repo_owner || process.env.GITHUB_REPO_OWNER || 'tafabande';
      const repo  = auth.repo_name  || process.env.GITHUB_REPO_NAME  || 'portfolio';
      const pathInRepo = 'profile.json';
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${pathInRepo}`;

      // Check if profile.json already exists to get SHA for update
      let sha = undefined;
      try {
        const getRes = await fetch(apiUrl, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'User-Agent': 'Portfolio-Ingestion-App',
            'Accept': 'application/vnd.github.v3+json'
          }
        });
        if (getRes.ok) {
          const getJson = await getRes.json();
          sha = getJson.sha;
        }
      } catch (e) {
        console.warn('[GITHUB PUBLISH] Could not fetch existing file SHA:', e.message);
      }

      // Commit file to GitHub repo
      const contentBase64 = Buffer.from(JSON.stringify(fullProfile, null, 2)).toString('base64');
      const putRes = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'User-Agent': 'Portfolio-Ingestion-App',
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify({
          message: `build: Synchronize portfolio profile via Control Room App (${new Date().toISOString()})`,
          content: contentBase64,
          sha: sha
        })
      });

      if (putRes.ok) {
        const commitData = await putRes.json();
        githubPublishResult = {
          published: true,
          commitSha: commitData.commit?.sha?.substring(0, 7) || 'success',
          htmlUrl: commitData.content?.html_url || `https://github.com/${owner}/${repo}`
        };
        console.log(`[GITHUB PUBLISH] Published to ${owner}/${repo} (${githubPublishResult.commitSha})`);
      } else {
        const errJson = await putRes.json().catch(() => ({}));
        console.warn('[GITHUB PUBLISH] Failed:', errJson.message || putRes.statusText);
        githubPublishResult = { published: false, error: errJson.message || `HTTP ${putRes.status}` };
      }
    }

    res.json({
      success: true,
      outputPath,
      profile: fullProfile,
      githubPublish: githubPublishResult
    });

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
