# MVP 0.1 阶段封版报告

## 1. 当前完成内容

MVP 0.1 已完成 12 讲端到端演示闭环，可作为当前阶段演示版本。

已完成范围：

- 纯前端 React + Vite + TypeScript 工程骨架。
- 56 讲信息架构登记，模块计数为 `10/10/8/16/6/6`。
- 12 讲 MVP 内容正式入库，`contentStatus` 均为 `mvp`。
- 首页、模块总览、模块详情、知识点详情、搜索、术语索引、我的学习页。
- 知识点详情页固定结构：定义、为什么重要、心智模型、机制、动画、企业案例、误区、诊断题、结论、关联、完成/收藏/下一个。
- 动画播放器、KV Cache 专用画布、通用机制动画画布。
- 单选 / 多选诊断题、解析面板、错题记录。
- LocalStorage 学习进度持久化：完成、收藏、错题、最近学习、连续学习天数、清空记录。
- 内容门禁：`validate:structure`、`validate:published-content`、`validate:animation`。
- 真实 Chromium E2E 回归报告：`reports/e2e-verification-12-lessons.md`。

## 2. 已接入的 12 讲

| 序号 | id | 标题 | 模块 | 动画 | 诊断题 |
|---|---|---|---|---|---|
| 1 | `token` | Token | M1 | `token-flow` | 单选 |
| 2 | `attention` | 注意力机制 | M1 | `attention-map` | 单选 |
| 3 | `prefill` | Prefill | M2 | `prefill-decode` | 单选 |
| 4 | `decode` | Decode | M2 | `prefill-decode` | 单选 |
| 5 | `ttft` | TTFT | M2 | `prefill-decode` | 多选 |
| 6 | `kv-cache` | KV Cache | M2 | `kv-cache` | 单选 |
| 7 | `model-gateway` | 模型网关 | M3 | `model-router` | 单选 |
| 8 | `multi-model-routing` | 多模型路由 | M3 | `model-router` | 单选 |
| 9 | `context-window` | 上下文窗口 | M4 | `context-window` | 单选 |
| 10 | `agent-loop` | Agent Loop | M4 | `agent-loop` | 单选 |
| 11 | `skill` | Skill | M4 | 无动画，友好降级 | 单选 |
| 12 | `issue-fix-agent` | Issue Fix Agent | M5 | `issue-fix-flow` | 单选 |

当前正式数据统计：

- `concepts.length = 56`
- `mvp = 12`
- `stub = 44`
- `diagnosticQuestion = 12`
- `animation = 11`

## 3. 已通过的验证项

本轮封版已重新验证：

- `git status --short`：无已修改应用代码；仅存在未跟踪的本地协作/计划文件。
- `npm run typecheck`：通过。
- `npm run validate:structure`：通过。
- `npm run build`：通过。

二次回归验证已确认：

- `npm run validate:content`：通过，并确认校验 `demo/mvp` 内容 12 个。
- `npm run lint`：通过。
- 12 讲页面均为正式内容，无正文 fallback。
- Token / KV Cache 动画实际点击通过。
- TTFT 多选诊断题实际提交通过。
- 收藏、完成、错题、Profile、刷新持久化、清空记录均通过。

## 4. 当前已知问题

### P1-01：Google Fonts 在受限网络下 console 报错

- 现象：受限网络环境中，浏览器 console 可能出现 `fonts.googleapis.com net::ERR_NETWORK_ACCESS_DENIED`。
- 影响：不阻塞 MVP 0.1 演示；字体会 fallback 到系统字体，但 console 不够干净。
- 建议：演示前可考虑本地化 IBM Plex 字体，或移除外部字体请求并接受系统字体 fallback。

### P2-01：44 讲仍为 stub

- 现象：除 12 讲 MVP 内容外，其余 44 讲仍为结构登记内容。
- 影响：不影响 MVP 0.1 的 12 讲演示；搜索可能命中 stub 条目并显示待入库提示。
- 建议：后续继续走 draft → review → 入库 → `validate:content` 流水线。

### P2-02：尚未配置自动化 test script

- 现象：`package.json` 当前没有 `npm run test`。
- 影响：不阻塞 MVP 0.1；当前以手动命令门禁和真实 Chromium E2E 报告作为封版依据。
- 建议：后续可补轻量 smoke / E2E 脚本固化当前演示路径。

## 5. 后续建议

- 优先处理 Google Fonts 本地化或字体 fallback 策略，保证无外网演示时 console 更干净。
- 为 MVP 0.1 准备固定演示 walkthrough，覆盖首页 → 模块 → 详情 → 动画 → 诊断题 → Profile。
- 在继续扩展 44 讲前，先把 12 讲样板规则沉淀为内容生产检查清单。
- 后续内容继续严格遵守 `content/drafts/` → 审核复核 → 主开发合入 `src/data/*` → `npm run validate:content`。
- 可在下一阶段补 `npm run test` 或独立 E2E smoke script，把本次真实浏览器验证路径自动化。

## 6. 不建议立即做的事情

- 不建议立即扩展剩余 44 讲，除非内容生产与审核流水线已准备好稳定执行。
- 不建议在封版后继续重构动画系统；当前动画已满足 MVP 0.1 演示和门禁。
- 不建议修改 `src/types/index.ts` 或 `docs/content-schema.md`，避免破坏已通过的内容数据。
- 不建议调整产品视觉风格；当前已通过暖纸色、蓝/绿强调、低信息噪音的视觉检查。
- 不建议引入后端、登录、真实 LLM API、Service Worker 或大型 UI 框架。
- 不建议为了清理小问题扩大代码重构范围；MVP 0.1 应保持封版稳定。
