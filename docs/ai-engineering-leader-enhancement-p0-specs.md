# AI 工程负责人增强 P0 规格收敛

> 版本：v0.1  
> 日期：2026-06-24  
> 状态：P0 SPEC-01 / SPEC-02 / SPEC-03 完成  
> 前置决策：以 [ai-engineering-leader-enhancement-progress.md](ai-engineering-leader-enhancement-progress.md) 的 D-003 到 D-007 为准  
> 适用对象：Content & Validation Agent、Implementation Agent、后续 Product Architect 审核

本文只定义规格输入，不修改 `src/*`，不直接生产或入库内容草稿。

## 0. 共同边界

- 数据仍保持本地前端驱动，不引入后端、账号、团队协作、真实模型 API。
- 所有正式数据入库必须先更新 [content-schema.md](content-schema.md)，再同步 `src/types/index.ts` 与校验脚本。
- Content & Validation Agent 只能写 `content/drafts/*` 与报告；不得直接改 `src/data/*`。
- Implementation Agent 只能从已审核内容或本规格定义的结构输入中实现 schema、类型、校验和 UI。
- 本阶段不新增一级导航。决策手册进入知识点详情页；`model-router` 场景从相关知识点演练区进入；能力域进入 Profile / Search / Glossary。

## 1. SPEC-01：`decisionGuide` 内容标准

### 1.1 覆盖范围

Phase 1 内容草稿覆盖 17 个候选知识点：

| 批次 | 任务 | concept ids |
|---|---|---|
| A | DATA-01 | `multi-model-routing`, `cost-routing`, `capability-routing`, `kv-cache`, `session-affinity`, `cache-system` |
| B | DATA-02 | `token-roi`, `prompt-context`, `context-window`, `context-compression`, `tool-calling` |
| C | DATA-03 | `agent-loop`, `multi-agent`, `eval`, `observability`, `trace`, `permission-governance` |

Phase 1 MVP 入库门槛为至少 12 个高质量通过项。优先级最高的前 12 个为：

`multi-model-routing`, `cost-routing`, `capability-routing`, `kv-cache`, `session-affinity`, `cache-system`, `token-roi`, `prompt-context`, `context-window`, `context-compression`, `tool-calling`, `agent-loop`。

### 1.2 页面口径

- 章节标题：`工程决策`。
- 展示位置：知识点详情页 `enterpriseCase` 之后，`pitfalls` 之前。
- Phase 1 交互：支持复制 `reviewQuestions` 与 `implementationChecklist`；不做 Markdown 导出。
- 空数据行为：无 `decisionGuide` 的知识点不显示空壳章节。

### 1.3 推荐数据结构

Implementation Agent 可据此设计 `Concept.decisionGuide`。字段名使用英文 schema 名，文案由 UI 层映射中文标题。

```ts
export interface DecisionGuide {
  applicableScenarios: DecisionScenario[];
  nonApplicableScenarios: DecisionScenario[];
  decisionSignals: DecisionSignal[];
  tradeoffs: ArchitectureTradeoff[];
  reviewQuestions: ReviewQuestion[];
  implementationChecklist: ChecklistItem[];
  executiveExplanation: ExecutiveExplanation;
}

export interface DecisionScenario {
  id: string;
  title: string;
  description: string;
  signals: string[];
}

export interface DecisionSignal {
  id: string;
  metricOrFact: string;
  threshold?: string;
  interpretation: string;
  evidenceSource: string;
}

export interface ArchitectureTradeoff {
  id: string;
  dimension: 'cost' | 'latency' | 'quality' | 'reliability' | 'observability' | 'security' | 'operability';
  gain: string;
  cost: string;
  watchOut: string;
}

export interface ReviewQuestion {
  id: string;
  question: string;
  whyAsk: string;
  goodAnswerSignals: string[];
}

export interface ChecklistItem {
  id: string;
  phase: 'beforeBuild' | 'beforeLaunch' | 'running';
  item: string;
  passSignal: string;
}

export interface ExecutiveExplanation {
  summary: string;
  businessValue: string;
  mainRisk: string;
  riskControl: string;
}
```

### 1.4 必填字段与最低合格线

| 字段 | 最低合格线 | 退回标准 |
|---|---|---|
| `applicableScenarios` | 至少 2 条；每条包含业务 / 系统 / 组织条件之一，并给出 `signals` | 只写“适合复杂场景”“适合大企业”等泛化描述；没有可观察信号 |
| `nonApplicableScenarios` | 至少 2 条；明确说明为什么不该优先采用 | 只写“视情况而定”；没有成本、延迟、权限、质量、运维边界 |
| `decisionSignals` | 至少 3 条；每条说明指标或系统事实、解释方式、证据来源 | 没有指标、日志、Trace、评估集、流量结构、权限边界等证据来源 |
| `tradeoffs` | 至少 3 条；覆盖至少 2 个维度 | 只列优点，不列代价；或把管理口号当架构取舍 |
| `reviewQuestions` | 至少 3 条；每条可直接在方案评审会上追问 | 问题无法推动决策，例如“这个方案好吗” |
| `implementationChecklist` | 至少 3 条；至少覆盖两个阶段 | 检查项不可验证，例如“注意安全”“保证质量” |
| `executiveExplanation` | 四段均必填；面向管理层，不堆实现细节 | 只复述技术定义；不说明业务价值、主要风险和控制手段 |

### 1.5 写作规则

- 每个判断都必须绑定工程信号、约束或失败模式，例如 QPS、P95、Token 成本、KV Cache 命中率、召回率、权限过滤、Trace 字段、评估集覆盖、SLA、运维复杂度。
- 不得用“要综合考虑”“根据实际情况调整”作为结论，除非后面给出明确判断信号。
- 评审问题要能让负责人识别方案是否能上线，而不是考概念定义。
- 落地清单要能转成验收项，优先使用“检查什么、通过信号是什么”的句式。
- 管理层解释要避免算法细节，聚焦业务价值、成本 / 风险变化和治理手段。

### 1.6 合格样例

以下以 `kv-cache` 为示例，供 Content & Validation Agent 参考结构与颗粒度。

```ts
decisionGuide: {
  applicableScenarios: [
    {
      id: 'kv-cache-app-1',
      title: '多轮会话需要稳定低 TTFT',
      description: '适用于客服、办公助手、代码助手等连续上下文对话，用户对首字等待敏感。',
      signals: ['多轮请求占比高', 'P95 TTFT 高于体验目标', '同一会话上下文重复率高'],
    },
    {
      id: 'kv-cache-app-2',
      title: '平台需要降低重复 Prefill 成本',
      description: '适用于长上下文请求频繁、历史上下文复用明显的 MaaS 平台。',
      signals: ['平均输入 Token 长', 'Prefill GPU 时间占比高', '缓存命中后成本明显下降'],
    },
  ],
  nonApplicableScenarios: [
    {
      id: 'kv-cache-non-1',
      title: '请求大多是一次性短问答',
      description: '短请求复用历史上下文的收益有限，优先优化模型选择和批调度。',
      signals: ['单轮请求占比高', '输入 Token 短', 'TTFT 主要由排队而非 Prefill 导致'],
    },
    {
      id: 'kv-cache-non-2',
      title: '路由无法保证会话亲和',
      description: '请求经常被打散到不同实例时，缓存会反复失效，收益会被路由策略抵消。',
      signals: ['Session 亲和缺失', '扩缩容后缓存命中率骤降', '实例间状态不可共享'],
    },
  ],
  decisionSignals: [
    {
      id: 'kv-cache-signal-1',
      metricOrFact: 'KV Cache 命中率',
      threshold: '低于 30% 且 TTFT 同步上升时优先排查路由亲和',
      interpretation: '命中率低说明请求没有复用已计算上下文，增加实例不一定解决首字时延。',
      evidenceSource: '推理服务指标、路由日志、Trace span',
    },
    {
      id: 'kv-cache-signal-2',
      metricOrFact: 'Prefill 耗时占比',
      threshold: '长上下文场景中持续高于 Decode 耗时',
      interpretation: '重复 Prefill 可能是成本和时延主因，缓存收益更明确。',
      evidenceSource: '模型服务分阶段耗时指标',
    },
    {
      id: 'kv-cache-signal-3',
      metricOrFact: '会话迁移频率',
      interpretation: '迁移频率越高，缓存失效风险越大，需要与 Session 亲和一起评审。',
      evidenceSource: '网关路由日志、实例 id 分布',
    },
  ],
  tradeoffs: [
    {
      id: 'kv-cache-tradeoff-1',
      dimension: 'latency',
      gain: '命中缓存后 TTFT 降低。',
      cost: '缓存未命中时仍需完整 Prefill，体验波动可能更明显。',
      watchOut: '必须同时观察命中率和 P95，而不是只看平均延迟。',
    },
    {
      id: 'kv-cache-tradeoff-2',
      dimension: 'cost',
      gain: '减少重复计算，降低长上下文多轮成本。',
      cost: '占用显存并提高实例状态管理复杂度。',
      watchOut: '长会话过多时可能挤压并发容量。',
    },
    {
      id: 'kv-cache-tradeoff-3',
      dimension: 'operability',
      gain: '让性能问题有更清晰的缓存命中诊断入口。',
      cost: '需要路由、扩缩容、实例生命周期协同。',
      watchOut: '扩容策略必须考虑冷缓存预热和会话迁移。',
    },
  ],
  reviewQuestions: [
    {
      id: 'kv-cache-rq-1',
      question: '同一会话的连续请求是否能稳定路由到持有缓存的实例？',
      whyAsk: '没有 Session 亲和，KV Cache 很难形成稳定收益。',
      goodAnswerSignals: ['路由日志可按 session id 追踪', '异常迁移有告警', '扩缩容策略说明缓存影响'],
    },
    {
      id: 'kv-cache-rq-2',
      question: '上线后用哪些指标同时判断缓存收益和副作用？',
      whyAsk: '只看平均延迟会掩盖 P95 波动和显存挤压。',
      goodAnswerSignals: ['命中率', 'P95 TTFT', 'Prefill 耗时', '显存占用', '会话迁移率'],
    },
    {
      id: 'kv-cache-rq-3',
      question: '长上下文和高并发同时出现时，缓存淘汰策略是什么？',
      whyAsk: '无边界缓存会挤压容量，反而拖慢服务。',
      goodAnswerSignals: ['TTL 或容量策略', '长会话保护或降级策略', '冷缓存回退路径'],
    },
  ],
  implementationChecklist: [
    {
      id: 'kv-cache-check-1',
      phase: 'beforeBuild',
      item: '确认路由层能透传 session id 并记录实例命中。',
      passSignal: 'Trace 或日志可还原同一会话的实例序列。',
    },
    {
      id: 'kv-cache-check-2',
      phase: 'beforeLaunch',
      item: '压测包含短问答、多轮长上下文、扩缩容三类流量。',
      passSignal: '每类流量都有 TTFT、命中率、显存占用对比。',
    },
    {
      id: 'kv-cache-check-3',
      phase: 'running',
      item: '为命中率下降叠加 P95 TTFT 上升建立告警。',
      passSignal: '告警能指向路由、扩缩容或实例异常，而不是只报延迟高。',
    },
  ],
  executiveExplanation: {
    summary: 'KV Cache 的价值不是让模型更聪明，而是让多轮长上下文请求少做重复计算。',
    businessValue: '它能降低首字等待和重复推理成本，适合高频多轮助手类场景。',
    mainRisk: '如果路由和扩缩容不配合，缓存会频繁失效，用户体验仍会波动。',
    riskControl: '用 Session 亲和、缓存命中率、P95 TTFT 和显存水位一起治理。',
  },
}
```

### 1.7 不合格样例

```ts
decisionGuide: {
  applicableScenarios: [
    { title: '适合需要性能优化的场景', description: '大多数企业都可以考虑。' },
  ],
  nonApplicableScenarios: [
    { title: '不适合小场景', description: '小场景收益不明显。' },
  ],
  decisionSignals: [
    { metricOrFact: '看业务情况', interpretation: '如果业务需要就做。' },
  ],
  tradeoffs: [
    { dimension: 'cost', gain: '可以降本', cost: '需要投入', watchOut: '注意治理。' },
  ],
  reviewQuestions: ['这个方案是否合理？', '成本是否可控？', '能不能上线？'],
  implementationChecklist: ['注意性能', '注意安全', '做好监控'],
  executiveExplanation: { summary: 'KV Cache 是缓存 KV 的技术，可以提升效率。' },
}
```

退回原因：

- 没有可验证指标或证据来源。
- 评审问题不能推动架构取舍。
- 落地清单无法转换成验收项。
- 管理层解释只复述定义，没有业务价值、风险和控制手段。

### 1.8 草稿与审核文件建议

Content & Validation Agent 草稿文件：

- `content/drafts/decision-guide-A-routing-cache.md`
- `content/drafts/decision-guide-B-token-context-tool.md`
- `content/drafts/decision-guide-C-agent-governance.md`

每个草稿文件顶部必须包含：

```md
> task: DATA-01
> source_spec: docs/ai-engineering-leader-enhancement-p0-specs.md#1-spec-01decisionguide-内容标准
> status: draft
> covered_concepts: multi-model-routing, cost-routing, ...
```

Product Architect / Content Review 输出建议：

- `content/reviewed/decision-guide-A-routing-cache-review.md`
- `content/reviewed/decision-guide-B-token-context-tool-review.md`
- `content/reviewed/decision-guide-C-agent-governance-review.md`

审核结论必须逐 concept 标记 `pass` / `revise` / `reject`，并说明至少一个关键工程判断点。

### 1.9 SCHEMA-01 输入

Implementation Agent 应至少校验：

- `decisionGuide` 可选；存在时内部字段均必填。
- `applicableScenarios.length >= 2`。
- `nonApplicableScenarios.length >= 2`。
- `decisionSignals.length >= 3`。
- `tradeoffs.length >= 3`，且 `dimension` 只能来自枚举。
- `reviewQuestions.length >= 3`。
- `implementationChecklist.length >= 3`，且 `phase` 只能来自枚举。
- `executiveExplanation.summary / businessValue / mainRisk / riskControl` 均非空。
- 所有子项 `id` 在当前 `decisionGuide` 内唯一。
- 复制清单的数据源为 `reviewQuestions[].question` 与 `implementationChecklist[].item + passSignal`，不得从 UI 文案反向拼接。

## 2. SPEC-02：能力域映射标准

### 2.1 能力域枚举

建议 schema 枚举值使用稳定英文 id，UI 显示中文名。

| enum | 中文名 | 定义 | 典型证据 |
|---|---|---|---|
| `modelMechanics` | 模型机制理解 | 理解大模型输入表示、生成机制、能力边界与模型行为原因 | Token、Attention、上下文窗口、采样、幻觉、推理边界 |
| `inferenceCostPerformance` | 推理性能与成本 | 判断推理链路中的延迟、吞吐、显存、缓存、批处理与成本优化 | TTFT、TPOT、Prefill、Decode、KV Cache、量化 |
| `maasPlatformization` | MaaS 与平台化 | 把模型能力封装为企业平台服务，处理网关、路由、SLA、配额、缓存和治理 | MaaS、模型网关、多模型路由、限流熔断、SLA |
| `ragContextEngineering` | RAG 与上下文工程 | 管理 Prompt、上下文窗口、压缩、污染、仓库上下文和知识注入质量 | Prompt、Context、上下文压缩、Repo Context |
| `agentEngineering` | Agent 工程 | 设计 Agent Loop、工具调用、状态、权限、人机协作、多 Agent 与执行边界 | Tool Calling、Skill、Subagent、Multi-agent |
| `evaluationObservability` | 评估与可观测 | 用 Eval、Trace、观测指标、复盘链路和回归检测衡量质量与问题原因 | Eval、Trace、Observability、诊断路径 |
| `securityGovernanceOrg` | 安全治理与组织落地 | 管理权限、数据边界、成本治理、组织机制和 AI 原生研发治理 | 权限治理、Token ROI、AI 原生组织、Human-in-the-loop |

### 2.2 容易混淆的归类规则

| 混淆点 | 主域判断 | 次域判断 |
|---|---|---|
| `kv-cache` vs 平台路由 | 如果核心解释是推理阶段复用与显存 / TTFT，主域为 `inferenceCostPerformance` | 如果强调 Session 亲和和 MaaS 调度，可加 `maasPlatformization` |
| `session-affinity` vs KV Cache | 如果讨论路由如何保持会话落在同一实例，主域为 `maasPlatformization` | 如直接服务于缓存命中，可加 `inferenceCostPerformance` |
| Prompt / Context vs Agent | 如果对象是输入上下文构造与压缩，主域为 `ragContextEngineering` | 如果上下文服务于多轮行动闭环，可加 `agentEngineering` |
| Tool Calling vs 权限治理 | 如果重点是工具协议、参数和执行循环，主域为 `agentEngineering` | 如果重点是权限边界和敏感操作控制，可加 `securityGovernanceOrg` |
| Trace / Observability vs Eval | 线上链路、字段和诊断归 `evaluationObservability` | 如直接涉及敏感数据最小化，可加 `securityGovernanceOrg` |
| Token ROI vs 推理成本 | 如果关注业务价值、预算和治理，主域为 `securityGovernanceOrg` | 如果关注 Token 成本结构，可加 `inferenceCostPerformance` |
| AI 原生组织 vs Agent 工程 | 如果关注团队机制和研发流程，主域为 `securityGovernanceOrg` | 若课程重心是研发 Agent 形态，可加 `agentEngineering` |

### 2.3 映射规则

- 每个 Concept 必须映射 1 到 2 个能力域。
- 必须有且只有一个 `primaryDomain`。
- `secondaryDomain` 可选；只有当该讲明确训练第二类负责人判断时才填写。
- 不允许为了让雷达图平均而强行补第二域。
- 不允许填写枚举外值；非法值应被 `validate:content` 阻断。
- GlossaryTerm 可映射 0 到 2 个能力域：核心术语建议映射；通用辅助术语可暂不映射。

推荐 Concept 字段：

```ts
capabilityDomains: {
  primary: CapabilityDomain;
  secondary?: CapabilityDomain;
}
```

推荐 GlossaryTerm 字段：

```ts
capabilityDomains?: CapabilityDomain[];
```

### 2.4 56 讲映射草案判定准则

DATA-04 应覆盖全部 56 讲，输出草案时使用如下表头：

```md
| conceptId | title | primaryDomain | secondaryDomain | reason |
|---|---|---|---|---|
```

建议起始映射如下，Content & Validation Agent 可在草案中补充 `reason` 并由 Product Architect 审核。

| conceptId | primaryDomain | secondaryDomain |
|---|---|---|
| token | `modelMechanics` |  |
| semantic-space | `modelMechanics` |  |
| transformer | `modelMechanics` |  |
| attention | `modelMechanics` |  |
| positional-encoding | `modelMechanics` |  |
| autoregressive | `modelMechanics` |  |
| sampling | `modelMechanics` |  |
| instruction-tuning | `modelMechanics` | `evaluationObservability` |
| hallucination | `modelMechanics` | `evaluationObservability` |
| reasoning-limit | `modelMechanics` | `securityGovernanceOrg` |
| prefill | `inferenceCostPerformance` |  |
| decode | `inferenceCostPerformance` |  |
| ttft | `inferenceCostPerformance` |  |
| tpot | `inferenceCostPerformance` |  |
| kv-cache | `inferenceCostPerformance` | `maasPlatformization` |
| session-affinity | `maasPlatformization` | `inferenceCostPerformance` |
| batch-scheduling | `inferenceCostPerformance` | `maasPlatformization` |
| pd-separation | `inferenceCostPerformance` | `maasPlatformization` |
| speculative-decoding | `inferenceCostPerformance` |  |
| quantization | `inferenceCostPerformance` |  |
| maas | `maasPlatformization` |  |
| model-gateway | `maasPlatformization` | `securityGovernanceOrg` |
| multi-model-routing | `maasPlatformization` | `inferenceCostPerformance` |
| cost-routing | `maasPlatformization` | `inferenceCostPerformance` |
| capability-routing | `maasPlatformization` | `securityGovernanceOrg` |
| cache-system | `maasPlatformization` | `inferenceCostPerformance` |
| rate-limit-circuit-break | `maasPlatformization` | `securityGovernanceOrg` |
| sla | `maasPlatformization` | `evaluationObservability` |
| prompt-context | `ragContextEngineering` |  |
| system-prompt | `ragContextEngineering` | `securityGovernanceOrg` |
| context-window | `ragContextEngineering` | `modelMechanics` |
| context-compression | `ragContextEngineering` | `inferenceCostPerformance` |
| context-pollution | `ragContextEngineering` | `securityGovernanceOrg` |
| layered-session | `ragContextEngineering` | `agentEngineering` |
| agents-md | `agentEngineering` | `securityGovernanceOrg` |
| repo-context | `ragContextEngineering` | `agentEngineering` |
| spec-driven-development | `agentEngineering` | `securityGovernanceOrg` |
| agent-loop | `agentEngineering` |  |
| tool-calling | `agentEngineering` | `securityGovernanceOrg` |
| skill | `agentEngineering` |  |
| subagent | `agentEngineering` |  |
| memory | `agentEngineering` | `ragContextEngineering` |
| human-in-the-loop | `securityGovernanceOrg` | `agentEngineering` |
| multi-agent | `agentEngineering` | `securityGovernanceOrg` |
| code-review-agent | `agentEngineering` | `evaluationObservability` |
| issue-fix-agent | `agentEngineering` | `evaluationObservability` |
| requirement-decomposition-agent | `agentEngineering` | `ragContextEngineering` |
| test-generation-agent | `agentEngineering` | `evaluationObservability` |
| ops-diagnosis-agent | `agentEngineering` | `evaluationObservability` |
| value-review-agent | `evaluationObservability` | `securityGovernanceOrg` |
| eval | `evaluationObservability` |  |
| trace | `evaluationObservability` | `securityGovernanceOrg` |
| observability | `evaluationObservability` |  |
| token-roi | `securityGovernanceOrg` | `inferenceCostPerformance` |
| permission-governance | `securityGovernanceOrg` | `agentEngineering` |
| ai-native-org | `securityGovernanceOrg` | `agentEngineering` |

### 2.5 能力域得分

Phase 1 默认计分：

```text
domainScore = completionScore * 0.7 + diagnosticScore * 0.3
```

定义：

- `completionScore`：该能力域内已完成概念数 / 该能力域概念总数。
- 主域概念权重为 1.0。
- 次域概念权重为 0.5。
- 分母同样按权重计算，避免跨域概念重复把总量放大。
- `diagnosticScore`：该能力域关联诊断题的正确率；错题可来自 `wrongQuestionIds` 与已完成题记录。若当前 store 只能识别错题而没有完整作答次数，Implementation 可先用“已完成概念中未记录为错题的诊断题比例”作为 Phase 1 近似，并在 UI 文案中标为估算。

冷启动 fallback：

- 当某能力域没有诊断记录时，展示 `completionScore`，不应用 30% 诊断权重。
- UI 标注口径：`诊断样本不足，当前按完成度估算`。
- 不得用 0 分惩罚没有答题记录的能力域。

推荐输出字段：

```ts
export interface CapabilityDomainScore {
  domain: CapabilityDomain;
  completionScore: number; // 0..1
  diagnosticScore?: number; // 0..1
  finalScore: number; // 0..1
  confidence: 'low' | 'medium' | 'high';
  completedWeightedCount: number;
  totalWeightedCount: number;
}
```

置信度建议：

- `low`：无诊断记录。
- `medium`：有 1 到 2 条诊断记录。
- `high`：有 3 条及以上诊断记录。

### 2.6 角色路径模板

Phase 1 固定 4 条本地模板，不支持用户自定义，不引入账号、团队成员、云同步或协作数据。

推荐数据结构：

```ts
export interface RolePath {
  id: 'aiEngineeringLeader' | 'platformEngineer' | 'applicationArchitect' | 'governanceOwner';
  title: string;
  goal: string;
  recommendedConceptIds: string[];
  phases: RolePathPhase[];
}

export interface RolePathPhase {
  id: string;
  title: string;
  conceptIds: string[];
  outcome: string;
}
```

角色路径完成度：

```text
rolePathCompletion = completed concepts in recommendedConceptIds / recommendedConceptIds.length
```

若 concept 同时属于多个角色路径，不需要去重；每条路径独立计算。

#### AI 工程负责人

目标：建立成本、质量、治理、平台化、组织落地的负责人判断框架。

推荐顺序：

`model-gateway`, `multi-model-routing`, `cost-routing`, `capability-routing`, `sla`, `token-roi`, `eval`, `trace`, `observability`, `permission-governance`, `human-in-the-loop`, `ai-native-org`

阶段：

| phase | concept ids | outcome |
|---|---|---|
| 平台取舍 | `model-gateway`, `multi-model-routing`, `cost-routing`, `capability-routing`, `sla` | 能评审模型平台方案的成本、能力和 SLA 边界 |
| 质量复盘 | `eval`, `trace`, `observability` | 能要求团队用证据复盘质量问题 |
| 治理落地 | `token-roi`, `permission-governance`, `human-in-the-loop`, `ai-native-org` | 能把成本、安全和组织机制纳入上线判断 |

#### 平台工程师

目标：掌握 MaaS、路由、缓存、SLA、观测和性能稳定性。

推荐顺序：

`prefill`, `decode`, `ttft`, `tpot`, `kv-cache`, `session-affinity`, `batch-scheduling`, `maas`, `model-gateway`, `multi-model-routing`, `cache-system`, `rate-limit-circuit-break`, `sla`, `observability`

阶段：

| phase | concept ids | outcome |
|---|---|---|
| 推理瓶颈 | `prefill`, `decode`, `ttft`, `tpot`, `kv-cache`, `batch-scheduling` | 能定位推理时延与吞吐瓶颈 |
| 平台路由 | `session-affinity`, `maas`, `model-gateway`, `multi-model-routing`, `cache-system` | 能设计可解释的企业模型网关 |
| 稳定性 | `rate-limit-circuit-break`, `sla`, `observability` | 能建立平台运行期保护和观测 |

#### 应用架构师

目标：掌握 RAG / 上下文 / Agent / 工具调用的应用架构取舍。

推荐顺序：

`prompt-context`, `system-prompt`, `context-window`, `context-compression`, `context-pollution`, `repo-context`, `agent-loop`, `tool-calling`, `memory`, `human-in-the-loop`, `multi-agent`, `eval`

阶段：

| phase | concept ids | outcome |
|---|---|---|
| 上下文设计 | `prompt-context`, `system-prompt`, `context-window`, `context-compression`, `context-pollution`, `repo-context` | 能判断答案质量问题来自上下文还是模型 |
| Agent 闭环 | `agent-loop`, `tool-calling`, `memory`, `human-in-the-loop`, `multi-agent` | 能设计有边界的任务执行闭环 |
| 质量验证 | `eval` | 能为应用方案设计基本评估口径 |

#### 治理负责人

目标：掌握权限、安全、评估、Trace、合规边界和组织机制。

推荐顺序：

`reasoning-limit`, `hallucination`, `system-prompt`, `context-pollution`, `tool-calling`, `human-in-the-loop`, `eval`, `trace`, `observability`, `token-roi`, `permission-governance`, `ai-native-org`

阶段：

| phase | concept ids | outcome |
|---|---|---|
| 风险认知 | `reasoning-limit`, `hallucination`, `system-prompt`, `context-pollution` | 能识别模型与上下文带来的质量和安全边界 |
| 执行边界 | `tool-calling`, `human-in-the-loop`, `permission-governance` | 能评审工具权限和人工确认机制 |
| 运营治理 | `eval`, `trace`, `observability`, `token-roi`, `ai-native-org` | 能建立持续评估、观测和成本治理机制 |

### 2.7 SCHEMA-02 输入

Implementation Agent 应至少校验：

- `CapabilityDomain` 枚举只包含 §2.1 的 7 个值。
- 每个 Concept 必须有 `capabilityDomains.primary`。
- 每个 Concept 最多一个 `secondary`，且不能等于 `primary`。
- GlossaryTerm 的 `capabilityDomains` 可选；存在时长度 1 到 2，且不得重复。
- `rolePaths` 建议放入独立数据文件，例如 `src/data/rolePaths.ts`，不硬编码在组件内。
- 每个 `RolePath.recommendedConceptIds` 至少 8 个，全部必须引用存在的 Concept id。
- `RolePath.phases[].conceptIds` 必须是该路径 `recommendedConceptIds` 的子集。
- Profile / Search / Glossary 共享同一枚举，不得各自维护中文字符串常量。

## 3. SPEC-03：`model-router` 场景演练规格

### 3.1 产品口径

- `model-router` 是独立 `scenarioExercise` 数据类型，不作为既有 `animation.type` 的简单增强。
- 关联知识点：`multi-model-routing`, `cost-routing`, `capability-routing`。
- 入口：从相关知识点的动画 / 演练区进入，不新增一级导航。
- 场景状态：默认会话内状态；如需持久化，Implementation 必须在 DEV-08 前明确扩展 `progressStore.ts`。
- 不调用真实模型 API；所有请求、模型、策略、指标和事件均为本地模拟数据。

### 3.2 场景目标

用户应通过一次完整演练理解：

- 成本下降可能牺牲质量或投诉率。
- SLA 违约可能来自模型选择、上下文长度、升级策略或队列压力。
- 合规高风险请求需要风险路由与拦截策略，不能只按成本路由。
- 模型路由不是单一规则，而是任务类型、风险、上下文长度和 SLA 的组合决策。

### 3.3 推荐数据结构

```ts
export interface ScenarioExercise {
  id: string;
  title: string;
  relatedConceptIds: string[];
  entryConceptIds: string[];
  background: string;
  baseline: ScenarioState;
  requestTypes: ScenarioRequestType[];
  modelPool: ScenarioModel[];
  strategyControls: StrategyControl[];
  events: ScenarioEvent[];
  reviewRubric: ScenarioReviewRubric;
}

export interface ScenarioState {
  selectedStrategies: Record<string, string>;
  metrics: ScenarioMetric[];
  explanation: string;
}

export interface ScenarioRequestType {
  id: string;
  label: string;
  description: string;
  volumeShare: number;
  avgInputTokens: number;
  riskLevel: 'low' | 'medium' | 'high';
  qualityNeed: 'low' | 'medium' | 'high';
  slaMs: number;
}

export interface ScenarioModel {
  id: string;
  label: string;
  type: 'fast' | 'strong' | 'lowCost' | 'restricted';
  costPer1kTokens: number;
  medianLatencyMs: number;
  qualityScore: number;
  riskHandlingScore: number;
  contextLimitTokens: number;
  availability: string;
}

export interface StrategyControl {
  id: string;
  label: string;
  options: StrategyOption[];
}

export interface StrategyOption {
  id: string;
  label: string;
  description: string;
  routingRules: RoutingRule[];
  metricEffects: MetricEffect[];
}

export interface RoutingRule {
  requestTypeId?: string;
  riskLevel?: 'low' | 'medium' | 'high';
  contextCondition?: 'short' | 'medium' | 'long';
  slaCondition?: 'strict' | 'normal';
  targetModelId: string;
  fallbackModelId?: string;
}

export interface MetricEffect {
  metricId: ScenarioMetricId;
  direction: 'up' | 'down' | 'mixed';
  magnitude: 'small' | 'medium' | 'large';
  explanation: string;
}

export type ScenarioMetricId =
  | 'costPer1kRequests'
  | 'p95LatencyMs'
  | 'successRate'
  | 'escalationRate'
  | 'riskInterceptRate'
  | 'qualityComplaintRate';

export interface ScenarioMetric {
  id: ScenarioMetricId;
  label: string;
  value: number;
  unit: string;
  trend: 'better' | 'worse' | 'neutral';
  explanation: string;
}

export interface ScenarioEvent {
  id: string;
  title: string;
  symptom: string;
  triggerStrategyOptionIds: string[];
  correctDiagnosis: string;
  investigationOrder: string[];
  missedRisks: string[];
  relatedConceptIds: string[];
}

export interface ScenarioReviewRubric {
  prompt: string;
  requiredFindings: string[];
  acceptableActions: string[];
  nextStepRecommendations: string[];
}
```

### 3.4 请求类型

| id | label | volumeShare | avgInputTokens | riskLevel | qualityNeed | slaMs | 路由含义 |
|---|---|---:|---:|---|---|---:|---|
| `simpleQa` | 简单问答 | 0.42 | 900 | low | medium | 1500 | 适合快模型或低成本模型，重点控制成本和延迟 |
| `longSummary` | 长文总结 | 0.23 | 12000 | medium | high | 6000 | 需要上下文容量和质量，低成本模型可能压缩失败 |
| `codeGeneration` | 代码生成 | 0.20 | 4500 | medium | high | 8000 | 对质量和成功率敏感，可接受更高延迟 |
| `complianceHighRisk` | 合规高风险请求 | 0.15 | 2500 | high | high | 5000 | 必须优先风险处理和权限边界，不能只按成本路由 |

### 3.5 模型池

| id | label | type | costPer1kTokens | medianLatencyMs | qualityScore | riskHandlingScore | contextLimitTokens | availability |
|---|---|---|---:|---:|---:|---:|---:|---|
| `fast-general` | 快模型 | fast | 0.6 | 800 | 0.72 | 0.60 | 16000 | 高并发可用 |
| `strong-reasoning` | 强模型 | strong | 3.8 | 2400 | 0.92 | 0.82 | 64000 | 配额有限 |
| `economy-small` | 低成本模型 | lowCost | 0.25 | 1100 | 0.62 | 0.45 | 8000 | 高并发可用 |
| `restricted-compliance` | 受限 / 合规模型 | restricted | 2.2 | 1800 | 0.84 | 0.95 | 32000 | 仅合规与高风险流量 |

### 3.6 可调策略项

至少实现 3 个策略控件；Phase 2 可以从以下 4 个中取 3 到 4 个。

#### `taskRoutingMode`：任务类型路由

| option | 规则 | 指标影响 |
|---|---|---|
| `costFirst` | 简单问答、长文总结优先 `economy-small`；代码生成走 `fast-general`；高风险走 `restricted-compliance` | 成本下降；长文质量投诉上升；成功率下降 |
| `balanced` | 简单问答走 `fast-general`；长文和代码走 `strong-reasoning`；高风险走 `restricted-compliance` | 成本中等；质量稳定；P95 上升可控 |
| `qualityFirst` | 除简单问答外均优先 `strong-reasoning`，高风险仍走 `restricted-compliance` | 质量上升；成本和 P95 上升；升级率下降 |

#### `riskRoutingMode`：风险等级路由

| option | 规则 | 指标影响 |
|---|---|---|
| `minimalGuard` | 只把 high risk 路由到合规模型 | 成本较低；中风险误放行增加；风险拦截率下降 |
| `standardGuard` | medium / high risk 均检查，high risk 强制合规模型 | 风险拦截率稳定；成本小幅上升 |
| `strictGuard` | medium / high risk 均优先合规模型或人工升级 | 风险拦截率上升；升级率和 P95 上升；可能过度拦截 |

#### `contextSlaMode`：上下文长度 / SLA 路由

| option | 规则 | 指标影响 |
|---|---|---|
| `ignoreContext` | 不按上下文长度区分模型 | 成本低；长文失败率和投诉率上升 |
| `contextAware` | 长上下文请求避开 `economy-small`，必要时升级 `strong-reasoning` | 成功率和质量上升；成本上升 |
| `slaAware` | 严格 SLA 请求优先 `fast-general`，超长上下文请求再升级 | P95 下降；部分复杂任务质量下降 |

#### `fallbackMode`：失败回退策略

| option | 规则 | 指标影响 |
|---|---|---|
| `noFallback` | 模型失败后直接返回失败 | 成本最低；成功率下降 |
| `retrySame` | 同模型重试一次 | 成功率小幅上升；成本和 P95 上升；质量不一定改善 |
| `escalateOnFailure` | 失败后升级到强模型或合规模型 | 成功率上升；成本、升级率和 P95 上升 |

### 3.7 指标与计算边界

必须至少展示 5 个指标，建议实现 6 个：

| metric id | label | 单位 | 趋势解释 |
|---|---|---|---|
| `costPer1kRequests` | 每千请求成本 | 模拟成本点 | 越低越好，但不能单独作为成功标准 |
| `p95LatencyMs` | P95 延迟 | ms | 越低越好，但质量优先策略可能提高 |
| `successRate` | 成功率 | % | 越高越好，受模型能力、上下文和回退策略影响 |
| `escalationRate` | 升级率 | % | 不是绝对越低越好；过低可能误放行，过高可能成本过大 |
| `riskInterceptRate` | 风险拦截率 | % | 对高风险请求越高越好，但 strict 模式可能过度拦截 |
| `qualityComplaintRate` | 质量投诉率 | % | 越低越好，帮助解释“成本下降但投诉升高” |

模拟计算原则：

- 使用可解释加权规则即可，不追求真实数学模型。
- 每类请求按 `volumeShare` 加权。
- 模型选择先由策略规则决定，再叠加 fallback / escalation。
- 成本估算可按 `avgInputTokens * costPer1kTokens * volumeShare` 近似。
- P95 可用所选模型延迟、长上下文惩罚、重试 / 升级惩罚叠加。
- 成功率由模型 `qualityScore`、上下文是否超限、fallback 策略共同决定。
- 风险拦截率由请求 `riskLevel`、模型 `riskHandlingScore` 和风险策略决定。
- 每次指标变化必须展示解释文本，解释文本来源于 `metricEffects` 与计算函数输出，不从 UI 硬编码。

### 3.8 异常事件

至少提供 3 个事件；建议内置 4 个，支持后续扩展。

| id | title | symptom | 触发条件 | 正确诊断 |
|---|---|---|---|---|
| `costDownComplaintsUp` | 成本下降但投诉升高 | 成本明显下降，质量投诉率上升，长文总结成功率下降 | `taskRoutingMode=costFirst` 且 `contextSlaMode=ignoreContext` | 低成本模型承接了超出能力或上下文容量的任务 |
| `slaBreach` | SLA 违约 | P95 延迟超过目标，升级率和重试率上升 | `qualityFirst` 或 `strictGuard` 叠加 `escalateOnFailure` | 高质量 / 严格治理策略缺少 SLA 分层 |
| `riskLeak` | 风险请求误放行 | 风险拦截率下降，高风险请求被普通模型处理 | `riskRoutingMode=minimalGuard` | 风险等级没有作为硬路由条件 |
| `overBlocking` | 过度拦截 | 风险拦截率高但升级率过高，正常请求被拖慢 | `riskRoutingMode=strictGuard` 且所有 medium risk 升级 | 治理策略过严，缺少风险分层和人工升级边界 |

每个事件的复盘结构必须包含：

- `correctDiagnosis`：一句话原因。
- `investigationOrder`：3 到 5 步排查顺序。
- `missedRisks`：用户可能忽略的 2 到 4 个风险。
- `relatedConceptIds`：至少 2 个，必须存在。
- `nextStepRecommendations`：2 到 3 条下一步建议。

### 3.9 用户流程

1. 用户从 `multi-model-routing` / `cost-routing` / `capability-routing` 的演练入口进入。
2. 看到业务背景、初始请求分布、模型池和 baseline 指标。
3. 系统显示一个异常事件，例如 `成本下降但投诉升高`。
4. 用户查看请求类型、模型池、当前策略与指标解释。
5. 用户调整 1 到 3 个策略项。
6. 指标实时更新，并展示每个变化的原因。
7. 用户提交诊断结论。
8. 系统展示复盘：正确原因、排查顺序、遗漏风险、关联知识点、下一步建议。

### 3.10 诊断复盘样例

事件：`costDownComplaintsUp`

```ts
{
  correctDiagnosis: '成本优先策略把长文总结和部分代码生成流量压到低成本模型，导致上下文容量和质量能力不足。',
  investigationOrder: [
    '先按请求类型拆分成本、成功率和投诉率，不看整体平均值。',
    '检查长文总结是否被路由到 contextLimitTokens 不足的模型。',
    '对比 costFirst 与 balanced 策略下的质量投诉率和 P95。',
    '确认是否有 fallback 或升级策略兜住失败请求。',
  ],
  missedRisks: [
    '整体成本下降可能掩盖高价值任务质量下降。',
    '长上下文请求不能只按平均延迟和单价路由。',
    '投诉率上升会抵消表面 Token 成本节省。',
  ],
  relatedConceptIds: ['cost-routing', 'capability-routing', 'context-window', 'token-roi'],
  nextStepRecommendations: [
    '将长文总结从低成本模型迁回强模型或上下文感知路由。',
    '为高价值任务设置质量底线，而不是只按成本排序。',
    '把投诉率和成功率纳入路由策略评审。',
  ],
}
```

### 3.11 DATA-06 输入

Content & Validation Agent 应产出：

- `content/drafts/model-router-scenario-data.md`
- 至少 4 类请求、4 类模型、3 个策略项、5 个指标、3 个异常事件。
- 每个策略选项都要写清 `routingRules` 和 `metricEffects`。
- 至少 3 个诊断结论样例，覆盖成本、SLA、风险治理三类事件。
- 不得包含真实客户、真实成本、真实模型供应商敏感数据。

### 3.12 SCHEMA-03 / DEV-06 输入

Implementation Agent 应至少校验：

- `ScenarioExercise.id` 唯一，建议首个为 `model-router`.
- `relatedConceptIds` 与 `entryConceptIds` 均引用存在的 Concept id。
- `requestTypes.length >= 4`。
- `modelPool.length >= 4`。
- `strategyControls.length >= 3`，每个至少 2 个 option。
- 指标必须覆盖 `costPer1kRequests`, `p95LatencyMs`, `successRate`, `escalationRate`, `riskInterceptRate`。
- `events.length >= 3`，每个事件必须有 `correctDiagnosis`, `investigationOrder`, `missedRisks`, `relatedConceptIds`。
- 计算函数应为纯函数：输入 `ScenarioExercise` 与 selected strategy options，输出 metrics 和 explanations。
- 测试至少覆盖 4 组策略：默认均衡、成本优先、质量优先、SLA / 风险优先。

## 4. P0 完成后的解锁条件

完成本规格后：

- `SCHEMA-01` 可基于 SPEC-01 启动。
- `SCHEMA-02` 可基于 SPEC-02 启动。
- `DATA-01` / `DATA-02` / `DATA-03` 可基于 SPEC-01 启动。
- `DATA-04` / `DATA-05` 可基于 SPEC-02 启动。
- `SCHEMA-03` 与 `DATA-06` 可基于 SPEC-03 启动；正式实现仍进入 Phase 2。

仍需保持的阻塞：

- `DEV-01` 仍依赖 SCHEMA-01、SCHEMA-02、REVIEW-01/02/03、DATA-04、DATA-05。
- `DEV-05` 仍依赖 SCHEMA-03、DATA-06。
- 任意入库任务都不得跳过 reviewed 内容与校验脚本。
