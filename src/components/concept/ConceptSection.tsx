import type { ReactNode } from 'react';
import styles from './ConceptSection.module.css';

interface ConceptSectionProps {
  index?: number;
  title: string;
  children: ReactNode;
  tone?: 'default' | 'soft';
}

export function ConceptSection({
  index,
  title,
  children,
  tone = 'default',
}: ConceptSectionProps) {
  return (
    <section className={tone === 'soft' ? `${styles.section} ${styles.soft}` : styles.section}>
      <h2>
        {index !== undefined && (
          <span className={styles.index}>{String(index).padStart(2, '0')}</span>
        )}
        {title}
      </h2>
      <div className={styles.body}>{children}</div>
    </section>
  );
}

export function EmptySectionHint() {
  return <p className={styles.empty}>内容草稿待审核入库。</p>;
}

export default ConceptSection;
