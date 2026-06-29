# Trace 有数据但不可诊断 场景演练审核报告

## 1. 结论先行

- 审核结论：PASS，有条件入库。
- P0 数量：0
- P1 数量：0
- P2 数量：2
- P3 数量：1
- 最大风险：`sensitiveFieldExposureRisk` 与 `traceStorageCostIndex` 是模拟指标，必须明确为本场景内部风险点 / 成本指数，不能被误读为行业 benchmark 或真实价格。
- 入库判断：草稿能区分“可观测设计”和“日志堆积”，事实对象具体，指标可解释，策略项有安全和诊断取舍，事件排查顺序符合企业 AI 应用事故复盘逻辑；未发现 P1 阻断。

## 2. 高风险问题清单

| 级别 | 位置 | 问题类型 | 原始问题 | 风险 | 建议 |
|---|---|---|---|---|---|
| P2 | `content/drafts/scenarios/trace-not-diagnostic.md` / baseline metrics | 指标口径 | `sensitiveFieldExposureRisk` 使用 `risk points`，`traceStorageCostIndex` 使用 `points` | 用户可能误以为这是外部基准或真实风险评分。 | 入库时在 explanation 保留“模拟指标 / 场景内部指数”口径，不引申为行业标准。 |
| P2 | `strategyControls.fieldGranularityMode` 与 `retentionMode` | 工程取舍表达 | `redactedSummary` 的 `diagnosticResolutionRate / mixed / small / absolute 0` | 该选项效果取决于摘要质量和引用对象是否可回放，数值不变但机制差异大。 | 保留 mixed + 0，但 explanation 必须写清“摘要本身不是充分条件，必须有 reference id、版本和错误码”。 |
| P3 | `events.release-regression-unknown` | 入库呈现 | 依赖 `releaseVersion`、`templateVersion`、`evalCaseId`、`strategyVersion` 等关联字段 | 若 UI 只展示指标变化，不展示关联对象，学习价值会下降。 | 主开发合入时确保 facts 或 event 文案能显示“关联对象”这一层，而不是只显示指标。 |

## 3. 逐项审核发现

### [P2] trace-not-diagnostic / baseline.metrics / 模拟指标需避免 benchmark 误读

- 位置：`content/drafts/scenarios/trace-not-diagnostic.md` / 第 4 节 `baseline metrics`
- 原文片段：`sensitiveFieldExposureRisk | 敏感字段暴露风险 | 24 | risk points`；`traceStorageCostIndex | Trace 存储成本指数 | 118 | points`
- 问题类型：表达不严谨
- 为什么有问题：风险点和成本指数适合作为本地模拟指标，但不是公开标准指标，也不对应真实价格或合规评分。
- 可能误导的工程判断：用户可能把 24 或 118 当作可横向比较的行业数值，而不是策略演练中的相对变化。
- 建议修复方向：入库时 explanation 保留“场景内部模拟指数 / 用于比较策略变化”的说明。
- 是否需要人工确认：否

### [P2] trace-not-diagnostic / fieldGranularityMode.redactedSummary / 脱敏摘要不是充分可诊断条件

- 位置：`content/drafts/scenarios/trace-not-diagnostic.md` / `fieldGranularityMode.redactedSummary`
- 原文片段：`diagnosticResolutionRate / mixed / small / absolute 0：摘要质量决定能否复盘`
- 问题类型：工程落地风险
- 为什么有问题：该表达方向正确，但需要避免用户理解为“脱敏摘要就够了”。真实复盘还需要 docId、chunkId、templateVersion、policyDecisionId、错误码和可控回放。
- 可能误导的工程判断：团队只做文本脱敏摘要，仍无法判断检索版本、权限决策或发布回归。
- 建议修复方向：保留该 option，但在策略解释和 reviewRubric 中强调“摘要 + 引用 id / hash / 版本 / 错误码”组合。
- 是否需要人工确认：否

### [P3] trace-not-diagnostic / events.release-regression-unknown / 关联对象需要在 UI 中可见

- 位置：`content/drafts/scenarios/trace-not-diagnostic.md` / `events.release-regression-unknown`
- 原文片段：`feedback 与 Eval、发布版本、策略版本、成本桶和权限事件连起来`
- 问题类型：产品一致性
- 为什么有问题：该事件的训练价值来自跨对象关联，不是单个指标变化；如果入库后页面只展示指标条，用户看不到关键证据链。
- 可能误导的工程判断：把事故归因停留在模型或 prompt，而不追 release / eval / policy / route reason。
- 建议修复方向：主开发合入时在 facts 或 event detail 中保留关联对象字段；如 UI 有 secondary 区，优先展示字段策略和关联对象。
- 是否需要人工确认：否

## 4. 诊断题 / 复盘 Rubric 专项审核

| scenarioId | 是否通过 | 问题 | 建议 |
|---|---|---|---|
| trace-not-diagnostic | 通过 | 未发现答案泄漏。Rubric 要求关键链路 span、父子关系、caseId、版本字段、敏感最小化和跨对象关联，能形成唯一专业诊断方向。 | 保留“不能只建议多打日志”的 requiredFinding；这是本场景的关键反模式拦截。 |

## 5. 企业 AI 工程负责人视角评价

- 架构决策：能训练 Trace 设计从“记录很多”转向“关键路径、字段分级、跨对象关联”。
- 故障诊断：排查顺序真实，先建链路和 caseId，再看字段粒度、版本、权限、Eval 和发布关联。
- 成本 / SLA / 容量权衡：覆盖存储成本、单 case 排查耗时和 30 分钟定位目标。
- 治理 / 安全 / 观测 / 权限：覆盖敏感字段最小化、访问审批、权限决策、policyDecisionId 和受控回放。
- 空泛风险：低。事实对象包含 span 覆盖率、断链率、字段覆盖率、反馈关联率、发布 / Eval 关联率等可复盘信号。

## 6. 可入库条件与字段映射注意

- `type` 映射为 `observability`。
- `difficulty` 映射为 `advanced`；`estimatedMinutes` 映射为 `9`。
- `relatedConceptIds`、`entryConceptIds` 已抽查均存在：`trace`、`observability`、`eval`、`model-gateway`、`permission-governance`、`prompt-context`、`tool-calling`。
- `objectLabels` 按草稿写入：`factsTitle`、`secondaryTitle`、`controlTitle`。
- `facts` 4 组均可入库；attributes 转为 `{ label, value }[]`，risks 转为字符串数组。
- `baseline.selectedStrategies` 必须覆盖 4 个 strategy control：`spanCoverageMode`、`fieldGranularityMode`、`correlationMode`、`retentionMode`。
- 非路由场景的每个 `StrategyOption.routingRules` 写为 `[]`。
- 草稿中的 `metricEffects` 需转为对象：`metricId / direction / magnitude / deltaMode / delta / explanation`；所有 `metricId` 均引用本场景 baseline 指标。
- `events.triggerStrategyOptionIds` 已抽查均指向真实 option id；`events.relatedConceptIds` 已抽查无悬空。
- 入库后必须跑 `cmd /c npm run validate:content`。

## 7. 审核范围与不确定性

- 实际阅读：`AGENTS.md`、`agents/ai-fullstack-content-review-agent.md`、`docs/scenario-exercise-library-prd.md`、`docs/content-schema.md` 场景约束、`src/types/index.ts` 中 `ScenarioExercise` 相关类型、`src/data/scenarioExercises.ts`、本场景草稿。
- 未审核：主控 Agent 正在并行实现的 UI 变更、最终 `src/data/scenarioExercises.ts` 入库代码。
- 不确定性：本报告只审核内容专业性与 schema 映射风险；最终 UI 是否正确展示字段策略和关联对象，需要主开发入库后再做浏览器验证。
