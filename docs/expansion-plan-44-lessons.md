# 44 讲扩展计划 · expansion-plan-44-lessons

> MVP 0.1 修复回合 1 封板后制定，MVP 0.2 Wave 1/2 已按实际执行重切为 **7 + 7** 两波，Wave 3 完成 M3 收口。后续继续按小批次扩展，**不一次性生成剩余 12 讲**。每批都走 `content/drafts/ → content/reviewed/ → 主开发合入 src/data/* → validate:content` 流水线，并以 [content-production-gate.md](content-production-gate.md) 为每讲入库硬门禁、以 [mvp-0.1-frozen-sample-standard.md](mvp-0.1-frozen-sample-standard.md) 为样板基线。
> **Final Wave 已完成：56 / 56 讲全部上线（全部 `contentRevision: v2`）**：M1 `10/10`、M2 `10/10`、M3 `8/8`、M4 `16/16`、M5 `6/6`、M6 `6/6`，地图无 stub。
> 见 `reports/final-wave-summary.md`；正文改版 v2 见 `reports/content-revision-platform-summary.md`。
> 本计划不改 id/order/模块计数（`10/10/8/16/6/6`）。

---


> 执行偏差说明：原计划 Batch 1（8）+ Batch 2 前半（6）已在 MVP 0.2 中重切为 Wave 1（7）+ Wave 2（7），合计 20 讲已完成。后续 Agent 不应再按“Batch 1 todo / Batch 2 todo / M3 todo”理解当前状态。

## 0. 批次总览

| 批次 | 原计划讲数 | 模块 | 当前状态 | 核心定位 | 动画风险 | Owner 再确认 |
|---|---|---|---|---|---|---|
| Batch 1 / Wave 1+2 已覆盖部分 | 8 | M1 收尾 | **done：M1 已 10/10** | 入门路径完整闭环，纯文本为主、最低风险，验证流水线 | 低（复用通用画布） | 否 |
| Batch 2 已覆盖部分 | 6 | M2 收尾 | **done：M2 已 10/10** | 推理性能主干闭环，复用 `prefill-decode` / `kv-cache` | 低 | 否 |
| Wave 3 | 6 | M3 收尾 | **done：M3 已 8/8** | 平台主干收口，补齐 MaaS / 路由 / 缓存 / SLA | 中（复用 model-router） | 否 |
| MVP 0.3 Wave 4A | 6 | M4 上下文工程 + 工具调用 | **done：M4 已 9/16** | Prompt/Context、系统提示、压缩、污染、分层会话、工具调用 | 低（复用 agent-loop） | 否 |
| MVP 0.3 Wave 4B | 6 | M4 剩余主体链路 | **done：M4 已 15/16** | AGENTS.md、仓库上下文、规格驱动、Subagent、Memory、Human-in-the-loop | 低 | 否 |
| Final Wave | 12 | M4 收尾(1) + M5 + M6 | **done：56/56 全量上线** | 软件工程闭环 + 企业治理收口；零新动画（按 Owner 决策本轮不动可选动画） | 低（复用现有，本轮无新动画） | 已确认（治理口径 R3：行业参考量级标注为参考） |
| 合计 | 44 | — | **已完成 56/56** | — | — | — |

**为什么这个顺序**：先完成已有锚点最密集、动画复用最高、内容风险最低的模块（M1→M2/M3→M4），把高不确定性（M6 治理类内容口径、可能的新动画类型）留到最后一批，并在那之前已用三批验证好整套门禁与流水线。

---

## Batch 1：M1 收尾（8 讲）

**1. 讲次范围**
`semantic-space`（M1·2）、`transformer`（M1·3）、`positional-encoding`（M1·5）、`autoregressive`（M1·6）、`sampling`（M1·7）、`instruction-tuning`（M1·8）、`hallucination`（M1·9）、`reasoning-limit`（M1·10）。

**2. 所属模块**：M1「模型怎么工作」（入门路径，全部用户）。

**3. 为什么先做这一批**
- M1 已有 `token`、`attention` 两讲上线作锚点，补齐后即形成**第一个完整可学模块**，是最小可演示的样板验证。
- 8 讲中仅 `autoregressive` 含动画（`token-flow`，复用现有通用画布），其余纯文本，**动画风险最低**，适合先跑通整套门禁与合入流水线。
- 入门路径完整后，后续批次都有「从入门到进阶」的连续主线。

**4. 内容 Agent 输入**
`content/drafts/`（8 个新草稿）、[content-schema.md](content-schema.md)、[mvp-0.1-frozen-sample-standard.md](mvp-0.1-frozen-sample-standard.md)、[content-production-gate.md](content-production-gate.md)、已上线 `token`/`attention` 作为同模块口径参照、56 讲写作素材。

**5. 内容审核 Agent 门禁**
按 [content-production-gate.md](content-production-gate.md) 逐项判定：结构门禁（条数区间 + 心智模型去模板化，8 讲条数不得雷同）、企业案例门禁（≥2 类工程信号）、诊断题门禁（本批含诊断题的讲整批配平 A/B/C/D、≤40%、≥30% 强干扰项）、schema 门禁。

**6. 主开发合入方式**
主开发按 [content-schema.md](content-schema.md) §3 映射，把 8 讲 `contentStatus` 由 `stub` 升为 `mvp`，补齐完整性字段，合入 `src/data/demoConcepts.ts`（或后续正式数据文件），运行 `validate:content`/`typecheck`/`lint`/`build`。内容/审核/动画 Agent 不得直接改 `src/data/*`。

**7. 动画复用或新增需求**
- 复用：`autoregressive` → `token-flow`（专用 `TokenFlowAnimation` 画布）。
- 新增：无。其余 7 讲无动画。

**8. E2E 验收项**
- 四命令全绿；`validate:content` 仍报 `56 登记 / 10/10/8/16/6/6`。
- M1 上线讲数从 2 → 10；「下一讲 / 继续学习 / 推荐入口」可自然走完 M1 主线，**不进入任何 stub**。
- 8 讲详情页四层闭环完整、不泄漏内部状态/raw key。
- 本批诊断题整批分布达标；`autoregressive` 动画可逐步播放、reduced-motion 可读、无 raw key。
- 56 讲地图仍完整，其余模块 stub 仍弱化置灰。

**9. 是否需要 Owner 再确认**：**否**。零新动画、零 schema 改动、零目录调整，在既定授权内。

---

## Batch 2：M2 收尾 + M3 收尾（12 讲）

**1. 讲次范围**
- M2（6）：`tpot`、`session-affinity`、`batch-scheduling`、`pd-separation`、`speculative-decoding`、`quantization`。
- M3（6）：`maas`、`cost-routing`、`capability-routing`、`cache-system`、`rate-limit-circuit-break`、`sla`。

**2. 所属模块**：M2「模型怎么跑得又快又稳」（工程路径）+ M3「模型怎么变成企业平台」（平台负责人）。

**3. 为什么先做这一批**
- M2 已有 `prefill/decode/ttft/kv-cache` 锚点，M3 已有 `model-gateway/multi-model-routing` 锚点，补齐即形成「推理性能 → MaaS 平台」的工程主干。
- 动画复用度高：`tpot` 复用 **prefill-decode 真实画布**、`session-affinity` 复用 **kv-cache 真实画布**、`cost-routing/capability-routing` 复用 `model-router` 通用画布——直接验证本轮两个真实画布的可复用性。
- 这两个模块是「平台/工程」受众的核心价值点，优先级高于纯应用层。

**4. 内容 Agent 输入**
`content/drafts/`（12 个新草稿）、规格三件套、已上线 M2/M3 锚点讲、本轮升级后的 `model-gateway`/`multi-model-routing` 案例作为案例信号写法参照。

**5. 内容审核 Agent 门禁**
全门禁逐项；重点：M3 治理类案例的「指标/规模/约束/验证结果」信号（参照 `multi-model-routing` 月 120 万次/成本涨 65%/回放 1 万条）；诊断题强干扰项要贴近平台真实误判（先扩容、先加副本、先小流量灰度）。

**6. 主开发合入方式**
同 Batch 1。`tpot`/`session-affinity` 上线时把 `hasAnimation` 与 `animation` 配置接入既有 `prefill-decode`/`kv-cache` 画布（画布已预留元素，无需改协议）。

**7. 动画复用或新增需求**
- 复用：`tpot`→`prefill-decode`（真实）、`session-affinity`→`kv-cache`（真实）、`cost-routing`/`capability-routing`→`model-router`（通用）。
- 可选新增（**非阻塞、建议**）：把 `model-router` 从通用画布升级为**真实画布**——M3 共 4 讲复用（model-gateway/multi-model-routing/cost-routing/capability-routing），复用度最高，是首个最值得做的新真实画布。`batch-scheduling`→`batch-scheduler`、`pd-separation`→`pd-separation` 为可选新类型，可暂留通用或本批不接动画。

**8. E2E 验收项**
- 四命令全绿；M2 上线 4→10、M3 上线 2→8。
- `prefill-decode`/`kv-cache` 真实画布在新讲（tpot/session-affinity）下正确复用、key 映射正确、无 raw key。
- 若升级 `model-router` 真实画布：4 讲均正确渲染、`validate:animation` 通过、不泄漏 key、reduced-motion 可读。
- 工程/平台主线「下一讲/继续学习」连续不进 stub；本批诊断题整批分布达标。

**9. 是否需要 Owner 再确认**：**知会，非阻塞**。若决定本批升级 `model-router` 真实画布，告知 Owner 动画投入；不升级则无需确认。

---

## Batch 3：M4 收尾（12 讲，13 中先做 12）

**1. 讲次范围**
`prompt-context`、`system-prompt`、`context-compression`、`context-pollution`、`layered-session`、`agents-md`、`repo-context`、`spec-driven-development`、`tool-calling`、`subagent`、`memory`、`human-in-the-loop`。（M4 剩余 13 stub 中本批做 12，`multi-agent` 留 Batch 4 作整合性收尾。）

**2. 所属模块**：M4「模型怎么变成 Agent」（应用路径，应用开发）。

**3. 为什么先做这一批**
- M4 是全书最大模块（16 讲），已有 `context-window/agent-loop/skill` 三个锚点；补齐上下文工程与 Agent 构建核心后，应用路径成型。
- `tool-calling` 复用 **agent-loop 真实画布**（画布已为其预留元素），验证 agent-loop 画布复用。
- 上下文工程（prompt/context 系列）是应用受众最高频需求，价值密度高。
- 拆出 `multi-agent` 到末批，因其依赖前面 subagent/human-in-the-loop 等概念，作为整合讲更自然。

**4. 内容 Agent 输入**
`content/drafts/`（12 个新草稿）、规格三件套、已上线 `context-window`/`agent-loop`/`skill` 锚点、`agents-md`/`repo-context`/`spec-driven-development` 可参照本仓库 `AGENTS.md` 等真实工程实践。

**5. 内容审核 Agent 门禁**
全门禁逐项；重点：上下文工程类讲避免「百科味」（必须有工程场景与判断）；`tool-calling` 动画画面意图须说明对 agent-loop 画布的元素映射；诊断题贴近 Agent 真实失败（上下文污染、工具误用、缺人审）。

**6. 主开发合入方式**
同前。`tool-calling` 接入既有 `agent-loop` 画布配置（无需改协议）。12 讲 `stub→mvp`，合入后跑四命令。

**7. 动画复用或新增需求**
- 复用：`tool-calling`→`agent-loop`（真实）。
- 新增：无强制。其余 11 讲多为上下文工程概念，可暂不接动画或用通用画布；`skill-lifecycle` 等扩展类型按需在后续评估，不在本批强制。

**8. E2E 验收项**
- 四命令全绿；M4 上线 3→15（剩 `multi-agent` 在 Batch 4）。
- `agent-loop` 真实画布在 `tool-calling` 下正确复用、无 raw key。
- 应用路径主线连续不进 stub；上下文工程 12 讲四层闭环完整、关联无悬空。
- 本批诊断题整批分布达标；56 讲地图仍完整。

**9. 是否需要 Owner 再确认**：**否**。复用现有真实画布、零 schema 改动。

---

## Batch 4：M4 收尾(1) + M5 + M6（12 讲）

**1. 讲次范围**
- M4（1）：`multi-agent`。
- M5（6→剩 5 stub）：`code-review-agent`、`requirement-decomposition-agent`、`test-generation-agent`、`ops-diagnosis-agent`、`value-review-agent`。
- M6（6）：`eval`、`trace`、`observability`、`token-roi`、`permission-governance`、`ai-native-org`。

**2. 所属模块**：M4 收尾 + M5「Agent 怎么改变软件工程」（研发管理者）+ M6「企业怎么治理 AI」（AI 负责人，负责人路径）。

**3. 为什么先做这一批**
- 这是「应用 → 工程实践 → 企业治理」的收口批，需要前三批的概念铺垫（multi-agent 依赖 subagent/human-in-the-loop；M5/M6 依赖 Agent 与平台知识）。
- M5 已有 `issue-fix-agent` 锚点；M6 是负责人路径终点（评测/安全/成本/组织），内容口径最需谨慎，放最后能复用前三批沉淀的案例与门禁经验。
- 治理类讲最可能需要**新动画类型**（如 `observability-trace`、`token-roi-flow`），统一在末批评估，避免前期分散动画投入。

**4. 内容 Agent 输入**
`content/drafts/`（12 个新草稿）、规格三件套、已上线 `issue-fix-agent` 锚点、本轮升级后的 `agent-loop` 企业案例（升级人工条件写法）、M6 治理类需要更强的指标/约束/验证信号。

**5. 内容审核 Agent 门禁**
全门禁逐项，**最严**：M6 治理讲（eval/trace/token-roi/permission-governance）必须有可量化工程信号与真实约束，杜绝口号式内容；诊断题考治理判断（先评测还是先上线、先观测还是先扩容）；样板偏差检查重点防「百科味/口号味」。

**6. 主开发合入方式**
同前。若本批引入新动画类型，主开发负责在 registry 注册新组件（动画工程师提供实现），并确保 `validate:animation` 通过；新类型须先在 [animation-spec.md](animation-spec.md) §1 枚举内。12 讲 `stub→mvp`，合入后跑四命令。

**7. 动画复用或新增需求**
- 复用：`multi-agent`/M5 各讲可复用 `agent-loop`/`issue-fix-flow` 通用画布。
- 可选新增（**需 Owner 确认范围**）：`trace`/`observability`→`observability-trace`（新真实画布）、`token-roi`→`token-roi-flow`（新真实画布）。这两类是 M6 差异化价值点，但属新动画类型，投入较大，建议按演示需要决定是否本批做或延后。

**8. E2E 验收项**
- 四命令全绿；M4 上线 15→16、M5 上线 1→6、M6 上线 0→6 → **56 讲全部上线**。
- 全 56 讲主线「下一讲/继续学习」连续闭环，地图已无 stub（或仅余明确延后项）。
- 若新增 `observability-trace`/`token-roi-flow`：注册一致、`validate:animation` 通过、无 raw key、reduced-motion 可读。
- 全量回归：诊断题总分布、关联无悬空、所有 `hasAnimation` 与 `animation` 一致；建议本批引入一次真实浏览器（Playwright）全站回归，弥补此前纯命令行验证的方法学限制。

**9. 是否需要 Owner 再确认**：**是**。两点：(a) 是否在本批新增 `observability-trace`/`token-roi-flow` 等新动画类型及其投入；(b) M6 治理类内容口径（评测/安全/成本/组织）是否需要 Owner 提供企业真实参照，避免口号化。

---

## 1. 跨批通用规则

1. **每批独立闭环**：一批未通过门禁与四命令全绿前，不开下一批；不并行多批写 `src/data/*`，避免合入冲突（文件所有权见 [AGENTS.md](../AGENTS.md) §5.1）。
2. **诊断题按批配平**：分布门禁以**批**为单位（约 12 题）判定，逐批独立，不跨批沿用答案位置序列。
3. **样板基线只读参照**：12 讲样板作为口径参照，**不回头大改**已上线 12 讲；如需改样板讲走单独审核。
4. **stub→上线即并入主路径**：一讲升 `contentStatus` 后自动并入「下一讲/继续学习」，无需改导航代码（`isPublishedConcept` 已按 `contentStatus` 动态判定）。
5. **不改协议优先**：动画一律先尝试复用/通用画布，新真实画布只走「注册新组件」；需改 `AnimationConfig`/`AnimationPlayer`/schema 即触发停止点，升级主开发/Owner。
6. **看板回写**：每批完成由主开发更新 [project-board.md](project-board.md) 里程碑与任务状态。

## 2. 进度追踪表（随扩展更新）

| 批次 | 状态 | 上线讲数累计 | 四命令 | 审核结论 | 备注 |
|---|---|---|---|---|---|
| 封板 12 讲 | done | 12 / 56 | ✅ | PASS_WITH_MINOR_ISSUES | MVP 0.1 修复回合 1 |
| MVP 0.2 Wave 1 | done | 19 / 56 | ✅ | PASS | M1 前 7 讲，`09bfc13` / `mvp-0.2-wave1` |
| MVP 0.2 Wave 2 | done | 26 / 56 | ✅ | PASS | M1 收口 + M2 收尾 7 讲，`2fd0fb2` |
| MVP 0.2 Wave 3 | done | 32 / 56 | ✅ | PASS | M3 收尾 6 讲，`be4472e` |
| MVP 0.3 Wave 4A | done | 38 / 56 | PASS | PASS | M4 上下文工程与工具调用 6 讲 |
| MVP 0.3 Wave 4B | done | 44 / 56 | PASS | PASS | M4 剩余主体链路 6 讲，multi-agent 暂留收口 |
| Final Wave | done | 56 / 56 | PASS | PASS | multi-agent + M5×5 + M6×6 全量上线；诊断 A/B/C/D=3/3/3/3；见 `reports/final-wave-summary.md` |
