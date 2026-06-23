# 规格驱动开发

## oneSentence
规格驱动开发是先冻结产品、架构、数据、视觉和验收规则，再让实现、测试和复盘都围绕这些规格闭环，而不是边写边猜需求。

## whyItMatters
AI 辅助开发速度很快，也更容易把示例、占位文案和临时想法误当权威。规格驱动把“哪个文档说了算、改完怎么验收、哪些边界不能碰”显式化，减少 Agent 自作主张。

## mentalModel
规格不是写给归档系统看的文档，而是开发时的导航仪。它告诉 Agent 目标、道路限制、禁止驶入区域和到达后如何判定成功。

## mechanism
- 先识别权威规格：产品规格、架构文档、内容 schema、视觉规范和验收清单分别约束不同层面。
- 实现前把需求拆成可验证的行为和数据变化，避免只按页面感觉改。
- 当原型、示例和 schema 冲突时，必须按预先声明的权威顺序决策。
- 代码改动要能追溯到具体规格条目，封板报告要记录验证命令和剩余风险。
- 规格变更本身也要走同步更新：类型、校验脚本、文档和测试必须一起改。

## animationBrief
无。

## enterpriseCase
- title: 原型占位数字被误当正式计数
- scenario: 一个学习 App 的 design.md 示例中有 50 讲和 0/12 占位数字，content-schema.md 则登记了 56 讲和 10/10/8/16/6/6 模块构成。
- problem: 一次 UI 调整中，Agent 直接复制原型数字，导致首页显示 50 讲，模块页计数和数据层 56 讲冲突。
- analysis: 实现没有先识别权威规格。视觉文档只负责风格，讲数和模块计数应以 content-schema 为准。
- solution: 在 AGENTS.md 和 content-schema 中明确数量权威来源；实现时从数据层派生计数，并用 validate:structure 验证 56 登记。
- takeaway: 规格驱动开发的关键是先判断哪份规格对哪个问题有权威性。

## commonPitfalls
- 把高保真原型里的占位数字当成真实数据。
- 只按用户一句话改代码，不回查已有规格边界。
- 规格改了但类型和校验脚本没同步。
- 验收只看页面能跑，不检查权威数据和命令门禁。

## diagnosticQuestion
scenario: 设计原型中写着 50 讲，但 content-schema.md 登记表写明 56 讲。Agent 实现首页时复制了原型数字，导致 validate:structure 虽通过但 UI 口径错误。

question: 最优先应该建立什么规则？

- A. 明确不同规格的权威边界，讲数一律从 content-schema/数据层派生
- B. 让设计稿以后不要出现任何数字
- C. 把 validate:structure 改成读取 UI 文案
- D. 上线前人工浏览首页即可

answer: A

explanation: A 建立权威来源和实现方式。B 不现实，原型需要占位。C 方向反了，UI 应服从数据权威。D 只能发现部分问题，不能防止口径漂移。

troubleshootingPath:
- 列出冲突规格和涉及字段
- 判断每份规格的权威范围
- 把 UI 文案改为数据派生
- 补文档提示防止复发
- 运行结构和构建门禁

## keyTakeaways
- 规格驱动不是多写文档，而是让实现和验收有明确权威来源。
- 不同规格负责不同问题，冲突时要按权威边界决策。
- 规格变更必须同步类型、校验、文档和报告。

## relatedConcepts
- agents-md
- repo-context
- eval
- trace
- context-pollution
