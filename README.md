# AI 应用工程学习 APP

面向企业 AI 应用负责人的交互式学习 Web 应用（56 讲）。纯前端、内容数据驱动。

## 当前状态

当前封版：**MVP 0.1**。

- 56 讲信息架构已登记。
- 12 讲 MVP 内容已正式入库并通过端到端验证。
- 首页、模块页、知识点详情页、动画、诊断题、搜索、术语索引、我的学习页可用于演示。
- 端到端验证报告见 `reports/e2e-verification-12-lessons.md`。
- 阶段封版报告见 `reports/mvp-0.1-summary.md`。

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

阶段封版前至少运行：

```bash
npm run typecheck           # TypeScript 类型检查
npm run validate:structure  # 56 讲结构、模块计数、关联与诊断题结构校验
npm run build               # 生产构建
```

完整内容门禁建议运行：

```bash
npm run validate:content    # structure + published-content + animation
npm run lint                # ESLint
```

## 文档

- 产品 / 架构 / 内容 schema / 动画 / 验收 / 看板：见 `docs/`
- 开发约束与文件所有权：见 `AGENTS.md`
- 视觉规范：见 `design.md`
