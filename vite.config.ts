import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isDesktop = mode === 'desktop'

  return {
    base: isDesktop ? './' : '/',
    plugins: [
      react(),
      // PWA 全模式启用（保持虚拟模块在桌面模式也存在，避免构建报错）；
      // 桌面模式通过 disable: true 关闭 SW 生成与注册脚本注入，
      // 运行时 pwa-register.ts 还会按 MODE 二次守卫。
      VitePWA({
        registerType: 'prompt',
        strategies: 'generateSW',
        injectRegister: false,
        disable: isDesktop,
        includeAssets: ['favicon.svg'],
        manifest: {
          name: 'AI 应用工程学习 APP',
          short_name: 'AI 工程学习',
          description:
            '交互式 AI 应用工程学习系统：从模型原理到 Agent 工厂，训练机制理解、方案判断与问题诊断。',
          start_url: '/',
          scope: '/',
          display: 'standalone',
          background_color: '#faf9f6',
          theme_color: '#faf9f6',
          lang: 'zh-CN',
          categories: ['education', 'productivity'],
          icons: [
            {
              src: '/favicon.svg',
              sizes: 'any',
              type: 'image/svg+xml',
              purpose: 'any maskable',
            },
          ],
        },
        workbox: {
          // 预缓存整个 app shell + 所有静态资源（含打包后的 56 讲数据）
          globPatterns: ['**/*.{js,css,html,svg,woff2,woff}'],
          // 单文件最大 4MB，覆盖 IBM Plex 字体与打包后的内容数据
          maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
          navigateFallback: 'index.html',
          navigateFallbackDenylist: [/^\/__test__/],
          runtimeCaching: [
            {
              // 字体文件走 cache-first，长期缓存
              urlPattern: ({ url }) =>
                url.pathname.endsWith('.woff2') || url.pathname.endsWith('.woff'),
              handler: 'CacheFirst',
              options: {
                cacheName: 'fonts-cache',
                expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              },
            },
          ],
        },
        devOptions: {
          enabled: false,
        },
      }),
    ],
  }
})
