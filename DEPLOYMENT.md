# Deployment Guide

## Current Deployment: GitHub Pages

### Live URL
🌐 **https://tafabande.github.io/portfolio/**

### Deployment Status
Check deployment status at: https://github.com/tafabande/portfolio/deployments

---

## Quick Deployment Steps

### How to Update the Live Site
1. Make changes locally
2. Test locally: `python3 -m http.server 8000` (visit http://localhost:8000)
3. Commit changes: `git add . && git commit -m "Update portfolio"`
4. Push to GitHub: `git push origin main`
5. Wait 1-2 minutes for GitHub Pages to rebuild
6. Visit live site to verify changes

---

## Deployment Options

### Option 1: GitHub Pages (Current Setup)

**Pros:**
- Free hosting
- Automatic deployment on push
- SSL certificate included
- Good for static sites
- Custom domain support

**Setup:**
1. Repository is already configured
2. Site deploys automatically on every push to `main` branch
3. No additional configuration needed

**Custom Domain Setup:**
1. Purchase a domain (e.g., from Namecheap, GoDaddy, Google Domains)
2. Create a `CNAME` file in repository root with your domain:
   ```
   bleighbande.com
   ```
3. In your domain provider's DNS settings:
   - Add CNAME record:
     - Type: CNAME
     - Host: www
     - Value: tafabande.github.io
   - Add A records for apex domain:
     - 185.199.108.153
     - 185.199.109.153
     - 185.199.110.153
     - 185.199.111.153
4. In GitHub repo Settings → Pages:
   - Enter your custom domain
   - Enable "Enforce HTTPS"
5. Wait for DNS propagation (up to 24 hours)

---

### Option 2: Vercel

**Pros:**
- Instant deployment
- Automatic SSL
- Global CDN
- Preview deployments for PRs
- Serverless functions support (if needed later)
- Free tier available

**Deployment Steps:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd portfolio
vercel

# Follow prompts:
# - Set up and deploy: Y
# - Which scope: Personal account
# - Link to existing project: N
# - Project name: portfolio
# - Directory: ./
# - Override settings: N

# Production deployment
vercel --prod
```

**Or via Web Interface:**
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure:
   - Framework Preset: Other
   - Build Command: (leave empty)
   - Output Directory: ./
4. Click "Deploy"
5. Site will be live at: `portfolio-username.vercel.app`

**Custom Domain on Vercel:**
1. Go to project settings
2. Domains → Add Domain
3. Enter your domain
4. Follow DNS configuration instructions

---

### Option 3: Netlify

**Pros:**
- One-click deployment
- Continuous deployment
- Form handling (can enhance contact form)
- A/B testing
- Serverless functions
- Free tier available

**Deployment Steps:**

**Method 1: Drag and Drop**
1. Visit [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag your portfolio folder
3. Site deployed instantly

**Method 2: CLI**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
cd portfolio
netlify deploy

# Production deployment
netlify deploy --prod
```

**Method 3: Git Integration (Recommended)**
1. Go to [app.netlify.com](https://app.netlify.com)
2. New site from Git
3. Connect GitHub repository
4. Configure:
   - Build command: (leave empty)
   - Publish directory: ./
5. Click "Deploy site"
6. Automatic deployments on every push

**Custom Domain on Netlify:**
1. Site settings → Domain management
2. Add custom domain
3. Follow DNS instructions

---

### Option 4: Cloudflare Pages

**Pros:**
- Fastest global CDN
- Unlimited bandwidth
- Web analytics included
- DDoS protection
- Free tier available

**Deployment Steps:**
1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Pages → Create a project
3. Connect GitHub repository
4. Configure:
   - Build command: (none)
   - Build output directory: /
5. Click "Save and Deploy"

**Custom Domain:**
- Automatically available if domain is on Cloudflare
- Or follow DNS instructions

---

### Option 5: Custom Server (VPS/Dedicated)

**For Advanced Users**

**Requirements:**
- Linux server (Ubuntu/Debian)
- Nginx or Apache
- SSL certificate (Let's Encrypt)

**Setup with Nginx:**
```bash
# Install Nginx
sudo apt update
sudo apt install nginx

# Create site directory
sudo mkdir -p /var/www/portfolio

# Upload files
scp -r * user@server:/var/www/portfolio/

# Configure Nginx
sudo nano /etc/nginx/sites-available/portfolio

# Paste configuration:
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/portfolio;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Install SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## Environment Configuration

### Environment Variables
No environment variables are required for basic deployment. The portfolio is a static site.

**For Analytics (Optional):**
- Update `GA_MEASUREMENT_ID` in `index.html` (line 40)

**For EmailJS (Optional):**
- Update credentials in `script.js` under `portfolioData.emailjs`

---

## Build Process

### No Build Step Required
This is a static HTML/CSS/JS site. No compilation or transpilation needed.

### For Testing Before Deployment:
```bash
# Install dependencies (for testing)
npm install

# Run tests
npm test

# Start local server
npm run serve
```

---

## Performance Optimization

### Already Implemented:
- Gzip compression (via server)
- Browser caching (via .htaccess)
- Resource hints (preconnect, dns-prefetch)
- Lazy loading for Vanta.js
- Service worker caching

### GitHub Pages Automatic Features:
- Global CDN
- HTTP/2
- SSL certificate
- Automatic compression

---

## Monitoring and Analytics

### Deployment Monitoring:
- GitHub Actions: See deployments in repo Actions tab
- GitHub Pages: Check status in repo Settings → Pages

### Traffic Analytics:
1. **Google Analytics 4** (Optional, Privacy-Focused)
   - Already integrated
   - Just add your Measurement ID

2. **GitHub Insights**
   - Repository → Insights → Traffic
   - Shows visitors and clones

3. **Uptime Monitoring** (Optional)
   - [UptimeRobot](https://uptimerobot.com) - Free
   - [Pingdom](https://pingdom.com)
   - [StatusCake](https://statuscake.com)

---

## Troubleshooting

### Common Issues:

**1. 404 Error After Deployment**
- Check GitHub Pages is enabled (Settings → Pages)
- Verify branch is set to `main`
- Ensure folder is set to `/ (root)`
- Wait 2-3 minutes for initial deployment

**2. CSS/JS Not Loading**
- Check all paths are relative (not absolute)
- Verify files are committed and pushed
- Clear browser cache (Ctrl+Shift+R)

**3. Vanta.js Not Working**
- Expected behavior on mobile (performance optimization)
- Check browser console for CDN errors
- Verify Three.js and Vanta.js scripts load

**4. Contact Form Not Sending**
- Verify EmailJS credentials in `script.js`
- Check browser console for errors
- Ensure user's browser allows JavaScript

**5. GitHub Projects Not Loading**
- Check GitHub API rate limit (60 requests/hour unauthenticated)
- Verify username is correct in `script.js`
- Check browser console for API errors

---

## Rollback Procedure

### If Deployment Breaks:

**Option 1: Git Revert**
```bash
# Find the last working commit
git log --oneline

# Revert to that commit
git revert HEAD
git push origin main
```

**Option 2: Force Push Previous Version**
```bash
# Reset to previous commit
git reset --hard HEAD~1

# Force push (use carefully)
git push --force origin main
```

**Option 3: Restore from GitHub**
1. Go to repository → Commits
2. Find last working commit
3. Click "Browse files"
4. Download as ZIP
5. Replace current files
6. Commit and push

---

## Security Considerations

### Deployed Security Features:
- ✅ HTTPS enforced
- ✅ Security headers (.htaccess)
- ✅ Content Security Policy
- ✅ XSS protection
- ✅ Input sanitization
- ✅ Rate limiting
- ✅ Security.txt for responsible disclosure

### Regular Maintenance:
- Update dependencies monthly: `npm update`
- Check for security advisories
- Review GitHub Dependabot alerts
- Monitor form submissions for spam

---

## Continuous Integration/Deployment (CI/CD)

### GitHub Actions (Already Configured)
GitHub Pages automatically deploys on every push to `main`.

### Optional: Add GitHub Actions Workflow
Create `.github/workflows/test.yml`:
```yaml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm test
```

---

## Backup Strategy

### Automated Backups:
- GitHub repository is the source of truth
- All changes are version controlled

### Manual Backup:
```bash
# Clone repository
git clone https://github.com/tafabande/portfolio.git portfolio-backup

# Or download ZIP from GitHub
```

---

## Domain and SSL Management

### SSL Certificate:
- **GitHub Pages**: Automatic, free SSL via Let's Encrypt
- **Vercel/Netlify/Cloudflare**: Automatic SSL
- **Custom Server**: Use Let's Encrypt (Certbot)

### Certificate Renewal:
- All platforms handle automatic renewal
- No manual intervention needed

---

## Support and Resources

### Documentation:
- GitHub Pages: https://docs.github.com/pages
- Vercel: https://vercel.com/docs
- Netlify: https://docs.netlify.com
- Cloudflare Pages: https://developers.cloudflare.com/pages

### Community:
- GitHub Issues: For bug reports
- Stack Overflow: For technical questions
- Dev.to: For deployment tutorials

---

## Checklist Before Going Live

- [ ] Test all links work
- [ ] Verify contact form sends emails
- [ ] Check mobile responsiveness
- [ ] Test in multiple browsers
- [ ] Run accessibility tests
- [ ] Verify CV download works
- [ ] Check GitHub projects load
- [ ] Test theme toggle
- [ ] Verify analytics (if enabled)
- [ ] Check all images load
- [ ] Test on slow connection
- [ ] Verify SSL certificate
- [ ] Check sitemap.xml is accessible
- [ ] Test keyboard navigation
- [ ] Verify skip link works

---

**Last Updated:** 2026-05-05

**Maintained By:** Bleigh T.J Bande
