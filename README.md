# Professional Portfolio Website

A modern, fully responsive portfolio website built with HTML5, CSS3, and vanilla JavaScript. Features a professional grey theme with dynamic content rendering and smooth animations.

## Features

### 🎨 Design & Aesthetics
- **Modern Grey Theme**: Professional color scheme with primary color #2c3e50 and accent color #3498db
- **Fully Responsive**: Mobile-first design that works seamlessly on all devices
- **Smooth Animations**: Slide-in animations, hover effects, and scroll animations
- **Professional Layout**: Clean, organized sections with proper spacing

### ✨ Key Sections

1. **Navigation Bar**
   - Sticky navigation with active link highlighting
   - Mobile hamburger menu for smaller screens
   - Smooth scrolling to sections

2. **Hero Section**
   - Impressive landing page with gradient background
   - Statistics cards showing key metrics (15+ projects, 8+ years experience, etc.)
   - Call-to-action buttons
   - Animated scroll indicator

3. **About Section**
   - Professional summary and introduction

4. **Skills Section**
   - Organized by categories (Languages, Frontend, Backend, Database & Cloud, Tools)
   - Interactive skill cards with hover effects
   - 5 skill categories with 30+ technologies

5. **Experience Section**
   - Timeline view of work history
   - Visual timeline with dots and connecting lines
   - Detailed job descriptions

6. **Education Section**
   - Academic credentials and certifications
   - Degree details with years
   - Institution information

7. **Projects Section**
   - 6 featured projects
   - Project cards with descriptions
   - Technology stacks for each project
   - Links to project details
   - Hover animations and effects

8. **Contact Section**
   - Contact information display
   - Contact form with validation
   - Email, phone, location, and social media links

## File Structure

```
portfolio/
├── index.html       # Main HTML file with semantic structure
├── styles.css       # Complete CSS with responsive design
├── script.js        # JavaScript for dynamic content and interactivity
└── README.md        # This file
```

## How to Use

### 1. Edit Portfolio Data
Open `script.js` and modify the `portfolioData` object:

```javascript
const portfolioData = {
    profile: {
        name: "Your Name",
        title: "Your Title",
        email: "your.email@example.com",
        // ... more details
    },
    skills: [ /* your skills */ ],
    experience: [ /* your experience */ ],
    education: [ /* your education */ ],
    projects: [ /* your projects */ ],
    contact: { /* your contact info */ }
};
```

### 2. Update Statistics
Modify the `stats` object in `portfolioData`:

```javascript
stats: {
    projects: "15+",
    experience: "8+",
    clients: "20+",
    certifications: "5"
}
```

### 3. Customize Colors
Edit CSS variables in `styles.css`:

```css
:root {
    --primary-color: #2c3e50;
    --secondary-color: #34495e;
    --accent-color: #3498db;
    /* ... more variables */
}
```

## Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Flexbox, Grid, Animations, Media Queries
- **JavaScript**: Vanilla JS for DOM manipulation and interactivity
- **Responsive Design**: Mobile-first approach with breakpoints at 768px and 480px

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Dynamic Features

✅ **Automatic Content Population**: All sections populate from the `portfolioData` object
✅ **Active Link Highlighting**: Navigation links highlight based on scroll position
✅ **Form Validation**: Contact form validates input before submission
✅ **Smooth Scrolling**: All navigation links use smooth scroll behavior
✅ **Intersection Observer**: Elements animate in as they come into view
✅ **Mobile Navigation**: Hamburger menu for mobile devices
✅ **Hover Effects**: Interactive cards and buttons with visual feedback

## Customization Tips

### Colors
- Change gradient colors in `.hero` section
- Modify accent color for links and highlights
- Update card backgrounds in skill and project sections

### Content
- Add more skills or skill categories
- Include additional projects
- Update experience entries with your history
- Add certifications to education section

### Sections
- Hide sections by removing them from HTML
- Reorder sections by moving them in HTML
- Add new sections following the same structure

## Performance

- Lightweight: No external dependencies
- Fast loading: Minimal file sizes
- Optimized: CSS animations use GPU acceleration
- SEO-friendly: Semantic HTML structure

## Future Enhancements

- Add dark mode toggle
- Implement project filtering
- Add blog section
- Integrate with email service for contact form
- Add testimonials section
- Implement search functionality

## License

Feel free to use and customize this portfolio for your personal or professional use.

---

**Created with ❤️ - Your Professional Portfolio**
