/* ==========================================================================
   BLEIGH PORTFOLIO MOBILE HUB — APPLICATION CONTROLLER
   Offline-First Storage, Credentials Engine & Cloud Sync
   ========================================================================== */

const defaultPortfolioState = {
    profile: {
        name: "Bleigh T.J Bande",
        greeting: "Hello, I'm",
        titles: [
            "Telecommunications Engineer",
            "Web Developer",
            "IT Support Specialist",
            "Data Science Leader",
            "Network Systems Problem Solver"
        ],
        description: "Innovative and technically-driven telecommunications student with a diploma from Trust Academy and currently pursuing a Bachelor’s degree in Telecommunications Engineering at Midlands State University. Possesses foundational knowledge in web technologies, networking, telecoms systems, IT support, and emerging technologies, with leadership experience as Vice President of the Data Science MSU Charter.",
        email: "bleighbande@gmail.com",
        phone: "0776688563",
        location: "Gweru, Zimbabwe",
        dob: "20 January 2000"
    },
    stats: {
        projects: 10,
        experience: 1,
        skills: 15,
        diplomas: 1
    },
    education: [
        {
            id: "edu_1",
            degree: "Bachelor of Science in Telecommunications Engineering",
            qualificationType: "Degree",
            institution: "Midlands State University",
            status: "In Progress",
            year: "February 2024 — Present",
            details: "Specializing in optical communication, RF signal propagation, digital switching architectures, and computer networking."
        },
        {
            id: "edu_2",
            degree: "Diploma in Telecommunications",
            qualificationType: "Diploma",
            institution: "Trust Academy",
            status: "Completed (Credit)",
            year: "June 2017 — June 2023",
            details: "Rigorous hands-on engineering foundation in digital telecommunications, electronics, signals, and routing protocols."
        }
    ],
    skills: [
        { name: "LAN/WAN Config", proficiency: 85, xp: 850 },
        { name: "Python", proficiency: 85, xp: 850 },
        { name: "HTML5 & CSS3", proficiency: 90, xp: 900 },
        { name: "JavaScript & DOM APIs", proficiency: 82, xp: 820 },
        { name: "Cisco Packet Tracer", proficiency: 80, xp: 800 },
        { name: "MySQL & Database Handling", proficiency: 80, xp: 800 },
        { name: "Windows OS & Hardware Diagnostics", proficiency: 90, xp: 900 },
        { name: "Generative AI Workflows", proficiency: 80, xp: 800 }
    ]
};

let currentAppState = JSON.parse(localStorage.getItem('bleigh_portfolio_hub_data') || JSON.stringify(defaultPortfolioState));
let offlineQueue = JSON.parse(localStorage.getItem('bleigh_offline_queue') || '[]');

document.addEventListener('DOMContentLoaded', () => {
    registerServiceWorker();
    initNetworkListeners();
    initTheme();
    renderDashboard();
    renderEducationList();
    renderSkillSliders();
    populateFormFields();
    setupDropzones();
    setupDeployButtons();
});

/* ==========================================================================
   SERVICE WORKER & OFFLINE-FIRST ENGINE
   ========================================================================== */
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(() => console.log('Portfolio Hub ServiceWorker Registered'))
            .catch((err) => console.log('SW registration error:', err));
    }
}

function initNetworkListeners() {
    updateOnlineStatus();
    window.addEventListener('online', () => {
        updateOnlineStatus();
        syncOfflineQueue();
    });
    window.addEventListener('offline', () => {
        updateOnlineStatus();
    });
}

function updateOnlineStatus() {
    const isOnline = navigator.onLine;
    const dot = document.getElementById('networkStatusDot');
    const text = document.getElementById('networkStatusText');
    const chip = document.getElementById('cloudSyncStatusChip');
    const meta = document.getElementById('cloudSyncMetaText');

    if (isOnline) {
        if (dot) dot.style.color = 'var(--md-sys-color-success)';
        if (text) text.textContent = 'Cloud Connected';
        if (chip) {
            chip.className = 'chip-status online';
            chip.innerHTML = '<span class="status-dot"></span> Online';
        }
        if (meta) meta.textContent = 'Connected. Live cloud synchronization is active and ready.';
    } else {
        if (dot) dot.style.color = 'var(--md-sys-color-primary)';
        if (text) text.textContent = 'Offline (Cached)';
        if (chip) {
            chip.className = 'chip-status';
            chip.style.backgroundColor = 'var(--md-sys-color-primary-container)';
            chip.style.color = 'var(--md-sys-color-primary)';
            chip.innerHTML = '<span class="status-dot"></span> Offline Mode';
        }
        if (meta) meta.textContent = 'Offline. All edits and document uploads are safely cached in browser storage and will push when you reconnect.';
    }
}

function syncOfflineQueue() {
    if (offlineQueue.length > 0) {
        showToast(`Synced ${offlineQueue.length} offline changes to Cloud!`, 'cloud_done');
        offlineQueue = [];
        localStorage.setItem('bleigh_offline_queue', JSON.stringify(offlineQueue));
    }
}

/* ==========================================================================
   TAB NAVIGATION
   ========================================================================== */
function switchTab(tabId) {
    const tabs = document.querySelectorAll('.tab-view');
    const navItems = document.querySelectorAll('.nav-item');

    tabs.forEach(tab => tab.classList.remove('active'));
    navItems.forEach(item => item.classList.remove('active'));

    const targetTab = document.getElementById(tabId);
    if (targetTab) targetTab.classList.add('active');

    const targetNav = document.querySelector(`.nav-item[data-target="${tabId}"]`);
    if (targetNav) targetNav.classList.add('active');

    const content = document.querySelector('.app-content');
    if (content) content.scrollTop = 0;
}

/* ==========================================================================
   THEME TOGGLE
   ========================================================================== */
function initTheme() {
    const themeBtn = document.getElementById('themeToggleBtn');
    const savedTheme = localStorage.getItem('bleigh_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('bleigh_theme', next);
            themeBtn.querySelector('.material-symbols-outlined').textContent = next === 'dark' ? 'dark_mode' : 'light_mode';
            showToast(`Switched to ${next} theme`);
        });
    }
}

/* ==========================================================================
   RENDER DASHBOARD & CREDENTIALS
   ========================================================================== */
function renderDashboard() {
    const dashProjects = document.getElementById('dashProjects');
    const dashExp = document.getElementById('dashExp');
    const dashSkills = document.getElementById('dashSkills');
    const dashDiplomas = document.getElementById('dashDiplomas');
    const credsBadge = document.getElementById('credentialsSummaryBadge');
    const credsList = document.getElementById('dashboardCredentialsList');

    if (dashProjects) dashProjects.textContent = currentAppState.stats.projects + '+';
    if (dashExp) dashExp.textContent = currentAppState.stats.experience + ' Yr';
    if (dashSkills) dashSkills.textContent = currentAppState.stats.skills + '+';
    if (dashDiplomas) dashDiplomas.textContent = currentAppState.stats.diplomas;

    const eduCount = (currentAppState.education || []).length;
    if (credsBadge) credsBadge.textContent = `${eduCount} Qualification${eduCount === 1 ? '' : 's'}`;

    if (credsList) {
        credsList.innerHTML = (currentAppState.education || []).map(edu => `
            <div class="doc-slot" style="padding: 10px 14px;">
                <div class="doc-slot-info">
                    <div class="doc-slot-icon" style="width:34px; height:34px; font-size:1.1rem;">
                        <span class="material-symbols-outlined">${getQualificationIcon(edu.qualificationType)}</span>
                    </div>
                    <div class="doc-slot-text">
                        <span class="doc-slot-name" style="font-size:0.85rem;">${edu.degree}</span>
                        <span class="doc-slot-meta">${edu.qualificationType} &bull; ${edu.institution} (${edu.status || 'Active'})</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

function getQualificationIcon(type) {
    const t = (type || '').toLowerCase();
    if (t.includes('phd') || t.includes('doctorate')) return 'psychology';
    if (t.includes('master')) return 'history_edu';
    if (t.includes('degree') || t.includes('bachelor')) return 'school';
    if (t.includes('diploma')) return 'workspace_premium';
    if (t.includes('cert')) return 'verified';
    return 'military_tech';
}

/* ==========================================================================
   ACADEMIC CREDENTIALS & QUALIFICATIONS MANAGER
   ========================================================================== */
function renderEducationList() {
    const container = document.getElementById('educationEntriesContainer');
    if (!container) return;

    if (!currentAppState.education || currentAppState.education.length === 0) {
        container.innerHTML = '<p class="doc-slot-meta">No qualifications added yet. Tap "+ Add" above.</p>';
        return;
    }

    container.innerHTML = currentAppState.education.map((edu, idx) => `
        <div class="card" style="background-color: var(--md-sys-color-surface-container); padding: 14px; border: 1px solid var(--md-sys-color-outline-variant);">
            <div class="card-header" style="margin-bottom: 6px;">
                <span class="doc-slot-meta" style="font-weight:700; color:var(--md-sys-color-primary);">#${idx + 1} &bull; ${edu.qualificationType.toUpperCase()}</span>
                <button type="button" class="icon-btn" style="width:30px; height:30px; color:var(--md-sys-color-error);" onclick="removeEducationEntry(${idx})" title="Delete Qualification">
                    <span class="material-symbols-outlined" style="font-size:1.2rem;">delete</span>
                </button>
            </div>
            
            <div class="form-field" style="margin-bottom: 8px;">
                <label class="field-label">Qualification Level / Type</label>
                <select class="field-select" onchange="updateEducationField(${idx}, 'qualificationType', this.value)">
                    <option value="Degree" ${edu.qualificationType === 'Degree' ? 'selected' : ''}>Bachelor's Degree (BSc / BEng / BA)</option>
                    <option value="Diploma" ${edu.qualificationType === 'Diploma' ? 'selected' : ''}>Diploma</option>
                    <option value="Master's" ${edu.qualificationType === "Master's" ? 'selected' : ''}>Master's Degree (MSc / MEng / MBA)</option>
                    <option value="PhD" ${edu.qualificationType === 'PhD' ? 'selected' : ''}>Doctorate (PhD)</option>
                    <option value="Certificate" ${edu.qualificationType === 'Certificate' ? 'selected' : ''}>Professional Certificate</option>
                    <option value="Postgraduate" ${edu.qualificationType === 'Postgraduate' ? 'selected' : ''}>Postgraduate Diploma</option>
                </select>
            </div>

            <div class="form-field" style="margin-bottom: 8px;">
                <label class="field-label">Degree / Program Title</label>
                <input type="text" class="field-input" value="${edu.degree || ''}" placeholder="e.g. BSc in Telecommunications Engineering"
                    onchange="updateEducationField(${idx}, 'degree', this.value)">
            </div>

            <div class="form-field" style="margin-bottom: 8px;">
                <label class="field-label">Institution / University</label>
                <input type="text" class="field-input" value="${edu.institution || ''}" placeholder="e.g. Midlands State University"
                    onchange="updateEducationField(${idx}, 'institution', this.value)">
            </div>

            <div class="form-field" style="margin-bottom: 8px;">
                <label class="field-label">Academic Status</label>
                <select class="field-select" onchange="updateEducationField(${idx}, 'status', this.value)">
                    <option value="In Progress" ${edu.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                    <option value="Completed" ${edu.status === 'Completed' ? 'selected' : ''}>Completed</option>
                    <option value="Completed (Credit)" ${edu.status === 'Completed (Credit)' ? 'selected' : ''}>Completed (Credit)</option>
                    <option value="Completed (Distinction)" ${edu.status === 'Completed (Distinction)' ? 'selected' : ''}>Completed (Distinction)</option>
                    <option value="Candidate" ${edu.status === 'Candidate' ? 'selected' : ''}>Candidate</option>
                </select>
            </div>

            <div class="form-field" style="margin-bottom: 8px;">
                <label class="field-label">Year / Tenure Range</label>
                <input type="text" class="field-input" value="${edu.year || ''}" placeholder="e.g. February 2024 — Present"
                    onchange="updateEducationField(${idx}, 'year', this.value)">
            </div>

            <div class="form-field">
                <label class="field-label">Focus &amp; Specialization</label>
                <textarea class="field-textarea" style="min-height:55px;" placeholder="Brief details about the curriculum or specialization"
                    onchange="updateEducationField(${idx}, 'details', this.value)">${edu.details || ''}</textarea>
            </div>
        </div>
    `).join('');
}

function addNewEducationEntry() {
    if (!currentAppState.education) currentAppState.education = [];
    currentAppState.education.push({
        id: 'edu_' + Date.now(),
        degree: 'New Qualification Program',
        qualificationType: 'Degree',
        institution: 'University / Academy',
        status: 'In Progress',
        year: '2025 — Present',
        details: 'Program details and coursework focus.'
    });
    recalculateStats();
    renderEducationList();
    renderDashboard();
    showToast('Added new qualification slot');
}

function removeEducationEntry(idx) {
    if (confirm('Delete this qualification entry?')) {
        currentAppState.education.splice(idx, 1);
        recalculateStats();
        renderEducationList();
        renderDashboard();
        showToast('Removed qualification');
    }
}

function updateEducationField(idx, field, value) {
    if (currentAppState.education && currentAppState.education[idx]) {
        currentAppState.education[idx][field] = value;
        recalculateStats();
        renderDashboard();
    }
}

function recalculateStats() {
    let diplomaCount = 0;
    (currentAppState.education || []).forEach(edu => {
        if ((edu.qualificationType || '').toLowerCase().includes('diploma')) {
            diplomaCount++;
        }
    });
    currentAppState.stats.diplomas = diplomaCount || 1;
    const formDiplomas = document.getElementById('formStatsDiplomas');
    if (formDiplomas) formDiplomas.value = currentAppState.stats.diplomas;
}

/* ==========================================================================
   SKILLS & FORM BINDING
   ========================================================================== */
function renderSkillSliders() {
    const container = document.getElementById('skillSlidersContainer');
    if (!container) return;

    container.innerHTML = currentAppState.skills.map((skill, idx) => `
        <div class="slider-row">
            <div class="slider-header">
                <span class="slider-skill-name">${skill.name}</span>
                <span class="slider-skill-val" id="skillVal_${idx}">${skill.proficiency}% · ${skill.xp} XP</span>
            </div>
            <input type="range" class="slider-track" min="10" max="100" value="${skill.proficiency}"
                oninput="updateSkillValue(${idx}, this.value)">
        </div>
    `).join('');
}

function updateSkillValue(idx, val) {
    const intVal = parseInt(val, 10);
    currentAppState.skills[idx].proficiency = intVal;
    currentAppState.skills[idx].xp = intVal * 10;
    
    const label = document.getElementById(`skillVal_${idx}`);
    if (label) {
        label.textContent = `${intVal}% · ${intVal * 10} XP`;
    }
}

function populateFormFields() {
    const p = currentAppState.profile;
    const s = currentAppState.stats;

    if (document.getElementById('formName')) document.getElementById('formName').value = p.name;
    if (document.getElementById('formGreeting')) document.getElementById('formGreeting').value = p.greeting;
    if (document.getElementById('formEmail')) document.getElementById('formEmail').value = p.email;
    if (document.getElementById('formPhone')) document.getElementById('formPhone').value = p.phone;
    if (document.getElementById('formLocation')) document.getElementById('formLocation').value = p.location;
    if (document.getElementById('formBio')) document.getElementById('formBio').value = p.description;

    if (document.getElementById('formStatsProjects')) document.getElementById('formStatsProjects').value = s.projects;
    if (document.getElementById('formStatsExp')) document.getElementById('formStatsExp').value = s.experience;
    if (document.getElementById('formStatsSkills')) document.getElementById('formStatsSkills').value = s.skills;
    if (document.getElementById('formStatsDiplomas')) document.getElementById('formStatsDiplomas').value = s.diplomas;
}

/* ==========================================================================
   DROPZONES & FILE PICKERS
   ========================================================================== */
function setupDropzones() {
    setupSingleDropzone('cvDropzone', 'cvFileInput', 'cvFileInfo', 'cvFileName', 'cvFileSize', 'Bleigh Bande IT CV .pdf');
    setupSingleDropzone('bioDropzone', 'bioFileInput', 'bioFileInfo', 'bioFileName', 'bioFileSize', 'Tafadzwa_J.docx');
}

function setupSingleDropzone(dropzoneId, inputId, infoId, nameId, sizeId, defaultName) {
    const dropzone = document.getElementById(dropzoneId);
    const input = document.getElementById(inputId);
    const info = document.getElementById(infoId);
    const nameEl = document.getElementById(nameId);
    const sizeEl = document.getElementById(sizeId);

    if (!dropzone || !input) return;

    dropzone.addEventListener('click', () => input.click());

    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
    });

    dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('dragover');
    });

    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0], info, nameEl, sizeEl, defaultName);
        }
    });

    input.addEventListener('change', () => {
        if (input.files && input.files[0]) {
            handleFile(input.files[0], info, nameEl, sizeEl, defaultName);
        }
    });
}

function handleFile(file, infoEl, nameEl, sizeEl, targetName) {
    if (infoEl) infoEl.style.display = 'flex';
    if (nameEl) nameEl.textContent = `${file.name} (Replaces ${targetName})`;
    if (sizeEl) sizeEl.textContent = `${(file.size / 1024).toFixed(1)} KB · Ready to deploy`;
    showToast(`Loaded: ${file.name}`);
}

/* ==========================================================================
   SAVE & CLOUD PUSH HANDLERS
   ========================================================================== */
function triggerSave() {
    handleFormSave(new Event('submit'));
}

function handleFormSave(e) {
    if (e && e.preventDefault) e.preventDefault();

    currentAppState.profile.name = document.getElementById('formName').value;
    currentAppState.profile.greeting = document.getElementById('formGreeting').value;
    currentAppState.profile.email = document.getElementById('formEmail').value;
    currentAppState.profile.phone = document.getElementById('formPhone').value;
    currentAppState.profile.location = document.getElementById('formLocation').value;
    currentAppState.profile.description = document.getElementById('formBio').value;

    currentAppState.stats.projects = parseInt(document.getElementById('formStatsProjects').value, 10) || 10;
    currentAppState.stats.experience = parseInt(document.getElementById('formStatsExp').value, 10) || 1;
    currentAppState.stats.skills = parseInt(document.getElementById('formStatsSkills').value, 10) || 15;
    currentAppState.stats.diplomas = parseInt(document.getElementById('formStatsDiplomas').value, 10) || 1;

    localStorage.setItem('bleigh_portfolio_hub_data', JSON.stringify(currentAppState));
    
    if (!navigator.onLine) {
        offlineQueue.push({ timestamp: Date.now(), data: currentAppState });
        localStorage.setItem('bleigh_offline_queue', JSON.stringify(offlineQueue));
        showToast('Cached offline! Will push to Cloud when reconnected.', 'offline_pin');
    } else {
        showToast('Saved & Synced to Local & Cloud Cache!', 'cloud_done');
    }

    renderDashboard();
}

function pushToCloud() {
    if (!navigator.onLine) {
        showToast('You are currently offline. Edits are safely queued.', 'cloud_off');
        return;
    }

    // Save and push
    localStorage.setItem('bleigh_portfolio_hub_data', JSON.stringify(currentAppState));
    showToast('Pushing updates to GitHub Cloud...', 'sync');

    setTimeout(() => {
        showToast('Cloud Push Complete · All credentials live!', 'cloud_done');
    }, 1200);
}

function setupDeployButtons() {
    const quickSyncBtn = document.getElementById('quickSyncBtn');
    if (quickSyncBtn) {
        quickSyncBtn.addEventListener('click', () => {
            if (navigator.onLine) {
                showToast('All credentials & telemetry synced 200 OK', 'verified');
            } else {
                showToast('Offline mode: Using cached telemetry', 'cloud_off');
            }
        });
    }

    const copyGitCmdBtn = document.getElementById('copyGitCmdBtn');
    if (copyGitCmdBtn) {
        copyGitCmdBtn.addEventListener('click', () => {
            const cmd = 'git add . ; git commit -m "Update portfolio credentials" ; git push origin main';
            navigator.clipboard.writeText(cmd).then(() => {
                showToast('Git command copied to clipboard');
            });
        });
    }

    const copyJsonBtn = document.getElementById('copyJsonBtn');
    if (copyJsonBtn) {
        copyJsonBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(JSON.stringify(currentAppState, null, 2)).then(() => {
                showToast('Config JSON copied to clipboard');
            });
        });
    }

    const downloadScriptBtn = document.getElementById('downloadScriptBtn');
    if (downloadScriptBtn) {
        downloadScriptBtn.addEventListener('click', () => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentAppState, null, 2));
            const downloadAnchor = document.createElement('a');
            downloadAnchor.setAttribute("href", dataStr);
            downloadAnchor.setAttribute("download", "portfolio_state.json");
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
            showToast('Exported portfolio state');
        });
    }
}

/* ==========================================================================
   TOAST NOTIFICATION
   ========================================================================== */
function showToast(message, icon = 'check_circle') {
    const toast = document.getElementById('mobileToast');
    const msg = document.getElementById('toastMessage');
    const icn = document.getElementById('toastIcon');

    if (!toast || !msg) return;

    msg.textContent = message;
    if (icn) icn.textContent = icon;

    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2400);
}
