## 元信息
- **本地 ID**：UI-P2-01
- **优先级**：P2
- **角度**：UI 视觉
- **来源报告**：reports/issue-tickets-uiux-visual-20260628.md §4
- **GitHub**：#25
- **审计基线 commit**：9a11d694（2026-06-28）
- **完整 commit**：`9a11d6941c1886bb095b26f836e7ec2754999e81`

## 1. 现象描述

HomePage primaryBtn hover 使用 `#1838b8` 硬编码。

## 2. 影响与风险

主色 hover 无法 token 统一调整。

## 3. 复现步骤

1. 访问 `/`，hover 主按钮
2. DevTools 检查 hover 色

## 4. 期望行为 vs 实际行为

| 维度 | 期望 | 实际（审计时） |
|---|---|---|
| hover（色） | --color-primary-hover | #1838b8 |

## 5. 证据

### 5.1 截图（UI/UX 类必填）

![HomePage 主按钮 hover](https://raw.githubusercontent.com/alanlau2012/AI-Learning-App/main/output/qa/issues-20260628/issue-025-home-primary-hover.png)


### 5.2 代码 / 内容证据

- `HomePage.module.css`
  > #1838b8 hover

## 6. 根因定位

AGENTS.md §5.3

## 7. 最小修复方向

tokens.css 加 --color-primary-hover

## 8. 验收标准

- [ ] hover 使用 var

## 9. 关联 issue

- 同源 / 相关：无

## 10. 当前代码复核（2026-06-28 执行时填写）

**仍复现**。

---
来源: v2 移交接手模板 | `docs/issue-handover-template.md` | 生成: `scripts/generate-github-issue-bodies.mjs`
