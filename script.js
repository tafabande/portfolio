/* Hallmark · macrostructure: workbench · genre: modern-minimal · theme: cobalt
 * Interactive systems logic, Command Palette (⌘K), GitHub API integration,
 * dynamic telemetry, and EmailJS form handling.
 */

const portfolioData = {
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
        description: "Innovative and technically-driven telecommunications engineering scholar at Midlands State University with a foundational Diploma from Trust Academy. Vice President of the Data Science MSU Charter. Experienced in network switching, fiber diagnostics, IT system automation, and modern web application development.",
        email: "bleighbande@gmail.com",
        phone: "0776688563",
        location: "Gweru, Zimbabwe",
        dob: "20 January 2000"
    },
    highlights: [
        { icon: "cell_tower", title: "Telecom Systems", desc: "RF signal processing, circuit & packet switching, fiber routing" },
        { icon: "code", title: "Software Development", desc: "HTML5, modern CSS, Python, Flask, JavaScript & REST APIs" },
        { icon: "support_agent", title: "IT Infrastructure", desc: "Enterprise troubleshooting, database inventory & system automation" },
        { icon: "groups", title: "Academic Leadership", desc: "Vice President — Data Science MSU Charter" }
    ],
    stats: {
        projects: 10,
        experience: 4,
        skills: 15,
        certifications: 2
    },
    skills: [
        {
            category: "Networking & Telecoms",
            icon: "lan",
            items: [
                { name: "LAN/WAN Config", proficiency: 85, xp: 850 },
                { name: "Cisco Packet Tracer", proficiency: 80, xp: 800 },
                { name: "Fiber Optics", proficiency: 75, xp: 750 },
                { name: "Signal Processing", proficiency: 70, xp: 700 },
                { name: "Telecoms Switching", proficiency: 75, xp: 750 }
            ]
        },
        {
            category: "Web Technologies",
            icon: "web",
            items: [
                { name: "HTML5 & CSS3", proficiency: 90, xp: 900 },
                { name: "Responsive Architecture", proficiency: 88, xp: 880 },
                { name: "JavaScript & DOM APIs", proficiency: 82, xp: 820 },
                { name: "REST APIs Integration", proficiency: 78, xp: 780 },
                { name: "Flask Web Framework", proficiency: 70, xp: 700 }
            ]
        },
        {
            category: "Programming",
            icon: "data_object",
            items: [
                { name: "Python", proficiency: 85, xp: 850 },
                { name: "C / Embedded", proficiency: 70, xp: 700 },
                { name: "SQL Querying", proficiency: 80, xp: 800 },
                { name: "Git & Version Control", proficiency: 85, xp: 850 }
            ]
        },
        {
            category: "Databases",
            icon: "storage",
            items: [
                { name: "MySQL", proficiency: 80, xp: 800 },
                { name: "SQLite", proficiency: 75, xp: 750 },
                { name: "TinyDB", proficiency: 70, xp: 700 },
                { name: "Database Asset Inventory", proficiency: 85, xp: 850 }
            ]
        },
        {
            category: "IT Support & Tools",
            icon: "build_circle",
            items: [
                { name: "Windows OS Architecture", proficiency: 90, xp: 900 },
                { name: "Hardware Diagnostics", proficiency: 88, xp: 880 },
                { name: "Troubleshooting & SLA", proficiency: 85, xp: 850 },
                { name: "Process Automation", proficiency: 80, xp: 800 }
            ]
        },
        {
            category: "Emerging Tech",
            icon: "auto_awesome",
            items: [
                { name: "Generative AI Workflows", proficiency: 80, xp: 800 },
                { name: "Data Science Tooling", proficiency: 78, xp: 780 },
                { name: "Cybersecurity Fundamentals", proficiency: 72, xp: 720 }
            ]
        }
    ],
    experience: [
        {
            title: "Vice President — Data Science MSU Charter",
            company: "Midlands State University",
            startDate: "2025-02",
            endDate: null, // Ongoing active role (autodetects duration to present)
            date: "Feb 2025 — Present",
            description: "Leading the MSU Data Science Charter, orchestrating practical analytical workshops, student technical cohorts, and university-wide hackathons. Liaising between engineering faculties and industry partners."
        },
        {
            title: "IT Support & Systems Intern",
            company: "Parirenyatwa Group Of Hospitals",
            startDate: "2021-01",
            endDate: "2021-12", // Completed internship
            date: "2021",
            description: "Engineered and deployed a centralized IT inventory database, reducing manual tracking errors by 30%. Collaborated on linking the Annexe Psychiatric Hospital to the hospital core network and upgraded infrastructure for Sekuru Kaguvi Eye Hospital. Automated user reset requests log, cutting manual workload by 40%."
        }
    ],
    education: [
        {
            degree: "BSc Telecommunications Engineering",
            icon: "school",
            institution: "Midlands State University",
            startDate: "2024-02",
            endDate: null, // Ongoing degree (autodetects to present)
            year: "Feb 2024 — Present",
            details: "Specializing in advanced optical communication, RF signal propagation, digital switching architectures, and computer networking."
        },
        {
            degree: "Diploma in Telecommunications",
            icon: "workspace_premium",
            institution: "Trust Academy",
            startDate: "2017-06",
            endDate: "2023-06",
            year: "June 2017 — June 2023",
            details: "Rigorous hands-on engineering foundation in digital telecommunications, electronics, signals, and routing protocols."
        }
    ],
    contact: {
        email: "bleighbande@gmail.com",
        phone: "0776688563",
        location: "Gweru, Zimbabwe",
        linkedin: "https://linkedin.com/in/bleighbande",
        github: "https://github.com/tafabande"
    },
    github: {
        username: "tafabande"
    },
    emailjs: {
        publicKey: "iGpebApjTDVfppOM0",
        serviceId: "service_q7qmugv",
        templateId: "template_iqwypms"
    },
    testimonials: [
        {
            name: "Mr R. Takavada",
            role: "Manager — Parirenyatwa Group Of Hospitals",
            text: "Bleigh demonstrated exceptional technical aptitude and initiative during his tenure, notably automating asset tracking logs and modernizing clinical network segments.",
            avatar: "RT"
        }
    ]
};

const formSubmitTimes = [];
const cachedElements = {};

function cacheElement(id) {
    if (!cachedElements[id]) {
        cachedElements[id] = document.getElementById(id);
    }
    return cachedElements[id];
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        populateAbout();
        populateSkills();
        populateExperience();
        populateEducation();
        populateTestimonials();
        populateContact();
        populateFooter();
        setupNavigation();
        setupThemeToggle();
        setupCounters();
        setupFormValidation();
        initTypedJS();
        fetchGitHubProjects();
        fetchLatestCV();
        setupCommandPalette();
        setupConsoleTabs();
        setupSkillFilters();
        setupLocalTime();
        setupKeyboardNav();
    } catch (error) {
        showToast('Error initializing portfolio. Please refresh the page.', 'error');
    }
});

/* ==========================================================================
   LIVE TIME CLOCK (Gweru, Zimbabwe - UTC+2)
   ========================================================================== */
function setupLocalTime() {
    const el = cacheElement('localTimeDisplay');
    if (!el) return;

    function update() {
        try {
            const options = {
                timeZone: 'Africa/Harare',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            };
            const timeStr = new Intl.DateTimeFormat('en-GB', options).format(new Date());
            el.innerHTML = `Gweru, ZW &bull; <strong>${timeStr} CAT</strong> (UTC+2)`;
        } catch (e) {
            el.textContent = 'Gweru, ZW • UTC+2';
        }
    }

    update();
    setInterval(update, 30000);
}

/* ==========================================================================
   WORKBENCH CONSOLE TABS
   ========================================================================== */
function setupConsoleTabs() {
    const tabs = document.querySelectorAll('.console-tab');
    const panels = document.querySelectorAll('.console-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            panels.forEach(p => p.classList.remove('active'));

            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');

            const targetId = tab.getAttribute('data-tab') === 'telemetry' ? 'panelTelemetry' : 'panelMetrics';
            const targetPanel = document.getElementById(targetId);
            if (targetPanel) targetPanel.classList.add('active');
        });
    });
}

/* ==========================================================================
   SKILL CAPABILITY MATRIX & FILTERING
   ========================================================================== */
function setupSkillFilters() {
    const filterBtns = document.querySelectorAll('.skill-filter-btn');
    const grid = cacheElement('skillsGrid');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            const cards = grid.querySelectorAll('.skill-category-card');

            cards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/* ==========================================================================
   TYPED.JS HERO SUBTITLE
   ========================================================================== */
function initTypedJS() {
    const el = cacheElement('heroSubtitle');
    if (!el) return;

    if (typeof Typed !== 'undefined') {
        try {
            el.textContent = '';
            new Typed('#heroSubtitle', {
                strings: portfolioData.profile.titles,
                typeSpeed: 30,
                backSpeed: 20,
                backDelay: 1800,
                startDelay: 200,
                loop: true,
                showCursor: true,
                cursorChar: '|'
            });
        } catch (e) {
            el.textContent = portfolioData.profile.titles[0];
        }
    } else {
        el.textContent = portfolioData.profile.titles[0];
    }
}

/* ==========================================================================
   COMMAND PALETTE (⌘K / Ctrl+K)
   ========================================================================== */
function setupCommandPalette() {
    const modal = cacheElement('cmdPaletteModal');
    const triggerBtn = cacheElement('cmdPaletteBtn');
    const searchInput = cacheElement('cmdSearchInput');
    const resultsContainer = cacheElement('cmdResults');
    if (!modal || !searchInput || !resultsContainer) return;

    const commands = [
        { id: 'home', icon: 'home', title: 'Home', subtitle: 'Jump to top of portfolio', action: () => scrollToSection('home') },
        { id: 'about', icon: 'person', title: 'About Dossier', subtitle: 'Background & leadership', action: () => scrollToSection('about') },
        { id: 'skills', icon: 'code', title: 'Skills & Capabilities', subtitle: 'Technical engineering matrix', action: () => scrollToSection('skills') },
        { id: 'experience', icon: 'work_history', title: 'Experience Log', subtitle: 'Parirenyatwa & MSU leadership', action: () => scrollToSection('experience') },
        { id: 'education', icon: 'school', title: 'Education & Credentials', subtitle: 'BSc Telecoms & Diploma', action: () => scrollToSection('education') },
        { id: 'projects', icon: 'deployed_code', title: 'Featured Projects', subtitle: 'GitHub synchronized code', action: () => scrollToSection('projects') },
        { id: 'testimonials', icon: 'format_quote', title: 'Testimonials', subtitle: 'Verified recommendations', action: () => scrollToSection('testimonials') },
        { id: 'contact', icon: 'chat', title: 'Get In Touch', subtitle: 'Direct contact & message terminal', action: () => scrollToSection('contact') },
        { id: 'theme', icon: 'dark_mode', title: 'Toggle Theme', subtitle: 'Switch between Dark & Light mode', action: toggleTheme },
        { id: 'cv', icon: 'download', title: 'Download CV', subtitle: 'Download latest PDF Resume', action: downloadCV },
        { id: 'email', icon: 'content_copy', title: 'Copy Email', subtitle: 'bleighbande@gmail.com', action: copyEmailToClipboard },
        { id: 'github', icon: 'terminal', title: 'Open GitHub', subtitle: 'github.com/tafabande', action: () => window.open(portfolioData.contact.github, '_blank') },
        { id: 'linkedin', icon: 'work', title: 'Open LinkedIn', subtitle: 'linkedin.com/in/bleighbande', action: () => window.open(portfolioData.contact.linkedin, '_blank') }
    ];

    let selectedIndex = 0;
    let filteredCommands = [...commands];

    function renderResults() {
        resultsContainer.innerHTML = '';
        if (filteredCommands.length === 0) {
            resultsContainer.innerHTML = '<div style="padding:1.5rem;text-align:center;color:var(--color-ink-muted);font-family:var(--font-mono);font-size:0.85rem;">No matching commands found</div>';
            return;
        }

        filteredCommands.forEach((cmd, idx) => {
            const item = document.createElement('div');
            item.className = `cmd-item ${idx === selectedIndex ? 'selected' : ''}`;
            item.setAttribute('role', 'option');
            item.setAttribute('aria-selected', idx === selectedIndex ? 'true' : 'false');
            item.innerHTML = `
                <div class="cmd-item-left">
                    <span class="material-symbols-outlined cmd-item-icon">${cmd.icon}</span>
                    <div>
                        <div style="font-weight:600;color:inherit;">${cmd.title}</div>
                        <div style="font-size:0.75rem;opacity:0.75;font-family:var(--font-mono);">${cmd.subtitle}</div>
                    </div>
                </div>
                <span class="material-symbols-outlined" style="font-size:0.9rem;opacity:0.6;">arrow_forward</span>
            `;
            item.addEventListener('click', () => {
                executeCommand(cmd);
            });
            resultsContainer.appendChild(item);
        });

        const activeEl = resultsContainer.children[selectedIndex];
        if (activeEl) activeEl.scrollIntoView({ block: 'nearest' });
    }

    function openModal() {
        modal.removeAttribute('hidden');
        searchInput.value = '';
        filteredCommands = [...commands];
        selectedIndex = 0;
        renderResults();
        setTimeout(() => searchInput.focus(), 50);
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.setAttribute('hidden', '');
        document.body.style.overflow = '';
    }

    function executeCommand(cmd) {
        closeModal();
        if (cmd && typeof cmd.action === 'function') {
            cmd.action();
        }
    }

    function scrollToSection(id) {
        const sec = document.getElementById(id);
        if (sec) {
            sec.scrollIntoView({ behavior: 'smooth' });
        }
    }

    function toggleTheme() {
        const btn = cacheElement('themeToggle');
        if (btn) btn.click();
    }

    function downloadCV() {
        const btn = cacheElement('cvDownloadBtn');
        if (btn) btn.click();
    }

    searchInput.addEventListener('input', () => {
        const q = searchInput.value.toLowerCase().trim();
        filteredCommands = commands.filter(c => 
            c.title.toLowerCase().includes(q) || 
            c.subtitle.toLowerCase().includes(q) ||
            c.id.toLowerCase().includes(q)
        );
        selectedIndex = 0;
        renderResults();
    });

    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (filteredCommands.length > 0) {
                selectedIndex = (selectedIndex + 1) % filteredCommands.length;
                renderResults();
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (filteredCommands.length > 0) {
                selectedIndex = (selectedIndex - 1 + filteredCommands.length) % filteredCommands.length;
                renderResults();
            }
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (filteredCommands[selectedIndex]) {
                executeCommand(filteredCommands[selectedIndex]);
            }
        } else if (e.key === 'Escape') {
            e.preventDefault();
            closeModal();
        }
    });

    if (triggerBtn) {
        triggerBtn.addEventListener('click', openModal);
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            if (modal.hasAttribute('hidden')) {
                openModal();
            } else {
                closeModal();
            }
        } else if (e.key === 'Escape' && !modal.hasAttribute('hidden')) {
            closeModal();
        }
    });
}

function copyEmailToClipboard() {
    const email = portfolioData.contact.email;
    navigator.clipboard.writeText(email).then(() => {
        showToast(`Email copied: ${email}`, 'success');
    }).catch(() => {
        showToast(`Contact email: ${email}`, 'info');
    });
}

/* ==========================================================================
   GITHUB REPOSITORIES API & LOCALSTORAGE CACHE
   ========================================================================== */
async function fetchGitHubProjects() {
    const grid = cacheElement('projectsGrid');
    if (!grid) return;

    const username = portfolioData.github.username;
    const cacheKey = 'github_projects_cache';
    const cacheTimeKey = 'github_projects_cache_time';
    const cacheExpiry = 60 * 60 * 1000; // 1 hour

    grid.innerHTML = `
        <div class="loading-state">
            <span class="material-symbols-outlined" style="font-size:2rem;color:var(--color-accent);animation:spin 1s linear infinite;">progress_activity</span>
            <p style="margin-top:0.75rem;color:var(--color-ink-muted);">Synchronizing verified projects from GitHub...</p>
        </div>`;

    let repos = [];
    let usedCache = false;

    const fallbackProjects = [
        {
            name: "telecom-inventory-systems",
            description: "Centralized IT asset tracking & network hardware database implemented at Parirenyatwa Hospitals.",
            language: "Python",
            stargazers_count: 3,
            html_url: "https://github.com/tafabande",
            homepage: "https://tafabande.github.io/portfolio/"
        },
        {
            name: "cisco-packet-tracer-labs",
            description: "Simulated enterprise LAN/WAN topologies, VLAN routing, and OSPF/BGP routing configuration models.",
            language: "Cisco IOS",
            stargazers_count: 5,
            html_url: "https://github.com/tafabande"
        },
        {
            name: "msu-data-science-portal",
            description: "Community workshops platform and data science learning repository for Midlands State University charter.",
            language: "JavaScript",
            stargazers_count: 8,
            html_url: "https://github.com/tafabande"
        },
        {
            name: "flask-network-monitor",
            description: "Real-time subnet scanning, packet latency diagnostics, and network service uptime monitoring tool.",
            language: "Python",
            stargazers_count: 4,
            html_url: "https://github.com/tafabande"
        }
    ];

    try {
        const cachedTime = localStorage.getItem(cacheTimeKey);
        const cachedData = localStorage.getItem(cacheKey);

        if (cachedData && cachedTime && (Date.now() - parseInt(cachedTime)) < cacheExpiry) {
            repos = JSON.parse(cachedData);
            usedCache = true;
        } else {
            const res = await fetch(`https://api.github.com/users/${username}/repos?sort=pushed&direction=desc&per_page=20&type=owner`);
            if (!res.ok) {
                if (res.status === 403 || res.status === 429) throw new Error('Rate limit exceeded');
                throw new Error('GitHub API error');
            }
            repos = await res.json();
            if (Array.isArray(repos)) {
                localStorage.setItem(cacheKey, JSON.stringify(repos));
                localStorage.setItem(cacheTimeKey, Date.now().toString());
            }
        }
    } catch (err) {
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
            try {
                repos = JSON.parse(cachedData);
                usedCache = true;
                showToast('Displaying cached repositories — GitHub rate limit active.', 'info');
            } catch (e) {
                repos = fallbackProjects;
            }
        } else {
            repos = fallbackProjects;
        }
    }

    if (!Array.isArray(repos) || repos.length === 0) {
        repos = fallbackProjects;
    }

    const filtered = repos
        .filter(r => !r.fork)
        .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
        .slice(0, 6);

    if (filtered.length === 0) {
        grid.innerHTML = '<div class="loading-state">No public repositories discovered.</div>';
        return;
    }

    grid.innerHTML = filtered.map(repo => `
        <article class="project-card">
            <div class="project-card-top">
                <div class="project-badge-row">
                    <span class="project-lang-badge">${repo.language || 'Software'}</span>
                    <div class="project-stars-badge">
                        <span class="material-symbols-outlined">star</span>
                        <span>${repo.stargazers_count || 0}</span>
                    </div>
                </div>
                <h3 class="project-title">${(repo.name || '').replace(/-/g, ' ').replace(/_/g, ' ')}</h3>
                <p class="project-desc">${repo.description || 'Telecommunications & web engineering repository on GitHub.'}</p>
            </div>
            <div class="project-card-footer">
                <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="project-link" aria-label="View source for ${repo.name}">
                    <span class="material-symbols-outlined">code</span>
                    Source Code
                </a>
                ${repo.homepage ? `
                    <a href="${repo.homepage}" target="_blank" rel="noopener noreferrer" class="project-link" aria-label="View live demo for ${repo.name}">
                        <span class="material-symbols-outlined">open_in_new</span>
                        Live Demo
                    </a>
                ` : ''}
            </div>
        </article>
    `).join('');
}

/* ==========================================================================
   DYNAMIC CV DOWNLOAD DETECTOR
   ========================================================================== */
async function fetchLatestCV() {
    const btn = cacheElement('cvDownloadBtn');
    if (!btn) return;

    try {
        const username = portfolioData.github.username;
        const pathSegments = window.location.pathname.split('/').filter(s => s);
        const repo = pathSegments.length > 0 ? pathSegments[0] : 'portfolio';

        const res = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/`);
        if (!res.ok) return;

        const files = await res.json();
        if (!Array.isArray(files)) return;

        const cvFiles = files.filter(f =>
            f.name && f.name.toLowerCase().endsWith('.pdf') &&
            (f.name.toLowerCase().includes('cv') || f.name.toLowerCase().includes('resume'))
        );

        if (cvFiles.length > 0) {
            cvFiles.sort((a, b) => b.name.localeCompare(a.name));
            btn.href = cvFiles[0].download_url || cvFiles[0].path;
            btn.download = cvFiles[0].name;
        }
    } catch (err) {}
}

/* ==========================================================================
   NAVIGATION & ACTIVE SCROLL INDICATOR
   ========================================================================== */
function setupNavigation() {
    const hamburger = cacheElement('hamburger');
    const navMenu = cacheElement('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', isOpen);
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            if (!targetId) return;

            const target = document.getElementById(targetId.substring(1));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                if (navMenu) navMenu.classList.remove('active');
                if (hamburger) {
                    hamburger.classList.remove('active');
                    hamburger.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });

    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(l => l.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }, { threshold: 0.25, rootMargin: '-70px 0px -50% 0px' });
    sections.forEach(s => observer.observe(s));
}

/* ==========================================================================
   THEME TOGGLE
   ========================================================================== */
function setupThemeToggle() {
    const toggle = cacheElement('themeToggle');
    if (!toggle) return;

    const icon = toggle.querySelector('.material-symbols-outlined');
    const saved = localStorage.getItem('theme');

    if (saved === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        if (icon) icon.textContent = 'light_mode';
    }

    toggle.addEventListener('click', () => {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        if (isLight) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'dark');
            if (icon) icon.textContent = 'dark_mode';
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            if (icon) icon.textContent = 'light_mode';
        }
    });
}

/* ==========================================================================
   ANIMATED STAT COUNTERS
   ========================================================================== */
function setupCounters() {
    const counters = [
        { el: cacheElement('statsProjects'), target: portfolioData.stats.projects, suffix: '+' },
        { el: cacheElement('statsExperience'), target: portfolioData.stats.experience, suffix: '+' },
        { el: cacheElement('statsSkills'), target: portfolioData.stats.skills, suffix: '+' },
        { el: cacheElement('statsDiplomas'), target: portfolioData.stats.certifications, suffix: '+' },
    ];

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                counters.forEach(c => animateCounter(c.el, c.target, c.suffix));
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) observer.observe(statsSection);
}

function animateCounter(el, target, suffix = '+') {
    if (!el) return;
    let current = 0;
    const increment = target / 30;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        el.textContent = Math.floor(current) + suffix;
    }, 30);
}

/* ==========================================================================
   POPULATE SECTIONS
   ========================================================================== */
function populateAbout() {
    const aboutText = cacheElement('aboutText');
    const aboutHighlights = cacheElement('aboutHighlights');

    if (aboutText) {
        aboutText.innerHTML = `
            <p>${portfolioData.profile.description}</p>
            <p>From designing centralized inventory systems for major healthcare complexes to upgrading local network infrastructure, I focus on measurable efficiency, reliability, and clean engineering.</p>
        `;
    }

    if (aboutHighlights) {
        aboutHighlights.innerHTML = portfolioData.highlights.map(h => `
            <div class="highlight-item">
                <div class="highlight-icon-box">
                    <span class="material-symbols-outlined">${h.icon}</span>
                </div>
                <div class="highlight-content">
                    <h3 class="highlight-title">${h.title}</h3>
                    <p class="highlight-desc">${h.desc}</p>
                </div>
            </div>
        `).join('');
    }
}

function populateSkills() {
    const grid = cacheElement('skillsGrid');
    if (!grid) return;

    grid.innerHTML = portfolioData.skills.map(group => `
        <div class="skill-category-card" data-category="${group.category}">
            <div class="skill-category-header">
                <span class="material-symbols-outlined skill-cat-icon">${group.icon}</span>
                <h3 class="skill-cat-title">${group.category}</h3>
            </div>
            <div class="skill-items-list">
                ${group.items.map(skill => `
                    <div class="skill-item-row">
                        <div class="skill-item-meta">
                            <span class="skill-name">${skill.name}</span>
                            <span class="skill-points">${skill.xp || (skill.proficiency * 10)} XP</span>
                        </div>
                        <div class="skill-bar-track">
                            <div class="skill-bar-fill" style="width: ${skill.proficiency}%"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

function formatTimelineDate(item) {
    if (!item.startDate) {
        return {
            dateStr: item.date || item.year || '',
            durationStr: '',
            isOngoing: false
        };
    }

    const isOngoing = !item.endDate || item.endDate.toLowerCase() === 'present';
    const start = new Date(item.startDate + '-01');
    const end = isOngoing ? new Date() : new Date(item.endDate + '-01');

    // Calculate actual elapsed duration
    const totalMonths = Math.max(1, (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1);
    let durationStr = '';
    const yrs = Math.floor(totalMonths / 12);
    const mos = totalMonths % 12;
    if (yrs > 0 && mos > 0) {
        durationStr = `${yrs} yr${yrs > 1 ? 's' : ''} ${mos} mo${mos > 1 ? 's' : ''}`;
    } else if (yrs > 0) {
        durationStr = `${yrs} yr${yrs > 1 ? 's' : ''}`;
    } else {
        durationStr = `${mos} mo${mos > 1 ? 's' : ''}`;
    }

    return {
        dateStr: item.date || item.year || (isOngoing ? 'Present' : item.endDate),
        durationStr: isOngoing ? `${durationStr} · Ongoing` : durationStr,
        isOngoing: isOngoing
    };
}

function populateExperience() {
    const timeline = cacheElement('experienceTimeline');
    if (!timeline) return;

    timeline.innerHTML = portfolioData.experience.map(exp => {
        const timeInfo = formatTimelineDate(exp);
        return `
            <div class="timeline-item">
                <div class="timeline-header">
                    <h3 class="timeline-title">${exp.title}</h3>
                    <div class="timeline-date-wrap">
                        <span class="timeline-date">${timeInfo.dateStr}</span>
                        ${timeInfo.durationStr ? `<span class="timeline-duration">(${timeInfo.durationStr})</span>` : ''}
                    </div>
                </div>
                <div class="timeline-company">
                    <span class="material-symbols-outlined" style="font-size:1rem;color:var(--color-accent);">business</span>
                    ${exp.company}
                </div>
                <p class="timeline-desc">${exp.description}</p>
            </div>
        `;
    }).join('');
}

function populateEducation() {
    const list = cacheElement('educationList');
    if (!list) return;

    list.innerHTML = portfolioData.education.map(edu => {
        const timeInfo = formatTimelineDate(edu);
        return `
            <div class="education-card">
                <div class="education-icon-wrap">
                    <span class="material-symbols-outlined">${edu.icon}</span>
                </div>
                <div class="education-details">
                    <h3 class="education-degree">${edu.degree}</h3>
                    <div class="education-institution">${edu.institution}</div>
                    <div class="education-year">
                        ${timeInfo.dateStr}
                        ${timeInfo.isOngoing ? `<span class="education-ongoing-tag">In Progress</span>` : ''}
                    </div>
                    <p class="education-info">${edu.details}</p>
                </div>
            </div>
        `;
    }).join('');
}

function populateTestimonials() {
    const grid = cacheElement('testimonialsGrid');
    if (!grid) return;

    grid.innerHTML = portfolioData.testimonials.map(testimonial => `
        <div class="testimonial-card">
            <span class="material-symbols-outlined testimonial-quote-icon">format_quote</span>
            <p class="testimonial-text">"${testimonial.text}"</p>
            <div class="testimonial-author">
                <div class="author-avatar">${testimonial.avatar}</div>
                <div class="author-info">
                    <div class="author-name">${testimonial.name}</div>
                    <div class="author-role">${testimonial.role}</div>
                </div>
            </div>
        </div>
    `).join('');
}

function populateContact() {
    const contactInfo = cacheElement('contactInfo');
    if (!contactInfo) return;

    const c = portfolioData.contact;
    contactInfo.innerHTML = `
        <div class="contact-info-card">
            <span class="material-symbols-outlined contact-icon">mail</span>
            <div class="contact-details">
                <span class="contact-label">Electronic Mail</span>
                <span class="contact-val">${c.email}</span>
                <button type="button" class="copy-email-btn" onclick="copyEmailToClipboard()">
                    <span class="material-symbols-outlined" style="font-size:0.85rem;">content_copy</span> Copy Email
                </button>
            </div>
        </div>
        <div class="contact-info-card">
            <span class="material-symbols-outlined contact-icon">call</span>
            <div class="contact-details">
                <span class="contact-label">Phone &bull; Direct Line</span>
                <span class="contact-val">${c.phone}</span>
            </div>
        </div>
        <div class="contact-info-card">
            <span class="material-symbols-outlined contact-icon">location_on</span>
            <div class="contact-details">
                <span class="contact-label">Station Base</span>
                <span class="contact-val">${c.location}</span>
            </div>
        </div>
    `;
}

function populateFooter() {
    const footerLinks = cacheElement('footerLinks');
    if (!footerLinks) return;

    const c = portfolioData.contact;
    footerLinks.innerHTML = `
        <a href="${c.github}" target="_blank" rel="noopener noreferrer" class="footer-link" aria-label="GitHub">
            GitHub
        </a>
        <a href="${c.linkedin}" target="_blank" rel="noopener noreferrer" class="footer-link" aria-label="LinkedIn">
            LinkedIn
        </a>
        <a href="mailto:${c.email}" class="footer-link" aria-label="Email">
            Direct Email
        </a>
    `;
}

/* ==========================================================================
   FORM VALIDATION & SUBMISSION
   ========================================================================== */
function setupFormValidation() {
    const form = cacheElement('contactForm');
    if (!form) return;

    const ejs = portfolioData.emailjs;
    if (typeof emailjs !== 'undefined' && ejs.publicKey && ejs.publicKey !== 'YOUR_PUBLIC_KEY') {
        try {
            emailjs.init({ publicKey: ejs.publicKey });
        } catch (e) {}
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nameEl = cacheElement('contactName');
        const emailEl = cacheElement('contactEmail');
        const messageEl = cacheElement('contactMessage');
        const btn = cacheElement('submitBtn');

        if (!nameEl || !emailEl || !messageEl || !btn) return;

        if (!checkRateLimit()) {
            showToast('Submission rate limit reached. Please wait 60s.', 'error');
            return;
        }

        const now = new Date();
        const dateField = cacheElement('contactDate');
        const timeField = cacheElement('contactTime');
        if (dateField) dateField.value = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
        if (timeField) timeField.value = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

        let valid = true;
        const nameError = cacheElement('nameError');
        const emailError = cacheElement('emailError');
        const messageError = cacheElement('messageError');

        [nameError, emailError, messageError].forEach(err => {
            if (err) err.textContent = '';
        });

        // Name Validation
        if (!nameEl.value || !nameEl.value.trim()) {
            if (nameEl.parentElement) nameEl.parentElement.classList.add('error');
            if (nameError) nameError.textContent = 'Name is required';
            valid = false;
        } else {
            if (nameEl.parentElement) nameEl.parentElement.classList.remove('error');
        }

        // Email Validation
        if (!emailEl.value || !emailEl.value.trim()) {
            if (emailEl.parentElement) emailEl.parentElement.classList.add('error');
            if (emailError) emailError.textContent = 'Email is required';
            valid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) {
            if (emailEl.parentElement) emailEl.parentElement.classList.add('error');
            if (emailError) emailError.textContent = 'Please enter a valid email address';
            valid = false;
        } else {
            if (emailEl.parentElement) emailEl.parentElement.classList.remove('error');
        }

        // Message Validation
        if (!messageEl.value || !messageEl.value.trim()) {
            if (messageEl.parentElement) messageEl.parentElement.classList.add('error');
            if (messageError) messageError.textContent = 'Message is required';
            valid = false;
        } else {
            if (messageEl.parentElement) messageEl.parentElement.classList.remove('error');
        }

        if (!valid) return;

        const originalHTML = btn.innerHTML;

        if (typeof emailjs !== 'undefined' && ejs.publicKey && ejs.publicKey !== 'YOUR_PUBLIC_KEY') {
            btn.innerHTML = '<span class="material-symbols-outlined">hourglass_top</span> Transmitting...';
            btn.disabled = true;

            try {
                await emailjs.sendForm(ejs.serviceId, ejs.templateId, form);
                showToast('Transmission successful! Message dispatched.', 'success');
                form.reset();
                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.disabled = false;
                }, 1000);
            } catch (err) {
                showToast('Transmission error. Please dispatch directly via email.', 'error');
                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.disabled = false;
                }, 1000);
            }
        } else {
            const subject = encodeURIComponent('Portfolio Inquiry from ' + nameEl.value);
            const body = encodeURIComponent(
                'Name: ' + nameEl.value + '\nEmail: ' + emailEl.value + '\n\n' + messageEl.value
            );
            window.open(`mailto:${portfolioData.contact.email}?subject=${subject}&body=${body}`, '_blank');
            btn.innerHTML = '<span class="material-symbols-outlined">check_circle</span> Launching Client...';
            btn.disabled = true;
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.disabled = false;
            }, 2500);
        }
    });

    ['contactName', 'contactEmail', 'contactMessage'].forEach(id => {
        const el = cacheElement(id);
        if (el) {
            el.addEventListener('input', () => {
                if (el.parentElement) el.parentElement.classList.remove('error');
            });
        }
    });
}

function checkRateLimit() {
    const now = Date.now();
    const recentIndex = formSubmitTimes.findIndex(t => now - t < 60000);
    if (recentIndex > 0) {
        formSubmitTimes.splice(0, recentIndex);
    }
    const recentSubmits = formSubmitTimes.filter(t => now - t < 60000);
    if (recentSubmits.length >= 3) {
        return false;
    }
    formSubmitTimes.push(now);
    return true;
}

/* ==========================================================================
   TOAST NOTIFICATIONS
   ========================================================================== */
function showToast(message, type = 'info') {
    const container = cacheElement('toastContainer');
    if (!container) return;

    const icons = {
        'success': 'check_circle',
        'error': 'error',
        'info': 'info'
    };

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <span class="material-symbols-outlined" style="font-size:1.2rem;color:var(--color-${type === 'success' ? 'signal-green' : type === 'error' ? 'signal-red' : 'accent'});">${icons[type] || icons.info}</span>
        <div style="flex:1;">${message}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(20px)';
        toast.style.transition = 'all 0.25s var(--ease-out)';
        setTimeout(() => {
            if (toast.parentNode) toast.remove();
        }, 250);
    }, 4000);
}

/* ==========================================================================
   ACCESSIBILITY & KEYBOARD HANDLERS
   ========================================================================== */
function setupKeyboardNav() {
    const hamburger = cacheElement('hamburger');
    const navMenu = cacheElement('navMenu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                hamburger.click();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                hamburger.click();
                hamburger.focus();
            }
        });
    }
}
