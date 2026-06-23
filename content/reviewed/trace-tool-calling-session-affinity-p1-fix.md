# Trace / Tool Calling / Session Affinity P1 内容修复审核

日期：2026-06-23
结论：PASS

## 审核范围

- GitHub issue #3：Trace / Tool Calling 缺少敏感数据最小化边界。
- GitHub issue #4：Session 亲和误导性绑定上下文连续性与 KV / Prefix Cache 复用。
- 影响课程：`trace`、`tool-calling`、`observability`、`session-affinity`。

## 门禁判定

1. 诊断题门禁：PASS。`trace` 与 `session-affinity` 的正确项仍保持原答案位置，但解释和排查路径新增治理前提，不改变全量题库结构。
2. 结构门禁：PASS。仅替换已有字段内容，不新增 schema 字段，不改 concept id、module、order、relatedConceptIds。
3. 企业案例门禁：PASS。案例保留原有规模 / 指标 / 系统边界，并补入敏感数据治理、cache key / prefix 前提。
4. 动画门禁：PASS。仅改 `animation.steps[].description` 文案，不改 animation type、step id、highlightTargets 或 registry。
5. schema 门禁：PASS。无 schema 外字段；不改 `docs/content-schema.md`；可由主开发按同字段整体替换入库。

## 合入注意事项

- `trace` 中不得再出现“记录每一步输入输出”“异常请求全量采样”这类无边界说法，应使用“结构化 span、脱敏摘要、高覆盖采样、访问控制、保留期、租户隔离”。
- `tool-calling` 中不得再出现“所有调用参数进入 trace”，应改为“安全字段、参数 schema、审批 id、影响范围、脱敏参数摘要、工具版本进入 trace”。
- `session-affinity` 中不得再把上下文连续性归因于 sticky routing；上下文连续性来自应用层显式消息历史、任务状态、memory 与工具结果。
- `observability` 只做轻量口径修正：trace 是下钻链路之一，不是唯一底座。

## 放行

允许主开发合入 `src/data/demoConcepts.ts`，合入后必须运行：

- `npm run validate:content`
- `npm run typecheck`
