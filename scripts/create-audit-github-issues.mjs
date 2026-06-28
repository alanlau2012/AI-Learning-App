/**
 * Batch create GitHub issues from reports/issue-tickets-20260628.md
 * Usage: node scripts/create-audit-github-issues.mjs
 */
import { execFileSync } from 'node:child_process';
import { writeFileSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const footer = `
---
来源: reports/issue-tickets-20260628.md | 审计: 2026-06-28 | commit: 9a11d694
`;

/** @type {{ title: string; body: string; labels?: string[] }[]} */
const issues = [
  {
    title: '[Audit 20260628] 问题单聚合跟踪（架构/UI/内容诊断题）',
    labels: ['documentation'],
    body: `## 结论
有条件通过 | P0=0 P1=23 P2=13 P3=7

## 子报告
- reports/issue-tickets-architecture-20260628.md
- reports/issue-tickets-uiux-visual-20260628.md
- reports/issue-tickets-content-diag-20260628.md

## Top 3
1. 诊断题结构泄漏
2. tokens.css 缺 warning-soft / 动画 token
3. Header 面包屑未覆盖 /scenarios`,
  },
  {
    title: '[P1][Architecture] ARCH-P1-01: Header 面包屑未覆盖 /scenarios',
    body: `## 位置
src/components/layout/Header.tsx:16-33

## 现象
buildBreadcrumb 未识别 /scenarios 与 /scenarios/:scenarioId

## 修复
补两个分支，用 scenarioExerciseById 查标题`,
  },
  {
    title: '[P1][UI] UI-P1-01: 缺 --color-warning-soft，告警软背景硬编码',
    body: `## 位置
tokens.css + OptionCard/ExplanationPanel/ProfilePage/ScenarioPage 共 4+ 处

## 修复
tokens.css 加 --color-warning-soft / --color-warning-border`,
  },
  {
    title: '[P1][UI] UI-P1-02: 动画画布配色约230处硬编码',
    body: `## 位置
src/components/animation/*.module.css

## 修复
tokens.css 加 --anim-canvas-* 系列 token`,
  },
  {
    title: '[P1][UI] UI-P1-03: ProfilePage danger 棕色文本 #9a520f',
    body: `## 位置
ProfilePage.module.css:368

## 修复
改用 var(--color-warning) 或 --color-warning-text`,
  },
  {
    title: '[P1][UI] UI-P1-04: ScenarioPage metricCard 状态色硬编码',
    body: `## 位置
ScenarioPage.module.css:133,138,139

## 修复
并入 UI-P1-01 warning/progress token 体系`,
  },
  {
    title: '[P1][Content] CONTENT-P1-SYS: 12道诊断题最长选项即正确答案',
    body: `## 现象
约22%单选题正确答案明显最长

## 涉及讲
value-review-agent, permission-governance, ops-diagnosis-agent, eval, test-generation-agent, requirement-decomposition-agent, reasoning-limit, ai-native-org, code-review-agent, multi-agent, context-window, repo-context

## 修复
4选项字数差<=4字；缩短正确答案或升级干扰项`,
  },
  {
    title: '[P1][Content] CONTENT-P1-01: cost-routing 干扰项荒谬',
    body: 'conceptId: cost-routing。将1个干扰项改为可信工程动作。',
  },
  {
    title: '[P1][Content] CONTENT-P1-02: maas 干扰项荒谬',
    body: 'conceptId: maas。将C改为SDK统一埋点类强干扰项。',
  },
  {
    title: '[P1][Content] CONTENT-P1-03: sla 双重结构泄漏',
    body: 'conceptId: sla。拆C或加长干扰项。',
  },
  {
    title: '[P1][Content] CONTENT-P1-04: permission-governance 双重泄漏',
    body: 'conceptId: permission-governance。B改为防注入规则等可信过渡措施。',
  },
  {
    title: '[P1][Content] CONTENT-P1-05: ttft 多选题干直接映射答案',
    body: 'conceptId: ttft。加入1个看似对应但应排除的迷惑项。',
  },
  {
    title: '[P1][Content] CONTENT-P1-06: token-cost-spike prefix 口径不严谨',
    body: 'retry-cache-storm nextStepRecommendations。权限作cache key命名空间，prefix只承载稳定提示。',
  },
  {
    title: '[P2][Architecture] ARCH-P2-01: ScenarioPage 状态色硬编码',
    body: '关联 UI-P1-04。抽到 tokens.css。',
  },
  {
    title: '[P2][Architecture] ARCH-P2-02: ProfilePage 告警色硬编码',
    body: '关联 UI-P1-03。抽到 tokens.css。',
  },
  {
    title: '[P2][Architecture] ARCH-P2-03: 导航 label 与顺序不一致',
    body: 'BottomNav vs Sidebar：场景演练 vs 场景。抽出统一 nav 常量。',
  },
  {
    title: '[P2][Architecture] ARCH-P2-04: conceptById/scenarioById 重复构造',
    body: '4处重复Map。data层暴露唯一byId映射。',
  },
  {
    title: '[P2][UI] UI-P2-01: HomePage primaryBtn hover #1838b8',
    body: 'tokens.css 加 --color-primary-hover。',
  },
  {
    title: '[P2][UI] UI-P2-02: 统计大数字应改 mono 非 serif',
    body: 'ScenariosPage/ScenarioPage stats strong 改 var(--font-mono)。',
  },
  {
    title: '[P2][UI] UI-P2-03: tokens.css 缺 spacing scale',
    body: '增补 --space-* token。',
  },
  {
    title: '[P2][UI] UI-P2-04: 诊断题边框 rgba 硬编码',
    body: 'OptionCard/ExplanationPanel/DecisionGuideSection 随 border token 收口。',
  },
  {
    title: '[P2][UI] UI-P2-05: ScenarioPage optionActive box-shadow',
    body: '可改 border 优先（可选）。',
  },
  {
    title: '[P2][Content] CONTENT-P2-01: token-roi 选项偏口号',
    body: '补具体可执行动作。',
  },
  {
    title: '[P2][Content] CONTENT-P2-02: ai-native-org 选项偏理念',
    body: 'troubleshootingPath 补 RACI/Agent操作手册。',
  },
  {
    title: '[P2][Content] CONTENT-P2-03: ttft 多选需UI标注',
    body: '题干或UI显式标注多选。',
  },
  {
    title: '[P2][Content] CONTENT-P2-04: trace-not-diagnostic hash反查',
    body: 'hash应使用带盐或不可逆指纹。',
  },
  {
    title: '[P3][Architecture] ARCH-P3-01: progress.ts/progressCore 分工不清',
    labels: ['enhancement'],
    body: '文件头注释写清职责。',
  },
  {
    title: '[P3][Architecture] ARCH-P3-02: completeScenario 完成即入复盘',
    labels: ['enhancement'],
    body: '注释写清或拆开。',
  },
  {
    title: '[P3][Architecture] ARCH-P3-03: HomePage 手工拼 progress',
    labels: ['enhancement'],
    body: '直接传 store 完整状态。',
  },
  {
    title: '[P3][Architecture] ARCH-P3-04: import 带 .ts 扩展名',
    labels: ['enhancement'],
    body: '去掉扩展名（历史问题）。',
  },
  {
    title: '[P3][Architecture] ARCH-P3-05: scenarioSimulation.ts 883行',
    labels: ['enhancement'],
    body: '按职责拆分子模块（历史问题）。',
  },
  {
    title: '[P3][UI] UI-P3-01: ScenariosPage filters !important',
    labels: ['enhancement'],
    body: '提高 selector 特异性。',
  },
  {
    title: '[P3][UI] UI-P3-02: selection 背景硬编码',
    labels: ['enhancement'],
    body: '加 --color-selection token。',
  },
  {
    title: '[P3][Content] CONTENT-P3-01: sampling 术语',
    labels: ['enhancement'],
    body: '低随机采样改为低 temperature/top-p 采样。',
  },
  {
    title: '[P3][Content] CONTENT-P3-02: concept JSON 缩进不统一',
    labels: ['enhancement'],
    body: '主开发合入时统一。',
  },
  {
    title: '[Audit 20260628] 补审跟踪：未覆盖角度',
    labels: ['documentation'],
    body: `未审: UI交互/无障碍, 决策手册17条, 场景+能力域+rolePaths, 56讲正文+glossary
建议: composer-2.5-fast 拆小任务重跑`,
  },
];

const created = [];

for (const issue of issues) {
  const tmp = join(tmpdir(), `gh-issue-${Date.now()}-${Math.random().toString(36).slice(2)}.md`);
  writeFileSync(tmp, issue.body + footer, 'utf8');
  const args = [
    'issue',
    'create',
    '--title',
    issue.title,
    '--body-file',
    tmp,
    ...(issue.labels ?? ['bug']).flatMap((l) => ['--label', l]),
  ];
  try {
    const out = execFileSync('gh', args, { encoding: 'utf8' });
    created.push(out.trim());
    console.log(out.trim());
  } finally {
    unlinkSync(tmp);
  }
}

console.log(`\nCreated ${created.length} issues.`);
