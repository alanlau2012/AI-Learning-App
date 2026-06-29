# GitHub Issues 合理性复核（2026-06-28）

> 对 audit 批次 #8–#66 共 59 条 issue 的 v2 正文升级前二次校验  
> 正文草稿：`reports/github-issues/`  
> 模板：`docs/issue-handover-template.md`  
> 索引：`reports/issue-tickets-github-index.md`

---

## 1. 总体结论

| 维度 | 结论 |
|---|---|
| **问题本身是否合理** | **合理**。七份子报告证据充分；P0 MO-01、P1 诊断题结构泄漏、GUIDE multi-agent 语境、SCEN rag 指标等均属可观察、可验证问题。 |
| **原提单方式是否合理** | **不合理**。批量 issue（#53/#56/#59/#64/#65）原正文 1 句话不可执行；已通过 §5 子项 checklist 展开。 |
| **v2 正文可接手性** | **达标**。59 份草稿均含 10 节模板字段 + 复现步骤 + 验收标准。 |
| **审计后已变代码** | **3 条需在 §10 标注**：#9 Header 面包屑、#44 MO-01、#52 MO-02 当前代码已修复；验收改为「确认 PASS」。 |

**不建议删除/合并 GitHub 编号**（按用户要求保留 #8–#66）；以下仅文档级降级/关联建议。

---

## 2. 逐优先级抽样复核

### 2.1 P0（1 条）

| GitHub | 本地 ID | 可观察 | 可复现 | 验收清晰 | 当前复核 |
|---|---|---|---|---|---|
| #44 | MO-01 | ✅ 390×844 布局 | ✅ | ✅ | **已修复**（BottomNav fixed 全宽 + padding 80px） |

### 2.2 P1 架构/UI（9 条）

| GitHub | 可观察 | 可复现 | 截图 | 备注 |
|---|---|---|---|---|
| #9 | ✅ | ✅ | ✅ | **已修复**，保留 issue 供验收记录 |
| #10–#13 | ✅ | ✅ | ✅/代码 | 仍复现，与 #21/#22 互链 |
| #45–#47 | ✅ | ✅ | ✅ | ES-01 仍复现；A11Y 仍复现 |

### 2.3 P1 内容（18+6 条）

| 类别 | 代表 issue | 可观察 | 证据 |
|---|---|---|---|
| 诊断题 SYS | #14 | ✅ 选项长度 | demoConcepts + 截图 |
| 荒谬干扰项 | #15–#18 | ✅ ConceptPage | 截图 |
| 决策手册 | #54–#55 | ✅ 原文 | decisionGuides.ts + 截图 |
| 场景 | #57–#58 | ✅ metrics/prefix | scenarioExercises + 截图 |

### 2.4 批次 issue（5 条）

| GitHub | 展开子项数 | 可执行性 |
|---|---|---|
| #53 UX-P3 | 11 | ✅ checklist |
| #56 GUIDE-P2 | 4 | ✅ |
| #59 SCEN-P2 | 5 | ✅ |
| #64 LESSON-P2 | 4 | ✅ |
| #65 LESSON-P3 | 3 | ✅ |

---

## 3. 关联 issue 互链检查

| 根因 | 主 issue | 已互链 |
|---|---|---|
| Header 面包屑 | #9 | #45（ES 同源） |
| warning soft token | #10 | #12, #13, #21, #22 |
| token-cost-spike prefix | #20 | #58 |
| 场景筛选空态 | #45 | #9 |
| multi-agent 语境 | #54 | — |
| rag 指标 | #57 | #59 批次 |

**建议补链（已在 v2 正文 §9 覆盖）**：#14 ↔ #15–#18；#44 ↔ #52。

---

## 4. 降级/合并建议（仅文档，不删 issue）

| 建议 | 理由 |
|---|---|
| #43 可 close | 已由 #66 supersede；v2 正文已注明 |
| #21/#22 修复时合并到 #10/#12 | 同源 token，避免重复 PR |
| #58 与 #20 同一 PR | prefix 口径一处改 |
| UI-P1-02（#11）单开 polish 回合 | ~230 处，不宜与 #10 同 PR |

---

## 5. 截图证据覆盖

| 状态 | 数量 |
|---|---|
| 已采集 PNG | **27** 张（`output/qa/issues-20260628/`） |
| 纯代码/批次（无需截图） | **37** 条 |

优先 P0/P1 截图清单（计划 §Step 3）均已覆盖。

---

## 6. gh issue edit 前置检查

- [x] `reports/github-issues/` 59 份文件齐全（#8–#66）
- [x] `scripts/update-audit-github-issues.mjs` 就绪
- [x] 截图已落盘并纳入 git 跟踪路径
- [ ] 执行 `node scripts/update-audit-github-issues.mjs` 批量 edit

---

**复核完成 · 2026-06-28**
