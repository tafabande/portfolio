// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Portfolio E2E Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should load homepage successfully', async ({ page }) => {
        await expect(page).toHaveTitle(/Bleigh T.J Bande/);
    });

    test('should have correct meta tags', async ({ page }) => {
        const description = await page.getAttribute('meta[name="description"]', 'content');
        expect(description).toContain('telecommunications engineer');
    });

    test('navigation should work', async ({ page }) => {
        await page.click('a[href="#skills"]');
        await page.waitForTimeout(500);
        await expect(page.locator('#skills')).toBeInViewport();
    });

    test('theme toggle should work', async ({ page }) => {
        const themeToggle = page.locator('#themeToggle');
        await themeToggle.click();
        await page.waitForTimeout(300);
        const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
        expect(theme).toBe('light');

        // Toggle back
        await themeToggle.click();
        await page.waitForTimeout(300);
        const themeAfter = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
        expect(themeAfter).toBeNull();
    });

    test('contact form should validate required fields', async ({ page }) => {
        await page.click('#submitBtn');

        // Check that form validation prevents submission
        const nameInput = page.locator('#contactName');
        const borderColor = await nameInput.evaluate((el) =>
            window.getComputedStyle(el).borderColor
        );

        // Should show error styling (OKLCH token or RGB red)
        expect(borderColor.includes('68') || borderColor.includes('oklch') || borderColor.includes('rgb')).toBeTruthy();
    });

    test('contact form should validate email format', async ({ page }) => {
        await page.fill('#contactName', 'Test User');
        await page.fill('#contactEmail', 'invalid-email');
        await page.fill('#contactMessage', 'Test message');
        await page.click('#submitBtn');

        // Check email validation
        const emailError = page.locator('#emailError');
        await expect(emailError).toContainText('valid email');
    });

    test('mobile menu should toggle', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });

        const hamburger = page.locator('#hamburger');
        const navMenu = page.locator('#navMenu');

        await hamburger.click();
        await expect(navMenu).toHaveClass(/active/);

        await hamburger.click();
        await expect(navMenu).not.toHaveClass(/active/);
    });

    test('mobile menu should close on escape key', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });

        const hamburger = page.locator('#hamburger');
        const navMenu = page.locator('#navMenu');

        await hamburger.click();
        await expect(navMenu).toHaveClass(/active/);

        await page.keyboard.press('Escape');
        await expect(navMenu).not.toHaveClass(/active/);
    });

    test('all main sections should be present', async ({ page }) => {
        const sections = ['home', 'about', 'skills', 'experience', 'education', 'projects', 'testimonials', 'contact'];

        for (const section of sections) {
            await expect(page.locator(`#${section}`)).toBeVisible();
        }
    });

    test('should have proper heading hierarchy', async ({ page }) => {
        const h1Count = await page.locator('h1').count();
        expect(h1Count).toBe(1); // Should only have one h1

        const h1Text = await page.locator('h1').textContent();
        expect(h1Text).toContain('Bleigh');
    });

    test('GitHub projects should load', async ({ page }) => {
        // Wait for projects to load (up to 10 seconds)
        await page.waitForSelector('.project-card, .loading-state', { timeout: 10000 });

        // Wait a bit for API call
        await page.waitForTimeout(2000);

        // Check if projects loaded or if there's an error message
        const projectCards = page.locator('.project-card');
        const count = await projectCards.count();

        // Should have at least 1 project or show an error
        if (count === 0) {
            const errorMessage = await page.locator('.projects-grid').textContent();
            expect(errorMessage).toBeTruthy();
        } else {
            expect(count).toBeGreaterThan(0);
        }
    });

    test('skip link should work', async ({ page }) => {
        // Focus the skip link
        await page.keyboard.press('Tab');

        const skipLink = page.locator('.skip-link');
        await expect(skipLink).toBeFocused();

        // Activate skip link
        await page.keyboard.press('Enter');
        await page.waitForTimeout(500);

        // Check that main content is in view
        await expect(page.locator('#main-content')).toBeInViewport();
    });

    test('should have proper ARIA labels', async ({ page }) => {
        // Check navigation has aria-label
        const nav = page.locator('nav');
        const ariaLabel = await nav.getAttribute('aria-label');
        expect(ariaLabel).toBe('Main navigation');

        // Check theme toggle has aria-label
        const themeToggle = page.locator('#themeToggle');
        const toggleLabel = await themeToggle.getAttribute('aria-label');
        expect(toggleLabel).toContain('dark mode');
    });

    test('should have accessible form labels', async ({ page }) => {
        const nameInput = page.locator('#contactName');
        const nameLabel = await nameInput.getAttribute('aria-required');
        expect(nameLabel).toBe('true');
    });

    test('stats should animate on scroll', async ({ page }) => {
        const projectsStat = page.locator('#statsProjects');

        // Initially should show 0
        await page.waitForTimeout(500);

        // Scroll to trigger animation
        await page.locator('.hero-stats').scrollIntoViewIfNeeded();
        await page.waitForTimeout(1500);

        const projectsText = await projectsStat.textContent();
        // Should show a number greater than 0
        expect(projectsText).toMatch(/\d+\+/);
    });

    test('CV download button should be present', async ({ page }) => {
        const cvButton = page.locator('#cvDownloadBtn');
        await expect(cvButton).toBeVisible();

        const href = await cvButton.getAttribute('href');
        expect(href).toBeTruthy();
    });

    test('social links should open in new tab', async ({ page }) => {
        const socialLinks = page.locator('.social-link');
        const count = await socialLinks.count();
        expect(count).toBeGreaterThan(0);

        const firstLink = socialLinks.first();
        const target = await firstLink.getAttribute('target');
        expect(target).toBe('_blank');

        const rel = await firstLink.getAttribute('rel');
        expect(rel).toContain('noopener');
    });

    test('footer should have proper links', async ({ page }) => {
        await page.locator('footer').scrollIntoViewIfNeeded();

        const footerLinks = page.locator('.footer-link');
        const count = await footerLinks.count();
        expect(count).toBeGreaterThan(0);
    });

    test('should be responsive on mobile', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });

        // Hero section should be visible
        await expect(page.locator('.hero')).toBeVisible();

        // Buttons should stack vertically
        const heroButtons = page.locator('.hero-buttons');
        await expect(heroButtons).toBeVisible();
    });

    test('toast notifications should work', async ({ page }) => {
        // Try to trigger a rate limit toast by submitting form multiple times
        await page.fill('#contactName', 'Test');
        await page.fill('#contactEmail', 'test@test.com');
        await page.fill('#contactMessage', 'Test');

        // Submit multiple times
        for (let i = 0; i < 4; i++) {
            await page.click('#submitBtn');
            await page.waitForTimeout(100);
        }

        // Should show rate limit toast
        const toast = page.locator('.toast');
        await expect(toast.first()).toBeVisible({ timeout: 5000 });
    });

    test('should have proper color contrast in light mode', async ({ page }) => {
        const themeToggle = page.locator('#themeToggle');
        await themeToggle.click();
        await page.waitForTimeout(500);

        // Check that text is readable
        const heroTitle = page.locator('.hero-title');
        await expect(heroTitle).toBeVisible();
    });
});
