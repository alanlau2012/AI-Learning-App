# MVP 0.1 动画画面意图（回合 1）

> 角色：动画意图 Agent  
> 范围：只为 `prefill-decode` 与 `agent-loop` 两个高复用动画产出“工程师可实现的画面意图”。不写前端代码、不改 `AnimationConfig` 协议、不改 `src/*`、不改课程正文。  
> 用途：作为阶段 3 动画工程师实现 `PrefillDecodeAnimation` 与 `AgentLoopAnimation` 两个专用画布的唯一画面依据。  
> key 来源：`src/data/demoConcepts.ts` 实际 `animation.steps[].highlightTargets`（以下逐 key 对照均按当前数据，不臆造）。

---

## 0. 给动画工程师的通读约定（两动画通用）

1. **一个 type 对应一个画布，但要服务多个概念。** `prefill-decode` 被 `prefill / decode / ttft` 三讲复用，三讲的 `steps` 顺序和 key 集合都不同；`agent-loop` 本轮只有 `agent-loop` 一讲提供已发布步骤（`tool-calling` 仍是 stub）。画布必须用“超集元素布局 + key→元素映射”实现：**只高亮/改变当前步 `highlightTargets` 命中的元素，未命中的元素保持基态**，与现有 `KVCacheAnimation` 的 `active()` 写法一致。
2. **画布可读取 `config`（含 `title` 与完整 `steps`）来判断侧重。** 协议允许 canvas 拿到整段 `config`。当某讲的 `steps` 里根本没出现某组 key（例如 `decode` 讲不含 `gateway/queue`），就让这些元素保持收起/淡出的基态，不要硬塞。可用 `config.title` 或“步骤 key 的并集”推断当前是 Prefill 侧重 / Decode 侧重 / TTFT 侧重，从而决定时间轴重心，但**不要因此把布局拆成三套互斥组件**。
3. **key 永远不作为文本标签出现在画布上。** `highlightTargets` 是元素 id，不是给用户看的文案。画布上的可见中文文字只能是“画面元素自带的固定短标签”（如“输入区”“首 Token”“TTFT”），不得出现 `input-tokens`、`human-review`、`tool-result` 这类 raw key，也不得出现 `config.type`。
4. **分工去重：播放器已显示 `step.title` + `step.description`。** 画布不要再把当前步标题/描述重复渲染成大段文字；画布只负责“画面状态变化”，正文/机制解释由页面正文与播放器 caption 承担。
5. **视觉红线（design.md）：** 深色机制画布面积克制（最小高度约 236px，最大宽约 600–640px 居中），主强调蓝 `#1F40D8`，命中/正向绿 `#2E7D58`，未命中/告警用克制暖橙（不饱和、不闪烁），背景延续浅色页面。**不做监控面板、不堆指标数字、不做右侧大说明栏、不做仪表盘。**
6. **reduced-motion：** `reducedMotion=true` 时禁用自动过渡与循环动效，只按当前步渲染静态状态；结构（时间轴/环形）、当前步定位、命中/未命中差异、退出分支必须在静止画面里一眼可辨。

---

## 1. `prefill-decode` 画面意图

### 1.1 画布总体结构（一条横向时间轴）

从左到右一条时间轴，划分为“**首字前**”和“**首字后**”两段，中间用一个醒目的“**首 Token 标记**”分隔。画布固定包含以下可视元素（区域），按当前步是否命中决定亮起、拉伸、变暗或显示：

```
[输入区] → [前置处理带·网关/排队/RAG/工具] → [Prefill 区] → [KV Cache 区] ┃首Token┃ → [Decode 循环区] → [输出序列]
└──────────────────  TTFT 标尺（首字前总长）  ──────────────────┘        └─ TPOT 标尺（相邻输出间距）─┘
                                                                  [归因分段条]（按需出现）
```

- **TTFT 标尺**：从时间轴起点量到“首 Token 标记”的横向长度。它是**长度**，不是数字读数。
- **TPOT 标尺**：首字后相邻两个输出 Token 之间的**间距**。间距越宽 = 输出越卡。
- **首字前 / 首字后**两段必须在视觉上可区分（例如首字前用蓝灰冷色块、首字后用偏暖输出块），让“TTFT 影响首字前、TPOT/长输出影响首字后”一眼成立。
- **KV Cache 区**有“写入 / 已就绪可复用 / 未命中需重算”三种态，用来表达缓存是否被复用。

### 1.2 highlightTargets → 可视元素映射表（prefill-decode 全量 key）

> 下表覆盖 `prefill / decode / ttft` 三讲出现过的全部 key。同一画布按命中项做对应视觉处理。

| highlightTarget（raw key） | 对应画布元素 | 命中时的视觉处理 |
|---|---|---|
| `prompt` | 输入区·系统提示词块 | 该输入块亮起（蓝），归入输入序列 |
| `rag-chunks` | 输入区·检索片段块 | 亮起；可叠多片表示“多片段” |
| `history` | 输入区·历史会话块 | 亮起；可偏灰表示“易膨胀” |
| `input-tokens` | 输入序列汇成的「Token 条」 | Token 条整体高亮并按长度伸缩，流入 Prefill 区 |
| `prefill` | Prefill 区块 | Prefill 区点亮、占据首字前主要宽度 |
| `kv-write` | KV Cache 区·写入动作 | K/V 小格从 Prefill 流入缓存区（写入态） |
| `cache` | KV Cache 区·缓存格 | 缓存格点亮为“已就绪/可复用”（绿） |
| `first-token` | 首 Token 标记 | 标记点亮，TTFT 标尺在此停住 |
| `ttft` | TTFT 标尺 | 标尺整段高亮（首字前总长） |
| `long-context` | 输入区 / Token 条 | Token 条明显拉长（对比短上下文基态） |
| `ttft-growth` | TTFT 标尺 | 标尺随输入变长而**变长**，强调首字前被拖慢 |
| `prefill-done` | Prefill 区 | Prefill 区切到“完成态”（变暗/打勾），重心右移 |
| `first-output-token` | Decode 循环区·首个输出 Token | 首字后第一个输出 Token 冒出 |
| `append-token` | 输出序列末尾 | 新 Token 追加到序列末尾 |
| `decode-loop` | Decode 循环区·小循环箭头 | 循环箭头活跃，表示逐 Token 自回归 |
| `tpot` | TPOT 标尺 | 相邻输出 Token 间距标尺高亮 |
| `token-interval` | 相邻输出 Token 间距 | 间距**变宽**表示输出卡顿 |
| `long-output` | 输出序列 | 输出序列明显变长（更多 Token） |
| `total-latency` | 时间轴整体右端 | 整条时间轴右端延长，但**首 Token 标记位置不动** |
| `gateway` | 前置处理带·网关节点 | 网关入口节点亮起 |
| `queue` | 前置处理带·排队条 | 排队条出现/变长 |
| `route` | 前置处理带·路由分叉 | 网关到模型池的路径高亮 |
| `rag` | 前置处理带·RAG 检索块 | 检索耗时块亮起，可变长 |
| `tool-call` | 前置处理带·工具调用块 | 工具耗时块亮起，可变长 |
| `stream` | 首 Token → 客户端的回传通道 | 回传箭头点亮（首 Token 流回客户端） |
| `latency-breakdown` | 归因分段条 | 时间轴下方出现分段条，网关/RAG/Prefill/网络分段用不同色或纹理区分 |

> 注：`cache` 在 prefill 讲是“写入后就绪”，在 decode 讲是“Decode 阶段仍可复用”。同一缓存元素用“就绪/复用=绿”的同一视觉表达即可，无需两套样式。

### 1.3 逐步画面意图

下面按三讲各自的 `steps`（key 以 demoConcepts 实际为准）给出。每步含：① 画面变化 ② 用户应理解的机制 ③ 静态 fallback ④ 不要出现的表达。

#### A. `prefill` 讲（type=prefill-decode，title=“Prefill 如何影响首字时延”）

| step | ① 画面变化 | ② 该步教的判断 | ③ reduced-motion 静态 |
|---|---|---|---|
| s1 组装完整上下文（`prompt`,`rag-chunks`,`history`） | 输入区三类块同时亮起并汇入一条输入序列；`history` 可偏灰示意易膨胀 | 首字前的“输入”由多来源拼成，不是只有用户问题 | 三个输入块静态并列、箭头指向同一序列 |
| s2 进入 Prefill（`input-tokens`,`prefill`） | 输入序列收成 Token 条流入 Prefill 区，Prefill 区点亮并占据首字前主要宽度 | 输入越长 → Prefill 处理量越大 → 首字前越久 | Token 条静态显示在 Prefill 区内，区块高亮 |
| s3 写入 KV Cache（`kv-write`,`cache`） | K/V 小格从 Prefill 流入缓存区，缓存格点亮为“已就绪” | Prefill 不只读输入，还产出可复用缓存 | 缓存格静态显示为已写入（绿），有写入指向箭头 |
| s4 首个 Token 准备输出（`first-token`,`ttft`） | 首 Token 标记点亮，TTFT 标尺在此停住并整段高亮 | TTFT 在首 Token 出现时结束 | 标记静态点亮，TTFT 标尺以高亮长度静态呈现 |
| s5 长上下文拖慢首字（`long-context`,`ttft-growth`） | Token 条明显拉长，TTFT 标尺随之变长（与前一态对比） | 输入膨胀优先拉长首字前，而非只拖总时长 | 同屏并置“短上下文/长上下文”两条 TTFT 标尺做长短对比 |

#### B. `decode` 讲（type=prefill-decode，title=“Decode 的逐 Token 生成过程”）

| step | ① 画面变化 | ② 该步教的判断 | ③ reduced-motion 静态 |
|---|---|---|---|
| s1 Prefill 完成（`prefill-done`,`cache`） | Prefill 区切到完成态（变暗/打勾），缓存区保持点亮，重心右移到首字后 | Decode 起步时已有就绪上下文与缓存 | Prefill 区静态显示完成态，缓存绿色保持 |
| s2 生成第一个输出 Token（`first-output-token`） | 首字后区域冒出第一个输出 Token | 用户开始看到响应，但答案未完成 | 输出序列静态显示第 1 个 Token |
| s3 追加并继续预测（`append-token`,`decode-loop`） | 新 Token 接到序列末尾，循环箭头活跃 | 自回归：每个新 Token 依赖已生成内容 | 输出序列静态显示多个 Token + 一个循环箭头图标 |
| s4 TPOT 体现流出速度（`tpot`,`token-interval`） | TPOT 标尺高亮，相邻 Token 间距变宽示意卡顿 | TPOT 决定“输出顺不顺”，与首字快慢不同 | 两段不同间距的输出序列静态对比（密=流畅 / 疏=卡顿） |
| s5 长输出累积总耗时（`long-output`,`total-latency`） | 输出序列变长、时间轴右端延长，但**首 Token 标记位置不动** | 长输出主要抬高总耗时，不改变首字 | 静态并置“短输出/长输出”，首 Token 标记对齐同一位置 |

#### C. `ttft` 讲（type=prefill-decode，title=“TTFT 的端到端时间拆解”）

| step | ① 画面变化 | ② 该步教的判断 | ③ reduced-motion 静态 |
|---|---|---|---|
| s1 请求进入网关（`gateway`,`queue`,`route`） | 前置处理带的网关节点亮起，排队条出现，路由分叉高亮 | 首字前不止 Prefill，控制面排队/路由也占时间 | 网关/排队/路由三元素静态点亮在时间轴最左 |
| s2 RAG 与工具前置处理（`rag`,`tool-call`） | RAG 块与工具块亮起，可按耗时变长 | 模型前的检索/工具任一变慢都会推迟首字 | 两个耗时块静态显示在 Prefill 之前 |
| s3 Prefill 处理输入（`prefill`,`input-tokens`） | Token 条进入 Prefill 区，区块按输入长度占宽 | Prefill 是首字前的一段，不是全部 | Token 条静态置于 Prefill 区，区块高亮 |
| s4 首个 Token 返回（`first-token`,`stream`） | 首 Token 标记点亮，回传通道箭头点亮把首 Token 送回客户端，TTFT 停表 | TTFT 在“客户端收到首 Token”那刻结束 | 首 Token 标记 + 回传箭头静态点亮 |
| s5 拆分瓶颈归因（`latency-breakdown`） | 时间轴下方出现分段条：网关/RAG/Prefill/网络分段用不同色或纹理 | 排查 TTFT 要分段归因，不能只看端到端总值 | 分段条静态显示各段占比（用长度/纹理，不写具体数字） |

### 1.4 prefill-decode 不要出现的表达

- 不出现 `input-tokens`、`first-output-token`、`latency-breakdown`、`config.type` 等 raw key 文本。
- 不把 TTFT/TPOT 做成带数字读数的仪表盘或折线监控图；只用**长度/间距**表达差异。
- 不堆“队列长度=…ms / GPU 利用率=…%”这类指标面板。
- 不在画布里重复播放器已显示的步骤标题/描述长句。
- `decode` 讲不要硬画网关/排队（该讲 steps 无此 key），保持收起基态；同理 `ttft` 讲不要硬画 Decode 循环。

---

## 2. `agent-loop` 画面意图

### 2.1 画布总体结构（环形循环 + trace 轨道 + 三出口）

主体是一个**环形循环**：顶部一条“任务输入栏”，环上四个节点按 Observe → Plan → Act → Check 顺时针排列，环的收口是一个“判断/出口”节点，分出三条路径。环下保留一条 **trace 轨道**记录每轮 观察/动作/结果/继续条件。

```
            ┌── 任务输入栏：目标 / 约束 / 可用工具 ──┐
            │                                        │
        (Observe) → (Plan) → (Act) → (Check) → [判断/出口]
            ↑                  │tool                 ├─→ 继续（回 Observe）
            └──── 继续箭头 ─────┘ └─[工具区]→结果回流  ├─→ 停止·完成
                                                       └─→ 转人工审批（人审分支）
  trace 轨道： ▢观察  ▢动作  ▢结果  ▢继续条件   …（每轮追加一格）
```

- **工具区**在环外侧，`Act` 向它发调用、它把 `tool-result` 回流写入 trace（“工具调用结果回流”要素）。
- **判断/出口**三条路径必须同屏可见：继续=回 Observe 的环形箭头、停止=完成态、转人工=人审分支节点。
- **连续失败语义**：当处于“继续/停止/转人工”这步时，继续箭头**变弱/虚化**，人审分支被强调，表达“失败堆积时不应无界继续，而应转人审”。
- **Plan 节点不展示长推理文本**，只表达“产出一个可验证的下一步动作”。

### 2.2 highlightTargets → 可视元素映射表（agent-loop）

> 按 `agent-loop` 讲实际 `steps` 的 key。`tool-calling` 讲本轮为 stub、无已发布步骤；画布只需保证这些元素存在、未命中即基态，未来 `tool-calling` 复用同画布时无需改协议。

| highlightTarget（raw key） | 对应画布元素 | 命中时的视觉处理 |
|---|---|---|
| `goal` | 任务输入栏·目标 | 目标项点亮（蓝） |
| `constraints` | 任务输入栏·约束边界 | 约束栏点亮，作为环的边界条件存在 |
| `tools` | 工具区·可用工具列表 | 工具列表亮起，带“权限边界”视觉（如锁/边框） |
| `observe` | 环上 Observe 节点 | 节点点亮为当前活跃节点 |
| `context` | Observe 拉取的证据卡片 | 从上下文/日志/文件区抽出证据卡片进入当前状态 |
| `plan` | 环上 Plan 节点 | 节点点亮；旁边出现“下一步动作 + 验证标准”小卡（非长文本） |
| `act` | 环上 Act 节点 | 节点点亮，向工具区发出调用箭头 |
| `tool-result` | 工具区→trace 的回流 | 工具返回成功/错误状态卡，写入 trace 轨道 |
| `check` | 环上 Check 节点 | 节点点亮，对照目标与约束 |
| `evidence` | Check 旁证据卡 | 显示测试/日志/diff/人工反馈类证据卡 |
| `continue` | 回 Observe 的环形箭头 | 继续箭头高亮（回到下一轮） |
| `stop` | 出口·完成态 | 完成态点亮（绿），循环收束 |
| `human-review` | 出口·人审分支节点 | 人审分支点亮（强调）；连续失败时此分支被强制走 |

### 2.3 逐步画面意图（`agent-loop` 讲，title=“Observe → Plan → Act → Check → Continue/Stop”）

| step | ① 画面变化 | ② 该步教的判断 | ③ reduced-motion 静态 |
|---|---|---|---|
| s1 用户给出目标（`goal`,`constraints`,`tools`） | 任务输入栏目标点亮，约束栏作为边界出现，工具区列出可用工具并带权限边界 | Agent 接的是“带约束和权限的任务”，不是一句问答 | 输入栏三要素静态点亮，环处于待启动态 |
| s2 Observe 观察（`observe`,`context`） | Observe 节点活跃，从上下文/日志区抽出证据卡片进入当前状态 | 每轮先建立“当前状态视图”再行动 | Observe 节点静态高亮，旁有 1–2 张证据卡 |
| s3 Plan 选择下一步（`plan`） | Plan 节点活跃，旁出现“下一步动作 + 验证标准”小卡 | 计划是“可验证的下一步”，不是一次性给全部答案 | Plan 节点静态高亮 + 动作/验证小卡 |
| s4 Act 调用工具（`act`,`tool-result`） | Act 节点活跃并向工具区发调用箭头，工具返回成功/错误状态并写入 trace | 行动=调用工具并消费其结果，结果要留痕 | Act 节点高亮、工具区有结果卡、trace 轨道追加一格 |
| s5 Check 校验结果（`check`,`evidence`） | Check 节点活跃，旁显示测试/日志/diff/反馈证据卡，对照目标与约束 | “执行过动作”≠“问题在推进”，必须按证据校验 | Check 节点高亮 + 证据卡静态呈现 |
| s6 继续、停止或转人工（`continue`,`stop`,`human-review`） | 三条出口同屏：继续箭头回 Observe、停止=完成态、人审分支点亮；连续失败时继续箭头变弱、强制走人审 | 退出条件与人审是 Loop 可控的关键，不是无界重试 | 三条出口路径静态全部可见，人审分支可辨 |

### 2.4 agent-loop 不要出现的表达

- 不出现 `goal`、`tool-result`、`human-review`、`continue/stop` 等 raw key 文本，也不出现 `config.type`。
- 不把 Plan 画成大段“思维链”推理文本；只给“下一步动作 + 验证标准”。
- 不做成工单看板/监控面板，不堆“成功率 %/重试次数=…”指标。
- trace 轨道只用“观察/动作/结果/继续条件”四类小格示意，不渲染真实长日志文本。
- 不在画布里重复播放器已显示的步骤标题/描述。

---

## 3. 分工边界：画布表达 vs 页面/播放器表达

| 内容 | 由谁表达 | 说明 |
|---|---|---|
| 当前步标题、当前步描述 | **播放器 caption**（已实现 `step.title`+`step.description`） | 画布**不**重复 |
| 概念定义、机制 6 点、误区、心智模型、案例 | **页面正文**（ConceptPage 各 section） | 画布**不**承载 |
| 步骤之间的“画面状态变化”（节点/连线/标尺/缓存命中/出口分支） | **动画画布** | 本文件即其依据 |
| 步骤计数 `n / N`、播放/暂停/上一步/下一步/重置 | **播放器控制区**（已实现） | 画布**不**自带控制 |
| reduced-motion 的关闭自动播放 | **播放器**（已实现）；画布只渲染静态态 | 协议已支持 |

---

## 4. reduced-motion 静态可读性总则

两个画布在 `reducedMotion=true` 时必须满足：

- 结构可见：prefill-decode 的“首字前/首字后时间轴 + 首 Token 分隔”、agent-loop 的“环形 + trace + 三出口”在静止状态下完整可见。
- 当前步可定位：当前活跃元素（命中 `highlightTargets`）有明确高亮，与基态区分。
- 关键对比静态成立：TTFT 长短、TPOT 疏密、长输出但首字不动、缓存命中 vs 未命中、继续 vs 停止 vs 人审，均可在不动画的情况下看懂（必要时用同屏并置两态）。
- 不依赖循环/位移动效传达语义；动效只是增强，不是唯一信息载体。
