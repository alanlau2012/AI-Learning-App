> task: DATA-01 / DATA-02 / DATA-03
> source_spec: docs/ai-engineering-leader-enhancement-p0-specs.md#1-spec-01decisionguide-内容标准
> status: draft
> covered_concepts: multi-model-routing, cost-routing, capability-routing, kv-cache, session-affinity, cache-system, token-roi, prompt-context, context-window, context-compression, tool-calling, agent-loop

# Phase 1A decisionGuide 草稿：首批 12 讲

本草稿只作为 Phase 1A 输入包，不直接入库 `src/data/*`。字段按 SPEC-01 推荐结构组织，供后续 SCHEMA-01 / DEV-01 转换。

## multi-model-routing

### applicableScenarios
- `multi-model-routing-app-1`：多业务共享 MaaS 网关。适用于客服、研发、办公、合规等任务共用模型平台，信号是请求类型差异大、SLA 分层明确、单模型成本或质量不可接受。
- `multi-model-routing-app-2`：模型能力和配额经常变化。适用于强模型配额有限、快模型可承接低风险流量的组织，信号是模型池有多档能力、配额告警频繁、业务可接受分级体验。

### nonApplicableScenarios
- `multi-model-routing-non-1`：流量规模小且任务类型单一。单模型加缓存/限流更容易治理，信号是 QPS 低、请求模板稳定、路由策略维护成本高于节省。
- `multi-model-routing-non-2`：缺少评估集和路由可观测性。无法证明某类任务适合某模型时，路由会变成拍脑袋，信号是没有按任务分桶的质量、成本、延迟指标。

### decisionSignals
- `multi-model-routing-signal-1`：任务分布。阈值：至少能区分 3 类高频任务；解释：没有分布就无法设计规则；证据：网关日志、业务标签、Trace span。
- `multi-model-routing-signal-2`：各模型质量/延迟/成本基线。解释：路由必须基于同一评估集对比；证据：离线 Eval、回放集、P95 延迟面板。
- `multi-model-routing-signal-3`：路由误选率。阈值：高价值任务误选低成本模型时必须告警；解释：误选会把降本变成质量风险；证据：路由决策日志、投诉回放。

### tradeoffs
- `multi-model-routing-tradeoff-1`：cost。收益是低风险流量走低成本模型；代价是策略维护和回放成本；注意不能只看平均单价。
- `multi-model-routing-tradeoff-2`：quality。收益是高难任务升级强模型；代价是错误分桶会导致关键任务降级；注意按任务类型看质量。
- `multi-model-routing-tradeoff-3`：operability。收益是平台可统一治理模型池；代价是网关、配额、回退和监控复杂度上升；注意策略变更要可审计。

### reviewQuestions
- `multi-model-routing-rq-1`：路由规则按哪些任务事实决策，而不是按调用方主观传参？好答案信号：任务分类、风险等级、上下文长度、SLA 均有日志证据。
- `multi-model-routing-rq-2`：每个模型的准入和降级边界是什么？好答案信号：有 Eval 分数、P95、成本和失败回退阈值。
- `multi-model-routing-rq-3`：路由误选后如何发现并回滚？好答案信号：路由决策 Trace、灰度策略、误选告警、回放验证。

### implementationChecklist
- `multi-model-routing-check-1` beforeBuild：定义任务分类和风险标签；通过信号是日志中可复盘每次路由输入事实。
- `multi-model-routing-check-2` beforeLaunch：用同一回放集压测各模型；通过信号是每个任务桶有成本、P95、质量基线。
- `multi-model-routing-check-3` running：监控模型命中、升级、回退和投诉；通过信号是异常能定位到策略、模型或流量结构。

### executiveExplanation
- summary：多模型路由不是多买几个模型，而是把不同业务请求送到合适能力和成本的模型。
- businessValue：它能在不牺牲关键任务质量的前提下降低整体成本并提高 SLA 可控性。
- mainRisk：如果没有评估和观测，路由会误把重要任务降级。
- riskControl：用任务分桶、回放评估、路由 Trace 和灰度回滚控制风险。

## cost-routing

### applicableScenarios
- `cost-routing-app-1`：Token 成本已成为平台预算压力。信号是月度调用量稳定、低风险请求占比高、强模型使用率过高。
- `cost-routing-app-2`：业务任务价值差异明显。信号是摘要、改写、分类等可降级任务与高价值生成任务能清晰分开。

### nonApplicableScenarios
- `cost-routing-non-1`：质量底线未定义。只按单价选模型会牺牲用户体验，信号是没有任务级 Eval 或投诉回放。
- `cost-routing-non-2`：合规或安全高风险流量占主导。成本不是第一排序，信号是高风险请求必须走受限模型或人工确认。

### decisionSignals
- `cost-routing-signal-1`：单位任务成本。阈值：按任务桶计算而非全局平均；解释：平均成本会掩盖高价值任务；证据：计费日志、请求标签。
- `cost-routing-signal-2`：降级后质量差异。解释：只有质量损失可接受时才降级；证据：A/B、离线 Eval、人工抽检。
- `cost-routing-signal-3`：成本节省对投诉/返工的影响。解释：表面省钱可能增加运营成本；证据：投诉率、重试率、人工介入率。

### tradeoffs
- `cost-routing-tradeoff-1`：cost。收益是低价值任务降本；代价是需要持续维护成本模型；注意预算口径要含重试和升级。
- `cost-routing-tradeoff-2`：quality。收益是把强模型留给高价值任务；代价是降级任务质量波动；注意设置最低质量门槛。
- `cost-routing-tradeoff-3`：observability。收益是成本异常可分桶诊断；代价是埋点更多；注意路由日志必须能关联账单。

### reviewQuestions
- `cost-routing-rq-1`：哪些任务可以降级，降级的质量底线是什么？
- `cost-routing-rq-2`：成本指标是否包含输入 Token、输出 Token、重试、回退和人工处理？
- `cost-routing-rq-3`：成本下降后，如何确认没有把投诉和返工成本转移给业务团队？

### implementationChecklist
- `cost-routing-check-1` beforeBuild：为任务桶建立成本和质量基线；通过信号是每个桶有强/快/低成本模型对比。
- `cost-routing-check-2` beforeLaunch：配置高风险与高价值任务的不可降级名单；通过信号是灰度中无违规降级。
- `cost-routing-check-3` running：每周复盘成本、投诉、重试和升级率；通过信号是成本变化能解释到任务桶和策略。

### executiveExplanation
- summary：成本路由的目标是把钱花在值得的任务上，而不是简单使用最便宜模型。
- businessValue：它能把平台预算从平均削减变成按业务价值配置。
- mainRisk：错误降级会造成质量下降、投诉增加和人工返工。
- riskControl：用质量底线、不可降级清单和任务级成本复盘治理。

## capability-routing

### applicableScenarios
- `capability-routing-app-1`：任务能力需求差异大。信号是代码、长文、推理、合规审查等任务对模型能力要求不同。
- `capability-routing-app-2`：强模型配额有限但必须用于关键任务。信号是强模型排队高、低复杂任务占用强模型、关键任务 SLA 受影响。

### nonApplicableScenarios
- `capability-routing-non-1`：缺少能力标签。无法判断任务需要什么能力时，路由规则不可维护。
- `capability-routing-non-2`：供应商模型能力不稳定且无回放验证。策略会频繁失效，优先建立评估体系。

### decisionSignals
- `capability-routing-signal-1`：任务能力标签覆盖率。阈值：高频任务必须可标注能力需求；证据：请求分类、业务规则。
- `capability-routing-signal-2`：模型能力基线。解释：每个模型在哪类任务上可用必须有证据；证据：Eval、人工验收、线上回放。
- `capability-routing-signal-3`：能力错配事件。解释：高推理任务走弱模型会导致失败；证据：失败样本、投诉、Trace。

### tradeoffs
- `capability-routing-tradeoff-1`：quality。收益是复杂任务获得匹配能力；代价是能力识别错误会误路由。
- `capability-routing-tradeoff-2`：latency。收益是简单任务避免强模型排队；代价是复杂任务升级会增加 P95。
- `capability-routing-tradeoff-3`：security。收益是高风险任务走受限模型；代价是风险分层过严会造成过度拦截。

### reviewQuestions
- `capability-routing-rq-1`：任务能力标签从哪里来，是否能被审计？
- `capability-routing-rq-2`：模型能力基线多久回放一次，模型升级后如何防回归？
- `capability-routing-rq-3`：能力识别失败时的默认策略是降级、升级还是拒绝？

### implementationChecklist
- `capability-routing-check-1` beforeBuild：定义任务能力标签和默认回退；通过信号是未知任务不会静默走低能力模型。
- `capability-routing-check-2` beforeLaunch：建立按能力分类的 Eval；通过信号是每类任务有模型准入阈值。
- `capability-routing-check-3` running：记录能力标签、目标模型和结果；通过信号是错配事件可复盘。

### executiveExplanation
- summary：能力路由确保复杂或高风险任务使用具备相应能力边界的模型。
- businessValue：它把有限强模型资源用在真正需要的场景，兼顾体验和成本。
- mainRisk：能力标签错误会让系统看似自动化，实际把关键任务交给不合适模型。
- riskControl：通过任务标签、模型评估、回退策略和错配复盘治理。

## kv-cache

### applicableScenarios
- `kv-cache-app-1`：多轮长上下文对话需要降低 TTFT。信号是同一会话重复上下文多、Prefill 占比高、首字等待敏感。
- `kv-cache-app-2`：MaaS 平台希望减少重复 Prefill 成本。信号是输入 Token 长、会话连续性高、缓存命中后成本下降明显。

### nonApplicableScenarios
- `kv-cache-non-1`：短问答和一次性请求为主。复用收益有限，信号是输入短、单轮占比高、排队才是主因。
- `kv-cache-non-2`：没有 Session 亲和。请求被打散到不同实例时，缓存无法稳定命中。

### decisionSignals
- `kv-cache-signal-1`：KV Cache 命中率。阈值：低于 30% 且 TTFT 上升时优先查路由亲和；证据：推理指标、路由日志。
- `kv-cache-signal-2`：Prefill 耗时占比。解释：重复 Prefill 越高，缓存收益越明确；证据：模型服务分阶段耗时。
- `kv-cache-signal-3`：会话迁移频率。解释：迁移越频繁，缓存失效风险越大；证据：session id 与实例 id 日志。

### tradeoffs
- `kv-cache-tradeoff-1`：latency。收益是命中后 TTFT 降低；代价是未命中时体验波动；注意看 P95。
- `kv-cache-tradeoff-2`：cost。收益是减少重复计算；代价是占用显存；注意长会话挤压并发。
- `kv-cache-tradeoff-3`：operability。收益是性能诊断更清晰；代价是路由、扩缩容、实例生命周期要协同。

### reviewQuestions
- `kv-cache-rq-1`：同一会话是否能稳定路由到持有缓存的实例？
- `kv-cache-rq-2`：上线后同时看哪些指标判断收益和副作用？
- `kv-cache-rq-3`：长上下文和高并发同时出现时，缓存淘汰策略是什么？

### implementationChecklist
- `kv-cache-check-1` beforeBuild：确认路由层透传 session id；通过信号是 Trace 可还原实例序列。
- `kv-cache-check-2` beforeLaunch：压测短问答、多轮长上下文、扩缩容三类流量；通过信号是 TTFT、命中率、显存都有对比。
- `kv-cache-check-3` running：为命中率下降叠加 P95 TTFT 上升建立告警；通过信号是告警能指向路由或实例异常。

### executiveExplanation
- summary：KV Cache 让模型少重复读已经处理过的上下文。
- businessValue：它能降低多轮长上下文场景的首字等待和重复推理成本。
- mainRisk：路由和扩缩容不配合时缓存会频繁失效。
- riskControl：用 Session 亲和、命中率、P95 TTFT 和显存水位一起治理。

## session-affinity

### applicableScenarios
- `session-affinity-app-1`：多轮会话依赖实例内状态或 KV Cache。信号是连续请求、缓存命中率与 TTFT 强相关。
- `session-affinity-app-2`：扩缩容后用户体验波动。信号是扩容时间点与会话迁移、缓存失效、首字延迟同步出现。

### nonApplicableScenarios
- `session-affinity-non-1`：请求完全无状态且短平快。亲和会降低负载均衡效率。
- `session-affinity-non-2`：实例状态不可控或不可恢复。强行亲和会把实例故障放大成会话故障。

### decisionSignals
- `session-affinity-signal-1`：同一 session 的实例切换率。阈值：切换率上升伴随 TTFT 上升时必须排查；证据：网关日志。
- `session-affinity-signal-2`：缓存命中率与路由策略的相关性。解释：亲和是否有效要用缓存收益验证；证据：KV 指标和路由 Trace。
- `session-affinity-signal-3`：热点实例水位。解释：过度亲和可能造成局部拥塞；证据：实例负载、排队长度。

### tradeoffs
- `session-affinity-tradeoff-1`：latency。收益是稳定命中缓存；代价是热点实例可能拖慢 P95。
- `session-affinity-tradeoff-2`：reliability。收益是会话连续；代价是实例故障时迁移复杂。
- `session-affinity-tradeoff-3`：operability。收益是诊断链路清晰；代价是扩缩容和预热策略更复杂。

### reviewQuestions
- `session-affinity-rq-1`：亲和键是什么，是否会泄漏敏感身份信息？
- `session-affinity-rq-2`：实例故障或扩容时，会话迁移如何保持体验可控？
- `session-affinity-rq-3`：如何避免亲和造成热点和容量浪费？

### implementationChecklist
- `session-affinity-check-1` beforeBuild：定义匿名化 session key 和路由日志；通过信号是可追踪但不暴露用户身份。
- `session-affinity-check-2` beforeLaunch：演练扩容、缩容和实例故障；通过信号是迁移后 TTFT 和错误率可控。
- `session-affinity-check-3` running：同时监控迁移率、命中率、热点实例和 P95；通过信号是亲和收益大于拥塞副作用。

### executiveExplanation
- summary：Session 亲和让同一会话尽量落在能延续上下文状态的实例上。
- businessValue：它让多轮助手体验更稳定，减少重复计算。
- mainRisk：亲和过强会造成热点，亲和过弱会让缓存失效。
- riskControl：用匿名亲和键、迁移策略、热点监控和扩缩容演练治理。

## cache-system

### applicableScenarios
- `cache-system-app-1`：大量重复请求或相似上下文。信号是命中后延迟和成本显著下降、重复问题占比高。
- `cache-system-app-2`：平台需要多层缓存治理。信号是网关、检索、Prompt、推理阶段都有可复用结果。

### nonApplicableScenarios
- `cache-system-non-1`：答案强依赖实时数据或权限。缓存可能返回过期或越权内容。
- `cache-system-non-2`：缺少失效策略。没有 TTL、版本和权限维度时，缓存风险高于收益。

### decisionSignals
- `cache-system-signal-1`：缓存命中率与命中收益。解释：只看命中率不够，还要看节省的成本/延迟；证据：缓存日志、成本面板。
- `cache-system-signal-2`：数据新鲜度要求。解释：实时性越高，缓存越要谨慎；证据：业务 SLA、数据更新时间。
- `cache-system-signal-3`：权限维度。解释：缓存 key 必须包含权限边界；证据：权限策略、访问日志。

### tradeoffs
- `cache-system-tradeoff-1`：cost。收益是减少重复调用；代价是缓存存储和失效维护。
- `cache-system-tradeoff-2`：quality。收益是稳定返回已验证答案；代价是过期答案污染体验。
- `cache-system-tradeoff-3`：security。收益是减少外部调用；代价是缓存越权或敏感数据残留。

### reviewQuestions
- `cache-system-rq-1`：缓存 key 是否包含租户、权限、数据版本和模型版本？
- `cache-system-rq-2`：命中缓存时如何证明答案仍然新鲜且未越权？
- `cache-system-rq-3`：缓存失效、回源失败和模型升级时的策略是什么？

### implementationChecklist
- `cache-system-check-1` beforeBuild：定义缓存层级和 key 维度；通过信号是权限和版本不会被省略。
- `cache-system-check-2` beforeLaunch：用过期数据、权限变化、模型升级做回归；通过信号是不会返回越权或旧答案。
- `cache-system-check-3` running：监控命中率、节省成本、过期命中、回源失败；通过信号是异常可定位到具体缓存层。

### executiveExplanation
- summary：缓存体系把可复用的结果留在本地链路，减少重复计算和等待。
- businessValue：它能降低成本、提升响应速度，并让高峰流量更稳。
- mainRisk：错误缓存会把过期、越权或低质量答案稳定放大。
- riskControl：用权限化 key、TTL、版本失效和异常回源治理。

## token-roi

### applicableScenarios
- `token-roi-app-1`：AI 平台预算需要和业务价值挂钩。信号是成本增长快于使用价值、部门账单难解释。
- `token-roi-app-2`：需要决定哪些场景继续投入。信号是同类任务有节省工时、转化、风险降低等可量化结果。

### nonApplicableScenarios
- `token-roi-non-1`：只想做技术成本压缩。此时优先看模型路由、缓存和上下文压缩。
- `token-roi-non-2`：没有业务结果指标。无法计算 ROI 时，不应把 Token 消耗直接等同浪费。

### decisionSignals
- `token-roi-signal-1`：Token 成本按业务场景拆分。解释：预算治理要看任务价值；证据：账单、业务标签。
- `token-roi-signal-2`：业务收益或风险降低。解释：ROI 的分子必须可解释；证据：节省工时、缺陷减少、转化率、审计风险。
- `token-roi-signal-3`：无效 Token 比例。解释：上下文膨胀、重试和低价值请求会稀释 ROI；证据：Trace、Prompt 长度、重试日志。

### tradeoffs
- `token-roi-tradeoff-1`：cost。收益是预算可治理；代价是需要业务标签和归因。
- `token-roi-tradeoff-2`：quality。收益是保留高价值高质量任务；代价是过度控费可能伤害体验。
- `token-roi-tradeoff-3`：operability。收益是负责人可解释投入；代价是指标体系需要跨团队维护。

### reviewQuestions
- `token-roi-rq-1`：这个场景的 Token 成本对应什么业务收益或风险控制？
- `token-roi-rq-2`：成本异常来自流量增长、上下文膨胀、重试，还是模型误选？
- `token-roi-rq-3`：哪些请求应被限流、降级、缓存或停止投入？

### implementationChecklist
- `token-roi-check-1` beforeBuild：定义场景标签和成本归因；通过信号是账单能落到业务任务。
- `token-roi-check-2` beforeLaunch：设定成本、质量和收益三类阈值；通过信号是上线评审能说明 ROI 假设。
- `token-roi-check-3` running：月度复盘高成本低价值任务；通过信号是能提出降级、缓存或下线动作。

### executiveExplanation
- summary：Token ROI 关注每一笔 AI 成本是否换来了可解释的业务价值。
- businessValue：它让 AI 预算从技术消耗变成可复盘的投资组合。
- mainRisk：只看成本会误伤高价值场景，只看热度会放任浪费。
- riskControl：用场景归因、收益指标、成本阈值和治理动作闭环。

## prompt-context

### applicableScenarios
- `prompt-context-app-1`：答案质量主要受输入材料和任务指令影响。信号是同一模型在不同 Prompt 下差异大。
- `prompt-context-app-2`：业务知识需要临时注入。信号是模型底座不知道企业私有规则，必须靠上下文提供证据。

### nonApplicableScenarios
- `prompt-context-non-1`：问题来自模型能力不足。继续堆 Prompt 不能补齐推理或工具能力。
- `prompt-context-non-2`：上下文来源不可信。把污染材料塞进 Prompt 会放大错误。

### decisionSignals
- `prompt-context-signal-1`：上下文引用率。解释：答案是否真的使用了提供材料；证据：Trace、引用标注、人工抽检。
- `prompt-context-signal-2`：指令冲突。解释：系统、开发者、用户指令冲突会导致不稳定；证据：Prompt 模板审查。
- `prompt-context-signal-3`：上下文长度与质量关系。解释：更多上下文不等于更好；证据：A/B、Eval、失败样本。

### tradeoffs
- `prompt-context-tradeoff-1`：quality。收益是提高任务对齐；代价是污染或冲突会降低质量。
- `prompt-context-tradeoff-2`：cost。收益是减少模型猜测；代价是长上下文增加 Token 成本。
- `prompt-context-tradeoff-3`：security。收益是显式控制材料；代价是敏感数据可能进入模型输入。

### reviewQuestions
- `prompt-context-rq-1`：哪些信息必须进入上下文，哪些应该由工具或检索提供？
- `prompt-context-rq-2`：Prompt 模板如何防止用户输入覆盖系统边界？
- `prompt-context-rq-3`：上下文变长后，质量收益是否覆盖成本和延迟代价？

### implementationChecklist
- `prompt-context-check-1` beforeBuild：分离系统指令、任务指令、业务材料和用户输入；通过信号是模板可审计。
- `prompt-context-check-2` beforeLaunch：用成功、边界、攻击样本回放；通过信号是关键约束不被覆盖。
- `prompt-context-check-3` running：记录 Prompt 版本和失败样本；通过信号是质量回归能定位到模板或材料。

### executiveExplanation
- summary：Prompt 与 Context 决定模型在当前任务中看见什么、按什么规则回答。
- businessValue：它能用较低改造成本提升私有业务场景的可控性。
- mainRisk：错误或过量上下文会带来成本、幻觉和安全边界问题。
- riskControl：用模板分层、材料治理、版本回放和敏感信息最小化控制。

## context-window

### applicableScenarios
- `context-window-app-1`：任务必须处理长文档或长会话。信号是输入超过普通窗口、需要跨段引用。
- `context-window-app-2`：需要决定扩窗、压缩或检索。信号是答案缺漏与材料截断强相关。

### nonApplicableScenarios
- `context-window-non-1`：任务只需少量关键事实。直接扩窗会增加成本和干扰。
- `context-window-non-2`：材料质量差或未分层。大窗口会把噪声也放大。

### decisionSignals
- `context-window-signal-1`：有效上下文利用率。解释：窗口里有多少内容被答案使用；证据：引用、Attention 分析、人工抽样。
- `context-window-signal-2`：截断失败样本。解释：关键证据是否被裁掉；证据：失败回放、Prompt 日志。
- `context-window-signal-3`：窗口长度对 P95 和成本的影响。解释：扩窗代价随输入长度上升；证据：Token 账单、延迟指标。

### tradeoffs
- `context-window-tradeoff-1`：quality。收益是容纳更多证据；代价是噪声和注意力稀释。
- `context-window-tradeoff-2`：latency。收益是减少多次调用；代价是 Prefill 时间和 P95 上升。
- `context-window-tradeoff-3`：cost。收益是减少外部编排；代价是长输入 Token 成本增加。

### reviewQuestions
- `context-window-rq-1`：为什么需要扩窗，而不是检索、压缩或分段处理？
- `context-window-rq-2`：长上下文失败时，是截断、噪声还是模型能力问题？
- `context-window-rq-3`：窗口长度增加后的成本和 P95 是否有上限？

### implementationChecklist
- `context-window-check-1` beforeBuild：定义必须保留的证据类型和裁剪规则；通过信号是关键材料不会被随机截断。
- `context-window-check-2` beforeLaunch：对比扩窗、压缩、检索三种方案；通过信号是质量/成本/P95 有数据。
- `context-window-check-3` running：监控输入 Token 分布和长上下文失败样本；通过信号是超长请求有降级路径。

### executiveExplanation
- summary：上下文窗口决定模型一次能处理多少输入，但窗口越大不等于答案越可靠。
- businessValue：合理使用长上下文可以支持文档、合同、代码等复杂任务。
- mainRisk：盲目扩窗会增加成本、延迟和噪声。
- riskControl：用证据裁剪、压缩/检索对比、Token 上限和失败回放治理。

## context-compression

### applicableScenarios
- `context-compression-app-1`：长上下文成本或延迟过高。信号是输入 Token 高、Prefill 慢、有效材料可摘要。
- `context-compression-app-2`：需要保留关键事实给后续多轮使用。信号是会话持续时间长、历史内容重复但只有少量关键决策。

### nonApplicableScenarios
- `context-compression-non-1`：任务要求逐字证据。压缩会丢失细节，应用检索或引用原文。
- `context-compression-non-2`：没有压缩质量评估。错误摘要会稳定污染后续回答。

### decisionSignals
- `context-compression-signal-1`：压缩比与信息保真度。解释：压缩不能只看 Token 下降；证据：摘要评估、人工抽检。
- `context-compression-signal-2`：关键事实丢失率。解释：丢失权限、约束、数字会造成严重错误；证据：回放集。
- `context-compression-signal-3`：压缩后成本/P95 改善。解释：收益要覆盖压缩步骤本身成本；证据：链路 Trace、账单。

### tradeoffs
- `context-compression-tradeoff-1`：cost。收益是减少后续 Token；代价是增加一次压缩调用或计算。
- `context-compression-tradeoff-2`：quality。收益是减少噪声；代价是关键细节可能被摘要掉。
- `context-compression-tradeoff-3`：observability。收益是上下文更短更可审；代价是需要记录压缩版本和来源。

### reviewQuestions
- `context-compression-rq-1`：哪些事实禁止被压缩或必须保留原文引用？
- `context-compression-rq-2`：压缩质量如何评估，失败如何回退？
- `context-compression-rq-3`：压缩节省的成本是否覆盖额外步骤和质量风险？

### implementationChecklist
- `context-compression-check-1` beforeBuild：定义保真规则和不可压缩字段；通过信号是数字、权限、结论来源保留。
- `context-compression-check-2` beforeLaunch：用长文、边界、冲突材料回放；通过信号是关键事实丢失率可接受。
- `context-compression-check-3` running：保存压缩前后版本和失败样本；通过信号是错误可追溯到压缩策略。

### executiveExplanation
- summary：上下文压缩是用更短输入保留关键事实，不是简单摘要。
- businessValue：它能降低长会话和长文档任务的成本与延迟。
- mainRisk：压缩错误会让后续所有回答建立在错误材料上。
- riskControl：用保真规则、回放评估、原文引用和失败回退治理。

## tool-calling

### applicableScenarios
- `tool-calling-app-1`：模型需要执行外部动作或查询实时系统。信号是答案依赖数据库、工单、搜索、审批等工具。
- `tool-calling-app-2`：需要把自然语言意图转成结构化 API 调用。信号是人工操作重复、参数规则明确、工具有权限边界。

### nonApplicableScenarios
- `tool-calling-non-1`：工具副作用不可控。删除、转账、发信等高风险动作必须先有确认和权限治理。
- `tool-calling-non-2`：工具协议不稳定。参数、错误码和幂等性不清时，Agent 会把系统错误放大。

### decisionSignals
- `tool-calling-signal-1`：工具调用成功率。解释：失败要区分参数、权限、超时和业务拒绝；证据：工具日志、Trace。
- `tool-calling-signal-2`：敏感操作比例。解释：高风险工具需要人工确认或审批；证据：权限策略、审计日志。
- `tool-calling-signal-3`：参数可验证性。解释：模型生成参数必须被 schema 校验；证据：工具 schema、失败样本。

### tradeoffs
- `tool-calling-tradeoff-1`：quality。收益是回答可基于实时事实；代价是工具失败会影响结果。
- `tool-calling-tradeoff-2`：security。收益是权限可控；代价是越权调用风险更高。
- `tool-calling-tradeoff-3`：operability。收益是动作可审计；代价是要维护工具协议、重试和幂等。

### reviewQuestions
- `tool-calling-rq-1`：工具 schema、权限、幂等和错误码是否足够明确？
- `tool-calling-rq-2`：哪些工具调用必须人工确认，确认前模型能做什么？
- `tool-calling-rq-3`：调用失败时，系统如何解释、重试、降级或停止？

### implementationChecklist
- `tool-calling-check-1` beforeBuild：为每个工具定义参数 schema、权限和副作用等级；通过信号是非法参数被拦截。
- `tool-calling-check-2` beforeLaunch：回放权限不足、超时、参数错误和业务拒绝；通过信号是 Agent 不会盲目重试。
- `tool-calling-check-3` running：记录工具调用链路和敏感操作审计；通过信号是每次动作可追溯到用户意图和权限。

### executiveExplanation
- summary：Tool Calling 让模型从只会回答变成能调用企业系统完成任务。
- businessValue：它能提升自动化效率，把 AI 接入真实业务流程。
- mainRisk：工具一旦有副作用，错误调用会变成真实业务风险。
- riskControl：用参数校验、权限分级、人工确认、审计和幂等治理。

## agent-loop

### applicableScenarios
- `agent-loop-app-1`：任务需要多步计划、执行、观察和修正。信号是单次问答无法完成，必须调用工具或分阶段判断。
- `agent-loop-app-2`：需要在不确定环境中持续推进。信号是工具结果会改变下一步动作，失败需要回退或改计划。

### nonApplicableScenarios
- `agent-loop-non-1`：任务可由固定流程或一次调用完成。Agent Loop 会增加延迟和不可控性。
- `agent-loop-non-2`：终止条件、权限和预算不清。循环可能卡死、越权或消耗过高。

### decisionSignals
- `agent-loop-signal-1`：平均循环步数和超时率。解释：步数失控说明任务边界或工具反馈有问题；证据：Agent Trace。
- `agent-loop-signal-2`：工具失败后的恢复率。解释：Agent 是否能根据观察修正；证据：工具日志、回放。
- `agent-loop-signal-3`：终止条件命中原因。解释：要区分成功完成、预算耗尽、权限拒绝和人工接管；证据：运行日志。

### tradeoffs
- `agent-loop-tradeoff-1`：quality。收益是能处理多步任务；代价是错误会在循环中累积。
- `agent-loop-tradeoff-2`：latency。收益是减少人工接力；代价是多步执行拉长响应。
- `agent-loop-tradeoff-3`：security。收益是可插入权限检查；代价是每一步都可能触发敏感动作。

### reviewQuestions
- `agent-loop-rq-1`：循环的最大步数、预算、超时和终止条件是什么？
- `agent-loop-rq-2`：每次观察结果如何影响下一步，而不是重复同一动作？
- `agent-loop-rq-3`：哪些状态必须人工接管，哪些可以自动重试？

### implementationChecklist
- `agent-loop-check-1` beforeBuild：定义计划、行动、观察、终止状态机；通过信号是不会无限循环。
- `agent-loop-check-2` beforeLaunch：用工具失败、权限拒绝、信息不足样本回放；通过信号是能停止或接管。
- `agent-loop-check-3` running：记录每一步的意图、工具、结果和终止原因；通过信号是问题可按 Trace 复盘。

### executiveExplanation
- summary：Agent Loop 让 AI 能按“计划-执行-观察-修正”处理多步任务。
- businessValue：它能把复杂工作从一次问答升级为可执行流程。
- mainRisk：边界不清会导致循环失控、成本上升或敏感操作失误。
- riskControl：用步数预算、权限门、工具 Trace、终止条件和人工接管治理。
