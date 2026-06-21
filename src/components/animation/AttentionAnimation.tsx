import type { AnimationCanvasProps } from './types';
import styles from './AttentionAnimation.module.css';

function on(targets: string[] | undefined, key: string): boolean {
  return targets?.includes(key) ?? false;
}

function cls(...names: Array<string | false | undefined>): string {
  return names.filter(Boolean).join(' ');
}

// 7 个上下文 Token 的水平中心坐标；最右为「当前 Token」(Query)
const CX = [48, 132, 216, 300, 384, 468, 552];
const CURRENT = 6;
const EVIDENCE = 1; // 高相关证据
const CONFLICT = 4; // 冲突/过期片段
const HISTORY = [0, 1, 2, 3, 4, 5];

// 不同阶段下，当前 Token 对各历史位置的注意力权重（0–1）
const W_BASE = [0.3, 0.85, 0.35, 0.3, 0.4, 0.3];
const W_POLLUTED = [0.25, 0.45, 0.3, 0.3, 0.92, 0.25];
const W_CLEAN = [0.3, 0.95, 0.28, 0.25, 0.12, 0.3];

/**
 * attention-map：注意力是「当前位置对历史 Token 的加权选择」，
 * 线宽 = 权重。污染会带偏权重，重排/清洗把权重还给高相关证据。
 * 因果方向：连线只指向左侧历史，当前 Token 右侧无连线（不看未来）。
 */
export function AttentionAnimation({ step, reducedMotion }: AnimationCanvasProps) {
  const t = step.highlightTargets;

  const contextOn = on(t, 'tokens') || on(t, 'context');
  const currentOn = on(t, 'current-token');
  const polluted = on(t, 'pollution') || on(t, 'shifted-weights');
  const cleaned = on(t, 'rerank') || on(t, 'clean-context');
  const linksOn = on(t, 'attention-links') || on(t, 'attention-map') || polluted || cleaned;

  const weights = cleaned ? W_CLEAN : polluted ? W_POLLUTED : W_BASE;

  const arcKind = (i: number): string => {
    if (i === CONFLICT && polluted) return styles.warn;
    if (i === EVIDENCE && cleaned) return styles.good;
    return styles.link;
  };

  return (
    <div className={cls(styles.canvas, reducedMotion && styles.reduced)}>
      <svg className={styles.svg} viewBox="0 0 600 200" role="img" aria-label="注意力权重关系">
        {/* 连线：当前 Token → 各历史位置，线宽 = 权重 */}
        {linksOn &&
          HISTORY.map((i) => {
            const w = weights[i];
            const x = CX[i];
            const mid = (CX[CURRENT] + x) / 2;
            const dim = i === CONFLICT && cleaned; // 清洗后冲突连线消隐
            return (
              <path
                key={i}
                className={cls(styles.arc, arcKind(i), dim && styles.faded)}
                d={`M ${CX[CURRENT]} 58 Q ${mid} 128 ${x} 58`}
                style={{ strokeWidth: 1 + w * 6, opacity: dim ? 0.12 : 0.3 + w * 0.6 }}
                fill="none"
              />
            );
          })}

        {/* Token 方块 */}
        {CX.map((x, i) => {
          const isCurrent = i === CURRENT;
          const isEvidence = i === EVIDENCE;
          const isConflict = i === CONFLICT;
          const dimConflict = isConflict && cleaned;
          return (
            <g
              key={i}
              className={cls(
                styles.tok,
                contextOn && styles.enter,
                isCurrent && (currentOn || linksOn) && styles.current,
                isEvidence && styles.evidence,
                isConflict && polluted && styles.conflict,
                dimConflict && styles.faded,
              )}
            >
              <rect x={x - 27} y={20} width={54} height={34} rx={5} />
            </g>
          );
        })}

        {/* 固定中文短标签 */}
        <text className={styles.tag} x={CX[CURRENT]} y={74}>当前</text>
        <text className={cls(styles.tag, styles.tagGood)} x={CX[EVIDENCE]} y={74}>证据</text>
        <text
          className={cls(styles.tag, polluted && styles.tagWarn, cleaned && styles.faded)}
          x={CX[CONFLICT]}
          y={74}
        >
          冲突
        </text>

        {/* 因果方向提示 */}
        <text className={styles.axis} x={300} y={158}>注意力只看历史 · 不看未来</text>
      </svg>

      {/* 权重分布条（静态可读，呼应 reduced-motion） */}
      <div className={styles.weights}>
        <span className={styles.wLabel}>权重</span>
        <div className={styles.wTrack}>
          {HISTORY.map((i) => (
            <i
              key={i}
              className={cls(
                styles.wBar,
                i === EVIDENCE && cleaned && styles.good,
                i === CONFLICT && polluted && styles.warn,
              )}
              style={{ height: linksOn ? `${10 + weights[i] * 26}px` : '6px' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default AttentionAnimation;
