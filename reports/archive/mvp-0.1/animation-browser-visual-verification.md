# 动画浏览器可视化验收报告

> 角色：动画浏览器可视化验收 Agent（Claude Opus 4.8）
> 基线：`main` @ `627a6d4`（动画重构合入后），工作树干净。
> 目标：在真实浏览器中逐讲走查 12 讲动画，确认可读、不卡断、不溢出、不泄漏 raw key，并判断是否可进入 44 讲扩展。
> 配套：审计 [animation-expert-audit.md](animation-expert-audit.md)、设计 [docs/expert-animation-design-plan.md](../docs/expert-animation-design-plan.md)、重构 [animation-expert-fix-report.md](animation-expert-fix-report.md)、验证 [animation-expert-verification.md](animation-expert-verification.md)。

---

## 1. 结论

**PASS_WITH_MINOR_ISSUES**

- **桌面端（MVP 第一优先级目标，design.md §3.5）：12/12 讲全部通过。** 全部为真实机制画布（非圆点占位），每讲 ≥3 步且每步画布状态真实变化，表达机制因果链 + 工程指标/瓶颈/失败路径，无 raw key 泄漏、无内部标识、无横向溢出，符合「轻量工程学习书桌」风格。
- **窄屏（<600px）：9/12 讲干净；3 讲有问题。** `prefill` / `decode` / `ttft`（共用 `PrefillDecodeAnimation`）在 390px 触发约 **205px 的页面级横向滚动**（违反 animation-spec §3.3「页面整体无横向滚动」）。这是本轮唯一实质缺陷，且为同一组件的同一处 CSS 容器问题。
- 工程四门禁全绿（见 §2 之前置）。无 P0；无阻断桌面 MVP 的问题；唯一缺陷为 P2（理由见 §5）。

---

## 2. 浏览器环境

- 方式：**Playwright MCP 驱动本机 Chromium（自动化浏览器，真实渲染）**。上一轮 `npx playwright install chrome` 远端 502 的问题本轮未复现——本机已存在系统 Chrome、Edge，以及 Playwright 缓存的 `chromium-1200` 与 `mcp-chrome`，MCP 直接成功拉起浏览器。
- 本地服务：`npm run dev`（Vite v8）→ `http://localhost:5173/`，路由 `/concepts/:slug`（`createBrowserRouter`，HTML5 history）。
- 视口：桌面 `1280×900`，窄屏 `390×820`。
- 走查手段（每讲）：
  1. 导航到详情页 → 定位动画播放器（含 `播放/暂停/上一步/下一步/重置` 控件的容器）。
  2. `重置` 回到第 1 步，逐步 `下一步` 走完全部步骤；对每一步计算**画布 outerHTML 签名**（判断每步是否真有状态变化）、抓取步骤字幕、测量页面横向溢出与画布内部横向溢出。
  3. 对画布可见文字做 **raw key / 内部标识** 黑名单扫描。
  4. 关键讲（attention / kv-cache / model-gateway / multi-model-routing / context-window / skill / issue-fix-agent）截图存证（桌面 + 窄屏）。
- 前置工程门禁（实跑，全绿）：

  | 命令 | 结果 |
  |---|---|
  | `git status` | 干净（本轮新增的是 reports 报告与 .playwright-mcp 截图，属未跟踪证物） |
  | `npm run validate:content` | ✅ 已校验 demo/mvp 12 讲；动画一致性/注册/步骤合法 |
  | `npm run typecheck`（`tsc -b`） | ✅ 0 错误 |
  | `npm run lint`（`eslint .`） | ✅ 0 错误 |
  | `npm run build`（`tsc -b && vite build`） | ✅ 102 模块，CSS 56.41KB / JS 441.96KB（gzip 140.5KB），~0.86s |
- 浏览器控制台：逐讲检查，**0 error / 0 warning**。

---

## 3. 逐讲验收结果

> 「画布状态」列 = 走查中检测到的「不同步骤呈现不同画布签名」的数量 / 总步数；N/N 表示每一步都有真实可见状态变化。
> 「桌面/窄屏」= 页面横向溢出（px）。0 = 无溢出。

### 1) Token
- 页面路径：`/concepts/token`
- animation type：`token-flow`（`TokenFlowAnimation`）
- 是否出现：是（文本→分词→Token 格子→编号/向量→Prefill 占用/TTFT→输出/成本 流动链）
- 是否有状态变化：是，5/5
- raw key 泄漏：无
- 桌面布局：0 溢出；正常
- 窄屏布局：0 溢出；正常
- reduced-motion / 静态态：可读（逐步静态切换，每步独立可懂）
- 结论：**PASS**
- 问题：无

### 2) 注意力机制
- 页面路径：`/concepts/attention`
- animation type：`attention-map`（`AttentionAnimation`，SVG viewBox 0 0 600 200）
- 是否出现：是（Token 行 + 当前 Token 蓝描边 + 因果方向只看历史的加权连线 + 权重分布条；含污染/清洗对照）
- 是否有状态变化：是，5/5
- raw key 泄漏：无
- 桌面布局：0 溢出；正常
- 窄屏布局：0 溢出；SVG 等比缩放到 195px，主体结构（方块/连线/权重条）清晰
- reduced-motion / 静态态：可读（连线粗细/颜色为静态编码）
- 结论：**PASS**
- 问题：窄屏 <400px 时 SVG 内部微标注字偏小（步骤字幕已补偿，理解不受影响）→ P2 装饰级

### 3) Prefill
- 页面路径：`/concepts/prefill`
- animation type：`prefill-decode`（`PrefillDecodeAnimation`，A 级样板）
- 是否出现：是（首字前/首字后两段时间轴 + 输入区 + 前置处理带 + Prefill + KV 写入 + 首 Token 分隔 + TTFT 标尺）
- 是否有状态变化：是，5/5
- raw key 泄漏：无
- 桌面布局：0 溢出；正常
- 窄屏布局：**约 205px 页面级横向溢出** ✗（根因见 §4 / §5）
- reduced-motion / 静态态：可读
- 结论：**PASS（桌面）/ 窄屏不达标**
- 问题：窄屏页面级横向滚动（P1→按 MVP 范围降为 P2，见 §5）

### 4) Decode
- 页面路径：`/concepts/decode`
- animation type：`prefill-decode`（同组件，聚焦 Decode 循环 + TPOT + 长输出累积）
- 是否有状态变化：是，5/5
- raw key 泄漏：无
- 桌面布局：0 溢出；窄屏布局：**约 205px 页面级横向溢出** ✗（同 §4）
- reduced-motion / 静态态：可读
- 结论：**PASS（桌面）/ 窄屏不达标**

### 5) TTFT
- 页面路径：`/concepts/ttft`
- animation type：`prefill-decode`（同组件，聚焦网关/排队/RAG/Prefill 链路分段归因）
- 是否有状态变化：是，5/5
- raw key 泄漏：无
- 桌面布局：0 溢出；窄屏：与 prefill/decode 同组件，**同样页面级横向溢出** ✗（同 §4）
- reduced-motion / 静态态：可读
- 结论：**PASS（桌面）/ 窄屏不达标**

### 6) KV Cache
- 页面路径：`/concepts/kv-cache`
- animation type：`kv-cache`（`KVCacheAnimation`，已重构）
- 是否出现：是（Session A→Prefill→KV slots 顶栏 + 命中/未命中**双路径对照** + 显存容量条/淘汰）
- 是否有状态变化：是，5/5（原「画了开关没接线」bug 已修：hit/miss/route-miss/kv-write 均驱动真实状态）
- raw key 泄漏：无
- 桌面布局：0 溢出；命中（绿，短 TTFT）vs 未命中（橙，长 TTFT）对照清晰
- 窄屏布局：0 溢出；双路径正确**纵向堆叠**，显存条完整
- reduced-motion / 静态态：可读（双路径同屏静态对照）
- 结论：**PASS**
- 问题：窄屏 ≤400px 顶栏 Session/Prefill/KV 三块挤压、文字逐字竖排（仍可读、不溢出）→ P2 装饰级

### 7) 模型网关
- 页面路径：`/concepts/model-gateway`
- animation type：`model-router`（`ModelRoutingAnimation`·网关治理模式）
- 是否出现：是（入口 应用A/B/C→统一网关 / 治理 鉴权·配额·策略 / 路由 / 证据 Token·耗时·模型版本·trace id / 兜底 熔断·限流·备用路由）
- 是否有状态变化：是，5/5
- raw key 泄漏：无
- 桌面布局：0 溢出；多 lane 分行整齐
- 窄屏布局：0 溢出；正常
- reduced-motion / 静态态：可读
- 结论：**PASS**

### 8) 多模型路由
- 页面路径：`/concepts/multi-model-routing`
- animation type：`model-router`（同组件·路由选择模式）
- 是否出现：是（约束标签组 + 三张模型画像卡 小/中/旗舰 各带能力·成本·时延条 + 升级/备用补位 + 评测·观测回流）
- 是否有状态变化：是，5/5（与网关模式签名/字幕完全不同，**双模式按 key 自动切换确认**）
- raw key 泄漏：无
- 桌面布局：0 溢出；三卡并排正常
- 窄屏布局：0 溢出；约束 chip 换 2 行、三画像卡压缩但能力/成本/时延条仍可辨
- reduced-motion / 静态态：可读
- 结论：**PASS**
- 问题：窄屏 ≤400px 三画像卡偏紧 → P2 装饰级

### 9) 上下文窗口
- 页面路径：`/concepts/context-window`
- animation type：`context-window`（`ContextWindowAnimation`）
- 是否出现：是（左候选池 灰态 / 右有限窗口：不可破坏约束置顶绿、RAG 高相关蓝、虚线「上限」、压缩腾出的空间 / 底部 成本·TTFT·质量 三条对照）
- 是否有状态变化：是，5/5（候选→窗口上限→筛选排序→压缩→指标，**塞满 vs 筛选压缩差异可见**）
- raw key 泄漏：无
- 桌面布局：0 溢出；窄屏布局：0 溢出
- reduced-motion / 静态态：可读（在窗/出窗用位置+颜色静态编码）
- 结论：**PASS**

### 10) Agent Loop
- 页面路径：`/concepts/agent-loop`
- animation type：`agent-loop`（`AgentLoopAnimation`，A 级样板，SVG）
- 是否出现：是（环形 Observe→Plan→Act→Check + 三出口 继续/完成/人审 + 工具区权限边界 + trace 轨道）
- 是否有状态变化：是，6/6
- raw key 泄漏：无
- 桌面布局：0 溢出；窄屏布局：0 溢出
- reduced-motion / 静态态：可读
- 结论：**PASS**

### 11) Skill
- 页面路径：`/concepts/skill`
- animation type：`skill-lifecycle`（`SkillLifecycleAnimation`，**本轮从无到有新增**）
- 是否出现：是（高频任务→匹配→Skill；「Skill = SOP + 工具包」结构卡含 触发条件/指令/资源/脚本/约束；调用工具·收集证据·自检✓；反馈回流 评测/人工/trace；Skill 库 v1.3；治理带 Owner/权限边界/弃用策略；并含灰态「普通 Prompt：无结构/不可复用/无版本」反例对照）
- 是否有状态变化：是，6/6
- 与正文一致性：**高度一致**——画布要素与该讲 definition（Skill=SOP+工具包/触发+指令+资源+脚本+约束）、mechanism（发现→加载→执行/自检→反馈→沉淀→治理）逐条对应
- raw key 泄漏：无
- 桌面布局：0 溢出；窄屏布局：0 溢出
- reduced-motion / 静态态：可读
- 结论：**PASS**

### 12) Issue Fix Agent
- 页面路径：`/concepts/issue-fix-agent`
- animation type：`issue-fix-flow`（`IssueFixFlowAnimation`）
- 是否出现：是（问题单 复现/期望/约束 → 定位 仓库·搜索 → 补丁 最小化·限定影响面 → 验证 测试·类型检查 → PR·人审 人类 Owner 合入；中部「↩ 验证失败回到定位/缩小修改，不盲目向前扩散」失败回流；底部「↺ 质量回流」→ 问题单模板/Skill/评测集）
- 是否有状态变化：是，6/6
- 验证闭环可见性：**是**——失败回流箭头与质量回流弧线均明确标注，工程判断点突出
- raw key 泄漏：无
- 桌面布局：0 溢出；窄屏布局：0 溢出
- reduced-motion / 静态态：可读
- 结论：**PASS**

---

## 4. 重点风险项

| 风险项 | 结果 | 说明 |
|---|---|---|
| attention-map 窄屏（SVG） | ✅ 通过 | viewBox 等比缩放至 195px，主体结构清晰，0 溢出；仅内部微标注偏小（P2） |
| model-router 多 lane | ✅ 通过 | 网关/路由双模式桌面分行整齐；窄屏 chip 换行、画像卡压缩但不溢出（0 溢出） |
| kv-cache 双路径 <600px | ✅ 通过 | 命中/未命中双路径正确纵向堆叠，0 溢出；仅顶栏三块 ≤400px 偏挤（P2） |
| skill-lifecycle 与正文一致 | ✅ 通过 | 画布结构与该讲定义/机制逐条对齐，含「普通 Prompt」反例对照 |
| issue-fix-flow 验证闭环 | ✅ 通过 | 「验证失败回流」与「质量回流」均明确可见 |
| context-window 塞满 vs 压缩筛选差异 | ✅ 通过 | 上限虚线 + 压缩腾出空间 + 约束置顶 + 三指标对照，差异可读 |
| **prefill-decode 窄屏（附加发现）** | ⚠️ 不达标 | prefill/decode/ttft 在 390px 触发 ~205px **页面级**横向滚动（见 §5 P2-1） |

---

## 5. 问题分级

### P0（动画空白、页面崩溃、关键机制误导、主路径不可用）
- **无。**

### P1（动画可用但严重错位、窄屏不可读、关键状态缺失、raw key 泄漏）
- **无。**（窄屏 prefill-decode 仍可读，靠横向滚动可见全部内容；未达「不可读/严重错位」。其严格判定见下方 P2-1 说明。）

### P2（轻微视觉瑕疵、间距、节奏、文案微调）

- **P2-1（重点，唯一实质缺陷）：`prefill` / `decode` / `ttft` 窄屏页面级横向滚动。**
  - 现象：390px 视口下整页横向溢出约 205px（侧栏内容从右侧渗入、底部出现页面级横向滚动条）。其余 9 讲该值为 0。
  - 根因：`src/components/animation/PrefillDecodeAnimation.module.css` 中 `.track { min-width: 540px }`，而 `.canvas`（已设 `overflow-x: auto`）只有 `max-width: 640px`、**缺 `max-width: 100%` / `width: 100%` 的列宽上限**；窄列下画布盒被 540px 内容撑到 ~564px，把溢出泄漏到页面级，而非在画布内部滚动。
  - 最小修复（约 1 行 CSS，不改协议/不改组件逻辑）：给 `.canvas` 增加 `max-width: 100%`（保留既有 `overflow-x: auto`），即把「页面级横向滚动」收敛为「画布内部横向滚动」——后者是 animation-spec §3.3 明确允许的形态。
  - 为何判 P2 而非 P1：① design.md §3.5 明确「MVP 第一优先级是桌面 Web，移动端后续适配」，桌面 MVP 目标下该讲完全正常；② 内容窄屏仍可读（可滚动查看），非「不可读/误导/状态缺失」；③ 属「本应内部滚动」的容器收敛缺一个属性，非机制/正确性缺陷；④ 审计与重构报告已将 prefill-decode 移动端最小宽度预登记为 P2。
  - 严格性提示：若按本轮验收清单第 12 项「窄屏 <600px 不溢出」逐字判定，该 3 讲未达标；但综合 MVP 范围与可读性，定级 P2。

- **P2-2：`kv-cache` 顶栏三块（Session A / Prefill / KV Cache）在 ≤400px 偏挤、文字逐字竖排。** 仍可读、0 溢出。可后续让顶栏在窄屏纵向堆叠。

- **P2-3：`attention` SVG 内部微标注字在 <400px 偏小。** 主体结构清晰，步骤字幕已补偿语义，理解不受影响。

- **P2-4：`multi-model-routing` 三张模型画像卡在 ≤400px 偏紧。** 能力/成本/时延条仍可辨、0 溢出。

---

## 6. 是否建议进入 44 讲扩展

**有条件建议进入。**

- 桌面端 12/12 达专家级，且已形成可复用样板矩阵（时间轴+标尺 / 环路+出口+trace / 流水+回流 / 对照路径 / 加权关系 / 有限容器 / 治理管线），具备扩展基础。
- **唯一条件（强烈建议、成本极低）：先落 P2-1 的 1 行 CSS 容器修复再复用 `PrefillDecodeAnimation` 模板。** 原因：prefill-decode 是被设计为复用样板的 A 级组件，若窄屏页面级横滚不修，扩展到更多讲时会**把同一缺陷复制扩散**——这正是任务「先做浏览器走查、避免把视觉问题复制到更多讲」的初衷所在。
- 其余 P2（P2-2/3/4）为装饰级，进 backlog，不阻塞扩展。

---

## 7. 是否需要修复

- 不存在 P0/P1，桌面 MVP 可按现状验收。
- 建议的最小返修清单（均为 CSS、不触协议/Player/ConceptPage/正文）：
  1. **（建议先行）** `PrefillDecodeAnimation.module.css` 的 `.canvas` 增加 `max-width: 100%`，将窄屏页面级横滚收敛为画布内部横滚（修复 P2-1，惠及 prefill/decode/ttft 三讲）。
  2.（可选 backlog）`KVCacheAnimation` 顶栏在 ≤400px 纵向堆叠（P2-2）。
  3.（可选 backlog）`AttentionAnimation` 窄屏放大内部标注或精简标注（P2-3）。
  4.（可选 backlog）`ModelRoutingAnimation` 路由模式画像卡窄屏换行（P2-4）。
- 若仅按「只有 P2 → 进 backlog、不阻塞扩展」执行：可直接开扩展；但鉴于 P2-1 涉及复用模板，倾向先做第 1 项再扩展。

---

## 8. 最终建议

1. **采纳桌面 MVP 验收**：12 讲动画桌面端为专家级，机制、状态变化、指标/失败路径、风格与 raw-key 红线全部达标。
2. **开扩展前先合入 1 行 CSS（P2-1 修复）**：给 `PrefillDecodeAnimation` 的 `.canvas` 加 `max-width: 100%`，避免窄屏页面级横滚随模板复用扩散；这是进入 44 讲扩展的唯一前置。
3. **其余 P2 入 backlog**，与 44 讲扩展并行处理。
4. 扩展时复用现有 7 类样板、以 highlightTargets 聚焦；新类型才走「注册新组件」，需改 `AnimationConfig` 协议则上报停止点。

> 证物截图（未跟踪，位于仓库根目录与 `.playwright-mcp/`）：`attention-desktop-step5.png`、`kvcache-desktop-step5.png`、`modelgateway-desktop.png`、`routing-desktop.png`、`contextwindow-desktop.png`、`skill-desktop.png`、`issuefix-desktop.png`、`kvcache-narrow.png`、`attention-narrow.png`、`routing-narrow.png`、`prefill-narrow.png`。
