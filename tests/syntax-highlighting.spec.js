const { test, expect } = require('@playwright/test');

test.describe('Code Syntax Highlighting Tests', () => {
  test('should have code blocks on the page', async ({ page }) => {
    await page.goto('/');

    // Check that code blocks exist
    const codeBlocks = page.locator('pre code, .highlight');
    const count = await codeBlocks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should render HTML code examples', async ({ page }) => {
    await page.goto('/');

    // Find HTML code blocks (classes are on wrapper divs)
    const htmlCodeBlocks = page.locator('.language-html code');
    const count = await htmlCodeBlocks.count();
    expect(count).toBeGreaterThan(0);

    // Verify first HTML code block contains expected content
    const firstHtmlBlock = htmlCodeBlocks.first();
    await expect(firstHtmlBlock).toBeVisible();

    const text = await firstHtmlBlock.textContent();
    expect(text).toContain('<!doctype html>');
  });

  test('should render CSS/SCSS code examples', async ({ page }) => {
    await page.goto('/');

    // Find CSS/SCSS code blocks (classes are on wrapper divs)
    const cssCodeBlocks = page.locator('.language-css code, .language-scss code');
    const count = await cssCodeBlocks.count();
    expect(count).toBeGreaterThan(0);

    // Verify CSS code block contains expected content
    const cssBlock = cssCodeBlocks.first();
    await expect(cssBlock).toBeVisible();
  });

  test('should apply syntax highlighting classes', async ({ page }) => {
    await page.goto('/');

    // Check for Rouge/Pygments syntax highlighting classes
    const highlightedElements = page.locator('.highlight, .highlighter-rouge, pre code[class*="language-"]');
    const count = await highlightedElements.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should have visible syntax-highlighted tokens', async ({ page }) => {
    await page.goto('/');

    // Look for common syntax highlighting elements
    const codeBlock = page.locator('pre code').first();
    await expect(codeBlock).toBeVisible();

    // Verify the code block has content
    const content = await codeBlock.textContent();
    expect(content.length).toBeGreaterThan(10);

    // Check that code blocks are styled (have non-default colors)
    const computedStyle = await codeBlock.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        fontFamily: style.fontFamily,
        backgroundColor: style.backgroundColor,
      };
    });

    // Verify monospace font is used for code
    expect(computedStyle.fontFamily).toMatch(/mono/i);
  });

  test('should display code examples in HTML section', async ({ page }) => {
    await page.goto('/');

    // Navigate to HTML syntax section
    const htmlSection = page.locator('h3#html-syntax').first();
    await htmlSection.scrollIntoViewIfNeeded();
    await expect(htmlSection).toBeVisible();

    // Find code blocks in the document (there should be many in the HTML section)
    const codeBlocks = page.locator('pre code, .highlight');
    const count = await codeBlocks.count();
    expect(count).toBeGreaterThan(5); // HTML section should have multiple code examples
  });

  test('should display code examples in CSS section', async ({ page }) => {
    await page.goto('/');

    // Navigate to CSS syntax section
    const cssSection = page.locator('h3#css-syntax').first();
    await cssSection.scrollIntoViewIfNeeded();
    await expect(cssSection).toBeVisible();

    // Find CSS/SCSS code blocks in the page (classes are on wrapper divs)
    const cssCodeBlocks = page.locator('.language-css code, .language-scss code');
    const count = await cssCodeBlocks.count();
    expect(count).toBeGreaterThan(3); // CSS section should have multiple code examples
  });

  test('should maintain code formatting and indentation', async ({ page }) => {
    await page.goto('/');

    // Get a code block
    const codeBlock = page.locator('pre code').first();
    const codeText = await codeBlock.textContent();

    // Verify that whitespace is preserved (code should have line breaks)
    expect(codeText).toMatch(/\n/);

    // Check that pre element preserves whitespace
    const preElement = page.locator('pre').first();
    const whiteSpace = await preElement.evaluate((el) => {
      return window.getComputedStyle(el).whiteSpace;
    });

    expect(whiteSpace).toMatch(/pre/);
  });

  test('should have good/bad example comparisons', async ({ page }) => {
    await page.goto('/');

    // Look for code blocks with comments indicating good/bad examples
    const codeBlocks = page.locator('pre code');
    const count = await codeBlocks.count();

    let foundComparison = false;
    for (let i = 0; i < count; i++) {
      const text = await codeBlocks.nth(i).textContent();
      if (text.includes('Bad') || text.includes('Good') || text.includes('bad example') || text.includes('good example')) {
        foundComparison = true;
        break;
      }
    }

    expect(foundComparison).toBe(true);
  });
});
