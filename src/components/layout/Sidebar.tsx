/**
 * 左侧稳定锚点（design.md §5）。
 * 产品名 + 56讲/MVP 标签 + 一级导航（首页/我的学习/搜索）+ 六大模块实时 done/total + 底部总进度。
 * 当前导航项/模块淡蓝底；模块进度用低对比 mono 文本。
 */
import { NavLink } from 'react-router-dom';
import { modules } from '../../data/modules';
import { useProgressStore } from '../../store/progressStore';
import { moduleProgress, overallProgress } from '../../utils/progressCore';
import { ProgressBar } from '../progress/ProgressBar';
import { primaryNavItems } from './navItems';
import styles from './Sidebar.module.css';

export function Sidebar() {
  const completedConceptIds = useProgressStore((s) => s.completedConceptIds);
  const completedSet = new Set(completedConceptIds);
  const overall = overallProgress(completedConceptIds);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div className={styles.brandName}>AI 应用工程</div>
        <div className={styles.brandTags}>
          <span className={styles.tag}>56 讲</span>
          <span className={styles.tag}>MVP · v1</span>
        </div>
      </div>

      <nav className={styles.primaryNav}>
        {primaryNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className={styles.sectionLabel}>模块</div>
      <nav className={styles.moduleNav}>
        {modules.map((m) => {
          const { done, total } = moduleProgress(m.id, completedSet);
          return (
            <NavLink
              key={m.id}
              to={`/modules/${m.id}`}
              className={({ isActive }) =>
                isActive ? `${styles.moduleItem} ${styles.moduleItemActive}` : styles.moduleItem
              }
            >
              <span className={styles.moduleOrder}>
                {String(m.order).padStart(2, '0')}
              </span>
              <span className={styles.moduleTitle}>{m.title}</span>
              <span className={styles.moduleCount}>
                {done}/{total}
              </span>
            </NavLink>
          );
        })}
      </nav>

      <div className={styles.footer}>
        <ProgressBar
          percent={overall.percent}
          label={`总进度 · ${overall.done} / ${overall.total}`}
        />
      </div>
    </aside>
  );
}

export default Sidebar;
