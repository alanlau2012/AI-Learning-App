# AGENTS.md

## oneSentence
AGENTS.md 是写给后续开发 Agent 和工程师的仓库级操作说明，用来固定项目边界、文件所有权、验证命令、内容流水线和不可破坏的工程约定。

## whyItMatters
Agent 不会自动知道一个仓库里的隐性协作规则。没有 AGENTS.md，后续执行者可能读错权威文档、改错目录、绕过审核流程，甚至把写作模板字段直接写进生产数据。

## mentalModel
把 AGENTS.md 看成进入工地前必须看的施工牌：它不替代图纸，但告诉每个角色能进哪片区域、先读哪份图纸、完工前必须验收什么。

## mechanism
- AGENTS.md 应先声明当前项目状态，让接手者知道哪些模块已封板、哪些范围仍是 stub。
- 它要列出文件所有权和角色边界，避免内容 Agent、审核 Agent、动画 Agent 直接改核心代码。
- 它要指向权威规格和命令门禁，让实现可追溯到 docs 和可执行验证。
- 它要记录首版不做什么，防止后续 Agent 擅自引入后端、登录、真实模型 API 或架构扩张。
- 每次封板后必须刷新 AGENTS.md，否则后续 Agent 会基于过期状态继续开发。

## animationBrief
无。

## enterpriseCase
- title: 内容 Agent 绕过流水线写入生产数据
- scenario: 一个 AI 学习应用同时有主开发、内容、审核和 E2E 四类 Agent 协作，每轮内容扩展约 6 到 12 讲。
- problem: 早期一次扩展中，内容 Agent 直接修改 src/data，把 oneSentence 和 commonPitfalls 等写作字段混入权威数据，导致 validate:content 失败。
- analysis: 仓库没有把文件所有权、draft -> review -> 入库流程和 schema 映射规则写在开工入口，Agent 只按局部任务理解权限。
- solution: 在 AGENTS.md 中冻结角色权限、目录边界、验证命令和封板刷新规则；每轮开工前先读 AGENTS.md 与 project-board。
- takeaway: 多 Agent 协作中，AGENTS.md 是降低上下文丢失和权限误用的第一道工程防线。

## commonPitfalls
- 把 AGENTS.md 写成泛泛介绍，没有明确可写范围和禁止事项。
- 封板后不更新当前状态，导致后续 Agent 重做已完成模块。
- 只写命令，不写文件所有权和内容流水线。
- 让 AGENTS.md 与 docs/project-board.md 互相矛盾。

## diagnosticQuestion
scenario: 一次内容扩展中，内容 Agent 直接改了 src/data/concepts.ts，并把写作模板字段 oneSentence 写进生产数据。validate:content 失败后发现 AGENTS.md 没写文件所有权，也没有说明 draft -> review -> 入库流程。

question: 最优先应该补什么？

- A. 要求所有 Agent 以后自行阅读更多源码
- B. 在 AGENTS.md 中明确角色可写范围、内容流水线、schema 映射和封板门禁
- C. 删除内容草稿目录，减少混乱
- D. 把 validate:content 改成忽略未知字段

answer: B

explanation: B 直接补齐协作入口规则。A 太依赖个人习惯。C 会破坏既定内容流水线。D 是危险绕过，会让 schema 外字段进入生产数据。

troubleshootingPath:
- 复盘失败文件和越权角色
- 检查 AGENTS.md 是否声明文件所有权
- 补 draft/review/入库流程和验证命令
- 同步 project-board 当前状态
- 用下一轮内容合入验证规则是否可执行

## keyTakeaways
- AGENTS.md 是多 Agent 协作的开工入口和边界说明。
- 它必须包含当前状态、文件所有权、硬边界和验证门禁。
- 每次封板后不刷新 AGENTS.md，就会制造下一轮上下文污染。

## relatedConcepts
- prompt-context
- repo-context
- spec-driven-development
- subagent
- human-in-the-loop
