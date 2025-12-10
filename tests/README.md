# Code Guide - Playwright Test Suite

Comprehensive end-to-end test suite for the Code Guide Jekyll site using Playwright.

## Overview

This test suite provides comprehensive coverage of the Code Guide static site, including:

1. **Page Load and Content Tests** (`page-load.spec.js`)
   - Homepage loads correctly
   - Main header and logo display
   - Table of contents is present
   - HTML and CSS section content
   - Golden Rule section
   - Meta tags and CSS loading

2. **Syntax Highlighting Tests** (`syntax-highlighting.spec.js`)
   - Code blocks are present
   - HTML code examples render correctly
   - CSS/SCSS code examples render correctly
   - Syntax highlighting classes applied
   - Code formatting and indentation maintained
   - Good/bad example comparisons visible

3. **Responsive Design Tests** (`responsive-design.spec.js`)
   - Desktop viewport rendering (1920x1080)
   - Tablet viewport rendering (768x1024)
   - Mobile viewport rendering (375x667)
   - Responsive images
   - Code block mobile handling
   - Text readability on small screens
   - Layout adaptation across viewports
   - Touch-friendly navigation
   - No content overflow

4. **Link Integrity Tests** (`link-integrity.spec.js`)
   - Internal anchor links work
   - All internal link targets exist
   - Table of contents links function
   - External links have proper attributes
   - No broken internal links
   - Section headings have IDs
   - Navigation between sections works
   - Link functionality after scrolling
   - Proper link styling and hover states

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Jekyll installed and configured
- Ruby (v3.0 or higher)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Playwright browsers:
   ```bash
   npx playwright install chromium
   ```

3. Start the Jekyll server:
   ```bash
   # In the project root
   export PATH="/opt/homebrew/opt/ruby/bin:/opt/homebrew/lib/ruby/gems/3.4.0/bin:$PATH"
   jekyll serve --port 4000
   ```

## Running Tests

### Run all tests (headless mode):
```bash
npm test
```

### Run tests with browser visible:
```bash
npm run test:headed
```

### Run tests in UI mode (interactive):
```bash
npm run test:ui
```

### View test report:
```bash
npm run test:report
```

### Run specific test file:
```bash
npx playwright test tests/page-load.spec.js
```

### Run specific test:
```bash
npx playwright test -g "should load the homepage successfully"
```

## Test Configuration

The test configuration is in `playwright.config.js`:
- Base URL: `http://localhost:4000`
- Browser: Chromium
- Retries: 2 (in CI), 0 (local)
- Reporter: HTML report
- Screenshots: On failure only
- Traces: On first retry

## Test Results

All tests expect the Jekyll server to be running on `localhost:4000`. The test suite includes:
- 36 total tests
- 8 page load and content tests
- 8 syntax highlighting tests
- 9 responsive design tests
- 10 link integrity tests

## Troubleshooting

### Jekyll server not running
If you see connection errors, ensure Jekyll is running:
```bash
jekyll serve --port 4000
```

### Port already in use
If port 4000 is in use:
```bash
# Kill the process using port 4000
lsof -ti:4000 | xargs kill -9

# Then restart Jekyll
jekyll serve --port 4000
```

### Ruby version issues
If Jekyll fails to install, you may need to update Ruby:
```bash
brew install ruby
export PATH="/opt/homebrew/opt/ruby/bin:$PATH"
gem install jekyll bundler
```

## CI/CD Integration

To run tests in CI:
1. Install dependencies
2. Build the Jekyll site
3. Start Jekyll server in background
4. Run tests
5. Stop Jekyll server

Example GitHub Actions workflow:
```yaml
- name: Install Ruby and Jekyll
  run: |
    gem install jekyll bundler

- name: Build Jekyll site
  run: jekyll build

- name: Start Jekyll server
  run: jekyll serve --port 4000 &

- name: Run Playwright tests
  run: npm test
```

## Contributing

When adding new tests:
1. Follow existing test structure
2. Use descriptive test names
3. Add comments for complex assertions
4. Group related tests in describe blocks
5. Keep tests focused and atomic
6. Use appropriate waiting strategies (avoid arbitrary timeouts when possible)

## License

Same as the Code Guide project - MIT License
