# 场景演练库 R0+R1 Summary

日期：2026-06-27

## 范围

本轮仅完成 R0+R1 最小闭环，未实现 R2/R3。

- R0：落地 ScenarioExercise schema v2 最小扩展，新增 `content/drafts/scenarios/_template.md` 与 `content/reviewed/scenarios/.gitkeep`。
- R1：上线两个 P0 场景：`token-cost-spike`、`rag-answer-quality`。
- 保留 `model-router` 既有物理模拟器；新增非路由场景 `genericDelta` 路径。
- 泛化 ScenarioPage 的事实对象、secondary 区和策略标题。
- ConceptPage 支持从 entry/related 知识点进入场景；Search 支持意图词命中场景。

未做：`/scenarios` 目录页、`reviewScenarioIds`、Profile 场景推荐、桌面发行、R2/R3 新场景。

## Schema 与校验

- `ScenarioMetric.id` 已放宽为 string。
- 新增 `type`、`capabilityDomains`、`initialSymptom`、`objectLabels.secondaryTitle`、`facts`。
- `requestTypes/modelPool` 仅 `type === 'modelRouting'` 强制；非路由场景要求 `facts` 和 `baseline.metrics`。
- `MetricEffect` 支持 `deltaMode/delta`，非路由场景参与指标计算。
- Validator 校验 `metricEffects.metricId`、`triggerStrategyOptionIds`、`events[].relatedConceptIds` 悬空引用。

## 验证

命令门禁：

- `cmd /c npm run validate:content` PASS
- `cmd /c npm run typecheck` PASS
- `cmd /c npm run lint` PASS
- `cmd /c npm run build` PASS

浏览器 smoke（Browser plugin，127.0.0.1:5173）：

- PASS：`/concepts/token-roi` -> `token-cost-spike` -> 点击「全量历史」「单一强模型」-> 提交诊断 -> 复盘结论可见。
- PASS：`/search` 搜索「RAG 答案差」-> `rag-answer-quality` -> 点击「高召回宽口径」「TopK 原样拼接」-> 提交诊断 -> 复盘结论可见。
- 控制台：两轮 smoke 均无 error/warn。
- 截图证据：smoke 过程中已捕获 token 场景与 RAG 场景视口截图用于确认非空页面和复盘状态。

## 残余风险

- R1 的 `genericDelta` 是解释性量级模型，不代表真实 RAG 检索或成本账单物理模型。
- Search 场景结果为轻量聚合，未做复杂排序去重或 `/scenarios` 目录页筛选。
- 本轮未接入 Profile 场景完成状态，也未新增 `reviewScenarioIds`。
- 浏览器 smoke 覆盖桌面主流程；移动端专项回归留给 R2 或单独 QA。