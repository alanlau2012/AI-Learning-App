# Electron 桌面版 MVP Summary

日期：2026-06-23  
Owner：主开发 Agent

## 范围

- 新增 Windows 优先的 Electron 桌面发行通道，复用现有 React/Vite Web UI。
- 不改变 `src/types/index.ts`、`src/data/*` 内容 schema，不新增后端，不做 Web/桌面进度同步。
- 桌面版学习进度仍走 `localStorage`，Electron 生产包拥有独立 origin，因此与浏览器 Web 版互不自动同步。

## 实现

- 新增 `electron/main.cjs`：创建 `1280x820` 主窗口，关闭 `nodeIntegration`，启用 `contextIsolation` / `sandbox`，拒绝权限请求，外部链接交给系统浏览器。
- `vite.config.ts`：desktop mode 使用 `base: './'`，Web mode 保持 `/`。
- `src/app/router.tsx`：Web mode 使用 `createBrowserRouter`，desktop mode 使用 `createHashRouter`，避免 `file://` 下刷新/深链白屏。
- `src/data/hyperframes.ts`：Hyperframe iframe 路径改为基于 `import.meta.env.BASE_URL` 的 Node-safe 兜底写法，兼容内容校验、Web 和 Electron。
- `scripts/build-desktop.cjs`：Electron Builder 先输出到系统临时目录，再复制回 `release/`。这是为了规避 Windows 中文工作区下 Builder 直接 rename `release/win-unpacked.tmp` 的 `EPERM` 问题。
- `package.json`：新增 `dev:desktop`、`build:desktop`、`preview:desktop`、`smoke:desktop`，并配置 electron-builder 的 Windows NSIS + portable 目标。
- `scripts/smoke-desktop.cjs`：每次 smoke 创建独立 temp profile，并传给 Electron smoke 模式作为 `userData` / `sessionData`；Electron smoke 模式禁用 GPU 与磁盘缓存相关路径，wrapper 在 Electron 完全退出后清理 `%TEMP%\ai-learning-app-smoke-*`。

## 验证

- `cmd /c npm run typecheck`：PASS。
- `cmd /c npm run lint`：PASS。
- `cmd /c npm run validate:content`：PASS（56 登记 / 模块计数 10/10/8/16/6/6 / published 56 / terminology 56）。
- `cmd /c npm run build`：PASS。
- `cmd /c npm run build:desktop`：PASS，生成 `release/AI 工程学习 Setup 0.0.0.exe`、`release/AI 工程学习 0.0.0.exe`、`release/win-unpacked/`。
- `cmd /c "npm run smoke:desktop && npm run smoke:desktop"`：PASS，连续两次生成 desktop dist 并启动生产 Electron；输出无 GPU process / GPU cache / cache move 错误，`%TEMP%\ai-learning-app-smoke-*` 无残留。
- `dist/hyperframes/text-to-answer/index.html`：存在，桌面相对资源路径可解析到构建产物。

## 已知限制 / 下一步

- 未配置应用图标，electron-builder 使用默认 Electron icon。
- 未配置代码签名、自动更新、崩溃上报。
- 未做 Web/桌面进度迁移、导入导出或云同步。
- 后续如要正式分发，建议补图标、签名证书、版本号策略、安装器品牌文案和自动更新策略。
