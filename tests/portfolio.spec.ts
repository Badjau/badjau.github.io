import { expect, test } from '@playwright/test';

test('renders the complete keyboard story without horizontal overflow', async ({ page }, testInfo) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1, name: 'Badjau' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'TBK—“Micro” Mk1' })).toBeVisible();
  await expect(page.locator('.chapter')).toHaveCount(4);

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);

  if (testInfo.project.name === 'desktop') {
    await expect(page.locator('.model-stage')).toHaveClass(/is-ready/);
    const stageBox = await page.locator('.model-stage').boundingBox();
    const chapterBox = await page.locator('.chapter').first().boundingBox();
    expect(stageBox).not.toBeNull();
    expect(chapterBox).not.toBeNull();
    expect(stageBox!.x + stageBox!.width).toBeLessThan(chapterBox!.x);
  }

  await page.locator('#firmware-personality h3').scrollIntoViewIfNeeded();
  await expect(page.locator('#firmware-personality')).toHaveClass(/is-active/);
  await expect(page.locator('.model-index span')).toHaveText('04');

  const projectLink = page.getByRole('link', { name: /View project on GitHub/i });
  await expect(projectLink).toHaveAttribute('href', 'https://github.com/Badjau/zmk-config-mk1');
});

test('keeps the model above the chapter copy on narrow screens', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile');
  await page.goto('/');

  const stage = page.locator('.model-stage');
  const chapter = page.locator('.chapter').first();
  const stageBox = await stage.boundingBox();
  const chapterBox = await chapter.boundingBox();

  expect(stageBox).not.toBeNull();
  expect(chapterBox).not.toBeNull();
  expect(stageBox!.width).toBeGreaterThanOrEqual(389);
  expect(chapterBox!.y).toBeGreaterThanOrEqual(stageBox!.y + stageBox!.height - 1);
});

test('provides a still experience when reduced motion is requested', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.chapter').first()).toBeVisible();
  const animationDuration = await page.locator('.scroll-cue__line').evaluate((element) => getComputedStyle(element, '::after').animationDuration);
  const durationInSeconds = animationDuration.endsWith('ms')
    ? Number.parseFloat(animationDuration) / 1000
    : Number.parseFloat(animationDuration);
  expect(durationInSeconds).toBeLessThanOrEqual(0.00001);
  const scrollBehavior = await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior);
  expect(scrollBehavior).toBe('auto');
});
