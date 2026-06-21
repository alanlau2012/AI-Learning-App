# E2E Verification - MVP 0.2 Wave 2

## 结论
PASS。使用本地 Vite 服务 `http://localhost:5173/` 和 Playwright CLI 完成浏览器抽查。

## 命令门禁
- `npm run validate:content`：PASS
- `npm run typecheck`：PASS
- `npm run lint`：PASS
- `npm run build`：PASS

备注：`npm run build` 出现 Vite chunk size warning（单 chunk 超 500 kB），不阻断构建。

## 数据状态复核
- M1：10/10 上线。
- M2：10/10 上线。
- 当前上线讲数：26/56。
- 剩余 stub：30。
- Wave 2 七讲均为 `contentStatus: "mvp"`。

## 浏览器抽查覆盖
- 首页：仍显示 56 讲权威结构；推荐路径未进入剩余 stub。
- 模块 M1：`reasoning-limit` 已从 stub 变为正式卡片，M1 无“即将上线”项。
- 模块 M2：`tpot`、`session-affinity`、`batch-scheduling`、`pd-separation`、`speculative-decoding`、`quantization` 均为正式卡片，M2 无“即将上线”项。
- 7 个详情页：均包含一句话定义、企业案例、诊断题、核心结论、关联知识点，且不出现 stub 页面文案。
- 搜索：搜索“投机解码”可命中正式内容，并出现“草稿模型”等正文命中。
- 诊断题：`tpot` 正确选项 A 可提交并显示解析。
- 完成状态：点击 `tpot` 完成后，LocalStorage `ai-learning-app-progress-v1` 写入 `completedConceptIds: ["tpot"]`。
- 收藏：点击 `tpot` 收藏后，LocalStorage 写入 `favoriteConceptIds: ["tpot"]`。
- 我的学习：Profile 页可读取并展示 `tpot` 学习状态。
- 主路径：`reasoning-limit` 下一讲为 `/concepts/prefill`；`quantization` 下一讲为 `/concepts/model-gateway`；均为已上线内容。

## 动画抽查
- `tpot`：渲染 `prefill-decode` 播放器，标题为“首 Token 后的 TPOT”，有播放/下一步/重置控制。
- `session-affinity`：渲染 `kv-cache` 播放器，标题为“Session 亲和命中与打散重算”，有播放/下一步/重置控制。
- 其他 5 讲：显示“当前知识点暂无动画配置”，无播放器控制按钮，未硬塞未注册动画。

## 控制台
Playwright console 抽查无 error / warning；仅有 React DevTools info。

## 观察事项
- 详情页对无动画讲仍保留“动画演示”章节，并显示“当前知识点暂无动画配置”。这符合当前页面实现，没有新增动画配置，也不会触发播放器。
- 本轮未关闭或重启已有 5173 Vite 服务，仅复用当前监听服务完成抽查。

