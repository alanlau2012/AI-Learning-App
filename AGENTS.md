# AGENTS.md — AI 应用工程学习 APP

这是写给后续开发 Agent / 工程师的仓库说明书。开工前先读本文件，再读 `docs/` 下的规格文档。

## 0. 当前状态快照（交接必读）

截至 **2026-06-28**：

- 当前代码基线：正文改版 v2 之上完成 **Final Wave 全量上线 + backlog polish + Electron 桌面版 MVP + GitHub P1 内容修复回合 + AI 工程负责人增强 Phase 1/1B/2/3 + 场景演练库 R0+R1+R2 + 2026-06-28 内容 P1 修复 + 生产化发布收口 + GitHub issue Stabilization R0/R1/R2 修复**；当前提交前基线以 `git log -1` / 后续提交为准。
- 已封板范围：**AI 工程负责人增强 Phase 1/1B/2/3 + 场景演练库 R2** 已完成：17 条 `decisionGuide` 入库并在 ConceptPage 展示；56 讲 `capabilityDomains` 入库并驱动 Profile / Search；4 条 `rolePaths` 入库；Profile 显示能力域、角色路径、下一步行动、本周建议、判断偏差、已完成场景与场景复盘；Search 支持能力域过滤、Glossary/决策手册命中；`model-router`、`token-cost-spike`、`rag-answer-quality`、`agent-tool-failure`、`trace-not-diagnostic` 五个场景演练已上线，`/scenarios` 目录页已上线。
- 当前上线内容：**56 / 56 讲**（全部已发布讲均为 v2）；剩余 `stub`：**0**。地图无 stub。
- 已上线模块进度：M1 `10/10`，M2 `10/10`，M3 `8/8`，M4 `16/16`，M5 `6/6`，M6 `6/6`。
- 验证：Scenario Library R2 以 `reports/scenario-library-r2-summary-20260628.md`、`reports/scenario-library-r2-browser-qa-20260628.md`、`reports/scenario-library-r2-ux-qa-20260628.md`、`reports/scenario-library-r2-performance-20260628.md`、`reports/scenario-library-r2-release-gate-20260628.md` 为准；生产化收口以 `reports/release-readiness-20260628.md`、`reports/browser-regression-20260628.md`、`reports/security-readiness-20260628.md`、`reports/performance-budget-20260628.md`、`reports/desktop-release-20260628.md` 为准；GitHub issue Stabilization 以 `reports/github-issues-triage-20260628.md`、`reports/stabilization-r0-summary-20260628.md`、`reports/stabilization-r0-browser-regression-20260628.md`、`reports/stabilization-r1-summary-20260628.md`、`reports/stabilization-r1-browser-regression-20260628.md`、`reports/stabilization-r2-issue-closures-20260628.md` 为准；历史 Phase 1/2/3 验证见 `reports/phase1-qa-report.md`、`reports/phase2-phase3-qa-summary.md`、`reports/scenario-library-r1-summary.md`。此前桌面版见 `reports/desktop-electron-mvp-summary.md`，backlog polish 见 `reports/backlog-polish-summary.md`，Final Wave 见 `reports/final-wave-summary.md`，GitHub P1 内容修复见 `reports/github-p1-content-repair-summary.md`，2026-06-28 内容 P1 关闭见 `reports/content-p1-repair-review-20260628.md`。
- 诊断题批级配平：Final Wave 12 题正确答案 A/B/C/D = 3/3/3/3。
- 已补齐：`observability-trace`（Trace / Observability）、`token-roi-flow`（Token ROI）、基础 PWA manifest、Google Fonts 外链移除、路由级 code splitting、Electron Windows 桌面发行通道；`trace`/`tool-calling` 敏感数据最小化边界与 `session-affinity` cache locality 口径；AI 工程负责人增强的决策手册、能力域、角色路径、Profile、Search、Glossary；场景演练库 R0+R1+R2 的五场景目录、完成状态、复盘队列与 LocalStorage v2 迁移；生产化收口新增基础 CSP、Electron 外链 allowlist、首包性能拆分和运行时缓存清理。
- 下一轮建议（均需 Owner 确认）：Stabilization R3（剩余 P2/P3：glossary 正文对齐、#53 UX 长尾、#38 scenarioSimulation 拆分取舍）、场景演练 R3（`multi-agent-stuck`、场景目录排序/搜索、场景完成状态在更多入口露出）、完整 PWA（Service Worker / 离线缓存）、桌面版图标/代码签名/自动更新。

## 1. 项目一句话定位

一个面向企业 AI 应用负责人、平台负责人与高级工程师的**交互式学习 Web 应用**，把 56 个 AI 应用工程知识点从“听过概念”带到“能解释机制、判断方案、诊断问题、指导落地”。首版为纯前端、内容数据驱动的 Web/PWA。

## 2. 技术栈（Web/PWA + 桌面版锁定）

- React + Vite + TypeScript
- 状态管理：Zustand
- 路由：React Router
- 样式：CSS Modules / 普通 CSS（设计变量集中在 `src/styles/tokens.css`）
- 动画：Framer Motion 或自研轻量动画（SVG / CSS / Canvas / React 组件，**不做 3D、不做视频**）
- 持久化：LocalStorage（首版），预留 IndexedDB
- 内容：Markdown / JSON 数据驱动
- 桌面壳：Electron + electron-builder（Windows 优先，复用 Web UI）

## 3. 目录结构（权威，新增文件须落入对应目录）

```text
src/
  app/            App.tsx, router.tsx
  pages/          HomePage, ModulePage, ConceptPage, SearchPage, GlossaryPage, ProfilePage
  components/
    layout/       AppShell, Header, Sidebar, BottomNav
    concept/      ConceptCard, ConceptHeader, ConceptSection, TakeawayBox, RelatedConcepts
    animation/    AnimationPlayer + 各动画组件（见 docs/animation-spec.md）
    quiz/         DiagnosticQuestion, OptionCard, ExplanationPanel
    progress/     ProgressBar, ModuleProgress, StudyStats
    search/       SearchBox（结果由 SearchPage 内联渲染）
  data/           modules.ts, concepts.ts, glossary.ts   ← 所有知识点/模块/术语内容
  store/          progressStore.ts                       ← 唯一全局状态
  types/          index.ts                               ← 唯一数据 schema 定义
  utils/          search.ts, progress.ts
  styles/         tokens.css, global.css                 ← 唯一视觉变量来源
docs/             product-spec / architecture / content-schema / animation-spec / acceptance-checklist
```

## 4. 硬边界（首版明确不做）

- 不做后端、不做服务端渲染、不接数据库。
- 不做登录注册、不做付费系统、不做多人协作、不做内容后台。
- 不接真实大模型 API、不做真实 AI 问答。
- 不做原生 iOS / Android、不做复杂视频播放器、不做完整题库系统。
- 桌面版首版不做云同步、自动更新、代码签名、原生文件导入导出。

## 5. 不可破坏的约定（违反即视为架构回归）

1. **数据 schema 唯一来源**：所有内容类型只在 `src/types/index.ts` 定义，以 [`docs/content-schema.md`](docs/content-schema.md) 为权威。字段命名采用 PRD 的 TypeScript 接口（`definition / pitfalls / animation / relatedConceptIds` 等），**不引入 56 讲写作模板的别名字段**（`oneSentence / commonPitfalls / animationBrief / relatedConcepts` 仅用于写作，落库时按映射转换）。
2. **内容与代码分离**：知识点、模块、术语、动画步骤、诊断题等内容只能存在于 `src/data/*`，**禁止写死在组件里**；动画步骤必须配置化。
3. **视觉唯一来源**：颜色/字体/间距等设计变量只在 `src/styles/tokens.css`，以 [`design.md`](design.md) 为视觉唯一准绳。**注意**：design.md 仅提供视觉风格与排版示例，其中出现的“讲数/模块计数”等文案（如 `50 讲`、Sidebar 示例里的 `0/12`、`0/10`）**只是占位示例，不具权威性**；任何数量、模块计数、知识点清单一律以 [`docs/content-schema.md`](docs/content-schema.md) 登记表为准（`56 讲`、`10/10/8/16/6/6`）。实现 UI 时不得直接复制 design.md 的数字。
4. **状态集中**：学习进度只走 `store/progressStore.ts`，持久化 key 固定为 `ai-learning-app-progress-v1`，数据结构带 `version` 字段。
5. **知识点清单权威**：56 讲清单与模块构成（`10/10/8/16/6/6`）以 [`docs/content-schema.md`](docs/content-schema.md) 登记表为准。

### 视觉红线（来自 design.md，覆盖 PRD 旧“华为红”方案）

> design.md 是高保真原型提取的设计风格，是视觉唯一准绳；它**覆盖** PRD 第 12 节与验收 16.3 中的“华为红·咨询式技术汇报”方案。

- 主色用蓝 `#1F40D8`（主操作/选中/章节编号/强调），进度用绿 `#2E7D58`，背景用暖纸色 `#FAF9F6`。
- **禁止**：华为红主视觉、大面积深色主题、霓虹/渐变光效、强阴影卡片堆叠、过度圆角、dashboard 式首页、第一屏堆满所有功能。
- 字体：标题 serif（IBM Plex Serif）、正文 sans（IBM Plex Sans）、序号/标签/指标 mono（IBM Plex Mono）。

## 5.1 文件所有权与修改权限（多 Agent 协作）

明确角色与可写范围，避免并行冲突。执行状态以 [`docs/project-board.md`](docs/project-board.md) 为单一看板。

| 角色 | 可写范围 | 禁止 |
|---|---|---|
| **主开发 Agent**（唯一长期改代码者） | `src/*`（含 `types/`、`data/`、`styles/`、组件、`store/`）、`docs/project-board.md`、文档 | — |
| **内容 Agent** | 仅 `content/drafts/`（按 56 讲写作模板产草稿） | 改 `src/data/*`、`src/types/*`、`docs/content-schema.md` |
| **内容审核 Agent** | 仅 `content/reviewed/`（审核结论、退回意见） | 直接改 `src/data/*` |
| **动画 Agent** | 仅 `docs/animation-spec.md` 草案 或 `content/drafts/` 内的动画步骤草稿 | 改 `AnimationPlayer`、动画 registry、`src/types/*` |
| **E2E 验证 Agent** | 测试用例目录、看板状态 | 改业务代码与权威 schema |

核心原则：

- **主开发是唯一能改 `src/types/index.ts`、`src/data/*`、`src/styles/tokens.css`、`AnimationPlayer`/registry 的角色。**
- 其他 Agent 一律通过“草稿 / 规格 / isolated draft”提交产物，由主开发审核后合入核心文件。
- 修改 `docs/content-schema.md`（权威 schema）必须同步更新 `src/types/index.ts` 与 `validate:content` 校验规则。

## 5.2 内容生产流水线（draft → review → 入库）

内容**不得**由内容 Agent 直接写入 `src/data/*`，统一走三段式（详细规则见 [`docs/project-board.md`](docs/project-board.md) §3）：

```text
content/drafts/<id>.md   →   content/reviewed/<id>.md   →   src/data/concepts.ts
  内容 Agent(写作字段)         审核 Agent(审核通过)            主开发(按 schema §3 映射转换并合入)
```

- `content/drafts/`、`content/reviewed/` 为内容生命周期目录，**不参与构建、不被应用 import**。
- 入库门禁：未通过审核或未通过 `npm run validate:content` 的内容不得进入 `src/data/*`。

## 6. 常用命令（项目初始化后填实）

```bash
npm install            # 安装依赖
scripts\start-local.cmd web              # Windows 首选：启动 Web 开发版（http://127.0.0.1:5173/）
scripts\start-local.cmd electron         # Windows 首选：启动 Electron 桌面开发版（自带 Vite）
scripts\start-local.cmd electron-attach  # Web 已在 5173 运行时，仅启动 Electron 并连接现有 Web
npm run dev            # 本地开发
npm run build          # Web 生产构建
npm run dev:desktop    # Electron 桌面版开发运行
npm run build:desktop  # Electron Windows 安装包 + portable 打包
npm run smoke:desktop  # Electron 生产包启动 smoke
npm run typecheck      # TypeScript 类型检查（须 0 错误）
npm run lint           # ESLint（须无严重错误）
npm run validate:content   # 聚合门禁：按当前阶段组合下述子命令（见 docs/content-schema.md §6）
npm run validate:structure          # P1.5 起始终：56 登记/模块计数/唯一性/关联无悬空/contentStatus/诊断题结构（不碰动画、不要求 stub 正文）
npm run validate:published-content  # 出现 demo/mvp 内容后：仅校验 contentStatus∈{demo,mvp} 的字段完整度
npm run validate:terminology        # v2 正文改版：术语 / 深度 / 轻量标记（content-schema §7）
npm run validate:animation          # P3 动画 registry 落地后：hasAnimation 与 animation 一致、type 已注册、步骤合法
```

## 7. 文档索引

- [`docs/project-board.md`](docs/project-board.md) — 执行看板（单一事实来源）：阶段/任务/Owner/状态/依赖/验收/阻塞 + 内容流水线。
- [`docs/product-spec.md`](docs/product-spec.md) — 产品规格：定位、页面、信息架构、路由、MVP Demo/1.0、PWA 范围。
- [`docs/architecture.md`](docs/architecture.md) — 技术架构：分层、组件、状态与迁移、搜索、响应式、阶段拆分、validate:content。
- [`docs/content-schema.md`](docs/content-schema.md) — 数据 schema（权威）+ 56 讲登记表 + 写作模板映射 + GlossaryTerm + 校验规则。
- [`docs/animation-spec.md`](docs/animation-spec.md) — 动画类型枚举、当前 10 组件、Player/Canvas 契约、基准脚本。
- [`docs/acceptance-checklist.md`](docs/acceptance-checklist.md) — 功能/内容/视觉/工程四类可勾选验收 + 可执行门禁。

## 8. 工作方式

- 每完成一个开发阶段都要保证项目可运行（见 architecture.md 的阶段拆分）。
- 代码优先保证清晰、可维护、可扩展到 100 讲，不追求炫技。
- 改动应可追溯到某条规格；不擅自扩大范围或重构无关代码。

### 8.1 封板与交接文档刷新硬规则

任何开发阶段、内容 Wave、修复回合或封板提交完成后，主开发 Agent 必须同步刷新关键文档状态，避免后续 Agent 接手时读到过期结论。

封板前必须检查并更新：

1. `AGENTS.md`：刷新“当前状态快照”，写明当前 `main` commit、已封板范围、上线讲数、剩余 stub、下一步建议。
2. `docs/project-board.md`：刷新“最后更新时间”“当前里程碑”“阶段任务板/扩展进度”“阻塞项”。
3. `docs/expansion-plan-44-lessons.md`：刷新进度追踪表与已完成批次/下一批范围。
4. `README.md`：刷新当前封版、上线讲数、关键验证报告。
5. `reports/`：新增对应阶段 summary / E2E / merge / review 报告，并在上述文档中引用。

封板提交前必须用 `git log --oneline --decorate -5` 与 `git status --short --branch` 复核真实 git 状态。禁止只新增报告、不更新看板和交接文档；禁止让 `project-board.md` 停留在旧阶段。
