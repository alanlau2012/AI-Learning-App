# Phase 1 QA 验收清单

> 日期：2026-06-24  
> 范围：AI 工程负责人增强 Phase 1（决策手册 + Profile 能力概览 + Search 能力域过滤）  
> 产物类型：验收方案 / 执行清单。本文不代表已完成 QA-01。  
> 修改边界：本报告不要求修改 `src/*`；执行 QA 时只记录结果与证据。

## 1. 验收依据

- PRD：`docs/ai-engineering-leader-enhancement-prd.md`
  - Phase 1 目标：证明“课程内容能变成决策工具”。
  - 范围：12 个重点知识点补“工程决策”章节；Profile 增加 7 个能力域完成度；Search 支持能力域过滤。
  - 验收：用户能从首页或 Profile 快速进入待复盘知识点；知识点详情页能复制评审问题或落地清单。
- Tasks：`docs/ai-engineering-leader-enhancement-tasks.md`
  - `DEV-02`：知识点详情页展示“工程决策”章节，支持复制评审清单，空数据不显示空壳。
  - `DEV-03`：Profile 展示 7 个能力域完成度、角色路径完成度和一个“下一步行动”。
  - `DEV-04`：Search 支持能力域过滤，结果展示命中的能力域，搜索逻辑能匹配 decisionGuide 文本。
  - `QA-01`：运行 `validate:content`、`typecheck`、`lint`、`build`；抽查至少 3 个有决策手册的知识点；抽查 Profile、Search 的移动端和桌面端。
- SPEC：`docs/ai-engineering-leader-enhancement-p0-specs.md`
  - `decisionGuide` 必须包含：`applicableScenarios`、`nonApplicableScenarios`、`decisionSignals`、`tradeoffs`、`reviewQuestions`、`implementationChecklist`、`executiveExplanation`。
  - Phase 1 交互：支持复制 `reviewQuestions` 与 `implementationChecklist`；不做 Markdown 导出。
  - 能力域为 7 个枚举，Profile / Search / Glossary 共享枚举，不各自维护中文字符串常量。
- 当前进度：`docs/ai-engineering-leader-enhancement-progress.md`
  - `SCHEMA-01`、`SCHEMA-02`、`DEV-01` 已完成。
  - `DEV-02`、`DEV-03`、`DEV-04` 仍为待启动。执行 QA-01 前必须确认三项已完成，否则只能出 blocker 报告。

## 2. 准入条件

QA-01 开始前必须确认：

- [ ] `docs/ai-engineering-leader-enhancement-progress.md` 中 `DEV-02`、`DEV-03`、`DEV-04` 均已标为 `done`，且列出对应验证记录。
- [ ] `content/reviewed/decision-guide-phase1a-first-12-reviewed.md` 仍为 12 / 12 pass，且没有新退回项。
- [ ] `src/data/decisionGuides.ts` 中至少存在 12 个正式 `decisionGuide`，并通过 `src/data/concepts.ts` 合并到正式 concepts 导出。
- [ ] QA 执行前记录 `git status --short --branch` 与 `git log --oneline --decorate -5`。
- [ ] 若工作区存在无关未跟踪文件，只记录但不纳入 QA 结论。

阻断条件：

- [ ] 任一 `DEV-02/03/04` 未完成时，不得将 QA-01 判为 pass。
- [ ] 任一工程门禁失败时，不得继续给出“Phase 1 可验收”结论。
- [ ] 浏览器手工抽查未覆盖桌面和移动视口时，不得判定 UI 验收完成。

## 3. 工程门禁

在 Windows / PowerShell 中建议使用 `cmd /c` 包一层执行 npm script，避免 shell 兼容性噪音影响判断。

| 步骤 | 命令 | 必须通过的信号 | 失败处理 |
|---|---|---|---|
| 1 | `cmd /c npm run validate:content` | 56 讲结构、published 内容、animation、terminology、Phase 1 `decisionGuide` / `capabilityDomains` / `rolePaths` 均通过 | 记录失败段落；停止 QA |
| 2 | `cmd /c npm run typecheck` | TypeScript 0 error | 记录首个 TS 错误文件与行号；停止 QA |
| 3 | `cmd /c npm run lint` | ESLint 无 error | 记录 error；warning 可列为风险但不阻断，除非规则配置为失败 |
| 4 | `cmd /c npm run build` | Web 生产构建成功，dist 产物生成 | 记录构建失败日志；停止 QA |

补充记录：

- [ ] 若本阶段同时触达 Electron 发行体验，再额外运行 `cmd /c npm run build:desktop` 与 `cmd /c npm run smoke:desktop`，但这不是 QA-01 的默认阻断项。
- [ ] 每条命令记录开始时间、结束时间、exit code、关键输出摘要。

## 4. 浏览器环境

建议执行两轮：

| 轮次 | 目标 | 建议方式 |
|---|---|---|
| Dev server | 验证真实交互与 HMR 环境页面 | `cmd /c npm run dev -- --host 127.0.0.1`，访问 Vite 输出端口 |
| Production preview | 验证 build 产物路由和静态资源 | `cmd /c npm run build` 后 `cmd /c npm run preview -- --host 127.0.0.1` |

视口矩阵：

| 类型 | 尺寸 | 必测页面 |
|---|---:|---|
| Desktop wide | 1440 x 900 | `/`、3 个知识点详情、`/profile`、`/search` |
| Desktop compact | 1280 x 720 | 3 个知识点详情、`/profile`、`/search` |
| Mobile primary | 390 x 844 | `/`、3 个知识点详情、`/profile`、`/search` |
| Mobile narrow | 375 x 812 | 3 个知识点详情、`/profile`、`/search` |

通用检查：

- [ ] 每个页面加载后无 console error。
- [ ] 每次点击、复制、筛选、清空记录后再次检查 console error。
- [ ] 移动端无页面级横向滚动。
- [ ] 文本、按钮、筛选控件、复制按钮不互相遮挡。
- [ ] 浏览器 back / forward 后页面状态合理，不出现白屏或错误路由。

## 5. 决策手册知识点抽查

从 12 个已入库 decisionGuide 中至少抽查 3 个。建议覆盖不同模块与不同负责人场景：

| 抽查项 | 路由 | 覆盖理由 |
|---|---|---|
| 多模型路由 | `/concepts/multi-model-routing` | 平台取舍、成本/质量/SLA 组合决策 |
| KV Cache | `/concepts/kv-cache` | 推理性能、缓存命中、Session 亲和等工程信号 |
| 工具调用 | `/concepts/tool-calling` | Agent 执行边界、权限、审计与安全风险 |

每个知识点执行同一套检查：

- [ ] 页面存在“工程决策”章节。
- [ ] “工程决策”章节位于“企业案例”之后、“常见误区”之前。
- [ ] 展示完整字段：适用场景、不适用场景、决策信号、架构取舍、评审问题、落地清单、管理层解释。
- [ ] `reviewQuestions` 至少 3 条，问题能直接用于方案评审。
- [ ] `implementationChecklist` 至少 3 条，并覆盖至少两个阶段。
- [ ] 决策信号包含可验证的指标、约束、日志、Trace、评测集、权限或运行期证据，不是空泛建议。
- [ ] 点击“复制评审问题”后，剪贴板内容包含本讲评审问题，且无重复、乱码、HTML 标签。
- [ ] 点击“复制落地清单”后，剪贴板内容包含检查项和通过信号，且无重复、乱码、HTML 标签。
- [ ] 在移动端复制按钮可点击，按钮文本不溢出，列表不横向撑开页面。
- [ ] 完成/收藏/诊断题交互仍正常，不因新增章节回归。

负向抽查：

- [ ] 打开一个无 decisionGuide 的知识点，例如 `/concepts/token` 或其他未在 12 个列表内的知识点。
- [ ] 页面不显示空的“工程决策”标题、空卡片或占位错误文案。
- [ ] 搜索或相关知识点跳转到该页时同样不出现空壳。

12 个 Phase 1A decisionGuide 覆盖清单：

- [ ] `multi-model-routing`
- [ ] `cost-routing`
- [ ] `capability-routing`
- [ ] `kv-cache`
- [ ] `session-affinity`
- [ ] `cache-system`
- [ ] `token-roi`
- [ ] `prompt-context`
- [ ] `context-window`
- [ ] `context-compression`
- [ ] `tool-calling`
- [ ] `agent-loop`

## 6. Profile 验收

入口：

- [ ] 首页“查看我的学习”或等价入口可进入 `/profile`。
- [ ] 顶部 / 侧边 / 底部导航在桌面和移动端均可进入 `/profile`。

能力域：

- [ ] Profile 展示 7 个能力域完成度。
- [ ] 能力域中文标签来自共享枚举/映射，不在页面中另维护一套硬编码字符串。
- [ ] 完成度基于 `capabilityDomains` 数据映射和学习状态计算，不硬编码每个能力域讲数。
- [ ] 至少抽查 2 个能力域：完成一个对应知识点后，Profile 进度能变化；清空记录后进度归零或回到冷启动状态。
- [ ] 若诊断题表现进入计分，错题记录会影响对应能力域表现；若 Phase 1 暂用估算，页面文案必须说明估算边界。

角色路径：

- [ ] 展示 4 条角色路径：AI 工程负责人、平台工程师、应用架构师、治理负责人。
- [ ] 每条路径来自 `rolePaths` 数据配置。
- [ ] 每条路径显示推荐讲次、阶段或完成度。
- [ ] 点击路径中的知识点能进入正确详情页。

下一步行动：

- [ ] 页面给出一个清晰的“下一步行动”。
- [ ] 下一步行动至少考虑未完成、错题、收藏中的两类信号，或明确说明当前 Phase 1 的简化逻辑。
- [ ] 点击下一步行动可以进入对应知识点。

视觉与回归：

- [ ] Profile 不变成拥挤 dashboard，第一屏仍保留学习驾驶舱的重点信息。
- [ ] 原有总进度、模块进度、最近学习、收藏、错题、清空记录不回归。
- [ ] 移动端为单列或清晰分组，无横向滚动、文字截断、卡片套卡片堆叠感。

## 7. Search 验收

入口：

- [ ] `/search` 可直接访问。
- [ ] Header 搜索入口、快捷键或导航入口仍能进入 Search。

能力域过滤：

- [ ] Search 页面展示 7 个能力域筛选项。
- [ ] 能力域筛选项标签来自共享枚举/映射。
- [ ] 选择单个能力域后，结果只包含该能力域 primary 或 secondary 命中的知识点。
- [ ] 清除筛选后恢复未筛选结果。
- [ ] 能力域过滤可组合关键词搜索。
- [ ] 筛选和关键词组合为空时，空结果状态清晰，不误导为加载失败。

搜索命中：

- [ ] 标题命中排序仍优先，例如搜索 `KV Cache` 返回 KV Cache 靠前。
- [ ] 标签命中仍可用，例如搜索 `SLA` 或 `MaaS` 返回相关知识点。
- [ ] 正文命中仍可用，不因能力域过滤破坏既有排序。
- [ ] decisionGuide 文本可命中，例如搜索 `路由误选`、`缓存命中`、`权限边界` 应能返回对应决策手册知识点。
- [ ] 搜索结果展示命中的能力域，且不会用不一致的中文标签。
- [ ] 点击结果进入正确知识点详情页。

移动端：

- [ ] 筛选控件可横向滚动或换行，但不得造成页面横向溢出。
- [ ] 输入框、筛选项、结果卡片在 375px 宽度可读可点。
- [ ] 清空关键词和清除筛选操作可达。

## 8. 首页与跨页路径

Phase 1 PRD 要求用户能从首页或 Profile 快速进入待复盘知识点。检查：

- [ ] 首页存在继续学习、推荐路径或待复盘入口，且能进入有 decisionGuide 的知识点。
- [ ] Profile 的下一步行动能进入待复盘知识点。
- [ ] 从知识点详情返回模块页、再回到 Profile/Search，不丢失已完成、收藏、错题等本地状态。
- [ ] LocalStorage key 仍为 `ai-learning-app-progress-v1`，既有进度不因 Phase 1 扩展被破坏。

## 9. 证据记录模板

执行 QA 时在最终 QA report 中记录：

| 类型 | 必填证据 |
|---|---|
| 工程门禁 | 命令、exit code、关键输出摘要、时间 |
| 决策手册抽查 | 每个知识点桌面截图、移动截图、复制结果摘要 |
| Profile | 桌面截图、移动截图、一次完成/清空记录前后对比 |
| Search | 桌面截图、移动截图、关键词 + 能力域组合的结果截图 |
| Console | 每个页面和关键交互后的 console error 统计 |
| 视口 | 使用的 viewport 尺寸与截图路径 |

建议截图命名：

- `phase1-concept-multi-model-routing-desktop.png`
- `phase1-concept-kv-cache-mobile.png`
- `phase1-concept-tool-calling-copy-checklist.png`
- `phase1-profile-desktop.png`
- `phase1-profile-mobile.png`
- `phase1-search-domain-filter-desktop.png`
- `phase1-search-domain-filter-mobile.png`

## 10. 通过 / 失败判定

QA-01 可判定 pass 需要同时满足：

- [ ] 四个工程门禁全部通过：`validate:content`、`typecheck`、`lint`、`build`。
- [ ] 3 个 decisionGuide 知识点抽查全部通过。
- [ ] 至少 1 个无 decisionGuide 知识点负向抽查通过。
- [ ] Profile 桌面和移动视口全部通过。
- [ ] Search 桌面和移动视口全部通过。
- [ ] 首页或 Profile 至少一个入口可快速进入待复盘知识点。
- [ ] 全流程无阻断级 console error。
- [ ] QA report 写明执行环境、commit、命令结果、截图路径、残余风险。

失败分级：

- **Blocker**：工程门禁失败、页面白屏、核心路由不可达、移动端无法操作、copy 功能不可用。
- **High**：决策章节字段缺失、能力域计算错误、Search 过滤结果错误、Profile 下一步行动不可点击。
- **Medium**：排序明显退化、空状态不清晰、文案与规格口径不一致、局部布局溢出但不阻断操作。
- **Low**：轻微视觉间距、非核心文案可读性、截图命名或报告记录不完整。

## 11. 当前已知前置状态

截至本清单创建时：

- `main` 本地比 `origin/main` ahead 2。
- 工作区存在未跟踪 `bug 列表.md` 与 `output/`，与本报告无关，QA 执行时应记录但不要自动清理。
- `docs/ai-engineering-leader-enhancement-progress.md` 显示 `DEV-02`、`DEV-03`、`DEV-04` 尚未完成，因此此刻不能执行并通过 QA-01，只能用本文作为后续验收方案。
- `package.json` 已提供 QA-01 要求的四个门禁命令：`validate:content`、`typecheck`、`lint`、`build`。
