# 仓库上下文

## oneSentence
仓库上下文是开发 Agent 执行任务前需要读取和整理的项目事实集合，包括架构文档、类型定义、入口文件、测试、验证命令、Git 状态和近期变更。

## whyItMatters
代码 Agent 的很多错误不是写代码能力不足，而是读错项目事实。仓库越大，越需要有选择地收集上下文：读太少会误判架构，读太多会淹没关键约束。

## mentalModel
仓库上下文像手术前的病历摘要：医生不需要背完整医院档案，但必须知道病史、禁忌、影像、当前用药和这次手术的目标部位。

## mechanism
- 先读 AGENTS.md、README、project-board 和相关规格，确认当前阶段和不可破坏约定。
- 再定位任务相关的类型、数据源、组件、工具函数和测试，而不是全仓库漫游。
- 用 Git 状态区分自己的改动、用户已有改动和未跟踪文件，避免误删或覆盖。
- 把上下文压缩成可执行判断：该改哪些文件、不能改哪些文件、验收跑哪些命令。
- 遇到规格冲突时，以权威文档和现有测试为准，并把冲突显式登记。

## animationBrief
无。

## enterpriseCase
- title: 代码助手只读组件导致进度口径改错
- scenario: 一个学习应用请 Agent 修改模块页进度展示，仓库有 docs/content-schema.md、progressStore 和 progress utils 三处相关事实。
- problem: Agent 只读了 ModulePage，把总进度改成只统计已发布内容，结果和 56 讲地图口径冲突，E2E 发现模块计数不一致。
- analysis: 执行前没有建立仓库上下文包，忽略了 content-schema 中 56 讲权威计数和 progress.ts 的派生计算约定。
- solution: 重新收集 AGENTS.md、content-schema、progress utils 和模块页调用链，确认总进度按 56 讲、主路径按 published 过滤，再做局部修复。
- takeaway: 仓库上下文不是读最多文件，而是读对能决定行为口径的文件。

## commonPitfalls
- 只读报错文件，不读调用链和权威规格。
- 把搜索结果数量当成理解程度，缺少结构化判断。
- 忽略 Git dirty 状态，覆盖用户已有改动。
- 不记录上下文来源，后续复盘不知道决策依据。
- 把过期报告当成当前状态。

## diagnosticQuestion
scenario: Agent 接到“修正模块进度”的任务后只读了页面组件，把总进度改成只统计 published 内容。后来发现 docs/content-schema.md 明确 56 讲地图必须完整保留，progress.ts 也有总进度派生约定。

question: 下一次最应该如何避免同类问题？

- A. 先把全仓库所有文件都塞进上下文
- B. 只依赖 TypeScript 报错定位相关文件
- C. 让用户口头确认每个字段含义
- D. 建立任务相关仓库上下文包：权威规格、数据源、调用链、测试和 Git 状态

answer: D

explanation: D 用最小但关键的事实集合约束实现。A 会造成上下文噪音。B 只能发现类型问题，不能发现产品口径。C 成本高且很多事实可从仓库读取。

troubleshootingPath:
- 确认任务影响的用户行为
- 读取 AGENTS.md 和权威规格
- 追踪数据源与派生工具
- 检查 Git 状态和近期报告
- 把验收命令绑定到改动范围

## keyTakeaways
- 仓库上下文要服务实现判断，不是机械读取更多文件。
- 权威规格、数据源、调用链、测试和 Git 状态是开发前核心事实。
- 上下文包越清晰，Agent 越不容易越界重构或覆盖用户改动。

## relatedConcepts
- agents-md
- context-compression
- spec-driven-development
- issue-fix-agent
- code-review-agent
