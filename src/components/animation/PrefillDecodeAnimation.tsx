import { useMemo } from 'react';
import type { AnimationCanvasProps } from './types';
import styles from './PrefillDecodeAnimation.module.css';

function on(targets: string[] | undefined, key: string): boolean {
  return targets?.includes(key) ?? false;
}

const INPUT_KEYS = ['prompt', 'rag-chunks', 'history'];
const PREPROCESS_KEYS = ['gateway', 'queue', 'route', 'rag', 'tool-call'];
const DECODE_KEYS = [
  'first-output-token',
  'append-token',
  'decode-loop',
  'tpot',
  'token-interval',
  'long-output',
];

function cls(...names: Array<string | false | undefined>): string {
  return names.filter(Boolean).join(' ');
}

export function PrefillDecodeAnimation({ config, step, reducedMotion }: AnimationCanvasProps) {
  const targets = step.highlightTargets;

  const used = useMemo(() => {
    const set = new Set<string>();
    config.steps.forEach((s) => s.highlightTargets?.forEach((k) => set.add(k)));
    return set;
  }, [config]);
  const has = (key: string) => used.has(key);

  const inputRelevant = INPUT_KEYS.some(has);
  const preprocessRelevant = PREPROCESS_KEYS.some(has);
  const decodeRelevant = DECODE_KEYS.some(has);
  const breakdownRelevant = has('latency-breakdown');

  const tokenLong = on(targets, 'long-context');
  const ttftActive = on(targets, 'ttft') || on(targets, 'ttft-growth');
  const ttftGrown = on(targets, 'ttft-growth');
  const tpotActive = on(targets, 'tpot') || on(targets, 'token-interval');
  const intervalWide = on(targets, 'token-interval');
  const outputActive =
    on(targets, 'first-output-token') ||
    on(targets, 'append-token') ||
    on(targets, 'decode-loop') ||
    on(targets, 'long-output') ||
    tpotActive;
  const outputCount = on(targets, 'long-output') ? 7 : 4;
  const totalExtended = on(targets, 'total-latency');

  return (
    <div className={cls(styles.canvas, reducedMotion && styles.reduced)}>
      <div className={styles.phases}>
        <span className={styles.phaseLabel}>首字前</span>
        <span className={styles.phaseLabel}>首字后</span>
      </div>

      <div className={styles.track}>
        <div className={styles.preSide}>
          {/* 输入区：系统提示 / 检索片段 / 历史会话 */}
          <div className={cls(styles.group, !inputRelevant && styles.dormant)}>
            <div className={styles.inputBlocks}>
              <div className={cls(styles.chip, on(targets, 'prompt') && styles.active)}>系统提示</div>
              <div className={cls(styles.chip, on(targets, 'rag-chunks') && styles.active)}>检索片段</div>
              <div className={cls(styles.chip, styles.faintChip, on(targets, 'history') && styles.active)}>
                历史会话
              </div>
            </div>
          </div>

          {/* 输入序列汇成的 Token 条 */}
          <div
            className={cls(
              styles.tokenBar,
              on(targets, 'input-tokens') && styles.active,
              tokenLong && styles.long,
            )}
            aria-label="输入 Token 条"
          >
            <i />
            <i />
            <i />
            <i />
          </div>

          {/* 前置处理带：网关 / 排队 / 路由 / 检索 / 工具 */}
          <div className={cls(styles.band, !preprocessRelevant && styles.dormant)}>
            <span className={cls(styles.bandCell, on(targets, 'gateway') && styles.active)}>网关</span>
            <span className={cls(styles.bandCell, on(targets, 'queue') && styles.active)}>排队</span>
            <span className={cls(styles.bandCell, on(targets, 'route') && styles.active)}>路由</span>
            <span className={cls(styles.bandCell, on(targets, 'rag') && styles.active)}>检索</span>
            <span className={cls(styles.bandCell, on(targets, 'tool-call') && styles.active)}>工具</span>
          </div>

          {/* Prefill 区 */}
          <div
            className={cls(
              styles.prefill,
              on(targets, 'prefill') && styles.active,
              on(targets, 'prefill-done') && styles.done,
            )}
          >
            <span>Prefill</span>
            {on(targets, 'prefill-done') && <em className={styles.check}>已完成 ✓</em>}
          </div>

          {/* KV Cache 区 */}
          <div
            className={cls(
              styles.cache,
              (on(targets, 'cache') || on(targets, 'kv-write')) && styles.active,
              on(targets, 'kv-write') && styles.writing,
            )}
          >
            <span>KV Cache</span>
            <div className={styles.slots}>
              <i />
              <i />
              <i />
            </div>
          </div>
        </div>

        {/* 首 Token 分隔标记 + 回传通道 */}
        <div className={cls(styles.divider, on(targets, 'first-token') && styles.active)}>
          <div className={styles.dividerBar} />
          <span className={styles.dividerLabel}>首 Token</span>
          <div className={cls(styles.stream, on(targets, 'stream') && styles.active)}>回传 →</div>
        </div>

        {/* 首字后：Decode 循环 + 输出序列 */}
        <div className={cls(styles.postSide, !decodeRelevant && styles.dormant, totalExtended && styles.extended)}>
          <div className={styles.decodeHead}>
            <span>输出</span>
            <span className={cls(styles.loop, on(targets, 'decode-loop') && styles.active)} aria-label="自回归循环">
              ↻
            </span>
          </div>
          <div className={cls(styles.outputSeq, intervalWide && styles.wide)}>
            {Array.from({ length: outputCount }).map((_, i) => (
              <i
                key={i}
                className={cls(
                  outputActive && styles.filled,
                  i === 0 && on(targets, 'first-output-token') && styles.first,
                  i === outputCount - 1 && on(targets, 'append-token') && styles.last,
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 标尺：TTFT（首字前总长）/ TPOT（相邻输出间距）*/}
      <div className={styles.rulers}>
        <div className={cls(styles.ttft, ttftActive && styles.active, ttftGrown && styles.grown)}>
          <span className={styles.rulerLabel}>TTFT</span>
          <div className={styles.ttftTrack}>
            <div className={styles.ttftFill} />
            {ttftGrown && <div className={styles.ghostMark} aria-label="原首字前长度" />}
          </div>
        </div>
        <div className={cls(styles.tpot, tpotActive && styles.active, intervalWide && styles.wide)}>
          <span className={styles.rulerLabel}>TPOT</span>
          <div className={styles.tpotTrack}>
            <i />
            <i />
            <i />
          </div>
        </div>
      </div>

      {/* 归因分段条（latency-breakdown 命中时出现）*/}
      {breakdownRelevant && (
        <div className={cls(styles.breakdown, on(targets, 'latency-breakdown') && styles.active)}>
          <span className={styles.segGateway}>网关</span>
          <span className={styles.segRag}>检索</span>
          <span className={styles.segPrefill}>Prefill</span>
          <span className={styles.segNet}>网络</span>
        </div>
      )}
    </div>
  );
}

export default PrefillDecodeAnimation;
