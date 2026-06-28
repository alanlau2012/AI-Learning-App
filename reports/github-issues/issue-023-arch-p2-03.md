## 元信息
- **本地 ID**：ARCH-P2-03
- **优先级**：P2
- **角度**：架构
- **来源报告**：reports/issue-tickets-architecture-20260628.md §4.5
- **GitHub**：#23
- **审计基线 commit**：9a11d694（2026-06-28）
- **完整 commit**：`9a11d6941c1886bb095b26f836e7ec2754999e81`

## 1. 现象描述

Sidebar 与 BottomNav 导航 label 不一致（「场景演练」vs「场景」）且顺序不同。

## 2. 影响与风险

桌面/移动切换时认知割裂。

## 3. 复现步骤

1. 1440×900 观察 Sidebar 顺序与文案
2. 390×844 观察 BottomNav 顺序与文案

## 4. 期望行为 vs 实际行为

| 维度 | 期望 | 实际（审计时） |
|---|---|---|
| label（场景入口） | 统一「场景演练」 | BottomNav 为「场景」 |
| 顺序（nav） | 一致 | Sidebar vs BottomNav 不同 |

## 5. 证据

### 5.1 截图（UI/UX 类必填）

_本 issue 以代码/原文证据为主，无 UI 截图要求。_


### 5.2 代码 / 内容证据

- `BottomNav.tsx vs Sidebar.tsx`
  > nav 常量未共享

## 6. 根因定位

AGENTS.md §3 layout 一致性

## 7. 最小修复方向

抽出统一 nav 常量，桌面/移动共用 label 与顺序。

## 8. 验收标准

- [ ] label 一致
- [ ] 顺序一致或文档说明差异原因

## 9. 关联 issue

- 同源 / 相关：无

## 10. 当前代码复核（2026-06-28 执行时填写）

**仍复现**：需对比两文件 nav 定义。

---
来源: v2 移交接手模板 | `docs/issue-handover-template.md` | 生成: `scripts/generate-github-issue-bodies.mjs`
