import type { AnimationCanvasProps } from './types';
import styles from './KVCacheAnimation.module.css';

function active(stepTargets: string[] | undefined, key: string): boolean {
  return stepTargets?.includes(key) ?? false;
}

export function KVCacheAnimation({ step, reducedMotion }: AnimationCanvasProps) {
  const targets = step.highlightTargets;

  return (
    <div className={reducedMotion ? `${styles.canvas} ${styles.reduced}` : styles.canvas}>
      <div className={active(targets, 'session') ? `${styles.node} ${styles.active}` : styles.node}>
        <span>Session A</span>
        <strong>多轮上下文</strong>
      </div>
      <div className={styles.arrow}>→</div>
      <div className={active(targets, 'prefill') ? `${styles.node} ${styles.active}` : styles.node}>
        <span>Prefill</span>
        <strong>计算 K / V</strong>
      </div>
      <div className={styles.arrow}>→</div>
      <div className={active(targets, 'cache') ? `${styles.cache} ${styles.active}` : styles.cache}>
        <span>KV Cache</span>
        <div className={styles.slots}>
          <i />
          <i />
          <i />
        </div>
      </div>
      <div className={styles.outcomes}>
        <div className={active(targets, 'hit') || active(targets, 'decode') ? `${styles.outcome} ${styles.hit}` : styles.outcome}>
          命中缓存 · TTFT 低
        </div>
        <div className={active(targets, 'miss') ? `${styles.outcome} ${styles.miss}` : styles.outcome}>
          路由打散 · 重新 Prefill
        </div>
      </div>
    </div>
  );
}

export default KVCacheAnimation;
