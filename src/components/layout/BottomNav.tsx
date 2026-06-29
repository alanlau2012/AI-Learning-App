/**
 * 移动端底部导航（design.md §3 移动端）。
 * 仅移动端可见（≤960px）：首页 / 场景 / 搜索 / 我的。
 */
import { NavLink } from 'react-router-dom';
import { primaryNavItems } from './navItems';
import styles from './BottomNav.module.css';

export function BottomNav() {
  return (
    <nav className={styles.bottomNav} aria-label="主导航">
      {primaryNavItems.map((item) => (
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
