/**
 * Capture QA screenshots for GitHub issue v2 bodies.
 * Usage: node scripts/capture-issue-screenshots.mjs
 */
import { chromium } from 'playwright';
import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const BASE = 'http://127.0.0.1:5173';
const OUT = join(process.cwd(), 'output', 'qa', 'issues-20260628');
mkdirSync(OUT, { recursive: true });

/** @type {{ name: string; path: string; viewport: { width: number; height: number }; setup?: (page: import('playwright').Page) => Promise<void> }[]} */
const SHOTS = [
  {
    name: 'issue-044-mobile-bottomnav-layout.png',
    path: '/',
    viewport: { width: 390, height: 844 },
  },
  {
    name: 'issue-009-scenarios-breadcrumb.png',
    path: '/scenarios',
    viewport: { width: 1440, height: 900 },
  },
  {
    name: 'issue-045-scenarios-filter-empty.png',
    path: '/scenarios',
    viewport: { width: 1440, height: 900 },
    setup: async (page) => {
      const chips = page.locator('button').filter({ hasText: /能力域|难度|全部/ });
      const count = await chips.count();
      for (let i = 0; i < count; i++) {
        const chip = chips.nth(i);
        const text = (await chip.textContent())?.trim() ?? '';
        if (text && !text.includes('全部')) {
          await chip.click();
          break;
        }
      }
    },
  },
  {
    name: 'issue-046-focus-visible-missing.png',
    path: '/',
    viewport: { width: 1440, height: 900 },
    setup: async (page) => {
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
    },
  },
  {
    name: 'issue-014-value-review-agent-options.png',
    path: '/concepts/value-review-agent',
    viewport: { width: 1440, height: 900 },
    setup: async (page) => {
      await page.locator('text=诊断题').first().scrollIntoViewIfNeeded();
    },
  },
  {
    name: 'issue-015-cost-routing-options.png',
    path: '/concepts/cost-routing',
    viewport: { width: 1440, height: 900 },
    setup: async (page) => {
      await page.locator('text=诊断题').first().scrollIntoViewIfNeeded();
    },
  },
  {
    name: 'issue-016-maas-options.png',
    path: '/concepts/maas',
    viewport: { width: 1440, height: 900 },
    setup: async (page) => {
      await page.locator('text=诊断题').first().scrollIntoViewIfNeeded();
    },
  },
  {
    name: 'issue-017-sla-options.png',
    path: '/concepts/sla',
    viewport: { width: 1440, height: 900 },
    setup: async (page) => {
      await page.locator('text=诊断题').first().scrollIntoViewIfNeeded();
    },
  },
  {
    name: 'issue-018-permission-governance-options.png',
    path: '/concepts/permission-governance',
    viewport: { width: 1440, height: 900 },
    setup: async (page) => {
      await page.locator('text=诊断题').first().scrollIntoViewIfNeeded();
    },
  },
  {
    name: 'issue-019-ttft-multiple.png',
    path: '/concepts/ttft',
    viewport: { width: 1440, height: 900 },
    setup: async (page) => {
      await page.locator('text=诊断题').first().scrollIntoViewIfNeeded();
    },
  },
  {
    name: 'issue-010-warning-soft-missing.png',
    path: '/concepts/value-review-agent',
    viewport: { width: 1440, height: 900 },
    setup: async (page) => {
      await page.locator('text=诊断题').first().scrollIntoViewIfNeeded();
      await page.locator('button[aria-pressed="false"]').first().click();
      await page.getByRole('button', { name: '提交判断' }).click();
    },
  },
  {
    name: 'issue-047-diagnostic-no-aria-live.png',
    path: '/concepts/value-review-agent',
    viewport: { width: 1440, height: 900 },
    setup: async (page) => {
      await page.locator('text=诊断题').first().scrollIntoViewIfNeeded();
      await page.locator('button[aria-pressed="false"]').first().click();
      await page.getByRole('button', { name: '提交判断' }).click();
    },
  },
  {
    name: 'issue-012-profile-danger-color.png',
    path: '/profile',
    viewport: { width: 1440, height: 900 },
  },
  {
    name: 'issue-013-scenario-metrical-hardcode.png',
    path: '/scenarios/rag-answer-quality',
    viewport: { width: 1440, height: 900 },
  },
  {
    name: 'issue-057-rag-metrics-mismatch.png',
    path: '/scenarios/rag-answer-quality',
    viewport: { width: 1440, height: 900 },
  },
  {
    name: 'issue-054-multi-agent-guide-repo-terms.png',
    path: '/concepts/multi-agent',
    viewport: { width: 1440, height: 900 },
    setup: async (page) => {
      await page.locator('text=工程决策').first().scrollIntoViewIfNeeded();
    },
  },
  {
    name: 'issue-061-agents-md-definition-truncated.png',
    path: '/concepts/agents-md',
    viewport: { width: 1440, height: 900 },
  },
  {
    name: 'issue-062-positional-encoding-pitfalls.png',
    path: '/concepts/positional-encoding',
    viewport: { width: 1440, height: 900 },
    setup: async (page) => {
      await page.locator('text=常见误区').first().scrollIntoViewIfNeeded();
    },
  },
  {
    name: 'issue-063-glossary-ia-mismatch.png',
    path: '/glossary',
    viewport: { width: 1440, height: 900 },
  },
  {
    name: 'issue-025-home-primary-hover.png',
    path: '/',
    viewport: { width: 1440, height: 900 },
  },
  {
    name: 'issue-026-scenarios-stats-font.png',
    path: '/scenarios',
    viewport: { width: 1440, height: 900 },
  },
  {
    name: 'issue-052-content-padding-bottom.png',
    path: '/scenarios',
    viewport: { width: 390, height: 844 },
    setup: async (page) => {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    },
  },
  {
    name: 'issue-029-scenario-option-active.png',
    path: '/scenarios/rag-answer-quality',
    viewport: { width: 1440, height: 900 },
    setup: async (page) => {
      const strategyBtn = page.locator('button[aria-pressed="false"]').first();
      if (await strategyBtn.count()) await strategyBtn.click();
    },
  },
  {
    name: 'issue-030-token-roi-options.png',
    path: '/concepts/token-roi',
    viewport: { width: 1440, height: 900 },
    setup: async (page) => {
      await page.locator('text=诊断题').first().scrollIntoViewIfNeeded();
    },
  },
  {
    name: 'issue-031-ai-native-org-options.png',
    path: '/concepts/ai-native-org',
    viewport: { width: 1440, height: 900 },
    setup: async (page) => {
      await page.locator('text=诊断题').first().scrollIntoViewIfNeeded();
    },
  },
  {
    name: 'issue-032-ttft-multiselect-label.png',
    path: '/concepts/ttft',
    viewport: { width: 1440, height: 900 },
    setup: async (page) => {
      await page.locator('text=诊断题').first().scrollIntoViewIfNeeded();
    },
  },
  {
    name: 'issue-041-sampling-terminology.png',
    path: '/concepts/sampling',
    viewport: { width: 1440, height: 900 },
    setup: async (page) => {
      await page.locator('text=诊断题').first().scrollIntoViewIfNeeded();
    },
  },
];

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();

for (const shot of SHOTS) {
  const outPath = join(OUT, shot.name);
  if (existsSync(outPath)) {
    console.log(`Skip ${shot.name} (exists)`);
    continue;
  }
  await page.setViewportSize(shot.viewport);
  await page.goto(`${BASE}${shot.path}`, { waitUntil: 'networkidle' });
  if (shot.setup) await shot.setup(page);
  await page.waitForTimeout(400);
  await page.screenshot({ path: outPath, fullPage: false });
  console.log(`Saved ${shot.name}`);
}

await browser.close();
console.log(`\nCaptured ${SHOTS.length} screenshots → ${OUT}`);
