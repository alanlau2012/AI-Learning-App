import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SearchBox } from '../components/search/SearchBox';
import { capabilityDomainLabels } from '../data/capabilityDomains';
import { concepts } from '../data/concepts';
import type { KnowledgePoint } from '../types';
import { isPublishedConcept } from '../utils/progress';
import { searchConcepts, searchScenarios } from '../utils/search';
import type { SearchDomainFilter, SearchResult } from '../utils/search';
import styles from './SearchPage.module.css';

interface DomainBadge {
  label: string;
  kind: '主' | '相关';
}

function getDomainBadges(
  concept: KnowledgePoint,
  result: SearchResult,
  selectedDomain: SearchDomainFilter,
): DomainBadge[] {
  if (!concept.capabilityDomains) return [];

  if (selectedDomain !== 'all' && result.domainMatch) {
    return [
      {
        label: capabilityDomainLabels[selectedDomain],
        kind: result.domainMatch === 'primary' ? '主' : '相关',
      },
    ];
  }

  const badges: DomainBadge[] = [
    {
      label: capabilityDomainLabels[concept.capabilityDomains.primary],
      kind: '主',
    },
  ];

  if (concept.capabilityDomains.secondary) {
    badges.push({
      label: capabilityDomainLabels[concept.capabilityDomains.secondary],
      kind: '相关',
    });
  }

  return badges;
}

export function SearchPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<SearchDomainFilter>('all');
  const hasQuery = query.trim().length > 0;
  const activeDomainLabel =
    selectedDomain === 'all' ? undefined : capabilityDomainLabels[selectedDomain];
  const results = useMemo(
    () =>
      searchConcepts(concepts, {
        query,
        selectedDomain,
        limit: hasQuery ? 12 : concepts.length,
      }),
    [hasQuery, query, selectedDomain],
  );
  const scenarioResults = useMemo(
    () =>
      searchScenarios({
        query,
        selectedDomain,
        limit: 4,
      }),
    [query, selectedDomain],
  );
  const totalResults = results.length + scenarioResults.length;

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      if (location.key !== 'default') navigate(-1);
      else navigate('/', { replace: true });
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [location.key, navigate]);

  return (
    <main className={styles.page}>
      <section className={styles.header}>
        <span>本地搜索</span>
        <h1>搜索知识点</h1>
        <p>覆盖标题、一句话定义、标签、机制、企业案例、常见误区与工程决策。</p>
      </section>
      <SearchBox
        query={query}
        onQueryChange={setQuery}
        selectedDomain={selectedDomain}
        onDomainChange={setSelectedDomain}
      />
      {!hasQuery && selectedDomain === 'all' && (
        <p className={styles.empty}>输入关键词，或选择一个能力域开始浏览。</p>
      )}
      {totalResults > 0 && (
        <p className={styles.resultMeta}>
          {activeDomainLabel ? `${activeDomainLabel} 路 ` : ''}找到 {totalResults} 个结果
        </p>
      )}
      {(hasQuery || selectedDomain !== 'all') && totalResults === 0 && (
        <div className={styles.emptyPanel}>
          <p>
            {activeDomainLabel
              ? `在「${activeDomainLabel}」中没有找到匹配知识点。`
              : '没有找到匹配知识点。'}
          </p>
          {selectedDomain !== 'all' && (
            <button type="button" onClick={() => setSelectedDomain('all')}>
              清除能力域
            </button>
          )}
        </div>
      )}
      {scenarioResults.length > 0 && (
        <div className={styles.results}>
          {scenarioResults.map((result, index) => {
            const { scenario, reason } = result;
            return (
              <Link key={scenario.id} to={`/scenarios/${scenario.id}`} className={styles.result}>
                <span className={styles.resultIdx}>{String(index + 1).padStart(2, '0')}</span>
                <div className={styles.resultText}>
                  <span className={styles.reason}>{reason}</span>
                  <h2>{scenario.title}</h2>
                  <p>{scenario.initialSymptom ?? scenario.subtitle ?? scenario.background}</p>
                </div>
                <span className={styles.meta}>{scenario.estimatedMinutes ?? 8} 分钟</span>
              </Link>
            );
          })}
        </div>
      )}      {results.length > 0 && (
        <div className={styles.results}>
          {results.map((result, index) => {
            const { concept, reason } = result;
            const domainBadges = getDomainBadges(concept, result, selectedDomain);
            const resultBody = (
              <>
                <span className={styles.resultIdx}>{String(index + 1).padStart(2, '0')}</span>
                <div className={styles.resultText}>
                  <span className={styles.reason}>{reason}</span>
                  <h2>{concept.title}</h2>
                  <p>
                    {isPublishedConcept(concept)
                      ? concept.definition
                      : '该知识点已纳入 56 讲地图，正式内容即将上线。'}
                  </p>
                  {domainBadges.length > 0 && (
                    <div className={styles.domainBadges} aria-label="命中能力域">
                      {domainBadges.map((badge) => (
                        <span key={`${badge.kind}-${badge.label}`} className={styles.domainBadge}>
                          {badge.kind} · {badge.label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <span className={styles.meta}>
                  {isPublishedConcept(concept) ? `${concept.estimatedMinutes} 分钟` : '即将上线'}
                </span>
              </>
            );

            if (!isPublishedConcept(concept)) {
              return (
                <article key={concept.id} className={`${styles.result} ${styles.unavailable}`}>
                  {resultBody}
                </article>
              );
            }

            return (
              <Link key={concept.id} to={`/concepts/${concept.slug}`} className={styles.result}>
                {resultBody}
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default SearchPage;
