import { Link } from 'react-router-dom';
import { ProgressBar } from '../components/progress/ProgressBar';
import { modules } from '../data/modules';
import { useProgressStore } from '../store/progressStore';
import { moduleProgress } from '../utils/progressCore';
import styles from './ModulesPage.module.css';

export function ModulesPage() {
  const completedConceptIds = useProgressStore((s) => s.completedConceptIds);
  const completedSet = new Set(completedConceptIds);

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <span className={styles.eyebrow}>56 讲知识地图</span>
        <h1>六大模块</h1>
        <p>
          从模型基本机制到企业治理，把 AI 应用工程拆成可循序推进的六条主线。
        </p>
      </section>

      <section className={styles.list} aria-label="模块列表">
        {modules.map((module) => {
          const progress = moduleProgress(module.id, completedSet);
          const percent =
            progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;

          return (
            <Link key={module.id} to={`/modules/${module.id}`} className={styles.module}>
              <span className={styles.index}>{String(module.order).padStart(2, '0')}</span>
              <div className={styles.body}>
                <div className={styles.heading}>
                  <h2>{module.title}</h2>
                  <span className={styles.count}>
                    {progress.done}/{progress.total}
                  </span>
                </div>
                <p className={styles.subtitle}>{module.subtitle}</p>
                <p className={styles.description}>{module.description}</p>
                <div className={styles.recommended}>
                  {module.recommendedFor.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
                <ProgressBar percent={percent} />
              </div>
            </Link>
          );
        })}
      </section>
    </main>
  );
}

export default ModulesPage;
