import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { capabilityDomainLabels } from '../data/capabilityDomains';
import { conceptById } from '../data/concepts';
import { scenarioExercises } from '../data/scenarioExercises';
import { useProgressStore } from '../store/progressStore';
import type { CapabilityDomain } from '../types';
import styles from './ScenariosPage.module.css';

const difficultyLabels = {
  basic: '基础',
  intermediate: '进阶',
  advanced: '高级',
};

const domainOptions = Object.entries(capabilityDomainLabels) as [CapabilityDomain, string][];

function scenarioConceptTitle(conceptId: string): string {
  return conceptById.get(conceptId)?.title ?? conceptId;
}

export function ScenariosPage() {
  const [selectedDomain, setSelectedDomain] = useState<CapabilityDomain | 'all'>('all');
  const completedScenarioIds = useProgressStore((s) => s.completedScenarioIds);
  const reviewScenarioIds = useProgressStore((s) => s.reviewScenarioIds);

  const completedSet = new Set(completedScenarioIds);
  const reviewSet = new Set(reviewScenarioIds);

  const visibleScenarios = useMemo(
    () =>
      scenarioExercises.filter(
        (scenario) =>
          selectedDomain === 'all' ||
          scenario.capabilityDomains?.includes(selectedDomain),
      ),
    [selectedDomain],
  );

  return (
    <main className={styles.page}>
      <section className={styles.header}>
        <span>Scenario Library</span>
        <h1>真实场景演练</h1>
        <p>
          从生产症状进入排查、策略调整和复盘，把知识点练成企业 AI 工程负责人可复用的判断能力。
        </p>
        <div className={styles.stats}>
          <strong>{completedScenarioIds.length} / {scenarioExercises.length}</strong>
          <span>已完成场景</span>
          <strong>{reviewScenarioIds.length}</strong>
          <span>待复盘</span>
        </div>
      </section>

      <section className={styles.filters} aria-label="能力域过滤">
        <button
          type="button"
          className={selectedDomain === 'all' ? styles.activeFilter : undefined}
          aria-pressed={selectedDomain === 'all'}
          onClick={() => setSelectedDomain('all')}
        >
          全部
        </button>
        {domainOptions.map(([domain, label]) => (
          <button
            key={domain}
            type="button"
            className={selectedDomain === domain ? styles.activeFilter : undefined}
            aria-pressed={selectedDomain === domain}
            onClick={() => setSelectedDomain(domain)}
          >
            {label}
          </button>
        ))}
      </section>

      <section className={styles.grid} aria-label="场景列表">
        {visibleScenarios.length === 0 && (
          <div className={styles.emptyState}>
            <h2>暂无匹配场景</h2>
            <p>当前能力域还没有对应的场景演练，可以先查看全部场景。</p>
            <button type="button" onClick={() => setSelectedDomain('all')}>
              清除筛选
            </button>
          </div>
        )}
        {visibleScenarios.map((scenario) => {
          const completed = completedSet.has(scenario.id);
          const inReview = reviewSet.has(scenario.id);
          return (
            <Link key={scenario.id} to={`/scenarios/${scenario.id}`} className={styles.card}>
              <div className={styles.cardTopline}>
                <span>{scenario.type ?? 'modelRouting'}</span>
                <span>{difficultyLabels[scenario.difficulty ?? 'advanced']}</span>
              </div>
              <h2>{scenario.title}</h2>
              <p>{scenario.initialSymptom ?? scenario.subtitle ?? scenario.background}</p>
              <div className={styles.domainList}>
                {(scenario.capabilityDomains ?? []).map((domain) => (
                  <span key={domain}>{capabilityDomainLabels[domain]}</span>
                ))}
              </div>
              <div className={styles.concepts}>
                {scenario.entryConceptIds.slice(0, 3).map((id) => (
                  <span key={id}>{scenarioConceptTitle(id)}</span>
                ))}
              </div>
              <div className={styles.cardFooter}>
                <span>{scenario.estimatedMinutes ?? 8} 分钟</span>
                <strong>{completed ? '已完成' : '未完成'}</strong>
                {inReview && <em>待复盘</em>}
              </div>
            </Link>
          );
        })}
      </section>
    </main>
  );
}

export default ScenariosPage;
