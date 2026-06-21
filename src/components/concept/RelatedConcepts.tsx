import { Link } from 'react-router-dom';
import type { KnowledgePoint } from '../../types';
import styles from './RelatedConcepts.module.css';

interface RelatedConceptsProps {
  conceptIds: string[];
  concepts: KnowledgePoint[];
}

export function RelatedConcepts({ conceptIds, concepts }: RelatedConceptsProps) {
  const related = conceptIds
    .map((id) => concepts.find((concept) => concept.id === id))
    .filter((concept): concept is KnowledgePoint => Boolean(concept));

  if (related.length === 0) {
    return <p className={styles.empty}>关联知识点待补充。</p>;
  }

  return (
    <div className={styles.list}>
      {related.map((concept) => (
        <Link key={concept.id} to={`/concepts/${concept.slug}`} className={styles.item}>
          <span>{concept.title}</span>
          <small>{concept.estimatedMinutes} 分钟</small>
        </Link>
      ))}
    </div>
  );
}

export default RelatedConcepts;
