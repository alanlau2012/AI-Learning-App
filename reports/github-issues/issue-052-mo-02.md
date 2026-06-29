## 元信息
- **本地 ID**：MO-02
- **优先级**：P2
- **角度**：UI 交互
- **来源报告**：reports/issue-tickets-uiux-interaction-20260628.md §3
- **GitHub**：#52
- **审计基线 commit**：9a11d694（2026-06-28）
- **完整 commit**：`9a11d6941c1886bb095b26f836e7ec2754999e81`

## 1. 现象描述

审计时主内容区 padding-bottom 24px < BottomNav 56px，内容可能被底栏遮挡。

## 2. 影响与风险

移动端底部内容可读性；与 MO-01 同源。

## 3. 复现步骤

1. 390×844
2. 滚动页底
3. 检查最后一行是否被 BottomNav 遮挡

## 4. 期望行为 vs 实际行为

| 维度 | 期望 | 实际（审计时） |
|---|---|---|
| padding（bottom） | ≥56px | 审计时 24px |

## 5. 证据

### 5.1 截图（UI/UX 类必填）

![内容区底部 padding](https://raw.githubusercontent.com/alanlau2012/AI-Learning-App/main/output/qa/issues-20260628/issue-052-content-padding-bottom.png)


### 5.2 代码 / 内容证据

- `AppShell.module.css:14-22`
  > 移动端 padding-bottom: 80px（当前）

## 6. 根因定位

AppShell 移动 padding

## 7. 最小修复方向

content padding-bottom ≥ BottomNav 高度

## 8. 验收标准

- [ ] 页底内容不被遮挡

## 9. 关联 issue

- 同源 / 相关：#44

## 10. 当前代码复核（2026-06-28 执行时填写）

**已修复**：当前 @media max-width 960px padding-bottom: 80px。

---
来源: v2 移交接手模板 | `docs/issue-handover-template.md` | 生成: `scripts/generate-github-issue-bodies.mjs`
