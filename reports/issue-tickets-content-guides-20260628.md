# AI-Learning-App 内容审核问题单 - 决策手册专项（20260628）

> 审核范围：`src/data/decisionGuides.ts` 全部 **17** 条决策手册（`decisionGuideByConceptId`）
> 审核身份：AI 全栈专家 + 内容事实审核 Agent（只审核，不改 `src/data/*` 或代码）
> 对照基线：`docs/content-schema.md` §2.1、`src/types/index.ts` `DecisionGuide`、对应 `demoConcepts.ts` 正文与场景演练关联
> 审核时间：2026-06-28

### 字段映射说明（任务描述 vs 权威 schema）

| 任务描述字段 | 权威 schema 字段 | 说明 |
|---|---|---|
| `decisionCriteria` | `decisionSignals` | 决策信号（指标/事实 + 解读 + 证据来源） |
| `antiPatterns` | `nonApplicableScenarios` + `tradeoffs[].watchOut` | 不适用场景与架构取舍中的盯防点 |
| `architectureTradeoffs` | `tradeoffs` | 架构取舍（dimension/gain/cost/watchOut） |
| `reviewConceptIds` | **不存在于 DecisionGuide** | 属 `UserProgress` 复盘清单字段；本专项核对的是 **17 个 guide 的 conceptId 是否在 56 讲登记表中存在** |

---

## 1. 结论先行

- **总体结论：有条件通过**。17 条手册在路由/缓存/Agent/Eval/观测/权限等主线上**事实正确、工程可落地性整体良好**，与对应讲正文、场景演练口径大体一致；`npm run validate:structure` 通过（含关联无悬空）。
- **P0 / P1 / P2 / P3 数量**：**P0 = 0，P1 = 2，P2 = 5，P3 = 4**
- **最大风险（一句话）**：`multi-agent` 决策手册多处写入本仓库 Cursor 多 Agent 内容流水线用语（`git status`、`src/data/*`、`reviewed` 门禁），与企业 **Multi-Agent AI 运行时编排**讲题严重错位，会误导平台负责人把“代码仓库协作”当成“Agent 协作”。
- **优先修复**：P1 的 `multi-agent` 全段重写为企业 orchestrator/worker 语境；P1 的 `agent-loop` 执行摘要循环顺序与正文对齐。

---

## 2. 高风险问题清单 P0/P1（表格）

| 级别 | guideId | 字段 | 问题类型 | 原文片段 | 风险 | 建议 |
|---|---|---|---|---|---|---|
| P1 | `multi-agent` | `decisionSignals[1].evidenceSource` | 产品一致性 / 企业场景错位 | 「`git status`、文件锁表、模块 owner 记录」 | 读者会以为企业 Multi-Agent 系统的冲突面来自 Git，而非 Agent 状态/工具写面/共享上下文 | 改为 trace 中的写冲突、共享状态键、工具副作用范围、子 Agent 输出重叠率 |
| P1 | `multi-agent` | `reviewQuestions[0].goodAnswerSignals` | 产品一致性 / 企业场景错位 | 「核心 schema/数据仅主开发可写」「草稿与审核分离」 | 直接暴露本 App 内容生产规则，与讲正文「orchestrator–worker / 上下文隔离」无关 | 改为子 Agent 工具权限、写工具白名单、共享记忆键、人类审批边界 |
| P1 | `multi-agent` | `implementationChecklist[1].passSignal` | 产品一致性 / 企业场景错位 | 「`reviewed` 文件写明 pass/退回，且不会直接进入 `src/data/*`」 | 非 AI 工程决策清单，而是仓库合入流程 | 改为子 Agent 产物经主 Agent 汇总前的人工/自动验收门槛 |
| P1 | `multi-agent` | `implementationChecklist[2].item` | 产品一致性 / 企业场景错位 | 「每轮合并前复核 git 状态和进度文档」 | 同上 | 改为主控 Agent 合并前核对 trace、冲突仲裁记录与子任务完成证据 |
| P1 | `agent-loop` | `executiveExplanation.summary` | 产品一致性 / 机制顺序错误 | 「按 **计划-执行-观察-修正** 处理多步任务」 | 与同讲正文 `Observe → Plan → Act → Check` 及 mechanism 顺序矛盾，易误导 ReAct/Agent 状态机设计 | 改为「观察-计划-执行-校验-继续/停止」，与 `demoConcepts.ts` agent-loop 一致 |

> 注：`multi-agent` 的 P1 为同一根因（仓库协作语境渗入）在多个字段重复出现，修复时应**整段替换**而非只改一句。

---

## 3. 逐项审核（17 条）

### 3.1 `multi-model-routing`（多模型路由）

**结论**：无明显 P0/P1 问题；与正文、model-router 场景演练一致。

| 维度 | 结论 |
|---|---|
| 事实正确性 | 任务分桶、Eval 基线、路由 Trace、灰度回滚等表述符合 MaaS 实践 |
| 专业深度 | 覆盖质量门槛→择优→回退闭环，深度足够 |
| 工程可落地性 | 评审问题与落地清单可直接用于网关设计评审 |
| 企业场景 | 多业务共享网关、配额变化等场景贴合 |
| 产品一致性 | 与 `demoConcepts` multi-model-routing mechanism 一致 |

**P2（可选）**：`decisionSignals[0].threshold`「至少能区分 3 类高频任务」为经验启发式，未说明如何验证分类稳定性——可补「分类漂移监控」一句。

---

### 3.2 `cost-routing`（成本路由）

**结论**：无明显 P0/P1 问题；强调质量底线与不可降级名单，与正文及 token-cost-spike 场景一致。

| 维度 | 结论 |
|---|---|
| 事实正确性 | 全链路成本（重试/回退/人工）口径正确 |
| 专业深度 | 与 `token-roi`、Eval 形成互补 |
| 工程可落地性 | 每周复盘、灰度不可降级检查可执行 |
| 企业场景 | 部门账单、合规高风险流量等适用/不适用划分合理 |
| 产品一致性 | 与 cost-routing 正文「先质量底线再省钱」一致 |

**P2**：与 `multi-model-routing`、`capability-routing` 三条路由手册结构高度相似，读者可能不知选哪本——建议在 ConceptPage 决策章节增加「与相邻讲差异」一句（产品层，非本文件必改项）。

---

### 3.3 `capability-routing`（能力路由）

**结论**：无明显 P0/P1 事实错误；能力标签、模型漂移回放等企业关注点完整。

| 维度 | 结论 |
|---|---|
| 事实正确性 | 能力错配、强模型排队、high/medium risk 分层正确 |
| 专业深度 | 未知任务默认策略评审问题到位 |
| 工程可落地性 | 按能力分类 Eval 可执行 |
| 企业场景 | 代码/长文/合规审查等标签场景合理 |
| 产品一致性 | 与 capability-routing 正文一致 |

**P2**：`reviewQuestions[2].goodAnswerSignals` 含「默认升级」——对未知请求偏保守但可能放大成本；建议并列「拒绝/人工确认/升级」并强调按风险分层选择，避免读者理解为一律走强模型。

---

### 3.4 `kv-cache`（KV Cache）

**结论**：无明显 P0/P1 事实错误；Session 亲和、Prefill、显存权衡与 M2 讲正文一致。

| 维度 | 结论 |
|---|---|
| 事实正确性 | KV 命中与 TTFT、路由打散机制描述正确 |
| 专业深度 | 覆盖命中率、Prefill 占比、会话迁移 |
| 工程可落地性 | 压测三类流量、扩缩容告警可执行 |
| 企业场景 | MaaS 多轮长上下文场景贴合 |
| 产品一致性 | 与 kv-cache / session-affinity 正文口径一致 |

**P2**：`decisionSignals[0].threshold`「低于 **30%** 且 TTFT 上升时优先查路由亲和」——30% 无通用行业标准，不同模型/会话长度差异大；建议改为「相对自身基线显著下降」或注明需按部署校准。

**P3**：未区分 **Prefix Cache / Prompt Caching** 与实例级 KV Cache 的差异（正文 mechanism 有提及）——可在 `nonApplicableScenarios` 补「仅 API 级 prefix 缓存、无实例亲和」边界。

---

### 3.5 `session-affinity`（Session 亲和）

**结论**：无明显 P0/P1 问题；已正确区分 cache locality 与语义上下文（应用层状态兜底），与 2026-06-28 内容 P1 修复口径一致。

| 维度 | 结论 |
|---|---|
| 事实正确性 | 亲和键匿名化、故障迁移、热点实例等正确 |
| 专业深度 | shared prefix / 临时状态 / 语义上下文边界清晰 |
| 工程可落地性 | 扩容/故障演练清单可执行 |
| 企业场景 | 多轮缓存局部性场景贴合 |
| 产品一致性 | 与 session-affinity 正文 definition 高度一致 |

**P3**：`tradeoffs[1].gain`「服务端临时状态和缓存复用更稳定」——可补一句「不替代应用层会话持久化」，与正文 mentalModel 完全对齐（非必须）。

---

### 3.6 `cache-system`（缓存体系）

**结论**：无明显 P0/P1 问题；多层缓存、权限 key、版本失效与 M3 讲及场景演练 cache key 口径一致。

| 维度 | 结论 |
|---|---|
| 事实正确性 | 租户/权限/模型版本维度、越权与过期风险正确 |
| 专业深度 | 网关/检索/Prompt/推理多层治理完整 |
| 工程可落地性 | 过期/权限/模型升级回归路径清晰 |
| 企业场景 | 高峰流量、权限差异大等场景合理 |
| 产品一致性 | 与 cache-system 正文及 token-cost-spike 事件建议方向一致 |

**无明显问题**（P2/P3 无单独条目）。

---

### 3.7 `token-roi`（Token ROI）

**结论**：无明显 P0/P1 问题；场景归因、无效 Token、治理动作闭环与 M6 讲一致。

| 维度 | 结论 |
|---|---|
| 事实正确性 | ROI 分子需业务收益、反对纯压成本正确 |
| 专业深度 | 限流/降级/缓存/下线动作链完整 |
| 工程可落地性 | 月度复盘清单可执行 |
| 企业场景 | 预算争议、部门账单场景贴合 |
| 产品一致性 | 与 token-roi 正文及 costGovernance 场景一致 |

**P3**：`nonApplicableScenarios[0]` 建议优先技术手段——与正文一致，可在 executive 摘要补「ROI 与技术优化并行」半句（可选）。

---

### 3.8 `prompt-context`（Prompt 与 Context）

**结论**：无明显 P0/P1 问题；指令层级、材料治理、敏感最小化与正文及 RAG 场景一致。

| 维度 | 结论 |
|---|---|
| 事实正确性 | Prompt vs Context 分工、引用率、指令冲突正确 |
| 专业深度 | 工具/检索边界评审问题到位 |
| 工程可落地性 | 攻击样本回放、模板版本记录可执行 |
| 企业场景 | 私有规则注入、材料不可信等场景合理 |
| 产品一致性 | 与 prompt-context 正文 enterpriseCase 一致 |

**无明显问题**。

---

### 3.9 `context-window`（上下文窗口）

**结论**：无明显 P0/P1 事实错误；扩窗 vs 检索/压缩对比框架正确。

| 维度 | 结论 |
|---|---|
| 事实正确性 | 窗口≠记忆、噪声稀释、Prefill 成本正确 |
| 专业深度 | 截断失败归因、降级路径完整 |
| 工程可落地性 | 三方案对比、Token 上限可执行 |
| 企业场景 | 长文档/长会话场景贴合 |
| 产品一致性 | 与 context-window 正文 mechanism 一致 |

**P2**：`decisionSignals[0].evidenceSource` 含「**Attention 分析**」——生产环境 rarely 直接可用；更常见的是引用标注、片段命中日志、人工抽检。建议改为「引用标注、片段命中日志、Eval 回放」。

---

### 3.10 `context-compression`（上下文压缩）

**结论**：无明显 P0/P1 问题；保真规则、不可压缩字段、原文回退与正文高度一致。

| 维度 | 结论 |
|---|---|
| 事实正确性 | 数字/权限/约束不可丢、压缩非简单摘要正确 |
| 专业深度 | 关键事实丢失率、全链路成本评估完整 |
| 工程可落地性 | 长文/冲突材料回放清单可执行 |
| 企业场景 | 法规逐字证据、采购红线等场景合理 |
| 产品一致性 | 与 context-compression 正文 enterpriseCase 一致 |

**无明显问题**。

---

### 3.11 `tool-calling`（工具调用）

**结论**：无明显 P0/P1 问题；schema/权限/幂等/副作用分级与 agent-tool-failure 场景一致。

| 维度 | 结论 |
|---|---|
| 事实正确性 | 高风险动作人工确认、盲目重试风险正确 |
| 专业深度 | 参数可验证性、错误分类完整 |
| 工程可落地性 | 权限/超时/业务拒绝回放可执行 |
| 企业场景 | 工单/审批/数据库等企业系统集成场景贴合 |
| 产品一致性 | 与 tool-calling 正文及 permission-governance 交叉一致 |

**无明显问题**。

---

### 3.12 `agent-loop`（Agent Loop）

**结论**：除 **P1 执行摘要循环顺序**外，其余字段专业、可落地，与正文 mechanism 大体一致。

| 维度 | 结论 |
|---|---|
| 事实正确性 | 步数预算、终止条件、人工接管正确 |
| 专业深度 | 观察→修正闭环、权限门完整 |
| 工程可落地性 | 状态机、Trace 逐步记录可执行 |
| 企业场景 | 多步任务、不确定环境场景合理 |
| 产品一致性 | **executiveExplanation.summary 顺序与正文不一致（P1）** |

**P1**：见 §2 表格 `executiveExplanation.summary`。

**P3**：`executiveExplanation.summary` 用「修正」而正文用「Check/校验」——统一术语更佳。

---

### 3.13 `multi-agent`（多 Agent 协作）

**结论**：**存在系统性 P1**——多处混入本仓库多 Agent 开发流程，与讲正文 orchestrator/worker 语境冲突。除 P1 外，任务可分解度、主控收敛等框架本身合理。

| 维度 | 结论 |
|---|---|
| 事实正确性 | 并行收益/协调成本框架正确；**git/reviewed/src 引用错误** |
| 专业深度 | 主控收敛、冲突面概念可用，但被仓库用语稀释 |
| 工程可落地性 | **当前 checklist 不可用于企业 Agent 平台评审** |
| 企业场景 | applicableScenarios 中研发流水线示例合理；**checklist/questions 偏离** |
| 产品一致性 | **与 multi-agent 正文/诊断题严重不一致（P1）** |

**P1**：见 §2 表格（多字段同源问题）。

**P2**：`tradeoffs[1].watchOut`「必须有统一 SPEC 和 reviewed 输出」——同属仓库语境，应随 P1 一并清除。

---

### 3.14 `eval`（Eval）

**结论**：无明显 P0/P1 问题；评估集覆盖、准入阈值、失败样本回流与 M6 讲及场景演练一致。

| 维度 | 结论 |
|---|---|
| 事实正确性 | 离线 Eval + 线上指标互补、版本化回归正确 |
| 专业深度 | 任务桶/失败类型分拆、阻断门 vs 抽检门完整 |
| 工程可落地性 | CI/发布前重跑、标注规范可执行 |
| 企业场景 | RAG/Agent/路由/工具变更回归场景贴合 |
| 产品一致性 | 与 eval 正文 keyTakeaways 一致 |

**P2**：`tradeoffs[1].dimension` 为 `latency`，gain 写「减少线上试错」——更像 **operability/reliability** 维度收益，维度标签略偏。

**P3**：三条 `reviewQuestions` 均为最低条数（3），对 advanced 讲可考虑增「LLM-as-judge 校准」评审题（正文 pitfalls 已覆盖）。

---

### 3.15 `observability`（Observability）

**结论**：无明显 P0/P1 问题；统一事件模型、分桶、数据最小化与 M6 讲及 trace 讲互补关系清晰。

| 维度 | 结论 |
|---|---|
| 事实正确性 | AI 事故非单纯 5xx、Token/投诉/工具失败分桶正确 |
| 专业深度 | 告警→根因追溯、敏感字段清单完整 |
| 工程可落地性 | 指标标签、告警有效性复盘可执行 |
| 企业场景 | MaaS/Agent 平台运营场景贴合 |
| 产品一致性 | 与 observability 正文一致 |

**无明显问题**。

---

### 3.16 `trace`（Trace）

**结论**：无明显 P0/P1 问题；span 完整性、字段最小化、白名单采样与正文及 trace-not-diagnostic 场景高度一致。

| 维度 | 结论 |
|---|---|
| 事实正确性 | 摘要/id/hash/版本/脱敏参数、禁止默认原文落库正确 |
| 专业深度 | 关联 Eval/投诉/成本/发布版本闭环完整 |
| 工程可落地性 | span 边界、失败样本演练可执行 |
| 企业场景 | RAG/Agent 多步链路复盘场景合理 |
| 产品一致性 | 与 trace 正文 mechanism 一致 |

**P3**：hash 反查风险在场景演练 trace-not-diagnostic 已 P2 提及——手册可择机补「带盐/不可逆指纹」（非阻断）。

---

### 3.17 `permission-governance`（权限治理）

**结论**：无明显 P0/P1 问题；最小权限、动作分级、拒绝状态机、审计 Trace 与正文及 RAG 权限场景一致。

| 维度 | 结论 |
|---|---|
| 事实正确性 | 继承用户 scope、禁止绕路调用、Human-in-the-loop 正确 |
| 专业深度 | 跨租户、写/删/导出决策点覆盖完整 |
| 工程可落地性 | 越权/跨租户回放清单可执行 |
| 企业场景 | CRM/代码库/审批等企业系统场景贴合 |
| 产品一致性 | 与 permission-governance 正文 diagnosticQuestion 一致 |

**无明显问题**。

---

## 4. reviewConceptIds 悬空核对表

> **说明**：`DecisionGuide` **不包含** `reviewConceptIds` 字段。该字段定义在 `UserProgress`（`src/types/index.ts`），由 Profile/ConceptPage 复盘清单使用。本表核对：(1) 17 个 handbook 的 **guideId ↔ KnowledgePoint.id**；(2) 各讲 `relatedConceptIds` 是否悬空（由 `validate:structure` 保障）。

| guideId | 对应讲存在 | contentStatus | decisionGuide 已挂载 | relatedConceptIds 悬空 | 备注 |
|---|---|---|---|---|---|
| `multi-model-routing` | ✓ | mvp | ✓ | 无 | — |
| `cost-routing` | ✓ | mvp | ✓ | 无 | — |
| `capability-routing` | ✓ | mvp | ✓ | 无 | — |
| `kv-cache` | ✓ | mvp | ✓ | 无 | — |
| `session-affinity` | ✓ | mvp | ✓ | 无 | — |
| `cache-system` | ✓ | mvp | ✓ | 无 | — |
| `token-roi` | ✓ | mvp | ✓ | 无 | — |
| `prompt-context` | ✓ | mvp | ✓ | 无 | — |
| `context-window` | ✓ | mvp | ✓ | 无 | — |
| `context-compression` | ✓ | mvp | ✓ | 无 | — |
| `tool-calling` | ✓ | mvp | ✓ | 无 | — |
| `agent-loop` | ✓ | mvp | ✓ | 无 | — |
| `multi-agent` | ✓ | mvp | ✓ | 无 | 内容语境问题见 P1，非 ID 悬空 |
| `eval` | ✓ | mvp | ✓ | 无 | — |
| `observability` | ✓ | mvp | ✓ | 无 | — |
| `trace` | ✓ | mvp | ✓ | 无 | — |
| `permission-governance` | ✓ | mvp | ✓ | 无 | — |

**结论**：17/17 guideId 均在 56 讲登记表中存在且已挂载 `decisionGuide`；**无 reviewConceptIds / relatedConceptIds 悬空问题**。

---

## 5. 企业 AI 工程负责人视角

### 5.1 可直接用于评审/落地的手册（15 条）

以下手册评审问题与落地清单**可直接复制到架构评审或上线 checklist**，与负责人关心的成本、质量、权限、观测闭环一致：

`multi-model-routing`、`cost-routing`、`capability-routing`、`kv-cache`、`session-affinity`、`cache-system`、`token-roi`、`prompt-context`、`context-window`、`context-compression`、`tool-calling`、`observability`、`trace`、`permission-governance`、`eval`（除 tradeoff 维度小瑕疵外）

### 5.2 需修复后再用于对外培训的手册（2 条）

| 手册 | 负责人会如何使用 | 当前阻塞 |
|---|---|---|
| `multi-agent` | 判断是否引入 orchestrator/worker、如何控 Token 与冲突 | 清单指向 git/reviewed/src，**无法用于 Agent 平台设计** |
| `agent-loop` | 定义 Agent 状态机与终止条件 | 摘要循环顺序错误，**与团队内训正文冲突** |

### 5.3 三条路由手册的使用建议（给产品/内容 Owner）

- **multi-model-routing**：总览——何时需要模型池与策略闭环。
- **cost-routing**：预算压力主导——质量底线 + 不可降级名单。
- **capability-routing**：能力/合规主导——能力标签 + 错配复盘。

建议在 UI 决策章节增加 1 行「本讲决策手册聚焦点」，降低读者在三讲间重复阅读的感知（P2，非阻断）。

---

## 6. 修复优先级

| 优先级 | guideId | 动作 | 预估工作量 |
|---|---|---|---|
| **P1·立即** | `multi-agent` | 删除 git/src/data/reviewed/主开发 等仓库用语；对齐正文 orchestrator/worker、trace、Token、冲突仲裁 | 中（整段替换 checklist + questions + 部分 signals/tradeoffs） |
| **P1·立即** | `agent-loop` | 修正 `executiveExplanation.summary` 为 Observe→Plan→Act→Check→Continue/Stop | 小（1 句） |
| **P2·本轮 polish** | `context-window` | `decisionSignals[0].evidenceSource` 去掉 Attention 分析 | 小 |
| **P2·本轮 polish** | `kv-cache` | 30% 命中率改为相对基线或加注校准说明 | 小 |
| **P2·本轮 polish** | `capability-routing` | 未知任务默认策略 goodAnswerSignals 补全风险分层 | 小 |
| **P2·可选** | `eval` | 调整 tradeoffs[1] dimension 或 gain 文案 | 小 |
| **P2·可选** | M3 路由三讲 | 产品层增加差异说明（非 decisionGuides 必改） | 小 |
| **P3· backlog** | 多条 | 评审问题从 3 条扩至 4–5 条（advanced 讲） | 中 |

---

## 7. 审计范围与不确定性

### 7.1 已覆盖

- 全量阅读 `src/data/decisionGuides.ts`（681 行，17 条 buildGuide 输出）
- 交叉核对 `src/data/demoConcepts.ts` 对应 17 讲 definition/mechanism/pitfalls/diagnosticQuestion
- 抽样核对 `src/data/scenarioExercises.ts` 与路由/成本/RAG/Trace 场景关联概念
- 运行 `npm run validate:structure`（2026-06-28 通过）
- 脚本确认 17 个 guideId 均存在于 `concepts.ts` 且 contentStatus=mvp

### 7.2 未覆盖 / 不确定性

| 项 | 说明 |
|---|---|
| 浏览器 UI 渲染 | 未启动 dev server；DecisionGuideSection 展示逻辑未逐字段截图验证 |
| 数值阈值行业对标 | KV 30%、3 类任务分桶等为启发式，**未与特定厂商 SLA 文档逐条对标** |
| Prefix Cache vs KV Cache | 手册未细拆 API 级 prefix 与实例 KV（P3），是否与未来 vLLM/OpenAI 专章冲突需 Owner 确认 |
| 英文 eyebrow 文案 | UI 层「Decision signals / Architecture tradeoffs」为英文，属视觉/i18n 范畴，本专项未计 issue |

### 7.3 审计方法说明

- **antiPatterns** 在本 schema 中分散在 `nonApplicableScenarios` 与 `tradeoffs[].watchOut`，审核时已合并检视。
- **reviewConceptIds** 非 DecisionGuide 字段；若未来 schema 增加「决策手册关联复习讲次」，需另开 schema 变更与校验规则。

---

*报告路径：`reports/issue-tickets-content-guides-20260628.md` · 审核 Agent 未修改任何 `src/data/*` 或代码文件*
