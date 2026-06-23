import type { MechanismContent as MechanismContentType } from '../../types';
import { isMechanismGrouped } from '../../types';
import { RichText } from './RichText';
import styles from './MechanismContent.module.css';

interface MechanismContentProps {
  mechanism: MechanismContentType;
}

export function MechanismContent({ mechanism }: MechanismContentProps) {
  if (mechanism.length === 0) return null;

  if (isMechanismGrouped(mechanism)) {
    return (
      <div className={styles.grouped}>
        {mechanism.map((group) => (
          <div key={group.label} className={styles.phase}>
            <div className={styles.phaseHead}>
              <span className={styles.phaseLabel}>{group.label}</span>
              <h3 className={styles.phaseTitle}>{group.title}</h3>
            </div>
            <ul className={styles.phaseList}>
              {group.items.map((item) => (
                <li key={item}>
                  <RichText text={item} as="span" />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }

  return (
    <ol className={styles.flat}>
      {mechanism.map((item, index) => (
        <li key={item}>
          <span className={styles.flatIndex}>{String(index + 1).padStart(2, '0')}</span>
          <RichText text={item} as="span" />
        </li>
      ))}
    </ol>
  );
}

export default MechanismContent;
