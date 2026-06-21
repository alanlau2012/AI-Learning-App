import { Link } from 'react-router-dom';
import type { SearchResult } from '../../utils/search';
import styles from './SearchResults.module.css';

interface SearchResultsProps {
  query: string;
  results: SearchResult[];
}

export function SearchResults({ query, results }: SearchResultsProps) {
  if (!query.trim()) {
    return <p className={styles.empty}>输入关键词开始搜索。</p>;
  }

  if (results.length === 0) {
    return <p className={styles.empty}>没有找到匹配知识点。</p>;
  }

  return (
    <div className={styles.results}>
      {results.map(({ concept, reason }) => (
        <Link key={concept.id} to={`/concepts/${concept.slug}`} className={styles.result}>
          <div>
            <span className={styles.reason}>{reason}</span>
            <h2>{concept.title}</h2>
            <p>{concept.definition || '内容草稿待入库。'}</p>
          </div>
          <span className={styles.meta}>{concept.estimatedMinutes} 分钟</span>
        </Link>
      ))}
    </div>
  );
}

export default SearchResults;
