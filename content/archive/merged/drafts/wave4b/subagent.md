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
- title: 风控平台 Subagent 并行分析导致结论冲突
- scenario: 一家支付公司用主 Agent 协调三个 Subagent 处理商户风控申诉：交易分析、合规检查和客服摘要，日均约 1800 个申诉工单。
- problem: 灰度首周 14% 的申诉报告出现互相矛盾结论：交易分析建议恢复商户，合规检查却要求冻结，主 Agent 直接拼接两份结论发给审核员。
- analysis: Subagent 只收到宽泛目标，没有统一证据口径、输出格式和冲突升级规则；主 Agent 也没有最终裁决和合并检查。
- solution: 为每个 Subagent 限定输入证据、输出字段和置信度；主 Agent 负责冲突检测，遇到恢复/冻结不一致必须转人工审核。
- takeaway: Subagent 的价值在分工，风险在集成；没有主控合并规则，并行只会放大冲突。

## commonPitfalls
- 把模糊目标直接丢给 Subagent，导致产物不可合并。
- 多个 Subagent 同时写同一核心文件。
- Subagent 只给结论不给证据，主 Agent 无法复核。
- 发现新问题后擅自扩大范围。
- 把 Subagent 的报告直接当成已验证事实。

## diagnosticQuestion
scenario: 支付风控主 Agent 调用交易分析和合规检查两个 Subagent。一个建议恢复商户，一个建议继续冻结，主 Agent 直接拼接结论发给审核员。

question: 最优先应该调整什么？

- A. 先取消并行，让主 Agent 独立完成全部分析
- B. 先让两个 Subagent 互相读取草稿，自行协商统一结论
- C. 先让主 Agent 负责冲突检测、证据合并和升级路径
- D. 先拆更多 Subagent，把交易、设备、合规和客服拆更细

answer: C

explanation: C 是第一步，主 Agent 必须承担冲突检测、证据合并和升级职责。A 放弃了分工价值。B 会让子任务互相污染且缺少最终责任。D 会增加更多冲突来源。

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
- tool-calling
- agent-loop
