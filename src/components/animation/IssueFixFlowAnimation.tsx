import type { AnimationCanvasProps } from './types';
import styles from './IssueFixFlowAnimation.module.css';

function on(targets: string[] | undefined, key: string): boolean {
  return targets?.includes(key) ?? false;
}

function cls(...names: Array<string | false | undefined>): string {
  return names.filter(Boolean).join(' ');
}

/**
 * issue-fix-flow：问题单质量 → 修复路径 → 验证闭环。
 * 关键工程判断：验证失败要回流到定位/补丁（不盲目向前扩散），
 * 人类 Owner 负责合入，评审/失败回流到模板·Skill·评测集。
 */
export function IssueFixFlowAnimation({ step, reducedMotion }: AnimationCanvasProps) {
  const t = step.highlightTargets;

  const issueOn = on(t, 'issue') || on(t, 'requirements');
  const locateOn = on(t, 'repo-context') || on(t, 'search');
  const patchOn = on(t, 'patch') || on(t, 'scope');
  const validateOn = on(t, 'tests') || on(t, 'validation');
  const prOn = on(t, 'pr') || on(t, 'human-review');
  const reflowOn = on(t, 'feedback') || on(t, 'eval') || on(t, 'skill');

  return (
    <div className={cls(styles.canvas, reducedMotion && styles.reduced)}>
      <div className={styles.flow}>
        <div className={cls(styles.node, issueOn && styles.active)}>
          <span className={styles.tag}>问题单</span>
          <div className={styles.fields}>
            <span className={styles.field}>复现</span>
            <span className={styles.field}>期望</span>
            <span className={styles.field}>约束</span>
          </div>
        </div>

        <Arrow />

        <div className={cls(styles.node, locateOn && styles.active)}>
          <span className={styles.tag}>定位</span>
          <strong className={styles.title}>仓库 · 搜索</strong>
        </div>

        <Arrow />

        <div className={cls(styles.node, styles.scoped, patchOn && styles.active)}>
          <span className={styles.tag}>补丁</span>
          <strong className={styles.title}>最小化修改</strong>
          <span className={styles.scopeMark}>限定影响面</span>
        </div>

        <Arrow />

        <div className={cls(styles.node, validateOn && styles.active)}>
          <span className={styles.tag}>验证</span>
          <strong className={styles.title}>测试 · 类型检查</strong>
        </div>

        <Arrow />

        <div className={cls(styles.node, prOn && styles.active)}>
          <span className={styles.tag}>PR · 人审</span>
          <strong className={styles.title}>人类 Owner 合入</strong>
        </div>
      </div>

      {/* 验证失败回流（核心工程判断） */}
      <div className={cls(styles.loopBack, validateOn && styles.show)}>
        <span className={styles.loopArrow}>↩</span>
        验证失败回到「定位 / 缩小修改」，不盲目向前扩散
      </div>

      {/* 质量回流闭环 */}
      <div className={cls(styles.reflow, reflowOn && styles.show)}>
        <span className={styles.reflowArrow}>↺</span>
        <span className={styles.reflowTag}>质量回流</span>
        <span className={cls(styles.sink, reflowOn && styles.lit)}>问题单模板</span>
        <span className={cls(styles.sink, reflowOn && styles.lit)}>Skill</span>
        <span className={cls(styles.sink, reflowOn && styles.lit)}>评测集</span>
      </div>
    </div>
  );
}

function Arrow() {
  return <span className={styles.arrow} aria-hidden>→</span>;
}

export default IssueFixFlowAnimation;
