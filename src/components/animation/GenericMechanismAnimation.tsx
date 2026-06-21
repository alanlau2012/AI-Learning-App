import type { AnimationCanvasProps } from './types';
import styles from './GenericMechanismAnimation.module.css';

export function GenericMechanismAnimation({
  config,
  stepIndex,
  totalSteps,
}: AnimationCanvasProps) {
  return (
    <div className={styles.canvas}>
      <div className={styles.timeline}>
        {config.steps.map((item, index) => (
          <div
            key={item.id}
            className={index === stepIndex ? `${styles.dot} ${styles.active}` : styles.dot}
            aria-label={item.title}
          />
        ))}
      </div>
      <div className={styles.current}>
        <span>
          步骤 {stepIndex + 1} / {totalSteps}
        </span>
      </div>
    </div>
  );
}

export default GenericMechanismAnimation;
