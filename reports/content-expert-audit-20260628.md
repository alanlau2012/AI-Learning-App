# AI-Learning-App 内容专业审核报告

> 日期：2026-06-28  
> 主审：Codex 主审 Agent  
> 审核方式：4 个专项子 Agent 并行只读审核 + 主审合并去重  
> 范围：56 讲核心内容、decisionGuide、capabilityDomains、scenarioExercises、诊断题与关键交接文档  
> 验证基线：`cmd /c npm run validate:content` PASS

## 1. 结论先行

总体结论：**有条件通过，不建议直接封板发布内容质量版本**。

当前没有发现 P0 阻断级事实错误；MaaS、Agent、Trace、Tool Calling、Token ROI、RAG 质量诊断等主干内容整体专业，结构门禁也通过。但有多处 P1 会误导真实企业工程判断，尤其集中在：

1. Session Affinity 决策手册重新把缓存局部性说成上下文连续性。
2. RAG 场景把权限过滤设计成可选召回策略，而不是企业 RAG 的强制安全边界。
3. Trace / 路由链路中仍有“还原输入输出”的表述，容易被误读为原文全量采集。
4. Token 成本场景中的“相似租户”缓存分组有跨租户隔离风险。
5. 诊断题存在系统性“最长、最完整选项即正确答案”的结构泄漏。

严重级别汇总：

| 级别 | 数量 | 主审判断 |
|---|---:|---|
| P0 | 0 | 无阻断级事实错误 |
| P1 | 6 | 发布前应优先修复 |
| P2 | 8 | 建议下一轮批量修复或 Owner 定稿 |
| P3 | 2 | polish 项 |

## 2. P1 高风险问题

| 编号 | 位置 | 问题 | 风险 | 主审建议 |
|---|---|---|---|---|
| P1-01 | `src/data/decisionGuides.ts` / `session-affinity` | 决策手册把 Session Affinity 表述为保持上下文状态 | 误导平台团队以为粘住实例即可保证语义上下文连续 | 改成缓存局部性、shared prefix、服务端临时状态；明确语义上下文由应用层状态保证 |
| P1-02 | `src/data/scenarioExercises.ts` / `rag-answer-quality` | 权限过滤被放入 `retrievalScope` 单选策略 | 企业 RAG 可能越权召回、越权引用 | 权限过滤应拆成强制前置安全边界或独立安全控制 |
| P1-03 | `src/data/decisionGuides.ts` / `trace` | “必须还原每一步输入”表述过强 | 可能被理解为 Prompt / 文档 / 工具结果原文全量落库 | 改为还原输入摘要、引用 id、hash、版本、脱敏参数和决策原因 |
| P1-04 | `src/data/demoConcepts.ts` / `multi-model-routing` | “记录模型版本、输入输出”边界过宽 | MaaS 网关可能默认保存原始请求/响应 | 改为记录路由特征、Token、脱敏摘要或引用 id/hash、错误码和成本 |
| P1-05 | `src/data/scenarioExercises.ts` / `token-cost-spike` | “相似租户和任务”命中缓存实例 | 容易诱导跨租户缓存/上下文复用 | 改成同一租户内按任务模板、权限边界、版本和 cache key 分组 |
| P1-06 | `src/data/demoConcepts.ts` / 诊断题 | 56 题中大量正确项最长、最完整、语气最专业 | 学员可凭形态猜答案，削弱诊断训练价值 | 批量平衡选项长度和可信度；正确项只保留关键动作，闭环放 explanation |

## 3. P2 中优先级问题

| 编号 | 位置 | 问题 | 建议 |
|---|---|---|---|
| P2-01 | `src/data/decisionGuides.ts` / `tool-calling` | `工具调用成功率` 缺少分桶和告警边界 | 补参数错误、权限拒绝、超时、业务拒绝、写工具误调用等分桶 |
| P2-02 | `src/data/decisionGuides.ts` / `agent-loop` | 只看平均循环步数和超时率不足 | 补 P95/P99 步数、预算耗尽率、重复动作率、人工接管率 |
| P2-03 | `src/data/capabilityDomains.ts` / `human-in-the-loop` | 主域放在 `agentEngineering`，弱化治理定位 | Owner 确认；若面向负责人画像，建议主域改为 `securityGovernanceOrg` |
| P2-04 | `src/data/capabilityDomains.ts` / `multi-agent` | secondary 选 `evaluationObservability` 与旧规格口径分叉 | 明确采用“观测优先”还是“治理优先”，写入 reviewed 结论 |
| P2-05 | `src/data/demoConcepts.ts` / `human-in-the-loop` | relatedConceptIds 缺少 `permission-governance`、`trace` | 补强 HITL 到权限、审计、审批证据和可回放的学习路径 |
| P2-06 | `src/data/scenarioExercises.ts` / `token-cost-spike` | `任务窗口裁剪` 同时像可接受动作和坏路径触发条件 | 改为“带质量护栏、按价值分层的裁剪”，禁止全局裁剪 |
| P2-07 | `docs/content-schema.md` / ScenarioExercise | modelRouting 旧约束与 R1 genericDelta 约束并存 | 把旧 `requestTypes/modelPool` 要求标注为 modelRouting-only |
| P2-08 | `src/data/capabilityDomains.ts` / `ragContextEngineering` | 上下文工程分数可能被理解为完整 RAG 架构能力 | 考虑拆分“上下文工程”和“RAG/知识库架构”，或增加 RAG 专项权重 |

## 4. P3 低优先级问题

| 编号 | 位置 | 问题 | 建议 |
|---|---|---|---|
| P3-01 | `src/data/demoConcepts.ts` / `subagent` | 支付风控场景的排障路径出现“冲突文件”措辞 | 改为“冲突证据、冲突结论和越权角色” |
| P3-02 | `src/data/scenarioExercises.ts` / `rag-answer-quality` | `over-refusal` 中“拒答率下降不应以事实错误回升为代价”易读反 | 改为“降低过度拒答时，不能让事实错误率回升” |

## 5. 交接文档问题

`AGENTS.md` 当前状态快照仍写 `12 条 decisionGuide`，并把 `multi-agent / eval / observability / trace / permission-governance` 写成 Phase 1B 剩余项。但当前 `src/data/decisionGuides.ts` 已有 17 条，Phase 1B 的 5 条已经入库。

主审建议：这不是课程事实错误，但会误导后续 Agent 重复规划，应在下一轮修复中同步刷新 `AGENTS.md`、`docs/project-board.md` 和相关阶段报告引用。

## 6. 诊断题专项结论

结构上，诊断题未发现 `correctOptionIds` 悬空、单选多答案或 schema 断裂；`validate:content` 已覆盖结构完整性。

专业上，最大问题是答案形态泄漏：

- 正确项经常是最长、最完整、最像“工程闭环”的选项。
- 干扰项常常更短、更像口号，或明显反向动作。
- 学员可能不需要理解 TTFT、缓存、Trace、权限、RAG 质量链路，也能靠选项形态猜对。

建议修复策略：

1. 每题先保留一个真正的第一步动作。
2. 把完整闭环从选项挪到 explanation。
3. 干扰项也写成真实工程团队可能犯的“半对但有风险”的动作。
4. 控制四个选项长度接近，避免正确项一眼最专业。
5. 优先修 `session-affinity`、`capability-routing`、`cache-system`、`trace`、`observability`、`token-roi`。

## 7. 企业 AI 工程负责人视角评价

已经做得较好的部分：

- MaaS 性能成本主线清晰，TTFT/TPOT、Prefill/Decode、KV Cache、Batch、P-D 分离、限流熔断、SLA、Token ROI 具备工程解释力。
- Agent 工程化没有明显神化，已覆盖工具权限、Trace、Loop 控制、人工接管、评测回流等关键边界。
- Trace / Tool Calling 旧 P1 风险已在正文中大体修正，当前问题主要残留在局部决策手册或场景文案。

仍不足的部分：

- 企业 RAG 的权限过滤、数据边界、知识库运营和平台化治理还不够突出。
- “RAG 与上下文工程”能力域容易把上下文治理能力等同于完整知识库架构能力。
- 企业 Copilot、AI 工作台、Skill 市场、Ask/Do/Build 等应用架构形态覆盖不足，目前更偏 Agent/Coding/Context。

## 8. 建议修复顺序

第一批，发布前最小修复：

1. 修 `session-affinity` decisionGuide 的上下文连续性口径。
2. 修 `rag-answer-quality` 权限过滤建模，把权限过滤从可选策略改成硬边界。
3. 修 Trace / multi-model-routing 中输入输出记录边界。
4. 修 `token-cost-spike` 的“相似租户”缓存分组表述。
5. 对诊断题做一轮选项长度和语气平衡。

第二批，负责人画像与学习路径修复：

1. Owner 定稿 `human-in-the-loop` 与 `multi-agent` 能力域。
2. 给 HITL、RAG 场景补 `permission-governance` / `trace` / `securityGovernanceOrg` 链接。
3. 清理 `docs/content-schema.md` 中 ScenarioExercise R1 新旧约束。
4. 刷新 `AGENTS.md` 当前状态快照。

第三批，产品增强：

1. 增加企业 Copilot / AI 工作台 / Skill 市场 / Ask-Do-Build 场景演练或决策手册。
2. 校准 `ragContextEngineering` 能力域命名和评分权重。

## 9. 审核范围与不确定性

实际覆盖：

- `AGENTS.md`
- `agents/ai-fullstack-content-review-agent.md`
- `docs/content-schema.md`
- `src/data/demoConcepts.ts`
- `src/data/concepts.ts`
- `src/data/decisionGuides.ts`
- `src/data/capabilityDomains.ts`
- `src/data/scenarioExercises.ts`
- 既有阶段报告作为背景参考

未覆盖：

- 未做浏览器逐页点击验收。
- 未对全部 56 讲逐字重写建议。
- 未联网查证每个外部技术细节；本轮以当前主流工程常识和仓库内已有修复口径为依据。

主审判断：

- 本轮发现足够支撑一次内容修复 PR。
- 当前问题主要是专业边界、学习评测质量和负责人画像口径，不是 schema 或构建问题。
