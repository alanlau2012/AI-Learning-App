import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { SearchBox } from '../components/search/SearchBox';
import { concepts } from '../data/concepts';
import { isPublishedConcept } from '../utils/progress';
import { searchConcepts } from '../utils/search';
import styles from './SearchPage.module.css';

export function SearchPage() {
  const [query, setQuery] = useState('');
  const results = useMemo(() => searchConcepts(concepts, query), [query]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setQuery('');
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <main className={styles.page}>
      <section className={styles.header}>
        <span>本地搜索</span>
        <h1>搜索知识点</h1>
        <p>覆盖标题、一句话定义、标签、机制、企业案例与常见误区。</p>
      </section>
      <SearchBox query={query} onQueryChange={setQuery} />
      {!query.trim() && <p className={styles.empty}>输入关键词开始搜索。</p>}
      {query.trim() && results.length === 0 && (
        <p className={styles.empty}>没有找到匹配知识点。</p>
      )}
      {results.length > 0 && (
        <div className={styles.results}>
          {results.map(({ concept, reason }) => {
            if (!isPublishedConcept(concept)) {
              return (
                <article key={concept.id} className={`${styles.result} ${styles.unavailable}`}>
                  <div>
                    <span className={styles.reason}>{reason}</span>
                    <h2>{concept.title}</h2>
                    <p>该知识点已纳入 56 讲地图，正式内容即将上线。</p>
                  </div>
                  <span className={styles.meta}>即将上线</span>
                </article>
              );
            }

            return (
              <Link key={concept.id} to={`/concepts/${concept.slug}`} className={styles.result}>
                <div>
                  <span className={styles.reason}>{reason}</span>
                  <h2>{concept.title}</h2>
                  <p>{concept.definition}</p>
                </div>
                <span className={styles.meta}>{concept.estimatedMinutes} 分钟</span>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default SearchPage;
