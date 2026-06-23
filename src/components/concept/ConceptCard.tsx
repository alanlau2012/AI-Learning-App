import { Link } from 'react-router-dom';
import type { KnowledgePoint } from '../../types';
import styles from './ConceptCard.module.css';

const DIFFICULTY_LABEL: Record<KnowledgePoint['difficulty'], string> = {
  basic: '基础',
  intermediate: '进阶',
  advanced: '高级',
};

interface ConceptCardProps {
  concept: KnowledgePoint;
  completed: boolean;
  favorite: boolean;
  onToggleFavorite: (conceptId: string) => void;
}

export function ConceptCard({
  concept,
  completed,
  favorite,
  onToggleFavorite,
}: ConceptCardProps) {
  return (
    <article className={styles.card}>
      <span className={styles.order}>{String(concept.order).padStart(2, '0')}</span>
      <Link to={`/concepts/${concept.slug}`} className={styles.main}>
        <div className={styles.topline}>
          <span className={styles.meta}>{DIFFICULTY_LABEL[concept.difficulty]}</span>
          <span className={styles.meta}>{concept.estimatedMinutes} 分钟</span>
          {concept.hasAnimation && <span className={styles.animation}>动画</span>}
          {completed && <span className={styles.completed}>已完成</span>}
        </div>
        <h2 className={styles.title}>{concept.title}</h2>
        <p className={styles.definition}>
          {concept.definition || '内容草稿待入库，当前先保留知识点结构与学习入口。'}
        </p>
        {concept.tags.length > 0 && (
          <div className={styles.tags}>
            {concept.tags.slice(0, 4).map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </Link>
      <button
        type="button"
        className={favorite ? `${styles.favorite} ${styles.favoriteActive}` : styles.favorite}
        onClick={() => onToggleFavorite(concept.id)}
        aria-pressed={favorite}
      >
        {favorite ? '已收藏' : '收藏'}
      </button>
    </article>
  );
}

export default ConceptCard;
