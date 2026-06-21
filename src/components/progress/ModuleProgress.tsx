import { Link } from 'react-router-dom';
import type { LearningModule } from '../../types';
import { ProgressBar } from './ProgressBar';
import styles from './ModuleProgress.module.css';

interface ModuleProgressProps {
  module: LearningModule;
  done: number;
  total: number;
}

export function ModuleProgress({ module, done, total }: ModuleProgressProps) {
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <Link to={`/modules/${module.id}`} className={styles.row}>
      <span className={styles.order}>{String(module.order).padStart(2, '0')}</span>
      <div className={styles.body}>
        <div className={styles.heading}>
          <strong>{module.title}</strong>
          <span>
            {done}/{total}
          </span>
        </div>
        <ProgressBar percent={percent} />
      </div>
    </Link>
  );
}

export default ModuleProgress;
