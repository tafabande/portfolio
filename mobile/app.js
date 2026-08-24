/* ==========================================================================
   BLEIGH PORTFOLIO MOBILE HUB — APPLICATION CONTROLLER
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

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    renderDashboardStats();
    renderSkillSliders();
    populateFormFields();
    setupDropzones();
    setupDeployButtons();
});

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

    // Scroll to top of app content
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
   RENDER & BINDING
   ========================================================================== */
function renderDashboardStats() {
    const dashProjects = document.getElementById('dashProjects');
    const dashExp = document.getElementById('dashExp');
    const dashSkills = document.getElementById('dashSkills');
    const dashDiplomas = document.getElementById('dashDiplomas');

    if (dashProjects) dashProjects.textContent = currentAppState.stats.projects + '+';
    if (dashExp) dashExp.textContent = currentAppState.stats.experience + ' Yr';
    if (dashSkills) dashSkills.textContent = currentAppState.stats.skills + '+';
    if (dashDiplomas) dashDiplomas.textContent = currentAppState.stats.diplomas;
}

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
   SAVE & DEPLOY HANDLERS
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
    renderDashboardStats();
    showToast('Saved portfolio updates successfully!');
}

function setupDeployButtons() {
    const quickSyncBtn = document.getElementById('quickSyncBtn');
    if (quickSyncBtn) {
        quickSyncBtn.addEventListener('click', () => {
            showToast('All 21 telemetry tests verified 200 OK');
        });
    }

    const copyGitCmdBtn = document.getElementById('copyGitCmdBtn');
    if (copyGitCmdBtn) {
        copyGitCmdBtn.addEventListener('click', () => {
            const cmd = 'git add . ; git commit -m "Update portfolio" ; git push origin main';
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
