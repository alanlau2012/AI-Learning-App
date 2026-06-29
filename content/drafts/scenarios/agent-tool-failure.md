# Agent 工具调用失败 场景演练草稿

## 1. 元信息

- scenarioId：agent-tool-failure
- type：agentTooling
- difficulty：advanced
- estimatedMinutes：9
- relatedConceptIds：tool-calling, agent-loop, permission-governance, trace, human-in-the-loop, observability
- entryConceptIds：tool-calling, permission-governance, trace, agent-loop
- capabilityDomains：agentEngineering, securityGovernanceOrg, evaluationObservability

## 2. 业务背景与初始症状

业务背景：一家大型企业把运维、采购和报销流程接入统一 Agent 工作台，日均约 1800 个任务，Agent 可调用 36 个工具，其中 21 个只读查询工具、9 个写入工具、6 个审批或通知工具。生产约束是：高风险写操作必须使用用户委托权限、必须保留审批证据、同一业务单据不能出现重复提交或重复扣费。

初始症状：上线新一版工具描述和重试策略后，工具调用成功率从 94% 降到 82%，参数业务错误率升到 9.6%，重复写操作告警增加。团队争论该先改 prompt、重写工具描述、放宽权限、增加自动重试，还是把失败任务全部交给人工。

objectLabels 建议：

- factsTitle：工具链与失败样本
- secondaryTitle：调用状态与权限边界
- controlTitle：工具治理策略

## 3. 事实对象

### fact：工具清单与风险等级

- id：tool-catalog
- title：工具清单
- description：工具按 side effect 分为只读、低风险写入、高风险写入和外部通知；工具名中存在相似项，例如 queryInvoice、createInvoice、submitInvoiceApproval。
- attributes：
  - 工具总数：36
  - 高风险写工具：6
  - 相似工具名组：4
  - 默认调用协议：JSON schema + tool description
- risks：
  - 工具名相似时，宽泛描述容易让模型按语义近似选择错误工具。
  - 高风险写工具不能只靠自然语言提示约束。

### fact：调用链路

- id：tool-call-chain
- title：调用链路
- description：一次任务经过意图识别、工具选择、参数生成、权限检查、工具执行、结果解释、状态写回七个步骤；当前 Trace 能看到工具名和返回码，但缺少参数校验失败原因、权限主体和幂等键。
- attributes：
  - 平均任务步数：7.8
  - 工具返回码覆盖率：96%
  - 参数失败原因覆盖率：43%
  - 幂等键记录率：58%
- risks：
  - 只看最终工具失败无法判断是工具选择、参数、权限、执行还是结果解释出错。
  - 缺少幂等键会让自动重试变成重复写入风险。

### fact：权限与审批状态

- id：permission-and-approval
- title：权限与审批状态
- description：用户委托权限、角色权限、审批证据和操作级 allowlist 分散在不同系统；部分工具调用使用 Agent 服务账号兜底，导致审计主体不清。
- attributes：
  - 用户委托权限覆盖率：76%
  - 高风险操作二次确认覆盖率：62%
  - Agent 服务账号调用占比：18%
  - 审批证据可追溯率：69%
- risks：
  - Agent 统一权限会扩大 blast radius。
  - 审批证据缺失时，即使操作成功也不能算生产可接受。

### fact：失败样本

- id：failure-samples
- title：失败样本
- description：失败样本主要分为错调相似工具、参数类型合法但业务语义错误、权限主体不匹配、工具瞬时失败后重复调用、工具成功但 Agent 误解返回结果。
- attributes：
  - 错调工具占失败样本：27%
  - 参数业务错误占失败样本：31%
  - 权限拒绝占失败样本：19%
  - 重复调用占失败样本：11%
- risks：
  - 把所有失败归因到 prompt 会漏掉权限和状态管理问题。
  - 全量自动重试会把不可恢复错误放大成生产事故。

## 4. baseline metrics

| metricId | label | value | unit | polarity | explanation |
|---|---|---:|---|---|---|
| toolSuccessRate | 工具调用成功率 | 82 | % | higherIsBetter | 当前成功率低于上线前水平，失败混合了工具选择、参数、权限和执行问题。 |
| parameterBusinessErrorRate | 参数业务错误率 | 9.6 | % | lowerIsBetter | 类型校验能通过，但业务字段不满足金额、币种、审批状态或对象归属规则。 |
| unauthorizedAttemptInterceptRate | 越权尝试拦截率 | 88 | % | higherIsBetter | 大部分越权调用被拦截，但 Agent 服务账号兜底让审计主体不稳定。 |
| duplicateSideEffectRate | 重复副作用率 | 4.2 | % | lowerIsBetter | 重试缺少幂等键和错误分类，写工具出现重复提交风险。 |
| humanHandoffRate | 人工接管率 | 14.5 | % | lowerIsBetter | 接管率升高说明系统正在自保，但也暴露自动诊断和恢复能力不足。 |
| avgTaskSteps | 平均任务步数 | 7.8 | steps | lowerIsBetter | 平均步数上升来自错调工具后的补救、重复调用和权限失败重试。 |

baseline.selectedStrategies 建议：

- toolDescriptionMode：preconditionExamples
- parameterValidationMode：businessRuleValidation
- permissionMode：delegatedUserPermission
- failureHandlingMode：classifiedRetry

baseline.explanation：基线代表可上线的最低治理线：工具描述明确前置条件和反例，参数校验覆盖业务规则，权限以用户委托和操作级边界为准，失败处理先分类再决定重试、升级或人工接管。

## 5. strategyControls

### control：toolDescriptionMode

- id：toolDescriptionMode
- label：工具描述
- options：
  - id：broadNaturalLanguage
  - label：宽泛自然语言
  - description：工具描述只写用途，不写前置条件、禁止场景和 side effect。
  - metricEffects：
    - toolSuccessRate / down / medium / absolute 6：相似工具更容易被错选。
    - avgTaskSteps / up / medium / relative 0.12：错调后需要补救步骤。
  - id：explicitPreconditions
  - label：明确前置条件
  - description：描述每个工具可调用前必须满足的对象状态、权限和输入证据。
  - metricEffects：
    - toolSuccessRate / up / medium / absolute 5：工具选择更稳定。
    - parameterBusinessErrorRate / down / small / absolute 2：前置状态减少无效参数。
  - id：preconditionExamples
  - label：前置条件 + 反例 + 风险标签
  - description：在工具描述中加入正反例、危险字段、是否有副作用和失败后处理边界。
  - metricEffects：
    - toolSuccessRate / up / large / absolute 8：相似工具误选下降。
    - duplicateSideEffectRate / down / small / absolute 1：模型更少把写工具当查询工具重试。

### control：parameterValidationMode

- id：parameterValidationMode
- label：参数校验
- options：
  - id：typeOnlyValidation
  - label：仅类型校验
  - description：只校验 JSON schema 类型和必填字段。
  - metricEffects：
    - parameterBusinessErrorRate / up / large / absolute 6：金额、状态、对象归属等业务约束漏检。
    - toolSuccessRate / down / medium / absolute 5：工具执行阶段才暴露错误。
  - id：businessRuleValidation
  - label：业务规则校验
  - description：在工具执行前校验对象归属、状态机、金额边界、币种和审批阶段。
  - metricEffects：
    - parameterBusinessErrorRate / down / large / absolute 5：业务语义错误提前拦截。
    - humanHandoffRate / up / small / absolute 2：复杂状态需要人工补证据。
  - id：highRiskSecondConfirm
  - label：高风险字段二次确认
  - description：对金额、收款账户、审批结论、写入目标等字段要求二次确认或审批证据。
  - metricEffects：
    - duplicateSideEffectRate / down / medium / absolute 2：高风险写操作更少误提交。
    - humanHandoffRate / up / medium / absolute 5：安全性提升但人工介入增加。

### control：permissionMode

- id：permissionMode
- label：权限策略
- options：
  - id：agentSharedPermission
  - label：Agent 统一权限
  - description：Agent 用服务账号统一调用工具，用户身份只写入日志。
  - metricEffects：
    - toolSuccessRate / up / small / absolute 2：权限拒绝减少。
    - unauthorizedAttemptInterceptRate / down / large / absolute 14：越权风险和审计主体混乱增加。
  - id：delegatedUserPermission
  - label：用户委托权限
  - description：每次工具调用绑定用户、租户、角色和任务授权范围。
  - metricEffects：
    - unauthorizedAttemptInterceptRate / up / medium / absolute 8：权限主体清晰。
    - toolSuccessRate / mixed / small / absolute 0：成功率取决于授权覆盖率。
  - id：operationMinPrivilege
  - label：操作级最小权限
  - description：按工具、动作、资源和字段做 allowlist，高风险写入必须有审批证据。
  - metricEffects：
    - unauthorizedAttemptInterceptRate / up / large / absolute 11：越权调用更早拦截。
    - humanHandoffRate / up / medium / absolute 4：缺证据任务会升级。

### control：failureHandlingMode

- id：failureHandlingMode
- label：失败处理
- options：
  - id：retryAll
  - label：失败即自动重试
  - description：任何工具失败都自动重试一次。
  - metricEffects：
    - duplicateSideEffectRate / up / large / absolute 5：不可幂等写工具重复提交风险上升。
    - avgTaskSteps / up / large / relative 0.22：无效重试拉长任务链。
  - id：classifiedRetry
  - label：分类重试
  - description：只对瞬时网络、限流和可幂等读操作重试；参数、权限、状态机错误直接修正或升级。
  - metricEffects：
    - toolSuccessRate / up / medium / absolute 5：瞬时错误可恢复，不可恢复错误不再放大。
    - duplicateSideEffectRate / down / large / absolute 3：写操作受幂等和分类保护。
  - id：humanHandoffForWriteFailure
  - label：写失败人工接管
  - description：写工具失败、权限不清或审批证据缺失时停止自动闭环，转人工确认。
  - metricEffects：
    - duplicateSideEffectRate / down / large / absolute 3.5：高风险副作用被阻断。
    - humanHandoffRate / up / large / absolute 8：稳定性换取人工成本。

## 6. events

### event：相似工具错调

- id：similar-tool-misfire
- title：工具名相似导致错调
- 触发条件：broadNaturalLanguage + typeOnlyValidation
- 现象：Agent 本应查询 invoice 状态，却调用 createInvoice 或 submitInvoiceApproval；工具返回成功但业务对象被错误推进到下一状态。
- 正确诊断：第一层不是模型“不会用工具”，而是工具协议缺少前置条件、side effect 标签和反例；类型校验也没有阻止语义错误。
- 排查顺序：
  1. 先按 Trace 查看 tool.name、intent、arguments、sideEffectType 和业务对象状态。
  2. 对失败样本分型：工具选择错误、参数错误、权限错误、执行失败、结果解释错误。
  3. 核对工具描述是否写清禁止调用场景和可替代查询工具。
  4. 给相似工具补反例后，用回放集比较错调率。
- 遗漏风险：
  - 只调 prompt 会继续让工具协议保持含糊。
  - 工具执行成功不代表业务动作正确。
  - 缺少 side effect 字段会让重试策略无法区分读写。
- 下一步建议：
  - 为工具描述增加前置条件、反例、风险标签和 side effect 类型。
  - 在 Trace 中记录意图、候选工具、最终工具和拒绝原因。
  - 将相似工具样本加入工具调用 Eval。
- relatedConceptIds：tool-calling, trace, eval

### event：参数合法但业务语义错误

- id：business-invalid-parameters
- title：参数合法但业务语义错误
- 触发条件：typeOnlyValidation + delegatedUserPermission
- 现象：JSON schema 校验通过，但报销金额超预算、币种与合同不一致、审批状态已关闭，工具执行阶段返回业务错误。
- 正确诊断：参数校验停留在类型层，没有把对象状态、预算、角色、币种和审批阶段纳入调用前校验。
- 排查顺序：
  1. 先查看失败参数是否满足工具 schema 但违反业务规则。
  2. 检查 Agent 是否能读取必要状态对象，例如预算、合同、审批阶段。
  3. 检查校验失败原因是否写入 Trace 并返回给 Agent 修正。
  4. 对高频业务错误补工具前置校验和测试样本。
- 遗漏风险：
  - 把业务规则写进自然语言说明而不做校验，会在规模化后失效。
  - 参数错误如果被重试，会制造更多无效工具调用。
- 下一步建议：
  - 把关键业务规则前置到工具 adapter 或 policy 层。
  - 将失败原因结构化返回，避免 Agent 只能猜测修正。
- relatedConceptIds：tool-calling, agent-loop, observability

### event：高风险写工具绕过审批

- id：write-permission-bypass
- title：高风险写工具绕过审批
- 触发条件：agentSharedPermission + broadNaturalLanguage
- 现象：服务账号可以调用写工具，Trace 中只看到 Agent 身份，看不到用户委托范围和审批证据；越权拦截率下降但表面成功率略升。
- 正确诊断：权限策略把生产安全换成了表面成功率。高风险写工具必须按用户、资源、动作、字段做最小权限，并保留审批证据。
- 排查顺序：
  1. 先确认 tool call 的实际执行主体是用户委托还是 Agent 服务账号。
  2. 核对调用资源是否在用户授权范围内。
  3. 查看高风险字段是否有审批证据和二次确认。
  4. 抽样审计成功调用，而不是只看失败调用。
- 遗漏风险：
  - 表面成功率提升会掩盖越权和审计风险。
  - 服务账号兜底会扩大事故影响面。
  - 只在回答阶段提示“不要越权”不能替代权限层拦截。
- 下一步建议：
  - 高风险工具切换到用户委托权限和操作级 allowlist。
  - Trace 必须记录 subject、tenant、resource、action、policyDecision 和 evidenceId。
- relatedConceptIds：permission-governance, tool-calling, trace

### event：自动重试造成重复提交

- id：retry-duplicate-side-effect
- title：自动重试造成重复提交
- 触发条件：retryAll + highRiskSecondConfirm
- 现象：二次确认降低了误提交，但失败即重试仍让部分写工具重复执行；业务侧出现重复采购单或重复通知。
- 正确诊断：重试策略没有区分可幂等读、可安全重试写、不可恢复业务错误和未知状态写失败；确认机制不能替代幂等与状态管理。
- 排查顺序：
  1. 先按工具 side effect 类型拆分重试样本。
  2. 检查写工具是否有 idempotency key、业务单据状态和去重窗口。
  3. 区分网络超时、限流、参数错误、权限拒绝和未知提交结果。
  4. 对未知状态写失败优先查询状态或人工接管，而不是再次写入。
- 遗漏风险：
  - 重试会把一次小故障放大成重复副作用。
  - 只看工具返回失败会忽略“提交成功但响应丢失”的未知状态。
- 下一步建议：
  - 只对可幂等读和明确可恢复错误自动重试。
  - 写工具必须引入幂等键、状态查询和人工接管边界。
- relatedConceptIds：agent-loop, tool-calling, human-in-the-loop

## 7. reviewRubric

- prompt：请判断 Agent 工具调用失败的主要来源，并说明你会如何按工具协议、参数校验、权限主体、状态管理、重试和人工接管顺序排查。
- requiredFindings：
  - 必须先把失败分型为工具选择、参数、权限、执行、结果解释和状态写回。
  - 必须指出高风险写工具不能只靠 prompt 或工具描述约束。
  - 必须识别失败即重试对不可幂等写操作的重复副作用风险。
  - 必须要求 Trace 记录工具名、参数摘要、权限主体、policy decision、幂等键和失败原因。
- acceptableActions：
  - 为工具描述补前置条件、反例、side effect 和风险标签。
  - 将类型校验扩展到业务规则校验和高风险字段二次确认。
  - 从 Agent 统一权限切到用户委托权限或操作级最小权限。
  - 采用分类重试，对未知状态写失败查询状态或人工接管。
- nextStepRecommendations：
  - 回看 tool-calling、agent-loop、permission-governance、trace 和 human-in-the-loop。
  - 用失败样本建立工具调用回放集，按失败类型和风险等级评估策略。

## 8. 自检

| 项目 | 结论 | 证据 |
|---|---|---|
| 是否训练跨知识点判断 | 通过 | 同时训练工具协议、权限治理、重试、状态管理、Trace 和人工接管。 |
| 是否有生产症状和指标 | 通过 | 有日均 1800 任务、36 工具、成功率、参数错误率、重复副作用率等指标。 |
| 指标变化是否可解释 | 通过 | 每个 strategy option 都给出 metricEffects 和机制解释。 |
| 是否有强干扰策略 | 通过 | Agent 统一权限、失败即重试、仅类型校验都是方向看似省事但风险更高的干扰项。 |
| 排查顺序是否真实 | 通过 | 先分型，再看工具协议、参数、权限、状态和重试边界。 |
| 是否含敏感信息 | 通过 | 全部为抽象企业场景和模拟指标，无真实客户、系统名或价格。 |
| relatedConceptIds 无悬空 | 待主开发复核 | 已按当前 src/data/concepts.ts 真实 id 选择：tool-calling、agent-loop、permission-governance、trace、human-in-the-loop、observability、eval。 |

## 9. 需要审核 Agent 重点看的点

- 人工接管率 polarity 在产品实现中可能需要解释为“过低或过高都不好”；当前按 lowerIsBetter 写，审核时建议看是否需在说明里补目标区间。
- `operationMinPrivilege` 会提高人工接管率，这是安全取舍，不应被误判为纯负向策略。
- 事件 `retry-duplicate-side-effect` 需要主开发入库时确认是否用当前 generic delta 触发逻辑表达“确认机制 + 重试策略”的组合风险。
