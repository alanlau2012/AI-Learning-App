import type { AnimationCanvasProps } from './types';
import styles from './GenericMechanismAnimation.module.css';

export function GenericMechanismAnimation({
  config,
  step,
  stepIndex,
  totalSteps,
}: AnimationCanvasProps) {
  return (
    <div className={styles.canvas}>
      <div className={styles.type}>{config.type}</div>
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
          {stepIndex + 1} / {totalSteps}
        </span>
        <strong>{step.title}</strong>
        <p>{step.description}</p>
      </div>
      {step.highlightTargets && step.highlightTargets.length > 0 && (
        <div className={styles.targets}>
          {step.highlightTargets.map((target) => (
            <span key={target}>{target}</span>
          ))}
        </div>
      )}
    </div>
  );
}

export default GenericMechanismAnimation;
