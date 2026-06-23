import { Link } from 'react-router-dom';
import { ModuleProgress } from '../components/progress/ModuleProgress';
import { ProgressBar } from '../components/progress/ProgressBar';
import { StudyStats } from '../components/progress/StudyStats';
import { concepts } from '../data/concepts';
import { modules } from '../data/modules';
import { useProgressStore } from '../store/progressStore';
import { moduleProgress, overallProgress } from '../utils/progress';
import styles from './ProfilePage.module.css';

const conceptById = new Map(concepts.map((concept) => [concept.id, concept]));

export function ProfilePage() {
  const completedConceptIds = useProgressStore((s) => s.completedConceptIds);
  const favoriteConceptIds = useProgressStore((s) => s.favoriteConceptIds);
  const wrongQuestionIds = useProgressStore((s) => s.wrongQuestionIds);
  const lastVisitedConceptId = useProgressStore((s) => s.lastVisitedConceptId);
  const studyStreakDays = useProgressStore((s) => s.studyStreakDays);
  const clearAll = useProgressStore((s) => s.clearAll);
  const completedSet = new Set(completedConceptIds);
  const overall = overallProgress(completedConceptIds);
  const lastVisited = lastVisitedConceptId ? conceptById.get(lastVisitedConceptId) : undefined;
  const favorites = favoriteConceptIds
    .map((id) => conceptById.get(id))
    .filter((concept): concept is (typeof concepts)[number] => Boolean(concept));
  const wrongQuestions = concepts.filter((concept) =>
    concept.diagnosticQuestion && wrongQuestionIds.includes(concept.diagnosticQuestion.id),
  );

  return (
    <main className={styles.page}>
      <section className={styles.header}>
        <span>Profile</span>
        <h1>我的学习</h1>
        <p>进度、收藏、错题和复习入口都集中在这里。</p>
        <div className={styles.headerRule} aria-hidden />
      </section>

      <StudyStats
        completed={overall.done}
        total={overall.total}
        favorites={favoriteConceptIds.length}
        wrongQuestions={wrongQuestionIds.length}
        streakDays={studyStreakDays}
      />

      <section className={styles.panel}>
        <h2>总进度</h2>
        <ProgressBar percent={overall.percent} label={`${overall.percent}%`} />
      </section>

      <section className={styles.panel}>
        <h2>各模块进度</h2>
        <div className={styles.moduleList}>
          {modules.map((module) => {
            const progress = moduleProgress(module.id, completedSet);
            return (
              <ModuleProgress
                key={module.id}
                module={module}
                done={progress.done}
                total={progress.total}
              />
            );
          })}
        </div>
      </section>

      <section className={styles.grid}>
        <div className={styles.panel}>
          <h2>最近学习</h2>
          {lastVisited ? (
            <Link to={`/concepts/${lastVisited.slug}`} className={styles.linkCard}>
              {lastVisited.title}
            </Link>
          ) : (
            <p className={styles.empty}>还没有访问过知识点。</p>
          )}
        </div>

        <div className={styles.panel}>
          <h2>收藏</h2>
          {favorites.length > 0 ? (
            favorites.map((concept) => (
              <Link key={concept.id} to={`/concepts/${concept.slug}`} className={styles.linkCard}>
                {concept.title}
              </Link>
            ))
          ) : (
            <p className={styles.empty}>暂未收藏知识点。</p>
          )}
        </div>

        <div className={styles.panel}>
          <h2>错题</h2>
          {wrongQuestions.length > 0 ? (
            wrongQuestions.map((concept) => (
              <Link key={concept.id} to={`/concepts/${concept.slug}`} className={styles.linkCard}>
                {concept.title}
              </Link>
            ))
          ) : (
            <p className={styles.empty}>暂无错题记录。</p>
          )}
        </div>

        <div className={styles.panel}>
          <h2>推荐复习</h2>
          {wrongQuestions[0] ? (
            <Link to={`/concepts/${wrongQuestions[0].slug}`} className={styles.linkCard}>
              先复习 · {wrongQuestions[0].title}
            </Link>
          ) : lastVisited ? (
            <Link to={`/concepts/${lastVisited.slug}`} className={styles.linkCard}>
              继续 · {lastVisited.title}
            </Link>
          ) : (
            <Link to="/concepts/token" className={styles.linkCard}>
              从 Token 开始
            </Link>
          )}
        </div>
      </section>

      <section className={styles.danger}>
        <div>
          <h2>清空学习记录</h2>
          <p>会清空完成、收藏、错题、最近访问和连续学习天数。</p>
        </div>
        <button type="button" onClick={clearAll}>
          清空记录
        </button>
      </section>
    </main>
  );
}

export default ProfilePage;
