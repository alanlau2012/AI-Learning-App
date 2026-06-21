# 动画系统专家审计 · animation-expert-audit

> 角色：AI 应用工程 / AI Infra / Agent 架构 / 交互式教材设计 专家级动画重构 Agent
> 基线：`main` @ `900ffb5`（MVP 0.1 修复回合 1 封板）。
> 审计对象：`src/components/animation/*` 全部画布组件 + `src/data/demoConcepts.ts` 中 12 讲的 `animation` 配置。
> 审计原则：动画是「工程机制显微镜」，不是 UI 动效。质量看的是**机制因果、状态变化、工程指标/瓶颈、失败路径**，不是好不好看。

---

## 0. 总体结论（先看这里）

当前共有 **4 个画布组件** 服务 **8 个已注册动画类型 / 11 讲含动画**，外加 1 讲（`skill`）完全无动画。

- **2 个真实专家级画布**（`PrefillDecodeAnimation`、`AgentLoopAnimation`）质量为 **A**，可直接作为后续样板。
- **1 个真实但有缺陷的画布**（`KVCacheAnimation`）：结构是真画布，但**与数据 key 对不上**，命中/未命中/缓存高亮基本不触发，机制表达残缺，判 **C+**。
- **1 个通用占位画布**（`GenericMechanismAnimation`）服务 **5 个类型 / 6 讲**（token-flow / attention-map / model-router×2 / context-window / issue-fix-flow），只渲染「一排圆点 + 步骤计数」，**无视全部 `highlightTargets`、零机制表达**，判 **Empty/C**。
- **1 讲核心概念（`skill`）无任何动画**（`hasAnimation:false`，`skill-lifecycle` 类型未实现、未注册），判 **Empty**。

一句话判断：**当前动画系统「两根样板柱子立住了，中间是空的」**。prefill-decode 与 agent-loop 证明了团队能做到专家级；但 12 讲里有 **7 讲**（token / attention / model-gateway / multi-model-routing / context-window / issue-fix-agent / skill）的动画处于「空或近空」状态，**严重拖累「交互式教材」定位**。

### 质量分布

| 等级 | 数量（按动画类型计） | 类型 |
|---|---|---|
| A（专家级样板） | 2 | prefill-decode、agent-loop |
| B | 0 | — |
| C（占位/通用/残缺） | 6 | token-flow、attention-map、model-router、context-window、issue-fix-flow、kv-cache(C+) |
| D（误导/不专业） | 0 | — |
| Empty（空/缺失） | 1 | skill-lifecycle（`skill` 讲无动画） |

> 按「讲」计：A 级覆盖 4 讲（prefill/decode/ttft/agent-loop），C 覆盖 7 讲，Empty 1 讲。

### raw key 泄漏检查（全量）

逐组件核对画布可见文字：

- `GenericMechanismAnimation`：只渲染圆点 + 「步骤 N / M」，**无 key 泄漏**（但也无机制）。
- `KVCacheAnimation` / `PrefillDecodeAnimation` / `AgentLoopAnimation`：可见文字均为固定中文短标签（「Prefill」「首 Token」「观察」「人审」等），**无 raw key 泄漏**。
- 全系统**未发现** `config.type` / `highlightTargets` / `input-text` / `agent-loop` 等内部 key 上屏。

> 结论：**当前不存在 raw key 泄漏**。本轮重构必须**保持**这一红线——新画布同样只允许渲染固定中文短标签。

---

## 1. 逐动画审计

### 动画 1 / `token-flow`

- 当前使用章节：`token`（M1·1）
- 当前实现文件：`src/components/animation/GenericMechanismAnimation.tsx`（注册映射 `registry.ts`）
- 当前质量等级：**C（近 Empty）**
- 是否为空动画：是（只有圆点 + 步骤计数）
- 是否只是通用 fallback：是（5 类型共用同一通用画布）
- 是否解释了真实机制：**否**。数据里已写好 `input-text → tokenizer/tokens → token-ids/embeddings → prefill/ttft → decode/output-tokens/cost` 的完整因果链与 5 步 highlightTargets，但画布**完全无视**，用户只看到圆点滑动。
- 是否存在 raw key 泄漏：否
- 是否适合继续复用：否
- 主要问题：文本→Token→编号→向量→Prefill/Decode→成本时延 的核心机制**一点都没画出来**；这是 M1 第 1 讲、全 APP 入门第一动画，空占位严重破坏第一印象。
- 建议处理方式：**新建专用画布 `TokenFlowAnimation`**
- 优先级：**P0**

### 动画 2 / `attention-map`

- 当前使用章节：`attention`（M1·4）
- 当前实现文件：`GenericMechanismAnimation.tsx`
- 当前质量等级：**C（近 Empty）**
- 是否为空动画：是
- 是否只是通用 fallback：是
- 是否解释了真实机制：**否**。数据已设计 `tokens/context → current-token → attention-links/attention-map → pollution/shifted-weights → rerank/clean-context`（含上下文污染与治理对比），画布全部丢弃。
- 是否存在 raw key 泄漏：否
- 是否适合继续复用：否
- 主要问题：Q/K/V、因果 mask、当前位置看历史、权重是「加权选择」而非「理解」、上下文污染如何扭曲权重——这些都没表达。注意力是 M1 最难概念之一，空占位等于没讲。
- 建议处理方式：**新建专用画布 `AttentionAnimation`**
- 优先级：**P0**

### 动画 3 / `prefill-decode`

- 当前使用章节：`prefill`（M2·1）、`decode`（M2·2）、`ttft`（M2·3）（`tpot` 已预留 key 但未上线）
- 当前实现文件：`src/components/animation/PrefillDecodeAnimation.tsx`
- 当前质量等级：**A（专家级样板）**
- 是否为空动画：否
- 是否只是通用 fallback：否
- 是否解释了真实机制：**是**。首字前/首字后两段时间轴、输入区（系统提示/检索/历史）、前置处理带（网关/排队/路由/检索/工具）、Prefill、KV 写入、首 Token 分隔、Decode 自回归循环、TTFT/TPOT 双标尺、长输入→TTFT 增长（带 ghost 对比）、延迟归因分段条。因果与指标都到位。
- 是否存在 raw key 泄漏：否（固定中文标签）
- 是否适合继续复用：**是，作为时间轴 + 指标标尺类机制的样板**
- 主要问题：仅 P2 级——移动端 540px 最小宽度需横向滚动；`tpot` 讲尚未上线，画布元素已预留属正常中间态。
- 建议处理方式：**保留**（可选 P2 微调移动端）
- 优先级：**P2**

### 动画 4 / `kv-cache`

- 当前使用章节：`kv-cache`（M2·5）
- 当前实现文件：`src/components/animation/KVCacheAnimation.tsx`
- 当前质量等级：**C+（真画布但残缺 + 有 key 对接 bug）**
- 是否为空动画：否
- 是否只是通用 fallback：否
- 是否解释了真实机制：**部分，且高亮基本失效**。
- 是否存在 raw key 泄漏：否
- 是否适合继续复用：**需重构后才可**
- 主要问题（关键）：
  1. **key 与数据对不上**——画布检测 `cache` / `hit` / `miss`，但数据实际 key 是 `kv-write` / `cache-hit` / `cache-miss` / `route-miss` / `instance` / `memory` / `eviction`。结果：缓存节点高亮、未命中分支高亮**永远不触发**，命中只靠 `decode` 间接点亮。等于「画了开关但没接线」。
  2. **缺机制深度**：没有「命中 vs 未命中」两条可对比路径（数据本意如此），没有 KV slots 从空到写满的状态变化，没有 TTFT 低/高的对比标尺，第 5 步「显存容量约束/淘汰」无任何可视元素。
  3. 仅 3 节点 + 2 行静态文字，更像一张配图而非机制演示。
- 建议处理方式：**重构 `KVCacheAnimation`**：对齐数据 key；做「Prefill 写入 → 命中（复用，TTFT 低）/ 未命中（重算，TTFT 高）」双路径 + 显存挤占。
- 优先级：**P1**（已上线核心讲，且现状有「接线 bug」，应尽快修）

### 动画 5 / `model-router`

- 当前使用章节：`model-gateway`（M3·2）、`multi-model-routing`（M3·3）
- 当前实现文件：`GenericMechanismAnimation.tsx`
- 当前质量等级：**C（近 Empty）**
- 是否为空动画：是
- 是否只是通用 fallback：是（同一通用画布服务两讲，且两讲机制不同）
- 是否解释了真实机制：**否**。两讲数据 key 完全不同：
  - `model-gateway`：`apps/gateway → auth/quota/policy → router/models → metering/trace → fallback/circuit-break`（治理入口闭环）；
  - `multi-model-routing`：`request-labels → model-profiles → router/selected-model → fallback/sla → eval/observability/policy`（按能力/成本/时延选择 + 升降级 + 回流）。
  圆点画布把两套完全不同的工程机制压成同一排圆点，**信息全损**。
- 是否存在 raw key 泄漏：否
- 是否适合继续复用：否
- 主要问题：网关「治理入口 vs 薄转发」、路由「整体 ROI vs 永远选最强」这两个最关键的工程判断完全没表达；两讲同享一类型却需要分别聚焦不同区域。
- 建议处理方式：**新建专用画布 `ModelRoutingAnimation`**，按 `PrefillDecodeAnimation` 的「区域相关性 dormant」模式，同一画布对网关讲与路由讲分别点亮对应区域。
- 优先级：**P0**

### 动画 6 / `context-window`

- 当前使用章节：`context-window`（M4·3）
- 当前实现文件：`GenericMechanismAnimation.tsx`
- 当前质量等级：**C（近 Empty）**
- 是否为空动画：是
- 是否只是通用 fallback：是
- 是否解释了真实机制：**否**。数据已设计 `candidate-context → window-limit → selection/ranking → compression/summary → cost/ttft/quality`，画布丢弃。
- 是否存在 raw key 泄漏：否
- 是否适合继续复用：否
- 主要问题：「有限工作台」「窗口被挤满 vs 压缩/筛选后」「关键约束被挤出」这一核心对比没有任何可视化，而这正是 Agent 失败的高频根因。
- 建议处理方式：**新建专用画布 `ContextWindowAnimation`**（窗口容量条 + 候选池 + 挤满/筛选两态对比）
- 优先级：**P0**

### 动画 7 / `agent-loop`

- 当前使用章节：`agent-loop`（M4·10）（`tool-calling` 共用，未上线）
- 当前实现文件：`src/components/animation/AgentLoopAnimation.tsx`
- 当前质量等级：**A（专家级样板）**
- 是否为空动画：否
- 是否只是通用 fallback：否
- 是否解释了真实机制：**是**。环形 Observe→Plan→Act→Check + 判断节点三出口（继续/完成/人审）、工具区带 🔒 权限边界、Act→工具→结果回流、证据/计划/校验卡片、底部 trace 轨道按轮累加、连续失败时「继续」弧线弱化强制人审。Check 拦截、无 Check 危险性都表达了。
- 是否存在 raw key 泄漏：否
- 是否适合继续复用：**是，作为「环路 + 出口 + trace」类机制样板**
- 主要问题：仅 P2——`human-review` 出口语义已编码良好；SVG 在窄屏可读性可再优化。
- 建议处理方式：**保留**
- 优先级：**P2**

### 动画 8 / `issue-fix-flow`

- 当前使用章节：`issue-fix-agent`（M5·2）
- 当前实现文件：`GenericMechanismAnimation.tsx`
- 当前质量等级：**C（近 Empty）**
- 是否为空动画：是
- 是否只是通用 fallback：是
- 是否解释了真实机制：**否**。数据已设计 6 步 `issue/requirements → repo-context/search → patch/scope → tests/validation → pr/human-review → feedback/eval/skill`，含「失败回到定位而非盲目扩散」「人审 + 质量回流」，画布丢弃。
- 是否存在 raw key 泄漏：否
- 是否适合继续复用：否
- 主要问题：「问题单质量 → 修复路径 → 验证闭环」这条 M5 核心因果链没画；尤其「验证失败回流」「最小化修改边界」是工程判断要点。
- 建议处理方式：**新建专用画布 `IssueFixFlowAnimation`**（带验证失败回流箭头 + 人审/质量回流闭环）
- 优先级：**P0**

### 动画 9 / `skill-lifecycle`（缺失）

- 当前使用章节：`skill`（M4·12）—— `hasAnimation:false`，**无 `animation` 配置**
- 当前实现文件：**无**（`skill-lifecycle` 类型在 `AnimationType` 枚举中已定义，但未注册、无组件、无数据）
- 当前质量等级：**Empty**
- 是否为空动画：是（彻底缺失）
- 是否只是通用 fallback：否（连 fallback 都没有，详情页显示「暂无动画配置」）
- 是否解释了真实机制：否
- 是否存在 raw key 泄漏：否
- 是否适合继续复用：N/A
- 主要问题：`skill` 是 12 讲核心概念之一，且任务明确把 `skill-lifecycle` 列为必须覆盖的重点动画；「发现 → 加载 → 执行 → 反馈 → 沉淀」生命周期完全没有可视化。
- 建议处理方式：**新建专用画布 `SkillLifecycleAnimation`** + 注册类型 + 为 `skill` 讲补 `animation` 配置（需谨慎修改 `src/data`，理由：该讲完全无机制可视化，属「highlightTargets 无法支撑机制表达」的极端情形——根本没有 highlightTargets）。
- 优先级：**P0**

### 附 / `GenericMechanismAnimation`（通用画布组件本身）

- 当前角色：5 个类型的注册实现 + 概念上的「通用机制时间轴」
- 当前质量等级：**C（作为机制画布）/ 可接受（仅作为未注册类型的降级时间轴）**
- 主要问题：被当成「真画布」注册给 5 个本应专用的类型，导致 6 讲机制表达归零。
- 建议处理方式：**从 5 个专用类型的注册中移除**；保留文件作为「未注册类型」的降级参考（AnimationPlayer 本身已有纯文本 fallback，二者择一即可）。重构后它将不再被任何已上线讲引用。
- 优先级：随 P0 类型重构一并退役。

### 附 / `AnimationPlayer` 降级占位（未注册类型）

- 当前实现：`config.type` 未命中 registry 时渲染「标题 + 当前步 title/description + 步骤计数」纯文本视图，DEV 下 `console.warn`。
- 质量等级：**可接受**（符合 animation-spec §3.2「不崩、可读、生产不白屏」）。
- 建议处理方式：**保留**。不在本轮改动 Player（改 Player 属停止点）。
- 优先级：P2（无需动）

---

## 2. 优先级汇总与处理矩阵

| 类型 | 讲 | 当前 | 等级 | 处理 | 优先级 | 是否需改数据 |
|---|---|---|---|---|---|---|
| token-flow | token | 通用圆点 | C | 新建 `TokenFlowAnimation` | P0 | 否（复用现有 key） |
| attention-map | attention | 通用圆点 | C | 新建 `AttentionAnimation` | P0 | 否 |
| model-router | model-gateway, multi-model-routing | 通用圆点 | C | 新建 `ModelRoutingAnimation` | P0 | 否 |
| context-window | context-window | 通用圆点 | C | 新建 `ContextWindowAnimation` | P0 | 否 |
| issue-fix-flow | issue-fix-agent | 通用圆点 | C | 新建 `IssueFixFlowAnimation` | P0 | 否 |
| skill-lifecycle | skill | 缺失 | Empty | 新建 `SkillLifecycleAnimation` + 注册 + 补数据 | P0 | **是**（skill 讲补 animation） |
| kv-cache | kv-cache | 真画布但断线 | C+ | 重构 `KVCacheAnimation`（对齐 key + 双路径） | P1 | 否 |
| prefill-decode | prefill, decode, ttft | 真画布 | A | 保留（可选移动端 P2） | P2 | 否 |
| agent-loop | agent-loop | 真画布 | A | 保留 | P2 | 否 |

### 改动边界自检（对照停止点）

- 不改 `AnimationConfig` 协议 / `docs/content-schema.md` / `src/types/index.ts`（`skill-lifecycle` 类型已存在于枚举，仅需注册组件）。✅
- 不改 `AnimationPlayer` 架构 / `ConceptPage` 页面结构 / 课程正文。✅
- 不引入第三方动画库 / 远程资源 / 视频 / 3D（全部 SVG/CSS/React）。✅
- 不动 44 讲数据结构；仅对 1 讲（skill）补动画配置（已在报告说明原因，符合「谨慎修改 src/data」前置）。✅
- `scripts/validate-content.ts` 的 `REGISTERED_ANIMATION_TYPES` 集合需随 registry 同步加入 `skill-lifecycle`（这是校验集与 registry 的镜像同步，非 schema 变更）。✅

> 无停止点触发。可进入阶段 2（设计方案）与阶段 3（实现）。
