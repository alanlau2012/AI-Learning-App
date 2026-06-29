import type {
  MetricEffect,
  ScenarioEvent,
  ScenarioExercise,
  ScenarioMetric,
  ScenarioMetricId,
  ScenarioMetricTrend,
  ScenarioModel,
  ScenarioRequestType,
  StrategyOption,
} from '../types';

export type ScenarioStrategySelection = Record<string, string>;

export interface ScenarioSimulationState {
  selectedStrategies: ScenarioStrategySelection;
  round: number;
}

export interface ScenarioStrategyChange {
  controlId: string;
  optionId: string;
}

export interface ScenarioModelChoice {
  requestTypeId: string;
  requestLabel: string;
  selectedModelId: string;
  selectedModelLabel: string;
  fallbackModelId?: string;
  fallbackModelLabel?: string;
  appliedStrategyOptionIds: string[];
  decisionReasons: string[];
}

export interface ScenarioRequestBreakdown extends ScenarioModelChoice {
  volumeShare: number;
  contextCondition: 'short' | 'medium' | 'long';
  slaCondition: 'strict' | 'normal';
  qualityScore: number;
  riskHandlingScore: number;
  estimatedSuccessRate: number;
  estimatedRiskInterceptRate: number;
  estimatedComplaintRate: number;
  estimatedLatencyMs: number;
  estimatedCostPoints: number;
  escalationProbability: number;
  queuePressure: number;
  risks: string[];
}

export interface ScenarioModelLoad {
  modelId: string;
  modelLabel: string;
  volumeShare: number;
  queuePressure: number;
}

export interface ScenarioReviewSignal {
  id: string;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  detail: string;
  relatedMetricIds: ScenarioMetricId[];
  relatedRequestTypeIds: string[];
}

export interface ScenarioSimulationResult {
  state: ScenarioSimulationState;
  metrics: ScenarioMetric[];
  choices: ScenarioModelChoice[];
  requestBreakdowns: ScenarioRequestBreakdown[];
  modelLoad: ScenarioModelLoad[];
  activeEvents: ScenarioEvent[];
  recommendations: string[];
  reviewSignals: ScenarioReviewSignal[];
  explanation: string;
}

export interface ScenarioReviewResult {
  event?: ScenarioEvent;
  prompt: string;
  diagnosis: string;
  investigationOrder: string[];
  missedRisks: string[];
  relatedConceptIds: string[];
  nextStepRecommendations: string[];
  requiredFindings: string[];
  acceptableActions: string[];
  signals: ScenarioReviewSignal[];
}

interface MetricAccumulator {
  value: number;
  explanationParts: string[];
}

interface RuleMatch {
  option: StrategyOption;
  targetModel: ScenarioModel;
  fallbackModel?: ScenarioModel;
  priority: number;
  specificity: number;
}

interface RuleMatchWithReason extends RuleMatch {
  reason: string;
}

const METRIC_ORDER: ScenarioMetricId[] = [
  'costPer1kRequests',
  'p95LatencyMs',
  'successRate',
  'escalationRate',
  'riskInterceptRate',
  'qualityComplaintRate',
];

const CONTROL_PRIORITY: Record<string, number> = {
  taskRoutingMode: 10,
  contextSlaMode: 20,
  riskRoutingMode: 30,
};

const FALLBACK_CONTROL_ID = 'fallbackMode';

const COST_SCALE = 125;

export function initializeScenarioState(
  exercise: ScenarioExercise,
  selectedStrategies: ScenarioStrategySelection = {},
): ScenarioSimulationState {
  return {
    selectedStrategies: normalizeSelectedStrategies(exercise, {
      ...exercise.baseline.selectedStrategies,
      ...selectedStrategies,
    }),
    round: 0,
  };
}

export function applyStrategyChange(
  exercise: ScenarioExercise,
  state: ScenarioSimulationState,
  change: ScenarioStrategyChange,
): ScenarioSimulationState {
  const control = exercise.strategyControls.find((item) => item.id === change.controlId);
  const optionExists = control?.options.some((option) => option.id === change.optionId) ?? false;

  if (!control || !optionExists) {
    return state;
  }

  return {
    selectedStrategies: normalizeSelectedStrategies(exercise, {
      ...state.selectedStrategies,
      [change.controlId]: change.optionId,
    }),
    round: state.round + 1,
  };
}

export function runScenarioRound(
  exercise: ScenarioExercise,
  stateOrSelection: ScenarioSimulationState | ScenarioStrategySelection = initializeScenarioState(exercise),
): ScenarioSimulationResult {
  const state = isSimulationState(stateOrSelection)
    ? stateOrSelection
    : initializeScenarioState(exercise, stateOrSelection);

  return evaluateScenarioStrategy(exercise, state);
}

export function evaluateScenarioStrategy(
  exercise: ScenarioExercise,
  stateOrSelection: ScenarioSimulationState | ScenarioStrategySelection = initializeScenarioState(exercise),
): ScenarioSimulationResult {
  const state = isSimulationState(stateOrSelection)
    ? {
        selectedStrategies: normalizeSelectedStrategies(exercise, stateOrSelection.selectedStrategies),
        round: stateOrSelection.round,
      }
    : initializeScenarioState(exercise, stateOrSelection);
  const selectedOptions = getSelectedOptions(exercise, state.selectedStrategies);

  if (!isModelRoutingExercise(exercise)) {
    return evaluateGenericDeltaScenario(exercise, state, selectedOptions);
  }

  const fallbackOption = selectedOptions.find(({ controlId }) => controlId === FALLBACK_CONTROL_ID)?.option;
  const modelLoads = calculateModelLoads(exercise, selectedOptions);
  const requestBreakdowns = (exercise.requestTypes ?? []).map((request) =>
    evaluateRequest(exercise, request, selectedOptions, modelLoads, fallbackOption),
  );
  const metrics = deriveMetrics(exercise, requestBreakdowns, selectedOptions);
  const activeEvents = deriveActiveEvents(exercise, state.selectedStrategies, metrics);
  const reviewSignals = deriveReviewSignals(requestBreakdowns, metrics, activeEvents);
  const recommendations = deriveRecommendations(exercise, activeEvents, reviewSignals, selectedOptions);

  return {
    state,
    metrics,
    choices: requestBreakdowns.map(toModelChoice),
    requestBreakdowns,
    modelLoad: modelLoads,
    activeEvents,
    recommendations,
    reviewSignals,
    explanation: buildScenarioExplanation(exercise, selectedOptions, activeEvents),
  };
}

export function deriveScenarioReview(
  exercise: ScenarioExercise,
  result: ScenarioSimulationResult,
  eventId?: string,
): ScenarioReviewResult {
  const event = eventId
    ? exercise.events.find((item) => item.id === eventId)
    : result.activeEvents[0] ?? exercise.events[0];

  return {
    event,
    prompt: exercise.reviewRubric.prompt,
    diagnosis: event?.correctDiagnosis ?? result.explanation,
    investigationOrder: event?.investigationOrder ?? exercise.reviewRubric.requiredFindings,
    missedRisks: event?.missedRisks ?? result.reviewSignals.map((signal) => signal.detail),
    relatedConceptIds: event?.relatedConceptIds ?? exercise.relatedConceptIds,
    nextStepRecommendations: event?.nextStepRecommendations ?? exercise.reviewRubric.nextStepRecommendations,
    requiredFindings: exercise.reviewRubric.requiredFindings,
    acceptableActions: exercise.reviewRubric.acceptableActions,
    signals: result.reviewSignals,
  };
}

function isModelRoutingExercise(exercise: ScenarioExercise): boolean {
  return (exercise.type ?? 'modelRouting') === 'modelRouting' &&
    Boolean(exercise.requestTypes?.length) &&
    Boolean(exercise.modelPool?.length);
}

function evaluateGenericDeltaScenario(
  exercise: ScenarioExercise,
  state: ScenarioSimulationState,
  selectedOptions: ReturnType<typeof getSelectedOptions>,
): ScenarioSimulationResult {
  const metrics = deriveGenericDeltaMetrics(exercise, selectedOptions);
  const activeEvents = deriveActiveEvents(exercise, state.selectedStrategies, metrics);
  const reviewSignals = deriveGenericReviewSignals(metrics, activeEvents);
  const recommendations = deriveRecommendations(exercise, activeEvents, reviewSignals, selectedOptions);

  return {
    state,
    metrics,
    choices: [],
    requestBreakdowns: [],
    modelLoad: [],
    activeEvents,
    recommendations,
    reviewSignals,
    explanation: buildScenarioExplanation(exercise, selectedOptions, activeEvents),
  };
}

function deriveGenericDeltaMetrics(
  exercise: ScenarioExercise,
  selectedOptions: ReturnType<typeof getSelectedOptions>,
): ScenarioMetric[] {
  const effectsByMetric = new Map<string, Array<{ optionLabel: string; effect: MetricEffect }>>();

  for (const { option } of selectedOptions) {
    for (const effect of option.metricEffects) {
      const existing = effectsByMetric.get(effect.metricId) ?? [];
      existing.push({ optionLabel: option.label, effect });
      effectsByMetric.set(effect.metricId, existing);
    }
  }

  return exercise.baseline.metrics.map((metric) => {
    const effects = effectsByMetric.get(metric.id) ?? [];
    let value = metric.value;
    const explanationParts = [metric.explanation];

    for (const { optionLabel, effect } of effects) {
      value = applyMetricDelta(metric, value, effect);
      explanationParts.push(`${optionLabel}: ${effect.explanation}`);
    }

    const roundedValue = metric.unit === 'tokens' || metric.unit === 'ms'
      ? Math.round(value)
      : round(value, 1);

    return {
      ...metric,
      value: roundedValue,
      trend: deriveGenericTrend(metric, roundedValue),
      explanation: explanationParts.join(' '),
    };
  });
}

function applyMetricDelta(metric: ScenarioMetric, currentValue: number, effect: MetricEffect): number {
  const magnitudeDelta = effect.magnitude === 'small' ? 0.05 : effect.magnitude === 'medium' ? 0.12 : 0.25;
  const rawDelta = effect.delta ?? magnitudeDelta;
  const mode = effect.deltaMode ?? 'relative';
  const signedDelta = effect.direction === 'down' ? -rawDelta : effect.direction === 'up' ? rawDelta : 0;
  const nextValue = mode === 'absolute'
    ? currentValue + signedDelta
    : currentValue * (1 + signedDelta);

  return clamp(nextValue, metric.min ?? Number.NEGATIVE_INFINITY, metric.max ?? Number.POSITIVE_INFINITY);
}

function deriveGenericTrend(metric: ScenarioMetric, value: number): ScenarioMetricTrend {
  const delta = value - metric.value;
  const tolerance = metric.neutralTolerance ?? (metric.unit === 'tokens' || metric.unit === 'ms' ? 100 : 0.5);

  if (Math.abs(delta) <= tolerance) {
    return 'neutral';
  }

  const polarity = metric.polarity ?? inferMetricPolarity(metric.id);
  return polarity === 'lowerIsBetter'
    ? delta < 0 ? 'better' : 'worse'
    : delta > 0 ? 'better' : 'worse';
}

function inferMetricPolarity(metricId: string): NonNullable<ScenarioMetric['polarity']> {
  const lowerIsBetterPatterns = [
    'cost',
    'latency',
    'p95',
    'error',
    'complaint',
    'conflict',
    'risk',
    'escalation',
    'retry',
    'tokens',
    'trafficShare',
  ];
  const normalized = metricId.toLowerCase();
  return lowerIsBetterPatterns.some((pattern) => normalized.includes(pattern.toLowerCase()))
    ? 'lowerIsBetter'
    : 'higherIsBetter';
}

function deriveGenericReviewSignals(
  metrics: ScenarioMetric[],
  activeEvents: ScenarioEvent[],
): ScenarioReviewSignal[] {
  const signals: ScenarioReviewSignal[] = metrics
    .filter((metric) => metric.trend === 'worse')
    .slice(0, 3)
    .map((metric) => ({
      id: `metric-${metric.id}`,
      severity: 'warning',
      title: `${metric.label} needs review`,
      detail: metric.explanation,
      relatedMetricIds: [metric.id],
      relatedRequestTypeIds: [],
    }));

  for (const event of activeEvents) {
    signals.push({
      id: `event-${event.id}`,
      severity: 'info',
      title: event.title,
      detail: event.symptom,
      relatedMetricIds: [],
      relatedRequestTypeIds: [],
    });
  }

  return signals;
}
function normalizeSelectedStrategies(
  exercise: ScenarioExercise,
  selectedStrategies: ScenarioStrategySelection,
): ScenarioStrategySelection {
  return Object.fromEntries(
    exercise.strategyControls.map((control) => {
      const selectedOptionId = selectedStrategies[control.id];
      const option = control.options.find((item) => item.id === selectedOptionId) ?? control.options[0];
      return [control.id, option.id];
    }),
  );
}

function getSelectedOptions(exercise: ScenarioExercise, selectedStrategies: ScenarioStrategySelection) {
  return exercise.strategyControls.flatMap((control) => {
    const option = control.options.find((item) => item.id === selectedStrategies[control.id]);
    return option ? [{ controlId: control.id, controlLabel: control.label, option }] : [];
  });
}

function evaluateRequest(
  exercise: ScenarioExercise,
  request: ScenarioRequestType,
  selectedOptions: ReturnType<typeof getSelectedOptions>,
  modelLoads: ScenarioModelLoad[],
  fallbackOption?: StrategyOption,
): ScenarioRequestBreakdown {
  const choice = chooseModelForRequest(exercise, request, selectedOptions);
  const modelLoad = modelLoads.find((load) => load.modelId === choice.targetModel.id);
  const fallbackMode = fallbackOption?.id ?? 'noFallback';
  const contextPenalty = request.avgInputTokens > choice.targetModel.contextLimitTokens ? 0.16 : 0;
  const qualityThreshold = getQualityThreshold(request);
  const qualityGap = Math.max(0, qualityThreshold - choice.targetModel.qualityScore);
  const riskGap = Math.max(0, getRiskThreshold(request) - choice.targetModel.riskHandlingScore);
  const fallbackLift = getFallbackSuccessLift(fallbackMode, choice.fallbackModel, request);
  const successRate = clamp(
    0.9 + choice.targetModel.qualityScore * 0.09 - qualityGap * 0.45 - contextPenalty + fallbackLift,
    0.62,
    0.992,
  );
  const riskInterceptRate = clamp(
    choice.targetModel.riskHandlingScore + getRiskPolicyBonus(choice.appliedStrategyOptionIds) - riskGap * 0.35,
    0.35,
    0.99,
  );
  const escalationProbability = getEscalationProbability(
    fallbackMode,
    request,
    qualityGap,
    riskGap,
    contextPenalty,
    choice.appliedStrategyOptionIds,
  );
  const queuePressure = modelLoad?.queuePressure ?? 0;
  const latencyMs = Math.round(
    choice.targetModel.medianLatencyMs *
      (1.45 + queuePressure * 0.95 + contextPenalty * 1.5 + escalationProbability * 1.8),
  );
  const fallbackCostMultiplier = fallbackMode === 'retrySame' ? escalationProbability : escalationProbability * 0.65;
  const fallbackCost = choice.fallbackModel
    ? request.avgInputTokens * choice.fallbackModel.costPer1kTokens * fallbackCostMultiplier
    : request.avgInputTokens * choice.targetModel.costPer1kTokens * fallbackCostMultiplier;
  const costPoints =
    (request.avgInputTokens * choice.targetModel.costPer1kTokens + fallbackCost) / COST_SCALE;
  const complaintRate = clamp(
    0.012 + qualityGap * 0.55 + contextPenalty * 0.42 + (1 - successRate) * 0.25 - fallbackLift * 0.2,
    0.004,
    0.22,
  );

  return {
    requestTypeId: request.id,
    requestLabel: request.label,
    selectedModelId: choice.targetModel.id,
    selectedModelLabel: choice.targetModel.label,
    fallbackModelId: choice.fallbackModel?.id,
    fallbackModelLabel: choice.fallbackModel?.label,
    appliedStrategyOptionIds: choice.appliedStrategyOptionIds,
    decisionReasons: choice.decisionReasons,
    volumeShare: request.volumeShare,
    contextCondition: getContextCondition(request),
    slaCondition: getSlaCondition(request),
    qualityScore: choice.targetModel.qualityScore,
    riskHandlingScore: choice.targetModel.riskHandlingScore,
    estimatedSuccessRate: round(successRate * 100, 1),
    estimatedRiskInterceptRate: round(riskInterceptRate * 100, 1),
    estimatedComplaintRate: round(complaintRate * 100, 1),
    estimatedLatencyMs: latencyMs,
    estimatedCostPoints: round(costPoints, 1),
    escalationProbability: round(escalationProbability * 100, 1),
    queuePressure: round(queuePressure * 100, 1),
    risks: deriveRequestRisks(request, choice.targetModel, qualityGap, riskGap, contextPenalty, queuePressure),
  };
}

function chooseModelForRequest(
  exercise: ScenarioExercise,
  request: ScenarioRequestType,
  selectedOptions: ReturnType<typeof getSelectedOptions>,
) {
  const matches: RuleMatchWithReason[] = [];

  for (const { controlId, controlLabel, option } of selectedOptions) {
    if (controlId === FALLBACK_CONTROL_ID) {
      continue;
    }

    for (const rule of option.routingRules) {
      const target = ruleTarget(rule);

      if (!ruleMatchesRequest(target, request)) {
        continue;
      }

      const targetModel = findModel(exercise, rule.targetModelId);

      if (!targetModel) {
        continue;
      }

      const fallbackModel = rule.fallbackModelId ? findModel(exercise, rule.fallbackModelId) : undefined;
      matches.push({
        option,
        targetModel,
        ...(fallbackModel ? { fallbackModel } : {}),
        priority: CONTROL_PRIORITY[controlId] ?? 15,
        specificity: getRuleSpecificity(target),
        reason: `${controlLabel}: ${option.label}`,
      });
    }
  }

  const sortedMatches = [...matches].sort(
    (left, right) => right.priority - left.priority || right.specificity - left.specificity,
  );
  const primaryMatch = sortedMatches[0] ?? createDefaultMatch(exercise, request);
  const fallbackMatch = sortedMatches.find((match) => match.fallbackModel);

  return {
    targetModel: primaryMatch.targetModel,
    fallbackModel: fallbackMatch?.fallbackModel,
    appliedStrategyOptionIds: [...new Set(matches.map((match) => match.option.id))],
    decisionReasons: [...new Set(matches.map((match) => match.reason))],
  };
}

function calculateModelLoads(
  exercise: ScenarioExercise,
  selectedOptions: ReturnType<typeof getSelectedOptions>,
): ScenarioModelLoad[] {
  const rawLoads = new Map((exercise.modelPool ?? []).map((model) => [model.id, 0]));

  for (const request of exercise.requestTypes ?? []) {
    const choice = chooseModelForRequest(exercise, request, selectedOptions);
    rawLoads.set(choice.targetModel.id, (rawLoads.get(choice.targetModel.id) ?? 0) + request.volumeShare);
  }

  return (exercise.modelPool ?? []).map((model) => {
    const volumeShare = rawLoads.get(model.id) ?? 0;
    const pressureStart = model.type === 'strong' ? 0.32 : model.type === 'restricted' ? 0.24 : 0.48;
    const queuePressure = clamp((volumeShare - pressureStart) / Math.max(pressureStart, 0.1), 0, 1);

    return {
      modelId: model.id,
      modelLabel: model.label,
      volumeShare: round(volumeShare * 100, 1),
      queuePressure: round(queuePressure, 3),
    };
  });
}

function deriveMetrics(
  exercise: ScenarioExercise,
  requestBreakdowns: ScenarioRequestBreakdown[],
  selectedOptions: ReturnType<typeof getSelectedOptions>,
): ScenarioMetric[] {
  const labels = new Map(exercise.baseline.metrics.map((metric) => [metric.id, metric]));
  const accumulators: Record<ScenarioMetricId, MetricAccumulator> = {
    costPer1kRequests: {
      value: weightedSum(requestBreakdowns, (item) => item.estimatedCostPoints),
      explanationParts: ['Weighted by request volume, input tokens, primary model cost, and fallback cost.'],
    },
    p95LatencyMs: {
      value: estimateP95Latency(requestBreakdowns),
      explanationParts: ['Estimated from selected model latency, fallback/escalation chain, and queue pressure.'],
    },
    successRate: {
      value: weightedSum(requestBreakdowns, (item) => item.estimatedSuccessRate),
      explanationParts: ['Driven by model quality, context fit, fallback policy, and task quality need.'],
    },
    escalationRate: {
      value: weightedSum(requestBreakdowns, (item) => item.escalationProbability),
      explanationParts: ['Includes fallback escalation plus risk/context-driven review pressure.'],
    },
    riskInterceptRate: {
      value: weightedRiskMetric(requestBreakdowns, (item) => item.estimatedRiskInterceptRate),
      explanationParts: ['Computed on medium/high-risk traffic from model risk handling and guard policy.'],
    },
    qualityComplaintRate: {
      value: weightedSum(requestBreakdowns, (item) => item.estimatedComplaintRate),
      explanationParts: ['Rises when high-quality or long-context requests are served by weaker models.'],
    },
  };

  for (const { option } of selectedOptions) {
    for (const effect of option.metricEffects) {
      accumulators[effect.metricId].explanationParts.push(formatMetricEffect(option, effect));
    }
  }

  return METRIC_ORDER.map((metricId) => {
    const baselineMetric = labels.get(metricId);
    const value = metricId === 'p95LatencyMs'
      ? Math.round(accumulators[metricId].value)
      : round(accumulators[metricId].value, 1);

    return {
      id: metricId,
      label: baselineMetric?.label ?? metricId,
      value,
      unit: baselineMetric?.unit ?? (metricId === 'p95LatencyMs' ? 'ms' : '%'),
      trend: deriveTrend(metricId, value, baselineMetric?.value),
      explanation: accumulators[metricId].explanationParts.join(' '),
    };
  });
}

function deriveActiveEvents(
  exercise: ScenarioExercise,
  selectedStrategies: ScenarioStrategySelection,
  metrics: ScenarioMetric[],
): ScenarioEvent[] {
  const selectedOptionIds = new Set(Object.values(selectedStrategies));
  const directMatches = exercise.events.filter((event) =>
    event.triggerStrategyOptionIds.every((optionId) => selectedOptionIds.has(optionId)),
  );

  if (directMatches.length > 0) {
    return directMatches;
  }

  const metricLookup = new Map(metrics.map((metric) => [metric.id, metric.value]));
  const inferredEvents = exercise.events.filter((event) => {
    if (event.id === 'costDownComplaintsUp') {
      return (metricLookup.get('qualityComplaintRate') ?? 0) >= 7;
    }

    if (event.id === 'slaBreach') {
      return (metricLookup.get('p95LatencyMs') ?? 0) >= 6500;
    }

    if (event.id === 'riskLeak') {
      return (metricLookup.get('riskInterceptRate') ?? 100) < 78;
    }

    if (event.id === 'overBlocking') {
      return (metricLookup.get('escalationRate') ?? 0) >= 25;
    }

    return false;
  });

  return inferredEvents.slice(0, 2);
}

function deriveReviewSignals(
  requestBreakdowns: ScenarioRequestBreakdown[],
  metrics: ScenarioMetric[],
  activeEvents: ScenarioEvent[],
): ScenarioReviewSignal[] {
  const signals: ScenarioReviewSignal[] = [];
  const metricLookup = new Map(metrics.map((metric) => [metric.id, metric.value]));
  const longContextRisks = requestBreakdowns.filter((item) =>
    item.contextCondition === 'long' && item.risks.length > 0,
  );
  const sensitiveRisks = requestBreakdowns.filter((item) =>
    item.estimatedRiskInterceptRate < 82 && item.risks.some((risk) => risk.includes('risk')),
  );

  if ((metricLookup.get('qualityComplaintRate') ?? 0) >= 6 || longContextRisks.length > 0) {
    signals.push({
      id: 'quality-context-risk',
      severity: 'warning',
      title: 'Quality and context fit need review',
      detail: 'Long-context or high-quality traffic is showing elevated failure or complaint pressure.',
      relatedMetricIds: ['successRate', 'qualityComplaintRate'],
      relatedRequestTypeIds: longContextRisks.map((item) => item.requestTypeId),
    });
  }

  if ((metricLookup.get('riskInterceptRate') ?? 100) < 82 || sensitiveRisks.length > 0) {
    signals.push({
      id: 'risk-routing-boundary',
      severity: 'critical',
      title: 'Risk routing boundary is weak',
      detail: 'Medium/high-risk traffic may be reaching models without enough risk-handling capability.',
      relatedMetricIds: ['riskInterceptRate', 'escalationRate'],
      relatedRequestTypeIds: sensitiveRisks.map((item) => item.requestTypeId),
    });
  }

  if ((metricLookup.get('p95LatencyMs') ?? 0) >= 6500 || (metricLookup.get('escalationRate') ?? 0) >= 25) {
    signals.push({
      id: 'sla-escalation-pressure',
      severity: 'warning',
      title: 'SLA pressure is coming from escalation and queues',
      detail: 'Tail latency is likely amplified by strong/restricted model queue pressure or fallback chains.',
      relatedMetricIds: ['p95LatencyMs', 'escalationRate'],
      relatedRequestTypeIds: requestBreakdowns
        .filter((item) => item.queuePressure > 20 || item.escalationProbability > 20)
        .map((item) => item.requestTypeId),
    });
  }

  for (const event of activeEvents) {
    signals.push({
      id: `event-${event.id}`,
      severity: 'info',
      title: event.title,
      detail: event.symptom,
      relatedMetricIds: getEventMetricIds(event.id),
      relatedRequestTypeIds: [],
    });
  }

  return signals;
}

function deriveRecommendations(
  exercise: ScenarioExercise,
  activeEvents: ScenarioEvent[],
  reviewSignals: ScenarioReviewSignal[],
  selectedOptions: ReturnType<typeof getSelectedOptions>,
): string[] {
  const optionRecommendations = selectedOptions
    .flatMap(({ option }) => option.metricEffects)
    .filter((effect) => effect.direction === 'mixed')
    .map((effect) => `Watch mixed effect on ${effect.metricId}: ${effect.explanation}`);
  const signalRecommendations = reviewSignals.map((signal) => signal.detail);
  const eventRecommendations = activeEvents.flatMap((event) => event.nextStepRecommendations);
  const fallbackRecommendations = activeEvents.length === 0 ? exercise.reviewRubric.nextStepRecommendations : [];

  return [...new Set([...eventRecommendations, ...signalRecommendations, ...optionRecommendations, ...fallbackRecommendations])].slice(
    0,
    8,
  );
}

function buildScenarioExplanation(
  exercise: ScenarioExercise,
  selectedOptions: ReturnType<typeof getSelectedOptions>,
  activeEvents: ScenarioEvent[],
): string {
  const optionText = selectedOptions.map(({ controlLabel, option }) => `${controlLabel}=${option.label}`).join(', ');
  const eventText = activeEvents.length > 0
    ? `Active event signals: ${activeEvents.map((event) => event.title).join(', ')}.`
    : 'No configured event is fully triggered; review metric signals for residual risk.';

  return `${exercise.title}: evaluated deterministic strategy combination (${optionText}). ${eventText}`;
}

function createDefaultMatch(exercise: ScenarioExercise, request: ScenarioRequestType): RuleMatchWithReason {
  const targetModel =
    (exercise.modelPool ?? []).find((model) => model.type === 'fast') ??
    (exercise.modelPool ?? [])[0];

  if (!targetModel) {
    throw new Error(`Scenario ${exercise.id} has no model pool entry for ${request.id}.`);
  }

  return {
    option: {
      id: 'default',
      label: 'Default',
      description: 'Default fast model fallback.',
      routingRules: [],
      metricEffects: [],
    },
    targetModel,
    priority: 0,
    specificity: 0,
    reason: `Default route for ${request.label}`,
  };
}

function findModel(exercise: ScenarioExercise, modelId: string): ScenarioModel | undefined {
  return (exercise.modelPool ?? []).find((model) => model.id === modelId);
}

function ruleTarget(rule: {
  requestTypeId?: string;
  riskLevel?: ScenarioRequestType['riskLevel'];
  contextCondition?: ScenarioRequestBreakdown['contextCondition'];
  slaCondition?: ScenarioRequestBreakdown['slaCondition'];
}) {
  return rule;
}

function ruleMatchesRequest(
  rule: ReturnType<typeof ruleTarget>,
  request: ScenarioRequestType,
): boolean {
  return (
    (rule.requestTypeId === undefined || rule.requestTypeId === request.id) &&
    (rule.riskLevel === undefined || rule.riskLevel === request.riskLevel) &&
    (rule.contextCondition === undefined || rule.contextCondition === getContextCondition(request)) &&
    (rule.slaCondition === undefined || rule.slaCondition === getSlaCondition(request))
  );
}

function getRuleSpecificity(rule: ReturnType<typeof ruleTarget>): number {
  return [
    rule.requestTypeId,
    rule.riskLevel,
    rule.contextCondition,
    rule.slaCondition,
  ].filter(Boolean).length;
}

function getContextCondition(request: ScenarioRequestType): ScenarioRequestBreakdown['contextCondition'] {
  if (request.avgInputTokens >= 10000) {
    return 'long';
  }

  if (request.avgInputTokens >= 3000) {
    return 'medium';
  }

  return 'short';
}

function getSlaCondition(request: ScenarioRequestType): ScenarioRequestBreakdown['slaCondition'] {
  return request.slaMs <= 2000 ? 'strict' : 'normal';
}

function getQualityThreshold(request: ScenarioRequestType): number {
  if (request.qualityNeed === 'high') {
    return 0.84;
  }

  if (request.qualityNeed === 'medium') {
    return 0.7;
  }

  return 0.58;
}

function getRiskThreshold(request: ScenarioRequestType): number {
  if (request.riskLevel === 'high') {
    return 0.9;
  }

  if (request.riskLevel === 'medium') {
    return 0.72;
  }

  return 0.48;
}

function getFallbackSuccessLift(
  fallbackMode: string,
  fallbackModel: ScenarioModel | undefined,
  request: ScenarioRequestType,
): number {
  if (fallbackMode === 'retrySame') {
    return 0.018;
  }

  if (fallbackMode !== 'escalateOnFailure' || !fallbackModel) {
    return 0;
  }

  const qualityLift = Math.max(0, fallbackModel.qualityScore - getQualityThreshold(request)) * 0.11;
  const riskLift = Math.max(0, fallbackModel.riskHandlingScore - getRiskThreshold(request)) * 0.07;

  return 0.028 + qualityLift + riskLift;
}

function getRiskPolicyBonus(optionIds: string[]): number {
  if (optionIds.includes('strictGuard')) {
    return 0.08;
  }

  if (optionIds.includes('standardGuard')) {
    return 0.04;
  }

  if (optionIds.includes('minimalGuard')) {
    return -0.08;
  }

  return 0;
}

function getEscalationProbability(
  fallbackMode: string,
  request: ScenarioRequestType,
  qualityGap: number,
  riskGap: number,
  contextPenalty: number,
  optionIds: string[],
): number {
  const base = fallbackMode === 'noFallback' ? 0 : fallbackMode === 'retrySame' ? 0.07 : 0.11;
  const strictGuardPressure = optionIds.includes('strictGuard') && request.riskLevel !== 'low' ? 0.11 : 0;
  const standardGuardPressure = optionIds.includes('standardGuard') && request.riskLevel === 'medium' ? 0.04 : 0;
  const capabilityPressure = qualityGap * 0.35 + riskGap * 0.22 + contextPenalty * 0.6;

  return clamp(base + strictGuardPressure + standardGuardPressure + capabilityPressure, 0, 0.62);
}

function deriveRequestRisks(
  request: ScenarioRequestType,
  model: ScenarioModel,
  qualityGap: number,
  riskGap: number,
  contextPenalty: number,
  queuePressure: number,
): string[] {
  const risks: string[] = [];

  if (contextPenalty > 0) {
    risks.push(`${request.label} exceeds ${model.label} context capacity.`);
  }

  if (qualityGap > 0.05) {
    risks.push(`${request.label} quality need is higher than ${model.label} capability.`);
  }

  if (riskGap > 0.08) {
    risks.push(`${request.label} risk level needs stronger permission or sensitive-action handling.`);
  }

  if (queuePressure > 0.35) {
    risks.push(`${model.label} has queue pressure that can amplify P95 latency.`);
  }

  return risks;
}

function weightedSum(
  requestBreakdowns: ScenarioRequestBreakdown[],
  valueSelector: (breakdown: ScenarioRequestBreakdown) => number,
): number {
  return requestBreakdowns.reduce(
    (total, item) => total + item.volumeShare * valueSelector(item),
    0,
  );
}

function weightedRiskMetric(
  requestBreakdowns: ScenarioRequestBreakdown[],
  valueSelector: (breakdown: ScenarioRequestBreakdown) => number,
): number {
  const riskTraffic = requestBreakdowns.filter((item) => item.riskHandlingScore > 0 || item.estimatedRiskInterceptRate > 0);
  const denominator = riskTraffic.reduce((total, item) => total + item.volumeShare, 0);

  if (denominator === 0) {
    return 0;
  }

  return riskTraffic.reduce((total, item) => total + item.volumeShare * valueSelector(item), 0) / denominator;
}

function estimateP95Latency(requestBreakdowns: ScenarioRequestBreakdown[]): number {
  const weightedLatency = weightedSum(requestBreakdowns, (item) => item.estimatedLatencyMs);
  const tailLatency = Math.max(...requestBreakdowns.map((item) => item.estimatedLatencyMs));

  return Math.max(weightedLatency * 1.2, tailLatency * 0.95);
}

function deriveTrend(
  metricId: ScenarioMetricId,
  value: number,
  baselineValue = value,
): ScenarioMetricTrend {
  const delta = value - baselineValue;
  const tolerance = metricId === 'p95LatencyMs' ? 250 : 0.5;

  if (Math.abs(delta) <= tolerance) {
    return 'neutral';
  }

  const lowerIsBetter = metricId === 'costPer1kRequests' ||
    metricId === 'p95LatencyMs' ||
    metricId === 'escalationRate' ||
    metricId === 'qualityComplaintRate';

  if (metricId === 'escalationRate') {
    return Math.abs(delta) <= 4 ? 'neutral' : delta < 0 ? 'better' : 'worse';
  }

  return lowerIsBetter === (delta < 0) ? 'better' : 'worse';
}

function formatMetricEffect(option: StrategyOption, effect: MetricEffect): string {
  return `${option.label} ${effect.metricId} ${effect.direction}/${effect.magnitude}: ${effect.explanation}`;
}

function getEventMetricIds(eventId: string): ScenarioMetricId[] {
  if (eventId === 'costDownComplaintsUp') {
    return ['costPer1kRequests', 'successRate', 'qualityComplaintRate'];
  }

  if (eventId === 'slaBreach') {
    return ['p95LatencyMs', 'escalationRate'];
  }

  if (eventId === 'riskLeak') {
    return ['riskInterceptRate', 'escalationRate'];
  }

  if (eventId === 'overBlocking') {
    return ['riskInterceptRate', 'escalationRate', 'p95LatencyMs'];
  }

  return [];
}

function toModelChoice(breakdown: ScenarioRequestBreakdown): ScenarioModelChoice {
  return {
    requestTypeId: breakdown.requestTypeId,
    requestLabel: breakdown.requestLabel,
    selectedModelId: breakdown.selectedModelId,
    selectedModelLabel: breakdown.selectedModelLabel,
    fallbackModelId: breakdown.fallbackModelId,
    fallbackModelLabel: breakdown.fallbackModelLabel,
    appliedStrategyOptionIds: breakdown.appliedStrategyOptionIds,
    decisionReasons: breakdown.decisionReasons,
  };
}

function isSimulationState(
  value: ScenarioSimulationState | ScenarioStrategySelection,
): value is ScenarioSimulationState {
  return 'selectedStrategies' in value && 'round' in value;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round(value: number, fractionDigits: number): number {
  const multiplier = 10 ** fractionDigits;
  return Math.round(value * multiplier) / multiplier;
}
