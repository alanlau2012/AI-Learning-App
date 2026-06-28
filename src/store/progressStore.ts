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
  toggleFavorite: (conceptId: string) => void;
  toggleReviewConcept: (conceptId: string) => void;
  removeReviewConcept: (conceptId: string) => void;
  recordWrongQuestion: (questionId: string) => void;
  recordVisit: (conceptId: string) => void;
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
    favoriteConceptIds: state.favoriteConceptIds,
    wrongQuestionIds: state.wrongQuestionIds,
    reviewConceptIds: state.reviewConceptIds,
    lastVisitedConceptId: state.lastVisitedConceptId,
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

  removeReviewConcept: (conceptId) => {
    const reviewConceptIds = removeMember(get().reviewConceptIds, conceptId);
    const next: UserProgress = { ...get(), reviewConceptIds };
    persist(next);
    set({ reviewConceptIds });
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

  clearAll: () => {
    const empty = defaultProgress();
    persist(empty);
    set(empty);
  },
}));
