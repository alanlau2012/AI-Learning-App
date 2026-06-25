/**
 * 内容结构门禁（分级 validate:*）。
 *
 * - structure          (P1.5 起始终)：56 登记 / 模块计数 10/10/8/16/6/6 / id·slug 唯一 /
 *                      moduleId·order 合法 / modules.conceptIds 一致 / 关联无悬空 /
 *                      contentStatus 合法 / 诊断题结构。不碰动画、不要求 stub 正文。
 * - published-content  (有 demo/mvp 内容后)：字段完整度（docs/content-schema.md §6.2）。
 * - animation          (P3 起)：动画一致性与注册（§6.3）。
 * - terminology        (v2 正文改版)：术语 / 深度 / 轻量标记（§7）。
 *
 * 用法：
 *   node scripts/validate-content.ts structure
 *   node scripts/validate-content.ts published-content
 *   node scripts/validate-content.ts animation
 *   node scripts/validate-content.ts terminology
 *   node scripts/validate-content.ts all      （= 当前阶段应启用的子命令聚合）
 *
 * 仅读取 src/data/*；失败即非零退出，作为入库 / 发布门禁。
 */
import { concepts } from '../src/data/concepts.ts';
import { modules } from '../src/data/modules.ts';
import { glossary } from '../src/data/glossary.ts';
import { hyperframeMaterials } from '../src/data/hyperframes.ts';
import { rolePaths } from '../src/data/rolePaths.ts';
import { scenarioExercises } from '../src/data/scenarioExercises.ts';
import {
  collectConceptTextFields,
  HALF_WIDTH_QUOTE_PATTERN,
  TERM_RULES,
} from '../src/data/termCanonical.ts';
import { isMechanismGrouped, type MechanismGroup } from '../src/types/index.ts';

const MODULE_IDS = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6'] as const;
const EXPECTED_COUNTS: Record<string, number> = {
  m1: 10,
  m2: 10,
  m3: 8,
  m4: 16,
  m5: 6,
  m6: 6,
};
const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const VALID_STATUS = new Set(['stub', 'demo', 'mvp']);
const VALID_CAPABILITY_DOMAINS = new Set([
  'modelMechanics',
  'inferenceCostPerformance',
  'maasPlatformization',
  'ragContextEngineering',
  'agentEngineering',
  'evaluationObservability',
  'securityGovernanceOrg',
]);
const VALID_TRADEOFF_DIMENSIONS = new Set([
  'cost',
  'latency',
  'quality',
  'reliability',
  'observability',
  'security',
  'operability',
]);
const VALID_CHECKLIST_PHASES = new Set(['beforeBuild', 'beforeLaunch', 'running']);
const VALID_SCENARIO_RISK_LEVELS = new Set(['low', 'medium', 'high']);
const VALID_SCENARIO_QUALITY_NEEDS = new Set(['low', 'medium', 'high']);
const VALID_SCENARIO_MODEL_TYPES = new Set(['fast', 'strong', 'lowCost', 'restricted']);
const VALID_SCENARIO_CONTEXT_CONDITIONS = new Set(['short', 'medium', 'long']);
const VALID_SCENARIO_SLA_CONDITIONS = new Set(['strict', 'normal']);
const VALID_SCENARIO_METRICS = new Set([
  'costPer1kRequests',
  'p95LatencyMs',
  'successRate',
  'escalationRate',
  'riskInterceptRate',
  'qualityComplaintRate',
]);
const REQUIRED_SCENARIO_METRICS = [
  'costPer1kRequests',
  'p95LatencyMs',
  'successRate',
  'escalationRate',
  'riskInterceptRate',
];
const VALID_SCENARIO_TRENDS = new Set(['better', 'worse', 'neutral']);
const VALID_METRIC_EFFECT_DIRECTIONS = new Set(['up', 'down', 'mixed']);
const VALID_METRIC_EFFECT_MAGNITUDES = new Set(['small', 'medium', 'large']);
const REGISTERED_ANIMATION_TYPES = new Set([
  'token-flow',
  'attention-map',
  'context-window',
  'prefill-decode',
  'kv-cache',
  'model-router',
  'agent-loop',
  'skill-lifecycle',
  'issue-fix-flow',
  'observability-trace',
  'token-roi-flow',
]);

const errors: string[] = [];
const fail = (msg: string): void => {
  errors.push(msg);
};

const nonEmpty = (value: string): boolean => value.trim().length > 0;

const charCount = (s: string): number => s.replace(/\s/g, '').length;

const INVALID_MARKUP = /<(?!\/)[a-z]|\[[^\]]+\]\([^)]+\)|^#{1,6}\s/m;


function hasItems<T>(value: T[] | undefined, min: number): value is T[] {
  return Array.isArray(value) && value.length >= min;
}

function validateDecisionGuide(conceptId: string, guide: NonNullable<typeof concepts[0]['decisionGuide']>): void {
  if (!hasItems(guide.applicableScenarios, 2)) fail(`${conceptId}: decisionGuide.applicableScenarios 至少需要 2 条`);
  if (!hasItems(guide.nonApplicableScenarios, 2)) fail(`${conceptId}: decisionGuide.nonApplicableScenarios 至少需要 2 条`);
  if (!hasItems(guide.decisionSignals, 3)) fail(`${conceptId}: decisionGuide.decisionSignals 至少需要 3 条`);
  if (!hasItems(guide.tradeoffs, 3)) fail(`${conceptId}: decisionGuide.tradeoffs 至少需要 3 条`);
  if (!hasItems(guide.reviewQuestions, 3)) fail(`${conceptId}: decisionGuide.reviewQuestions 至少需要 3 条`);
  if (!hasItems(guide.implementationChecklist, 3)) fail(`${conceptId}: decisionGuide.implementationChecklist 至少需要 3 条`);

  const ids = new Set<string>();
  const checkId = (id: string, path: string): void => {
    if (!nonEmpty(id)) fail(`${conceptId}: ${path}.id 不能为空`);
    if (ids.has(id)) fail(`${conceptId}: decisionGuide 子项 id 重复：${id}`);
    ids.add(id);
  };

  for (const [index, item] of guide.applicableScenarios.entries()) {
    checkId(item.id, `applicableScenarios[${index}]`);
    if (!nonEmpty(item.title)) fail(`${conceptId}: applicableScenarios[${index}].title 不能为空`);
    if (!nonEmpty(item.description)) fail(`${conceptId}: applicableScenarios[${index}].description 不能为空`);
    if (!hasItems(item.signals, 1) || item.signals.some((signal) => !nonEmpty(signal))) {
      fail(`${conceptId}: applicableScenarios[${index}].signals 至少需要 1 条非空信号`);
    }
  }

  for (const [index, item] of guide.nonApplicableScenarios.entries()) {
    checkId(item.id, `nonApplicableScenarios[${index}]`);
    if (!nonEmpty(item.title)) fail(`${conceptId}: nonApplicableScenarios[${index}].title 不能为空`);
    if (!nonEmpty(item.description)) fail(`${conceptId}: nonApplicableScenarios[${index}].description 不能为空`);
    if (!hasItems(item.signals, 1) || item.signals.some((signal) => !nonEmpty(signal))) {
      fail(`${conceptId}: nonApplicableScenarios[${index}].signals 至少需要 1 条非空信号`);
    }
  }

  for (const [index, item] of guide.decisionSignals.entries()) {
    checkId(item.id, `decisionSignals[${index}]`);
    if (!nonEmpty(item.metricOrFact)) fail(`${conceptId}: decisionSignals[${index}].metricOrFact 不能为空`);
    if (!nonEmpty(item.interpretation)) fail(`${conceptId}: decisionSignals[${index}].interpretation 不能为空`);
    if (!nonEmpty(item.evidenceSource)) fail(`${conceptId}: decisionSignals[${index}].evidenceSource 不能为空`);
  }

  for (const [index, item] of guide.tradeoffs.entries()) {
    checkId(item.id, `tradeoffs[${index}]`);
    if (!VALID_TRADEOFF_DIMENSIONS.has(item.dimension)) {
      fail(`${conceptId}: tradeoffs[${index}].dimension 非法：${item.dimension}`);
    }
    if (!nonEmpty(item.gain)) fail(`${conceptId}: tradeoffs[${index}].gain 不能为空`);
    if (!nonEmpty(item.cost)) fail(`${conceptId}: tradeoffs[${index}].cost 不能为空`);
    if (!nonEmpty(item.watchOut)) fail(`${conceptId}: tradeoffs[${index}].watchOut 不能为空`);
  }

  for (const [index, item] of guide.reviewQuestions.entries()) {
    checkId(item.id, `reviewQuestions[${index}]`);
    if (!nonEmpty(item.question)) fail(`${conceptId}: reviewQuestions[${index}].question 不能为空`);
    if (!nonEmpty(item.whyAsk)) fail(`${conceptId}: reviewQuestions[${index}].whyAsk 不能为空`);
    if (!hasItems(item.goodAnswerSignals, 1) || item.goodAnswerSignals.some((signal) => !nonEmpty(signal))) {
      fail(`${conceptId}: reviewQuestions[${index}].goodAnswerSignals 至少需要 1 条非空信号`);
    }
  }

  for (const [index, item] of guide.implementationChecklist.entries()) {
    checkId(item.id, `implementationChecklist[${index}]`);
    if (!VALID_CHECKLIST_PHASES.has(item.phase)) {
      fail(`${conceptId}: implementationChecklist[${index}].phase 非法：${item.phase}`);
    }
    if (!nonEmpty(item.item)) fail(`${conceptId}: implementationChecklist[${index}].item 不能为空`);
    if (!nonEmpty(item.passSignal)) fail(`${conceptId}: implementationChecklist[${index}].passSignal 不能为空`);
  }

  const exec = guide.executiveExplanation;
  if (!exec) {
    fail(`${conceptId}: executiveExplanation 不能为空`);
  } else {
    if (!nonEmpty(exec.summary)) fail(`${conceptId}: executiveExplanation.summary 不能为空`);
    if (!nonEmpty(exec.businessValue)) fail(`${conceptId}: executiveExplanation.businessValue 不能为空`);
    if (!nonEmpty(exec.mainRisk)) fail(`${conceptId}: executiveExplanation.mainRisk 不能为空`);
    if (!nonEmpty(exec.riskControl)) fail(`${conceptId}: executiveExplanation.riskControl 不能为空`);
  }
}
function validateScenarioExercises(conceptIdSet: Set<string>): void {
  if (scenarioExercises.length < 1) {
    fail('Phase 2 scenarioExercises 至少需要 1 个场景');
  }

  const hasModelRouterScenario = scenarioExercises.some((exercise) => exercise.id === 'model-router');
  if (!hasModelRouterScenario) {
    fail('Phase 2 scenarioExercises 必须包含 model-router 场景');
  }

  const exerciseIds = new Set<string>();
  for (const exercise of scenarioExercises) {
    const prefix = `scenarioExercise ${exercise.id}`;

    if (!nonEmpty(exercise.id)) fail('scenarioExercise.id 不能为空');
    if (!KEBAB.test(exercise.id)) fail(`${prefix}: id 不符合 kebab-case`);
    if (exerciseIds.has(exercise.id)) fail(`${prefix}: id 重复`);
    exerciseIds.add(exercise.id);

    if (!nonEmpty(exercise.title)) fail(`${prefix}: title 不能为空`);
    if (!nonEmpty(exercise.background)) fail(`${prefix}: background 不能为空`);
    if (!hasItems(exercise.relatedConceptIds, 1)) fail(`${prefix}: relatedConceptIds 至少需要 1 个`);
    if (!hasItems(exercise.entryConceptIds, 1)) fail(`${prefix}: entryConceptIds 至少需要 1 个`);
    for (const cid of exercise.relatedConceptIds) {
      if (!conceptIdSet.has(cid)) fail(`${prefix}: relatedConceptIds 悬空：${cid}`);
    }
    for (const cid of exercise.entryConceptIds) {
      if (!conceptIdSet.has(cid)) fail(`${prefix}: entryConceptIds 悬空：${cid}`);
    }
    if (exercise.id === 'model-router') {
      for (const cid of ['multi-model-routing', 'cost-routing', 'capability-routing']) {
        if (!exercise.relatedConceptIds.includes(cid)) {
          fail(`${prefix}: model-router 必须关联核心知识点：${cid}`);
        }
      }
    }

    if (!hasItems(exercise.requestTypes, 4)) fail(`${prefix}: requestTypes 至少需要 4 类`);
    if (!hasItems(exercise.modelPool, 4)) fail(`${prefix}: modelPool 至少需要 4 类模型`);
    if (!hasItems(exercise.strategyControls, 3)) fail(`${prefix}: strategyControls 至少需要 3 个策略项`);
    if (!hasItems(exercise.events, 3)) fail(`${prefix}: events 至少需要 3 个异常事件`);

    const requestIds = new Set<string>();
    for (const request of exercise.requestTypes) {
      if (!nonEmpty(request.id)) fail(`${prefix}: requestTypes.id 不能为空`);
      if (requestIds.has(request.id)) fail(`${prefix}: requestType id 重复：${request.id}`);
      requestIds.add(request.id);
      if (!nonEmpty(request.label)) fail(`${prefix}: requestType ${request.id}.label 不能为空`);
      if (!nonEmpty(request.description)) fail(`${prefix}: requestType ${request.id}.description 不能为空`);
      if (request.volumeShare <= 0 || request.volumeShare > 1) fail(`${prefix}: requestType ${request.id}.volumeShare 必须在 0..1`);
      if (request.avgInputTokens <= 0) fail(`${prefix}: requestType ${request.id}.avgInputTokens 必须为正数`);
      if (!VALID_SCENARIO_RISK_LEVELS.has(request.riskLevel)) fail(`${prefix}: requestType ${request.id}.riskLevel 非法：${request.riskLevel}`);
      if (!VALID_SCENARIO_QUALITY_NEEDS.has(request.qualityNeed)) fail(`${prefix}: requestType ${request.id}.qualityNeed 非法：${request.qualityNeed}`);
      if (request.slaMs <= 0) fail(`${prefix}: requestType ${request.id}.slaMs 必须为正数`);
    }
    const totalVolumeShare = exercise.requestTypes.reduce((sum, request) => sum + request.volumeShare, 0);
    if (Math.abs(totalVolumeShare - 1) > 0.001) {
      fail(`${prefix}: requestTypes.volumeShare 总和应为 1，实际 ${totalVolumeShare}`);
    }

    const modelIds = new Set<string>();
    for (const model of exercise.modelPool) {
      if (!nonEmpty(model.id)) fail(`${prefix}: modelPool.id 不能为空`);
      if (modelIds.has(model.id)) fail(`${prefix}: model id 重复：${model.id}`);
      modelIds.add(model.id);
      if (!nonEmpty(model.label)) fail(`${prefix}: model ${model.id}.label 不能为空`);
      if (!VALID_SCENARIO_MODEL_TYPES.has(model.type)) fail(`${prefix}: model ${model.id}.type 非法：${model.type}`);
      if (model.costPer1kTokens <= 0) fail(`${prefix}: model ${model.id}.costPer1kTokens 必须为正数`);
      if (model.medianLatencyMs <= 0) fail(`${prefix}: model ${model.id}.medianLatencyMs 必须为正数`);
      if (model.qualityScore < 0 || model.qualityScore > 1) fail(`${prefix}: model ${model.id}.qualityScore 必须在 0..1`);
      if (model.riskHandlingScore < 0 || model.riskHandlingScore > 1) fail(`${prefix}: model ${model.id}.riskHandlingScore 必须在 0..1`);
      if (model.contextLimitTokens <= 0) fail(`${prefix}: model ${model.id}.contextLimitTokens 必须为正数`);
      if (!nonEmpty(model.availability)) fail(`${prefix}: model ${model.id}.availability 不能为空`);
    }

    const strategyControlIds = new Set<string>();
    const optionIds = new Set<string>();
    for (const control of exercise.strategyControls) {
      if (!nonEmpty(control.id)) fail(`${prefix}: strategyControl.id 不能为空`);
      if (strategyControlIds.has(control.id)) fail(`${prefix}: strategyControl id 重复：${control.id}`);
      strategyControlIds.add(control.id);
      if (!nonEmpty(control.label)) fail(`${prefix}: strategyControl ${control.id}.label 不能为空`);
      if (!hasItems(control.options, 2)) fail(`${prefix}: strategyControl ${control.id}.options 至少需要 2 个`);
      for (const option of control.options) {
        if (!nonEmpty(option.id)) fail(`${prefix}: strategy option id 不能为空`);
        if (optionIds.has(option.id)) fail(`${prefix}: strategy option id 重复：${option.id}`);
        optionIds.add(option.id);
        if (!nonEmpty(option.label)) fail(`${prefix}: strategy option ${option.id}.label 不能为空`);
        if (!nonEmpty(option.description)) fail(`${prefix}: strategy option ${option.id}.description 不能为空`);
        for (const rule of option.routingRules) {
          if (rule.requestTypeId && !requestIds.has(rule.requestTypeId)) fail(`${prefix}: option ${option.id} routingRule requestTypeId 悬空：${rule.requestTypeId}`);
          if (rule.riskLevel && !VALID_SCENARIO_RISK_LEVELS.has(rule.riskLevel)) fail(`${prefix}: option ${option.id} routingRule riskLevel 非法：${rule.riskLevel}`);
          if (rule.contextCondition && !VALID_SCENARIO_CONTEXT_CONDITIONS.has(rule.contextCondition)) fail(`${prefix}: option ${option.id} routingRule contextCondition 非法：${rule.contextCondition}`);
          if (rule.slaCondition && !VALID_SCENARIO_SLA_CONDITIONS.has(rule.slaCondition)) fail(`${prefix}: option ${option.id} routingRule slaCondition 非法：${rule.slaCondition}`);
          if (!modelIds.has(rule.targetModelId)) fail(`${prefix}: option ${option.id} routingRule targetModelId 悬空：${rule.targetModelId}`);
          if (rule.fallbackModelId && !modelIds.has(rule.fallbackModelId)) fail(`${prefix}: option ${option.id} routingRule fallbackModelId 悬空：${rule.fallbackModelId}`);
        }
        if (!hasItems(option.metricEffects, 1)) fail(`${prefix}: strategy option ${option.id}.metricEffects 至少需要 1 条`);
        for (const effect of option.metricEffects) {
          if (!VALID_SCENARIO_METRICS.has(effect.metricId)) fail(`${prefix}: option ${option.id} metricEffect.metricId 非法：${effect.metricId}`);
          if (!VALID_METRIC_EFFECT_DIRECTIONS.has(effect.direction)) fail(`${prefix}: option ${option.id} metricEffect.direction 非法：${effect.direction}`);
          if (!VALID_METRIC_EFFECT_MAGNITUDES.has(effect.magnitude)) fail(`${prefix}: option ${option.id} metricEffect.magnitude 非法：${effect.magnitude}`);
          if (!nonEmpty(effect.explanation)) fail(`${prefix}: option ${option.id} metricEffect.explanation 不能为空`);
        }
      }
    }

    const selectedStrategyKeys = Object.keys(exercise.baseline.selectedStrategies);
    for (const control of exercise.strategyControls) {
      const selected = exercise.baseline.selectedStrategies[control.id];
      if (!selected) {
        fail(`${prefix}: baseline.selectedStrategies 缺少策略项 ${control.id}`);
        continue;
      }
      if (!control.options.some((option) => option.id === selected)) {
        fail(`${prefix}: baseline.selectedStrategies.${control.id} 指向不存在的 option：${selected}`);
      }
    }
    for (const key of selectedStrategyKeys) {
      if (!strategyControlIds.has(key)) fail(`${prefix}: baseline.selectedStrategies 存在未知策略项：${key}`);
    }

    if (!nonEmpty(exercise.baseline.explanation)) fail(`${prefix}: baseline.explanation 不能为空`);
    if (!hasItems(exercise.baseline.metrics, 5)) fail(`${prefix}: baseline.metrics 至少需要 5 个指标`);
    const metricIds = new Set<string>();
    for (const metric of exercise.baseline.metrics) {
      if (!VALID_SCENARIO_METRICS.has(metric.id)) fail(`${prefix}: baseline metric id 非法：${metric.id}`);
      if (metricIds.has(metric.id)) fail(`${prefix}: baseline metric id 重复：${metric.id}`);
      metricIds.add(metric.id);
      if (!nonEmpty(metric.label)) fail(`${prefix}: baseline metric ${metric.id}.label 不能为空`);
      if (!Number.isFinite(metric.value)) fail(`${prefix}: baseline metric ${metric.id}.value 必须为数字`);
      if (!nonEmpty(metric.unit)) fail(`${prefix}: baseline metric ${metric.id}.unit 不能为空`);
      if (!VALID_SCENARIO_TRENDS.has(metric.trend)) fail(`${prefix}: baseline metric ${metric.id}.trend 非法：${metric.trend}`);
      if (!nonEmpty(metric.explanation)) fail(`${prefix}: baseline metric ${metric.id}.explanation 不能为空`);
    }
    for (const metricId of REQUIRED_SCENARIO_METRICS) {
      if (!metricIds.has(metricId)) fail(`${prefix}: baseline.metrics 缺少必需指标：${metricId}`);
    }

    const eventIds = new Set<string>();
    for (const event of exercise.events) {
      if (!nonEmpty(event.id)) fail(`${prefix}: event.id 不能为空`);
      if (eventIds.has(event.id)) fail(`${prefix}: event id 重复：${event.id}`);
      eventIds.add(event.id);
      if (!nonEmpty(event.title)) fail(`${prefix}: event ${event.id}.title 不能为空`);
      if (!nonEmpty(event.symptom)) fail(`${prefix}: event ${event.id}.symptom 不能为空`);
      if (!hasItems(event.triggerStrategyOptionIds, 1)) fail(`${prefix}: event ${event.id}.triggerStrategyOptionIds 至少需要 1 个`);
      for (const optionId of event.triggerStrategyOptionIds) {
        if (!optionIds.has(optionId)) fail(`${prefix}: event ${event.id}.triggerStrategyOptionIds 指向不存在的 option：${optionId}`);
      }
      if (!nonEmpty(event.correctDiagnosis)) fail(`${prefix}: event ${event.id}.correctDiagnosis 不能为空`);
      if (!hasItems(event.investigationOrder, 3) || event.investigationOrder.some((item) => !nonEmpty(item))) {
        fail(`${prefix}: event ${event.id}.investigationOrder 至少需要 3 条非空步骤`);
      }
      if (!hasItems(event.missedRisks, 2) || event.missedRisks.some((item) => !nonEmpty(item))) {
        fail(`${prefix}: event ${event.id}.missedRisks 至少需要 2 条非空风险`);
      }
      if (!hasItems(event.relatedConceptIds, 2)) fail(`${prefix}: event ${event.id}.relatedConceptIds 至少需要 2 个`);
      for (const cid of event.relatedConceptIds) {
        if (!conceptIdSet.has(cid)) fail(`${prefix}: event ${event.id}.relatedConceptIds 悬空：${cid}`);
      }
      if (!hasItems(event.nextStepRecommendations, 2) || event.nextStepRecommendations.some((item) => !nonEmpty(item))) {
        fail(`${prefix}: event ${event.id}.nextStepRecommendations 至少需要 2 条非空建议`);
      }
    }

    const rubric = exercise.reviewRubric;
    if (!rubric || !nonEmpty(rubric.prompt)) fail(`${prefix}: reviewRubric.prompt 不能为空`);
    if (!hasItems(rubric.requiredFindings, 3) || rubric.requiredFindings.some((item) => !nonEmpty(item))) {
      fail(`${prefix}: reviewRubric.requiredFindings 至少需要 3 条非空发现`);
    }
    if (!hasItems(rubric.acceptableActions, 3) || rubric.acceptableActions.some((item) => !nonEmpty(item))) {
      fail(`${prefix}: reviewRubric.acceptableActions 至少需要 3 条非空行动`);
    }
    if (!hasItems(rubric.nextStepRecommendations, 2) || rubric.nextStepRecommendations.some((item) => !nonEmpty(item))) {
      fail(`${prefix}: reviewRubric.nextStepRecommendations 至少需要 2 条非空建议`);
    }
  }
}
function mechanismStepCount(mechanism: typeof concepts[0]['mechanism']): number {
  if (mechanism.length === 0) return 0;
  if (isMechanismGrouped(mechanism)) {
    return mechanism.reduce((n, g) => n + g.items.length, 0);
  }
  return mechanism.length;
}

function validateStructure(): void {
  // 1. 总数 + 模块计数
  if (concepts.length !== 56) {
    fail(`知识点总数应为 56，实际 ${concepts.length}`);
  }
  const byModule = new Map<string, typeof concepts>();
  for (const id of MODULE_IDS) byModule.set(id, []);
  for (const c of concepts) {
    if (!byModule.has(c.moduleId)) {
      fail(`${c.id}: moduleId 非法 "${c.moduleId}"`);
      continue;
    }
    byModule.get(c.moduleId)!.push(c);
  }
  for (const id of MODULE_IDS) {
    const list = byModule.get(id)!;
    if (list.length !== EXPECTED_COUNTS[id]) {
      fail(`模块 ${id} 应有 ${EXPECTED_COUNTS[id]} 个知识点，实际 ${list.length}`);
    }
  }

  // 2. id / slug 唯一、kebab-case、slug === id
  const idSeen = new Set<string>();
  const slugSeen = new Set<string>();
  for (const c of concepts) {
    if (idSeen.has(c.id)) fail(`id 重复：${c.id}`);
    idSeen.add(c.id);
    if (slugSeen.has(c.slug)) fail(`slug 重复：${c.slug}`);
    slugSeen.add(c.slug);
    if (c.slug !== c.id) fail(`${c.id}: slug 应等于 id（当前 slug="${c.slug}"）`);
    if (!KEBAB.test(c.id)) fail(`${c.id}: id 不符合 kebab-case`);
  }

  // 4. 每模块 order 从 1 起连续、唯一
  for (const id of MODULE_IDS) {
    const orders = byModule
      .get(id)!
      .map((c) => c.order)
      .sort((a, b) => a - b);
    for (let i = 0; i < orders.length; i++) {
      if (i > 0 && orders[i] === orders[i - 1]) {
        fail(`模块 ${id} order 重复：${orders[i]}`);
      }
      if (orders[i] !== i + 1) {
        fail(`模块 ${id} order 不连续（排序后 ${orders.join(',')}）`);
        break;
      }
    }
  }

  // 3. modules.conceptIds 与该模块概念集合及 order 完全一致
  const conceptIdSet = new Set(concepts.map((c) => c.id));
  for (const m of modules) {
    if (!(MODULE_IDS as readonly string[]).includes(m.id)) {
      fail(`module id 非法：${m.id}`);
    }
    const expected = byModule
      .get(m.id)!
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((c) => c.id);
    const actual = m.conceptIds;
    if (actual.length !== expected.length) {
      fail(`模块 ${m.id} conceptIds 数量不符（期望 ${expected.length}，实际 ${actual.length}）`);
    } else {
      for (let i = 0; i < expected.length; i++) {
        if (actual[i] !== expected[i]) {
          fail(`模块 ${m.id} conceptIds 第 ${i + 1} 项不符（期望 ${expected[i]}，实际 ${actual[i]}）`);
          break;
        }
      }
    }
    for (const cid of actual) {
      if (!conceptIdSet.has(cid)) fail(`模块 ${m.id} conceptIds 指向不存在的知识点：${cid}`);
    }
  }

  // 5. 关联无悬空（概念 / 诊断题 / 术语）
  for (const c of concepts) {
    for (const rid of c.relatedConceptIds) {
      if (!conceptIdSet.has(rid)) fail(`${c.id}.relatedConceptIds 悬空：${rid}`);
    }
    if (c.diagnosticQuestion) {
      for (const rid of c.diagnosticQuestion.relatedConceptIds) {
        if (!conceptIdSet.has(rid)) fail(`${c.id} 诊断题 relatedConceptIds 悬空：${rid}`);
      }
    }
  }
  for (const g of glossary) {
    for (const rid of g.relatedConceptIds) {
      if (!conceptIdSet.has(rid)) fail(`术语 ${g.id} relatedConceptIds 悬空：${rid}`);
    }
  }

  const moduleIdSet = new Set(modules.map((m) => m.id));
  for (const material of hyperframeMaterials) {
    if (!KEBAB.test(material.id)) fail(`短片 ${material.id}: id 不符合 kebab-case`);
    if (!moduleIdSet.has(material.moduleId)) {
      fail(`短片 ${material.id}: moduleId 指向不存在的模块：${material.moduleId}`);
    }
    if (!material.src.startsWith('/hyperframes/') || !material.src.endsWith('/index.html')) {
      fail(`短片 ${material.id}: src 必须是站内 /hyperframes/.../index.html 路径`);
    }
    if (material.width <= 0 || material.height <= 0) {
      fail(`短片 ${material.id}: width/height 必须为正数`);
    }
    if (material.durationSeconds <= 0) {
      fail(`短片 ${material.id}: durationSeconds 必须为正数`);
    }
    for (const rid of material.relatedConceptIds) {
      if (!conceptIdSet.has(rid)) fail(`短片 ${material.id} relatedConceptIds 悬空：${rid}`);
    }
    let previousStart = -1;
    const chapterIds = new Set<string>();
    for (const chapter of material.chapters) {
      if (!KEBAB.test(chapter.id)) fail(`短片 ${material.id}: chapter id 不符合 kebab-case：${chapter.id}`);
      if (chapterIds.has(chapter.id)) fail(`短片 ${material.id}: chapter id 重复：${chapter.id}`);
      chapterIds.add(chapter.id);
      if (chapter.startSeconds < previousStart) {
        fail(`短片 ${material.id}: chapters 必须按 startSeconds 升序排列`);
      }
      if (chapter.startSeconds < 0 || chapter.startSeconds > material.durationSeconds) {
        fail(`短片 ${material.id}: chapter ${chapter.id} startSeconds 超出时长`);
      }
      if (chapter.relatedConceptId && !conceptIdSet.has(chapter.relatedConceptId)) {
        fail(`短片 ${material.id}: chapter ${chapter.id} relatedConceptId 悬空：${chapter.relatedConceptId}`);
      }
      previousStart = chapter.startSeconds;
    }
  }

  // 8. Phase 1 capabilityDomains / decisionGuide / rolePaths
  const decisionGuideConcepts = concepts.filter((c) => c.decisionGuide);
  if (decisionGuideConcepts.length < 12) {
    fail(`Phase 1 decisionGuide 至少需要 12 个，实际 ${decisionGuideConcepts.length}`);
  }

  for (const c of concepts) {
    const mapping = c.capabilityDomains;
    if (!mapping) {
      fail(`${c.id}: capabilityDomains.primary 必填`);
      continue;
    }
    if (!VALID_CAPABILITY_DOMAINS.has(mapping.primary)) {
      fail(`${c.id}: capabilityDomains.primary 非法：${mapping.primary}`);
    }
    if (mapping.secondary) {
      if (!VALID_CAPABILITY_DOMAINS.has(mapping.secondary)) {
        fail(`${c.id}: capabilityDomains.secondary 非法：${mapping.secondary}`);
      }
      if (mapping.secondary === mapping.primary) {
        fail(`${c.id}: capabilityDomains.secondary 不能等于 primary`);
      }
    }
    if (c.decisionGuide) validateDecisionGuide(c.id, c.decisionGuide);
  }

  let glossaryConfusionCount = 0;
  for (const g of glossary) {
    if (g.capabilityDomains) {
      if (g.capabilityDomains.length < 1 || g.capabilityDomains.length > 2) {
        fail(`术语 ${g.id}: capabilityDomains 长度必须为 1 到 2`);
      }
      const seenDomains = new Set<string>();
      for (const domain of g.capabilityDomains) {
        if (!VALID_CAPABILITY_DOMAINS.has(domain)) fail(`术语 ${g.id}: capabilityDomains 非法：${domain}`);
        if (seenDomains.has(domain)) fail(`术语 ${g.id}: capabilityDomains 重复：${domain}`);
        seenDomains.add(domain);
      }
    }
    if (g.confusedWith) {
      if (!hasItems(g.confusedWith, 1) || g.confusedWith.some((item) => !nonEmpty(item))) {
        fail(`术语 ${g.id}: confusedWith 必须是非空字符串数组`);
      } else {
        glossaryConfusionCount += 1;
      }
    }
  }
  if (glossaryConfusionCount < 10) {
    fail(`Phase 3 DEV-11 至少需要 10 个术语具备 confusedWith，实际 ${glossaryConfusionCount}`);
  }

  const rolePathIds = new Set<string>();
  for (const path of rolePaths) {
    if (rolePathIds.has(path.id)) fail(`rolePath id 重复：${path.id}`);
    rolePathIds.add(path.id);
    if (path.recommendedConceptIds.length < 8) {
      fail(`rolePath ${path.id}: recommendedConceptIds 至少需要 8 个`);
    }
    const recommended = new Set(path.recommendedConceptIds);
    for (const cid of path.recommendedConceptIds) {
      if (!conceptIdSet.has(cid)) fail(`rolePath ${path.id}: recommendedConceptIds 指向不存在的知识点：${cid}`);
    }
    for (const phase of path.phases) {
      if (!hasItems(phase.conceptIds, 1)) fail(`rolePath ${path.id}: phase ${phase.id} 至少需要 1 个 conceptId`);
      for (const cid of phase.conceptIds) {
        if (!recommended.has(cid)) {
          fail(`rolePath ${path.id}: phase ${phase.id} conceptId 不在 recommendedConceptIds 中：${cid}`);
        }
      }
    }
  }
  // 9. Phase 2 scenarioExercises
  validateScenarioExercises(conceptIdSet);

  // 6. contentStatus 合法
  for (const c of concepts) {
    if (!VALID_STATUS.has(c.contentStatus)) {
      fail(`${c.id}: contentStatus 非法 "${c.contentStatus}"`);
    }
  }

  // 7. 诊断题结构（存在时）
  for (const c of concepts) {
    const q = c.diagnosticQuestion;
    if (!q) continue;
    const optIds = new Set(q.options.map((o) => o.id));
    if (q.options.length < 2) fail(`${c.id} 诊断题选项少于 2`);
    for (const cid of q.correctOptionIds) {
      if (!optIds.has(cid)) fail(`${c.id} 诊断题 correctOptionIds 不在选项内：${cid}`);
    }
    if (q.type === 'single' && q.correctOptionIds.length !== 1) {
      fail(`${c.id} 单选题 correctOptionIds 应为 1 个（实际 ${q.correctOptionIds.length}）`);
    }
    if (q.type === 'multiple' && q.correctOptionIds.length < 1) {
      fail(`${c.id} 多选题 correctOptionIds 应不少于 1`);
    }
  }
}

function validatePublishedContent(): void {
  const published = concepts.filter((c) => c.contentStatus === 'demo' || c.contentStatus === 'mvp');
  for (const c of published) {
    if (!nonEmpty(c.definition)) fail(`${c.id}: definition 不能为空`);
    if (!nonEmpty(c.whyItMatters)) fail(`${c.id}: whyItMatters 不能为空`);
    if (!nonEmpty(c.mentalModel)) fail(`${c.id}: mentalModel 不能为空`);
    if (mechanismStepCount(c.mechanism) < 3) fail(`${c.id}: mechanism 至少需要 3 步`);
    if (c.pitfalls.length < 2) fail(`${c.id}: pitfalls 至少需要 2 条`);
    if (c.keyTakeaways.length < 2) fail(`${c.id}: keyTakeaways 至少需要 2 条`);
    const ec = c.enterpriseCase;
    if (!nonEmpty(ec.scenario)) fail(`${c.id}: enterpriseCase.scenario 不能为空`);
    if (!nonEmpty(ec.problem)) fail(`${c.id}: enterpriseCase.problem 不能为空`);
    if (!nonEmpty(ec.analysis)) fail(`${c.id}: enterpriseCase.analysis 不能为空`);
    if (!nonEmpty(ec.solution)) fail(`${c.id}: enterpriseCase.solution 不能为空`);
    if (!nonEmpty(ec.takeaway)) fail(`${c.id}: enterpriseCase.takeaway 不能为空`);
    if (c.hasAnimation && (!c.animation || c.animation.steps.length < 3)) {
      fail(`${c.id}: hasAnimation=true 时 animation.steps 至少需要 3 步`);
    }
  }
}

function validateAnimation(): void {
  for (const c of concepts) {
    if (c.hasAnimation !== Boolean(c.animation)) {
      fail(`${c.id}: hasAnimation 必须与 animation 是否存在保持一致`);
    }
    if (!c.animation) continue;
    if (!REGISTERED_ANIMATION_TYPES.has(c.animation.type)) {
      fail(`${c.id}: animation.type 未注册：${c.animation.type}`);
    }
    if (c.animation.steps.length < 1) {
      fail(`${c.id}: animation.steps 至少需要 1 步`);
    }
    const stepIds = new Set<string>();
    for (const step of c.animation.steps) {
      if (stepIds.has(step.id)) fail(`${c.id}: animation step id 重复：${step.id}`);
      stepIds.add(step.id);
      if (!nonEmpty(step.title)) fail(`${c.id}: animation step ${step.id} title 不能为空`);
      if (!nonEmpty(step.description)) fail(`${c.id}: animation step ${step.id} description 不能为空`);
    }
  }
}

function validateTerminology(): void {
  const v2Published = concepts.filter(
    (c) =>
      c.contentRevision === 'v2' &&
      (c.contentStatus === 'demo' || c.contentStatus === 'mvp'),
  );

  if (v2Published.length === 0) {
    console.log('  [terminology] 当前无 contentRevision=v2 的已发布内容，跳过 §7 校验。');
    return;
  }

  for (const c of v2Published) {
    const texts = collectConceptTextFields(c);

    for (const text of texts) {
      if (INVALID_MARKUP.test(text)) {
        fail(`${c.id}: 正文含非法标记（仅允许 **加粗**）`);
      }
      for (const rule of TERM_RULES) {
        rule.forbidden.lastIndex = 0;
        if (rule.forbidden.test(text)) {
          fail(`${c.id}: 术语应使用「${rule.canonical}」（命中 forbidden 变体）`);
        }
      }
      if (HALF_WIDTH_QUOTE_PATTERN.test(text)) {
        fail(`${c.id}: 正文应使用中文引号 ""，勿用半角直引号`);
      }
    }

    const defLen = charCount(c.definition);
    if (defLen < 50 || defLen > 90) {
      fail(`${c.id}: definition 应为 50–90 字（当前 ${defLen}）`);
    }
    const whyLen = charCount(c.whyItMatters);
    if (whyLen < 90 || whyLen > 150) {
      fail(`${c.id}: whyItMatters 应为 90–150 字（当前 ${whyLen}）`);
    }
    if (!isMechanismGrouped(c.mechanism)) {
      fail(`${c.id}: v2 知识点 mechanism 须为 MechanismGroup[] 分组结构`);
    } else {
      const groups = c.mechanism as MechanismGroup[];
      if (groups.length < 2 || groups.length > 3) {
        fail(`${c.id}: mechanism 应为 2–3 组（当前 ${groups.length}）`);
      }
      for (const g of groups) {
        if (g.items.length < 1 || g.items.length > 3) {
          fail(`${c.id}: mechanism 组「${g.title}」应为 1–3 条（当前 ${g.items.length}）`);
        }
      }
    }
    if (c.pitfalls.length !== 4) {
      fail(`${c.id}: pitfalls 应为 4 条（当前 ${c.pitfalls.length}）`);
    }
    if (c.keyTakeaways.length !== 4) {
      fail(`${c.id}: keyTakeaways 应为 4 条（当前 ${c.keyTakeaways.length}）`);
    }
  }

  console.log(`  [terminology] 已校验 v2 内容 ${v2Published.length} 个。`);
}

// ---- 调度 ----
const cmd = process.argv[2] ?? 'all';
const runStructure = cmd === 'structure' || cmd === 'all';
const runPublished = cmd === 'published-content' || cmd === 'all';
const runAnimation = cmd === 'animation' || cmd === 'all';
const runTerminology = cmd === 'terminology' || cmd === 'all';

console.log(`validate:content — 子命令：${cmd}`);

if (runStructure) validateStructure();

if (runPublished) {
  const n = concepts.filter((c) => c.contentStatus === 'demo' || c.contentStatus === 'mvp').length;
  if (n === 0) {
    console.log('  [published-content] 当前无 demo/mvp 内容，跳过完整性校验。');
  } else {
    validatePublishedContent();
    console.log(`  [published-content] 已校验 demo/mvp 内容 ${n} 个。`);
  }
}

if (runAnimation) {
  validateAnimation();
  console.log('  [animation] 已校验动画一致性、注册类型与步骤合法性。');
}

if (runTerminology) {
  validateTerminology();
}

if (errors.length > 0) {
  console.error(`\n失败：${errors.length} 个问题`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

if (runStructure) {
  console.log('\n通过：内容结构校验（56 登记 / 模块计数 10/10/8/16/6/6 / 唯一性 / 关联无悬空 / contentStatus / 诊断题结构 / 本地增强数据）。');
}
process.exit(0);

