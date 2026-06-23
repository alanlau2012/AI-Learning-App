# AI 应用工程学习 APP

面向企业 AI 应用负责人的交互式学习 Web 应用（56 讲）。纯前端、内容数据驱动。

## 当前状态

当前封板：**正文改版 v2**（MVP 0.3 Wave 4B 之上）。

- 56 讲信息架构已登记。
- **44 / 56 讲**已正式入库；全部已发布讲均为 `contentRevision: v2`（机制分组、术语对齐、字段深度标准）。
- M1–M3 完整上线；M4 `15/16`；M5 `1/6`；M6 `0/6`。
- 改版报告：`reports/content-revision-platform-summary.md`、`reports/content-revision-m1-summary.md` … `m5-summary.md`。
- 下一轮：Final Wave（`multi-agent` + M5/M6 剩余 12 stub）。

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
