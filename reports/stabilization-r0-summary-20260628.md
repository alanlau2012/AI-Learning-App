# Stabilization R0 Summary（2026-06-28）

> 目标：基于 GitHub issue baseline，优先清理 P0/P1 阻断项，不扩展新功能。  
> 当前分支：`codex/ai-leader-phase2-profile-enhancements`

## 1. 结论先行

- **Stabilization R0 第一批修复已完成并通过本地验证**。
- 唯一 P0 `#44` 已修复并通过移动端浏览器回归。
- P1 中低风险代码项与内容项已完成：`#9 #10 #12 #13 #14 #15 #16 #17 #18 #19 #20 #45 #46 #47 #54 #55 #57 #58 #61 #62`。
- 历史已修但 GitHub 仍 open 的 `#3 #4` 已补验证评论并关闭。
- `#11` 动画画布 token 化体量大，建议作为 Stabilization R1 polish，不作为本批阻断项。
- `#63` Glossary IA 需要 Owner 口径，暂不强改。

## 2. 已修复范围

### UX / A11Y / Layout

| Issue | 状态 | 修复 |
|---|---|---|
| #44 | 已修待提交后关闭 | BottomNav 移入 main 列并固定全宽；移动端 content 预留底部空间 |
| #45 | 已修待提交后关闭 | ScenariosPage 增加零结果空态与清除筛选 |
| #46 | 已修待提交后关闭 | 全局 `:focus-visible` 焦点环 |
| #47 | 已修待提交后关闭 | ExplanationPanel 增加 `role="status"` 与 `aria-live="polite"` |
| #49/#50 | 已修 | ScenariosPage 筛选按钮、ScenarioPage 策略按钮增加 `aria-pressed` |
| #51 | 已修 | ScenarioPage 恢复基线增加 confirm |
| #52 | 已修 | 移动端主内容底部 padding >= BottomNav 高度 |

### 架构 / 导航 / UI Token

| Issue | 状态 | 修复 |
|---|---|---|
| #9 | 已修待提交后关闭 | Header 面包屑覆盖 `/scenarios` 与 `/scenarios/:id` |
| #10/#12/#13 | 已修待提交后关闭 | 增加 `warning-soft/border/text` 与 `progress-border` token，替换硬编码 |
| #23 | 已修 | Sidebar / BottomNav 共享 `primaryNavItems` |
| #26 | 已修 | 场景统计数字改用 mono |
| #39 | 已修 | ScenariosPage filter 去掉 `!important` |

### 内容 P1

| Issue | 状态 | 修复 |
|---|---|---|
| #14 | 已修待提交后关闭 | 12 道最长项泄漏题完成选项调整；脚本复核 `leaks=0` |
| #15 | 已修待提交后关闭 | cost-routing 干扰项升级为可信但优先级错误方案 |
| #16 | 已修待提交后关闭 | maas 干扰项升级，突出控制面收敛 |
| #17 | 已修待提交后关闭 | SLA 正确项缩短，干扰项增强 |
| #18 | 已修待提交后关闭 | permission-governance 强化运行时权限边界优先 |
| #19 | 已修待提交后关闭 | TTFT 题干加入 GPU 利用率干扰，并显式标注多选 |
| #20/#58 | 已修待提交后关闭 | 权限/租户/版本归入 cache key 命名空间，prefix 只承载稳定提示和任务模板 |
| #54 | 已修待提交后关闭 | multi-agent 决策手册改为企业 orchestrator/worker 语境 |
| #55 | 已修待提交后关闭 | agent-loop 顺序改为观察-计划-行动-校验 |
| #57 | 已修待提交后关闭 | rag-answer-quality baseline 与失败样本统一为事故快照 |
| #61 | 已修待提交后关闭 | agents-md definition 缩短，规避截断残句 |
| #62 | 已修待提交后关闭 | positional-encoding 增加独立第 4 条 pitfall |

## 3. 子 Agent 产物

- 内容生产草稿：`content/drafts/stabilization-r0-content-p1-fixes.md`
- 内容审核报告：`content/reviewed/stabilization-r0-content-p1-fixes-reviewed.md`
- UX 实现清单：`reports/stabilization-r0-ux-implementation-checklist-20260628.md`

审核结论：内容审核为 `REVISE 后可入库`；主控已补齐 #14 的完整选项修复，并用脚本确认 12 题 `leaks=0`。

## 4. 验证

命令：

```bash
cmd /c npm run validate:content
cmd /c npm run typecheck
cmd /c npm run lint
cmd /c npm run build
```

结果：全部 PASS。

构建观察：

- 主入口：`index-BLgBZOK9.js` 303.10 kB / gzip 97.05 kB。
- 场景数据仍为独立 chunk：`scenarioExercises-Cnmf2GCd.js` 73.34 kB / gzip 20.40 kB。
- 未出现 Vite 500KB warning。

浏览器回归：

- 见 `reports/stabilization-r0-browser-regression-20260628.md`。

## 5. GitHub 状态

- `#3 #4`：已评论验证并关闭。
- 其余本批已修 issue：建议在本提交落地后批量评论关闭。
- 当前仍建议保留：
  - `#11`：动画画布 token 化，进入 Stabilization R1 polish。
  - `#63`：Glossary IA，需要 Owner 选择“术语索引项 / 别名映射 / 新增同名讲”口径。

## 6. 下一步

1. 提交本批修复。
2. 推送分支并在 PR 中引用本报告。
3. 对已修 issue 批量评论关闭。
4. 单开 R1 polish 处理 #11 和 P2/P3。
