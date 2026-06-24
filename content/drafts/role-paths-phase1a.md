> task: DATA-05
> source_spec: docs/ai-engineering-leader-enhancement-p0-specs.md#26-角色路径模板
> status: draft

# Phase 1A 角色学习路径模板草案

本草案固定 4 条本地模板，不引入账号、团队成员、云同步或协作数据。每条路径独立计算完成度：`completed concepts in recommendedConceptIds / recommendedConceptIds.length`。

## AI 工程负责人

- id: `aiEngineeringLeader`
- goal: 建立成本、质量、治理、平台化、组织落地的负责人判断框架。
- recommendedConceptIds: `model-gateway`, `multi-model-routing`, `cost-routing`, `capability-routing`, `sla`, `token-roi`, `eval`, `trace`, `observability`, `permission-governance`, `human-in-the-loop`, `ai-native-org`

| phase | conceptIds | outcome |
|---|---|---|
| 平台取舍 | `model-gateway`, `multi-model-routing`, `cost-routing`, `capability-routing`, `sla` | 能评审模型平台方案的成本、能力和 SLA 边界。 |
| 质量复盘 | `eval`, `trace`, `observability` | 能要求团队用证据复盘质量问题。 |
| 治理落地 | `token-roi`, `permission-governance`, `human-in-the-loop`, `ai-native-org` | 能把成本、安全和组织机制纳入上线判断。 |

## 平台工程师

- id: `platformEngineer`
- goal: 掌握 MaaS、路由、缓存、SLA、观测和性能稳定性。
- recommendedConceptIds: `prefill`, `decode`, `ttft`, `tpot`, `kv-cache`, `session-affinity`, `batch-scheduling`, `maas`, `model-gateway`, `multi-model-routing`, `cache-system`, `rate-limit-circuit-break`, `sla`, `observability`

| phase | conceptIds | outcome |
|---|---|---|
| 推理瓶颈 | `prefill`, `decode`, `ttft`, `tpot`, `kv-cache`, `batch-scheduling` | 能定位推理时延与吞吐瓶颈。 |
| 平台路由 | `session-affinity`, `maas`, `model-gateway`, `multi-model-routing`, `cache-system` | 能设计可解释的企业模型网关。 |
| 稳定性 | `rate-limit-circuit-break`, `sla`, `observability` | 能建立平台运行期保护和观测。 |

## 应用架构师

- id: `applicationArchitect`
- goal: 掌握 RAG / 上下文 / Agent / 工具调用的应用架构取舍。
- recommendedConceptIds: `prompt-context`, `system-prompt`, `context-window`, `context-compression`, `context-pollution`, `repo-context`, `agent-loop`, `tool-calling`, `memory`, `human-in-the-loop`, `multi-agent`, `eval`

| phase | conceptIds | outcome |
|---|---|---|
| 上下文设计 | `prompt-context`, `system-prompt`, `context-window`, `context-compression`, `context-pollution`, `repo-context` | 能判断答案质量问题来自上下文还是模型。 |
| Agent 闭环 | `agent-loop`, `tool-calling`, `memory`, `human-in-the-loop`, `multi-agent` | 能设计有边界的任务执行闭环。 |
| 质量验证 | `eval` | 能为应用方案设计基本评估口径。 |

## 治理负责人

- id: `governanceOwner`
- goal: 掌握权限、安全、评估、Trace、合规边界和组织机制。
- recommendedConceptIds: `reasoning-limit`, `hallucination`, `system-prompt`, `context-pollution`, `tool-calling`, `human-in-the-loop`, `eval`, `trace`, `observability`, `token-roi`, `permission-governance`, `ai-native-org`

| phase | conceptIds | outcome |
|---|---|---|
| 风险认知 | `reasoning-limit`, `hallucination`, `system-prompt`, `context-pollution` | 能识别模型与上下文带来的质量和安全边界。 |
| 执行边界 | `tool-calling`, `human-in-the-loop`, `permission-governance` | 能评审工具权限和人工确认机制。 |
| 运营治理 | `eval`, `trace`, `observability`, `token-roi`, `ai-native-org` | 能建立持续评估、观测和成本治理机制。 |

## 覆盖校验

- 角色路径数：4。
- 每条路径知识点数：AI 工程负责人 12，平台工程师 14，应用架构师 12，治理负责人 12。
- 所有 concept id 均来自 56 讲登记表。
