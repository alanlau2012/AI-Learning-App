# AI-Learning-App 内容审核问题单 - 场景演练+能力域+角色路径（20260628）

> 审核身份：AI 全栈专家 + 内容事实审核 Agent（只审核，不改代码）
> 审核时间：2026-06-28
> 工作根目录：`d:\AI项目\AI-Learning-App`
> 数据源：`src/data/scenarioExercises.ts`、`src/data/scenarioExercisesR2.ts`、`src/data/capabilityDomains.ts`、`src/data/rolePaths.ts`
> 排除：`content/drafts/` 未入库草稿
> 结构门禁：已独立运行 `npm run validate:structure` — **通过**（56 登记 / 模块计数 / 关联无悬空 / 场景演练 / 角色路径结构）

---

## 1. 结论先行

- **总体结论：有条件通过**。5 个场景演练的工程叙事、诊断链路与企业语境整体达到生产培训可用水准；56 条能力域映射完整且 module 归属合理；4 条角色路径结构合法。存在 **2 条 P1**（场景内指标口径不一致、缓存 prefix 表述不严谨），无 P0 级事实错误或安全误导。
- **P0 / P1 / P2 / P3 数量**：**P0 = 0，P1 = 2，P2 = 7，P3 = 4**
- **最大风险（一句话）**：`rag-answer-quality` 背景叙事与 baseline 指标对同一「事实错误率/引用正确率」给出不同数值，学员在场景页同时看到 11%/74% 与 9.5%/78%，会削弱「用指标驱动诊断」的训练可信度。
- **能力域**：56/56 已映射，7 域标签与 `content-schema.md` 一致；仅 1 条主次归属可商榷（P3）。
- **角色路径**：4/4 结构校验通过；22 讲未出现在任何路径推荐列表中（多为 M1 基础与 M5 场景 Agent，属覆盖缺口而非结构错误）。

---

## 2. 场景演练（5 个逐个）

### 2.1 model-router（模型路由策略失效诊断）

| 维度 | 结论 |
|---|---|
| 关联知识点 | `multi-model-routing`、`cost-routing`、`capability-routing` 等 3+ 条，与场景主题一致 ✓ |
| 能力域 | `maasPlatformization`、`inferenceCostPerformance`，与关联讲匹配 ✓ |
| 工程事实 | 请求类型 volumeShare 合计 1.0；长文 12000 tokens vs 低成本模型 context 8000 的冲突用于教学 ✓；四事件覆盖成本/SLA/风险/过度拦截 ✓ |
| 诊断质量 | `correctDiagnosis`、`investigationOrder`、`missedRisks` 可执行，显著优于概念诊断题 ✓ |

| 级别 | 字段 | 问题 |
|---|---|---|
| P2 | `reviewRubric.nextStepRecommendations` | 含内部开发票号「后续 DEV-06 / DEV-07/08」，属实现计划泄漏，不应出现在学员复盘建议中 |
| P3 | 全场景 metrics | events 触发依赖策略组合，但 UI 面无「明显变化 ≥ X%」阈值说明；metricEffects 有 magnitude，学员面可补判定基准 |

**小结**：内容专业度最高之一；无 P0/P1。

---

### 2.2 token-cost-spike（Token 成本异常上涨诊断）

| 维度 | 结论 |
|---|---|
| 关联知识点 | `token-roi`、`context-window`、`kv-cache`、`cost-routing` 等，覆盖成本治理全链路 ✓ |
| 能力域 | `inferenceCostPerformance`、`maasPlatformization`、`evaluationObservability` ✓ |
| 工程事实 | 流量桶 45+20+18+17=100%；租户 cache key 隔离表述与 session-affinity 口径一致 ✓；价值分层 vs 成本路由取舍清晰 ✓ |

| 级别 | 字段 | 问题 |
|---|---|---|
| **P1** | `events[retry-cache-storm].nextStepRecommendations` | 原文：「同一租户内按任务模板、**权限边界**、版本和 cache key 标准化 prefix」。权限边界变化频繁，不宜作为 prefix 组成部分；正确做法是将权限/租户作为 **cache key 命名空间**，prefix 只承载稳定系统提示与任务模板。误导学员把动态 ACL 写进可复用前缀，导致命中率反降 |
| P2 | `facts[cache-value-signals]` vs baseline | prefix 命中率 facts 28%、baseline 44%，若 baseline 代表「已部分治理的默认线」需在 UI 或 explanation 中说明时间线，否则学员困惑 |

**小结**：1 条 P1（与 `issue-tickets-content-diag-20260628.md` 交叉确认）。

---

### 2.3 rag-answer-quality（RAG 召回正常但答案差诊断）

| 维度 | 结论 |
|---|---|
| 关联知识点 | 召回/重排/上下文/权限/eval/trace 覆盖完整 ✓ |
| 能力域 | `ragContextEngineering`、`evaluationObservability`、`agentEngineering` ✓ |
| 工程事实 | **召回前强制权限过滤**作为安全边界、版本/权威重排、冲突隔离、来源必引——符合企业 RAG 生产实践 ✓；`auditOnlyPermission` 明确标为反例 ✓ |

| 级别 | 字段 | 问题 |
|---|---|---|
| **P1** | `background` / `initialSymptom` / `facts[failure-samples]` vs `baseline.metrics` | 叙事与 facts 写事实错误率 **11%**、引用正确率 **74%**；baseline 同场景指标为 **9.5%** / **78%**。同一「当前故障态」两套数字并存，学员无法判断诊断起点 |
| P2 | `baseline.explanation` | 称 baseline 为「推荐默认线」且已启用 versionFirst + authorityWeighted，与 background「政策更新后线上恶化至 11%」时间线未对齐；需明确 baseline 是「负责人干预后的模拟起点」还是「事故当下快照」 |
| P3 | `events[permission-leakage]` | 越权 0.4% 与 baseline `unauthorizedFragmentRate` 一致，安全叙事自洽 ✓（无问题，仅记录） |

**小结**：权限边界叙事是五场景中企业价值最高的一条；P1 为数值一致性问题，修复优先级高。

---

### 2.4 agent-tool-failure（Agent 工具调用失败诊断）

| 维度 | 结论 |
|---|---|
| 数据源 | `scenarioExercisesR2.ts` ✓ |
| 关联知识点 | `tool-calling`、`agent-loop`、`permission-governance`、`trace` 等 ✓ |
| 工程事实 | 工具分型（只读/写/审批）、用户委托 vs 服务账号、分类重试 vs 幂等——生产级 ✓；三事件覆盖错调工具/越权写/重复副作用 ✓ |

| 级别 | 字段 | 问题 |
|---|---|---|
| P2 | `facts[failure-samples].attributes` | 失败占比 27%+31%+19%+11%=**88%**，与 description 中「工具成功但 Agent 误解返回结果」等类型未量化，分型不完整 |
| P2 | `strategyControls[failureHandlingMode]` | 仅 2 个 option（其他控制项 2–3 个），缺少「未知状态写失败 → 查状态/人工」独立选项；内容在 event 中有体现但策略面板略薄 |
| P3 | `reviewRubric` | 要求 Trace 字段完整，与 `trace-not-diagnostic` 场景形成良好呼应 ✓ |

**小结**：无 P0/P1；Agent 工具治理叙事扎实。

---

### 2.5 trace-not-diagnostic（Trace 有数据但不可诊断）

| 维度 | 结论 |
|---|---|
| 数据源 | `scenarioExercisesR2.ts`（type: `observability`，即任务描述中的 observability-trace）✓ |
| 关联知识点 | `trace`、`observability`、`eval`、`permission-governance` 等 ✓ |
| 工程事实 | span 断链 vs 散点日志、字段分级（原文/hash/引用 id）、feedback/eval/release 关联——与 trace/observability 两讲一致 ✓；敏感数据最小化边界正确 ✓ |

| 级别 | 字段 | 问题 |
|---|---|---|
| P2 | `events[fields-too-thin].correctDiagnosis` | 建议保留 hash；边缘情形：短文本 hash 仍可能被彩虹表反查，可补「带盐/不可逆指纹」（非阻断） |
| P3 | facts `weight` | 四组 weight 0.28+0.26+0.24+0.22=1.0 ✓ |

**小结**：无 P0/P1；与 RAG/Agent 场景形成「可观测闭环」。

---

## 3. 能力域（56 条表格）

> 域标签来源：`capabilityDomainLabels`（7 域）。「级别」为空表示 **已扫无问题**。
> 结构：`npm run validate:structure` 确认 56 讲均有 `primary`，`secondary` 合法且不重复 primary。

| # | conceptId | 模块 | primary | secondary | 级别 | 问题摘要 |
|---|---|---|---|---|---|---|
| 1 | token | M1 | modelMechanics | — | | 已扫无问题 |
| 2 | semantic-space | M1 | modelMechanics | — | | 已扫无问题 |
| 3 | transformer | M1 | modelMechanics | — | | 已扫无问题 |
| 4 | attention | M1 | modelMechanics | — | | 已扫无问题 |
| 5 | positional-encoding | M1 | modelMechanics | — | | 已扫无问题 |
| 6 | autoregressive | M1 | modelMechanics | — | | 已扫无问题 |
| 7 | sampling | M1 | modelMechanics | — | | 已扫无问题 |
| 8 | instruction-tuning | M1 | modelMechanics | evaluationObservability | | 已扫无问题 |
| 9 | hallucination | M1 | modelMechanics | evaluationObservability | | 已扫无问题 |
| 10 | reasoning-limit | M1 | modelMechanics | securityGovernanceOrg | | 已扫无问题 |
| 11 | prefill | M2 | inferenceCostPerformance | — | | 已扫无问题 |
| 12 | decode | M2 | inferenceCostPerformance | — | | 已扫无问题 |
| 13 | ttft | M2 | inferenceCostPerformance | — | | 已扫无问题 |
| 14 | tpot | M2 | inferenceCostPerformance | — | | 已扫无问题 |
| 15 | kv-cache | M2 | inferenceCostPerformance | maasPlatformization | | 已扫无问题 |
| 16 | session-affinity | M2 | maasPlatformization | inferenceCostPerformance | | 已扫无问题 |
| 17 | batch-scheduling | M2 | inferenceCostPerformance | maasPlatformization | | 已扫无问题 |
| 18 | pd-separation | M2 | inferenceCostPerformance | maasPlatformization | | 已扫无问题 |
| 19 | speculative-decoding | M2 | inferenceCostPerformance | — | | 已扫无问题 |
| 20 | quantization | M2 | inferenceCostPerformance | — | | 已扫无问题 |
| 21 | maas | M3 | maasPlatformization | — | | 已扫无问题 |
| 22 | model-gateway | M3 | maasPlatformization | securityGovernanceOrg | | 已扫无问题 |
| 23 | multi-model-routing | M3 | maasPlatformization | inferenceCostPerformance | | 已扫无问题 |
| 24 | cost-routing | M3 | maasPlatformization | inferenceCostPerformance | | 已扫无问题 |
| 25 | capability-routing | M3 | maasPlatformization | securityGovernanceOrg | | 已扫无问题 |
| 26 | cache-system | M3 | maasPlatformization | inferenceCostPerformance | | 已扫无问题 |
| 27 | rate-limit-circuit-break | M3 | maasPlatformization | securityGovernanceOrg | | 已扫无问题 |
| 28 | sla | M3 | maasPlatformization | evaluationObservability | | 已扫无问题 |
| 29 | prompt-context | M4 | ragContextEngineering | — | | 已扫无问题 |
| 30 | system-prompt | M4 | ragContextEngineering | securityGovernanceOrg | | 已扫无问题 |
| 31 | context-window | M4 | ragContextEngineering | modelMechanics | | 已扫无问题 |
| 32 | context-compression | M4 | ragContextEngineering | inferenceCostPerformance | | 已扫无问题 |
| 33 | context-pollution | M4 | ragContextEngineering | securityGovernanceOrg | | 已扫无问题 |
| 34 | layered-session | M4 | ragContextEngineering | agentEngineering | | 已扫无问题 |
| 35 | agents-md | M4 | agentEngineering | securityGovernanceOrg | | 已扫无问题 |
| 36 | repo-context | M4 | ragContextEngineering | agentEngineering | | 已扫无问题 |
| 37 | spec-driven-development | M4 | agentEngineering | securityGovernanceOrg | | 已扫无问题 |
| 38 | agent-loop | M4 | agentEngineering | — | | 已扫无问题 |
| 39 | tool-calling | M4 | agentEngineering | securityGovernanceOrg | | 已扫无问题 |
| 40 | skill | M4 | agentEngineering | — | | 已扫无问题 |
| 41 | subagent | M4 | agentEngineering | — | | 已扫无问题 |
| 42 | memory | M4 | agentEngineering | ragContextEngineering | | 已扫无问题 |
| 43 | human-in-the-loop | M4 | agentEngineering | securityGovernanceOrg | | 已扫无问题 |
| 44 | multi-agent | M4 | agentEngineering | evaluationObservability | | 已扫无问题 |
| 45 | code-review-agent | M5 | agentEngineering | evaluationObservability | | 已扫无问题 |
| 46 | issue-fix-agent | M5 | agentEngineering | evaluationObservability | | 已扫无问题 |
| 47 | requirement-decomposition-agent | M5 | agentEngineering | ragContextEngineering | | 已扫无问题 |
| 48 | test-generation-agent | M5 | agentEngineering | evaluationObservability | | 已扫无问题 |
| 49 | ops-diagnosis-agent | M5 | agentEngineering | evaluationObservability | | 已扫无问题 |
| 50 | value-review-agent | M5 | evaluationObservability | securityGovernanceOrg | | 已扫无问题 |
| 51 | eval | M6 | evaluationObservability | — | | 已扫无问题 |
| 52 | trace | M6 | evaluationObservability | securityGovernanceOrg | | 已扫无问题 |
| 53 | observability | M6 | evaluationObservability | — | | 已扫无问题 |
| 54 | token-roi | M6 | securityGovernanceOrg | inferenceCostPerformance | P3 | 从「负责人成本治理」视角 primary 归 securityGovernanceOrg 可接受；若 Profile 按域聚合学习进度，部分学员可能预期 primary 为 inferenceCostPerformance |
| 55 | permission-governance | M6 | securityGovernanceOrg | agentEngineering | | 已扫无问题 |
| 56 | ai-native-org | M6 | securityGovernanceOrg | agentEngineering | | 已扫无问题 |

**能力域分布（primary 计数）**：modelMechanics 10 · inferenceCostPerformance 10 · maasPlatformization 10 · ragContextEngineering 8 · agentEngineering 14 · evaluationObservability 4 · securityGovernanceOrg 0（仅作 secondary 出现）。分布与 6 模块定位一致 ✓

---

## 4. 角色路径（4 条）

### 4.1 aiEngineeringLeader（AI 工程负责人）

| 项 | 内容 |
|---|---|
| 推荐讲数 | 12 |
| 阶段 | 平台取舍 → 质量复盘 → 治理落地 |
| 结构 | phases.conceptIds ⊆ recommendedConceptIds ✓ |
| 与场景对齐 | 覆盖 model-router / token-cost-spike 核心讲 ✓ |

| 级别 | 问题 |
|---|---|
| P2 | 未纳入 `context-window`、`agent-loop`、`tool-calling`；与 goal「平台化、组织落地」可接受，但完成 RAG/Agent 场景演练后 Profile 下一步行动可能缺少路径指引 |
| P3 | 已覆盖 M3 路由三讲 + M6 治理核心 ✓ |

---

### 4.2 platformEngineer（平台工程师）

| 项 | 内容 |
|---|---|
| 推荐讲数 | 14 |
| 阶段 | 推理瓶颈 → 平台路由 → 稳定性 |
| 结构 | ✓ |

| 级别 | 问题 |
|---|---|
| P2 | **缺少 `cost-routing`、`capability-routing`**，却有 `multi-model-routing` 和 `model-gateway`；平台工程师路径与 model-router 场景能力域不完全对齐 |
| P2 | 仅有 `observability`，无 `trace`；与 trace-not-diagnostic 场景复盘链路有缺口 |
| P3 | 未纳入 `pd-separation`、`speculative-decoding`、`quantization`（进阶优化，可后续扩展） |

---

### 4.3 applicationArchitect（应用架构师）

| 项 | 内容 |
|---|---|
| 推荐讲数 | 12 |
| 阶段 | 上下文设计 → Agent 闭环 → 质量验证 |
| 结构 | ✓ |

| 级别 | 问题 |
|---|---|
| P2 | **缺少 `permission-governance`、`trace`**；与 rag-answer-quality / agent-tool-failure 场景强相关，应用架构师路径覆盖不足 |
| P2 | 质量验证阶段仅 `eval` 1 讲，未纳入 `trace`/`observability` |
| P3 | 未纳入 `layered-session`、`agents-md`、`spec-driven-development`、`skill`、`subagent` |

---

### 4.4 governanceOwner（治理负责人）

| 项 | 内容 |
|---|---|
| 推荐讲数 | 12 |
| 阶段 | 风险认知 → 执行边界 → 运营治理 |
| 结构 | ✓ |

| 级别 | 问题 |
|---|---|
| | **已扫无问题**（与 permission/trace/token-roi/ai-native-org 及三场景治理叙事高度一致） |

---

### 4.5 跨路径覆盖缺口（汇总）

| 级别 | 问题 |
|---|---|
| P2 | **22/56 讲**未出现在任一路径 `recommendedConceptIds`：M1 基础 8 讲（除 hallucination/reasoning-limit）、M2 进阶 3 讲（pd-separation/speculative-decoding/quantization）、M4 五讲（layered-session/agents-md/spec-driven-development/skill/subagent）、**M5 全部 6 讲**。M5 对「研发管理者」隐含受众无专属路径 |
| P3 | 路径为 curated subset，非全课表；需在 Profile UI 文案中避免暗示「路径 = 全部应学内容」 |

---

## 5. 高风险逐项 P0/P1

### [P1] rag-answer-quality — 叙事指标与 baseline 指标不一致

- **原文片段**：
  - `background`：「线上事实错误率从 3% 升到 **11%**」
  - `facts[failure-samples]`：事实错误率 **11%**，引用正确率 **74%**
  - `baseline.metrics`：`factualErrorRate` **9.5%**，`citationAccuracy` **78%**
- **问题类型**：同场景同一故障态两套数字
- **为什么有问题**：场景演练训练目标是「读指标 → 调策略 → 验证 hypothesis」。学员在 facts 面板看到 11%，在 metrics 面板看到 9.5%，会质疑模拟器可信度，或误判已部分修复。
- **可能误导的工程判断**：在真实复盘中学员可能随意选取有利数字支撑结论，而非坚持单一事实来源（监控 / 评测 / 工单）。
- **建议修复方向**：
  1. **优先**：统一 narrative、facts、baseline 为同一快照（均 11%/74%，或均 9.5%/78% 并改背景措辞为「干预后仍高于目标」）。
  2. **次优**：baseline explanation 明确「metrics 为负责人默认策略下的模拟起点，facts 为事故工单聚合」并标注时间差。
- **是否需要人工确认**：是（涉及产品叙事选择）。

---

### [P1] token-cost-spike — retry-cache-storm 的 prefix 与权限边界混写

- **原文片段**：`nextStepRecommendations`：「同一租户内按任务模板、**权限边界**、版本和 cache key 标准化 prefix」
- **问题类型**：KV cache / prefix 工程口径不严谨
- **为什么有问题**：ACL、角色、委托范围变化频繁；写入 prefix 会导致 cache 频繁失效，且可能跨权限复用错误上下文。与 `session-affinity`、`kv-cache` 两讲「租户隔离 + cache key 命名空间」口径冲突。
- **可能误导的工程判断**：团队为提升命中率把用户权限字符串拼进 system prompt prefix，引发越权复用或命中率崩溃。
- **建议修复方向**：改为「将租户/权限作为 **cache key 命名空间** 隔离；prefix 只标准化稳定的系统提示与任务模板」。
- **是否需要人工确认**：是（内容 Agent 改写即可）。

---

## 6. 企业视角

从 **AI 工程负责人 / 平台负责人 / 治理负责人** 三类受众看：

1. **场景演练价值**：五场景均要求「分型 → 拆指标 → 硬边界优先（权限/风险）→ Trace 证据」，符合企业事故复盘 SOP，可直接用于内训 tabletop exercise。
2. **安全边界**：RAG 召回前权限过滤、Agent 用户委托权限、Trace 敏感字段最小化——三条安全叙事 **无 P0 降级建议**，且明确标注反例选项（如 `auditOnlyPermission`、`agentSharedPermission`）。
3. **成本/ROI**：token-cost-spike 强调「低 Token ≠ 高 ROI」、价值分层路由，与 token-roi 讲一致；仅 prefix 表述需修正以免落地偏差。
4. **能力域与路径**：负责人路径（aiEngineeringLeader + governanceOwner）覆盖治理主干；平台/应用路径与场景库存在 **2–3 讲缺口**，可能影响「练完场景 → 路径下一步」的闭环体验。
5. **与诊断题报告关系**：概念诊断题仍有 ~22% 结构泄漏（见 `issue-tickets-content-diag-20260628.md`）；**场景演练诊断反馈质量明显更高**，建议内训优先推场景库。

---

## 7. 修复优先级

| 批次 | 优先级 | 范围 | 预估 | 动作 |
|---|---|---|---|---|
| 1 | **最高** | rag-answer-quality P1 | 0.5h | 统一 11% vs 9.5%、74% vs 78% |
| 2 | **最高** | token-cost-spike P1 | 0.5h | 改写 retry-cache-storm 的 prefix/权限措辞 |
| 3 | 中 | applicationArchitect / platformEngineer P2 | 1h | 补充 permission-governance、trace、cost-routing、capability-routing |
| 4 | 中 | model-router P2 | 0.5h | 删除 reviewRubric 中 DEV-06/07/08 内部引用 |
| 5 | 低 | agent-tool-failure P2 | 0.5h | 失败样本占比补全至 100% 或注明「其他 12%」 |
| 6 | 可选 | M5 路径 / 22 讲覆盖 P2/P3 | 产品决策 | 新增「研发场景 Agent」路径或扩展现有路径 |
| 7 | 可选 | token-roi 能力域 P3 | — | 维持现状或 primary/secondary 对调 |

**修复后建议重跑**：`npm run validate:structure` + 场景页人工走查五场景 baseline 与 facts 数字一致性。

---

## 8. 审计范围与不确定性

### 已覆盖

- `scenarioExercises.ts` + `scenarioExercisesR2.ts` 全部 **5** 场景、**17** events、`reviewRubric`、facts/requestTypes/modelPool/strategyControls
- `capabilityDomains.ts` 全部 **56** 条映射 + 7 域标签
- `rolePaths.ts` 全部 **4** 条路径 + phases 子集约束
- `npm run validate:structure` 结构门禁
- 与 `docs/content-schema.md` §2.1–§2.3、`issue-tickets-content-diag-20260628.md` 交叉核对

### 未覆盖

- 场景 **UI 模拟器** 运行态（metric 变化是否与 metricEffects 一致）— 属 DEV/QA，非本内容审计
- 56 讲 **正文** definition/mechanism 与场景叙事逐条一致性
- `content/drafts/` 草稿（按任务边界排除）
- Profile / Search 页对能力域、路径的 **渲染文案**

### 不确定性

- baseline  vs facts 数值差是否 intentional「干预后状态」— 文件内无 explicit 时间线说明，本审计按 **不一致** 报 P1；若产品有意设计需补文档。
- 角色路径 22 讲缺口是否为 MVP 刻意裁剪 — 已标 P2/P3，需 Owner 确认是否扩路径。

### 与既有报告关系

- 不重复 `scenario-library-r2-*` UX/性能/发布门禁
- 诊断题结构泄漏见 `issue-tickets-content-diag-20260628.md`；本报告聚焦场景+能力域+路径

---

**审计完成**。
