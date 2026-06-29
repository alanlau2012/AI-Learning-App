# Stabilization R0 内容 P1 修复草稿

> 产出角色：ai-fullstack-content-production-agent  
> 日期：2026-06-28  
> 边界：本草稿只给内容修复建议，不修改 `src/data/*`、`src/types/*` 或核心代码。主控 Agent 需审核后统一合入。

## 总体结论

本批问题应按三类处理：

1. 诊断题反作弊：#14-#19 重点消除“正确项最长 / 干扰项荒谬 / 题干直接映射答案”。
2. 场景演练口径：#20 与 #57 统一缓存 prefix、权限命名空间和 RAG 指标快照。
3. 决策手册与正文：#54/#55 清除仓库协作用语并对齐 Agent Loop 顺序；#61/#62 修正文案截断和重复 pitfall。

## #14 诊断题最长选项即正确

### 原问题

`reports/issue-tickets-content-diag-20260628.md` 指出 12 道单选题存在结构泄漏：正确项明显最长，且常伴随“先 X、再 Y、并 Z”的结构化语气。涉及：

`context-window`、`reasoning-limit`、`repo-context`、`multi-agent`、`code-review-agent`、`requirement-decomposition-agent`、`test-generation-agent`、`ops-diagnosis-agent`、`value-review-agent`、`eval`、`permission-governance`、`ai-native-org`。

### 建议替换文本/选项

建议以“缩短正确项 + 升级一个强干扰项”为原则处理。以下为可入库候选文案：

| conceptId | 建议替换的正确项 | 建议升级的强干扰项 |
|---|---|---|
| `context-window` | 建立高优先级约束区，固定硬约束并限制低价值上下文 | 扩大窗口并保留全部工具输出，避免遗漏历史证据 |
| `reasoning-limit` | 拆成取数、公式校验和结论复核，高风险差异加人审 | 先让模型多轮自检，直到解释能覆盖所有异常值 |
| `repo-context` | 补齐权威文档、入口文件、测试和近期变更后再改代码 | 先全仓库搜索相似实现，按最近文件的写法直接修 |
| `multi-agent` | 先评估是否适合拆分，强依赖子任务收敛回单 Agent | 增加仲裁 Agent 处理冲突，并保留原有拆分方式 |
| `code-review-agent` | 复核阻断等级和模块基线，先降低误报阻断 | 扩大规则库覆盖面，让更多提示项进入自动阻断 |
| `requirement-decomposition-agent` | 拆解前补澄清问题，并给子任务写验收标准 | 先让 Agent 拆更多子任务，后续由执行阶段再合并 |
| `test-generation-agent` | 改看缺陷捕获率，并用变异测试剔除空断言 | 继续提高覆盖率门槛，用覆盖率倒逼测试补齐 |
| `ops-diagnosis-agent` | 收回自动写权限，高风险处置转人工审批 | 增加回滚脚本，让 Agent 处置失败时自动恢复 |
| `value-review-agent` | 把指标改为采纳率、返工率和单位价值成本 | 继续统计生成量，同时增加低价值场景曝光 |
| `eval` | 先建覆盖典型和边界场景的评测集 | 先上线小流量灰度，用投诉率判断是否扩大 |
| `permission-governance` | 先收敛到最小权限，高风险写动作走人工审批 | 先在提示词中加入防注入规则并收紧工具描述 |
| `ai-native-org` | 重划人机责任，让人负责验收、方向和高风险判断 | 继续提高 Agent 采纳率，用规模倒逼组织适应 |

### 理由

- 正确项应训练“第一步工程判断”，不应显著比其他选项更长、更完整。
- 干扰项不能只是荒谬动作，应包含“方向看似正确但优先级、边界或风险控制错误”的选项。
- 本批建议不改变正确答案字母分布，只改变选项表达和干扰质量。

### 可能影响的字段

- `src/data/demoConcepts.ts`：上述 concept 的 `diagnosticQuestion.options`
- 必要时同步调整对应 `diagnosticQuestion.explanation`

## #15 `cost-routing` 干扰项荒谬

### 原问题

当前 `q-cost-routing-1`：

- A：立刻全量切换低成本模型
- B：建立任务分层和回放评测，先找出可降级且质量达标的请求
- C：只提高缓存时间，避免模型调用
- D：先购买更多低价模型额度

B 是唯一合理动作，A/C/D 过于容易排除。

### 建议替换文本/选项

保留正确项 B，重写 A/C/D：

- A：先按固定比例把 30% 低风险流量灰度到低成本模型
- B：建立任务分层和回放评测，先找出可降级且质量达标的请求
- C：先把重复请求接入缓存，并只观察账单是否下降
- D：先扩大低价模型额度，再根据投诉率回滚高风险任务

建议 explanation：

> B 是第一步，因为成本路由必须先知道任务价值、质量底线和可降级范围。A 有灰度意识，但没有评测基线和不可降级清单，可能把高风险样本混入低成本路径。C 能降低重复调用成本，但不能判断模型降级是否伤害质量。D 只扩额度和事后看投诉，会把质量风险推到线上。

### 理由

新 A/C/D 都是现实团队可能提出的方案，但分别缺少评测、只优化局部成本、把风险后置到线上，更能训练成本路由的工程优先级。

### 可能影响的字段

- `src/data/demoConcepts.ts`：`cost-routing.diagnosticQuestion.options`
- `src/data/demoConcepts.ts`：`cost-routing.diagnosticQuestion.explanation`

## #16 `maas` 干扰项荒谬

### 原问题

当前 `q-maas-1`：

- A：统一 MaaS 接入入口，纳入鉴权、计量、审计和模型目录
- B：先给所有应用换成最大模型
- C：让每个业务自己补充日志字段
- D：先扩大 GPU 集群，避免业务抱怨

B/D 明显错误，C 虽有一点方向但仍过短、过弱。

### 建议替换文本/选项

保留正确项 A，重写 B/C/D：

- A：统一 MaaS 接入入口，纳入鉴权、计量、审计和模型目录
- B：先要求各业务 SDK 统一埋点，并冻结新增直连路径
- C：先按部门补齐账单标签，月底再汇总外部 API 成本
- D：先建设模型目录页面，让业务自行选择供应商和版本

建议 explanation：

> A 是第一步，因为问题根因是生产调用入口分散，平台无法统一执行鉴权、计量、审计和模型目录治理。B 是强干扰项，SDK 埋点和冻结新增直连可作为迁移期措施，但既有直连仍会绕过控制面。C 只能改善财务归因，不能处理权限和审计。D 有助于透明化模型能力，但若没有统一入口，选择权会继续分散治理责任。

### 理由

MaaS 的第一性问题是控制面收敛，不是模型能力升级、硬件扩容或事后标签补录。

### 可能影响的字段

- `src/data/demoConcepts.ts`：`maas.diagnosticQuestion.options`
- `src/data/demoConcepts.ts`：`maas.diagnosticQuestion.explanation`

## #17 `sla` 双重结构泄漏

### 原问题

当前 `q-sla-1` 正确项 C 明显最长且唯一结构化：

> 在 SLA 中加入关键链路延迟、质量抽检指标、降级/人工复核策略和事故复盘

A/B/D 明显错误。

### 建议替换文本/选项

保留正确项 C，但缩短并增强干扰项：

- A：提高接口可用性目标，并新增 P95 首字告警
- B：把高风险合同切到旗舰模型，并保留原 SLA 口径
- C：补充链路延迟、质量抽检、降级和复盘口径
- D：把漏检投诉纳入人工复核，但暂不拆链路指标

建议 explanation：

> C 覆盖当前 SLA 缺失的体验延迟、业务质量、降级和复盘闭环。A 补了延迟但仍只在技术可用性附近打转，不能处理漏检质量。B 可能缓解部分质量问题，但不定义质量指标和降级边界。D 能止血高风险投诉，但缺少链路拆分，无法解释 P95 首字上升。

### 理由

本题应训练“AI SLA 不等于 HTTP 成功率”，而不是让用户凭最长结构化选项猜答案。

### 可能影响的字段

- `src/data/demoConcepts.ts`：`sla.diagnosticQuestion.options`
- `src/data/demoConcepts.ts`：`sla.diagnosticQuestion.explanation`

## #18 `permission-governance` 双重泄漏

### 原问题

当前 `q-permission-governance-1` 正确项 A 同时包含最小权限、默认只读、人工审批、审计日志四个动作，明显长于 B/C/D；且 C 方向相反，D 过弱。

### 建议替换文本/选项

保留正确项 A 的核心，重写选项：

- A：先收敛到最小权限，高风险写动作走人工审批
- B：先在提示词中加入防注入规则并收紧工具描述
- C：先按表级权限分组，保留生产库写权限方便自动修复
- D：先补全操作日志，再观察是否仍有越权动作

建议 explanation：

> A 是第一步，因为事故根因是权限过大且高风险写动作没有强边界。B 是必要但不充分的模型侧防护，抵不住运行时权限过宽。C 有权限分组意识，但保留生产写权限会继续扩大爆炸半径。D 能改善追责，但先留痕后治理会让下一次误操作仍可发生。

### 理由

权限治理应强调“运行时边界优先于提示词自觉”，但不能把其他防护写成完全无效。

### 可能影响的字段

- `src/data/demoConcepts.ts`：`permission-governance.diagnosticQuestion.options`
- `src/data/demoConcepts.ts`：`permission-governance.diagnosticQuestion.explanation`

## #19 `ttft` 多选题题干直接映射

### 原问题

当前题干直接给出“队列长度、RAG 检索耗时、KV Cache 未命中率都上升”，对应 A/B/C 三个正确项；D “只优化 Decode 阶段 TPOT”明显错误。多选题退化为题干关键词匹配。

### 建议替换文本/选项

建议保留多选题，但重写题干与选项，让至少一个选项“看似相关但需排除”。

建议 scenario：

> 办公助手新版本上线后，P95 TTFT 从 800ms 升到 4s，总输出长度和 TPOT 基本稳定。链路看板显示网关排队变长，RAG 检索 P95 波动增大，KV Cache 命中率从 62% 降到 28%；同时 GPU 利用率也升高，但没有 OOM 或实例错误。

建议 options：

- A：检查网关排队、限流和路由是否让请求等待进入推理服务
- B：检查 RAG 检索、重排和权限过滤是否拖慢首字前链路
- C：检查会话亲和和 KV Cache 命中下降是否放大 Prefill
- D：优先优化 Decode TPOT 和输出长度，因为 GPU 利用率升高

正确项仍为 A/B/C。

建议 explanation：

> A/B/C 都发生在首字前链路，能解释 TTFT 上升。D 是强干扰项：GPU 利用率升高可能提示容量压力，但题干说明 TPOT 和输出长度稳定，且没有 OOM 或实例错误；仅优化 Decode 不能优先解释首字前等待。第一步应拆端到端 TTFT，而不是看到 GPU 高就转向输出阶段。

### 理由

保留 TTFT 的多因素排查训练，同时让用户判断“相关指标是否真能解释首字前延迟”。

### 可能影响的字段

- `src/data/demoConcepts.ts`：`ttft.diagnosticQuestion.scenario`
- `src/data/demoConcepts.ts`：`ttft.diagnosticQuestion.options`
- `src/data/demoConcepts.ts`：`ttft.diagnosticQuestion.explanation`

## #20 `token-cost-spike` prefix 口径

### 原问题

`token-cost-spike` 中多处将“权限边界”写入 prefix 标准化：

- `retry-cache-storm.nextStepRecommendations`：同一租户内按任务模板、权限边界、版本和 cache key 标准化 prefix。
- `reviewRubric.acceptableActions`：同一租户内按任务模板、权限边界、版本和 cache key 标准化 prefix。
- `cachePolicy.tenantTaskGrouping.description`：同一租户内按任务模板、权限边界、版本和 cache key 分组。
- `baseline.metrics.cacheHitRate.explanation`：同一租户内的任务模板、权限边界、版本和 cache key 分组还不充分。

### 建议替换文本/选项

统一改为：

- `retry-cache-storm.nextStepRecommendations`：
  - 将租户、权限和版本作为 cache key 命名空间隔离；prefix 只标准化稳定的系统提示与任务模板。
- `reviewRubric.acceptableActions`：
  - 标准化稳定系统提示和任务模板，并用租户、权限、版本作为 cache key 命名空间隔离。
- `cachePolicy.tenantTaskGrouping.description`：
  - 同一租户内按稳定任务模板分组；租户、权限和版本进入 cache key 命名空间，禁止跨租户或跨权限复用上下文与 KV 状态。
- `baseline.metrics.cacheHitRate.explanation`：
  - prefix 标准化后命中率回升，但稳定任务模板与 cache key 命名空间仍需对齐租户、权限和版本。

### 理由

权限、租户、版本属于隔离维度，应进入 cache key 命名空间或策略判断；稳定 prefix 应承载系统提示和任务模板。把动态 ACL 拼进 prefix 会降低命中率，甚至诱导跨权限复用错误上下文。

### 可能影响的字段

- `src/data/scenarioExercises.ts`：`token-cost-spike.baseline.metrics[cacheHitRate].explanation`
- `src/data/scenarioExercises.ts`：`token-cost-spike.strategyControls[cachePolicy].options[tenantTaskGrouping].description`
- `src/data/scenarioExercises.ts`：`token-cost-spike.events[retry-cache-storm].nextStepRecommendations`
- `src/data/scenarioExercises.ts`：`token-cost-spike.reviewRubric.acceptableActions`

## #54 `multi-agent` 决策手册混入仓库协作用语

### 原问题

`decisionGuides.ts` 的 `multi-agent` 手册使用了本仓库协作语境：

- `git status`、文件锁表、模块 owner 记录
- 核心 schema/数据仅主开发可写
- `reviewed` 文件、`src/data/*`
- 每轮合并前复核 git 状态和进度文档

这会把企业 Multi-Agent Runtime 编排误写成代码仓库多 Agent 合作流程。

### 建议替换文本/选项

建议整段替换 `multi-agent` 手册中的 `app/non/signals/tradeoffs/questions/checks/exec` 相关仓库语境。候选文案如下。

#### app

- 任务天然需要多个专业能力或工具域分工：适用于规划、检索、工具执行、审核、风控等职责差异明显的流程。信号：单 Agent 需要持有过多工具；子任务可独立验收；不同职责需要不同权限。
- 需要并行探索但必须由主控统一收敛：适用于多候选方案评估、多数据源核验、多策略模拟。信号：子任务依赖较弱；最终需要统一决策；冲突可被仲裁。

#### non

- 任务短、依赖强且状态连续：单 Agent 或固定 workflow 更稳，多 Agent 会增加上下文转交和冲突成本。信号：每一步都依赖上一步细节；中间状态难摘要；并行收益低。
- 缺少共享状态协议、工具权限边界和终止条件：多 Agent 会重复调用工具、覆盖状态或互相放大错误。信号：共享记忆键不清；写工具无 owner；完成/失败状态不可判定。

#### signals

- 任务可分解度：至少能拆出 2 个可独立验收的子任务。证据来源：任务图、依赖关系、子任务验收标准。
- 冲突面大小：多个 Agent 是否会写同一资源、调用同一高风险工具或更新同一共享状态。证据来源：Trace 中的工具写冲突、共享状态键、资源锁和 side-effect 记录。
- 主控收敛能力：主控 Agent 是否能汇总证据、处理冲突、决定重试/升级/停止。证据来源：orchestrator trace、冲突仲裁记录、子 Agent 输出重叠率。

#### tradeoffs

- operability：并行处理不同职责；代价是状态同步和编排复杂度上升；盯防点是每个子 Agent 的输入、输出、权限和终止条件必须可追踪。
- quality：角色分离能减少单 Agent 盲点；代价是口径不一致；盯防点是主控必须基于证据仲裁，而不是简单拼接结论。
- security：可按职责授予最小权限；代价是权限矩阵和审计复杂；盯防点是高风险写工具必须由主控或人工审批。

#### reviewQuestions

- 每个子 Agent 的工具权限、可写资源和禁止动作是什么？goodAnswerSignals：最小权限、写工具白名单、用户委托范围、审批边界。
- 哪些子任务可以并行，哪些必须串行等待前置状态？goodAnswerSignals：依赖图、共享状态键、冲突资源、失败回退顺序。
- 主控 Agent 如何判断子 Agent 输出可信、冲突或需要人工接管？goodAnswerSignals：证据引用、置信/失败类型、冲突仲裁规则、人工升级条件。

#### implementationChecklist

- beforeBuild：定义 orchestrator/worker 职责、共享状态 schema、工具权限和终止状态。passSignal：任一子 Agent 开工前都能知道输入、输出、权限和停止条件。
- beforeLaunch：用冲突输出、工具失败、权限拒绝和重复副作用样本回放。passSignal：主控能仲裁冲突、停止错误循环并保留 Trace。
- running：持续记录每个子 Agent 的 Token、工具调用、失败率、冲突率和人工接管原因。passSignal：能按子 Agent 维度复盘成本、质量和风险。

#### executiveExplanation

- summary：多 Agent 协作是由主控 Agent 编排多个职责清晰的子 Agent，在隔离上下文和权限下并行或串行完成任务，再统一仲裁输出。
- businessValue：它能提升复杂任务的并行度、专业分工和交叉审核质量。
- mainRisk：边界不清会放大 Token 成本、状态冲突、工具副作用和责任真空。
- riskControl：用主控编排、最小权限、共享状态协议、Trace、冲突仲裁和人工接管治理。

### 理由

`multi-agent` 讲正文强调 orchestrator-worker、上下文隔离、Token 成本、冲突仲裁和 Trace 约束。决策手册应服务企业 Agent 平台设计，而不是当前仓库内容流水线。

### 可能影响的字段

- `src/data/decisionGuides.ts`：`decisionGuideByConceptId['multi-agent']` 对应 buildGuide 配置

## #55 `agent-loop` 摘要循环顺序错误

### 原问题

`decisionGuides.ts` 中 `agent-loop.exec.summary`：

> Agent Loop 让 AI 能按“计划-执行-观察-修正”处理多步任务。

与正文 `Observe → Plan → Act → Check → Continue/Stop` 不一致。

### 建议替换文本/选项

替换为：

> Agent Loop 让 AI 围绕目标反复“观察-计划-行动-校验”，并根据状态决定继续、停止或交给人工。

可选同步：

- `checks.beforeBuild` 从“定义计划、行动、观察、终止状态机”改为“定义观察、计划、行动、校验和终止状态机”。

### 理由

Agent Loop 的关键是先观察环境和工具反馈，再计划下一步；把“计划”放在最前会弱化状态机和工具结果反馈，误导工程实现。

### 可能影响的字段

- `src/data/decisionGuides.ts`：`agent-loop.exec.summary`
- 可选：`src/data/decisionGuides.ts`：`agent-loop.checks[beforeBuild]`

## #57 `rag-answer-quality` 指标不一致

### 原问题

同一场景故障态存在两套数字：

- `background`：事实错误率从 3% 升到 11%
- `facts[failure-samples]`：事实错误率 11%，引用正确率 74%
- `baseline.metrics`：事实错误率 9.5%，引用正确率 78%

学员无法判断 baseline 是事故当下快照还是干预后的模拟起点。

### 建议替换文本/选项

建议采用“统一为事故当下快照”的最小修复：

- `baseline.metrics.citationAccuracy.value`：从 `78` 改为 `74`
- `baseline.metrics.citationAccuracy.explanation`：
  - 当前事故快照中引用正确率已经跌到 74%，需要先拆分旧版本引用、低可信来源和无来源回答。
- `baseline.metrics.factualErrorRate.value`：从 `9.5` 改为 `11`
- `baseline.metrics.factualErrorRate.explanation`：
  - 当前事故快照中事实错误率从 3% 升到 11%，需要拆分重排、上下文冲突、权限边界和回答约束。
- `baseline.explanation`：
  - 基线代表事故当下的可复盘快照：召回覆盖率仍稳定，但引用正确率、事实错误率、冲突片段和权限解释率暴露出召回后治理缺口。

备选方案：如产品希望 baseline 表示“部分干预后的默认线”，则将 `background` 和 `facts[failure-samples]` 改为：

- background：线上事实错误率从 3% 升到 11%，负责人临时启用版本优先与来源必引后仍停留在 9.5%。
- facts[failure-samples]：事实错误率 9.5%，引用正确率 78%，冲突片段占比 18%。

### 理由

场景演练训练“读指标 -> 形成假设 -> 调策略验证”。同一故障态必须有单一事实源，否则会破坏指标驱动诊断的可信度。

### 可能影响的字段

- `src/data/scenarioExercises.ts`：`rag-answer-quality.baseline.metrics`
- `src/data/scenarioExercises.ts`：`rag-answer-quality.baseline.explanation`
- 备选方案会影响 `rag-answer-quality.background` 与 `facts[failure-samples].attributes`

## #61 `agents-md` definition 被截断

### 原问题

报告指出合并后 definition 曾出现残句：

> ...在业务 Agent 平台中也。

当前 `src/data/demoConcepts.ts` 原始定义为完整句：

> AGENTS.md 是写给 Agent 运行环境的项目级操作手册，用来固定业务边界、角色权限、可调用工具、验证命令和升级条件；在代码仓库中它表现为仓库说明，在业务 Agent 平台中也可以是同类运行规程。

若 `concepts.ts` 合并/裁剪后仍截断，需用更短定义避免 `fitDefinition` 截断。

### 建议替换文本/选项

建议 definition：

> AGENTS.md 是写给 Agent 运行环境的项目级操作手册，用来固定业务边界、角色权限、工具范围、验证命令和升级条件。

可选在 `whyItMatters` 或 `mentalModel` 保留“代码仓库 / 业务 Agent 平台均可使用同类运行规程”的说明，不放在 definition 长句内。

### 理由

definition 应是稳定、完整、短句；跨代码仓库和业务平台的泛化解释可以放入正文段落，避免裁剪器截断造成残句。

### 可能影响的字段

- `src/data/demoConcepts.ts` 或上游 v2 revision：`agents-md.definition`
- 如果截断发生在合并后，也可能影响 `src/data/concepts.ts` 的生成/合并结果，需主控确认数据来源。

## #62 `positional-encoding` pitfalls 第 4 条重复

### 原问题

报告指出 `positional-encoding.pitfalls[3]` 是 `ensureFour` 重复填充，与第 3 条实质重复并带“（续）”。当前 `demoConcepts.ts` 原稿只有 3 条 pitfalls：

1. 认为只要内容在上下文窗口内，模型就会等价利用。
2. 把关键约束、用户输入、RAG 片段和工具结果随意拼接。
3. 只测试短输入，不测试长输入和多轮对话后的规则命中率。

### 建议替换文本/选项

补第 4 条独立 pitfall：

> 把长上下文能力当成无限外推，未用真实长文、多轮和边界位置样本验证关键规则命中。

如需更偏 RoPE/位置外推：

> 假设模型在标称窗口内所有位置表现一致，忽略长上下文外推、远距离依赖和位置偏置带来的质量波动。

### 理由

新增 pitfall 应覆盖“长上下文有效长度 / 位置外推 / 边界位置验证”这一独立误区，避免和“只测短输入”重复。

### 可能影响的字段

- `src/data/demoConcepts.ts` 或上游 v2 revision：`positional-encoding.pitfalls`
- 如果重复由合并器 `ensureFour` 造成，主控需确认是否只补源稿即可消除 `concepts.ts` 重复。

## 自检

| 项目 | 结论 | 证据 |
|---|---|---|
| 未修改核心代码 | 通过 | 本草稿只写入 `content/drafts/stabilization-r0-content-p1-fixes.md` |
| 未修改 `src/data/*` | 通过 | 所有 `src/data/*` 改动仅作为“可能影响字段”列出 |
| 原问题可追溯 | 通过 | 每项对应 issue #14-#20、#54、#55、#57、#61、#62 |
| 事实不确定点 | 需主控确认 | #61/#62 可能发生在 `concepts.ts` 合并后而非 `demoConcepts.ts` 原稿 |
| 诊断题反作弊 | 通过 | 缩短正确项，增强强干扰项，避免荒谬排除法 |
| 工程口径 | 通过 | prefix 与 cache key 命名空间、权限边界、Agent Loop 顺序均按生产口径修正 |
| schema 外字段风险 | 低 | 未建议新增字段，仅替换现有字段文案 |

## 审核 Agent 重点关注

1. #14 全局 12 题替换后，需重新统计正确项长度差和 A/B/C/D 分布。
2. #19 仍为多选题，UI 是否明确展示多选不在本草稿边界内，但内容层已降低直接映射。
3. #20 的“权限作为 cache key 命名空间”需与 `kv-cache`、`session-affinity`、`cache-system` 三讲口径一致。
4. #57 需 Owner 选择“事故当下快照”或“干预后模拟起点”，本草稿推荐前者作为最小修复。
5. #54 建议整段替换，不建议只改 `git status` 一句，否则仓库协作语境仍会残留。
