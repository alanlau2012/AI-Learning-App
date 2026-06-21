import type { AnimationCanvasProps } from './types';
import styles from './TokenFlowAnimation.module.css';

function on(targets: string[] | undefined, key: string): boolean {
  return targets?.includes(key) ?? false;
}

function cls(...names: Array<string | false | undefined>): string {
  return names.filter(Boolean).join(' ');
}

/** 颗粒度不均的 Token（宽度差异表达：一个 Token 不等于一个字/词）。 */
const TOKEN_CELLS = [34, 18, 46, 24, 30, 16, 40];
const ID_CHIPS = ['312', '88', '5×2', '1490', '7', '203', '64'];

/**
 * token-flow：文本 → 分词 → 编号/向量 → Prefill/TTFT → Decode/成本。
 * 用「阶段推进」让前序阶段保持已完成态，当前阶段高亮，呈现 Token 在
 * 计算/计费链路里的流动，而不是把一句话切成几个方块。
 */
export function TokenFlowAnimation({ step, reducedMotion }: AnimationCanvasProps) {
  const t = step.highlightTargets;

  const textOn = on(t, 'input-text');
  const tokenizeOn = on(t, 'tokenizer') || on(t, 'tokens');
  const idsOn = on(t, 'token-ids') || on(t, 'embeddings');
  const prefillOn = on(t, 'prefill') || on(t, 'ttft');
  const ttftOn = on(t, 'ttft');
  const decodeOn = on(t, 'decode') || on(t, 'output-tokens') || on(t, 'cost');
  const costOn = on(t, 'cost');

  // 阶段号：用于「已到达即保持」的渐进式呈现
  const phase = decodeOn ? 5 : prefillOn ? 4 : idsOn ? 3 : tokenizeOn ? 2 : 1;
  const reached = (n: number) => phase >= n;

  return (
    <div className={cls(styles.canvas, reducedMotion && styles.reduced)}>
      {/* 1 · 原始文本 */}
      <div className={styles.stage}>
        <span className={styles.label}>文本</span>
        <div className={cls(styles.textBubble, textOn && styles.active, phase >= 3 && styles.spent)}>
          把这份合同的关键条款讲清楚
        </div>
      </div>
      <div className={cls(styles.flow, reached(2) && styles.lit)} aria-hidden>↓ 分词</div>

      {/* 2 · 分词为 Token（颗粒度不均） */}
      <div className={styles.stage}>
        <span className={styles.label}>Token</span>
        <div className={styles.tokens}>
          {TOKEN_CELLS.map((w, i) => (
            <i
              key={i}
              style={{ width: w }}
              className={cls(styles.tok, reached(2) && styles.filled, tokenizeOn && styles.active)}
            />
          ))}
        </div>
      </div>
      <div className={cls(styles.flow, reached(3) && styles.lit)} aria-hidden>↓ 编号 / 向量</div>

      {/* 3 · 映射为编号与向量 */}
      <div className={styles.stage}>
        <span className={styles.label}>编号 / 向量</span>
        <div className={styles.idRow}>
          {ID_CHIPS.map((id, i) => (
            <span key={i} className={cls(styles.idChip, idsOn && styles.active, reached(3) && styles.filled)}>
              {id}
            </span>
          ))}
        </div>
        <div className={styles.vecRow} aria-hidden>
          {ID_CHIPS.map((_, i) => (
            <span key={i} className={cls(styles.vec, reached(3) && styles.filled, idsOn && styles.active)} />
          ))}
        </div>
      </div>

      {/* 4 · 输入 Token 压在首字前：Prefill 占用 + TTFT */}
      <div className={cls(styles.meter, !reached(4) && styles.dormant)}>
        <span className={styles.label}>首字前</span>
        <div className={styles.barRow}>
          <span className={styles.barTag}>Prefill 占用</span>
          <div className={styles.track}>
            <div className={cls(styles.prefillFill, prefillOn && styles.active)} />
          </div>
        </div>
        <div className={styles.barRow}>
          <span className={styles.barTag}>TTFT</span>
          <div className={styles.track}>
            <div className={cls(styles.ttftFill, ttftOn && styles.active)} />
          </div>
        </div>
      </div>

      {/* 5 · 输出 Token 逐个生成：Decode 时长 + 成本 */}
      <div className={cls(styles.meter, !reached(5) && styles.dormant)}>
        <span className={styles.label}>首字后</span>
        <div className={styles.outRow}>
          <span className={styles.barTag}>输出</span>
          <div className={styles.outSeq}>
            {Array.from({ length: 6 }).map((_, i) => (
              <i key={i} className={cls(styles.outTok, decodeOn && styles.active)} />
            ))}
          </div>
        </div>
        <div className={styles.barRow}>
          <span className={styles.barTag}>成本</span>
          <div className={styles.track}>
            <div className={cls(styles.costFill, costOn && styles.active)} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TokenFlowAnimation;
