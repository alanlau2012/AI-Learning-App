## 元信息
- **本地 ID**：UI-P2-04
- **优先级**：P2
- **角度**：UI 视觉
- **来源报告**：reports/issue-tickets-uiux-visual-20260628.md §4
- **GitHub**：#28
- **审计基线 commit**：9a11d694（2026-06-28）
- **完整 commit**：`9a11d6941c1886bb095b26f836e7ec2754999e81`

## 1. 现象描述

OptionCard/ExplanationPanel/DecisionGuideSection 边框使用 rgba 硬编码。

## 2. 影响与风险

边框色无法随 token 调整。

## 3. 复现步骤

1. Grep rgba 于 quiz/concept 组件 CSS

## 4. 期望行为 vs 实际行为

| 维度 | 期望 | 实际（审计时） |
|---|---|---|
| border（色） | var(--color-border) | rgba 硬编码 |

## 5. 证据

### 5.1 截图（UI/UX 类必填）

_本 issue 以代码/原文证据为主，无 UI 截图要求。_


### 5.2 代码 / 内容证据

- Grep：OptionCard/ExplanationPanel rgba border

## 6. 根因定位

AGENTS.md §5.3

## 7. 最小修复方向

随 border token 收口

## 8. 验收标准

- [ ] 边框使用 token

## 9. 关联 issue

- 同源 / 相关：#10

## 10. 当前代码复核（2026-06-28 执行时填写）

**仍复现**。

---
来源: v2 移交接手模板 | `docs/issue-handover-template.md` | 生成: `scripts/generate-github-issue-bodies.mjs`
