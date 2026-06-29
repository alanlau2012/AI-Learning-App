/**
 * 唯一全局状态：用户学习进度（Zustand）。
 *
 * 持久化与迁移集中在 utils/progressCore.ts；这里只暴露页面动作。
 */
import { create } from 'zustand';
import type { UserProgress } from '../types';
import { defaultProgress, loadProgress, saveProgress } from '../utils/progressCore';

interface ProgressState extends UserProgress {
  toggleComplete: (conceptId: string) => void;
  completeScenario: (scenarioId: string) => void;
  toggleFavorite: (conceptId: string) => void;
  toggleReviewConcept: (conceptId: string) => void;
  toggleReviewScenario: (scenarioId: string) => void;
  removeReviewConcept: (conceptId: string) => void;
  removeReviewScenario: (scenarioId: string) => void;
  recordWrongQuestion: (questionId: string) => void;
  recordVisit: (conceptId: string) => void;
  recordScenarioVisit: (scenarioId: string) => void;
  clearAll: () => void;
}

function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function yesterdayISO(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function persist(state: UserProgress): void {
  saveProgress({
    completedConceptIds: state.completedConceptIds,
    completedScenarioIds: state.completedScenarioIds,
    favoriteConceptIds: state.favoriteConceptIds,
    wrongQuestionIds: state.wrongQuestionIds,
    reviewConceptIds: state.reviewConceptIds,
    reviewScenarioIds: state.reviewScenarioIds,
    lastVisitedConceptId: state.lastVisitedConceptId,
    lastVisitedScenarioId: state.lastVisitedScenarioId,
    lastStudyDate: state.lastStudyDate,
    studyStreakDays: state.studyStreakDays,
  });
}

function toggleMember(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}

function removeMember(list: string[], id: string): string[] {
  return list.filter((x) => x !== id);
}

export const useProgressStore = create<ProgressState>()((set, get) => ({
  ...loadProgress(),

  toggleComplete: (conceptId) => {
    const completedConceptIds = toggleMember(get().completedConceptIds, conceptId);
    const next: UserProgress = { ...get(), completedConceptIds };
    persist(next);
    set({ completedConceptIds });
  },

  completeScenario: (scenarioId) => {
    if (get().completedScenarioIds.includes(scenarioId)) return;
    const completedScenarioIds = [...get().completedScenarioIds, scenarioId];
    // Product contract: submitting a scenario diagnosis marks it complete and
    // queues the scenario for later review; repeated submits remain idempotent.
    const reviewScenarioIds = get().reviewScenarioIds.includes(scenarioId)
      ? get().reviewScenarioIds
      : [...get().reviewScenarioIds, scenarioId];
    const next: UserProgress = { ...get(), completedScenarioIds, reviewScenarioIds };
    persist(next);
    set({ completedScenarioIds, reviewScenarioIds });
  },

  toggleFavorite: (conceptId) => {
    const favoriteConceptIds = toggleMember(get().favoriteConceptIds, conceptId);
    const next: UserProgress = { ...get(), favoriteConceptIds };
    persist(next);
    set({ favoriteConceptIds });
  },

  toggleReviewConcept: (conceptId) => {
    const reviewConceptIds = toggleMember(get().reviewConceptIds, conceptId);
    const next: UserProgress = { ...get(), reviewConceptIds };
    persist(next);
    set({ reviewConceptIds });
  },

  toggleReviewScenario: (scenarioId) => {
    const reviewScenarioIds = toggleMember(get().reviewScenarioIds, scenarioId);
    const next: UserProgress = { ...get(), reviewScenarioIds };
    persist(next);
    set({ reviewScenarioIds });
  },

  removeReviewConcept: (conceptId) => {
    const reviewConceptIds = removeMember(get().reviewConceptIds, conceptId);
    const next: UserProgress = { ...get(), reviewConceptIds };
    persist(next);
    set({ reviewConceptIds });
  },

  removeReviewScenario: (scenarioId) => {
    const reviewScenarioIds = removeMember(get().reviewScenarioIds, scenarioId);
    const next: UserProgress = { ...get(), reviewScenarioIds };
    persist(next);
    set({ reviewScenarioIds });
  },

  recordWrongQuestion: (questionId) => {
    if (get().wrongQuestionIds.includes(questionId)) return;
    const wrongQuestionIds = [...get().wrongQuestionIds, questionId];
    const next: UserProgress = { ...get(), wrongQuestionIds };
    persist(next);
    set({ wrongQuestionIds });
  },

  recordVisit: (conceptId) => {
    const cur = get();
    const today = todayISO();
    let studyStreakDays = cur.studyStreakDays;
    if (cur.lastStudyDate !== today) {
      studyStreakDays = cur.lastStudyDate === yesterdayISO() ? cur.studyStreakDays + 1 : 1;
    }
    const next: UserProgress = {
      ...cur,
      lastVisitedConceptId: conceptId,
      lastStudyDate: today,
      studyStreakDays,
    };
    persist(next);
    set({ lastVisitedConceptId: conceptId, lastStudyDate: today, studyStreakDays });
  },

  recordScenarioVisit: (scenarioId) => {
    const next: UserProgress = {
      ...get(),
      lastVisitedScenarioId: scenarioId,
    };
    persist(next);
    set({ lastVisitedScenarioId: scenarioId });
  },

  clearAll: () => {
    const empty = defaultProgress();
    persist(empty);
    set(empty);
  },
}));
