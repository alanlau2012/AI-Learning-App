/**
 * 移动端底部导航（design.md §3 移动端）。
 * 仅移动端可见（≤960px）：首页 / 模块 / 搜索 / 我的。
 */
import { NavLink } from 'react-router-dom';
import styles from './BottomNav.module.css';

const ITEMS = [
  { to: '/', label: '首页', end: true },
  { to: '/modules', label: '模块', end: false },
  { to: '/search', label: '搜索', end: false },
  { to: '/profile', label: '我的', end: false },
];

export function BottomNav() {
  return (
    <nav className={styles.bottomNav} aria-label="主导航">
      {ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            isActive ? `${styles.item} ${styles.itemActive}` : styles.item
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}

export default BottomNav;
