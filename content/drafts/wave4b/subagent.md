# Subagent

## oneSentence
Subagent 是由主 Agent 派生或调用的专门执行者，负责在明确目标、上下文、权限和输出格式下完成一个子任务，再把结果交回主 Agent。

## whyItMatters
复杂任务常常需要并行调查、内容审核、安全检查或浏览器验证。Subagent 能提高吞吐，但如果边界不清，它也会制造重复修改、权限越界和结论冲突。

## mentalModel
Subagent 像被派去做专项检查的同事。你不能只说“去看看”，而要说明看什么、不能碰什么、结果按什么格式回来、谁有最终合入权。

## mechanism
- 主 Agent 先把总目标拆成独立子任务，确认子任务之间不会争用同一高风险文件。
- 每个 Subagent 只获得必要上下文、可写范围、验收标准和期望输出格式。
- Subagent 的产物应回到主 Agent 汇总，由主 Agent 做冲突消解和最终合入。
- 对内容、审核、动画和 E2E 等角色，应明确哪些只能产草稿或报告，不能直接改核心数据。
- 当 Subagent 发现范围外问题，应报告而不是擅自扩大任务。

## animationBrief
无。

## enterpriseCase
- title: 两个 Subagent 同时改核心数据冲突
- scenario: 一个课程应用让内容 Subagent 写草稿、审核 Subagent 做质量检查，同时主 Agent 准备合入 6 讲内容。
- problem: 内容 Subagent 直接修改 src/data，审核 Subagent 又在同一文件追加审查意见，最终产生冲突并混入 schema 外字段。
- analysis: 任务委派只说明了目标，没有说明可写范围和交付格式；主 Agent 也没有保留唯一合入权。
- solution: 把内容 Subagent 限定到 content/drafts，审核 Subagent 限定到 content/reviewed，主 Agent 负责映射入库和跑门禁。
- takeaway: Subagent 提升效率的前提是边界清楚，最终集成权必须集中。

## commonPitfalls
- 把模糊目标直接丢给 Subagent，导致产物不可合并。
- 多个 Subagent 同时写同一核心文件。
- Subagent 只给结论不给证据，主 Agent 无法复核。
- 发现新问题后擅自扩大范围。
- 把 Subagent 的报告直接当成已验证事实。

## diagnosticQuestion
scenario: 主 Agent 派内容和审核两个 Subagent 处理同一批课程，但没有限制可写范围。两者都改了 src/data/demoConcepts.ts，产生冲突并混入审核备注。

question: 最优先应该调整什么？

- A. 以后不再使用 Subagent
- B. 让两个 Subagent 先自己协商谁改文件
- C. 为每个 Subagent 固定上下文、可写目录、交付格式，并保留主 Agent 唯一合入权
- D. 把 src/data 拆成更多文件，降低冲突概率

answer: C

explanation: C 解决委派边界和最终集成问题。A 放弃了并行价值。B 仍缺少主控规则。D 可能有帮助，但不解决权限和交付格式。

troubleshootingPath:
- 确认冲突文件和越权角色
- 拆分子任务的输入和输出
- 限定每个 Subagent 的可写范围
- 要求证据和结论分开提交
- 由主 Agent 统一合入并验证

## keyTakeaways
- Subagent 适合专门子任务，不适合无边界自由行动。
- 委派必须包含目标、上下文、权限、输出格式和验收标准。
- 主 Agent 应保留最终合入、冲突消解和验证责任。

## relatedConcepts
- agents-md
- repo-context
- human-in-the-loop
- multi-agent
- tool-calling
