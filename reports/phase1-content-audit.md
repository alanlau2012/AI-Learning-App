# Phase 1 reviewed 内容质量审计

> 日期：2026-06-24  
> 范围：只读审计 Phase 1A `decisionGuide` reviewed 内容与 56 讲能力域映射。  
> 边界：未修改 `src/*`、`content/*`；本报告是唯一新增产物。  
> 证据源：`content/reviewed/decision-guide-phase1a-first-12-reviewed.md`、`content/drafts/decision-guide-phase1a-first-12.md`、`content/drafts/capability-domain-mapping-56.md`、`src/data/decisionGuides.ts`、`src/data/capabilityDomains.ts`、`docs/ai-engineering-leader-enhancement-p0-specs.md`、`docs/ai-engineering-leader-enhancement-progress.md`。

## 结论

Phase 1A 的 12 条 `decisionGuide` 总体可入库，未发现“空泛到不能指导工程评审”的 P0/P1 内容问题。每条均覆盖适用/不适用场景、工程信号、架构取舍、评审问题、落地清单和管理层解释，且普遍绑定日志、Trace、Eval、P95、账单、权限、审计、回放集、缓存命中率、实例水位等工程证据。

但当前质量仍有 3 类 P2/P3 风险，建议在进入 Profile 能力域驾驶舱、搜索过滤、决策章节 UI 前处理：

1. `reviewed` 审核稿证据过薄，只给 pass 表和草稿链接，缺少可复核的逐字段摘录或 checksum。
2. 多个 `decisionSignals` 只有证据来源，没有阈值或可判定边界，后续 UI 会像“检查清单”，但不够像“上线门槛”。
3. 56 讲能力域映射结构完整，但 `human-in-the-loop`、`multi-agent` 与 P0 规格建议表存在口径分叉，会影响后续能力域画像。

## 审计方法

- 结构核验：读取 `src/types/index.ts` 中 `DecisionGuide` 与 `CapabilityDomainMapping` schema，确认字段语义。
- reviewed 追溯：读取 `content/reviewed/decision-guide-phase1a-first-12-reviewed.md`，确认 reviewed 文件声明 12 / 12 pass，并说明 C 批剩余 5 讲未在本轮标为已审核。
- 入库核验：读取 `src/data/concepts.ts`，确认 `decisionGuideByConceptId` 与 `capabilityDomainByConceptId` 已合并到最终 concepts。
- 机械统计：解析 `src/data/decisionGuides.ts`，统计 12 条 decisionGuide 的条目数、tradeoff 维度、checklist 阶段、证据来源和阈值覆盖。
- 能力域比对：比对 `content/drafts/capability-domain-mapping-56.md`、`src/data/capabilityDomains.ts` 与 P0 spec 建议表。
- 命令验证：已运行 `cmd /c npm run validate:content`，结果 PASS。

## decisionGuide 质量

### 通过项

12 条已入库的 `decisionGuide` 均满足 SPEC-01 最低线：

| 检查项 | 结果 |
|---|---|
| 覆盖概念数 | 12 |
| 每讲适用场景 | 2 条 |
| 每讲不适用场景 | 2 条 |
| 每讲 decisionSignals | 3 条 |
| 每讲 tradeoffs | 3 条 |
| 每讲 reviewQuestions | 3 条 |
| 每讲 implementationChecklist | 3 条 |
| checklist 阶段覆盖 | 每讲均覆盖 `beforeBuild` / `beforeLaunch` / `running` |
| tradeoff 维度覆盖 | 每讲 3 个维度，满足至少 2 个维度要求 |

内容质量上，前 12 讲并非泛泛谈概念，而是绑定了工程判断信号：

- `multi-model-routing` 绑定任务分布、模型质量/延迟/成本基线、路由误选率、回放集、P95 延迟、投诉回放。
- `cost-routing` 绑定单位任务成本、降级后质量差异、投诉/返工影响、计费日志、人工抽检。
- `kv-cache` 绑定 KV Cache 命中率、Prefill 耗时占比、会话迁移频率、显存水位、扩缩容。
- `prompt-context` 绑定上下文引用率、指令冲突、Prompt 版本、敏感数据最小化。
- `tool-calling` 绑定工具 schema、权限、幂等、错误码、副作用等级、审计日志。
- `agent-loop` 绑定平均循环步数、超时率、终止条件、预算、权限门、人工接管。

### P2-01：reviewed 审核稿不可独立复核

证据：

- `content/reviewed/decision-guide-phase1a-first-12-reviewed.md:12` 直接声明 12 个 `decisionGuide` 均通过，未发现退回项。
- `content/reviewed/decision-guide-phase1a-first-12-reviewed.md:37` 说明通过版本以 draft 中七个 schema 字段为准。
- reviewed 文件没有逐字段摘录、风险样本、审核 checklist 明细或内容 hash。

影响：

后续 Agent 如果只读 reviewed 文件，会看到 pass 结论，但无法确认 pass 是基于哪些具体字段文本。若 draft 后续被改动，reviewed 结论也无法证明当时审核的精确版本。

建议：

- reviewed 文件保留现状可以不阻塞 DEV-02，但下一轮 review 产物应加入“逐概念证据摘录”。
- 每个概念至少摘录 1 条 `decisionSignals`、1 条 `tradeoffs.watchOut`、1 条 `implementationChecklist.passSignal`。
- 若仍以 draft 为通过版本，增加 draft 摘要 hash 或明确“本 reviewed 仅对当前 git revision 生效”。

### P2-02：部分 decisionSignals 缺少阈值型边界

证据：

以下信号有工程证据来源，但 `threshold` 为空，导致“看什么”明确，“到什么程度算失败/通过”不够明确：

| conceptId | 信号 | 源码位置 |
|---|---|---|
| cache-system | 缓存命中率与命中收益 | `src/data/decisionGuides.ts:259` |
| token-roi | Token 成本按业务场景拆分 | `src/data/decisionGuides.ts:295` |
| prompt-context | 上下文引用率 | `src/data/decisionGuides.ts:331` |
| context-window | 有效上下文利用率 | `src/data/decisionGuides.ts:367` |
| context-compression | 压缩比与信息保真度 | `src/data/decisionGuides.ts:403` |
| tool-calling | 工具调用成功率 | `src/data/decisionGuides.ts:439` |
| agent-loop | 平均循环步数和超时率 | `src/data/decisionGuides.ts:475` |

判断：

这不是 schema 错误，SPEC-01 允许 `threshold` 可选。但从“工程负责人决策手册”的定位看，这些信号天然适合补充边界。例如：

- `tool-calling` 可补“权限/参数/超时/业务拒绝四类错误必须可分桶，敏感工具失败和高风险动作必须告警”。
- `agent-loop` 可补“平均步数、P95 步数、预算耗尽率、人工接管率超过基线时触发复盘”。
- `context-window` 可补“长上下文 P95、输入 Token 分位数、引用覆盖率下降时不得继续扩窗”。
- `token-roi` 可补“按场景能归因到业务 owner；高成本低收益任务必须进入降级/缓存/下线候选”。

建议：

- 不必强制每条 `decisionSignal` 都有数值阈值，但每个 `decisionGuide` 至少应有 1 到 2 条“可判定边界”。
- 后续 UI 如果要展示“上线评审清单”，优先展示有阈值或 passSignal 的信号，避免看起来像建议列表。

### P3-01：Phase 1A 范围容易被误读成 17 个候选全量审核

证据：

- `docs/ai-engineering-leader-enhancement-progress.md:73` 记录 Phase 1 首批按 17 个候选启动，MVP 入库门槛为至少 12 个高质量通过项。
- `docs/ai-engineering-leader-enhancement-progress.md:80` 记录 Phase 1A 只要求首批 12 个通过审核。
- `content/reviewed/decision-guide-phase1a-first-12-reviewed.md:33` 明确 `multi-agent`、`eval`、`observability`、`trace`、`permission-governance` 属于后续扩展候选，不应在本轮标为已审核。

判断：

这属于交接清晰度风险，不是内容质量 bug。当前 reviewed 文件已写明边界，但后续 DEV-02/03/04 如果只看“Phase 1A pass”，可能误以为所有高优先级工程负责人决策章节都齐了。

建议：

- UI 或 Profile 侧展示时，避免文案写成“全部 Phase 1 决策手册已完成”。
- 下一批补齐时优先做 `trace`、`observability`、`permission-governance`，因为它们与前一轮 P1 内容修复和敏感数据边界强相关。

## 56 讲能力域映射

### 通过项

56 讲能力域映射在结构上是完整的：

- `content/drafts/capability-domain-mapping-56.md` 覆盖 56 / 56。
- `src/data/capabilityDomains.ts` 覆盖 56 / 56。
- draft 与 src 映射逐项一致。
- 每讲 1 到 2 个能力域，无空映射、无枚举外取值。
- `cmd /c npm run validate:content` PASS，结构门禁通过。

能力域整体分布合理，符合课程架构：

| 主域 | 主域讲数 | 判断 |
|---|---:|---|
| modelMechanics | 10 | 对应 M1，合理 |
| inferenceCostPerformance | 9 | 对应 M2 推理性能，合理 |
| maasPlatformization | 9 | 对应 M3 平台化，合理 |
| ragContextEngineering | 7 | 对应 M4 前半上下文工程，合理 |
| agentEngineering | 14 | 覆盖 M4/M5 Agent 章节，偏高但符合课程后半重点 |
| evaluationObservability | 4 | 主域偏少，但大量作为 secondary 出现 |
| securityGovernanceOrg | 3 | 主域偏少，但大量作为 secondary 出现 |

### P2-03：`human-in-the-loop` 主域与 P0 spec 建议表相反

证据：

- P0 spec 建议：`human-in-the-loop` primary 为 `securityGovernanceOrg`，secondary 为 `agentEngineering`，见 `docs/ai-engineering-leader-enhancement-p0-specs.md:426`。
- 当前 draft/src：`human-in-the-loop` primary 为 `agentEngineering`，secondary 为 `securityGovernanceOrg`，见 `content/drafts/capability-domain-mapping-56.md:53` 与 `src/data/capabilityDomains.ts:56`。
- P0 spec 的角色路径把 `human-in-the-loop` 放入“治理落地”和“执行边界”，见 `docs/ai-engineering-leader-enhancement-p0-specs.md:528` 与 `docs/ai-engineering-leader-enhancement-p0-specs.md:575`。

判断：

如果本讲正文重点是“人工接管如何嵌入 Agent 执行循环”，当前映射可以成立。但从负责人能力画像看，`human-in-the-loop` 更像上线治理控制点：高风险动作确认、权限拒绝、责任归属、人工接管 SLA、审计闭环。把它主域放在 `agentEngineering` 会削弱 `securityGovernanceOrg` 的主域权重。

建议：

- Product Owner 需要明确本讲训练目标：如果偏“执行状态机”，保留当前映射；如果偏“上线边界和责任治理”，改回 spec 建议。
- 若进入 Profile 能力域得分，建议采用 spec 口径：primary `securityGovernanceOrg`，secondary `agentEngineering`。

### P2-04：`multi-agent` secondary 从治理变成观测，合理但需要显式决策

证据：

- P0 spec 建议：`multi-agent` secondary 为 `securityGovernanceOrg`，见 `docs/ai-engineering-leader-enhancement-p0-specs.md:427`。
- 当前 draft/src：`multi-agent` secondary 为 `evaluationObservability`，见 `content/drafts/capability-domain-mapping-56.md:54` 与 `src/data/capabilityDomains.ts:57`。

判断：

当前映射并非错误。多 Agent 协作确实需要观测协作质量、handoff、冲突、重复劳动和任务完成率。问题是这个变更没有在 reviewed 文件中留下口径说明，而 P0 spec 同时把 `multi-agent` 放在 Agent 闭环路径和候选 C 批 decisionGuide 中。若后续能力域雷达图用于负责人画像，`multi-agent` 的 secondary 选择会改变“治理能力”与“观测能力”的得分解释。

建议：

- 如果课程想强调“多 Agent 编排质量如何度量”，保留 `evaluationObservability`，但在 DATA-04 reviewed 结论中补一条口径说明。
- 如果课程想强调“多 Agent 权限边界、责任归属、越权风险”，改回 `securityGovernanceOrg`。
- 在补齐 `multi-agent` decisionGuide 时同步决定，不建议 UI 已上线后再改能力域口径。

## 风险分级

| 编号 | 严重度 | 问题 | 是否阻塞 DEV-02/03/04 |
|---|---|---|---|
| P2-01 | P2 | reviewed 文件不可独立复核 | 不阻塞 DEV-02；建议补 before release |
| P2-02 | P2 | 部分 decisionSignals 缺阈值型边界 | 不阻塞 UI；阻塞“上线评审手册”口径 |
| P2-03 | P2 | `human-in-the-loop` 主域与 spec 相反 | 建议在 DEV-03 Profile 前确认 |
| P2-04 | P2 | `multi-agent` secondary 与 spec 不同且无决策记录 | 建议在 DEV-03 Profile 前确认 |
| P3-01 | P3 | Phase 1A 12/17 容易被误读 | 不阻塞；需交接文案写清 |

## 建议下一步

1. 增补一个 DATA-04 reviewed 文件，专门审核 56 讲能力域映射，并记录 `human-in-the-loop`、`multi-agent` 的最终口径。
2. 在不改 schema 的前提下，对 12 条 decisionGuide 补一轮“边界增强”：每讲至少 1 条 signal 带阈值或明确 pass/fail 触发条件。
3. DEV-03 Profile 开始前，先决定能力域映射是否完全遵循 P0 spec 建议表，还是允许 draft 的专家改写覆盖 spec。
4. 补齐 C 批剩余 5 条 decisionGuide 时，优先审核 `trace`、`observability`、`permission-governance`，再处理 `multi-agent`、`eval`。

## 验证记录

```text
cmd /c npm run validate:content

结果：PASS
- published-content：已校验 demo/mvp 内容 56 个
- animation：已校验动画一致性、注册类型与步骤合法性
- terminology：已校验 v2 内容 56 个
- structure：56 登记 / 模块计数 10/10/8/16/6/6 / 唯一性 / 关联无悬空 / contentStatus / 诊断题结构通过
```
