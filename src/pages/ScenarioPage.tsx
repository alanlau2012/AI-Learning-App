import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { concepts } from '../data/concepts';
import { scenarioExerciseById } from '../data/scenarioExercises';
import {
  applyStrategyChange,
  deriveScenarioReview,
  initializeScenarioState,
  runScenarioRound,
} from '../utils/scenarioSimulation';
import type { ScenarioMetricTrend } from '../types';
import styles from './ScenarioPage.module.css';

const conceptById = new Map(concepts.map((concept) => [concept.id, concept]));

const trendLabels: Record<ScenarioMetricTrend, string> = {
  better: '向好',
  worse: '承压',
  neutral: '稳定',
};

const severityLabels = {
  info: '提示',
  warning: '预警',
  critical: '关键风险',
};

function formatMetricValue(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function conceptLink(conceptId: string) {
  const concept = conceptById.get(conceptId);
  if (!concept) return null;
  return (
    <Link key={concept.id} to={`/concepts/${concept.slug}`}>
      {concept.title}
    </Link>
  );
}

export function ScenarioPage() {
  const { scenarioId } = useParams();
  const exercise = scenarioId ? scenarioExerciseById[scenarioId] : undefined;
  const [selectedStrategies, setSelectedStrategies] = useState<Record<string, string>>({});
  const [showReview, setShowReview] = useState(false);

  const result = useMemo(() => {
    if (!exercise) return undefined;
    return runScenarioRound(exercise, selectedStrategies);
  }, [exercise, selectedStrategies]);

  const review = useMemo(() => {
    if (!exercise || !result) return undefined;
    return deriveScenarioReview(exercise, result);
  }, [exercise, result]);

  if (!exercise || !result || !review) {
    return (
      <main className={styles.page}>
        <Link to="/" className={styles.back}>返回首页</Link>
        <section className={styles.missing}>
          <h1>场景不存在</h1>
          <p>请选择一个已经入库的场景演练。</p>
        </section>
      </main>
    );
  }

  const changeStrategy = (controlId: string, optionId: string) => {
    const next = applyStrategyChange(exercise, result.state, { controlId, optionId });
    setSelectedStrategies(next.selectedStrategies);
    setShowReview(false);
  };

  const resetScenario = () => {
    setSelectedStrategies(initializeScenarioState(exercise).selectedStrategies);
    setShowReview(false);
  };

  return (
    <main className={styles.page}>
      <Link to="/concepts/multi-model-routing" className={styles.back}>返回多模型路由</Link>

      <section className={styles.header}>
        <span>Scenario Exercise</span>
        <div className={styles.headerRow}>
          <div>
            <h1>{exercise.title}</h1>
            <p>{exercise.background}</p>
          </div>
          <div className={styles.headerMeta}>
            <strong>{exercise.requestTypes.length}</strong>
            <span>请求类型</span>
            <strong>{exercise.modelPool.length}</strong>
            <span>候选模型</span>
          </div>
        </div>
        <div className={styles.relatedLinks}>
          {exercise.relatedConceptIds.map(conceptLink)}
        </div>
      </section>

      <section className={styles.metricStrip} aria-label="场景指标">
        {result.metrics.map((metric) => (
          <article key={metric.id} className={`${styles.metricCard} ${styles[metric.trend]}`}>
            <span>{metric.label}</span>
            <strong>{formatMetricValue(metric.value)}{metric.unit}</strong>
            <em>{trendLabels[metric.trend]}</em>
          </article>
        ))}
      </section>

      <section className={styles.workspace}>
        <div className={styles.leftRail}>
          <section className={styles.panel}>
            <div className={styles.panelHeading}>
              <h2>请求队列</h2>
              <span>按流量权重</span>
            </div>
            <div className={styles.requestList}>
              {result.requestBreakdowns.map((request) => (
                <article key={request.requestTypeId} className={styles.requestCard}>
                  <div className={styles.rowBetween}>
                    <h3>{request.requestLabel}</h3>
                    <span>{Math.round(request.volumeShare * 100)}%</span>
                  </div>
                  <p>{request.decisionReasons.join('；')}</p>
                  <dl>
                    <div><dt>命中模型</dt><dd>{request.selectedModelLabel}</dd></div>
                    <div><dt>SLA</dt><dd>{request.slaCondition === 'strict' ? '严格' : '常规'}</dd></div>
                    <div><dt>风险</dt><dd>{request.risks.length || '低'}</dd></div>
                  </dl>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.panel}>
            <div className={styles.panelHeading}>
              <h2>模型池负载</h2>
              <span>模拟分布</span>
            </div>
            <div className={styles.loadList}>
              {result.modelLoad.map((load) => (
                <div key={load.modelId} className={styles.loadRow}>
                  <div className={styles.rowBetween}>
                    <span>{load.modelLabel}</span>
                    <strong>{Math.round(load.volumeShare * 100)}%</strong>
                  </div>
                  <div className={styles.loadTrack}>
                    <div style={{ width: `${Math.min(100, Math.round(load.volumeShare * 100))}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className={styles.panel}>
          <div className={styles.panelHeading}>
            <h2>路由策略</h2>
            <span>第 {result.state.round + 1} 轮</span>
          </div>
          <div className={styles.controls}>
            {exercise.strategyControls.map((control) => (
              <fieldset key={control.id} className={styles.controlGroup}>
                <legend>{control.label}</legend>
                <div className={styles.optionGrid}>
                  {control.options.map((option) => {
                    const active = result.state.selectedStrategies[control.id] === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        className={active ? `${styles.optionButton} ${styles.optionActive}` : styles.optionButton}
                        onClick={() => changeStrategy(control.id, option.id)}
                      >
                        <strong>{option.label}</strong>
                        <span>{option.description}</span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ))}
          </div>
          <div className={styles.actions}>
            <button type="button" className={styles.primary} onClick={() => setShowReview(true)}>
              提交诊断
            </button>
            <button type="button" className={styles.secondary} onClick={resetScenario}>
              恢复基线
            </button>
          </div>
        </section>

        <aside className={styles.rightRail}>
          <section className={styles.panel}>
            <div className={styles.panelHeading}>
              <h2>策略解释</h2>
              <span>{result.activeEvents.length ? `${result.activeEvents.length} 个事件` : '未触发事件'}</span>
            </div>
            <p className={styles.explanation}>{result.explanation}</p>
            <div className={styles.signalList}>
              {result.reviewSignals.map((signal) => (
                <article key={signal.id} className={`${styles.signal} ${styles[signal.severity]}`}>
                  <span>{severityLabels[signal.severity]}</span>
                  <h3>{signal.title}</h3>
                  <p>{signal.detail}</p>
                </article>
              ))}
            </div>
          </section>

          {showReview && (
            <section className={`${styles.panel} ${styles.reviewPanel}`}>
              <div className={styles.panelHeading}>
                <h2>复盘结论</h2>
                {review.event && <span>{review.event.title}</span>}
              </div>
              <p>{review.diagnosis}</p>
              <h3>排查顺序</h3>
              <ol>
                {review.investigationOrder.map((item) => <li key={item}>{item}</li>)}
              </ol>
              <h3>遗漏风险</h3>
              <ul>
                {review.missedRisks.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <h3>下一步</h3>
              <ul>
                {review.nextStepRecommendations.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <div className={styles.relatedLinks}>
                {review.relatedConceptIds.map(conceptLink)}
              </div>
            </section>
          )}
        </aside>
      </section>
    </main>
  );
}

export default ScenarioPage;