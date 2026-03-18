// ===================================================================
// Portfolio Data — extracted from Bleigh T.J Bande's CV
// All data driven from this object — nothing is hardcoded in HTML
// ===================================================================
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
            items: ["LAN/WAN Config", "Cisco Packet Tracer", "Fiber Optics", "Signal Processing", "Telecoms Switching"]
        },
        {
            category: "Web Technologies",
            icon: "web",
            items: ["HTML", "CSS", "Responsive Design", "REST APIs", "Flask"]
        },
        {
            category: "Programming",
            icon: "data_object",
            items: ["Python", "C", "SQL", "Git/GitHub"]
        },
        {
            category: "Databases",
            icon: "storage",
            items: ["MySQL", "SQLite", "TinyDB", "MS Access", "Excel-based Systems"]
        },
        {
            category: "IT Support & Tools",
            icon: "build_circle",
            items: ["Windows OS", "MS Office Suite", "Troubleshooting", "Notion", "Slack"]
        },
        {
            category: "Emerging Tech",
            icon: "auto_awesome",
            items: ["Generative AI", "AI-Assisted Workflows", "Content Generation", "Cybersecurity Basics"]
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
        username: "bleighbande"
    },
    // ─── EmailJS Config ───────────────────────────────────────────
    // Sign up at https://www.emailjs.com (free: 200 emails/month)
    // 1. Create an Email Service  → paste the Service ID below
    // 2. Create an Email Template → paste the Template ID below
    //    Template variables: {{name}}, {{email}}, {{message}}
    // 3. Copy your Public Key from Account → General
    // ──────────────────────────────────────────────────────────────
    emailjs: {
        publicKey:  "iGpebApjTDVfppOM0",   // Bleigh's EmailJS public key
        serviceId:  "service_q7qmugv",
        templateId: "iGpebApjTDVfppOM0"
    },
    references: [
        {
            name: "Mr R. Takavada",
            role: "Manager — Parirenyatwa Group Of Hospitals",
            email: "Takavadareas@gmail.com",
            phone: "0773530539"
        }
    ]
};

// ===== DOM Ready =====
document.addEventListener('DOMContentLoaded', () => {
    populateAbout();
    populateSkills();
    populateExperience();
    populateEducation();
    populateContact();
    populateFooter();
    setupNavigation();
    setupThemeToggle();
    setupScrollReveal();
    setupCounters();
    setupFormValidation();
    initTypedJS();
    fetchGitHubProjects();
});

// ===== Typed.js Hero Animation =====
function initTypedJS() {
    const el = document.getElementById('heroSubtitle');
    if (!el || typeof Typed === 'undefined') return;
    
    el.textContent = '';
    new Typed('#heroSubtitle', {
        strings: portfolioData.profile.titles,
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 2000,
        startDelay: 500,
        loop: true,
        showCursor: true,
        cursorChar: '|'
    });
}

// ===== GitHub Projects Fetch =====
async function fetchGitHubProjects() {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;

    const username = portfolioData.github.username;
    grid.innerHTML = `
        <div class="loading-state" style="grid-column:1/-1;text-align:center;padding:3rem;">
            <span class="material-symbols-outlined" style="font-size:2rem;color:var(--accent);animation:spin 1s linear infinite;">progress_activity</span>
            <p style="margin-top:1rem;color:var(--text-muted);">Loading projects from GitHub...</p>
        </div>`;

    try {
        const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=12&type=owner`);
        if (!res.ok) throw new Error('GitHub API error');
        const repos = await res.json();

        // Filter out forks and empty repos, prioritise those with descriptions
        const filtered = repos
            .filter(r => !r.fork)
            .sort((a, b) => (b.stargazers_count + b.watchers_count) - (a.stargazers_count + a.watchers_count));

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
            <div class="project-card">
                <div class="project-header">
                    <p class="project-category">
                        ${repo.language ? `<span class="lang-dot" style="background:${colors[repo.language] || 'var(--accent)'}"></span> ${repo.language}` : 'Repository'}
                    </p>
                    <h3>${repo.name.replace(/-/g, ' ').replace(/_/g, ' ')}</h3>
                </div>
                <div class="project-body">
                    <p class="project-description">${repo.description || 'No description provided.'}</p>
                    <div class="project-tech">
                        ${repo.topics?.map(t => `<span class="tech-badge">${t}</span>`).join('') || ''}
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

        // Re-apply scroll reveal to new cards
        requestAnimationFrame(() => {
            grid.querySelectorAll('.project-card').forEach(el => {
                el.classList.add('reveal');
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('visible');
                            observer.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.1 });
                observer.observe(el);
            });
        });

    } catch (err) {
        console.warn('GitHub fetch failed:', err);
        grid.innerHTML = `
            <p style="text-align:center;color:var(--text-muted);grid-column:1/-1;">
                <span class="material-symbols-outlined" style="vertical-align:middle;">cloud_off</span>
                Could not load GitHub projects. 
                <a href="https://github.com/${username}" target="_blank" style="color:var(--accent);">View on GitHub →</a>
            </p>`;
    }
}

// ===== Navigation =====
function setupNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
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
            const targetId = link.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
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
    window.addEventListener('scroll', () => {
        navbar.style.borderBottomColor = window.scrollY > 50 ? 'var(--border-hover)' : 'var(--border)';
    }, { passive: true });
}

// ===== Theme Toggle =====
function setupThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    const icon = toggle?.querySelector('.material-symbols-outlined');
    const saved = localStorage.getItem('theme');

    if (saved === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        if (icon) icon.textContent = 'light_mode';
    }

    toggle?.addEventListener('click', () => {
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

// ===== Animated Counters =====
function setupCounters() {
    const counters = [
        { el: document.getElementById('statsProjects'), target: portfolioData.stats.projects, suffix: '+' },
        { el: document.getElementById('statsExperience'), target: portfolioData.stats.experience, suffix: '+' },
        { el: document.getElementById('statsClients'), target: portfolioData.stats.skills, suffix: '+' },
        { el: document.getElementById('statsCerts'), target: portfolioData.stats.certifications, suffix: '' },
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

function animateCounter(el, target, suffix) {
    if (!el) return;
    let current = 0;
    const increment = target / 40;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = Math.floor(current) + suffix;
    }, 30);
}

// ===== Scroll Reveal =====
function setupScrollReveal() {
    requestAnimationFrame(() => {
        const reveals = document.querySelectorAll(
            '.skill-card, .education-card, .timeline-item, .highlight-card, .contact-item, .about-text'
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

// ===== Populate About =====
function populateAbout() {
    const aboutText = document.getElementById('aboutText');
    const aboutHighlights = document.getElementById('aboutHighlights');

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

// ===== Populate Skills =====
function populateSkills() {
    const grid = document.getElementById('skillsGrid');
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
                ${group.items.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
        </div>
    `).join('');
}

// ===== Populate Experience =====
function populateExperience() {
    const timeline = document.getElementById('experienceTimeline');
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

// ===== Populate Education =====
function populateEducation() {
    const list = document.getElementById('educationList');
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

// ===== Populate Contact =====
function populateContact() {
    const contactInfo = document.getElementById('contactInfo');
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

// ===== Populate Footer =====
function populateFooter() {
    const footerLinks = document.getElementById('footerLinks');
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

// ===== Form Validation =====
function setupFormValidation() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    // Initialise EmailJS with your public key
    const ejs = portfolioData.emailjs;
    if (typeof emailjs !== 'undefined' && ejs.publicKey !== 'YOUR_PUBLIC_KEY') {
        emailjs.init({ publicKey: ejs.publicKey });
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nameEl    = document.getElementById('contactName');
        const emailEl   = document.getElementById('contactEmail');
        const messageEl = document.getElementById('contactMessage');
        const btn       = document.getElementById('submitBtn');

        // ── Client-side validation ──
        let valid = true;
        [nameEl, emailEl, messageEl].forEach(input => {
            if (!input.value.trim()) { input.style.borderColor = '#ef4444'; valid = false; }
            else { input.style.borderColor = ''; }
        });
        if (emailEl.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) {
            emailEl.style.borderColor = '#ef4444'; valid = false;
        }
        if (!valid) return;

        const originalHTML = btn.innerHTML;

        // ── Send via EmailJS ──
        if (typeof emailjs !== 'undefined' && ejs.publicKey !== 'YOUR_PUBLIC_KEY') {
            btn.innerHTML = '<span class="material-symbols-outlined">hourglass_top</span> Sending...';
            btn.disabled = true;

            try {
                await emailjs.sendForm(ejs.serviceId, ejs.templateId, form);
                btn.innerHTML = '<span class="material-symbols-outlined">check_circle</span> Sent!';
                btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                form.reset();
                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3000);
            } catch (err) {
                console.error('EmailJS error:', err);
                btn.innerHTML = '<span class="material-symbols-outlined">error</span> Failed — try again';
                btn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3000);
            }
        } else {
            // Fallback: open mailto link if EmailJS isn't configured
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
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', () => { el.style.borderColor = ''; });
    });
}
