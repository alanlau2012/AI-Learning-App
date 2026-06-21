# MVP 0.1 动画意图工作摘要（回合 1）

> 角色：动画意图 Agent（Claude Opus 4.8）  
> 产物：`content/reviewed/mvp-0.1-animation-intent-round1.md`（逐步画面意图 + key→可视元素映射 + fallback + 分工边界）。  
> 边界：未改 `src/*`、未改 `docs/content-schema.md` 与 `docs/animation-spec.md`、未改 `AnimationConfig` 协议、未改课程正文。

## 1. 本轮做了什么

- 按 Owner 决策（`reports/mvp-0.1-owner-decision.md` §4）只覆盖两个高复用动画：`prefill-decode` 与 `agent-loop`。
- 以 `src/data/demoConcepts.ts` 实际 `animation.steps[].highlightTargets` 为唯一 key 来源，没有臆造 key。
- 为 `prefill-decode` 定义了统一横向时间轴画布，覆盖要求的：输入区 / Prefill 阶段 / 首 Token 出现 / Decode 阶段 / TTFT 与 TPOT 差异 / KV Cache 是否复用。
- 为 `agent-loop` 定义了环形循环 + trace 轨道 + 三出口画布，覆盖要求的：Observe / Plan / Act / Check / Continue 或 Stop / 人审分支 / 工具调用结果回流。
- 对每讲每一步给出：画面变化、用户应理解的机制、reduced-motion 静态 fallback、不要出现的表达。
- 输出完整 key→可视元素映射表，并明确禁止把 key 当文本标签展示。
- 明确画布与页面正文/播放器 caption 的分工边界，避免重复说明。

## 2. 关键实现约束（提醒动画工程师）

1. **一个 type 服务多讲。** `prefill-decode` 被 `prefill / decode / ttft` 三讲复用，三套 `steps` 顺序与 key 集合不同；必须用“超集元素布局 + 仅高亮命中 key”实现（沿用 `KVCacheAnimation` 的 `active()` 模式），不要拆成三套互斥组件。
2. **画布可读 `config`（含 `title`、完整 `steps`）判断侧重**，但布局保持单一超集；某讲缺失的 key 对应元素保持收起/基态，不要硬塞。
3. **raw key 永不上屏**，画布可见文字只用元素自带固定短标签；不展示 `config.type`。
4. **去重**：画布不重复播放器已显示的 `step.title`/`step.description`。
5. **视觉红线**：克制深色画布、主蓝 `#1F40D8`、命中绿 `#2E7D58`、未命中克制暖橙；不做监控面板、不堆指标数字。TTFT/TPOT 用长度/间距表达，不用数字读数。

## 3. 现有 AnimationConfig 协议是否够用

**结论：够用。本轮不需要、也未改动 `AnimationConfig` 协议。**

现协议（来自 `docs/content-schema.md` §2）：

```ts
interface AnimationConfig { type: AnimationType; title: string; steps: AnimationStep[]; }
interface AnimationStep { id: string; title: string; description: string; highlightTargets?: string[]; durationMs?: number; }
```

- 画布所需的“按步高亮某些元素”能力由 `highlightTargets: string[]` 表达，足够驱动本文件全部映射。
- “节奏/停留时长”由 `durationMs` 表达，足够。
- canvas 能拿到完整 `config`（`AnimationCanvasProps`），可据 `title` / steps key 并集推断侧重，无需新增字段。

## 4. 协议缺口记录（仅记录，按停止点要求不改协议）

以下为“当前可绕过、但若未来动画更复杂会变痛”的软缺口，供 Owner / 主开发后续评估，本轮**不**修改协议：

1. **缺少“变体/侧重”显式声明。** 同一 `type` 被多讲复用且语义侧重不同（Prefill 侧重 vs Decode 侧重 vs TTFT 侧重），目前只能让 canvas 通过扫描 step key 并集或 `title` 字符串来推断，属隐式约定，较脆。可选缓解（未来）：在 `AnimationStep` 或 `AnimationConfig` 增加可选 `variant`/`focus` 标记。**本轮用“超集布局 + 命中即高亮”规避，无需改协议。**
2. **`highlightTargets` 仅为 string[]，不携带视觉语义类型。** 同一 key 可能需要“高亮 / 拉长 / 变暗 / 改路径 / 显示分段”等不同处理（如 `ttft` 高亮 vs `ttft-growth` 变长）。目前这些差异完全由 canvas 内部的 key→处理映射承担，可行但映射逻辑沉淀在组件里、不在数据里。**本轮接受由 canvas 内部映射，无需改协议。**
3. **无法用数据表达数值量级。** TTFT 长短、TPOT 间距、长上下文/长输出的相对量，目前只能在 canvas 内写死“对比两态”，不能由 `step` 传入数值参数。对 MVP 教学足够（本就强调“相对差异”而非真实读数），但未来若要数据驱动可对比，需要扩展。**本轮不需要。**

> 以上三点均不阻塞 `prefill-decode` 与 `agent-loop` 的实现，按停止点要求不改 `AnimationConfig`。

## 5. 自检结论

- 两个动画意图：**已完成**（prefill-decode 覆盖三讲全部步骤，agent-loop 覆盖六步全部要素）。
- key → 可视元素映射：**齐全**，覆盖 demoConcepts 中两个 type 实际出现的全部 highlightTargets。
- 协议缺口：发现 3 处软缺口，均已记录且可绕过，**未触达需改协议的硬阻塞**。
- 动画工程师可否据此直接实现：**可以**。映射表、逐步画面意图、fallback、视觉红线、分工边界齐备，无需先改协议或页面结构。
