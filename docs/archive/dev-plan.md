<!--
归档说明（App 程序开发 Agent · 2026-06-21）
- 本文件是「APP 骨架开发计划」的归档版本（开发分阶段方案 / 工作文档）。
- 非权威规格：产品/架构/schema/动画/验收/看板等权威内容仍以 docs/ 下对应文档与 AGENTS.md 为准。
- 进度快照：阶段 1-A（工程骨架）✅ 已完成并提交；阶段 1-B（数据层 + validate:structure）✅ 已完成；
  技术栈实际落地为 React 19（已与 Owner 确认，原计划正文沿用 AGENTS.md §2 的「React 18」表述）。
-->

# APP 骨架开发计划

## 1. 当前仓库状态判断

判定：**状态 A —— 尚未初始化**（仅有规格与设计资料，无任何工程代码）。

依据（来自只读勘察）：

| 检查项 | 结果 |
|---|---|
| `package.json` / `tsconfig` / `vite.config` / lock 文件 | ❌ 均不存在 |
| `src/` 目录 | ❌ 不存在（无路由/页面/组件/样式/状态管理） |
| `data/` 目录 | ❌ 不存在 |
| `content/drafts` / `content/reviewed` | ❌ 不存在（内容流水线目录尚未建立） |
| `scripts/` | ❌ 不存在（无 validate-content.ts） |
| `docs/` | ✅ 6 份规格齐全（product/architecture/content-schema/animation/acceptance/project-board） |
| `AGENTS.md` / `design.md` | ✅ 存在 |
| Git | 1 次提交（`docs: 初始化项目资料与架构规格文档集`），工作区干净 |
| 其他 | 根目录有 PRD PDF、56 讲素材 PDF、`MVP高保真模型设计.zip`、`tmp_claude_design_019ee7/`（设计参考截图，非工程产物）；另存在 `.cursor/plans/*.plan.md`，属历史 cursor 产物，非权威，本计划以 `docs/` + `AGENTS.md` 为准 |

结论：没有任何可复用的工程骨架，需从 P0（`npm create vite`）开始搭建。这也与 [project-board.md](../project-board.md) §1「当前阶段：P0（未开始）」一致。

## 2. 已阅读到的关键约束

**产品定位**：轻量工程学习书桌 / 可交互工程教材。固定左侧目录 + 中间专注阅读 + 顶部轻量工具条 + 首页第一屏低信息密度。不是 dashboard、不是营销页、不是复杂后台。

**视觉风格**（[design.md](../design.md) 为唯一准绳，**覆盖** PRD「华为红」方案）：

- 暖纸色背景 `#FAF9F6`；蓝 `#1F40D8`（主操作/选中/章节编号/强调）；绿 `#2E7D58`（进度/完成）；暖灰系做边框/分割/元信息
- 三字体：标题 serif（IBM Plex Serif）、正文 sans（IBM Plex Sans）、序号/标签/指标 mono（IBM Plex Mono）
- **禁止**：华为红主视觉、大面积深色主题、霓虹/渐变光效、强阴影卡片堆叠、过度圆角、dashboard 首页、第一屏堆满功能
- 桌面布局：左侧栏 ≈256px + 顶部条 ≈56px（半透明+blur）+ 主区；首页主区 max ≈1120px，详情页正文 760–860px，左右留白 ≈40px；圆角 6–8px，边框优先于阴影

**页面结构 / 路由**（[product-spec.md](../product-spec.md) §4、§6）：`/` `/modules` `/modules/:moduleId` `/concepts/:slug` `/search` `/glossary` `/profile`；知识点详情页 12 段固定结构（标题→定义→为什么重要→心智模型→机制→动画→企业案例→常见误区→诊断题→核心结论→关联→完成/收藏/下一个）。

**技术栈（锁定，[AGENTS.md](../AGENTS.md) §2）**：React + Vite + TS；Zustand；React Router；CSS Modules / 普通 CSS（变量集中在 `src/styles/tokens.css`）；动画 Framer Motion 或自研（SVG/CSS/Canvas，**不做 3D、不做视频**）；LocalStorage 持久化（预留 IndexedDB）；内容数据驱动。**不引入重型 UI 框架与未使用大型依赖。**

**内容 schema**（[content-schema.md](../content-schema.md) 为权威，`src/types/index.ts` 必须逐字一致）：

- 类型：`KnowledgePoint / LearningModule / AnimationConfig / AnimationStep / EnterpriseCase / DiagnosticQuestion / DiagnosticOption / UserProgress / GlossaryTerm`
- 字段命名用 PRD 接口（`definition / whyItMatters / mentalModel / mechanism / animation / enterpriseCase / pitfalls / diagnosticQuestion / keyTakeaways / relatedConceptIds`）；写作模板别名字段（`oneSentence / commonPitfalls / animationBrief / relatedConcepts`）仅写作用，落库按 §3 映射转换
- `contentStatus: stub | demo | mvp`；56 讲初始全部 stub；模块构成 `10/10/8/16/6/6 = 56`
- 首版 17 个 `hasAnimation`、7 类动画、8 组件

**动画协议**（[animation-spec.md](../animation-spec.md)）：`AnimationType` 17 值枚举；首版 8 组件（TokenFlow / Attention / ContextWindow / PrefillDecode / KVCache / ModelRouting / AgentLoop / IssueFixFlow）；`AnimationPlayer` 统一驱动、步骤数据来自 `AnimationConfig` 不写死、注册式分发（`Partial<Record<AnimationType, Component>>`）、未注册类型 fallback 占位（不白屏）；Canvas 组件只读、自身不持播放状态；默认步间隔 ≈1700ms；尊重 `prefers-reduced-motion`。

**禁止事项（硬边界）**：不做后端/SSR/数据库；不做登录/付费/协作/内容后台；不接真实大模型 API；不做原生端/视频播放器/完整题库；首版不做 Service Worker / 离线缓存（PWA 仅预留可选 manifest）；内容不得写死在组件里；动画步骤必须配置化；`design.md` 里的数字（`50 讲`、`0/12` 等）只是占位，不具权威性，数量一律以 content-schema §4 登记表为准。

**内容流水线**（[project-board.md](../project-board.md) §3）：`content/drafts/` → `content/reviewed/` → `src/data/concepts.ts`，drafts/reviewed 不参与构建、不被 import，主开发是唯一有权按映射转换入库的角色。

## 3. MVP 骨架目标（本轮范围 = 「搭稳骨架，支持后续接 56 讲」）

### 本阶段必须做（骨架）

1. P0 工程：Vite+React+TS 项目、权威目录结构、`tokens.css`/`global.css`、TS 严格类型、ESLint、路由壳
2. 数据层骨架：`src/types/index.ts`（逐字对齐 content-schema）、`modules.ts` + 56 个 stub 知识点登记（仅结构字段，正文留空）、`glossary.ts`（空或极少量）
3. `validate:structure` 脚本（P1.5 门禁）——**早期落地的最高杠杆项**，锁死 56 登记/模块计数/唯一性/关联无悬空
4. 布局壳：`AppShell` / `Sidebar` / `TopBar` / `BottomNav`(移动)
5. 首页 / 模块列表页 / 模块详情页 / 知识点详情页（结构渲染）
6. 状态层：`progressStore`（Zustand）+ LocalStorage（带 `version`、迁移、容错）
7. 动画壳：`AnimationPlayer` + REGISTRY + fallback + 1 个真实动画（kv-cache，文档已给完整步骤脚本）；其余 7 类先命中 fallback 占位
8. 诊断题壳：`DiagnosticQuestion` 组件 + 1 道真实题（kv-cache，文档已给完整样例）+ 错题记录
9. 搜索 / 术语(基础) / 我的学习(进度统计+清空) 页面骨架
10. 1–2 个 demo 知识点（建议 `kv-cache`）填到 demo 级别用于端到端验证渲染与校验链路

### 本阶段不做

- ❌ 批量生产 56 讲完整内容（交给内容/审核 Agent 走流水线，本阶段只做登记 stub + 1–2 讲 demo）
- ❌ 全部 8 个动画组件的真实实现（只实现 1 个 + 其余 fallback）
- ❌ 多道诊断题（只验证 1 道的真实流程）
- ❌ Service Worker / 离线缓存 / PWA manifest（除非你确认要）
- ❌ 移动端精细打磨、部署配置、README 之外的发布物

### 后续阶段再做

- 剩余 7 个动画组件实现、`validate:animation` 全面启用
- 批量诊断题、错题本/复习推荐增强
- 12 讲完整内容（→ MVP 1.0 门槛）、术语高级筛选/字典排版
- 响应式精细打磨、静态部署、完整 README

## 4. 推荐目录结构

当前无 `src/`，**直接采用 [AGENTS.md](../AGENTS.md) §3 的权威结构**（不另起炉灶），按需补齐内容流水线与脚本目录：

```text
AI-Learning-App/
├─ index.html                      # Vite 入口
├─ package.json / tsconfig*.json / vite.config.ts
├─ public/                         # manifest(可选,默认不做) / favicon
├─ src/
│  ├─ app/            App.tsx, router.tsx
│  ├─ pages/          HomePage, ModulePage, ConceptPage, SearchPage, GlossaryPage, ProfilePage
│  ├─ components/
│  │  ├─ layout/      AppShell, Header, Sidebar, BottomNav
│  │  ├─ concept/     ConceptCard, ConceptHeader, ConceptSection, TakeawayBox, RelatedConcepts
│  │  ├─ animation/   AnimationPlayer + 8 个 canvas 组件 + REGISTRY
│  │  ├─ quiz/        DiagnosticQuestion, OptionCard, ExplanationPanel
│  │  ├─ progress/    ProgressBar, ModuleProgress, StudyStats
│  │  └─ search/      SearchBox, SearchResults
│  ├─ data/           modules.ts, concepts.ts(56 stub), glossary.ts
│  ├─ store/          progressStore.ts            ← 唯一全局状态
│  ├─ types/          index.ts                    ← 唯一 schema 来源
│  ├─ utils/          search.ts, progress.ts(迁移)
│  └─ styles/         tokens.css, global.css      ← 唯一视觉变量来源
├─ scripts/           validate-content.ts(validate:structure 先行)
├─ content/
│  ├─ drafts/         内容 Agent 写作产物(不参与构建)
│  └─ reviewed/       审核 Agent 产物(不参与构建)
└─ docs/              (已存在, 6 份规格)
```

要点：`types/`、`data/`、`styles/tokens.css`、`store/`、`AnimationPlayer`+registry 均为**主开发 Agent 独占写权限**的高风险文件（AGENTS.md §5.1）。

## 5. 数据与类型设计

**`src/types/index.ts`（权威、唯一 schema 来源）**：逐字搬运 [content-schema.md](../content-schema.md) §1 的 TS 接口，外加从 [animation-spec.md](../animation-spec.md) §1 导入 `AnimationType` 17 值枚举。**不引入写作模板别名字段。**

**`modules.ts`**：6 个 `LearningModule`（m1–m6，`conceptIds` 顺序 = 概念 `order`），数据来自 content-schema §4 模块表。

**`concepts.ts`（56 个 stub 登记，平滑接入的关键）**：

- 严格按 content-schema §4 登记表**机械转录**全部 56 个 `KnowledgePoint` 的结构字段：`id/slug/moduleId/order/difficulty/estimatedMinutes/tags/hasAnimation`（`slug === id`），其余正文字段留空字符串/空数组
- `contentStatus` 全部 `stub`，`hasAnimation:true` 的 17 个**先不挂 `animation`**（避免触发尚未实现的动画校验，符合 content-schema §2「stub 建议 `hasAnimation:false` 或缺省」与 §6.3 的空集约定）——骨架阶段这 17 个临时记 `hasAnimation:false`，待阶段 4 动画落地再翻为 `true` 并补 `animation`
- `relatedConceptIds` 一律先指向**同登记表内已存在 id**（保证 `validate:structure` 的「关联无悬空」从第一天起就绿）
- 这样后续内容 Agent 产出的 reviewed 草稿，主开发只需「按 §3 映射表把字段填进对应 stub 的正文字段 + 翻 `contentStatus`」，**56 讲可逐讲平滑入库、互不阻塞**

**`glossary.ts`**：骨架阶段先空数组或放 2–3 个术语占位，类型用 `GlossaryTerm`，确保 §6.1 关联校验有对象可校。

**动画 config**：阶段 4 仅给 `kv-cache` 配真实 `AnimationConfig`（步骤取自 animation-spec §5.1），其余类型走 fallback。

**progress store**：见第 7 节。

**`validate:structure`**：实现 [content-schema.md](../content-schema.md) §6.1 七条结构校验，作为 `npm run validate:content` 在骨架阶段的聚合内容（暂不含 published-content / animation 子命令）。

## 6. 页面与组件拆分（职责，不写代码）

| 组件 / 页面 | 职责（一句话） |
|---|---|
| `AppShell` | 桌面：左侧栏 + 顶部条 + 主阅读画布；移动：底部导航。唯一布局容器 |
| `Sidebar` | 产品名 + `56 讲 / MVP·v1` 标签 + 一级导航（首页/我的学习/搜索）+ 六大模块列表(实时 done/total) + 底部总进度；当前项淡蓝底 |
| `Header`(TopBar) | breadcrumb + 搜索框(220–320px，`/` 唤起、`esc` 关闭) + 连续学习天数；≈56px 半透明+blur |
| `BottomNav` | 移动端底部导航（首页/模块/搜索/我的） |
| `HomePage` | 第一屏仅：主标题区 + 继续学习按钮(→ lastVisited 或第一个未完成) + 简洁进度 + 连续天数 + 推荐路径露出 4 条；六大模块/今日推荐置于下方。**核心动作只有一个：继续学习** |
| `ModulesPage`(`/modules`) | 六大模块总览（路径说明 + done/total） |
| `ModulePage`(`/modules/:moduleId`) | 该模块全部知识点的 `ConceptCard` 列表 + 筛选(难度/状态/有无动画) + 排序(推荐/时长/难度) |
| `ConceptCard` | 卡片字段：标题/一句话定义/难度/时长/有无动画/完成/收藏；行分割优于强卡片 |
| `ConceptPage`(`/concepts/:slug`) | 按 12 段固定结构渲染；定义左 3px 蓝竖线；机制用 mono+蓝序号编号步骤；完成/收藏/下一个；记录 `lastVisitedConceptId` |
| `ConceptHeader / ConceptSection / TakeawayBox / RelatedConcepts` | 详情页标题元信息 / 通用章节容器 / 核心结论高亮块 / 关联跳转（关联无悬空） |
| `AnimationPlayer` | 统一播放器：播放/暂停/上一步/下一步/重置/步骤计数/当前步说明；按 `config.type` 查 REGISTRY 分发；未注册走 fallback；离开页面清计时器；尊重 reduced-motion |
| `KVCacheAnimation`（+ 其余 7 类占位） | 只读 canvas：按 `step/highlightTargets` 渲染深色机制画布；自身不持状态、不写步骤 |
| `DiagnosticQuestion` | 渲染场景/现象/选项；提交判定(单/多选)；展示解析 + 排查路径；错题写 `wrongQuestionIds` |
| `OptionCard / ExplanationPanel` | 选项卡片（含正确/错误态） / 解析与排查路径面板 |
| `SearchPage`(`/search`) | 本地实时搜索（title/definition/tags/mechanism/enterpriseCase/pitfalls），排序：完全匹配>包含>标签>正文；空结果提示；上限 12 |
| `GlossaryPage`(`/glossary`) | 基础术语列表（中/英名/一句话/所属模块/关联知识点） |
| `ProfilePage`(`/profile`) | 总进度 + 各模块进度 + 最近学习 + 收藏 + 错题 + 推荐复习 + 清空学习记录 |
| `ProgressBar / ModuleProgress / StudyStats` | 通用进度条 / 模块 done-total / 学习统计（派生值，不冗余存储） |

## 7. 状态管理方案

**`store/progressStore.ts`（Zustand，唯一全局状态）**，状态结构 = [content-schema.md](../content-schema.md) §1 的 `UserProgress`：

```ts
interface UserProgress {
  completedConceptIds: string[];      // 标记/取消完成
  favoriteConceptIds: string[];       // 收藏/取消收藏
  wrongQuestionIds: string[];         // 诊断答错记录
  lastVisitedConceptId?: string;      // 每次进详情页更新(驱动首页「继续学习」)
  lastStudyDate?: string;             // ISO 日期(YYYY-MM-DD)
  studyStreakDays: number;            // 连续学习天数
}
```

- **持久化**：key 固定 `ai-learning-app-progress-v1`；写入结构 `{ version: 1, progress }`；`CURRENT_PROGRESS_VERSION = 1`
- **读取/迁移集中在 `utils/progress.ts`**：`loadProgress()` → 解析 → 校验 version → `migrateProgress()` 逐级迁移 → 解析失败/未知版本回退 `defaultProgress()`（**不抛错、不清空原始备份、UI 不白屏**）
- **派生值在 selector/工具计算**：完成度百分比、模块 done/total、连续天数展示均不冗余存储
- **动作**：toggleComplete / toggleFavorite / recordWrongQuestion / recordVisit(同时更新 `lastStudyDate` + `studyStreakDays` 的「是否跨日」判断) / clearAll
- 页面刷新进度不丢失；提供「清空学习记录」
- `studyStreakDays` 计算：进入任意页面当日（基于 `lastStudyDate`）—— 若与上次同日则不变；若为次日则 +1；若间隔 >1 天则重置为 1

## 8. 分阶段执行计划（5 阶段，每阶段都能 build）

> 阶段命名对齐 [architecture.md](../architecture.md) §6 的 P0–P6，但**压缩为骨架范围**（见第 3 节）。每阶段交付后必须 `npm run dev` 可跑、`npm run build` 通过。

### 阶段 1：项目基础与目录（对应 P0 + P1.5 前置）

- **交付物**：`npm create vite`（react-ts 模板）建工程；按第 4 节建全量目录；`tokens.css`/`global.css`（design.md 全部色板+字体+间距变量）；`types/index.ts`（逐字 schema）；`data/modules.ts` + `data/concepts.ts`（56 stub 登记）+ `data/glossary.ts`（空/占位）；`scripts/validate-content.ts` 的 `validate:structure` 子命令 + npm scripts；ESLint/TS 严格；空 `App.tsx` 占位
- **验收方式**：`npm install` + `npm run dev` 首页可访问；`npm run typecheck` 0 错；**`npm run validate:structure` 对 56 登记全绿**（模块计数 `10/10/8/16/6/6`、id/slug 唯一、关联无悬空、contentStatus 合法）；`npm run build` 成功

> 落地时拆为 **1-A（工程骨架）** 与 **1-B（数据层 + validate:structure）** 两小步执行。

### 阶段 2：布局与首页（对应 P1a）

- **交付物**：`router.tsx`（7 条路由壳）；`AppShell` / `Sidebar` / `Header`(TopBar) / `BottomNav`；`progressStore`（含 LocalStorage + `utils/progress.ts` 迁移/容错）+ `ProgressBar`；`HomePage`（第一屏极简：主标题 + 继续学习 + 简洁进度 + 连续天数 + 推荐路径 4 条；模块卡片放下方）
- **验收方式**：左侧栏可见六大模块与实时 done/total(`0/10…`)；首页第一屏**不 dashboard**；点模块/知识点/搜索/我的学习可跳转占位页；手动在 console 改 LocalStorage 后刷新，进度与迁移回退均不白屏；`build` 通过

### 阶段 3：模块页与知识点详情页（对应 P1b + P2）

- **交付物**：`ModulesPage`、`ModulePage` + `ConceptCard`（筛选/排序）、`ConceptPage` + `ConceptHeader/ConceptSection/TakeawayBox/RelatedConcepts`；详情页按 12 段结构渲染；完成/收藏按钮接 `progressStore`；进详情页写 `lastVisitedConceptId`；把 `kv-cache` 填到 demo 级别作为端到端样例（动画段先留占位章节）
- **验收方式**：从首页→模块→详情全链路通；任意 stub 知识点也能打开（空正文优雅降级，不崩）；kv-cache 详情页结构完整、完成/收藏刷新不丢；`validate:structure` 仍全绿；`build` 通过

### 阶段 4：动画壳与诊断题（对应 P3 + P4 骨架）

- **交付物**：`AnimationPlayer` + REGISTRY + fallback 占位 + `KVCacheAnimation` 真实实现（步骤取 animation-spec §5.1）；给 kv-cache 补 `AnimationConfig` 并翻 `hasAnimation:true`；`DiagnosticQuestion`/`OptionCard`/`ExplanationPanel` + kv-cache 诊断题（取 content-schema §5 样例）+ 错题写入；启用 `validate:animation` 子命令
- **验收方式**：kv-cache 动画可播放/暂停/上一步/下一步/重置/步骤计数同步、离开页面无计时器泄漏、reduced-motion 生效；其余动画类型命中 fallback 不白屏、dev 下 `console.warn`；诊断题判定准确、解析与排查路径清晰、答错进错题本；`validate:content`（structure + animation）全绿；`build` 通过

### 阶段 5：搜索 / 术语 / 我的学习 + 打磨（对应 P5 + P6 部分）

- **交付物**：`utils/search.ts` + `SearchPage`（`SearchBox`/`SearchResults`，`/` 唤起、`esc` 关闭、空结果提示、上限 12）；`GlossaryPage`（基础列表）；`ProfilePage`（`StudyStats`/`ModuleProgress` + 最近学习 + 收藏 + 错题 + 推荐复习 + 清空记录）；响应式基础（移动单列、无横向滚动）；README 起步（如何 install/dev/build/validate）
- **验收方式**：搜索实时/可跳转/排序正确；术语可浏览；Profile 进度、最近学习、错题准确；清空可用且不残留；桌面/移动均无横向滚动；首页仍非 dashboard；`validate:content` 全绿；`typecheck`/`lint`/`build` 全通过

## 9. 风险与反建议（Top 5）

| # | 风险 | 规避方式 |
|---|---|---|
| 1 | **首页被做成 dashboard**（六大模块卡 + 统计 + 推荐 + 诊断题全堆第一屏）——直接违反 design.md §6 与 acceptance §3.12/3.14 | 阶段 2 用 design.md §4 首页文案/结构逐项核对；首页第一屏**只有一个核心动作（继续学习）**；六大模块/今日推荐一律下沉到滚动后；视觉验收单列为强条目 |
| 2 | **schema 与 mock data 漂移**（types / data / 文档三者不一致，56 登记错漏） | 阶段 1 即落地 `validate:structure` 作硬门禁；`types/index.ts` 从 content-schema §1 逐字搬运、**不引入别名字段**；每阶段都跑 `validate:content` + `typecheck` |
| 3 | **组件过度设计**（抽象太早、引入重型 UI 框架、违反 YAGNI） | 锁定「不引入重型 UI 框架」；样式只用 CSS Modules + tokens；动画库优先自研，验证需要再加 Framer Motion；组件按 architecture §2 清单，不超范围造组件 |
| 4 | **内容与工程耦合**（正文写死组件、56 讲一次性塞进 src、写作字段污染权威 schema） | 严守「内容只在 `src/data/*`、动画步骤配置化」；56 讲走 `content/drafts→reviewed→src/data` 流水线，主开发独占入库；本阶段只做 stub + 1–2 讲 demo |
| 5 | **动画做得太复杂**（变成监控控制台、深色面积过大、3 个以上动画同时实现拖慢骨架） | 骨架阶段只真实实现 **1 个**动画(kv-cache) + 注册式 fallback 兜底其余；`AnimationPlayer` 控制区只保留 5 个控件；深色画布面积克制、外层保持浅色阅读页 |

## 10. 需要你确认的问题（仅列真正阻塞项）

1. **【已确认】stub 边界**：56 讲的 stub 结构登记（仅结构字段，正文留空）视为骨架数据层，允许一次性建齐。（Owner 已确认）
2. **【已确认】动画库**：首版 `AnimationPlayer`/canvas 先纯自研（SVG/CSS/React），暂不引入 Framer Motion。（Owner 已确认）
3. **【已确认】PWA manifest**：首版不做（普通静态 Web）。（Owner 已确认）
4. **【已确认】React 版本**：实际落地 React 19（模板默认），保留不降级。（Owner 已确认）

## 11. 建议的第一步执行指令（只覆盖阶段 1 的第一小步）

> 请把下面这段作为下一步发给我的「执行指令」（仅初始化 + 目录 + 视觉变量 + 类型，**还不接路由/数据/动画**，可独立 build 验证）：
>
> **执行阶段 1-A：初始化工程骨架。** 用 `npm create vite@latest . -- --template react-ts` 在当前目录初始化 Vite + React + TypeScript（strict）；建立 AGENTS.md §3 的权威目录骨架（`src/{app,pages,components/{layout,concept,animation,quiz,progress,search},data,store,types,utils,styles}`、`scripts/`、`content/{drafts,reviewed}`，空目录放 `.gitkeep`）；创建 `src/styles/tokens.css`（逐字搬入 design.md §2 全部色板/字体/间距变量）与 `global.css`（reset + 基础排版，应用暖纸背景与三字体关系）；创建空的 `src/types/index.ts`；`App.tsx` 暂只渲染一个「骨架就绪」占位页。装最小依赖（react-router-dom、zustand），配 `npm run typecheck`/`lint`/`build` 三个脚本。**不写 56 数据、不接路由、不做组件。** 完成后跑 `npm install` + `npm run dev`（首页可见）+ `npm run build`（成功）给我看结果。
