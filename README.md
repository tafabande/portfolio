# Bleigh T.J Bande - Portfolio

A modern, accessible, and production-ready portfolio website showcasing telecommunications engineering expertise and web development projects.

## 🌐 Live Site
Visit the live portfolio at: **https://tafabande.github.io/portfolio/**

## ✨ Features

### Design & User Experience
- Responsive design (mobile, tablet, desktop)
- Vanta.js animated 3D backgrounds
- Dark/Light theme toggle with persistence
- Material Design 3 components
- Smooth scroll animations
- Loading states and micro-interactions

### Functionality
- GitHub project integration with live data
- Contact form with EmailJS integration
- CV download functionality
- Dynamic content from single data source
- Toast notification system
- Form validation with real-time feedback

### Accessibility (WCAG 2.1 Level AA Compliant)
- Semantic HTML5 with ARIA landmarks
- Keyboard navigation support
- Screen reader friendly
- Skip navigation links
- High contrast mode support
- Focus indicators
- Proper heading hierarchy
- Form validation with error messages

### Performance & SEO
- Optimized asset loading
- Resource hints (preconnect, dns-prefetch)
- Lazy loading for Vanta.js
- Service Worker for offline support
- Structured data (JSON-LD)
- Sitemap and robots.txt
- Open Graph and Twitter Card meta tags

### Security
- Content Security Policy (CSP)
- Input sanitization
- Rate limiting for form submissions
- HTTPS enforcement
- Security headers (.htaccess)
- Security.txt (RFC 9116)

### Analytics (Optional)
- Google Analytics 4 integration
- Privacy-friendly configuration
- Event tracking for key user actions
- IP anonymization

## 🚀 Deployment Options

### Option 1: GitHub Pages (Current)
1. Push to GitHub repository
2. Go to Settings → Pages
3. Select branch: `main`
4. Select folder: `/ (root)`
5. Click Save
6. Site will be live at: `https://tafabande.github.io/portfolio/`

### Option 2: Vercel
```bash
npm i -g vercel
vercel
```
- Instant deployment
- Auto SSL
- Global CDN
- Free tier available

### Option 3: Netlify
```bash
npm i -g netlify-cli
netlify deploy
```
- Drag-and-drop deployment
- Form handling built-in
- Auto SSL
- Free tier available

### Option 4: Custom Domain
1. Purchase domain (e.g., bleighbande.com)
2. Add CNAME record pointing to GitHub Pages
3. Add CNAME file to repo root with domain name
4. Enable HTTPS in repo settings

## 🧪 Running Tests

Install dependencies:
```bash
npm install
```

Run all tests:
```bash
npm test
```

Run tests with UI:
```bash
npm run test:ui
```

Run tests in headed mode (see browser):
```bash
npm run test:headed
```

Debug tests:
```bash
npm run test:debug
```

## 🛠️ Local Development

Start local server:
```bash
npm run serve
# or
python3 -m http.server 8000
```

Visit: `http://localhost:8000`

## 📊 Analytics Setup (Optional)

1. Create a Google Analytics 4 property
2. Get your Measurement ID (format: G-XXXXXXXXXX)
3. In `index.html`, replace `G-XXXXXXXXXX` with your ID on lines 40 and 42
4. Update `window.GA_MEASUREMENT_ID` on line 40

The analytics code will only load if a valid ID is configured.

## 📧 Contact Form Setup

The contact form is already configured with EmailJS:
- Service ID: `service_q7qmugv`
- Template ID: `template_iqwypms`
- Public Key: `iGpebApjTDVfppOM0`

To use your own EmailJS account:
1. Sign up at [emailjs.com](https://www.emailjs.com)
2. Create an email service and template
3. Update the values in `script.js` under `emailjs` object

## 📁 Project Structure

```
portfolio/
├── index.html           # Main HTML file
├── styles.css           # All styles
├── script.js            # All JavaScript logic
├── sw.js               # Service worker
├── .htaccess           # Security headers
├── robots.txt          # SEO crawler instructions
├── sitemap.xml         # Site structure for search engines
├── .well-known/
│   └── security.txt    # Security policy
├── tests/
│   └── e2e.test.js    # End-to-end tests
├── package.json        # Dependencies and scripts
└── playwright.config.js # Test configuration
```

## 🎨 Customization

### Update Personal Information
Edit the `portfolioData` object in `script.js`:
```javascript
const portfolioData = {
    profile: {
        name: "Your Name",
        titles: ["Title 1", "Title 2"],
        // ...
    },
    // Update skills, experience, education, etc.
};
```

### Change GitHub Username
Update in `script.js`:
```javascript
github: {
    username: "yourusername"
}
```

### Modify Theme Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --md-primary: #A8C7FA;
    /* ... other colors */
}
```

## 📱 Browser Support
- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## ♿ Accessibility Features
- WCAG 2.1 Level AA compliant
- Keyboard navigation throughout
- Screen reader tested
- Proper focus management
- Semantic HTML
- ARIA labels and roles
- High contrast mode support
- Reduced motion support
- Error message announcements

## 🔒 Security Features
- Content Security Policy headers
- XSS protection
- HTTPS enforced
- Input sanitization
- Rate limiting on form submissions
- No external dependencies from untrusted sources
- Security.txt for responsible disclosure

## 🧰 Development Tools

### Linting
```bash
npm run lint:html
npm run lint:css
npm run lint:js
```

### Testing
The project includes comprehensive E2E tests covering:
- Page loading and navigation
- Form validation
- Theme toggling
- Mobile menu functionality
- Accessibility features
- Keyboard navigation
- API integrations
- Responsive behavior

## 📈 Performance Optimization
- Lazy loading for non-critical scripts
- Resource hints for faster loading
- Optimized asset delivery
- Service worker caching
- Minimal external dependencies
- Efficient CSS animations
- Debounced scroll events

## 🌟 Key Technologies
- **HTML5**: Semantic markup with accessibility in mind
- **CSS3**: Modern layout with Grid and Flexbox
- **Vanilla JavaScript**: No framework dependencies
- **Vanta.js**: 3D animated backgrounds
- **Typed.js**: Typewriter effect
- **EmailJS**: Email service integration
- **GitHub API**: Project data fetching
- **Playwright**: End-to-end testing

## 📄 License
MIT License - See LICENSE file for details

## 👤 Author
**Bleigh T.J Bande**
- GitHub: [@tafabande](https://github.com/tafabande)
- LinkedIn: [bleighbande](https://linkedin.com/in/bleighbande)
- Email: bleighbande@gmail.com

## 🤝 Contributing
This is a personal portfolio, but suggestions and improvements are welcome! Feel free to open an issue or submit a pull request.

## 📝 Changelog

### Version 1.0.0 (Current)
- Initial production-ready release
- Full accessibility compliance (WCAG 2.1 AA)
- Comprehensive testing infrastructure
- Security hardening
- Analytics integration
- Service worker for offline support
- Automated testing with Playwright

---

**Built with modern web standards, accessibility, and security in mind.**
