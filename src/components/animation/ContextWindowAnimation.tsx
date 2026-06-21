import type { AnimationCanvasProps } from './types';
import styles from './ContextWindowAnimation.module.css';

function on(targets: string[] | undefined, key: string): boolean {
  return targets?.includes(key) ?? false;
}

function cls(...names: Array<string | false | undefined>): string {
  return names.filter(Boolean).join(' ');
}

const POOL = ['目标', '用户问题', '历史会话', 'RAG 片段', '工具结果', '不可破坏约束'];

/**
 * context-window：上下文窗口是「有限工作台」。
 * 塞满 → 关键约束被挤出（失真）；筛选排序 + 压缩 → 约束回到窗内、腾出空间。
 * 用「在窗内 / 被挤出」的位置 + 颜色编码表达，reduced-motion 下静态可读。
 */
export function ContextWindowAnimation({ step, reducedMotion }: AnimationCanvasProps) {
  const t = step.highlightTargets;

  const candidateOn = on(t, 'candidate-context');
  const limitOn = on(t, 'window-limit');
  const selectOn = on(t, 'selection') || on(t, 'ranking');
  const compressOn = on(t, 'compression') || on(t, 'summary');
  const metricsOn = on(t, 'cost') || on(t, 'ttft') || on(t, 'quality');

  const phase = metricsOn ? 5 : compressOn ? 4 : selectOn ? 3 : limitOn ? 2 : 1;
  const crammed = phase === 2;
  const curated = phase >= 3;

  // 指标：塞满时成本/TTFT 高、质量低；筛选压缩后成本/TTFT 回落、质量升
  const cost = crammed ? 88 : curated ? 46 : 30;
  const ttft = crammed ? 84 : curated ? 44 : 30;
  const quality = crammed ? 30 : curated ? 86 : 40;

  return (
    <div className={cls(styles.canvas, reducedMotion && styles.reduced)}>
      <div className={styles.cols}>
        {/* 候选池 */}
        <div className={cls(styles.pool, !candidateOn && phase > 1 && styles.dim)}>
          <span className={styles.colTag}>候选池</span>
          {POOL.map((b) => (
            <span key={b} className={cls(styles.poolChip, candidateOn && styles.lit)}>{b}</span>
          ))}
        </div>

        <span className={styles.feed} aria-hidden>→</span>

        {/* 窗口 */}
        <div className={styles.window}>
          <span className={styles.colTag}>窗口（有限）</span>

          <div className={styles.inWin}>
            {phase === 1 && <span className={styles.hint}>等待装入</span>}

            {crammed && (
              <>
                <Block name="目标" />
                <Block name="历史会话" />
                <Block name="RAG 片段" />
                <Block name="工具结果" />
              </>
            )}

            {curated && (
              <>
                <Block name="不可破坏约束" kind="pin" />
                <Block name="目标" />
                <Block name="RAG 片段（高相关）" kind="good" />
                {phase >= 4 && <Block name="历史 · 摘要" kind="summary" />}
              </>
            )}
          </div>

          <div className={cls(styles.limitLine, (limitOn || phase >= 2) && styles.lit)}>
            <span>上限</span>
          </div>

          {/* 上限之外：塞满时约束被挤出；压缩后变为释放出的空间 */}
          <div className={styles.overflow}>
            {crammed && <Block name="不可破坏约束 · 被挤出" kind="evicted" />}
            {phase >= 4 && <span className={styles.freed}>压缩腾出的空间</span>}
          </div>
        </div>
      </div>

      {/* 指标：成本 / TTFT / 质量 */}
      <div className={cls(styles.metrics, !metricsOn && phase < 5 && styles.dim)}>
        <Metric tag="成本" v={cost} kind="warm" lit={metricsOn} />
        <Metric tag="TTFT" v={ttft} kind="warm" lit={metricsOn} />
        <Metric tag="质量" v={quality} kind="good" lit={metricsOn} />
      </div>
    </div>
  );
}

function Block({ name, kind }: { name: string; kind?: string }) {
  return <span className={cls(styles.block, kind && styles[kind])}>{name}</span>;
}

function Metric({ tag, v, kind, lit }: { tag: string; v: number; kind: string; lit: boolean }) {
  return (
    <div className={styles.metric}>
      <span className={styles.mTag}>{tag}</span>
      <div className={styles.mTrack}>
        <i className={cls(styles.mFill, styles[kind], lit && styles.lit)} style={{ width: `${v}%` }} />
      </div>
    </div>
  );
}

export default ContextWindowAnimation;
