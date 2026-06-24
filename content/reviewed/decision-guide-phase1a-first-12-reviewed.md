> task: REVIEW-01 / REVIEW-02 / REVIEW-03
> source_draft: content/drafts/decision-guide-phase1a-first-12.md
> source_spec: docs/ai-engineering-leader-enhancement-p0-specs.md#1-spec-01decisionguide-内容标准
> status: reviewed
> verdict: pass
> covered_concepts: multi-model-routing, cost-routing, capability-routing, kv-cache, session-affinity, cache-system, token-roi, prompt-context, context-window, context-compression, tool-calling, agent-loop

# Phase 1A decisionGuide 审核稿：首批 12 讲

## 审核结论

12 个 Phase 1A `decisionGuide` 均通过 SPEC-01 内容标准。未发现需要退回项。

| conceptId | verdict | 关键工程判断点 |
|---|---|---|
| multi-model-routing | pass | 路由必须绑定任务分布、模型基线和误选回滚，而不是按供应商或主观偏好切换。 |
| cost-routing | pass | 成本路由必须同时看质量、投诉、重试和人工返工，不能只看模型单价。 |
| capability-routing | pass | 能力标签和模型能力基线是路由准入前置条件。 |
| kv-cache | pass | KV Cache 收益取决于 Prefill 占比、命中率和 Session 亲和协同。 |
| session-affinity | pass | 亲和策略必须平衡缓存命中、热点实例和故障迁移。 |
| cache-system | pass | 缓存 key 必须包含租户、权限、版本和新鲜度边界。 |
| token-roi | pass | ROI 需要业务收益归因，不能把 Token 消耗直接等同浪费。 |
| prompt-context | pass | Prompt/Context 的负责人判断核心是材料可信度、指令层级和敏感信息边界。 |
| context-window | pass | 扩窗必须和检索、压缩、分段方案比较，不能把窗口大小当质量保证。 |
| context-compression | pass | 压缩必须有保真规则和失败回放，否则会污染后续上下文。 |
| tool-calling | pass | 工具调用的上线门槛是 schema、权限、副作用、幂等和审计。 |
| agent-loop | pass | Agent Loop 必须有步数预算、终止条件、权限门和人工接管。 |

## 入库注意

- 通过版本只包含 SPEC-01 推荐的 `decisionGuide` 字段集合：`applicableScenarios`、`nonApplicableScenarios`、`decisionSignals`、`tradeoffs`、`reviewQuestions`、`implementationChecklist`、`executiveExplanation`。
- 后续 DEV-01 合入时不得把本文件的审核表、任务元数据或说明文字写入 `src/data/*`。
- `REVIEW-03` 在本轮仅审核 Phase 1A 首批第 12 讲 `agent-loop`；`multi-agent`、`eval`、`observability`、`trace`、`permission-governance` 属于后续扩展候选，不应在本轮标为已审核。

## 通过版本索引

通过版本以 [content/drafts/decision-guide-phase1a-first-12.md](../drafts/decision-guide-phase1a-first-12.md) 中对应概念的七个 schema 字段为准。该草稿已经按本审核结论清理为空泛项为 0、退回项为 0 的 Implementation 输入。
