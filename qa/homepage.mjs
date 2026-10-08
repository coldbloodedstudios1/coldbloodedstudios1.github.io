import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

// Start npm run preview first. Optional: CBS_PREVIEW_URL / CBS_BROWSER_PATH.
const browser = await chromium.launch({ headless: true, ...(process.env.CBS_BROWSER_PATH ? { executablePath: process.env.CBS_BROWSER_PATH } : {}) });
const url = process.env.CBS_PREVIEW_URL || 'http://127.0.0.1:4321';
await mkdir('qa/screenshots', { recursive: true });
const results = [];
try {
  for (const width of [320, 390, 768, 1440]) {
    const viewportContext = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    const page = await viewportContext.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    await page.goto(url);
    await page.evaluate(() => Promise.all(Array.from(document.images).map(image => image.decode())));
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('#games article').count(), 2);
    assert.equal(await page.locator('#games').getByText('TARKRAFT', { exact: true }).count(), 0);
    assert.equal(await page.locator('#experiments .badge').textContent(), 'Experimental fan project');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `Overflow at ${width}px`);
    for (const link of await page.locator('a[href^="#"]').evaluateAll(links => links.map(link => link.getAttribute('href')))) {
      if (link !== '#') assert.ok(await page.locator(link).count(), `Missing anchor ${link}`);
    }
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.activeElement?.textContent), 'Skip to content');
    const summary = page.locator('#gilt-and-guilt summary');
    await summary.focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('#gilt-and-guilt details').getAttribute('open'), '');
    await page.keyboard.press('Enter');
    const accessibility = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    assert.deepEqual(accessibility.violations.map(issue => ({ id: issue.id, impact: issue.impact, nodes: issue.nodes.map(node => node.target) })), [], `Accessibility issues at ${width}px`);
    await page.locator('body').click({ position: { x: 1, y: 1 } });
    await page.screenshot({ path: `qa/screenshots/home-${width}.png`, fullPage: true });
    assert.deepEqual(errors, []);
    results.push({ width, overflow: false, accessibilityViolations: 0, keyboardDisclosure: 'pass', screenshot: `home-${width}.png` });
    await viewportContext.close();
  }
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(url);
  await page.locator('#gilt-and-guilt summary').click();
  assert.equal(await page.locator('#gilt-and-guilt details').getAttribute('open'), '');
  assert.equal(await page.locator('nav a').count(), 4);
  await context.close();
  const report = { results, noJavaScript: 'navigation and disclosures pass', caveat: 'Automated checks are not a full manual screen-reader or WCAG conformance audit.' };
  await writeFile('qa/results.json', JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));
} finally { await browser.close(); }
