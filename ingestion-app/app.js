'use strict';
/**
 * app.js — CV Ingestion Wizard
 * State machine driving all 10 screens.
 * Communicates with /api/* backend.
 */

/* ── Config ───────────────────────────────────────────────────────────────── */
const BASE = ''; // same-origin

/* ── Screen order ─────────────────────────────────────────────────────────── */
const SCREENS = [
  'welcome','personal','education','experience','skills','projects',
  'upload','processing','review','confirm'
];

/* ── App state ────────────────────────────────────────────────────────────── */
const state = {
  currentScreen: 'welcome',
  educationEntries: [],    // local draft entries
  experienceEntries: [],
  skills: [],              // { name, category, proficiency }
  projects: [],
  uploadedDocumentId: null,
  currentJobId: null,
  extractedProfile: null,
  extractedConfidence: {},
  pendingDeleteId: null,
  pendingDeleteType: null,
  pollInterval: null,
};

/* ── Skill suggestions bank ───────────────────────────────────────────────── */
const SKILL_SUGGESTIONS = {
  'Languages':             ['Python','JavaScript','TypeScript','Java','C','C++','C#','Go','PHP','Bash','SQL','HTML','CSS','MATLAB','R'],
  'Networking & Telecom':  ['Cisco','Huawei','Mikrotik','OSPF','BGP','TCP/IP','VoIP','LTE','5G','CCNA','Wireshark','GNS3','Packet Tracer','MPLS'],
  'Frameworks':            ['React','Vue','Node.js','Express','Django','Flask','FastAPI','Next.js','Flutter'],
  'Cloud & DevOps':        ['AWS','Azure','Docker','Kubernetes','Linux','Git','GitHub','Jenkins','CI/CD','Terraform'],
  'Databases':             ['MySQL','PostgreSQL','MongoDB','SQLite','Redis','Firebase'],
  'Tools':                 ['Git','GitHub','VS Code','Figma','Postman','Jira','Confluence'],
};

/* ── API helpers ──────────────────────────────────────────────────────────── */
async function api(method, path, body) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(BASE + path, opts);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

async function uploadFile(file) {
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch(BASE + '/api/documents', { method: 'POST', body: fd });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Upload failed: HTTP ${res.status}`);
  return data;
}

/* ── Toast ────────────────────────────────────────────────────────────────── */
function toast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<span class="toast-dot" aria-hidden="true"></span><span>${message}</span>`;
  container.appendChild(el);
  setTimeout(() => {
    el.classList.add('is-leaving');
    setTimeout(() => el.remove(), 300);
  }, 3500);
}

/* ── Dialog ───────────────────────────────────────────────────────────────── */
function showDialog(title, body, onConfirm) {
  document.getElementById('dialogTitle').textContent = title;
  document.getElementById('dialogBody').textContent = body;
  document.getElementById('confirmDialog').classList.add('is-open');
  state._dialogCallback = onConfirm;
}
function closeDialog() {
  document.getElementById('confirmDialog').classList.remove('is-open');
  state._dialogCallback = null;
}

/* ── Screen navigation ────────────────────────────────────────────────────── */
function goTo(screenName) {
  const prev = state.currentScreen;
  SCREENS.forEach(name => {
    const el = document.getElementById(`screen-${name}`);
    if (el) el.classList.toggle('is-active', name === screenName);
    const step = document.getElementById(`step-${name}`);
    if (step) {
      const idx = SCREENS.indexOf(name);
      const cur = SCREENS.indexOf(screenName);
      step.classList.remove('is-active','is-done');
      if (idx < cur) step.classList.add('is-done');
      else if (idx === cur) step.classList.add('is-active');
    }
  });
  state.currentScreen = screenName;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── Clock ────────────────────────────────────────────────────────────────── */
function tickClock() {
  const el = document.getElementById('sysTime');
  if (!el) return;
  const now = new Date();
  el.textContent = now.toLocaleTimeString('en-GB', { timeZone: 'Africa/Harare', hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' CAT';
}

/* ═══════════════════════════════════════════════════════════════════════════
   PERSONAL FORM
═══════════════════════════════════════════════════════════════════════════ */

async function loadPersonal() {
  try {
    const data = await api('GET', '/api/profile');
    document.getElementById('firstName').value = data.first_name || '';
    document.getElementById('lastName').value  = data.last_name  || '';
    document.getElementById('email').value     = data.email      || '';
    document.getElementById('phone').value     = data.phone      || '';
    document.getElementById('location').value  = data.location   || '';
    document.getElementById('bio').value       = data.bio        || '';
  } catch { /* ignore on first load */ }
}

function validatePersonal() {
  let valid = true;
  const firstName = document.getElementById('firstName');
  const email     = document.getElementById('email');

  const showErr = (fieldId, errId, show) => {
    document.getElementById(fieldId).classList.toggle('is-error', show);
    document.getElementById(errId).classList.toggle('is-visible', show);
  };

  if (!firstName.value.trim()) {
    showErr('firstName','firstName-error', true); valid = false;
  } else showErr('firstName','firstName-error', false);

  const emailVal = email.value.trim();
  const emailOk  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);
  if (emailVal && !emailOk) {
    showErr('email','email-error', true); valid = false;
  } else showErr('email','email-error', false);

  return valid;
}

async function savePersonal() {
  if (!validatePersonal()) return;
  const btn = document.getElementById('btnSavePersonal');
  btn.dataset.loading = 'true';
  try {
    await api('PUT', '/api/profile', {
      first_name: document.getElementById('firstName').value.trim(),
      last_name:  document.getElementById('lastName').value.trim(),
      email:      document.getElementById('email').value.trim(),
      phone:      document.getElementById('phone').value.trim(),
      location:   document.getElementById('location').value.trim(),
      bio:        document.getElementById('bio').value.trim(),
    });
    toast('Personal info saved', 'success');
    goTo('education');
    renderEducation();
  } catch (e) {
    toast(e.message, 'error');
  } finally {
    btn.dataset.loading = 'false';
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   EDUCATION
═══════════════════════════════════════════════════════════════════════════ */

function educationCardHTML(entry, index) {
  return `
  <div class="entry-card" data-index="${index}" id="edu-card-${index}">
    <div class="entry-card-header">
      <span class="entry-card-title">Education ${index + 1}</span>
      <button class="btn btn-danger" type="button" data-delete-edu="${index}"
              aria-label="Remove education ${index + 1}">Remove</button>
    </div>
    <div class="form-group">
      <label class="form-label" for="edu-institution-${index}">Institution <span class="required">*</span></label>
      <input class="form-input" type="text" id="edu-institution-${index}" data-field="institution"
             placeholder="University of Zimbabwe" value="${esc(entry.institution || '')}">
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label" for="edu-qual-${index}">Qualification</label>
        <input class="form-input" type="text" id="edu-qual-${index}" data-field="qualification"
               placeholder="Bachelor of Engineering" value="${esc(entry.qualification || '')}">
      </div>
      <div class="form-group">
        <label class="form-label" for="edu-field-${index}">Field of study</label>
        <input class="form-input" type="text" id="edu-field-${index}" data-field="field"
               placeholder="Telecommunications Engineering" value="${esc(entry.field || '')}">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label" for="edu-start-${index}">Start year</label>
        <input class="form-input" type="text" id="edu-start-${index}" data-field="start_date"
               placeholder="2022" value="${esc(entry.start_date || '')}">
      </div>
      <div class="form-group">
        <label class="form-label" for="edu-end-${index}">End year / Expected</label>
        <input class="form-input" type="text" id="edu-end-${index}" data-field="end_date"
               placeholder="2026 or Present" value="${esc(entry.end_date || '')}">
      </div>
    </div>
    <div class="form-group">
      <label class="form-label" for="edu-desc-${index}">Description</label>
      <textarea class="form-textarea" id="edu-desc-${index}" data-field="description"
                rows="2" placeholder="Relevant coursework, achievements…">${esc(entry.description || '')}</textarea>
    </div>
  </div>`;
}

function collectEducationCard(index) {
  const card = document.getElementById(`edu-card-${index}`);
  if (!card) return null;
  const g = (field) => card.querySelector(`[data-field="${field}"]`)?.value?.trim() || null;
  return { institution: g('institution'), qualification: g('qualification'), field: g('field'),
           start_date: g('start_date'), end_date: g('end_date'), description: g('description') };
}

function renderEducation() {
  const list = document.getElementById('educationList');
  if (!state.educationEntries.length) {
    list.innerHTML = '';
    return;
  }
  list.innerHTML = state.educationEntries.map((e, i) => educationCardHTML(e, i)).join('');
  // Bind remove buttons
  list.querySelectorAll('[data-delete-edu]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.deleteEdu, 10);
      showDialog('Remove education?', 'This entry will be removed.', async () => {
        const entry = state.educationEntries[idx];
        if (entry && entry._id) {
          try { await api('DELETE', `/api/education/${entry._id}`); } catch {}
        }
        state.educationEntries.splice(idx, 1);
        renderEducation();
        toast('Education entry removed');
      });
    });
  });
}

async function addEducation() {
  // Collect current form state before adding
  collectAllEducation();
  state.educationEntries.push({ institution: '', qualification: '', field: '',
                                 start_date: '', end_date: '', description: '' });
  renderEducation();
  const cards = document.querySelectorAll('.entry-card');
  cards[cards.length - 1]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  setTimeout(() => cards[cards.length - 1]?.querySelector('input')?.focus(), 300);
}

function collectAllEducation() {
  state.educationEntries = state.educationEntries.map((_, i) => collectEducationCard(i) || _);
}

async function saveEducation() {
  collectAllEducation();
  const btn = document.getElementById('btnSaveEducation');
  btn.dataset.loading = 'true';
  try {
    // Save all entries to API
    for (let i = 0; i < state.educationEntries.length; i++) {
      const e = state.educationEntries[i];
      if (!e.institution) continue;
      if (e._id) {
        const updated = await api('PUT', `/api/education/${e._id}`, e);
        state.educationEntries[i] = { ...updated, _id: updated.id };
      } else {
        const created = await api('POST', '/api/education', e);
        state.educationEntries[i] = { ...created, _id: created.id };
      }
    }
    toast('Education saved', 'success');
    goTo('experience');
    renderExperience();
  } catch (e) {
    toast(e.message, 'error');
  } finally {
    btn.dataset.loading = 'false';
  }
}

async function loadEducation() {
  try {
    const data = await api('GET', '/api/education');
    state.educationEntries = data.map(e => ({ ...e, _id: e.id }));
    renderEducation();
  } catch {}
}

/* ═══════════════════════════════════════════════════════════════════════════
   EXPERIENCE
═══════════════════════════════════════════════════════════════════════════ */

function experienceCardHTML(entry, index) {
  return `
  <div class="entry-card" data-index="${index}" id="exp-card-${index}">
    <div class="entry-card-header">
      <span class="entry-card-title">Experience ${index + 1}</span>
      <button class="btn btn-danger" type="button" data-delete-exp="${index}"
              aria-label="Remove experience ${index + 1}">Remove</button>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label" for="exp-position-${index}">Job title <span class="required">*</span></label>
        <input class="form-input" type="text" id="exp-position-${index}" data-field="position"
               placeholder="Network Engineering Intern" value="${esc(entry.position || '')}">
      </div>
      <div class="form-group">
        <label class="form-label" for="exp-company-${index}">Company</label>
        <input class="form-input" type="text" id="exp-company-${index}" data-field="company"
               placeholder="ABC Telecom" value="${esc(entry.company || '')}">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label" for="exp-start-${index}">Start</label>
        <input class="form-input" type="text" id="exp-start-${index}" data-field="start_date"
               placeholder="Jun 2025" value="${esc(entry.start_date || '')}">
      </div>
      <div class="form-group">
        <label class="form-label" for="exp-end-${index}">End</label>
        <input class="form-input" type="text" id="exp-end-${index}" data-field="end_date"
               placeholder="Aug 2025 or Present" value="${esc(entry.end_date || '')}">
      </div>
    </div>
    <div class="form-group">
      <label class="form-label" for="exp-location-${index}">Location</label>
      <input class="form-input" type="text" id="exp-location-${index}" data-field="location"
             placeholder="Harare, Zimbabwe" value="${esc(entry.location || '')}">
    </div>
    <div class="form-group">
      <label class="form-label" for="exp-desc-${index}">Description</label>
      <textarea class="form-textarea" id="exp-desc-${index}" data-field="description"
                rows="3" placeholder="Key responsibilities and achievements…">${esc(entry.description || '')}</textarea>
    </div>
  </div>`;
}

function collectExperienceCard(index) {
  const card = document.getElementById(`exp-card-${index}`);
  if (!card) return null;
  const g = (field) => card.querySelector(`[data-field="${field}"]`)?.value?.trim() || null;
  return { position: g('position'), company: g('company'), start_date: g('start_date'),
           end_date: g('end_date'), location: g('location'), description: g('description') };
}

function renderExperience() {
  const list = document.getElementById('experienceList');
  if (!state.experienceEntries.length) { list.innerHTML = ''; return; }
  list.innerHTML = state.experienceEntries.map((e, i) => experienceCardHTML(e, i)).join('');
  list.querySelectorAll('[data-delete-exp]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.deleteExp, 10);
      showDialog('Remove experience?', 'This entry will be removed.', async () => {
        const entry = state.experienceEntries[idx];
        if (entry && entry._id) {
          try { await api('DELETE', `/api/experience/${entry._id}`); } catch {}
        }
        state.experienceEntries.splice(idx, 1);
        renderExperience();
        toast('Experience entry removed');
      });
    });
  });
}

async function addExperience() {
  collectAllExperience();
  state.experienceEntries.push({ position: '', company: '', start_date: '', end_date: '', location: '', description: '' });
  renderExperience();
  const cards = document.querySelectorAll('#experienceList .entry-card');
  setTimeout(() => { cards[cards.length - 1]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    cards[cards.length - 1]?.querySelector('input')?.focus(); }, 100);
}

function collectAllExperience() {
  state.experienceEntries = state.experienceEntries.map((_, i) => collectExperienceCard(i) || _);
}

async function saveExperience() {
  collectAllExperience();
  const btn = document.getElementById('btnSaveExperience');
  btn.dataset.loading = 'true';
  try {
    for (let i = 0; i < state.experienceEntries.length; i++) {
      const e = state.experienceEntries[i];
      if (!e.position && !e.company) continue;
      if (e._id) {
        const updated = await api('PUT', `/api/experience/${e._id}`, e);
        state.experienceEntries[i] = { ...updated, _id: updated.id };
      } else {
        const created = await api('POST', '/api/experience', e);
        state.experienceEntries[i] = { ...created, _id: created.id };
      }
    }
    toast('Experience saved', 'success');
    goTo('skills');
    await loadSkills();
  } catch (e) {
    toast(e.message, 'error');
  } finally {
    btn.dataset.loading = 'false';
  }
}

async function loadExperience() {
  try {
    const data = await api('GET', '/api/experience');
    state.experienceEntries = data.map(e => ({ ...e, _id: e.id }));
    renderExperience();
  } catch {}
}

/* ═══════════════════════════════════════════════════════════════════════════
   SKILLS
═══════════════════════════════════════════════════════════════════════════ */

function renderSkillTags() {
  const container = document.getElementById('skillTagsContainer');
  const input = document.getElementById('skillInput');
  // Remove all tags, re-insert them before the input
  container.querySelectorAll('.skill-tag').forEach(t => t.remove());
  state.skills.forEach((skill, i) => {
    const tag = document.createElement('span');
    tag.className = 'skill-tag';
    tag.innerHTML = `${esc(skill.name)}<button class="skill-tag-remove" aria-label="Remove ${esc(skill.name)}" data-idx="${i}">×</button>`;
    container.insertBefore(tag, input);
  });
  // Bind remove
  container.querySelectorAll('.skill-tag-remove').forEach(btn => {
    btn.addEventListener('click', async () => {
      const idx = parseInt(btn.dataset.idx, 10);
      const skill = state.skills[idx];
      if (skill && skill._id) {
        try { await api('DELETE', `/api/skills/${skill._id}`); } catch {}
      }
      state.skills.splice(idx, 1);
      renderSkillTags();
    });
  });
}

async function addSkill(name) {
  const trimmed = name.trim().replace(/,$/, '').trim();
  if (!trimmed) return;
  // Deduplicate locally
  if (state.skills.some(s => s.name.toLowerCase() === trimmed.toLowerCase())) {
    toast(`"${trimmed}" already added`);
    return;
  }
  try {
    const created = await api('POST', '/api/skills', { name: trimmed });
    state.skills.push({ ...created, _id: created.id });
    renderSkillTags();
  } catch (e) {
    toast(e.message, 'error');
  }
}

async function loadSkills() {
  try {
    const data = await api('GET', '/api/skills');
    state.skills = data.map(s => ({ ...s, _id: s.id }));
    renderSkillTags();
  } catch {}
}

function buildSuggestions(query) {
  const box = document.getElementById('skillSuggestions');
  const q = query.toLowerCase().trim();
  if (!q) { box.innerHTML = ''; box.classList.remove('is-open'); return; }

  const allSkills = Object.entries(SKILL_SUGGESTIONS);
  let html = '';
  let count = 0;

  for (const [cat, skills] of allSkills) {
    const matches = skills.filter(s =>
      s.toLowerCase().includes(q) &&
      !state.skills.some(sk => sk.name.toLowerCase() === s.toLowerCase())
    );
    if (matches.length) {
      html += `<div class="skill-group-label">${esc(cat)}</div>`;
      matches.slice(0, 4).forEach(s => {
        html += `<div class="suggestion-item" role="option" data-value="${esc(s)}">${esc(s)}</div>`;
        count++;
      });
    }
  }

  if (!count) { box.innerHTML = ''; box.classList.remove('is-open'); return; }
  box.innerHTML = html;
  box.classList.add('is-open');

  box.querySelectorAll('.suggestion-item').forEach(item => {
    item.addEventListener('mousedown', e => {
      e.preventDefault();
      addSkill(item.dataset.value);
      document.getElementById('skillInput').value = '';
      box.innerHTML = '';
      box.classList.remove('is-open');
    });
  });
}

async function saveSkills() {
  const input = document.getElementById('skillInput');
  if (input.value.trim()) await addSkill(input.value);
  toast('Skills saved', 'success');
  goTo('projects');
  renderProjects();
}

/* ═══════════════════════════════════════════════════════════════════════════
   PROJECTS
═══════════════════════════════════════════════════════════════════════════ */

function projectCardHTML(entry, index) {
  const techStr = Array.isArray(entry.technologies) ? entry.technologies.join(', ') : (entry.technologies || '');
  return `
  <div class="entry-card" data-index="${index}" id="proj-card-${index}">
    <div class="entry-card-header">
      <span class="entry-card-title">Project ${index + 1}</span>
      <button class="btn btn-danger" type="button" data-delete-proj="${index}"
              aria-label="Remove project ${index + 1}">Remove</button>
    </div>
    <div class="form-group">
      <label class="form-label" for="proj-name-${index}">Project name <span class="required">*</span></label>
      <input class="form-input" type="text" id="proj-name-${index}" data-field="name"
             placeholder="Network Monitoring Dashboard" value="${esc(entry.name || '')}">
    </div>
    <div class="form-group">
      <label class="form-label" for="proj-desc-${index}">Description</label>
      <textarea class="form-textarea" id="proj-desc-${index}" data-field="description"
                rows="2" placeholder="What it does, what problem it solves…">${esc(entry.description || '')}</textarea>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label" for="proj-tech-${index}">Technologies used</label>
        <input class="form-input" type="text" id="proj-tech-${index}" data-field="technologies"
               placeholder="Python, Flask, React" value="${esc(techStr)}">
      </div>
      <div class="form-group">
        <label class="form-label" for="proj-url-${index}">URL</label>
        <input class="form-input" type="url" id="proj-url-${index}" data-field="url"
               placeholder="https://github.com/…" value="${esc(entry.url || '')}">
      </div>
    </div>
  </div>`;
}

function collectProjectCard(index) {
  const card = document.getElementById(`proj-card-${index}`);
  if (!card) return null;
  const g = (field) => card.querySelector(`[data-field="${field}"]`)?.value?.trim() || null;
  const techRaw = g('technologies');
  return { name: g('name'), description: g('description'), url: g('url'),
           technologies: techRaw ? techRaw.split(',').map(t => t.trim()).filter(Boolean) : [] };
}

function renderProjects() {
  const list = document.getElementById('projectsList');
  if (!state.projects.length) { list.innerHTML = ''; return; }
  list.innerHTML = state.projects.map((e, i) => projectCardHTML(e, i)).join('');
  list.querySelectorAll('[data-delete-proj]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.deleteProj, 10);
      showDialog('Remove project?', 'This entry will be removed.', async () => {
        const proj = state.projects[idx];
        if (proj && proj._id) {
          try { await api('DELETE', `/api/projects/${proj._id}`); } catch {}
        }
        state.projects.splice(idx, 1);
        renderProjects();
        toast('Project removed');
      });
    });
  });
}

function collectAllProjects() {
  state.projects = state.projects.map((_, i) => collectProjectCard(i) || _);
}

async function saveProjects() {
  collectAllProjects();
  const btn = document.getElementById('btnSaveProjects');
  btn.dataset.loading = 'true';
  try {
    for (let i = 0; i < state.projects.length; i++) {
      const p = state.projects[i];
      if (!p.name) continue;
      if (p._id) {
        const updated = await api('PUT', `/api/projects/${p._id}`, p);
        state.projects[i] = { ...updated, _id: updated.id };
      } else {
        const created = await api('POST', '/api/projects', p);
        state.projects[i] = { ...created, _id: created.id };
      }
    }
    toast('Projects saved', 'success');
    goTo('upload');
  } catch (e) {
    toast(e.message, 'error');
  } finally {
    btn.dataset.loading = 'false';
  }
}

async function loadProjects() {
  try {
    const data = await api('GET', '/api/projects');
    state.projects = data.map(p => ({
      ...p, _id: p.id,
      technologies: (() => { try { return JSON.parse(p.technologies || '[]'); } catch { return []; } })()
    }));
    renderProjects();
  } catch {}
}

/* ═══════════════════════════════════════════════════════════════════════════
   PDF UPLOAD
═══════════════════════════════════════════════════════════════════════════ */

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function setUploadFile(file) {
  if (!file) {
    document.getElementById('btnUpload').disabled = true;
    document.getElementById('uploadSelectedInfo').style.display = 'none';
    return;
  }

  // Client-side validation
  if (!file.name.toLowerCase().endsWith('.pdf') || file.type !== 'application/pdf') {
    showUploadError('Only PDF files are accepted.');
    return;
  }
  if (file.size > 10 * 1024 * 1024) {
    showUploadError(`File is too large (${formatBytes(file.size)}). Maximum is 10 MB.`);
    return;
  }

  hideUploadError();
  document.getElementById('selectedFileName').textContent = file.name;
  document.getElementById('selectedFileSize').textContent = formatBytes(file.size);
  document.getElementById('uploadSelectedInfo').style.display = '';
  document.getElementById('btnUpload').disabled = false;
  state._pendingFile = file;
}

function showUploadError(msg) {
  document.getElementById('uploadErrorMsg').textContent = msg;
  document.getElementById('uploadError').style.display = '';
  document.getElementById('btnUpload').disabled = true;
}
function hideUploadError() {
  document.getElementById('uploadError').style.display = 'none';
}

async function doUpload() {
  const file = state._pendingFile;
  if (!file) return;

  const btn = document.getElementById('btnUpload');
  btn.dataset.loading = 'true';

  try {
    const result = await uploadFile(file);
    state.uploadedDocumentId = result.documentId;
    state.currentJobId = result.jobId;
    toast('File uploaded — starting extraction…', 'info');
    goTo('processing');
    startPolling(result.jobId);
  } catch (e) {
    showUploadError(e.message);
    toast(e.message, 'error');
  } finally {
    btn.dataset.loading = 'false';
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   PROCESSING PIPELINE
═══════════════════════════════════════════════════════════════════════════ */

function setStage(stageId, stageState, detail) {
  const el = document.getElementById(`stage-${stageId}`);
  if (!el) return;
  el.dataset.state = stageState;
  const detailEl = document.getElementById(`stage-${stageId}-detail`);
  if (detailEl && detail) detailEl.textContent = detail;
  const icon = el.querySelector('.pipeline-stage-icon');
  if (icon) {
    if (stageState === 'done') icon.textContent = '✓';
    else if (stageState === 'active') icon.textContent = '◌';
    else if (stageState === 'error') icon.textContent = '✕';
  }
}

function setAllStagesPending() {
  ['upload','validate','text','parse','done'].forEach(s => setStage(s, 'pending', 'Waiting…'));
}

function mapJobStatusToStages(status) {
  setAllStagesPending();
  switch (status) {
    case 'pending':
      setStage('upload','done','Complete'); break;
    case 'text_extracting':
      setStage('upload','done','Complete');
      setStage('validate','done','Valid PDF');
      setStage('text','active','Extracting text…'); break;
    case 'text_done':
      setStage('upload','done','Complete');
      setStage('validate','done','Valid PDF');
      setStage('text','done','Text extracted');
      setStage('parse','active','Analysing…'); break;
    case 'ai_extracting':
      setStage('upload','done','Complete');
      setStage('validate','done','Valid PDF');
      setStage('text','done','Text extracted');
      setStage('parse','active','Extracting information…'); break;
    case 'needs_review':
    case 'confirmed':
      setStage('upload','done','Complete');
      setStage('validate','done','Valid PDF');
      setStage('text','done','Text extracted');
      setStage('parse','done','Information extracted');
      setStage('done','done','Ready for review'); break;
    case 'failed':
      setStage('upload','done','Complete');
      setStage('validate','done','Valid PDF');
      setStage('text','error','Failed');
      break;
  }
}

async function startPolling(jobId) {
  clearPolling();
  let attempts = 0;
  const maxAttempts = 60; // 60 × 2s = 2 minutes max

  async function poll() {
    attempts++;
    if (attempts > maxAttempts) {
      clearPolling();
      showProcessingError('Processing timed out. Please retry.');
      return;
    }
    try {
      const job = await api('GET', `/api/extraction-jobs/${jobId}`);
      mapJobStatusToStages(job.status);

      if (job.status === 'needs_review') {
        clearPolling();
        state.extractedProfile  = job.profile;
        state.extractedConfidence = job.confidence || {};
        setTimeout(() => {
          renderReview();
          goTo('review');
          toast('Extraction complete — please review', 'success');
        }, 1000);
      } else if (job.status === 'failed') {
        clearPolling();
        showProcessingError(job.errorMessage || 'Extraction failed.');
      } else {
        state.pollInterval = setTimeout(poll, 2000);
      }
    } catch (e) {
      clearPolling();
      showProcessingError(e.message);
    }
  }

  // Begin immediately
  poll();
}

function clearPolling() {
  if (state.pollInterval) { clearTimeout(state.pollInterval); state.pollInterval = null; }
}

function showProcessingError(msg) {
  document.getElementById('processingErrorMsg').textContent = msg;
  document.getElementById('processingError').style.display = '';
}

/* ═══════════════════════════════════════════════════════════════════════════
   REVIEW SCREEN
═══════════════════════════════════════════════════════════════════════════ */

function confidenceBadge(score) {
  if (score == null) return '';
  if (score >= 80) return `<span class="confidence-badge high">${score}%</span>`;
  if (score >= 60) return `<span class="confidence-badge mid">${score}%</span>`;
  return `<span class="confidence-badge low">${score}% ⚠</span>`;
}

function reviewFieldHTML(label, value, confidenceKey) {
  const score  = state.extractedConfidence[confidenceKey];
  const empty  = !value || value === 'null' || value === 'undefined';
  const valHtml = empty ? '<em>(not found)</em>' : esc(value);
  const badge  = confidenceBadge(score);
  return `
  <div class="review-field">
    <span class="review-field-label">${esc(label)}</span>
    <span class="review-field-value ${empty ? 'is-empty' : ''}">${valHtml}</span>
    ${badge}
  </div>`;
}

function renderReview() {
  const p = state.extractedProfile || {};
  const personal = p.personal || {};

  // Personal
  document.getElementById('reviewPersonalFields').innerHTML = [
    reviewFieldHTML('First name', personal.firstName, 'name'),
    reviewFieldHTML('Last name',  personal.lastName,  'name'),
    reviewFieldHTML('Email',      personal.email,     'email'),
    reviewFieldHTML('Phone',      personal.phone,     'phone'),
    reviewFieldHTML('Location',   personal.location,  'location'),
  ].join('');

  // Education
  const edus = p.education || [];
  if (edus.length) {
    document.getElementById('reviewEducationFields').innerHTML = edus.map((e, i) => `
      <div class="review-field" style="grid-template-columns:1fr">
        <strong>${esc(e.institution || '—')}</strong>
        <span class="text-muted">${esc(e.qualification || '')} ${esc(e.field || '')}</span>
        <span class="text-dim text-mono">${esc(e.startDate || '')} – ${esc(e.endDate || '')}</span>
      </div>
    `).join('<hr class="divider">');
  } else {
    document.getElementById('reviewEducationFields').innerHTML =
      '<div class="review-field"><span class="review-field-value is-empty">No education found</span></div>';
  }

  // Experience
  const exps = p.experience || [];
  if (exps.length) {
    document.getElementById('reviewExperienceFields').innerHTML = exps.map(e => `
      <div class="review-field" style="grid-template-columns:1fr">
        <strong>${esc(e.position || e.company || '—')}</strong>
        <span class="text-muted">${esc(e.company || '')}</span>
        <span class="text-dim text-mono">${esc(e.startDate || '')} – ${esc(e.endDate || '')}</span>
      </div>
    `).join('<hr class="divider">');
  } else {
    document.getElementById('reviewExperienceFields').innerHTML =
      '<div class="review-field"><span class="review-field-value is-empty">No experience found</span></div>';
  }

  // Skills
  const skillsList = p.skills || [];
  if (skillsList.length) {
    document.getElementById('reviewSkillsFields').innerHTML = `
      <div class="review-field" style="grid-template-columns:1fr">
        <div style="display:flex;flex-wrap:wrap;gap:var(--space-2);padding:var(--space-2) 0">
          ${skillsList.map(s => `<span class="skill-tag" style="color:var(--color-ink-muted)">${esc(s.name)}</span>`).join('')}
        </div>
      </div>`;
  } else {
    document.getElementById('reviewSkillsFields').innerHTML =
      '<div class="review-field"><span class="review-field-value is-empty">No skills found</span></div>';
  }

  // Show low-confidence warning if any score < 60
  const scores = Object.values(state.extractedConfidence);
  const hasLow = scores.some(s => s < 60);
  document.getElementById('reviewLowConfAlert').style.display = hasLow ? '' : 'none';
}

async function confirmReview() {
  const btn = document.getElementById('btnConfirmReview');
  btn.dataset.loading = 'true';
  try {
    // If we have a job, mark it confirmed
    if (state.currentJobId) {
      await api('POST', `/api/extraction-jobs/${state.currentJobId}/confirm`);
    }

    // If extracted profile has data, merge it into DB
    if (state.extractedProfile) {
      const p = state.extractedProfile;
      if (p.personal) {
        await api('PUT', '/api/profile', {
          first_name: p.personal.firstName,
          last_name:  p.personal.lastName,
          email:      p.personal.email,
          phone:      p.personal.phone,
          location:   p.personal.location,
          bio:        p.personal.bio,
        });
      }
      if (p.education) for (const e of p.education) {
        if (e.institution) await api('POST', '/api/education', {
          institution: e.institution, qualification: e.qualification, field: e.field,
          start_date: e.startDate, end_date: e.endDate, description: e.description
        }).catch(() => {});
      }
      if (p.experience) for (const e of p.experience) {
        if (e.company || e.position) await api('POST', '/api/experience', {
          company: e.company, position: e.position,
          start_date: e.startDate, end_date: e.endDate,
          location: e.location, description: e.description
        }).catch(() => {});
      }
      if (p.skills) for (const s of p.skills) {
        if (s.name) await api('POST', '/api/skills', s).catch(() => {});
      }
    }

    toast('Profile confirmed!', 'success');
    goTo('confirm');
  } catch (e) {
    toast(e.message, 'error');
  } finally {
    btn.dataset.loading = 'false';
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   SYNC TO PORTFOLIO
═══════════════════════════════════════════════════════════════════════════ */

async function syncPortfolio() {
  const btn = document.getElementById('btnSyncPortfolio');
  btn.dataset.loading = 'true';
  try {
    const result = await api('POST', '/api/portfolio/sync');
    document.getElementById('syncOutputPath').textContent = result.outputPath || 'profile.json written';
    document.getElementById('syncStatus').style.display = '';
    // Update button
    btn.textContent = '✓ Synced';
    btn.disabled = true;
    toast('Portfolio synced — profile.json updated!', 'success');
  } catch (e) {
    toast('Sync failed: ' + e.message, 'error');
  } finally {
    btn.dataset.loading = 'false';
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   UTILITIES
═══════════════════════════════════════════════════════════════════════════ */

function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ═══════════════════════════════════════════════════════════════════════════
   EVENT BINDING
═══════════════════════════════════════════════════════════════════════════ */

function bindEvents() {
  // Welcome screen
  document.getElementById('btnStartFresh').addEventListener('click', () => {
    loadPersonal();
    goTo('personal');
  });
  document.getElementById('btnStartWithCV').addEventListener('click', () => {
    goTo('upload');
  });

  // Personal
  document.getElementById('btnSavePersonal').addEventListener('click', savePersonal);

  // Education
  document.getElementById('btnSaveEducation').addEventListener('click', saveEducation);
  document.getElementById('btnAddEducation').addEventListener('click', addEducation);

  // Experience
  document.getElementById('btnSaveExperience').addEventListener('click', saveExperience);
  document.getElementById('btnAddExperience').addEventListener('click', addExperience);

  // Skills
  document.getElementById('btnSaveSkills').addEventListener('click', saveSkills);
  const skillInput = document.getElementById('skillInput');
  skillInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(skillInput.value);
      skillInput.value = '';
      buildSuggestions('');
    } else if (e.key === 'Backspace' && !skillInput.value && state.skills.length) {
      const last = state.skills[state.skills.length - 1];
      if (last && last._id) api('DELETE', `/api/skills/${last._id}`).catch(() => {});
      state.skills.pop();
      renderSkillTags();
    }
  });
  skillInput.addEventListener('input', () => buildSuggestions(skillInput.value));
  skillInput.addEventListener('blur', () => setTimeout(() => {
    document.getElementById('skillSuggestions').classList.remove('is-open');
  }, 150));

  // Projects
  document.getElementById('btnSaveProjects').addEventListener('click', saveProjects);
  document.getElementById('btnAddProject').addEventListener('click', () => {
    collectAllProjects();
    state.projects.push({ name: '', description: '', technologies: [], url: '' });
    renderProjects();
  });

  // Upload
  const fileInput = document.getElementById('fileInput');
  fileInput.addEventListener('change', () => setUploadFile(fileInput.files[0]));

  const uploadZone = document.getElementById('uploadZone');
  uploadZone.addEventListener('dragover', e => { e.preventDefault(); uploadZone.classList.add('is-drag-over'); });
  uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('is-drag-over'));
  uploadZone.addEventListener('drop', e => {
    e.preventDefault();
    uploadZone.classList.remove('is-drag-over');
    const file = e.dataTransfer.files[0];
    if (file) setUploadFile(file);
  });
  uploadZone.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput.click(); }
  });
  document.getElementById('btnUpload').addEventListener('click', doUpload);

  // Processing
  document.getElementById('btnRetryExtraction').addEventListener('click', async () => {
    if (!state.currentJobId) return;
    document.getElementById('processingError').style.display = 'none';
    setAllStagesPending();
    try {
      await api('POST', `/api/extraction-jobs/${state.currentJobId}/retry`);
      startPolling(state.currentJobId);
    } catch (e) { toast(e.message, 'error'); }
  });

  // Review
  document.getElementById('btnConfirmReview').addEventListener('click', confirmReview);
  document.getElementById('btnEditPersonal').addEventListener('click', () => { loadPersonal(); goTo('personal'); });
  document.getElementById('btnEditEducation').addEventListener('click', () => { loadEducation(); goTo('education'); });
  document.getElementById('btnEditExperience').addEventListener('click', () => { loadExperience(); goTo('experience'); });
  document.getElementById('btnEditSkills').addEventListener('click', () => { loadSkills(); goTo('skills'); });

  // Confirm
  document.getElementById('btnSyncPortfolio').addEventListener('click', syncPortfolio);
  document.getElementById('btnEditAgain').addEventListener('click', () => { loadPersonal(); goTo('personal'); });
  document.getElementById('btnViewPortfolio').addEventListener('click', () => {
    window.open('../index.html', '_blank');
  });

  // Dialog
  document.getElementById('dialogCancel').addEventListener('click', closeDialog);
  document.getElementById('dialogConfirm').addEventListener('click', () => {
    if (state._dialogCallback) state._dialogCallback();
    closeDialog();
  });
  document.getElementById('confirmDialog').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeDialog();
  });

  // Generic Back / Skip buttons
  document.addEventListener('click', e => {
    const nav = e.target.closest('[data-nav]');
    if (!nav) return;
    const action = nav.dataset.nav;

    if (action === 'prev') {
      const idx = SCREENS.indexOf(state.currentScreen);
      if (idx > 0) goTo(SCREENS[idx - 1]);
    } else if (action === 'skip') {
      const idx = SCREENS.indexOf(state.currentScreen);
      if (idx < SCREENS.length - 1) goTo(SCREENS[idx + 1]);
    } else if (action === 'skip-to-review') {
      goTo('review');
      renderReview();
    }
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   CONTROL ROOM ANALYTICS
═══════════════════════════════════════════════════════════════════════════ */

async function loadDashboardAnalytics() {
  try {
    const [profile, analytics] = await Promise.all([
      api('GET', '/api/profile').catch(() => ({})),
      api('GET', '/api/analytics/summary').catch(() => ({}))
    ]);

    if (profile.first_name) {
      const nameEl = document.getElementById('dashGreetingName');
      if (nameEl) nameEl.textContent = profile.first_name;
    }

    if (analytics) {
      const setM = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = (val || 0).toLocaleString();
      };
      setM('metricViews',      analytics.totalViews);
      setM('metricVisitors',   analytics.uniqueVisitors);
      setM('metricCvOpens',     analytics.cvOpens);
      setM('metricProjClicks',  analytics.projectClicks);

      const activityList = document.getElementById('dashActivityList');
      if (activityList && Array.isArray(analytics.recentActivity) && analytics.recentActivity.length) {
        const icons = {
          'page_view': '👁 Portfolio viewed',
          'cv_open': '📄 CV opened / downloaded',
          'project_click': '🔗 Project link clicked',
          'contact_click': '✉️ Contact link clicked'
        };

        activityList.innerHTML = analytics.recentActivity.map(act => {
          const label = icons[act.event_type] || act.event_type;
          const targetStr = act.target ? ` · <span class="text-accent">${esc(act.target)}</span>` : '';
          const timeStr = timeAgo(act.created_at);
          return `<div style="display:flex;justify-content:space-between;align-items:center;padding:var(--space-2);background:var(--color-paper-surface);border-radius:var(--radius-xs)">
            <span>${label}${targetStr}</span>
            <span class="text-mono text-dim" style="font-size:0.75rem">${timeStr}</span>
          </div>`;
        }).join('');
      }
    }
  } catch (err) {
    console.warn('[DASHBOARD] Analytics load error:', err);
  }
}

function timeAgo(isoString) {
  if (!isoString) return 'just now';
  const diffSec = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
  if (diffSec < 60) return `${Math.max(1, diffSec)}s ago`;
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  return `${Math.floor(diffSec / 86400)}d ago`;
}

/* ═══════════════════════════════════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════════════════════════════════ */

function init() {
  bindEvents();
  tickClock();
  setInterval(tickClock, 1000);

  // Bind Dashboard Quick Sync button
  const dashSyncBtn = document.getElementById('btnDashSync');
  if (dashSyncBtn) {
    dashSyncBtn.addEventListener('click', async () => {
      dashSyncBtn.dataset.loading = 'true';
      try {
        const result = await api('POST', '/api/portfolio/sync');
        toast('Portfolio synced successfully!', 'success');
        const timeEl = document.getElementById('dashLastSyncTime');
        if (timeEl) timeEl.textContent = 'Synced just now';
      } catch (err) {
        toast('Sync failed: ' + err.message, 'error');
      } finally {
        dashSyncBtn.dataset.loading = 'false';
      }
    });
  }

  loadDashboardAnalytics();

  // Check server health
  fetch('/api/health')
    .then(r => r.json())
    .then(() => { /* connected */ })
    .catch(() => {
      const bar = document.querySelector('.status-dot');
      if (bar) bar.style.background = 'var(--color-signal-red)';
      toast('Cannot connect to server — is it running?', 'error');
    });
}

document.addEventListener('DOMContentLoaded', init);

