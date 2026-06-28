# 内容专家视角 Bug 列表

扫描日期：2026-06-23  
仓库：`alanlau2012/AI-Learning-App`  
审计对象：`src/data/demoConcepts.ts` 中 56 / 56 讲内容  
角色视角：AI 应用专家 / AI MaaS 专家 / 企业 Agent 治理审计  
结论：未发现 P0；发现 P1 2 个，P2 5 个。P1 已按计划创建 GitHub issue；P2 仅进入本地文档。

## 审计方法

- 结构门禁：`cmd /c npm run validate:content` PASS，确认 56 讲均为 `mvp` 且结构、动画、术语校验通过。
- 内容抽取：从 `src/data/demoConcepts.ts` 抽取 definition / mechanism / enterpriseCase / pitfalls / diagnosticQuestion / keyTakeaways / relatedConceptIds，覆盖 M1-M6 全部 56 讲。
- 定级标准：
  - P0：关键概念或工程原则明显错误，可能导致企业在架构、安全、成本、SLA、评测或权限治理上做出危险决策。
  - P1：核心讲法有明显误导、诊断题答案/解释不成立、跨课程口径冲突，影响学习者形成正确工程判断。
  - P2：术语不够精确、缺少关键 caveat、案例或排查路径偏浅，但不会直接造成严重错误决策。
- 外部核验：P1 使用官方文档或主流工程文档交叉验证。

## P0

无。

## P1

### P1-01 Trace / Tool Calling 课程鼓励记录完整输入输出和工具参数，但缺少敏感数据最小化边界

- 影响课程：`trace`、`tool-calling`、间接影响 `observability`
- 本地证据：
  - `src/data/demoConcepts.ts:3999`：工具调用案例建议“所有调用参数进入 trace”。
  - `src/data/demoConcepts.ts:5344`：Trace 机制写成“每个步骤记录为一个 span：输入、输出、耗时、所用模型或工具。”
  - `src/data/demoConcepts.ts:5390`：Trace 案例建议“span 记录每一步输入输出；异常请求全量采样”。
  - `src/data/demoConcepts.ts:5419`：诊断题正解也是“记录每一步输入输出，异常请求全量采样”。
- 问题描述：这套讲法对“可追溯性”强调正确，但没有同时强调 trace 中的 prompt、tool args、tool returns、模型输出可能包含 PII、凭证、财务/健康/客户数据、内部代码或安全材料。对企业 AI 平台学习者来说，容易形成“为了排障应全量记录原文输入输出”的错误治理动作。
- 外部核验：
  - OpenTelemetry 的敏感数据指南强调 telemetry 采集存在敏感/个人信息风险，实施方需要负责保护、合规、consent 和存储实践。参考：https://opentelemetry.io/docs/security/handling-sensitive-data/
  - LangSmith 的 tracing 文档专门提供 hide inputs/outputs、metadata masking、rule-based masking、anonymizers、conditional tracing，用于避免敏感信息进入 traces。参考：https://docs.langchain.com/langsmith/mask-inputs-outputs
- 影响：企业读者可能把高风险工具参数、用户原文、检索片段、客户数据和模型输出直接落入 trace 系统，造成隐私、合规、内部数据泄露和日志长期留存风险。
- 建议修正方向：
  - 在 `trace` 的机制与诊断题中加入“记录结构化摘要、引用 id、hash、分类标签、耗时、模型/工具版本、错误码、权限上下文；原文输入输出按敏感级别脱敏、采样或禁采”。
  - 在 `tool-calling` 中把“所有调用参数进入 trace”改为“安全字段、参数 schema、审批 id、影响范围、脱敏后的参数摘要进入 trace；敏感参数受最小化、脱敏、访问控制和保留期约束”。
  - 异常请求“全量采样”应补充 retention、访问控制、脱敏、租户隔离和合规例外。

### P1-02 Session 亲和把会话连续性、Sticky Routing 与 KV/Prefix Cache 复用绑定得过强

- 影响课程：`session-affinity`，间接影响 `kv-cache`、`ttft`
- 本地证据：
  - `src/data/demoConcepts.ts:2423`：定义写成“路由到持有相关上下文和 KV Cache 的实例，以提升缓存命中和上下文连续性”。
  - `src/data/demoConcepts.ts:2427`：机制写成“首轮请求经过 Prefill 后，会在实例上形成 KV Cache 和会话相关状态。”
  - `output/content-audit-extract.txt:150`：机制继续写“后续请求如果路由到同一实例或同一缓存域，可复用前缀缓存，降低重复 Prefill。”
- 问题描述：Session 亲和确实可以是某些自建推理/MaaS 系统的 cache locality 优化，但课程把它讲成“上下文连续性”的主要来源，并暗示多轮会话首轮 Prefill 后自然在实例形成可被后续请求复用的 KV Cache/会话状态。对很多 LLM API 和推理服务来说，上下文连续性首先来自应用层显式传入的消息历史、任务状态和 memory；KV/prefix cache 复用通常要求相同或共享 prompt prefix，且依赖具体服务的 prompt cache / prefix cache / session cache 实现，并非只靠 session id 粘到同一实例就成立。
- 外部核验：
  - vLLM Automatic Prefix Caching 文档说明：新请求只有在与已有请求共享相同 prefix 时，才能直接复用已有 KV cache，并跳过共享部分计算。参考：https://docs.vllm.ai/en/latest/features/automatic_prefix_caching/
  - OpenAI Prompt Caching 文档说明：prompt caching 是围绕 prompt prefix/cache key 的缓存机制，不等同于普通 sticky session。参考：https://developers.openai.com/api/docs/guides/prompt-caching
- 影响：MaaS 平台负责人可能误以为“做 session affinity 就能保证上下文连续和 KV 复用”，从而忽略应用层上下文重放、prefix 结构化、prompt_cache_key / cache key、cache invalidation、租户隔离和显式 memory/session state 设计。
- 建议修正方向：
  - 把定义改成“Session 亲和是把同一会话或共享前缀请求尽量路由到能复用相关服务端状态/缓存的缓存域，以优化 cache locality；它不是上下文连续性的来源”。
  - 机制中明确：上下文连续性由应用层消息历史、任务状态、memory 和工具结果管理；KV/prefix cache 复用要求共享 prefix、缓存未过期、模型/工具/schema/cache key 一致，并受服务实现约束。
  - 诊断题保留“会话迁移率上升 + cache hit 下降”作为排查点，但解释要补充“确认是否存在可复用 shared prefix / session cache 机制”，避免把 sticky routing 当通用解法。

## P2

### P2-01 Observability 过于 trace-centric

- 影响课程：`observability`
- 本地证据：`output/content-audit-extract.txt:366-370`
- 问题描述：定义把 Observability 写成“把 trace 聚合成系统级质量、延迟、成本视图”，容易让读者以为 trace 是唯一底座。企业 AI 可观测应同时包含 metrics、logs、traces、eval signals、feedback、成本、版本/变更、数据与知识库版本等信号。
- 建议修正方向：改成“以 trace 为可下钻链路之一，结合指标、日志、评测、反馈和版本维度形成系统级可观测性”。

### P2-02 Eval 课程把评测集规模说成“通常从数百到数千条起步”，容易显得过于刚性

- 影响课程：`eval`
- 本地证据：`output/content-audit-extract.txt:353-356`
- 问题描述：数百到数千条可以作为企业成熟阶段参考，但新场景冷启动时更合理的是风险分层、小型黄金集、关键边界样本和线上失败样本滚动扩充。当前措辞可能让早期团队误以为达不到数百条就无法开始 eval。
- 建议修正方向：改为“可从高风险黄金集和代表性样本冷启动，随线上失败样本扩充；成熟阶段可扩展到数百/数千条”。

### P2-03 位置编码课程把长上下文规则遗漏主要归因到位置编码，归因略窄

- 影响课程：`positional-encoding`
- 本地证据：`output/content-audit-extract.txt:100-104`
- 问题描述：长上下文末尾规则被忽略，可能来自位置表示/外推，也可能来自检索排序、上下文组织、注意力竞争、系统提示层级、数据冲突和任务指令权重。当前课程放在“位置编码”下讲是合理的，但案例归因应避免显得是位置编码单因果。
- 建议修正方向：在分析里显式写“位置只是触发因素之一，真实治理要同时检查上下文层级、证据排序、冲突材料和长上下文评测”。

### P2-04 AGENTS.md 课程把仓库文件名泛化到业务 Agent 平台，术语边界不够清楚

- 影响课程：`agents-md`
- 本地证据：`output/content-audit-extract.txt:267-271`
- 问题描述：AGENTS.md 是代码仓库/开发 Agent 语境中的具体文件约定。业务 Agent 平台也需要类似 runbook / operating manual，但未必叫 AGENTS.md。当前说法可能让读者把一个 repo convention 当成通用企业平台标准。
- 建议修正方向：标题保留 AGENTS.md，但定义中区分“AGENTS.md 是代码仓库中的具体载体；业务 Agent 平台对应的是 Agent operating runbook / 运行规程”。

### P2-05 Token ROI 价值口径里出现“人力替代”，需要补足业务价值和风险维度

- 影响课程：`token-roi`
- 本地证据：`output/content-audit-extract.txt:373-377`
- 问题描述：Token ROI 的核心方向正确，但机制中“节省工时、转化提升或人力替代”容易把价值框架导向成本替人。企业 AI ROI 更应包含质量、风险下降、响应时延、合规可追溯、采用率、返工率和用户体验。
- 建议修正方向：把“人力替代”降级为可选业务假设，新增“缺陷减少、风险降低、处理时延、采纳率、返工率、合规证据”等价值指标。

## 已覆盖课程

- M1：`token`、`semantic-space`、`transformer`、`attention`、`positional-encoding`、`autoregressive`、`sampling`、`instruction-tuning`、`hallucination`、`reasoning-limit`
- M2：`prefill`、`decode`、`ttft`、`tpot`、`kv-cache`、`session-affinity`、`batch-scheduling`、`pd-separation`、`speculative-decoding`、`quantization`
- M3：`maas`、`model-gateway`、`multi-model-routing`、`cost-routing`、`capability-routing`、`cache-system`、`rate-limit-circuit-break`、`sla`
- M4：`prompt-context`、`system-prompt`、`context-window`、`context-compression`、`context-pollution`、`layered-session`、`agents-md`、`repo-context`、`spec-driven-development`、`agent-loop`、`tool-calling`、`skill`、`subagent`、`memory`、`human-in-the-loop`、`multi-agent`
- M5：`code-review-agent`、`issue-fix-agent`、`requirement-decomposition-agent`、`test-generation-agent`、`ops-diagnosis-agent`、`value-review-agent`
- M6：`eval`、`trace`、`observability`、`token-roi`、`permission-governance`、`ai-native-org`

## GitHub Issue 创建结果

- P1-01：https://github.com/alanlau2012/AI-Learning-App/issues/3
- P1-02：https://github.com/alanlau2012/AI-Learning-App/issues/4
- P2：不创建 GitHub issue，仅保留本地文档。

