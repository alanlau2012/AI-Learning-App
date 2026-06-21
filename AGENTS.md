# AGENTS.md — AI 应用工程学习 APP

这是写给后续开发 Agent / 工程师的仓库说明书。开工前先读本文件，再读 `docs/` 下的规格文档。

## 1. 项目一句话定位

一个面向企业 AI 应用负责人、平台负责人与高级工程师的**交互式学习 Web 应用**，把 56 个 AI 应用工程知识点从“听过概念”带到“能解释机制、判断方案、诊断问题、指导落地”。首版为纯前端、内容数据驱动的 Web/PWA。

## 2. 技术栈（首版锁定）

- React 18 + Vite + TypeScript
- 状态管理：Zustand
- 路由：React Router
- 样式：CSS Modules / 普通 CSS（设计变量集中在 `src/styles/tokens.css`）
- 动画：Framer Motion 或自研轻量动画（SVG / CSS / Canvas / React 组件，**不做 3D、不做视频**）
- 持久化：LocalStorage（首版），预留 IndexedDB
- 内容：Markdown / JSON 数据驱动

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
    search/       SearchBox, SearchResults
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

## 5. 不可破坏的约定（违反即视为架构回归）

1. **数据 schema 唯一来源**：所有内容类型只在 `src/types/index.ts` 定义，以 [`docs/content-schema.md`](docs/content-schema.md) 为权威。字段命名采用 PRD 的 TypeScript 接口（`definition / pitfalls / animation / relatedConceptIds` 等），**不引入 56 讲写作模板的别名字段**（`oneSentence / commonPitfalls / animationBrief / relatedConcepts` 仅用于写作，落库时按映射转换）。
2. **内容与代码分离**：知识点、模块、术语、动画步骤、诊断题等内容只能存在于 `src/data/*`，**禁止写死在组件里**；动画步骤必须配置化。
3. **视觉唯一来源**：颜色/字体/间距等设计变量只在 `src/styles/tokens.css`，以 [`design.md`](design.md) 为唯一准绳。
4. **状态集中**：学习进度只走 `store/progressStore.ts`，持久化 key 固定为 `ai-learning-app-progress-v1`，数据结构带 `version` 字段。
5. **知识点清单权威**：56 讲清单与模块构成（`10/10/8/16/6/6`）以 [`docs/content-schema.md`](docs/content-schema.md) 登记表为准。

### 视觉红线（来自 design.md，覆盖 PRD 旧“华为红”方案）

> design.md 是高保真原型提取的设计风格，是视觉唯一准绳；它**覆盖** PRD 第 12 节与验收 16.3 中的“华为红·咨询式技术汇报”方案。

- 主色用蓝 `#1F40D8`（主操作/选中/章节编号/强调），进度用绿 `#2E7D58`，背景用暖纸色 `#FAF9F6`。
- **禁止**：华为红主视觉、大面积深色主题、霓虹/渐变光效、强阴影卡片堆叠、过度圆角、dashboard 式首页、第一屏堆满所有功能。
- 字体：标题 serif（IBM Plex Serif）、正文 sans（IBM Plex Sans）、序号/标签/指标 mono（IBM Plex Mono）。

## 6. 常用命令（项目初始化后填实）

```bash
npm install        # 安装依赖
npm run dev        # 本地开发
npm run build      # 生产构建
npm run typecheck  # TypeScript 类型检查（须 0 错误）
npm run lint       # ESLint（须无严重错误）
```

## 7. 文档索引

- [`docs/product-spec.md`](docs/product-spec.md) — 产品规格：定位、页面、信息架构、路由、优先级。
- [`docs/architecture.md`](docs/architecture.md) — 技术架构：分层、组件、状态、搜索、响应式、开发阶段拆分。
- [`docs/content-schema.md`](docs/content-schema.md) — 数据 schema（权威）+ 56 讲登记表 + 写作模板映射。
- [`docs/animation-spec.md`](docs/animation-spec.md) — 动画类型枚举、首版 8 组件、Player 契约、基准脚本。
- [`docs/acceptance-checklist.md`](docs/acceptance-checklist.md) — 功能/内容/视觉/工程四类可勾选验收。

## 8. 工作方式

- 每完成一个开发阶段都要保证项目可运行（见 architecture.md 的阶段拆分）。
- 代码优先保证清晰、可维护、可扩展到 100 讲，不追求炫技。
- 改动应可追溯到某条规格；不擅自扩大范围或重构无关代码。
