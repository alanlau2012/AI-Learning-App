# Trace 有数据但不可诊断 场景演练草稿

## 1. 元信息

- scenarioId：trace-not-diagnostic
- type：observability
- difficulty：advanced
- estimatedMinutes：9
- relatedConceptIds：trace, observability, eval, model-gateway, permission-governance, prompt-context, tool-calling
- entryConceptIds：trace, observability, eval, permission-governance
- capabilityDomains：evaluationObservability, securityGovernanceOrg, agentEngineering, maasPlatformization

## 2. 业务背景与初始症状

业务背景：企业 AI 工作台日均约 8 万次请求，覆盖 RAG 问答、工具调用、模型路由和人工反馈。系统已经接入 Trace 与日志平台，事故后可以看到大量 span、日志和模型输入摘要。生产约束是：不能长期保存原文全量输入，敏感字段必须最小化，事故复盘需要在 30 分钟内判断主要责任链路。

初始症状：最近一次“答案引用旧制度并触发错误审批建议”的事故中，团队导出了 12MB Trace 和日志，但仍花了 4 小时才定位。Trace 里既有过量原文字段带来的隐私风险，又缺少检索版本、prompt 模板版本、权限决策、模型路由原因、工具返回语义等关键字段。

objectLabels 建议：

- factsTitle：Trace span 与关联对象
- secondaryTitle：字段策略与数据治理
- controlTitle：可诊断性策略

## 3. 事实对象

### fact：span 覆盖链路

- id：span-coverage-chain
- title：span 覆盖链路
- description：当前只稳定记录 gateway、model_call 和 final_answer；retrieval、rerank、prompt_assembly、permission_check、tool_call、eval_feedback 等 span 覆盖不完整。
- attributes：
  - 关键链路 span 覆盖率：57%
  - span 断链率：21%
  - traceId / requestId 一致率：84%
  - 跨服务父子关系缺失率：18%
- risks：
  - 只有模型调用 span 无法判断错误来自检索、上下文、模型、权限还是工具。
  - span 断链会让事故复盘只能靠人工拼日志。

### fact：字段粒度

- id：field-granularity
- title：字段粒度
- description：部分 span 记录原文 query、完整 prompt 和工具参数，另一些 span 只记录 success/fail；既有敏感数据风险，又无法还原关键工程状态。
- attributes：
  - 原文全量字段占比：24%
  - 关键版本字段覆盖率：46%
  - 脱敏摘要覆盖率：38%
  - hash / reference id 覆盖率：41%
- risks：
  - 原文全量不是可诊断性的充分条件，反而增加留存和访问风险。
  - 只有成功失败字段不能定位上下文构造和权限决策。

### fact：关联对象

- id：correlation-objects
- title：关联对象
- description：Trace 与用户反馈、Eval 样本、发布版本、成本账单、权限事件之间没有稳定关联；事故样本很难复现到同一版本和同一策略。
- attributes：
  - feedback 关联率：52%
  - evalCaseId 覆盖率：31%
  - releaseVersion 覆盖率：44%
  - policyDecisionId 覆盖率：36%
- risks：
  - 没有 release 和 eval 关联，无法判断是版本回归还是个案数据问题。
  - 没有权限事件关联，无法证明上下文是否越权或被正确拒绝。

### fact：复盘流程

- id：incident-review-process
- title：复盘流程
- description：事故复盘依赖应用、平台、安全和业务四方手动汇总证据；日志字段命名不统一，敏感字段访问审批慢，case 级定位耗时长。
- attributes：
  - 单 case 平均排查耗时：240 分钟
  - 敏感字段访问审批耗时：2 到 6 小时
  - 复盘证据一次性取全率：34%
  - 责任链路首次判断准确率：49%
- risks：
  - 打更多日志会增加噪音和合规压力，不等于能复盘。
  - 字段最小化如果设计不当，会变成“什么都看不到”。

## 4. baseline metrics

| metricId | label | value | unit | polarity | explanation |
|---|---|---:|---|---|---|
| spanCoverageRate | 关键链路 span 覆盖率 | 57 | % | higherIsBetter | 只覆盖部分链路，检索、权限、工具和反馈 span 不稳定。 |
| diagnosticResolutionRate | 复盘可定位率 | 49 | % | higherIsBetter | 不到一半 case 能在第一轮证据内判断主要责任链路。 |
| sensitiveFieldExposureRisk | 敏感字段暴露风险 | 24 | risk points | lowerIsBetter | 原文 query、完整 prompt 和工具参数留存比例偏高。 |
| avgCaseDiagnosisMinutes | 单 case 排查耗时 | 240 | minutes | lowerIsBetter | 断链和字段缺失导致跨团队手工拼证据。 |
| feedbackCorrelationRate | feedback 关联率 | 52 | % | higherIsBetter | 用户反馈不能稳定回链到 trace、版本、策略和 eval case。 |
| releaseEvalCorrelationRate | 发布 / Eval 关联率 | 34 | % | higherIsBetter | 无法快速判断事故是否由版本回归、策略调整或数据变更触发。 |
| traceStorageCostIndex | Trace 存储成本指数 | 118 | points | lowerIsBetter | 原文全量和长期保留推高存储与访问治理成本。 |

baseline.selectedStrategies 建议：

- spanCoverageMode：criticalPathCoverage
- fieldGranularityMode：referenceIdAndHash
- correlationMode：feedbackEvalReleaseCost
- retentionMode：tieredRetentionMinimized

baseline.explanation：基线不是“记录最多”，而是关键链路 span 连贯、关键字段可还原、敏感内容最小化，并能把反馈、Eval、发布版本、成本和权限事件关联到同一个 case。

## 5. strategyControls

### control：spanCoverageMode

- id：spanCoverageMode
- label：span 覆盖
- options：
  - id：modelCallOnly
  - label：只记录模型调用
  - description：稳定记录模型输入摘要、输出摘要、token 和延迟，但不覆盖检索、权限、工具和反馈。
  - metricEffects：
    - spanCoverageRate / down / large / absolute 24：关键链路缺失。
    - diagnosticResolutionRate / down / medium / absolute 13：无法区分模型问题和上下游问题。
  - id：criticalPathCoverage
  - label：覆盖关键链路
  - description：gateway、retrieval、rerank、prompt assembly、model call、tool call、permission check、feedback 都有父子 span。
  - metricEffects：
    - spanCoverageRate / up / large / absolute 25：关键链路可串联。
    - avgCaseDiagnosisMinutes / down / large / relative 0.32：手工拼证据减少。
  - id：fullCoverageSampled
  - label：全链路覆盖但采样
  - description：全链路埋点，普通流量采样，异常、投诉、高风险和评测样本强制保留。
  - metricEffects：
    - spanCoverageRate / up / medium / absolute 18：异常样本覆盖更完整。
    - traceStorageCostIndex / down / medium / relative 0.16：用采样控制成本。

### control：fieldGranularityMode

- id：fieldGranularityMode
- label：字段粒度
- options：
  - id：rawFullText
  - label：原文全量
  - description：记录原始 query、完整 prompt、完整工具参数和完整检索片段。
  - metricEffects：
    - sensitiveFieldExposureRisk / up / large / absolute 28：隐私和合规风险显著上升。
    - traceStorageCostIndex / up / large / relative 0.35：存储和访问审批成本上升。
  - id：redactedSummary
  - label：脱敏摘要
  - description：保留意图、字段类别、错误码、摘要和必要统计量，移除直接个人或业务敏感信息。
  - metricEffects：
    - sensitiveFieldExposureRisk / down / large / absolute 14：敏感字段暴露下降。
    - diagnosticResolutionRate / mixed / small / absolute 0：摘要质量决定能否复盘。
  - id：referenceIdAndHash
  - label：引用 id + hash
  - description：用 docId、chunkId、toolCallId、policyDecisionId、templateVersion、hash 和结构化错误码还原证据，不长期留原文。
  - metricEffects：
    - sensitiveFieldExposureRisk / down / large / absolute 18：原文留存减少。
    - diagnosticResolutionRate / up / medium / absolute 10：能通过引用对象回放关键状态。

### control：correlationMode

- id：correlationMode
- label：关联策略
- options：
  - id：noCrossCorrelation
  - label：不做跨对象关联
  - description：Trace、feedback、eval、release、cost、permission 各自独立。
  - metricEffects：
    - feedbackCorrelationRate / down / large / absolute 25：投诉难以回链到证据。
    - releaseEvalCorrelationRate / down / large / absolute 20：无法判断版本回归。
  - id：feedbackOnly
  - label：只关联 feedback
  - description：把用户反馈和 traceId 关联，但不关联评测、发布、成本和权限事件。
  - metricEffects：
    - feedbackCorrelationRate / up / medium / absolute 18：投诉样本可定位到请求。
    - diagnosticResolutionRate / up / small / absolute 4：仍缺回归和权限证据。
  - id：feedbackEvalReleaseCost
  - label：关联 feedback + eval + release + cost + policy
  - description：同一 case 关联反馈、评测样本、发布版本、成本桶、模型路由原因和权限决策。
  - metricEffects：
    - diagnosticResolutionRate / up / large / absolute 20：责任链路更快收敛。
    - releaseEvalCorrelationRate / up / large / absolute 32：能判断是否由版本或策略变化触发。

### control：retentionMode

- id：retentionMode
- label：数据治理
- options：
  - id：longTermRawRetention
  - label：长期全量保留
  - description：为方便排查长期保存原文、prompt 和工具参数。
  - metricEffects：
    - sensitiveFieldExposureRisk / up / large / absolute 22：留存风险和访问审批压力上升。
    - traceStorageCostIndex / up / large / relative 0.3：存储成本上升。
  - id：shortMinimalRetention
  - label：短期最小留存
  - description：只短期保留有限摘要字段，快速删除大部分上下文证据。
  - metricEffects：
    - sensitiveFieldExposureRisk / down / medium / absolute 10：风险下降。
    - diagnosticResolutionRate / down / medium / absolute 11：证据过少导致无法回放。
  - id：tieredRetentionMinimized
  - label：分级保留 + 敏感字段最小化
  - description：普通流量保留结构化摘要和引用 id；异常、高风险、投诉和 eval 样本按审批保留可回放证据。
  - metricEffects：
    - sensitiveFieldExposureRisk / down / medium / absolute 12：原文暴露可控。
    - diagnosticResolutionRate / up / medium / absolute 12：关键样本仍可复盘。

## 6. events

### event：Trace 很多但 span 断链

- id：many-spans-broken-chain
- title：Trace 很多但 span 断链
- 触发条件：modelCallOnly + noCrossCorrelation
- 现象：日志平台有大量模型调用记录，但事故样本无法串起 retrieval、prompt assembly、model route、tool call 和 feedback。
- 正确诊断：问题不是“日志不够多”，而是关键链路 span 没有父子关系和统一 case id；必须先补关键路径，而不是继续加散点日志。
- 排查顺序：
  1. 先画出一次请求的关键链路：gateway、retrieval、rerank、prompt assembly、model call、tool call、permission check、feedback。
  2. 检查每个 span 是否有 traceId、spanId、parentSpanId、caseId 和 releaseVersion。
  3. 对事故样本标出断链位置和缺失字段。
  4. 优先补能区分责任链路的 span，而不是补所有 debug 日志。
- 遗漏风险：
  - 更多日志会增加噪音，仍不能说明上下游因果。
  - 没有 feedback 和 release 关联，会把版本回归误判为模型偶发错误。
- 下一步建议：
  - 用关键路径 span 覆盖替代散点日志堆积。
  - 把 feedback、eval、release 和 policy decision 统一关联到 caseId。
- relatedConceptIds：trace, observability, eval

### event：字段过少无法还原上下文

- id：fields-too-thin
- title：字段过少无法还原上下文
- 触发条件：shortMinimalRetention + modelCallOnly
- 现象：Trace 只记录成功失败、token 和延迟，无法知道进入 prompt 的文档版本、片段排序、模板版本和权限过滤结果。
- 正确诊断：敏感数据最小化不等于删除所有可诊断字段；应保留引用 id、hash、版本号、错误码和策略决策，而不是长期保存原文。
- 排查顺序：
  1. 先列出复盘一个错误答案所需的最小字段集合。
  2. 区分必须原文、可摘要、可 hash、可引用 id 回放的字段。
  3. 检查 docId、chunkId、templateVersion、routeReason、policyDecisionId 是否覆盖。
  4. 对异常样本配置受控回放证据保留。
- 遗漏风险：
  - 字段过少会让事故复盘只能靠猜测。
  - 过度最小化会让 Eval 和发布回归无法闭环。
- 下一步建议：
  - 建立字段分级：原文禁止默认留存，引用 id、hash、版本和错误码默认保留。
  - 对投诉、高风险和 eval case 保留受控可回放证据。
- relatedConceptIds：trace, permission-governance, prompt-context

### event：字段过多造成敏感数据风险

- id：raw-fields-privacy-risk
- title：字段过多造成敏感数据风险
- 触发条件：rawFullText + longTermRawRetention
- 现象：事故复盘拿到了完整 prompt 和工具参数，但安全团队发现其中包含个人信息、合同条款和内部审批意见，访问审批阻塞后续复盘。
- 正确诊断：可诊断性不能建立在长期全量原文留存上；应将敏感原文改为短期受控证据，常规 Trace 保留结构化摘要、引用 id、hash 和版本。
- 排查顺序：
  1. 先盘点 Trace 中哪些字段包含个人、合同、权限、财务或审批敏感信息。
  2. 判断每个字段在复盘中是否必须原文，还是可用摘要、hash 或引用 id 替代。
  3. 检查留存周期、访问审批、脱敏策略和审计记录。
  4. 对高风险字段设定默认不采集或短期隔离保留。
- 遗漏风险：
  - 全量原文会扩大数据泄露和合规风险。
  - 访问审批变慢会让事故复盘错过最佳窗口。
  - 安全团队可能要求关闭 Trace，反而损伤长期可观测能力。
- 下一步建议：
  - 将常规 Trace 切到脱敏摘要与引用 id。
  - 建立异常样本的短期受控取证流程和访问审计。
- relatedConceptIds：permission-governance, trace, observability

### event：无法判断是否版本回归

- id：release-regression-unknown
- title：没有关联评测和发布版本
- 触发条件：feedbackOnly + shortMinimalRetention
- 现象：用户反馈集中在某类问题，但 Trace 不能关联 eval case、releaseVersion、prompt template version 和模型路由策略，团队无法判断是版本回归、数据更新还是个案权限问题。
- 正确诊断：只把 feedback 连到请求还不够；负责人需要把 feedback 与 Eval、发布版本、策略版本、成本桶和权限事件连起来，才能做回滚、灰度或修复决策。
- 排查顺序：
  1. 先按 feedback 聚类找高频失败类型。
  2. 查看这些 case 是否集中在某个 release、prompt template、retrieval index 或 routing strategy。
  3. 对比上线前后 Eval 命中率和人工审核样本。
  4. 再决定回滚、灰度降级、修数据还是补权限策略。
- 遗漏风险：
  - 没有关联版本会把系统性回归当成单点投诉。
  - 没有关联 Eval 会让修复后无法证明问题已关闭。
- 下一步建议：
  - 给 Trace 统一补 releaseVersion、templateVersion、evalCaseId 和 strategyVersion。
  - 把事故样本加入回放集，作为后续发布门禁。
- relatedConceptIds：eval, observability, model-gateway

## 7. reviewRubric

- prompt：请判断为什么“Trace 有很多数据但仍不可诊断”，并说明你会如何按 span 覆盖、字段粒度、敏感数据最小化、反馈 / Eval / 发布关联和治理留存顺序改造。
- requiredFindings：
  - 必须区分可观测设计和随手打日志，不能只建议“多打日志”。
  - 必须指出关键链路 span、父子关系、caseId 和版本字段是复盘基础。
  - 必须说明敏感数据最小化不是删除证据，而是用摘要、hash、引用 id、版本和受控回放替代长期原文。
  - 必须要求 Trace 关联 feedback、eval、release、cost、route reason 和 policy decision。
- acceptableActions：
  - 补齐 gateway、retrieval、rerank、prompt assembly、model call、tool call、permission check、feedback 的关键路径 span。
  - 建立字段分级：原文、脱敏摘要、hash、reference id、版本号、错误码和策略决策。
  - 对异常、高风险、投诉和 eval 样本采用分级保留与受控取证。
  - 用 releaseVersion、templateVersion、evalCaseId 和 policyDecisionId 支撑回归判断。
- nextStepRecommendations：
  - 回看 trace、observability、eval、permission-governance、model-gateway 和 prompt-context。
  - 用最近 20 个投诉样本做一次 Trace 可诊断性审计，记录每个 case 首个断点。

## 8. 自检

| 项目 | 结论 | 证据 |
|---|---|---|
| 是否训练跨知识点判断 | 通过 | 同时覆盖 Trace、Observability、Eval、模型网关、权限治理、Prompt Context 和工具调用。 |
| 是否有生产症状和指标 | 通过 | 有日均 8 万请求、12MB Trace、4 小时定位、span 覆盖率、字段风险、复盘耗时等指标。 |
| 指标变化是否可解释 | 通过 | 每个策略选项都绑定 span 覆盖、可定位率、敏感风险、耗时、关联率或成本指数。 |
| 是否有强干扰策略 | 通过 | 原文全量、长期全量保留、只关联 feedback、短期最小留存都是看似合理但有明显取舍风险的策略。 |
| 排查顺序是否真实 | 通过 | 先补关键路径和关联字段，再处理字段分级与留存治理。 |
| 是否含敏感信息 | 通过 | 使用抽象业务类型和模拟指标，无真实客户、真实合同、真实系统或价格。 |
| relatedConceptIds 无悬空 | 待主开发复核 | 已按当前 src/data/concepts.ts 真实 id 选择：trace、observability、eval、model-gateway、permission-governance、prompt-context、tool-calling。 |

## 9. 需要审核 Agent 重点看的点

- `sensitiveFieldExposureRisk` 与 `traceStorageCostIndex` 是模拟指标，不对应真实价格或真实风险评分；入库时建议保留解释，避免被误读为行业 benchmark。
- `shortMinimalRetention` 是强干扰项：它降低敏感风险但损伤复盘能力，审核时应确认描述没有鼓励过度采集或过度删除。
- 事件 `release-regression-unknown` 依赖发布版本和 Eval 关联字段，主开发入库时需确认当前 UI 能清楚呈现“关联对象”而不是只显示指标变化。
