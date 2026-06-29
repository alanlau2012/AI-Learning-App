/**
 * PWA 更新提示浮层（design.md 视觉）。
 * 当 Service Worker 检测到新版本（pwa-register 派发 'pwa:need-refresh'）时，
 * 在右下角显示一个克制的提示卡片；用户可选择"立即刷新"或"稍后"。
 * 离线就绪事件（'pwa:offline-ready'）目前不弹窗，避免首次访问噪音。
 */
import { useEffect, useState } from 'react';
import styles from './PWAUpdatePrompt.module.css';

export function PWAUpdatePrompt() {
  const [needRefresh, setNeedRefresh] = useState(false);

  useEffect(() => {
    const onNeedRefresh = () => setNeedRefresh(true);
    window.addEventListener('pwa:need-refresh', onNeedRefresh);
    return () => window.removeEventListener('pwa:need-refresh', onNeedRefresh);
  }, []);

  if (!needRefresh) return null;

  const handleUpdate = () => {
    const apply = window.__pwaApplyUpdate;
    if (apply) {
      void apply().then(() => window.location.reload());
    } else {
      window.location.reload();
    }
  };

  const handleDismiss = () => setNeedRefresh(false);

  return (
    <div className={styles.toast} role="alertdialog" aria-live="polite" aria-label="应用有新版本">
      <div className={styles.body}>
        <div className={styles.title}>有新版本可用</div>
        <div className={styles.desc}>已下载更新，刷新即可使用最新内容。</div>
      </div>
      <div className={styles.actions}>
        <button type="button" className={styles.secondary} onClick={handleDismiss}>
          稍后
        </button>
        <button type="button" className={styles.primary} onClick={handleUpdate} autoFocus>
          立即刷新
        </button>
      </div>
    </div>
  );
}

export default PWAUpdatePrompt;
