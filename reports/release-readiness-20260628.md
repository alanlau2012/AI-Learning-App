# Release Readiness Report — 2026-06-28

## 发布结论

**Web 可进入生产发布候选；桌面版可作为内部/试用分发包。**

本轮 P0 为 0，P1 为 0。发布范围为：56/56 讲 v2 内容基线、17 条 `decisionGuide`、场景演练 R0+R1、6 个内容 P1 修复、发布卫生、安全最小加固、性能首包拆分、Web/桌面验证证据。

## 本轮范围

- 保持 56/56 讲上线，剩余 stub 为 0。
- 保持模块计数：M1 `10/10`，M2 `10/10`，M3 `8/8`，M4 `16/16`，M5 `6/6`，M6 `6/6`。
- `decisionGuide` 从 Phase 1 的 12 条扩展到 17 条。
- 场景演练 R0+R1 已上线：
  - `model-router`
  - `token-cost-spike`
  - `rag-answer-quality`
- 内容专业审核 6 个 P1 已关闭，见 `reports/content-p1-repair-review-20260628.md`。
- 发布专项 Agent 提示词已补充，见提交 `e3767b8`。

## 验证证据

| 门禁 | 结果 |
|---|---|
| `cmd /c npm run validate:content` | PASS |
| `cmd /c npm run typecheck` | PASS |
| `cmd /c npm run lint` | PASS |
| `cmd /c npm run build` | PASS |
| `cmd /c npm audit --omit=dev` | PASS，0 vulnerabilities |
| `cmd /c npm audit` | PASS，0 vulnerabilities |
| Browser regression | PASS，66/66 |
| `cmd /c npm run build:desktop` | PASS |
| `cmd /c npm run smoke:desktop` | PASS |

## 专项报告

- Web 浏览器回归：`reports/browser-regression-20260628.md`
- 安全隐私就绪：`reports/security-readiness-20260628.md`
- 性能预算：`reports/performance-budget-20260628.md`
- 桌面内部发行：`reports/desktop-release-20260628.md`
- 场景库 R0+R1：`reports/scenario-library-r1-summary.md`
- 内容 P1 修复：`reports/content-p1-repair-review-20260628.md`

## 发布卫生

- 已从 Git 移除被跟踪的 `output/electron-user-data/*` 与 Electron `.err` 运行日志。
- `.gitignore` 已补充：
  - `*.err`
  - `output/electron-user-data/`
  - `output/qa/browser-regression-*/`
  - `output/**/*.log`
  - `output/**/*.err`
  - `output/**/*.tmp`
- `dist/`、`release/` 继续作为生成物忽略，不进入源码提交。

## Git 基线

发布前复核：

```text
e3767b8 (HEAD -> codex/ai-leader-phase2-profile-enhancements) docs(agents): add specialist agent prompts
2226391 fix(content): close expert audit p1 findings
b12b8d6 feat(scenarios): enhance scenario exercises and validation logic
61d0c3f (origin/codex/ai-leader-phase2-profile-enhancements, main) feat(ai-leader): complete phase 2 and profile enhancements
e47da90 docs(profile): plan phase 1 capability overview
```

## 发布口径

- Web：可发布。
- 桌面：仅内部/试用分发。未配置正式 icon、代码签名、自动更新前，不对外宣称正式桌面发行完备。

## 下一轮建议

- 场景演练 R2/R3。
- `/scenarios` 目录页、Profile 场景推荐、`reviewScenarioIds`。
- 完整 PWA Service Worker / 离线缓存。
- 桌面正式图标、代码签名、自动更新。
- 内容 P2/P3 与更大范围逐讲视觉回归。
