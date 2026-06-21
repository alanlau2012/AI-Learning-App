/**
 * 唯一全局状态：用户学习进度（Zustand）。
 *
 * 状态结构 = content-schema.md §1 的 UserProgress（架构见 docs/architecture.md §3）。
 * 持久化与迁移集中在 utils/progress.ts：初始态来自 loadProgress()，每次动作后 saveProgress() 回写。
 * 派生值（完成度/模块进度/连续天数展示）不在此存储，由 utils/progress.ts 计算。
 *
 * 动作：
 * - toggleComplete / toggleFavorite：切换成员（去重）
 * - recordWrongQuestion：记录错题（去重，不重复入队）
 * - recordVisit：进详情页时更新 lastVisitedConceptId，并按跨日规则更新 lastStudyDate/studyStreakDays
 * - clearAll：清空学习记录（回退 defaultProgress）
 */
import { create } from 'zustand';
import type { UserProgress } from '../types';
import {
  defaultProgress,
  loadProgress,
  saveProgress,
} from '../utils/progress';

interface ProgressState extends UserProgress {
  toggleComplete: (conceptId: string) => void;
  toggleFavorite: (conceptId: string) => void;
  recordWrongQuestion: (questionId: string) => void;
  recordVisit: (conceptId: string) => void;
  clearAll: () => void;
}

/** 本地日期 YYYY-MM-DD（基于浏览器本地时区）。 */
function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** 昨天的 ISO 日期，用于判断「连续」。 */
function yesterdayISO(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** 仅持久化 UserProgress 数据字段（不含动作）。 */
function persist(state: UserProgress): void {
  saveProgress({
    completedConceptIds: state.completedConceptIds,
    favoriteConceptIds: state.favoriteConceptIds,
    wrongQuestionIds: state.wrongQuestionIds,
    lastVisitedConceptId: state.lastVisitedConceptId,
    lastStudyDate: state.lastStudyDate,
    studyStreakDays: state.studyStreakDays,
  });
}

function toggleMember(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
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
    // 跨日连续判断：同日不变；次日 +1；间隔 >1 天（或首次）重置为 1。
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
    set({
      lastVisitedConceptId: conceptId,
      lastStudyDate: today,
      studyStreakDays,
    });
  },

  clearAll: () => {
    const empty = defaultProgress();
    persist(empty);
    set(empty);
  },
}));
