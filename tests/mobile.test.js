const { test, expect } = require('@playwright/test');

test.describe('Mobile App Hub E2E Tests (Android Viewport)', () => {
    test.use({ viewport: { width: 393, height: 851 } }); // Google Pixel 7 Android viewport

    test.beforeEach(async ({ page }) => {
        await page.goto('file:///' + process.cwd().replace(/\\/g, '/') + '/mobile/index.html');
    });

    test('should load mobile dashboard with correct stats and titles', async ({ page }) => {
        await expect(page.locator('.top-bar-name')).toHaveText('Bleigh T.J Bande');
        await expect(page.locator('#dashProjects')).toHaveText('10+');
        await expect(page.locator('#dashExp')).toHaveText('1 Yr');
        await expect(page.locator('#dashDiplomas')).toHaveText('1');
    });

    test('should switch tabs via bottom navigation', async ({ page }) => {
        // Switch to Documents
        await page.locator('.nav-item[data-target="tab-docs"]').click();
        await expect(page.locator('#tab-docs')).toHaveClass(/active/);
        await expect(page.locator('#tab-dashboard')).not.toHaveClass(/active/);

        // Switch to Form Editor
        await page.locator('.nav-item[data-target="tab-form"]').click();
        await expect(page.locator('#tab-form')).toHaveClass(/active/);
        await expect(page.locator('#formName')).toHaveValue('Bleigh T.J Bande');

        // Switch to Deploy / Cloud
        await page.locator('.nav-item[data-target="tab-deploy"]').click();
        await expect(page.locator('#tab-deploy')).toHaveClass(/active/);
    });

    test('should dynamically manage education credentials (degrees, diplomas, masters, phds)', async ({ page }) => {
        await page.locator('.nav-item[data-target="tab-form"]').click();
        
        // Check initial qualifications count
        const initialCards = await page.locator('#educationEntriesContainer .card').count();
        expect(initialCards).toBeGreaterThanOrEqual(2);

        // Click Add button to add a new qualification
        await page.locator('button[onclick="addNewEducationEntry()"]').click();
        
        // Verify a new card was added
        const newCount = await page.locator('#educationEntriesContainer .card').count();
        expect(newCount).toBe(initialCards + 1);

        // Set the new card type to Master's Degree
        const lastCard = page.locator('#educationEntriesContainer .card').last();
        const typeSelect = lastCard.locator('select').first();
        await typeSelect.selectOption("Master's");

        // Save & Sync via FAB
        await page.locator('#mainFab').click();
        await expect(page.locator('#mobileToast')).toHaveClass(/show/);
    });

    test('should update skill XP values with sliders', async ({ page }) => {
        await page.locator('.nav-item[data-target="tab-form"]').click();
        const firstSlider = page.locator('#skillSlidersContainer input[type="range"]').first();
        await firstSlider.fill('95');
        await firstSlider.dispatchEvent('input');
        
        await expect(page.locator('#skillVal_0')).toContainText('95% · 950 XP');
    });

    test('should trigger cloud push and export', async ({ page }) => {
        await page.locator('.nav-item[data-target="tab-deploy"]').click();
        
        const pushBtn = page.locator('#pushCloudBtn');
        await pushBtn.click();
        await expect(page.locator('#mobileToast')).toHaveClass(/show/);
    });

    test('should toggle dark/light theme on mobile', async ({ page }) => {
        const themeBtn = page.locator('#themeToggleBtn');
        await themeBtn.click();
        const htmlTheme = await page.locator('html').getAttribute('data-theme');
        expect(htmlTheme).toBe('light');
    });
});
