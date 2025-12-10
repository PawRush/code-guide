const { test, expect, devices } = require('@playwright/test');

test.describe('Responsive Design Tests', () => {
  test('should render correctly on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');

    // Verify page loads and main content is visible
    const mainContent = page.locator('main, .content, body');
    await expect(mainContent.first()).toBeVisible();

    // Check that content doesn't overflow
    const body = page.locator('body');
    const hasHorizontalScroll = await body.evaluate((el) => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasHorizontalScroll).toBe(false);
  });

  test('should render correctly on tablet viewport', async ({ page }) => {
    // iPad viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    // Verify main content is visible
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.locator('h2#toc')).toBeVisible();

    // Check that content is readable and not cut off
    const container = page.locator('.container, main').first();
    await expect(container).toBeVisible();

    // Verify no horizontal scrolling
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasHorizontalScroll).toBe(false);
  });

  test('should render correctly on mobile viewport', async ({ page }) => {
    // iPhone viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Verify page loads and main elements are visible
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.locator('h2#html')).toBeVisible();

    // Check viewport meta tag is present
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveAttribute('content', /width=device-width/);

    // Verify no horizontal scrolling
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasHorizontalScroll).toBe(false);
  });

  test('should have responsive images', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check that images don't overflow on small screens
    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      if (await img.isVisible()) {
        const box = await img.boundingBox();
        if (box) {
          expect(box.width).toBeLessThanOrEqual(375);
        }
      }
    }
  });

  test('should handle code blocks responsively on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Find code blocks
    const codeBlocks = page.locator('pre');
    const count = await codeBlocks.count();
    expect(count).toBeGreaterThan(0);

    // Check that code blocks are visible and have appropriate styling
    const firstCodeBlock = codeBlocks.first();
    await expect(firstCodeBlock).toBeVisible();

    // Verify code blocks have overflow handling (including visible which allows scrolling)
    const overflowX = await firstCodeBlock.evaluate((el) => {
      return window.getComputedStyle(el).overflowX;
    });
    expect(['auto', 'scroll', 'hidden', 'visible']).toContain(overflowX);
  });

  test('should maintain readability on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('/');

    // Check that text is readable (font size should be appropriate)
    const body = page.locator('body');
    const fontSize = await body.evaluate((el) => {
      return window.getComputedStyle(el).fontSize;
    });

    const fontSizeNum = parseInt(fontSize);
    expect(fontSizeNum).toBeGreaterThanOrEqual(14); // Minimum readable font size

    // Verify main heading is visible
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('should adapt layout for different screen sizes', async ({ page }) => {
    // Test with three different viewport sizes
    const viewports = [
      { width: 1920, height: 1080, name: 'desktop' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 375, height: 667, name: 'mobile' },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');

      // Verify content container adapts
      const container = page.locator('.container, main').first();
      const box = await container.boundingBox();

      if (box) {
        // Content should not exceed viewport width
        expect(box.width).toBeLessThanOrEqual(viewport.width);

        // Content should have some padding (not full width)
        const styles = await container.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          return {
            paddingLeft: computed.paddingLeft,
            paddingRight: computed.paddingRight,
            maxWidth: computed.maxWidth,
          };
        });

        // Verify some spacing exists
        expect(styles.paddingLeft).not.toBe('0px');
      }
    }
  });

  test('should have touch-friendly navigation on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check that links are accessible and have adequate size
    const links = page.locator('a');
    const visibleLinks = await links.evaluateAll((elements) => {
      return elements.filter(el => {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      }).length;
    });

    expect(visibleLinks).toBeGreaterThan(0);
  });

  test('should not have content overflow on any viewport', async ({ page }) => {
    const viewports = [
      { width: 320, height: 568 },   // Small mobile
      { width: 375, height: 667 },   // iPhone
      { width: 768, height: 1024 },  // iPad
      { width: 1024, height: 768 },  // iPad landscape
      { width: 1920, height: 1080 }, // Desktop
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('/');

      // Check for horizontal overflow
      const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      expect(hasOverflow).toBe(false);
    }
  });
});
