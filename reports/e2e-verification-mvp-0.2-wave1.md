# E2E Verification - MVP 0.2 Wave 1

## 结论
PASS。使用本地 Vite 服务 `http://127.0.0.1:5173/` 和 Playwright CLI 完成浏览器抽查。

## 覆盖范围
- 首页：推荐路径仍从已发布内容开始，未暴露 stub。
- 模块 1：Wave 1 的 7 讲均显示为正式卡片；`reasoning-limit` 仍显示“即将上线”。
- 7 个详情页：均包含一句话定义、企业案例、诊断题、核心结论、关联知识点，且不是 stub 页。
- 搜索：搜索“幻觉”可命中内容。
- `autoregressive` 动画区：显示 `逐 Token 生成与输出成本`，存在播放控件。
- 纯文本页：`semantic-space` 未出现 token-flow 标题或播放器控件。
- 诊断题：`autoregressive` 正确选项可提交并显示解析/排查路径。
- 完成状态：点击完成学习后，LocalStorage `ai-learning-app-progress-v1` 写入 `autoregressive`。
- 收藏：收藏按钮可交互。
- 我的学习：Profile 页面可打开并读取学习状态。
- 已封板内容回归：模块页仍显示原 12 讲中的 Token、注意力机制等正式内容。

## 命令与环境
- Dev server：`npm run dev -- --host 127.0.0.1 --port 5173`
- Browser automation：`npx --yes --package @playwright/cli playwright-cli`
- 验证后已关闭 Playwright 会话并停止本轮启动的 Vite 进程。

## 观察到的非阻塞事项
- Playwright CLI 会生成临时 `.playwright-cli/` 和 `.playwright-mcp/` 目录，已清理。
- 仓库中存在若干本轮之前未跟踪的截图/报告文件，本验证未修改它们。

