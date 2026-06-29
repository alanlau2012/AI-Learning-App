## 元信息
- **本地 ID**：UI-P3-01
- **优先级**：P3
- **角度**：UI 视觉
- **来源报告**：reports/issue-tickets-uiux-visual-20260628.md §5
- **GitHub**：#39
- **审计基线 commit**：9a11d694（2026-06-28）
- **完整 commit**：`9a11d6941c1886bb095b26f836e7ec2754999e81`

## 1. 现象描述

ScenariosPage filters 使用 !important 提高特异性。

## 2. 影响与风险

CSS 可维护性；不影响功能。

## 3. 复现步骤

1. Grep !important ScenariosPage.module.css

## 4. 期望行为 vs 实际行为

| 维度 | 期望 | 实际（审计时） |
|---|---|---|
| CSS（特异性） | 无 !important | filters 使用 !important |

## 5. 证据

### 5.1 截图（UI/UX 类必填）

_本 issue 以代码/原文证据为主，无 UI 截图要求。_


### 5.2 代码 / 内容证据

- Grep：ScenariosPage filters !important

## 6. 根因定位

CSS 写法

## 7. 最小修复方向

提高 selector 特异性替代 !important

## 8. 验收标准

- [ ] 无 !important 或注释说明

## 9. 关联 issue

- 同源 / 相关：无

## 10. 当前代码复核（2026-06-28 执行时填写）

**仍复现**。

---
来源: v2 移交接手模板 | `docs/issue-handover-template.md` | 生成: `scripts/generate-github-issue-bodies.mjs`
