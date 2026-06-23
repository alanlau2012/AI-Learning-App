# AI 应用工程学习 APP

面向企业 AI 应用负责人的交互式学习 Web 应用（56 讲）。纯前端、内容数据驱动。

## 当前状态

当前封板：**MVP 0.3 Wave 4A**（当前工作区基于 `be4472e` 完成，Wave 4A 改动待提交）。

- 56 讲信息架构已登记。
- **38 / 56 讲**已正式入库并通过内容门禁；剩余 `stub`：18 讲。
- M1「模型怎么工作」：`10/10` 已上线。
- M2「模型怎么跑得又快又稳」：`10/10` 已上线。
- M3「模型怎么变成企业平台」：`8/8` 已上线。
- M4「模型怎么变成 Agent」：`9/16` 已上线，已补齐 Wave 4A 上下文工程与工具调用基础链路。
- M5「Agent 怎么改变软件工程」：`1/6` 已上线；M6「企业怎么治理 AI」：`0/6`。
- 首页、模块页、知识点详情页、动画、诊断题、搜索、术语索引、我的学习页可用于演示。
- Wave 4A 验证报告见 `reports/mvp-0.3-wave4a-summary.md` 与 `reports/e2e-verification-mvp-0.3-wave4a.md`。
- 下一轮建议：启动 MVP 0.3 Wave 4B，补 `agents-md` / `repo-context` / `spec-driven-development` / `subagent` / `memory` / `human-in-the-loop`。

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
npm run validate:content    # structure + published-content + animation
npm run typecheck           # TypeScript 类型检查
npm run lint                # ESLint
npm run build               # 生产构建
```

内容 Wave 封板还需要补充对应 E2E / 浏览器抽查报告，并同步刷新 `AGENTS.md`、`docs/project-board.md`、`docs/expansion-plan-44-lessons.md` 和本 README 的当前状态。

## 文档

- 产品 / 架构 / 内容 schema / 动画 / 验收 / 看板：见 `docs/`
- 开发约束、当前状态快照与文件所有权：见 `AGENTS.md`
- 视觉规范：见 `design.md`
