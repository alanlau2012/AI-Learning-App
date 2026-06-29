## 元信息
- **本地 ID**：UI-P2-03
- **优先级**：P2
- **角度**：UI 视觉
- **来源报告**：reports/issue-tickets-uiux-visual-20260628.md §4
- **GitHub**：#27
- **审计基线 commit**：9a11d694（2026-06-28）
- **完整 commit**：`9a11d6941c1886bb095b26f836e7ec2754999e81`

## 1. 现象描述

tokens.css 缺少 spacing scale（--space-*），各 module 使用魔法数字 padding/margin。

## 2. 影响与风险

间距无法全站统一缩放。

## 3. 复现步骤

1. 阅读 tokens.css
2. 对比各 page module padding 值

## 4. 期望行为 vs 实际行为

| 维度 | 期望 | 实际（审计时） |
|---|---|---|
| spacing（来源） | --space-* token | 分散魔法数字 |

## 5. 证据

### 5.1 截图（UI/UX 类必填）

_本 issue 以代码/原文证据为主，无 UI 截图要求。_


### 5.2 代码 / 内容证据

- `tokens.css`
  > 无 --space-* 定义

## 6. 根因定位

design.md 间距体系未 token 化

## 7. 最小修复方向

增补 --space-1..8 token 并逐步替换

## 8. 验收标准

- [ ] tokens 含 spacing scale

## 9. 关联 issue

- 同源 / 相关：无

## 10. 当前代码复核（2026-06-28 执行时填写）

**仍复现**。

---
来源: v2 移交接手模板 | `docs/issue-handover-template.md` | 生成: `scripts/generate-github-issue-bodies.mjs`
