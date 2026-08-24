'use strict';
/**
 * ai-extract.js
 * Stage 2: Information extraction — pure regex/heuristic approach.
 * No external API required.
 *
 * Extracts from raw text:
 *   - personal info (name, email, phone, location)
 *   - education entries
 *   - experience entries
 *   - skills
 *   - projects
 *   - certifications
 *
 * Returns { profile, confidence, method: 'regex' }
 */

// ── Section heading detection ─────────────────────────────────────────────────

const SECTION_PATTERNS = {
  education:       /^\s*(education|academic|qualifications?|studies|study)\s*$/im,
  experience:      /^\s*(experience|work\s+experience|employment|professional\s+experience|career|work\s+history)\s*$/im,
  skills:          /^\s*(skills?|technical\s+skills?|core\s+competenc|competenc|expertise|technologies|tools)\s*$/im,
  projects:        /^\s*(projects?|personal\s+projects?|key\s+projects?|portfolio)\s*$/im,
  certifications:  /^\s*(certifications?|licen[sc]es?|credentials?|accreditations?)\s*$/im,
  awards:          /^\s*(awards?|honours?|honors?|achievements?|distinctions?)\s*$/im,
  summary:         /^\s*(summary|profile|objective|about\s+me|about|bio)\s*$/im,
};

// ── Personal information patterns ─────────────────────────────────────────────

const EMAIL_RE    = /\b[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}\b/;
const PHONE_RE    = /(?:\+?[\d\s\-\(\)]{7,20})/;
const LINKEDIN_RE = /linkedin\.com\/in\/[\w\-]+/i;
const GITHUB_RE   = /github\.com\/[\w\-]+/i;
const URL_RE      = /https?:\/\/[^\s]+/gi;

// Date patterns: "Jan 2022", "January 2022", "2022-01", "2022", "Present", "Current"
const DATE_RE = /(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{4}|\d{4}[-\/]\d{2}|\d{4}|(?:Present|Current|Now|Ongoing)/gi;

// Date range pattern: "Jun 2025 – Aug 2025", "2022 - 2026", "Jan 2020 – Present"
const DATE_RANGE_RE = /(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{4}|\d{4}\s*[-–—]\s*(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)?\s*\d{4}|\d{4}\s*[-–—]\s*(?:Present|Current|Now|Ongoing)/gi;

// ── Qualification keywords for education ─────────────────────────────────────

const QUAL_KEYWORDS = [
  'Bachelor', 'BSc', 'BEng', 'BA', 'BComm', 'BBA',
  'Master', 'MSc', 'MEng', 'MA', 'MBA', 'MPhil',
  'PhD', 'DPhil', 'Doctorate', 'Doctor',
  'HND', 'HNC', 'Diploma', 'Certificate', 'Associate',
  'National Certificate', 'Advanced Level', 'A-Level', 'O-Level'
];

// ── Skill keyword bank (common in tech CVs) ───────────────────────────────────

const SKILL_SIGNAL_WORDS = new Set([
  // Languages
  'Python','Java','JavaScript','TypeScript','C','C++','C#','Go','Rust','PHP','Ruby','Swift','Kotlin',
  'HTML','CSS','SQL','Bash','Shell','PowerShell','MATLAB','R',
  // Frameworks
  'React','Vue','Angular','Node','Express','Django','Flask','FastAPI','Spring','Laravel',
  'Next.js','Nuxt','Svelte','Flutter','React Native',
  // Cloud & DevOps
  'AWS','Azure','GCP','Docker','Kubernetes','Terraform','Ansible','Jenkins','GitHub Actions',
  'CI/CD','Linux','Ubuntu','Debian','Windows Server',
  // Networking & Telecom (relevant to Tafadzwa)
  'Cisco','Huawei','Mikrotik','OSPF','BGP','MPLS','TCP/IP','VoIP','LTE','5G','4G','SDH','DWDM',
  'Networking','Wireshark','Packet Tracer','GNS3','CCNA','CCNP',
  // Databases
  'MySQL','PostgreSQL','MongoDB','SQLite','Redis','Firebase',
  // Tools
  'Git','GitHub','GitLab','Jira','Confluence','Figma','Postman','VS Code',
  // Other
  'Machine Learning','Deep Learning','TensorFlow','PyTorch','Pandas','NumPy',
  'REST','API','GraphQL','Microservices','Agile','Scrum'
]);

// ── Helpers ────────────────────────────────────────────────────────────────────

function splitLines(text) {
  return text.split(/\r?\n/).map(l => l.trim());
}

function extractFirstName(lines) {
  // Heuristic: first non-empty line that looks like a name (2-4 words, no special chars, title-cased)
  for (const line of lines.slice(0, 10)) {
    if (!line) continue;
    if (EMAIL_RE.test(line) || PHONE_RE.test(line)) continue;
    const words = line.split(/\s+/);
    if (words.length >= 2 && words.length <= 5) {
      const looksLikeName = words.every(w => /^[A-Z][a-zA-Z'\-]{1,}$/.test(w));
      if (looksLikeName) return line;
    }
  }
  return null;
}

function extractEmail(text) {
  const m = text.match(EMAIL_RE);
  return m ? m[0] : null;
}

function extractPhone(text) {
  const phoneBlockRe = /(?:Phone|Tel|Mobile|Cell|Contact)[:\s]*([+\d\s\-\(\)]{7,20})/i;
  const blockMatch = text.match(phoneBlockRe);
  if (blockMatch) return blockMatch[1].trim();
  // Fallback: find a standalone phone-ish string
  const lines = splitLines(text);
  for (const line of lines) {
    const cleaned = line.replace(/[^\d\s\+\-\(\)]/g, '');
    if (/^[\d\s\+\-\(\)]{7,18}$/.test(cleaned.trim()) && cleaned.trim().length >= 7) {
      return cleaned.trim();
    }
  }
  return null;
}

function extractLocation(lines) {
  // Look for city/country patterns near the top of the CV
  for (const line of lines.slice(0, 20)) {
    // "Gweru, Zimbabwe" / "London, UK" / "New York, NY"
    if (/^[A-Z][a-zA-Z\s]+,\s*[A-Z][a-zA-Z\s]+$/.test(line)) return line;
    if (/Location|Address|City|Country/i.test(line)) {
      const val = line.replace(/Location|Address|City|Country/i, '').replace(/[:\s]+/, '').trim();
      if (val) return val;
    }
  }
  return null;
}

function parseDateRange(rangeStr) {
  if (!rangeStr) return { startDate: null, endDate: null };
  const parts = rangeStr.split(/\s*[-–—]\s*/);
  return {
    startDate: parts[0] ? parts[0].trim() : null,
    endDate: parts[1] ? parts[1].trim() : null
  };
}

function findSectionBoundaries(lines) {
  const sections = {};
  lines.forEach((line, i) => {
    for (const [name, re] of Object.entries(SECTION_PATTERNS)) {
      if (re.test(line) && !sections[name]) {
        sections[name] = i;
      }
    }
  });
  // Sort by line index
  return Object.entries(sections).sort((a, b) => a[1] - b[1]);
}

function getSectionLines(lines, startIdx, nextIdx) {
  return lines.slice(startIdx + 1, nextIdx !== undefined ? nextIdx : lines.length);
}

function extractEducation(sectionLines) {
  const entries = [];
  let current = null;

  for (const line of sectionLines) {
    if (!line) {
      if (current && current.institution) {
        entries.push(current);
        current = null;
      }
      continue;
    }

    // Check for qualification keyword
    const hasQual = QUAL_KEYWORDS.some(q => new RegExp(q, 'i').test(line));
    const hasDate = DATE_RE.test(line);
    DATE_RE.lastIndex = 0; // Reset stateful regex

    if (!current) {
      current = { institution: null, qualification: null, field: null, startDate: null, endDate: null, description: null };
    }

    if (hasDate) {
      const dates = line.match(DATE_RANGE_RE) || line.match(DATE_RE);
      DATE_RANGE_RE.lastIndex = 0; DATE_RE.lastIndex = 0;
      if (dates && dates[0]) {
        const { startDate, endDate } = parseDateRange(dates[0]);
        current.startDate = startDate;
        current.endDate = endDate;
      }
    } else if (hasQual) {
      current.qualification = line;
    } else if (!current.institution) {
      current.institution = line;
    } else if (!current.field) {
      current.field = line;
    } else {
      current.description = (current.description ? current.description + ' ' : '') + line;
    }
  }

  if (current && current.institution) entries.push(current);
  return entries.filter(e => e.institution);
}

function extractExperience(sectionLines) {
  const entries = [];
  let current = null;
  const descLines = [];

  function flush() {
    if (current) {
      if (descLines.length) current.description = descLines.join(' ').trim();
      entries.push(current);
      current = null;
      descLines.length = 0;
    }
  }

  for (const line of sectionLines) {
    if (!line) { flush(); continue; }

    const hasDate = DATE_RANGE_RE.test(line) || DATE_RE.test(line);
    DATE_RANGE_RE.lastIndex = 0; DATE_RE.lastIndex = 0;

    if (hasDate && current) {
      const dates = line.match(DATE_RANGE_RE) || line.match(DATE_RE);
      DATE_RANGE_RE.lastIndex = 0; DATE_RE.lastIndex = 0;
      if (dates && dates[0]) {
        const { startDate, endDate } = parseDateRange(dates[0]);
        current.startDate = startDate;
        current.endDate = endDate;
      }
    } else if (!current) {
      // First line of a new entry = job title or company
      current = { company: null, position: line, startDate: null, endDate: null, location: null, description: null };
    } else if (!current.company) {
      current.company = line;
    } else {
      descLines.push(line);
    }
  }
  flush();

  // Swap position/company if company looks like a title
  return entries.filter(e => e.company || e.position).map(e => {
    if (!e.company && e.position) {
      e.company = e.position;
      e.position = null;
    }
    return e;
  });
}

function extractSkills(text) {
  const found = new Set();
  const words = text.split(/[\s,;\/\|•\-–—\n\r\t]+/);
  for (const word of words) {
    const cleaned = word.replace(/[^\w\.\+#]/g, '').trim();
    if (SKILL_SIGNAL_WORDS.has(cleaned)) found.add(cleaned);
    // Multi-word matches
    for (const skill of SKILL_SIGNAL_WORDS) {
      if (skill.includes(' ') && text.toLowerCase().includes(skill.toLowerCase())) {
        found.add(skill);
      }
    }
  }
  return [...found].map(name => ({ name, category: categoriseSkill(name), proficiency: null }));
}

function categoriseSkill(name) {
  const n = name.toLowerCase();
  if (['python','java','javascript','typescript','c','c++','c#','go','rust','php','ruby','sql','bash','r','matlab'].some(s => n === s)) return 'Languages';
  if (['react','vue','angular','node','express','django','flask','fastapi','spring','next.js','svelte','flutter'].some(s => n.includes(s))) return 'Frameworks';
  if (['aws','azure','gcp','docker','kubernetes','terraform','ansible','jenkins','ci/cd','linux'].some(s => n.includes(s))) return 'Cloud & DevOps';
  if (['cisco','huawei','ospf','bgp','tcp/ip','voip','lte','5g','4g','networking','ccna','ccnp','mikrotik','wireshark'].some(s => n.includes(s))) return 'Networking & Telecom';
  if (['mysql','postgresql','mongodb','sqlite','redis','firebase'].some(s => n.includes(s))) return 'Databases';
  if (['git','github','jira','figma','postman','vs code'].some(s => n.includes(s))) return 'Tools';
  return 'Other';
}

// ── Confidence scoring ────────────────────────────────────────────────────────

function scoreConfidence(profile) {
  const scores = {};

  const p = profile.personal || {};
  scores.name     = p.firstName ? (p.lastName ? 90 : 60) : 10;
  scores.email    = p.email ? 95 : 20;
  scores.phone    = p.phone ? 85 : 20;
  scores.location = p.location ? 75 : 20;

  scores.education  = (profile.education || []).length > 0 ? 80 : 20;
  scores.experience = (profile.experience || []).length > 0 ? 75 : 20;
  scores.skills     = (profile.skills || []).length > 0 ? 70 : 20;

  return scores;
}

// ── Main extraction entry point ────────────────────────────────────────────────

function extractProfile(text) {
  const lines = splitLines(text);
  const fullName = extractFirstName(lines);
  let firstName = null, lastName = null;
  if (fullName) {
    const parts = fullName.split(/\s+/);
    firstName = parts[0];
    lastName = parts.slice(1).join(' ') || null;
  }

  const email    = extractEmail(text);
  const phone    = extractPhone(text);
  const location = extractLocation(lines);

  // Section detection
  const boundaries = findSectionBoundaries(lines);
  const sectionMap = {};
  boundaries.forEach(([name, idx], i) => {
    const nextIdx = i < boundaries.length - 1 ? boundaries[i + 1][1] : undefined;
    sectionMap[name] = getSectionLines(lines, idx, nextIdx);
  });

  const education  = sectionMap.education  ? extractEducation(sectionMap.education)   : [];
  const experience = sectionMap.experience ? extractExperience(sectionMap.experience) : [];
  const skills     = extractSkills(sectionMap.skills ? sectionMap.skills.join('\n') : text);

  // Summary/bio
  let bio = null;
  if (sectionMap.summary && sectionMap.summary.length) {
    bio = sectionMap.summary.filter(l => l).slice(0, 4).join(' ');
  }

  const profile = {
    personal: { firstName, lastName, email, phone, location, bio },
    education,
    experience,
    skills,
    projects: [],
    certifications: []
  };

  const confidence = scoreConfidence(profile);

  return { profile, confidence, method: 'regex' };
}

module.exports = { extractProfile };
