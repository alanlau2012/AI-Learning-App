/**
 * 唯一布局容器（design.md §3）。
 * 桌面：固定左侧栏 + 顶部条 + 主阅读画布；移动：顶部条 + 主区 + 底部导航。
 * 页面内容通过 <Outlet /> 注入，每页自行设置正文最大宽度与留白。
 */
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { PWAUpdatePrompt } from './PWAUpdatePrompt';
import styles from './AppShell.module.css';

export function AppShell() {
  return (
    <div className={styles.shell}>
      <Sidebar />
      <div className={styles.main}>
        <Header />
        <main className={styles.content}>
          <Outlet />
        </main>
        <BottomNav />
      </div>
      <PWAUpdatePrompt />
    </div>
  );
}

export default AppShell;
