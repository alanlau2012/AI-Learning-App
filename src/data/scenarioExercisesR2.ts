import type { ScenarioExercise } from '../types';

export const scenarioExercisesR2: ScenarioExercise[] = [
  {
    id: 'agent-tool-failure',
    type: 'agentTooling',
    title: 'Agent 工具调用失败诊断',
    subtitle: '判断工具协议、参数校验、权限、重试和人工接管边界',
    difficulty: 'advanced',
    estimatedMinutes: 9,
    relatedConceptIds: ['tool-calling', 'agent-loop', 'permission-governance', 'trace', 'human-in-the-loop', 'observability', 'eval'],
    entryConceptIds: ['tool-calling', 'permission-governance', 'trace', 'agent-loop'],
    capabilityDomains: ['agentEngineering', 'securityGovernanceOrg', 'evaluationObservability'],
    background: '企业把运维、采购和报销流程接入统一 Agent 工作台，日均约 1800 个任务，Agent 可调用 36 个工具，其中包含只读查询、写入、审批和通知工具。',
    initialSymptom: '新版工具描述和重试策略上线后，工具调用成功率从 94% 降到 82%，参数业务错误率升到 9.6%，重复写操作告警增加。',
    objectLabels: {
      factsTitle: '工具链与失败样本',
      secondaryTitle: '调用状态与权限边界',
      controlTitle: '工具治理策略',
    },
    facts: [
      {
        id: 'tool-catalog',
        title: '工具清单',
        description: '工具按副作用分为只读、低风险写入、高风险写入和外部通知，存在 queryInvoice、createInvoice、submitInvoiceApproval 等相似工具名。',
        weight: 0.28,
        attributes: [
          { label: '工具总数', value: '36' },
          { label: '高风险写工具', value: '6' },
          { label: '相似工具名组', value: '4' },
          { label: '默认协议', value: 'JSON schema + tool description' },
        ],
        risks: ['宽泛描述容易让模型按语义近似选择错误工具。', '高风险写工具不能只靠自然语言提示约束。'],
      },
      {
        id: 'tool-call-chain',
        title: '调用链路',
        description: '任务经过意图识别、工具选择、参数生成、权限检查、工具执行、结果解释、状态写回七步；当前 Trace 缺参数校验失败原因、权限主体和幂等键。',
        weight: 0.26,
        attributes: [
          { label: '平均任务步数', value: '7.8' },
          { label: '工具返回码覆盖率', value: '96%' },
          { label: '参数失败原因覆盖率', value: '43%' },
          { label: '幂等键记录率', value: '58%' },
        ],
        risks: ['只看最终工具失败无法判断错误层。', '缺少幂等键会让自动重试变成重复写入风险。'],
      },
      {
        id: 'permission-and-approval',
        title: '权限与审批状态',
        description: '用户委托权限、角色权限、审批证据和操作级 allowlist 分散在不同系统，部分工具调用使用 Agent 服务账号兜底。',
        weight: 0.24,
        attributes: [
          { label: '用户委托权限覆盖率', value: '76%' },
          { label: '高风险二次确认覆盖率', value: '62%' },
          { label: '服务账号调用占比', value: '18%' },
          { label: '审批证据可追溯率', value: '69%' },
        ],
        risks: ['Agent 统一权限会扩大 blast radius。', '审批证据缺失时，操作成功也不能算生产可接受。'],
      },
      {
        id: 'failure-samples',
        title: '失败样本',
        description: '失败样本分为错调相似工具、参数类型合法但业务语义错误、权限主体不匹配、工具瞬时失败后重复调用、工具成功但 Agent 误解返回结果。',
        weight: 0.22,
        attributes: [
          { label: '错调工具占比', value: '27%' },
          { label: '参数业务错误占比', value: '31%' },
          { label: '权限拒绝占比', value: '19%' },
          { label: '重复调用占比', value: '11%' },
        ],
        risks: ['把所有失败归因到 prompt 会漏掉权限和状态管理。', '全量自动重试会把不可恢复错误放大成生产事故。'],
      },
    ],
    baseline: {
      selectedStrategies: {
        toolDescriptionMode: 'preconditionExamples',
        permissionMode: 'delegatedUserPermission',
        failureHandlingMode: 'classifiedRetry',
      },
      metrics: [
        { id: 'toolSuccessRate', label: '工具调用成功率', value: 82, unit: '%', trend: 'worse', polarity: 'higherIsBetter', min: 60, max: 98, explanation: '当前成功率低于上线前水平，失败混合了工具选择、参数、权限和执行问题。' },
        { id: 'parameterBusinessErrorRate', label: '参数业务错误率', value: 9.6, unit: '%', trend: 'worse', polarity: 'lowerIsBetter', min: 1, max: 22, explanation: '类型校验能通过，但业务字段不满足金额、币种、审批状态或对象归属规则。' },
        { id: 'unauthorizedAttemptInterceptRate', label: '越权尝试拦截率', value: 88, unit: '%', trend: 'neutral', polarity: 'higherIsBetter', min: 55, max: 99, explanation: '大部分越权调用被拦截，但服务账号兜底让审计主体不稳定。' },
        { id: 'duplicateSideEffectRate', label: '重复副作用率', value: 4.2, unit: '%', trend: 'worse', polarity: 'lowerIsBetter', min: 0, max: 14, explanation: '重试缺少幂等键和错误分类，写工具出现重复提交风险。' },
        { id: 'humanHandoffRate', label: '人工接管率', value: 14.5, unit: '%', trend: 'neutral', polarity: 'lowerIsBetter', min: 3, max: 36, explanation: '接管率升高说明系统正在自保，但也暴露自动诊断和恢复能力不足。' },
        { id: 'avgTaskSteps', label: '平均任务步数', value: 7.8, unit: 'steps', trend: 'worse', polarity: 'lowerIsBetter', min: 3, max: 14, explanation: '平均步数上升来自错调工具后的补救、重复调用和权限失败重试。' },
      ],
      explanation: '基线代表可上线的最低治理线：工具描述明确前置条件和反例，权限以用户委托和操作级边界为准，失败处理先分类再决定重试、升级或人工接管。',
    },
    strategyControls: [
      {
        id: 'toolDescriptionMode',
        label: '工具描述',
        options: [
          { id: 'broadNaturalLanguage', label: '宽泛自然语言', description: '工具描述只写用途，不写前置条件、禁止场景和 side effect。', routingRules: [], metricEffects: [{ metricId: 'toolSuccessRate', direction: 'down', magnitude: 'medium', deltaMode: 'absolute', delta: 6, explanation: '相似工具更容易被错选。' }, { metricId: 'avgTaskSteps', direction: 'up', magnitude: 'medium', deltaMode: 'relative', delta: 0.12, explanation: '错调后需要补救步骤。' }] },
          { id: 'preconditionExamples', label: '前置条件 + 反例 + 风险标签', description: '在工具描述中加入正反例、危险字段、是否有副作用和失败后处理边界。', routingRules: [], metricEffects: [{ metricId: 'toolSuccessRate', direction: 'up', magnitude: 'large', deltaMode: 'absolute', delta: 8, explanation: '相似工具误选下降。' }, { metricId: 'duplicateSideEffectRate', direction: 'down', magnitude: 'small', deltaMode: 'absolute', delta: 1, explanation: '模型更少把写工具当查询工具重试。' }] },
        ],
      },
      {
        id: 'permissionMode',
        label: '权限策略',
        options: [
          { id: 'agentSharedPermission', label: 'Agent 统一权限', description: 'Agent 用服务账号统一调用工具，用户身份只写入日志。', routingRules: [], metricEffects: [{ metricId: 'toolSuccessRate', direction: 'up', magnitude: 'small', deltaMode: 'absolute', delta: 2, explanation: '权限拒绝减少但不是安全提升。' }, { metricId: 'unauthorizedAttemptInterceptRate', direction: 'down', magnitude: 'large', deltaMode: 'absolute', delta: 14, explanation: '越权风险和审计主体混乱增加。' }] },
          { id: 'delegatedUserPermission', label: '用户委托权限', description: '每次工具调用绑定用户、租户、角色和任务授权范围。', routingRules: [], metricEffects: [{ metricId: 'unauthorizedAttemptInterceptRate', direction: 'up', magnitude: 'medium', deltaMode: 'absolute', delta: 8, explanation: '权限主体清晰。' }, { metricId: 'toolSuccessRate', direction: 'mixed', magnitude: 'small', deltaMode: 'absolute', delta: 0, explanation: '成功率取决于授权覆盖率。' }] },
          { id: 'operationMinPrivilege', label: '操作级最小权限', description: '按工具、动作、资源和字段做 allowlist，高风险写入必须有审批证据。', routingRules: [], metricEffects: [{ metricId: 'unauthorizedAttemptInterceptRate', direction: 'up', magnitude: 'large', deltaMode: 'absolute', delta: 11, explanation: '越权调用更早拦截。' }, { metricId: 'humanHandoffRate', direction: 'up', magnitude: 'medium', deltaMode: 'absolute', delta: 4, explanation: '缺证据任务会升级。' }] },
        ],
      },
      {
        id: 'failureHandlingMode',
        label: '失败处理',
        options: [
          { id: 'retryAll', label: '失败即自动重试', description: '任何工具失败都自动重试一次。', routingRules: [], metricEffects: [{ metricId: 'duplicateSideEffectRate', direction: 'up', magnitude: 'large', deltaMode: 'absolute', delta: 5, explanation: '不可幂等写工具重复提交风险上升。' }, { metricId: 'avgTaskSteps', direction: 'up', magnitude: 'large', deltaMode: 'relative', delta: 0.22, explanation: '无效重试拉长任务链。' }] },
          { id: 'classifiedRetry', label: '分类重试', description: '只对瞬时网络、限流和可幂等读操作重试；参数、权限、状态机错误直接修正或升级。', routingRules: [], metricEffects: [{ metricId: 'toolSuccessRate', direction: 'up', magnitude: 'medium', deltaMode: 'absolute', delta: 5, explanation: '瞬时错误可恢复，不可恢复错误不再放大。' }, { metricId: 'duplicateSideEffectRate', direction: 'down', magnitude: 'large', deltaMode: 'absolute', delta: 3, explanation: '写操作受幂等和分类保护。' }] },
        ],
      },
    ],
    events: [
      { id: 'similar-tool-misfire', title: '工具名相似导致错调', symptom: 'Agent 本应查询 invoice 状态，却调用 createInvoice 或 submitInvoiceApproval，工具返回成功但业务对象被错误推进。', triggerStrategyOptionIds: ['broadNaturalLanguage'], correctDiagnosis: '第一层不是模型不会用工具，而是工具协议缺少前置条件、side effect 标签和反例；类型校验也没有阻止语义错误。', investigationOrder: ['查看 tool.name、intent、arguments、sideEffectType 和业务对象状态。', '对失败样本分型：工具选择、参数、权限、执行、结果解释。', '核对工具描述是否写清禁止调用场景和替代查询工具。'], missedRisks: ['只调 prompt 会继续让工具协议保持含糊。', '工具执行成功不代表业务动作正确。'], relatedConceptIds: ['tool-calling', 'trace', 'eval'], nextStepRecommendations: ['在 Trace 中记录意图、候选工具、最终工具和拒绝原因。', '将相似工具样本加入工具调用 Eval。'] },
      { id: 'write-permission-bypass', title: '高风险写工具绕过审批', symptom: '服务账号可以调用写工具，Trace 中只看到 Agent 身份，看不到用户委托范围和审批证据。', triggerStrategyOptionIds: ['agentSharedPermission'], correctDiagnosis: '权限策略把生产安全换成了表面成功率。高风险写工具必须按用户、资源、动作、字段做最小权限，并保留审批证据。', investigationOrder: ['确认 tool call 的实际执行主体是用户委托还是 Agent 服务账号。', '核对调用资源是否在用户授权范围内。', '查看高风险字段是否有审批证据和二次确认。'], missedRisks: ['表面成功率提升会掩盖越权和审计风险。', '服务账号兜底会扩大事故影响面。'], relatedConceptIds: ['permission-governance', 'tool-calling', 'trace'], nextStepRecommendations: ['高风险工具切换到用户委托权限和操作级 allowlist。', 'Trace 记录 subject、tenant、resource、action、policyDecision 和 evidenceId。'] },
      { id: 'retry-duplicate-side-effect', title: '自动重试造成重复提交', symptom: '失败即重试让部分写工具重复执行，业务侧出现重复采购单或重复通知。', triggerStrategyOptionIds: ['retryAll'], correctDiagnosis: '重试策略没有区分可幂等读、可安全重试写、不可恢复业务错误和未知状态写失败；确认机制不能替代幂等与状态管理。', investigationOrder: ['按工具 side effect 类型拆分重试样本。', '检查写工具是否有 idempotency key、业务单据状态和去重窗口。', '对未知状态写失败优先查询状态或人工接管。'], missedRisks: ['重试会把一次小故障放大成重复副作用。', '只看工具返回失败会忽略提交成功但响应丢失的未知状态。'], relatedConceptIds: ['agent-loop', 'tool-calling', 'human-in-the-loop'], nextStepRecommendations: ['只对可幂等读和明确可恢复错误自动重试。', '写工具必须引入幂等键、状态查询和人工接管边界。'] },
    ],
    reviewRubric: {
      prompt: '请判断 Agent 工具调用失败的主要来源，并说明你会如何按工具协议、参数校验、权限主体、状态管理、重试和人工接管顺序排查。',
      requiredFindings: ['必须先把失败分型为工具选择、参数、权限、执行、结果解释和状态写回。', '必须指出高风险写工具不能只靠 prompt 或工具描述约束。', '必须识别失败即重试对不可幂等写操作的重复副作用风险。', '必须要求 Trace 记录工具名、参数摘要、权限主体、policy decision、幂等键和失败原因。'],
      acceptableActions: ['为工具描述补前置条件、反例、side effect 和风险标签。', '从 Agent 统一权限切到用户委托权限或操作级最小权限。', '采用分类重试，对未知状态写失败查询状态或人工接管。'],
      nextStepRecommendations: ['回看 tool-calling、agent-loop、permission-governance、trace 和 human-in-the-loop。', '用失败样本建立工具调用回放集，按失败类型和风险等级评估策略。'],
    },
  },
  {
    id: 'trace-not-diagnostic',
    type: 'observability',
    title: 'Trace 有数据但不可诊断',
    subtitle: '区分日志堆积、span 断链、字段缺失和敏感数据最小化',
    difficulty: 'advanced',
    estimatedMinutes: 9,
    relatedConceptIds: ['trace', 'observability', 'eval', 'model-gateway', 'permission-governance', 'prompt-context', 'tool-calling'],
    entryConceptIds: ['trace', 'observability', 'eval', 'permission-governance'],
    capabilityDomains: ['evaluationObservability', 'securityGovernanceOrg', 'agentEngineering', 'maasPlatformization'],
    background: '企业 AI 工作台日均约 8 万次请求，覆盖 RAG 问答、工具调用、模型路由和人工反馈。系统已接入 Trace 与日志平台，但不能长期保存原文全量输入。',
    initialSymptom: '一次答案引用旧制度并触发错误审批建议的事故中，团队导出 12MB Trace 和日志，却花了 4 小时才定位责任链路。',
    objectLabels: {
      factsTitle: 'Trace span 与关联对象',
      secondaryTitle: '字段策略与数据治理',
      controlTitle: '可诊断性策略',
    },
    facts: [
      { id: 'span-coverage-chain', title: 'span 覆盖链路', description: '当前只稳定记录 gateway、model_call 和 final_answer；retrieval、rerank、prompt_assembly、permission_check、tool_call、eval_feedback 等 span 覆盖不完整。', weight: 0.28, attributes: [{ label: '关键链路覆盖率', value: '57%' }, { label: 'span 断链率', value: '21%' }, { label: 'traceId/requestId 一致率', value: '84%' }, { label: '父子关系缺失率', value: '18%' }], risks: ['只有模型调用 span 无法判断错误来自检索、上下文、模型、权限还是工具。', 'span 断链会让事故复盘只能靠人工拼日志。'] },
      { id: 'field-granularity', title: '字段粒度', description: '部分 span 记录原文 query、完整 prompt 和工具参数，另一些 span 只记录 success/fail；既有敏感数据风险，又无法还原关键工程状态。', weight: 0.25, attributes: [{ label: '原文全量字段占比', value: '24%' }, { label: '关键版本字段覆盖率', value: '46%' }, { label: '脱敏摘要覆盖率', value: '38%' }, { label: 'hash/reference id 覆盖率', value: '41%' }], risks: ['原文全量不是可诊断性的充分条件。', '只有成功失败字段不能定位上下文构造和权限决策。'] },
      { id: 'correlation-objects', title: '关联对象', description: 'Trace 与用户反馈、Eval 样本、发布版本、成本账单、权限事件之间没有稳定关联，事故样本很难复现到同一版本和同一策略。', weight: 0.24, attributes: [{ label: 'feedback 关联率', value: '52%' }, { label: 'evalCaseId 覆盖率', value: '31%' }, { label: 'releaseVersion 覆盖率', value: '44%' }, { label: 'policyDecisionId 覆盖率', value: '36%' }], risks: ['没有 release 和 eval 关联，无法判断是版本回归还是个案数据问题。', '没有权限事件关联，无法证明上下文是否越权或被正确拒绝。'] },
      { id: 'incident-review-process', title: '复盘流程', description: '事故复盘依赖应用、平台、安全和业务四方手动汇总证据；日志字段命名不统一，敏感字段访问审批慢，case 级定位耗时长。', weight: 0.23, attributes: [{ label: '单 case 排查耗时', value: '240 分钟' }, { label: '敏感字段访问审批耗时', value: '2 到 6 小时' }, { label: '证据一次性取全率', value: '34%' }, { label: '责任链路首次判断准确率', value: '49%' }], risks: ['打更多日志会增加噪音和合规压力，不等于能复盘。', '字段最小化如果设计不当，会变成什么都看不到。'] },
    ],
    baseline: {
      selectedStrategies: {
        spanCoverageMode: 'criticalPathCoverage',
        fieldGranularityMode: 'referenceIdAndHash',
        correlationMode: 'feedbackEvalReleaseCost',
      },
      metrics: [
        { id: 'spanCoverageRate', label: '关键链路 span 覆盖率', value: 57, unit: '%', trend: 'worse', polarity: 'higherIsBetter', min: 30, max: 99, explanation: '只覆盖部分链路，检索、权限、工具和反馈 span 不稳定。' },
        { id: 'diagnosticResolutionRate', label: '复盘可定位率', value: 49, unit: '%', trend: 'worse', polarity: 'higherIsBetter', min: 20, max: 96, explanation: '不到一半 case 能在第一轮证据内判断主要责任链路。' },
        { id: 'sensitiveFieldExposureRisk', label: '敏感字段暴露风险', value: 24, unit: 'risk points', trend: 'worse', polarity: 'lowerIsBetter', min: 0, max: 80, explanation: '原文 query、完整 prompt 和工具参数留存比例偏高。' },
        { id: 'avgCaseDiagnosisMinutes', label: '单 case 排查耗时', value: 240, unit: 'minutes', trend: 'worse', polarity: 'lowerIsBetter', min: 15, max: 360, explanation: '断链和字段缺失导致跨团队手工拼证据。' },
        { id: 'feedbackCorrelationRate', label: 'feedback 关联率', value: 52, unit: '%', trend: 'neutral', polarity: 'higherIsBetter', min: 20, max: 98, explanation: '用户反馈不能稳定回链到 trace、版本、策略和 eval case。' },
        { id: 'releaseEvalCorrelationRate', label: '发布/Eval 关联率', value: 34, unit: '%', trend: 'worse', polarity: 'higherIsBetter', min: 10, max: 95, explanation: '无法快速判断事故是否由版本回归、策略调整或数据变更触发。' },
      ],
      explanation: '基线不是记录最多，而是关键链路 span 连贯、关键字段可还原、敏感内容最小化，并能把反馈、Eval、发布版本、成本和权限事件关联到同一个 case。',
    },
    strategyControls: [
      { id: 'spanCoverageMode', label: 'span 覆盖', options: [
        { id: 'modelCallOnly', label: '只记录模型调用', description: '稳定记录模型输入摘要、输出摘要、token 和延迟，但不覆盖检索、权限、工具和反馈。', routingRules: [], metricEffects: [{ metricId: 'spanCoverageRate', direction: 'down', magnitude: 'large', deltaMode: 'absolute', delta: 24, explanation: '关键链路缺失。' }, { metricId: 'diagnosticResolutionRate', direction: 'down', magnitude: 'medium', deltaMode: 'absolute', delta: 13, explanation: '无法区分模型问题和上下游问题。' }] },
        { id: 'criticalPathCoverage', label: '覆盖关键链路', description: 'gateway、retrieval、rerank、prompt assembly、model call、tool call、permission check、feedback 都有父子 span。', routingRules: [], metricEffects: [{ metricId: 'spanCoverageRate', direction: 'up', magnitude: 'large', deltaMode: 'absolute', delta: 25, explanation: '关键链路可串联。' }, { metricId: 'avgCaseDiagnosisMinutes', direction: 'down', magnitude: 'large', deltaMode: 'relative', delta: 0.32, explanation: '手工拼证据减少。' }] },
      ] },
      { id: 'fieldGranularityMode', label: '字段粒度', options: [
        { id: 'rawFullText', label: '原文全量', description: '记录原始 query、完整 prompt、完整工具参数和完整检索片段。', routingRules: [], metricEffects: [{ metricId: 'sensitiveFieldExposureRisk', direction: 'up', magnitude: 'large', deltaMode: 'absolute', delta: 28, explanation: '隐私和合规风险显著上升。' }, { metricId: 'avgCaseDiagnosisMinutes', direction: 'down', magnitude: 'small', deltaMode: 'relative', delta: 0.08, explanation: '短期排查略快，但合规成本升高。' }] },
        { id: 'referenceIdAndHash', label: '引用 id + hash', description: '用 docId、chunkId、toolCallId、policyDecisionId、templateVersion、hash 和结构化错误码还原证据，不长期留原文。', routingRules: [], metricEffects: [{ metricId: 'sensitiveFieldExposureRisk', direction: 'down', magnitude: 'large', deltaMode: 'absolute', delta: 18, explanation: '原文留存减少。' }, { metricId: 'diagnosticResolutionRate', direction: 'up', magnitude: 'medium', deltaMode: 'absolute', delta: 10, explanation: '能通过引用对象回放关键状态。' }] },
      ] },
      { id: 'correlationMode', label: '关联策略', options: [
        { id: 'feedbackOnly', label: '只关联 feedback', description: '把用户反馈和 traceId 关联，但不关联评测、发布、成本和权限事件。', routingRules: [], metricEffects: [{ metricId: 'feedbackCorrelationRate', direction: 'up', magnitude: 'medium', deltaMode: 'absolute', delta: 18, explanation: '投诉样本可定位到请求。' }, { metricId: 'releaseEvalCorrelationRate', direction: 'down', magnitude: 'medium', deltaMode: 'absolute', delta: 10, explanation: '仍无法判断版本回归。' }] },
        { id: 'feedbackEvalReleaseCost', label: '关联 feedback + eval + release + cost + policy', description: '同一 case 关联反馈、评测样本、发布版本、成本桶、模型路由原因和权限决策。', routingRules: [], metricEffects: [{ metricId: 'diagnosticResolutionRate', direction: 'up', magnitude: 'large', deltaMode: 'absolute', delta: 20, explanation: '责任链路更快收敛。' }, { metricId: 'releaseEvalCorrelationRate', direction: 'up', magnitude: 'large', deltaMode: 'absolute', delta: 32, explanation: '能判断是否由版本或策略变化触发。' }] },
      ] },
    ],
    events: [
      { id: 'many-spans-broken-chain', title: 'Trace 很多但 span 断链', symptom: '日志平台有大量模型调用记录，但事故样本无法串起 retrieval、prompt assembly、model route、tool call 和 feedback。', triggerStrategyOptionIds: ['modelCallOnly'], correctDiagnosis: '问题不是日志不够多，而是关键链路 span 没有父子关系和统一 case id；必须先补关键路径，而不是继续加散点日志。', investigationOrder: ['画出一次请求的关键链路。', '检查每个 span 是否有 traceId、spanId、parentSpanId、caseId 和 releaseVersion。', '对事故样本标出断链位置和缺失字段。'], missedRisks: ['更多日志会增加噪音，仍不能说明上下游因果。', '没有 feedback 和 release 关联，会把版本回归误判为模型偶发错误。'], relatedConceptIds: ['trace', 'observability', 'eval'], nextStepRecommendations: ['用关键路径 span 覆盖替代散点日志堆积。', '把 feedback、eval、release 和 policy decision 统一关联到 caseId。'] },
      { id: 'fields-too-thin', title: '字段过少无法还原上下文', symptom: 'Trace 只记录成功失败、token 和延迟，无法知道进入 prompt 的文档版本、片段排序、模板版本和权限过滤结果。', triggerStrategyOptionIds: ['modelCallOnly', 'feedbackOnly'], correctDiagnosis: '敏感数据最小化不等于删除所有可诊断字段；应保留引用 id、hash、版本号、错误码和策略决策，而不是长期保存原文。', investigationOrder: ['列出复盘错误答案所需的最小字段集合。', '区分必须原文、可摘要、可 hash、可引用 id 回放的字段。', '检查 docId、chunkId、templateVersion、routeReason、policyDecisionId 是否覆盖。'], missedRisks: ['字段过少会让事故复盘只能靠猜测。', '过度最小化会让 Eval 和发布回归无法闭环。'], relatedConceptIds: ['trace', 'permission-governance', 'prompt-context'], nextStepRecommendations: ['建立字段分级：原文禁止默认留存，引用 id、hash、版本和错误码默认保留。', '对投诉、高风险和 eval case 保留受控可回放证据。'] },
      { id: 'raw-fields-privacy-risk', title: '字段过多造成敏感数据风险', symptom: '事故复盘拿到了完整 prompt 和工具参数，但安全团队发现其中包含个人信息、合同条款和内部审批意见。', triggerStrategyOptionIds: ['rawFullText'], correctDiagnosis: '可诊断性不能建立在长期全量原文留存上；应将敏感原文改为短期受控证据，常规 Trace 保留结构化摘要、引用 id、hash 和版本。', investigationOrder: ['盘点 Trace 中哪些字段包含个人、合同、权限、财务或审批敏感信息。', '判断每个字段是否必须原文，还是可用摘要、hash 或引用 id 替代。', '检查留存周期、访问审批、脱敏策略和审计记录。'], missedRisks: ['全量原文会扩大数据泄露和合规风险。', '访问审批变慢会让事故复盘错过最佳窗口。'], relatedConceptIds: ['permission-governance', 'trace', 'observability'], nextStepRecommendations: ['将常规 Trace 切到脱敏摘要与引用 id。', '建立异常样本的短期受控取证流程和访问审计。'] },
    ],
    reviewRubric: {
      prompt: '请判断为什么 Trace 有很多数据但仍不可诊断，并说明你会如何按 span 覆盖、字段粒度、敏感数据最小化、反馈/Eval/发布关联和治理留存顺序改造。',
      requiredFindings: ['必须区分可观测设计和随手打日志，不能只建议多打日志。', '必须指出关键链路 span、父子关系、caseId 和版本字段是复盘基础。', '必须说明敏感数据最小化不是删除证据，而是用摘要、hash、引用 id、版本和受控回放替代长期原文。'],
      acceptableActions: ['补齐 gateway、retrieval、rerank、prompt assembly、model call、tool call、permission check、feedback 的关键路径 span。', '建立字段分级：原文、脱敏摘要、hash、reference id、版本号、错误码和策略决策。', '用 releaseVersion、templateVersion、evalCaseId 和 policyDecisionId 支撑回归判断。'],
      nextStepRecommendations: ['回看 trace、observability、eval、permission-governance、model-gateway 和 prompt-context。', '用最近 20 个投诉样本做一次 Trace 可诊断性审计，记录每个 case 首个断点。'],
    },
  },
];
