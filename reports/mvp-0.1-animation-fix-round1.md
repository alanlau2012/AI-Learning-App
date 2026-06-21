# MVP 0.1 动画修复（回合 1）—— 动画工程师 Agent

> 角色：动画工程师（只改动画表现层，不动协议/正文）
> 范围：实现 `prefill-decode` 与 `agent-loop` 两个高复用真实画布，接入 registry；其余动画维持 `GenericMechanismAnimation` 不动。
> 依据：`content/reviewed/mvp-0.1-animation-intent-round1.md`（画面意图唯一依据）+ `docs/animation-spec.md`（契约）+ `design.md`（视觉红线）。

---

## 1. 实现了什么

### 1.1 PrefillDecodeAnimation（横向时间轴超集画布）
被 `prefill / decode / ttft` 三讲复用。采用「超集元素布局 + 仅高亮当前步 `highlightTargets` 命中元素」，沿用 `KVCacheAnimation` 的 `active()` 模式，**不拆三套互斥组件**。

- 整体一条横向时间轴：`首字前段（preSide，冷蓝）` → `首 Token 分隔标记（divider）` → `首字后段（postSide，暖橙）`。
- 首字前段含：输入区（系统提示 / 检索片段 / 历史会话）→ 输入 Token 条 → 前置处理带（网关 / 排队 / 路由 / 检索 / 工具）→ Prefill 区 → KV Cache 区。
- 首字后段含：Decode 循环（输出序列 + 自回归循环符 ↻）。
- 标尺区：TTFT（首字前总长，用长度表达，含 ttft-growth 的“原长度”虚线对比标记）、TPOT（相邻输出间距，用疏密表达）。
- 归因分段条：仅 `latency-breakdown` 命中讲（ttft）出现，用不同色块/宽度表达网关/检索/Prefill/网络占比，**无数字读数**。
- **按概念聚焦的“收起基态”**：用 `config.steps` 全量 key 并集判断分组相关性，未被该讲使用的分组（如 `decode` 讲的前置处理带、`prefill`/`ttft` 讲的 Decode 区）渲染为淡出 `dormant` 基态，不硬塞——满足意图 §1.2、§1.4。

### 1.2 AgentLoopAnimation（环形循环 + trace 轨道 + 三出口）
覆盖 `agent-loop` 讲（`tool-calling` 仍 stub，元素已就位，未来复用同画布无需改协议）。

- 顶部任务输入栏：目标 / 约束。
- SVG 环形：观察 → 计划 → 行动 → 校验 四节点 + 判断/出口节点（虚线框）。
- 工具区（环外右侧，含 🔒 权限边界）：行动→工具区调用线、工具区→trace 结果回流线。
- 三出口同屏可见：继续（弧线回观察）、完成（绿 chip）、人审（暖橙 chip）。**连续失败语义**：`human-review` 命中时继续弧线被弱化（虚化降透明），人审分支加粗强调。
- 卡片：观察证据卡（证据/上下文）、计划小卡（下一步动作 · 验证标准，非长推理文本）、校验证据卡（测试/日志）。
- 底部 trace 轨道四格：观察 / 动作 / 结果 / 继续条件，按“截至当前步累计出现过的 key”逐轮点亮（filled），当前步命中格再加 current 高亮。

---

## 2. 新增 / 修改的文件

| 文件 | 操作 |
|---|---|
| `src/components/animation/PrefillDecodeAnimation.tsx` | 新增 |
| `src/components/animation/PrefillDecodeAnimation.module.css` | 新增 |
| `src/components/animation/AgentLoopAnimation.tsx` | 新增 |
| `src/components/animation/AgentLoopAnimation.module.css` | 新增 |
| `src/components/animation/registry.ts` | 修改：`prefill-decode`→`PrefillDecodeAnimation`、`agent-loop`→`AgentLoopAnimation`（替换原 `GenericMechanismAnimation` 两项），新增两条 import |

**未触碰任何禁改文件**：`AnimationConfig` 协议 / `src/types/*` 未改；`AnimationPlayer.tsx` 未改；`GenericMechanismAnimation.tsx` 未改；`ConceptPage`、`docs/*`、`src/data/*` 未改。

---

## 3. 两画布如何把 highlightTargets 映射为画布元素

key **全部作为元素 id 驱动视觉状态，从不作为文本标签渲染**，画布上中文均为固定短标签（系统提示/Prefill/首 Token/观察/计划等），不出现 `config.type`。

### 3.1 prefill-decode（覆盖三讲全量 key）
`prompt`→系统提示块、`rag-chunks`→检索片段块、`history`→历史会话块（偏灰）、`input-tokens`→Token 条、`long-context`→Token 条拉长、`gateway/queue/route/rag/tool-call`→前置处理带各格、`prefill`→Prefill 区点亮、`prefill-done`→Prefill 完成态（虚线/打勾/淡）、`kv-write`→KV 写入态、`cache`→缓存格绿、`first-token`→首 Token 分隔标记、`stream`→回传通道、`ttft`→TTFT 标尺高亮、`ttft-growth`→TTFT 标尺变长（带原长度虚线）、`first-output-token`→首个输出块、`append-token`→序列末尾块、`decode-loop`→循环符 ↻、`tpot`→TPOT 标尺、`token-interval`→输出间距变宽、`long-output`→输出序列变多、`total-latency`→首字后段右端延伸（首 Token 标记位置不动）、`latency-breakdown`→归因分段条。

### 3.2 agent-loop
`goal`→目标 chip、`constraints`→约束 chip、`tools`→工具区（含权限锁）、`observe`→观察节点、`context`→观察证据卡、`plan`→计划节点 + 动作/验证小卡、`act`→行动节点 + 调用线、`tool-result`→工具区→trace 结果回流线、`check`→校验节点、`evidence`→校验证据卡、`continue`→继续回流弧线、`stop`→完成 chip（绿）、`human-review`→人审 chip（暖橙强调）。

---

## 4. reduced-motion 处理
- 两画布均为「按当前步渲染静态状态」，所有差异编码在 class（fill/stroke/opacity/宽度/间距），不依赖位移或循环动效传达语义。
- `reducedMotion=true` 时加 `.reduced`，用 `transition: none !important; animation: none !important` 关闭全部过渡。
- 静态可读性满足意图 §4：时间轴/环形结构、当前步高亮、命中 vs 未命中差异、TTFT 长短、TPOT 疏密、长输出但首字不动（首 Token 标记固定）、继续/停止/人审三出口、缓存命中绿，均在静止画面一眼可辨。

---

## 5. 其他动画 & fallback
- `token-flow / attention-map / context-window / model-router / issue-fix-flow` 继续走 `GenericMechanismAnimation`（主开发已收口 raw key），本轮**未改该组件**。
- 确认其表现：仅渲染时间轴圆点 + “步骤 n / N”，**不暴露 raw key、不展示 `config.type`**；当前步标题/描述由 `AnimationPlayer` 的 caption 承担，fallback 文案可读。无需小修。

---

## 6. 命令结果（PowerShell）

```
> npm run typecheck
> tsc -b
（无输出，Exit code: 0）

> npm run lint
> eslint .
（无错误，Exit code: 0）

> npm run build
> tsc -b && vite build
✓ 92 modules transformed.
dist/assets/index-DcQGa-EC.js   412.92 kB │ gzip: 131.80 kB
✓ built in 700ms
（Exit code: 0）

> npm run validate:animation
  [animation] 已校验动画一致性、注册类型与步骤合法性。
（Exit code: 0）
```

四项命令全部通过；registry 接入新组件未破坏 `validate:animation`（hasAnimation 与 type 注册一致）。

---

## 7. 遗留项 / 后续
- `tool-calling` 讲仍为 stub；AgentLoop 画布元素已为其预留（未来复用同画布、同 key 映射即可，无需改协议）。
- `tpot` 知识点（spec §2 列在 prefill-decode 覆盖范围内）在 demoConcepts 当前无独立 animation 配置；画布已具备 TPOT/间距元素，未来该讲接入时自动复用。
- 协议 3 处软缺口（见 `reports/mvp-0.1-animation-intent-round1.md`）本轮按要求**未改协议**，靠“超集元素 + 并集判断聚焦”规避，无阻塞。

---

## 8. 停止点
未触发停止点：无需新增协议字段、未重构 Player、未改页面结构、未重做 prefill-decode/agent-loop 之外的专用画布。

**结论**：两个画布均完成；registry 已接入；typecheck/lint/build/validate:animation 全部通过；未触碰任何禁改文件；无需总控处理的阻塞。
