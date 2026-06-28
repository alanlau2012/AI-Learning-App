# Browser Regression Report — 2026-06-28

## 结论

Web 生产预览回归 PASS。三类视口共 66 项断言，失败 0 项；核心学习闭环、搜索跳转、三个场景演练、Profile 清空记录确认、深链刷新均可用。

## 环境

- 分支：`codex/ai-leader-phase2-profile-enhancements`
- 基线：`e3767b8 docs(agents): add specialist agent prompts`
- 预览服务：`vite preview`，`http://127.0.0.1:4173/`
- 浏览器：Playwright Chromium 1.61.1
- 视口：
  - Desktop：1440x900
  - Narrow desktop：1024x768
  - Mobile：390x844

## 覆盖范围

- 路由：`/`、`/modules`、`/modules/m2`、`/concepts/token`、`/search`、`/profile`、`/glossary`
- 场景：`/scenarios/model-router`、`/scenarios/token-cost-spike`、`/scenarios/rag-answer-quality`
- 交互：
  - 完成/取消完成
  - 收藏/取消收藏
  - LocalStorage 持久化
  - 诊断题提交
  - 搜索 `RAG` 并进入结果页
  - 三个场景选择策略并提交复盘
  - Profile 清空学习记录，确认框接受后写回默认进度
  - 深链刷新 `/concepts/token`、`/scenarios/model-router`

## 证据

- 结果 JSON：`output/qa/browser-regression-20260628/browser-regression-results.json`
- 截图目录：`output/qa/browser-regression-20260628/`
- 本轮结果：`total=66`，`failed=0`

说明：`output/qa/browser-regression-*` 是本地验证产物，已加入 `.gitignore`，不随源码提交。

## 残余风险

- 本轮覆盖核心路径与三个已上线场景，不等同于 56 讲全量逐页视觉验收。
- Console error/warning 由脚本采集；若后续接入线上监控，仍需发布后 canary 二次确认。
