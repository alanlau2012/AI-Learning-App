# 专家级动画设计蓝图 · expert-animation-design-plan

> 这是动画**设计蓝图**（非代码）。它把每个重点动画从「机制目标」拆到「画面元素 / 每步状态 / 指标 / 失败路径 / reduced-motion 静态表达 / key 映射」，作为阶段 3 实现的唯一依据。
> 配套：审计见 [reports/animation-expert-audit.md](../reports/animation-expert-audit.md)；协议与契约见 [animation-spec.md](animation-spec.md)；视觉红线见 [design.md](../design.md)；数据 key 见 `src/data/demoConcepts.ts`。
> 红线（全部动画通用）：
> 1. 画布可见文字**只能是固定中文短标签**，禁止渲染 `config.type` / `highlightTargets` / raw key。
> 2. 步骤只存在于 `AnimationConfig.steps`；画布只读 `step.highlightTargets`，按 key 命中切元素状态。
> 3. 深色画布 `#1A1916` 面积克制，外层仍是浅色阅读页；不做 dashboard、不堆指标面板、不做霓虹/光效。
> 4. reduced-motion 下用**颜色/边框/位置编码**而非位移/循环，静止可逐步读懂。
> 5. 命中=蓝 `#8EA2FF` / `rgba(31,64,216,.28)`；正向/命中=绿 `#2E7D58`；告警/未命中/Decode=暖橙 `#E8943A`/`#F0C089`；基态=暖灰描边。

---

## 0. 视觉语汇约定（所有新画布共用，确保「同一套教材」气质）

| 语义 | 颜色 | 用途 |
|---|---|---|
| 当前命中 / 主链路 | 蓝 `#8EA2FF`，填充 `rgba(31,64,216,.28)` | 当前步高亮元素、主数据流 |
| 正向 / 命中 / 已验证 | 绿 `#2E7D58`，文字 `#DFF1E7`/`#CFE6DA` | 缓存命中、测试通过、证据充分 |
| 告警 / 未命中 / 失败 / Decode | 暖橙 `#E8943A`/`#F0C089`，文字 `#FFE1BD` | 未命中、重算、污染、回流失败、首字后 |
| 基态 / 未激活 | 描边 `rgba(250,249,246,.14~.2)`，文字 `#B4B0A6`/`#6F6B62` | 尚未发生的元素 |
| 标签字体 | `var(--font-mono)` 小字 | 固定中文短标签与指标刻度 |

通用机制（沿用 `PrefillDecodeAnimation` 已验证手法）：

- **区域相关性 dormant**：一个画布服务多讲时，扫描整份 `config.steps` 用到的 key 集合，对当前讲不涉及的区域加 `dormant`（降透明 + 去饱和），保证「同一类型、不同讲聚焦不同区域」。
- **指标随 key 变形**：TTFT/成本/窗口占用等用「长度/间距/填充比」表达增减，不打印数字仪表。
- **失败路径同屏**：理想路径与失败路径在同一画布并置（命中 vs 未命中、干净 vs 污染、验证通过 vs 回流），靠样式区分而非另起一屏。

---

## 1. token-flow —（讲：token）【新建 TokenFlowAnimation】

1. **动画目标**：让用户看懂「文本不是直接进模型，而是先被切成 Token、编号、向量化，且 Token 数量直接换算成 Prefill/上下文/成本/时延」。
2. **用户看完应理解**：Token ≠ 字数；同一文本不同 tokenizer 颗粒度不同；输入 Token 压 Prefill/TTFT，输出 Token 压 Decode/计费。
3. **核心机制链路**：原始文本 → 分词（颗粒度不均）→ 整数编号 → 向量序列 → 进入 Prefill（输入越长越重）→ 逐 Token Decode 输出（越长越贵）。
4. **画面结构**（横向流水，左→右）：① 文本气泡（一句中文）；② 分词器闸口；③ Token 格子条（宽窄不一，体现颗粒度差异）；④ 编号行 `#312 #88 …`（mono，固定示意编号，非 key）；⑤ 向量列（小竖条矩阵）；⑥ 右侧「Prefill 占用条」+「TTFT 刻度」；⑦ 底部「输出 Token 逐个亮起」+「成本计数条」。
5. **每步状态变化**（key → 元素）：
   - `input-text` → 文本气泡点亮，其余 dormant。
   - `tokenizer`,`tokens` → 闸口激活，Token 格子条逐格出现（宽窄不一）。
   - `token-ids`,`embeddings` → 编号行 + 向量列点亮，文本气泡转灰（强调「之后面对的是编号/向量」）。
   - `prefill`,`ttft` → Prefill 占用条按 Token 数加长，TTFT 刻度同步变长（蓝）。
   - `decode`,`output-tokens`,`cost` → 输出格子逐个亮（暖橙），成本条加长。
6. **输入/输出/中间态**：输入=自然语言；中间=Token/编号/向量；输出=逐个生成的输出 Token + 成本/时延刻度。
7. **指标表达**：Prefill 占用条长度 ∝ 输入 Token；TTFT 刻度长度；成本条长度 ∝ 输出 Token。无数字仪表。
8. **失败/对比路径**：用「Token 格子宽窄不均」隐喻不同 tokenizer/语言颗粒度差异（避免「Token=字」误解）；可在 reduced-motion 下保留宽窄差。
9. **reduced-motion 静态**：所有格子/编号/向量直接呈现，当前步元素加蓝色描边 + 其余降透明；输出格子按当前步数量静态填充。
10. **复用范围**：token-flow 类型；`autoregressive` 若未来上线可复用（逐 Token 生成段）。
11. **不应出现的误导**：不要把每个字对应一个 Token；不要让向量看起来像「理解」；不要把成本画成与请求次数相关而非 Token。

---

## 2. attention-map —（讲：attention）【新建 AttentionAnimation】

1. **动画目标**：让用户看懂注意力是「当前位置对历史 Token 的加权选择」，且上下文污染会扭曲权重。
2. **用户看完应理解**：Q/K/V 角色；当前位置只看历史（因果方向）；权重是计算结果不是「理解」；噪声/过期片段会抢占权重；检索筛选/重排能把权重还给高相关证据。
3. **核心机制链路**：上下文 Token 序列 → 选定当前位置（Query）→ 对历史每个位置算权重（K·Q）→ 加权聚合（V）→ 注入冲突/过期片段→权重被带偏 → 重排/清洗→权重回到高相关证据。
4. **画面结构**：上方一行 Token 方块（含 1 个标「冲突」的暖橙块、1 个标「证据」的块）；选定「当前 Token」（最右，蓝描边）；从当前 Token 向左侧历史 Token 发射连线，**线宽/透明度=权重**；右侧一条「权重条形」表示分布。因果方向：连线只指向左（历史），当前 Token 右侧无连线（示意不看未来）。
5. **每步状态变化**：
   - `tokens`,`context` → 顶部 Token 行点亮，冲突块与证据块标注出现。
   - `current-token` → 最右 Token 蓝描边，作为 Query。
   - `attention-links`,`attention-map` → 当前 Token 向历史发射粗细不一连线；权重条形按相关度分布（证据块权重高）。
   - `pollution`,`shifted-weights` → 冲突块连线变粗（暖橙），权重条形被带偏，证据块权重下降。
   - `rerank`,`clean-context` → 冲突块降权/移出（变灰），证据块连线恢复粗（绿/蓝），权重条形回到集中。
6. **输入/输出/中间态**：输入=上下文 Token；中间=Q 对各 K 的权重；输出=加权后的注意力分布（条形）。
7. **指标表达**：连线粗细 + 权重条形高度=注意力权重；无热力图数字。
8. **失败路径**：第 4 步即失败态（污染→权重失真→答案依据被带偏）；第 5 步是治理对照。
9. **reduced-motion 静态**：连线用静态不同粗细/颜色直接画出；步切换只改哪几条线为「污染态/清洗态」，不做流动。
10. **复用范围**：attention-map 类型；可被 `context-pollution`（未来）借用污染段。
11. **不应出现的误导**：不要画成「模型理解了重点」；不要让当前 Token 看向未来（违反因果 mask）；不要把热力图当成唯一表达。

---

## 3. prefill-decode —（讲：prefill / decode / ttft）【保留 PrefillDecodeAnimation，A 级样板】

1. **动画目标**：让用户一眼分清「首字前（Prefill 一次性处理输入）」与「首字后（Decode 逐 Token 生成）」是两个性能特征不同的阶段。
2. **用户看完应理解**：TTFT 受 Prefill/排队/路由/缓存命中影响；TPOT 受 Decode 影响；输入越长 Prefill 越重、TTFT 越高；输出越长 Decode 越久。
3. **核心机制链路**：输入（系统提示/检索/历史）→ 前置处理（网关/排队/路由/检索/工具）→ Prefill → KV 写入 →【首 Token 分隔】→ Decode 自回归循环 → 输出序列。
4. **画面结构**（现状，保留）：上方「首字前/首字后」标签；左半 preSide（输入区+Token 条+前置处理带+Prefill+KV）；中部首 Token 分隔条+回传；右半 postSide（Decode 循环+输出序列）；底部 TTFT/TPOT 双标尺；可选延迟归因分段条。
5. **每步状态变化**：由各讲 highlightTargets 聚焦（prefill 讲聚焦左半；decode 讲聚焦右半 + TPOT；ttft 讲聚焦 TTFT 标尺 + `ttft-growth` 的 ghost 对比 + `latency-breakdown`）。
6. **指标表达**：TTFT 横条长度（含 `grown` 增长态 + ghost 原长对比）；TPOT 相邻输出间距（`wide`）；归因分段条比例。
7. **失败/对比路径**：`long-context`→TTFT 增长；`total-latency`→postSide 延展；归因条显示瓶颈段（Prefill 偏长）。
8. **reduced-motion 静态**：现已支持（`.reduced` 关闭过渡），按步切换静态状态。
9. **复用范围**：prefill/decode/ttft/tpot 四讲；是「时间轴 + 指标标尺」类样板。
10. **本轮处理**：不改逻辑；仅作为样板登记。P2 可优化移动端最小宽度。
11. **不应出现的误导**：不要把 Prefill 画成逐 Token（它是一次性并行）；不要把 TTFT 画成只由模型大小决定。

---

## 4. kv-cache —（讲：kv-cache）【重构 KVCacheAnimation，C+ → A】

1. **动画目标**：让用户看懂 KV Cache 缓存的是「已读上下文的 K/V 笔记」，命中可跳过重复 Prefill（TTFT 低），未命中需重算（TTFT 高）。
2. **用户看完应理解**：命中 vs 未命中两条路径的代价差异；命中靠 Session 亲和/路由一致/前缀稳定；显存容量有限，长会话会挤占并触发淘汰；省的是「重复上下文计算」，不是「免费生成」。
3. **核心机制链路**：同会话多轮请求 → Prefill 把 K/V 写入缓存 →【路由一致】Decode 命中缓存（复用，TTFT 低）/【路由打散】未命中（缓存空，重新 Prefill，TTFT 高）→ 显存被多会话挤占 → 淘汰/隔离。
4. **画面结构**（重构）：左「Session A · 多轮」+ 实例标识；中「Prefill → KV Cache slots（格子可空/写满）」；右**上下两条对照路径**：上=命中（绿，复用箭头跳过 Prefill，TTFT 短条）；下=未命中（暖橙，路由打散到空缓存实例，重新 Prefill，TTFT 长条）；底部「显存容量条」随长会话占用上升 + 「淘汰」标记。
5. **每步状态变化**（对齐**真实数据 key**）：
   - `session`,`instance` → Session 卡 + 实例标识点亮。
   - `prefill`,`kv-write` → Prefill 激活，KV slots 由空→写满（蓝/绿）。
   - `decode`,`cache-hit` → 命中路径点亮（绿），复用箭头跳过 Prefill，命中 TTFT 短条。
   - `route-miss`,`cache-miss` → 未命中路径点亮（暖橙），打散到空缓存实例，未命中 TTFT 长条（与命中并置对比）。
   - `memory`,`eviction` → 显存容量条升高，淘汰标记出现。
6. **输入/输出/中间态**：输入=多轮请求；中间=KV slots 状态 + 路由去向；输出=两条路径 TTFT 对比 + 显存占用。
7. **指标表达**：命中/未命中 TTFT 两条横条长度对比；显存容量条填充比；KV slots 写满数。
8. **失败路径**：未命中分支即失败态（路由打散→缓存空→重算→TTFT 飙升）；显存挤占→淘汰是次生失败。
9. **reduced-motion 静态**：命中/未命中两路径同屏静态画出（绿 vs 暖橙），slots 按当前步静态填充，TTFT 长短条静态对比。
10. **复用范围**：kv-cache 类型；`session-affinity`（未来）可复用命中/打散对照。
11. **不应出现的误导**：不要把 KV Cache 画成「缓存答案」（它缓存上下文 K/V，不是结果）；不要暗示「加卡必降 TTFT」。

---

## 5. model-router（网关侧） —（讲：model-gateway）【新建 ModelRoutingAnimation·网关区】

1. **动画目标**：让用户看懂模型网关是「治理入口」而非「薄转发器」：统一鉴权/限流/计量/审计/路由/降级。
2. **用户看完应理解**：多应用汇聚到统一入口；网关做鉴权配额、选模型、记 Token/Trace、异常熔断降级；价值是「可执行策略+可审计证据+可回放链路」，不是代理 URL。
3. **核心机制链路**：多业务应用 → 统一网关入口 → 鉴权/配额/策略（拦截不合规）→ 路由到模型/服务池 → 计量+Trace 记录 → 下游异常时限流/熔断/备用路由。
4. **画面结构**：左「多个应用」竖排 chip → 汇聚箭头 → 中央「网关」主块（内部含「鉴权·配额·策略」检查行）→ 右「模型/服务池」候选 → 网关下方「计量·Trace」记录带 → 异常态「熔断/降级到备用」分支（暖橙）。
5. **每步状态变化**（对齐 model-gateway 数据 key）：
   - `apps`,`gateway` → 应用 chip + 网关入口点亮，汇聚箭头出现。
   - `auth`,`quota`,`policy` → 网关内检查行点亮；1 个不合规请求被拦截（变灰/红）。
   - `router`,`models` → 路由到候选模型，选中目标点亮。
   - `metering`,`trace` → 记录带点亮（Token/耗时/版本/trace id 示意格）。
   - `fallback`,`circuit-break` → 主模型异常（暖橙），熔断 + 备用路由分支点亮。
6. **指标表达**：记录带格子=计量/审计证据；拦截 chip 数=策略生效；熔断分支=稳定性兜底。
7. **失败路径**：不合规请求被拦截；下游异常→熔断降级（第 5 步）。
8. **reduced-motion 静态**：管线各段静态呈现，按步切换点亮区，拦截/熔断用红/橙静态标记。
9. **复用范围**：model-router 类型「网关治理区」；与路由区（§6）同画布、靠 dormant 切换。
10. **不应出现的误导**：不要把网关画成单箭头转发；不要省略计量/审计（那是网关核心价值）。

---

## 6. model-router（多模型路由侧） —（讲：multi-model-routing）【同 ModelRoutingAnimation·路由区】

1. **动画目标**：让用户看懂路由是按「质量门槛 + 成本/时延/风险」做整体 ROI 选择，而非永远选最强模型。
2. **用户看完应理解**：请求带任务约束（类型/敏感级/时延预算/质量要求）；候选模型要有能力/成本/时延画像；先过质量门槛再挑性价比；失败可升级/补位；线上数据回流评测修正策略。
3. **核心机制链路**：带约束的请求 → 读模型画像 → 过滤不达标→选性价比目标 → 失败/超预算→升级到更强模型或备用 → 质量/成本/时延数据回流策略。
4. **画面结构**：左「请求约束」标签组（任务类型/敏感/时延/质量）→ 中「路由器」→ 右「候选模型画像卡」三张（小模型/中模型/旗舰，各带能力/成本/时延小条）→ 选中态高亮 → 下方「失败→升级」分支（暖橙箭头指向更强模型）→ 底部「评测/观测回流」弧线回到路由器。
5. **每步状态变化**（对齐 multi-model-routing 数据 key）：
   - `request-labels` → 约束标签组点亮。
   - `model-profiles` → 三张画像卡点亮（能力/成本/时延条）。
   - `router`,`selected-model` → 路由器激活，先灰掉不达标卡，选中性价比卡（蓝）。
   - `fallback`,`sla` → 选中卡错误率/延迟超标（暖橙），升级到更强卡 / 备用补位。
   - `eval`,`observability`,`policy` → 回流弧线点亮，数据回到路由策略。
6. **指标表达**：画像卡的能力/成本/时延小条；选中 vs 升级对比；回流弧线=策略闭环。
7. **失败路径**：第 4 步升级/补位即失败兜底；强调「不是越强越好，是失败重试成本也要算」。
8. **reduced-motion 静态**：画像卡静态并置，按步切换「选中/被过滤/升级」状态着色。
9. **复用范围**：model-router 类型「路由区」；与网关区（§5）同画布，dormant 切换；`cost-routing`/`capability-routing`（未来）可复用。
10. **不应出现的误导**：不要画成随机/固定比例分流；不要暗示永远选最大模型；不要省略「质量门槛先于成本」。

> §5/§6 同属 `ModelRoutingAnimation` 一个组件：扫描 config 的 key 集合，若命中网关 key 集（apps/gateway/auth/quota/metering/circuit-break…）则点亮治理区、路由区 dormant；若命中路由 key 集（request-labels/model-profiles/selected-model/sla/eval…）则点亮路由区、治理区 dormant。共享「请求→router→模型」骨架。

---

## 7. context-window —（讲：context-window）【新建 ContextWindowAnimation】

1. **动画目标**：让用户看懂上下文窗口是「有限工作台」：塞满会挤出关键信息，筛选/压缩能腾出空间给当前证据。
2. **用户看完应理解**：系统提示/用户问题/历史/工具结果/文档片段都占窗口；无关信息过多挤压关键约束；截断/摘要/检索/压缩影响质量；Agent 失败常是上下文组织失控，不是模型不会。
3. **核心机制链路**：候选资料池 → 窗口容量有限（只用窗口内）→【塞满】关键约束被挤出（失真）/【筛选排序+压缩】关键证据进窗口 → 窗口越长成本/TTFT 越高、越干净答案依据越集中。
4. **画面结构**：左「候选池」（目标/历史/RAG 片段/工具结果/不可破坏约束，多块）→ 中「窗口」竖向容量框（有刻度上限）→ 右「成本/TTFT/质量」三条指标。窗口框内呈现两态对比：塞满态（约束块被挤到框外/变灰）vs 筛选态（约束块置顶高亮、长历史被压成摘要小块）。
5. **每步状态变化**（对齐 context-window 数据 key）：
   - `candidate-context` → 候选池各块点亮（尚未入窗）。
   - `window-limit` → 窗口容量框 + 上限刻度点亮；强调窗外不参与推理（框外块变灰）。
   - `selection`,`ranking` → 高相关/最新/权威块进窗置顶，低相关块降权移出。
   - `compression`,`summary` → 长历史块压成摘要小块，腾出窗口空间（绿）。
   - `cost`,`ttft`,`quality` → 三条指标：窗口长→成本/TTFT 升（暖橙），窗口净→质量升（绿）。
6. **指标表达**：窗口填充比 vs 上限；成本/TTFT/质量三条对比条。
7. **失败路径**：第 2/3 步的「塞满→约束被挤出」即失败态（呼应企业案例：代码 Agent 忘记不可改公共接口约束）。
8. **reduced-motion 静态**：塞满态与筛选态可在步切换间静态对照；约束块用「在窗内/窗外」位置 + 颜色编码。
9. **复用范围**：context-window 类型；`context-compression`/`context-pollution`（未来）可复用窗口框。
10. **不应出现的误导**：不要把大窗口画成「长期记忆」；不要暗示「塞越多越好」；不要只按时间截断而丢早期关键约束。

---

## 8. agent-loop —（讲：agent-loop）【保留 AgentLoopAnimation，A 级样板】

1. **动画目标**：让用户看懂 Agent 是 Observe→Plan→Act→Check 的闭环 + 判断出口（继续/完成/人审），Check 是防错误放大的关键。
2. **用户看完应理解**：工具调用有权限边界；结果回流驱动下一轮；Check 拦住错误动作；缺 Check 的 Agent 会让错误持续放大；连续失败应转人审而非死循环。
3. **核心机制链路**：目标+约束 → Observe（读上下文/证据）→ Plan（下一步动作+验证标准）→ Act（调工具，受权限边界约束）→ 工具结果回流 → Check（测试/日志校验）→ 判断：继续/完成/人审。
4. **画面结构**（现状保留）：顶部目标/约束 chip；中央环形 Observe/Plan/Act/Check 四节点；右侧工具区（🔒 权限边界）；Act→工具→结果回流线；左侧判断节点三出口（继续弧线回 Observe、完成、人审）；证据/计划/校验卡片；底部 trace 轨道按轮累加。
5. **每步状态变化**：由 highlightTargets 点亮对应节点/卡片/出口；连续失败时「继续」弧线 `weak` 弱化、强制人审。
6. **指标表达**：trace 轨道累加=可观测轨迹；三出口区分终止条件。
7. **失败路径**：`human-review` 出口 + 继续弧线弱化即「错误被 Check 拦住、转人审」。
8. **reduced-motion 静态**：现已支持。
9. **复用范围**：agent-loop/tool-calling；是「环路+出口+trace」类样板。
10. **不应出现的误导**：不要画成单纯循环箭头；不要省略 Check 与权限边界。

---

## 9. skill-lifecycle —（讲：skill）【新建 SkillLifecycleAnimation + 为 skill 讲补 animation 配置】

1. **动画目标**：让用户看懂 Skill 是「把一次成功经验沉淀成可复用、可治理的能力单元」，而非更长的 Prompt；并看懂其生命周期闭环。
2. **用户看完应理解**：Skill = 触发条件+指令+资源+脚本+约束（SOP+工具包），不是泛泛提示词；Agent 按任务发现并加载；执行产出+自检；结果经评测/人工/trace 回流；沉淀为带版本的资产；需所有权/权限/弃用/质量治理。
3. **核心机制链路**：高频任务 → 匹配触发并发现 Skill → 加载（指令/资源/脚本/约束进上下文）→ 执行（调工具/收证据/产出/自检）→ 结果反馈回流（评测/人工/trace）→ 沉淀为版本化资产 → 治理（Owner/权限/弃用）。
4. **画面结构**：左「任务进入」chip + 一条**灰色「普通 Prompt」对照线**（强调对比）；中央「Skill 卡」（含 触发/指令/资源/脚本/约束 多行结构，区别于单行 Prompt）；右「执行区」（工具 + 自检 ✓）；执行下方「结果」；一条回流弧线从结果回到底部「Skill 库/资产架」（带 `v1.2` 版本标，mono 固定示意）；底部「治理带」（Owner/权限/弃用）。
5. **每步状态变化**（**新数据 key**，见 §11 数据补丁）：
   - `task`,`discover` → 任务 chip 点亮，匹配到 Skill 卡（与灰色普通 Prompt 线形成对比）。
   - `skill-def`,`resources` → Skill 卡内「触发/指令/资源/脚本/约束」多行逐行点亮（结构化 ≠ 单行 Prompt）。
   - `execute`,`tools`,`self-check` → 执行区点亮，调工具、产出、自检 ✓。
   - `result`,`feedback`,`trace` → 结果块 + 回流弧线点亮（评测/人工/trace 证据）。
   - `deposit`,`version` → Skill 库资产架点亮，版本号递增（沉淀）。
   - `governance`,`permission` → 治理带点亮（Owner/权限边界/弃用策略）。
6. **指标表达**：版本号递增=可演进；资产架累加=可复用沉淀；自检 ✓ + 回流=质量闭环。
7. **失败路径**：用「普通 Prompt 对照线」表达反例（无结构/无资源/无版本→不可复用、不可治理）；治理带强调高权限操作需审批边界。
8. **reduced-motion 静态**：Skill 卡多行结构静态呈现，按步切换点亮区；版本号按步静态显示。
9. **复用范围**：skill-lifecycle 类型；`subagent`/`memory`（未来）可借用「能力单元+治理」骨架。
10. **不应出现的误导**：不要把 Skill 画成「更长的 Prompt」；不要省略版本/权限/弃用治理；不要把它画成通用插件。
11. **数据补丁（必须，见 §11）**：`skill` 讲 `hasAnimation:true` + 6 步 animation（type=`skill-lifecycle`），步骤标题/描述与正文机制对齐。

---

## 10. issue-fix-flow —（讲：issue-fix-agent）【新建 IssueFixFlowAnimation】

1. **动画目标**：让用户看懂「问题单质量 → 修复路径 → 验证闭环」的因果：差问题单导致误修，验证失败要回流而非盲目扩散，人审负责合入。
2. **用户看完应理解**：Issue 常不完整需结构化提取；定位缩小范围；最小化修改不顺手重构；验证失败回到定位/修改；PR+人审；评审/失败回流到模板/Skill/评测集。
3. **核心机制链路**：问题单（现象/复现/期望/约束）→ 定位（搜代码/测试/历史）→ 最小化补丁（限定 scope）→ 验证（测试/类型检查）→【失败回流到定位/修改】/【通过】→ 提交 PR + 人审 → 质量回流（模板/Skill/评测集）。
4. **画面结构**（横向流水 + 回流环）：① 问题单卡（含「复现/期望/约束」字段，缺字段时标灰示意差问题单）；② 定位区（repo + 搜索）；③ 补丁区（限定 scope 边框，避免扩散）；④ 验证区（测试/类型检查，通过=绿/失败=橙）；⑤ PR + 人审 chip；⑥ 回流弧线回到模板/Skill/评测集。关键：验证区有一条**失败回流箭头**指回定位/补丁（暖橙），而非继续向前。
5. **每步状态变化**（对齐 issue-fix-flow 数据 key）：
   - `issue`,`requirements` → 问题单卡点亮，字段结构化提取。
   - `repo-context`,`search` → 定位区点亮，缩小范围。
   - `patch`,`scope` → 补丁区点亮，scope 边框约束（限定影响面）。
   - `tests`,`validation` → 验证区点亮；失败回流箭头出现（指回定位/补丁，暖橙）。
   - `pr`,`human-review` → PR + 人审 chip 点亮（人类 Owner 合入判断）。
   - `feedback`,`eval`,`skill` → 回流弧线点亮，回到模板/Skill/评测集（绿）。
6. **指标表达**：scope 边框=修改边界；失败回流箭头=验证闭环；回流弧线=质量沉淀。
7. **失败路径**：第 4 步验证失败回流即核心失败态；问题单缺字段（标灰）表达「差 Issue→误修」。
8. **reduced-motion 静态**：流水节点静态呈现，失败回流箭头静态画出（橙），按步切换点亮区。
9. **复用范围**：issue-fix-flow 类型；`code-review-agent`/`ops-diagnosis-agent`（未来）可借用「输入→处理→验证→回流」骨架。
10. **不应出现的误导**：不要把它画成「自动改代码按钮」；不要省略验证失败回流（最关键工程判断）；不要让补丁无边界扩散。

---

## 11. 数据补丁清单（仅 skill 一讲，需主开发口径确认）

> 除 skill 外，全部新画布**只读现有 highlightTargets，零数据改动**。skill 讲当前 `hasAnimation:false`、无 animation，属审计中「Empty」P0，且 `skill-lifecycle` 为任务点名的重点动画——为其补动画属「谨慎修改 src/data」（理由：根本无 highlightTargets 可支撑机制表达）。

`src/data/demoConcepts.ts` 中 `skill` 概念：

- `hasAnimation: false → true`
- 新增 `animation`：

```jsonc
{
  "type": "skill-lifecycle",
  "title": "从一次经验到可复用的 Skill",
  "steps": [
    { "id": "s1", "title": "识别高频任务并匹配", "description": "...", "highlightTargets": ["task", "discover"] },
    { "id": "s2", "title": "加载 Skill 的指令与资源", "description": "...", "highlightTargets": ["skill-def", "resources"] },
    { "id": "s3", "title": "执行与自检", "description": "...", "highlightTargets": ["execute", "tools", "self-check"] },
    { "id": "s4", "title": "结果反馈回流", "description": "...", "highlightTargets": ["result", "feedback", "trace"] },
    { "id": "s5", "title": "沉淀为版本化资产", "description": "...", "highlightTargets": ["deposit", "version"] },
    { "id": "s6", "title": "所有权与权限治理", "description": "...", "highlightTargets": ["governance", "permission"] }
  ]
}
```

同步：`content/drafts/skill.json` 补 `animationBrief`（写作别名，draft 用）；`scripts/validate-content.ts` 的 `REGISTERED_ANIMATION_TYPES` 与 `registry.ts` 同步加入 `skill-lifecycle`（校验集镜像 registry，非 schema 变更）。

---

## 12. 注册与校验同步（实现阶段执行）

`src/components/animation/registry.ts`：

```ts
'token-flow': TokenFlowAnimation,
'attention-map': AttentionAnimation,
'context-window': ContextWindowAnimation,
'prefill-decode': PrefillDecodeAnimation,   // 保留
'kv-cache': KVCacheAnimation,               // 重构
'model-router': ModelRoutingAnimation,
'agent-loop': AgentLoopAnimation,           // 保留
'issue-fix-flow': IssueFixFlowAnimation,
'skill-lifecycle': SkillLifecycleAnimation, // 新增
```

`GenericMechanismAnimation` 不再被任一上线讲引用；保留文件作为未注册类型的降级参考（AnimationPlayer 已有纯文本 fallback）。

校验集同步后，`validate:animation` 仍要求：`hasAnimation === (animation!=null)`、`type` 已注册、step 有唯一 id、title/description 非空——全部满足。

---

## 13. 实现顺序（与任务优先级一致）

1. P0：TokenFlow / Attention / ModelRouting / ContextWindow / IssueFixFlow（5 个新画布，复用现有 key，零数据改动）。
2. P0：SkillLifecycle（新画布 + 注册 + skill 数据补丁 + 校验集同步）。
3. P1：KVCache 重构（对齐 key + 双路径）。
4. P2：prefill-decode / agent-loop 保留（必要时移动端微调）。
5. 全量 `validate:content` / `typecheck` / `lint` / `build`，人工走查动画区块 + reduced-motion。
