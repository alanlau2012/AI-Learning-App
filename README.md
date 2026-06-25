# AI 应用工程学习 APP

面向企业 AI 应用负责人的交互式学习 Web / 桌面学习应用（56 讲）。纯前端、内容数据驱动；桌面版通过 Electron 复用同一套 React UI。

## 当前状态

当前封板：**Final Wave 全量上线 + backlog polish + Electron 桌面版 MVP + GitHub P1 内容修复回合 + AI 工程负责人增强 Phase 1 MVP**（正文改版 v2 之上）。

- 56 讲信息架构已登记。
- **56 / 56 讲**全部正式入库；全部已发布讲均为 `contentRevision: v2`（机制分组、术语对齐、字段深度标准）。
- AI 工程负责人增强 Phase 1 已完成：12 条 `decisionGuide`、56 讲能力域映射、4 条角色路径；ConceptPage 展示工程决策章节，Profile 展示能力域/角色路径/下一步行动，Search 支持能力域过滤与决策手册命中。
- 模块全部满额：M1 `10/10`、M2 `10/10`、M3 `8/8`、M4 `16/16`、M5 `6/6`、M6 `6/6`。地图无 stub。
- Phase 1 QA 报告：`reports/phase1-qa-report.md`；Final Wave 报告：`reports/final-wave-summary.md`；backlog polish 报告：`reports/backlog-polish-summary.md`；GitHub P1 内容修复报告：`reports/github-p1-content-repair-summary.md`；改版报告：`reports/content-revision-platform-summary.md` 等。
- 已补齐基础 PWA manifest，移除 Google Fonts 外链，并为 `trace` / `observability` / `token-roi` 补治理动画；已修复 `trace` / `tool-calling` 敏感数据最小化边界、`observability` 去 trace-centric 表述，以及 `session-affinity` cache locality 口径。
- 已新增 Electron Windows 桌面发行通道：开发运行、生产 smoke、NSIS 安装包与 portable 打包，见 `reports/desktop-electron-mvp-summary.md`。
- 下一轮（可选）：Phase 2 `model-router` 独立场景演练、Phase 1B 剩余 5 条 `decisionGuide`、Glossary 能力域增强、完整 PWA 离线能力等，均需 Owner 确认。

## 启动

```bash
npm install        # 安装依赖
npm run dev        # 本地开发
```

开发服务器启动后，按终端输出访问本地地址（通常为 `http://localhost:5173/`；端口占用时 Vite 会自动顺延）。

## 构建

```bash
npm run build      # Web 生产构建
```

构建产物输出到 `dist/`。
## 桌面版（Electron）

```bash
npm run dev:desktop    # 启动 Vite + Electron 开发壳
npm run build:desktop  # 构建 desktop dist，并输出 Windows 安装包 / portable 到 release/
npm run smoke:desktop  # 构建 desktop dist 并启动 Electron 生产 smoke，加载成功后自动退出
```

桌面版复用 Web UI 与 `src/data/*` 内容，不改变内容 schema。生产桌面包使用 hash 路由与相对静态资源路径，避免 `file://` 下刷新或 iframe 素材加载失败。学习进度仍使用本地 `localStorage`，桌面版与浏览器 Web 版天然独立。

## 验证

阶段封板前至少运行：

```bash
npm run validate:content    # structure + published-content + animation + terminology
npm run validate:terminology # v2 正文：术语 / 深度 / 轻量标记（§7）
npm run typecheck           # TypeScript 类型检查
npm run lint                # ESLint
npm run build               # Web 生产构建
npm run build:desktop       # Electron Windows 打包
npm run smoke:desktop       # Electron 生产 smoke
```

内容 Wave 封板还需要补充对应 E2E / 浏览器抽查报告，并同步刷新 `AGENTS.md`、`docs/project-board.md`、`docs/expansion-plan-44-lessons.md` 和本 README 的当前状态。

## 文档

- 产品 / 架构 / 内容 schema / 动画 / 验收 / 看板：见 `docs/`
- 开发约束、当前状态快照与文件所有权：见 `AGENTS.md`
- 视觉规范：见 `design.md`
