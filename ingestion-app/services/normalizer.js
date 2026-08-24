'use strict';
/**
 * normalizer.js
 * Deduplication and normalization for extracted profile data.
 * - Normalises skill names (JS → JavaScript, etc.)
 * - Deduplicates skills by normalised name
 * - Cleans whitespace from all string fields
 */

const SKILL_ALIASES = {
  'js': 'JavaScript', 'javascript': 'JavaScript', 'java script': 'JavaScript',
  'ts': 'TypeScript', 'typescript': 'TypeScript',
  'py': 'Python', 'python3': 'Python',
  'node': 'Node.js', 'nodejs': 'Node.js', 'node.js': 'Node.js',
  'react.js': 'React', 'reactjs': 'React',
  'vue.js': 'Vue', 'vuejs': 'Vue',
  'c++': 'C++', 'cpp': 'C++',
  'c#': 'C#', 'csharp': 'C#',
  'postgres': 'PostgreSQL', 'postgresql': 'PostgreSQL',
  'mongo': 'MongoDB', 'mongodb': 'MongoDB',
  'linux/unix': 'Linux',
  'git/github': 'Git',
  'html5': 'HTML', 'css3': 'CSS',
};

function normaliseSkillName(name) {
  const key = name.toLowerCase().trim();
  return SKILL_ALIASES[key] || name.trim();
}

function deduplicateSkills(skills) {
  const seen = new Map();
  for (const skill of skills) {
    const norm = normaliseSkillName(skill.name);
    if (!seen.has(norm.toLowerCase())) {
      seen.set(norm.toLowerCase(), { ...skill, name: norm });
    }
  }
  return [...seen.values()];
}

function cleanString(val) {
  if (typeof val !== 'string') return val;
  return val.replace(/\s+/g, ' ').trim() || null;
}

function cleanObject(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (Array.isArray(v)) {
      out[k] = v.map(item => typeof item === 'object' ? cleanObject(item) : cleanString(item));
    } else if (typeof v === 'object' && v !== null) {
      out[k] = cleanObject(v);
    } else {
      out[k] = cleanString(v);
    }
  }
  return out;
}

function normaliseProfile(profile) {
  const clean = cleanObject(profile);
  if (clean.skills) {
    clean.skills = deduplicateSkills(clean.skills);
  }
  return clean;
}

module.exports = { normaliseProfile, normaliseSkillName, deduplicateSkills };
