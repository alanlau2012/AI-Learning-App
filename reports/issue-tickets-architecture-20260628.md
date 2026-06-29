# AI-Learning-App 架构与代码质量审计报告（20260628）

> 审计 Agent：`agents/architecture-code-audit-agent.md`
> 审计范围：本次未提交改动 + 全量架构约定核对
> 工作目录：`d:\AI项目\AI-Learning-App`
> 仅只读 + 只读校验命令；未修改任何业务代码、文档、schema。
> 基线 commit：`9a11d6941c1886bb095b26f836e7ec2754999e81 chore(release): prepare production readiness`

## 1. 结论先行

- **架构结论**：**有条件通过**。本次未提交改动（Scenarios 库 R2 + 完成与复盘状态）整体演化方向与 §5 一致，未破坏分层与 schema 唯一来源；存在 1 条 P1（Header 面包屑覆盖缺失，影响本次新增页面的导航一致性）和若干 P2/P3 风格漂移与历史颜色硬编码问题，**不阻断合入**，但建议在封板前修复 P1。
- **§5 约定守住情况**：5 条核心约定均守住；schema 升级走标准三件套（`docs/content-schema.md` ↔ `src/types/index.ts` ↔ `validate:content`），迁移逻辑集中在 `utils/progressCore.ts`，路由保持 lazy code splitting，视觉唯一来源仍为 `tokens.css`。
- **typecheck**：**PASS**（exit 0，17.3s）
- **validate:structure**：**PASS**（exit 0）
- **validate:published-content**：**PASS**（exit 0，56 个 demo/mvp 全部校验）
- **validate:terminology**：**PASS**（exit 0，56 个 v2 内容全部校验）
- **路由 code splitting**：守住。本次新增 `/scenarios` 列表页沿用 `lazy: () => import(...)` 模式，与既有页面一致；7 条页面路由全部 lazy，且每条都带 `hydrateFallbackElement` 兜底。
- **P0 / P1 / P2 / P3 数量**：P0 = 0，P1 = 1，P2 = 4，P3 = 3。
- **最大风险**：本次改动一致性演化良好，最大风险不在新增改动，而在 `src/pages/ScenarioPage.module.css:133,138,139` 局部使用了未登记 token 的颜色（`#bed8ca / #f1d0a8 / #fff7ea`），与"视觉唯一来源"约定存在小范围漂移，且 Header 面包屑未覆盖 `/scenarios` 路径，影响新页面体验闭环。

## 2. 校验命令执行结果

| 命令 | 退出码 | 关键输出 | 结论 |
|---|---|---|---|
| `npm run typecheck`（`tsc -b`） | 0 | 无错误输出 | PASS |
| `npm run validate:structure` | 0 | `通过：内容结构校验（56 登记 / 模块计数 10/10/8/16/6/6 / 唯一性 / 关联无悬空 / contentStatus / 诊断题结构 / 本地增强数据）` | PASS |
| `npm run validate:published-content` | 0 | `[published-content] 已校验 demo/mvp 内容 56 个。` | PASS |
| `npm run validate:terminology` | 0 | `[terminology] 已校验 v2 内容 56 个。` | PASS |

四条只读校验全部 PASS，不构成 P1 问题单的事实依据；本报告 P1 来自静态阅读与运行时导航一致性分析。

## 3. §5 不可破坏约定核对

| 约定 | 守住/违反 | 证据（文件:行号） | 说明 |
|---|---|---|---|
| 1. 数据 schema 唯一来源 | **守住** | `src/types/index.ts:208-219`（UserProgress）、`src/types/index.ts:265-426`（Scenario 全套）；`docs/content-schema.md:173-184`、`docs/content-schema.md:378-394` | UserProgress 新增 `completedScenarioIds / reviewScenarioIds / lastVisitedScenarioId` 在 `types/index.ts` 与 `content-schema.md` 一致；`ScenarioExercise` v2 扩展字段在两处同步登记；本次新增 `scenarioExercisesR2.ts` 不引入写作模板别名字段。 |
| 2. 内容与代码分离 | **守住** | `src/data/scenarioExercisesR2.ts:1-195`；`src/pages/ScenariosPage.tsx:1-113`、`src/pages/ScenarioPage.tsx:1-310` | R2 两条场景（`agent-tool-failure`、`trace-not-diagnostic`）均通过 `src/data/*` 入库；新页面只做展示与交互，无硬编码内容；策略与事件配置化。 |
| 3. 视觉唯一来源 | **基本守住，局部漂移（P2）** | `src/styles/tokens.css:1-49`；`src/pages/ScenarioPage.module.css:133,138,139`；`src/pages/ScenariosPage.module.css`（无硬编码） | `tokens.css` 仍是唯一权威；`ScenariosPage.module.css` 全部用 token；`ScenarioPage.module.css` 三处局部用未登记 token 的颜色（`better/worse` 状态色）绕过 tokens.css。该漂移在改动前已存在，本次未引入，但属"约定违反"，登记为 P2。 |
| 4. 状态集中 | **守住** | `src/store/progressStore.ts:1-159`；`src/utils/progressCore.ts:1-153`；`src/utils/progress.ts:1-524` | 场景完成 / 收藏 / 复盘 / 最近访问全部走 `progressStore`；持久化 key 仍 `ai-learning-app-progress-v1`，`CURRENT_PROGRESS_VERSION` 升级到 2，`migrateProgress` 支持 0/1/2 多版本回退；`localStorage` 仅在 `progressCore.ts:55,56,76,78` 出现，全仓库唯一。 |
| 5. 知识点清单权威 | **守住** | `docs/content-schema.md:412-511`；`scripts/validate-content.ts` 通过 `validate:structure` | 56 讲 / `10/10/8/16/6/6` 维持不变，本次改动未触碰 concept 清单。 |

## 4. 问题清单（按子维度分表）

### 4.1 分层与目录边界

| 级别 | 位置（文件:行号） | 现象 | 违反约定 | 影响 | 最小修复方向 |
|---|---|---|---|---|---|
| P3 | `src/utils/progress.ts:1-524` 与 `src/utils/progressCore.ts:1-153` 拆分边界 | `progress.ts` 通过 `export { ... } from './progressCore'` 重新导出 `moduleProgress / overallProgress / isPublishedConcept`，让两个工具模块之间存在 re-export 桥；新读者难以判断某个 helper 该去哪个文件找 | AGENTS.md §3（utils 目录"清晰"） | 可维护性下降，但未越界 | 在两个文件顶部注释里写清分工：`progressCore` = 持久化 + 模块/总进度轻量计算；`progress.ts` = Profile 级能力域 / 角色路径 / 推荐派生。无需重构结构 |

### 4.2 Schema 一致性

| 级别 | 位置（文件:行号） | 现象 | 违反约定 | 影响 | 最小修复方向 |
|---|---|---|---|---|---|
| — | 无 | 本次改动 schema 三件套（schema.md / types/index.ts / validate 校验）保持同步；R2 新场景通过 `validate:published-content` 与 `validate:terminology`（虽然 scenario 数据本身不在 v2 terminology 扫描范围，但相关 concept 引用全部合法） | — | — | 无需修复 |

### 4.3 状态集中度

| 级别 | 位置（文件:行号） | 现象 | 违反约定 | 影响 | 最小修复方向 |
|---|---|---|---|---|---|
| P3 | `src/store/progressStore.ts:74-83`（`completeScenario`） | 完成场景时如果该 scenario 不在 `reviewScenarioIds` 中会自动追加进复盘队列，把"完成"与"加入复盘"耦合在一起 | AGENTS.md §5.4（状态集中、动作语义清晰） | 用户无法只完成而不进入复盘；语义可议 | 拆为"完成只写 completedScenarioIds"，是否复盘由 UI 显式调用 `toggleReviewScenario`；或保留耦合但在注释里写明"完成即默认进复盘"。属设计偏好，登记 P3 |
| P3 | `src/pages/HomePage.tsx:36-45` | 调用 `getContinueLearningConceptId` 时手工拼装了一个仅包含 concept 字段的 `UserProgress`，把 `completedScenarioIds / reviewScenarioIds` 写死为 `[]` | AGENTS.md §5.4（派生值不冗余存储） | 当前不会出错（该函数只读 concept 字段），但若未来 helper 改为依赖 scenario 进度，HomePage 会得到错误结果 | 直接传 `useProgressStore.getState()` 或显式展开 store 完整状态；登记 P3 |

### 4.4 视觉单一来源

| 级别 | 位置（文件:行号） | 现象 | 违反约定 | 影响 | 最小修复方向 |
|---|---|---|---|---|---|
| P2 | `src/pages/ScenarioPage.module.css:133,138,139` | `.metricCard.better` / `.metricCard.worse` 直接写死 `#bed8ca / #f1d0a8 / #fff7ea`，绕过 `tokens.css` | AGENTS.md §5.3（视觉唯一来源） | 这三色与进度绿 `#2e7d58`、告警 `#e8943a` 不一致，状态色无法全站统一调整 | 在 `tokens.css` 新增 `--color-success-soft / --color-warning-soft / --color-warning-border`（或类似），改为 `var(...)` |
| P2 | `src/pages/ProfilePage.module.css:367,368` | `background: #fff5e8; color: #9a520f;` 同样绕过 tokens（与 `ExplanationPanel.module.css:14`、`OptionCard.module.css:36` 的 `#fff5e8` 重复定义告警背景） | AGENTS.md §5.3 | 同一警告底色散落多处，改一处无法全站生效 | 抽到 `tokens.css` 的告警 soft token，统一引用 |
| P2 | `src/components/animation/*.module.css`（多个） | 大量动画 CSS 中 `#1a1916 / #f7f3ea / #8ea2ff / #f0c089 / #8fd3b0` 等"暗色画布配套色"硬编码（已存在于 main，非本次引入） | AGENTS.md §5.3 | 动画暗主题色板没有走 token；如需统一调整需改多处 | 把动画暗主题色板登记进 `tokens.css`（可放在单独分组如 `--anim-canvas-bg`），逐个替换。属历史漂移，建议作为 backlog 单独排期 |
| P3 | `src/pages/ScenarioPage.module.css:319`、`src/pages/HomePage.module.css:52,59`、`src/components/concept/ConceptHeader.module.css:70,74`、`src/components/quiz/DiagnosticQuestion.module.css:39` | 白色文本与深主色 `#1838b8`（HomePage 主按钮 hover）也未走 token | AGENTS.md §5.3 | 影响极小，但严格按"视觉唯一来源"亦属漂移 | 在 tokens.css 加 `--color-on-primary: #fff` 与 `--color-primary-hover`，逐个替换 |

### 4.5 路由与 code splitting

| 级别 | 位置（文件:行号） | 现象 | 违反约定 | 影响 | 最小修复方向 |
|---|---|---|---|---|---|
| P1 | `src/components/layout/Header.tsx:16-33`（`buildBreadcrumb`） | 新增 `/scenarios` 列表页与 `/scenarios/:scenarioId` 详情页均未在面包屑中识别：当前只会 fallthrough 返回 `[]`，新页面上方面包屑为空 | AGENTS.md §3（Header 职责=breadcrumb）、UX 一致性 | 进入场景目录或场景详情时顶部面包屑空白，破坏"稳定锚点"心智，与本次新增页面闭环不符 | 在 `buildBreadcrumb` 加 `if (pathname === '/scenarios') return ['场景演练'];` 与 `if (pathname.startsWith('/scenarios/')) ...`，可在 scenarioExerciseById 查标题（与现有 concept 标题回查模式一致） |
| P2 | `src/components/layout/BottomNav.tsx:8-13`、`src/components/layout/Sidebar.tsx:13-18` | 新增 `/scenarios` 入口同时落在 BottomNav 和 Sidebar 是一致的；但 Sidebar 顺序为 首页 / 我的学习 / 场景演练 / 搜索，BottomNav 顺序为 首页 / 场景 / 搜索 / 我的，两套导航的顺序与 label（"场景演练" vs "场景"）不一致 | AGENTS.md §3（layout 一致性） | 用户在桌面与移动端切换时认知割裂；label 不统一也会让 NavLink active 状态在视觉上不一致 | 统一 label 文案与顺序（建议桌面/移动使用一致 nav 数据源或抽出常量）。登记 P2 |

### 4.6 可维护性红旗

| 级别 | 位置（文件:行号） | 现象 | 违反约定 | 影响 | 最小修复方向 |
|---|---|---|---|---|---|
| P2 | `src/data/scenarioExercises.ts:605`（`scenarioExerciseById`）+ `src/pages/ScenarioPage.tsx:15` + `src/pages/ProfilePage.tsx:20-21` + `src/pages/ScenariosPage.tsx:10` | 多处重复 `new Map(concepts.map(...))` 或 `new Map(scenarioExercises.map(...))` 来构造 byId 查找表；`concepts` 已有 `data/conceptNav.ts` 提供 `conceptTitleById`，但 `conceptById`（含完整对象）的派生散落在 ConceptPage / ScenarioPage / ProfilePage / ScenariosPage 四处 | AGENTS.md §3（utils/data 边界）、避免重复造轮子 | 四份重复 Map 构造；任一 concept 字段调整需多处同步 | 在 `src/data/conceptNav.ts` 或新增 `src/data/conceptIndex.ts` 暴露单一 `conceptById` 与 `scenarioById`，各页面改为引用 |
| P3 | `src/data/scenarioExercises.ts:2` | `import { scenarioExercisesR2 } from './scenarioExercisesR2.ts';` 显式带 `.ts` 扩展名；同模式见 `src/utils/applyV2Revisions.ts:1-2`、`src/data/termCanonical.ts:6`、`src/data/demoConcepts.ts:2` | 项目其余位置均不带扩展名（如 `from './scenarioExercises'`），风格不统一 | 不影响运行（Vite/ESM 支持），但风格漂移 | 改为不带扩展名，与绝大多数 import 一致；可由 lint 规则强约束 |
| P3 | `src/utils/scenarioSimulation.ts:1-883` | 文件 883 行，单文件含模型路由 + 通用 delta + 复盘派生 + 信号识别多职责 | AGENTS.md §8（可维护、可扩展到 100 讲） | 接近 1000 行红旗阈值；新增场景类型时改一处易牵连其他分支 | 拆分为 `scenarioSimulation/routing.ts` / `genericDelta.ts` / `review.ts` 等子模块；本次不阻断，登记为后续 polish |

> 未发现：`any`、`as any`、`@ts-ignore`、`@ts-expect-error`、未穷尽 switch（grep 全仓 0 命中）、`require(`、函数体内 inline import、跨层 `pages → pages` 直接 import、循环依赖（imports 单向，data → types、utils → data+types、store → utils+types、pages → 一切）。

## 5. 新增页面耦合分析

### ScenariosPage（`src/pages/ScenariosPage.tsx` + `ScenariosPage.module.css`）

- **复用既有组件**：**未复用** `ConceptHeader / ConceptSection / TakeawayBox / RelatedConcepts`。页面只展示 scenario 卡片，未深入到 concept 子单元，因此未触发复用需求；但卡片顶 topline、能力域 chip、概念 chip 完全可以与 ConceptPage 的视觉语言共享，目前是自造的 minimal 卡片样式。
- **重复造轮子**：`conceptById` 在本页第 10 行重新构造，与 ScenarioPage / ProfilePage / ConceptPage 重复（见 §4.6 P2）。
- **`.module.css` 是否用 tokens**：**全部用 token**（`var(--color-primary) / var(--content-max-home) / var(--font-mono)` 等），无硬编码颜色，符合"视觉唯一来源"。这是本次新增页面里视觉约定守得最干净的一个文件。
- **耦合结论**：与 store / data / types 的依赖方向正确（pages → data → types；pages → store → utils → data/types），无跨层倒灌；建议后续把卡片视觉与 ConceptCard 抽出共享 Chip / Card 组件，避免 R3 场景继续重复。

### ScenarioPage（`src/pages/ScenarioPage.tsx` + `ScenarioPage.module.css`）

- **复用既有组件**：**未复用** `ConceptHeader / TakeawayBox / RelatedConcepts`。`conceptLink` 函数（11-15 行）直接 `new Map(concepts.map(...))` 后返回 `<Link>`，没有走 `RelatedConcepts` 组件，导致相关知识点链接的视觉与 ConceptPage 不一致（ConceptPage 用带边框的 chip 卡，ScenarioPage 用普通 `<Link>`）。
- **重复造轮子**：同上，`conceptById` 在本页第 15 行重复构造；`trendLabels`、`severityLabels`、`formatMetricValue` 等 helper 也是本页自造（与 ProfilePage `formatScore` 类风格不同）。
- **`.module.css` 是否用 tokens**：**主体用 token**，但有三处状态色硬编码（`#bed8ca / #f1d0a8 / #fff7ea`）与一处 `#fff`（P2，§4.4）。
- **耦合结论**：与 store / data / utils(scenarioSimulation) / types 的依赖方向正确；新增 `useEffect(recordScenarioVisit)` 副作用语义合理；建议下次重写时复用 `RelatedConcepts` 与 `TakeawayBox`，并把 trend/severity 标签提到 utils。

## 6. 修复优先级建议

### 必须立即修的 P0/P1
- **P1-01（Header 面包屑）**：在 `src/components/layout/Header.tsx:16-33` 的 `buildBreadcrumb` 中补 `/scenarios` 与 `/scenarios/:scenarioId` 两个分支，复用 `scenarioExerciseById` 查标题。这是本次改动唯一会导致"新页面体验不一致"的问题。

### 可批量修的 P2
- **P2-01（ScenarioPage 状态色硬编码）**：把 `#bed8ca / #f1d0a8 / #fff7ea` 抽到 `tokens.css`。
- **P2-02（ProfilePage 告警色硬编码）**：把 `#fff5e8 / #9a520f` 与 `ExplanationPanel / OptionCard` 中重复的告警底色抽 token。
- **P2-03（导航一致性）**：统一 BottomNav / Sidebar 的 label 与顺序。
- **P2-04（conceptById / scenarioById 重复构造）**：在 data 层暴露唯一 byId 映射。

### 后续 polish 的 P3
- **P3-01**：HomePage 调用 `getContinueLearningConceptId` 时不要手工拼 progress 对象。
- **P3-02**：`completeScenario` 的"完成即入复盘"语义在注释里写清或拆开。
- **P3-03**：scenario 数据文件 `import ... from './scenarioExercisesR2.ts'` 去掉 `.ts` 扩展名，统一风格。
- **P3-04（已存在）**：动画暗主题色板与全站 `#fff / #1838b8` 渐次 token 化。
- **P3-05（已存在）**：`utils/scenarioSimulation.ts` 883 行接近红旗，建议按职责拆分。
- **P3-06（已存在）**：`utils/progress.ts` 与 `progressCore.ts` 的分工在文件头注释里写清。

## 7. 审计范围与不确定性

### 已实际阅读的文件
- 优先材料：`AGENTS.md`、`docs/architecture.md`、`docs/content-schema.md`、`src/types/index.ts`、`src/app/router.tsx`、`src/store/progressStore.ts`、`src/utils/progressCore.ts`、`src/utils/progress.ts`、`src/styles/tokens.css`、`package.json`。
- 本次改动相关：`src/pages/ScenariosPage.tsx`、`src/pages/ScenariosPage.module.css`、`src/pages/ScenarioPage.tsx`、`src/pages/ScenarioPage.module.css`、`src/components/layout/BottomNav.tsx`、`src/components/layout/Sidebar.tsx`、`src/components/layout/AppShell.tsx`、`src/components/layout/Header.tsx`、`src/pages/HomePage.tsx`、`src/pages/ProfilePage.tsx`（前 100 行）、`src/data/scenarioExercises.ts`（首尾 + 中段）、`src/data/scenarioExercisesR2.ts`、`src/utils/scenarioSimulation.ts`（首 220 行 + 接口定义）。
- 复用候选组件：`src/components/concept/ConceptHeader.tsx`、`TakeawayBox.tsx`、`RelatedConcepts.tsx`。
- 通过 git diff 复核：router、HomePage、ScenarioPage、store、progressCore、types、scenarioExercises。

### 未深入 / 依赖静态阅读
- 未运行 `npm run lint`（任务定向约束只要求 4 条只读校验；静态阅读未发现 ESLint 严重风险信号）。
- 未运行 `npm run build` / `dev` / Electron 打包（任务边界禁止）。
- `src/utils/scenarioSimulation.ts` 第 220–883 行未逐行读，仅看接口与公共函数签名；本报告关于该文件的判断（接近 1000 行红旗）基于 wc 行数 + 已读首段职责分布。
- 未读 `scripts/validate-content.ts` 实现细节，依赖脚本输出做事实依据。
- 动画 CSS 暗主题色板"是否在 design.md 里有定义"未核——`design.md` 不在优先阅读清单内；如 Owner 认为 anim 暗色属于"动画自治视觉"，可降级 P2→P3 或撤销。

### 需 Owner 确认
- 是否同意把 ScenarioPage 状态色 / ProfilePage 告警色 / 动画暗色板统一抽 token（视觉一致性 vs 改动面）。
- 是否同意 Header 面包屑补 `/scenarios` 分支（建议作为 P1 立即修复）。
- 是否同意把 `conceptById / scenarioById` 抽到 data 层（轻微重构 vs 留待 R3）。
- 是否同意 `completeScenario` 的"完成即入复盘"耦合保留 vs 拆开（产品语义）。
