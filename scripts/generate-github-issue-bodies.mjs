/**
 * Generate v2 GitHub issue body drafts to reports/github-issues/
 * Usage: node scripts/generate-github-issue-bodies.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  ALL_ISSUES,
  AUDIT_COMMIT,
  AUDIT_COMMIT_SHORT,
  SCREENSHOT_BASE,
} from './issue-handover-data.mjs';

const OUT_DIR = join(process.cwd(), 'reports', 'github-issues');

function renderScreenshot(screenshot) {
  if (!screenshot) {
    return '_本 issue 以代码/原文证据为主，无 UI 截图要求。_\n';
  }
  const url = `${SCREENSHOT_BASE}/${screenshot.slug}.png`;
  return `![${screenshot.alt}](${url})\n`;
}

function renderCodeEvidence(items) {
  return items
    .map((e) => {
      const parts = [];
      if (e.file) parts.push(`- \`${e.file}\``);
      if (e.grep) parts.push(`- Grep：${e.grep}`);
      if (e.quote) parts.push(`  > ${e.quote}`);
      return parts.join('\n');
    })
    .join('\n');
}

function renderCompare(rows) {
  const header = '| 维度 | 期望 | 实际（审计时） |\n|---|---|---|';
  const body = rows
    .map((r) => `| ${r.id}${r.text ? `（${r.text}）` : ''} | ${r.expected} | ${r.actual} |`)
    .join('\n');
  return `${header}\n${body}`;
}

function renderBatchItems(items) {
  if (!items?.length) return '';
  const lines = items.map(
    (b) =>
      `- [ ] **${b.id}**\n  - 复现：${b.repro}\n  - 证据：${b.evidence}\n  - 修复：${b.fix}`,
  );
  return `\n### 5.3 批次子项 checklist\n\n${lines.join('\n\n')}\n`;
}

function renderIssue(issue) {
  const related =
    issue.related?.length > 0
      ? issue.related.map((n) => `#${n}`).join('、')
      : '无';

  const repro = issue.reproSteps.map((s, i) => `${i + 1}. ${s}`).join('\n');
  const acceptance = issue.acceptance.map((a) => `- [ ] ${a}`).join('\n');

  return `## 元信息
- **本地 ID**：${issue.localId}
- **优先级**：${issue.priority}
- **角度**：${issue.angle}
- **来源报告**：${issue.sourceReport}
- **GitHub**：#${issue.number}
- **审计基线 commit**：${AUDIT_COMMIT_SHORT}（2026-06-28）
- **完整 commit**：\`${AUDIT_COMMIT}\`

## 1. 现象描述

${issue.phenomenon}

## 2. 影响与风险

${issue.impact}

## 3. 复现步骤

${repro}

## 4. 期望行为 vs 实际行为

${renderCompare(issue.compare)}

## 5. 证据

### 5.1 截图（UI/UX 类必填）

${renderScreenshot(issue.screenshot)}

### 5.2 代码 / 内容证据

${renderCodeEvidence(issue.codeEvidence)}
${renderBatchItems(issue.batchItems)}
## 6. 根因定位

${issue.rootCause}

## 7. 最小修复方向

${issue.fixDirection}

## 8. 验收标准

${acceptance}

## 9. 关联 issue

- 同源 / 相关：${related}

## 10. 当前代码复核（2026-06-28 执行时填写）

${issue.codeReview}

---
来源: v2 移交接手模板 | \`docs/issue-handover-template.md\` | 生成: \`scripts/generate-github-issue-bodies.mjs\`
`;
}

mkdirSync(OUT_DIR, { recursive: true });

let count = 0;
for (const issue of ALL_ISSUES) {
  const body = renderIssue(issue);
  const path = join(OUT_DIR, issue.filename);
  writeFileSync(path, body, 'utf8');
  count++;
  console.log(`Wrote ${issue.filename} (#${issue.number})`);
}

console.log(`\nGenerated ${count} issue bodies in ${OUT_DIR}`);
