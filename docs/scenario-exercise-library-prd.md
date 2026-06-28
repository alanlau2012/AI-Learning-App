# 场景演练库扩展 PRD

> 版本：v0.1  
> 日期：2026-06-27  
> 适用基线：56 / 56 讲已上线，AI 工程负责人增强 Phase 1B / Phase 2 / Phase 3 已完成，`model-router` 已作为独立 `scenarioExercise` 落库并上线 `/scenarios/model-router`。  
> 关联文档：[`ai-engineering-leader-enhancement-prd.md`](ai-engineering-leader-enhancement-prd.md)、[`content-schema.md`](content-schema.md)、[`ai-engineering-leader-enhancement-progress.md`](ai-engineering-leader-enhancement-progress.md)。

## 1. 背景与判断

当前 APP 已经从“AI 应用工程课程”升级到“AI 工程负责人决策与复盘工具”的第一阶段：知识点详情页有 `decisionGuide`，Profile 有能力域和复盘清单，Search / Glossary 已能按能力域联动，`model-router` 场景演练完成了首个跨知识点训练闭环。

下一阶段的最高价值不在继续堆单讲内容，而在扩展“真实场景诊断演练库”。企业 AI 工程负责人日常遇到的问题通常不是单点概念题，而是跨模型、检索、Agent、权限、评测、观测、成本和组织治理的复合问题。场景演练库要把 56 讲知识体系转化为可反复练习的工程判断能力。

本 PRD 的核心判断：

- `model-router` 已验证独立 `scenarioExercise` 路线可行，后续场景继续走独立数据源，不回塞到 `animation.type`。
- 场景演练应以“生产症状 -> 排查顺序 -> 策略调整 -> 复盘结论”为主线，而不是把动画、图表或题库做成更复杂。
- 第一轮扩库应优先覆盖高频生产问题：RAG 答案质量、Token 成本异常、Agent 工具失败、Trace 不可诊断、多 Agent 卡住。
- 现有 `ScenarioExercise` schema 偏模型路由，能支撑第一个场景；扩库时需要引入更通用的场景指标和排查对象，但必须保持纯前端、本地数据、可校验。
- 最关键的 R0 决策不是字段命名，而是“非路由场景的指标数值从哪里来”。本 PRD 推荐 R1 采用 `baseline.metrics + metricEffects` 的量级化 delta 通用模型，`model-router` 保留现有物理模拟器兼容；每类场景专属物理模型推迟到 R2/R3。

## 2. 产品目标

### 2.1 用户目标

用户完成场景演练后，应能：

1. 根据生产症状判断优先排查哪条链路。
2. 在多个看似合理的方案中识别第一优先级。
3. 看懂指标变化背后的工程原因，而不是只看结果好坏。
4. 将一次演练结果回链到相关知识点、决策手册和本周复盘清单。
5. 用复盘结论指导真实方案评审、事故复盘或团队学习安排。

### 2.2 产品目标

1. 从 1 个标杆场景扩展到首批 6 个场景，形成可复用的场景库模式。
2. 建立通用 `scenarioExercise` v2 schema，支持 RAG、Agent、Trace、成本治理等非模型路由类场景。
3. 让场景演练成为首页、Concept、Search、Profile 的共同入口。
4. 形成内容生产门禁：每个场景必须有症状、指标、可调策略、触发事件、排查顺序、遗漏风险、关联知识点。

### 2.3 非目标

本阶段不做：

- 后端、账号、云同步、团队协作。
- 真实大模型 API、真实企业日志接入。
- 真实成本测算或供应商价格管理。
- 自由文本 LLM 判分。
- 完整题库平台或复杂实验平台。
- 三维动画、视频播放器或重型可视化框架。

## 3. 目标用户与使用场景

核心用户：

- 企业 AI 应用工程负责人。
- MaaS / AI Infra / Agent 平台负责人。
- RAG、Agent、评测、观测、安全治理方向的高级工程师。
- 需要带团队复盘 AI 工程事故的技术管理者。

典型使用场景：

| 使用场景 | 用户问题 | APP 应提供的能力 |
|---|---|---|
| 技术方案评审前 | 这个方案哪里最容易出问题？ | 给出类似生产症状和评审检查点。 |
| 事故复盘后 | 这次问题到底该归因到哪一层？ | 训练排查顺序和遗漏风险识别。 |
| 成本 / 质量 / 安全争议 | 应该先降成本、提质量还是收紧治理？ | 展示策略调整对指标的取舍。 |
| 团队学习安排 | 哪些人该补 RAG、Agent、观测或治理？ | 把场景结果回链能力域和角色路径。 |
| 自学复习 | 学过概念但不会用怎么办？ | 从知识点进入真实场景练习。 |

## 4. 现状基线

### 4.1 已完成能力

- `src/data/scenarioExercises.ts` 已有 `model-router` 场景数据。
- `src/types/index.ts` 与 `docs/content-schema.md` 已定义 `ScenarioExercise`、请求类型、模型池、策略项、指标、事件和复盘 rubric。
- `/scenarios/:scenarioId` 路由已存在。
- `ScenarioPage` 已能展示请求队列、模型池负载、策略控件、指标、事件解释和复盘结论。
- `src/utils/scenarioSimulation.ts` 已有 deterministic simulation 逻辑。
- `model-router` 已可从相关 Concept 进入，并通过浏览器 smoke。

### 4.2 当前限制

| 限制 | 影响 |
|---|---|
| 指标枚举偏模型路由：`costPer1kRequests`、`p95LatencyMs`、`successRate`、`escalationRate`、`riskInterceptRate`、`qualityComplaintRate` | RAG、Trace、Agent 场景需要召回率、引用正确率、工具成功率、span 覆盖率、越权风险等指标，现有枚举表达不足。 |
| `modelPool` 是一等对象 | 非模型路由场景也可能有“检索管线 / 工具链 / Trace 链路 / Agent 编排单元”，不都叫模型池。 |
| `requestTypes` 与 `routingRules` 适合路由类问题 | RAG 场景更需要文档切片、召回、重排、上下文构造；Agent 场景更需要工具协议、权限、状态和重试。 |
| `ScenarioPage` 文案固定为“请求队列 / 模型池负载 / 路由策略” | 扩库后需要通用命名或按场景类型配置展示标签。 |
| Search 尚未把场景作为一等结果类型 | 用户搜索“成本上涨”“RAG 答案差”时应能直接命中场景演练。 |

## 5. 场景库产品形态

### 5.1 信息架构

不新增过重一级导航，优先复用现有入口：

| 入口 | 变化 |
|---|---|
| 首页 | 增加“继续场景演练 / 推荐场景”轻量入口。 |
| ConceptPage | 在相关知识点的决策区或动画区附近展示“进入场景演练”。 |
| SearchPage | 搜索结果聚合知识点、决策手册、术语、场景演练。 |
| ProfilePage | 在本周建议和复盘清单中推荐场景。 |
| ScenarioPage | 从单一模型路由页面升级为通用场景演练页面。 |

### 5.2 标准交互流程

每个场景必须遵守同一条学习闭环：

1. **进入场景**：展示背景、业务规模、异常症状和关联能力域。
2. **观察事实**：展示请求 / 数据 / 工具 / Trace / Agent 任务等对象，以及核心指标。
3. **调整策略**：用户选择 1 到 4 个策略项，例如检索策略、重排策略、权限策略、重试策略、观测字段。
4. **实时反馈**：指标变化、风险信号和触发事件随策略组合更新。
5. **提交诊断**：用户确认自己的判断。
6. **复盘结论**：展示正确归因、排查顺序、遗漏风险、下一步建议和关联知识点。
7. **沉淀复盘**：可加入本周复盘清单，或跳转相关 Concept / Glossary / Search。

### 5.3 页面模块

| 模块 | 必须 / 可选 | 说明 |
|---|---|---|
| 场景头部 | 必须 | 标题、背景、异常症状、关联知识点。 |
| 指标条 | 必须 | 4 到 8 个关键指标，展示当前值、趋势、解释。 |
| 事实对象区 | 必须 | 请求、文档、工具、Trace span、Agent 任务等，由场景类型决定。 |
| 策略控制区 | 必须 | 3 到 5 个策略组，每组 2 到 4 个选项。 |
| 风险信号区 | 必须 | 根据策略组合产生风险提示和事件。 |
| 复盘面板 | 必须 | 提交后展示排查顺序、遗漏风险、关联知识点。 |
| 加入复盘 | 应该 | R1 先将场景关联知识点加入 `reviewConceptIds`；R2 再评估是否新增 `reviewScenarioIds`。 |
| 场景目录 | 可选 | 首批场景超过 3 个后增加 `/scenarios` 列表页。 |

## 6. 首批场景规划

首批场景库建议包含 6 个场景，其中 `model-router` 为已上线基线，其余 5 个为新增候选。优先级按负责人高频痛点、跨知识点价值、可用现有内容支撑程度排序。

| 优先级 | 场景 ID | 场景名称 | 核心训练目标 | 关联知识点 |
|---|---|---|---|---|
| P0 | `rag-answer-quality` | RAG 召回正常但答案差 | 区分召回、重排、上下文构造、提示约束、评测缺口 | `embedding-retrieval`、`reranking`、`context-engineering`、`system-prompt`、`eval`、`trace` |
| P0 | `token-cost-spike` | Token 成本异常上涨 | 定位上下文膨胀、重试、缓存缺失、模型误选、低价值流量 | `token-roi`、`context-window`、`kv-cache`、`cost-routing`、`batch-scheduling`、`observability` |
| P1 | `agent-tool-failure` | Agent 工具调用失败 | 判断工具协议、参数校验、权限、重试、状态管理 | `tool-calling`、`agent-loop`、`permission-governance`、`trace`、`human-in-the-loop` |
| P1 | `trace-not-diagnostic` | Trace 有数据但不可诊断 | 区分日志堆积、span 断链、字段缺失、敏感数据最小化 | `trace`、`observability`、`eval`、`model-gateway`、`permission-governance` |
| P2 | `multi-agent-stuck` | 多 Agent 流程卡住 | 判断角色边界、共享状态、终止条件、仲裁机制、成本失控 | `multi-agent`、`agent-loop`、`context-state`、`human-in-the-loop`、`value-review-agent` |
| 已上线 | `model-router` | 模型路由策略失效诊断 | 在成本、延迟、质量、风险之间调策略 | `multi-model-routing`、`cost-routing`、`capability-routing` |

## 7. 场景详细需求

### 7.1 P0-01：RAG 召回正常但答案差

**用户问题**：检索命中率看起来正常，但回答仍然事实错误、引用旧政策或缺少关键约束，团队不知道该先改 embedding、重排、chunk、prompt 还是评测集。

**业务背景**：企业客服 / 法务 / IT 知识库每日 8 到 10 万次问答，知识库近期有版本更新。离线召回 TopK 命中率稳定，但线上事实错误率从 3% 升到 11%。

**事实对象**：

- 文档片段：新政策、旧政策、FAQ、工单历史、低可信来源。
- 检索链路：召回、重排、权限过滤、上下文拼接、模型回答。
- 失败样本：错误引用、遗漏约束、上下文冲突、无来源回答。

**策略控件**：

| 控件 | 选项 |
|---|---|
| 召回范围 | 高召回宽口径 / 版本优先 / 权限优先 |
| 重排策略 | 语义相似度优先 / 新鲜度加权 / 权威来源加权 |
| 上下文构造 | TopK 原样拼接 / 去重压缩 / 冲突片段隔离 |
| 回答约束 | 宽松生成 / 必须引用来源 / 冲突时拒答或升级 |

**核心指标**：

- 召回覆盖率。
- 引用正确率。
- 上下文冲突率。
- 事实错误率。
- 拒答 / 升级率。
- 平均上下文 Token。

**触发事件**：

| 事件 | 触发条件 | 正确诊断 |
|---|---|---|
| 召回高但引用错 | 高召回宽口径 + TopK 原样拼接 | 新旧片段同时进入上下文，模型按更靠前或更强表述的旧片段回答。 |
| 事实错误率上升 | 语义相似度优先 + 宽松生成 | 重排没有权威性和版本权重，回答约束缺少来源校验。 |
| 拒答过多 | 权限优先 + 冲突时拒答 | 权限过滤和冲突检测过严，需要区分缺权限、资料冲突和真实无答案。 |

**复盘要求**：

- 必须先按失败样本拆分“召回缺失 / 重排错序 / 上下文冲突 / 生成约束不足”。
- 不允许只回答“调 prompt”。
- 必须说明如何用 Trace 还原进入上下文的片段、版本、来源和排序。

**MVP 实现建议**：

- 需要 `ScenarioMetricId` v2 支持 RAG 指标。
- 需要事实对象区从“请求队列”可配置为“文档片段 / 检索链路”。
- 第一版模拟逻辑可使用 deterministic 权重，不需要真实向量检索。

### 7.2 P0-02：Token 成本异常上涨

**用户问题**：月度 Token 成本突然上涨 40%，但业务请求量只涨 10%。团队需要判断是上下文膨胀、重试、缓存缺失、模型误选、批处理失败还是低价值流量导致。

**业务背景**：企业 AI 助手覆盖客服、研发、数据分析和办公助手，每日约 20 万次请求。上线新版本后成本上升，满意度没有同步提升。

**事实对象**：

- 流量桶：简单问答、长文总结、代码生成、Agent 多步任务。
- Token 构成：系统提示、历史上下文、检索片段、工具结果、重试调用。
- 缓存状态：prefix 命中率、KV cache locality、批处理命中率。
- 价值信号：采纳率、完成率、投诉率、人工接管率。

**策略控件**：

| 控件 | 选项 |
|---|---|
| 上下文策略 | 全量历史 / 摘要压缩 / 按任务窗口裁剪 |
| 缓存策略 | 不缓存 / prefix 标准化 / 按租户和任务分组 |
| 路由策略 | 单一强模型 / 成本路由 / 价值分层路由 |
| 重试策略 | 失败即重试 / 错误分类重试 / 失败升级并限额 |

**核心指标**：

- 每千请求成本。
- 平均输入 Token。
- 重试放大率。
- 缓存命中率。
- 高价值任务成功率。
- 低价值流量占比。

**触发事件**：

| 事件 | 触发条件 | 正确诊断 |
|---|---|---|
| 成本涨但成功率不涨 | 全量历史 + 单一强模型 | 上下文膨胀和模型误选吞噬预算，需要按任务价值路由。 |
| 成本和 P95 同涨 | 失败即重试 + 不缓存 | 重试风暴和缓存缺失叠加，先按错误类型拆重试。 |
| 成本降但返工升 | 成本路由 + 过度裁剪 | 表面 Token 成本下降，但高价值任务质量下降导致综合 ROI 变差。 |

**复盘要求**：

- 必须把成本拆到任务类型、上下文构成、重试路径和模型选择。
- 必须识别“低 Token 成本不等于高 ROI”。
- 必须给出缓存、裁剪、路由、限额中至少两类治理动作。

**MVP 实现建议**：

- 可复用现有 `costPer1kRequests`、`p95LatencyMs`、`successRate`、`qualityComplaintRate`，新增 `avgContextTokens`、`retryAmplificationRate`、`cacheHitRate`、`businessValueScore` 更合理。
- 可优先作为第二个上线场景，因为与 `model-router` simulation 逻辑复用度高。

### 7.3 P1-01：Agent 工具调用失败

**用户问题**：Agent 经常调用错工具、参数错误、重复调用、越权调用或失败后死循环。团队不知道该先改工具描述、参数 schema、权限、重试策略还是人工接管。

**业务背景**：企业运维 / 采购 / 报销 Agent 每日处理 1000 到 3000 个任务，可调用查询、写入、审批、通知等工具。

**事实对象**：

- 工具清单：只读工具、写工具、高风险工具。
- 调用链路：意图识别、参数生成、权限检查、工具执行、结果解释。
- 状态对象：任务状态、用户权限、审批证据、工具返回。

**策略控件**：

| 控件 | 选项 |
|---|---|
| 工具描述 | 宽泛自然语言 / 明确前置条件 / 带反例和风险标签 |
| 参数校验 | 仅类型校验 / 业务规则校验 / 高风险字段二次确认 |
| 权限策略 | Agent 统一权限 / 用户委托权限 / 操作级最小权限 |
| 失败处理 | 自动重试 / 分类重试 / 人工接管 |

**核心指标**：

- 工具成功率。
- 参数错误率。
- 越权拦截率。
- 重复调用率。
- 人工接管率。
- 平均任务步数。

**触发事件**：

- 工具名相似导致错调。
- 参数合法但业务语义错误。
- 高风险写工具绕过审批。
- 自动重试造成重复扣费或重复提交。

**复盘要求**：

- 必须先区分“工具选择错误 / 参数错误 / 权限错误 / 工具执行失败 / 结果解释错误”。
- 必须说明高风险工具为什么不能只靠 prompt 约束。
- 必须回链 `tool-calling`、`permission-governance`、`trace`。

### 7.4 P1-02：Trace 有数据但不可诊断

**用户问题**：系统已经记录很多日志和 Trace，但事故复盘仍然无法定位到底是检索、上下文、模型、工具、权限还是发布版本导致。

**业务背景**：多步 AI 应用日均 8 万次请求，包含 RAG、工具调用和模型路由。事故后每个 case 排查数小时，Trace 里既有敏感字段风险，又缺关键关联字段。

**事实对象**：

- Trace span：gateway、retrieval、rerank、prompt assembly、model call、tool call、permission check、eval feedback。
- 字段策略：完整输入、摘要、hash、引用 id、版本号、错误码。
- 关联对象：用户反馈、评测样本、发布版本、成本账单、权限事件。

**策略控件**：

| 控件 | 选项 |
|---|---|
| span 覆盖 | 只记录模型调用 / 覆盖关键链路 / 覆盖全链路但采样 |
| 字段粒度 | 原文全量 / 脱敏摘要 / 引用 id + hash |
| 关联策略 | 不关联 / 关联 feedback / 关联 eval + release + cost |
| 数据治理 | 长期全量保留 / 分级保留 / 敏感字段最小化 |

**核心指标**：

- span 覆盖率。
- 复盘可定位率。
- 敏感字段暴露风险。
- 单 case 排查耗时。
- feedback 关联率。
- 采样成本。

**触发事件**：

- Trace 很多但 span 断链。
- 字段过少无法还原上下文。
- 字段过多造成敏感数据风险。
- 没有关联评测和发布版本，无法判断回归来源。

**复盘要求**：

- 必须把“可观测”与“随手打日志”区分开。
- 必须说明哪些字段应脱敏、摘要、hash 或只保留引用 id。
- 必须回链 `trace`、`observability`、`eval`、`permission-governance`。

### 7.5 P2-01：多 Agent 流程卡住

**用户问题**：多 Agent 系统延迟高、成本翻倍、子 Agent 结论冲突、主 Agent 无法收敛。团队不知道问题来自拆分过度、角色边界、共享状态、仲裁机制还是终止条件。

**业务背景**：研发 / 风控 / 商户申诉流程拆成多个子 Agent：需求理解、资料检索、合规检查、方案生成、审核摘要。日均 1000 到 6000 个任务。

**事实对象**：

- 子 Agent：交易分析、合规检查、客服摘要、主协调器。
- 共享状态：任务目标、证据列表、阶段结果、冲突项。
- 编排规则：并行、串行、投票、仲裁、人工接管。

**策略控件**：

| 控件 | 选项 |
|---|---|
| 拆分粒度 | 单 Agent / 三角色 / 五角色细拆 |
| 状态共享 | 全量共享 / 按角色最小共享 / 证据板共享 |
| 冲突处理 | 主 Agent 拼接 / 规则仲裁 / 人工审批 |
| 终止条件 | 固定轮数 / 置信度阈值 / 成本和时间预算 |

**核心指标**：

- 平均任务步数。
- P95 完成时间。
- Token 成本。
- 冲突率。
- 人工接管率。
- 结论采纳率。

**触发事件**：

- 过度拆分导致成本和延迟上升。
- 子 Agent 互相覆盖状态导致循环。
- 结论冲突无人仲裁。
- 没有终止条件导致卡住。

**复盘要求**：

- 必须判断是否真的需要多 Agent。
- 必须说明角色边界、状态共享和终止条件三者如何共同影响稳定性。
- 必须回链 `multi-agent`、`agent-loop`、`context-state`、`human-in-the-loop`。

## 8. 数据与 schema 需求

### 8.1 保持现有原则

- 场景数据继续放在 `src/data/scenarioExercises.ts` 或后续拆分的 `src/data/scenarios/*`，不得写死在组件。
- `docs/content-schema.md` 是权威 schema，任何字段变更必须同步 `src/types/index.ts` 与 `scripts/validate-content.ts`。
- 场景不接真实 API，不含真实客户敏感数据。
- 所有关联 Concept id 必须指向 56 讲清单中的真实 id。

### 8.2 建议 schema v2

现有 schema 可保留，同时新增更通用字段以支持多类型场景。

建议新增 / 调整：

```ts
export type ScenarioExerciseType =
  | 'modelRouting'
  | 'ragQuality'
  | 'agentTooling'
  | 'observability'
  | 'multiAgent'
  | 'costGovernance';

export interface ScenarioExercise {
  id: string;
  type: ScenarioExerciseType;
  title: string;
  subtitle?: string;
  relatedConceptIds: string[];
  entryConceptIds: string[];
  capabilityDomains: CapabilityDomain[];
  difficulty: 'intermediate' | 'advanced';
  estimatedMinutes: number;
  background: string;
  initialSymptom: string;
  objectLabels?: ScenarioObjectLabels;
  baseline: ScenarioState;
  facts?: ScenarioFactGroup[];
  /** modelRouting 兼容字段；非路由场景不要求。 */
  requestTypes?: ScenarioRequestType[];
  /** modelRouting 兼容字段；非路由场景不要求。 */
  modelPool?: ScenarioModel[];
  strategyControls: StrategyControl[];
  events: ScenarioEvent[];
  reviewRubric: ScenarioReviewRubric;
}

export interface ScenarioObjectLabels {
  factsTitle: string;       // 例如：请求队列 / 文档片段 / Trace 链路 / 工具链
  secondaryTitle?: string;  // 例如：模型池负载 / 工具调用分布 / span 覆盖
  controlTitle: string;     // 例如：路由策略 / 检索策略 / 工具治理策略
}

export interface ScenarioFactGroup {
  id: string;
  title: string;
  description: string;
  weight?: number;
  attributes: ScenarioFactAttribute[];
  risks?: string[];
}

export interface ScenarioFactAttribute {
  label: string;
  value: string;
}

export interface StrategyControl {
  id: string;
  label: string;
  options: StrategyOption[];
  /** R1 固定为每组单选；若未来支持组内多选，再显式放开。 */
  minSelect?: number;
  maxSelect?: number;
}

export interface MetricEffect {
  metricId: string;
  direction: 'up' | 'down' | 'mixed';
  magnitude: 'small' | 'medium' | 'large';
  /** 默认 relative；absolute 用于百分比点、ms、token 等绝对增量。 */
  deltaMode?: 'relative' | 'absolute';
  /** 可选精确增量；缺省时由 magnitude 映射。 */
  delta?: number;
  explanation: string;
}

export interface ScenarioMetric {
  id: string;
  label: string;
  value: number;
  unit: string;
  trend: 'better' | 'worse' | 'neutral';
  polarity: 'higherIsBetter' | 'lowerIsBetter';
  neutralTolerance?: number;
  min?: number;
  max?: number;
  explanation: string;
}
```

设计说明：

- `type` 让 UI 和 simulation 可选择兼容的 model routing 物理模型，或通用 baseline + delta 模型。
- `facts` 替代对 `requestTypes` / `modelPool` 的强依赖，但 `requestTypes` / `modelPool` 在 `type === 'modelRouting'` 时仍作为兼容字段存在。
- `objectLabels.secondaryTitle` 用中性命名替代 `loadTitle`，避免 RAG / Trace 场景被迫使用“负载”语义。
- `StrategyControl` 在 R1 明确为“每组单选、多组组合”，不支持组内多选；`minSelect/maxSelect` 仅作为未来显式扩展点。
- `ScenarioMetric.id` 从固定枚举改为 string，并由 validator 检查每个场景内部引用一致性。
- `polarity` 只保留 `higherIsBetter / lowerIsBetter`；若未来确需目标区间，再新增明确的 `targetMin / targetMax`，R1 不引入半成品 `targetRange`。
- `MetricEffect` 必须可参与数值计算，不能只作为 explanation 文本。缺省量级建议：`small = 5%`、`medium = 12%`、`large = 25%`，按 `deltaMode` 对 baseline 指标做相对或绝对叠加，再按 `min/max` clamp。

### 8.3 指标数值生成决策

R0 必须锁定：非路由场景的指标数值由谁产生。推荐方案如下：

1. `model-router` 继续使用现有物理模拟器：请求流量、输入 token、模型成本、质量分、延迟、上下文上限和 fallback 共同决定指标。
2. `rag-answer-quality`、`agent-tool-failure`、`trace-not-diagnostic`、`multi-agent-stuck` 等非路由场景使用通用 `baseline + metricEffects` 模型：
   - `baseline.metrics` 给出初始指标值、单位、好坏方向、上下限和解释。
   - 每个被选中的 `StrategyOption.metricEffects` 对对应指标产生量级化增量。
   - 缺省量级映射为 `small = 5%`、`medium = 12%`、`large = 25%`；必要时用 `deltaMode / delta` 覆盖。
   - 多个 effect 叠加后按指标 `min/max` clamp，再按 `polarity` 与 baseline 计算 `trend`。
   - explanation 必须拼接 baseline 解释和所有 effect 解释，让用户能看到“为什么变好 / 变差”。
3. 每类场景专属物理模型是优化项，不是 R1 前置项。只有当通用模型无法表达关键取舍时，才新增 `ragQualitySimulator` 等专属模拟器。

这个决策的目的不是追求数学真实，而是保证每次策略切换后的数值变化可解释、可复盘、可校验。

### 8.4 兼容策略

分两步落地：

1. **R1 兼容扩展**：保留现有 `ScenarioExercise` 字段，新增可选 `type / capabilityDomains / initialSymptom / objectLabels / facts`。`model-router` 不需要立即重写；`type` 缺省可按 `modelRouting` 兼容处理。
2. **R1 页面泛化**：先改 `ScenarioPage` 的展示标签和事实对象渲染，不急于拆分全部 simulator。
3. **R2 泛化重构**：将 `ScenarioPage` 和 `scenarioSimulation` 从模型路由专用命名中抽象出来，支持不同场景类型的模拟器。

### 8.5 校验规则

新增或强化 `validate:content`：

- `scenarioExercises.length >= 3` 后，必须存在唯一 id 和唯一 route。
- 每个场景 `relatedConceptIds.length >= 3`，且全部存在。
- 每个场景至少 4 个指标、3 个策略组、3 个事件。
- `type === 'modelRouting'` 时必须保留 `requestTypes.length >= 4` 与 `modelPool.length >= 4`；非路由场景不应被这两条卡死，但必须提供 `facts.length >= 3`。
- 每个事件必须有：症状、正确诊断、排查顺序 >= 3、遗漏风险 >= 2、下一步建议 >= 2。
- 每个策略选项必须说明对至少 1 个指标的影响，且 `metricEffects.metricId` 必须引用本场景 `baseline.metrics[].id`。
- 每个场景必须至少关联 1 个能力域。
- 所有指标引用必须指向本场景定义过的指标 id；这条要覆盖 `metricEffects.metricId`、事件关联指标、review signal 关联指标。
- `triggerStrategyOptionIds` 必须引用本场景真实存在的 option id，避免事件永远不触发却无报错。
- `events[].relatedConceptIds` 必须全部引用存在的 Concept id，不能只校验场景顶层 `relatedConceptIds`。
- 禁止空字符串占位和未脱敏真实客户信息。

## 9. 模拟逻辑需求

### 9.1 设计原则

- 模拟必须可解释，不追求真实数学精度。
- 每个指标变化都要能回到策略、事实对象或事件。
- 所有场景使用 deterministic simulation，同样输入必须得到同样结果。
- 复盘结果不使用 LLM 判分，先用触发事件和 rubric 展示参考答案。

### 9.2 R1 模拟器策略

R1 不应直接为每个场景写一套物理模型。推荐先形成两个路径：

```text
scenarioSimulation.ts
  modelRouting path：保留现有 model-router 物理计算
  genericDelta path：baseline.metrics + selected metricEffects -> metrics / events / review
```

`genericDelta` 的输入输出与现有 `runScenarioRound()` 保持一致，便于 `ScenarioPage` 复用：

- 当前 `ScenarioState`。
- 指标数组。
- 事实对象解释。
- 触发事件。
- 风险信号。
- 推荐动作。
- 复盘结果。

R2/R3 只有在通用 delta 模型不足以表达场景关键机制时，再拆成目录：

```text
scenarioSimulation/
  index.ts
  modelRoutingSimulator.ts
  genericDeltaSimulator.ts
  ragQualitySimulator.ts        // 可选优化
  costGovernanceSimulator.ts    // 可选优化
  agentToolingSimulator.ts      // 可选优化
  observabilitySimulator.ts     // 可选优化
  shared.ts
```

### 9.3 首批复用策略

- `token-cost-spike` 是流程验证场景：它能复用 `model-router` 的成本、延迟、成功率、投诉率心智，工作量最低，但不能证明 schema v2 已适配非路由场景。
- `rag-answer-quality` 是架构验证场景：它没有“路由到模型”的天然物理量，必须验证 `baseline + metricEffects` 能否稳定产出召回、引用、上下文冲突、事实错误等指标。
- `agent-tool-failure`、`trace-not-diagnostic`、`multi-agent-stuck` 建议在 R1 的通用 delta 模型跑通后实现。

## 10. 页面体验需求

### 10.1 ScenarioPage 泛化

当前页面固定展示“请求队列 / 模型池负载 / 路由策略”。扩库后应改为由场景配置驱动：

| 当前文案 | 通用配置 |
|---|---|
| 请求队列 | `objectLabels.factsTitle` |
| 模型池负载 | `objectLabels.secondaryTitle` |
| 路由策略 | `objectLabels.controlTitle` |
| 候选模型 | 根据 `type` 显示“候选模型 / 文档片段 / 工具 / Trace span / 子 Agent” |

### 10.2 场景目录页

当场景数超过 3 个时新增 `/scenarios`：

- 按能力域筛选。
- 按场景类型筛选。
- 显示难度、预计时长、关联知识点。
- 标记已完成、加入复盘、推荐下一场景。

### 10.3 Concept 入口

每个 Concept 可展示关联场景：

- 如果是 `entryConceptIds`，显示主入口。
- 如果只是 `relatedConceptIds`，显示“相关演练”。
- 有 `decisionGuide` 的知识点，应在工程决策章节附近展示场景入口。

### 10.4 Search 入口

Search 应支持场景结果：

- 搜索 `RAG 答案差` 命中 `rag-answer-quality`。
- 搜索 `成本上涨` 命中 `token-cost-spike` 和 `token-roi`。
- 搜索 `工具调用失败` 命中 `agent-tool-failure`。
- 搜索 `Trace 无法排查` 命中 `trace-not-diagnostic`。

搜索结果类型建议：

```ts
type SearchItemType = 'concept' | 'glossary' | 'scenario';
```

### 10.5 Profile 入口

Profile 推荐逻辑增加场景信号：

- 能力域短板对应场景推荐。
- 错题属于 RAG / Agent / Trace 时推荐相关场景。
- 用户完成相关 Concept 后推荐综合场景。
- 用户提交场景诊断后，可将关联 Concept 加入本周复盘。

## 11. 内容生产流程

场景内容继续遵守 draft -> review -> 入库：

```text
content/drafts/scenarios/<scenario-id>.md
  -> content/reviewed/scenarios/<scenario-id>.md
  -> src/data/scenarioExercises.ts 或 src/data/scenarios/<scenario-id>.ts
```

### 11.1 Draft 模板

每个场景草稿必须包含：

- 场景 id、标题、类型、能力域、关联知识点。
- 业务背景，必须含规模或指标。
- 初始异常症状。
- 事实对象列表。
- 策略控件和选项。
- 指标定义。
- 至少 3 个触发事件。
- 每个事件的正确诊断、排查顺序、遗漏风险、下一步建议。
- 复盘 rubric。
- 内容风险自查：是否过度泛化、是否缺工程信号、是否包含敏感真实信息。

### 11.2 Review 门禁

审核 Agent 必须逐项判断：

- 是否能训练跨知识点判断，而不是单讲概念题。
- 异常症状是否真实、具体、可复盘。
- 指标是否能解释策略取舍。
- 强干扰项是否合理。
- 排查顺序是否符合真实工程顺序。
- 关联知识点是否准确。
- 是否有敏感信息或供应商真实价格。

## 12. 分期计划

### R0：PRD 与 schema 评审

目标：确认场景库方向、schema 扩展范围和非路由场景的指标数值生成方式。

产物：

- 本 PRD。
- `scenarioExercise` v2 schema 设计草案。
- 首批 6 个场景优先级确认。
- `content/drafts/scenarios/`、`content/reviewed/scenarios/` 目录骨架。
- `content/drafts/scenarios/_template.md` 场景草稿模板。

验收：

- Owner 确认 P0 场景：`rag-answer-quality`、`token-cost-spike`。
- 锁定 R1 使用 `baseline.metrics + metricEffects` 量级化 delta 的通用数值模型，`model-router` 保留现有物理模拟器兼容。
- 明确 `requestTypes` / `modelPool` 仅对 `type === 'modelRouting'` 强制，非路由场景用 `facts` 和 `baseline.metrics` 表达。
- 明确 R1 策略控件是“每组单选、多组组合”，不做组内多选。
- 明确 `/scenarios` 目录页等场景达到 3 个后再进入 R2。
- 明确 `ScenarioMetric.id` 从枚举改为 string，并同步 polarity 化、validator 引用校验和硬编码移除。

### R1：新增 2 个 P0 场景

目标：用最小 schema 扩展上线 2 个高价值场景，同时验证非路由场景的通用数值模型。

范围：

- `token-cost-spike`：流程验证，优先复用模型路由的成本 / 延迟 / 成功率 / 投诉率心智。
- `rag-answer-quality`：架构验证，重点证明非路由场景也能通过 `baseline + metricEffects` 产出可解释指标。
- `ScenarioPage` 支持通用页面标签和事实对象。
- Search 可命中场景。
- Concept 入口接入。

验收：

- `validate:content`、`typecheck`、`lint`、`build` PASS。
- 浏览器 smoke 覆盖：Concept -> 场景 -> 调策略 -> 提交诊断 -> 复盘面板 -> Profile 或 Search。
- 每个场景至少 3 个策略组、4 个指标、3 个事件。
- 两个 P0 场景的指标数值必须随策略切换发生可解释变化，复盘面板能说明为什么变好 / 变差。
- `rag-answer-quality` 不得依赖 `requestTypes` / `modelPool` 的模型路由物理量。

### R2：场景库页面与 Profile 推荐

目标：让场景演练成为独立学习资产。

范围：

- 新增 `/scenarios` 场景目录页。
- Profile 根据能力域短板推荐场景。
- 本周复盘支持场景级记录，或至少支持场景关联 Concept 复盘。
- 场景完成状态本地持久化；完成事件锚点建议定义为“用户提交诊断并展开复盘面板”。

验收：

- 场景目录桌面和移动端可用。
- 用户能看到已完成 / 推荐 / 未完成场景。
- Profile 推荐逻辑同时考虑完成度、错题、复盘清单、场景状态中的至少两类信号。

### R3：新增 3 个 P1/P2 场景

目标：覆盖 Agent、Trace、多 Agent 三类负责人高频复盘问题。

范围：

- `agent-tool-failure`。
- `trace-not-diagnostic`。
- `multi-agent-stuck`。
- 通用 simulator 分层。
- 回归 QA。

验收：

- 总场景数达到 6 个。
- 每个能力域至少被 1 个场景覆盖。
- 场景搜索、目录、Concept 入口、Profile 推荐均可用。

## 13. 任务拆解建议

| ID | 任务 | Owner | 依赖 | 产物 |
|---|---|---|---|---|
| SCN-SPEC-01 | 场景库 schema v2 细化 | Product Architect / Implementation | 本 PRD | `docs/content-schema.md` 草案 |
| SCN-SPEC-02 | 场景 draft 模板和目录骨架 | Product Architect / Content & Validation | SCN-SPEC-01 | `content/drafts/scenarios/_template.md` |
| SCN-DATA-01 | `rag-answer-quality` draft | Content & Validation | SCN-SPEC-01, SCN-SPEC-02 | `content/drafts/scenarios/rag-answer-quality.md` |
| SCN-DATA-02 | `token-cost-spike` draft | Content & Validation | SCN-SPEC-01, SCN-SPEC-02 | `content/drafts/scenarios/token-cost-spike.md` |
| SCN-REVIEW-01 | P0 场景审核 | Product Architect | SCN-DATA-01/02 | `content/reviewed/scenarios/*.md` |
| SCN-DEV-01 | schema/types/validator 扩展 | Implementation | SCN-SPEC-01 | `src/types/index.ts`、`scripts/validate-content.ts` |
| SCN-DEV-02 | P0 场景数据入库 | Implementation | SCN-REVIEW-01, SCN-DEV-01 | `src/data/scenarioExercises.ts` |
| SCN-DEV-03 | ScenarioPage 通用标签和事实对象 | Implementation | SCN-DEV-01 | `src/pages/ScenarioPage.tsx` |
| SCN-DEV-04 | 场景 simulation 扩展 | Implementation | SCN-DEV-02 | `src/utils/scenarioSimulation.ts` 或拆分目录 |
| SCN-DEV-05 | Search / Concept 入口 | Implementation | SCN-DEV-02 | Search、ConceptPage |
| SCN-QA-01 | P0 场景 QA | Content & Validation | SCN-DEV-03/04/05 | `reports/scenario-library-p0-qa.md` |

## 14. 验收标准

### 14.1 内容验收

- 每个场景有明确业务规模或指标。
- 每个场景至少 3 个策略控件、4 个指标、3 个事件。
- 每个事件都有正确诊断、排查顺序、遗漏风险和下一步建议。
- 每个场景至少关联 3 个知识点。
- 复盘结论能回链到具体 Concept，而不是泛泛建议。

### 14.2 工程验收

- `cmd /c npm run validate:content` PASS。
- `cmd /c npm run typecheck` PASS。
- `cmd /c npm run lint` PASS。
- `cmd /c npm run build` PASS。
- 如触达桌面发行，额外运行 `cmd /c npm run build:desktop` 和 `cmd /c npm run smoke:desktop`。

### 14.3 浏览器验收

至少覆盖：

- 桌面：进入每个新增场景、切换策略、提交诊断、查看复盘。
- 移动端：指标条、策略控件、复盘面板不溢出。
- Concept 入口：从至少 2 个相关知识点进入场景。
- Search：用意图词命中场景。
- Profile：若接入推荐或复盘，验证本地刷新后状态保留。

### 14.4 产品验收

- 用户能在 3 分钟内理解场景异常并完成一次诊断提交。
- 指标变化解释能说明“为什么变好 / 变差”。
- 复盘结论能明确“第一步查什么、第二步查什么、不要先做什么”。
- 场景演练不是单讲题目换皮，而是至少跨 3 个知识点。

## 15. 风险与对策

| 风险 | 表现 | 对策 |
|---|---|---|
| schema 过早泛化 | 类型复杂但场景不够多 | R1 只做兼容扩展，R2 再抽象 simulator。 |
| 场景变成管理话术 | 只有“加强治理”“优化流程” | 每个事件必须绑定指标、排查顺序和遗漏风险。 |
| 模拟逻辑不可信 | 用户看不懂指标为什么变化 | R1 必须让 `metricEffects` 参与数值计算，并在 explanation 中回显 baseline 与 effect。 |
| UI 变成 dashboard | 页面拥挤、阅读负担重 | 保持一页工作台，指标少而关键，解释短而明确。 |
| 内容入库绕过审核 | 场景质量不稳定 | 继续走 draft -> reviewed -> 主开发入库。 |
| Search 结果混乱 | 场景、概念、术语互相抢排序 | 增加结果类型和 reason，场景只在意图词或强匹配时高排。 |

## 16. 待 Owner 确认的默认答案

1. `ScenarioMetricId` 建议从固定枚举改为 string；前提是同步完成 polarity 化、validator 引用校验，并移除 `METRIC_ORDER`、`deriveMetrics` accumulators、`getEventMetricIds` 等固定 6 指标硬编码。
2. `/scenarios` 目录页等场景达到 3 个后再做，放入 R2。
3. R1 先复用 `reviewConceptIds`，把场景关联知识点加入本周复盘；R2 再评估是否新增 `reviewScenarioIds`。
4. R1 上两个场景：`token-cost-spike` 是流程验证，`rag-answer-quality` 是架构验证。不能只上 cost 场景，否则无法证明 schema v2 支持非路由场景。
5. 场景 completion 可在 R2 计入能力域分数，权重低于学习完成度；完成事件建议定义为“提交诊断并展开复盘面板”。
6. R1 策略控件保持每组单选、多组组合；组内多选不进入 R1。

## 17. 推荐执行顺序

建议 Owner 确认后按以下顺序推进：

1. 先锁 R0 架构决策：指标数值生成方式、`requestTypes/modelPool` 条件化校验、策略组单选 / 多选边界。
2. 建 `content/drafts/scenarios/` 与 `content/reviewed/scenarios/` 目录骨架，并提供 `_template.md`。
3. 先做 `token-cost-spike`，因为它与 `model-router` 的指标和模拟逻辑复用度最高，能快速验证扩库流程。
4. 同一轮做 `rag-answer-quality`，因为它才是真正验证 schema v2 和通用 delta 模拟器的非路由场景。
5. 场景达到 3 个后新增 `/scenarios` 目录页和 Search 场景结果。
6. 再进入 `agent-tool-failure`、`trace-not-diagnostic`、`multi-agent-stuck`，把场景库从 MaaS/RAG 扩到 Agent/治理。

一句话目标：场景演练库要让用户不只是“知道这些 AI 工程概念”，而是能在复杂生产症状下做出可解释、可复盘、能带团队执行的第一判断。
