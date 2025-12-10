const { test, expect } = require('@playwright/test');

test.describe('Link Integrity Tests', () => {
  test('should have working internal anchor links', async ({ page }) => {
    await page.goto('/');

    // Get all internal anchor links (starting with #)
    const anchorLinks = page.locator('a[href^="#"]');
    const count = await anchorLinks.count();
    expect(count).toBeGreaterThan(0);

    // Test a few key anchor links
    const testLinks = [
      { href: '#html', expectedHeading: 'HTML' },
      { href: '#css', expectedHeading: 'CSS' },
      { href: '#html-syntax', expectedHeading: 'Syntax' },
      { href: '#css-syntax', expectedHeading: 'Syntax' },
    ];

    for (const linkTest of testLinks) {
      const link = page.locator(`a[href="${linkTest.href}"]`).first();
      if (await link.count() > 0) {
        // Click the link
        await link.scrollIntoViewIfNeeded();
        await link.click();

        // Wait a moment for scroll
        await page.waitForTimeout(300);

        // Verify the target element is visible (use first() to handle duplicates)
        const target = page.locator(linkTest.href).first();
        await expect(target).toBeVisible();

        // Verify URL hash changed
        expect(page.url()).toContain(linkTest.href);
      }
    }
  });

  test('should have valid internal link targets', async ({ page }) => {
    await page.goto('/');

    // Get all internal anchor links
    const anchorLinks = page.locator('a[href^="#"]');
    const count = await anchorLinks.count();

    const hrefs = [];
    for (let i = 0; i < count; i++) {
      const href = await anchorLinks.nth(i).getAttribute('href');
      if (href && href !== '#') {
        hrefs.push(href);
      }
    }

    // Remove duplicates
    const uniqueHrefs = [...new Set(hrefs)];

    // Verify each anchor has a corresponding target element
    for (const href of uniqueHrefs) {
      const targetId = href.substring(1); // Remove the #
      const target = page.locator(`#${targetId}, [name="${targetId}"]`);
      const targetCount = await target.count();

      expect(targetCount).toBeGreaterThan(0);
    }
  });

  test('should have table of contents links working', async ({ page }) => {
    await page.goto('/');

    // Find TOC section
    const toc = page.locator('h2#toc');
    await expect(toc).toBeVisible();

    // Get links in the TOC area (links near the TOC heading)
    const tocLinks = page.locator('h2#toc ~ div a[href^="#"], h2#toc ~ * a[href^="#"]');
    const count = await tocLinks.count();

    if (count > 0) {
      // Test first few TOC links
      const linksToTest = Math.min(count, 5);

      for (let i = 0; i < linksToTest; i++) {
        const link = tocLinks.nth(i);
        const href = await link.getAttribute('href');

        if (href && href !== '#') {
          const targetId = href.substring(1);
          const target = page.locator(`#${targetId}`).first();
          await expect(target).toBeAttached();
        }
      }
    }
  });

  test('should have external links with proper attributes', async ({ page }) => {
    await page.goto('/');

    // Find external links (http/https)
    const externalLinks = page.locator('a[href^="http"]');
    const count = await externalLinks.count();

    if (count > 0) {
      // Check a few external links
      const linksToCheck = Math.min(count, 5);

      for (let i = 0; i < linksToCheck; i++) {
        const link = externalLinks.nth(i);
        const href = await link.getAttribute('href');

        // Verify href is a valid URL
        expect(href).toMatch(/^https?:\/\/.+/);

        // External links should be visible
        if (await link.isVisible()) {
          await expect(link).toBeVisible();
        }
      }
    }
  });

  test('should have working external documentation links', async ({ page, context }) => {
    await page.goto('/');

    // Test a few known external links
    const knownExternalLinks = [
      'https://html.spec.whatwg.org',
      'https://developer.mozilla.org',
    ];

    for (const linkUrl of knownExternalLinks) {
      const link = page.locator(`a[href*="${linkUrl.replace('https://', '').split('/')[0]}"]`).first();

      if (await link.count() > 0) {
        const href = await link.getAttribute('href');

        // Verify link exists and has valid URL
        expect(href).toMatch(/^https?:\/\/.+/);

        // Test that link would open (without actually navigating)
        // We just verify it has an href and is clickable
        await expect(link).toHaveAttribute('href', /.+/);
      }
    }
  });

  test('should not have broken internal links', async ({ page }) => {
    await page.goto('/');

    // Get all links on the page
    const allLinks = page.locator('a[href]');
    const count = await allLinks.count();

    const brokenLinks = [];

    for (let i = 0; i < count; i++) {
      const link = allLinks.nth(i);
      const href = await link.getAttribute('href');

      // Check internal links only
      if (href && href.startsWith('#') && href !== '#') {
        const targetId = href.substring(1);
        const target = page.locator(`#${targetId}, [name="${targetId}"]`);
        const targetExists = await target.count() > 0;

        if (!targetExists) {
          brokenLinks.push(href);
        }
      }
    }

    // Report any broken links
    expect(brokenLinks).toHaveLength(0);
  });

  test('should have clickable section headings with IDs', async ({ page }) => {
    await page.goto('/');

    // Get all headings with IDs
    const headingsWithIds = page.locator('h2[id], h3[id], h4[id]');
    const count = await headingsWithIds.count();

    expect(count).toBeGreaterThan(0);

    // Verify at least the main section headings exist
    await expect(page.locator('h2#html')).toBeAttached();
    await expect(page.locator('h2#css')).toBeAttached();
  });

  test('should handle navigation between sections', async ({ page }) => {
    await page.goto('/');

    // Navigate to HTML section
    await page.click('a[href="#html"]');
    await page.waitForTimeout(300);
    expect(page.url()).toContain('#html');
    await expect(page.locator('h2#html')).toBeVisible();

    // Navigate to CSS section
    await page.click('a[href="#css"]');
    await page.waitForTimeout(300);
    expect(page.url()).toContain('#css');
    await expect(page.locator('h2#css')).toBeVisible();

    // Go back to top (if there's a top link)
    const topLink = page.locator('a[href="#"], a[href="#top"], a[href="#toc"]').first();
    if (await topLink.count() > 0) {
      await topLink.click();
      await page.waitForTimeout(300);
    }
  });

  test('should maintain link functionality on scroll', async ({ page }) => {
    await page.goto('/');

    // Scroll down the page
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(200);

    // Try clicking a link after scrolling
    const link = page.locator('a[href^="#"]').first();
    const href = await link.getAttribute('href');

    if (href && href !== '#') {
      await link.click();
      await page.waitForTimeout(300);

      // Verify navigation occurred
      expect(page.url()).toContain(href);
    }
  });

  test('should have proper link styling and hover states', async ({ page }) => {
    await page.goto('/');

    const link = page.locator('a').first();
    await expect(link).toBeVisible();

    // Get link styles
    const styles = await link.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        color: computed.color,
        textDecoration: computed.textDecoration,
        cursor: computed.cursor,
      };
    });

    // Links should have cursor pointer
    expect(styles.cursor).toBe('pointer');

    // Links should have some color (not default black)
    expect(styles.color).not.toBe('rgb(0, 0, 0)');
  });
});
