import type { KnowledgePoint, LearningModule } from '../../types';
import styles from './ConceptHeader.module.css';

const DIFFICULTY_LABEL: Record<KnowledgePoint['difficulty'], string> = {
  basic: '基础',
  intermediate: '进阶',
  advanced: '高级',
};

interface ConceptHeaderProps {
  concept: KnowledgePoint;
  module?: LearningModule;
  completed: boolean;
  favorite: boolean;
  onToggleComplete: () => void;
  onToggleFavorite: () => void;
}

export function ConceptHeader({
  concept,
  module,
  completed,
  favorite,
  onToggleComplete,
  onToggleFavorite,
}: ConceptHeaderProps) {
  return (
    <header className={styles.header}>
      {module && <span className={styles.module}>{module.title}</span>}
      <div className={styles.meta}>
        <span>{DIFFICULTY_LABEL[concept.difficulty]}</span>
        <span>{concept.estimatedMinutes} 分钟</span>
        <span>{concept.hasAnimation ? '含动画演示' : '无动画'}</span>
        <span>{concept.contentStatus}</span>
      </div>
      <h1>{concept.title}</h1>
      <div className={styles.actions}>
        <button
          type="button"
          className={completed ? `${styles.button} ${styles.complete}` : styles.button}
          onClick={onToggleComplete}
        >
          {completed ? '已完成' : '完成学习'}
        </button>
        <button
          type="button"
          className={favorite ? `${styles.button} ${styles.favorite}` : styles.button}
          onClick={onToggleFavorite}
        >
          {favorite ? '已收藏' : '收藏'}
        </button>
      </div>
    </header>
  );
}

export default ConceptHeader;
