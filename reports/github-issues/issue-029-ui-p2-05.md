## 元信息
- **本地 ID**：UI-P2-05
- **优先级**：P2
- **角度**：UI 视觉
- **来源报告**：reports/issue-tickets-uiux-visual-20260628.md §4
- **GitHub**：#29
- **审计基线 commit**：9a11d694（2026-06-28）
- **完整 commit**：`9a11d6941c1886bb095b26f836e7ec2754999e81`

## 1. 现象描述

ScenarioPage optionActive 使用 box-shadow 表达选中，与 border 优先风格不一致。

## 2. 影响与风险

轻微视觉不一致；可选 polish。

## 3. 复现步骤

1. ScenarioPage 选择策略选项
2. 观察选中态 shadow

## 4. 期望行为 vs 实际行为

| 维度 | 期望 | 实际（审计时） |
|---|---|---|
| 选中（样式） | border 优先 | box-shadow |

## 5. 证据

### 5.1 截图（UI/UX 类必填）

![ScenarioPage 选项选中 shadow](https://raw.githubusercontent.com/alanlau2012/AI-Learning-App/main/output/qa/issues-20260628/issue-029-scenario-option-active.png)


### 5.2 代码 / 内容证据

- `ScenarioPage.module.css`
  > optionActive box-shadow

## 6. 根因定位

design.md 弱阴影原则

## 7. 最小修复方向

可改 border 表达选中（可选）

## 8. 验收标准

- [ ] 选中态与全站 chip 一致

## 9. 关联 issue

- 同源 / 相关：无

## 10. 当前代码复核（2026-06-28 执行时填写）

**仍复现**（低优先级）。

---
来源: v2 移交接手模板 | `docs/issue-handover-template.md` | 生成: `scripts/generate-github-issue-bodies.mjs`
