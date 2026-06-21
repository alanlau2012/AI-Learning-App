/**
 * 学习进度的持久化、版本迁移与派生计算。
 *
 * - 持久化 key 固定 `ai-learning-app-progress-v1`，写入结构 `{ version, progress }`。
 * - loadProgress：解析 → 校验 version → migrateProgress 逐级迁移 → 失败/未知版本回退
 *   defaultProgress（不抛错、不清空 localStorage 原始备份、UI 不白屏）。
 * - 派生值（完成度百分比、模块 done/total）只在这里计算，不冗余存储。
 *
 * 版本策略见 docs/architecture.md §3.1。
 */
import type { KnowledgePoint, UserProgress } from '../types';
import { concepts } from '../data/concepts';
import { modules } from '../data/modules';

export const PROGRESS_STORAGE_KEY = 'ai-learning-app-progress-v1';
export const CURRENT_PROGRESS_VERSION = 1;

/** 空进度（未学习）。迁移/解析失败时统一回退到此，保证 UI 不崩溃。 */
export function defaultProgress(): UserProgress {
  return {
    completedConceptIds: [],
    favoriteConceptIds: [],
    wrongQuestionIds: [],
    studyStreakDays: 0,
  };
}

/** 运行时形状校验：足够像 UserProgress 才接受，否则视为损坏回退默认值。 */
function isUserProgressShape(data: unknown): data is UserProgress {
  if (typeof data !== 'object' || data === null) return false;
  const o = data as Record<string, unknown>;
  return (
    Array.isArray(o.completedConceptIds) &&
    Array.isArray(o.favoriteConceptIds) &&
    Array.isArray(o.wrongQuestionIds) &&
    typeof o.studyStreakDays === 'number' &&
    (o.lastVisitedConceptId === undefined || typeof o.lastVisitedConceptId === 'string') &&
    (o.lastStudyDate === undefined || typeof o.lastStudyDate === 'string')
  );
}

/**
 * 按 version 逐级迁移到 CURRENT_PROGRESS_VERSION。
 * 当前仅 v1；版本高于当前或数据结构异常时回退 defaultProgress()
 * （不抛错、不清空 localStorage 原始备份）。
 */
export function migrateProgress(fromVersion: number, data: unknown): UserProgress {
  if (fromVersion === CURRENT_PROGRESS_VERSION && isUserProgressShape(data)) {
    return data;
  }
  // 无法识别的版本（含未来更高版本）：兜底默认值，不抛错。
  return defaultProgress();
}

/**
 * 读取并迁移进度。任何异常都回退 defaultProgress()，绝不抛错、绝不白屏。
 * SSR / 非浏览器环境（无 localStorage）同样安全回退。
 */
export function loadProgress(): UserProgress {
  if (typeof localStorage === 'undefined') return defaultProgress();
  const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
  if (!raw) return defaultProgress();
  try {
    const parsed = JSON.parse(raw) as unknown;
    // 推荐结构：{ version, progress }
    if (
      parsed &&
      typeof parsed === 'object' &&
      'version' in parsed &&
      'progress' in parsed
    ) {
      const wrapped = parsed as { version: number; progress: unknown };
      return migrateProgress(wrapped.version, wrapped.progress);
    }
    // 兼容历史裸结构（无 wrapper）：当作 v0 迁移。
    return migrateProgress(0, parsed);
  } catch {
    return defaultProgress();
  }
}

/** 回写进度（带 version）。存储不可用/满时静默吞错，UI 继续。 */
export function saveProgress(progress: UserProgress): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(
      PROGRESS_STORAGE_KEY,
      JSON.stringify({ version: CURRENT_PROGRESS_VERSION, progress }),
    );
  } catch {
    // 配额满 / 隐私模式禁用：静默忽略，UI 不受影响。
  }
}

// ---- 派生计算（不冗余存储） ----

export interface OverallProgress {
  done: number;
  total: number;
  percent: number;
}

/** 总进度：已完成 / 56。 */
export function overallProgress(completedConceptIds: string[]): OverallProgress {
  const total = concepts.length;
  const done = completedConceptIds.length;
  return {
    done,
    total,
    percent: total > 0 ? Math.round((done / total) * 100) : 0,
  };
}

export interface ModuleProgress {
  done: number;
  total: number;
}

const conceptById = new Map(concepts.map((c) => [c.id, c]));

const orderedConcepts = modules.flatMap((module) =>
  module.conceptIds
    .map((id) => conceptById.get(id))
    .filter((concept): concept is KnowledgePoint => Boolean(concept)),
);

export function isPublishedConcept(
  concept: Pick<KnowledgePoint, 'contentStatus'> | null | undefined,
): boolean {
  return concept?.contentStatus !== undefined && concept.contentStatus !== 'stub';
}

const orderedPublishedConcepts = orderedConcepts.filter(isPublishedConcept);
const publishedConceptIdSet = new Set(orderedPublishedConcepts.map((concept) => concept.id));

export function getOrderedPublishedConcepts(): KnowledgePoint[] {
  return orderedPublishedConcepts;
}

export function isPublishedConceptId(conceptId: string | undefined): boolean {
  return Boolean(conceptId && publishedConceptIdSet.has(conceptId));
}

export function getFirstPublishedConceptIdByModule(moduleId: string): string | undefined {
  const module = modules.find((item) => item.id === moduleId);
  return module?.conceptIds.find((id) => publishedConceptIdSet.has(id));
}

/**
 * 「继续学习」目标（驱动首页核心动作）：
 * lastVisitedConceptId 仍存在且已上线 → 回到它；否则按模块顺序找第一个未完成的已上线内容；
 * 全部完成 → 第一个概念。返回 concept id（=== slug，可直接用于 /concepts/:slug）。
 */
export function getContinueLearningConceptId(progress: UserProgress): string {
  if (
    progress.lastVisitedConceptId &&
    publishedConceptIdSet.has(progress.lastVisitedConceptId)
  ) {
    return progress.lastVisitedConceptId;
  }
  const completed = new Set(progress.completedConceptIds);
  for (const concept of orderedPublishedConcepts) {
    if (!completed.has(concept.id)) {
      return concept.id;
    }
  }
  return orderedPublishedConcepts[0]?.id ?? '';
}

/** 单模块进度：done / 该模块概念数。completed 用 Set 加速查找。 */
export function moduleProgress(
  moduleId: string,
  completed: ReadonlySet<string>,
): ModuleProgress {
  const m = modules.find((x) => x.id === moduleId);
  if (!m) return { done: 0, total: 0 };
  let done = 0;
  for (const id of m.conceptIds) {
    if (completed.has(id)) done += 1;
  }
  return { done, total: m.conceptIds.length };
}
