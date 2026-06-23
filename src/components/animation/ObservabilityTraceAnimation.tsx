import type { AnimationCanvasProps } from './types';
import styles from './ObservabilityTraceAnimation.module.css';

function on(targets: string[] | undefined, key: string): boolean {
  return targets?.includes(key) ?? false;
}

function cls(...names: Array<string | false | undefined>): string {
  return names.filter(Boolean).join(' ');
}

/**
 * observability-trace：单次请求 trace 与系统级质量观测的连接。
 * Trace 侧强调 span 粒度；Observability 侧强调质量/延迟/成本聚合与下钻。
 */
export function ObservabilityTraceAnimation({ step, reducedMotion }: AnimationCanvasProps) {
  const t = step.highlightTargets;
  const requestOn = on(t, 'request') || on(t, 'trace-id');
  const promptOn = on(t, 'prompt') || on(t, 'context');
  const toolOn = on(t, 'tool') || on(t, 'span');
  const agentOn = on(t, 'agent') || on(t, 'subagent');
  const outputOn = on(t, 'output');
  const qualityOn = on(t, 'quality') || on(t, 'eval');
  const metricsOn = on(t, 'latency') || on(t, 'cost') || on(t, 'dashboard');
  const alertOn = on(t, 'alert') || on(t, 'drilldown');

  return (
    <div className={cls(styles.canvas, reducedMotion && styles.reduced)}>
      <div className={styles.traceRail}>
        <TraceNode label="trace id" title="请求" active={requestOn} />
        <TraceNode label="span 01" title="提示组装" active={promptOn} />
        <TraceNode label="span 02" title="工具调用" active={toolOn} />
        <TraceNode label="span 03" title="子 Agent" active={agentOn} />
        <TraceNode label="output" title="最终回答" active={outputOn} />
      </div>

      <div className={styles.bridge}>
        <span className={cls(styles.bridgeLine, (qualityOn || metricsOn) && styles.show)} />
        <span className={styles.bridgeLabel}>trace 聚合为系统信号</span>
      </div>

      <div className={styles.dashboard}>
        <Metric label="质量" value="fact error" active={qualityOn} tone="quality" />
        <Metric label="延迟" value="P95 / TTFT" active={metricsOn} tone="latency" />
        <Metric label="成本" value="token / call" active={metricsOn} tone="cost" />
      </div>

      <div className={cls(styles.alertStrip, alertOn && styles.show)}>
        <span className={styles.alertDot} />
        质量回退告警 → 下钻异常 trace → 定位失败 span
      </div>
    </div>
  );
}

function TraceNode({ label, title, active }: { label: string; title: string; active: boolean }) {
  return (
    <div className={cls(styles.traceNode, active && styles.active)}>
      <span>{label}</span>
      <strong>{title}</strong>
    </div>
  );
}

function Metric({
  label,
  value,
  active,
  tone,
}: {
  label: string;
  value: string;
  active: boolean;
  tone: 'quality' | 'latency' | 'cost';
}) {
  return (
    <div className={cls(styles.metric, styles[tone], active && styles.active)}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default ObservabilityTraceAnimation;
