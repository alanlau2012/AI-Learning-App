> task: DATA-04
> source_spec: docs/ai-engineering-leader-enhancement-p0-specs.md#2-spec-02能力域映射标准
> status: draft

# 56 讲能力域映射草案

能力域枚举仅使用 SPEC-02 固化的 7 个值：`modelMechanics`、`inferenceCostPerformance`、`maasPlatformization`、`ragContextEngineering`、`agentEngineering`、`evaluationObservability`、`securityGovernanceOrg`。

| conceptId | title | primaryDomain | secondaryDomain | reason |
|---|---|---|---|---|
| token | Token | `modelMechanics` |  | 训练输入表示和 Token 粒度的机制理解。 |
| semantic-space | 词向量与语义空间 | `modelMechanics` |  | 解释模型如何表达语义相似性。 |
| transformer | Transformer | `modelMechanics` |  | 核心模型结构与能力边界。 |
| attention | 注意力机制 | `modelMechanics` |  | 解释模型在上下文中分配关注。 |
| positional-encoding | 位置编码 | `modelMechanics` |  | 解释顺序信息如何进入模型。 |
| autoregressive | 自回归生成 | `modelMechanics` |  | 解释逐 Token 生成机制。 |
| sampling | 采样策略 | `modelMechanics` |  | 解释生成随机性与稳定性的机制。 |
| instruction-tuning | 指令微调与偏好优化 | `modelMechanics` | `evaluationObservability` | 主要是模型对齐机制，同时需要用评估验证行为。 |
| hallucination | 幻觉 | `modelMechanics` | `evaluationObservability` | 主要训练模型能力边界，同时需要评估与复盘。 |
| reasoning-limit | 推理能力边界 | `modelMechanics` | `securityGovernanceOrg` | 主要是能力边界，也影响高风险场景治理。 |
| prefill | Prefill | `inferenceCostPerformance` |  | 推理阶段性能瓶颈。 |
| decode | Decode | `inferenceCostPerformance` |  | 生成阶段吞吐与延迟。 |
| ttft | TTFT | `inferenceCostPerformance` |  | 首字延迟指标与体验。 |
| tpot | TPOT | `inferenceCostPerformance` |  | 输出吞吐指标。 |
| kv-cache | KV Cache | `inferenceCostPerformance` | `maasPlatformization` | 主要优化 Prefill/TTFT，同时依赖平台路由。 |
| session-affinity | Session 亲和 | `maasPlatformization` | `inferenceCostPerformance` | 主要是平台路由策略，同时影响缓存命中和 TTFT。 |
| batch-scheduling | Batch 调度 | `inferenceCostPerformance` | `maasPlatformization` | 主要是吞吐调度，也属于平台运行策略。 |
| pd-separation | P-D 分离 | `inferenceCostPerformance` | `maasPlatformization` | 主要优化推理链路，也改变平台资源池。 |
| speculative-decoding | 投机解码 | `inferenceCostPerformance` |  | 解码性能优化。 |
| quantization | 量化 | `inferenceCostPerformance` |  | 成本、显存与性能优化。 |
| maas | MaaS | `maasPlatformization` |  | 企业模型服务化与平台化基础。 |
| model-gateway | 模型网关 | `maasPlatformization` | `securityGovernanceOrg` | 平台入口与权限、审计边界。 |
| multi-model-routing | 多模型路由 | `maasPlatformization` | `inferenceCostPerformance` | 平台路由核心，同时影响成本和延迟。 |
| cost-routing | 成本路由 | `maasPlatformization` | `inferenceCostPerformance` | 平台策略主域，目标是成本性能优化。 |
| capability-routing | 能力路由 | `maasPlatformization` | `securityGovernanceOrg` | 模型能力分发，同时处理高风险流量边界。 |
| cache-system | 缓存体系 | `maasPlatformization` | `inferenceCostPerformance` | 平台缓存设计，同时影响成本和延迟。 |
| rate-limit-circuit-break | 限流熔断 | `maasPlatformization` | `securityGovernanceOrg` | 平台稳定性保护，也服务治理边界。 |
| sla | SLA 保障 | `maasPlatformization` | `evaluationObservability` | 平台承诺需要指标与观测验证。 |
| prompt-context | Prompt 与 Context | `ragContextEngineering` |  | 输入和上下文构造基础。 |
| system-prompt | 系统提示词 | `ragContextEngineering` | `securityGovernanceOrg` | 上下文规则主域，同时涉及安全边界。 |
| context-window | 上下文窗口 | `ragContextEngineering` | `modelMechanics` | 上下文工程主域，也依赖模型窗口机制。 |
| context-compression | 上下文压缩 | `ragContextEngineering` | `inferenceCostPerformance` | 上下文质量和 Token 成本共同影响。 |
| context-pollution | 上下文污染 | `ragContextEngineering` | `securityGovernanceOrg` | 上下文质量风险，也涉及治理边界。 |
| layered-session | 分层会话 | `ragContextEngineering` | `agentEngineering` | 会话上下文管理，并服务 Agent 多步状态。 |
| agents-md | AGENTS.md | `agentEngineering` | `securityGovernanceOrg` | Agent 工作边界与仓库治理说明。 |
| repo-context | 仓库上下文 | `ragContextEngineering` | `agentEngineering` | 仓库材料组织，同时服务代码 Agent。 |
| spec-driven-development | 规格驱动开发 | `agentEngineering` | `securityGovernanceOrg` | Agent 研发流程，同时约束组织交付边界。 |
| agent-loop | Agent Loop | `agentEngineering` |  | Agent 多步闭环核心。 |
| tool-calling | 工具调用 | `agentEngineering` | `securityGovernanceOrg` | 工具协议主域，同时涉及权限和副作用。 |
| skill | Skill | `agentEngineering` |  | Agent 能力封装。 |
| subagent | Subagent | `agentEngineering` |  | 子 Agent 分工和执行。 |
| memory | 记忆 | `agentEngineering` | `ragContextEngineering` | Agent 状态主域，也涉及上下文持续化。 |
| human-in-the-loop | Human-in-the-loop | `agentEngineering` | `securityGovernanceOrg` | 人工接管主域，同时是治理控制点。 |
| multi-agent | 多 Agent 协作 | `agentEngineering` | `evaluationObservability` | 多 Agent 编排主域，需要观测协作质量。 |
| code-review-agent | Code Review Agent | `agentEngineering` | `evaluationObservability` | 代码审查 Agent 形态，并需要质量评估。 |
| issue-fix-agent | Issue Fix Agent | `agentEngineering` | `evaluationObservability` | 修复闭环 Agent，需验证结果。 |
| requirement-decomposition-agent | 需求拆解 Agent | `agentEngineering` | `ragContextEngineering` | 需求拆解 Agent，依赖规格上下文。 |
| test-generation-agent | 测试生成 Agent | `agentEngineering` | `evaluationObservability` | 测试 Agent 输出必须可评估。 |
| ops-diagnosis-agent | 运维诊断 Agent | `agentEngineering` | `evaluationObservability` | 诊断 Agent 需要 Trace 和指标证据。 |
| value-review-agent | 价值复盘 Agent | `evaluationObservability` | `securityGovernanceOrg` | 价值复盘主域，服务组织治理。 |
| eval | Eval | `evaluationObservability` |  | 质量评估核心。 |
| trace | Trace | `evaluationObservability` | `securityGovernanceOrg` | 链路诊断主域，同时需敏感数据最小化。 |
| observability | Observability | `evaluationObservability` |  | 观测指标与复盘。 |
| token-roi | Token ROI | `securityGovernanceOrg` | `inferenceCostPerformance` | 成本治理主域，同时涉及 Token 成本结构。 |
| permission-governance | 权限治理 | `securityGovernanceOrg` | `agentEngineering` | 权限边界主域，约束 Agent 工具执行。 |
| ai-native-org | AI 原生组织阵型 | `securityGovernanceOrg` | `agentEngineering` | 组织机制主域，并涉及 Agent 化研发模式。 |

## 覆盖校验

- 总行数：56 个 Concept。
- 空映射：0。
- 每讲能力域数：1 到 2。
- 非 SPEC-02 枚举：0。
