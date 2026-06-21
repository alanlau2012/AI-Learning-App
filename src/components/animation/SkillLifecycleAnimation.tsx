import type { AnimationCanvasProps } from './types';
import styles from './SkillLifecycleAnimation.module.css';

function on(targets: string[] | undefined, key: string): boolean {
  return targets?.includes(key) ?? false;
}

function cls(...names: Array<string | false | undefined>): string {
  return names.filter(Boolean).join(' ');
}

const SKILL_ROWS = ['触发条件', '指令', '资源', '脚本', '约束'];

/**
 * skill-lifecycle：Skill 是 SOP + 工具包式的可复用能力单元（≠ 更长的 Prompt）。
 * 发现 → 加载 → 执行/自检 → 反馈回流 → 沉淀为版本化资产 → 治理。
 */
export function SkillLifecycleAnimation({ step, reducedMotion }: AnimationCanvasProps) {
  const t = step.highlightTargets;

  const discoverOn = on(t, 'task') || on(t, 'discover');
  const loadOn = on(t, 'skill-def') || on(t, 'resources');
  const execOn = on(t, 'execute') || on(t, 'tools') || on(t, 'self-check');
  const feedbackOn = on(t, 'result') || on(t, 'feedback') || on(t, 'trace');
  const depositOn = on(t, 'deposit') || on(t, 'version');
  const governOn = on(t, 'governance') || on(t, 'permission');

  return (
    <div className={cls(styles.canvas, reducedMotion && styles.reduced)}>
      {/* 发现：任务匹配到 Skill，与普通 Prompt 形成对照 */}
      <div className={styles.discover}>
        <span className={cls(styles.chip, discoverOn && styles.lit)}>高频任务</span>
        <span className={styles.arrow}>→ 匹配</span>
        <span className={cls(styles.chip, styles.skillChip, discoverOn && styles.lit)}>Skill</span>
        <span className={styles.vsPrompt}>对照 · 普通 Prompt：无结构 / 不可复用 / 无版本</span>
      </div>

      {/* 加载：Skill 的结构化内容 */}
      <div className={cls(styles.skillCard, loadOn && styles.lit)}>
        <span className={styles.cardTag}>Skill = SOP + 工具包</span>
        <div className={styles.rows}>
          {SKILL_ROWS.map((r) => (
            <span key={r} className={cls(styles.row, loadOn && styles.lit)}>{r}</span>
          ))}
        </div>
      </div>

      {/* 执行 → 结果 */}
      <div className={styles.execRow}>
        <span className={cls(styles.node, execOn && styles.lit)}>调用工具</span>
        <span className={cls(styles.node, execOn && styles.lit)}>收集证据</span>
        <span className={cls(styles.node, styles.selfCheck, execOn && styles.lit)}>自检 ✓</span>
        <span className={styles.arrow}>→</span>
        <span className={cls(styles.node, styles.result, feedbackOn && styles.lit)}>产出结果</span>
      </div>

      {/* 反馈回流 */}
      <div className={cls(styles.feedback, feedbackOn && styles.show)}>
        <span className={styles.loopArrow}>↺</span>
        <span className={styles.feedbackTag}>反馈回流</span>
        <span className={cls(styles.sink, feedbackOn && styles.lit)}>评测</span>
        <span className={cls(styles.sink, feedbackOn && styles.lit)}>人工</span>
        <span className={cls(styles.sink, feedbackOn && styles.lit)}>trace</span>
      </div>

      {/* 沉淀 + 治理 */}
      <div className={styles.bottom}>
        <div className={cls(styles.shelf, depositOn && styles.lit)}>
          <span>Skill 库 · 可复用资产</span>
          <span className={cls(styles.version, depositOn && styles.bump)}>v1.3</span>
        </div>
        <div className={cls(styles.govern, governOn && styles.lit)}>
          <span>Owner</span>
          <span>权限边界</span>
          <span>弃用策略</span>
        </div>
      </div>
    </div>
  );
}

export default SkillLifecycleAnimation;
