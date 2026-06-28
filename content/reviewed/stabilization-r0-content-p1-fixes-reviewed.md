# Stabilization R0 内容 P1 修复草稿审核

> 审核角色：ai-fullstack-content-review-agent  
> 审核日期：2026-06-28  
> 审核对象：`content/drafts/stabilization-r0-content-p1-fixes.md`  
> 覆盖 issue：#14-#20、#54、#55、#57、#61、#62  
> 边界：只做内容审核，不修改 `src/data/*`。

## 1. 结论先行

- 总体结论：**REVISE 后可入库**。
- P0：0
- P1：1
- P2：2
- P3：0
- 最大风险：#14 的 12 道诊断题只给了“正确项 + 一个强干扰项”的候选文案，未给完整四选项与解析，无法证明修复后不再存在长度泄漏、语气泄漏或剩余干扰项过弱。
- 可直接采纳：#15、#16、#17、#18、#19、#20、#54、#55、#57、#61、#62 的修复方向总体正确，未发现基础事实错误或 schema 外字段。

## 2. 必须修改项

### [P1] #14 / diagnosticQuestion.options / 12 题反作弊修复不完整

- 位置：`content/drafts/stabilization-r0-content-p1-fixes.md` §#14
- 原文片段：表格仅列出「建议替换的正确项」和「建议升级的强干扰项」。
- 问题类型：诊断题质量 / 可入库性不足
- 为什么有问题：#14 的原始问题是系统性结构泄漏。只替换正确项和一个强干扰项，仍可能留下另外两个明显荒谬或显著更短的选项；也无法确认解析是否解释了所有错误选项。主开发若按此半成品合入，修复后仍可能被“最长/最结构化选项即正确”猜出答案。
- 可能误导的工程判断：用户仍会学会按选项形态答题，而不是判断第一步工程动作。
- 必须修改：
  1. 为 12 个 conceptId 分别给出完整 `A/B/C/D` 四个选项文本。
  2. 保持原 `correctOptionIds` 字母分布不变，除非另附分布重算。
  3. 每题至少 1 个强干扰项，且四个选项长度差建议控制在约 4-8 个中文字符内。
  4. 同步给出每题 `explanation` 的更新原则：必须说明其他选项为什么不是第一步或不是最佳判断。
- 是否需要人工确认：否，内容 Agent 可补齐；主开发合入后需重新统计。

## 3. 逐项审核结论

| Issue | 结论 | 审核意见 |
|---|---|---|
| #14 12 题最长选项泄漏 | **REVISE** | 方向正确，但缺完整四选项与解析；必须补齐后才可入库。 |
| #15 `cost-routing` 干扰项荒谬 | PASS | A/C/D 改成现实团队可能提出但优先级错误的方案，B 仍是唯一专业第一步。 |
| #16 `maas` 干扰项荒谬 | PASS | “SDK 埋点+冻结直连”作为强干扰项可信，正确凸显 MaaS 控制面收敛。 |
| #17 `sla` 双重结构泄漏 | PASS | 正确项缩短，干扰项均具备部分合理性；工程口径符合“AI SLA 不等于 HTTP 成功率”。 |
| #18 `permission-governance` 双重泄漏 | PASS | 强调运行时最小权限优先于提示词自觉，安全口径正确。 |
| #19 `ttft` 题干直接映射 | PASS | 新题干加入 GPU 利用率干扰，仍保持 A/B/C 为首字前链路排查，合理。 |
| #20 `token-cost-spike` prefix 口径 | PASS | 将租户/权限/版本放入 cache key 命名空间，prefix 只承载稳定系统提示与任务模板，符合缓存隔离口径。 |
| #54 `multi-agent` 决策手册仓库语境 | PASS | 建议整段替换是对的；应清除 `git status`、`src/data/*`、`reviewed` 等仓库协作用语。 |
| #55 `agent-loop` 顺序 | PASS | 改为“观察-计划-行动-校验”符合正文与 Agent 状态机口径。 |
| #57 `rag-answer-quality` 指标不一致 | **PASS with Owner choice** | “事故当下快照”方案是最小修复；若选择“干预后模拟起点”，必须同步改 background/facts。不可两套数字并存。 |
| #61 `agents-md` definition 截断 | PASS | 缩短 definition 并把泛化说明移到正文段落，正确。 |
| #62 `positional-encoding` pitfall 重复 | PASS | 新增“长上下文有效长度/位置外推/边界位置验证”独立误区，避免重复。 |

## 4. Schema 与边界检查

- 未发现草稿建议新增 schema 外字段。
- #54 中 `app/non/signals/tradeoffs/questions/checks/exec` 是现有 `buildGuide` 配置语境，不是最终 `DecisionGuide` schema 字段；主开发合入时仍需映射到 `applicableScenarios / nonApplicableScenarios / decisionSignals / implementationChecklist / executiveExplanation`。
- 所有建议均落在现有 `diagnosticQuestion.options/scenario/explanation`、`scenarioExercises`、`decisionGuides`、`definition`、`pitfalls` 范围内。
- 未发现需要修改 `src/types/index.ts` 或 `docs/content-schema.md` 的内容。

## 5. 工程负责人视角评价

- 架构决策：#15/#16/#17/#18/#20/#54 能训练“先收敛控制面、先评估基线、先隔离权限、先拆事实源”的工程判断，方向正确。
- 故障诊断：#19 和 #57 能把 TTFT、RAG 指标从关键词匹配拉回链路诊断，前提是 #57 明确单一时间线。
- 成本 / SLA / 容量：#15/#17/#20 覆盖质量底线、SLA 质量口径、cache locality 与命名空间隔离，具备落地性。
- 治理 / 安全 / 权限：#18/#20/#54/#55 没有把提示词规则当成唯一防线，符合企业级安全治理口径。
- 主要短板：#14 批量题仍需要完整可入库版本，否则评估有效性风险未闭环。

## 6. 修复优先级

1. 必须立即修：补齐 #14 12 道题的完整四选项、正确答案分布复核、解析更新。
2. 入库时必须确认：#57 采用“事故当下快照”或“干预后模拟起点”其中一种，不允许 baseline/facts/background 三处数字混用。
3. 合入后验证：重跑 `cmd /c npm run validate:content`，并人工统计诊断题正确项长度泄漏与 A/B/C/D 分布。

## 7. 审核范围与不确定性

实际阅读：

- `AGENTS.md`
- `agents/ai-fullstack-content-review-agent.md`
- `docs/content-schema.md`
- `docs/project-board.md`
- `reports/github-issues-triage-20260628.md`
- `reports/issue-tickets-content-diag-20260628.md`
- `reports/issue-tickets-content-guides-20260628.md`
- `reports/issue-tickets-content-scenarios-20260628.md`
- `reports/issue-tickets-content-lessons-20260628.md`
- `content/drafts/stabilization-r0-content-p1-fixes.md`
- 必要的 `src/data/demoConcepts.ts`、`src/data/decisionGuides.ts`、`src/data/scenarioExercises.ts`、`src/types/index.ts`

未做：

- 未修改 `src/data/*`。
- 未运行构建或内容校验命令。
- 未审核本轮并行工作区中其他未提交改动的正确性。

不确定性：

- #57 的最终叙事时间线需要 Owner 或主控 Agent 选择。
- #14 的最终是否通过，取决于补齐后的完整四选项和合入后的统计结果。
