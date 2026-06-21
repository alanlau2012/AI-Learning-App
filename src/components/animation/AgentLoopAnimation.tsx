import { useMemo } from 'react';
import type { AnimationCanvasProps } from './types';
import styles from './AgentLoopAnimation.module.css';

function on(targets: string[] | undefined, key: string): boolean {
  return targets?.includes(key) ?? false;
}

function cls(...names: Array<string | false | undefined>): string {
  return names.filter(Boolean).join(' ');
}

const TRACE_CELLS = [
  { label: '观察', keys: ['observe', 'context'] },
  { label: '动作', keys: ['act'] },
  { label: '结果', keys: ['tool-result', 'evidence'] },
  { label: '继续条件', keys: ['continue', 'stop', 'human-review'] },
];

export function AgentLoopAnimation({ config, step, stepIndex, reducedMotion }: AnimationCanvasProps) {
  const targets = step.highlightTargets;

  // 截至当前步累计出现过的 key（用于 trace 轨道按轮追加）
  const seen = useMemo(() => {
    const set = new Set<string>();
    config.steps.slice(0, stepIndex + 1).forEach((s) =>
      s.highlightTargets?.forEach((k) => set.add(k)),
    );
    return set;
  }, [config, stepIndex]);

  const decisionActive =
    on(targets, 'continue') || on(targets, 'stop') || on(targets, 'human-review');
  const continueWeak = on(targets, 'human-review');

  return (
    <div className={cls(styles.canvas, reducedMotion && styles.reduced)}>
      {/* 任务输入栏：目标 / 约束 */}
      <div className={styles.taskBar}>
        <span className={cls(styles.taskChip, on(targets, 'goal') && styles.active)}>目标</span>
        <span className={cls(styles.taskChip, on(targets, 'constraints') && styles.active)}>约束</span>
      </div>

      <svg className={styles.svg} viewBox="0 0 600 340" role="img" aria-label="Agent 执行循环">
        {/* 环形循环轨道 */}
        <circle className={styles.ringTrack} cx="290" cy="160" r="82" />

        {/* 工具区（含权限边界）*/}
        <g className={cls(styles.toolBox, (on(targets, 'tools') || on(targets, 'tool-result')) && styles.active)}>
          <rect x="420" y="210" width="160" height="86" rx="8" />
          <text x="500" y="244" className={styles.boxTitle}>
            工具
          </text>
          <text x="500" y="266" className={styles.lock}>
            🔒 权限边界
          </text>
        </g>

        {/* Act → 工具区 调用 */}
        <line
          className={cls(styles.flow, on(targets, 'act') && styles.active)}
          x1="320"
          y1="242"
          x2="418"
          y2="248"
        />
        {/* 工具区 → trace 结果回流 */}
        <line
          className={cls(styles.flow, styles.result, on(targets, 'tool-result') && styles.active)}
          x1="500"
          y1="298"
          x2="500"
          y2="330"
        />
        <text
          x="516"
          y="322"
          className={cls(styles.flowLabel, on(targets, 'tool-result') && styles.activeText)}
        >
          结果
        </text>

        {/* 四个环节节点 */}
        <g className={cls(styles.node, on(targets, 'observe') && styles.active)}>
          <circle cx="290" cy="78" r="30" />
          <text x="290" y="83">观察</text>
        </g>
        <g className={cls(styles.node, on(targets, 'plan') && styles.active)}>
          <circle cx="372" cy="160" r="30" />
          <text x="372" y="165">计划</text>
        </g>
        <g className={cls(styles.node, on(targets, 'act') && styles.active)}>
          <circle cx="290" cy="242" r="30" />
          <text x="290" y="247">行动</text>
        </g>
        <g className={cls(styles.node, on(targets, 'check') && styles.active)}>
          <circle cx="208" cy="160" r="30" />
          <text x="208" y="165">校验</text>
        </g>

        {/* 判断 / 出口 节点 */}
        <g className={cls(styles.node, styles.decision, decisionActive && styles.active)}>
          <rect x="58" y="138" width="64" height="44" rx="8" />
          <text x="90" y="164">判断</text>
        </g>
        {/* 校验 → 判断 */}
        <line className={styles.flow} x1="178" y1="160" x2="122" y2="160" />

        {/* 三条出口 */}
        {/* 继续：判断 → 观察（环形回流）*/}
        <path
          className={cls(
            styles.continueArc,
            on(targets, 'continue') && styles.active,
            continueWeak && styles.weak,
          )}
          d="M90,138 C80,34 184,40 262,66"
          fill="none"
        />
        <text
          x="150"
          y="40"
          className={cls(styles.flowLabel, on(targets, 'continue') && styles.activeText)}
        >
          继续
        </text>

        {/* 停止·完成 */}
        <line
          className={cls(styles.flow, on(targets, 'stop') && styles.active)}
          x1="74"
          y1="140"
          x2="62"
          y2="104"
        />
        <g className={cls(styles.exitChip, styles.stopChip, on(targets, 'stop') && styles.active)}>
          <rect x="30" y="70" width="64" height="32" rx="6" />
          <text x="62" y="90">完成</text>
        </g>

        {/* 转人工 */}
        <line
          className={cls(styles.flow, on(targets, 'human-review') && styles.active)}
          x1="84"
          y1="182"
          x2="62"
          y2="246"
        />
        <g
          className={cls(
            styles.exitChip,
            styles.humanChip,
            on(targets, 'human-review') && styles.active,
          )}
        >
          <rect x="28" y="248" width="68" height="32" rx="6" />
          <text x="62" y="268">人审</text>
        </g>

        {/* 观察证据卡 */}
        <g className={cls(styles.card, on(targets, 'context') && styles.active)}>
          <rect x="330" y="28" width="150" height="40" rx="6" />
          <text x="405" y="52">证据 / 上下文</text>
        </g>
        {/* 计划小卡：下一步动作 + 验证标准 */}
        <g className={cls(styles.card, on(targets, 'plan') && styles.active)}>
          <rect x="398" y="110" width="160" height="44" rx="6" />
          <text x="478" y="135">下一步动作</text>
          <text x="478" y="148" className={styles.cardSub}>验证标准</text>
        </g>
        {/* 校验证据卡 */}
        <g className={cls(styles.card, on(targets, 'evidence') && styles.active)}>
          <rect x="120" y="80" width="120" height="38" rx="6" />
          <text x="180" y="103">测试 / 日志</text>
        </g>
      </svg>

      {/* trace 轨道：观察 / 动作 / 结果 / 继续条件 */}
      <div className={styles.trace}>
        {TRACE_CELLS.map((cell) => {
          const filled = cell.keys.some((k) => seen.has(k));
          const current = cell.keys.some((k) => on(targets, k));
          return (
            <span
              key={cell.label}
              className={cls(styles.traceCell, filled && styles.filled, current && styles.current)}
            >
              {cell.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default AgentLoopAnimation;
