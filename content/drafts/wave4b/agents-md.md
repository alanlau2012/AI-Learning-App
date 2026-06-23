# AGENTS.md

## oneSentence
AGENTS.md 是写给 Agent 运行环境的项目级操作手册，用来固定业务边界、角色权限、可调用工具、验证命令和升级条件；在代码仓库中它表现为仓库说明，在业务 Agent 平台中也可以是同类运行规程。

## whyItMatters
Agent 不会自动知道组织里的隐性协作规则。没有类似 AGENTS.md 的操作手册，后续执行者可能读错权威文档、调用错工具、绕过审批流程，或者把草稿内容直接写入生产系统。

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
- title: 金融运营 Agent 缺少操作手册导致越权改配置
- scenario: 一家金融集团为 22 个运营团队上线内部 Agent 平台，覆盖 140 个自动化流程和 900 多名一线员工，Agent 可读取工单、生成配置变更建议并创建审批单。
- problem: 试点两周内出现 13 起越权建议，其中 5 起把“生成审批草稿”误做成“直接提交变更”，平均回滚耗时 46 分钟。
- analysis: 平台只有工具列表，没有统一说明哪些团队可改哪些系统、哪些动作必须转审批、哪些文档是权威来源；不同团队把口头规则写在各自聊天模板里。
- solution: 为每个业务域建立 AGENTS.md 式操作手册，声明角色边界、工具权限、审批阈值、验证命令和人工升级条件，并把手册版本写入每次 trace。
- takeaway: AGENTS.md 的核心价值不是仓库自述，而是把 Agent 的隐性操作规则变成可审计、可继承的运行契约。

## commonPitfalls
- 把 AGENTS.md 写成泛泛介绍，没有明确可写范围和禁止事项。
- 封板后不更新当前状态，导致后续 Agent 重做已完成模块。
- 只写命令，不写文件所有权和内容流水线。
- 让 AGENTS.md 与 docs/project-board.md 互相矛盾。

## diagnosticQuestion
scenario: 金融运营 Agent 频繁把“生成审批草稿”误做成“提交变更”。排查发现平台只有工具清单，没有说明团队权限、审批阈值和哪些文档是权威规则。

question: 最优先应该补什么？

- A. 先把各团队口头规则继续追加到提示词末尾
- B. 先补 Agent 操作手册，写清权限、权威来源和升级条件
- C. 先关闭提交类工具，只保留读取能力直到事故归零
- D. 先把审批阈值写入输出格式，让模型自行判断每次是否需要审批和提交

answer: B

explanation: B 是第一步，用操作手册统一权限、权威来源和升级条件。A 会继续分散规则。C 可以止血但会让业务流程瘫痪。D 把审批判断交给模型，缺少运行时契约和审计。

troubleshootingPath:
- 复盘越权动作对应的规则缺口
- 梳理角色、工具和审批边界
- 形成项目级 Agent 操作手册
- 把手册版本写入 trace
- 用高风险流程回放验证规则是否生效

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
