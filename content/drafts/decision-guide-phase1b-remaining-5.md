> task: DATA-03
> source_spec: docs/ai-engineering-leader-enhancement-p0-specs.md#1-spec-01decisionguide-内容标准
> status: draft
> covered_concepts: multi-agent, eval, observability, trace, permission-governance

# Phase 1B decisionGuide 草稿：剩余 5 讲

本草稿只作为 Phase 1B 输入包，不直接入库 `src/data/*`。字段按 SPEC-01 推荐结构组织，供后续主开发转换为 `decisionGuide` 数据。

## multi-agent

### applicableScenarios
- `multi-agent-app-1`：任务天然需要不同职责分工。适用于需求拆解、代码修改、测试验证、内容审核等需要互相制衡的流程，信号是单个 Agent 容易同时承担规划、执行、审核导致盲区，且产物可以拆成明确子任务。
- `multi-agent-app-2`：需要并行推进但必须保留主控收敛。适用于多模块内容生产、多个独立验证路径或多个候选方案评审，信号是任务之间依赖清晰、文件边界可隔离、最终需要一个 owner 合并判断。

### nonApplicableScenarios
- `multi-agent-non-1`：任务边界小且反馈链路短。单 Agent 或固定脚本更稳，多 Agent 会增加调度和冲突成本，信号是一次调用即可完成、没有独立审核价值、上下文共享成本高于并行收益。
- `multi-agent-non-2`：缺少文件锁、状态协议和退出条件。并行 Agent 会互相覆盖或重复执行，信号是共享进度无人维护、可写范围不清、完成/阻塞口径不一致。

### decisionSignals
- `multi-agent-signal-1`：任务可分解度。阈值：至少能拆出 2 个可独立验收的子任务；解释：不可分解的任务拆成多 Agent 只会制造协调噪声；证据：任务图、文件责任表、验收清单。
- `multi-agent-signal-2`：冲突面大小。阈值：多个 Agent 不能同时写同一核心文件；解释：共享写面越大，越需要主控串行合并；证据：git status、文件锁表、模块 owner 记录。
- `multi-agent-signal-3`：主控收敛能力。解释：多 Agent 的价值取决于是否有人整合结论、处理冲突、决定取舍；证据：progress 文档、review 记录、最终合入报告。

### tradeoffs
- `multi-agent-tradeoff-1`：operability。收益是可以并行推进草稿、审核和验证；代价是需要维护任务锁、上下文同步和合并节奏；注意不要让每个 Agent 都改核心数据。
- `multi-agent-tradeoff-2`：quality。收益是角色分离能发现单 Agent 盲点；代价是不同 Agent 口径不一致会让结论碎片化；注意必须有统一 SPEC 和 reviewed 输出。
- `multi-agent-tradeoff-3`：reliability。收益是失败任务可以局部重跑；代价是状态不一致会造成重复劳动或错误完成声明；注意完成状态必须绑定产物和验证证据。

### reviewQuestions
- `multi-agent-rq-1`：每个 Agent 的可写范围、禁止范围和交接产物是什么？为什么问：防止并行冲突。好答案信号：文件锁明确、核心 schema/数据仅主开发可写、草稿与审核分离。
- `multi-agent-rq-2`：哪些任务可以并行，哪些必须由主控串行合并？为什么问：区分并行收益和合并风险。好答案信号：依赖表、冲突文件列表、合入顺序。
- `multi-agent-rq-3`：Agent 何时判定 done、blocked 或需要主控接管？为什么问：避免卡住或误报完成。好答案信号：退出条件、验证命令、阻塞记录和复核人。

### implementationChecklist
- `multi-agent-check-1` beforeBuild：建立任务表、文件锁和每个 Agent 的可写范围；通过信号是任一 Agent 开工前能知道自己不能碰哪些文件。
- `multi-agent-check-2` beforeLaunch：对每个并行产物做 owner 复核；通过信号是 reviewed 文件写明 pass/退回，且不会直接进入 `src/data/*`。
- `multi-agent-check-3` running：每轮合并前复核 git 状态和进度文档；通过信号是能区分本轮改动、他人改动和未入库草稿。

### executiveExplanation
- summary：多 Agent 协作不是把一个任务切给更多机器人，而是把规划、执行、审核和验证拆成有边界的责任链。
- businessValue：它能提升复杂 AI 工程工作的并行度和审核质量，尤其适合内容、场景、代码和 QA 同时推进的阶段。
- mainRisk：边界不清会导致文件冲突、重复劳动、错误合并和无人负责的决策。
- riskControl：用文件锁、共享 progress、主控合并、reviewed 门禁和明确退出条件治理。

## eval

### applicableScenarios
- `eval-app-1`：上线前需要判断质量是否可接受。适用于 RAG、Agent、模型路由、工具调用等容易出现质量回归的功能，信号是已有真实失败样本、业务能定义正确/错误、模型或 Prompt 会持续迭代。
- `eval-app-2`：需要比较模型、策略或版本。适用于选择强模型/快模型、Prompt 版本、检索策略或工具协议时，信号是候选方案多、人工主观争议大、线上试错成本高。

### nonApplicableScenarios
- `eval-non-1`：业务目标尚未定义。没有可判断的成功标准时，Eval 会变成形式化打分，信号是没有目标用户、没有任务边界、没有失败样本。
- `eval-non-2`：样本分布无法代表真实流量。只用少量漂亮样例会误导准入判断，信号是样本来自 demo、没有边界 case、没有高风险/低频任务覆盖。

### decisionSignals
- `eval-signal-1`：评估集覆盖率。阈值：核心任务桶、失败样本和边界样本都必须覆盖；解释：覆盖不足会让上线风险隐藏在未测任务里；证据：任务分布、失败回放、人工标注表。
- `eval-signal-2`：指标与业务风险的相关性。解释：分数必须能解释用户投诉、人工返工或安全风险；证据：线上投诉、人工审核、缺陷记录。
- `eval-signal-3`：回归检测频率。阈值：模型、Prompt、检索或工具策略变更时必须重跑关键 Eval；解释：AI 系统质量会随依赖变化漂移；证据：CI 记录、版本变更记录、Eval run history。

### tradeoffs
- `eval-tradeoff-1`：quality。收益是上线前发现质量和安全回归；代价是评估集建设和标注成本；注意不要只看总分，要看任务桶和失败类型。
- `eval-tradeoff-2`：latency。收益是减少线上试错；代价是发布链路会增加评估等待；注意为高风险场景设置阻断门，为低风险场景设置抽检门。
- `eval-tradeoff-3`：operability。收益是版本决策有证据；代价是指标、样本和判分逻辑需要持续维护；注意 Eval 本身也要版本化。

### reviewQuestions
- `eval-rq-1`：评估集是否覆盖真实流量、失败样本和高风险边界？为什么问：防止 demo 样本误导上线。好答案信号：任务桶占比、失败样本来源、边界用例清单。
- `eval-rq-2`：准入阈值和阻断条件是什么？为什么问：没有阈值的 Eval 不能做决策。好答案信号：最低通过分、关键维度红线、人工复核规则。
- `eval-rq-3`：模型、Prompt、检索、工具任一变化后如何防回归？为什么问：质量漂移常来自依赖变更。好答案信号：版本化 Eval、CI 或发布前重跑、失败样本追踪。

### implementationChecklist
- `eval-check-1` beforeBuild：定义任务桶、判分维度和标注规范；通过信号是每条样本能说明它代表什么业务风险。
- `eval-check-2` beforeLaunch：用候选模型/策略跑同一评估集并记录准入阈值；通过信号是上线决策能引用分桶结果而非平均分。
- `eval-check-3` running：把线上失败样本定期回流到评估集；通过信号是重复失败类型在后续版本中被显式回归。

### executiveExplanation
- summary：Eval 是 AI 系统的质量闸门，用固定样本和标准判断版本是否真的变好。
- businessValue：它把“感觉效果不错”变成可比较、可复盘、可阻断发布的质量证据。
- mainRisk：评估集不代表真实场景时，分数会给团队错误安全感。
- riskControl：用真实流量分桶、失败样本回流、准入阈值和版本化回归治理。

## observability

### applicableScenarios
- `observability-app-1`：线上 AI 问题无法靠单点日志解释。适用于成本上涨、质量下降、SLA 违约、工具失败等跨模型、网关、检索和 Agent 的问题，信号是事故复盘需要串联多个系统。
- `observability-app-2`：平台需要持续运营 AI 服务。适用于 MaaS 网关、企业 Agent 平台、RAG 应用群，信号是有稳定流量、SLO/SLA 承诺、需要按租户/任务/模型分桶看指标。

### nonApplicableScenarios
- `observability-non-1`：只做一次性原型或离线 demo。完整观测体系投入过重，信号是无生产流量、无 SLA、无长期运维责任。
- `observability-non-2`：没有统一事件模型和敏感数据边界。盲目采集会造成字段不可比或隐私风险，信号是日志字段随应用变化、Prompt/响应原文无限制入库。

### decisionSignals
- `observability-signal-1`：关键指标覆盖度。阈值：至少覆盖成本、延迟、质量、成功率、风险/权限事件；解释：缺少维度会让复盘只看局部；证据：指标面板、告警规则、SLO 文档。
- `observability-signal-2`：分桶能力。解释：AI 问题必须按任务类型、模型、租户、版本、策略拆开看；证据：网关日志、Trace tag、指标标签。
- `observability-signal-3`：从告警到根因的可追溯性。阈值：P95、投诉或成本告警必须能追到请求链路和策略版本；解释：只有指标没有上下文无法诊断；证据：Trace link、版本记录、发布记录。

### tradeoffs
- `observability-tradeoff-1`：reliability。收益是更快定位生产问题；代价是要建设指标、日志、Trace 和告警协同；注意指标必须服务排查路径。
- `observability-tradeoff-2`：cost。收益是成本异常可解释；代价是采集、存储和查询也有成本；注意高基数字段和原文采集要有边界。
- `observability-tradeoff-3`：security。收益是权限和风险事件可审计；代价是观测数据可能包含敏感信息；注意最小化采集和访问控制。

### reviewQuestions
- `observability-rq-1`：线上事故发生时，团队能按哪些字段从告警定位到请求、模型、策略和版本？为什么问：验证是否可诊断。好答案信号：trace id、task type、model id、prompt version、policy version。
- `observability-rq-2`：哪些数据禁止采集原文，哪些字段需要脱敏或采样？为什么问：观测不能突破安全边界。好答案信号：敏感字段清单、脱敏策略、保留周期。
- `observability-rq-3`：指标是否能同时解释成本、质量、延迟和安全，而不是只看可用性？为什么问：AI 事故常不是单纯 5xx。好答案信号：Token 成本、投诉率、Eval 回归、工具失败、权限拒绝均有面板。

### implementationChecklist
- `observability-check-1` beforeBuild：定义统一事件模型和指标标签；通过信号是模型、任务、租户、版本、策略能被稳定关联。
- `observability-check-2` beforeLaunch：为成本、P95、成功率、质量投诉、权限拒绝建立告警或看板；通过信号是每类告警都有排查入口。
- `observability-check-3` running：定期复盘告警有效性和数据最小化；通过信号是低价值高成本字段被降采样，敏感字段访问受控。

### executiveExplanation
- summary：Observability 让 AI 系统从“出问题靠猜”变成“按指标和链路复盘”。
- businessValue：它能缩短故障定位时间，解释成本和质量波动，并支撑平台级运营。
- mainRisk：采集过少无法诊断，采集过多会增加成本和敏感数据风险。
- riskControl：用统一事件模型、关键指标分桶、Trace 关联、告警治理和数据最小化控制。

## trace

### applicableScenarios
- `trace-app-1`：一次 AI 请求跨越多个步骤。适用于 RAG 检索、重排、Prompt 拼装、模型调用、工具调用、Agent Loop 等链路，信号是单个失败无法从最终响应看出原因。
- `trace-app-2`：需要复盘质量、权限或成本异常。适用于模型误选、工具失败、上下文污染、权限拒绝等问题，信号是必须还原每一步输入、输出摘要、耗时和决策。

### nonApplicableScenarios
- `trace-non-1`：链路极短且无生产复盘要求。完整 Trace 可能投入过重，信号是只有单次模型调用、无工具、无上线 SLA。
- `trace-non-2`：没有敏感数据最小化策略。把 Prompt、文档、工具结果原文全量写入 Trace 会制造合规风险，信号是无法区分可记录字段和禁止记录字段。

### decisionSignals
- `trace-signal-1`：span 覆盖完整度。阈值：检索、上下文构造、模型调用、工具调用和权限判断不能断链；解释：断链会让复盘停在猜测；证据：Trace 样本、链路拓扑。
- `trace-signal-2`：关键决策字段。解释：Trace 必须记录模型选择、路由原因、Prompt 版本、工具参数摘要和权限结果；证据：Trace tag、结构化日志。
- `trace-signal-3`：敏感数据暴露面。阈值：默认记录摘要、哈希、id 或脱敏值，原文采集必须有白名单；解释：Trace 是高价值诊断数据，也是高风险数据资产；证据：字段分级、访问审计、保留策略。

### tradeoffs
- `trace-tradeoff-1`：observability。收益是单请求可复盘；代价是需要为每个步骤建 span 和字段规范；注意 Trace 不等于随手打印日志。
- `trace-tradeoff-2`：cost。收益是减少排障时间；代价是存储和查询成本上升；注意长 Prompt/响应原文不能默认全量保存。
- `trace-tradeoff-3`：security。收益是权限拒绝和工具动作可审计；代价是链路中可能出现敏感业务数据；注意访问控制和保留周期。

### reviewQuestions
- `trace-rq-1`：一次请求失败后，Trace 能否还原每个关键步骤的输入摘要、输出摘要、耗时和决策原因？为什么问：验证诊断完整性。好答案信号：span tree、duration、status、reason tags。
- `trace-rq-2`：哪些字段记录 id/摘要/哈希，哪些字段允许采样原文？为什么问：控制敏感数据风险。好答案信号：字段分级、脱敏规则、采样白名单。
- `trace-rq-3`：Trace 如何关联 Eval、投诉、成本和发布版本？为什么问：单条链路要能进入复盘闭环。好答案信号：eval case id、feedback id、cost id、release version。

### implementationChecklist
- `trace-check-1` beforeBuild：定义 span 边界和必填 tag；通过信号是 RAG、Agent、工具、权限步骤均有稳定 span 名称。
- `trace-check-2` beforeLaunch：用失败样本演练 Trace 复盘；通过信号是能定位到检索、上下文、模型、工具或权限中的具体环节。
- `trace-check-3` running：执行 Trace 数据保留、采样和访问审计；通过信号是敏感字段未默认原文落库，排障人员访问有记录。

### executiveExplanation
- summary：Trace 是 AI 请求的逐步行程记录，用来还原模型、上下文、工具和权限怎样共同产生结果。
- businessValue：它能让质量事故、成本异常和权限问题有可追溯证据，减少排障时间。
- mainRisk：Trace 若记录过多原文，会把诊断系统变成敏感数据集中地。
- riskControl：用结构化 span、字段最小化、脱敏、采样、保留周期和访问审计治理。

## permission-governance

### applicableScenarios
- `permission-governance-app-1`：AI 系统能调用工具或访问企业数据。适用于工单、CRM、代码仓库、知识库、审批、邮件等系统，信号是模型输出可能触发真实操作或读取受限数据。
- `permission-governance-app-2`：多个租户、角色或业务线共享 AI 平台。适用于 MaaS 网关、企业知识助手、Agent 平台，信号是权限来源多、数据边界复杂、需要审计和责任追踪。

### nonApplicableScenarios
- `permission-governance-non-1`：只处理公开静态内容且无工具副作用。重治理会拖慢原型验证，信号是无敏感数据、无写操作、无跨租户访问。
- `permission-governance-non-2`：尚未梳理身份、资源和动作模型。直接接入 Agent 会把权限问题后置到事故阶段，信号是没有角色矩阵、工具权限与用户权限脱节、审计日志缺失。

### decisionSignals
- `permission-governance-signal-1`：权限决策点覆盖。阈值：数据读取、工具调用、写操作、导出、跨租户访问都必须有决策点；解释：漏掉任一动作都会形成越权路径；证据：权限矩阵、工具清单、数据分类表。
- `permission-governance-signal-2`：最小权限执行。解释：Agent 执行动作时应继承用户或任务范围内的最小权限，而不是平台超级权限；证据：token scope、service account policy、审计日志。
- `permission-governance-signal-3`：敏感动作确认率与拒绝率。解释：高风险动作需要人工确认、二次审批或拒绝路径；证据：Human-in-the-loop 记录、审批日志、权限拒绝 Trace。

### tradeoffs
- `permission-governance-tradeoff-1`：security。收益是降低越权、误操作和数据泄露风险；代价是权限设计和接入成本上升；注意不要用平台全局权限绕过用户边界。
- `permission-governance-tradeoff-2`：operability。收益是审计和责任追踪清晰；代价是工具接入需要维护动作分级、审批和错误处理；注意拒绝路径也要用户可理解。
- `permission-governance-tradeoff-3`：latency。收益是高风险动作更安全；代价是人工确认或审批会增加时延；注意按风险分层，不要所有动作都走重审批。

### reviewQuestions
- `permission-governance-rq-1`：Agent 每个工具动作使用谁的权限、什么 scope、是否可审计？为什么问：确认执行身份边界。好答案信号：用户授权、最小 scope、service account 限制、审计 id。
- `permission-governance-rq-2`：哪些动作必须人工确认或二次审批，哪些动作可以自动执行？为什么问：平衡效率和风险。好答案信号：动作风险分级、确认文案、审批记录、回滚方案。
- `permission-governance-rq-3`：权限拒绝时 Agent 如何停止、解释或请求授权，而不是绕路调用其他工具？为什么问：防止权限绕过。好答案信号：拒绝状态机、禁止替代路径、Trace 记录、用户可理解提示。

### implementationChecklist
- `permission-governance-check-1` beforeBuild：梳理身份、资源、动作和风险等级矩阵；通过信号是每个工具动作都有允许/拒绝/需确认规则。
- `permission-governance-check-2` beforeLaunch：回放越权读取、敏感写操作、跨租户访问和权限拒绝样本；通过信号是 Agent 不会用其他工具绕过拒绝。
- `permission-governance-check-3` running：监控高风险动作、拒绝率、确认率和异常授权；通过信号是审计能还原用户意图、工具动作、权限结果和人工确认。

### executiveExplanation
- summary：权限治理决定 AI 能看什么、能做什么、以谁的身份做，以及高风险动作何时必须停下来确认。
- businessValue：它让企业 AI 从演示走向可控生产，既能接入真实系统，也能守住数据和操作边界。
- mainRisk：如果 Agent 使用过宽权限或能绕过拒绝，错误调用会变成越权访问、误操作或合规事故。
- riskControl：用最小权限、动作分级、人工确认、拒绝状态机、审计 Trace 和定期权限复核治理。
