# Backlog Polish 封板报告

**封板日期**：2026-06-23 · 维护人：主开发 Agent

## 1. 范围

本轮收敛 Final Wave 后遗留的非阻塞 backlog：

- 移除 Google Fonts 外链，避免受限网络下 `ERR_NETWORK_ACCESS_DENIED`。
- 增加 `manifest.webmanifest`，提供静态 Web 的 basic installability；仍不引入 Service Worker / 离线缓存。
- 为路由页面启用 route-level lazy loading，并让布局层只依赖轻量知识点导航索引，消除 Vite 单 chunk 体积警告。
- 新增 M6 治理动画：`observability-trace` 覆盖 `trace` / `observability`，`token-roi-flow` 覆盖 `token-roi`。

## 2. 结果

| 项 | 结果 |
|---|---|
| 内容上线 | 56 / 56，剩余 stub 0 |
| 动画覆盖 | 10 组件 / 10 类型 / 21 知识点 |
| PWA | `public/manifest.webmanifest` 已提供；无 Service Worker |
| 字体 | 无远程字体请求；继续使用 CSS 字体栈 fallback |
| 构建体积 | 页面与正文数据拆分为独立 chunk；无 500 kB chunk warning |

## 3. 验证

| 门禁 | 结果 |
|---|---|
| `npm run validate:content` | PASS：published 56 / terminology 56 / 动画注册一致 |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm run build` | PASS，最大 JS chunk 约 300 kB；正文数据 chunk 约 282 kB |
| Playwright 浏览器烟测 | PASS：home、`/modules/m6`、`trace` 动画下一步、`observability` 动画、`token-roi` 动画下一步、manifest；console 相关错误/警告 0 |

## 4. 后续建议

- `model-router` 可按演示需要升级为更细的真实画布。
- 搜索 / 术语 / Profile 可继续做高级筛选、术语搜索与复习策略，但不阻塞当前封板。
- 完整 PWA（Service Worker、离线缓存、安装引导）仍属于二期范围。
