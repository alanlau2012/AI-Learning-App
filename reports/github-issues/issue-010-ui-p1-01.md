## 元信息
- **本地 ID**：UI-P1-01
- **优先级**：P1
- **角度**：UI 视觉
- **来源报告**：reports/issue-tickets-uiux-visual-20260628.md §3
- **GitHub**：#10
- **审计基线 commit**：9a11d694（2026-06-28）
- **完整 commit**：`9a11d6941c1886bb095b26f836e7ec2754999e81`

## 1. 现象描述

告警/提示软背景色（如 `#fff5e8`）在 OptionCard、ExplanationPanel、ProfilePage、ScenarioPage 等多处硬编码，tokens.css 无 `--color-warning-soft` 登记。

## 2. 影响与风险

违反 design.md / AGENTS.md §5.3 视觉唯一来源；全站调整告警色需改多处，易遗漏。

## 3. 复现步骤

1. 启动 dev server
2. 访问任意含诊断题的知识点，如 `/concepts/value-review-agent`
3. 提交错误答案，观察 ExplanationPanel 背景色
4. DevTools 检查 computed background-color

## 4. 期望行为 vs 实际行为

| 维度 | 期望 | 实际（审计时） |
|---|---|---|
| token（告警软底） | var(--color-warning-soft) | 硬编码 #fff5e8 等 |

## 5. 证据

### 5.1 截图（UI/UX 类必填）

![诊断解析区告警背景硬编码](https://raw.githubusercontent.com/alanlau2012/AI-Learning-App/main/output/qa/issues-20260628/issue-010-warning-soft-missing.png)


### 5.2 代码 / 内容证据

- `src/styles/tokens.css`
  > 无 --color-warning-soft 定义
- `src/components/quiz/ExplanationPanel.module.css:14`
  > background: #fff5e8
- `src/components/quiz/OptionCard.module.css:36`
  > 硬编码告警底

## 6. 根因定位

AGENTS.md §5.3 视觉唯一来源；告警 soft 色未 token 化。

## 7. 最小修复方向

tokens.css 新增 --color-warning-soft / --color-warning-border，全站替换硬编码。

## 8. 验收标准

- [ ] Grep 无 #fff5e8 等业务硬编码（或仅剩 tokens.css 定义）
- [ ] ExplanationPanel/OptionCard 使用 var(--color-warning-soft)

## 9. 关联 issue

- 同源 / 相关：#12、#13、#21、#22

## 10. 当前代码复核（2026-06-28 执行时填写）

**仍复现**：tokens.css 仍缺 warning-soft token（执行时需 Grep 复核）。

---
来源: v2 移交接手模板 | `docs/issue-handover-template.md` | 生成: `scripts/generate-github-issue-bodies.mjs`
