// ===== Portfolio Data =====
const portfolioData = {
    profile: {
        name: "Bleigh Bande",
        title: "IT Professional & Full Stack Developer",
        description: "Experienced IT professional with over 8 years of hands-on experience in software development, system architecture, and project leadership. I specialise in building scalable, user-centred digital products — from high-traffic e-commerce platforms to AI-powered enterprise tools. My approach blends clean engineering with a sharp eye for business impact, ensuring every line of code moves the needle.",
        email: "bleigh.bande@example.com",
        phone: "+1 (555) 123-4567",
        location: "Zimbabwe"
    },
    highlights: [
        { icon: "code", title: "Full Stack", desc: "End-to-end development" },
        { icon: "cloud", title: "Cloud Native", desc: "AWS, Azure & Firebase" },
        { icon: "groups", title: "Team Lead", desc: "Mentored 3+ devs" },
        { icon: "speed", title: "Performance", desc: "40% faster deploys" }
    ],
    stats: {
        projects: 15,
        experience: 8,
        clients: 20,
        certifications: 5
    },
    skills: [
        {
            category: "Languages",
            icon: "data_object",
            items: ["Python", "JavaScript", "TypeScript", "Java", "C#", "SQL", "PHP"]
        },
        {
            category: "Frontend",
            icon: "web",
            items: ["React", "Vue.js", "Angular", "HTML5", "CSS3", "Bootstrap", "Tailwind"]
        },
        {
            category: "Backend",
            icon: "dns",
            items: ["Node.js", "Django", "ASP.NET", "Express.js", "FastAPI", "Spring Boot"]
        },
        {
            category: "Database & Cloud",
            icon: "cloud_circle",
            items: ["PostgreSQL", "MongoDB", "MySQL", "AWS", "Azure", "Firebase", "Docker"]
        },
        {
            category: "Tools & Methods",
            icon: "build_circle",
            items: ["Git", "Agile/Scrum", "RESTful APIs", "GraphQL", "Microservices", "CI/CD"]
        }
    ],
    experience: [
        {
            title: "Senior Full Stack Developer",
            company: "Tech Innovations Ltd",
            date: "2021 — Present",
            description: "Led development of enterprise-grade applications, architected scalable microservices, mentored 3+ junior developers, and reduced deployment time by 40% through CI/CD optimization."
        },
        {
            title: "Full Stack Developer",
            company: "Digital Solutions Africa",
            date: "2019 — 2021",
            description: "Developed and maintained 10+ web applications using React and Node.js. Implemented database optimization strategies improving performance by 35%. Collaborated with cross-functional teams in Agile environments."
        },
        {
            title: "Junior Developer",
            company: "Software House Zimbabwe",
            date: "2017 — 2019",
            description: "Built responsive web applications, contributed to codebase with clean code practices, participated in daily standups and code reviews. Gained expertise in MERN stack development."
        }
    ],
    education: [
        {
            degree: "BSc Information Technology",
            icon: "school",
            institution: "Zimbabwe Open University",
            year: "2019",
            details: "Specialised in Software Development and Database Management. Completed honours thesis on cloud-based architecture optimization."
        },
        {
            degree: "Web Development Certification",
            icon: "workspace_premium",
            institution: "Complete Web Developer Bootcamp",
            year: "2017",
            details: "Intensive 12-week program covering modern web technologies, REST APIs, and best practices in full-stack development."
        },
        {
            degree: "AWS Solutions Architect",
            icon: "cloud_done",
            institution: "Amazon Web Services",
            year: "2022",
            details: "Professional-level certification demonstrating expertise in designing and deploying scalable AWS solutions."
        }
    ],
    projects: [
        {
            title: "E-Commerce Platform",
            category: "Web Application",
            description: "Full-featured e-commerce solution with product catalog, shopping cart, secure payments, and admin dashboard. Achieved 99.9% uptime and handles 1000+ concurrent users.",
            technologies: ["React", "Node.js", "PostgreSQL", "Stripe", "AWS"],
            link: "#"
        },
        {
            title: "Project Management Tool",
            category: "SaaS Platform",
            description: "Real-time project management with team collaboration, task tracking, and analytics. Supports 500+ active users with live updates using WebSockets.",
            technologies: ["Vue.js", "Express.js", "MongoDB", "Socket.io", "Docker"],
            link: "#"
        },
        {
            title: "Financial Analytics Dashboard",
            category: "Data Visualization",
            description: "Enterprise analytics platform processing 10M+ data points daily. Real-time visualisations, automated reporting, and predictive analytics for financial insights.",
            technologies: ["React", "Chart.js", "Python", "PostgreSQL", "Redis"],
            link: "#"
        },
        {
            title: "Healthcare Management System",
            category: "Enterprise Solution",
            description: "HIPAA-compliant healthcare platform managing patient records, appointments, and billing. Integrated with SMS notifications and automated report generation.",
            technologies: ["Angular", "ASP.NET Core", "SQL Server", "Azure", "Twilio"],
            link: "#"
        },
        {
            title: "Mobile E-Learning App",
            category: "Mobile Application",
            description: "Cross-platform learning platform with video streaming, interactive quizzes, and progress tracking. 50K+ downloads with 4.8-star rating on app stores.",
            technologies: ["React Native", "Firebase", "Node.js", "Redux"],
            link: "#"
        },
        {
            title: "AI-Powered Chat Assistant",
            category: "AI / ML Application",
            description: "Intelligent chatbot for customer support with NLP capabilities. Integrated with OpenAI API, handles 10K+ conversations monthly with 85% accuracy.",
            technologies: ["Python", "Flask", "OpenAI API", "TensorFlow", "PostgreSQL"],
            link: "#"
        }
    ],
    contact: {
        email: "bleigh.bande@example.com",
        phone: "+1 (555) 123-4567",
        location: "Zimbabwe",
        linkedin: "https://linkedin.com/in/bleighbande",
        github: "https://github.com/bleighbande"
    }
};

// ===== DOM Ready =====
document.addEventListener('DOMContentLoaded', () => {
    populateAbout();
    populateSkills();
    populateExperience();
    populateEducation();
    populateProjects();
    populateContact();
    populateFooter();
    setupNavigation();
    setupThemeToggle();
    setupScrollReveal();
    setupCounters();
    setupFormValidation();
});

// ===== Navigation =====
function setupNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Hamburger toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', isOpen);
        });
    }

    // Smooth scroll + active state
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                // Close mobile menu
                if (navMenu) navMenu.classList.remove('active');
                if (hamburger) {
                    hamburger.classList.remove('active');
                    hamburger.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });

    // Update active link on scroll
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

    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.borderBottomColor = 'var(--border-hover)';
        } else {
            navbar.style.borderBottomColor = 'var(--border)';
        }
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
        { el: document.getElementById('statsClients'), target: portfolioData.stats.clients, suffix: '+' },
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
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        el.textContent = Math.floor(current) + suffix;
    }, 30);
}

// ===== Scroll Reveal =====
function setupScrollReveal() {
    // Small delay to allow DOM to be populated
    requestAnimationFrame(() => {
        const reveals = document.querySelectorAll(
            '.skill-card, .project-card, .education-card, .timeline-item, .highlight-card, .contact-item, .about-text'
        );
        reveals.forEach(el => el.classList.add('reveal'));

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    // Stagger the animation
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, i * 80);
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
                ${group.items.map(skill => `
                    <span class="skill-tag">${skill}</span>
                `).join('')}
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

// ===== Populate Projects =====
function populateProjects() {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;

    grid.innerHTML = portfolioData.projects.map(proj => `
        <div class="project-card">
            <div class="project-header">
                <p class="project-category">${proj.category}</p>
                <h3>${proj.title}</h3>
            </div>
            <div class="project-body">
                <p class="project-description">${proj.description}</p>
                <div class="project-tech">
                    ${proj.technologies.map(t => `<span class="tech-badge">${t}</span>`).join('')}
                </div>
                <div class="project-links">
                    <a href="${proj.link}" class="project-link">
                        <span class="material-symbols-outlined">open_in_new</span>
                        View Project
                    </a>
                </div>
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

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('contactName');
        const email = document.getElementById('contactEmail');
        const message = document.getElementById('contactMessage');
        const btn = document.getElementById('submitBtn');

        // Simple validation
        let valid = true;
        [name, email, message].forEach(input => {
            if (!input.value.trim()) {
                input.style.borderColor = '#ef4444';
                valid = false;
            } else {
                input.style.borderColor = '';
            }
        });

        if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
            email.style.borderColor = '#ef4444';
            valid = false;
        }

        if (!valid) return;

        // Success feedback
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<span class="material-symbols-outlined">check_circle</span> Sent!';
        btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        btn.disabled = true;

        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
            btn.disabled = false;
            form.reset();
        }, 2500);
    });

    // Clear error on input
    ['contactName', 'contactEmail', 'contactMessage'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', () => {
                el.style.borderColor = '';
            });
        }
    });
}
