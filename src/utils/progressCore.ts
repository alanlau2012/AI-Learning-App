/**
 * Lightweight progress persistence and navigation helpers.
 *
 * Keep this module free of full lesson content imports so AppShell, Sidebar,
 * Home, and the Zustand store do not pull all 56 lessons into the entry chunk.
 */
import type { KnowledgePoint, UserProgress } from '../types';
import { modules } from '../data/modules';

export const PROGRESS_STORAGE_KEY = 'ai-learning-app-progress-v1';
export const CURRENT_PROGRESS_VERSION = 1;

export function defaultProgress(): UserProgress {
  return {
    completedConceptIds: [],
    favoriteConceptIds: [],
    wrongQuestionIds: [],
    reviewConceptIds: [],
    studyStreakDays: 0,
  };
}

function isUserProgressShape(data: unknown): data is UserProgress {
  if (typeof data !== 'object' || data === null) return false;
  const o = data as Record<string, unknown>;
  return (
    Array.isArray(o.completedConceptIds) &&
    Array.isArray(o.favoriteConceptIds) &&
    Array.isArray(o.wrongQuestionIds) &&
    (o.reviewConceptIds === undefined || Array.isArray(o.reviewConceptIds)) &&
    typeof o.studyStreakDays === 'number' &&
    (o.lastVisitedConceptId === undefined || typeof o.lastVisitedConceptId === 'string') &&
    (o.lastStudyDate === undefined || typeof o.lastStudyDate === 'string')
  );
}

export function migrateProgress(fromVersion: number, data: unknown): UserProgress {
  if (fromVersion === CURRENT_PROGRESS_VERSION && isUserProgressShape(data)) {
    return {
      ...data,
      reviewConceptIds: Array.isArray(data.reviewConceptIds) ? data.reviewConceptIds : [],
    };
  }
  return defaultProgress();
}

export function loadProgress(): UserProgress {
  if (typeof localStorage === 'undefined') return defaultProgress();
  const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
  if (!raw) return defaultProgress();
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (
      parsed &&
      typeof parsed === 'object' &&
      'version' in parsed &&
      'progress' in parsed
    ) {
      const wrapped = parsed as { version: number; progress: unknown };
      return migrateProgress(wrapped.version, wrapped.progress);
    }
    return migrateProgress(0, parsed);
  } catch {
    return defaultProgress();
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(
      PROGRESS_STORAGE_KEY,
      JSON.stringify({ version: CURRENT_PROGRESS_VERSION, progress }),
    );
  } catch {
    // Storage quota or private-mode failures should not break the UI.
  }
}

export interface OverallProgress {
  done: number;
  total: number;
  percent: number;
}

export interface ModuleProgress {
  done: number;
  total: number;
}

export const orderedPublishedConceptIds = modules.flatMap((module) => module.conceptIds);
export const publishedConceptIdSet = new Set(orderedPublishedConceptIds);

export function overallProgress(completedConceptIds: string[]): OverallProgress {
  const total = modules.reduce((sum, module) => sum + module.conceptIds.length, 0);
  const done = completedConceptIds.length;
  return {
    done,
    total,
    percent: total > 0 ? Math.round((done / total) * 100) : 0,
  };
}

export function isPublishedConcept(
  concept: Pick<KnowledgePoint, 'contentStatus'> | null | undefined,
): boolean {
  return concept?.contentStatus !== undefined && concept.contentStatus !== 'stub';
}

export function isPublishedConceptId(conceptId: string | undefined): boolean {
  return Boolean(conceptId && publishedConceptIdSet.has(conceptId));
}

export function getFirstPublishedConceptIdByModule(moduleId: string): string | undefined {
  const module = modules.find((item) => item.id === moduleId);
  return module?.conceptIds.find((id) => publishedConceptIdSet.has(id));
}

export function getContinueLearningConceptId(progress: UserProgress): string {
  if (
    progress.lastVisitedConceptId &&
    publishedConceptIdSet.has(progress.lastVisitedConceptId)
  ) {
    return progress.lastVisitedConceptId;
  }
  const completed = new Set(progress.completedConceptIds);
  for (const id of orderedPublishedConceptIds) {
    if (!completed.has(id)) {
      return id;
    }
  }
  return orderedPublishedConceptIds[0] ?? '';
}

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
