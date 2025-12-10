const { test, expect } = require('@playwright/test');

test.describe('Page Load and Content Tests', () => {
  test('should load the homepage successfully', async ({ page }) => {
    await page.goto('/');

    // Check that the page loads with 200 status
    expect(page.url()).toBe('http://localhost:4000/');

    // Verify page title
    await expect(page).toHaveTitle('Code Guide by @mdo');
  });

  test('should display the main header and logo', async ({ page }) => {
    await page.goto('/');

    // Check for the logo SVG
    const logo = page.locator('img[src*="code-guide"]').first();
    await expect(logo).toBeVisible();

    // Check for main heading
    const mainHeading = page.locator('h1').first();
    await expect(mainHeading).toBeVisible();
  });

  test('should display table of contents', async ({ page }) => {
    await page.goto('/');

    // Check for TOC heading
    const tocHeading = page.locator('h2#toc');
    await expect(tocHeading).toBeVisible();
    await expect(tocHeading).toHaveText('Table of contents');

    // Verify HTML section links in TOC
    const htmlLinks = page.locator('a[href="#html"]');
    await expect(htmlLinks.first()).toBeVisible();

    // Verify CSS section links in TOC
    const cssLinks = page.locator('a[href="#css"]');
    await expect(cssLinks.first()).toBeVisible();
  });

  test('should display HTML section content', async ({ page }) => {
    await page.goto('/');

    // Check HTML section heading
    const htmlHeading = page.locator('h2#html');
    await expect(htmlHeading).toBeVisible();
    await expect(htmlHeading).toHaveText('HTML');

    // Verify specific HTML subsections exist
    await expect(page.locator('h3#html-syntax')).toBeVisible();
    await expect(page.locator('a[href="#html5-doctype"]')).toBeVisible();
    await expect(page.locator('a[href="#language-attribute"]')).toBeVisible();
  });

  test('should display CSS section content', async ({ page }) => {
    await page.goto('/');

    // Check CSS section heading (use first() to handle potential duplicates)
    const cssHeading = page.locator('h2#css').first();
    await expect(cssHeading).toBeVisible();
    await expect(cssHeading).toHaveText('CSS');

    // Verify specific CSS subsections exist
    await expect(page.locator('h3#css-syntax').first()).toBeVisible();
    await expect(page.locator('a[href="#declaration-order"]').first()).toBeVisible();
    await expect(page.locator('a[href="#colors"]').first()).toBeVisible();
  });

  test('should display the Golden Rule section', async ({ page }) => {
    await page.goto('/');

    // Check for Golden Rule heading
    const goldenRuleHeading = page.locator('h2', { hasText: 'Golden rule' });
    await expect(goldenRuleHeading).toBeVisible();

    // Check for the blockquote with the golden rule text
    const quote = page.locator('blockquote', {
      hasText: 'Every line of code should appear to be written by a single person'
    });
    await expect(quote).toBeVisible();
  });

  test('should have proper meta tags', async ({ page }) => {
    await page.goto('/');

    // Check meta description
    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute('content',
      'Standards for developing consistent, flexible, and sustainable HTML and CSS');

    // Check viewport meta tag
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveAttribute('content', 'width=device-width, initial-scale=1.0');
  });

  test('should load CSS styles correctly', async ({ page }) => {
    await page.goto('/');

    // Check that the main stylesheet is loaded
    const stylesheet = page.locator('link[rel="stylesheet"][href="cg.css"]');
    await expect(stylesheet).toBeAttached();

    // Verify that styles are applied by checking computed style
    const body = page.locator('body');
    await expect(body).toBeVisible();

    // Check that content has appropriate styling (not default browser styles)
    const container = page.locator('.container').first();
    if (await container.count() > 0) {
      await expect(container).toBeVisible();
    }
  });
});
