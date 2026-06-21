import type { AnimationCanvasProps } from './types';
import styles from './KVCacheAnimation.module.css';

function on(targets: string[] | undefined, key: string): boolean {
  return targets?.includes(key) ?? false;
}

function cls(...names: Array<string | false | undefined>): string {
  return names.filter(Boolean).join(' ');
}

/**
 * kv-cache：缓存的是「已读上下文的 K/V 笔记」。
 * 命中（路由一致）跳过重复 Prefill，TTFT 低；未命中（路由打散）重新 Prefill，TTFT 高。
 * 显存有限，长会话挤占触发淘汰。命中 vs 未命中两条路径同屏对照。
 */
export function KVCacheAnimation({ step, reducedMotion }: AnimationCanvasProps) {
  const t = step.highlightTargets;

  const sessionOn = on(t, 'session') || on(t, 'instance');
  const prefillOn = on(t, 'prefill') || on(t, 'kv-write');
  const writeOn = on(t, 'kv-write');
  const hitOn = on(t, 'decode') || on(t, 'cache-hit');
  const missOn = on(t, 'route-miss') || on(t, 'cache-miss');
  const memOn = on(t, 'memory') || on(t, 'eviction');

  // 缓存一旦写入即保持「有笔记」状态，供命中路径复用
  const cacheFilled = prefillOn || hitOn;

  return (
    <div className={cls(styles.canvas, reducedMotion && styles.reduced)}>
      {/* 上游：会话 → Prefill → KV Cache */}
      <div className={styles.top}>
        <div className={cls(styles.node, sessionOn && styles.active)}>
          <span className={styles.tag}>Session A</span>
          <strong>多轮 · 同实例</strong>
        </div>
        <span className={styles.arrow}>→</span>
        <div className={cls(styles.node, prefillOn && styles.active)}>
          <span className={styles.tag}>Prefill</span>
          <strong>计算 K / V</strong>
        </div>
        <span className={styles.arrow}>→</span>
        <div className={cls(styles.cache, cacheFilled && styles.filled, writeOn && styles.writing)}>
          <span className={styles.tag}>KV Cache</span>
          <div className={styles.slots}>
            <i className={cacheFilled ? styles.slotFull : undefined} />
            <i className={cacheFilled ? styles.slotFull : undefined} />
            <i className={cacheFilled ? styles.slotFull : undefined} />
          </div>
        </div>
      </div>

      {/* 两条路径对照：命中 vs 未命中 */}
      <div className={styles.paths}>
        <div className={cls(styles.path, styles.hit, hitOn && styles.active)}>
          <div className={styles.pathHead}>
            <span className={styles.pathName}>命中</span>
            <span className={styles.pathDesc}>复用 KV · 跳过重算</span>
          </div>
          <div className={styles.ttft}>
            <span className={styles.ttftLabel}>TTFT</span>
            <div className={styles.ttftTrack}>
              <i className={cls(styles.ttftFill, styles.short, hitOn && styles.lit)} />
            </div>
          </div>
        </div>

        <div className={cls(styles.path, styles.miss, missOn && styles.active)}>
          <div className={styles.pathHead}>
            <span className={styles.pathName}>未命中</span>
            <span className={styles.pathDesc}>路由打散到空缓存实例 · 重新 Prefill</span>
          </div>
          <div className={styles.ttft}>
            <span className={styles.ttftLabel}>TTFT</span>
            <div className={styles.ttftTrack}>
              <i className={cls(styles.ttftFill, styles.long, missOn && styles.lit)} />
            </div>
          </div>
        </div>
      </div>

      {/* 显存容量约束 + 淘汰 */}
      <div className={cls(styles.memory, memOn && styles.active)}>
        <span className={styles.tag}>显存容量</span>
        <div className={styles.memTrack}>
          <i className={cls(styles.memFill, memOn && styles.high)} />
        </div>
        <span className={cls(styles.evict, memOn && styles.show)}>长会话挤占 → 淘汰</span>
      </div>
    </div>
  );
}

export default KVCacheAnimation;
