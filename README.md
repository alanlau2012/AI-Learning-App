# AI 应用工程学习 APP

面向企业 AI 应用负责人的交互式学习 Web 应用（56 讲）。纯前端、内容数据驱动。

## 当前状态

当前封板：**Final Wave 全量上线**（正文改版 v2 之上）。

- 56 讲信息架构已登记。
- **56 / 56 讲**全部正式入库；全部已发布讲均为 `contentRevision: v2`（机制分组、术语对齐、字段深度标准）。
- 模块全部满额：M1 `10/10`、M2 `10/10`、M3 `8/8`、M4 `16/16`、M5 `6/6`、M6 `6/6`。地图无 stub。
- Final Wave 报告：`reports/final-wave-summary.md`；改版报告：`reports/content-revision-platform-summary.md` 等。
- 下一轮（可选）：治理类新动画（`observability-trace` / `token-roi-flow`）、PWA、搜索/术语打磨等，均需 Owner 确认。

## 启动

```bash
npm install        # 安装依赖
npm run dev        # 本地开发
```

开发服务器启动后，按终端输出访问本地地址（通常为 `http://localhost:5173/`；端口占用时 Vite 会自动顺延）。

## 构建

```bash
npm run build      # 生产构建
```

构建产物输出到 `dist/`。

## 验证

阶段封板前至少运行：

```bash
npm run validate:content    # structure + published-content + animation + terminology
npm run validate:terminology # v2 正文：术语 / 深度 / 轻量标记（§7）
npm run typecheck           # TypeScript 类型检查
npm run lint                # ESLint
npm run build               # 生产构建
```

内容 Wave 封板还需要补充对应 E2E / 浏览器抽查报告，并同步刷新 `AGENTS.md`、`docs/project-board.md`、`docs/expansion-plan-44-lessons.md` 和本 README 的当前状态。

## 文档

- 产品 / 架构 / 内容 schema / 动画 / 验收 / 看板：见 `docs/`
- 开发约束、当前状态快照与文件所有权：见 `AGENTS.md`
- 视觉规范：见 `design.md`
