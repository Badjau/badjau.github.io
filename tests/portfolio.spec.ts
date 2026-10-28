import { expect, test } from '@playwright/test';

test('library shows projects in order and filters by category', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.project-card h3')).toHaveText(['Attendance & HR Core', 'TBK-Micro Mk1', 'Raven', 'Document Parsing Automation', 'Inventory Tracking System']);
  await page.getByRole('button', { name: 'Software', exact: true }).click();
  await expect(page.locator('.project-card:visible h3')).toHaveText(['Attendance & HR Core', 'Document Parsing Automation', 'Inventory Tracking System']);
  await expect(page.getByRole('status')).toHaveText('3 projects');
  await page.getByRole('button', { name: 'Hardware', exact: true }).click();
  await expect(page.locator('.project-card:visible')).toHaveCount(2);
  await page.getByRole('button', { name: 'All projects', exact: true }).click();
  await expect(page.locator('.project-card:visible')).toHaveCount(5);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  for (const img of await page.locator('.card-image img').all()) {
    await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
  }
});

test('project routes support browsing, reload, and browser back', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'View TBK-Micro Mk1', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('TBK-Micro Mk1');
  await expect(page.getByRole('link', { name: 'View repository' })).toHaveAttribute('href', 'https://github.com/Badjau/zmk-config-mk1');
  await page.getByRole('link', { name: /Next project Raven/ }).click();
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Raven');
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('TBK-Micro Mk1');
  await page.getByRole('link', { name: 'All projects', exact: false }).first().click();
  await expect(page.locator('.project-grid')).toBeVisible();
  await page.mouse.wheel(0, 500);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0);
});

test('private project shares only approved overview and scale', async ({ page }) => {
  await page.goto('/#/projects/document-parsing');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Document Parsing Automation');
  await expect(page.locator('.metrics strong')).toHaveText(['~10s', '500', '~100']);
  await expect(page.getByRole('table', { name: 'Focused extraction benchmark' })).toContainText('8.41 seconds');
  await expect(page.getByRole('table')).toContainText('106 / 108 (98.1%)');
  await expect(page.locator('.benchmark-note')).toContainText('same verified 36-row image');
  await expect(page.getByRole('link', { name: 'View repository' })).toHaveCount(0);
  await expect(page.locator('main')).not.toContainText(/betHubsys|totalBets|Telegram|Cloudflare|wrangler|game time/i);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
});

test('keyboard access and reduced motion remain usable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  await page.goto('/#/projects/missing');
  await expect(page.getByRole('heading', { name: 'Project not found.' })).toBeVisible();
  await page.getByRole('link', { name: 'Browse all projects' }).click();
  await expect(page.locator('.project-card')).toHaveCount(5);
});

test('Mk1 loads 3D only on request and supports rotation, reset, and reopening', async ({ page }) => {
  const modelRequests: string[] = [];
  page.on('request', request => { if (/three-scene|\.drc(?:$|\?)/.test(request.url())) modelRequests.push(request.url()); });
  await page.goto('/#/projects/mk1');
  expect(modelRequests).toHaveLength(0);
  await expect(page.getByRole('heading', { name: 'The curves have a job to do.' })).toBeVisible();
  await page.getByRole('button', { name: 'Explore in 3D' }).click();
  await expect(page.getByRole('button', { name: 'Reset view' })).toBeVisible({ timeout: 30000 });
  expect(modelRequests.some(url => url.includes('.drc'))).toBe(true);
  await expect(page.locator('.model-canvas')).toBeVisible();
  await page.getByRole('button', { name: 'Rotate model left' }).click();
  await page.locator('.model-canvas').focus();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Home');
  await page.getByRole('button', { name: 'Close viewer' }).click();
  await expect(page.locator('.model-canvas')).toBeHidden();
  await page.getByRole('button', { name: 'Explore in 3D' }).click();
  await expect(page.getByRole('button', { name: 'Reset view' })).toBeVisible({ timeout: 30000 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  await page.getByRole('link', { name: 'All projects', exact: false }).first().click();
  await expect(page.locator('.model-canvas')).toHaveCount(0);
});

test('Raven OLED animation loads on play and can be stopped', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  let gifRequests = 0;
  page.on('request', request => { if (request.url().includes('raven-oled.gif')) gifRequests++; });
  await page.goto('/#/projects/raven');
  expect(gifRequests).toBe(0);
  await expect(page.locator('.oled-animation')).not.toHaveAttribute('src');
  await page.getByRole('button', { name: 'Play OLED animation' }).click();
  await expect.poll(() => page.locator('.oled-animation').evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
  await expect(page.locator('.oled-animation')).toBeVisible();
  expect(gifRequests).toBeGreaterThan(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  await page.getByRole('button', { name: 'Stop OLED animation' }).click();
  await expect(page.locator('.oled-animation')).toBeHidden();
  await expect(page.locator('.oled-animation')).not.toHaveAttribute('src');
});

test('failed model loading keeps the project accessible and offers a retry', async ({ page }) => {
  await page.route('**/models/*.drc', route => route.abort());
  await page.goto('/#/projects/mk1');
  await page.getByRole('button', { name: 'Explore in 3D' }).click();
  await expect(page.locator('.project-media .media-status')).toContainText('could not load', { timeout: 30000 });
  await expect(page.getByRole('button', { name: 'Explore in 3D' })).toBeEnabled();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('TBK-Micro Mk1');
});

test('Mk1 cutaway explains assembly and labels future improvements', async ({ page }) => {
  await page.goto('/#/projects/mk1');
  await expect(page.getByRole('img', { name: /Conceptual side section/ })).toBeVisible();
  await page.getByRole('button', { name: 'Look inside', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Look inside', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.visual-explanation')).toContainText('separate layers');
  await page.getByRole('button', { name: 'Together', exact: true }).click();
  await expect(page.locator('.visual-explanation')).toContainText('continuous outer shell');
  await expect(page.getByRole('heading', { name: 'Where this could go next.' })).toBeVisible();
  await expect(page.locator('.improvement-list li')).toHaveCount(3);
  await expect(page.locator('.improvement-section')).toContainText('directions for future work');
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
});

test('Raven diagram changes key assignments and spacing using the keyboard', async ({ page }) => {
  await page.goto('/#/projects/raven');
  await page.getByRole('button', { name: 'Numbers', exact: true }).click();
  await expect(page.locator('[data-key="left-0"]')).toHaveText('1');
  await page.getByRole('button', { name: 'Navigation', exact: true }).click();
  await expect(page.locator('.visual-explanation')).toContainText('movement controls');
  const slider = page.getByRole('slider', { name: 'Space between the halves' });
  await slider.focus();
  await page.keyboard.press('End');
  await expect(slider).toHaveValue('100');
  await expect(page.locator('.keyboard-half--left')).toHaveAttribute('transform', 'translate(-48 0)');
  await page.keyboard.press('Home');
  await expect(slider).toHaveValue('0');
  await expect(page.locator('.visual-caption').first()).toContainText('illustrative');
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
});

test('parsing charts use matched benchmark values and keep sample limits visible', async ({ page }) => {
  await page.goto('/#/projects/document-parsing');
  const chart = page.locator('.benchmark-chart svg');
  await expect(chart).toHaveAttribute('aria-label', /33.84 s.*15.73 s/);
  await expect(page.locator('.chart-reduction')).toHaveText('53.5% faster');
  await page.getByRole('button', { name: 'Token usage', exact: true }).click();
  await expect(chart).toHaveAttribute('aria-label', /6,515 tokens.*2,536 tokens/);
  await expect(page.locator('.chart-reduction')).toHaveText('61.1% fewer tokens');
  await expect(page.locator('.chart-context')).toContainText('not a measured billing saving');
  await page.getByRole('button', { name: 'Extraction time', exact: true }).click();
  await expect(chart).toHaveAttribute('aria-label', /33.84 s/);
  await expect(page.locator('.workflow li')).toHaveCount(4);
  await expect(page.locator('.improvement-list li')).toHaveCount(3);
  await expect(page.locator('main')).not.toContainText(/betHubsys|totalBets|Telegram|Cloudflare|wrangler|game time/i);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
});

test('manual comparison reports both winners, the tie, and invalid input fairly', async ({ page }) => {
  await page.goto('/#/projects/document-parsing');
  const lines = page.getByRole('spinbutton', { name: 'Lines in the document' });
  const seconds = page.getByRole('spinbutton', { name: 'Manual seconds per line' });
  const result = page.locator('.calculator-result');
  const chart = page.locator('.manual-comparison-chart svg');
  await expect(lines).toHaveValue('10');
  await expect(seconds).toHaveValue('5');
  await expect(chart).toHaveAttribute('aria-label', /manual entry 50 seconds, automated parsing 15 seconds/);
  await expect(result).toHaveText('Automated parsing is 3.33× faster in this scenario.');
  await expect(page.locator('.calculator-difference')).toContainText('35 seconds saved · 70% less time');
  await lines.fill('1');
  await expect(chart).toHaveAttribute('aria-label', /manual entry 5 seconds, automated parsing 15 seconds/);
  await expect(result).toHaveText('Manual entry is 3× faster in this scenario.');
  await expect(page.locator('.calculator-difference')).toContainText('10 seconds saved · 66.67% less time');
  await lines.fill('3');
  await expect(result).toHaveText('Both take 15 seconds. Neither has a time advantage.');
  await seconds.fill('1');
  await expect(result).toHaveText('Manual entry is 5× faster in this scenario.');
  await lines.fill('0');
  await expect(page.locator('#calculator-error')).toContainText('whole number of lines');
  await expect(page.locator('.manual-comparison-chart')).toBeHidden();
  await lines.fill('1.5');
  await expect(page.locator('#calculator-error')).toBeVisible();
  await lines.fill('10');
  await seconds.fill('0');
  await expect(page.locator('#calculator-error')).toContainText('seconds per line');
  await seconds.fill('5');
  await expect(result).toContainText('Automated parsing is 3.33× faster');
  await expect(page.locator('#calculator-error')).toBeHidden();
  await expect(page.locator('#calculator-assumptions')).toContainText('not a measured result for every document size');
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
});

test('project context stays in a compact summary across every project', async ({ page }) => {
  for (const id of ['attendance-hr-core', 'mk1', 'raven', 'document-parsing', 'inventory-system']) {
    await page.goto(`/#/projects/${id}`);
    await expect(page.locator('.project-summary')).toContainText('Focus');
    await expect(page.getByRole('heading', { name: 'At a glance' })).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  }
});
