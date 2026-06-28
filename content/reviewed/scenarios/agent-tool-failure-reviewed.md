# Agent 工具调用失败 场景演练审核报告

## 1. 结论先行

- 审核结论：PASS，有条件入库。
- P0 数量：0
- P1 数量：0
- P2 数量：2
- P3 数量：1
- 最大风险：`humanHandoffRate`、`operationMinPrivilege`、`humanHandoffForWriteFailure` 这类安全取舍容易被 UI 趋势色误读为纯负向策略，需要在解释里保留“稳定性 / 安全性换人工成本”的口径。
- 入库判断：草稿具备生产症状、可解释指标、强干扰策略、触发事件、排查顺序和真实关联知识点；未发现事实对象空泛、指标不可解释、诊断泄漏答案、策略项无工程取舍或关联知识点悬空。

## 2. 高风险问题清单

| 级别 | 位置 | 问题类型 | 原始问题 | 风险 | 建议 |
|---|---|---|---|---|---|
| P2 | `content/drafts/scenarios/agent-tool-failure.md` / baseline metrics / `humanHandoffRate` | 指标口径 | `humanHandoffRate` 标为 `lowerIsBetter` | 人工接管在高风险写失败、权限不清、审批证据缺失时是必要安全阀，过低也可能代表系统越权闭环。 | 入库时保留 `lowerIsBetter` 作为成本指标，但在 explanation 和相关策略说明中明确“升高可能是安全换成本，不等于策略错误”。 |
| P2 | `strategyControls.permissionMode` 与 `failureHandlingMode` | 工程取舍表达 | `operationMinPrivilege`、`humanHandoffForWriteFailure` 会提高人工接管率 | 通用 delta UI 若只按指标红绿展示，可能误导用户选择表面成功率更高的 `agentSharedPermission` 或 `retryAll`。 | 事件和复盘文案中强调安全、幂等、审批证据优先级高于表面成功率。 |
| P3 | `events.retry-duplicate-side-effect` | 触发呈现 | 触发条件为 `retryAll + highRiskSecondConfirm` | 该组合表达“二次确认不能替代幂等与状态管理”，逻辑正确，但用户可能疑惑为什么用了二次确认仍触发事故。 | 入库时在 `correctDiagnosis` 或 `missedRisks` 保留“确认机制不能替代幂等与状态查询”的句子。 |

## 3. 逐项审核发现

### [P2] agent-tool-failure / baseline.metrics.humanHandoffRate / 人工接管率不是单向坏指标

- 位置：`content/drafts/scenarios/agent-tool-failure.md` / 第 4 节 `baseline metrics`
- 原文片段：`humanHandoffRate | 人工接管率 | 14.5 | % | lowerIsBetter`
- 问题类型：表达不严谨 / 工程落地风险
- 为什么有问题：人工接管率过高代表自动化质量或治理成本问题，但在高风险写操作、权限不清、审批证据缺失、未知状态写失败时，人工接管是正确安全阀。
- 可能误导的工程判断：用户可能把“降低人工接管率”当作第一目标，反而倾向 Agent 统一权限、失败即重试或弱化二次确认。
- 建议修复方向：入库可保留 `polarity: 'lowerIsBetter'`，但 explanation 必须写清“低接管率不等于安全，关键看高风险样本是否被正确升级”。
- 是否需要人工确认：否

### [P2] agent-tool-failure / strategyControls / 安全策略的负向指标需要解释为取舍

- 位置：`content/drafts/scenarios/agent-tool-failure.md` / `permissionMode.operationMinPrivilege`、`failureHandlingMode.humanHandoffForWriteFailure`
- 原文片段：`humanHandoffRate / up / medium`、`humanHandoffRate / up / large`
- 问题类型：产品一致性 / 工程取舍表达
- 为什么有问题：这些策略提高人工接管率是预期结果，不是策略失败。场景训练目标应让用户理解“表面成功率、人工成本、越权风险、重复副作用”之间的取舍。
- 可能误导的工程判断：把 `agentSharedPermission` 的成功率小幅上升误判为好策略，忽略 blast radius 和审计主体问题。
- 建议修复方向：主开发合入时在 `metricEffects.explanation`、事件复盘和风险信号中保留“安全性换人工成本”的表述。
- 是否需要人工确认：否

### [P3] agent-tool-failure / events.retry-duplicate-side-effect / 触发组合需要避免误读

- 位置：`content/drafts/scenarios/agent-tool-failure.md` / `events.retry-duplicate-side-effect`
- 原文片段：`触发条件：retryAll + highRiskSecondConfirm`
- 问题类型：表达一致性
- 为什么有问题：二次确认是正向治理动作，但与无分类重试组合后仍可能产生重复副作用。该反直觉点有学习价值，但需要解释清楚。
- 可能误导的工程判断：用户可能以为“只要二次确认就可以安全重试写操作”。
- 建议修复方向：保留该事件；入库时确保 `correctDiagnosis` 明确“确认机制不能替代幂等键、状态查询和错误分类”。
- 是否需要人工确认：否

## 4. 诊断题 / 复盘 Rubric 专项审核

| scenarioId | 是否通过 | 问题 | 建议 |
|---|---|---|---|
| agent-tool-failure | 通过 | 未发现答案长度、语气或结构泄漏。Rubric 要求失败分型、写工具安全边界、不可幂等重试、Trace 字段，能支撑唯一专业方向。 | 保留当前 requiredFindings；不要在 UI 默认选项或事件标题中提前暴露“正确策略组合”。 |

## 5. 企业 AI 工程负责人视角评价

- 架构决策：能训练工具协议、参数校验、权限主体、状态管理、重试和人工接管的组合判断。
- 故障诊断：排查顺序真实，先分型，再看 Trace、工具协议、参数、权限、幂等和状态。
- 成本 / SLA / 容量权衡：覆盖任务步数和人工接管成本；不强行引入无关 MaaS 指标。
- 治理 / 安全 / 观测 / 权限：覆盖高风险写工具、用户委托权限、操作级最小权限、审批证据、幂等键和 Trace 字段。
- 空泛风险：低。事实对象和指标足够具体，策略项有明确工程代价。

## 6. 可入库条件与字段映射注意

- `type` 映射为 `agentTooling`。
- `difficulty` 映射为 `advanced`；`estimatedMinutes` 映射为 `9`。
- `relatedConceptIds`、`entryConceptIds` 已抽查均存在：`tool-calling`、`agent-loop`、`permission-governance`、`trace`、`human-in-the-loop`、`observability`、`eval`。
- `objectLabels` 按草稿写入：`factsTitle`、`secondaryTitle`、`controlTitle`。
- `facts` 4 组均可入库；attributes 转为 `{ label, value }[]`，risks 转为字符串数组。
- `baseline.selectedStrategies` 必须覆盖 4 个 strategy control：`toolDescriptionMode`、`parameterValidationMode`、`permissionMode`、`failureHandlingMode`。
- 非路由场景的每个 `StrategyOption.routingRules` 写为 `[]`。
- 草稿中的 `metricEffects` 需转为对象：`metricId / direction / magnitude / deltaMode / delta / explanation`；所有 `metricId` 均引用本场景 baseline 指标。
- `events.triggerStrategyOptionIds` 已抽查均指向真实 option id；`events.relatedConceptIds` 已抽查无悬空。
- 入库后必须跑 `cmd /c npm run validate:content`。

## 7. 审核范围与不确定性

- 实际阅读：`AGENTS.md`、`agents/ai-fullstack-content-review-agent.md`、`docs/scenario-exercise-library-prd.md`、`docs/content-schema.md` 场景约束、`src/types/index.ts` 中 `ScenarioExercise` 相关类型、`src/data/scenarioExercises.ts`、本场景草稿。
- 未审核：主控 Agent 正在并行实现的 UI 变更、最终 `src/data/scenarioExercises.ts` 入库代码。
- 不确定性：本报告只审核内容专业性与 schema 映射风险；最终 UI 是否正确展示安全取舍，需要主开发入库后再做浏览器验证。
