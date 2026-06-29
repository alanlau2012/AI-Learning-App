import type { CSSProperties } from 'react';
import type { AnimationCanvasProps } from './types';
import styles from './TokenFlowAnimation.module.css';

function on(targets: string[] | undefined, ...keys: string[]): boolean {
  return keys.some((key) => targets?.includes(key)) ?? false;
}

function cls(...names: Array<string | false | undefined>): string {
  return names.filter(Boolean).join(' ');
}

const INPUT_TOKENS = [
  { label: '把这份', width: 58 },
  { label: '合', width: 30 },
  { label: '同的', width: 46 },
  { label: '关键条款', width: 74 },
  { label: '讲清楚', width: 62 },
];

const TOKEN_IDS = ['#312', '#88', '#1490', '#203', '#64'];
const OUTPUT_TOKENS = ['首先', '关注', '付款', '周期', '。'];

function phaseFromTargets(targets: string[] | undefined, stepIndex: number): number {
  if (on(targets, 'decode-loop', 'output-tokens', 'cost', 'decode')) return 7;
  if (on(targets, 'first-token', 'sampling', 'logits')) return 6;
  if (on(targets, 'kv-cache', 'cache')) return 5;
  if (on(targets, 'attention', 'self-attention', 'qkv')) return 4;
  if (on(targets, 'prefill', 'ttft')) return 3;
  if (on(targets, 'embedding', 'embeddings', 'token-ids', 'position')) return 2;
  if (on(targets, 'tokenizer', 'tokens')) return 1;
  return Math.max(0, Math.min(stepIndex, 7));
}

export function TokenFlowAnimation({
  step,
  stepIndex,
  reducedMotion,
}: AnimationCanvasProps) {
  const targets = step.highlightTargets;
  const phase = phaseFromTargets(targets, stepIndex);
  const reached = (n: number) => phase >= n;
  const active = (n: number) => phase === n;
  const flowing = !reducedMotion && phase > 0;

  return (
    <div
      className={cls(styles.canvas, reducedMotion && styles.reduced)}
      style={{ '--flow-phase': phase } as CSSProperties}
    >
      <div className={styles.inputRow}>
        <div className={cls(styles.inputBubble, active(0) && styles.active)}>
          把这份合同的关键条款讲清楚
        </div>
        <div className={cls(styles.arrow, reached(1) && styles.done)} aria-hidden>
          -&gt;
        </div>
        <div className={styles.tokenStrip}>
          {INPUT_TOKENS.map((token) => (
            <span
              key={token.label}
              className={cls(styles.token, reached(1) && styles.done, active(1) && styles.active)}
              style={{ width: token.width }}
            >
              {token.label}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.pipeline} aria-label="Token 到模型回答的连续链路">
        <span className={cls(styles.flowDot, flowing && styles.running)} aria-hidden />

        <section className={cls(styles.stage, reached(2) && styles.done, active(2) && styles.active)}>
          <span className={styles.stageTitle}>Embedding</span>
          <div className={styles.idRow}>
            {TOKEN_IDS.map((id) => (
              <span key={id}>{id}</span>
            ))}
          </div>
          <div className={styles.vectorRow} aria-hidden>
            <i style={{ height: 18 }} />
            <i style={{ height: 30 }} />
            <i style={{ height: 24 }} />
            <i style={{ height: 34 }} />
            <i style={{ height: 22 }} />
          </div>
          <span className={styles.microLabel}>+ position</span>
        </section>

        <section className={cls(styles.stage, reached(3) && styles.done, active(3) && styles.active)}>
          <span className={styles.stageTitle}>Prefill</span>
          <div className={styles.prefillBars} aria-hidden>
            <i style={{ height: 28 }} />
            <i style={{ height: 46 }} />
            <i style={{ height: 38 }} />
            <i style={{ height: 54 }} />
            <i style={{ height: 34 }} />
          </div>
          <span className={styles.microLabel}>全量输入一次算完</span>
        </section>

        <section className={cls(styles.stage, reached(4) && styles.done, active(4) && styles.active)}>
          <span className={styles.stageTitle}>Self-Attention</span>
          <div className={styles.qkvRow}>
            <span>Q</span>
            <span>K</span>
            <span>V</span>
          </div>
          <svg className={styles.attentionLines} viewBox="0 0 160 52" aria-hidden>
            <path d="M 14 38 Q 80 2 146 38" />
            <path d="M 30 44 Q 86 18 132 44" />
          </svg>
          <span className={styles.microLabel}>当前 token 看历史</span>
        </section>

        <section className={cls(styles.stage, reached(5) && styles.done, active(5) && styles.active)}>
          <span className={styles.stageTitle}>KV Cache</span>
          <div className={styles.cacheGrid}>
            {['K1/V1', 'K2/V2', 'K3/V3', 'K4/V4'].map((cell) => (
              <span key={cell}>{cell}</span>
            ))}
          </div>
          <span className={styles.microLabel}>历史状态可复用</span>
        </section>

        <section className={cls(styles.stage, reached(6) && styles.done, active(6) && styles.active)}>
          <span className={styles.stageTitle}>Next Token</span>
          <div className={styles.probRows}>
            <span style={{ '--p': '78%' } as CSSProperties}>首先</span>
            <span style={{ '--p': '62%' } as CSSProperties}>关注</span>
            <span style={{ '--p': '46%' } as CSSProperties}>付款</span>
          </div>
          <span className={styles.microLabel}>logits / sampling</span>
        </section>

        <section className={cls(styles.stage, reached(7) && styles.done, active(7) && styles.active)}>
          <span className={styles.stageTitle}>Decode Loop</span>
          <div className={styles.outputRow}>
            {OUTPUT_TOKENS.map((token, index) => (
              <span
                key={token}
                className={cls(reached(7) && styles.reveal)}
                style={{ transitionDelay: `${index * 90}ms` }}
              >
                {token}
              </span>
            ))}
          </div>
          <span className={styles.microLabel}>新 token 接回上下文</span>
        </section>
      </div>
    </div>
  );
}

export default TokenFlowAnimation;
