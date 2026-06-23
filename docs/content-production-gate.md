# 内容生产门禁 · content-production-gate

> MVP 0.1 修复回合 1 封板后冻结。这是 44 讲扩展时**每一讲入库前的硬门禁清单**。审核 Agent 必须在 `content/reviewed/<id>.md` 中对每一项逐条给出「通过 / 不通过 + 证据」，未全部通过的讲**不得**进入 `src/data/*`。
> 本文件是 [project-board.md](project-board.md) §3「内容质量门禁」的可执行展开，与 [content-schema.md](content-schema.md)、[mvp-0.1-frozen-sample-standard.md](mvp-0.1-frozen-sample-standard.md) 配套使用。
> 角色权限不变：内容 Agent 只写 `content/drafts/`；审核 Agent 只写 `content/reviewed/`；主开发是唯一入库 `src/data/*` 的角色。

---

## 0. 门禁总览

| 门禁 | 范围 | 失败后果 |
|---|---|---|
| 1. 诊断题门禁 | 含 `diagnosticQuestion` 的讲 | 退回内容 Agent |
| 2. 结构门禁 | 全部上线讲 | 退回内容 Agent |
| 3. 企业案例门禁 | 全部上线讲 | 退回内容 Agent |
| 4. 动画门禁 | 含 `animation` 的讲 | 退回内容/动画 Agent |
| 5. schema 门禁 | 全部讲 | 退回内容 Agent / 升级主开发 |

> 门禁 1 的「答案分布」按**批次**判定（约 12 题一批），其余门禁按**单讲**判定。批次定义见 [expansion-plan-44-lessons.md](expansion-plan-44-lessons.md)。

---

## 1. 诊断题门禁

**1.1 答案分布（批次级）**
- 单选正确答案必须覆盖 A / B / C / D（四个位置都出现）。
- 任一选项占比不超过 **40%**（以该批单选题总数为分母）。
- 多选题**不得**只用于凑分布；多选 `correctOptionIds` 长度 ≥1，单选恒为 1。
- 每批**独立配平**，不得沿用上一批的答案位置序列（避免「位置模板化」）。

> 基线参照：本轮 12 讲单选分布 A=3 / B=2 / C=3 / D=3，最高 27.3%。新批次需自行达标，不照搬该序列。

**1.2 强干扰项**
- 至少 **30%** 题目具备「看似合理但优先级不对」的强干扰项。
- 强干扰项典型形态：先扩容、先加副本、先补日志、先小流量灰度、先加规范——方向不错但不是第一步或不是最佳判断。
- 审核须点名每题的强干扰项在哪个选项，不能笼统说「有」。

**1.3 解析**
- `explanation` 必须说明**为什么其他选项不是第一步或不是最佳判断**，逐项或分组覆盖，不能只夸正确项。
- 单选解析应显式点名 a/b/c/d；多选解析需说明每个正确项为何合理、未选项为何不是最佳。

**1.4 排查路径**
- `troubleshootingPath` 按真实工程排查顺序写（从最可能根因到次要核对），不是知识点罗列。

**1.5 结构合法**
- `correctOptionIds ⊆ options[].id`；单选长度 1、多选 ≥1；`options.length ≥ 2`。
- `scenario` 为企业真实场景，`question` 问判断/排查，不问定义。
- 与 `validate:content` 的诊断题结构校验一致（[content-schema.md](content-schema.md) §6.1.7）。

**1.6 反应试模式**
- 正确项不得成为四项中的最长、最短、最全或最结构化选项，也不得通过与极值项并列形成稳定猜题信号。
- 正确项必须完整陈述最佳实践动作，不得为通过长度测试而截短；干扰项应保持同等具体度。
- 正确项与干扰项必须共享句式类型，不得出现干扰项全是复合句、答案是裸短语等句式签名。
- 不得只靠 `trace` / `结构化` / `权限` / `证据来源` 等关键词猜中正确项。
- 至少 30% 错误项应是方向正确但顺序、时机、范围或风险控制错误的强干扰项。
- reviewed 文件必须记录四项长度、正确项长度 rank、rank 分布和关键词/句式猜题检查。
---

## 2. 结构门禁

**2.1 条数区间（按内容自然决定，不机械固定）**
- 机制 `mechanism`：**4–7 条**。
- 常见误区 `pitfalls`：**3–6 条**。
- 核心结论 `keyTakeaways`：**3–5 条**。
- 同批次条数**不得过度雷同**（禁止整批「6/5/5」机械整齐）。
- 仍须满足 [content-schema.md](content-schema.md) §6.2 入库底线：机制 ≥3、误区 ≥2、结论 ≥2。

**2.2 心智模型去模板化**
- `mentalModel` 不得固定「可以把 X 理解为……」句式批量重复。
- 可用类比、反例、边界、角色视角等多种开头，同批次心智模型开头应互不雷同。
- 必须落到工程判断/本质理解，不是词典释义。

**2.3 必备层完整**
- `definition / whyItMatters / mentalModel` 非空。
- 详情页四层闭环齐全：定义 → 机制 → 案例 → 诊断题（含动画/误区/结论/关联）。

---

## 3. 企业案例门禁

- `enterpriseCase` 五段 `scenario / problem / analysis / solution / takeaway` 全部非空（不允许空字符串占位）。
- 至少包含以下 6 类信号中的 **2 类**：**指标 / 规模 / 系统边界 / 错误路径 / 约束条件 / 验证结果**。
- 禁止只写「某企业 / 某平台遇到问题后解决了」的泛例。
- 可复盘性：读者能还原「出了什么问题 → 怎么定位 → 为什么这么改 → 怎么验证有效」。

> 基线参照：`model-gateway`（规模+错误路径+约束）、`multi-model-routing`（规模+指标+验证结果）、`agent-loop`（约束+验证结果+错误路径）。

---

## 4. 动画门禁

- **画面意图**：每个动画草稿必须说明该动画/每一步的画面意图——这一步画面发生什么变化、想让用户看懂什么机制。
- **highlightTargets 可映射**：每个 `highlightTargets` key 必须能映射为画布上的可视元素（状态/位置/颜色/长度变化），并在草稿中写明映射关系。
- **key 不上屏**：不允许依赖 raw key 文本解释机制；画布可见文字只能是固定中文短标签，不得渲染 `config.type` 或把 `highlightTargets` 当文本标签。
- **配置驱动 + 复用优先**：步骤只存在于 `AnimationConfig.steps`；优先复用现有注册组件（[animation-spec.md](animation-spec.md) §2），同类型讲共用画布并以 highlightTargets 聚焦。
- **一致性**：`hasAnimation === (animation != null)`；有动画则 `steps ≥3`（入库完整性）/`≥1`（结构）、`type` 已在 registry 注册、每个 step 有唯一 `id`。
- **reduced-motion 可读**：静止画面可逐步理解。
- 未注册动画类型由 `AnimationPlayer` 纯文本 fallback 兜底（标题 + 当前步说明 + 计数），不得泄漏 raw key；新类型须先在 registry 注册专用画布后再入库。

---

## 5. schema 门禁

- **不允许引入 schema 外字段**：落库只能用 [content-schema.md](content-schema.md) §1 定义的权威字段；`oneSentence / commonPitfalls / animationBrief / relatedConcepts` 等写作别名只能在 `content/drafts/` 出现，落库按 §3 映射转换。
- **不允许改 `docs/content-schema.md`**：schema 是权威唯一来源；确需改动即触发停止点，由主开发同步改 `src/types/index.ts` 与校验规则并经 Owner 确认。
- **不允许内容 Agent 直接改 `src/data/*`**：内容 Agent 只写 `content/drafts/`，审核 Agent 只写 `content/reviewed/`，主开发是唯一入库角色。
- **不引入 schema 外别名进权威数据**，`relatedConceptIds` 必须从标题映射到已存在 id，映射不到的术语放 `tags` 或术语表。
- **样板偏差检查**：审核须额外检查是否百科味、是否缺工程指标、是否答案位置失衡、是否干扰项太弱、是否固定句式、是否引入 schema 外字段（与 [project-board.md](project-board.md) §3.6 一致）。

---

## 6. 入库放行条件（主开发执行）

一讲（及其所属批次）同时满足以下全部，方可由主开发合入 `src/data/*`：

1. 审核 Agent 在 reviewed 文件中对门禁 1–5 逐项判定为通过，整体结论 PASS。
2. 该批诊断题答案分布**整批**复算达标（§1.1）。
3. 主开发按映射转换入库，零 schema 外字段。
4. `npm run validate:content` / `typecheck` / `lint` / `build` 四条全绿。
5. 未触发停止点（无 schema 改动 / 无动画协议改动 / 无 56 讲目录调整 / 主路径禁跳 stub 与保留地图不冲突）。

任一不满足 → 退回对应 Agent，不入库。

---

## 7. 审核 reviewed 文件最小模板

审核 Agent 每讲（或每批）reviewed 结论建议含以下小节，便于主开发与 Owner 复核：

```text
## 结论：PASS / FAIL
## 1. 诊断题门禁：分布(批) / 强干扰项 / 解析 / 排查路径 / 结构  —— 逐项通过+证据
## 2. 结构门禁：条数区间 / 心智模型去模板化 / 必备层  —— 逐项通过+证据
## 3. 企业案例门禁：五段 / ≥2 类信号 / 可复盘  —— 通过+信号清单
## 4. 动画门禁（如有动画）：画面意图 / key 可映射 / key 不上屏 / 一致性 / reduced-motion
## 5. schema 门禁：无 schema 外字段 / 关联无悬空 / 样板偏差检查
## 6. 合入清单与注意事项（给主开发：哪些字段整体替换、正确项位移等）
```
