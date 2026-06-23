# MVP 0.2 · 14 讲扩展范围冻结报告 · 14-lessons-scope

> 角色：MVP 0.2 14 讲扩展范围冻结 Agent（Claude Opus 4.8）
> 基线：`main` @ `561b6ad`（动画专项审核/校验/修正已合入，含 P2-1 窄屏收敛修复），工作树仅含未跟踪截图/报告。
> 性质：**范围冻结**。本报告只确定接下来 14 讲的扩展范围与 Wave 拆分，**不生成正文、不合入数据、不改代码、不提交 git**。
> 配套（权威依据）：[expansion-plan-44-lessons.md](../docs/expansion-plan-44-lessons.md)、[mvp-0.1-frozen-sample-standard.md](../docs/mvp-0.1-frozen-sample-standard.md)、[content-production-gate.md](../docs/content-production-gate.md)、[content-schema.md](../docs/content-schema.md) §4、[animation-spec.md](../docs/animation-spec.md)、[expert-animation-design-plan.md](../docs/expert-animation-design-plan.md)、[animation-expert-verification.md](animation-expert-verification.md)、[animation-browser-visual-verification.md](animation-browser-visual-verification.md)。

---

## 0. 一句话结论

**本轮 14 讲 = M1「模型怎么工作」完整收尾（8 讲）+ M2「模型怎么跑得又快又稳」完整收尾（6 讲）**，落地后 **M1、M2 两个模块 100% 上线**。全程 **零新 schema、零新动画协议、零新动画组件、零目录改动**，仅复用 3 个已验证的专家画布（token-flow / prefill-decode / kv-cache），其余 11 讲纯文本。是 44 讲扩展中**风险最低、复用度最高、最适合验证内容生产门禁**的切口。

---

## 1. 当前已上线讲数

**12 讲**（实测 `src/data/demoConcepts.ts`，全部 `contentStatus: "mvp"`）：

`token` / `attention` / `prefill` / `decode` / `ttft` / `kv-cache` / `model-gateway` / `multi-model-routing` / `context-window` / `agent-loop` / `skill` / `issue-fix-agent`。

> 校验方式：`grep` 统计 `demoConcepts.ts` 共 12 条顶层概念，`contentStatus` 全为 `mvp`；`concepts.ts` 以 `demoById` 覆盖 stub。与 [project-board.md](../docs/project-board.md) §1 封板基线一致。

## 2. 当前 stub 讲数

**44 讲**（56 − 12）。按模块拆分（已上线 / stub）：

| 模块 | 总讲 | 已上线 | stub | stub 清单 |
|---|---|---|---|---|
| M1 模型怎么工作 | 10 | 2 | **8** | semantic-space, transformer, positional-encoding, autoregressive, sampling, instruction-tuning, hallucination, reasoning-limit |
| M2 模型怎么跑得又快又稳 | 10 | 4 | **6** | tpot, session-affinity, batch-scheduling, pd-separation, speculative-decoding, quantization |
| M3 模型怎么变成企业平台 | 8 | 2 | 6 | maas, cost-routing, capability-routing, cache-system, rate-limit-circuit-break, sla |
| M4 模型怎么变成 Agent | 16 | 3 | 13 | prompt-context, system-prompt, context-compression, context-pollution, layered-session, agents-md, repo-context, spec-driven-development, tool-calling, subagent, memory, human-in-the-loop, multi-agent |
| M5 Agent 怎么改变软件工程 | 6 | 1 | 5 | code-review-agent, requirement-decomposition-agent, test-generation-agent, ops-diagnosis-agent, value-review-agent |
| M6 企业怎么治理 AI | 6 | 0 | 6 | eval, trace, observability, token-roi, permission-governance, ai-native-org |
| 合计 | 56 | 12 | **44** | — |

> **本轮 14 讲 = 上表 M1 的 8 个 stub + M2 的 6 个 stub。** 落地后 M1、M2 两模块清零 stub。

---

## 3. 本轮 14 讲候选清单（综合矩阵）

> 「内容难度」= 写作生产难度（去百科味/去模板化/工程信号密度），非 schema 的 `difficulty`（受众层级）。「动画难度」仅对有动画的讲评估。所有 14 讲 id/slug/moduleId/order 均已在 `concepts.ts` 登记，本轮只填正文、翻 `contentStatus`，**不新增 id、不改 order**。

| # | id | 标题 | 模块 | schema 难度 | 推荐 animation type | 内容难度 | 动画难度 | 复用现有专家动画 | 需新增动画协议 |
|---|---|---|---|---|---|---|---|---|---|
| 1 | semantic-space | 词向量与语义空间 | M1 | basic | 无（纯文本） | 中 | — | 否（无动画） | 否 |
| 2 | transformer | Transformer | M1 | basic | 无（纯文本） | 高 | — | 否（无动画） | 否 |
| 3 | positional-encoding | 位置编码 | M1 | basic | 无（纯文本） | 中 | — | 否（无动画） | 否 |
| 4 | autoregressive | 自回归生成 | M1 | basic | **token-flow** | 低 | 低 | **是 · TokenFlowAnimation** | 否 |
| 5 | sampling | 采样策略 | M1 | basic | 无（纯文本） | 中 | — | 否（无动画） | 否 |
| 6 | instruction-tuning | 指令微调与偏好优化 | M1 | intermediate | 无（纯文本） | 中 | — | 否（无动画） | 否 |
| 7 | hallucination | 幻觉 | M1 | intermediate | 无（纯文本） | 中 | — | 否（无动画） | 否 |
| 8 | reasoning-limit | 推理能力边界 | M1 | intermediate | 无（纯文本） | 高 | — | 否（无动画） | 否 |
| 9 | tpot | TPOT | M2 | intermediate | **prefill-decode** | 低 | 低 | **是 · PrefillDecodeAnimation** | 否 |
| 10 | session-affinity | Session 亲和 | M2 | advanced | **kv-cache** | 中 | 低 | **是 · KVCacheAnimation** | 否 |
| 11 | batch-scheduling | Batch 调度 | M2 | advanced | 无（本轮纯文本） | 高 | — | 否（见 §7 说明） | 否 |
| 12 | pd-separation | P-D 分离 | M2 | advanced | 无（本轮纯文本） | 高 | — | 否（见 §7 说明） | 否 |
| 13 | speculative-decoding | 投机解码 | M2 | advanced | 无（纯文本） | 高 | — | 否（无动画） | 否 |
| 14 | quantization | 量化 | M2 | intermediate | 无（纯文本） | 中 | — | 否（无动画） | 否 |

**统计**：复用专家动画 **3 讲**（token-flow / prefill-decode / kv-cache，均已注册并经浏览器走查）；纯文本 **11 讲**；新增动画协议/组件 **0**；内容难度 低 2 / 中 7 / 高 5；动画难度 全部 低（纯复用）。

> 各 animation type 对应关系来自 [content-schema.md](../docs/content-schema.md) §4 登记表 `anim` 列与 [animation-spec.md](../docs/animation-spec.md) §2 组件覆盖表，三者均与现注册表 `src/components/animation/registry.ts`（9 类型）一致。

---

## 4. Wave 1 的 7 讲清单（M1 主体 · 门禁验证波）

| # | id | 标题 | 模块 | animation | 内容难度 | 复用专家动画 |
|---|---|---|---|---|---|---|
| 1 | semantic-space | 词向量与语义空间 | M1 | 无 | 中 | 否 |
| 2 | transformer | Transformer | M1 | 无 | 高 | 否 |
| 3 | positional-encoding | 位置编码 | M1 | 无 | 中 | 否 |
| 4 | autoregressive | 自回归生成 | M1 | token-flow | 低 | **是** |
| 5 | sampling | 采样策略 | M1 | 无 | 中 | 否 |
| 6 | instruction-tuning | 指令微调与偏好优化 | M1 | 无 | 中 | 否 |
| 7 | hallucination | 幻觉 | M1 | 无 | 中 | 否 |

**定位**：以最低风险材料（M1 入门路径，6 纯文本 + 1 个最低风险动画复用）**端到端跑通内容生产门禁**——结构去模板化、企业案例信号、诊断题配平、schema 映射、四命令全绿。autoregressive 复用 token-flow（与已上线 `token` 同画布，仅换 highlightTargets 聚焦逐 Token 生成段），是全部 14 讲中最安全的动画复用，用于在 Wave 1 顺带验证「同画布跨讲复用」这条链路。
**落地后**：M1 上线 2 → 9（仅剩 reasoning-limit）。

## 5. Wave 2 的 7 讲清单（M1 收口 + M2 完整收尾 · 性能主干波）

| # | id | 标题 | 模块 | animation | 内容难度 | 复用专家动画 |
|---|---|---|---|---|---|---|
| 1 | reasoning-limit | 推理能力边界 | M1 | 无 | 高 | 否 |
| 2 | tpot | TPOT | M2 | prefill-decode | 低 | **是** |
| 3 | session-affinity | Session 亲和 | M2 | kv-cache | 中 | **是** |
| 4 | batch-scheduling | Batch 调度 | M2 | 无（本轮） | 高 | 否 |
| 5 | pd-separation | P-D 分离 | M2 | 无（本轮） | 高 | 否 |
| 6 | speculative-decoding | 投机解码 | M2 | 无 | 高 | 否 |
| 7 | quantization | 量化 | M2 | 无 | 中 | 否 |

**定位**：在 Wave 1 验证门禁可执行后，承接**更高内容难度的 M2 advanced 集群**（batch-scheduling / pd-separation / speculative-decoding）与**两个已预埋的动画复用**——tpot 复用 prefill-decode（画布元素 frozen-sample §2.5 明确「已预留」，且 P2-1 窄屏溢出已在 `561b6ad` 修复）、session-affinity 复用 kv-cache（命中/打散双路径，expert-plan §4.10 已设计为可复用）。
**落地后**：M1 上线 9 → 10（**M1 完整**）、M2 上线 4 → 10（**M2 完整**）。两个模块清零 stub。

---

## 6. 每讲所属模块

见 §3/§4/§5 表「模块」列。汇总：**M1 共 8 讲**（semantic-space, transformer, positional-encoding, autoregressive, sampling, instruction-tuning, hallucination, reasoning-limit）；**M2 共 6 讲**（tpot, session-affinity, batch-scheduling, pd-separation, speculative-decoding, quantization）。Wave 1 = M1 前 7；Wave 2 = M1 第 8（reasoning-limit）+ M2 全 6。

## 7. 每讲推荐 animation type

- **复用既有专家画布（3 讲，零新增）**：
  - `autoregressive` → **token-flow**（TokenFlowAnimation，已注册，已被 `token` 验证）。
  - `tpot` → **prefill-decode**（PrefillDecodeAnimation，已注册，元素预留 + P2-1 已修）。
  - `session-affinity` → **kv-cache**（KVCacheAnimation，已注册，命中/未命中双路径可复用）。
- **本轮纯文本（11 讲，不接动画）**：semantic-space, transformer, positional-encoding, sampling, instruction-tuning, hallucination, reasoning-limit, batch-scheduling, pd-separation, speculative-decoding, quantization。
- **关于 batch-scheduling / pd-separation 的说明**：[animation-spec.md](../docs/animation-spec.md) §1 枚举中存在 `batch-scheduler`、`pd-separation` 两个类型，但**均未注册组件**（不在首版 8 组件内）。若要为这两讲接动画即等于「新建动画组件」——本轮**刻意不做**，保持纯文本，以遵守「不新增动画协议」红线。两者列入动画 backlog，待后续批次按复用度评估（与 [expansion-plan-44-lessons.md](../docs/expansion-plan-44-lessons.md) Batch 2「可选新增、非阻塞」口径一致）。

## 8. 每讲预计内容难度（低 / 中 / 高）

| 难度 | 讲 |
|---|---|
| 低（2） | autoregressive（token 的线性延伸 + 动画复用）、tpot（与 ttft/decode 同源、画布已预留） |
| 中（7） | semantic-space、positional-encoding、sampling、instruction-tuning、hallucination、session-affinity、quantization |
| 高（5） | transformer（架构性、机制密集、最易写成百科）、reasoning-limit（抽象、最易写成口号）、batch-scheduling、pd-separation、speculative-decoding（均 advanced、需强工程信号与真实误判场景） |

> 内容难度直接影响审核退回概率：5 个「高」讲应在草稿阶段重点要求工程指标/规模/约束/验证结果（[content-production-gate.md](../docs/content-production-gate.md) §3），避免百科味。

## 9. 每讲预计动画难度（低 / 中 / 高）

- 仅 3 讲有动画，**全部为「低」**：均为纯复用既有专家画布，不新建组件、不改协议，仅做 highlightTargets 映射与 `AnimationConfig.steps` 配置；reduced-motion 与 raw key 红线由现有画布保证。
- 其余 11 讲无动画，动画难度不适用（—）。
- 动画整体风险：**本轮是 44 讲扩展中动画风险最低的一批**（0 新组件、0 新协议、3 个最成熟复用）。

## 10. 每讲是否复用现有专家级动画

| 复用 | 讲（→ 复用画布） |
|---|---|
| ✅ 是（3） | autoregressive → TokenFlowAnimation；tpot → PrefillDecodeAnimation；session-affinity → KVCacheAnimation |
| ❌ 否 · 无动画（11） | semantic-space、transformer、positional-encoding、sampling、instruction-tuning、hallucination、reasoning-limit、batch-scheduling、pd-separation、speculative-decoding、quantization |

> 3 个复用画布均已通过 [animation-expert-verification.md](animation-expert-verification.md)（key-wiring 0 dead key、无 raw key 泄漏、四门禁全绿）与 [animation-browser-visual-verification.md](animation-browser-visual-verification.md)（桌面 12/12 PASS；prefill-decode 窄屏问题已于 `561b6ad` 修复）。

## 11. 是否需要新增动画协议（默认应为否）

**否 —— 全部 14 讲均不新增动画协议、不新增动画组件、不改 `AnimationConfig`/`AnimationPlayer`/`src/types/*`。**

- 3 个有动画的讲只走「复用既有注册类型 + 配置 steps + highlightTargets 聚焦」，属 [mvp-0.1-frozen-sample-standard.md](../docs/mvp-0.1-frozen-sample-standard.md) §7「不改协议」允许形态。
- 唯一可能诱发新协议的 batch-scheduling/pd-separation 已显式按纯文本处理（§7）。
- 因此本轮**不触发任何动画类停止点**。若执行中发现某讲确需新画布，立即停止并升级主开发/Owner（按 expansion-plan §1.5）。

## 12. 是否有目录或命名冲突

**无冲突。**

- **id/slug/order/moduleId**：14 个 id 全部已在 `src/data/concepts.ts` 以 stub 形式登记（id=slug、order 模块内连续唯一、moduleId 合法），本轮只填正文 + 翻 `contentStatus`，**不新增 id、不改 order、不重排 56 讲目录**。
- **草稿文件**：`content/drafts/` 现仅有 12 个已上线讲的 json，**这 14 讲尚无任何草稿/审核文件** → 新建 `content/drafts/<id>.json`（14）与 `content/reviewed/<id>.md`（14）不会与现有文件撞名。
- **动画注册**：复用的 3 个 type 已在 registry，无新增注册项，无注册冲突。
- **模块计数**：维持 `10/10/8/16/6/6 = 56` 不变（`validate:structure` 仍应报 56 登记）。

## 13. 是否需要 Owner 决策

**进入 Wave 1 内容生成：不需要阻塞式 Owner 决策。** 本轮零新 schema/协议/组件/目录改动，完全落在 [expansion-plan-44-lessons.md](../docs/expansion-plan-44-lessons.md) 既有授权内（对应 Batch 1「否」+ Batch 2 之 M2 复用部分「知会、非阻塞」，且本轮**不**升级 model-router，故连「知会」触发条件都未命中）。

**建议 Owner 一次性做 3 项非阻塞确认（默认放行，不回复即视为同意）：**

1. **范围确认**：认可本轮 14 讲 = M1+M2 完整收尾，并接受把 expansion-plan 的「Batch 1（8）+ Batch 2 前半（6）」重切为 **7/7 两 Wave**（语义不变，只换执行粒度）。
2. **动画边界确认**：认可 batch-scheduling / pd-separation **本轮保持纯文本**、不新增 `batch-scheduler`/`pd-separation` 动画类型（默认 否，列入 backlog）。
3. **诊断题配平口径确认（需要留意的门禁适配点）**：现门禁 [content-production-gate.md](../docs/content-production-gate.md) §1.1 的答案分布「按约 12 题/批」判定；本轮按 7 题/Wave 会更紧（7×40% ≈ ≤2 题/位置且需覆盖 A/B/C/D）。**建议以「14 讲整轮」为分布配平单位**，Wave 内逐讲生成、每个 Wave 入库前对该 Wave 复算、整轮收尾时对 14 题总复算达标。请 Owner/审核确认采用此口径（否则 7 题硬覆盖 A/B/C/D 虽可行但弹性小）。

> 注：上述均为「确认/知会」，非「必须等待批复才能开工」。若需严格门控，仅第 3 项（诊断题配平口径）值得在 Wave 1 启动前明确，以免审核阶段返工。

## 14. Wave 1 与 Wave 2 的执行顺序建议

1. **串行，Wave 1 先行**：Wave 1（M1 主体）→ 全门禁 PASS + 四命令全绿 + 该 Wave 诊断题配平达标 + 主路径不进 stub 验证通过 → 再开 Wave 2。**不并行两 Wave 写 `src/data/*`**（避免合入冲突，[AGENTS.md](../AGENTS.md) §5.1）。
2. **为何 Wave 1 先**：M1 是入门路径、内容/动画风险最低（6 纯文本 + 1 最成熟动画复用），是验证「内容生产门禁 + draft→review→入库流水线」是否真正可执行的最佳试金石；先把门禁跑通，再让高难度的 M2 advanced 集群进场，降低返工面。
3. **Wave 2 的前置已就绪**：tpot 复用的 prefill-decode 窄屏 P2-1 已于 `561b6ad` 修复；session-affinity 复用的 kv-cache 双路径已验证。Wave 2 无新增动画前置阻塞。
4. **每 Wave 独立闭环**：一个 Wave 未达门禁与四命令全绿前不开下一个；诊断题分布建议按 §13.3 的整轮口径，逐 Wave 复算 + 整轮总复算。
5. **完成判定**：两 Wave 全绿后，M1 = 10/10、M2 = 10/10，上线讲数 12 → 26，`validate:structure` 仍报 56 登记 / `10/10/8/16/6/6`，56 讲地图其余 30 stub 维持弱化置灰。建议 Wave 2 收尾时补一次真实浏览器（Playwright）抽检 3 个动画复用讲（autoregressive/tpot/session-affinity），弥补纯命令行验证的方法学缺口。

---

## 五、后续执行工具分工建议（写入本报告，供 Wave 1 启动时执行）

| 工具 | 角色 | 可写范围 | 职责 |
|---|---|---|---|
| **GLM 5.2** | 内容初稿 | `content/drafts/<id>.json`（14） | 按 56 讲写作模板 + frozen-sample 口径产出 14 讲草稿（写作别名字段 oneSentence/commonPitfalls/animationBrief/relatedConcepts 仅在 draft 用） |
| **Codex GPT 5.5** | 内容终审与合入验收 | `content/reviewed/<id>.md`（14） | 按 [content-production-gate.md](../docs/content-production-gate.md) 门禁 1–5 逐项判定 + 终审验收；FAIL 退回 GLM |
| **Cursor** | 主工作台 / 合入执行 | `src/data/*`（唯一入库角色）| 按 [content-schema.md](../docs/content-schema.md) §3 映射转换入库、翻 `contentStatus`、接 3 个动画复用配置、跑四命令 |
| **Claude Code Opus 4.8** | 总控抽检 / 最终封板 | 报告 / 看板 | 抽检门禁执行质量、动画复用 key-wiring、诊断题整轮分布、浏览器抽检，最终封板并回写 [project-board.md](../docs/project-board.md) |

> 角色权限须叠加遵守 [AGENTS.md](../AGENTS.md) §5.1：内容 Agent 只写 drafts、审核 Agent 只写 reviewed、唯一入库角色（此处为 Cursor 承担「主开发」职责）才可改 `src/data/*`，任何角色不得改 `docs/content-schema.md` / `docs/animation-spec.md` / 动画协议。

## 六、本轮明确禁止（自检已遵守）

本报告生成过程：未生成 14 讲正文、未改 `src/*`、未改 `content/*`、未改 `docs/content-schema.md`、未改 `docs/animation-spec.md`、未新增动画协议、未改 56 讲目录、未提交 git。仅在 `reports/` 下新增本范围计划文件。

---

## 附：范围选择原则对照（自检）

| 原则（优先选择） | 本轮 14 讲是否满足 |
|---|---|
| 1. 能补齐一个完整模块 | ✅ 同时补齐 M1 与 M2 两个完整模块 |
| 2. 能复用已有专家级动画类型 | ✅ 复用 token-flow / prefill-decode / kv-cache 共 3 讲 |
| 3. 与当前 12 讲知识链路强相关 | ✅ M1 是 token/attention 的同模块延伸；M2 是 prefill/decode/ttft/kv-cache 的同模块延伸 |
| 4. 适合验证内容生产门禁 | ✅ Wave 1 以最低风险 M1 专门验证门禁全链路 |
| 5. 不需要新增 schema 或动画协议 | ✅ 零 schema、零动画协议、零新组件 |

| 原则（暂缓选择） | 本轮是否规避 |
|---|---|
| 1. 需要新动画协议的讲 | ✅ 规避（batch-scheduling/pd-separation 本轮纯文本） |
| 2. 需要新增复杂页面结构的讲 | ✅ 规避（全部复用现有详情页/画布结构） |
| 3. 概念边界还不清楚的讲 | ✅ 规避（M1/M2 概念边界清晰，PDF 素材成熟） |
| 4. 需要大规模重排 56 讲目录的讲 | ✅ 规避（id/order 全部沿用既有登记） |
