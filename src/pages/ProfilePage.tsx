import { Link } from 'react-router-dom';
import { ModuleProgress } from '../components/progress/ModuleProgress';
import { ProgressBar } from '../components/progress/ProgressBar';
import { StudyStats } from '../components/progress/StudyStats';
import { conceptById, concepts } from '../data/concepts';
import { modules } from '../data/modules';
import { scenarioExerciseById, scenarioExercises } from '../data/scenarioExercises';
import { useProgressStore } from '../store/progressStore';
import {
  capabilityDomainProgress,
  getNextProfileAction,
  getProfileJudgmentBiases,
  getWeeklyProfileRecommendations,
  moduleProgress,
  overallProgress,
  rolePathProgress,
} from '../utils/progress';
import styles from './ProfilePage.module.css';

const confidenceLabels: Record<string, string> = {
  low: '低',
  medium: '中',
  high: '高',
};

function formatScore(score: number): string {
  return `${Math.round(score * 100)}%`;
}

function conceptUrl(conceptId: string): string {
  const concept = conceptById.get(conceptId);
  return `/concepts/${concept?.slug ?? conceptId}`;
}

export function ProfilePage() {
  const completedConceptIds = useProgressStore((s) => s.completedConceptIds);
  const completedScenarioIds = useProgressStore((s) => s.completedScenarioIds);
  const favoriteConceptIds = useProgressStore((s) => s.favoriteConceptIds);
  const wrongQuestionIds = useProgressStore((s) => s.wrongQuestionIds);
  const reviewConceptIds = useProgressStore((s) => s.reviewConceptIds);
  const reviewScenarioIds = useProgressStore((s) => s.reviewScenarioIds);
  const lastVisitedConceptId = useProgressStore((s) => s.lastVisitedConceptId);
  const studyStreakDays = useProgressStore((s) => s.studyStreakDays);
  const removeReviewConcept = useProgressStore((s) => s.removeReviewConcept);
  const removeReviewScenario = useProgressStore((s) => s.removeReviewScenario);
  const clearAll = useProgressStore((s) => s.clearAll);

  const completedSet = new Set(completedConceptIds);
  const overall = overallProgress(completedConceptIds);
  const domainScores = capabilityDomainProgress(completedConceptIds, wrongQuestionIds);
  const pathScores = rolePathProgress(completedConceptIds);
  const nextAction = getNextProfileAction(
    { completedConceptIds, wrongQuestionIds, lastVisitedConceptId },
    domainScores,
    pathScores,
  );
  const weeklyRecommendations = getWeeklyProfileRecommendations(
    { completedConceptIds, completedScenarioIds, favoriteConceptIds, wrongQuestionIds, lastVisitedConceptId },
    domainScores,
    pathScores,
  );
  const judgmentBiases = getProfileJudgmentBiases(
    { wrongQuestionIds, favoriteConceptIds, lastVisitedConceptId },
    domainScores,
  );
  const confirmRemoveReviewConcept = (conceptId: string) => {
    if (window.confirm('确定从本周复盘移除这个知识点吗？')) {
      removeReviewConcept(conceptId);
    }
  };
  const confirmRemoveReviewScenario = (scenarioId: string) => {
    if (window.confirm('确定从场景复盘队列移除这个场景吗？')) {
      removeReviewScenario(scenarioId);
    }
  };

  const lastVisited = lastVisitedConceptId ? conceptById.get(lastVisitedConceptId) : undefined;
  const favorites = favoriteConceptIds
    .map((id) => conceptById.get(id))
    .filter((concept): concept is (typeof concepts)[number] => Boolean(concept));
  const wrongQuestions = concepts.filter((concept) =>
    concept.diagnosticQuestion && wrongQuestionIds.includes(concept.diagnosticQuestion.id),
  );
  const reviewConcepts = reviewConceptIds
    .map((id) => conceptById.get(id))
    .filter((concept): concept is (typeof concepts)[number] => Boolean(concept));
  const completedScenarios = completedScenarioIds
    .map((id) => scenarioExerciseById[id])
    .filter((scenario): scenario is (typeof scenarioExercises)[number] => Boolean(scenario));
  const reviewScenarios = reviewScenarioIds
    .map((id) => scenarioExerciseById[id])
    .filter((scenario): scenario is (typeof scenarioExercises)[number] => Boolean(scenario));

  function confirmClearAll() {
    if (window.confirm('确认清空所有本地学习记录？此操作不会影响课程内容。')) {
      clearAll();
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.header}>
        <span>Profile</span>
        <h1>我的学习与能力域</h1>
        <p>进度、能力域、角色路径、复盘清单和下一步行动集中在这里。</p>
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
        <div className={styles.panelHeading}>
          <h2>场景训练</h2>
          <span>{completedScenarios.length} / {scenarioExercises.length} 已完成</span>
        </div>
        <p className={styles.panelIntro}>场景演练把多个知识点压缩到一个生产症状、策略选择和复盘结论里。</p>
        <div className={styles.scenarioStats}>
          <Link to="/scenarios" className={styles.primaryLink}>
            打开场景目录
          </Link>
          <span>{reviewScenarios.length} 个场景待复盘</span>
        </div>
        {completedScenarios.length > 0 && (
          <div className={styles.scenarioPills}>
            {completedScenarios.map((scenario) => (
              <Link key={scenario.id} to={`/scenarios/${scenario.id}`}>
                {scenario.title}
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className={`${styles.panel} ${styles.actionPanel}`}>
        <div className={styles.panelHeading}>
          <h2>下一步行动</h2>
          {nextAction.contextLabel && <span>{nextAction.contextLabel}</span>}
        </div>
        <div className={styles.actionContent}>
          <div>
            <p className={styles.actionMeta}>{nextAction.title}</p>
            <h3>{nextAction.conceptTitle}</h3>
            <p>{nextAction.reason}</p>
          </div>
          <Link to={conceptUrl(nextAction.conceptId)} className={styles.primaryLink}>
            打开这一讲
          </Link>
        </div>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeading}>
          <h2>本周建议</h2>
          <span>{weeklyRecommendations.length} 个行动</span>
        </div>
        <div className={styles.recommendationList}>
          {weeklyRecommendations.map((item) => (
            <article key={item.id} className={styles.recommendationCard}>
              <div className={styles.rowTopline}>
                <strong>{item.title}</strong>
                {item.contextLabel && <span>{item.contextLabel}</span>}
              </div>
              {item.scenarioTitle && <p className={styles.scenarioLabel}>{item.scenarioTitle}</p>}
              {item.conceptTitle && <h3>{item.conceptTitle}</h3>}
              <p>{item.reason}</p>
              {item.scenarioId ? (
                <Link to={`/scenarios/${item.scenarioId}`} className={styles.inlineLink}>
                  {item.actionLabel}
                </Link>
              ) : item.conceptId ? (
                <Link to={conceptUrl(item.conceptId)} className={styles.inlineLink}>
                  {item.actionLabel}
                </Link>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeading}>
          <h2>本周复盘</h2>
          <span>{reviewConcepts.length} 个知识点 · {reviewScenarios.length} 个场景</span>
        </div>
        {reviewScenarios.length > 0 && (
          <div className={styles.reviewList}>
            {reviewScenarios.map((scenario) => (
              <article key={scenario.id} className={styles.reviewItem}>
                <div>
                  <strong>{scenario.title}</strong>
                  <p>{scenario.initialSymptom ?? scenario.background}</p>
                </div>
                <div className={styles.reviewActions}>
                  <Link to={`/scenarios/${scenario.id}`} className={styles.inlineLink}>
                    复盘场景
                  </Link>
                  <button type="button" onClick={() => confirmRemoveReviewScenario(scenario.id)}>
                    移除
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
        {reviewConcepts.length > 0 ? (
          <div className={styles.reviewList}>
            {reviewConcepts.map((concept) => (
              <article key={concept.id} className={styles.reviewItem}>
                <div>
                  <strong>{concept.title}</strong>
                  <p>回到这一讲，把适用场景、反例、指标和上线边界复述一遍。</p>
                </div>
                <div className={styles.reviewActions}>
                  <Link to={`/concepts/${concept.slug}`} className={styles.inlineLink}>
                    复盘
                  </Link>
                  <button type="button" onClick={() => confirmRemoveReviewConcept(concept.id)}>
                    移除
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          reviewScenarios.length === 0 && (
            <p className={styles.empty}>还没有加入复盘的知识点或场景。可以在知识点详情页或场景复盘面板加入本周复盘。</p>
          )
        )}
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeading}>
          <h2>判断偏差</h2>
          <span>{judgmentBiases.length} 个风险提示</span>
        </div>
        <div className={styles.biasList}>
          {judgmentBiases.map((bias) => (
            <article key={bias.id} className={styles.biasRow}>
              <div>
                <div className={styles.rowTopline}>
                  <strong>{bias.title}</strong>
                  <span>{bias.severity}</span>
                </div>
                <p className={styles.biasEvidence}>{bias.evidence}</p>
                <p>{bias.suggestedAction}</p>
              </div>
              {bias.conceptId && (
                <Link to={conceptUrl(bias.conceptId)} className={styles.inlineLink}>
                  {bias.conceptTitle ? `复盘 ${bias.conceptTitle}` : '打开建议讲'}
                </Link>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeading}>
          <h2>能力域概览</h2>
          <span>{domainScores.length} 个能力域</span>
        </div>
        <p className={styles.panelIntro}>按知识点能力域映射派生计算，无诊断样本时按完成度估算。</p>
        <div className={styles.domainList}>
          {domainScores.map((score) => {
            const nextConcept = score.nextConceptId ? conceptById.get(score.nextConceptId) : undefined;
            return (
              <article key={score.domain} className={styles.domainRow}>
                <div className={styles.rowTopline}>
                  <strong>{score.label}</strong>
                  <span>{formatScore(score.finalScore)}</span>
                </div>
                <ProgressBar percent={Math.round(score.finalScore * 100)} />
                <div className={styles.rowMeta}>
                  <span>加权样本 {score.completedWeightedCount} / {score.totalWeightedCount}</span>
                  <span>
                    {score.diagnosticScore === undefined
                      ? '诊断样本不足，按完成度估算'
                      : `诊断估算 ${formatScore(score.diagnosticScore)} - 置信度 ${confidenceLabels[score.confidence]}`}
                  </span>
                  {nextConcept ? (
                    <Link to={`/concepts/${nextConcept.slug}`}>下一讲 {nextConcept.title}</Link>
                  ) : (
                    <span>已完成</span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeading}>
          <h2>角色路径完成度</h2>
          <span>{pathScores.length} 条固定路径</span>
        </div>
        <div className={styles.rolePathList}>
          {pathScores.map((path) => {
            const activePhase = path.phases.find((phase) => phase.nextConceptId) ?? path.phases[path.phases.length - 1];
            const nextConcept = path.nextConceptId ? conceptById.get(path.nextConceptId) : undefined;
            return (
              <article key={path.id} className={styles.rolePathCard}>
                <div className={styles.rowTopline}>
                  <h3>{path.title}</h3>
                  <span>{path.percent}%</span>
                </div>
                <p>{path.goal}</p>
                <ProgressBar percent={path.percent} label={`${path.done}/${path.total}`} />
                {activePhase && (
                  <p className={styles.phaseHint}>
                    当前阶段 {activePhase.title} - {activePhase.done}/{activePhase.total}
                  </p>
                )}
                {nextConcept ? (
                  <Link to={`/concepts/${nextConcept.slug}`} className={styles.inlineLink}>
                    下一讲 {nextConcept.title}
                  </Link>
                ) : (
                  <span className={styles.completeText}>路径已完成</span>
                )}
              </article>
            );
          })}
        </div>
      </section>

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
              <ModuleProgress key={module.id} module={module} done={progress.done} total={progress.total} />
            );
          })}
        </div>
      </section>

      <section className={styles.grid}>
        <div className={styles.panel}>
          <h2>最近学习</h2>
          {lastVisited ? (
            <Link to={`/concepts/${lastVisited.slug}`} className={styles.linkCard}>{lastVisited.title}</Link>
          ) : (
            <p className={styles.empty}>还没有访问过知识点。</p>
          )}
        </div>

        <div className={styles.panel}>
          <h2>收藏</h2>
          {favorites.length > 0 ? (
            favorites.map((concept) => (
              <Link key={concept.id} to={`/concepts/${concept.slug}`} className={styles.linkCard}>{concept.title}</Link>
            ))
          ) : (
            <p className={styles.empty}>暂未收藏知识点。</p>
          )}
        </div>

        <div className={styles.panel}>
          <h2>错题</h2>
          {wrongQuestions.length > 0 ? (
            wrongQuestions.map((concept) => (
              <Link key={concept.id} to={`/concepts/${concept.slug}`} className={styles.linkCard}>{concept.title}</Link>
            ))
          ) : (
            <p className={styles.empty}>暂无错题记录。</p>
          )}
        </div>

        <div className={styles.panel}>
          <h2>复习入口</h2>
          <Link to={conceptUrl(nextAction.conceptId)} className={styles.linkCard}>{nextAction.conceptTitle}</Link>
        </div>
      </section>

      <section className={styles.danger}>
        <div>
          <h2>清空学习记录</h2>
          <p>会清空完成、收藏、错题、复盘清单、最近访问和连续学习天数。</p>
        </div>
        <button type="button" onClick={confirmClearAll}>清空记录</button>
      </section>
    </main>
  );
}

export default ProfilePage;
