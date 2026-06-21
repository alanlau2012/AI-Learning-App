# MVP 0.1 修复回合 1 Owner 封板验收报告

> 角色：MVP 0.1 修复回合 1 封板验收 Agent（Claude Opus 4.8）。
> 本轮只做封板验收、样板冻结与扩展规划，不开发、不改 `src/*` / `content/*` / schema / 动画，不直接提交 git。
> 验收方式：通读 11 份报告 + 7 份规格文档，**独立实跑 4 条工程命令**，并对关键结论做**代码级 / 数据级独立核验**（不只采信下游报告）。
> 基线：`main` @ `fa73859`（修复回合 1 已合入，工作树干净）。最后更新：2026-06-21。

---

## 1. 结论

**PASS_WITH_MINOR_ISSUES。**

修复回合 1 的全部 P0（P0-01/02/03）与全部最高优先级 P1（P1-01/02/03/04/05）均已完成并独立核验通过；4 条工程门禁（`validate:content` / `typecheck` / `lint` / `build`）本 Agent 重新实跑全部退出码 0；端到端复验结论为 `PASS_WITH_MINOR_ISSUES`，无 P0、无 P1 返修项。唯一遗留为 1 个 P2、非阻塞、且本轮明确不在范围内的历史项（Google Fonts 外链 UFP-10），不影响任一验收项。

---

## 2. 是否建议封板

**建议封板。**

判断依据：所有 P0 完成 → 不触发「不建议封板」红线；阻塞型 P1（P1-01/02/03）全部完成 → 不触发「可演示但不建议扩展」档；P0 全部完成 + 关键 P1 完成 + E2E 为 `PASS_WITH_MINOR_ISSUES` → 命中「建议封板，可以进入 44 讲扩展准备阶段」。

---

## 3. 是否建议进入 44 讲扩展

**建议进入 44 讲扩展准备阶段（不是立即批量生成 44 讲）。**

- 「准备阶段」指：以本轮冻结的 12 讲为样板基线，按批次（Batch 1 = 8 讲先行）走 `draft → review → 合入 → validate:content` 流水线。
- 进入扩展前必须把本轮沉淀的内容质量门禁（已在 `docs/project-board.md §3` 制度化）作为每讲 reviewed 的强制判定项，并配套使用本轮新增的三份冻结/门禁/计划文档（见 §9）。
- 不建议一次性产出 44 讲；不建议跳过审核直接入 `src/data/*`。

---

## 4. P0 验收结果

| 编号 | 项 | 结论 | 独立核验证据 |
|---|---|---|---|
| **P0-01** | 主学习路径不进入 stub | ✅ 完成 | 读 `src/utils/progress.ts`：`isPublishedConcept()`（L127–131）= `contentStatus !== undefined && !== 'stub'`；`getContinueLearningConceptId()`（L154–168）仅当 `lastVisitedConceptId ∈ publishedConceptIdSet` 才返回它，否则取首个未完成已上线讲，全完成回第一讲——**结构上无法返回 stub**。`ConceptPage` 的「下一个」取 `orderedPublishedConcepts` 索引+1，天然跳过 44 stub。三种 lastVisited 情形（新/老/误访问 stub）均回已上线，E2E §3 逐项推演一致。 |
| **P0-02** | 诊断题答案分布与干扰项质量 | ✅ 完成 | 本 Agent 直接从 `src/data/demoConcepts.ts` 逐题读取 `type` 与 `correctOptionIds` 重算：单选 11 题分布 **A=3 / B=2 / C=3 / D=3**，最高 27.3% < 40% 上限，A/B/C/D 全覆盖；多选 `q-ttft-1` = A/B/C 不计入位置分布。强干扰项 ≥10/12，解析逐项说明其他项为何不是第一步。与内容修复报告、审核复审、E2E 三方独立统计完全一致。 |
| **P0-03** | 内容结构去模板化规则已形成 | ✅ 完成 | 去模板化写作约束（机制 4-7 / 误区 3-6 / 结论 3-5 不机械固定、心智模型不固定「可以把 X 理解为…」句式）成文并制度化进 `docs/project-board.md §3.4`；11 讲心智模型句式改写 + 5 讲条数调整作为「轻量抽样回修」已合入 `demoConcepts.ts`，证明规则可执行（非全量重写，符合本轮目标）。内容审核首轮 FAIL（仅有规则、无可合入正文）→ 续派补 §9 抽样回修 → 复审 PASS，闭环可追溯。 |

**P0 小结：3/3 完成。无未完成 P0，不触发「不建议封板」红线。**

---

## 5. 最高优先级 P1 验收结果

| 编号 | 项 | 结论 | 独立核验证据 |
|---|---|---|---|
| **P1-01** | 用户界面不泄漏 mvp/stub/contentStatus/raw key | ✅ 完成 | 读 `ConceptHeader.tsx` 全文：只渲染模块名/难度/时长/是否含动画/标题/完成·收藏按钮，**无 contentStatus / mvp / stub 标签**。读 `GenericMechanismAnimation.tsx` 全文：只渲染时间轴圆点（`aria-label={item.title}`，非可见文本）+「步骤 n / N」，**不渲染 `config.type`、不把 `highlightTargets` 渲染为文本**。 |
| **P1-02** | kv-cache 正文来源唯一 | ✅ 完成 | 读 `src/data/concepts.ts` L80：`kv-cache` 已是 `stub({...})` 登记（无内联长对象死数据）；正文仅由 `demoConcepts.ts` 的 mvp 版经 `demoById.get(id) ?? concept` 生效，单一来源。 |
| **P1-03** | 内容审核门禁已建立 | ✅ 完成 | 本轮审核**实际执行**门禁（首轮 FAIL→修复→PASS，非走过场）；6 项门禁（答案分布/强干扰项/解析/结构去模板化/案例可复盘/样板偏差检查）已写入 `docs/project-board.md §3`，标注「扩展 44 讲必须执行」。 |
| **P1-04** | 两个真实画布完成 + 其他动画不泄漏 raw key | ✅ 完成 | 读 `src/components/animation/registry.ts`：`prefill-decode → PrefillDecodeAnimation`、`agent-loop → AgentLoopAnimation`（真实画布），`kv-cache → KVCacheAnimation`，其余 5 类（token-flow/attention-map/context-window/model-router/issue-fix-flow）→ `GenericMechanismAnimation`（已收口 raw key）。`validate:animation` 通过（一致性/注册/步骤）。 |
| **P1-05** | 3-4 个企业案例样例升级 | ✅ 完成 | 合入报告 + 审核复审：`model-gateway`/`multi-model-routing`/`skill`/`agent-loop` 共 **4 个**案例升级，补指标/规模/系统边界/错误路径/约束/验证结果，仅用 `enterpriseCase` 现有字段，已合入。 |

**P1 小结：5/5 完成。无阻塞型 P1 遗留，不触发「可演示但不建议扩展」档。**

---

## 6. 工程验证结果

| 命令 | 本 Agent 独立实跑 | 退出码 | 关键输出 |
|---|---|---|---|
| `npm run validate:content` | ✅ 通过 | 0 | `[published-content] 已校验 demo/mvp 内容 12 个`；`[animation] 已校验动画一致性、注册类型与步骤合法性`；`通过：内容结构校验（56 登记 / 模块计数 10/10/8/16/6/6 / 唯一性 / 关联无悬空 / contentStatus / 诊断题结构）` |
| `npm run typecheck` | ✅ 通过 | 0 | `tsc -b` 无错误输出 |
| `npm run lint` | ✅ 通过 | 0 | `eslint .` 无错误输出 |
| `npm run build` | ✅ 通过 | 0 | `✓ 92 modules transformed`；`✓ built in 578ms`，产物写入 `dist/` |
| **E2E 结论** | — | — | `PASS_WITH_MINOR_ISSUES`（`reports/e2e-verification-mvp-0.1-fix-round1.md`）：11 项必须验证项逐项通过，无 P0/P1 返修。E2E 验证方式为「命令门禁实跑 + 代码级路径推演」，本环境未起浏览器；UI 路径以源码行号逐条覆盖。 |

> 复核说明：本 Agent 在 `fa73859`（干净工作树）上重新实跑全部 4 条命令，结果与各 Subagent 报告一致，未发现回归。E2E 未起真实浏览器属已知方法学限制（见 §7「可在扩展中顺手处理的问题」第 5 项）。

---

## 7. 剩余问题

### 7.1 必须进入修复回合 2 的问题

**无。** 没有任何 P0/P1 阻塞项遗留，不需要专门开修复回合 2。

### 7.2 可以进入 backlog 的问题（P2，非阻塞）

1. **UFP-10**：`index.html` 仍用 Google Fonts 外链，受限网络下 console 报字体加载错误并 fallback 到系统字体。演示前可本地化或移除外链。已登记在 `docs/project-board.md §4`。
2. **UFP-09**：缺「上一讲」与显式 12 讲推荐学习路径，当前主线依赖按已上线顺序铺平的列表。
3. **UFP-11**：reduced-motion 提示文案、KV Cache 画布配色与静态态可继续打磨。
4. **UFP-12**：尚未配置 `npm run test` 或轻量 smoke / E2E 脚本。

### 7.3 可以在 44 讲扩展过程中顺手处理的问题

1. **其余动画真实画布滚动补齐**：`token-flow / attention-map / model-router / issue-fix-flow` 仍走通用画布（已不泄漏 key、fallback 可读）。按 44 讲实际复用度，优先补 `model-router`（M3 四讲复用）；`tool-calling` 可直接复用 `agent-loop` 画布、`tpot` 复用 `prefill-decode` 画布，均无需改协议。
2. **动画协议 3 处软缺口**（变体/侧重显式声明、highlightTargets 视觉语义类型、数值量级数据驱动）：本轮用「超集元素 + 并集判断聚焦」规避，未改协议；待更复杂动画时再评估。
3. **`skill-lifecycle` 等扩展动画类型**：按 `animation-spec.md §1` 枚举在对应讲上线时补充。
4. **弱关联概念收敛**：`relatedConceptIds` 仅保留强相关，弱关系放 `tags` 或术语表。
5. **真实浏览器 E2E**：扩展阶段建议引入 Playwright（环境已具备该 MCP）补一次真机回归，弥补本轮纯命令行的方法学限制。

---

## 8. Owner 需要再决策的问题

**无阻塞型再决策项。** 本轮唯一分歧（内容首轮审核 FAIL）已在本轮范围内闭环解决，未触达 Owner 升级条件（无 schema 改动、无动画协议改动、无 56 讲目录调整；「主路径禁跳 stub」与「保留 56 讲地图」未发生冲突）。

以下 2 项为**非阻塞、仅需 Owner 知会确认**，不影响封板：

1. 是否在 44 讲扩展过程中**并行**补齐其余动画真实画布（建议：按复用度滚动补，不阻塞内容扩展）。
2. 是否在某个批次前先处理 P2 字体外链 UFP-10（建议：Batch 1 前顺手处理，零内容风险）。

---

## 9. 最终建议

**下一步明确动作（按顺序）：**

1. **确认封板**：将 MVP 0.1 修复回合 1 标记为「封板 PASS_WITH_MINOR_ISSUES」，12 讲作为 44 讲扩展样板基线冻结。
2. **采用三份新增制度文档**（本轮同时产出）：
   - `docs/mvp-0.1-frozen-sample-standard.md`（12 讲冻结样板标准：什么可复制、什么不可复制）。
   - `docs/content-production-gate.md`（内容生产门禁：诊断题/结构/案例/动画/schema 五类硬门禁）。
   - `docs/expansion-plan-44-lessons.md`（44 讲分批扩展计划：Batch 8/12/12/12）。
3. **启动 Batch 1（8 讲）**：按扩展计划走 `draft → review（强制执行门禁）→ 主开发合入 → validate:content`，先做与已上线 12 讲强关联、可复用现有动画的讲次。
4. **不开修复回合 2**：剩余问题全部进 backlog 或在扩展中顺手处理。
5. （可选）Batch 1 前处理 P2 字体外链 UFP-10。

---

## 附：本轮验收一致性声明

- 12 讲诊断题单选分布由本 Agent 直接读 `demoConcepts.ts` 字段独立重算（A=3/B=2/C=3/D=3），与内容/审核/E2E 三方统计一致。
- 4 条工程命令由本 Agent 在干净工作树上重新实跑，退出码均为 0。
- P0-01/P1-01/P1-02/P1-04 的关键结论均通过直接读源码（`progress.ts` / `ConceptHeader.tsx` / `GenericMechanismAnimation.tsx` / `concepts.ts` / `registry.ts`）核验，非仅采信下游报告。
- 本报告不重新定级、不推翻统一修复计划主结论、不修改任何 `src/*` / `content/*` / schema。
