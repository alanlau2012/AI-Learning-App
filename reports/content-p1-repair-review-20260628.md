# P1 内容问题修复与主审复核报告

> 日期：2026-06-28  
> 修复执行：内容生产子 Agent Hypatia  
> 主审复核：Codex 主审 Agent  
> 来源报告：`reports/content-expert-audit-20260628.md`  
> 结论：**P1 已全部关闭**

## 1. 结论

本轮针对内容专业审核报告中的 6 个 P1 问题进行了最小范围修复。修复集中在 3 个数据文件：

- `src/data/decisionGuides.ts`
- `src/data/demoConcepts.ts`
- `src/data/scenarioExercises.ts`

主审复核后判断：6 个 P1 均已关闭，未发现新的 P1/P0 内容风险。

## 2. P1 关闭清单

| 编号 | 原问题 | 修复结果 | 主审状态 |
|---|---|---|---|
| P1-01 | `session-affinity` 决策手册把 Session Affinity 表述为上下文连续性 | 已改为缓存局部性、`shared prefix`、KV Cache、服务端临时状态；明确语义上下文连续由应用层状态保证 | 已关闭 |
| P1-02 | `rag-answer-quality` 把权限过滤放入 `retrievalScope` 可选项 | 新增独立 `safetyBoundary` 控制；baseline 使用 `permissionEnforced`；补越权片段率和权限拒绝可解释率 | 已关闭 |
| P1-03 | `trace` 决策手册“必须还原每一步输入”表述过强 | 已改为输入摘要、引用 id/hash、版本、脱敏参数和决策原因；原文仅白名单采样并受访问控制/保留期约束 | 已关闭 |
| P1-04 | `multi-model-routing` “记录模型版本、输入输出”边界过宽 | 已改为记录路由特征、输入/输出 Token、脱敏摘要或引用 id/hash、反馈、错误码和成本 | 已关闭 |
| P1-05 | `token-cost-spike` “相似租户和任务”缓存分组有隔离风险 | 已改为同一租户内按任务模板、权限边界、版本和 cache key 分组；避免跨租户上下文/KV 状态复用 | 已关闭 |
| P1-06 | 诊断题正确项过长、过完整，存在答案形态泄漏 | 已修 `session-affinity`、`capability-routing`、`cache-system`、`trace`、`observability`、`token-roi` 6 个样本题；正确项不再明显最长，干扰项更接近真实工程误判 | 已关闭 |

## 3. 主审复核要点

### Session Affinity

危险原文已清除：

- `连续请求需要保持上下文状态`
- `切换会破坏缓存和状态连续性`
- `会话连续性更好`
- `能延续上下文状态`

当前口径聚焦 cache locality、可复用缓存域、`shared prefix/cache key`、服务端临时状态，并保留“语义上下文由应用层状态兜底”的边界。

### RAG 权限边界

`permissionFirst` 已不再作为 `retrievalScope` 选项存在。权限过滤现在是独立 `safetyBoundary`，并有反例策略 `auditOnlyPermission` 用于训练“仅审计不拦截”的风险。

新增指标：

- `unauthorizedFragmentRate`
- `permissionDenialExplainability`

新增事件：

- `permission-leakage`

这能把企业 RAG 的权限过滤从“质量策略”提升为“召回前安全边界”。

### Trace 与路由记录

`trace` 决策手册已从“还原输入”改为“摘要 / id / hash / 版本 / 脱敏参数 / 决策原因”。`multi-model-routing` 也不再写“记录输入输出”，而是写“路由特征、Token、脱敏摘要或引用 id/hash、反馈、错误码和成本”。

### 诊断题反作弊

抽查 6 个样本题后，正确选项已从“完整闭环长答案”变为更短的关键动作，干扰项也更像真实但有风险的工程选择。当前仍可后续做全量 P2 级题库平衡，但 P1 级“一眼猜答案”问题已关闭。

## 4. 验证

已运行：

```text
cmd /c npm run validate:content
```

结果：PASS。

已运行：

```text
cmd /c npm run typecheck
```

结果：PASS。

已运行：

```text
git diff --check
```

结果：无空白错误；仅出现 Git 的 CRLF 换行提示。

已做 targeted grep，以下旧风险表述已不存在：

- `连续请求需要保持上下文状态`
- `切换会破坏缓存和状态连续性`
- `会话连续性更好`
- `能延续上下文状态`
- `必须还原每一步输入`
- `记录模型版本、输入输出`
- `相似租户和任务`
- `permissionFirst`
- `拒答率下降不应以事实错误回升`

## 5. 剩余事项

P1 已关闭。仍建议后续处理原审核报告中的 P2/P3：

1. `tool-calling` / `agent-loop` 决策信号阈值。
2. `human-in-the-loop` / `multi-agent` 能力域口径 Owner 定稿。
3. `docs/content-schema.md` 中 ScenarioExercise R1 新旧约束清理。
4. `AGENTS.md` 当前状态快照仍需刷新到 17 条 `decisionGuide`。
5. 全量诊断题可继续做 P2 级选项质量平衡。
