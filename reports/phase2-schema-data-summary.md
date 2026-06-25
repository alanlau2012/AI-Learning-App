# Phase 2 Schema/Data Summary: model-router 场景演练

> 日期：2026-06-25
> 范围：SCHEMA-03 / DATA-06 / DEV-05 最小闭环
> 结论：PASS

## 实现范围

本轮完成 `model-router` 独立场景演练的数据 schema、正式本地数据入库与内容校验，不实现 DEV-06 模拟计算逻辑，不实现 DEV-07/08 场景 UI / 复盘 UI，不修改 ConceptPage / Profile / Search / progressStore。

## 修改文件

| 文件 | 说明 |
|---|---|
| `docs/content-schema.md` | 新增 `ScenarioExercise` 权威接口、Phase 2 字段约束与 `validate:structure` 场景校验口径。 |
| `src/types/index.ts` | 新增场景演练相关 TypeScript 类型：请求、模型池、策略、指标、事件、复盘 rubric。 |
| `src/data/scenarioExercises.ts` | 新增 `model-router` 正式本地场景数据与 `scenarioExerciseById` 索引。 |
| `scripts/validate-content.ts` | 接入 `scenarioExercises` 校验：场景 id 唯一、`model-router` 必须存在、核心 Concept 关联存在、请求/模型/策略/指标数量下限、内部引用与关键字段非空。 |
| `reports/phase2-schema-data-summary.md` | 本报告。 |

## model-router 数据覆盖

| 项 | 覆盖 |
|---|---|
| 关联知识点 | `multi-model-routing`、`cost-routing`、`capability-routing` |
| 请求类型 | `simpleQa`、`longSummary`、`codeGeneration`、`complianceHighRisk` |
| 模型池 | `fast-general`、`strong-reasoning`、`economy-small`、`restricted-compliance` |
| 可调策略项 | `taskRoutingMode`、`riskRoutingMode`、`contextSlaMode`、`fallbackMode` |
| baseline 指标 | `costPer1kRequests`、`p95LatencyMs`、`successRate`、`escalationRate`、`riskInterceptRate`、`qualityComplaintRate` |
| 异常事件 | `costDownComplaintsUp`、`slaBreach`、`riskLeak`、`overBlocking` |
| 复盘结构 | 每个事件包含 `correctDiagnosis`、`investigationOrder`、`missedRisks`、`relatedConceptIds`、`nextStepRecommendations`；场景含 `reviewRubric`。 |

## 验证结果

| 命令 | 结果 |
|---|---|
| `cmd /c npm run validate:content` | PASS |
| `cmd /c npm run typecheck` | PASS |
| `cmd /c npm run lint` | PASS |

## 未做事项

- 未实现 DEV-06：策略输入到指标输出的纯函数模拟计算。
- 未实现 DEV-07/08：场景画布 UI、提交诊断后的复盘面板与跳转入口。
- 未扩展 `progressStore.ts`；场景完成状态仍等待 DEV-08 阶段决策。
- 未修改 `docs/ai-engineering-leader-enhancement-progress.md` 任务状态；由主控统一更新。

## 风险与建议

- 当前指标为 baseline 静态数据与策略影响解释，尚未有可执行计算函数；DEV-06 需要把 `metricEffects` 和请求/模型权重转成纯函数输出。
- 当前场景数据尚未被 UI 消费；DEV-07/08 接入时应继续从 `src/data/scenarioExercises.ts` 读取，避免在组件中复制策略文案或指标解释。
- `model-router` 已作为独立场景类型落库，后续不要把它回塞到 `animation.type` 或动画 registry 里。

## 状态建议

建议主控将：

- `SCHEMA-03` 更新为 `done`。
- `DATA-06` 更新为 `done`。
- `DEV-05` 更新为 `done`。

建议下一步进入 `DEV-06`：实现本地纯函数模拟计算，并为默认均衡、成本优先、质量优先、SLA / 风险优先四类策略组合补测试。
