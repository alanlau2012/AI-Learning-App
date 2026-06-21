/**
 * 通用进度条（绿色 = 进度/完成）。
 * 仅展示，自身不持状态；进度派生值由调用方传入。
 */
import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  /** 0–100 */
  percent: number;
  /** 顶部标注，如 "3 / 56" */
  label?: string;
  className?: string;
}

export function ProgressBar({ percent, label, className }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div className={className ? `${styles.wrap} ${className}` : styles.wrap}>
      {label && <span className={styles.label}>{label}</span>}
      <div
        className={styles.track}
        role="progressbar"
        aria-valuenow={Math.round(clamped)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className={styles.fill} style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
}

export default ProgressBar;
