import type { AnimationCanvasProps } from './types';
import styles from './TokenRoiFlowAnimation.module.css';

function on(targets: string[] | undefined, key: string): boolean {
  return targets?.includes(key) ?? false;
}

function cls(...names: Array<string | false | undefined>): string {
  return names.filter(Boolean).join(' ');
}

/**
 * token-roi-flow：把 Token 成本、质量和业务价值放到同一条决策链上。
 */
export function TokenRoiFlowAnimation({ step, reducedMotion }: AnimationCanvasProps) {
  const t = step.highlightTargets;
  const scenarioOn = on(t, 'scenario');
  const costOn = on(t, 'token-cost') || on(t, 'input-token') || on(t, 'output-token');
  const valueOn = on(t, 'business-value') || on(t, 'quality');
  const curveOn = on(t, 'roi') || on(t, 'curve');
  const decisionOn = on(t, 'decision') || on(t, 'keep-quality') || on(t, 'compress');
  const optimizeOn = on(t, 'cache') || on(t, 'routing') || on(t, 'prompt-trim');

  return (
    <div className={cls(styles.canvas, reducedMotion && styles.reduced)}>
      <div className={styles.flow}>
        <Stage label="场景" title="客服 / 研发 / 分析" active={scenarioOn} />
        <Arrow />
        <Stage label="Token 成本" title="输入 + 输出" active={costOn} />
        <Arrow />
        <Stage label="业务价值" title="节省工时 / 转化" active={valueOn} />
        <Arrow />
        <Stage label="ROI" title="单位价值成本" active={curveOn} />
      </div>

      <div className={styles.curveArea}>
        <div className={cls(styles.axis, curveOn && styles.active)}>
          <span className={styles.yLabel}>质量</span>
          <span className={styles.xLabel}>Token 成本</span>
          <span className={styles.curve} />
          <span className={cls(styles.knee, curveOn && styles.show)}>边际收益拐点</span>
        </div>
        <div className={cls(styles.decisionPanel, decisionOn && styles.active)}>
          <span>决策</span>
          <strong>高价值保质量 · 低价值压缩</strong>
        </div>
      </div>

      <div className={cls(styles.optimizations, optimizeOn && styles.show)}>
        <span>降本不伤质</span>
        <strong>缓存命中</strong>
        <strong>能力路由</strong>
        <strong>提示精简</strong>
      </div>
    </div>
  );
}

function Stage({ label, title, active }: { label: string; title: string; active: boolean }) {
  return (
    <div className={cls(styles.stage, active && styles.active)}>
      <span>{label}</span>
      <strong>{title}</strong>
    </div>
  );
}

function Arrow() {
  return <span className={styles.arrow} aria-hidden>→</span>;
}

export default TokenRoiFlowAnimation;
