# Professional Portfolio — Bleigh T.J Bande

A premium, high-performance portfolio website built for modern web standards. Features a sleek dark-first design, real-time GitHub project integration, and automated contact notifications via EmailJS.

## 🚀 Live Demos
- **GitHub Pages**: [https://tafabande.github.io/portfolio/](https://tafabande.github.io/portfolio/)
- **Vercel**: (Link generated upon deployment)

## ✨ Core Features

### 🎨 Premium Design & UX
- **Dark-First Aesthetic**: Modern, sleek professional theme with glassmorphism, gradient accents, and neon highlights.
- **Material 3 Icons**: Full integration of Google's Material Symbols (Outlined) for a consistent, modern look.
- **Micro-Animations**: Staggered scroll-reveal effects, animated stat counters, and smooth layout transitions.
- **Dynamic Hero**: Powered by **Typed.js**, cycling through professional roles with a typewriter effect.
- **Theme Perspective**: Built-in Light/Dark mode toggle with system persistence.

### 📊 Real-Time Data Integration
- **GitHub API**: Automatically fetches and displays your public repositories.
  - Shows language-specific color dots.
  - Displays repository topics, stars, and forks.
  - Dynamic "Live Demo" links for repositories with a homepage URL.
- **Single Source of Truth**: All website content is driven by a single `portfolioData` object in `script.js`. No more hunting through HTML to update your CV.

### ✉️ Functional Contact System
- **EmailJS Integration**: Sends form submissions directly to your email from the browser (no backend required).
- **Auto-Timestamps**: Automatically captures the submission date and time for your records.
- **Validation**: Comprehensive client-side validation with real-time feedback.
- **Mailto Fallback**: Robust fallback to standard email clients if the API is unconfigured.

### 🔍 SEO & Discoverability
- **Semantic HTML5**: Native ARIA roles and accessibility labels for WCAG compliance.
- **JSON-LD Schema**: Structured data (`Person` schema) for better search engine indexing.
- **Meta Tags**: Full Open Graph (OG) and Twitter Card support for social sharing.
- **Crawler Ready**: Includes `robots.txt` and `sitemap.xml`.

## 🛠️ Technology Stack
- **Frontend**: HTML5, CSS3 (Vanilla), JavaScript (ES6+)
- **Icons**: Material Symbols (Google Fonts)
- **Typography**: Inter (Google Fonts)
- **Animations**: Typed.js, CSS Keyframes, Intersection Observer API
- **APIs**: GitHub REST API, EmailJS SDK

## 📁 File Structure
```
portfolio/
├── .github/workflows/   # GitHub Actions (Auto-deploy to Pages)
├── index.html           # Main entry point (SEO & Structure)
├── styles.css           # Design tokens, themes, & animations
├── script.js            # Data-driven logic & API integrations
├── vercel.json          # Deployment config for Vercel
├── robots.txt           # SEO crawler directions
├── sitemap.xml          # Search engine map
└── Bleigh...CV.pdf      # Downloadable resume
```

## ⚙️ How to Customize

### 1. Update Your Data
Open `script.js` and edit the `portfolioData` object. This controls almost everything on the site:
```javascript
const portfolioData = {
    profile: {
        name: "Your Name",
        titles: ["Developer", "Engineer"],
        // ...
    },
    // ... update stats, skills, experience, education
};
```

### 2. Configure EmailJS
To receive emails directly:
1. Sign up at [emailjs.com](https://www.emailjs.com).
2. Get your Service ID, Template ID, and Public Key.
3. Paste them into the `emailjs` block in `script.js`.

### 3. GitHub Projects
Change the `github.username` in `script.js` to your own username to fetch your repositories.

## 🚢 Deployment

### GitHub Pages
1. Push this code to a new GitHub repository.
2. Go to **Settings > Pages**.
3. Set Build and deployment to **GitHub Actions**.
4. The site will deploy automatically.

### Vercel
1. Import your repository at [vercel.com/new](https://vercel.com/new).
2. No configuration required — `vercel.json` handles everything.

## 📜 License
This project is open-source. Feel free to use and adapt it for your own portfolio.

---
Created by **Bleigh T.J Bande** with modern engineering in mind.
