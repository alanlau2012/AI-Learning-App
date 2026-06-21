import { useMemo } from 'react';
import type { ReactNode } from 'react';
import type { AnimationCanvasProps } from './types';
import styles from './ModelRoutingAnimation.module.css';

function on(targets: string[] | undefined, key: string): boolean {
  return targets?.includes(key) ?? false;
}

function cls(...names: Array<string | false | undefined>): string {
  return names.filter(Boolean).join(' ');
}

const GATEWAY_KEYS = ['apps', 'gateway', 'auth', 'quota', 'metering', 'trace', 'circuit-break', 'models'];

/** 模型画像卡：能力 / 成本 / 时延（0–1，长度比） */
const PROFILES = [
  { name: '小模型', cap: 0.4, cost: 0.25, lat: 0.3 },
  { name: '中模型', cap: 0.7, cost: 0.5, lat: 0.5 },
  { name: '旗舰', cap: 0.95, cost: 0.9, lat: 0.8 },
];

/**
 * model-router：同一画布服务「模型网关」与「多模型路由」两讲。
 * 扫描整份 config 的 key 判定模式：网关讲点亮治理入口闭环；
 * 路由讲点亮按能力/成本/时延的选择与升降级回流。
 */
export function ModelRoutingAnimation({ config, step, reducedMotion }: AnimationCanvasProps) {
  const t = step.highlightTargets;

  const gatewayMode = useMemo(() => {
    const set = new Set<string>();
    config.steps.forEach((s) => s.highlightTargets?.forEach((k) => set.add(k)));
    return GATEWAY_KEYS.some((k) => set.has(k));
  }, [config]);

  if (gatewayMode) return <GatewayView t={t} reduced={reducedMotion} />;
  return <RoutingView t={t} reduced={reducedMotion} />;
}

function GatewayView({ t, reduced }: { t: string[] | undefined; reduced: boolean }) {
  return (
    <div className={cls(styles.lanes, reduced && styles.reduced)}>
      <Lane tag="入口" active={on(t, 'apps') || on(t, 'gateway')}>
        <div className={styles.apps}>
          <span className={styles.appChip}>应用 A</span>
          <span className={styles.appChip}>应用 B</span>
          <span className={styles.appChip}>应用 C</span>
        </div>
        <span className={styles.arrow}>→</span>
        <span className={cls(styles.gatewayBox, (on(t, 'gateway') || on(t, 'apps')) && styles.lit)}>统一网关</span>
      </Lane>

      <Lane tag="治理" active={on(t, 'auth') || on(t, 'quota') || on(t, 'policy')}>
        <span className={cls(styles.check, on(t, 'auth') && styles.lit)}>鉴权</span>
        <span className={cls(styles.check, on(t, 'quota') && styles.lit)}>配额</span>
        <span className={cls(styles.check, on(t, 'policy') && styles.lit)}>策略</span>
        <span className={cls(styles.blocked, on(t, 'policy') && styles.show)}>✕ 不合规拦截</span>
      </Lane>

      <Lane tag="路由" active={on(t, 'router') || on(t, 'models')}>
        <span className={cls(styles.routerNode, on(t, 'router') && styles.lit)}>路由</span>
        <span className={styles.arrow}>→</span>
        <span className={cls(styles.poolChip, on(t, 'models') && styles.lit)}>模型 / 服务池</span>
      </Lane>

      <Lane tag="证据" active={on(t, 'metering') || on(t, 'trace')}>
        <div className={styles.meterBand}>
          {['Token', '耗时', '模型版本', 'trace id'].map((m) => (
            <span key={m} className={cls(styles.meterCell, (on(t, 'metering') || on(t, 'trace')) && styles.lit)}>
              {m}
            </span>
          ))}
        </div>
      </Lane>

      <Lane tag="兜底" active={on(t, 'fallback') || on(t, 'circuit-break')}>
        <span className={cls(styles.warnNode, on(t, 'circuit-break') && styles.lit)}>下游异常</span>
        <span className={styles.warnArrow}>→</span>
        <span className={cls(styles.warnNode, on(t, 'circuit-break') && styles.lit)}>熔断 / 限流</span>
        <span className={cls(styles.warnNode, on(t, 'fallback') && styles.lit)}>备用路由</span>
      </Lane>
    </div>
  );
}

function RoutingView({ t, reduced }: { t: string[] | undefined; reduced: boolean }) {
  const profilesOn = on(t, 'model-profiles') || on(t, 'router') || on(t, 'selected-model') || on(t, 'fallback');
  const selectOn = on(t, 'router') || on(t, 'selected-model');
  const upgradeOn = on(t, 'fallback') || on(t, 'sla');

  return (
    <div className={cls(styles.lanes, reduced && styles.reduced)}>
      <Lane tag="约束" active={on(t, 'request-labels')}>
        {['任务类型', '敏感级', '时延预算', '质量要求'].map((m) => (
          <span key={m} className={cls(styles.label, on(t, 'request-labels') && styles.lit)}>{m}</span>
        ))}
      </Lane>

      <Lane tag="候选" active={profilesOn}>
        <div className={cls(styles.cards, !profilesOn && styles.dormant)}>
          {PROFILES.map((p, i) => {
            // 中模型=性价比首选；旗舰=失败/SLA 升级目标
            const chosen = selectOn && i === 1 && !upgradeOn;
            const upgraded = upgradeOn && i === 2;
            const filtered = selectOn && i === 0; // 不达质量门槛被过滤
            return (
              <div
                key={p.name}
                className={cls(
                  styles.card,
                  chosen && styles.chosen,
                  upgraded && styles.upgraded,
                  filtered && styles.filtered,
                )}
              >
                <span className={styles.cardName}>{p.name}</span>
                <Bar tag="能力" v={p.cap} kind="cap" />
                <Bar tag="成本" v={p.cost} kind="cost" />
                <Bar tag="时延" v={p.lat} kind="lat" />
              </div>
            );
          })}
        </div>
      </Lane>

      <Lane tag="升级" active={upgradeOn}>
        <span className={cls(styles.warnNode, upgradeOn && styles.lit)}>错误率 / 超时</span>
        <span className={styles.warnArrow}>→</span>
        <span className={cls(styles.warnNode, upgradeOn && styles.lit)}>升级 / 备用补位</span>
      </Lane>

      <Lane tag="回流" active={on(t, 'eval') || on(t, 'observability') || on(t, 'policy')}>
        <span className={cls(styles.flowChip, on(t, 'eval') && styles.lit)}>评测</span>
        <span className={cls(styles.flowChip, on(t, 'observability') && styles.lit)}>观测</span>
        <span className={styles.backArrow}>↺</span>
        <span className={cls(styles.flowChip, on(t, 'policy') && styles.lit)}>修正路由策略</span>
      </Lane>
    </div>
  );
}

function Lane({ tag, active, children }: { tag: string; active: boolean; children: ReactNode }) {
  return (
    <div className={cls(styles.lane, active && styles.laneActive)}>
      <span className={styles.laneTag}>{tag}</span>
      <div className={styles.laneBody}>{children}</div>
    </div>
  );
}

function Bar({ tag, v, kind }: { tag: string; v: number; kind: string }) {
  return (
    <div className={styles.barRow}>
      <span className={styles.barTag}>{tag}</span>
      <div className={styles.barTrack}>
        <i className={cls(styles.barFill, styles[kind])} style={{ width: `${Math.round(v * 100)}%` }} />
      </div>
    </div>
  );
}

export default ModelRoutingAnimation;
