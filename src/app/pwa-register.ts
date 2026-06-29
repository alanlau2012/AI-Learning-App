import { registerSW } from 'virtual:pwa-register'

// 桌面模式（Electron）不需要 Service Worker：本地 loadFile + hash router，
// 注册 SW 反而可能造成缓存与刷新混乱。运行时二次守卫，确保桌面不注册。
const isDesktop = import.meta.env.MODE === 'desktop'

if (!isDesktop && 'serviceWorker' in navigator) {
  const updateSW = registerSW({
    onNeedRefresh() {
      window.dispatchEvent(new CustomEvent('pwa:need-refresh'))
    },
    onOfflineReady() {
      window.dispatchEvent(new CustomEvent('pwa:offline-ready'))
    },
  })

  // 暴露给应用层手动触发刷新（用户点击"立即更新"按钮时调用）
  if (!window.__pwaApplyUpdate) {
    window.__pwaApplyUpdate = () => updateSW()
  }
}

declare global {
  interface Window {
    __pwaApplyUpdate?: () => Promise<void>
  }
}

export {}
