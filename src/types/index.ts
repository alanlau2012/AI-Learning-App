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
  mechanism: string[];
  animation?: AnimationConfig;
  enterpriseCase: EnterpriseCase;
  pitfalls: string[];
  diagnosticQuestion?: DiagnosticQuestion;
  keyTakeaways: string[];
  relatedConceptIds: string[];
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
}
