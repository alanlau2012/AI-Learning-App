# AI-Learning-App 问题单聚合报告（20260628 · 七角度完整版）

> 聚合来源：架构 / UI 视觉 / UI 交互 / 内容（诊断题 / 决策手册 / 场景+能力域 / 56讲正文）七角度审计
> 工作目录：`d:\AI项目\AI-Learning-App`
> 基线 commit：`9a11d6941c1886bb095b26f836e7ec2754999e81`
> 本报告只读汇总，未修改任何业务代码

---

## 1. 结论先行

| 角度 | 结论 | P0 | P1 | P2 | P3 | 子报告 |
|---|---|---|---|---|---|---|
| **架构** | 有条件通过 | 0 | 1 | 4 | 3 | [architecture](./issue-tickets-architecture-20260628.md) |
| **UI 视觉** | 有条件通过 | 0 | 4 | 5 | 2 | [uiux-visual](./issue-tickets-uiux-visual-20260628.md) |
| **UI 交互/无障碍** | 移动端需修复后发布 | 1 | 5 | 9 | 6 | [uiux-interaction](./issue-tickets-uiux-interaction-20260628.md) |
| **内容·诊断题** | 有条件通过 | 0 | 18 | 4 | 2 | [content-diag](./issue-tickets-content-diag-20260628.md) |
| **内容·决策手册** | 有条件通过 | 0 | 2 | 5 | 4 | [content-guides](./issue-tickets-content-guides-20260628.md) |
| **内容·场景+能力域** | 有条件通过 | 0 | 2 | 7 | 4 | [content-scenarios](./issue-tickets-content-scenarios-20260628.md) |
| **内容·56讲+glossary** | 有条件通过 | 0 | 3 | 11 | 8 | [content-lessons](./issue-tickets-content-lessons-20260628.md) |
| **合计（去重前）** | **有条件通过** | **1** | **35** | **45** | **29** | 7 份 |

**跨角度 Top 5 风险**

1. **内容·诊断题结构泄漏（P1×18）**：~22% 单选题「最长即正确」+ 4 题荒谬干扰项
2. **UI 交互·移动端布局（P0×1）**：BottomNav 与 main 横排争宽，窄屏主导航可用性存疑
3. **UI 视觉·token 缺口（P1×4）**：缺 warning-soft / anim token，~230 处硬编码
4. **内容·multi-agent 决策手册（P1）**：混入 git/reviewed/src 仓库协作用语，与讲题严重错位
5. **内容·rag-answer-quality 场景（P1）**：叙事 11%/74% 与 baseline 9.5%/78% 不一致

**发布建议**

- **桌面 Web**：可发布；建议封板前修 ARCH-P1-01（面包屑）、告警 token 化、诊断题结构泄漏批次
- **移动端**：**修复 MO-01（BottomNav 布局）后复验**再对外承诺响应式
- **无障碍**：完成 A11Y-01/02 后再称 MVP 1.0 基础达标

---

## 2. P0 问题单（1 条）

| ID | 角度 | 位置 | 现象 | 最小修复 |
|---|---|---|---|---|
| MO-01 | UI 交互 | `AppShell.tsx` + `BottomNav.module.css` | `.shell` flex-row 下 BottomNav 非全宽底栏，与 main 争宽 | 改 fixed 全宽底栏 + content padding ≥56px |

---

## 3. P1 问题单（35 条，按角度）

### 3.1 架构（1）

| ID | 位置 | 现象 | 修复 |
|---|---|---|---|
| ARCH-P1-01 | `Header.tsx:16-33` | 面包屑未覆盖 `/scenarios` | 补 scenario 分支 → **GitHub #9** |

### 3.2 UI 视觉（4）

| ID | 现象 | 修复 | GitHub |
|---|---|---|---|
| UI-P1-01 | 缺 `--color-warning-soft`，4+ 处硬编码 | tokens.css 加 token | #10 |
| UI-P1-02 | 动画画布 ~230 处硬编码 | `--anim-canvas-*` 系列 | #11 |
| UI-P1-03 | ProfilePage `.danger` 棕色 `#9a520f` | 改回告警体系 | #12 |
| UI-P1-04 | ScenarioPage metricCard 硬编码 | 并入 warning token | #13 |

### 3.3 UI 交互（5）

| ID | 位置 | 现象 | 修复 |
|---|---|---|---|
| ES-01 / SC-01 | `ScenariosPage.tsx:78-108` | 筛选零结果无空态 | 加空态 + 清除筛选 |
| A11Y-01 | `global.css` | 全站缺 `:focus-visible` | 统一焦点环 |
| A11Y-02 | `ExplanationPanel.tsx` | 诊断解析无 `aria-live` | role=status + live |

> ES-02（Header 面包屑）与 ARCH-P1-01 同源，见 #9

### 3.4 内容·诊断题（18）

| ID | 现象 | GitHub |
|---|---|---|
| CONTENT-P1-SYS | 12 讲最长选项即正确 | #14 |
| CONTENT-P1-01~04 | cost-routing/maas/sla/permission 荒谬干扰项 | #15–#18 |
| CONTENT-P1-05 | ttft 多选题干直接映射 | #19 |
| CONTENT-P1-06 | token-cost-spike prefix 口径 | #20 |

### 3.5 内容·决策手册（2）

| ID | guideId | 现象 | 修复 |
|---|---|---|---|
| GUIDE-P1-01 | `multi-agent` | git/reviewed/src 仓库用语渗入 | 整段替换为企业 Agent 语境 |
| GUIDE-P1-02 | `agent-loop` | summary 循环顺序与正文矛盾 | 改为 Observe→Plan→Act→Check |

### 3.6 内容·场景+能力域（2）

| ID | scenarioId | 现象 | 修复 |
|---|---|---|---|
| SCEN-P1-01 | `rag-answer-quality` | 11%/74% vs 9.5%/78% 两套数字 | 统一快照或补时间线 |
| SCEN-P1-02 | `token-cost-spike` | prefix 与权限边界混写 | 同 CONTENT-P1-06 / #20 |

### 3.7 内容·56讲+glossary（3）

| ID | conceptId/term | 现象 | 修复 |
|---|---|---|---|
| LESSON-P1-01 | `agents-md` | definition 被 fitDefinition 截断残句 | 豁免裁剪或重写 |
| LESSON-P1-02 | `positional-encoding` | pitfalls 第4条 ensureFour 重复 | 补独立第4条或豁免 |
| LESSON-P1-03 | glossary | embedding/rag/model-routing 无同名讲 | IA 标注或别名映射 |

---

## 4. P2 / P3 摘要

| 角度 | P2 要点 | P3 要点 |
|---|---|---|
| 架构 | byId 重复、导航 label 不一致、硬编码色（与 UI 重叠） | progress 分工注释、completeScenario 语义、883 行文件 |
| UI 视觉 | primary-hover、统计数字 serif→mono、spacing token | filters !important、selection token |
| UI 交互 | Esc 关闭搜索、aria-pressed、恢复基线确认、焦点管理 | copy live、confirm 组件化 |
| 诊断题 | token-roi/ai-native-org 口号化、ttft 多选标注 | sampling 术语、JSON 缩进 |
| 决策手册 | context-window 证据来源、kv-cache 30% 阈值、路由三讲差异 | 评审题扩至 4–5 条 |
| 场景+能力域 | 角色路径缺讲、DEV 票号泄漏、失败样本占比 | token-roi 域归属、路径≠全课表 |
| 56讲+glossary | 8 讲模板定义、Glossary 15/15 漂移、pitfalls 丢失 | Token 大小写、Glossary 自引用 |

完整明细见各子报告 §3–§6。

---

## 5. 跨角度关联（合并修复）

| 根因 | 涉及角度 | 合并动作 | GitHub |
|---|---|---|---|
| Header 面包屑缺失 | 架构 + UI 交互 | 一次修 Header.tsx | #9 |
| 告警/warning soft 色 | 架构 + UI 视觉 | tokens.css 一次收口 | #10, #12, #13 |
| token-cost-spike prefix | 诊断题 + 场景 | 改 nextStepRecommendations 一处 | #20 |
| multi-agent 语境错位 | 决策手册 + 56讲 M4 | 决策手册整段替换 | GUIDE-P1-01 |
| rag 指标不一致 | 场景演练 | 统一 baseline/facts/background | SCEN-P1-01 |

---

## 6. 修复优先级

### 6.1 封板前（P0 + 关键 P1）

1. **MO-01**：移动端 BottomNav 布局（P0 唯一阻断）
2. **ARCH-P1-01 / #9**：Header 面包屑
3. **UI-P1-01~04 / #10–#13**：告警 token 化
4. **CONTENT-P1-SYS / #14**：12 讲结构泄漏
5. **GUIDE-P1-01**：multi-agent 决策手册重写
6. **SCEN-P1-01**：rag 指标统一
7. **A11Y-01/02**：焦点环 + 诊断 aria-live
8. **ES-01**：场景筛选空态

### 6.2 下一轮 polish（P1 剩余 + P2）

- UI-P1-02 动画 token（~230 处，单开回合）
- CONTENT-P1-01~06 剩余、GUIDE-P1-02、LESSON-P1-01~03
- 角色路径补讲、Glossary 对齐正文

### 6.3 backlog（P3）

- 各角度 P3 批次见子报告

---

## 7. 校验命令快照

| 命令 | 结论 |
|---|---|
| `npm run typecheck` | PASS |
| `npm run validate:structure` | PASS |
| `npm run validate:published-content` | PASS |
| `npm run validate:terminology` | PASS |

---

## 8. 子报告索引

| 报告 | 状态 |
|---|---|
| [issue-tickets-architecture-20260628.md](./issue-tickets-architecture-20260628.md) | ✅ |
| [issue-tickets-uiux-visual-20260628.md](./issue-tickets-uiux-visual-20260628.md) | ✅ |
| [issue-tickets-uiux-interaction-20260628.md](./issue-tickets-uiux-interaction-20260628.md) | ✅ |
| [issue-tickets-content-diag-20260628.md](./issue-tickets-content-diag-20260628.md) | ✅ |
| [issue-tickets-content-guides-20260628.md](./issue-tickets-content-guides-20260628.md) | ✅ |
| [issue-tickets-content-scenarios-20260628.md](./issue-tickets-content-scenarios-20260628.md) | ✅ |
| [issue-tickets-content-lessons-20260628.md](./issue-tickets-content-lessons-20260628.md) | ✅ |

---

## 9. GitHub Issues

- **Issues 列表**：https://github.com/alanlau2012/AI-Learning-App/issues
- **合计**：**59 条** open audit issues（#8–#66，含 #3/#4 历史项）

### 9.1 第一轮 #8–#43（架构 + UI 视觉 + 诊断题）

| 本地 ID | GitHub |
|---|---|
| 聚合跟踪 | [#8](https://github.com/alanlau2012/AI-Learning-App/issues/8) |
| ARCH-P1-01 | [#9](https://github.com/alanlau2012/AI-Learning-App/issues/9) |
| UI-P1-01~04 | [#10](https://github.com/alanlau2012/AI-Learning-App/issues/10)–[#13](https://github.com/alanlau2012/AI-Learning-App/issues/13) |
| CONTENT-P1-SYS | [#14](https://github.com/alanlau2012/AI-Learning-App/issues/14) |
| CONTENT-P1-01~06 | [#15](https://github.com/alanlau2012/AI-Learning-App/issues/15)–[#20](https://github.com/alanlau2012/AI-Learning-App/issues/20) |
| ARCH-P2 / UI-P2 / CONTENT-P2/P3 | [#21](https://github.com/alanlau2012/AI-Learning-App/issues/21)–[#42](https://github.com/alanlau2012/AI-Learning-App/issues/42) |
| 补审跟踪（已关闭） | [#43](https://github.com/alanlau2012/AI-Learning-App/issues/43) |

脚本：[scripts/create-audit-github-issues.mjs](../scripts/create-audit-github-issues.mjs)

### 9.2 第二轮 #44–#66（UI 交互 + 决策手册 + 场景 + 56讲）

| 本地 ID | GitHub |
|---|---|
| MO-01 (P0) | [#44](https://github.com/alanlau2012/AI-Learning-App/issues/44) |
| ES-01 / A11Y-01 / A11Y-02 (P1) | [#45](https://github.com/alanlau2012/AI-Learning-App/issues/45)–[#47](https://github.com/alanlau2012/AI-Learning-App/issues/47) |
| UX P2 批次 | [#48](https://github.com/alanlau2012/AI-Learning-App/issues/48)–[#52](https://github.com/alanlau2012/AI-Learning-App/issues/52) |
| UX P3 批次 | [#53](https://github.com/alanlau2012/AI-Learning-App/issues/53) |
| GUIDE-P1-01 / GUIDE-P1-02 | [#54](https://github.com/alanlau2012/AI-Learning-App/issues/54)–[#55](https://github.com/alanlau2012/AI-Learning-App/issues/55) |
| GUIDE-P2 批次 | [#56](https://github.com/alanlau2012/AI-Learning-App/issues/56) |
| SCEN-P1-01 / SCEN-P1-02 | [#57](https://github.com/alanlau2012/AI-Learning-App/issues/57)–[#58](https://github.com/alanlau2012/AI-Learning-App/issues/58) |
| SCEN-P2 / SCEN-P3 批次 | [#59](https://github.com/alanlau2012/AI-Learning-App/issues/59)–[#60](https://github.com/alanlau2012/AI-Learning-App/issues/60) |
| LESSON-P1-01~03 | [#61](https://github.com/alanlau2012/AI-Learning-App/issues/61)–[#63](https://github.com/alanlau2012/AI-Learning-App/issues/63) |
| LESSON-P2 / LESSON-P3 批次 | [#64](https://github.com/alanlau2012/AI-Learning-App/issues/64)–[#65](https://github.com/alanlau2012/AI-Learning-App/issues/65) |
| 七角度完成跟踪 | [#66](https://github.com/alanlau2012/AI-Learning-App/issues/66) |

脚本：[scripts/create-audit-github-issues-round2.mjs](../scripts/create-audit-github-issues-round2.mjs)

---

## 10. Agent 清单

新建 [agents/architecture-code-audit-agent.md](../agents/architecture-code-audit-agent.md)（已写入 [agents/README.md](../agents/README.md) 第 10 行）。

---

**七角度聚合完成 · 2026-06-28**
