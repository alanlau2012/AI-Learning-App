# MVP 0.1 · 12 讲冻结样板标准 · frozen-sample-standard

> 本文件在 MVP 0.1 修复回合 1 封板后冻结。它定义「12 讲中哪些是可复制到后续 44 讲的样板、哪些只是 MVP 临时实现」，是 44 讲扩展时**内容 Agent / 审核 Agent / 主开发 / 动画工程师**的样板基线。
> 配套文件：门禁见 [content-production-gate.md](content-production-gate.md)，扩展批次见 [expansion-plan-44-lessons.md](expansion-plan-44-lessons.md)，权威 schema 见 [content-schema.md](content-schema.md)，流水线见 [project-board.md](project-board.md) §3。
> 冻结基线：`main` @ `b6971f0`（标签 `mvp-0.1-fix-round1`），已上线 12 讲 = `token / attention / prefill / decode / ttft / kv-cache / model-gateway / multi-model-routing / context-window / agent-loop / skill / issue-fix-agent`（`contentStatus ∈ {demo,mvp}`）。

---

## 0. 一句话原则

**可复制的是「结构、口径、质量门槛、流水线」，不可复制的是「固定条数、固定句式、临时 fallback 实现、当前答案位置」。**

把 12 讲当成「合格样例」而不是「填空模板」。后续 44 讲要长得像同一套教材，但不能像同一个模子里倒出来的。

---

## 1. 12 讲哪些内容可以作为后续 44 讲样板

以下为**可复制基线**，新讲应对齐：

1. **知识点四层闭环**：定义 → 机制 → 企业案例 → 诊断题，外加心智模型、为什么重要、常见误区、核心结论、关联知识点。每讲都要走完这条闭环，缺层即不合格。
2. **工程判断导向的诊断题**：用企业真实场景训练「第一步排查什么 / 哪个方案优先」，不考概念定义；含 `scenario / question / options / correctOptionIds / explanation / troubleshootingPath / relatedConceptIds`。
3. **可复盘的企业案例**：`scenario / problem / analysis / solution / takeaway` 五段，且带指标/规模/约束/错误路径/验证结果等工程信号（参照本轮升级后的 `model-gateway` / `multi-model-routing` / `skill` / `agent-loop`）。
4. **心智模型的「类比+工程判断」写法**：用类比、反例、边界、角色视角解释机制本质，落到工程判断，而非词典释义。
5. **动画作为详情页的一个章节**：由 `AnimationConfig.steps` 配置驱动，`highlightTargets` 映射为画布元素而非文本标签；复用现有 8 组件 / 7 类型，不为每讲写独立动画。
6. **页面与导航口径**：主路径只进入已上线讲（`isPublishedConcept`），stub 保留在地图但弱化置灰；详情页正文 760–860px 长阅读；首页不 dashboard 化。
7. **三段式内容流水线**：`content/drafts/ → content/reviewed/ → src/data/*`，主开发是唯一入库角色，入库前跑 `validate:content`。

---

## 2. 哪些只是 MVP 临时实现，不能复制

以下为**不可复制的临时实现 / 局部状态**，后续讲不得照搬：

1. **当前诊断题的具体答案位置**（A=3/B=2/C=3/D=3）：这是 12 题这一批为满足分布门禁回修后的结果，**不是模板**。每批新题要按门禁**独立**配平，不得机械沿用「第 1 题选 C、第 2 题选 D」之类的位置序列。
2. **历史通用画布已退役**：MVP 0.1 阶段 5 类动画曾走通用时间轴画布；现已全部接入专用组件或 `AnimationPlayer` 纯文本 fallback。**不是动画质量目标**。新讲复用已有 `AnimationType` 时须确认 registry 已注册专用画布。
3. **本轮「轻量抽样回修」的覆盖面**（11 讲心智模型 + 5 讲条数）：目的是「证明规则可执行」，不代表 12 讲已逐字段全量去模板化。新讲必须**从一开始**就按去模板化规则写，不能假设「样板已经全对、照抄即可」。
4. **44 个 stub 的占位文案与置灰态**：是 MVP 演示期「保留 56 讲地图」的临时表现，扩展时该讲一旦上线就要替换为正式内容，不能让占位态长期留存。
5. **`tool-calling` / `tpot` 等「画布元素已预留但讲未上线」的中间态**：是为复用预埋，不是已完成内容。

---

## 3. 每讲必须保留哪些结构

落库 `KnowledgePoint` 必须具备（与 [content-schema.md](content-schema.md) §1/§6.2 一致）：

| 字段 | 要求 |
|---|---|
| `id / slug / moduleId / order / difficulty / estimatedMinutes / tags` | 结构字段，按 §4 登记表，`slug === id`，`order` 模块内连续唯一 |
| `contentStatus` | 上线讲为 `demo` 或 `mvp`；未上线保持 `stub` |
| `definition` | 一句话定义，非空 |
| `whyItMatters` | 为什么重要，非空 |
| `mentalModel` | 心智模型，非空，且句式不固定 |
| `mechanism[]` | 机制讲解，4–7 条（入库底线 ≥3） |
| `pitfalls[]` | 常见误区，3–6 条（入库底线 ≥2） |
| `keyTakeaways[]` | 核心结论，3–5 条（入库底线 ≥2） |
| `enterpriseCase` | 五段非空 + ≥2 类工程信号 |
| `diagnosticQuestion?` | 含诊断题的讲必须满足诊断题门禁 |
| `animation?` + `hasAnimation` | 二者一致；有动画则 `steps ≥3`、`type` 已注册 |
| `relatedConceptIds[]` | 全部指向已存在 id，无悬空，优先强相关 |

**顺序固定**（详情页渲染顺序，来自 product-spec §4.3）：标题区 → 定义 → 为什么重要 → 心智模型 → 机制 → 动画 → 企业案例 → 误区 → 诊断题 → 核心结论 → 关联 → 操作区。

---

## 4. 哪些条数不能机械固定

**机制 / 误区 / 结论的条数必须按内容自然决定，落在区间内，禁止全模块统一：**

- `mechanism`：4–7 条。
- `pitfalls`：3–6 条。
- `keyTakeaways`：3–5 条。

红线：**不允许出现「整批讲都是 6 机制 / 5 误区 / 5 结论」这种机械整齐**（这正是本轮 P0-03 要修的模板化痕迹）。审核须检查同批次条数是否过度雷同。条数本身不是质量，覆盖关键判断才是——宁可一讲 5 条机制讲透，不要硬凑到 6 条注水。

---

## 5. 诊断题如何设计

样板要求（完整硬门禁见 [content-production-gate.md](content-production-gate.md) §1）：

1. **场景驱动**：`scenario` 是企业真实现象（含指标/数量级更好），`question` 问「最优先排查什么 / 哪个方案优先」，不问「X 是什么」。
2. **答案分布**：每批（约 12 题）单选正确项覆盖 A/B/C/D，任一选项占比 ≤40%。**逐批独立配平**，不沿用上一批的位置序列。
3. **强干扰项**：至少 30% 题目含「看似合理但优先级不对」的强干扰项（如「先扩容」「先加副本」「先补日志」这类治理化但非第一步的方案）。
4. **解析**：必须逐项/分组说明其他选项为什么不是第一步或不是最佳判断，不能只夸正确项。
5. **排查路径**：`troubleshootingPath` 按真实排查顺序写，不是知识点罗列。
6. **结构合法**：`correctOptionIds ⊆ options[].id`；单选长度 1、多选 ≥1；`options ≥2`。多选不得只用于凑分布。

参照样例：`q-kv-cache-1`（Session 亲和 vs 模型大小/温度）、`q-multi-model-routing-1`（任务分类/评测集 vs 5% 灰度兜底强干扰项）。

---

## 6. 企业案例如何设计

样板要求（完整门禁见 [content-production-gate.md](content-production-gate.md) §3）：

1. **五段结构**：`scenario`（场景）→ `problem`（问题现象）→ `analysis`（归因）→ `solution`（方案）→ `takeaway`（可迁移结论），全部非空。
2. **至少 2 类工程信号**，取自：指标、规模、系统边界、错误路径、约束条件、验证结果。禁止只写「某企业/某平台遇到问题后解决了」的泛例。
3. **可复盘性**：读者能从案例还原「出了什么问题 → 怎么定位 → 为什么这么改 → 怎么验证有效」。

参照样例（本轮升级）：`model-gateway`（20 应用 / 8 直连 / ~40% 缺 trace / 2 起敏感外发）、`multi-model-routing`（月 120 万次 / 成本两月涨 65% / 回放 1 万条）、`agent-loop`（12 分钟重启 3 次 / 错误率仍 ≥18% / 升级人工）。

---

## 7. 动画脚本如何设计

样板要求（完整门禁见 [content-production-gate.md](content-production-gate.md) §4）：

1. **配置驱动**：动画步骤只存在于 `AnimationConfig.steps`，不写死在组件；由 `AnimationPlayer` 统一驱动。
2. **复用优先**：优先复用现有 7 类型 / 8 组件（见 [animation-spec.md](animation-spec.md) §2）。同类型的讲共用画布（如 prefill/decode/ttft/tpot 共用 `prefill-decode`，agent-loop/tool-calling 共用 `agent-loop`），通过 `highlightTargets` 命中不同元素聚焦。
3. **画面意图先行**：每个动画草稿要说明「这一步画面发生什么变化、每个 highlightTargets key 对应哪个可视元素」，再交动画工程师实现。
4. **key 不上屏**：`highlightTargets` 必须映射为画布元素状态，**不得**作为文本标签渲染；画布可见文字只能是固定中文短标签（如「Prefill」「首 Token」「观察」）。
5. **reduced-motion 可读**：静止画面也能逐步看懂（当前步高亮、命中 vs 未命中差异编码在样式而非位移）。
6. **不改协议**：新动画只走「注册新组件」，不改 `AnimationConfig` / `AnimationPlayer` / `src/types/*`。需要改协议即触发停止点，交主开发/Owner。

真实画布参照：`PrefillDecodeAnimation`（首字前/后时间轴 + TTFT/TPOT 标尺）、`AgentLoopAnimation`（环形循环 + trace 轨道 + 继续/完成/人审三出口）。

---

## 8. 页面和导航对内容生产有什么约束

内容生产必须满足页面侧的硬约束，否则会破坏已修好的体验：

1. **主路径禁跳 stub**：未上线讲不得被「下一讲 / 继续学习 / 推荐入口 / 搜索主路径」自然进入。新讲一旦上线（`contentStatus` 升为 `demo/mvp`）即自动并入主路径；仍是 `stub` 时只在地图占位。
2. **保留 56 讲地图**：模块页/搜索页要保留全部 56 讲可见，stub 弱化/置灰/标「即将上线」，不可点击进入空内容页。
3. **不泄漏内部状态**：正文与界面不得出现 `mvp` / `stub` / `contentStatus` / `config.type` / raw `highlightTargets` 等内部标识。
4. **长阅读节奏**：详情页正文 760–860px，不拆成过多卡片；首页第一屏不堆模块/推荐/诊断题/统计。
5. **关联不悬空**：`relatedConceptIds` 只能指向已存在 id（可指向 stub 讲做地图连接，但不破坏主路径）。
6. **id/order 不可改**：已发布 id 是 URL 与持久化依赖，扩展新讲只能在 §4 登记表既定 id/order 上填内容，不得重排已上线讲。

---

## 9. stub 与正式内容如何区分

唯一区分依据是 `contentStatus`（不靠脚本隐式名单）：

| 状态 | 含义 | 校验 | 主路径 | 地图可见 |
|---|---|---|---|---|
| `stub` | 仅结构登记，正文可空 | 只跑 `validate:structure` | 不进入 | 可见，弱化/置灰/「即将上线」 |
| `demo` | MVP Demo 精做讲 | + `validate:published-content`（+ 有动画则 `validate:animation`） | 进入 | 可见，正常卡片 |
| `mvp` | MVP 1.0 完整讲 | 同 `demo` | 进入 | 可见，正常卡片 |

升级动作：一讲从 `stub → demo/mvp` 由**主开发**在合入 reviewed 内容时改 `contentStatus`，并补齐全部完整性字段；改完必须跑 `validate:content` 全绿。**禁止**让一讲停在「`contentStatus=mvp` 但正文半空」的中间态。

---

## 10. 后续 44 讲进入 src/data 前必须满足什么门禁

进入 `src/data/*` 的硬前置（任一不满足即退回，不得入库）：

1. 已走完 `content/drafts/ → content/reviewed/`，审核 Agent 在 reviewed 结论中**逐项**给出 [content-production-gate.md](content-production-gate.md) 的判定（诊断题分布/强干扰项/解析/结构去模板化/案例信号/样板偏差/schema）。
2. 审核结论为 PASS（FAIL 或「仅有规则无可合入正文」一律退回，参照本轮首轮 FAIL 处置）。
3. 由**主开发**按 [content-schema.md](content-schema.md) §3 映射表转换入库，内容 Agent / 审核 Agent / 动画 Agent 均**不得**直接改 `src/data/*`。
4. 入库后 `npm run validate:content` + `npm run typecheck` + `npm run lint` + `npm run build` 四条全绿。
5. 不引入 schema 外字段（`oneSentence / commonPitfalls / animationBrief / relatedConcepts` 等写作别名只在 draft 用，落库按映射转换）。
6. 不改 `docs/content-schema.md` / `src/types/index.ts` / `AnimationConfig` 协议；若必须改即触发停止点，升级主开发/Owner。
7. 该批诊断题答案分布**整批**复算达标（不是单题），并独立于上一批配平。

> 一句话验收：**审核 PASS + 主开发入库 + 四命令全绿 + 分布整批达标 + 零 schema 外字段 = 可入库**。任一缺失即退回。
