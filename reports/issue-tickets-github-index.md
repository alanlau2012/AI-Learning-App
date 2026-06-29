# GitHub Issues #8–#66 映射索引（2026-06-28）

> 审计批次 open issues 与本地 ID、子报告章节、截图需求、复现路由对照  
> 正文 v2 草稿：`reports/github-issues/`  
> 模板：`docs/issue-handover-template.md`

**审计基线 commit**：`9a11d6941c1886bb095b26f836e7ec2754999e81`  
**Issues 列表**：https://github.com/alanlau2012/AI-Learning-App/issues

---

## 映射表

| GitHub | 本地 ID | 优先级 | 角度 | 来源报告 | 需截图 | 复现路由 / 要点 |
|---|---|---|---|---|---|---|
| #8 | AUDIT-TRACKER-R1 | — | 聚合 | issue-tickets-20260628.md | 否 | 文档跟踪 |
| #9 | ARCH-P1-01 | P1 | 架构 | architecture §4.5 | 是 | `/scenarios`、`/scenarios/rag-answer-quality` Header 面包屑 |
| #10 | UI-P1-01 | P1 | UI 视觉 | uiux-visual §3 | 是 | 任意诊断题提交错误 → ExplanationPanel 告警底 |
| #11 | UI-P1-02 | P1 | UI 视觉 | uiux-visual §3 | 否 | Grep `animation/*.module.css` 硬编码色 |
| #12 | UI-P1-03 | P1 | UI 视觉 | uiux-visual §3 | 是 | `/profile` 复盘区 danger 文本色 |
| #13 | UI-P1-04 | P1 | UI 视觉 | uiux-visual §3 | 是 | `/scenarios/rag-answer-quality` metricCard |
| #14 | CONTENT-P1-SYS | P1 | 内容·诊断题 | content-diag §3 | 是 | `/concepts/value-review-agent` 最长选项 |
| #15 | CONTENT-P1-01 | P1 | 内容·诊断题 | content-diag §3 | 是 | `/concepts/cost-routing` |
| #16 | CONTENT-P1-02 | P1 | 内容·诊断题 | content-diag §3 | 是 | `/concepts/maas` |
| #17 | CONTENT-P1-03 | P1 | 内容·诊断题 | content-diag §3 | 是 | `/concepts/sla` |
| #18 | CONTENT-P1-04 | P1 | 内容·诊断题 | content-diag §3 | 是 | `/concepts/permission-governance` |
| #19 | CONTENT-P1-05 | P1 | 内容·诊断题 | content-diag §3 | 是 | `/concepts/ttft` 多选 |
| #20 | CONTENT-P1-06 | P1 | 内容·诊断题 | content-diag §4 | 否 | `scenarioExercises.ts` retry-cache-storm 字段 |
| #21 | ARCH-P2-01 | P2 | 架构 | architecture §4.4 | 是 | 同 #13 ScenarioPage metricCard |
| #22 | ARCH-P2-02 | P2 | 架构 | architecture §4.4 | 是 | 同 #12 ProfilePage |
| #23 | ARCH-P2-03 | P2 | 架构 | architecture §4.5 | 否 | Sidebar vs BottomNav label/顺序 |
| #24 | ARCH-P2-04 | P2 | 架构 | architecture §4.6 | 否 | conceptById 四处重复 Map |
| #25 | UI-P2-01 | P2 | UI 视觉 | uiux-visual §4 | 是 | `/` HomePage primaryBtn hover |
| #26 | UI-P2-02 | P2 | UI 视觉 | uiux-visual §4 | 是 | `/scenarios` stats 数字字体 |
| #27 | UI-P2-03 | P2 | UI 视觉 | uiux-visual §4 | 否 | tokens.css spacing scale |
| #28 | UI-P2-04 | P2 | UI 视觉 | uiux-visual §4 | 否 | OptionCard/ExplanationPanel 边框 rgba |
| #29 | UI-P2-05 | P2 | UI 视觉 | uiux-visual §4 | 是 | ScenarioPage optionActive shadow |
| #30 | CONTENT-P2-01 | P2 | 内容·诊断题 | content-diag §3 | 是 | `/concepts/token-roi` |
| #31 | CONTENT-P2-02 | P2 | 内容·诊断题 | content-diag §3 | 是 | `/concepts/ai-native-org` |
| #32 | CONTENT-P2-03 | P2 | 内容·诊断题 | content-diag §3 | 是 | `/concepts/ttft` 多选 UI 标注 |
| #33 | CONTENT-P2-04 | P2 | 内容·诊断题 | content-diag §4 | 否 | trace-not-diagnostic hash 口径 |
| #34 | ARCH-P3-01 | P3 | 架构 | architecture §4.1 | 否 | progress.ts / progressCore 分工 |
| #35 | ARCH-P3-02 | P3 | 架构 | architecture §4.3 | 否 | completeScenario 语义 |
| #36 | ARCH-P3-03 | P3 | 架构 | architecture §4.3 | 否 | HomePage 手工拼 progress |
| #37 | ARCH-P3-04 | P3 | 架构 | architecture §4.6 | 否 | import `.ts` 扩展名 |
| #38 | ARCH-P3-05 | P3 | 架构 | architecture §4.6 | 否 | scenarioSimulation.ts 883 行 |
| #39 | UI-P3-01 | P3 | UI 视觉 | uiux-visual §5 | 否 | ScenariosPage filters !important |
| #40 | UI-P3-02 | P3 | UI 视觉 | uiux-visual §5 | 否 | selection 背景硬编码 |
| #41 | CONTENT-P3-01 | P3 | 内容·诊断题 | content-diag §3 | 是 | `/concepts/sampling` |
| #42 | CONTENT-P3-02 | P3 | 内容·诊断题 | content-diag §3 | 否 | demoConcepts JSON 缩进 |
| #43 | AUDIT-TRACKER-R1B | — | 聚合 | — | 否 | 补审跟踪（历史，可 closed） |
| #44 | MO-01 | P0 | UI 交互 | uiux-interaction §3 | 是 | 390×844 任意页 BottomNav 布局 |
| #45 | ES-01 | P1 | UI 交互 | uiux-interaction §3 | 是 | `/scenarios` 筛选至零结果 |
| #46 | A11Y-01 | P1 | UI 交互 | uiux-interaction §3 | 是 | Tab 焦点环（1440×900） |
| #47 | A11Y-02 | P1 | UI 交互 | uiux-interaction §3 | 是 | 诊断题提交后 ExplanationPanel |
| #48 | IF-03 | P2 | UI 交互 | uiux-interaction §3 | 否 | `/search` Esc 行为 |
| #49 | A11Y-05 | P2 | UI 交互 | uiux-interaction §3 | 否 | ScenariosPage aria-pressed |
| #50 | A11Y-06 | P2 | UI 交互 | uiux-interaction §3 | 否 | ScenarioPage 策略按钮 |
| #51 | IF-06 | P2 | UI 交互 | uiux-interaction §3 | 否 | ScenarioPage 恢复基线 |
| #52 | MO-02 | P2 | UI 交互 | uiux-interaction §3 | 是 | content padding-bottom vs BottomNav |
| #53 | UX-P3-BATCH | P3 | UI 交互 | uiux-interaction §3 | 否 | 批次 checklist |
| #54 | GUIDE-P1-01 | P1 | 内容·决策手册 | content-guides §3 | 是 | `/concepts/multi-agent` 决策手册区 |
| #55 | GUIDE-P1-02 | P1 | 内容·决策手册 | content-guides §3 | 否 | decisionGuides.ts agent-loop summary |
| #56 | GUIDE-P2-BATCH | P2 | 内容·决策手册 | content-guides §3 | 否 | 批次 checklist |
| #57 | SCEN-P1-01 | P1 | 内容·场景 | content-scenarios §3 | 是 | `/scenarios/rag-answer-quality` metrics |
| #58 | SCEN-P1-02 | P1 | 内容·场景 | content-scenarios §3 | 否 | 同 #20 token-cost-spike |
| #59 | SCEN-P2-BATCH | P2 | 内容·场景 | content-scenarios §3 | 否 | 批次 checklist |
| #60 | SCEN-P3-BATCH | P3 | 内容·场景 | content-scenarios §3 | 否 | 批次 checklist |
| #61 | LESSON-P1-01 | P1 | 内容·56讲 | content-lessons §3 | 是 | `/concepts/agents-md` 定义截断 |
| #62 | LESSON-P1-02 | P1 | 内容·56讲 | content-lessons §3 | 是 | `/concepts/positional-encoding` pitfalls |
| #63 | LESSON-P1-03 | P1 | 内容·56讲 | content-lessons §3 | 是 | `/glossary` embedding/rag/model-routing |
| #64 | LESSON-P2-BATCH | P2 | 内容·56讲 | content-lessons §3 | 否 | 批次 checklist |
| #65 | LESSON-P3-BATCH | P3 | 内容·56讲 | content-lessons §3 | 否 | 批次 checklist |
| #66 | AUDIT-TRACKER-R2 | — | 聚合 | issue-tickets-20260628.md | 否 | 七角度完成跟踪 |

---

## 截图文件命名对照（优先 P0/P1）

| GitHub | 截图文件名 |
|---|---|
| #9 | issue-009-scenarios-breadcrumb.png |
| #10 | issue-010-warning-soft-missing.png |
| #12 | issue-012-profile-danger-color.png |
| #13 | issue-013-scenario-metrical-hardcode.png |
| #14 | issue-014-value-review-agent-options.png |
| #44 | issue-044-mobile-bottomnav-layout.png |
| #45 | issue-045-scenarios-filter-empty.png |
| #46 | issue-046-focus-visible-missing.png |
| #47 | issue-047-diagnostic-no-aria-live.png |
| #54 | issue-054-multi-agent-guide-repo-terms.png |
| #57 | issue-057-rag-metrics-mismatch.png |
| #61 | issue-061-agents-md-definition-truncated.png |

---

## 关联 issue 速查

| 根因 | GitHub |
|---|---|
| Header 面包屑 | #9（ES-02 同源） |
| 告警 soft token | #10, #12, #13, #21, #22 |
| token-cost-spike prefix | #20, #58 |
| 场景筛选空态 | #45（SC-01 同源） |
| multi-agent 语境 | #54 |
