# MVP 0.1 修复回合 1 · 端到端复验报告

> 角色：E2E 验证 Agent（Claude Opus 4.8）。只做修复回合 1 的端到端复验与报告，不改业务代码、不改课程内容、不修 bug。
> 验证方法：**命令门禁（实跑 4 条）+ 代码级路径推演**。本环境为纯命令行（PowerShell），**未起 dev server、未启动浏览器**；浏览器交互路径以逐条「用户操作 → 代码分支 → 结果」推演覆盖，证据全部指向源码行号。

---

## 0. 明确结论

**结论：PASS_WITH_MINOR_ISSUES。**

- Owner 决策（`reports/mvp-0.1-owner-decision.md` §1–§4）全部已在代码中实现。
- 11 项必须验证项逐条通过；4 条命令门禁全部通过（退出码均为 0）。
- **无 P0 返修项，无 P1 返修项。**
- 唯一遗留为 1 个 **P2 非阻塞、且本轮明确不在范围内**的历史项：`index.html` 仍保留 Google Fonts 外链（UFP-10 / 上一轮 E2E P1→统一计划 P2）。它不属于本轮修复范围，非回归，不影响任一验收项，故仅记录、不返修。

---

## 1. 命令门禁结果（实跑）

| 命令 | 退出码 | 结果 | 关键输出 |
|---|---:|---|---|
| `npm run validate:content` | 0 | 通过 | `[published-content] 已校验 demo/mvp 内容 12 个`；`[animation] 已校验动画一致性、注册类型与步骤合法性`；`通过：内容结构校验（56 登记 / 模块计数 10/10/8/16/6/6 / 唯一性 / 关联无悬空 / contentStatus / 诊断题结构）` |
| `npm run typecheck` | 0 | 通过 | `tsc -b` 无错误输出 |
| `npm run lint` | 0 | 通过 | `eslint .` 无错误输出 |
| `npm run build` | 0 | 通过 | `✓ 92 modules transformed`；`✓ built in 535ms`，产物写入 `dist/` |

四条命令全部通过。

---

## 2. 诊断题单选分布（本 Agent 独立重算）

数据来源：直接读取 `src/data/demoConcepts.ts` 中 12 题的 `type` 与 `correctOptionIds` 字段（逐题读取行号见下表）。

| 题号 | type | 正确项 | 行号 |
|---|---|---|---:|
| `q-token-1` | single | **C** | 124–126 |
| `q-attention-1` | single | **D** | 275–277 |
| `q-prefill-1` | single | **A** | 424–426 |
| `q-decode-1` | single | **C** | 574–576 |
| `q-ttft-1` | **multiple** | A/B/C | 726–730 |
| `q-kv-cache-1` | single | **D** | 878–880 |
| `q-model-gateway-1` | single | **A** | 1028–1030 |
| `q-multi-model-routing-1` | single | **B** | 1180–1182 |
| `q-context-window-1` | single | **D** | 1331–1333 |
| `q-agent-loop-1` | single | **B** | 1492–1494 |
| `q-skill-1` | single | **C** | 1592–1594 |
| `q-issue-fix-agent-1` | single | **A** | 1753–1755 |

**单选分布（11 题，排除多选 `q-ttft-1`）：**

| 正确项 | 题目 | 数量 | 占比 |
|---|---|---:|---:|
| A | `q-prefill-1`、`q-model-gateway-1`、`q-issue-fix-agent-1` | 3 | 27.3% |
| B | `q-multi-model-routing-1`、`q-agent-loop-1` | 2 | 18.2% |
| C | `q-token-1`、`q-decode-1`、`q-skill-1` | 3 | 27.3% |
| D | `q-attention-1`、`q-kv-cache-1`、`q-context-window-1` | 3 | 27.3% |

**结论：A=3 / B=2 / C=3 / D=3，与预期完全一致。** A/B/C/D 全覆盖；最高占比 27.3% < 40% 上限。多选 `q-ttft-1`（A/B/C）不计入单选位置分布，结构独立合法（多选长度 3）。

**强干扰项与解析逐项说明（抽样独立核验）：**
- `q-token-1`（行 127）：解析显式点名 a/b/d，并把 d「重复附件缓存」标为强干扰项，说明应在确认输入 Token 来源后再做。
- `q-multi-model-routing-1`（行 1183）：a「5% 灰度+投诉率兜底」显式标注「强干扰项」，并解释为何不是第一步（缺任务分类/评测集/分任务失败率）。
- `q-skill-1`（行 1595）：b 显式标为强干扰项，逐项解释 a/b/d 为何不是第一步。
- `q-ttft-1`（行 731）：多选解析说明 a/b/c 为何都合理，并说明 d 为何不是最佳判断（Decode 在首字后、TPOT 稳定）。
- 满足「≥30% 题目具备强干扰项、解析说明其他项为何不是第一步」门禁。

---

## 3. 11 项必须验证项 · 逐项结论（含代码依据 / 路径推演）

### ✅ 项 1：保留 56 讲完整课程地图
- **通过。** `validate:content` 校验「56 登记 / 模块计数 10/10/8/16/6/6」通过。
- 模块页 `ModulePage.tsx` L54–58：`moduleConcepts` 取模块全部 `conceptIds`，不过滤 stub；L139–168 对全量渲染（已上线用 `ConceptCard`，未上线用占位卡），56 讲全部可见。
- 搜索 `search.ts` L38–60：对全量 `concepts` 评分，stub 仍可命中标题/标签/正文，保留地图可见性。

### ✅ 项 2：主学习路径只进入已上线 12 讲
- **通过。** 统一判定 `isPublishedConcept()`（`progress.ts` L127–131：`contentStatus !== undefined && !== 'stub'`）；`orderedPublishedConcepts`（L133）= 按模块顺序铺平的 12 讲；`publishedConceptIdSet`（L134）。
- **继续学习** `getContinueLearningConceptId()`（L154–168）：只在 `lastVisitedConceptId` 属于已上线集合时返回它，否则按模块顺序找第一个未完成的已上线讲，全完成回到第一讲——永不返回 stub。
- **下一讲** `ConceptPage.tsx` L45–47：`nextConcept` 从 `orderedPublishedConcepts` 取索引 +1，天然跳过 44 个 stub；L161–165 仅当 `nextConcept` 存在时渲染「下一个」。
- **推荐入口** `HomePage.tsx` L100–119：`getFirstPublishedConceptIdByModule()`（`progress.ts` L144–147）取模块内首个已上线讲；无已上线讲时渲染不可点击的「即将上线」卡（L103–110）。
- **搜索主路径降权** `search.ts` L41–42：stub `availabilityScore = -35`，原因后缀「· 即将上线」，被强制降权。

### ✅ 项 3：三种 lastVisitedConceptId 情形都回到已上线内容
推演 `getContinueLearningConceptId()`（`progress.ts` L154–168）：
- **新用户（undefined）**：跳过 L155–159 命中分支 → L161–166 找第一个未完成已上线讲 → 返回 `token`（首个已上线）。✅
- **老用户（lastVisited 为已上线，如 `kv-cache`）**：`publishedConceptIdSet.has('kv-cache')` 为真 → L158 直接返回 `kv-cache`。✅
- **误访问过 stub（lastVisited 为 stub，如 `session-affinity`）**：不在 `publishedConceptIdSet` → 跳过命中分支 → L161–166 回到第一个未完成已上线讲。✅
- 补强：`ConceptPage.tsx` L27–29 `recordVisit` 仅对已上线讲调用，故未来不会再把 stub 写入 `lastVisitedConceptId`；历史脏数据由上面分支兜底。

### ✅ 项 4：模块页/搜索页可见 44 stub，但弱化/置灰/标「即将上线」
- **通过。** 模块页 `ModulePage.tsx` L154–166：stub 渲染为 `placeholderCard`（不可点击 `<article>`，非 `<Link>`），含「即将上线」徽标（L162）与「正式内容正在审核入库」说明。
- 搜索页 `SearchPage.tsx` L36–46：stub 渲染为 `${styles.result} ${styles.unavailable}` 的不可点击 `<article>`，右侧「即将上线」，原因带「· 即将上线」后缀。

### ✅ 项 5：搜索结果主路径不得自然进入 stub 空内容页
- **通过。** `SearchPage.tsx` 仅已上线结果渲染为 `<Link to={/concepts/:slug}>`（L49–58）；stub 结果是 `<article>`（L37–46），**无任何导航**，点击不跳转。叠加 `search.ts` 降权（-35），stub 在结果列表排序靠后。无路径可从搜索自然进入 stub 空页。

### ✅ 项 6：详情页不出现 mvp/stub/contentStatus 等内部状态
- **通过。** `ConceptHeader.tsx` 全文（L27–53）只渲染：模块名、难度、估时、是否含动画、标题、完成/收藏按钮——**无 `contentStatus` / `mvp` / `stub` 标签**。`ConceptPage.tsx` 亦未在任何区块输出内部状态字段。

### ✅ 项 7：通用动画不出现 config.type / highlightTargets raw key
- **通过。** `GenericMechanismAnimation.tsx` 全文（L9–26）只渲染：时间轴圆点（`aria-label={item.title}`，非可见文本）+「步骤 n / N」。**不渲染 `config.type`，不把 `highlightTargets` 渲染为文本标签**；步骤标题/描述由 `AnimationPlayer` 的 caption（`AnimationPlayer.tsx` L113–116）统一承担，无重复说明。
- 走该组件的动画：`token-flow / attention-map / context-window / model-router / issue-fix-flow`（`registry.ts` L12–19）。

### ✅ 项 8：诊断题门禁可验证
- **通过。** 见 §2：单选覆盖 A/B/C/D；最高 27.3% ≤ 40%；强干扰项比例远超 30%；解析逐项说明其他选项为何不是第一步。`validate:content` 的诊断题结构校验亦通过。

### ✅ 项 9：动画本轮重点（prefill-decode / agent-loop 真实画布 + 其他 fallback）
- **registry 已接入**（`registry.ts` L15、L18）：`prefill-decode → PrefillDecodeAnimation`、`agent-loop → AgentLoopAnimation`。
- **key 映射为可视元素而非文本**：
  - `PrefillDecodeAnimation.tsx`：`on(targets, key)`（L5–7）把 key 驱动为元素的 active/long/done/grown 等状态；画布可见文字均为固定短标签（「系统提示」「检索片段」「Prefill」「KV Cache」「首 Token」「TTFT」「TPOT」等，L65–181）。`used` 并集（L27–32）判断分组相关性，未用分组渲染为 `dormant` 基态。**无 raw key、无 config.type 上屏。**
  - `AgentLoopAnimation.tsx`：同样 `on(targets, key)`（L5–7）驱动节点/出口/卡片/trace 状态；可见文字为「目标/约束/观察/计划/行动/校验/判断/继续/完成/人审」等固定标签（L40–189）；`human-review` 命中时继续弧线 `.weak` 弱化（L34、L116），人审分支强调。trace 轨道按累计 `seen`（L24–30）逐轮点亮。**无 raw key 上屏。**
- **reduced-motion 静态可读**：两画布均「按当前步渲染静态状态」，`reducedMotion` 时加 `.reduced`（`PrefillDecode` L54 / `AgentLoop` L37）关闭过渡；`AnimationPlayer.tsx` L34/L90 在 reduced-motion 下禁用自动播放、保留上一步/下一步手动逐步。
- **其他动画 fallback**：通用动画不泄漏 key（见项 7）；`AnimationPlayer` 对未注册 type 有 fallback 文案（L77–82）；`Skill` 无 animation 时 `ConceptPage.tsx` L99 显示「当前知识点暂无动画配置」。

### ✅ 项 10：收藏/完成/我的学习/LocalStorage 正常
- **通过。** `progress.ts`：固定 key `ai-learning-app-progress-v1`（L15）、带 `version` 写入（L83–93）、`loadProgress` 解析+形状校验+迁移+异常回退（L59–80）、派生计算 `overallProgress`/`moduleProgress`（L104–112、L171–182）。
- `progressStore.ts`：`toggleComplete`/`toggleFavorite`/`recordWrongQuestion`/`recordVisit`/`clearAll` 每次动作后 `persist()` 回写（L65–117），去重用 `toggleMember`（L61–63），连续天数跨日规则（L90–110）。结构与上一轮 E2E 基线一致，无回归。

### ✅ 项 11：design.md 风格符合度
- **通过。** `tokens.css` 为视觉唯一来源，与 design.md 红线一致：背景暖纸色 `--color-bg:#faf9f6`（L8）、主操作蓝 `--color-primary:#1f40d8`（L21）、进度绿 `--color-progress:#2e7d58`（L26）、告警橙克制使用 `#e8943a`（L30）；字体标题 serif / 正文 sans / 序号 mono（L33–37）；圆角 6–8px（L47–48）。
- `HomePage.tsx` 第一屏仅一个核心动作「继续学习」，推荐路径/模块下沉（L50–146），非 dashboard、安静克制。
- 未发现华为红主视觉、深色大面积主题或指标堆叠。动画深色机制画布面积克制，符合「轻量工程学习书桌」。

---

## 4. 是否引入回归（停止点检查）
- 未发现 schema / 内容 / 动画协议回归：`src/types/index.ts`、`AnimationConfig` 协议、`AnimationPlayer` 架构均未被本轮改动破坏（registry 仅替换两项映射，`validate:content` 的 animation 一致性通过）。
- `kv-cache` 单一正文来源已落实：`src/data/concepts.ts` L80 已是 `stub(...)` 登记（无内联长对象），正文仅由 `demoConcepts.ts` 的 mvp 版生效。
- 未触发任何停止点（主路径禁跳 stub 与保留 56 讲地图无冲突）。

---

## 5. 返修项

- **P0：无。**
- **P1：无。**
- **P2（非阻塞，且本轮不在范围内，仅记录，不返修）：**
  - `index.html` L12–15 仍保留 Google Fonts 外链（`fonts.googleapis.com`），受限网络下 console 会出现字体加载错误并 fallback 到本地字体。属 UFP-10（统一计划列为 P2），非本轮回归。复现：受限网络打开任意页面看 console。建议（后续）：字体本地化或移除外链，接受系统字体 fallback。

---

## 6. 验证方法说明（如实记录）
- **已实跑**：`npm run validate:content`、`npm run typecheck`、`npm run lint`、`npm run build`（PowerShell，逐条带 `$LASTEXITCODE` 校验，均为 0）。
- **未实跑**：dev server / 浏览器（本环境纯命令行，无可用浏览器自动化）。所有 UI 交互路径（首页继续学习、推荐入口、模块页、搜索页、详情页下一讲、动画逐步、诊断题、Profile/LocalStorage）均以**代码级路径推演**逐条覆盖，证据指向具体源码行号，见 §3。
- **独立数据复算**：12 题诊断题正确项与单选分布由本 Agent 直接读取 `demoConcepts.ts` 字段重算，未沿用他人结论。
