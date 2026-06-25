/**
 * 内容数据 schema 的唯一来源（权威）。
 *
 * 逐字采用 docs/content-schema.md §1 的 TypeScript 接口；AnimationType 枚举
 * 来自 docs/animation-spec.md §1。字段命名以 PRD 接口为准，不引入 56 讲写作
 * 模板的别名字段（oneSentence / commonPitfalls / animationBrief / relatedConcepts
 * 仅用于写作，落库时按 content-schema §3 映射转换）。
 *
 * 修改本文件必须同步更新 docs/content-schema.md 与 validate:content 校验规则。
 */

export type Difficulty = 'basic' | 'intermediate' | 'advanced';

export type ContentStatus = 'stub' | 'demo' | 'mvp';

/** 动画类型枚举（docs/animation-spec.md §1，17 值）。 */
export type AnimationType =
  | 'token-flow'
  | 'semantic-space'
  | 'attention-map'
  | 'context-window'
  | 'prefill-decode'
  | 'kv-cache'
  | 'batch-scheduler'
  | 'pd-separation'
  | 'model-router'
  | 'cache-layers'
  | 'rag-pipeline'
  | 'agent-loop'
  | 'tool-calling'
  | 'skill-lifecycle'
  | 'issue-fix-flow'
  | 'observability-trace'
  | 'token-roi-flow';

/** 正文改版版本：`legacy` 为 flat mechanism；`v2` 为分组机制 + 深度标准（docs/content-schema.md §7）。 */
export type ContentRevision = 'legacy' | 'v2';

export type CapabilityDomain =
  | 'modelMechanics'
  | 'inferenceCostPerformance'
  | 'maasPlatformization'
  | 'ragContextEngineering'
  | 'agentEngineering'
  | 'evaluationObservability'
  | 'securityGovernanceOrg';

export interface CapabilityDomainMapping {
  primary: CapabilityDomain;
  secondary?: CapabilityDomain;
}

export interface DecisionScenario {
  id: string;
  title: string;
  description: string;
  signals: string[];
}

export interface DecisionSignal {
  id: string;
  metricOrFact: string;
  threshold?: string;
  interpretation: string;
  evidenceSource: string;
}

export type ArchitectureTradeoffDimension =
  | 'cost'
  | 'latency'
  | 'quality'
  | 'reliability'
  | 'observability'
  | 'security'
  | 'operability';

export interface ArchitectureTradeoff {
  id: string;
  dimension: ArchitectureTradeoffDimension;
  gain: string;
  cost: string;
  watchOut: string;
}

export interface ReviewQuestion {
  id: string;
  question: string;
  whyAsk: string;
  goodAnswerSignals: string[];
}

export type ChecklistPhase = 'beforeBuild' | 'beforeLaunch' | 'running';

export interface ChecklistItem {
  id: string;
  phase: ChecklistPhase;
  item: string;
  passSignal: string;
}

export interface ExecutiveExplanation {
  summary: string;
  businessValue: string;
  mainRisk: string;
  riskControl: string;
}

export interface DecisionGuide {
  applicableScenarios: DecisionScenario[];
  nonApplicableScenarios: DecisionScenario[];
  decisionSignals: DecisionSignal[];
  tradeoffs: ArchitectureTradeoff[];
  reviewQuestions: ReviewQuestion[];
  implementationChecklist: ChecklistItem[];
  executiveExplanation: ExecutiveExplanation;
}
export interface MechanismGroup {
  label: string;
  title: string;
  items: string[];
}

/** 迁移期 union：string[] 为 legacy flat；MechanismGroup[] 为 v2 分组。 */
export type MechanismContent = string[] | MechanismGroup[];

export function isMechanismGrouped(
  mechanism: MechanismContent,
): mechanism is MechanismGroup[] {
  return mechanism.length > 0 && typeof mechanism[0] === 'object';
}

export interface AnimationStep {
  id: string;
  title: string;
  description: string;
  highlightTargets?: string[];
  durationMs?: number;
}

export interface AnimationConfig {
  type: AnimationType;
  title: string;
  steps: AnimationStep[];
}

export interface EnterpriseCase {
  title: string;
  scenario: string;
  problem: string;
  analysis: string;
  solution: string;
  takeaway: string;
}

export interface DiagnosticOption {
  id: string;
  text: string;
}

export interface DiagnosticQuestion {
  id: string;
  type: 'single' | 'multiple';
  scenario: string;
  question: string;
  options: DiagnosticOption[];
  correctOptionIds: string[];
  explanation: string;
  troubleshootingPath: string[];
  relatedConceptIds: string[];
}

export interface KnowledgePoint {
  id: string;
  title: string;
  slug: string;
  moduleId: string;
  order: number;
  difficulty: Difficulty;
  estimatedMinutes: number;
  tags: string[];
  contentStatus: ContentStatus; // 内容成熟度，决定校验严格度
  hasAnimation: boolean;
  definition: string;
  whyItMatters: string;
  mentalModel: string;
  mechanism: MechanismContent;
  contentRevision?: ContentRevision;
  animation?: AnimationConfig;
  enterpriseCase: EnterpriseCase;
  pitfalls: string[];
  diagnosticQuestion?: DiagnosticQuestion;
  keyTakeaways: string[];
  relatedConceptIds: string[];
  decisionGuide?: DecisionGuide;
  capabilityDomains?: CapabilityDomainMapping;
}

export interface LearningModule {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  order: number;
  conceptIds: string[];
  recommendedFor: string[];
}

export interface UserProgress {
  completedConceptIds: string[];
  favoriteConceptIds: string[];
  wrongQuestionIds: string[];
  reviewConceptIds: string[];
  lastVisitedConceptId?: string;
  lastStudyDate?: string;
  studyStreakDays: number;
}

export interface GlossaryTerm {
  id: string; // kebab-case，唯一
  name: string; // 中文名
  enName: string; // 英文名
  definition: string; // 一句话解释
  moduleId: string; // 所属模块 m1–m6
  relatedConceptIds: string[]; // 指向已存在的 KnowledgePoint.id
  tags?: string[];
  capabilityDomains?: CapabilityDomain[];
  confusedWith?: string[]; // 常被混淆概念 / 易混点
}
export interface HyperframeChapter {
  id: string;
  title: string;
  startSeconds: number;
  relatedConceptId?: string;
}

export interface HyperframeMaterial {
  id: string;
  title: string;
  subtitle: string;
  moduleId: string;
  durationSeconds: number;
  src: string;
  width: number;
  height: number;
  relatedConceptIds: string[];
  chapters: HyperframeChapter[];
}
export interface RolePathPhase {
  id: string;
  title: string;
  conceptIds: string[];
  outcome: string;
}

export interface RolePath {
  id: 'aiEngineeringLeader' | 'platformEngineer' | 'applicationArchitect' | 'governanceOwner';
  title: string;
  goal: string;
  recommendedConceptIds: string[];
  phases: RolePathPhase[];
}
export type ScenarioRiskLevel = 'low' | 'medium' | 'high';

export type ScenarioQualityNeed = 'low' | 'medium' | 'high';

export type ScenarioModelType = 'fast' | 'strong' | 'lowCost' | 'restricted';

export type ScenarioContextCondition = 'short' | 'medium' | 'long';

export type ScenarioSlaCondition = 'strict' | 'normal';

export type ScenarioMetricId =
  | 'costPer1kRequests'
  | 'p95LatencyMs'
  | 'successRate'
  | 'escalationRate'
  | 'riskInterceptRate'
  | 'qualityComplaintRate';

export type ScenarioMetricTrend = 'better' | 'worse' | 'neutral';

export type MetricEffectDirection = 'up' | 'down' | 'mixed';

export type MetricEffectMagnitude = 'small' | 'medium' | 'large';

export interface ScenarioMetric {
  id: ScenarioMetricId;
  label: string;
  value: number;
  unit: string;
  trend: ScenarioMetricTrend;
  explanation: string;
}

export interface ScenarioState {
  selectedStrategies: Record<string, string>;
  metrics: ScenarioMetric[];
  explanation: string;
}

export interface ScenarioRequestType {
  id: string;
  label: string;
  description: string;
  volumeShare: number;
  avgInputTokens: number;
  riskLevel: ScenarioRiskLevel;
  qualityNeed: ScenarioQualityNeed;
  slaMs: number;
}

export interface ScenarioModel {
  id: string;
  label: string;
  type: ScenarioModelType;
  costPer1kTokens: number;
  medianLatencyMs: number;
  qualityScore: number;
  riskHandlingScore: number;
  contextLimitTokens: number;
  availability: string;
}

export interface RoutingRule {
  requestTypeId?: string;
  riskLevel?: ScenarioRiskLevel;
  contextCondition?: ScenarioContextCondition;
  slaCondition?: ScenarioSlaCondition;
  targetModelId: string;
  fallbackModelId?: string;
}

export interface MetricEffect {
  metricId: ScenarioMetricId;
  direction: MetricEffectDirection;
  magnitude: MetricEffectMagnitude;
  explanation: string;
}

export interface StrategyOption {
  id: string;
  label: string;
  description: string;
  routingRules: RoutingRule[];
  metricEffects: MetricEffect[];
}

export interface StrategyControl {
  id: string;
  label: string;
  options: StrategyOption[];
}

export interface ScenarioEvent {
  id: string;
  title: string;
  symptom: string;
  triggerStrategyOptionIds: string[];
  correctDiagnosis: string;
  investigationOrder: string[];
  missedRisks: string[];
  relatedConceptIds: string[];
  nextStepRecommendations: string[];
}

export interface ScenarioReviewRubric {
  prompt: string;
  requiredFindings: string[];
  acceptableActions: string[];
  nextStepRecommendations: string[];
}

export interface ScenarioExercise {
  id: string;
  title: string;
  relatedConceptIds: string[];
  entryConceptIds: string[];
  background: string;
  baseline: ScenarioState;
  requestTypes: ScenarioRequestType[];
  modelPool: ScenarioModel[];
  strategyControls: StrategyControl[];
  events: ScenarioEvent[];
  reviewRubric: ScenarioReviewRubric;
}

