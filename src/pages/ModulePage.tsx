import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { modules } from '../data/modules';
import { concepts } from '../data/concepts';
import { ConceptCard } from '../components/concept/ConceptCard';
import { ProgressBar } from '../components/progress/ProgressBar';
import { useProgressStore } from '../store/progressStore';
import { isPublishedConcept, moduleProgress } from '../utils/progress';
import type { Difficulty, KnowledgePoint } from '../types';
import styles from './ModulePage.module.css';

type DifficultyFilter = 'all' | Difficulty;
type StatusFilter = 'all' | 'todo' | 'completed' | 'favorite';
type AnimationFilter = 'all' | 'with' | 'without';
type SortKey = 'recommended' | 'duration' | 'difficulty';

const DIFFICULTY_RANK: Record<Difficulty, number> = {
  basic: 1,
  intermediate: 2,
  advanced: 3,
};

const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  basic: '基础',
  intermediate: '进阶',
  advanced: '高级',
};

function sortConcepts(list: KnowledgePoint[], sort: SortKey): KnowledgePoint[] {
  const sorted = [...list];
  if (sort === 'duration') {
    sorted.sort((a, b) => a.estimatedMinutes - b.estimatedMinutes || a.order - b.order);
  } else if (sort === 'difficulty') {
    sorted.sort((a, b) => DIFFICULTY_RANK[a.difficulty] - DIFFICULTY_RANK[b.difficulty] || a.order - b.order);
  } else {
    sorted.sort((a, b) => a.order - b.order);
  }
  return sorted;
}

export function ModulePage() {
  const { moduleId } = useParams();
  const module = modules.find((x) => x.id === moduleId);
  const completedConceptIds = useProgressStore((s) => s.completedConceptIds);
  const favoriteConceptIds = useProgressStore((s) => s.favoriteConceptIds);
  const toggleFavorite = useProgressStore((s) => s.toggleFavorite);
  const completedSet = useMemo(() => new Set(completedConceptIds), [completedConceptIds]);
  const favoriteSet = useMemo(() => new Set(favoriteConceptIds), [favoriteConceptIds]);
  const [difficulty, setDifficulty] = useState<DifficultyFilter>('all');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [animation, setAnimation] = useState<AnimationFilter>('all');
  const [sort, setSort] = useState<SortKey>('recommended');

  const moduleConcepts = useMemo(() => {
    if (!module) return [];
    const ids = new Set(module.conceptIds);
    return concepts.filter((concept) => ids.has(concept.id));
  }, [module]);

  const filtered = useMemo(() => {
    const list = moduleConcepts.filter((concept) => {
      if (difficulty !== 'all' && concept.difficulty !== difficulty) return false;
      if (status === 'completed' && !completedSet.has(concept.id)) return false;
      if (status === 'todo' && completedSet.has(concept.id)) return false;
      if (status === 'favorite' && !favoriteSet.has(concept.id)) return false;
      if (animation === 'with' && !concept.hasAnimation) return false;
      if (animation === 'without' && concept.hasAnimation) return false;
      return true;
    });
    return sortConcepts(list, sort);
  }, [animation, completedSet, difficulty, favoriteSet, moduleConcepts, sort, status]);

  if (!module) {
    return (
      <main className={styles.page}>
        <Link to="/modules" className={styles.back}>
          ← 返回模块
        </Link>
        <h1>模块不存在</h1>
        <p className={styles.empty}>请从模块总览选择一个有效模块。</p>
      </main>
    );
  }

  const progress = moduleProgress(module.id, completedSet);
  const percent =
    progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;

  return (
    <main className={styles.page}>
      <Link to="/modules" className={styles.back}>
        ← 全部模块
      </Link>
      <section className={styles.header}>
        <span className={styles.eyebrow}>模块 {String(module.order).padStart(2, '0')}</span>
        <h1>{module.title}</h1>
        <p className={styles.subtitle}>{module.subtitle}</p>
        <p className={styles.description}>{module.description}</p>
        <ProgressBar percent={percent} label={`${progress.done} / ${progress.total}`} />
      </section>

      <section className={styles.controls} aria-label="筛选与排序">
        <label>
          难度
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as DifficultyFilter)}>
            <option value="all">全部</option>
            <option value="basic">基础</option>
            <option value="intermediate">进阶</option>
            <option value="advanced">高级</option>
          </select>
        </label>
        <label>
          状态
          <select value={status} onChange={(e) => setStatus(e.target.value as StatusFilter)}>
            <option value="all">全部</option>
            <option value="todo">未完成</option>
            <option value="completed">已完成</option>
            <option value="favorite">已收藏</option>
          </select>
        </label>
        <label>
          动画
          <select value={animation} onChange={(e) => setAnimation(e.target.value as AnimationFilter)}>
            <option value="all">全部</option>
            <option value="with">含动画</option>
            <option value="without">无动画</option>
          </select>
        </label>
        <label>
          排序
          <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
            <option value="recommended">推荐顺序</option>
            <option value="duration">时长从短到长</option>
            <option value="difficulty">难度从低到高</option>
          </select>
        </label>
      </section>

      <section className={styles.list} aria-label="知识点列表">
        {filtered.length > 0 ? (
          filtered.map((concept) => {
            if (isPublishedConcept(concept)) {
              return (
                <ConceptCard
                  key={concept.id}
                  concept={concept}
                  completed={completedSet.has(concept.id)}
                  favorite={favoriteSet.has(concept.id)}
                  onToggleFavorite={toggleFavorite}
                />
              );
            }

            return (
              <article key={concept.id} className={styles.placeholderCard}>
                <div className={styles.placeholderTopline}>
                  <span className={styles.placeholderOrder}>
                    {String(concept.order).padStart(2, '0')}
                  </span>
                  <span>{DIFFICULTY_LABEL[concept.difficulty]}</span>
                  <span>{concept.estimatedMinutes} 分钟</span>
                  <span className={styles.comingSoon}>即将上线</span>
                </div>
                <h2>{concept.title}</h2>
                <p>该知识点已纳入 56 讲地图，正式内容正在审核入库。</p>
              </article>
            );
          })
        ) : (
          <p className={styles.empty}>没有符合筛选条件的知识点。</p>
        )}
      </section>
    </main>
  );
}

export default ModulePage;
