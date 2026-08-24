'use strict';
/**
 * database.js — better-sqlite3 compatible wrapper using sql.js (pure-JS WASM SQLite)
 * sql.js requires async init; we initialise once and cache the sync instance.
 */
const path = require('path');
const fs   = require('fs');

const DB_PATH     = path.join(__dirname, '..', 'ingestion.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

let _db   = null;   // sql.js Database instance (after init)
let _ready = false;
let _initPromise = null;

async function initDb() {
  if (_ready) return _db;
  if (_initPromise) return _initPromise;

  _initPromise = (async () => {
    const initSqlJs = require('sql.js');
    const SQL = await initSqlJs();

    const fileBuffer = fs.existsSync(DB_PATH) ? fs.readFileSync(DB_PATH) : null;
    _db = fileBuffer ? new SQL.Database(fileBuffer) : new SQL.Database();

    // Enable WAL-equivalent pragmas
    _db.run('PRAGMA foreign_keys = ON;');

    // Always run schema to ensure any new tables are created
    const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
    schema.split(';').map(s => s.trim()).filter(Boolean).forEach(stmt => {
      try { _db.run(stmt + ';'); } catch (e) { /* ignore if already exists */ }
    });
    persistSync();


    _ready = true;
    return _db;
  })();

  return _initPromise;
}

function persistSync() {
  if (!_db) return;
  const data = _db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

// Ensure DB is ready — call this at top of every route handler
async function getDb() {
  return initDb();
}

// Synchronous helpers (safe to call AFTER initDb() has resolved)
function run(sql, params = []) {
  _db.run(sql, params);
  persistSync();
}

function get(sql, params = []) {
  const stmt = _db.prepare(sql);
  stmt.bind(params);
  const row = stmt.step() ? stmt.getAsObject() : undefined;
  stmt.free();
  return row;
}

function all(sql, params = []) {
  const stmt = _db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
}

function now() { return new Date().toISOString(); }
function uuid() { return require('uuid').v4(); }

// ── Users & Authentication ───────────────────────────────────────────────────
const bcrypt = require('bcryptjs');

const users = {
  create(data) {
    const id = uuid();
    const hash = bcrypt.hashSync(data.password, 10);
    run(`INSERT INTO users (id, email, password_hash, first_name, last_name, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [id, data.email.toLowerCase().trim(), hash, data.first_name || null, data.last_name || null, now(), now()]);
    
    // Auto-create initial profile bound to this user
    run('UPDATE profile SET user_id = ?, first_name = ?, last_name = ?, email = ? WHERE id = 1',
        [id, data.first_name || null, data.last_name || null, data.email]);
    
    return this.findById(id);
  },
  findByEmail(email) {
    return get('SELECT * FROM users WHERE lower(email) = lower(?)', [email.trim()]);
  },
  findById(id) {
    return get('SELECT id, email, first_name, last_name, created_at, updated_at FROM users WHERE id = ?', [id]);
  },
  verifyPassword(plainPassword, passwordHash) {
    return bcrypt.compareSync(plainPassword, passwordHash);
  }
};

// ── Profile ──────────────────────────────────────────────────────────────────
const profile = {
  get()  { return get('SELECT * FROM profile WHERE id = 1') || {}; },
  update(data) {
    const fields = ['first_name','last_name','email','phone','location','bio'];
    const valid  = fields.filter(f => data[f] !== undefined);
    if (!valid.length) return this.get();
    const set = [...valid.map(f => `${f} = ?`), 'updated_at = ?'].join(', ');
    run(`UPDATE profile SET ${set} WHERE id = 1`, [...valid.map(f => data[f] ?? null), now()]);
    return this.get();
  }
};


// ── Education ────────────────────────────────────────────────────────────────
const education = {
  getAll()   { return all('SELECT * FROM education ORDER BY start_date DESC'); },
  getById(id){ return get('SELECT * FROM education WHERE id = ?', [id]); },
  create(data) {
    const id = uuid();
    run(`INSERT INTO education (id,institution,qualification,field,start_date,end_date,description) VALUES (?,?,?,?,?,?,?)`,
        [id, data.institution||'', data.qualification||null, data.field||null, data.start_date||null, data.end_date||null, data.description||null]);
    return this.getById(id);
  },
  update(id, data) {
    const fields = ['institution','qualification','field','start_date','end_date','description'];
    const valid  = fields.filter(f => data[f] !== undefined);
    if (!valid.length) return this.getById(id);
    const set = [...valid.map(f => `${f} = ?`), 'updated_at = ?'].join(', ');
    run(`UPDATE education SET ${set} WHERE id = ?`, [...valid.map(f => data[f]??null), now(), id]);
    return this.getById(id);
  },
  delete(id) { run('DELETE FROM education WHERE id = ?', [id]); }
};

// ── Experience ───────────────────────────────────────────────────────────────
const experience = {
  getAll()   { return all('SELECT * FROM experience ORDER BY start_date DESC'); },
  getById(id){ return get('SELECT * FROM experience WHERE id = ?', [id]); },
  create(data) {
    const id = uuid();
    run(`INSERT INTO experience (id,company,position,start_date,end_date,location,description) VALUES (?,?,?,?,?,?,?)`,
        [id, data.company||'', data.position||null, data.start_date||null, data.end_date||null, data.location||null, data.description||null]);
    return this.getById(id);
  },
  update(id, data) {
    const fields = ['company','position','start_date','end_date','location','description'];
    const valid  = fields.filter(f => data[f] !== undefined);
    if (!valid.length) return this.getById(id);
    const set = [...valid.map(f => `${f} = ?`), 'updated_at = ?'].join(', ');
    run(`UPDATE experience SET ${set} WHERE id = ?`, [...valid.map(f => data[f]??null), now(), id]);
    return this.getById(id);
  },
  delete(id) { run('DELETE FROM experience WHERE id = ?', [id]); }
};

// ── Skills ───────────────────────────────────────────────────────────────────
const skills = {
  getAll()   { return all('SELECT * FROM skills ORDER BY category, name'); },
  getById(id){ return get('SELECT * FROM skills WHERE id = ?', [id]); },
  create(data) {
    const exists = get('SELECT id FROM skills WHERE lower(name) = lower(?)', [data.name]);
    if (exists) return this.getById(exists.id);
    const id = uuid();
    run(`INSERT INTO skills (id,name,category,proficiency) VALUES (?,?,?,?)`,
        [id, data.name, data.category||null, data.proficiency||null]);
    return this.getById(id);
  },
  delete(id) { run('DELETE FROM skills WHERE id = ?', [id]); }
};

// ── Projects ─────────────────────────────────────────────────────────────────
const projects = {
  getAll()   { return all('SELECT * FROM projects ORDER BY created_at DESC'); },
  getById(id){ return get('SELECT * FROM projects WHERE id = ?', [id]); },
  create(data) {
    const id = uuid();
    const tech = Array.isArray(data.technologies) ? JSON.stringify(data.technologies) : (data.technologies||null);
    run(`INSERT INTO projects (id,name,description,technologies,url) VALUES (?,?,?,?,?)`,
        [id, data.name||'', data.description||null, tech, data.url||null]);
    return this.getById(id);
  },
  update(id, data) {
    const fields = ['name','description','url'];
    const valid  = fields.filter(f => data[f] !== undefined);
    const sets   = [...valid.map(f => `${f} = ?`), 'updated_at = ?'];
    const vals   = [...valid.map(f => data[f]??null), now()];
    if (data.technologies !== undefined) { sets.push('technologies = ?'); vals.push(JSON.stringify(data.technologies)); }
    run(`UPDATE projects SET ${sets.join(', ')} WHERE id = ?`, [...vals, id]);
    return this.getById(id);
  },
  delete(id) { run('DELETE FROM projects WHERE id = ?', [id]); }
};

// ── Documents ────────────────────────────────────────────────────────────────
const documents = {
  getAll()   { return all('SELECT * FROM documents ORDER BY uploaded_at DESC'); },
  getById(id){ return get('SELECT * FROM documents WHERE id = ?', [id]); },
  create(data) {
    const id = uuid();
    run(`INSERT INTO documents (id,original_filename,stored_filename,mime_type,size_bytes) VALUES (?,?,?,?,?)`,
        [id, data.original_filename, data.stored_filename, data.mime_type, data.size_bytes]);
    return this.getById(id);
  },
  updateStatus(id, status) { run('UPDATE documents SET processing_status = ?, updated_at = ? WHERE id = ?', [status, now(), id]); },
  delete(id) { run('DELETE FROM documents WHERE id = ?', [id]); }
};

// ── Extraction Jobs ──────────────────────────────────────────────────────────
const extractionJobs = {
  getById(id)      { return get('SELECT * FROM extraction_jobs WHERE id = ?', [id]); },
  getByDocumentId(docId){ return get('SELECT * FROM extraction_jobs WHERE document_id = ? ORDER BY created_at DESC LIMIT 1', [docId]); },
  create(documentId) {
    const id = uuid();
    run('INSERT INTO extraction_jobs (id,document_id) VALUES (?,?)', [id, documentId]);
    return this.getById(id);
  },
  update(id, data) {
    const allowed = ['status','raw_text','extracted_json','confidence_json','extraction_method','error_message','retry_count'];
    const valid   = allowed.filter(f => data[f] !== undefined);
    if (!valid.length) return;
    const set = [...valid.map(f => `${f} = ?`), 'updated_at = ?'].join(', ');
    run(`UPDATE extraction_jobs SET ${set} WHERE id = ?`, [...valid.map(f => data[f]??null), now(), id]);
  }
};

// ── Snapshots ────────────────────────────────────────────────────────────────
const snapshots = {
  create(profileJson, source = 'manual') {
    run('INSERT INTO profile_snapshots (profile_json,source) VALUES (?,?)', [JSON.stringify(profileJson), source]);
  },
  getLatest() { return get('SELECT * FROM profile_snapshots ORDER BY created_at DESC LIMIT 1'); }
};

// ── Analytics ────────────────────────────────────────────────────────────────
const analytics = {
  logEvent(data) {
    const id = uuid();
    run(`INSERT INTO analytics_events (id, event_type, target, visitor_id, user_agent, referrer, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [id, data.event_type, data.target || null, data.visitor_id || null, data.user_agent || null, data.referrer || null, now()]);
    return { id, success: true };
  },
  getSummary() {
    const totalViews = (get("SELECT COUNT(*) as count FROM analytics_events WHERE event_type = 'page_view'") || {}).count || 0;
    const uniqueVisitors = (get("SELECT COUNT(DISTINCT visitor_id) as count FROM analytics_events WHERE visitor_id IS NOT NULL AND visitor_id != ''") || {}).count || 0;
    const cvOpens = (get("SELECT COUNT(*) as count FROM analytics_events WHERE event_type = 'cv_open'") || {}).count || 0;
    const projectClicks = (get("SELECT COUNT(*) as count FROM analytics_events WHERE event_type = 'project_click'") || {}).count || 0;
    const contactClicks = (get("SELECT COUNT(*) as count FROM analytics_events WHERE event_type = 'contact_click'") || {}).count || 0;

    const recentActivity = all("SELECT id, event_type, target, created_at FROM analytics_events ORDER BY created_at DESC LIMIT 10");
    const topProjects = all("SELECT target as name, COUNT(*) as clicks FROM analytics_events WHERE event_type = 'project_click' AND target IS NOT NULL GROUP BY target ORDER BY clicks DESC LIMIT 5");

    return {
      totalViews,
      uniqueVisitors: Math.max(uniqueVisitors, totalViews > 0 ? 1 : 0),
      cvOpens,
      projectClicks,
      contactClicks,
      topProjects,
      recentActivity
    };
  }
};

// ── GitHub Auth ──────────────────────────────────────────────────────────────
const githubAuth = {
  get() {
    return get('SELECT * FROM github_auth WHERE id = 1') || { repo_owner: 'tafabande', repo_name: 'portfolio' };
  },
  saveToken(data) {
    const existing = this.get();
    const owner = data.repo_owner || process.env.GITHUB_REPO_OWNER || existing.repo_owner || 'tafabande';
    const repo  = data.repo_name  || process.env.GITHUB_REPO_NAME  || existing.repo_name  || 'portfolio';
    
    run(`UPDATE github_auth SET 
         username = ?, avatar_url = ?, access_token = ?, scope = ?, 
         repo_owner = ?, repo_name = ?, linked_at = ?, updated_at = ?
         WHERE id = 1`,
        [data.username || null, data.avatar_url || null, data.access_token || null, data.scope || null,
         owner, repo, now(), now()]);
    return this.get();
  },
  unlink() {
    run(`UPDATE github_auth SET username = NULL, avatar_url = NULL, access_token = NULL, scope = NULL, updated_at = ? WHERE id = 1`, [now()]);
    return this.get();
  }
};

// Initialise immediately (fire-and-forget; routes call getDb() which awaits this)
initDb().catch(e => console.error('[DB] Init error:', e));

module.exports = { getDb: initDb, users, profile, education, experience, skills, projects, documents, extractionJobs, snapshots, analytics, githubAuth };



