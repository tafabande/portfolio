const portfolioData = {
    profile: {
        name: "Bleigh T.J Bande",
        greeting: "Hello, I'm",
        titles: [
            "Telecommunications Engineer",
            "Web Developer",
            "IT Support Specialist",
            "Problem Solver"
        ],
        description: "Innovative and technically-driven telecommunications engineering student with a diploma from Trust Academy and currently pursuing a bachelor's degree at Midlands State University. Passionate about leveraging technology to solve real-world problems, with a record of improving system efficiency and user experience. Vice President of Data Science MSU Charter.",
        email: "bleighbande@gmail.com",
        phone: "0776688563",
        location: "Gweru, Zimbabwe",
        dob: "20 January 2000"
    },
    highlights: [
        { icon: "cell_tower", title: "Telecom Systems", desc: "Signal processing & switching" },
        { icon: "code", title: "Web Development", desc: "HTML, CSS, Python, Flask" },
        { icon: "support_agent", title: "IT Support", desc: "Troubleshooting & diagnostics" },
        { icon: "groups", title: "Leadership", desc: "VP Data Science MSU Charter" }
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
                { name: "LAN/WAN Config", proficiency: 85, years: 3 },
                { name: "Cisco Packet Tracer", proficiency: 80, years: 2 },
                { name: "Fiber Optics", proficiency: 75, years: 2 },
                { name: "Signal Processing", proficiency: 70, years: 3 },
                { name: "Telecoms Switching", proficiency: 75, years: 3 }
            ]
        },
        {
            category: "Web Technologies",
            icon: "web",
            items: [
                { name: "HTML", proficiency: 90, years: 3 },
                { name: "CSS", proficiency: 85, years: 3 },
                { name: "Responsive Design", proficiency: 85, years: 2 },
                { name: "REST APIs", proficiency: 75, years: 2 },
                { name: "Flask", proficiency: 70, years: 1 }
            ]
        },
        {
            category: "Programming",
            icon: "data_object",
            items: [
                { name: "Python", proficiency: 85, years: 3 },
                { name: "C", proficiency: 70, years: 2 },
                { name: "SQL", proficiency: 80, years: 3 },
                { name: "Git/GitHub", proficiency: 85, years: 2 }
            ]
        },
        {
            category: "Databases",
            icon: "storage",
            items: [
                { name: "MySQL", proficiency: 80, years: 2 },
                { name: "SQLite", proficiency: 75, years: 2 },
                { name: "TinyDB", proficiency: 70, years: 1 },
                { name: "MS Access", proficiency: 75, years: 2 },
                { name: "Excel-based Systems", proficiency: 85, years: 3 }
            ]
        },
        {
            category: "IT Support & Tools",
            icon: "build_circle",
            items: [
                { name: "Windows OS", proficiency: 90, years: 4 },
                { name: "MS Office Suite", proficiency: 90, years: 4 },
                { name: "Troubleshooting", proficiency: 85, years: 4 },
                { name: "Notion", proficiency: 80, years: 2 },
                { name: "Slack", proficiency: 75, years: 2 }
            ]
        },
        {
            category: "Emerging Tech",
            icon: "auto_awesome",
            items: [
                { name: "Generative AI", proficiency: 75, years: 1 },
                { name: "AI-Assisted Workflows", proficiency: 80, years: 1 },
                { name: "Content Generation", proficiency: 75, years: 1 },
                { name: "Cybersecurity Basics", proficiency: 70, years: 2 }
            ]
        }
    ],
    experience: [
        {
            title: "IT Support & Systems Intern",
            company: "Parirenyatwa Group Of Hospitals",
            date: "2021",
            description: "Designed and implemented a centralised IT inventory database, streamlining asset tracking and reducing manual entry errors by 30%. Diagnosed and resolved daily PC and peripheral issues. Conducted end-user training sessions. Collaborated on connecting Annexe Psychiatric Hospital to the central network. Upgraded network infrastructure for Sekuru Kaguvi Eye Hospital. Automated the reset request log process, reducing manual workload by 40%."
        },
        {
            title: "Vice President — Data Science MSU Charter",
            company: "Midlands State University",
            date: "Feb 2025 — Present",
            description: "Leading the Data Science charter at MSU, organising workshops and events to promote data literacy and analytical thinking among students. Coordinating with faculty and industry partners."
        }
    ],
    education: [
        {
            degree: "BSc Telecommunications Engineering",
            icon: "school",
            institution: "Midlands State University",
            year: "Feb 2024 — Present",
            details: "Currently pursuing a Bachelor's degree in Telecommunications Engineering, building on a foundation in networks, electronics and communication systems."
        },
        {
            degree: "Diploma in Telecommunications",
            icon: "workspace_premium",
            institution: "Trust Academy",
            year: "June 2017 — June 2023",
            details: "Gained hands-on training and a solid academic foundation in digital systems, signal processing and telecoms switching."
        }
    ],
    contact: {
        email: "bleighbande@gmail.com",
        phone: "0776688563",
        location: "Gweru, Zimbabwe",
        linkedin: "https://linkedin.com/in/bleighbande",
        github: "https://github.com/bleighbande"
    },
    github: {
        username: "tafabande"
    },
    emailjs: {
        publicKey:  "iGpebApjTDVfppOM0",
        serviceId:  "service_q7qmugv",
        templateId: "template_iqwypms"
    },
    references: [
        {
            name: "Mr R. Takavada",
            role: "Manager — Parirenyatwa Group Of Hospitals",
            email: "Takavadareas@gmail.com",
            phone: "0773530539"
        }
    ],
    testimonials: [
        {
            name: "Mr R. Takavada",
            role: "Manager — Parirenyatwa Group Of Hospitals",
            text: "Bleigh demonstrated exceptional technical skills and initiative during his internship, particularly in automating processes and improving system efficiency.",
            avatar: "RT"
        }
    ]
};

let vantaEffect = null;
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
        setupScrollReveal();
        setupCounters();
        setupFormValidation();
        initTypedJS();
        setupHeadingTyping();
        fetchGitHubProjects();
        fetchLatestCV();

        if (document.readyState === 'complete') {
            setTimeout(initVantaBackground, 500);
        } else {
            window.addEventListener('load', () => {
                setTimeout(initVantaBackground, 500);
            });
        }
    } catch (error) {
        showToast('Error initializing portfolio. Please refresh the page.', 'error');
    }
});

function initVantaBackground() {
    try {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
        if (isMobile || isLowEndDevice) return;

        if (typeof VANTA === 'undefined' || typeof THREE === 'undefined') return;

        const heroSection = document.querySelector('.hero');
        const heroBgShapes = document.querySelector('.hero-bg-shapes');

        if (!heroSection) return;

        if (heroBgShapes) {
            heroBgShapes.style.display = 'none';
        }

        const isLightTheme = document.documentElement.getAttribute('data-theme') === 'light';
        const waveColor = isLightTheme ? 0xE8EFFF : 0x1a1e36;
        const backgroundColor = isLightTheme ? 0xF9F9FF : 0x0a0a0f;

        vantaEffect = VANTA.WAVES({
            el: heroSection,
            THREE: THREE,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: waveColor,
            backgroundColor: backgroundColor,
            waveHeight: 15.0,
            waveSpeed: 0.75,
            zoom: 0.85,
            shininess: 30,
            colorCycleSpeed: 0
        });
    } catch (err) {
        const heroBgShapes = document.querySelector('.hero-bg-shapes');
        if (heroBgShapes) {
            heroBgShapes.style.display = '';
        }
    }
}

function reinitializeVanta() {
    if (vantaEffect) {
        try {
            vantaEffect.destroy();
        } catch (e) {}
        vantaEffect = null;
    }
    setTimeout(initVantaBackground, 300);
}

function initTypedJS() {
    const el = cacheElement('heroSubtitle');
    if (!el || typeof Typed === 'undefined') return;

    try {
        el.textContent = '';
        new Typed('#heroSubtitle', {
            strings: portfolioData.profile.titles,
            typeSpeed: 25,
            backSpeed: 15,
            backDelay: 1600,
            startDelay: 300,
            loop: true,
            showCursor: true,
            cursorChar: '|'
        });
    } catch (error) {
        el.textContent = portfolioData.profile.titles[0];
    }
}

function setupHeadingTyping() {
    if (typeof Typed === 'undefined') return;

    const headings = document.querySelectorAll('.section-title');
    const typedInstances = new Map();

    function safeDestroy(h) {
        if (typedInstances.has(h)) {
            try {
                typedInstances.get(h).destroy();
            } catch(e) {}
            typedInstances.delete(h);
        }
        if (h.parentElement) {
            h.parentElement.querySelectorAll('.typed-cursor').forEach(c => c.remove());
        }
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const h = entry.target;
            const text = h.dataset.text;
            if (entry.isIntersecting) {
                safeDestroy(h);
                h.innerHTML = '';
                try {
                    const t = new Typed(h, {
                        strings: [text],
                        typeSpeed: 30,
                        showCursor: true,
                        cursorChar: '|',
                        onComplete(self) {
                            if (self.cursor) {
                                self.cursor.style.transition = 'opacity 0.5s ease 1s';
                                self.cursor.style.opacity = '0';
                                setTimeout(() => {
                                    try {
                                        self.cursor.remove();
                                    } catch(e) {}
                                }, 1600);
                            }
                        }
                    });
                    typedInstances.set(h, t);
                } catch (e) {
                    h.textContent = text;
                }
            } else {
                safeDestroy(h);
                h.textContent = '\u00A0';
            }
        });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.15 });

    headings.forEach(h => {
        h.dataset.text = h.textContent.trim();
        h.textContent = '\u00A0';
        observer.observe(h);
    });
}

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

async function fetchGitHubProjects() {
    const grid = cacheElement('projectsGrid');
    if (!grid) return;

    const username = portfolioData.github.username;
    const cacheKey = 'github_projects_cache';
    const cacheTimeKey = 'github_projects_cache_time';
    const cacheExpiry = 60 * 60 * 1000;

    grid.innerHTML = `
        <div class="loading-state" style="grid-column:1/-1;text-align:center;padding:3rem;">
            <span class="material-symbols-outlined" style="font-size:2rem;color:var(--accent);animation:spin 1s linear infinite;">progress_activity</span>
            <p style="margin-top:1rem;color:var(--text-muted);">Loading projects from GitHub...</p>
        </div>`;

    let repos = [];
    let usedCache = false;

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
                showToast('Showing cached projects — GitHub API limit reached.', 'info');
            } catch (e) {}
        } else {
            grid.innerHTML = `
                <p style="text-align:center;color:var(--text-muted);grid-column:1/-1;">
                    <span class="material-symbols-outlined" style="vertical-align:middle;">cloud_off</span>
                    Could not load GitHub projects.
                    <a href="https://github.com/${username}" target="_blank" style="color:var(--accent);">View on GitHub →</a>
                </p>`;
            showToast('Failed to load GitHub projects.', 'error');
            return;
        }
    }

    if (!Array.isArray(repos)) {
        grid.innerHTML = '<p style="text-align:center;color:var(--text-muted);grid-column:1/-1;">No public repositories found.</p>';
        return;
    }

    const filtered = repos
        .filter(r => !r.fork)
        .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
        .slice(0, 5);

    if (filtered.length === 0) {
        grid.innerHTML = '<p style="text-align:center;color:var(--text-muted);grid-column:1/-1;">No public repositories found.</p>';
        return;
    }

    const colors = {
        'JavaScript': '#f7df1e', 'Python': '#3572A5', 'HTML': '#e34c26',
        'CSS': '#563d7c', 'TypeScript': '#3178c6', 'Java': '#b07219',
        'C': '#555555', 'C++': '#f34b7d', 'Shell': '#89e051',
        'Jupyter Notebook': '#DA5B0B', 'Vue': '#41b883', 'PHP': '#4F5D95'
    };

    grid.innerHTML = filtered.map(repo => `
        <div class="project-card reveal">
            <div class="project-header">
                <p class="project-category">
                    ${repo.language ? `<span class="lang-dot" style="background:${colors[repo.language] || 'var(--accent)'}"></span> ${repo.language}` : 'Repository'}
                </p>
                <h3>${(repo.name || '').replace(/-/g, ' ').replace(/_/g, ' ')}</h3>
            </div>
            <div class="project-body">
                <p class="project-description">${repo.description || 'No description provided.'}</p>
                <div class="project-tech">
                    ${Array.isArray(repo.topics) ? repo.topics.map(t => `<span class="tech-badge">${t}</span>`).join('') : ''}
                    ${repo.stargazers_count ? `<span class="tech-badge">⭐ ${repo.stargazers_count}</span>` : ''}
                    ${repo.forks_count ? `<span class="tech-badge">🍴 ${repo.forks_count}</span>` : ''}
                </div>
                <div class="project-links">
                    <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="project-link">
                        <span class="material-symbols-outlined">code</span>
                        Source Code
                    </a>
                    ${repo.homepage ? `
                        <a href="${repo.homepage}" target="_blank" rel="noopener noreferrer" class="project-link">
                            <span class="material-symbols-outlined">open_in_new</span>
                            Live Demo
                        </a>
                    ` : ''}
                </div>
            </div>
        </div>
    `).join('');

    requestAnimationFrame(() => {
        const cards = grid.querySelectorAll('.project-card');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, idx) => {
                if (entry.isIntersecting) {
                    setTimeout(() => entry.target.classList.add('visible'), idx * 50);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        cards.forEach(el => observer.observe(el));
    });

    if (!usedCache) {
        showToast('Projects synchronised from GitHub.', 'success');
    }
}

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
    }, { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' });
    sections.forEach(s => observer.observe(s));

    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.style.borderBottomColor = window.scrollY > 50 ? 'var(--border-hover)' : 'var(--border)';
        }, { passive: true });
    }
}

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
        reinitializeVanta();
    });
}

function setupCounters() {
    const counters = [
        { el: cacheElement('statsProjects'), target: portfolioData.stats.projects, suffix: '+' },
        { el: cacheElement('statsExperience'), target: portfolioData.stats.experience, suffix: '+' },
        { el: cacheElement('statsSkills'), target: portfolioData.stats.skills, suffix: '+' },
        { el: cacheElement('statsDiplomas'), target: portfolioData.stats.certifications, suffix: '' },
    ];

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                counters.forEach(c => animateCounter(c.el, c.target, c.suffix));
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) observer.observe(statsSection);
}

function animateCounter(el, target, suffix = '') {
    if (!el) return;
    let current = 0;
    const increment = target / 40;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        el.textContent = Math.floor(current) + suffix;
    }, 30);
}

function setupScrollReveal() {
    requestAnimationFrame(() => {
        const reveals = document.querySelectorAll(
            '.skill-card, .education-card, .timeline-item, .highlight-card, .contact-item, .about-text, .testimonial-card'
        );
        reveals.forEach(el => el.classList.add('reveal'));

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    setTimeout(() => entry.target.classList.add('visible'), i * 80);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

        reveals.forEach(el => observer.observe(el));
    });
}

function populateAbout() {
    const aboutText = cacheElement('aboutText');
    const aboutHighlights = cacheElement('aboutHighlights');

    if (aboutText) {
        aboutText.innerHTML = `<p>${portfolioData.profile.description}</p>`;
    }

    if (aboutHighlights) {
        aboutHighlights.innerHTML = portfolioData.highlights.map(h => `
            <div class="highlight-card">
                <div class="highlight-icon">
                    <span class="material-symbols-outlined">${h.icon}</span>
                </div>
                <div class="highlight-info">
                    <h4>${h.title}</h4>
                    <p>${h.desc}</p>
                </div>
            </div>
        `).join('');
    }
}

function populateSkills() {
    const grid = cacheElement('skillsGrid');
    if (!grid) return;

    grid.innerHTML = portfolioData.skills.map(group => `
        <div class="skill-card">
            <div class="skill-card-header">
                <div class="skill-card-icon">
                    <span class="material-symbols-outlined">${group.icon}</span>
                </div>
                <h3>${group.category}</h3>
            </div>
            <div class="skill-list">
                ${group.items.map(skill => `
                    <div class="skill-item">
                        <span class="skill-name">${skill.name}</span>
                        <div class="skill-progress-bar">
                            <div class="skill-progress-fill" style="width: ${skill.proficiency}%"></div>
                        </div>
                        <span class="skill-years">${skill.years}y</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

function populateExperience() {
    const timeline = cacheElement('experienceTimeline');
    if (!timeline) return;

    timeline.innerHTML = portfolioData.experience.map(exp => `
        <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
                <h3>${exp.title}</h3>
                <div class="timeline-meta">
                    <span class="timeline-company">
                        <span class="material-symbols-outlined">apartment</span>
                        ${exp.company}
                    </span>
                    <span class="timeline-date">
                        <span class="material-symbols-outlined">calendar_month</span>
                        ${exp.date}
                    </span>
                </div>
                <p class="timeline-description">${exp.description}</p>
            </div>
        </div>
    `).join('');
}

function populateTestimonials() {
    const grid = cacheElement('testimonialsGrid');
    if (!grid) return;

    grid.innerHTML = portfolioData.testimonials.map(testimonial => `
        <div class="testimonial-card reveal">
            <div class="testimonial-avatar">
                <span>${testimonial.avatar}</span>
            </div>
            <div class="testimonial-quote">
                <span class="material-symbols-outlined quote-icon">format_quote</span>
                <p class="testimonial-text">"${testimonial.text}"</p>
            </div>
            <div class="testimonial-author">
                <h4>${testimonial.name}</h4>
                <p>${testimonial.role}</p>
            </div>
        </div>
    `).join('');
}

function populateEducation() {
    const list = cacheElement('educationList');
    if (!list) return;

    list.innerHTML = portfolioData.education.map(edu => `
        <div class="education-card">
            <div class="education-icon">
                <span class="material-symbols-outlined">${edu.icon}</span>
            </div>
            <div class="education-info">
                <h3>${edu.degree}</h3>
                <p class="education-institution">${edu.institution}</p>
                <p class="education-year">
                    <span class="material-symbols-outlined" style="font-size:0.9rem;vertical-align:text-bottom;">calendar_month</span>
                    ${edu.year}
                </p>
                <p class="education-details">${edu.details}</p>
            </div>
        </div>
    `).join('');
}

function populateContact() {
    const contactInfo = cacheElement('contactInfo');
    if (!contactInfo) return;

    const c = portfolioData.contact;
    contactInfo.innerHTML = `
        <div class="contact-item">
            <div class="contact-icon"><span class="material-symbols-outlined">mail</span></div>
            <div class="contact-details">
                <h4>Email</h4>
                <p><a href="mailto:${c.email}">${c.email}</a></p>
            </div>
        </div>
        <div class="contact-item">
            <div class="contact-icon"><span class="material-symbols-outlined">phone_iphone</span></div>
            <div class="contact-details">
                <h4>Phone</h4>
                <p><a href="tel:${c.phone}">${c.phone}</a></p>
            </div>
        </div>
        <div class="contact-item">
            <div class="contact-icon"><span class="material-symbols-outlined">location_on</span></div>
            <div class="contact-details">
                <h4>Location</h4>
                <p>${c.location}</p>
            </div>
        </div>
        <div class="contact-item">
            <div class="contact-icon"><span class="material-symbols-outlined">link</span></div>
            <div class="contact-details">
                <h4>Connect</h4>
                <p>
                    <a href="${c.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                    &nbsp;&middot;&nbsp;
                    <a href="${c.github}" target="_blank" rel="noopener noreferrer">GitHub</a>
                </p>
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
            <span class="material-symbols-outlined">code</span> GitHub
        </a>
        <a href="${c.linkedin}" target="_blank" rel="noopener noreferrer" class="footer-link" aria-label="LinkedIn">
            <span class="material-symbols-outlined">work</span> LinkedIn
        </a>
        <a href="mailto:${c.email}" class="footer-link" aria-label="Email">
            <span class="material-symbols-outlined">mail</span> Email
        </a>
    `;
}

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
            showToast('Too many submissions. Please wait a minute before trying again.', 'error');
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
            if (err) {
                err.textContent = '';
                err.classList.remove('visible');
            }
        });

        if (!nameEl.value || !nameEl.value.trim()) {
            nameEl.style.borderColor = '#ef4444';
            if (nameError) {
                nameError.textContent = 'Name is required';
                nameError.classList.add('visible');
            }
            valid = false;
        } else {
            nameEl.style.borderColor = '';
        }

        if (!emailEl.value || !emailEl.value.trim()) {
            emailEl.style.borderColor = '#ef4444';
            if (emailError) {
                emailError.textContent = 'Email is required';
                emailError.classList.add('visible');
            }
            valid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) {
            emailEl.style.borderColor = '#ef4444';
            if (emailError) {
                emailError.textContent = 'Please enter a valid email address';
                emailError.classList.add('visible');
            }
            valid = false;
        } else {
            emailEl.style.borderColor = '';
        }

        if (!messageEl.value || !messageEl.value.trim()) {
            messageEl.style.borderColor = '#ef4444';
            if (messageError) {
                messageError.textContent = 'Message is required';
                messageError.classList.add('visible');
            }
            valid = false;
        } else {
            messageEl.style.borderColor = '';
        }

        if (!valid) return;

        const originalHTML = btn.innerHTML;

        if (typeof emailjs !== 'undefined' && ejs.publicKey && ejs.publicKey !== 'YOUR_PUBLIC_KEY') {
            btn.innerHTML = '<span class="material-symbols-outlined">hourglass_top</span> Sending...';
            btn.disabled = true;

            try {
                await emailjs.sendForm(ejs.serviceId, ejs.templateId, form);
                showToast('Message sent successfully!', 'success');
                trackEvent('Engagement', 'form_submit', 'Contact Form Success');
                form.reset();
                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.disabled = false;
                }, 1000);
            } catch (err) {
                showToast('Failed to send message. Please try again.', 'error');
                trackEvent('Engagement', 'form_submit_error', 'Contact Form Error');
                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.disabled = false;
                }, 1000);
            }
        } else {
            const subject = encodeURIComponent('Portfolio Contact from ' + nameEl.value);
            const body = encodeURIComponent(
                'Name: ' + nameEl.value + '\nEmail: ' + emailEl.value + '\n\n' + messageEl.value
            );
            window.open(`mailto:${portfolioData.contact.email}?subject=${subject}&body=${body}`, '_blank');
            btn.innerHTML = '<span class="material-symbols-outlined">check_circle</span> Opening mail...';
            btn.disabled = true;
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.disabled = false;
            }, 2500);
        }
    });

    ['contactName', 'contactEmail', 'contactMessage'].forEach(id => {
        const el = cacheElement(id);
        if (el) el.addEventListener('input', () => { el.style.borderColor = ''; });
    });
}

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
        <span class="material-symbols-outlined toast-icon">${icons[type] || icons.info}</span>
        <div class="toast-content">${message}</div>
        <button class="toast-close" aria-label="Close notification">
            <span class="material-symbols-outlined" style="font-size:1.2rem;">close</span>
        </button>
    `;

    container.appendChild(toast);

    const closeBtn = toast.querySelector('.toast-close');
    let timeoutId;

    const closeToast = () => {
        toast.classList.add('hiding');
        toast.addEventListener('animationend', () => {
            if (toast.parentNode) toast.remove();
        });
    };

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            clearTimeout(timeoutId);
            closeToast();
        });
    }

    timeoutId = setTimeout(closeToast, 4000);
}

function sanitizeInput(input) {
    if (!input) return '';
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
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

function trackEvent(category, action, label) {
    if (typeof gtag !== 'undefined' && window.GA_MEASUREMENT_ID && window.GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX') {
        try {
            gtag('event', action, {
                event_category: category,
                event_label: label
            });
        } catch (e) {}
    }
}

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

            if (e.key === 'Tab' && navMenu.classList.contains('active')) {
                const focusableElements = navMenu.querySelectorAll('a, button');
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    }

    const cvDownloadBtn = cacheElement('cvDownloadBtn');
    if (cvDownloadBtn) {
        cvDownloadBtn.addEventListener('click', () => {
            trackEvent('Engagement', 'cv_download', 'CV Download Button');
        });
    }

    document.querySelectorAll('.social-link, .footer-link').forEach(link => {
        link.addEventListener('click', () => {
            const label = link.getAttribute('aria-label') || link.textContent.trim();
            trackEvent('Social', 'social_click', label);
        });
    });

    document.addEventListener('click', (e) => {
        const projectLink = e.target.closest('.project-link');
        if (projectLink) {
            const projectCard = projectLink.closest('.project-card');
            const projectName = projectCard ? (projectCard.querySelector('h3') || {}).textContent : 'Unknown';
            trackEvent('Projects', 'project_click', projectName || 'Unknown');
        }
    });

    const themeToggle = cacheElement('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
            trackEvent('Settings', 'theme_toggle', newTheme);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setupKeyboardNav();
});
