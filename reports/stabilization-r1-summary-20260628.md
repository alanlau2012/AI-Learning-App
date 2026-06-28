# Stabilization R1 Summary（2026-06-28）

> 目标：在 R0 之后清理剩余 P1，并顺手关闭低风险 P2 架构/UX token 债，不扩展新功能。
> 当前分支：`codex/ai-leader-phase2-profile-enhancements`

## 1. 结论先行

- **R1 已完成 P1 清零并关闭 issue**：`#11` 动画画布 token 化、`#63` Glossary IA 口径均已修复。
- 低风险 P2/P3 已一并处理并关闭：`#21 #22 #24 #25 #28 #34 #35 #48`。
- GitHub open issue 从 R0 后的 30 降至 20。
- `#37` 曾尝试机械移除 `.ts` import，但会破坏 `validate:content` 的 Node ESM 数据导入，因此暂缓，不作为发布阻断。
- `#36 #38 #53` 等保留为后续 polish / 重构，不进入 R1。

## 2. 已修复范围

| Issue | 状态 | 修复 |
|---|---|---|
| #11 | 已关闭 | 在 `tokens.css` 增加 `--anim-canvas-*` 系列 token，动画 CSS 改为消费 token；不改视觉布局 |
| #63 | 已关闭 | Glossary 对无同名知识点术语展示“术语索引项”，并把 `relatedConceptIds[0]` 显示为“主关联讲” |
| #21/#22 | 已关闭 | Scenario/Profile 状态色已走 token，本轮回归确认无新增硬编码 |
| #24 | 已关闭 | `src/data/concepts.ts` 导出 `conceptById`，页面和 Profile 派生逻辑复用 |
| #25 | 已关闭 | HomePage 主按钮 hover 改用 `--color-primary-hover` |
| #28 | 已关闭 | DecisionGuideSection 正/反场景边框改用 progress/warning token |
| #34 | 已关闭 | `progressCore.ts` 注释明确轻量持久化边界，Profile 派生留在 `progress.ts` |
| #35 | 已关闭 | `completeScenario` 注释明确“提交诊断即完成并加入复盘”的产品契约 |
| #48 | 已关闭 | SearchPage `Esc` 关闭搜索：有站内历史则返回，直接打开则回首页 |

## 3. 子 Agent 结论

- 内容/IA Agent：#63 不新增同名讲，不改 56 讲 IA；采用“术语索引项 + 主关联讲”最小实现。
- UX/A11Y Agent：R1 无真正发布阻断；建议只做 #48 与 #11 的无视觉变化收口。
- 架构 Agent：#21/#22 验证关闭；#24/#34/#35 低风险修；#36/#38 暂缓。

## 4. 验证

命令：

```bash
cmd /c npm run validate:content
cmd /c npm run typecheck
cmd /c npm run lint
cmd /c npm run build
```

结果：全部 PASS。

补充 grep：

```bash
rg -n "#[0-9A-Fa-f]{3,8}|rgba?\(\s*\d" src/components/animation -g "*.css"
rg -n "new Map\(concepts|scenarioById|#1838b8|rgba\(" src/pages src/utils src/components/concept src/components/quiz
```

结果：无命中。

浏览器回归：见 `reports/stabilization-r1-browser-regression-20260628.md`。

## 5. 保留项

- `#37`：当前 `.ts` import 是内容校验脚本可运行的必要约束，后续若要修，需要先调整校验运行器或 ESM resolution 策略。
- `#36`：HomePage 进度订阅面暂无行为缺陷，暂缓。
- `#38`：`scenarioSimulation.ts` 拆分是结构性重构，不适合 Stabilization R1。
- `#53`：UX polish 聚合项继续保留。
