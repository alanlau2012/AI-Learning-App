/**
 * Round 2: GitHub issues from UI interaction, content guides, scenarios, lessons audits
 */
import { execFileSync } from 'node:child_process';
import { writeFileSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const footer = `
---
来源: reports/issue-tickets-*-20260628.md（第二轮审计）| 审计: 2026-06-28
`;

function createIssue(title, body, labels = ['bug']) {
  const tmp = join(tmpdir(), `gh-issue-${Date.now()}-${Math.random().toString(36).slice(2)}.md`);
  writeFileSync(tmp, body + footer, 'utf8');
  const args = ['issue', 'create', '--title', title, '--body-file', tmp, ...labels.flatMap((l) => ['--label', l])];
  const out = execFileSync('gh', args, { encoding: 'utf8' }).trim();
  unlinkSync(tmp);
  return out;
}

const issues = [
  // --- UI Interaction ---
  {
    title: '[P0][UX] MO-01: BottomNav 与 main 横排争宽，移动端布局缺陷',
    body: `报告: reports/issue-tickets-uiux-interaction-20260628.md\n位置: AppShell.tsx, AppShell.module.css, BottomNav.module.css\n现象: shell flex-row 下 BottomNav 非全宽底栏，窄屏主内容被压缩\n修复: BottomNav 移入 main 列底部或 position:fixed width:100% bottom:0，content padding-bottom >= 56px`,
  },
  {
    title: '[P1][UX] ES-01: ScenariosPage 筛选零结果无空态',
    body: `报告: issue-tickets-uiux-interaction-20260628.md\n位置: ScenariosPage.tsx:78-108\n修复: 增加「无匹配场景」提示 + 清除筛选按钮（参照 ModulePage/SearchPage）`,
  },
  {
    title: '[P1][UX] A11Y-01: 全站缺少统一 :focus-visible 样式',
    body: `报告: issue-tickets-uiux-interaction-20260628.md\n位置: global.css（除 SearchBox 外几乎无焦点环）\n修复: global.css 或共享 mixin 增加 :focus-visible 统一焦点环`,
  },
  {
    title: '[P1][UX] A11Y-02: 诊断题 ExplanationPanel 无 aria-live',
    body: `报告: issue-tickets-uiux-interaction-20260628.md\n位置: ExplanationPanel.tsx:9-21\n修复: 增加 role="status" aria-live="polite" 播报对错结果`,
  },
  {
    title: '[P2][UX] IF-03: Search Esc 行为未对齐 product-spec',
    body: `SearchPage.tsx:76-86 仅清空 query，应 navigate(-1) 或回首页关闭搜索`,
  },
  {
    title: '[P2][UX] A11Y-05: ScenariosPage 筛选按钮缺 aria-pressed',
    body: `ScenariosPage.tsx:59-75，对齐 SearchBox 的 aria-pressed 模式`,
  },
  {
    title: '[P2][UX] A11Y-06: ScenarioPage 策略选项缺 aria-pressed',
    body: `ScenarioPage.tsx:229-237 策略按钮仅样式区分选中态`,
  },
  {
    title: '[P2][UX] IF-06: ScenarioPage 恢复基线无确认',
    body: `ScenarioPage.tsx:248-249 半破坏性操作应加 confirm`,
  },
  {
    title: '[P2][UX] MO-02: 主内容区未为 BottomNav 预留底部空间',
    body: `AppShell.module.css padding-bottom 24px < BottomNav 56px`,
  },
  {
    title: '[P3][UX] UI 交互 polish 批次（IF-04/07/08, ES-03, MO-03/04, A11Y-08/09, SC-04/05/06）',
    labels: ['enhancement'],
    body: `见 reports/issue-tickets-uiux-interaction-20260628.md §3 P3 与剩余 P2：copy live 播报、Profile 复盘移除确认、progressStats nowrap 等`,
  },
  // --- Content Guides ---
  {
    title: '[P1][Content] GUIDE-P1-01: multi-agent 决策手册混入仓库协作用语',
    body: `报告: issue-tickets-content-guides-20260628.md\nguideId: multi-agent\n现象: git status/reviewed/src/data 等 Cursor 流水线用语渗入\n修复: 整段替换为企业 orchestrator/worker、trace、冲突仲裁语境`,
  },
  {
    title: '[P1][Content] GUIDE-P1-02: agent-loop 执行摘要循环顺序错误',
    body: `decisionGuides.ts executiveExplanation.summary 写「计划-执行-观察-修正」，应与正文 Observe→Plan→Act→Check 一致`,
  },
  {
    title: '[P2][Content] GUIDE-P2: 决策手册 polish（context-window/kv-cache/capability-routing/eval）',
    body: `见 issue-tickets-content-guides-20260628.md §3 P2：Attention 分析证据来源、30% KV 阈值、未知任务默认策略、eval tradeoff 维度`,
  },
  // --- Content Scenarios ---
  {
    title: '[P1][Content] SCEN-P1-01: rag-answer-quality 叙事与 baseline 指标不一致',
    body: `报告: issue-tickets-content-scenarios-20260628.md\n现象: background/facts 写 11%/74%，baseline 写 9.5%/78%\n修复: 统一为同一故障态快照或补时间线说明`,
  },
  {
    title: '[P1][Content] SCEN-P1-02: token-cost-spike prefix 与权限边界混写',
    body: `关联 GitHub #20 CONTENT-P1-06\nretry-cache-storm nextStepRecommendations 权限不应作为 prefix 组成部分`,
  },
  {
    title: '[P2][Content] SCEN-P2: 场景+角色路径 polish 批次',
    body: `model-router 删除 DEV-06/07/08 内部引用；platformEngineer 补 cost-routing/trace；applicationArchitect 补 permission-governance/trace；22讲路径覆盖缺口；agent-tool-failure 失败样本占比`,
  },
  {
    title: '[P3][Content] SCEN-P3: 场景与能力域低优先级项',
    labels: ['enhancement'],
    body: `token-roi 能力域 primary 归属可商榷；路径 UI 避免暗示路径=全部应学内容`,
  },
  // --- Content Lessons ---
  {
    title: '[P1][Content] LESSON-P1-01: agents-md 定义被 fitDefinition 截断',
    body: `报告: issue-tickets-content-lessons-20260628.md\n定义以「…在业务 Agent 平台中也。」残句结尾\n修复: 豁免 fitDefinition 或重写定义`,
  },
  {
    title: '[P1][Content] LESSON-P1-02: positional-encoding pitfalls 第4条重复',
    body: `ensureFour 填充导致第3/4条实质相同，第4条带「（续）」`,
  },
  {
    title: '[P1][Content] LESSON-P1-03: Glossary 三条术语无同名讲（IA不对齐）',
    body: `embedding/rag/model-routing 无同名 KnowledgePoint.id\n建议: 标注术语索引项或别名映射 semantic-space/prompt-context/multi-model-routing`,
  },
  {
    title: '[P2][Content] LESSON-P2: 56讲正文 v2 流水线 polish 批次',
    body: `8讲模板定义尾句；Glossary 15条与正文漂移；speculative-decoding/cache-system pitfalls 丢失或混写`,
  },
  {
    title: '[P3][Content] LESSON-P3: 56讲正文低优先级 polish',
    labels: ['enhancement'],
    body: `Token 大小写统一；Glossary 自引用清理；prefix-cache 搜索别名`,
  },
  {
    title: '[Audit 20260628] 七角度审计完成跟踪（更新）',
    labels: ['documentation'],
    body: `全部 7 份子报告已完成:\n- architecture, uiux-visual, uiux-interaction\n- content-diag, content-guides, content-scenarios, content-lessons\n聚合: reports/issue-tickets-20260628.md`,
  },
];

const created = [];
for (const issue of issues) {
  console.log('Creating:', issue.title);
  created.push(createIssue(issue.title, issue.body, issue.labels ?? ['bug']));
}
console.log(`\nCreated ${created.length} issues:`);
created.forEach((u) => console.log(u));
