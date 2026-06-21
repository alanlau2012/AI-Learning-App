/**
 * 阶段占位页：尚未落地的页面（模块页/详情页/搜索/术语/我的学习）在 P2 先用此占位，
 * 保证全量路由可跳转、不白屏。后续阶段（P3/P5）逐页替换为真实实现。
 */
import styles from './PagePlaceholder.module.css';

interface PagePlaceholderProps {
  /** 页面 mono 标签，如 P3 / P5 */
  stage: string;
  title: string;
  /** 该页落地后将提供的内容（一句话）。 */
  intent: string;
}

export function PagePlaceholder({ stage, title, intent }: PagePlaceholderProps) {
  return (
    <div className={styles.wrap}>
      <span className={styles.stage}>计划 · {stage}</span>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.intent}>{intent}</p>
    </div>
  );
}

export default PagePlaceholder;
