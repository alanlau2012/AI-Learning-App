# Trace / Tool Calling / Session Affinity P1 内容修复草稿

日期：2026-06-23
关联 issue：
- https://github.com/alanlau2012/AI-Learning-App/issues/3
- https://github.com/alanlau2012/AI-Learning-App/issues/4

## 修复目标

本草稿用于修正两个 P1 内容问题：

1. `trace` / `tool-calling` 不再鼓励原文输入、输出、工具参数无边界进入 trace，改为同时讲清可追溯性与敏感数据最小化。
2. `session-affinity` 不再把 sticky routing 写成上下文连续性的来源，改为 cache/state locality 策略，并明确上下文连续性来自应用层显式状态。

## 入库字段修订方向

### session-affinity

- `definition`：定义为把同一会话或共享前缀请求尽量路由到可复用缓存域 / 服务端状态域的策略，用于提升 cache locality；不是上下文连续性的来源。
- `whyItMatters`：平台侧关注 KV Cache 命中率、会话迁移率、可复用前缀比例、cache key 一致性、P99 TTFT、故障切换和租户隔离。
- `mentalModel`：同一柜台只能减少重复翻材料；案卷正文仍要由应用层携带或保存。
- `mechanism`：补充应用层消息历史、任务状态、memory、工具结果才决定上下文连续；KV/prefix cache 复用要求 shared prefix、同模型 / schema / cache key、未过期、服务实现支持。
- `diagnosticQuestion`：正确项仍为 b，但选项、解析和排查路径必须先确认是否存在可复用 shared prefix / session cache 机制。
- `keyTakeaways`：强调亲和是缓存局部性优化，不是记忆机制。

### tool-calling

- `enterpriseCase.solution`：把“所有调用参数进入 trace”改为安全字段、参数 schema、审批 id、影响范围、脱敏参数摘要和工具版本进入 trace。
- `pitfalls`：把“不记录工具调用参数”改为“不记录可审计摘要和审批证据”，避免暗示原始敏感参数必须全量记录。
- `diagnosticQuestion`：选项、解析、排查路径补入最小化、脱敏、访问控制。

### trace

- `definition` / `mentalModel`：trace 是结构化链路证据，不是原文日志仓库。
- `mechanism`：span 记录 trace id、span id、阶段、耗时、模型 / 工具版本、错误码、权限上下文、脱敏摘要、引用 id / hash；敏感原文按策略禁采、脱敏、采样、限权和限期保存。
- `animation.steps`：提示、上下文、工具、子 Agent、输出均改为脱敏摘要 / 引用 id / 质量信号。
- `enterpriseCase.solution`：异常请求高覆盖采样时仍必须经过脱敏、保留期、访问控制和租户隔离。
- `diagnosticQuestion`：正确项明确“结构化 span + 脱敏摘要 + 异常高覆盖采样 + 保留期 / 访问控制”。
- `keyTakeaways`：加入数据最小化和访问治理。

### observability

- 轻量修正 trace-centric 表述：Observability 由 trace、metrics、logs、eval signals、feedback、版本、成本一起组成，trace 是下钻链路之一。

## 参考依据

- OpenTelemetry: telemetry 采集存在误收集敏感 / 个人信息的风险，实施方要负责合规、保护、consent、存储，并遵循 data minimization。
- LangSmith: tracing 支持隐藏 inputs / outputs、metadata masking、rule-based masking、anonymizers、conditional tracing。
- vLLM Automatic Prefix Caching: 新请求只有共享相同 prefix 时才能复用已有 KV cache。
- OpenAI Prompt Caching: 缓存围绕 prompt prefix 与 prompt_cache_key 路由 / lookup / hit / miss，不等同于普通 sticky session。
