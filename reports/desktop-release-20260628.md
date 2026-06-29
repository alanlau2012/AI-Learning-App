# Desktop Release Report — 2026-06-28

## 结论

桌面包已在当前 HEAD 重新构建并通过 smoke，可作为 **内部/试用分发**。由于未配置正式图标、代码签名、自动更新，不能宣称正式桌面发行完备。

## 环境

- 分支：`codex/ai-leader-phase2-profile-enhancements`
- 基线：`e3767b8 docs(agents): add specialist agent prompts`
- 平台：Windows x64
- Electron：42.4.1
- electron-builder：26.15.3

## 命令结果

1. `cmd /c npm run build:desktop`：PASS
2. `cmd /c npm run smoke:desktop`：PASS

说明：第一次打包在 NSIS uninstaller 签名子流程出现 `spawn UNKNOWN`。本轮将 `scripts/build-desktop.cjs` 固定设置 `CSC_IDENTITY_AUTO_DISCOVERY=false`，避免内部试用包误依赖本机证书发现；随后重新打包通过。

## 产物

`release/` 已重建，产物时间为 2026-06-28：

- `release/AI 工程学习 Setup 0.0.0.exe`
- `release/AI 工程学习 0.0.0.exe`
- `release/win-unpacked/`
- `release/latest.yml`
- `release/AI 工程学习 Setup 0.0.0.exe.blockmap`

`release/` 已在 `.gitignore` 中，不随源码提交。

## 限制

- 默认 Electron icon 仍在使用。
- 未配置正式代码签名。
- 未配置自动更新与分发通道。
- 本轮 smoke 验证桌面生产壳可启动，不等同于安装器全流程人工验收。
