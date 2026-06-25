import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { SearchBox } from '../components/search/SearchBox';
import { capabilityDomainLabels } from '../data/capabilityDomains';
import { concepts } from '../data/concepts';
import type { KnowledgePoint } from '../types';
import { isPublishedConcept } from '../utils/progress';
import { searchConcepts } from '../utils/search';
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

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      if (query.trim()) {
        setQuery('');
        return;
      }
      if (selectedDomain !== 'all') setSelectedDomain('all');
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [query, selectedDomain]);

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
      {results.length > 0 && (
        <p className={styles.resultMeta}>
          {activeDomainLabel ? `${activeDomainLabel} · ` : ''}找到 {results.length} 个结果
        </p>
      )}
      {(hasQuery || selectedDomain !== 'all') && results.length === 0 && (
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
      {results.length > 0 && (
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
