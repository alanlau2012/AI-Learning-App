import { useEffect, useMemo, useState } from 'react';
import { SearchBox } from '../components/search/SearchBox';
import { SearchResults } from '../components/search/SearchResults';
import { concepts } from '../data/concepts';
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
      <SearchResults query={query} results={results} />
    </main>
  );
}

export default SearchPage;
